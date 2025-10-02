"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { Eye, EyeOff, Shield, User, Sparkles } from "lucide-react"

export function LoginForm() {
  const { login } = useAuth()
  const [customerCredentials, setCustomerCredentials] = useState({ email: "", password: "" })
  const [adminPasskey, setAdminPasskey] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showPasskey, setShowPasskey] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const success = await login({
      email: customerCredentials.email,
      password: customerCredentials.password,
    })

    if (!success) {
      setError("Invalid email or password")
    }
    setLoading(false)
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const success = await login({ passkey: adminPasskey })

    if (!success) {
      setError("Invalid passkey")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 animate-pulse"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <Card className="w-full max-w-md relative z-10 premium-glass border-white/20 shadow-2xl backdrop-blur-xl">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl instagram-gradient neon-glow">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold instagram-gradient-text text-glow mb-2">SafeSync</CardTitle>
          <CardDescription className="text-slate-300 text-lg">Sync Detect Protect</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="customer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-white/10 p-1 rounded-xl">
              <TabsTrigger
                value="customer"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg transition-all duration-300"
              >
                <User className="h-4 w-4" />
                Customer
              </TabsTrigger>
              <TabsTrigger
                value="admin"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg transition-all duration-300"
              >
                <Shield className="h-4 w-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="customer" className="space-y-6 mt-6">
              <form onSubmit={handleCustomerLogin} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-slate-200 font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={customerCredentials.email}
                    onChange={(e) => setCustomerCredentials((prev) => ({ ...prev, email: e.target.value }))}
                    className="bg-slate-800/50 border-white/20 text-white placeholder:text-slate-400 focus:border-pink-500 focus:ring-pink-500/20 h-12 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-slate-200 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={customerCredentials.password}
                      onChange={(e) => setCustomerCredentials((prev) => ({ ...prev, password: e.target.value }))}
                      className="bg-slate-800/50 border-white/20 text-white placeholder:text-slate-400 focus:border-pink-500 focus:ring-pink-500/20 h-12 rounded-xl pr-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 instagram-gradient hover:opacity-90 text-white font-semibold neon-glow rounded-xl transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="admin" className="space-y-6 mt-6">
              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="passkey" className="text-slate-200 font-medium">
                    Admin Passkey
                  </Label>
                  <div className="relative">
                    <Input
                      id="passkey"
                      type={showPasskey ? "text" : "password"}
                      placeholder="Enter admin passkey"
                      value={adminPasskey}
                      onChange={(e) => setAdminPasskey(e.target.value)}
                      className="bg-slate-800/50 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 h-12 rounded-xl pr-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-white"
                      onClick={() => setShowPasskey(!showPasskey)}
                    >
                      {showPasskey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 text-white font-semibold neon-glow-blue rounded-xl transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? "Accessing..." : "Access Admin Panel"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert className="mt-6 border-red-500/20 bg-red-500/10 backdrop-blur-sm">
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
