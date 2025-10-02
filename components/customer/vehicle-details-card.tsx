import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Vehicle } from "@/lib/types"
import { formatDate, getDocumentStatus } from "@/lib/utils/date-utils"
import { Car, FileText, Shield, CreditCard } from "lucide-react"

interface VehicleDetailsCardProps {
  vehicle: Vehicle
}

export function VehicleDetailsCard({ vehicle }: VehicleDetailsCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "default"
      case "expiring_soon":
        return "secondary"
      case "expired":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          {vehicle.make} {vehicle.model}
        </CardTitle>
        <CardDescription>
          {vehicle.year} • {vehicle.color} • {vehicle.plateNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Vehicle Type</p>
            <p className="text-sm text-gray-600 capitalize">{vehicle.vehicleType}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Plate Number</p>
            <p className="text-sm text-gray-600">{vehicle.plateNumber}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">RC Certificate</p>
                <p className="text-xs text-gray-600">{vehicle.rcNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant={getStatusColor(getDocumentStatus(vehicle.rcExpiry))}>
                {formatDate(vehicle.rcExpiry)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">PUC Certificate</p>
                <p className="text-xs text-gray-600">{vehicle.pucNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant={getStatusColor(getDocumentStatus(vehicle.pucExpiry))}>
                {formatDate(vehicle.pucExpiry)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Insurance</p>
                <p className="text-xs text-gray-600">{vehicle.insuranceNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant={getStatusColor(getDocumentStatus(vehicle.insuranceExpiry))}>
                {formatDate(vehicle.insuranceExpiry)}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
