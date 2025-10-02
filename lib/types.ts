export interface Customer {
  id: string
  name: string
  email: string
  password: string
  phone: string
  address: string
  licenseNumber: string
  licenseExpiry: string
  profileImage?: string
  safetyScore: number
  joinDate: string
}

export interface Vehicle {
  id: string
  customerId: string
  make: string
  model: string
  year: number
  color: string
  plateNumber: string
  rcNumber: string
  rcExpiry: string
  pucNumber: string
  pucExpiry: string
  insuranceNumber: string
  insuranceExpiry: string
  vehicleType: "car" | "motorcycle" | "truck" | "bus"
}

export interface Challan {
  id: string
  customerId: string
  vehicleId: string
  challanNumber: string
  violationType: string
  amount: number
  date: string
  location: string
  status: "paid" | "pending" | "overdue"
  description: string
  officerName: string
}

export interface DrivingBehavior {
  id: string
  customerId: string
  vehicleId: string
  date: string
  tripDistance: number
  avgSpeed: number
  maxSpeed: number
  harshBraking: number
  rapidAcceleration: number
  sharpTurns: number
  nightDriving: number
  phoneUsage: number
  safetyScore: number
}

export interface Document {
  id: string
  customerId: string
  type: "license" | "rc" | "puc" | "insurance"
  documentNumber: string
  issueDate: string
  expiryDate: string
  status: "valid" | "expired" | "expiring_soon"
  documentUrl?: string
}

export interface Admin {
  id: string
  name: string
  email: string
  passkey: string
  role: "super_admin" | "admin"
}

export interface RecentTrip {
  id: string
  customerId: string
  vehicleId: string
  startTime: string
  endTime: string
  startLocation: string
  endLocation: string
  distance: number
  duration: number // in minutes
  avgSpeed: number
  maxSpeed: number
  safetyScore: number
  fuelEfficiency?: number
  route: string
  incidents: number
  status: "completed" | "ongoing" | "cancelled"
}
