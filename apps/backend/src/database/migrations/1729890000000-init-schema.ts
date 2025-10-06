import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitSchema1729890000000 implements MigrationInterface {
    name = 'InitSchema1729890000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "events" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT NOT NULL,
        "event_date" TIMESTAMP NOT NULL,
        "venue" VARCHAR(255) NOT NULL,
        "total_seats" INT NOT NULL,
        "booked_seats" INT NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)

        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "bookings" (
        "id" SERIAL PRIMARY KEY,
        "event_id" INT NOT NULL REFERENCES "events" ("id") ON DELETE CASCADE,
        "user_id" VARCHAR(255) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "UQ_bookings_event_user" UNIQUE ("event_id", "user_id")
      );
    `)

        await queryRunner.query(`
      CREATE OR REPLACE FUNCTION reserve_event_seat(p_event_id INT, p_user_id TEXT)
      RETURNS TABLE(
        booking_id INT,
        event_id INT,
        user_id TEXT,
        seats_remaining INT,
        total_seats INT,
        was_created BOOLEAN
      )
      LANGUAGE plpgsql
      AS $$
      DECLARE
        v_event events%ROWTYPE;
        v_booking_id INT;
        v_remaining INT;
      BEGIN
        SELECT * INTO v_event FROM events WHERE id = p_event_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'EVENT_NOT_FOUND';
        END IF;

        SELECT id INTO v_booking_id FROM bookings WHERE event_id = p_event_id AND user_id = p_user_id;
        IF FOUND THEN
          v_remaining := v_event.total_seats - v_event.booked_seats;
          RETURN QUERY SELECT v_booking_id, p_event_id, p_user_id, v_remaining, v_event.total_seats, FALSE;
          RETURN;
        END IF;

        IF v_event.booked_seats + 1 > v_event.total_seats THEN
          RAISE EXCEPTION 'NO_SEATS_AVAILABLE';
        END IF;

        INSERT INTO bookings(event_id, user_id)
        VALUES (p_event_id, p_user_id)
        RETURNING id INTO v_booking_id;

        UPDATE events
        SET booked_seats = booked_seats + 1,
            updated_at = NOW()
        WHERE id = p_event_id;

        v_remaining := v_event.total_seats - (v_event.booked_seats + 1);

        RETURN QUERY SELECT v_booking_id, p_event_id, p_user_id, v_remaining, v_event.total_seats, TRUE;
      END;
      $$;
    `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP FUNCTION IF EXISTS reserve_event_seat(integer, text);')
        await queryRunner.query('DROP TABLE IF EXISTS "bookings";')
        await queryRunner.query('DROP TABLE IF EXISTS "events";')
    }
}
