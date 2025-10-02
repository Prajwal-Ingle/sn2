import type { Customer, Admin } from "./types"
import { mockCustomers, mockAdmin } from "./mock-data"

export interface AuthState {
  isAuthenticated: boolean
  user: Customer | Admin | null
  userType: "customer" | "admin" | null
}

export const authenticateCustomer = (email: string, password: string): Customer | null => {
  const customer = mockCustomers.find((c) => c.email === email && c.password === password)
  return customer || null
}

export const authenticateAdmin = (passkey: string): Admin | null => {
  return mockAdmin.passkey === passkey ? mockAdmin : null
}

export const getCustomerById = (id: string): Customer | null => {
  return mockCustomers.find((c) => c.id === id) || null
}

export const calculateSafetyScore = (customerId: string): number => {
  // Mock AI safety score calculation
  const customer = getCustomerById(customerId)
  return customer?.safetyScore || 0
}
