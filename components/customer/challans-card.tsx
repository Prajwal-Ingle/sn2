"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Challan, Vehicle } from "@/lib/types"
import { formatDate } from "@/lib/utils/date-utils"
import { FileText, Eye, MapPin, Calendar, CreditCard, AlertTriangle } from "lucide-react"

interface ChallansCardProps {
  challans: Challan[]
  vehicles: Vehicle[]
}

export function ChallansCard({ challans, vehicles }: ChallansCardProps) {
  const [selectedChallan, setSelectedChallan] = useState<Challan | null>(null)

  const getVehicleInfo = (vehicleId: string) => {
    return vehicles.find((v) => v.id === vehicleId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default"
      case "pending":
        return "secondary"
      case "overdue":
        return "destructive"
      default:
        return "default"
    }
  }

  const totalAmount = challans.reduce((sum, c) => sum + c.amount, 0)
  const pendingAmount = challans.filter((c) => c.status !== "paid").reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Challans</p>
                <p className="text-2xl font-bold">{challans.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold">₹{totalAmount}</p>
              </div>
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold">₹{pendingAmount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Challans List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Traffic Challans
          </CardTitle>
        </CardHeader>
        <CardContent>
          {challans.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No traffic challans found</p>
              <p className="text-sm text-gray-500">Keep up the safe driving!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {challans.map((challan) => {
                const vehicle = getVehicleInfo(challan.vehicleId)
                return (
                  <div key={challan.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{challan.violationType}</h3>
                          <Badge variant={getStatusColor(challan.status)}>{challan.status}</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(challan.date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {challan.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <CreditCard className="h-3 w-3" />₹{challan.amount}
                          </div>
                        </div>
                        {vehicle && (
                          <p className="text-sm text-gray-500 mt-1">
                            {vehicle.make} {vehicle.model} - {vehicle.plateNumber}
                          </p>
                        )}
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedChallan(challan)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Challan Details</DialogTitle>
                            <DialogDescription>Complete information about this traffic violation</DialogDescription>
                          </DialogHeader>
                          {selectedChallan && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Challan Number</p>
                                  <p className="text-sm">{selectedChallan.challanNumber}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Status</p>
                                  <Badge variant={getStatusColor(selectedChallan.status)}>
                                    {selectedChallan.status}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Violation Type</p>
                                <p className="text-sm">{selectedChallan.violationType}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Description</p>
                                <p className="text-sm">{selectedChallan.description}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Date</p>
                                  <p className="text-sm">{formatDate(selectedChallan.date)}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Amount</p>
                                  <p className="text-sm font-bold">₹{selectedChallan.amount}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Location</p>
                                <p className="text-sm">{selectedChallan.location}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Issuing Officer</p>
                                <p className="text-sm">{selectedChallan.officerName}</p>
                              </div>
                              {selectedChallan.status !== "paid" && (
                                <Button className="w-full">Pay Now - ₹{selectedChallan.amount}</Button>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
