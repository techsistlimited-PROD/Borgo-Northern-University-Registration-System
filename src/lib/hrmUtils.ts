/**
 * HRM Utility Functions
 * Provides standardized export naming and slugification for all HRM modules
 */

/**
 * Convert a string to a URL-friendly slug
 * - Lowercase
 * - Replace spaces with hyphens
 * - Remove special characters
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w\-]/g, '') // Remove special characters
    .replace(/\-\-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '') // Remove leading hyphens
    .replace(/-+$/, '') // Remove trailing hyphens
}

/**
 * Format date as DD-MM-YYYY for file names
 */
export function formatDateForFilename(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${day}-${month}-${year}`
}

/**
 * Format month as MM-YYYY for file names
 */
export function formatMonthForFilename(monthStr: string): string {
  const [year, month] = monthStr.split('-')
  return `${month}-${year}`
}

/**
 * Generate standardized HRM export filename
 * Format: {reportType}-{departmentSlug}-{campusSlug}-{dateOrRange}.{extension}
 * 
 * @param reportType - Type of report (e.g., 'daily-present', 'monthly-summary', 'individual-report')
 * @param department - Department name (will be slugified)
 * @param campus - Campus name (will be slugified)
 * @param dateOrRange - Date string (YYYY-MM-DD) or month string (YYYY-MM)
 * @param extension - File extension (default: 'csv')
 * @param employeeId - Optional employee ID for individual reports
 * @returns Standardized filename
 */
export function generateHRMExportFilename(
  reportType: string,
  department: string,
  campus: string,
  dateOrRange: string,
  extension: string = 'csv',
  employeeId?: string
): string {
  const deptSlug = slugify(department === 'all' ? 'all-departments' : department)
  const campusSlug = slugify(campus === 'all' ? 'all-campuses' : campus)
  
  // Determine if it's a date or month and format accordingly
  const isMonthOnly = dateOrRange.split('-').length === 2
  const formattedDate = isMonthOnly 
    ? formatMonthForFilename(dateOrRange)
    : formatDateForFilename(dateOrRange)
  
  // For individual reports, include employee ID
  if (employeeId) {
    return `${reportType}-${employeeId}-${deptSlug}-${formattedDate}.${extension}`
  }
  
  return `${reportType}-${deptSlug}-${campusSlug}-${formattedDate}.${extension}`
}
