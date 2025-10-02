"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, Clock, Gauge, Route, TrendingUp, AlertTriangle } from "lucide-react"
import { formatDate } from "@/lib/utils/date-utils"
import type { RecentTrip } from "@/lib/types"

interface RecentTripsCardProps {
  trips: RecentTrip[]
}

export function RecentTripsCard({ trips }: RecentTripsCardProps) {
  const recentTrips = trips.slice(0, 5)

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400"
    if (score >= 75) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-500/20 border-green-500/30"
    if (score >= 75) return "bg-yellow-500/20 border-yellow-500/30"
    return "bg-red-500/20 border-red-500/30"
  }

  const getViolations = (incidents: number, safetyScore: number) => {
    const violations = []
    if (incidents > 0) {
      if (safetyScore < 70) violations.push("Harsh Braking", "Over Speeding")
      else if (safetyScore < 85) violations.push("Minor Speed Violation")
      else violations.push("Traffic Signal Delay")
    }
    return violations
  }

  return (
    <Card className="premium-card border-white/10 neon-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 instagram-gradient-text">
          <Route className="h-5 w-5" />
          Recent Trips
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentTrips.map((trip) => {
          const violations = getViolations(trip.incidents, trip.safetyScore)

          return (
            <div
              key={trip.id}
              className="premium-glass rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-foreground">
                      {trip.startLocation} → {trip.endLocation}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(trip.startTime)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Gauge className="h-3 w-3" />
                      {trip.distance} km
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {trip.duration} min
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full border ${getScoreBg(trip.safetyScore)}`}>
                  <span className={`text-sm font-bold ${getScoreColor(trip.safetyScore)}`}>{trip.safetyScore}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Safety Score</span>
                  <span className={`font-medium ${getScoreColor(trip.safetyScore)}`}>{trip.safetyScore}/100</span>
                </div>
                <Progress value={trip.safetyScore} className="h-2 bg-white/10" />
              </div>

              {violations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-3 w-3 text-orange-400" />
                    <span className="text-xs text-orange-400 font-medium">
                      {violations.length} violation{violations.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {violations.slice(0, 3).map((violation, index) => (
                      <Badge
                        key={index}
                        variant="destructive"
                        className="text-xs bg-red-500/20 text-red-400 border-red-500/30"
                      >
                        {violation}
                      </Badge>
                    ))}
                    {violations.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-white/10 text-muted-foreground">
                        +{violations.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {recentTrips.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Route className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No recent trips found</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
