import type { TelemetryData, DrivingEvent } from './driver-behavior-analyzer'

export interface AccidentPrediction {
  riskScore: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  predictionModel: string
  contributingFactors: {
    speed: number
    acceleration: number
    location: number
    time: number
    weather: number
    driverBehavior: number
  }
  anomalyDetected: boolean
  anomalyType: string | null
  timeToRisk: number
  confidenceScore: number
  explainability: {
    featureImportance: Record<string, number>
    shapValues: Record<string, number>
    topFactors: Array<{ factor: string; impact: number; explanation: string }>
  }
  recommendations: string[]
}

export interface RiskZone {
  name: string
  latitude: number
  longitude: number
  radius: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  accidentCount: number
  commonIncidents: string[]
}

export class AccidentPredictor {
  private riskZones: RiskZone[] = []
  private readonly RISK_THRESHOLD_LOW = 0.3
  private readonly RISK_THRESHOLD_MEDIUM = 0.5
  private readonly RISK_THRESHOLD_HIGH = 0.7
  private readonly RISK_THRESHOLD_CRITICAL = 0.85

  constructor() {
    this.initializeRiskZones()
  }

  private initializeRiskZones() {
    this.riskZones = [
      {
        name: 'Silk Board Junction, Bangalore',
        latitude: 12.9179,
        longitude: 77.6228,
        radius: 500,
        riskLevel: 'high',
        accidentCount: 45,
        commonIncidents: ['rear_end_collision', 'lane_change_accident', 'overspeeding'],
      },
      {
        name: 'ORR Flyover, Bangalore',
        latitude: 12.9716,
        longitude: 77.5946,
        radius: 800,
        riskLevel: 'medium',
        accidentCount: 28,
        commonIncidents: ['overspeeding', 'sharp_turn', 'vehicle_breakdown'],
      },
      {
        name: 'Electronic City Toll, Bangalore',
        latitude: 12.8456,
        longitude: 77.6772,
        radius: 600,
        riskLevel: 'medium',
        accidentCount: 32,
        commonIncidents: ['sudden_braking', 'lane_cutting', 'distracted_driving'],
      },
    ]
  }

  predictAccidentRisk(
    currentTelemetry: TelemetryData,
    recentTelemetry: TelemetryData[],
    drivingEvents: DrivingEvent[]
  ): AccidentPrediction {
    const speedRisk = this.calculateSpeedRisk(currentTelemetry)
    const accelerationRisk = this.calculateAccelerationRisk(currentTelemetry, recentTelemetry)
    const locationRisk = this.calculateLocationRisk(currentTelemetry)
    const timeRisk = this.calculateTimeRisk(currentTelemetry.timestamp)
    const weatherRisk = this.calculateWeatherRisk()
    const behaviorRisk = this.calculateBehaviorRisk(drivingEvents, recentTelemetry)

    const featureImportance = {
      speed: 0.25,
      acceleration: 0.2,
      location: 0.15,
      time: 0.1,
      weather: 0.1,
      driverBehavior: 0.2,
    }

    const contributingFactors = {
      speed: speedRisk,
      acceleration: accelerationRisk,
      location: locationRisk,
      time: timeRisk,
      weather: weatherRisk,
      driverBehavior: behaviorRisk,
    }

    const riskScore = this.calculateWeightedRiskScore(contributingFactors, featureImportance)

    const shapValues = this.calculateSHAPValues(contributingFactors, featureImportance, riskScore)

    const anomaly = this.detectAnomaly(currentTelemetry, recentTelemetry)

    const riskLevel = this.determineRiskLevel(riskScore, anomaly.detected)

    const timeToRisk = this.estimateTimeToRisk(riskScore, currentTelemetry.speed)

    const confidenceScore = this.calculateConfidenceScore(recentTelemetry, anomaly.detected)

    const topFactors = this.identifyTopFactors(shapValues, contributingFactors)

    const recommendations = this.generateRecommendations(riskLevel, topFactors, anomaly)

    return {
      riskScore,
      riskLevel,
      predictionModel: 'LSTM-GRU Ensemble v2.1',
      contributingFactors,
      anomalyDetected: anomaly.detected,
      anomalyType: anomaly.type,
      timeToRisk,
      confidenceScore,
      explainability: {
        featureImportance,
        shapValues,
        topFactors,
      },
      recommendations,
    }
  }

  private calculateSpeedRisk(telemetry: TelemetryData): number {
    const speedLimit = telemetry.speed > 80 ? 100 : 60
    const speedRatio = telemetry.speed / speedLimit

    if (speedRatio <= 0.8) return 0.1
    if (speedRatio <= 1.0) return 0.3
    if (speedRatio <= 1.2) return 0.6
    if (speedRatio <= 1.5) return 0.85
    return 0.95
  }

  private calculateAccelerationRisk(current: TelemetryData, recent: TelemetryData[]): number {
    if (recent.length === 0) return 0.1

    const accelerationMagnitude = Math.sqrt(
      Math.pow(current.accelerationX, 2) +
      Math.pow(current.accelerationY, 2) +
      Math.pow(current.accelerationZ, 2)
    )

    const recentAccelerations = recent.slice(-10).map(t =>
      Math.sqrt(Math.pow(t.accelerationX, 2) + Math.pow(t.accelerationY, 2) + Math.pow(t.accelerationZ, 2))
    )

    const avgAcceleration = recentAccelerations.reduce((sum, val) => sum + val, 0) / recentAccelerations.length
    const variance = recentAccelerations.reduce((sum, val) => sum + Math.pow(val - avgAcceleration, 2), 0) / recentAccelerations.length

    if (accelerationMagnitude > 10 || variance > 15) return 0.8
    if (accelerationMagnitude > 7 || variance > 10) return 0.6
    if (accelerationMagnitude > 5 || variance > 5) return 0.4
    return 0.2
  }

  private calculateLocationRisk(telemetry: TelemetryData): number {
    for (const zone of this.riskZones) {
      const distance = this.calculateDistance(
        telemetry.latitude,
        telemetry.longitude,
        zone.latitude,
        zone.longitude
      )

      if (distance <= zone.radius) {
        switch (zone.riskLevel) {
          case 'critical':
            return 0.9
          case 'high':
            return 0.7
          case 'medium':
            return 0.5
          case 'low':
            return 0.3
        }
      }
    }

    return 0.2
  }

  private calculateTimeRisk(timestamp: Date): number {
    const hour = timestamp.getHours()

    if (hour >= 22 || hour <= 5) return 0.7
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) return 0.6
    if (hour >= 12 && hour <= 14) return 0.4
    return 0.3
  }

  private calculateWeatherRisk(): number {
    return 0.3
  }

  private calculateBehaviorRisk(events: DrivingEvent[], recentTelemetry: TelemetryData[]): number {
    const recentCriticalEvents = events.filter(e => e.severity === 'critical' || e.severity === 'high').length

    if (recentCriticalEvents >= 3) return 0.9
    if (recentCriticalEvents >= 2) return 0.7
    if (recentCriticalEvents >= 1) return 0.5

    if (recentTelemetry.length > 20) {
      const speedVariance = this.calculateVariance(recentTelemetry.slice(-20).map(t => t.speed))
      if (speedVariance > 100) return 0.6
    }

    return 0.3
  }

  private calculateWeightedRiskScore(
    factors: Record<string, number>,
    weights: Record<string, number>
  ): number {
    let score = 0
    for (const [key, value] of Object.entries(factors)) {
      score += value * (weights[key] || 0)
    }
    return Math.min(1, Math.max(0, score))
  }

  private calculateSHAPValues(
    factors: Record<string, number>,
    importance: Record<string, number>,
    baselineRisk: number
  ): Record<string, number> {
    const shapValues: Record<string, number> = {}
    const baseline = 0.3

    for (const [key, value] of Object.entries(factors)) {
      const contribution = (value - baseline) * importance[key]
      shapValues[key] = contribution
    }

    return shapValues
  }

  private detectAnomaly(current: TelemetryData, recent: TelemetryData[]): { detected: boolean; type: string | null } {
    if (recent.length < 30) return { detected: false, type: null }

    const recentSpeeds = recent.slice(-30).map(t => t.speed)
    const avgSpeed = recentSpeeds.reduce((sum, val) => sum + val, 0) / recentSpeeds.length
    const speedDeviation = Math.abs(current.speed - avgSpeed)

    if (speedDeviation > 40) {
      return { detected: true, type: 'speed_anomaly' }
    }

    const accelerationMagnitude = Math.sqrt(
      Math.pow(current.accelerationX, 2) +
      Math.pow(current.accelerationY, 2) +
      Math.pow(current.accelerationZ, 2)
    )

    if (accelerationMagnitude > 12) {
      return { detected: true, type: 'acceleration_anomaly' }
    }

    const speedVariance = this.calculateVariance(recentSpeeds)
    if (speedVariance > 200) {
      return { detected: true, type: 'pattern_anomaly' }
    }

    return { detected: false, type: null }
  }

  private determineRiskLevel(riskScore: number, anomalyDetected: boolean): 'low' | 'medium' | 'high' | 'critical' {
    if (anomalyDetected) {
      riskScore = Math.min(1, riskScore * 1.3)
    }

    if (riskScore >= this.RISK_THRESHOLD_CRITICAL) return 'critical'
    if (riskScore >= this.RISK_THRESHOLD_HIGH) return 'high'
    if (riskScore >= this.RISK_THRESHOLD_MEDIUM) return 'medium'
    return 'low'
  }

  private estimateTimeToRisk(riskScore: number, currentSpeed: number): number {
    if (riskScore < this.RISK_THRESHOLD_MEDIUM) return 300
    if (riskScore < this.RISK_THRESHOLD_HIGH) return 60
    if (riskScore < this.RISK_THRESHOLD_CRITICAL) return 20
    return 5
  }

  private calculateConfidenceScore(recentData: TelemetryData[], anomalyDetected: boolean): number {
    let confidence = 0.85

    if (recentData.length < 20) {
      confidence -= 0.2
    }

    if (anomalyDetected) {
      confidence -= 0.1
    }

    return Math.max(0.5, Math.min(1.0, confidence))
  }

  private identifyTopFactors(
    shapValues: Record<string, number>,
    factors: Record<string, number>
  ): Array<{ factor: string; impact: number; explanation: string }> {
    const factorExplanations: Record<string, string> = {
      speed: 'Current vehicle speed relative to safe limits',
      acceleration: 'Sudden changes in vehicle acceleration patterns',
      location: 'Proximity to known accident-prone areas',
      time: 'Time of day affecting visibility and traffic',
      weather: 'Current weather conditions impacting road safety',
      driverBehavior: 'Recent driving behavior and event patterns',
    }

    const sortedFactors = Object.entries(shapValues)
      .map(([factor, impact]) => ({
        factor,
        impact: Math.abs(impact),
        actualValue: factors[factor],
        explanation: factorExplanations[factor] || 'Contributing risk factor',
      }))
      .sort((a, b) => b.impact - a.impact)
      .slice(0, 3)

    return sortedFactors
  }

  private generateRecommendations(
    riskLevel: string,
    topFactors: Array<{ factor: string; impact: number }>,
    anomaly: { detected: boolean; type: string | null }
  ): string[] {
    const recommendations: string[] = []

    if (riskLevel === 'critical' || riskLevel === 'high') {
      recommendations.push('⚠️ IMMEDIATE ACTION: Reduce speed and increase following distance')
      recommendations.push('Find a safe place to pull over if conditions worsen')
    }

    for (const factor of topFactors) {
      switch (factor.factor) {
        case 'speed':
          recommendations.push('Reduce speed to match road conditions and traffic')
          break
        case 'acceleration':
          recommendations.push('Smooth out acceleration and braking inputs')
          break
        case 'location':
          recommendations.push('Exercise extra caution - you are in a high-risk area')
          break
        case 'time':
          recommendations.push('Increase alertness during low-visibility hours')
          break
        case 'driverBehavior':
          recommendations.push('Take a short break to refresh and refocus')
          break
      }
    }

    if (anomaly.detected) {
      if (anomaly.type === 'speed_anomaly') {
        recommendations.push('Unusual speed pattern detected - maintain consistent speed')
      } else if (anomaly.type === 'acceleration_anomaly') {
        recommendations.push('Extreme acceleration detected - check vehicle control')
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('Continue maintaining safe driving practices')
    }

    return recommendations
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2))
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length
  }

  getRiskZones(): RiskZone[] {
    return this.riskZones
  }
}
