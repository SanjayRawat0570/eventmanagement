"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Search, Filter, Mail, Phone, CheckCircle, XCircle, Clock, UserCheck, Users } from "lucide-react"

interface Attendee {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  status: "registered" | "confirmed" | "cancelled" | "checked-in"
  registeredAt: string
  checkedInAt?: string
  dietaryRestrictions?: string
}

interface AttendeeManagementProps {
  eventId: string
  eventTitle: string
}

// Mock attendee data
const mockAttendees: Attendee[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+1-555-0101",
    company: "Tech Corp",
    status: "confirmed",
    registeredAt: "2024-02-15T10:30:00Z",
    dietaryRestrictions: "Vegetarian",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "+1-555-0102",
    company: "Innovation Inc",
    status: "registered",
    registeredAt: "2024-02-16T14:20:00Z",
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol@example.com",
    phone: "+1-555-0103",
    company: "StartupXYZ",
    status: "checked-in",
    registeredAt: "2024-02-14T09:15:00Z",
    checkedInAt: "2024-03-15T08:45:00Z",
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david@example.com",
    phone: "+1-555-0104",
    status: "cancelled",
    registeredAt: "2024-02-13T16:45:00Z",
  },
  {
    id: "5",
    name: "Eva Brown",
    email: "eva@example.com",
    company: "Design Studio",
    status: "confirmed",
    registeredAt: "2024-02-17T11:30:00Z",
    dietaryRestrictions: "Gluten-free",
  },
]

export function AttendeeManagement({ eventId, eventTitle }: AttendeeManagementProps) {
  const [attendees, setAttendees] = useState<Attendee[]>(mockAttendees)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([])

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch =
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.company?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || attendee.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: Attendee["status"]) => {
    const variants = {
      registered: { variant: "secondary" as const, icon: Clock },
      confirmed: { variant: "default" as const, icon: CheckCircle },
      cancelled: { variant: "destructive" as const, icon: XCircle },
      "checked-in": { variant: "default" as const, icon: UserCheck },
    }

    const { variant, icon: Icon } = variants[status]

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.replace("-", " ")}
      </Badge>
    )
  }

  const handleStatusChange = (attendeeId: string, newStatus: Attendee["status"]) => {
    setAttendees((prev) =>
      prev.map((attendee) =>
        attendee.id === attendeeId
          ? {
              ...attendee,
              status: newStatus,
              checkedInAt: newStatus === "checked-in" ? new Date().toISOString() : attendee.checkedInAt,
            }
          : attendee,
      ),
    )
  }

  const handleBulkCheckIn = () => {
    setAttendees((prev) =>
      prev.map((attendee) =>
        selectedAttendees.includes(attendee.id) && attendee.status !== "cancelled"
          ? { ...attendee, status: "checked-in" as const, checkedInAt: new Date().toISOString() }
          : attendee,
      ),
    )
    setSelectedAttendees([])
  }

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Company",
      "Status",
      "Registered At",
      "Checked In At",
      "Dietary Restrictions",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredAttendees.map((attendee) =>
        [
          `"${attendee.name}"`,
          `"${attendee.email}"`,
          `"${attendee.phone || ""}"`,
          `"${attendee.company || ""}"`,
          `"${attendee.status}"`,
          `"${new Date(attendee.registeredAt).toLocaleString()}"`,
          `"${attendee.checkedInAt ? new Date(attendee.checkedInAt).toLocaleString() : ""}"`,
          `"${attendee.dietaryRestrictions || ""}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${eventTitle.replace(/\s+/g, "_")}_attendees.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const stats = {
    total: attendees.length,
    confirmed: attendees.filter((a) => a.status === "confirmed").length,
    checkedIn: attendees.filter((a) => a.status === "checked-in").length,
    cancelled: attendees.filter((a) => a.status === "cancelled").length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Checked In</p>
                <p className="text-2xl font-bold text-blue-600">{stats.checkedIn}</p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search attendees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="registered">Registered</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="checked-in">Checked In</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          {selectedAttendees.length > 0 && (
            <Button onClick={handleBulkCheckIn} variant="outline">
              <UserCheck className="h-4 w-4 mr-2" />
              Check In Selected ({selectedAttendees.length})
            </Button>
          )}

          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Attendees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendees ({filteredAttendees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedAttendees.length === filteredAttendees.length && filteredAttendees.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAttendees(filteredAttendees.map((a) => a.id))
                      } else {
                        setSelectedAttendees([])
                      }
                    }}
                    className="rounded"
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendees.map((attendee) => (
                <TableRow key={attendee.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedAttendees.includes(attendee.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAttendees((prev) => [...prev, attendee.id])
                        } else {
                          setSelectedAttendees((prev) => prev.filter((id) => id !== attendee.id))
                        }
                      }}
                      className="rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{attendee.name}</p>
                      {attendee.dietaryRestrictions && (
                        <p className="text-xs text-muted-foreground">Dietary: {attendee.dietaryRestrictions}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {attendee.email}
                      </div>
                      {attendee.phone && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {attendee.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{attendee.company || "-"}</TableCell>
                  <TableCell>{getStatusBadge(attendee.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{new Date(attendee.registeredAt).toLocaleDateString()}</p>
                      {attendee.checkedInAt && (
                        <p className="text-muted-foreground">
                          Checked in: {new Date(attendee.checkedInAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={attendee.status}
                      onValueChange={(value: Attendee["status"]) => handleStatusChange(attendee.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="registered">Registered</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="checked-in">Checked In</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredAttendees.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No attendees found matching your criteria.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
