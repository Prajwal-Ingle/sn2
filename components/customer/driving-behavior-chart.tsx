"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import type { DrivingBehavior } from "@/lib/types"
import { TrendingUp, BarChart3 } from "lucide-react"

interface DrivingBehaviorChartProps {
  data: DrivingBehavior[]
}

export function DrivingBehaviorChart({ data }: DrivingBehaviorChartProps) {
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    safetyScore: item.safetyScore,
    avgSpeed: item.avgSpeed,
    harshBraking: item.harshBraking,
    rapidAcceleration: item.rapidAcceleration,
    phoneUsage: item.phoneUsage,
  }))

  const behaviorData = [
    { name: "Harsh Braking", value: data.reduce((sum, d) => sum + d.harshBraking, 0) },
    { name: "Rapid Acceleration", value: data.reduce((sum, d) => sum + d.rapidAcceleration, 0) },
    { name: "Sharp Turns", value: data.reduce((sum, d) => sum + d.sharpTurns, 0) },
    { name: "Phone Usage", value: data.reduce((sum, d) => sum + d.phoneUsage, 0) },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Safety Score Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
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
            <BarChart3 className="h-5 w-5" />
            Driving Behavior Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={behaviorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
