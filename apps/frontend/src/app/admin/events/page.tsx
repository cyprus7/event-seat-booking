import Link from 'next/link'
import { fetchAdminEvents } from '@/services/admin/events-service'

export const metadata = {
    title: 'Admin | Events',
}

export default async function AdminEventsPage() {
    let events: Awaited<ReturnType<typeof fetchAdminEvents>> = []
    let error: string | null = null

    try {
        events = await fetchAdminEvents()
    } catch (err) {
        error = err instanceof Error ? err.message : 'Unexpected error while loading events'
    }

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto flex max-w-5xl flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">Admin Events</h1>
                        <p className="text-sm text-gray-600">
                            Review upcoming events and track seat utilization in real time.
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
                    >
                        Back to site
                    </Link>
                </div>

                {error ? (
                    <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Event
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Venue
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Seats
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Saturation
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {events.map((event) => {
                                    const eventDate = new Date(event.eventDate)
                                    const saturation = event.totalSeats
                                        ? Math.round(
                                              ((event.totalSeats - event.availableSeats) /
                                                  event.totalSeats) *
                                                  100,
                                          )
                                        : 0

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
                                            <td className="px-4 py-3 text-sm font-semibold text-blue-600">
                                                {saturation}%
                                            </td>
                                        </tr>
                                    )
                                })}

                                {events.length === 0 && !error && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-6 text-center text-sm text-gray-600"
                                        >
                                            No events found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    )
}
