export const isExpiringSoon = (expiryDate: string, daysThreshold = 30): boolean => {
  const expiry = new Date(expiryDate)
  const today = new Date()
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= daysThreshold && diffDays > 0
}

export const isExpired = (expiryDate: string): boolean => {
  const expiry = new Date(expiryDate)
  const today = new Date()
  return expiry < today
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export const getDocumentStatus = (expiryDate: string): "valid" | "expired" | "expiring_soon" => {
  if (isExpired(expiryDate)) return "expired"
  if (isExpiringSoon(expiryDate)) return "expiring_soon"
  return "valid"
}
