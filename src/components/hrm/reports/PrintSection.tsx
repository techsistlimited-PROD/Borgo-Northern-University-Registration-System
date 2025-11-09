import { useEffect } from 'react'
import PrintableHeader from './PrintableHeader'

interface PrintSectionProps {
  title: string
  subtitle?: string
  dateLine: string
  children: React.ReactNode
  pageCount?: number
  currentPage?: number
  autoPrint?: boolean
}

/**
 * PrintSection - Global HRM Print Wrapper
 * 
 * Provides consistent A4 print formatting across all HRM modules
 * (Attendance, Payroll, Performance, Training, Notices, etc.)
 * 
 * Features:
 * - Automatic A4 layout application via print.css
 * - Standardized letterhead with logo and typography
 * - Page X of Y footer
 * - Auto-print trigger on mount (optional)
 * 
 * Usage:
 * <PrintSection 
 *   title="Daily Report : Present"
 *   subtitle="CSE, Permanent Campus"
 *   dateLine="Date : 12/01/2025"
 *   pageCount={3}
 *   currentPage={1}
 *   autoPrint={false}
 * >
 *   {/* Your print content here *\/}
 * </PrintSection>
 */
export default function PrintSection({
  title,
  subtitle,
  dateLine,
  children,
  pageCount = 1,
  currentPage = 1,
  autoPrint = false
}: PrintSectionProps) {
  
  useEffect(() => {
    if (autoPrint) {
      // Small delay to ensure content is rendered
      const timer = setTimeout(() => {
        window.print()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [autoPrint])

  return (
    <div className="print-section">
      {/* Letterhead Header */}
      <PrintableHeader
        title={title}
        subtitle={subtitle}
        dateLine={dateLine}
      />

      {/* Main Content */}
      <div className="print-content">
        {children}
      </div>

      {/* Page Footer */}
      <div className="print-page-footer text-right text-sm text-gray-600 mt-4">
        Page {currentPage} of {pageCount}
      </div>
    </div>
  )
}
