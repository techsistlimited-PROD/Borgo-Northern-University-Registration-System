import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { FileText, Search } from 'lucide-react'
import { Repo } from '@/lib/repo'
import { Payment, PaymentRefund, PaymentAllocation } from '../data/types'
import { formatCurrency } from '../utils/financeUtils'
import { numberToWords } from '../utils/moneyInWords'
import { addLedgerEntry, reverseRefundAlloca } from '../utils/ledger'

export default function PaymentRefundView() {
  const [mode, setMode] = useState<'list' | 'new'>('list')
  const [refunds, setRefunds] = useState<PaymentRefund[]>([])
  
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [studentId, setStudentId] = useState('')
  const [program, setProgram] = useState('')
  const [semester, setSemester] = useState('')
  const [originalMRNo, setOriginalMRNo] = useState('')
  const [collectedAmount, setCollectedAmount] = useState(0)
  const [refundAmount, setRefundAmount] = useState('')
  const [refundMethod, setRefundMethod] = useState<'Cash' | 'Bank' | 'Mobile Banking'>('Cash')
  const [remarks, setRemarks] = useState('')
  const [inWords, setInWords] = useState('')
  const [bankName, setBankName] = useState('')
  const [branchName, setBranchName] = useState('')
  
  const [studentReceipts, setStudentReceipts] = useState<Payment[]>([])
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null)
  
  const [studentIdFilter, setStudentIdFilter] = useState('')
  const [semesterFilter, setSemesterFilter] = useState('All')
  const [programFilter, setProgramFilter] = useState('All')
  const [refundDateFilter, setRefundDateFilter] = useState('')

  useEffect(() => {
    loadRefunds()
    const unsub = Repo.subscribe('finance-refunds', loadRefunds)
    return unsub
  }, [])

  useEffect(() => {
    if (studentId) {
      const payments = Repo.get<Payment>('finance-payments')
      const receipts = payments.filter(p => p.studentId === studentId && p.status === 'Completed')
      setStudentReceipts(receipts)
      
      if (receipts.length > 0) {
        setProgram(receipts[0].program)
        setSemester(receipts[0].semester)
      }
    } else {
      setStudentReceipts([])
      setSelectedReceipt(null)
    }
  }, [studentId])

  useEffect(() => {
    if (originalMRNo && studentReceipts.length > 0) {
      const receipt = studentReceipts.find(r => r.receiptNo === originalMRNo)
      if (receipt) {
        setSelectedReceipt(receipt)
        setCollectedAmount(receipt.totalAmount)
        setProgram(receipt.program)
        setSemester(receipt.semester)
      }
    }
  }, [originalMRNo, studentReceipts])

  useEffect(() => {
    if (refundAmount) {
      const amount = parseFloat(refundAmount)
      if (!isNaN(amount) && amount > 0) {
        setInWords(numberToWords(amount))
      } else {
        setInWords('')
      }
    } else {
      setInWords('')
    }
  }, [refundAmount])

  const loadRefunds = () => {
    const data = Repo.get<PaymentRefund>('finance-refunds')
    setRefunds(data.sort((a, b) => new Date(b.refundDate).getTime() - new Date(a.refundDate).getTime()))
  }

  const generateRefundNo = (): string => {
    const year = new Date().getFullYear()
    const existing = refunds.filter(r => r.refundNo.startsWith(`RF-${year}`))
    const nextNum = existing.length + 1
    return `RF-${year}-${String(nextNum).padStart(5, '0')}`
  }

  const handleSubmit = () => {
    if (!studentId || !originalMRNo || !refundAmount) {
      alert('Please fill in all required fields: Student ID, Original MR No, and Refund Amount')
      return
    }

    const amount = parseFloat(refundAmount)
    if (isNaN(amount) || amount <= 0) {
      alert('Refund Amount must be greater than 0')
      return
    }

    if (amount > collectedAmount) {
      alert('Refund Amount cannot exceed Collected Amount')
      return
    }

    if (refundMethod === 'Bank' && !bankName) {
      alert('Please enter Bank Name for Bank refund method')
      return
    }

    if (!selectedReceipt) {
      alert('Please select a valid Money Receipt')
      return
    }

    const refundNo = generateRefundNo()
    
    const refund: PaymentRefund = {
      id: `refund-${Date.now()}`,
      refundNo,
      refundDate: paymentDate,
      studentId,
      studentName: selectedReceipt.studentName,
      program,
      semester,
      originalReceiptNo: originalMRNo,
      originalAmount: collectedAmount,
      refundAmount: amount,
      refundMethod,
      remarks,
      inWords,
      bankName: refundMethod === 'Bank' ? bankName : undefined,
      branchName: refundMethod === 'Bank' ? branchName : undefined,
      allocations: selectedReceipt.allocations.map(a => ({ ...a, allocatedAmount: -(a.allocatedAmount * amount / collectedAmount) })),
      createdAt: new Date().toISOString(),
      createdBy: 'Accounts Officer'
    }

    Repo.add('finance-refunds', refund)

    reverseRefundAlloca(refund)

    addLedgerEntry(
      studentId,
      'Refund',
      refundNo,
      `Payment Refund - ${originalMRNo}`,
      amount,
      0
    )

    alert('Refund recorded successfully!')
    handleReset()
    setMode('list')
  }

  const handleReset = () => {
    setStudentId('')
    setProgram('')
    setSemester('')
    setOriginalMRNo('')
    setCollectedAmount(0)
    setRefundAmount('')
    setRemarks('')
    setBankName('')
    setBranchName('')
    setSelectedReceipt(null)
  }

  const handleExportRefundPDF = (refund: PaymentRefund) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Payment Refund Receipt - ${refund.refundNo}</title>
  <style>
    @page { size: A4 portrait; margin: 20mm; }
    body { font-family: Arial, sans-serif; font-size: 11pt; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 15px; }
    .header h1 { font-size: 18pt; font-weight: bold; margin: 5px 0; text-transform: uppercase; }
    .header h2 { font-size: 14pt; margin: 5px 0; color: #666; }
    .info-section { margin: 20px 0; }
    .info-row { display: flex; margin: 8px 0; }
    .info-label { font-weight: bold; width: 200px; }
    .amount-box { background: #f0f0f0; border: 2px solid #333; padding: 15px; margin: 20px 0; text-align: center; }
    .signatures { display: flex; justify-content: space-around; margin-top: 60px; }
    .sig-line { text-align: center; border-top: 1px solid #333; padding-top: 5px; width: 200px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Northern University Bangladesh</h1>
    <h2>Payment Refund Receipt</h2>
  </div>
  <div class="info-section">
    <div class="info-row"><span class="info-label">Refund No:</span><span>${refund.refundNo}</span></div>
    <div class="info-row"><span class="info-label">Date:</span><span>${refund.refundDate}</span></div>
    <div class="info-row"><span class="info-label">Student ID:</span><span>${refund.studentId}</span></div>
    <div class="info-row"><span class="info-label">Student Name:</span><span>${refund.studentName}</span></div>
    <div class="info-row"><span class="info-label">Program:</span><span>${refund.program}</span></div>
    <div class="info-row"><span class="info-label">Original Money Receipt No:</span><span>${refund.originalReceiptNo}</span></div>
    <div class="info-row"><span class="info-label">Original Amount:</span><span>${formatCurrency(refund.originalAmount)}</span></div>
    <div class="info-row"><span class="info-label">Refund Method:</span><span>${refund.refundMethod}</span></div>
    ${refund.bankName ? `<div class="info-row"><span class="info-label">Bank:</span><span>${refund.bankName}</span></div>` : ''}
    ${refund.branchName ? `<div class="info-row"><span class="info-label">Branch:</span><span>${refund.branchName}</span></div>` : ''}
    ${refund.remarks ? `<div class="info-row"><span class="info-label">Remarks:</span><span>${refund.remarks}</span></div>` : ''}
  </div>
  <div class="amount-box">
    <h3>Refund Amount</h3>
    <h2>${formatCurrency(refund.refundAmount)}</h2>
    <p style="font-style: italic;">${refund.inWords}</p>
  </div>
  <div class="signatures">
    <div class="sig-line">Received By</div>
    <div class="sig-line">Authorized By</div>
  </div>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>
    `
    printWindow.document.write(html)
    printWindow.document.close()
  }

  const filteredRefunds = refunds.filter(r => {
    const matchesStudent = studentIdFilter === '' || r.studentId.toLowerCase().includes(studentIdFilter.toLowerCase())
    const matchesSemester = semesterFilter === 'All' || r.semester === semesterFilter
    const matchesProgram = programFilter === 'All' || r.program === programFilter
    const matchesDate = refundDateFilter === '' || r.refundDate === refundDateFilter
    return matchesStudent && matchesSemester && matchesProgram && matchesDate
  })

  const semesters = ['All', 'Fall 2024', 'Spring 2025', 'Summer 2025', 'Fall 2025']
  const programs = ['All', 'CSE', 'BBA', 'LLB', 'EEE', 'English']

  if (mode === 'new') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Home / Student Finance / Payment Refund</div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setMode('list')}>
              Payment Refund List
            </Button>
            <Button className="nu-button-primary">New Refund</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Payment Refund</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Date *</label>
                  <Input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Student ID *</label>
                  <Input
                    placeholder="Enter Student ID"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Program</label>
                  <Input value={program} readOnly className="bg-gray-50" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Semester</label>
                  <Input value={semester} readOnly className="bg-gray-50" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Original Money Receipt No *</label>
                  <select
                    value={originalMRNo}
                    onChange={(e) => setOriginalMRNo(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    disabled={!studentId || studentReceipts.length === 0}
                  >
                    <option value="">Select Receipt</option>
                    {studentReceipts.map(receipt => (
                      <option key={receipt.id} value={receipt.receiptNo}>
                        {receipt.receiptNo} - {formatCurrency(receipt.totalAmount)} ({receipt.paymentDate})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Collected Amount</label>
                  <Input 
                    value={formatCurrency(collectedAmount)} 
                    readOnly 
                    className="bg-gray-50 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Refund Amount *</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Refund Method *</label>
                  <select
                    value={refundMethod}
                    onChange={(e) => setRefundMethod(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank</option>
                    <option value="Mobile Banking">Mobile Banking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Remarks</label>
                  <Input
                    placeholder="Optional remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">In Words</label>
                  <Input value={inWords} readOnly className="bg-gray-50 italic text-sm" />
                </div>
              </div>
            </div>

            {refundMethod === 'Bank' && (
              <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-blue-50 rounded border border-blue-200">
                <div>
                  <label className="block text-sm font-medium mb-1">Bank Name *</label>
                  <Input
                    placeholder="Enter bank name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Branch</label>
                  <Input
                    placeholder="Enter branch name (optional)"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                  />
                </div>
              </div>
            )}

            {selectedReceipt && (
              <Card className="mt-6 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-base">Original Receipt Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="font-semibold">Date:</span> {selectedReceipt.paymentDate}</div>
                    <div><span className="font-semibold">Mode:</span> {selectedReceipt.method}</div>
                    <div><span className="font-semibold">Original Amount:</span> {formatCurrency(selectedReceipt.totalAmount)}</div>
                    <div><span className="font-semibold">Allocations:</span> {selectedReceipt.allocations.length} bills</div>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs font-semibold mb-1">Bill Allocations:</p>
                    {selectedReceipt.allocations.map(alloc => (
                      <div key={alloc.billId} className="text-xs flex justify-between py-1 border-t">
                        <span>{alloc.billNo}</span>
                        <span className="font-mono">{formatCurrency(alloc.allocatedAmount)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={handleReset}>Reset</Button>
              <Button onClick={handleSubmit} className="nu-button-primary">Submit Refund</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Home / Student Finance / Payment Refund</div>
        <Button onClick={() => setMode('new')} className="nu-button-primary">
          New Refund
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Refund List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mb-6">
            <Input
              placeholder="Student ID"
              value={studentIdFilter}
              onChange={(e) => setStudentIdFilter(e.target.value)}
              className="flex-1"
            />
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              {semesters.map(sem => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              {programs.map(prog => (
                <option key={prog} value={prog}>{prog}</option>
              ))}
            </select>
            <Input
              type="date"
              value={refundDateFilter}
              onChange={(e) => setRefundDateFilter(e.target.value)}
              className="w-40"
            />
            <Button className="nu-button-primary">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="overflow-x-auto border rounded">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 text-sm font-medium">Refund No</th>
                  <th className="text-left p-3 text-sm font-medium">Date</th>
                  <th className="text-left p-3 text-sm font-medium">Student ID</th>
                  <th className="text-left p-3 text-sm font-medium">Student Name</th>
                  <th className="text-left p-3 text-sm font-medium">Program</th>
                  <th className="text-right p-3 text-sm font-medium">Refund Amount</th>
                  <th className="text-left p-3 text-sm font-medium">Method</th>
                  <th className="text-left p-3 text-sm font-medium">Original MR</th>
                  <th className="text-center p-3 text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRefunds.map(refund => (
                  <tr key={refund.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 text-sm font-mono">{refund.refundNo}</td>
                    <td className="p-3 text-sm">{refund.refundDate}</td>
                    <td className="p-3 text-sm">{refund.studentId}</td>
                    <td className="p-3 text-sm font-medium">{refund.studentName}</td>
                    <td className="p-3 text-sm">{refund.program}</td>
                    <td className="p-3 text-sm text-right font-semibold text-red-600">
                      {formatCurrency(refund.refundAmount)}
                    </td>
                    <td className="p-3 text-sm">
                      <Badge variant="outline">{refund.refundMethod}</Badge>
                    </td>
                    <td className="p-3 text-sm font-mono">{refund.originalReceiptNo}</td>
                    <td className="p-3 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExportRefundPDF(refund)}
                        title="Export PDF"
                      >
                        <FileText className="w-4 h-4 text-red-600" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredRefunds.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-6 text-center text-gray-500">
                      No refunds found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
