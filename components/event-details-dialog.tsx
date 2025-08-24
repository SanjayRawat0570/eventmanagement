"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Users, Edit, Trash2 } from "lucide-react"
import { AttendeeManagement } from "@/components/attendee-management"

interface EventDetailsDialogProps {
  event: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (event: any) => void
  onDelete: (eventId: string) => void
}

export function EventDetailsDialog({ event, open, onOpenChange, onEdit, onDelete }: EventDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!event) return null

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      onDelete(event.id)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{event.title}</DialogTitle>
              <DialogDescription className="mt-2">{event.description || "No description provided"}</DialogDescription>
            </div>
            <Badge variant={event.status === "active" ? "default" : "secondary"}>{event.status}</Badge>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendees">Attendees</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {event.registered}/{event.capacity} registered
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Registration Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Registered</span>
                      <span>{event.registered}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{Math.round((event.registered / event.capacity) * 100)}% full</span>
                      <span>{event.capacity - event.registered} spots left</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendees" className="space-y-4">
            <AttendeeManagement eventId={event.id} eventTitle={event.title} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={() => onEdit(event)} className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Event
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete Event
                  </Button>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Event ID: {event.id}</p>
                  <p className="text-sm text-muted-foreground">Created: {new Date().toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
