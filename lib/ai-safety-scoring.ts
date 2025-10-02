import type { DrivingBehavior, Challan, Vehicle } from "./types"
import { mockDrivingBehavior, mockChallans, mockVehicles } from "./mock-data"
import { isExpired, isExpiringSoon } from "./utils/date-utils"

export interface SafetyFactors {
  speedCompliance: number
  trafficRuleCompliance: number
  documentCompliance: number
  drivingBehavior: number
  violationHistory: number
}

export interface AIInsight {
  type: "warning" | "improvement" | "achievement" | "recommendation"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  actionable: boolean
}

export interface SafetyAnalysis {
  overallScore: number
  factors: SafetyFactors
  insights: AIInsight[]
  riskLevel: "low" | "medium" | "high"
  recommendations: string[]
  trend: "improving" | "stable" | "declining"
}

// AI-powered safety score calculation
export function calculateAISafetyScore(customerId: string): SafetyAnalysis {
  const customerVehicles = mockVehicles.filter((v) => v.customerId === customerId)
  const customerChallans = mockChallans.filter((c) => c.customerId === customerId)
  const customerBehavior = mockDrivingBehavior.filter((b) => b.customerId === customerId)

  // Calculate individual factors
  const speedCompliance = calculateSpeedCompliance(customerBehavior)
  const trafficRuleCompliance = calculateTrafficRuleCompliance(customerChallans)
  const documentCompliance = calculateDocumentCompliance(customerVehicles)
  const drivingBehavior = calculateDrivingBehaviorScore(customerBehavior)
  const violationHistory = calculateViolationHistoryScore(customerChallans)

  const factors: SafetyFactors = {
    speedCompliance,
    trafficRuleCompliance,
    documentCompliance,
    drivingBehavior,
    violationHistory,
  }

  // Weighted overall score
  const overallScore = Math.round(
    speedCompliance * 0.25 +
      trafficRuleCompliance * 0.25 +
      documentCompliance * 0.15 +
      drivingBehavior * 0.25 +
      violationHistory * 0.1,
  )

  // Generate AI insights
  const insights = generateAIInsights(factors, customerChallans, customerBehavior, customerVehicles)

  // Determine risk level
  const riskLevel = overallScore >= 80 ? "low" : overallScore >= 60 ? "medium" : "high"

  // Generate recommendations
  const recommendations = generateRecommendations(factors, insights)

  // Calculate trend (simplified for demo)
  const trend = overallScore >= 85 ? "improving" : overallScore >= 70 ? "stable" : "declining"

  return {
    overallScore,
    factors,
    insights,
    riskLevel,
    recommendations,
    trend,
  }
}

function calculateSpeedCompliance(behavior: DrivingBehavior[]): number {
  if (behavior.length === 0) return 85 // Default score

  const avgSpeedViolations =
    behavior.reduce((sum, b) => {
      // Penalize speeds over 80 km/h in urban areas
      const speedPenalty = b.maxSpeed > 80 ? (b.maxSpeed - 80) * 0.5 : 0
      return sum + speedPenalty
    }, 0) / behavior.length

  return Math.max(0, Math.min(100, 100 - avgSpeedViolations))
}

function calculateTrafficRuleCompliance(challans: Challan[]): number {
  if (challans.length === 0) return 95 // Perfect score for no violations

  // Recent violations have more weight
  const recentViolations = challans.filter((c) => {
    const challanDate = new Date(c.date)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    return challanDate > sixMonthsAgo
  })

  const violationPenalty = recentViolations.length * 15 + (challans.length - recentViolations.length) * 8
  return Math.max(0, Math.min(100, 100 - violationPenalty))
}

function calculateDocumentCompliance(vehicles: Vehicle[]): number {
  if (vehicles.length === 0) return 85

  let totalDocuments = 0
  let validDocuments = 0

  vehicles.forEach((vehicle) => {
    totalDocuments += 3 // RC, PUC, Insurance

    if (!isExpired(vehicle.rcExpiry)) validDocuments++
    if (!isExpired(vehicle.pucExpiry)) validDocuments++
    if (!isExpired(vehicle.insuranceExpiry)) validDocuments++

    // Penalty for expiring soon
    if (isExpiringSoon(vehicle.rcExpiry)) validDocuments -= 0.3
    if (isExpiringSoon(vehicle.pucExpiry)) validDocuments -= 0.3
    if (isExpiringSoon(vehicle.insuranceExpiry)) validDocuments -= 0.3
  })

  return Math.round((validDocuments / totalDocuments) * 100)
}

function calculateDrivingBehaviorScore(behavior: DrivingBehavior[]): number {
  if (behavior.length === 0) return 80

  const avgBehaviorScore =
    behavior.reduce((sum, b) => {
      let score = 100

      // Penalize risky behaviors
      score -= b.harshBraking * 5
      score -= b.rapidAcceleration * 4
      score -= b.sharpTurns * 3
      score -= b.phoneUsage * 10
      score -= b.nightDriving * 2

      return sum + Math.max(0, score)
    }, 0) / behavior.length

  return Math.round(avgBehaviorScore)
}

function calculateViolationHistoryScore(challans: Challan[]): number {
  if (challans.length === 0) return 100

  const paidChallans = challans.filter((c) => c.status === "paid").length
  const pendingChallans = challans.filter((c) => c.status === "pending" || c.status === "overdue").length

  // Reward prompt payment, penalize pending violations
  const paymentScore = challans.length > 0 ? (paidChallans / challans.length) * 100 : 100
  const pendingPenalty = pendingChallans * 10

  return Math.max(0, Math.min(100, paymentScore - pendingPenalty))
}

function generateAIInsights(
  factors: SafetyFactors,
  challans: Challan[],
  behavior: DrivingBehavior[],
  vehicles: Vehicle[],
): AIInsight[] {
  const insights: AIInsight[] = []

  // Speed compliance insights
  if (factors.speedCompliance < 70) {
    insights.push({
      type: "warning",
      title: "Speed Compliance Issue",
      description: "Your speed compliance score is below average. Consider maintaining speeds within limits.",
      impact: "high",
      actionable: true,
    })
  } else if (factors.speedCompliance > 90) {
    insights.push({
      type: "achievement",
      title: "Excellent Speed Control",
      description: "You maintain excellent speed discipline. Keep up the safe driving!",
      impact: "low",
      actionable: false,
    })
  }

  // Document compliance insights
  const expiringDocs = vehicles.filter(
    (v) => isExpiringSoon(v.rcExpiry) || isExpiringSoon(v.pucExpiry) || isExpiringSoon(v.insuranceExpiry),
  )

  if (expiringDocs.length > 0) {
    insights.push({
      type: "warning",
      title: "Documents Expiring Soon",
      description: `${expiringDocs.length} vehicle document(s) are expiring within 30 days. Renew them promptly.`,
      impact: "medium",
      actionable: true,
    })
  }

  // Driving behavior insights
  if (behavior.length > 0) {
    const avgHarshBraking = behavior.reduce((sum, b) => sum + b.harshBraking, 0) / behavior.length
    const avgPhoneUsage = behavior.reduce((sum, b) => sum + b.phoneUsage, 0) / behavior.length

    if (avgHarshBraking > 3) {
      insights.push({
        type: "recommendation",
        title: "Reduce Harsh Braking",
        description: "AI detected frequent harsh braking. Maintain safe following distance to improve safety.",
        impact: "medium",
        actionable: true,
      })
    }

    if (avgPhoneUsage > 1) {
      insights.push({
        type: "warning",
        title: "Phone Usage While Driving",
        description: "AI detected phone usage while driving. Use hands-free devices for safety.",
        impact: "high",
        actionable: true,
      })
    }
  }

  // Traffic rule compliance
  const recentViolations = challans.filter((c) => {
    const challanDate = new Date(c.date)
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    return challanDate > threeMonthsAgo
  })

  if (recentViolations.length === 0 && challans.length > 0) {
    insights.push({
      type: "improvement",
      title: "No Recent Violations",
      description: "Great improvement! No traffic violations in the last 3 months.",
      impact: "low",
      actionable: false,
    })
  }

  return insights
}

function generateRecommendations(factors: SafetyFactors, insights: AIInsight[]): string[] {
  const recommendations: string[] = []

  if (factors.speedCompliance < 80) {
    recommendations.push("Use cruise control on highways to maintain consistent speeds")
    recommendations.push("Install a speed monitoring app to get real-time alerts")
  }

  if (factors.drivingBehavior < 75) {
    recommendations.push("Practice smooth acceleration and braking techniques")
    recommendations.push("Take a defensive driving course to improve skills")
  }

  if (factors.documentCompliance < 90) {
    recommendations.push("Set calendar reminders for document renewal dates")
    recommendations.push("Keep digital copies of all vehicle documents")
  }

  if (factors.trafficRuleCompliance < 85) {
    recommendations.push("Review traffic rules and regulations regularly")
    recommendations.push("Use navigation apps that provide traffic rule reminders")
  }

  // Add AI-powered personalized recommendations
  const actionableInsights = insights.filter((i) => i.actionable && i.impact !== "low")
  if (actionableInsights.length > 0) {
    recommendations.push("Address high-priority AI insights to improve your safety score")
  }

  return recommendations.slice(0, 5) // Limit to top 5 recommendations
}

// Predictive analytics for risk assessment
export function predictRiskEvents(customerId: string): {
  riskScore: number
  predictedEvents: string[]
  preventionTips: string[]
} {
  const behavior = mockDrivingBehavior.filter((b) => b.customerId === customerId)
  const challans = mockChallans.filter((c) => c.customerId === customerId)

  let riskScore = 0
  const predictedEvents: string[] = []
  const preventionTips: string[] = []

  if (behavior.length > 0) {
    const avgHarshBraking = behavior.reduce((sum, b) => sum + b.harshBraking, 0) / behavior.length
    const avgPhoneUsage = behavior.reduce((sum, b) => sum + b.phoneUsage, 0) / behavior.length

    if (avgHarshBraking > 4) {
      riskScore += 25
      predictedEvents.push("Potential rear-end collision risk")
      preventionTips.push("Maintain 3-second following distance")
    }

    if (avgPhoneUsage > 2) {
      riskScore += 35
      predictedEvents.push("Distracted driving incident risk")
      preventionTips.push("Use hands-free devices or pull over for calls")
    }
  }

  // Pattern analysis from violation history
  const speedingViolations = challans.filter((c) => c.violationType.includes("Speed"))
  if (speedingViolations.length > 1) {
    riskScore += 20
    predictedEvents.push("Future speeding violation likely")
    preventionTips.push("Use speed limit alerts and cruise control")
  }

  return {
    riskScore: Math.min(100, riskScore),
    predictedEvents,
    preventionTips,
  }
}

// Company-wide AI analytics
export function generateCompanyInsights(): {
  overallSafetyTrend: "improving" | "stable" | "declining"
  riskAreas: string[]
  topPerformers: string[]
  recommendations: string[]
} {
  const allBehavior = mockDrivingBehavior
  const allChallans = mockChallans

  // Calculate trends
  const avgSafetyScore = allBehavior.reduce((sum, b) => sum + b.safetyScore, 0) / allBehavior.length
  const overallSafetyTrend = avgSafetyScore >= 80 ? "improving" : avgSafetyScore >= 70 ? "stable" : "declining"

  // Identify risk areas
  const riskAreas: string[] = []
  const violationTypes = allChallans.reduce(
    (acc, c) => {
      acc[c.violationType] = (acc[c.violationType] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  Object.entries(violationTypes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .forEach(([type]) => riskAreas.push(type))

  return {
    overallSafetyTrend,
    riskAreas,
    topPerformers: ["Kavya Nair", "Priya Sharma", "Ananya Das"], // Top 3 from mock data
    recommendations: [
      "Implement company-wide speed monitoring program",
      "Conduct monthly safety training sessions",
      "Introduce driver incentive programs for safe driving",
      "Deploy AI-powered fleet monitoring systems",
    ],
  }
}
