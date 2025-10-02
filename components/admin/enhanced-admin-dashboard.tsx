"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { mockCustomers, mockVehicles, mockChallans } from "@/lib/mock-data"
import { Users, Car, TrendingUp, AlertTriangle, Search, Brain, Filter, Download, RefreshCw } from "lucide-react"
import { CustomerDetailsModal } from "./customer-details-modal"
import { CompanyAnalytics } from "./company-analytics"
import { DrivingBehaviorAnalytics } from "./driving-behavior-analytics"
import { CustomersTable } from "./customers-table"
import { CompanyAIInsights } from "../ai/company-ai-insights"
import { InteractiveMetricsCard } from "./interactive-metrics-card"

export function EnhancedAdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const totalCustomers = mockCustomers.length
  const totalVehicles = mockVehicles.length
  const totalChallans = mockChallans.length
  const totalFines = mockChallans.reduce((sum, c) => sum + c.amount, 0)
  const pendingChallans = mockChallans.filter((c) => c.status === "pending" || c.status === "overdue").length
  const averageSafetyScore = Math.round(mockCustomers.reduce((sum, c) => sum + c.safetyScore, 0) / mockCustomers.length)
  const highRiskCustomers = mockCustomers.filter((c) => c.safetyScore < 70).length
  const topPerformers = mockCustomers.filter((c) => c.safetyScore >= 90).length

  // Mock trend data for interactive cards
  const customerTrendData = [
    { name: "Jan", value: 8 },
    { name: "Feb", value: 9 },
    { name: "Mar", value: 10 },
    { name: "Apr", value: 10 },
    { name: "May", value: 10 },
    { name: "Jun", value: 10 },
  ]

  const safetyTrendData = [
    { name: "Jan", value: 82 },
    { name: "Feb", value: 84 },
    { name: "Mar", value: 86 },
    { name: "Apr", value: 85 },
    { name: "May", value: 87 },
    { name: "Jun", value: 88 },
  ]

  const violationTrendData = [
    { name: "Jan", value: 8 },
    { name: "Feb", value: 6 },
    { name: "Mar", value: 5 },
    { name: "Apr", value: 4 },
    { name: "May", value: 5 },
    { name: "Jun", value: 5 },
  ]

  const vehicleTrendData = [
    { name: "Jan", value: 8 },
    { name: "Feb", value: 9 },
    { name: "Mar", value: 10 },
    { name: "Apr", value: 10 },
    { name: "May", value: 10 },
    { name: "Jun", value: 10 },
  ]

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  // Filter customers based on search
  const filteredCustomers = mockCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Enhanced Header Section */}
      <div className="premium-card rounded-lg p-6 text-white border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold instagram-gradient-text">AI-Powered Admin Dashboard</h1>
            <p className="text-slate-300 mt-2 text-lg">Comprehensive fleet management and AI-driven safety analytics</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="grid grid-cols-2 gap-4 text-right">
              <div className="premium-glass p-4 rounded-xl border-white/10">
                <div className="text-2xl font-bold text-green-400">{topPerformers}</div>
                <div className="text-sm text-slate-300">Top Performers</div>
              </div>
              <div className="premium-glass p-4 rounded-xl border-white/10">
                <div className="text-2xl font-bold text-red-400">{highRiskCustomers}</div>
                <div className="text-sm text-slate-300">High Risk</div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                className="premium-glass border-white/20 hover:bg-white/10"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button className="premium-glass border-white/20 hover:bg-white/10" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InteractiveMetricsCard
          title="Total Customers"
          value={totalCustomers}
          change={12}
          changeType="increase"
          icon={Users}
          color="from-pink-500 to-purple-500"
          data={customerTrendData}
          description="Growing customer base"
        />
        <InteractiveMetricsCard
          title="Fleet Vehicles"
          value={totalVehicles}
          change={8}
          changeType="increase"
          icon={Car}
          color="from-green-500 to-emerald-500"
          data={vehicleTrendData}
          description="Active vehicle registrations"
        />
        <InteractiveMetricsCard
          title="Safety Score"
          value={`${averageSafetyScore}%`}
          change={5}
          changeType="increase"
          icon={Brain}
          color="from-blue-500 to-purple-500"
          data={safetyTrendData}
          description="AI-powered safety analysis"
        />
        <InteractiveMetricsCard
          title="Violations"
          value={totalChallans}
          change={15}
          changeType="decrease"
          icon={AlertTriangle}
          color="from-orange-500 to-red-500"
          data={violationTrendData}
          description="Reduced violation incidents"
        />
      </div>

      {/* Enhanced Tabs */}
      <Tabs defaultValue="customers" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="premium-glass border-white/10 p-1 h-12">
            <TabsTrigger
              value="customers"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white h-10 px-6"
            >
              Customers
            </TabsTrigger>
            <TabsTrigger
              value="ai-insights"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white h-10 px-6"
            >
              AI Insights
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white h-10 px-6"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="behavior"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white h-10 px-6"
            >
              Driving Behavior
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white h-10 px-6"
            >
              Reports
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="premium-glass border-white/20 hover:bg-white/10 bg-transparent"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <TabsContent value="customers" className="space-y-4">
          <Card className="premium-card border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 neon-glow">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  Customer Management
                  <Badge variant="secondary" className="ml-2 premium-glass">
                    {filteredCustomers.length} results
                  </Badge>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64 premium-glass border-white/20 text-white placeholder:text-slate-400 focus:border-pink-500 focus:ring-pink-500/20"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CustomersTable
                customers={filteredCustomers}
                onViewCustomer={(customerId) => setSelectedCustomer(customerId)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights">
          <CompanyAIInsights />
        </TabsContent>

        <TabsContent value="analytics">
          <CompanyAnalytics />
        </TabsContent>

        <TabsContent value="behavior">
          <DrivingBehaviorAnalytics />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="premium-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 neon-glow">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  High-Risk Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockCustomers
                    .filter((c) => c.safetyScore < 80)
                    .slice(0, 5)
                    .map((customer) => (
                      <div
                        key={customer.id}
                        className="flex items-center justify-between p-4 premium-glass rounded-lg border-white/10 hover:border-white/20 transition-colors cursor-pointer"
                      >
                        <div>
                          <p className="font-medium text-sm text-white">{customer.name}</p>
                          <p className="text-xs text-slate-400">{customer.email}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">
                            {customer.safetyScore}
                          </Badge>
                          <p className="text-xs text-slate-400 mt-1">Safety Score</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 neon-glow-green">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockCustomers
                    .filter((c) => c.safetyScore >= 90)
                    .slice(0, 5)
                    .map((customer) => (
                      <div
                        key={customer.id}
                        className="flex items-center justify-between p-4 premium-glass rounded-lg border-white/10 hover:border-white/20 transition-colors cursor-pointer"
                      >
                        <div>
                          <p className="font-medium text-sm text-white">{customer.name}</p>
                          <p className="text-xs text-slate-400">{customer.email}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
                            {customer.safetyScore}
                          </Badge>
                          <p className="text-xs text-slate-400 mt-1">Safety Score</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <CustomerDetailsModal
          customerId={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          isOpen={!!selectedCustomer}
        />
      )}
    </div>
  )
}
