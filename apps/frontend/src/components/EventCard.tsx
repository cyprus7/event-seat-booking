interface EventCardProps {
    title: string
    description: string
    date: string
    venue: string
    availableSeats: number
}

export default function EventCard({
    title,
    description,
    date,
    venue,
    availableSeats,
}: EventCardProps) {
    return (
        <div className="border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 mb-4">{description}</p>
            <div className="space-y-2">
                <p className="text-sm">
                    <span className="font-medium">Date:</span> {date}
                </p>
                <p className="text-sm">
                    <span className="font-medium">Venue:</span> {venue}
                </p>
                <p className="text-sm">
                    <span className="font-medium">Available Seats:</span> {availableSeats}
                </p>
            </div>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                Book Now
            </button>
        </div>
    )
}
