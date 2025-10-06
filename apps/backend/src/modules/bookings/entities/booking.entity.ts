import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
} from 'typeorm'
import { Event } from '../../events/entities/event.entity'

@Entity('bookings')
@Unique(['eventId', 'userId'])
export class Booking {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'event_id', type: 'int' })
    eventId: number

    @ManyToOne(() => Event, (event) => event.bookings, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'event_id' })
    event: Event

    @Column({ name: 'user_id', type: 'varchar', length: 255 })
    userId: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date
}
