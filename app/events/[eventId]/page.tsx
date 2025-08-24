"use client"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, ArrowLeft, ExternalLink } from "lucide-react"

// Mock event data (same as in events listing)
const mockEvents = [
  {
    id: "1",
    title: "Tech Conference 2024",
    description:
      "Annual technology conference featuring the latest innovations in AI, web development, and cloud computing. Join industry leaders, developers, and tech enthusiasts for a day of learning, networking, and inspiration.",
    fullDescription:
      "This comprehensive conference will feature keynote speakers from major tech companies, hands-on workshops, and networking opportunities. Topics include artificial intelligence, machine learning, web development frameworks, cloud computing solutions, and emerging technologies. Perfect for developers, product managers, and tech entrepreneurs looking to stay ahead of the curve.",
    date: "2024-03-15",
    time: "09:00",
    endTime: "17:00",
    location: "Convention Center, San Francisco",
    address: "747 Howard St, San Francisco, CA 94103",
    capacity: 500,
    registered: 342,
    status: "active",
    category: "Technology",
    organizer: "Tech Events Inc.",
    price: "Free",
    agenda: [
      { time: "09:00", title: "Registration & Coffee" },
      { time: "10:00", title: "Opening Keynote: The Future of AI" },
      { time: "11:30", title: "Workshop: Building with Next.js 14" },
      { time: "13:00", title: "Lunch & Networking" },
      { time: "14:30", title: "Panel: Cloud Computing Trends" },
      { time: "16:00", title: "Closing Remarks & Prizes" },
    ],
  },
  {
    id: "2",
    title: "Product Launch Event",
    description: "Exclusive launch event for our new product line. Join us for demos, networking, and refreshments.",
    fullDescription:
      "Be among the first to experience our revolutionary new product line. This exclusive event will feature live demonstrations, Q&A sessions with our product team, and networking opportunities with industry professionals.",
    date: "2024-03-22",
    time: "18:00",
    endTime: "21:00",
    location: "Grand Hotel, New York",
    address: "2 E 55th St, New York, NY 10022",
    capacity: 200,
    registered: 156,
    status: "active",
    category: "Business",
    organizer: "Innovation Corp",
    price: "Free",
    agenda: [
      { time: "18:00", title: "Welcome Reception" },
      { time: "18:30", title: "Product Unveiling" },
      { time: "19:30", title: "Live Demonstrations" },
      { time: "20:30", title: "Networking & Refreshments" },
    ],
  },
]

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.eventId as string

  const event = mockEvents.find((e) => e.id === eventId)

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
          <Link href="/events">
            <Button>Browse All Events</Button>
          </Link>
        </div>
      </div>
    )
  }

  const spotsLeft = event.capacity - event.registered
  const isFullyBooked = spotsLeft <= 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              EventEase
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/events" className="text-gray-700 hover:text-blue-600">
                Browse Events
              </Link>
              <Link href="/" className="text-gray-700 hover:text-blue-600">
                Organizer Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/events" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary">{event.category}</Badge>
                <Badge variant="default">{event.price}</Badge>
                {isFullyBooked && <Badge variant="destructive">Fully Booked</Badge>}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
              <p className="text-lg text-gray-600">{event.description}</p>
            </div>

            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{new Date(event.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500">Event Date</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">
                        {event.time} - {event.endTime}
                      </p>
                      <p className="text-sm text-gray-500">Duration</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{event.location}</p>
                      <p className="text-sm text-gray-500">{event.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">
                        {event.registered}/{event.capacity} registered
                      </p>
                      <p className="text-sm text-gray-500">{spotsLeft} spots remaining</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Event */}
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{event.fullDescription}</p>
              </CardContent>
            </Card>

            {/* Agenda */}
            {event.agenda && (
              <Card>
                <CardHeader>
                  <CardTitle>Event Agenda</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {event.agenda.map((item, index) => (
                      <div key={index} className="flex gap-4 pb-3 border-b border-gray-100 last:border-0">
                        <div className="text-sm font-medium text-blue-600 min-w-[60px]">{item.time}</div>
                        <div className="text-sm text-gray-700">{item.title}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card>
              <CardHeader>
                <CardTitle>Register for Event</CardTitle>
                <CardDescription>
                  {isFullyBooked ? "This event is fully booked" : `${spotsLeft} spots remaining`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Registration Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Registration Progress</span>
                    <span>{Math.round((event.registered / event.capacity) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                    />
                  </div>
                </div>

                <Link href={`/events/${eventId}/rsvp`}>
                  <Button className="w-full" disabled={isFullyBooked}>
                    {isFullyBooked ? "Event Full" : "Register Now"}
                  </Button>
                </Link>

                <p className="text-xs text-gray-500 text-center">Registration is free and takes less than 2 minutes</p>
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Event Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-gray-900">{event.organizer}</p>
                <p className="text-sm text-gray-600 mt-2">Trusted event organizer with years of experience</p>
              </CardContent>
            </Card>

            {/* Share Event */}
            <Card>
              <CardHeader>
                <CardTitle>Share Event</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    alert("Event link copied to clipboard!")
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Copy Event Link
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
