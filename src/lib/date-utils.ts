/**
 * Converts a time string from 24-hour format to 12-hour format with AM/PM
 * @param time24 - Time in 24-hour format (e.g., "14:00:00" or "14:00")
 * @returns Time in 12-hour format with AM/PM (e.g., "2:00 PM")
 */
export function formatTime12Hour(time24: string): string {
  if (!time24) return ''

  // Extract hours and minutes from the time string
  const [hours, minutes] = time24.split(':').map(Number)

  // Determine AM or PM
  const period = hours >= 12 ? 'PM' : 'AM'

  // Convert to 12-hour format
  const hours12 = hours % 12 || 12 // Convert 0 to 12 for midnight

  // Format the time
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`
}

/**
 * Formats a time range from 24-hour format to 12-hour format
 * @param startTime - Start time in 24-hour format (e.g., "12:00:00")
 * @param endTime - End time in 24-hour format (e.g., "14:00:00")
 * @returns Formatted time range (e.g., "12:00 PM - 2:00 PM")
 */
export function formatTimeRange(startTime: string, endTime: string): string {
  const start = formatTime12Hour(startTime)
  const end = formatTime12Hour(endTime)
  return `${start} - ${end}`
}
