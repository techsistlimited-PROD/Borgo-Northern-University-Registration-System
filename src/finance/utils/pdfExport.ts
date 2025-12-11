import { StudentBill } from '../data/types'
import { formatCurrency } from './financeUtils'

export function generatePayablePDF(bill: StudentBill): void {
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Please allow popups for PDF generation')
    return
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Student Payable - ${bill.billNo}</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body { 
      font-family: Arial, sans-serif; 
      font-size: 11pt; 
      line-height: 1.4;
      margin: 0;
      padding: 20px;
    }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { 
      font-size: 18pt; 
      font-weight: bold; 
      margin: 5px 0;
      text-transform: uppercase;
    }
    .header h2 { 
      font-size: 14pt; 
      margin: 5px 0;
      font-weight: normal;
    }
    .info-section { 
      margin: 20px 0; 
      padding: 10px;
      background: #f5f5f5;
      border: 1px solid #ddd;
    }
    .info-row { 
      display: flex; 
      justify-content: space-between;
      margin: 5px 0;
    }
    .info-label { font-weight: bold; }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 20px 0;
    }
    th, td { 
      border: 1px solid #333; 
      padding: 8px; 
      text-align: left;
    }
    th { 
      background: #e0e0e0; 
      font-weight: bold;
      font-size: 10pt;
    }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .total-row { 
      background: #f5f5f5; 
      font-weight: bold;
    }
    .payable-row { 
      background: #d4edda; 
      font-weight: bold;
      font-size: 12pt;
    }
    .footer { 
      margin-top: 40px; 
      text-align: center; 
      font-size: 9pt;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Northern University Bangladesh</h1>
    <h2>Students Payable</h2>
  </div>

  <div class="info-section">
    <div class="info-row">
      <span><span class="info-label">Student ID:</span> ${bill.studentId}</span>
      <span><span class="info-label">Bill No:</span> ${bill.billNo}</span>
    </div>
    <div class="info-row">
      <span><span class="info-label">Student Name:</span> ${bill.studentName}</span>
      <span><span class="info-label">Bill Date:</span> ${bill.billDate}</span>
    </div>
    <div class="info-row">
      <span><span class="info-label">Program:</span> ${bill.program}</span>
      <span><span class="info-label">Due Date:</span> ${bill.dueDate}</span>
    </div>
    <div class="info-row">
      <span><span class="info-label">Semester:</span> ${bill.semester}</span>
      <span><span class="info-label">Campus:</span> ${bill.campus}</span>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Cost Head</th>
        <th class="text-right">Credit Taken</th>
        <th class="text-right">Cost Amount</th>
        <th class="text-right">Deductive Amount</th>
        <th>Remarks</th>
      </tr>
    </thead>
    <tbody>
      ${bill.lineItems.map(item => `
        <tr>
          <td>${item.costHeadName}</td>
          <td class="text-right">${item.mode === 'Per Credit' ? item.quantity : '-'}</td>
          <td class="text-right">${formatCurrency(item.subtotal)}</td>
          <td class="text-right">${formatCurrency(item.deduction + (item.subtotal * (item.waiverPercent + item.scholarshipPercent) / 100))}</td>
          <td>${item.notes || '-'}</td>
        </tr>
      `).join('')}
      <tr class="total-row">
        <td colspan="2" class="text-right">Total Cost Amount:</td>
        <td class="text-right">${formatCurrency(bill.grossTotal)}</td>
        <td colspan="2"></td>
      </tr>
      <tr class="total-row">
        <td colspan="2" class="text-right">Total Deductive Amount:</td>
        <td colspan="1"></td>
        <td class="text-right">${formatCurrency(bill.waiverTotal + bill.scholarshipTotal + bill.deductionTotal)}</td>
        <td></td>
      </tr>
      <tr class="payable-row">
        <td colspan="2" class="text-right">Payable Amount:</td>
        <td colspan="3" class="text-right">${formatCurrency(bill.netTotal)}</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    <p>Generated on ${new Date().toLocaleString('en-GB')}</p>
    <p>Northern University Bangladesh - Finance Department</p>
  </div>

  <script>
    window.onload = function() {
      window.print();
    }
  </script>
</body>
</html>
  `

  printWindow.document.write(html)
  printWindow.document.close()
}

export function generateUnregisteredReportPDF(
  data: any[],
  campus: string,
  program: string,
  semester: string
): void {
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Please allow popups for PDF generation')
    return
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Unregistered Students Report</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { 
      font-family: Arial, sans-serif; 
      font-size: 10pt; 
      line-height: 1.4;
      margin: 0;
      padding: 15px;
    }
    .header { text-align: center; margin-bottom: 20px; }
    .header h1 { 
      font-size: 16pt; 
      font-weight: bold; 
      margin: 5px 0;
      text-transform: uppercase;
    }
    .header h2 { 
      font-size: 12pt; 
      margin: 5px 0;
    }
    .meta { margin: 15px 0; font-size: 10pt; }
    .meta div { margin: 3px 0; }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 15px 0;
    }
    th, td { 
      border: 1px solid #333; 
      padding: 6px; 
      text-align: left;
      font-size: 9pt;
    }
    th { 
      background: #e0e0e0; 
      font-weight: bold;
    }
    .text-center { text-align: center; }
    .footer { 
      margin-top: 30px; 
      text-align: center; 
      font-size: 8pt;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Northern University Bangladesh</h1>
    <h2>Registered Students Unregistered in Previous Semesters</h2>
  </div>

  <div class="meta">
    <div><strong>Campus:</strong> ${campus}</div>
    <div><strong>Program:</strong> ${program}</div>
    <div><strong>Semester:</strong> ${semester}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th class="text-center">Sl No.</th>
        <th>Student Id</th>
        <th>Student Name</th>
        <th class="text-center">Recently Not Registered - From</th>
        <th class="text-center">Recently Not Registered - To</th>
        <th class="text-center">Number of Discontinued Semesters</th>
      </tr>
    </thead>
    <tbody>
      ${data.map((row, idx) => `
        <tr>
          <td class="text-center">${idx + 1}</td>
          <td>${row.studentId}</td>
          <td>${row.studentName}</td>
          <td class="text-center">${row.from}</td>
          <td class="text-center">${row.to}</td>
          <td class="text-center">${row.discontinuedCount}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    <p>Page 1 of 1 | Generated on ${new Date().toLocaleString('en-GB')}</p>
    <p>Northern University Bangladesh</p>
  </div>

  <script>
    window.onload = function() {
      window.print();
    }
  </script>
</body>
</html>
  `

  printWindow.document.write(html)
  printWindow.document.close()
}
