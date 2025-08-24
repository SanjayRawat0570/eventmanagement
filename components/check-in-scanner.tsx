"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { QrCode, Search, UserCheck, AlertCircle, CheckCircle } from "lucide-react"

interface CheckInScannerProps {
  eventId: string
  eventTitle: string
}

interface CheckInResult {
  success: boolean
  attendee?: {
    name: string
    email: string
    status: string
  }
  message: string
}

export function CheckInScanner({ eventId, eventTitle }: CheckInScannerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [checkInResult, setCheckInResult] = useState<CheckInResult | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleCheckIn = async (identifier: string) => {
    // Simulate API call for check-in
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock check-in logic
    const mockAttendees = [
      { name: "Alice Johnson", email: "alice@example.com", status: "confirmed" },
      { name: "Bob Smith", email: "bob@example.com", status: "registered" },
      { name: "Carol Davis", email: "carol@example.com", status: "checked-in" },
    ]

    const attendee = mockAttendees.find(
      (a) =>
        a.email.toLowerCase().includes(identifier.toLowerCase()) ||
        a.name.toLowerCase().includes(identifier.toLowerCase()),
    )

    if (!attendee) {
      setCheckInResult({
        success: false,
        message: "Attendee not found. Please check the email or name.",
      })
      return
    }

    if (attendee.status === "checked-in") {
      setCheckInResult({
        success: false,
        attendee,
        message: "This attendee has already been checked in.",
      })
      return
    }

    if (attendee.status === "cancelled") {
      setCheckInResult({
        success: false,
        attendee,
        message: "This attendee's registration has been cancelled.",
      })
      return
    }

    // Successful check-in
    setCheckInResult({
      success: true,
      attendee: { ...attendee, status: "checked-in" },
      message: "Successfully checked in!",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      handleCheckIn(searchTerm.trim())
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <UserCheck className="h-4 w-4" />
          Check-In Scanner
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Event Check-In</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{eventTitle}</CardTitle>
              <CardDescription>Check in attendees by email or name</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Email or Name</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Enter attendee email or name"
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Check In Attendee
                </Button>
              </form>

              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full bg-transparent" disabled>
                  <QrCode className="h-4 w-4 mr-2" />
                  QR Code Scanner (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>

          {checkInResult && (
            <Card className={checkInResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  {checkInResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium ${checkInResult.success ? "text-green-800" : "text-red-800"}`}>
                      {checkInResult.message}
                    </p>
                    {checkInResult.attendee && (
                      <div className="mt-2 space-y-1">
                        <p className="text-sm font-medium">{checkInResult.attendee.name}</p>
                        <p className="text-sm text-gray-600">{checkInResult.attendee.email}</p>
                        <Badge variant={checkInResult.success ? "default" : "secondary"}>
                          {checkInResult.attendee.status}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
