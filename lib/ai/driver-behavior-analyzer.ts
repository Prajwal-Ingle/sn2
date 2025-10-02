export interface TelemetryData {
  timestamp: Date
  speed: number
  accelerationX: number
  accelerationY: number
  accelerationZ: number
  latitude: number
  longitude: number
  rpm?: number
  throttlePosition?: number
  brakePressure?: number
  steeringAngle?: number
}

export interface DrivingEvent {
  type: 'harsh_braking' | 'rapid_acceleration' | 'sharp_turn' | 'overspeeding' | 'phone_usage' | 'fatigue' | 'distracted_driving'
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: Date
  location: { lat: number; lng: number }
  speedAtEvent: number
  accelerationMagnitude?: number
  explanation: string
  aiReasoning: Record<string, any>
}

export interface BehaviorAnalysisResult {
  overallScore: number
  riskLevel: 'safe' | 'moderate' | 'risky' | 'dangerous'
  events: DrivingEvent[]
  insights: {
    overspeedingIncidents: number
    harshBrakingCount: number
    rapidAccelerationCount: number
    sharpTurnCount: number
    phoneUsageDetected: boolean
    fatigueDetected: boolean
    distractedDrivingEvents: number
    aggressiveDrivingScore: number
    smoothDrivingScore: number
    attentionScore: number
  }
  recommendations: string[]
}

export class DriverBehaviorAnalyzer {
  private readonly SPEED_LIMIT_URBAN = 60
  private readonly SPEED_LIMIT_HIGHWAY = 100
  private readonly HARSH_BRAKING_THRESHOLD = -8
  private readonly RAPID_ACCELERATION_THRESHOLD = 4
  private readonly SHARP_TURN_THRESHOLD = 30

  analyzeBehavior(telemetryData: TelemetryData[]): BehaviorAnalysisResult {
    const events: DrivingEvent[] = []

    let overspeedingCount = 0
    let harshBrakingCount = 0
    let rapidAccelerationCount = 0
    let sharpTurnCount = 0

    for (let i = 1; i < telemetryData.length; i++) {
      const current = telemetryData[i]
      const previous = telemetryData[i - 1]

      const overspeedingEvent = this.detectOverspeeding(current)
      if (overspeedingEvent) {
        events.push(overspeedingEvent)
        overspeedingCount++
      }

      const brakingEvent = this.detectHarshBraking(current, previous)
      if (brakingEvent) {
        events.push(brakingEvent)
        harshBrakingCount++
      }

      const accelerationEvent = this.detectRapidAcceleration(current, previous)
      if (accelerationEvent) {
        events.push(accelerationEvent)
        rapidAccelerationCount++
      }

      const turnEvent = this.detectSharpTurn(current)
      if (turnEvent) {
        events.push(turnEvent)
        sharpTurnCount++
      }
    }

    const fatigueDetected = this.detectFatigue(telemetryData)
    const distractedDrivingEvents = this.detectDistractedDriving(telemetryData)

    const aggressiveDrivingScore = this.calculateAggressiveDrivingScore({
      overspeedingCount,
      harshBrakingCount,
      rapidAccelerationCount,
      sharpTurnCount,
    })

    const smoothDrivingScore = 100 - aggressiveDrivingScore
    const attentionScore = fatigueDetected ? 50 : 90

    const overallScore = this.calculateOverallScore({
      aggressiveDrivingScore,
      smoothDrivingScore,
      attentionScore,
      eventCount: events.length,
    })

    const riskLevel = this.determineRiskLevel(overallScore, events)
    const recommendations = this.generateRecommendations({
      overspeedingCount,
      harshBrakingCount,
      rapidAccelerationCount,
      sharpTurnCount,
      fatigueDetected,
      distractedDrivingEvents,
      riskLevel,
    })

    return {
      overallScore,
      riskLevel,
      events,
      insights: {
        overspeedingIncidents: overspeedingCount,
        harshBrakingCount,
        rapidAccelerationCount,
        sharpTurnCount,
        phoneUsageDetected: false,
        fatigueDetected,
        distractedDrivingEvents,
        aggressiveDrivingScore,
        smoothDrivingScore,
        attentionScore,
      },
      recommendations,
    }
  }

  private detectOverspeeding(data: TelemetryData): DrivingEvent | null {
    const speedLimit = data.speed > 80 ? this.SPEED_LIMIT_HIGHWAY : this.SPEED_LIMIT_URBAN
    const speedExcess = data.speed - speedLimit

    if (speedExcess > 0) {
      const severity = this.determineSpeedSeverity(speedExcess)
      return {
        type: 'overspeeding',
        severity,
        timestamp: data.timestamp,
        location: { lat: data.latitude, lng: data.longitude },
        speedAtEvent: data.speed,
        explanation: `Vehicle speed (${data.speed.toFixed(1)} km/h) exceeded limit (${speedLimit} km/h) by ${speedExcess.toFixed(1)} km/h`,
        aiReasoning: {
          speedLimit,
          actualSpeed: data.speed,
          excess: speedExcess,
          factors: ['speed_violation', 'safety_risk'],
        },
      }
    }
    return null
  }

  private detectHarshBraking(current: TelemetryData, previous: TelemetryData): DrivingEvent | null {
    const timeDiff = (current.timestamp.getTime() - previous.timestamp.getTime()) / 1000
    if (timeDiff === 0) return null

    const deceleration = (current.speed - previous.speed) / timeDiff * 3.6

    if (deceleration < this.HARSH_BRAKING_THRESHOLD) {
      const magnitude = Math.abs(deceleration)
      const severity = magnitude > 12 ? 'critical' : magnitude > 10 ? 'high' : 'medium'

      return {
        type: 'harsh_braking',
        severity,
        timestamp: current.timestamp,
        location: { lat: current.latitude, lng: current.longitude },
        speedAtEvent: current.speed,
        accelerationMagnitude: deceleration,
        explanation: `Harsh braking detected with deceleration of ${magnitude.toFixed(2)} m/s². This can cause accidents or discomfort.`,
        aiReasoning: {
          deceleration,
          magnitude,
          previousSpeed: previous.speed,
          currentSpeed: current.speed,
          factors: ['sudden_stop', 'passenger_safety', 'collision_risk'],
        },
      }
    }
    return null
  }

  private detectRapidAcceleration(current: TelemetryData, previous: TelemetryData): DrivingEvent | null {
    const timeDiff = (current.timestamp.getTime() - previous.timestamp.getTime()) / 1000
    if (timeDiff === 0) return null

    const acceleration = (current.speed - previous.speed) / timeDiff * 3.6

    if (acceleration > this.RAPID_ACCELERATION_THRESHOLD) {
      const severity = acceleration > 8 ? 'high' : acceleration > 6 ? 'medium' : 'low'

      return {
        type: 'rapid_acceleration',
        severity,
        timestamp: current.timestamp,
        location: { lat: current.latitude, lng: current.longitude },
        speedAtEvent: current.speed,
        accelerationMagnitude: acceleration,
        explanation: `Rapid acceleration detected (${acceleration.toFixed(2)} m/s²). This increases fuel consumption and wear.`,
        aiReasoning: {
          acceleration,
          previousSpeed: previous.speed,
          currentSpeed: current.speed,
          factors: ['aggressive_driving', 'fuel_efficiency', 'tire_wear'],
        },
      }
    }
    return null
  }

  private detectSharpTurn(data: TelemetryData): DrivingEvent | null {
    if (!data.steeringAngle) return null

    const angle = Math.abs(data.steeringAngle)

    if (angle > this.SHARP_TURN_THRESHOLD && data.speed > 40) {
      const severity = angle > 45 ? 'high' : 'medium'

      return {
        type: 'sharp_turn',
        severity,
        timestamp: data.timestamp,
        location: { lat: data.latitude, lng: data.longitude },
        speedAtEvent: data.speed,
        explanation: `Sharp turn at high speed (${data.speed.toFixed(1)} km/h with ${angle.toFixed(1)}° angle). Risk of rollover.`,
        aiReasoning: {
          steeringAngle: data.steeringAngle,
          speed: data.speed,
          factors: ['rollover_risk', 'loss_of_control', 'passenger_safety'],
        },
      }
    }
    return null
  }

  private detectFatigue(telemetryData: TelemetryData[]): boolean {
    if (telemetryData.length < 100) return false

    let inconsistentSpeedChanges = 0
    let microSleepIndicators = 0

    for (let i = 10; i < telemetryData.length - 10; i++) {
      const window = telemetryData.slice(i - 10, i + 10)
      const speedVariance = this.calculateVariance(window.map(d => d.speed))

      if (speedVariance > 100) {
        inconsistentSpeedChanges++
      }

      if (window[10].speed < window[5].speed - 10 && Math.abs(window[10].steeringAngle || 0) > 5) {
        microSleepIndicators++
      }
    }

    return inconsistentSpeedChanges > 20 || microSleepIndicators > 5
  }

  private detectDistractedDriving(telemetryData: TelemetryData[]): number {
    let distractedEvents = 0

    for (let i = 5; i < telemetryData.length - 5; i++) {
      const current = telemetryData[i]
      const window = telemetryData.slice(i - 5, i + 5)

      const steeringVariance = this.calculateVariance(window.map(d => d.steeringAngle || 0))
      const speedVariance = this.calculateVariance(window.map(d => d.speed))

      if (steeringVariance > 50 && speedVariance > 30) {
        distractedEvents++
      }
    }

    return Math.floor(distractedEvents / 10)
  }

  private calculateAggressiveDrivingScore(metrics: {
    overspeedingCount: number
    harshBrakingCount: number
    rapidAccelerationCount: number
    sharpTurnCount: number
  }): number {
    const totalEvents =
      metrics.overspeedingCount * 2 +
      metrics.harshBrakingCount * 3 +
      metrics.rapidAccelerationCount * 2 +
      metrics.sharpTurnCount * 2.5

    return Math.min(100, totalEvents * 5)
  }

  private calculateOverallScore(params: {
    aggressiveDrivingScore: number
    smoothDrivingScore: number
    attentionScore: number
    eventCount: number
  }): number {
    const baseScore = (params.smoothDrivingScore * 0.4 + params.attentionScore * 0.3 + (100 - params.aggressiveDrivingScore) * 0.3)
    const eventPenalty = Math.min(30, params.eventCount * 2)

    return Math.max(0, Math.min(100, baseScore - eventPenalty))
  }

  private determineRiskLevel(score: number, events: DrivingEvent[]): 'safe' | 'moderate' | 'risky' | 'dangerous' {
    const criticalEvents = events.filter(e => e.severity === 'critical').length

    if (criticalEvents > 0 || score < 40) return 'dangerous'
    if (score < 60) return 'risky'
    if (score < 80) return 'moderate'
    return 'safe'
  }

  private determineSpeedSeverity(excess: number): 'low' | 'medium' | 'high' | 'critical' {
    if (excess > 40) return 'critical'
    if (excess > 25) return 'high'
    if (excess > 15) return 'medium'
    return 'low'
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2))
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length
  }

  private generateRecommendations(params: {
    overspeedingCount: number
    harshBrakingCount: number
    rapidAccelerationCount: number
    sharpTurnCount: number
    fatigueDetected: boolean
    distractedDrivingEvents: number
    riskLevel: string
  }): string[] {
    const recommendations: string[] = []

    if (params.overspeedingCount > 5) {
      recommendations.push('Reduce speed and maintain within legal limits to improve safety and avoid fines')
    }

    if (params.harshBrakingCount > 3) {
      recommendations.push('Maintain safe following distance and anticipate traffic conditions to reduce harsh braking')
    }

    if (params.rapidAccelerationCount > 3) {
      recommendations.push('Apply gradual acceleration to improve fuel efficiency and reduce vehicle wear')
    }

    if (params.sharpTurnCount > 2) {
      recommendations.push('Reduce speed before turns and use smooth steering inputs')
    }

    if (params.fatigueDetected) {
      recommendations.push('Take breaks every 2 hours during long drives to prevent fatigue-related incidents')
    }

    if (params.distractedDrivingEvents > 2) {
      recommendations.push('Minimize distractions and keep full attention on the road at all times')
    }

    if (params.riskLevel === 'dangerous' || params.riskLevel === 'risky') {
      recommendations.push('Consider defensive driving training to improve overall safety score')
    }

    return recommendations
  }
}
