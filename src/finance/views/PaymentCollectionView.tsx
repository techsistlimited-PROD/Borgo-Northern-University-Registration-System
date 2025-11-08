import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Search, DollarSign, Receipt, CheckCircle, AlertCircle } from 'lucide-react'
import { Repo } from '@/lib/repo'
import { StudentBill, Payment, PaymentMethod, PaymentAllocation } from '../data/types'
import { formatCurrency, allocatePaymentToEarliestDues, addLedgerEntry } from '../utils/financeUtils'

export default function PaymentCollectionView() {
  const [studentSearch, setStudentSearch] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [studentBills, setStudentBills] = useState<StudentBill[]>([])
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash')
  const [transactionRef, setTransactionRef] = useState('')
  const [notes, setNotes] = useState('')
  const [allocations, setAllocations] = useState<PaymentAllocation[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [receiptNo, setReceiptNo] = useState('')
  const [showReceipt, setShowReceipt] = useState(false)

  const handleSearchStudent = () => {
    const bills = Repo.get<StudentBill>('finance-student-bills')
    const studentBills = bills.filter(b => 
      b.studentId === studentSearch || 
      b.studentName.toLowerCase().includes(studentSearch.toLowerCase())
    )

    if (studentBills.length > 0) {
      setSelectedStudent({
        id: studentBills[0].studentId,
        name: studentBills[0].studentName,
        program: studentBills[0].program,
        campus: studentBills[0].campus
      })
      setStudentBills(studentBills.filter(b => b.balanceDue > 0))
    } else {
      alert('Student not found or has no bills')
      setSelectedStudent(null)
      setStudentBills([])
    }
  }

  const handleProcessPayment = () => {
    if (!selectedStudent || !paymentAmount || parseFloat(paymentAmount) <= 0) {
      alert('Please enter valid payment details')
      return
    }

    setIsProcessing(true)

    const amount = parseFloat(paymentAmount)
    const allocs = allocatePaymentToEarliestDues(selectedStudent.id, amount)
    setAllocations(allocs)

    let receiptCounter = Repo.get<Payment>('finance-payments').length + 1
    const year = new Date().getFullYear()
    const receiptNumber = `MR-${year}-${String(receiptCounter).padStart(5, '0')}`
    setReceiptNo(receiptNumber)

    const payment: Payment = {
      id: `pay-${Date.now()}`,
      receiptNo: receiptNumber,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      program: selectedStudent.program,
      campus: selectedStudent.campus,
      semester: studentBills[0]?.semester || 'Fall 2025',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      totalAmount: amount,
      method: paymentMethod,
      allocations: allocs,
      collectedBy: 'Accounts Officer',
      status: 'Completed',
      transactionRef: transactionRef || undefined,
      notes: notes || undefined,
      createdAt: new Date().toISOString()
    }

    Repo.add('finance-payments', payment)

    addLedgerEntry(
      selectedStudent.id,
      'Payment',
      receiptNumber,
      `Payment received via ${paymentMethod}`,
      0,
      amount
    )

    setShowReceipt(true)
  }

  const handleNewPayment = () => {
    setStudentSearch('')
    setSelectedStudent(null)
    setStudentBills([])
    setPaymentAmount('')
    setPaymentMethod('Cash')
    setTransactionRef('')
    setNotes('')
    setAllocations([])
    setIsProcessing(false)
    setReceiptNo('')
    setShowReceipt(false)
  }

  const totalDue = studentBills.reduce((sum, b) => sum + b.balanceDue, 0)
  const paymentMethods: PaymentMethod[] = ['Cash', 'Bank', 'bKash', 'Card', 'SSLCommerz', 'DBBL Nexus']

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Payment Collection</h1>
          <p className="text-sm text-gray-600">Collect payments with earliest dues allocation</p>
        </div>
      </div>

      {!selectedStudent && !showReceipt && (
        <Card>
          <CardHeader>
            <CardTitle>Search Student</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Enter Student ID or Name..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchStudent()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearchStudent} className="nu-button-primary">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedStudent && !showReceipt && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedStudent.name}</CardTitle>
                  <p className="text-sm text-gray-600">
                    {selectedStudent.id} • {selectedStudent.program} • {selectedStudent.campus}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Outstanding</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDue)}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="font-medium text-sm">Open Bills (sorted by earliest due):</p>
                <div className="border rounded">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 text-xs font-medium">Bill No</th>
                        <th className="text-left p-3 text-xs font-medium">Semester</th>
                        <th className="text-left p-3 text-xs font-medium">Bill Date</th>
                        <th className="text-left p-3 text-xs font-medium">Due Date</th>
                        <th className="text-right p-3 text-xs font-medium">Net Total</th>
                        <th className="text-right p-3 text-xs font-medium">Paid</th>
                        <th className="text-right p-3 text-xs font-medium">Balance Due</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentBills.map(bill => (
                        <tr key={bill.id} className="border-t hover:bg-gray-50">
                          <td className="p-3 text-sm font-mono">{bill.billNo}</td>
                          <td className="p-3 text-sm">{bill.semester}</td>
                          <td className="p-3 text-sm">{bill.billDate}</td>
                          <td className="p-3 text-sm">{bill.dueDate}</td>
                          <td className="p-3 text-sm text-right">{formatCurrency(bill.netTotal)}</td>
                          <td className="p-3 text-sm text-right">{formatCurrency(bill.paidAmount)}</td>
                          <td className="p-3 text-sm text-right font-semibold text-red-600">
                            {formatCurrency(bill.balanceDue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Payment Amount *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="0.00"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Payment Method *</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {paymentMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>

                {(paymentMethod === 'bKash' || paymentMethod === 'SSLCommerz' || paymentMethod === 'DBBL Nexus') && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Transaction Reference</label>
                    <Input
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="Enter transaction ID"
                    />
                  </div>
                )}

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    rows={2}
                    placeholder="Additional notes..."
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Earliest Dues Allocation</p>
                    <p>Payment will be allocated to bills in order of bill date, then due date (earliest first). Any overflow will roll to the next bill automatically.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleProcessPayment}
                  className="nu-button-primary"
                  disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  Process Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showReceipt && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <CardTitle className="text-green-800">Payment Successful!</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white rounded p-4 border border-green-200">
                <p className="text-sm text-gray-600 mb-1">Receipt Number</p>
                <p className="text-2xl font-bold text-deep-plum">{receiptNo}</p>
              </div>

              <div className="bg-white rounded p-4 border">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Student</p>
                    <p className="font-medium">{selectedStudent.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Student ID</p>
                    <p className="font-medium">{selectedStudent.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Amount Paid</p>
                    <p className="font-medium text-green-600">{formatCurrency(parseFloat(paymentAmount))}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Method</p>
                    <p className="font-medium">{paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date/Time</p>
                    <p className="font-medium">{new Date().toLocaleString()}</p>
                  </div>
                  {transactionRef && (
                    <div>
                      <p className="text-gray-600">Transaction Ref</p>
                      <p className="font-medium font-mono text-xs">{transactionRef}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded p-4 border">
                <p className="font-medium text-sm mb-2">Payment Allocation ({allocations.length} bills):</p>
                <div className="space-y-2">
                  {allocations.map((alloc, idx) => (
                    <div key={idx} className="flex justify-between text-sm border-b pb-2">
                      <span className="font-mono">{alloc.billNo}</span>
                      <span className="font-semibold">{formatCurrency(alloc.allocatedAmount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleNewPayment} className="flex-1 nu-button-primary">
                  New Payment
                </Button>
                <Button variant="outline" className="flex-1">
                  Print Receipt
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
