'use client'

import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
    AdminEvent,
    CreateAdminEventPayload,
    createAdminEvent,
    fetchAdminEvents,
} from '@/services/admin/events-service'
import {
    AdminEventAttendees,
    fetchEventAttendees,
    subscribeToEventAttendees,
} from '@/services/admin/attendees-service'

const initialFormState: CreateAdminEventPayload & { eventDate: string } = {
    name: '',
    description: '',
    eventDate: '',
    venue: '',
    totalSeats: 0,
}

export default function AdminEventsPage() {
    const [events, setEvents] = useState<AdminEvent[]>([])
    const [attendees, setAttendees] = useState<AdminEventAttendees[]>([])
    const [eventsLoading, setEventsLoading] = useState(false)
    const [eventsError, setEventsError] = useState<string | null>(null)
    const [attendeesError, setAttendeesError] = useState<string | null>(null)
    const [formState, setFormState] = useState(initialFormState)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formMessage, setFormMessage] = useState<string | null>(null)

    const loadEvents = useCallback(async () => {
        setEventsLoading(true)
        setEventsError(null)
        try {
            const data = await fetchAdminEvents()
            setEvents(data)
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to load events'
            setEventsError(message)
        } finally {
            setEventsLoading(false)
        }
    }, [])

    const loadAttendees = useCallback(async () => {
        setAttendeesError(null)
        try {
            const data = await fetchEventAttendees()
            setAttendees(data)
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to load attendees'
            setAttendeesError(message)
        }
    }, [])

    useEffect(() => {
        void loadEvents()
        void loadAttendees()
        const unsubscribe = subscribeToEventAttendees((payload) => {
            setAttendees(payload)
        })
        return () => unsubscribe()
    }, [loadEvents, loadAttendees])

    const handleChange =
        (field: keyof CreateAdminEventPayload) =>
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const value = field === 'totalSeats' ? Number(event.target.value) : event.target.value
            setFormState((prev) => ({
                ...prev,
                [field]: value,
            }))
        }

    const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormState((prev) => ({
            ...prev,
            eventDate: event.target.value,
        }))
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitting(true)
        setFormMessage(null)
        try {
            await createAdminEvent({
                name: formState.name,
                description: formState.description,
                venue: formState.venue,
                totalSeats: Number(formState.totalSeats),
                eventDate: formState.eventDate
                    ? new Date(formState.eventDate).toISOString()
                    : new Date().toISOString(),
            })
            setFormMessage('Событие успешно создано')
            setFormState(initialFormState)
            await loadEvents()
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Не удалось создать событие'
            setFormMessage(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 p-6 sm:p-10">
            <div className="mx-auto flex max-w-5xl flex-col gap-6">
                <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">
                            Администрирование мероприятий
                        </h1>
                        <p className="text-sm text-gray-600">
                            Управляйте мероприятиями и отслеживайте посетителей в режиме реального
                            времени.
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                    >
                        Вернуться к пользователю
                    </Link>
                </header>

                <section className="rounded-lg bg-white p-4 shadow">
                    <h2 className="text-lg font-semibold text-gray-900">Добавить событие</h2>
                    <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
                        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                            Название
                            <input
                                value={formState.name}
                                onChange={handleChange('name')}
                                required
                                className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </label>
                        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                            Место проведения
                            <input
                                value={formState.venue}
                                onChange={handleChange('venue')}
                                required
                                className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </label>
                        <label className="sm:col-span-2 flex flex-col gap-1 text-sm font-medium text-gray-700">
                            Описание
                            <textarea
                                value={formState.description}
                                onChange={(event) =>
                                    setFormState((prev) => ({
                                        ...prev,
                                        description: event.target.value,
                                    }))
                                }
                                required
                                className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </label>
                        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                            Дата и время
                            <input
                                type="datetime-local"
                                value={formState.eventDate}
                                onChange={handleDateChange}
                                required
                                className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </label>
                        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                            Всего мест
                            <input
                                type="number"
                                min={1}
                                value={formState.totalSeats || ''}
                                onChange={handleChange('totalSeats')}
                                required
                                className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </label>
                        <div className="sm:col-span-2 flex flex-col gap-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow ${
                                    isSubmitting
                                        ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {isSubmitting ? 'Создание...' : 'Создать событие'}
                            </button>
                            {formMessage && <p className="text-sm text-gray-600">{formMessage}</p>}
                        </div>
                    </form>
                </section>

                <section className="rounded-lg bg-white p-4 shadow">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Список событий</h2>
                        <button
                            onClick={() => void loadEvents()}
                            className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
                        >
                            Обновить
                        </button>
                    </div>
                    {eventsLoading ? (
                        <p className="mt-4 text-sm text-gray-600">Загрузка событий...</p>
                    ) : eventsError ? (
                        <p className="mt-4 text-sm text-red-600">{eventsError}</p>
                    ) : events.length === 0 ? (
                        <p className="mt-4 text-sm text-gray-600">События не найдены</p>
                    ) : (
                        <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                            Событие
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                            Дата
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                            Площадка
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                            Занято / Всего
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {events.map((event) => {
                                        const eventDate = new Date(event.eventDate)
                                        return (
                                            <tr key={event.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    <div className="font-medium">{event.name}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {event.description}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    {eventDate.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    {event.venue}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    {event.totalSeats - event.availableSeats} /{' '}
                                                    {event.totalSeats}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <section className="rounded-lg bg-white p-4 shadow">
                    <h2 className="text-lg font-semibold text-gray-900">Посетители</h2>
                    {attendeesError && (
                        <p className="mt-3 text-sm text-red-600">{attendeesError}</p>
                    )}
                    {attendees.length === 0 ? (
                        <p className="mt-3 text-sm text-gray-600">
                            Пока нет зарегистрированных пользователей
                        </p>
                    ) : (
                        <div className="mt-3 space-y-4">
                            {attendees.map((group) => (
                                <div
                                    key={group.eventId}
                                    className="rounded-md border border-gray-200 p-4"
                                >
                                    <h3 className="text-md font-semibold text-gray-900">
                                        {group.eventName}
                                    </h3>
                                    <ul className="mt-2 space-y-1 text-sm text-gray-700">
                                        {group.attendees.map((attendee) => {
                                            const bookedAt = new Date(attendee.bookedAt)
                                            return (
                                                <li
                                                    key={`${group.eventId}-${attendee.userId}-${attendee.bookedAt}`}
                                                >
                                                    <span className="font-medium">
                                                        {attendee.userId}
                                                    </span>{' '}
                                                    — {bookedAt.toLocaleString()}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}
