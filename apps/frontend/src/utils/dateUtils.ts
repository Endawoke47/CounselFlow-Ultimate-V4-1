// Date formatting utilities
export function formatDate(dateString: string, includeTime = false): string {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    
    if (isNaN(date.getTime())) {
      return dateString // Return original if invalid
    }

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(includeTime && {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    return new Intl.DateTimeFormat('en-US', options).format(date)
  } catch (error) {
    return dateString
  }
}

export function formatCurrency(amount: number, currency = 'KES'): string {
  if (amount === 0) return `${currency} 0`
  
  try {
    const formatter = new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
    
    return formatter.format(amount)
  } catch (error) {
    // Fallback formatting
    return `${currency} ${amount.toLocaleString()}`
  }
}

export function formatRelativeTime(dateString: string): string {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return 'just now'
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
    }
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
    }
    
    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`
    }
    
    const diffInYears = Math.floor(diffInMonths / 12)
    return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`
  } catch (error) {
    return formatDate(dateString)
  }
}

export function getDaysFromNow(dateString: string): number {
  if (!dateString) return 0
  
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInTime = date.getTime() - now.getTime()
    const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24))
    return diffInDays
  } catch (error) {
    return 0
  }
}

export function isDatePast(dateString: string): boolean {
  if (!dateString) return false
  
  try {
    const date = new Date(dateString)
    const now = new Date()
    return date < now
  } catch (error) {
    return false
  }
}

export function addDays(dateString: string, days: number): string {
  try {
    const date = new Date(dateString)
    date.setDate(date.getDate() + days)
    return date.toISOString().split('T')[0]
  } catch (error) {
    return dateString
  }
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (remainingMinutes === 0) {
    return `${hours}h`
  }
  
  return `${hours}h ${remainingMinutes}m`
}

export function parseDate(dateString: string): Date | null {
  if (!dateString) return null
  
  try {
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? null : date
  } catch (error) {
    return null
  }
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = formatDate(startDate)
  const end = formatDate(endDate)
  
  if (!start && !end) return ''
  if (!start) return `Until ${end}`
  if (!end) return `From ${start}`
  
  return `${start} - ${end}`
}

// Financial calculations
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

export function calculateCompoundGrowth(initialValue: number, finalValue: number, periods: number): number {
  if (initialValue === 0 || periods === 0) return 0
  return Math.pow(finalValue / initialValue, 1 / periods) - 1
}
