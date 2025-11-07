import { ReportDefinition } from '../data/reportsCatalog'

export interface ReportFilters {
  semester?: string
  program?: string
  campus?: string
  dateFrom?: string
  dateTo?: string
  status?: string
  cgpaMin?: number
  cgpaMax?: number
  section?: string
  period?: string
}

export const buildReportRows = (
  report: ReportDefinition,
  filters: ReportFilters
): any[] => {
  let rows = report.sampleRowsProvider()
  
  if (filters.program && filters.program !== 'all') {
    rows = rows.filter(row => {
      const programIndex = report.columns.indexOf('Program')
      return programIndex >= 0 && row[programIndex] === filters.program
    })
  }
  
  if (filters.status && filters.status !== 'all') {
    rows = rows.filter(row => {
      const statusIndex = report.columns.indexOf('Status')
      return statusIndex >= 0 && row[statusIndex] === filters.status
    })
  }
  
  return rows
}

export const buildCSV = (columns: string[], rows: any[]): string => {
  const csvRows = [
    columns.join(','),
    ...rows.map(row => row.map((cell: any) => {
      const str = String(cell)
      return str.includes(',') ? `"${str}"` : str
    }).join(','))
  ]
  return csvRows.join('\n')
}

export const downloadCSV = (report: ReportDefinition, rows: any[], filename?: string) => {
  const csv = buildCSV(report.columns, rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename || `${report.code}_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const printReport = (report: ReportDefinition, rows: any[]) => {
  const printWindow = window.open('', '', 'height=600,width=800')
  if (!printWindow) return

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${report.title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #5B21B6; margin-bottom: 5px; }
        .meta { color: #6B7280; font-size: 14px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #F3F4F6; padding: 10px; text-align: left; border: 1px solid #D1D5DB; font-weight: 600; }
        td { padding: 8px; border: 1px solid #E5E7EB; }
        tr:nth-child(even) { background: #F9FAFB; }
        @media print {
          body { padding: 10px; }
          h1 { font-size: 18px; }
        }
      </style>
    </head>
    <body>
      <h1>${report.title}</h1>
      <div class="meta">${report.description} | Generated: ${new Date().toLocaleString()}</div>
      <table>
        <thead>
          <tr>${report.columns.map(col => `<th>${col}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rows.map(row => `<tr>${row.map((cell: any) => `<td>${cell}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() { window.close(); }, 100);
        }
      </script>
    </body>
    </html>
  `
  
  printWindow.document.write(html)
  printWindow.document.close()
}

export const calculateSummaryStats = (rows: any[], columns: string[]) => {
  const stats: Array<{ label: string; value: string | number; color?: string }> = []
  
  stats.push({
    label: 'Total Records',
    value: rows.length,
    color: 'purple'
  })
  
  const cgpaIndex = columns.indexOf('CGPA')
  if (cgpaIndex >= 0) {
    const cgpas = rows.map(r => parseFloat(r[cgpaIndex])).filter(n => !isNaN(n))
    if (cgpas.length > 0) {
      const avgCGPA = cgpas.reduce((a, b) => a + b, 0) / cgpas.length
      stats.push({
        label: 'Average CGPA',
        value: avgCGPA.toFixed(2),
        color: 'indigo'
      })
    }
  }
  
  const creditsIndex = columns.indexOf('Credits')
  if (creditsIndex >= 0) {
    const credits = rows.map(r => parseInt(r[creditsIndex])).filter(n => !isNaN(n))
    if (credits.length > 0) {
      const totalCredits = credits.reduce((a, b) => a + b, 0)
      stats.push({
        label: 'Total Credits',
        value: totalCredits,
        color: 'violet'
      })
    }
  }
  
  return stats
}

export const sortRows = (rows: any[], columnIndex: number, direction: 'asc' | 'desc'): any[] => {
  return [...rows].sort((a, b) => {
    const aVal = a[columnIndex]
    const bVal = b[columnIndex]
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'asc' ? aVal - bVal : bVal - aVal
    }
    
    const aStr = String(aVal).toLowerCase()
    const bStr = String(bVal).toLowerCase()
    
    if (direction === 'asc') {
      return aStr < bStr ? -1 : aStr > bStr ? 1 : 0
    } else {
      return aStr > bStr ? -1 : aStr < bStr ? 1 : 0
    }
  })
}

export const paginateRows = (rows: any[], page: number, pageSize: number): any[] => {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return rows.slice(start, end)
}
