"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { mockCustomers, mockVehicles, mockChallans } from "@/lib/mock-data"
import { TrendingUp, Users, Car, AlertTriangle, Shield } from "lucide-react"

export function CompanyAnalytics() {
  // Safety score distribution
  const safetyScoreDistribution = [
    { name: "Excellent (90+)", value: mockCustomers.filter((c) => c.safetyScore >= 90).length, color: "#10b981" },
    {
      name: "Good (75-89)",
      value: mockCustomers.filter((c) => c.safetyScore >= 75 && c.safetyScore < 90).length,
      color: "#3b82f6",
    },
    {
      name: "Average (60-74)",
      value: mockCustomers.filter((c) => c.safetyScore >= 60 && c.safetyScore < 75).length,
      color: "#f59e0b",
    },
    { name: "Poor (<60)", value: mockCustomers.filter((c) => c.safetyScore < 60).length, color: "#ef4444" },
  ]

  // Vehicle type distribution
  const vehicleTypeData = [
    { name: "Cars", value: mockVehicles.filter((v) => v.vehicleType === "car").length },
    { name: "Motorcycles", value: mockVehicles.filter((v) => v.vehicleType === "motorcycle").length },
    { name: "Trucks", value: mockVehicles.filter((v) => v.vehicleType === "truck").length },
    { name: "Buses", value: mockVehicles.filter((v) => v.vehicleType === "bus").length },
  ]

  // Violation types
  const violationData = mockChallans.reduce(
    (acc, challan) => {
      const existing = acc.find((item) => item.name === challan.violationType)
      if (existing) {
        existing.value += 1
        existing.amount += challan.amount
      } else {
        acc.push({ name: challan.violationType, value: 1, amount: challan.amount })
      }
      return acc
    },
    [] as { name: string; value: number; amount: number }[],
  )

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold">{mockCustomers.length}</p>
                <p className="text-xs text-green-600">+12% this month</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fleet Size</p>
                <p className="text-2xl font-bold">{mockVehicles.length}</p>
                <p className="text-xs text-green-600">+8% this month</p>
              </div>
              <Car className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Violations</p>
                <p className="text-2xl font-bold">{mockChallans.length}</p>
                <p className="text-xs text-red-600">-5% this month</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Safety Score</p>
                <p className="text-2xl font-bold">
                  {Math.round(mockCustomers.reduce((sum, c) => sum + c.safetyScore, 0) / mockCustomers.length)}
                </p>
                <p className="text-xs text-green-600">+3% this month</p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Safety Score Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={safetyScoreDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {safetyScoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vehicleTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Violation Types Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={violationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [value, name === "value" ? "Count" : "Amount (₹)"]} />
                <Bar dataKey="value" fill="#f59e0b" />
                <Bar dataKey="amount" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
