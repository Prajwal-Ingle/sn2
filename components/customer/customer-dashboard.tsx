"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { mockVehicles, mockChallans, mockDrivingBehavior, mockRecentTrips } from "@/lib/mock-data"
import { formatDate, getDocumentStatus } from "@/lib/utils/date-utils"
import type { Customer } from "@/lib/types"
import {
  Car,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Brain,
} from "lucide-react"
import { VehicleDetailsCard } from "./vehicle-details-card"
import { DocumentsCard } from "./documents-card"
import { ChallansCard } from "./challans-card"
import { SafetyScoreCard } from "./safety-score-card"
import { DrivingBehaviorChart } from "./driving-behavior-chart"
import { AISafetyInsights } from "../ai/ai-safety-insights"
import { RecentTripsCard } from "./recent-trips-card"
import { SpeedAnalyticsCard } from "./speed-analytics-card"
import { FuelEfficiencyCard } from "./fuel-efficiency-card"
import { RouteAnalyticsCard } from "./route-analytics-card"
import { LiveTelemetryMonitor } from "../ai/live-telemetry-monitor"
import { AIPredictionsDashboard } from "../ai/ai-predictions-dashboard"
import { SafetyReportsViewer } from "../ai/safety-reports-viewer"

export function CustomerDashboard() {
  const { user } = useAuth()
  const customer = user as Customer

  // Get customer's data
  const customerVehicles = mockVehicles.filter((v) => v.customerId === customer.id)
  const customerChallans = mockChallans.filter((c) => c.customerId === customer.id)
  const customerBehavior = mockDrivingBehavior.filter((b) => b.customerId === customer.id)
  const customerTrips = mockRecentTrips.filter((t) => t.customerId === customer.id)

  // Calculate statistics
  const totalChallans = customerChallans.length
  const pendingChallans = customerChallans.filter((c) => c.status === "pending" || c.status === "overdue").length
  const totalFines = customerChallans.reduce((sum, c) => sum + c.amount, 0)
  const pendingFines = customerChallans
    .filter((c) => c.status === "pending" || c.status === "overdue")
    .reduce((sum, c) => sum + c.amount, 0)

  // Check for expiring documents
  const expiringDocuments = customerVehicles.filter(
    (v) =>
      getDocumentStatus(v.rcExpiry) === "expiring_soon" ||
      getDocumentStatus(v.pucExpiry) === "expiring_soon" ||
      getDocumentStatus(v.insuranceExpiry) === "expiring_soon",
  )

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="premium-card border-white/10 neon-glow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold instagram-gradient-text">Welcome back, {customer.name}!</h1>
            <p className="text-muted-foreground mt-2">Here's your AI-powered driving safety overview</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold instagram-gradient-text">{customer.safetyScore}</div>
            <div className="text-sm text-muted-foreground">AI Safety Score</div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {(pendingChallans > 0 || expiringDocuments.length > 0) && (
        <div className="space-y-3">
          {pendingChallans > 0 && (
            <Alert className="premium-glass border-orange-500/30 bg-orange-500/10">
              <AlertTriangle className="h-4 w-4 text-orange-400" />
              <AlertDescription className="text-orange-300">
                You have {pendingChallans} pending challan{pendingChallans > 1 ? "s" : ""} worth ₹{pendingFines}
              </AlertDescription>
            </Alert>
          )}
          {expiringDocuments.length > 0 && (
            <Alert className="premium-glass border-red-500/30 bg-red-500/10">
              <Clock className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                {expiringDocuments.length} document{expiringDocuments.length > 1 ? "s are" : " is"} expiring soon
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="premium-card border-white/10 hover:neon-glow-blue transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vehicles</p>
                <p className="text-3xl font-bold instagram-gradient-text">{customerVehicles.length}</p>
              </div>
              <div className="p-3 rounded-lg instagram-gradient neon-glow">
                <Car className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="premium-card border-white/10 hover:neon-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Challans</p>
                <p className="text-3xl font-bold text-orange-400">{totalChallans}</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-500/20 border border-orange-500/30">
                <FileText className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="premium-card border-white/10 hover:neon-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Fines</p>
                <p className="text-3xl font-bold text-red-400">₹{totalFines}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
                <CreditCard className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="premium-card border-white/10 hover:neon-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Safety Score</p>
                <p className="text-3xl font-bold text-purple-400">{customer.safetyScore}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
                <Brain className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="premium-glass border-white/10 grid w-full grid-cols-8">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:instagram-gradient data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger value="ai-blackbox" className="data-[state=active]:instagram-gradient data-[state=active]:text-white">
            AI Black Box
          </TabsTrigger>
          <TabsTrigger value="trips" className="data-[state=active]:instagram-gradient data-[state=active]:text-white">
            Trips
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:instagram-gradient data-[state=active]:text-white"
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="ai-insights"
            className="data-[state=active]:instagram-gradient data-[state=active]:text-white"
          >
            AI Insights
          </TabsTrigger>
          <TabsTrigger
            value="vehicles"
            className="data-[state=active]:instagram-gradient data-[state=active]:text-white"
          >
            Vehicles
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="data-[state=active]:instagram-gradient data-[state=active]:text-white"
          >
            Documents
          </TabsTrigger>
          <TabsTrigger
            value="challans"
            className="data-[state=active]:instagram-gradient data-[state=active]:text-white"
          >
            Challans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SafetyScoreCard customer={customer} />
            <DrivingBehaviorChart data={customerBehavior} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="premium-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 instagram-gradient-text">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 premium-glass rounded-lg border border-white/10">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-foreground">{customer.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 premium-glass rounded-lg border border-white/10">
                  <Phone className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-foreground">{customer.phone}</span>
                </div>
                <div className="flex items-center gap-3 p-3 premium-glass rounded-lg border border-white/10">
                  <MapPin className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-foreground">{customer.address}</span>
                </div>
                <div className="flex items-center gap-3 p-3 premium-glass rounded-lg border border-white/10">
                  <Calendar className="h-4 w-4 text-orange-400" />
                  <span className="text-sm text-foreground">License: {customer.licenseNumber}</span>
                </div>
                <div className="flex items-center gap-3 p-3 premium-glass rounded-lg border border-white/10">
                  <Clock className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-foreground">Expires: {formatDate(customer.licenseExpiry)}</span>
                </div>
              </CardContent>
            </Card>
            <Card className="premium-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 instagram-gradient-text">
                  <AlertTriangle className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customerChallans.slice(0, 3).map((challan) => (
                    <div
                      key={challan.id}
                      className="flex items-center justify-between p-4 premium-glass rounded-lg border border-white/10"
                    >
                      <div>
                        <p className="font-medium text-sm text-foreground">{challan.violationType}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(challan.date)}</p>
                      </div>
                      <Badge
                        variant={challan.status === "paid" ? "default" : "destructive"}
                        className={
                          challan.status === "paid"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                        }
                      >
                        {challan.status}
                      </Badge>
                    </div>
                  ))}
                  {customerChallans.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-400" />
                      <p className="text-sm">No recent violations. Great driving!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-blackbox" className="space-y-6">
          <Tabs defaultValue="live" className="space-y-4">
            <TabsList className="premium-glass border-white/10">
              <TabsTrigger value="live" className="data-[state=active]:instagram-gradient data-[state=active]:text-white">
                Live Monitor
              </TabsTrigger>
              <TabsTrigger value="predictions" className="data-[state=active]:instagram-gradient data-[state=active]:text-white">
                AI Predictions
              </TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:instagram-gradient data-[state=active]:text-white">
                Safety Reports
              </TabsTrigger>
            </TabsList>
            <TabsContent value="live">
              <LiveTelemetryMonitor />
            </TabsContent>
            <TabsContent value="predictions">
              <AIPredictionsDashboard />
            </TabsContent>
            <TabsContent value="reports">
              <SafetyReportsViewer />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="trips">
          {customerTrips && customerTrips.length > 0 ? (
            <RecentTripsCard trips={customerTrips} />
          ) : (
            <Card className="premium-card border-white/10">
              <CardContent className="text-center py-12">
                <div className="text-muted-foreground">
                  <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent trips found</p>
                  <p className="text-sm mt-2">Start driving to see your trip analytics here</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpeedAnalyticsCard customerId={customer.id} />
            <FuelEfficiencyCard customerId={customer.id} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RouteAnalyticsCard customerId={customer.id} />
            <DrivingBehaviorChart data={customerBehavior} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SafetyScoreCard customer={customer} />
            <Card className="premium-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 instagram-gradient-text">
                  <TrendingUp className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Speed</span>
                    <span className="font-medium">45 km/h</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Safe Driving Score</span>
                    <span className="font-medium">{customer.safetyScore}%</span>
                  </div>
                  <Progress value={customer.safetyScore} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Compliance Rate</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Fuel Efficiency</span>
                    <span className="font-medium">21.1 km/L</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights">
          <AISafetyInsights customer={customer} />
        </TabsContent>

        <TabsContent value="vehicles">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {customerVehicles.map((vehicle) => (
              <VehicleDetailsCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsCard vehicles={customerVehicles} customer={customer} />
        </TabsContent>

        <TabsContent value="challans">
          <ChallansCard challans={customerChallans} vehicles={customerVehicles} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
