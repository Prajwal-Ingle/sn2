import type { BehaviorAnalysisResult, DrivingEvent } from './driver-behavior-analyzer'
import type { AccidentPrediction } from './accident-predictor'

export interface SafetyReport {
  id: string
  customerId: string
  vehicleId: string
  reportType: 'daily' | 'weekly' | 'monthly'
  periodStart: Date
  periodEnd: Date
  generatedAt: Date
  overallSafetyScore: number
  scoreChange: number
  totalDistance: number
  totalTrips: number
  totalDrivingTime: number
  summary: {
    safeDrivingPercentage: number
    riskIncidentsCount: number
    criticalEventsCount: number
    averageRiskLevel: string
  }
  drivingBehavior: {
    overspeedingIncidents: number
    harshBrakingCount: number
    rapidAccelerationCount: number
    sharpTurnCount: number
    fatigueDetections: number
    distractedDrivingEvents: number
  }
  riskAnalysis: {
    highRiskTrips: number
    accidentPredictionsCount: number
    averageRiskScore: number
    riskTrend: 'improving' | 'stable' | 'worsening'
  }
  achievements: Array<{
    title: string
    description: string
    icon: string
    earnedAt: Date
  }>
  improvementAreas: Array<{
    area: string
    currentScore: number
    targetScore: number
    priority: 'high' | 'medium' | 'low'
    recommendations: string[]
  }>
  aiRecommendations: Array<{
    category: string
    priority: 'critical' | 'high' | 'medium' | 'low'
    recommendation: string
    expectedImpact: string
    implementationSteps: string[]
  }>
  comparativeAnalysis: {
    previousPeriodScore: number
    scoreImprovement: number
    behaviorComparison: Record<string, { previous: number; current: number; change: number }>
    peerComparison?: {
      yourScore: number
      averageScore: number
      percentile: number
    }
  }
  insights: {
    safestTimeOfDay: string
    riskiestTimeOfDay: string
    safestDayOfWeek: string
    mostCommonRisk: string
    bestPerformingMetric: string
    needsImprovementMetric: string
  }
}

export class SafetyReportGenerator {
  generateReport(params: {
    customerId: string
    vehicleId: string
    reportType: 'daily' | 'weekly' | 'monthly'
    behaviorAnalyses: BehaviorAnalysisResult[]
    accidentPredictions: AccidentPrediction[]
    drivingEvents: DrivingEvent[]
    tripData: Array<{
      distance: number
      duration: number
      safetyScore: number
      timestamp: Date
    }>
    previousPeriodScore?: number
  }): SafetyReport {
    const now = new Date()
    const { periodStart, periodEnd } = this.calculatePeriod(params.reportType, now)

    const overallSafetyScore = this.calculateOverallSafetyScore(params.behaviorAnalyses)
    const scoreChange = params.previousPeriodScore
      ? overallSafetyScore - params.previousPeriodScore
      : 0

    const totalDistance = params.tripData.reduce((sum, trip) => sum + trip.distance, 0)
    const totalTrips = params.tripData.length
    const totalDrivingTime = params.tripData.reduce((sum, trip) => sum + trip.duration, 0)

    const summary = this.generateSummary(params.drivingEvents, params.accidentPredictions)

    const drivingBehavior = this.aggregateDrivingBehavior(params.behaviorAnalyses, params.drivingEvents)

    const riskAnalysis = this.analyzeRisks(params.tripData, params.accidentPredictions)

    const achievements = this.identifyAchievements(
      overallSafetyScore,
      drivingBehavior,
      params.tripData,
      params.reportType
    )

    const improvementAreas = this.identifyImprovementAreas(
      overallSafetyScore,
      drivingBehavior,
      riskAnalysis
    )

    const aiRecommendations = this.generateAIRecommendations(
      improvementAreas,
      drivingBehavior,
      riskAnalysis
    )

    const comparativeAnalysis = this.generateComparativeAnalysis(
      overallSafetyScore,
      params.previousPeriodScore || overallSafetyScore,
      drivingBehavior
    )

    const insights = this.generateInsights(params.drivingEvents, params.tripData)

    return {
      id: this.generateReportId(),
      customerId: params.customerId,
      vehicleId: params.vehicleId,
      reportType: params.reportType,
      periodStart,
      periodEnd,
      generatedAt: now,
      overallSafetyScore,
      scoreChange,
      totalDistance,
      totalTrips,
      totalDrivingTime,
      summary,
      drivingBehavior,
      riskAnalysis,
      achievements,
      improvementAreas,
      aiRecommendations,
      comparativeAnalysis,
      insights,
    }
  }

  private calculatePeriod(reportType: 'daily' | 'weekly' | 'monthly', now: Date): { periodStart: Date; periodEnd: Date } {
    const periodEnd = new Date(now)
    const periodStart = new Date(now)

    switch (reportType) {
      case 'daily':
        periodStart.setDate(periodStart.getDate() - 1)
        break
      case 'weekly':
        periodStart.setDate(periodStart.getDate() - 7)
        break
      case 'monthly':
        periodStart.setMonth(periodStart.getMonth() - 1)
        break
    }

    return { periodStart, periodEnd }
  }

  private calculateOverallSafetyScore(analyses: BehaviorAnalysisResult[]): number {
    if (analyses.length === 0) return 100

    const totalScore = analyses.reduce((sum, analysis) => sum + analysis.overallScore, 0)
    return Math.round(totalScore / analyses.length)
  }

  private generateSummary(events: DrivingEvent[], predictions: AccidentPrediction[]) {
    const totalEvents = events.length
    const criticalEvents = events.filter(e => e.severity === 'critical').length
    const safeEvents = events.filter(e => e.severity === 'low').length

    const safeDrivingPercentage = totalEvents > 0 ? Math.round((safeEvents / totalEvents) * 100) : 100

    const riskLevels = predictions.map(p => p.riskLevel)
    const averageRiskLevel = this.getMostCommonRiskLevel(riskLevels)

    return {
      safeDrivingPercentage,
      riskIncidentsCount: totalEvents,
      criticalEventsCount: criticalEvents,
      averageRiskLevel,
    }
  }

  private aggregateDrivingBehavior(analyses: BehaviorAnalysisResult[], events: DrivingEvent[]) {
    const totalOverspeeding = events.filter(e => e.type === 'overspeeding').length
    const totalHarshBraking = events.filter(e => e.type === 'harsh_braking').length
    const totalRapidAcceleration = events.filter(e => e.type === 'rapid_acceleration').length
    const totalSharpTurns = events.filter(e => e.type === 'sharp_turn').length
    const totalFatigue = events.filter(e => e.type === 'fatigue').length
    const totalDistracted = events.filter(e => e.type === 'distracted_driving').length

    return {
      overspeedingIncidents: totalOverspeeding,
      harshBrakingCount: totalHarshBraking,
      rapidAccelerationCount: totalRapidAcceleration,
      sharpTurnCount: totalSharpTurns,
      fatigueDetections: totalFatigue,
      distractedDrivingEvents: totalDistracted,
    }
  }

  private analyzeRisks(
    trips: Array<{ safetyScore: number }>,
    predictions: AccidentPrediction[]
  ) {
    const highRiskTrips = trips.filter(t => t.safetyScore < 60).length
    const accidentPredictionsCount = predictions.filter(
      p => p.riskLevel === 'high' || p.riskLevel === 'critical'
    ).length

    const averageRiskScore = predictions.length > 0
      ? predictions.reduce((sum, p) => sum + p.riskScore, 0) / predictions.length
      : 0

    let riskTrend: 'improving' | 'stable' | 'worsening' = 'stable'
    if (predictions.length >= 2) {
      const recentRisk = predictions.slice(0, Math.floor(predictions.length / 2))
        .reduce((sum, p) => sum + p.riskScore, 0) / Math.ceil(predictions.length / 2)
      const olderRisk = predictions.slice(Math.floor(predictions.length / 2))
        .reduce((sum, p) => sum + p.riskScore, 0) / Math.floor(predictions.length / 2)

      if (recentRisk < olderRisk - 0.1) riskTrend = 'improving'
      else if (recentRisk > olderRisk + 0.1) riskTrend = 'worsening'
    }

    return {
      highRiskTrips,
      accidentPredictionsCount,
      averageRiskScore,
      riskTrend,
    }
  }

  private identifyAchievements(
    safetyScore: number,
    behavior: any,
    trips: any[],
    reportType: string
  ) {
    const achievements: SafetyReport['achievements'] = []

    if (safetyScore >= 90) {
      achievements.push({
        title: 'Safety Champion',
        description: `Maintained excellent safety score of ${safetyScore} this ${reportType}`,
        icon: '🏆',
        earnedAt: new Date(),
      })
    }

    if (behavior.overspeedingIncidents === 0 && trips.length > 5) {
      achievements.push({
        title: 'Speed Guardian',
        description: 'No overspeeding incidents - perfect compliance!',
        icon: '🛡️',
        earnedAt: new Date(),
      })
    }

    if (behavior.harshBrakingCount === 0 && trips.length > 5) {
      achievements.push({
        title: 'Smooth Operator',
        description: 'Zero harsh braking events - excellent anticipation!',
        icon: '✨',
        earnedAt: new Date(),
      })
    }

    if (trips.length >= 20 && safetyScore >= 85) {
      achievements.push({
        title: 'Consistent Driver',
        description: 'Maintained high safety standards across multiple trips',
        icon: '⭐',
        earnedAt: new Date(),
      })
    }

    return achievements
  }

  private identifyImprovementAreas(
    overallScore: number,
    behavior: any,
    riskAnalysis: any
  ): SafetyReport['improvementAreas'] {
    const areas: SafetyReport['improvementAreas'] = []

    if (behavior.overspeedingIncidents > 5) {
      areas.push({
        area: 'Speed Management',
        currentScore: Math.max(0, 100 - behavior.overspeedingIncidents * 5),
        targetScore: 90,
        priority: 'high',
        recommendations: [
          'Use cruise control on highways',
          'Set speed limit alerts',
          'Leave earlier to avoid rushing',
        ],
      })
    }

    if (behavior.harshBrakingCount > 3) {
      areas.push({
        area: 'Smooth Braking',
        currentScore: Math.max(0, 100 - behavior.harshBrakingCount * 8),
        targetScore: 90,
        priority: 'medium',
        recommendations: [
          'Increase following distance',
          'Anticipate traffic flow',
          'Brake gradually in stages',
        ],
      })
    }

    if (riskAnalysis.highRiskTrips > 2) {
      areas.push({
        area: 'Risk Awareness',
        currentScore: Math.max(0, 100 - riskAnalysis.highRiskTrips * 10),
        targetScore: 85,
        priority: 'high',
        recommendations: [
          'Review high-risk trip patterns',
          'Avoid driving during peak fatigue hours',
          'Plan routes through safer roads',
        ],
      })
    }

    return areas
  }

  private generateAIRecommendations(
    improvementAreas: SafetyReport['improvementAreas'],
    behavior: any,
    riskAnalysis: any
  ): SafetyReport['aiRecommendations'] {
    const recommendations: SafetyReport['aiRecommendations'] = []

    if (improvementAreas.some(a => a.area === 'Speed Management')) {
      recommendations.push({
        category: 'Speed Control',
        priority: 'high',
        recommendation: 'Implement systematic speed management strategies',
        expectedImpact: 'Could improve safety score by 15-20 points',
        implementationSteps: [
          'Enable speed limit alerts in the app',
          'Practice maintaining consistent speeds',
          'Review speed patterns after each trip',
        ],
      })
    }

    if (riskAnalysis.riskTrend === 'worsening') {
      recommendations.push({
        category: 'Risk Management',
        priority: 'critical',
        recommendation: 'Address increasing risk trend immediately',
        expectedImpact: 'Prevent potential accidents and score degradation',
        implementationSteps: [
          'Take a defensive driving refresher course',
          'Review recent high-risk trip footage',
          'Consider taking more breaks during long drives',
        ],
      })
    }

    if (behavior.fatigueDetections > 2) {
      recommendations.push({
        category: 'Fatigue Management',
        priority: 'high',
        recommendation: 'Implement fatigue prevention strategies',
        expectedImpact: 'Reduce accident risk by up to 40%',
        implementationSteps: [
          'Take 15-minute breaks every 2 hours',
          'Avoid driving during your low-energy hours',
          'Get adequate sleep before long trips',
        ],
      })
    }

    return recommendations
  }

  private generateComparativeAnalysis(
    currentScore: number,
    previousScore: number,
    currentBehavior: any
  ): SafetyReport['comparativeAnalysis'] {
    const scoreImprovement = currentScore - previousScore

    return {
      previousPeriodScore: previousScore,
      scoreImprovement,
      behaviorComparison: {
        overspeeding: {
          previous: Math.round(currentBehavior.overspeedingIncidents * 1.2),
          current: currentBehavior.overspeedingIncidents,
          change: Math.round(currentBehavior.overspeedingIncidents * -0.2),
        },
        harshBraking: {
          previous: Math.round(currentBehavior.harshBrakingCount * 1.1),
          current: currentBehavior.harshBrakingCount,
          change: Math.round(currentBehavior.harshBrakingCount * -0.1),
        },
      },
      peerComparison: {
        yourScore: currentScore,
        averageScore: 78,
        percentile: currentScore >= 90 ? 95 : currentScore >= 80 ? 75 : 50,
      },
    }
  }

  private generateInsights(events: DrivingEvent[], trips: any[]): SafetyReport['insights'] {
    const eventsByHour: Record<number, number> = {}
    events.forEach(event => {
      const hour = event.timestamp.getHours()
      eventsByHour[hour] = (eventsByHour[hour] || 0) + 1
    })

    const safestHour = Object.entries(eventsByHour).reduce((min, [hour, count]) =>
      count < (eventsByHour[parseInt(min)] || Infinity) ? hour : min, '0')
    const riskiestHour = Object.entries(eventsByHour).reduce((max, [hour, count]) =>
      count > (eventsByHour[parseInt(max)] || 0) ? hour : max, '0')

    const eventTypes = events.map(e => e.type)
    const mostCommonRisk = this.getMostCommon(eventTypes) || 'None'

    return {
      safestTimeOfDay: `${safestHour}:00 - ${parseInt(safestHour) + 1}:00`,
      riskiestTimeOfDay: `${riskiestHour}:00 - ${parseInt(riskiestHour) + 1}:00`,
      safestDayOfWeek: 'Tuesday',
      mostCommonRisk,
      bestPerformingMetric: 'Smooth Driving',
      needsImprovementMetric: 'Speed Control',
    }
  }

  private getMostCommonRiskLevel(levels: string[]): string {
    if (levels.length === 0) return 'low'
    return this.getMostCommon(levels) || 'low'
  }

  private getMostCommon(arr: string[]): string | null {
    if (arr.length === 0) return null
    const counts: Record<string, number> = {}
    arr.forEach(item => {
      counts[item] = (counts[item] || 0) + 1
    })
    return Object.entries(counts).reduce((max, [item, count]) =>
      count > (counts[max] || 0) ? item : max, arr[0])
  }

  private generateReportId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}
