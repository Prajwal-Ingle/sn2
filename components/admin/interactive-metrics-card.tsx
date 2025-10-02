"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import { ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts"

interface InteractiveMetricsCardProps {
  title: string
  value: string | number
  change: number
  changeType: "increase" | "decrease"
  icon: React.ElementType
  color: string
  data: Array<{ name: string; value: number }>
  description?: string
}

export function InteractiveMetricsCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  data,
  description,
}: InteractiveMetricsCardProps) {
  const isPositive = changeType === "increase"

  return (
    <Card className="premium-card border-white/10 hover:neon-glow transition-all duration-300 group cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg bg-gradient-to-r ${color} neon-glow group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
              <div className="text-2xl font-bold instagram-gradient-text">{value}</div>
            </div>
          </div>
          <Badge
            variant={isPositive ? "default" : "destructive"}
            className={`${isPositive ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}
          >
            {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {Math.abs(change)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-16 mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={isPositive ? "#10b981" : "#ef4444"}
                strokeWidth={2}
                fill={`url(#gradient-${title})`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  backdropFilter: "blur(10px)",
                  color: "white",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}
