/**
 * Get the current local date in YYYY-MM-DD format
 * This respects the user's timezone, not UTC
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Convert a local date string (YYYY-MM-DD) to a UTC timestamp
 * that represents the start of that day in the user's local timezone
 */
export function localDateToUTC(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  // Create date in local timezone
  const localDate = new Date(year, month - 1, day)
  return localDate
}

/**
 * Get the start and end of a day in UTC for a given local date
 */
export function getUTCDayBounds(localDateString: string): { start: Date; end: Date } {
  const [year, month, day] = localDateString.split('-').map(Number)
  
  // Create start of day in local timezone
  const startLocal = new Date(year, month - 1, day, 0, 0, 0, 0)
  
  // Create end of day in local timezone
  const endLocal = new Date(year, month - 1, day, 23, 59, 59, 999)
  
  return {
    start: startLocal,
    end: endLocal
  }
}

/**
 * Extract local date string from a UTC timestamp
 */
export function getLocalDateFromUTC(utcDate: Date): string {
  const date = new Date(utcDate)
  return getLocalDateString(date)
}