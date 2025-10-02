"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { mockCustomers, mockVehicles, mockChallans } from "@/lib/mock-data"
import { formatDate } from "@/lib/utils/date-utils"
import { Users, Car, FileText, TrendingUp, AlertTriangle, Search, Activity, Brain } from "lucide-react"
import { CustomerDetailsModal } from "./customer-details-modal"
import { CompanyAnalytics } from "./company-analytics"
import { DrivingBehaviorAnalytics } from "./driving-behavior-analytics"
import { CustomersTable } from "./customers-table"
import { CompanyAIInsights } from "../ai/company-ai-insights"

export function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)

  const totalCustomers = mockCustomers.length
  const totalVehicles = mockVehicles.length
  const totalChallans = mockChallans.length
  const totalFines = mockChallans.reduce((sum, c) => sum + c.amount, 0)
  const pendingChallans = mockChallans.filter((c) => c.status === "pending" || c.status === "overdue").length
  const averageSafetyScore = Math.round(mockCustomers.reduce((sum, c) => sum + c.safetyScore, 0) / mockCustomers.length)
  const highRiskCustomers = mockCustomers.filter((c) => c.safetyScore < 70).length
  const topPerformers = mockCustomers.filter((c) => c.safetyScore >= 90).length

  // Filter customers based on search
  const filteredCustomers = mockCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="premium-card rounded-lg p-6 text-white border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold instagram-gradient-text">AI-Powered Admin Dashboard</h1>
            <p className="text-slate-300 mt-2 text-lg">Comprehensive fleet management and AI-driven safety analytics</p>
          </div>
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="premium-card border-white/10 hover:neon-glow-purple transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Customers</p>
                <p className="text-3xl font-bold instagram-gradient-text">{totalCustomers}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 neon-glow">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="premium-card border-white/10 hover:neon-glow-green transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Vehicles</p>
                <p className="text-3xl font-bold text-green-400">{totalVehicles}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 neon-glow-green">
                <Car className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="premium-card border-white/10 hover:neon-glow-orange transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Challans</p>
                <p className="text-3xl font-bold text-orange-400">{totalChallans}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 neon-glow-orange">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="premium-card border-white/10 hover:neon-glow-blue transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">AI Safety Score</p>
                <p className="text-3xl font-bold text-blue-400">{averageSafetyScore}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 neon-glow-blue">
                <Brain className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="customers" className="space-y-4">
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

        <TabsContent value="customers" className="space-y-4">
          <Card className="premium-card border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 neon-glow">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  Customer Management
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
                        className="flex items-center justify-between p-4 premium-glass rounded-lg border-white/10"
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
                        className="flex items-center justify-between p-4 premium-glass rounded-lg border-white/10"
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Violations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockChallans.slice(0, 5).map((challan) => {
                    const customer = mockCustomers.find((c) => c.id === challan.customerId)
                    return (
                      <div key={challan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{challan.violationType}</p>
                          <p className="text-xs text-gray-600">{customer?.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">₹{challan.amount}</p>
                          <p className="text-xs text-gray-600">{formatDate(challan.date)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{pendingChallans}</p>
                    <p className="text-sm text-blue-800">Pending Challans</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">₹{totalFines}</p>
                    <p className="text-sm text-green-800">Total Fines</p>
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{averageSafetyScore}%</p>
                  <p className="text-sm text-purple-800">AI Safety Average</p>
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
