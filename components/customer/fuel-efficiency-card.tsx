"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Fuel, TrendingUp, Leaf, DollarSign } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface FuelEfficiencyCardProps {
  customerId: string
}

export function FuelEfficiencyCard({ customerId }: FuelEfficiencyCardProps) {
  // Mock fuel efficiency data
  const fuelData = [
    { month: "Jul", efficiency: 16.8, cost: 2800 },
    { month: "Aug", efficiency: 18.2, cost: 2650 },
    { month: "Sep", efficiency: 19.5, cost: 2500 },
    { month: "Oct", efficiency: 17.9, cost: 2720 },
    { month: "Nov", efficiency: 20.3, cost: 2400 },
    { month: "Dec", efficiency: 21.1, cost: 2300 },
  ]

  const currentEfficiency = fuelData[fuelData.length - 1].efficiency
  const previousEfficiency = fuelData[fuelData.length - 2].efficiency
  const improvement = (((currentEfficiency - previousEfficiency) / previousEfficiency) * 100).toFixed(1)
  const monthlySavings = fuelData[fuelData.length - 2].cost - fuelData[fuelData.length - 1].cost

  return (
    <Card className="premium-card border-white/10 hover:neon-glow-green transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 neon-glow-green">
              <Fuel className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Fuel Efficiency</CardTitle>
              <CardDescription>Monthly fuel consumption analysis</CardDescription>
            </div>
          </div>
          <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
            +{improvement}% this month
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Efficiency Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 premium-glass rounded-lg border-white/10">
            <div className="text-2xl font-bold text-green-400">{currentEfficiency}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Leaf className="h-3 w-3 text-green-400" />
              km/L
            </div>
          </div>
          <div className="text-center p-3 premium-glass rounded-lg border-white/10">
            <div className="text-2xl font-bold instagram-gradient-text">₹{monthlySavings}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <DollarSign className="h-3 w-3 text-green-400" />
              Saved
            </div>
          </div>
          <div className="text-center p-3 premium-glass rounded-lg border-white/10">
            <div className="text-2xl font-bold text-blue-400">{improvement}%</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <TrendingUp className="h-3 w-3 text-blue-400" />
              Improvement
            </div>
          </div>
        </div>

        {/* Fuel Efficiency Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fuelData}>
              <defs>
                <linearGradient id="fuelGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  backdropFilter: "blur(10px)",
                }}
              />
              <Bar dataKey="efficiency" fill="url(#fuelGradient)" radius={[4, 4, 0, 0]} name="Efficiency (km/L)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
