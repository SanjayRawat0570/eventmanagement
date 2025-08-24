"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, CheckCircle, Calendar, Clock, MapPin } from "lucide-react"

// Mock event data (simplified)
const mockEvents = [
  {
    id: "1",
    title: "Tech Conference 2024",
    date: "2024-03-15",
    time: "09:00",
    location: "Convention Center, San Francisco",
  },
  {
    id: "2",
    title: "Product Launch Event",
    date: "2024-03-22",
    time: "18:00",
    location: "Grand Hotel, New York",
  },
]

export default function RSVPPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.eventId as string

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    dietaryRestrictions: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
  })

  const event = mockEvents.find((e) => e.id === eventId)

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <Link href="/events">
            <Button>Browse All Events</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and conditions")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                EventEase
              </Link>
            </div>
          </div>
        </header>

        {/* Success Message */}
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Registration Successful!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for registering for <strong>{event.title}</strong>. We've sent a confirmation email to{" "}
              {formData.email}.
            </p>

            <Card className="text-left mb-8">
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span>{event.location}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Please save this confirmation for your records. You'll need it for event check-in.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href={`/events/${eventId}`}>
                  <Button variant="outline">Back to Event</Button>
                </Link>
                <Link href="/events">
                  <Button>Browse More Events</Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

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
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href={`/events/${eventId}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Event Details
        </Link>

        <div className="space-y-6">
          {/* Event Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Register for Event</CardTitle>
              <CardDescription>{event.title}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  {event.time}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  {event.location}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>Please fill out the form below to complete your registration</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company/Organization</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Enter your company name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dietary">Dietary Restrictions or Special Requirements</Label>
                  <Textarea
                    id="dietary"
                    value={formData.dietaryRestrictions}
                    onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                    placeholder="Please let us know about any dietary restrictions or accessibility needs"
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the terms and conditions and privacy policy *
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="newsletter"
                      checked={formData.subscribeNewsletter}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, subscribeNewsletter: checked as boolean })
                      }
                    />
                    <Label htmlFor="newsletter" className="text-sm">
                      Subscribe to our newsletter for future event updates
                    </Label>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Registering..." : "Complete Registration"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
