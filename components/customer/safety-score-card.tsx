import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Customer } from "@/lib/types"
import { Shield, TrendingUp, Award, AlertTriangle } from "lucide-react"

interface SafetyScoreCardProps {
  customer: Customer
}

export function SafetyScoreCard({ customer }: SafetyScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <Award className="h-8 w-8 text-green-600" />
    if (score >= 75) return <Shield className="h-8 w-8 text-yellow-600" />
    return <AlertTriangle className="h-8 w-8 text-red-600" />
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent"
    if (score >= 75) return "Good"
    if (score >= 60) return "Average"
    return "Needs Improvement"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          AI Safety Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">{getScoreIcon(customer.safetyScore)}</div>
          <div className={`text-4xl font-bold ${getScoreColor(customer.safetyScore)}`}>{customer.safetyScore}</div>
          <div className="text-sm text-gray-600 mt-1">{getScoreLabel(customer.safetyScore)} Driver</div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Safety</span>
              <span className="font-medium">{customer.safetyScore}%</span>
            </div>
            <Progress value={customer.safetyScore} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Speed Compliance</span>
              <span className="font-medium">85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Traffic Rules</span>
              <span className="font-medium">92%</span>
            </div>
            <Progress value={92} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Document Compliance</span>
              <span className="font-medium">88%</span>
            </div>
            <Progress value={88} className="h-2" />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">AI Insights</span>
          </div>
          <p className="text-sm text-blue-800">
            Your safety score has improved by 5 points this month. Keep maintaining safe speeds and following traffic
            rules to reach the excellent driver category.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
