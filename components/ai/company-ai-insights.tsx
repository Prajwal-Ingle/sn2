"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { generateCompanyInsights } from "@/lib/ai-safety-scoring"
import { mockCustomers } from "@/lib/mock-data"
import { Brain, TrendingUp, AlertTriangle, Award, Target, Users } from "lucide-react"

export function CompanyAIInsights() {
  const insights = generateCompanyInsights()
  const avgSafetyScore = Math.round(mockCustomers.reduce((sum, c) => sum + c.safetyScore, 0) / mockCustomers.length)

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "declining":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Target className="h-4 w-4 text-blue-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return "text-green-600 bg-green-100"
      case "declining":
        return "text-red-600 bg-red-100"
      default:
        return "text-blue-600 bg-blue-100"
    }
  }

  return (
    <div className="space-y-6">
      {/* Company Safety Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Company Safety Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{avgSafetyScore}</div>
            <div className="text-sm text-gray-600 mb-4">Company Average Safety Score</div>
            <div className="flex items-center justify-center gap-2">
              <Badge className={getTrendColor(insights.overallSafetyTrend)}>
                {getTrendIcon(insights.overallSafetyTrend)}
                <span className="ml-1">{insights.overallSafetyTrend.toUpperCase()}</span>
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Company Safety Performance</span>
              <span className="font-medium">{avgSafetyScore}%</span>
            </div>
            <Progress value={avgSafetyScore} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Risk Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            AI-Identified Risk Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.riskAreas.map((area, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-800">{area}</span>
                </div>
                <Badge variant="destructive">High Priority</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            AI-Recognized Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">{performer}</span>
                </div>
                <Badge variant="default">Excellent Driver</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Strategic Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-800">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fleet Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            AI Fleet Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{mockCustomers.length}</p>
              <p className="text-sm text-blue-800">Active Drivers</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {mockCustomers.filter((c) => c.safetyScore >= 90).length}
              </p>
              <p className="text-sm text-green-800">Excellent Drivers</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {mockCustomers.filter((c) => c.safetyScore >= 75 && c.safetyScore < 90).length}
              </p>
              <p className="text-sm text-yellow-800">Good Drivers</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">
                {mockCustomers.filter((c) => c.safetyScore < 75).length}
              </p>
              <p className="text-sm text-red-800">Need Improvement</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
