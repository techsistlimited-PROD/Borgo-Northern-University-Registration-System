import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Repo } from '@/lib/repo'
import { StudentBill, Payment, PaymentMethod } from '../data/types'
import { formatCurrency, addLedgerEntry } from '../utils/financeUtils'
import { numberToWords } from '../utils/moneyInWords'
import { useNavigate } from 'react-router-dom'
import MoneyReceiptPrint from '../components/MoneyReceiptPrint'

export default function PaymentCollectionView() {
  const navigate = useNavigate()
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash')
  const [annex, setAnnex] = useState('Permanent Campus')
  const [program, setProgram] = useState('CSE')
  const [semester, setSemester] = useState('Fall 2025')
  const [studentId, setStudentId] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [moneyReceiptNo, setMoneyReceiptNo] = useState('')
  const [inWords, setInWords] = useState('')
  const [purpose, setPurpose] = useState('Installment')
  const [remarks, setRemarks] = useState('')
  const [bankName, setBankName] = useState('')
  const [branchName, setBranchName] = useState('')
  
  const [studentInfo, setStudentInfo] = useState<any>(null)
  const [paymentSummary, setPaymentSummary] = useState({
    chargeOfPresentSemester: 0,
    totalReceivable: 0,
    totalReceived: 0,
    presentDues: 0,
    fortyPercentPayable: 0,
    seventyPercentPayable: 0
  })

  const [showReceipt, setShowReceipt] = useState(false)
  const [createdPayment, setCreatedPayment] = useState<Payment | null>(null)

  useEffect(() => {
    if (studentId) {
      const bills = Repo.get<StudentBill>('finance-student-bills')
      const studentBills = bills.filter(b => b.studentId === studentId)
      
      if (studentBills.length > 0) {
        const currentSemBill = studentBills.find(b => b.semester === semester)
        const chargeOfPresentSemester = currentSemBill?.netTotal || 0
        const totalReceivable = studentBills.reduce((sum, b) => sum + b.netTotal, 0)
        const totalReceived = studentBills.reduce((sum, b) => sum + b.paidAmount, 0)
        const presentDues = totalReceivable - totalReceived
        
        setStudentInfo({
          name: studentBills[0].studentName,
          program: studentBills[0].program,
          campus: studentBills[0].campus
        })
        
        setPaymentSummary({
          chargeOfPresentSemester,
          totalReceivable,
          totalReceived,
          presentDues,
          fortyPercentPayable: chargeOfPresentSemester * 0.4,
          seventyPercentPayable: chargeOfPresentSemester * 0.7
        })
      }
    }
  }, [studentId, semester])

  useEffect(() => {
    if (paymentAmount) {
      const amount = parseFloat(paymentAmount)
      if (!isNaN(amount) && amount > 0) {
        setInWords(numberToWords(amount))
      } else {
        setInWords('')
      }
    } else {
      setInWords('')
    }
  }, [paymentAmount])

  const handleSubmit = () => {
    if (!studentId || !paymentAmount || !moneyReceiptNo) {
      alert('Please fill in all required fields: Student ID, Payment Amount, and Money Receipt No')
      return
    }

    const amount = parseFloat(paymentAmount)
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid payment amount')
      return
    }

    if (paymentMethod === 'Bank' && !bankName) {
      alert('Please enter Bank Name for Bank payment method')
      return
    }
    
    const payment: Payment = {
      id: `pay-${Date.now()}`,
      receiptNo: moneyReceiptNo,
      studentId,
      studentName: studentInfo?.name || studentId,
      program: studentInfo?.program || program,
      campus: studentInfo?.campus || annex,
      semester,
      paymentDate,
      paymentTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      totalAmount: amount,
      method: paymentMethod,
      allocations: [],
      collectedBy: 'Accounts Officer',
      status: 'Completed',
      notes: remarks || `${purpose} payment`,
      purpose,
      bankName: paymentMethod === 'Bank' ? bankName : undefined,
      branchName: paymentMethod === 'Bank' ? branchName : undefined,
      createdAt: new Date().toISOString()
    }

    Repo.add('finance-payments', payment)

    addLedgerEntry(
      studentId,
      'Payment',
      moneyReceiptNo,
      `${purpose} - ${paymentMethod}`,
      0,
      amount
    )

    const bills = Repo.get<StudentBill>('finance-student-bills')
    const studentBills = bills.filter(b => b.studentId === studentId && b.balanceDue > 0)
      .sort((a, b) => new Date(a.billDate).getTime() - new Date(b.billDate).getTime())

    let remaining = amount
    studentBills.forEach(bill => {
      if (remaining > 0) {
        const allocate = Math.min(remaining, bill.balanceDue)
        const newPaid = bill.paidAmount + allocate
        const newBalance = bill.balanceDue - allocate
        
        Repo.update('finance-student-bills', bill.id, {
          paidAmount: newPaid,
          balanceDue: newBalance,
          status: newBalance === 0 ? 'Paid' : 'Partial'
        })
        
        remaining -= allocate
      }
    })

    setCreatedPayment(payment)
    setShowReceipt(true)
  }

  const handleReset = () => {
    setStudentId('')
    setPaymentAmount('')
    setMoneyReceiptNo('')
    setRemarks('')
    setBankName('')
    setBranchName('')
    setStudentInfo(null)
    setShowReceipt(false)
    setCreatedPayment(null)
  }

  const paymentMethods: PaymentMethod[] = ['Cash', 'Bank', 'bKash', 'Card', 'SSLCommerz', 'DBBL Nexus']
  const purposes = ['Installment', 'Full Payment', 'Readmission Fee', 'Others']
  const annexes = ['Permanent Campus', 'Uttara', 'Lakshmipur']
  const programs = ['CSE', 'BBA', 'LLB', 'EEE', 'English']
  const semesters = ['Fall 2024', 'Spring 2025', 'Summer 2025', 'Fall 2025']

  if (showReceipt && createdPayment) {
    return <MoneyReceiptPrint payment={createdPayment} onClose={handleReset} />
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button className="nu-button-primary">
          Create Students Payment
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate('/finance/payment-records')}
        >
          Students Payment List
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Payment Date *</label>
                    <Input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Payment Method *</label>
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Annex *</label>
                    <select
                      value={annex}
                      onChange={(e) => setAnnex(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      {annexes.map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Program *</label>
                    <select
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      {programs.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Semester *</label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      {semesters.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Student Id *</label>
                    <Input
                      placeholder="Enter Student ID"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Payment Amount *</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Money Receipt No *</label>
                    <Input
                      placeholder="Enter receipt number"
                      value={moneyReceiptNo}
                      onChange={(e) => setMoneyReceiptNo(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">In Words</label>
                  <Input
                    value={inWords}
                    readOnly
                    className="bg-gray-50 italic"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Purpose *</label>
                    <select
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      {purposes.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
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
                </div>

                {paymentMethod === 'Bank' && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded border border-blue-200">
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

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={handleReset}>
                    Reset
                  </Button>
                  <Button onClick={handleSubmit} className="nu-button-primary">
                    Submit Payment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardContent className="pt-6">
              {studentInfo ? (
                <div className="space-y-4">
                  <div className="pb-3 border-b">
                    <p className="text-sm font-medium text-gray-600">Student Information</p>
                    <p className="font-semibold">{studentInfo.name}</p>
                    <p className="text-sm text-gray-600">{studentId}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-blue-50 rounded">
                      <span className="text-sm font-medium">Charge of Present Semester</span>
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(paymentSummary.chargeOfPresentSemester)}
                      </span>
                    </div>

                    <div className="flex justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm font-medium">Total Receivable</span>
                      <span className="font-semibold">
                        {formatCurrency(paymentSummary.totalReceivable)}
                      </span>
                    </div>

                    <div className="flex justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm font-medium">Total Received</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(paymentSummary.totalReceived)}
                      </span>
                    </div>

                    <div className="flex justify-between p-3 bg-red-50 rounded">
                      <span className="text-sm font-medium">Present Dues</span>
                      <span className="font-semibold text-red-600">
                        {formatCurrency(paymentSummary.presentDues)}
                      </span>
                    </div>

                    <div className="flex justify-between p-3 bg-yellow-50 rounded">
                      <span className="text-sm font-medium">40% Payable</span>
                      <span className="font-semibold text-yellow-700">
                        {formatCurrency(paymentSummary.fortyPercentPayable)}
                      </span>
                    </div>

                    <div className="flex justify-between p-3 bg-green-50 rounded">
                      <span className="text-sm font-medium">70% Payable</span>
                      <span className="font-semibold text-green-700">
                        {formatCurrency(paymentSummary.seventyPercentPayable)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p className="text-sm">Enter Student ID to view payment summary</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
