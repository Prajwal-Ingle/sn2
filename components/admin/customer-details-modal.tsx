"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockCustomers, mockVehicles, mockChallans, mockDrivingBehavior } from "@/lib/mock-data"
import { formatDate, getDocumentStatus } from "@/lib/utils/date-utils"
import { User, Car, FileText, TrendingUp, Phone, Mail, MapPin, Calendar } from "lucide-react"

interface CustomerDetailsModalProps {
  customerId: string
  isOpen: boolean
  onClose: () => void
}

export function CustomerDetailsModal({ customerId, isOpen, onClose }: CustomerDetailsModalProps) {
  const customer = mockCustomers.find((c) => c.id === customerId)
  const customerVehicles = mockVehicles.filter((v) => v.customerId === customerId)
  const customerChallans = mockChallans.filter((c) => c.customerId === customerId)
  const customerBehavior = mockDrivingBehavior.filter((b) => b.customerId === customerId)

  if (!customer) return null

  const totalFines = customerChallans.reduce((sum, c) => sum + c.amount, 0)
  const pendingFines = customerChallans
    .filter((c) => c.status === "pending" || c.status === "overdue")
    .reduce((sum, c) => sum + c.amount, 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {customer.name} - Customer Details
          </DialogTitle>
          <DialogDescription>Complete customer profile and driving analytics</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="challans">Challans</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{customer.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Joined: {formatDate(customer.joinDate)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">License & Safety</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">License Number</p>
                    <p className="text-sm">{customer.licenseNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">License Expiry</p>
                    <p className="text-sm">{formatDate(customer.licenseExpiry)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Safety Score</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{customer.safetyScore}</span>
                      <Badge variant={customer.safetyScore >= 80 ? "default" : "destructive"}>
                        {customer.safetyScore >= 80 ? "Good" : "Needs Improvement"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-xl font-bold text-blue-600">{customerVehicles.length}</p>
                    <p className="text-sm text-blue-800">Vehicles</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-xl font-bold text-orange-600">{customerChallans.length}</p>
                    <p className="text-sm text-orange-800">Total Challans</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-xl font-bold text-red-600">₹{totalFines}</p>
                    <p className="text-sm text-red-800">Total Fines</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xl font-bold text-yellow-600">₹{pendingFines}</p>
                    <p className="text-sm text-yellow-800">Pending Fines</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customerVehicles.map((vehicle) => (
                <Card key={vehicle.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Car className="h-5 w-5" />
                      {vehicle.make} {vehicle.model}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Year:</span> {vehicle.year}
                      </div>
                      <div>
                        <span className="font-medium">Color:</span> {vehicle.color}
                      </div>
                      <div>
                        <span className="font-medium">Plate:</span> {vehicle.plateNumber}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {vehicle.vehicleType}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">RC Certificate</span>
                        <Badge variant={getDocumentStatus(vehicle.rcExpiry) === "valid" ? "default" : "destructive"}>
                          {formatDate(vehicle.rcExpiry)}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">PUC Certificate</span>
                        <Badge variant={getDocumentStatus(vehicle.pucExpiry) === "valid" ? "default" : "destructive"}>
                          {formatDate(vehicle.pucExpiry)}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Insurance</span>
                        <Badge
                          variant={getDocumentStatus(vehicle.insuranceExpiry) === "valid" ? "default" : "destructive"}
                        >
                          {formatDate(vehicle.insuranceExpiry)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="challans" className="space-y-4">
            {customerChallans.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No traffic challans found</p>
                  <p className="text-sm text-gray-500">This customer has a clean driving record!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {customerChallans.map((challan) => (
                  <Card key={challan.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{challan.violationType}</h3>
                            <Badge
                              variant={
                                challan.status === "paid"
                                  ? "default"
                                  : challan.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {challan.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                            <div>Date: {formatDate(challan.date)}</div>
                            <div>Location: {challan.location}</div>
                            <div>Amount: ₹{challan.amount}</div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{challan.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="behavior" className="space-y-4">
            {customerBehavior.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No driving behavior data available</p>
                  <p className="text-sm text-gray-500">Data will appear once the customer starts using the system</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {customerBehavior.map((behavior) => (
                  <Card key={behavior.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">Trip on {formatDate(behavior.date)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-lg font-bold text-blue-600">{behavior.tripDistance} km</p>
                          <p className="text-sm text-blue-800">Distance</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-lg font-bold text-green-600">{behavior.avgSpeed} km/h</p>
                          <p className="text-sm text-green-800">Avg Speed</p>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <p className="text-lg font-bold text-orange-600">{behavior.harshBraking}</p>
                          <p className="text-sm text-orange-800">Harsh Braking</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <p className="text-lg font-bold text-purple-600">{behavior.safetyScore}</p>
                          <p className="text-sm text-purple-800">Safety Score</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
