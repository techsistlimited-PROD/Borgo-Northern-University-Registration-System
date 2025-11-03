export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        const stringValue = value === null || value === undefined ? '' : String(value)
        return stringValue.includes(',') ? `"${stringValue}"` : stringValue
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function printContent(title: string, content: string) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            margin: 0;
          }
          h1 {
            color: #4A1D6F;
            margin-bottom: 20px;
            font-size: 24px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #4A1D6F;
            color: white;
          }
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            border-bottom: 2px solid #4A1D6F;
            padding-bottom: 10px;
          }
          .logo {
            font-size: 18px;
            font-weight: bold;
            color: #4A1D6F;
          }
          @media print {
            button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Northern University</div>
          <div>${new Date().toLocaleDateString()}</div>
        </div>
        <h1>${title}</h1>
        ${content}
        <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #4A1D6F; color: white; border: none; border-radius: 4px; cursor: pointer;">Print</button>
      </body>
    </html>
  `)
  printWindow.document.close()
}

export function generateTableHTML(headers: string[], rows: any[][]) {
  return `
    <table>
      <thead>
        <tr>
          ${headers.map(h => `<th>${h}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${rows.map(row => `
          <tr>
            ${row.map(cell => `<td>${cell ?? ''}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `
}
