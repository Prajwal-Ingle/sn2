"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

const speedData = [
  { time: "00:00", speed: 45, limit: 50 },
  { time: "02:00", speed: 62, limit: 60 },
  { time: "04:00", speed: 58, limit: 60 },
  { time: "06:00", speed: 75, limit: 70 },
  { time: "08:00", speed: 68, limit: 70 },
  { time: "10:00", speed: 52, limit: 50 },
  { time: "12:00", speed: 48, limit: 50 },
]

const violationData = [
  { month: "Jan", speeding: 2, parking: 1, signal: 0 },
  { month: "Feb", speeding: 1, parking: 2, signal: 1 },
  { month: "Mar", speeding: 3, parking: 0, signal: 2 },
  { month: "Apr", speeding: 0, parking: 1, signal: 0 },
  { month: "May", speeding: 2, parking: 3, signal: 1 },
  { month: "Jun", speeding: 1, parking: 0, signal: 0 },
]

const safetyMetrics = [
  { subject: "Speed Control", A: 85, fullMark: 100 },
  { subject: "Traffic Rules", A: 92, fullMark: 100 },
  { subject: "Document Compliance", A: 98, fullMark: 100 },
  { subject: "Vehicle Maintenance", A: 88, fullMark: 100 },
  { subject: "Defensive Driving", A: 90, fullMark: 100 },
  { subject: "Emergency Response", A: 82, fullMark: 100 },
]

const riskDistribution = [
  { name: "Low Risk", value: 65, color: "#10b981" },
  { name: "Medium Risk", value: 25, color: "#f59e0b" },
  { name: "High Risk", value: 10, color: "#ef4444" },
]

const drivingPatterns = [
  { day: "Mon", city: 45, highway: 25, rural: 10 },
  { day: "Tue", city: 52, highway: 30, rural: 8 },
  { day: "Wed", city: 48, highway: 35, rural: 12 },
  { day: "Thu", city: 61, highway: 28, rural: 15 },
  { day: "Fri", city: 55, highway: 40, rural: 20 },
  { day: "Sat", city: 35, highway: 50, rural: 25 },
  { day: "Sun", city: 28, highway: 45, rural: 30 },
]

export function AdvancedCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Speed Compliance Chart */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Speed Compliance Analysis</CardTitle>
          <CardDescription>Real-time speed vs speed limits</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={speedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="speed" stroke="#3b82f6" strokeWidth={3} name="Actual Speed" />
              <Line
                type="monotone"
                dataKey="limit"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Speed Limit"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Violation Trends */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Violation Trends</CardTitle>
          <CardDescription>Monthly violation breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={violationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="speeding"
                stackId="1"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.6}
                name="Speeding"
              />
              <Area
                type="monotone"
                dataKey="parking"
                stackId="1"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.6}
                name="Parking"
              />
              <Area
                type="monotone"
                dataKey="signal"
                stackId="1"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
                name="Signal"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Safety Radar Chart */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Safety Performance Radar</CardTitle>
          <CardDescription>Multi-dimensional safety analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={safetyMetrics}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              />
              <Radar
                name="Safety Score"
                dataKey="A"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Risk Distribution */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Risk Distribution</CardTitle>
          <CardDescription>Driver risk categorization</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Driving Patterns - Full Width */}
      <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Weekly Driving Patterns</CardTitle>
          <CardDescription>Driving time distribution across different road types</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={drivingPatterns}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="city" stackId="a" fill="#3b82f6" name="City Driving" />
              <Bar dataKey="highway" stackId="a" fill="#10b981" name="Highway Driving" />
              <Bar dataKey="rural" stackId="a" fill="#f59e0b" name="Rural Driving" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
