"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Clock, Route } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface RouteAnalyticsCardProps {
  customerId: string
}

export function RouteAnalyticsCard({ customerId }: RouteAnalyticsCardProps) {
  const routeData = [
    { route: "Home to Office", frequency: 35, avgTime: 45, distance: 18.5 },
    { route: "Office to Mall", frequency: 12, avgTime: 25, distance: 8.2 },
    { route: "Home to Airport", frequency: 8, avgTime: 65, distance: 32.1 },
    { route: "Mall to Home", frequency: 15, avgTime: 30, distance: 12.3 },
    { route: "Other Routes", frequency: 30, avgTime: 35, distance: 15.8 },
  ]

  const pieData = routeData.map((route, index) => ({
    name: route.route,
    value: route.frequency,
    color: ["#f97316", "#8b5cf6", "#06b6d4", "#10b981", "#ef4444"][index],
  }))

  const totalTrips = routeData.reduce((sum, route) => sum + route.frequency, 0)
  const avgTripTime = Math.round(routeData.reduce((sum, route) => sum + route.avgTime, 0) / routeData.length)
  const totalDistance = routeData.reduce((sum, route) => sum + route.distance, 0)

  return (
    <Card className="premium-card border-white/10 hover:neon-glow-purple transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 neon-glow-purple">
              <Route className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Route Analytics</CardTitle>
              <CardDescription>Most frequent driving routes</CardDescription>
            </div>
          </div>
          <Badge variant="default" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            {totalTrips} trips
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Route Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 premium-glass rounded-lg border-white/10">
            <div className="text-2xl font-bold instagram-gradient-text">{totalTrips}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Navigation className="h-3 w-3 text-purple-400" />
              Total Trips
            </div>
          </div>
          <div className="text-center p-3 premium-glass rounded-lg border-white/10">
            <div className="text-2xl font-bold text-blue-400">{avgTripTime}m</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Clock className="h-3 w-3 text-blue-400" />
              Avg Time
            </div>
          </div>
          <div className="text-center p-3 premium-glass rounded-lg border-white/10">
            <div className="text-2xl font-bold text-green-400">{totalDistance.toFixed(1)}km</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <MapPin className="h-3 w-3 text-green-400" />
              Distance
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Route Distribution Pie Chart */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Route Distribution</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={1}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: "brightness(1.1)" }} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      backdropFilter: "blur(10px)",
                      color: "white",
                      fontSize: "12px",
                    }}
                    formatter={(value: any, name: string) => [`${value} trips`, name]}
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: "11px",
                      color: "rgba(255, 255, 255, 0.8)",
                    }}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Route Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Route Details</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {routeData.slice(0, 4).map((route, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 premium-glass rounded-lg border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pieData[index].color }} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{route.route}</p>
                      <p className="text-xs text-muted-foreground">
                        {route.distance}km • {route.avgTime}min
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs premium-glass">
                    {route.frequency}x
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
