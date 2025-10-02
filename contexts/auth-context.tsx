"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Customer, Admin } from "@/lib/types"
import { authenticateCustomer, authenticateAdmin, getCustomerById } from "@/lib/auth"

interface AuthContextType {
  isAuthenticated: boolean
  user: Customer | Admin | null
  userType: "customer" | "admin" | null
  login: (credentials: { email?: string; password?: string; passkey?: string }) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<Customer | Admin | null>(null)
  const [userType, setUserType] = useState<"customer" | "admin" | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session in localStorage
    const savedAuth = localStorage.getItem("safesynce_auth")
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth)
        if (authData.userType === "customer") {
          const customer = getCustomerById(authData.userId)
          if (customer) {
            setUser(customer)
            setUserType("customer")
            setIsAuthenticated(true)
          }
        } else if (authData.userType === "admin") {
          setUser(authData.user)
          setUserType("admin")
          setIsAuthenticated(true)
        }
      } catch (error) {
        localStorage.removeItem("safesynce_auth")
      }
    }
    setLoading(false)
  }, [])

  const login = async (credentials: { email?: string; password?: string; passkey?: string }): Promise<boolean> => {
    try {
      if (credentials.passkey) {
        // Admin login
        const admin = authenticateAdmin(credentials.passkey)
        if (admin) {
          setUser(admin)
          setUserType("admin")
          setIsAuthenticated(true)
          localStorage.setItem(
            "safesynce_auth",
            JSON.stringify({
              userId: admin.id,
              userType: "admin",
              user: admin,
            }),
          )
          return true
        }
      } else if (credentials.email && credentials.password) {
        // Customer login
        const customer = authenticateCustomer(credentials.email, credentials.password)
        if (customer) {
          setUser(customer)
          setUserType("customer")
          setIsAuthenticated(true)
          localStorage.setItem(
            "safesynce_auth",
            JSON.stringify({
              userId: customer.id,
              userType: "customer",
            }),
          )
          return true
        }
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setUserType(null)
    setIsAuthenticated(false)
    localStorage.removeItem("safesynce_auth")
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        userType,
        login,
        logout,
        loading,
      }}
    >
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
