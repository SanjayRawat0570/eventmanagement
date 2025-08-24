"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, MapPin, Clock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Dashboard from "@/components/dashboard"

export default function HomePage() {
  const { user, login, register } = useAuth()
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "event_owner" as "admin" | "staff" | "event_owner",
  })

  if (user) {
    return <Dashboard />
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login(loginForm.email, loginForm.password)
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    register(registerForm.name, registerForm.email, registerForm.password, registerForm.role)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Welcome to <span className="text-blue-600">EventEase</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              The complete event management platform for creating, managing, and tracking your events with ease.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Event Creation</h3>
                <p className="text-sm text-gray-600">Easy setup</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-900">RSVP Management</h3>
                <p className="text-sm text-gray-600">Track attendees</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <MapPin className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Venue Details</h3>
                <p className="text-sm text-gray-600">Location info</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Real-time Updates</h3>
                <p className="text-sm text-gray-600">Live tracking</p>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Forms */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Get Started</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </form>
                <div className="text-center text-sm text-gray-600">Demo: admin@eventease.com / password</div>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      placeholder="Enter your full name"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="Enter your email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Create a password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-role">Role</Label>
                    <select
                      id="register-role"
                      className="w-full p-2 border border-input rounded-md bg-background"
                      value={registerForm.role}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, role: e.target.value as "admin" | "staff" | "event_owner" })
                      }
                    >
                      <option value="event_owner">Event Owner</option>
                      <option value="staff">Staff Member</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
