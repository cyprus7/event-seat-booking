import Link from 'next/link'

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-5xl space-y-6">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">Event Seat Booking</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Welcome to the event seat booking system. Browse events, reserve seats, and
                        monitor utilization through the admin console.
                    </p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <Link
                        href="/admin/events"
                        className="inline-flex items-center rounded-md bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow hover:bg-blue-700"
                    >
                        Go to admin events
                    </Link>
                </div>
            </div>
        </main>
    )
}
