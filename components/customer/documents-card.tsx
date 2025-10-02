import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Vehicle, Customer } from "@/lib/types"
import { formatDate, getDocumentStatus } from "@/lib/utils/date-utils"
import { FileText, Download, AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface DocumentsCardProps {
  vehicles: Vehicle[]
  customer: Customer
}

export function DocumentsCard({ vehicles, customer }: DocumentsCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "expiring_soon":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "expired":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

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
    <div className="space-y-6">
      {/* License Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Driving License
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(getDocumentStatus(customer.licenseExpiry))}
              <div>
                <p className="font-medium">{customer.licenseNumber}</p>
                <p className="text-sm text-gray-600">Expires: {formatDate(customer.licenseExpiry)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusColor(getDocumentStatus(customer.licenseExpiry))}>
                {getDocumentStatus(customer.licenseExpiry).replace("_", " ")}
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Documents */}
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id}>
          <CardHeader>
            <CardTitle className="text-lg">
              {vehicle.make} {vehicle.model} - {vehicle.plateNumber}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* RC Certificate */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(getDocumentStatus(vehicle.rcExpiry))}
                <div>
                  <p className="font-medium">RC Certificate</p>
                  <p className="text-sm text-gray-600">
                    {vehicle.rcNumber} • Expires: {formatDate(vehicle.rcExpiry)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(getDocumentStatus(vehicle.rcExpiry))}>
                  {getDocumentStatus(vehicle.rcExpiry).replace("_", " ")}
                </Badge>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            {/* PUC Certificate */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(getDocumentStatus(vehicle.pucExpiry))}
                <div>
                  <p className="font-medium">PUC Certificate</p>
                  <p className="text-sm text-gray-600">
                    {vehicle.pucNumber} • Expires: {formatDate(vehicle.pucExpiry)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(getDocumentStatus(vehicle.pucExpiry))}>
                  {getDocumentStatus(vehicle.pucExpiry).replace("_", " ")}
                </Badge>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            {/* Insurance */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(getDocumentStatus(vehicle.insuranceExpiry))}
                <div>
                  <p className="font-medium">Insurance Policy</p>
                  <p className="text-sm text-gray-600">
                    {vehicle.insuranceNumber} • Expires: {formatDate(vehicle.insuranceExpiry)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(getDocumentStatus(vehicle.insuranceExpiry))}>
                  {getDocumentStatus(vehicle.insuranceExpiry).replace("_", " ")}
                </Badge>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
