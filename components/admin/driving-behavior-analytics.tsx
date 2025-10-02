"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { mockDrivingBehavior, mockCustomers } from "@/lib/mock-data"
import { Activity, TrendingDown, AlertTriangle, Shield } from "lucide-react"

export function DrivingBehaviorAnalytics() {
  // Aggregate behavior data
  const behaviorTrends = mockDrivingBehavior.map((behavior) => {
    const customer = mockCustomers.find((c) => c.id === behavior.customerId)
    return {
      date: new Date(behavior.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      safetyScore: behavior.safetyScore,
      avgSpeed: behavior.avgSpeed,
      harshBraking: behavior.harshBraking,
      rapidAcceleration: behavior.rapidAcceleration,
      phoneUsage: behavior.phoneUsage,
      customerName: customer?.name || "Unknown",
    }
  })

  // Risk factors summary
  const riskFactors = [
    {
      name: "Harsh Braking",
      value: mockDrivingBehavior.reduce((sum, d) => sum + d.harshBraking, 0),
      color: "#ef4444",
    },
    {
      name: "Rapid Acceleration",
      value: mockDrivingBehavior.reduce((sum, d) => sum + d.rapidAcceleration, 0),
      color: "#f59e0b",
    },
    {
      name: "Sharp Turns",
      value: mockDrivingBehavior.reduce((sum, d) => sum + d.sharpTurns, 0),
      color: "#8b5cf6",
    },
    {
      name: "Phone Usage",
      value: mockDrivingBehavior.reduce((sum, d) => sum + d.phoneUsage, 0),
      color: "#06b6d4",
    },
  ]

  // Speed analysis
  const speedData = mockDrivingBehavior.map((behavior) => ({
    customer: mockCustomers.find((c) => c.id === behavior.customerId)?.name || "Unknown",
    avgSpeed: behavior.avgSpeed,
    maxSpeed: behavior.maxSpeed,
    safetyScore: behavior.safetyScore,
  }))

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Safety Score</p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    mockDrivingBehavior.reduce((sum, d) => sum + d.safetyScore, 0) / mockDrivingBehavior.length,
                  )}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Speed</p>
                <p className="text-2xl font-bold">
                  {Math.round(mockDrivingBehavior.reduce((sum, d) => sum + d.avgSpeed, 0) / mockDrivingBehavior.length)}{" "}
                  km/h
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Risk Events</p>
                <p className="text-2xl font-bold">
                  {mockDrivingBehavior.reduce((sum, d) => sum + d.harshBraking + d.rapidAcceleration + d.sharpTurns, 0)}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Phone Usage</p>
                <p className="text-2xl font-bold">{mockDrivingBehavior.reduce((sum, d) => sum + d.phoneUsage, 0)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Safety Score Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={behaviorTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="safetyScore" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Factors Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskFactors}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Speed Analysis by Customer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={speedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="customer" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgSpeed" fill="#3b82f6" name="Avg Speed" />
                <Bar dataKey="maxSpeed" fill="#ef4444" name="Max Speed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
