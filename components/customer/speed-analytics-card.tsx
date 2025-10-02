"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gauge, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

interface SpeedAnalyticsCardProps {
  customerId: string
}

export function SpeedAnalyticsCard({ customerId }: SpeedAnalyticsCardProps) {
  // Mock speed data for the last 7 days
  const speedData = [
    { day: "Mon", avgSpeed: 42, maxSpeed: 75, speedLimit: 60 },
    { day: "Tue", avgSpeed: 38, maxSpeed: 65, speedLimit: 60 },
    { day: "Wed", avgSpeed: 45, maxSpeed: 80, speedLimit: 60 },
    { day: "Thu", avgSpeed: 35, maxSpeed: 60, speedLimit: 60 },
    { day: "Fri", avgSpeed: 48, maxSpeed: 85, speedLimit: 60 },
    { day: "Sat", avgSpeed: 32, maxSpeed: 55, speedLimit: 60 },
    { day: "Sun", avgSpeed: 40, maxSpeed: 70, speedLimit: 60 },
  ]

  const avgSpeedThisWeek = Math.round(speedData.reduce((sum, day) => sum + day.avgSpeed, 0) / speedData.length)
  const maxSpeedThisWeek = Math.max(...speedData.map((day) => day.maxSpeed))
  const speedViolations = speedData.filter((day) => day.maxSpeed > day.speedLimit).length

  return (
    <Card className="premium-card border-white/10 hover:neon-glow transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 neon-glow-orange">
              <Gauge className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Speed Analytics</CardTitle>
              <CardDescription>Weekly driving speed patterns</CardDescription>
            </div>
          </div>
          <Badge
            variant={speedViolations > 2 ? "destructive" : speedViolations > 0 ? "secondary" : "default"}
            className="premium-glass"
          >
            {speedViolations} violations
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Speed Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 premium-glass rounded-lg border-white/10">
            <div className="text-2xl font-bold instagram-gradient-text">{avgSpeedThisWeek}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-400" />
              Avg Speed
            </div>
          </div>
          <div className="text-center p-3 premium-glass rounded-lg border-white/10">
            <div className="text-2xl font-bold text-orange-400">{maxSpeedThisWeek}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <AlertTriangle className="h-3 w-3 text-orange-400" />
              Max Speed
            </div>
          </div>
          <div className="text-center p-3 premium-glass rounded-lg border-white/10">
            <div className="text-2xl font-bold text-red-400">{speedViolations}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <TrendingDown className="h-3 w-3 text-red-400" />
              Violations
            </div>
          </div>
        </div>

        {/* Speed Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={speedData}>
              <defs>
                <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="limitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  backdropFilter: "blur(10px)",
                }}
              />
              <Area
                type="monotone"
                dataKey="maxSpeed"
                stroke="#f97316"
                strokeWidth={2}
                fill="url(#speedGradient)"
                name="Max Speed"
              />
              <Line
                type="monotone"
                dataKey="speedLimit"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Speed Limit"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
