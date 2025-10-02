import type { AccidentPrediction } from './accident-predictor'
import type { DrivingEvent } from './driver-behavior-analyzer'

export interface Alert {
  id: string
  type: 'overspeeding' | 'harsh_braking' | 'accident_risk' | 'fatigue' | 'distracted_driving' | 'sharp_turn' | 'anomaly' | 'risk_zone'
  severity: 'info' | 'warning' | 'danger' | 'critical'
  timestamp: Date
  location: { lat: number; lng: number }
  message: string
  explanation: string
  aiReasoning: {
    primaryFactors: string[]
    contributingElements: Record<string, any>
    riskScore?: number
    confidenceLevel: number
  }
  recommendedAction: string
  isRead: boolean
  isAcknowledged: boolean
}

export class RealTimeAlertSystem {
  private alerts: Alert[] = []
  private alertCallbacks: Array<(alert: Alert) => void> = []

  subscribeToAlerts(callback: (alert: Alert) => void): () => void {
    this.alertCallbacks.push(callback)

    return () => {
      this.alertCallbacks = this.alertCallbacks.filter(cb => cb !== callback)
    }
  }

  processAccidentPrediction(prediction: AccidentPrediction, location: { lat: number; lng: number }): void {
    if (prediction.riskLevel === 'high' || prediction.riskLevel === 'critical') {
      const alert = this.createAccidentRiskAlert(prediction, location)
      this.emitAlert(alert)
    }

    if (prediction.anomalyDetected) {
      const anomalyAlert = this.createAnomalyAlert(prediction, location)
      this.emitAlert(anomalyAlert)
    }
  }

  processDrivingEvent(event: DrivingEvent): void {
    if (event.severity === 'high' || event.severity === 'critical') {
      const alert = this.createDrivingEventAlert(event)
      this.emitAlert(alert)
    }
  }

  createCustomAlert(params: {
    type: Alert['type']
    severity: Alert['severity']
    location: { lat: number; lng: number }
    message: string
    explanation: string
    factors: string[]
    data: Record<string, any>
  }): Alert {
    const alert: Alert = {
      id: this.generateAlertId(),
      type: params.type,
      severity: params.severity,
      timestamp: new Date(),
      location: params.location,
      message: params.message,
      explanation: params.explanation,
      aiReasoning: {
        primaryFactors: params.factors,
        contributingElements: params.data,
        confidenceLevel: 0.85,
      },
      recommendedAction: this.getRecommendedAction(params.type, params.severity),
      isRead: false,
      isAcknowledged: false,
    }

    this.emitAlert(alert)
    return alert
  }

  private createAccidentRiskAlert(prediction: AccidentPrediction, location: { lat: number; lng: number }): Alert {
    const severity = this.mapRiskLevelToSeverity(prediction.riskLevel)

    const topFactors = prediction.explainability.topFactors
      .map(f => `${f.factor}: ${f.explanation}`)

    let message = ''
    let explanation = ''

    if (prediction.riskLevel === 'critical') {
      message = '🚨 CRITICAL ACCIDENT RISK DETECTED'
      explanation = `Our AI detected a ${(prediction.riskScore * 100).toFixed(1)}% accident risk. Immediate action required within ${prediction.timeToRisk} seconds!`
    } else if (prediction.riskLevel === 'high') {
      message = '⚠️ HIGH ACCIDENT RISK DETECTED'
      explanation = `Elevated accident risk (${(prediction.riskScore * 100).toFixed(1)}%) identified. Take precautions within ${prediction.timeToRisk} seconds.`
    }

    return {
      id: this.generateAlertId(),
      type: 'accident_risk',
      severity,
      timestamp: new Date(),
      location,
      message,
      explanation,
      aiReasoning: {
        primaryFactors: topFactors,
        contributingElements: {
          model: prediction.predictionModel,
          factors: prediction.contributingFactors,
          shapValues: prediction.explainability.shapValues,
        },
        riskScore: prediction.riskScore,
        confidenceLevel: prediction.confidenceScore,
      },
      recommendedAction: prediction.recommendations[0] || 'Slow down and increase alertness',
      isRead: false,
      isAcknowledged: false,
    }
  }

  private createAnomalyAlert(prediction: AccidentPrediction, location: { lat: number; lng: number }): Alert {
    let message = '⚠️ DRIVING ANOMALY DETECTED'
    let explanation = ''

    switch (prediction.anomalyType) {
      case 'speed_anomaly':
        explanation = 'Unusual speed pattern detected that differs significantly from your normal driving behavior'
        break
      case 'acceleration_anomaly':
        explanation = 'Abnormal acceleration pattern detected that may indicate loss of vehicle control'
        break
      case 'pattern_anomaly':
        explanation = 'Irregular driving pattern detected that deviates from safe driving norms'
        break
      default:
        explanation = 'An unusual driving pattern has been detected by our AI system'
    }

    return {
      id: this.generateAlertId(),
      type: 'anomaly',
      severity: 'warning',
      timestamp: new Date(),
      location,
      message,
      explanation,
      aiReasoning: {
        primaryFactors: [prediction.anomalyType || 'unknown'],
        contributingElements: {
          model: prediction.predictionModel,
          confidence: prediction.confidenceScore,
        },
        confidenceLevel: prediction.confidenceScore,
      },
      recommendedAction: 'Check vehicle systems and adjust driving to normal patterns',
      isRead: false,
      isAcknowledged: false,
    }
  }

  private createDrivingEventAlert(event: DrivingEvent): Alert {
    const severity = this.mapEventSeverityToAlertSeverity(event.severity)

    let message = ''
    let recommendedAction = ''

    switch (event.type) {
      case 'harsh_braking':
        message = '🛑 Harsh Braking Detected'
        recommendedAction = 'Maintain safe following distance and anticipate traffic flow'
        break
      case 'rapid_acceleration':
        message = '⚡ Rapid Acceleration Detected'
        recommendedAction = 'Apply gradual acceleration for better fuel efficiency and safety'
        break
      case 'sharp_turn':
        message = '↪️ Sharp Turn at High Speed'
        recommendedAction = 'Reduce speed before turns to prevent rollover risk'
        break
      case 'overspeeding':
        message = '🚗💨 Overspeeding Detected'
        recommendedAction = 'Reduce speed to legal limits immediately'
        break
      case 'phone_usage':
        message = '📱 Phone Usage While Driving'
        recommendedAction = 'Pull over safely if you need to use your phone'
        break
      case 'fatigue':
        message = '😴 Driver Fatigue Detected'
        recommendedAction = 'Take a 15-20 minute break immediately'
        break
      case 'distracted_driving':
        message = '👁️ Distracted Driving Detected'
        recommendedAction = 'Keep full attention on the road at all times'
        break
    }

    return {
      id: this.generateAlertId(),
      type: event.type,
      severity,
      timestamp: event.timestamp,
      location: event.location,
      message,
      explanation: event.explanation,
      aiReasoning: {
        primaryFactors: event.aiReasoning.factors || [],
        contributingElements: event.aiReasoning,
        confidenceLevel: 0.9,
      },
      recommendedAction,
      isRead: false,
      isAcknowledged: false,
    }
  }

  private emitAlert(alert: Alert): void {
    this.alerts.unshift(alert)

    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(0, 100)
    }

    this.alertCallbacks.forEach(callback => {
      try {
        callback(alert)
      } catch (error) {
        console.error('Error in alert callback:', error)
      }
    })
  }

  private mapRiskLevelToSeverity(riskLevel: string): Alert['severity'] {
    switch (riskLevel) {
      case 'critical':
        return 'critical'
      case 'high':
        return 'danger'
      case 'medium':
        return 'warning'
      default:
        return 'info'
    }
  }

  private mapEventSeverityToAlertSeverity(eventSeverity: string): Alert['severity'] {
    switch (eventSeverity) {
      case 'critical':
        return 'critical'
      case 'high':
        return 'danger'
      case 'medium':
        return 'warning'
      default:
        return 'info'
    }
  }

  private getRecommendedAction(type: Alert['type'], severity: Alert['severity']): string {
    if (severity === 'critical') {
      return 'IMMEDIATE ACTION REQUIRED: Find safe location to stop'
    }

    const actions: Record<Alert['type'], string> = {
      overspeeding: 'Reduce speed to legal limits',
      harsh_braking: 'Maintain safe following distance',
      accident_risk: 'Increase alertness and reduce speed',
      fatigue: 'Take a break for 15-20 minutes',
      distracted_driving: 'Focus completely on driving',
      sharp_turn: 'Slow down before turning',
      anomaly: 'Check vehicle and adjust driving',
      risk_zone: 'Exercise extra caution in this area',
    }

    return actions[type] || 'Drive carefully and stay alert'
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  getAlerts(filters?: { unreadOnly?: boolean; severity?: Alert['severity'] }): Alert[] {
    let filtered = [...this.alerts]

    if (filters?.unreadOnly) {
      filtered = filtered.filter(a => !a.isRead)
    }

    if (filters?.severity) {
      filtered = filtered.filter(a => a.severity === filters.severity)
    }

    return filtered
  }

  markAlertAsRead(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.isRead = true
    }
  }

  acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.isAcknowledged = true
      alert.isRead = true
    }
  }

  clearAlerts(): void {
    this.alerts = []
  }

  getUnreadCount(): number {
    return this.alerts.filter(a => !a.isRead).length
  }

  getCriticalAlerts(): Alert[] {
    return this.alerts.filter(a => a.severity === 'critical' && !a.isAcknowledged)
  }
}

export const alertSystem = new RealTimeAlertSystem()
