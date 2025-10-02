"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { Play, Pause, Square, Activity, Zap, Gauge, TrendingUp, AlertTriangle, Brain } from 'lucide-react'
import { TelemetrySimulator } from '@/lib/ai/telemetry-simulator'
import { DriverBehaviorAnalyzer } from '@/lib/ai/driver-behavior-analyzer'
import { AccidentPredictor } from '@/lib/ai/accident-predictor'
import { alertSystem } from '@/lib/ai/real-time-alert-system'
import type { TelemetryData } from '@/lib/ai/driver-behavior-analyzer'
import type { Alert } from '@/lib/ai/real-time-alert-system'

const scenarios = [
  { value: 'normal', label: 'Normal Driving', color: 'bg-green-500' },
  { value: 'city', label: 'City Traffic', color: 'bg-blue-500' },
  { value: 'highway', label: 'Highway', color: 'bg-cyan-500' },
  { value: 'aggressive', label: 'Aggressive', color: 'bg-orange-500' },
  { value: 'dangerous', label: 'Dangerous', color: 'bg-red-500' },
  { value: 'fatigue', label: 'Fatigue', color: 'bg-yellow-500' },
] as const

export function LiveTelemetryMonitor() {
  const [isRunning, setIsRunning] = useState(false)
  const [scenario, setScenario] = useState<typeof scenarios[number]['value']>('normal')
  const [telemetryData, setTelemetryData] = useState<TelemetryData[]>([])
  const [currentData, setCurrentData] = useState<TelemetryData | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [behaviorScore, setBehaviorScore] = useState(100)
  const [riskLevel, setRiskLevel] = useState<string>('safe')
  const [accidentRisk, setAccidentRisk] = useState(0)

  const simulatorRef = useRef(new TelemetrySimulator())
  const analyzerRef = useRef(new DriverBehaviorAnalyzer())
  const predictorRef = useRef(new AccidentPredictor())

  useEffect(() => {
    const unsubscribe = alertSystem.subscribeToAlerts((alert) => {
      setAlerts(prev => [alert, ...prev.slice(0, 9)])
    })

    return unsubscribe
  }, [])

  const startSimulation = () => {
    setIsRunning(true)
    setTelemetryData([])
    setAlerts([])

    simulatorRef.current.startSimulation(
      {
        vehicleId: 'vehicle-1',
        intervalMs: 1000,
        scenario,
        startLocation: { lat: 12.9716, lng: 77.5946 },
      },
      (data) => {
        setCurrentData(data)
        setTelemetryData(prev => {
          const updated = [...prev, data]

          if (updated.length >= 30) {
            const analysis = analyzerRef.current.analyzeBehavior(updated.slice(-30))
            setBehaviorScore(Math.round(analysis.overallScore))
            setRiskLevel(analysis.riskLevel)

            if (analysis.events.length > 0) {
              analysis.events.forEach(event => {
                alertSystem.processDrivingEvent(event)
              })
            }

            const prediction = predictorRef.current.predictAccidentRisk(
              data,
              updated.slice(-20),
              analysis.events
            )
            setAccidentRisk(Math.round(prediction.riskScore * 100))

            alertSystem.processAccidentPrediction(prediction, {
              lat: data.latitude,
              lng: data.longitude,
            })
          }

          return updated.slice(-100)
        })
      }
    )
  }

  const pauseSimulation = () => {
    simulatorRef.current.stopSimulation()
    setIsRunning(false)
  }

  const stopSimulation = () => {
    simulatorRef.current.stopSimulation()
    setIsRunning(false)
    setTelemetryData([])
    setCurrentData(null)
    setAlerts([])
    setBehaviorScore(100)
    setAccidentRisk(0)
  }

  const chartData = telemetryData.slice(-30).map((d, i) => ({
    time: i,
    speed: d.speed,
    acceleration: Math.sqrt(d.accelerationX ** 2 + d.accelerationY ** 2 + d.accelerationZ ** 2),
  }))

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'safe': return 'text-green-400'
      case 'moderate': return 'text-yellow-400'
      case 'risky': return 'text-orange-400'
      case 'dangerous': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'border-blue-500/30 bg-blue-500/10'
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/10'
      case 'danger': return 'border-orange-500/30 bg-orange-500/10'
      case 'critical': return 'border-red-500/30 bg-red-500/10'
      default: return 'border-gray-500/30 bg-gray-500/10'
    }
  }

  return (
    <div className="space-y-6">
      <Card className="premium-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 instagram-gradient-text">
              <Activity className="h-5 w-5" />
              Live Telemetry Monitor
            </div>
            <div className="flex items-center gap-2">
              {isRunning && (
                <Badge variant="outline" className="animate-pulse border-green-500/50 bg-green-500/20 text-green-400">
                  ● LIVE
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {scenarios.map((s) => (
              <Button
                key={s.value}
                variant={scenario === s.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => !isRunning && setScenario(s.value)}
                disabled={isRunning}
                className={scenario === s.value ? `${s.color} text-white` : ''}
              >
                {s.label}
              </Button>
            ))}
          </div>

          <div className="flex gap-4">
            <Button
              onClick={startSimulation}
              disabled={isRunning}
              className="instagram-gradient text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
            <Button
              onClick={pauseSimulation}
              disabled={!isRunning}
              variant="outline"
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
            <Button
              onClick={stopSimulation}
              disabled={!isRunning}
              variant="outline"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          </div>

          {currentData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="premium-glass border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Speed</p>
                      <p className="text-2xl font-bold">{currentData.speed.toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground">km/h</p>
                    </div>
                    <Gauge className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-glass border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">G-Force</p>
                      <p className="text-2xl font-bold">
                        {Math.sqrt(
                          currentData.accelerationX ** 2 +
                          currentData.accelerationY ** 2 +
                          currentData.accelerationZ ** 2
                        ).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">m/s²</p>
                    </div>
                    <Zap className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-glass border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Safety Score</p>
                      <p className={`text-2xl font-bold ${getRiskColor(riskLevel)}`}>
                        {behaviorScore}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{riskLevel}</p>
                    </div>
                    <Brain className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-glass border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Accident Risk</p>
                      <p className="text-2xl font-bold text-orange-400">{accidentRisk}%</p>
                      <p className="text-xs text-muted-foreground">Probability</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {chartData.length > 0 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Speed Profile</h3>
                <ResponsiveContainer width="100%" height={150}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="time" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{ background: '#1a1a1a', border: '1px solid #333' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="speed"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#speedGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Acceleration Magnitude</h3>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="time" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{ background: '#1a1a1a', border: '1px solid #333' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="acceleration"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {alerts.length > 0 && (
        <Card className="premium-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 instagram-gradient-text">
              <AlertTriangle className="h-5 w-5" />
              Real-Time Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border premium-glass ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {alert.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{alert.explanation}</p>
                  <p className="text-sm font-medium text-blue-400">{alert.recommendedAction}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
