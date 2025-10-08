'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { fetchEventsForUser, reserveEvent, UserEvent } from '@/services/events-service'

function detectDefaultUserId(): string {
    if (typeof window === 'undefined') {
        return ''
    }

    const navigatorInfo = window.navigator as Navigator & { userAgentData?: { platform?: string } }
    const candidate =
        navigatorInfo.userAgentData?.platform ||
        navigatorInfo.platform ||
        navigatorInfo.userAgent ||
        ''

    return candidate.replace(/\s+/g, '-').toLowerCase()
}

export default function HomePage() {
    const [userIdInput, setUserIdInput] = useState('')
    const [activeUserId, setActiveUserId] = useState('')
    const [events, setEvents] = useState<UserEvent[]>([])
    const [loadingEvents, setLoadingEvents] = useState(false)
    const [bookingEventId, setBookingEventId] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)

    useEffect(() => {
        const defaultId = detectDefaultUserId()
        setUserIdInput(defaultId)
        setActiveUserId(defaultId)
    }, [])

    const loadEvents = useCallback(async (userId: string) => {
        if (!userId) {
            setEvents([])
            return
        }

        setLoadingEvents(true)
        setError(null)
        try {
            const data = await fetchEventsForUser(userId)
            setEvents(data)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Неизвестная ошибка'
            setError(message)
        } finally {
            setLoadingEvents(false)
        }
    }, [])

    useEffect(() => {
        void loadEvents(activeUserId)
    }, [activeUserId, loadEvents])

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const trimmed = userIdInput.trim()
        setActiveUserId(trimmed)
        setMessage(null)
    }

    const handleReserve = async (eventId: number) => {
        if (!activeUserId) {
            setError('Введите идентификатор пользователя')
            return
        }

        setBookingEventId(eventId)
        setError(null)
        setMessage(null)
        try {
            const response = await reserveEvent(eventId, activeUserId)
            if (response.wasCreated) {
                setMessage('Бронирование подтверждено')
            } else {
                setMessage('Вы уже зарегистрированы на это мероприятие')
            }
            await loadEvents(activeUserId)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Не удалось забронировать место'
            setError(message)
        } finally {
            setBookingEventId(null)
        }
    }

    const userIdLabel = useMemo(() => activeUserId || '—', [activeUserId])

    return (
        <main className="min-h-screen bg-gray-50 p-6 sm:p-10">
            <div className="mx-auto flex max-w-4xl flex-col gap-6">
                <header className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-gray-900">Бронирование мероприятий</h1>
                    <p className="text-sm text-gray-600">
                        Укажите идентификатор пользователя, чтобы проверить доступные мероприятия и
                        забронировать места. Текущий идентификатор:{' '}
                        <span className="font-semibold">{userIdLabel}</span>
                    </p>
                </header>

                <section className="rounded-lg bg-white p-4 shadow">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-3 sm:flex-row sm:items-end"
                    >
                        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 sm:flex-1">
                            Идентификатор пользователя
                            <input
                                value={userIdInput}
                                onChange={(event) => setUserIdInput(event.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                placeholder="например, workstation-01"
                            />
                        </label>
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
                        >
                            Обновить список
                        </button>
                        <Link
                            href="/admin/events"
                            className="inline-flex items-center justify-center rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                        >
                            Панель администратора
                        </Link>
                    </form>
                </section>

                {message && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <section className="rounded-lg bg-white p-4 shadow">
                    <h2 className="text-lg font-semibold text-gray-900">Доступные мероприятия</h2>
                    {loadingEvents ? (
                        <p className="mt-4 text-sm text-gray-600">Загрузка мероприятий...</p>
                    ) : events.length === 0 ? (
                        <p className="mt-4 text-sm text-gray-600">Мероприятия не найдены</p>
                    ) : (
                        <ul className="mt-4 space-y-4">
                            {events.map((event) => {
                                const eventDate = new Date(event.eventDate)
                                const isDisabled =
                                    event.alreadyBooked || bookingEventId === event.id
                                return (
                                    <li
                                        key={event.id}
                                        className="rounded-md border border-gray-200 p-4 shadow-sm"
                                    >
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    {event.name}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {event.description}
                                                </p>
                                                <dl className="mt-3 space-y-1 text-sm text-gray-700">
                                                    <div className="flex gap-1">
                                                        <dt className="font-medium">Дата:</dt>
                                                        <dd>{eventDate.toLocaleString()}</dd>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <dt className="font-medium">Место:</dt>
                                                        <dd>{event.venue}</dd>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <dt className="font-medium">
                                                            Свободно мест:
                                                        </dt>
                                                        <dd>{event.availableSeats}</dd>
                                                    </div>
                                                </dl>
                                            </div>
                                            <button
                                                onClick={() => handleReserve(event.id)}
                                                disabled={isDisabled}
                                                className={`mt-3 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow sm:mt-0 ${
                                                    isDisabled
                                                        ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                                }`}
                                            >
                                                {event.alreadyBooked
                                                    ? 'Уже забронировано'
                                                    : bookingEventId === event.id
                                                      ? 'Обработка...'
                                                      : 'Забронировать'}
                                            </button>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    )
}
