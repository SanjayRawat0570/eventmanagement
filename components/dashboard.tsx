"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Users, MapPin, Clock, Settings, LogOut, BarChart3, Eye } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { CreateEventDialog } from "@/components/create-event-dialog"
import { EventDetailsDialog } from "@/components/event-details-dialog"
import { CheckInScanner } from "@/components/check-in-scanner"

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [showEventDetails, setShowEventDetails] = useState(false)

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events")
        if (!res.ok) throw new Error("Failed to fetch events")
        const data = await res.json()
        setEvents(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchEvents()
  }, [])

  const activeEvents = events.filter((e) => e.status === "active")
  const totalRegistrations = events.reduce((sum, e) => sum + (e.registered || 0), 0)

  // Create new event
  const handleEventCreate = async (newEvent: any) => {
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      })
      if (!res.ok) throw new Error("Failed to create event")
      const savedEvent = await res.json()
      setEvents((prev) => [...prev, savedEvent])
    } catch (err) {
      console.error(err)
    }
  }

  // Delete event
  const handleEventDelete = async (eventId: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete event")
      setEvents((prev) => prev.filter((e) => e.id !== eventId))
    } catch (err) {
      console.error(err)
    }
  }

  const handleEventEdit = (event: any) => {
    // TODO: hook up to backend PUT
    setShowEventDetails(false)
    console.log("Edit event:", event)
  }

  const handleViewEvent = (event: any) => {
    setSelectedEvent(event)
    setShowEventDetails(true)
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator"
      case "staff":
        return "Staff Member"
      case "event_owner":
        return "Event Owner"
      default:
        return "User"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-blue-600">EventEase</h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {getRoleDisplayName(user?.role || "")}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
              <p className="text-xs text-muted-foreground">{activeEvents.length} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRegistrations}</div>
              <p className="text-xs text-muted-foreground">Across all events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.length > 0
                  ? Math.round((totalRegistrations / events.length) * 100) / 100
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">Registration rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeEvents.length}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Events</h2>
          <div className="flex gap-2">
            <CheckInScanner eventId="1" eventTitle="Event Check-In" />
            <CreateEventDialog onEventCreate={handleEventCreate} />
          </div>
        </div>

        {/* Events List */}
        <div className="grid gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </div>
                  <Badge variant={event.status === "active" ? "default" : "secondary"}>
                    {event.status || "active"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    {event.registered || 0}/{event.capacity} registered
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2 mr-4">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          event.capacity > 0
                            ? ((event.registered || 0) / event.capacity) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewEvent(event)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleViewEvent(event)}>
                      <Settings className="h-4 w-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Event Details Dialog */}
      <EventDetailsDialog
        event={selectedEvent}
        open={showEventDetails}
        onOpenChange={setShowEventDetails}
        onEdit={handleEventEdit}
        onDelete={handleEventDelete}
      />
    </div>
  )
}
