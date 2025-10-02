"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { calculateAISafetyScore, predictRiskEvents } from "@/lib/ai-safety-scoring"
import type { Customer } from "@/lib/types"
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Lightbulb, Shield, Target, Zap } from "lucide-react"

interface AISafetyInsightsProps {
  customer: Customer
}

export function AISafetyInsights({ customer }: AISafetyInsightsProps) {
  const safetyAnalysis = calculateAISafetyScore(customer.id)
  const riskPrediction = predictRiskEvents(customer.id)

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "improvement":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "achievement":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "recommendation":
        return <Lightbulb className="h-4 w-4 text-purple-600" />
      default:
        return <Brain className="h-4 w-4 text-gray-600" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "warning":
        return "border-orange-200 bg-orange-50"
      case "improvement":
        return "border-green-200 bg-green-50"
      case "achievement":
        return "border-blue-200 bg-blue-50"
      case "recommendation":
        return "border-purple-200 bg-purple-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "high":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Safety Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Safety Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{safetyAnalysis.overallScore}</div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge className={getRiskLevelColor(safetyAnalysis.riskLevel)}>
                {safetyAnalysis.riskLevel.toUpperCase()} RISK
              </Badge>
              <Badge variant="outline">{safetyAnalysis.trend.toUpperCase()}</Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Speed Compliance</span>
                <span className="font-medium">{safetyAnalysis.factors.speedCompliance}%</span>
              </div>
              <Progress value={safetyAnalysis.factors.speedCompliance} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Traffic Rule Compliance</span>
                <span className="font-medium">{safetyAnalysis.factors.trafficRuleCompliance}%</span>
              </div>
              <Progress value={safetyAnalysis.factors.trafficRuleCompliance} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Document Compliance</span>
                <span className="font-medium">{safetyAnalysis.factors.documentCompliance}%</span>
              </div>
              <Progress value={safetyAnalysis.factors.documentCompliance} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Driving Behavior</span>
                <span className="font-medium">{safetyAnalysis.factors.drivingBehavior}%</span>
              </div>
              <Progress value={safetyAnalysis.factors.drivingBehavior} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Violation History</span>
                <span className="font-medium">{safetyAnalysis.factors.violationHistory}%</span>
              </div>
              <Progress value={safetyAnalysis.factors.violationHistory} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {safetyAnalysis.insights.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <Brain className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">AI is analyzing your driving patterns...</p>
            </div>
          ) : (
            safetyAnalysis.insights.map((insight, index) => (
              <Alert key={index} className={getInsightColor(insight.type)}>
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {insight.impact} impact
                      </Badge>
                    </div>
                    <AlertDescription className="text-sm">{insight.description}</AlertDescription>
                  </div>
                </div>
              </Alert>
            ))
          )}
        </CardContent>
      </Card>

      {/* Risk Prediction */}
      {riskPrediction.riskScore > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Predictive Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Risk Score</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{riskPrediction.riskScore}%</span>
                <Badge variant={riskPrediction.riskScore > 50 ? "destructive" : "secondary"}>
                  {riskPrediction.riskScore > 50 ? "HIGH" : "MODERATE"}
                </Badge>
              </div>
            </div>
            <Progress value={riskPrediction.riskScore} className="h-2" />

            {riskPrediction.predictedEvents.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Predicted Risk Events:</h4>
                <ul className="space-y-1">
                  {riskPrediction.predictedEvents.map((event, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3 text-orange-500" />
                      {event}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {riskPrediction.preventionTips.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Prevention Tips:</h4>
                <ul className="space-y-1">
                  {riskPrediction.preventionTips.map((tip, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <Shield className="h-3 w-3 text-green-500" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {safetyAnalysis.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-800">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
