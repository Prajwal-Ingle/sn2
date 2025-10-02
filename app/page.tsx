"use client"

import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { CustomerDashboard } from "@/components/customer/customer-dashboard"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { LandingPage } from "@/components/landing/landing-page"
import { Button } from "@/components/ui/button"
import { LogOut, Shield } from "lucide-react"
import { useState } from "react"

function HomePage() {
  const { user, userType, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <header className="premium-glass border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full instagram-gradient neon-glow">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold instagram-gradient-text">SafeSync</h1>
              <span className="ml-2 px-3 py-1 text-xs premium-glass rounded-full border border-white/20">
                {userType === "admin" ? "Admin Panel" : "Customer Dashboard"}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="border-white/20 hover:bg-white/5 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userType === "customer" ? <CustomerDashboard /> : <AdminDashboard />}
      </main>
    </div>
  )
}

function AuthenticatedApp() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  )
}

export default function Page() {
  const { user } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  if (!user && !showLogin) {
    return <LandingPage onGetStarted={() => setShowLogin(true)} />
  }

  if (!user && showLogin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthenticatedApp />
        </div>
      </div>
    )
  }

  return <AuthenticatedApp />
}
