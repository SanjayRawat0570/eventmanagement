"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "staff" | "event_owner"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (
    name: string,
    email: string,
    password: string,
    role: "admin" | "staff" | "event_owner",
  ) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Restore user session from localStorage
    const storedUser = localStorage.getItem("eventease-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // 🔹 Login using /api/signin
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) return false

      const data = await res.json()
      if (data.user && data.token) {
        setUser(data.user)
        localStorage.setItem("eventease-user", JSON.stringify(data.user))
        localStorage.setItem("eventease-token", data.token)
        return true
      }
      return false
    } catch (err) {
      console.error("Login error:", err)
      return false
    }
  }

  // 🔹 Register using /api/signup
  const register = async (
    name: string,
    email: string,
    password: string,
    role: "admin" | "staff" | "event_owner",
  ): Promise<boolean> => {
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: name, email, password, role }),
      })

      if (!res.ok) return false

      const data = await res.json()
      if (data.user && data.token) {
        setUser(data.user)
        localStorage.setItem("eventease-user", JSON.stringify(data.user))
        localStorage.setItem("eventease-token", data.token)
        return true
      }
      return false
    } catch (err) {
      console.error("Signup error:", err)
      return false
    }
  }

  // 🔹 Logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem("eventease-user")
    localStorage.removeItem("eventease-token")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

