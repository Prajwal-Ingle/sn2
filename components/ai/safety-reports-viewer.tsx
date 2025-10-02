"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, TrendingUp, Trophy, AlertTriangle, Calendar, Download } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { SafetyReportGenerator } from '@/lib/ai/safety-report-generator'
import type { SafetyReport } from '@/lib/ai/safety-report-generator'

export function SafetyReportsViewer() {
  const [report, setReport] = useState<SafetyReport | null>(null)
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('weekly')

  useEffect(() => {
    generateMockReport(reportType)
  }, [reportType])

  const generateMockReport = (type: 'daily' | 'weekly' | 'monthly') => {
    const generator = new SafetyReportGenerator()

    const mockTrips = Array.from({ length: 15 }, (_, i) => ({
      distance: 20 + Math.random() * 30,
      duration: 30 + Math.random() * 60,
      safetyScore: 70 + Math.random() * 25,
      timestamp: new Date(Date.now() - i * 86400000),
    }))

    const mockBehaviorAnalyses = mockTrips.map(() => ({
      overallScore: 75 + Math.random() * 20,
      riskLevel: 'moderate' as const,
      events: [],
      insights: {
        overspeedingIncidents: Math.floor(Math.random() * 5),
        harshBrakingCount: Math.floor(Math.random() * 3),
        rapidAccelerationCount: Math.floor(Math.random() * 4),
        sharpTurnCount: Math.floor(Math.random() * 2),
        phoneUsageDetected: false,
        fatigueDetected: Math.random() > 0.8,
        distractedDrivingEvents: Math.floor(Math.random() * 2),
        aggressiveDrivingScore: 20 + Math.random() * 30,
        smoothDrivingScore: 70 + Math.random() * 20,
        attentionScore: 80 + Math.random() * 15,
      },
      recommendations: [],
    }))

    const mockPredictions = []

    const generatedReport = generator.generateReport({
      customerId: 'customer-1',
      vehicleId: 'vehicle-1',
      reportType: type,
      behaviorAnalyses: mockBehaviorAnalyses,
      accidentPredictions: mockPredictions,
      drivingEvents: [],
      tripData: mockTrips,
      previousPeriodScore: 82,
    })

    setReport(generatedReport)
  }

  if (!report) return null

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 75) return 'text-blue-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getTrendIcon = (change: number) => {
    if (change > 0) return '📈'
    if (change < 0) return '📉'
    return '➡️'
  }

  return (
    <div className="space-y-6">
      <Card className="premium-card border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 instagram-gradient-text">
                <FileText className="h-5 w-5" />
                Safety Report
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Period: {new Date(report.periodStart).toLocaleDateString()} - {new Date(report.periodEnd).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={reportType === 'daily' ? 'default' : 'outline'}
                onClick={() => setReportType('daily')}
                className={reportType === 'daily' ? 'instagram-gradient' : ''}
              >
                Daily
              </Button>
              <Button
                size="sm"
                variant={reportType === 'weekly' ? 'default' : 'outline'}
                onClick={() => setReportType('weekly')}
                className={reportType === 'weekly' ? 'instagram-gradient' : ''}
              >
                Weekly
              </Button>
              <Button
                size="sm"
                variant={reportType === 'monthly' ? 'default' : 'outline'}
                onClick={() => setReportType('monthly')}
                className={reportType === 'monthly' ? 'instagram-gradient' : ''}
              >
                Monthly
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="premium-card border-white/10">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Overall Safety Score</p>
            <p className={`text-4xl font-bold ${getScoreColor(report.overallSafetyScore)}`}>
              {report.overallSafetyScore}
            </p>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span>{getTrendIcon(report.scoreChange)}</span>
              <span className={report.scoreChange > 0 ? 'text-green-400' : 'text-red-400'}>
                {Math.abs(report.scoreChange)} points
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card border-white/10">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Distance</p>
            <p className="text-4xl font-bold">{report.totalDistance.toFixed(0)}</p>
            <p className="text-sm text-muted-foreground mt-2">kilometers</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-white/10">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Trips</p>
            <p className="text-4xl font-bold">{report.totalTrips}</p>
            <p className="text-sm text-muted-foreground mt-2">completed</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-white/10">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Driving Time</p>
            <p className="text-4xl font-bold">{Math.round(report.totalDrivingTime / 60)}</p>
            <p className="text-sm text-muted-foreground mt-2">hours</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="premium-glass border-white/10">
          <TabsTrigger value="overview" className="data-[state=active]:instagram-gradient data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:instagram-gradient data-[state=active]:text-white">
            Achievements
          </TabsTrigger>
          <TabsTrigger value="improvements" className="data-[state=active]:instagram-gradient data-[state=active]:text-white">
            Improvements
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="data-[state=active]:instagram-gradient data-[state=active]:text-white">
            AI Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="premium-card border-white/10">
            <CardHeader>
              <CardTitle>Driving Behavior Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 premium-glass rounded-lg border border-white/10">
                  <p className="text-sm text-muted-foreground">Safe Driving</p>
                  <p className="text-2xl font-bold text-green-400">
                    {report.summary.safeDrivingPercentage}%
                  </p>
                </div>
                <div className="p-4 premium-glass rounded-lg border border-white/10">
                  <p className="text-sm text-muted-foreground">Risk Incidents</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {report.summary.riskIncidentsCount}
                  </p>
                </div>
                <div className="p-4 premium-glass rounded-lg border border-white/10">
                  <p className="text-sm text-muted-foreground">Critical Events</p>
                  <p className="text-2xl font-bold text-red-400">
                    {report.summary.criticalEventsCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card border-white/10">
            <CardHeader>
              <CardTitle>Detailed Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Overspeeding Incidents</span>
                    <span className="font-medium">{report.drivingBehavior.overspeedingIncidents}</span>
                  </div>
                  <Progress value={Math.min(100, report.drivingBehavior.overspeedingIncidents * 10)} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Harsh Braking Events</span>
                    <span className="font-medium">{report.drivingBehavior.harshBrakingCount}</span>
                  </div>
                  <Progress value={Math.min(100, report.drivingBehavior.harshBrakingCount * 15)} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Rapid Accelerations</span>
                    <span className="font-medium">{report.drivingBehavior.rapidAccelerationCount}</span>
                  </div>
                  <Progress value={Math.min(100, report.drivingBehavior.rapidAccelerationCount * 15)} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card border-white/10">
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 premium-glass rounded-lg border border-white/10">
                  <p className="text-sm text-muted-foreground mb-1">Safest Time</p>
                  <p className="font-semibold">{report.insights.safestTimeOfDay}</p>
                </div>
                <div className="p-4 premium-glass rounded-lg border border-white/10">
                  <p className="text-sm text-muted-foreground mb-1">Riskiest Time</p>
                  <p className="font-semibold text-orange-400">{report.insights.riskiestTimeOfDay}</p>
                </div>
                <div className="p-4 premium-glass rounded-lg border border-white/10">
                  <p className="text-sm text-muted-foreground mb-1">Best Metric</p>
                  <p className="font-semibold text-green-400">{report.insights.bestPerformingMetric}</p>
                </div>
                <div className="p-4 premium-glass rounded-lg border border-white/10">
                  <p className="text-sm text-muted-foreground mb-1">Needs Work</p>
                  <p className="font-semibold text-red-400">{report.insights.needsImprovementMetric}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card className="premium-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Your Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {report.achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.achievements.map((achievement, i) => (
                    <div key={i} className="p-6 premium-glass rounded-lg border border-white/10 text-center">
                      <div className="text-4xl mb-3">{achievement.icon}</div>
                      <h3 className="font-bold text-lg mb-2">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Keep driving safely to earn achievements!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="improvements">
          <Card className="premium-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report.improvementAreas.map((area, i) => (
                  <div key={i} className="p-4 premium-glass rounded-lg border border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{area.area}</h3>
                        <p className="text-sm text-muted-foreground">
                          Current: {area.currentScore} → Target: {area.targetScore}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          area.priority === 'high'
                            ? 'border-red-500/30 bg-red-500/10 text-red-400'
                            : area.priority === 'medium'
                            ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
                            : 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                        }
                      >
                        {area.priority} priority
                      </Badge>
                    </div>
                    <Progress value={(area.currentScore / area.targetScore) * 100} className="h-2 mb-3" />
                    <div className="space-y-2">
                      {area.recommendations.map((rec, j) => (
                        <div key={j} className="flex items-start gap-2 text-sm">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>{rec}</span>
                        </div>
                      ))}
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
                <AlertTriangle className="h-5 w-5" />
                AI-Powered Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report.aiRecommendations.map((rec, i) => (
                  <div key={i} className="p-4 premium-glass rounded-lg border border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold">{rec.category}</h3>
                      <Badge variant="outline" className={
                        rec.priority === 'critical' ? 'border-red-500/30 bg-red-500/10 text-red-400' :
                        rec.priority === 'high' ? 'border-orange-500/30 bg-orange-500/10 text-orange-400' :
                        'border-blue-500/30 bg-blue-500/10 text-blue-400'
                      }>
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm mb-2">{rec.recommendation}</p>
                    <p className="text-sm text-green-400 mb-3">✓ {rec.expectedImpact}</p>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Implementation Steps:</p>
                      {rec.implementationSteps.map((step, j) => (
                        <div key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="font-bold">{j + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
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
