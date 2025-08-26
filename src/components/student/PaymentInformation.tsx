import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  DollarSign,
  Receipt,
  TrendingUp,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard
} from 'lucide-react'

// Mock payable data
const payableData = [
  {
    semester: 'Fall 2024',
    costPackage: 680,
    perCreditFee: 3200.00,
    waiverPercent: 20.0,
    duesUptoPrevious: 0.0,
    chargePresent: 46850.0,
    totalReceivable: 46850.0,
    totalReceived: 46830.00,
    presentDues: 20.0,
    fortyPercentPayable: 18740.0,
    fortyPercentDues: 0.00,
    thirtyPercentPayable: 14055.0,
    thirtyPercentDues: 0.00,
    thirtyPercentFinalPayable: 14055.0,
    thirtyPercentPresentDues: 20.0,
    payableDetails: [
      { costHead: 'Total Course Fee', creditTaken: 8.0, costAmount: 25600.0, deductiveAmount: 0.0 },
      { costHead: 'Admission Fee', creditTaken: 'N/A', costAmount: 14000.0, deductiveAmount: 0.0 },
      { costHead: 'Semester Fee', creditTaken: 'N/A', costAmount: 6000.0, deductiveAmount: 0.0 },
      { costHead: 'Merit Scholarship', creditTaken: 'N/A', costAmount: 0.0, deductiveAmount: 5120.0 },
      { costHead: 'Computer Lab & Library Fee', creditTaken: 'N/A', costAmount: 5500.0, deductiveAmount: 0.0 },
      { costHead: 'Foundation Course Fee', creditTaken: 'N/A', costAmount: 5500.0, deductiveAmount: 0.0 }
    ]
  },
  {
    semester: 'Spring 2025',
    costPackage: 680,
    perCreditFee: 3200.00,
    waiverPercent: 20.0,
    duesUptoPrevious: 20.0,
    chargePresent: 40800.0,
    totalReceivable: 40820.0,
    totalReceived: 40820.00,
    presentDues: 0.0,
    fortyPercentPayable: 16320.0,
    fortyPercentDues: 0.00,
    thirtyPercentPayable: 12240.0,
    thirtyPercentDues: 0.00,
    thirtyPercentFinalPayable: 12240.0,
    thirtyPercentPresentDues: 0.0,
    payableDetails: [
      { costHead: 'Total Course Fee', creditTaken: 13.0, costAmount: 41600.0, deductiveAmount: 0.0 },
      { costHead: 'Semester Fee', creditTaken: 'N/A', costAmount: 6000.0, deductiveAmount: 0.0 },
      { costHead: 'Merit Scholarship', creditTaken: 'N/A', costAmount: 0.0, deductiveAmount: 8320.0 }
    ]
  },
  {
    semester: 'Summer 2025',
    costPackage: 680,
    perCreditFee: 3200.00,
    waiverPercent: 20.0,
    duesUptoPrevious: 0.0,
    chargePresent: 41200.0,
    totalReceivable: 41200.0,
    totalReceived: 37200.00,
    presentDues: 4000.0,
    fortyPercentPayable: 16480.0,
    fortyPercentDues: 0.00,
    thirtyPercentPayable: 12360.0,
    thirtyPercentDues: 0.00,
    thirtyPercentFinalPayable: 12360.0,
    thirtyPercentPresentDues: 4000.0,
    payableDetails: [
      { costHead: 'Total Course Fee', creditTaken: 10.0, costAmount: 32000.0, deductiveAmount: 0.0 },
      { costHead: 'Semester Fee', creditTaken: 'N/A', costAmount: 6000.0, deductiveAmount: 0.0 },
      { costHead: 'Special Exam Fee (Final)', creditTaken: 'N/A', costAmount: 4200.0, deductiveAmount: 0.0 },
      { costHead: 'Merit Scholarship', creditTaken: 'N/A', costAmount: 0.0, deductiveAmount: 6400.0 }
    ]
  },
  {
    semester: 'Fall 2025',
    costPackage: 680,
    perCreditFee: 3200.00,
    waiverPercent: 20.0,
    duesUptoPrevious: 4000.0,
    chargePresent: 45600.0,
    totalReceivable: 49600.0,
    totalReceived: 38500.00,
    presentDues: 11100.0,
    fortyPercentPayable: 22400.0,
    fortyPercentDues: 0.00,
    thirtyPercentPayable: 17800.0,
    thirtyPercentDues: 0.00,
    thirtyPercentFinalPayable: 17800.0,
    thirtyPercentPresentDues: 11100.0,
    payableDetails: [
      { costHead: 'Total Course Fee', creditTaken: 15.0, costAmount: 48000.0, deductiveAmount: 0.0 },
      { costHead: 'Semester Fee', creditTaken: 'N/A', costAmount: 6000.0, deductiveAmount: 0.0 },
      { costHead: 'Merit Scholarship', creditTaken: 'N/A', costAmount: 0.0, deductiveAmount: 9600.0 }
    ]
  }
]

// Mock payment history
const paymentHistory = [
  { serial: 1, semester: 'Fall 2024', paymentDate: '25/04/2024', receiptNo: '00145672', amount: 14000, currency: 'Taka' },
  { serial: 2, semester: 'Fall 2024', paymentDate: '12/06/2024', receiptNo: '00158391', amount: 15500, currency: 'Taka' },
  { serial: 3, semester: 'Fall 2024', paymentDate: '18/07/2024', receiptNo: '00162847', amount: 7800, currency: 'Taka' },
  { serial: 4, semester: 'Fall 2024', paymentDate: '05/10/2024', receiptNo: '00169524', amount: 9530, currency: 'Taka' },
  { serial: 5, semester: 'Spring 2025', paymentDate: '28/11/2024', receiptNo: '0095', amount: 28000, currency: 'Taka' },
  { serial: 6, semester: 'Spring 2025', paymentDate: '12/01/2025', receiptNo: '0042', amount: 12820, currency: 'Taka' },
  { serial: 7, semester: 'Summer 2025', paymentDate: '30/03/2025', receiptNo: '0008', amount: 15200, currency: 'Taka' },
  { serial: 8, semester: 'Summer 2025', paymentDate: '15/05/2025', receiptNo: '0067', amount: 22000, currency: 'Taka' },
  { serial: 9, semester: 'Fall 2025', paymentDate: '30/07/2025', receiptNo: '00225841', amount: 38500, currency: 'Taka' }
]

const totalPaidAmount = paymentHistory.reduce((sum, payment) => sum + payment.amount, 0)

// Mock financial summary
const financialSummary = [
  { semester: 'Fall 2024', payable: 46850.0, paid: 46830.0, dues: 20.00, cumulativeDues: 20.00 },
  { semester: 'Spring 2025', payable: 40800.0, paid: 40820.0, dues: -20.00, cumulativeDues: 0.00 },
  { semester: 'Summer 2025', payable: 41200.0, paid: 37200.0, dues: 4000.00, cumulativeDues: 4000.00 },
  { semester: 'Fall 2025', payable: 45600.0, paid: 38500.0, dues: 7100.00, cumulativeDues: 11100.00 }
]

const totalPayable = financialSummary.reduce((sum, item) => sum + item.payable, 0)
const totalPaid = financialSummary.reduce((sum, item) => sum + item.paid, 0)
const totalDues = financialSummary[financialSummary.length - 1].cumulativeDues

// Mock detailed financial report
const detailedReport = {
  studentId: '20241601234',
  studentName: 'Ahmed Hassan Rahman',
  program: 'CSE-Bachelor of Science in Computer Science and Engineering',
  semesters: [
    {
      semester: 'Fall 2024',
      details: [
        { costHead: 'Admission Fee', costAmount: 14000.00, deductiveAmount: 0.00, payable: 14000.00, paymentDate: '25/04/2024', receiptNo: '00145672', paidAmount: 14000.00 },
        { costHead: 'Foundation Course Fee', costAmount: 5500.00, deductiveAmount: 0.00, payable: 5500.00, paymentDate: '12/06/2024', receiptNo: '00158391', paidAmount: 15500.00 },
        { costHead: 'Semester Fee', costAmount: 6000.00, deductiveAmount: 0.00, payable: 6000.00, paymentDate: '18/07/2024', receiptNo: '00162847', paidAmount: 7800.00 },
        { costHead: 'Total Course Fee', costAmount: 25600.00, deductiveAmount: 0.00, payable: 25600.00, paymentDate: '05/10/2024', receiptNo: '00169524', paidAmount: 9530.00 },
        { costHead: 'Merit Scholarship', costAmount: 0.00, deductiveAmount: 5120.00, payable: -5120.00, paymentDate: '', receiptNo: '', paidAmount: 0.00 },
        { costHead: 'Computer Lab & Library Fee', costAmount: 5500.00, deductiveAmount: 0.00, payable: 5500.00, paymentDate: '', receiptNo: '', paidAmount: 0.00 },
        { costHead: 'Others Deduction', costAmount: 0.00, deductiveAmount: 4380.00, payable: -4380.00, paymentDate: '', receiptNo: '', paidAmount: 0.00 }
      ],
      totalCost: 47450.00,
      totalPaid: 46830.00,
      semesterDues: 20.00,
      duesTillSemester: 20.00
    },
    {
      semester: 'Spring 2025',
      details: [
        { costHead: 'Semester Fee', costAmount: 6000.00, deductiveAmount: 0.00, payable: 6000.00, paymentDate: '28/11/2024', receiptNo: '0095', paidAmount: 28000.00 },
        { costHead: 'Total Course Fee', costAmount: 41600.00, deductiveAmount: 0.00, payable: 41600.00, paymentDate: '12/01/2025', receiptNo: '0042', paidAmount: 12820.00 },
        { costHead: 'Merit Scholarship', costAmount: 0.00, deductiveAmount: 8320.00, payable: -8320.00, paymentDate: '', receiptNo: '', paidAmount: 0.00 }
      ],
      totalCost: 39280.00,
      totalPaid: 40820.00,
      semesterDues: -20.00,
      duesTillSemester: 0.00
    },
    {
      semester: 'Summer 2025',
      details: [
        { costHead: 'Semester Fee', costAmount: 6000.00, deductiveAmount: 0.00, payable: 6000.00, paymentDate: '30/03/2025', receiptNo: '0008', paidAmount: 15200.00 },
        { costHead: 'Total Course Fee', costAmount: 32000.00, deductiveAmount: 0.00, payable: 32000.00, paymentDate: '15/05/2025', receiptNo: '0067', paidAmount: 22000.00 },
        { costHead: 'Special Exam Fee (Final)', costAmount: 4200.00, deductiveAmount: 0.00, payable: 4200.00, paymentDate: '', receiptNo: '', paidAmount: 0.00 },
        { costHead: 'Merit Scholarship', costAmount: 0.00, deductiveAmount: 6400.00, payable: -6400.00, paymentDate: '', receiptNo: '', paidAmount: 0.00 }
      ],
      totalCost: 35800.00,
      totalPaid: 37200.00,
      semesterDues: 4000.00,
      duesTillSemester: 4000.00
    },
    {
      semester: 'Fall 2025',
      details: [
        { costHead: 'Merit Scholarship', costAmount: 0.00, deductiveAmount: 9600.00, payable: -9600.00, paymentDate: '30/07/2025', receiptNo: '00225841', paidAmount: 38500.00 },
        { costHead: 'Semester Fee', costAmount: 6000.00, deductiveAmount: 0.00, payable: 6000.00, paymentDate: '', receiptNo: '', paidAmount: 0.00 },
        { costHead: 'Total Course Fee', costAmount: 48000.00, deductiveAmount: 0.00, payable: 48000.00, paymentDate: '', receiptNo: '', paidAmount: 0.00 }
      ],
      totalCost: 44400.00,
      totalPaid: 38500.00,
      semesterDues: 7100.00,
      duesTillSemester: 11100.00
    }
  ],
  grandTotalCost: 166930.00,
  grandTotalPaid: 163350.00,
  grandTotalDues: 11100.00
}

interface PaymentInformationProps {
  activeTab?: string
  onPaymentUpdate?: (totalOutstanding: number) => void
}

export const PaymentInformation = ({ activeTab = 'payable', onPaymentUpdate }: PaymentInformationProps) => {
  // Convert mock data to state for simulation
  const [payables, setPayables] = useState(payableData)
  const [history, setHistory] = useState(paymentHistory)
  const [financials, setFinancials] = useState(financialSummary)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedSemesterIndex, setSelectedSemesterIndex] = useState<number | null>(null)
  const [simulationAmount, setSimulationAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')

  // Update parent component when outstanding balance changes
  useEffect(() => {
    const totalOutstanding = financials[financials.length - 1]?.cumulativeDues || 0
    onPaymentUpdate?.(totalOutstanding)
  }, [financials, onPaymentUpdate])

  const simulatePayment = (semesterIndex: number, amount: number, method: string) => {
    const semester = payables[semesterIndex]
    const newPayment = {
      serial: history.length + 1,
      semester: semester.semester,
      paymentDate: new Date().toLocaleDateString('en-GB'),
      receiptNo: `SIM-${Date.now()}`,
      amount,
      currency: 'Taka',
    }

    // Update payment history
    setHistory(prev => [newPayment, ...prev])

    // Update payables
    setPayables(prev => {
      const copy = [...prev]
      copy[semesterIndex] = {
        ...copy[semesterIndex],
        totalReceived: (copy[semesterIndex].totalReceived || 0) + amount,
        presentDues: Math.max(0, (copy[semesterIndex].presentDues || 0) - amount),
        thirtyPercentPresentDues: Math.max(0, (copy[semesterIndex].thirtyPercentPresentDues || 0) - amount)
      }
      return copy
    })

    // Update financials
    setFinancials(prev => {
      const copy = [...prev]
      const semesterName = semester.semester
      const idx = copy.findIndex(i => i.semester === semesterName)
      if (idx !== -1) {
        copy[idx] = {
          ...copy[idx],
          paid: copy[idx].paid + amount,
          dues: Math.max(0, copy[idx].payable - (copy[idx].paid + amount))
        }

        // Recalculate cumulative dues
        for (let i = 0; i < copy.length; i++) {
          if (i === 0) {
            copy[i].cumulativeDues = copy[i].dues
          } else {
            copy[i].cumulativeDues = copy[i-1].cumulativeDues + copy[i].dues
          }
        }
      }
      return copy
    })

    // Show success message
    alert(`Payment of ৳${amount.toLocaleString()} simulated successfully via ${method}!`)
    setShowPaymentModal(false)
    setSimulationAmount('')
    setPaymentMethod('')
  }

  const openPaymentModal = (semesterIndex: number) => {
    setSelectedSemesterIndex(semesterIndex)
    setShowPaymentModal(true)
  }

  const handleSimulatePayment = () => {
    if (!simulationAmount || !paymentMethod || selectedSemesterIndex === null) {
      alert('Please fill in all fields')
      return
    }

    const amount = parseFloat(simulationAmount)
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    simulatePayment(selectedSemesterIndex, amount, paymentMethod)
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-deep-plum">Payment Information</h1>
        <Badge className="bg-green-100 text-green-800">
          <DollarSign className="w-4 h-4 mr-1" />
          Financial Records
        </Badge>
      </div>

      <Tabs value={activeTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="payable">Payable List</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="summary">Financial Summary</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Report</TabsTrigger>
        </TabsList>

        {/* Payable List Tab */}
        <TabsContent value="payable" className="space-y-4">
          {payables.map((semester, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{semester.semester}</span>
                  <Badge className={semester.presentDues > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                    {semester.presentDues > 0 ? 'Dues Pending' : 'Cleared'}
                  </Badge>
                </CardTitle>
                <CardDescription>Cost Package: {semester.costPackage}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Cost Package:</span>
                      <span>{semester.costPackage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Per Credit Fee:</span>
                      <span>৳{semester.perCreditFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Waiver (%):</span>
                      <span className="text-green-600 font-semibold">{semester.waiverPercent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Dues Upto Previous Semester:</span>
                      <span>৳{semester.duesUptoPrevious.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Charge of Present Semester:</span>
                      <span>৳{semester.chargePresent.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Total Receivable Amount:</span>
                      <span className="font-bold text-deep-plum">৳{semester.totalReceivable.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Total Received Amount:</span>
                      <span className="text-green-600 font-semibold">৳{semester.totalReceived.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Present Dues:</span>
                      <span className={semester.presentDues > 0 ? 'text-red-600 font-bold' : 'text-green-600'}>
                        ৳{semester.presentDues.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Payment Schedule</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>40% Payable (Registration):</span>
                          <span>৳{semester.fortyPercentPayable.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>30% Payable (Mid term):</span>
                          <span>৳{semester.thirtyPercentPayable.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>30% Payable (Final):</span>
                          <span>৳{semester.thirtyPercentFinalPayable.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-deep-plum mb-3">Payable Details</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cost Head</TableHead>
                        <TableHead>Credit Taken</TableHead>
                        <TableHead>Cost Amount</TableHead>
                        <TableHead>Deductive Amount</TableHead>
                        <TableHead>Net Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {semester.payableDetails.map((detail, detailIndex) => (
                        <TableRow key={detailIndex}>
                          <TableCell className="font-medium">{detail.costHead}</TableCell>
                          <TableCell>{detail.creditTaken}</TableCell>
                          <TableCell>৳{detail.costAmount.toFixed(2)}</TableCell>
                          <TableCell className="text-green-600">-৳{detail.deductiveAmount.toFixed(2)}</TableCell>
                          <TableCell className="font-semibold">
                            ৳{(detail.costAmount - detail.deductiveAmount).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Simulate Payment Button */}
                {semester.presentDues > 0 && (
                  <div className="mt-6 pt-4 border-t">
                    <Button
                      onClick={() => openPaymentModal(index)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Simulate Payment (Demo)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Payment History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-deep-plum" />
                <span>Payment History</span>
              </CardTitle>
              <CardDescription>Complete record of all payments made</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serial</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Money Receipt No</TableHead>
                    <TableHead>Payment Amount</TableHead>
                    <TableHead>Currency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((payment) => (
                    <TableRow key={payment.serial}>
                      <TableCell>{payment.serial}</TableCell>
                      <TableCell className="font-medium">{payment.semester}</TableCell>
                      <TableCell>{payment.paymentDate}</TableCell>
                      <TableCell className="font-mono text-sm">{payment.receiptNo}</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{payment.currency}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-green-800">Total Paid Amount:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ৳{history.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Summary Tab */}
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-deep-plum" />
                <span>Financial Summary</span>
              </CardTitle>
              <CardDescription>Overview of payable, paid, and due amounts by semester</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Payable</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Dues</TableHead>
                    <TableHead>Cumulative Dues</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financialSummary.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{item.semester}</TableCell>
                      <TableCell>৳{item.payable.toFixed(2)}</TableCell>
                      <TableCell className="text-green-600">৳{item.paid.toFixed(2)}</TableCell>
                      <TableCell className={item.dues > 0 ? 'text-red-600' : item.dues < 0 ? 'text-green-600' : ''}>
                        ৳{item.dues.toFixed(2)}
                      </TableCell>
                      <TableCell className={item.cumulativeDues > 0 ? 'text-red-600 font-bold' : 'text-green-600'}>
                        ৳{item.cumulativeDues.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">৳{totalPayable.toFixed(2)}</div>
                  <div className="text-sm text-blue-700">Total Payable</div>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">৳{totalPaid.toFixed(2)}</div>
                  <div className="text-sm text-green-700">Total Paid</div>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">৳{totalDues.toFixed(2)}</div>
                  <div className="text-sm text-red-700">Total Outstanding</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Detailed Financial Report Tab */}
        <TabsContent value="detailed">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-deep-plum" />
                <span>Detailed Financial Report</span>
              </CardTitle>
              <CardDescription>Complete breakdown of all financial transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-lavender-bg rounded-lg">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="font-medium text-gray-700">Student ID:</div>
                    <div className="font-semibold text-deep-plum">{detailedReport.studentId}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Student Name:</div>
                    <div className="font-semibold text-deep-plum">{detailedReport.studentName}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Program:</div>
                    <div className="text-sm text-gray-600">{detailedReport.program}</div>
                  </div>
                </div>
              </div>

              {/* Detailed semester-wise breakdown */}
              <div className="space-y-8">
                <h4 className="font-semibold text-deep-plum text-lg">Semester-wise Financial Details</h4>

                {detailedReport.semesters.map((semesterData, index) => (
                  <div key={index} className="border rounded-lg p-6 bg-white shadow-sm">
                    <h5 className="text-lg font-bold text-deep-plum mb-4">{semesterData.semester}</h5>

                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Cost Head/Waiver</TableHead>
                            <TableHead className="text-right">Cost Amount</TableHead>
                            <TableHead className="text-right">Deductive Amount</TableHead>
                            <TableHead className="text-right">Payable</TableHead>
                            <TableHead>Payment Date</TableHead>
                            <TableHead>Money Receipt No</TableHead>
                            <TableHead className="text-right">Paid Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {semesterData.details.map((detail, detailIndex) => (
                            <TableRow key={detailIndex}>
                              <TableCell className="font-medium">{detail.costHead}</TableCell>
                              <TableCell className="text-right">৳{detail.costAmount.toFixed(2)}</TableCell>
                              <TableCell className="text-right text-green-600">৳{detail.deductiveAmount.toFixed(2)}</TableCell>
                              <TableCell className={`text-right font-semibold ${detail.payable < 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                ৳{detail.payable.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-sm">{detail.paymentDate || '-'}</TableCell>
                              <TableCell className="font-mono text-sm">{detail.receiptNo || '-'}</TableCell>
                              <TableCell className="text-right font-semibold text-green-600">
                                {detail.paidAmount > 0 ? `৳${detail.paidAmount.toFixed(2)}` : '-'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="mt-4 pt-4 border-t grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Total Cost in {semesterData.semester}:</span>
                          <span className="font-bold text-blue-600">৳{semesterData.totalCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Total Paid in {semesterData.semester}:</span>
                          <span className="font-bold text-green-600">৳{semesterData.totalPaid.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Dues in {semesterData.semester}:</span>
                          <span className={`font-bold ${semesterData.semesterDues > 0 ? 'text-red-600' : semesterData.semesterDues < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                            ৳{semesterData.semesterDues.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Dues till {semesterData.semester}:</span>
                          <span className={`font-bold ${semesterData.duesTillSemester > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ৳{semesterData.duesTillSemester.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Summary totals */}
                <div className="grid md:grid-cols-3 gap-4 mt-8 pt-6 border-t-2 border-deep-plum">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <div className="text-xl font-bold text-blue-600">৳{detailedReport.grandTotalCost.toFixed(2)}</div>
                    <div className="text-sm text-blue-700">Grand Total Cost</div>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <div className="text-xl font-bold text-green-600">৳{detailedReport.grandTotalPaid.toFixed(2)}</div>
                    <div className="text-sm text-green-700">Grand Total Paid</div>
                  </div>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                    <div className="text-xl font-bold text-red-600">৳{detailedReport.grandTotalDues.toFixed(2)}</div>
                    <div className="text-sm text-red-700">Grand Total Dues</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Guidelines */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <CreditCard className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Payment Guidelines:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Payment deadlines are strictly enforced. Late payments may incur penalties</li>
                <li>• Keep all payment receipts for your records</li>
                <li>• For payment-related queries, contact the Finance Office</li>
                <li>• Online payment options are available through the university portal</li>
                <li>• Merit-based waivers are automatically applied to qualifying students</li>
                <li>• Installment payments must be made according to the schedule</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Simulation Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Simulate Payment</DialogTitle>
            <DialogDescription>
              Simulate a payment to demonstrate the system. This is for demonstration purposes only.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount (৳)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={simulationAmount}
                onChange={(e) => setSimulationAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bkash">bKash</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedSemesterIndex !== null && payables[selectedSemesterIndex] && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">
                  Current dues for {payables[selectedSemesterIndex].semester}:
                  <span className="font-bold"> ৳{payables[selectedSemesterIndex].presentDues.toLocaleString()}</span>
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPaymentModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSimulatePayment}>
              Simulate Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
