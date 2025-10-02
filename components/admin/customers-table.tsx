"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Customer } from "@/lib/types"
import { formatDate } from "@/lib/utils/date-utils"
import { Eye, Phone, Mail } from "lucide-react"

interface CustomersTableProps {
  customers: Customer[]
  onViewCustomer: (customerId: string) => void
}

export function CustomersTable({ customers, onViewCustomer }: CustomersTableProps) {
  const getSafetyScoreBadge = (score: number) => {
    if (score >= 90) return <Badge variant="default">Excellent</Badge>
    if (score >= 75) return <Badge variant="secondary">Good</Badge>
    if (score >= 60) return <Badge variant="outline">Average</Badge>
    return <Badge variant="destructive">Poor</Badge>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>License</TableHead>
            <TableHead>Safety Score</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-gray-600">{customer.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm">
                    <Phone className="h-3 w-3" />
                    {customer.phone}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Mail className="h-3 w-3" />
                    {customer.email}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-sm">{customer.licenseNumber}</p>
                  <p className="text-xs text-gray-600">Expires: {formatDate(customer.licenseExpiry)}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">{customer.safetyScore}</span>
                  {getSafetyScoreBadge(customer.safetyScore)}
                </div>
              </TableCell>
              <TableCell>{formatDate(customer.joinDate)}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => onViewCustomer(customer.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
