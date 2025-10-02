"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, AlertTriangle, TrendingUp, Shield, Target, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts'
import { AccidentPredictor } from '@/lib/ai/accident-predictor'
import type { AccidentPrediction } from '@/lib/ai/accident-predictor'

export function AIPredictionsDashboard() {
  const [prediction, setPrediction] = useState<AccidentPrediction | null>(null)
  const predictor = new AccidentPredictor()

  useEffect(() => {
    const mockTelemetry = {
      timestamp: new Date(),
      speed: 85,
      accelerationX: 2.5,
      accelerationY: -1.2,
      accelerationZ: 9.8,
      latitude: 12.9716,
      longitude: 77.5946,
    }

    const mockRecent = Array.from({ length: 50 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 1000),
      speed: 80 + Math.random() * 20,
      accelerationX: (Math.random() - 0.5) * 3,
      accelerationY: (Math.random() - 0.5) * 2,
      accelerationZ: 9.8 + (Math.random() - 0.5),
      latitude: 12.9716 + (Math.random() - 0.5) * 0.01,
      longitude: 77.5946 + (Math.random() - 0.5) * 0.01,
    }))

    const pred = predictor.predictAccidentRisk(mockTelemetry, mockRecent, [])
    setPrediction(pred)
  }, [])

  if (!prediction) return null

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400 border-green-500/30 bg-green-500/10'
      case 'medium': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
      case 'high': return 'text-orange-400 border-orange-500/30 bg-orange-500/10'
      case 'critical': return 'text-red-400 border-red-500/30 bg-red-500/10'
      default: return 'text-gray-400'
    }
  }

  const factorData = Object.entries(prediction.contributingFactors).map(([key, value]) => ({
    factor: key.charAt(0).toUpperCase() + key.slice(1),
    value: value * 100,
  }))

  const shapData = prediction.explainability.topFactors.map(f => ({
    factor: f.factor.charAt(0).toUpperCase() + f.factor.slice(1),
    impact: f.impact * 100,
  }))

  const radarData = [
    {
      metric: 'Speed',
      value: prediction.contributingFactors.speed * 100,
      fullMark: 100,
    },
    {
      metric: 'Acceleration',
      value: prediction.contributingFactors.acceleration * 100,
      fullMark: 100,
    },
    {
      metric: 'Location',
      value: prediction.contributingFactors.location * 100,
      fullMark: 100,
    },
    {
      metric: 'Time',
      value: prediction.contributingFactors.time * 100,
      fullMark: 100,
    },
    {
      metric: 'Behavior',
      value: prediction.contributingFactors.driverBehavior * 100,
      fullMark: 100,
    },
  ]

  const riskZones = predictor.getRiskZones()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`premium-card border-white/10 ${getRiskColor(prediction.riskLevel)}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Risk Score</p>
                <p className="text-4xl font-bold mt-2">
                  {(prediction.riskScore * 100).toFixed(1)}%
                </p>
                <Badge variant="outline" className={`mt-2 capitalize ${getRiskColor(prediction.riskLevel)}`}>
                  {prediction.riskLevel} Risk
                </Badge>
              </div>
              <AlertTriangle className="h-12 w-12 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Confidence</p>
                <p className="text-4xl font-bold mt-2">
                  {(prediction.confidenceScore * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Model: {prediction.predictionModel}
                </p>
              </div>
              <Brain className="h-12 w-12 text-purple-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Time to Risk</p>
                <p className="text-4xl font-bold mt-2">
                  {prediction.timeToRisk}s
                </p>
                {prediction.anomalyDetected && (
                  <Badge variant="outline" className="mt-2 border-red-500/30 bg-red-500/10 text-red-400">
                    Anomaly: {prediction.anomalyType}
                  </Badge>
                )}
              </div>
              <Activity className="h-12 w-12 text-orange-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="factors" className="space-y-4">
        <TabsList className="premium-glass border-white/10">
          <TabsTrigger value="factors" className="data-[state=active]:instagram-gradient data-[state=active]:text-white">
            Risk Factors
          </TabsTrigger>
          <TabsTrigger value="explainability" className="data-[state=active]:instagram-gradient data-[state=active]:text-white">
            AI Explainability
          </TabsTrigger>
          <TabsTrigger value="zones" className="data-[state=active]:instagram-gradient data-[state=active]:text-white">
            Risk Zones
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="data-[state=active]:instagram-gradient data-[state=active]:text-white">
            Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="factors" className="space-y-6">
          <Card className="premium-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Contributing Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {factorData.map((item) => (
                  <div key={item.factor} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.factor}</span>
                      <span className="text-muted-foreground">{item.value.toFixed(1)}%</span>
                    </div>
                    <Progress value={item.value} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card border-white/10">
            <CardHeader>
              <CardTitle>Risk Factor Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#333" />
                  <PolarAngleAxis dataKey="metric" stroke="#666" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#666" />
                  <Radar
                    name="Risk Level"
                    dataKey="value"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="explainability" className="space-y-6">
          <Card className="premium-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                SHAP Feature Importance
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Why the AI predicted this risk level
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={shapData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="factor" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{ background: '#1a1a1a', border: '1px solid #333' }}
                  />
                  <Bar dataKey="impact" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="premium-card border-white/10">
            <CardHeader>
              <CardTitle>Top Contributing Factors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prediction.explainability.topFactors.map((factor, i) => (
                  <div key={i} className="p-4 premium-glass rounded-lg border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold capitalize">{factor.factor}</h4>
                      <Badge variant="outline">
                        Impact: {(factor.impact * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{factor.explanation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zones">
          <Card className="premium-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Known Risk Zones
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Accident-prone areas based on historical data
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {riskZones.map((zone, i) => (
                  <div key={i} className={`p-4 rounded-lg border premium-glass ${getRiskColor(zone.riskLevel)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{zone.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {zone.latitude.toFixed(4)}, {zone.longitude.toFixed(4)}
                        </p>
                      </div>
                      <Badge variant="outline" className={`capitalize ${getRiskColor(zone.riskLevel)}`}>
                        {zone.riskLevel}
                      </Badge>
                    </div>
                    <div className="flex gap-4 mt-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Accidents</p>
                        <p className="font-semibold">{zone.accidentCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Radius</p>
                        <p className="font-semibold">{zone.radius}m</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">Common incidents:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {zone.commonIncidents.map((incident, j) => (
                          <Badge key={j} variant="outline" className="text-xs">
                            {incident.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card className="premium-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                AI-Powered Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {prediction.recommendations.map((rec, i) => (
                  <div key={i} className="p-4 premium-glass rounded-lg border border-white/10">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className="h-6 w-6 rounded-full instagram-gradient flex items-center justify-center text-white text-sm font-bold">
                          {i + 1}
                        </div>
                      </div>
                      <p className="text-sm flex-1">{rec}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
