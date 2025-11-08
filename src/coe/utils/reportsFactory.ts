import { ReportDefinition } from '../data/reportsData'

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
  cbe?: string
  convocation?: string
  docType?: string
  format?: string
  year?: string
}

export const applyFilters = (data: any[], filters: ReportFilters, columns: string[]): any[] => {
  let filtered = [...data]

  if (filters.program && filters.program !== 'all') {
    const progIdx = columns.indexOf('Program')
    if (progIdx >= 0) {
      filtered = filtered.filter(row => row[progIdx] === filters.program)
    }
  }

  if (filters.status && filters.status !== 'all') {
    const statusIdx = columns.indexOf('Status')
    if (statusIdx >= 0) {
      filtered = filtered.filter(row => row[statusIdx] === filters.status)
    }
  }

  if (filters.cgpaMin !== undefined || filters.cgpaMax !== undefined) {
    const cgpaIdx = columns.indexOf('CGPA')
    if (cgpaIdx >= 0) {
      filtered = filtered.filter(row => {
        const cgpa = parseFloat(row[cgpaIdx])
        if (filters.cgpaMin && cgpa < filters.cgpaMin) return false
        if (filters.cgpaMax && cgpa > filters.cgpaMax) return false
        return true
      })
    }
  }

  return filtered
}

export const exportToCSV = (report: ReportDefinition, data: any[], filename?: string) => {
  const csvRows = [
    report.columns.join(','),
    ...data.map(row => row.map((cell: any) => {
      const str = String(cell)
      return str.includes(',') ? `"${str}"` : str
    }).join(','))
  ]
  
  const csv = csvRows.join('\n')
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

export const printReport = (report: ReportDefinition, data: any[]) => {
  const printWindow = window.open('', '', 'height=800,width=1200')
  if (!printWindow) return

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${report.title}</title>
      <style>
        @page { size: A4 landscape; margin: 15mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Arial, sans-serif; 
          font-size: 10pt;
          line-height: 1.4;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 3px solid #5B21B6;
        }
        .header h1 { 
          color: #5B21B6; 
          font-size: 18pt; 
          margin-bottom: 5px;
          font-weight: 700;
        }
        .header .subtitle { 
          color: #6B7280; 
          font-size: 11pt; 
          margin-bottom: 10px;
        }
        .metadata {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          margin-bottom: 15px;
          font-size: 9pt;
          color: #4B5563;
          border-bottom: 1px solid #E5E7EB;
        }
        .metadata div { display: flex; gap: 10px; }
        .metadata strong { color: #1F2937; }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          font-size: 9pt;
        }
        th { 
          background: #F3F4F6; 
          padding: 8px 6px; 
          text-align: left; 
          border: 1px solid #D1D5DB; 
          font-weight: 600;
          color: #374151;
        }
        td { 
          padding: 6px; 
          border: 1px solid #E5E7EB; 
        }
        tr:nth-child(even) { background: #F9FAFB; }
        .footer {
          margin-top: 20px;
          padding-top: 10px;
          border-top: 1px solid #E5E7EB;
          text-align: center;
          font-size: 8pt;
          color: #6B7280;
        }
        @media print {
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Northern University Bangladesh</h1>
        <div class="subtitle">${report.title}</div>
        <div style="font-size: 9pt; color: #6B7280;">Report Code: ${report.code}</div>
      </div>
      
      <div class="metadata">
        <div>
          <span><strong>Generated:</strong> ${new Date().toLocaleString()}</span>
          <span><strong>Total Records:</strong> ${data.length}</span>
        </div>
        <div>
          <span><strong>Category:</strong> ${report.category}</span>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>${report.columns.map(col => `<th>${col}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>${row.map((cell: any) => `<td>${cell}</td>`).join('')}</tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="footer">
        <p>${report.description}</p>
        <p style="margin-top: 5px;">This is a computer-generated report. ${data.length} records displayed.</p>
      </div>
      
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }, 250);
        }
      </script>
    </body>
    </html>
  `
  
  printWindow.document.write(html)
  printWindow.document.close()
}

export const sortData = (data: any[], columnIndex: number, direction: 'asc' | 'desc'): any[] => {
  return [...data].sort((a, b) => {
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

export const paginateData = (data: any[], page: number, pageSize: number): any[] => {
  const start = (page - 1) * pageSize
  return data.slice(start, start + pageSize)
}
