import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  FileText,
  Eye,
  Download,
  Plus,
  Filter
} from 'lucide-react'
import { financeDataService } from '@/finance/services/financeDataService'
import { FinanceDataServiceHelper } from '@/finance/utils/dataServiceHelper'
import { formatCurrency } from '@/finance/utils/financeUtils'
import { FinanceBill, FinancePayment, FinanceLateFee, FinanceWaiver } from '@/lib/oracleSchema'
import { DEMO_MODE, showDemoToast } from '@/config/demo'

interface DashboardStats {
  totalBills: number
  totalPayments: number
  totalOutstanding: number
  totalWaivers: number
  pendingCollections: number
  overdueBills: number
}

interface DemoTab {
  id: string
  label: string
  icon: React.ReactNode
}

export default function FinanceDemoView() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [bills, setBills] = useState<FinanceBill[]>([])
  const [payments, setPayments] = useState<FinancePayment[]>([])
  const [lateFees, setLateFees] = useState<FinanceLateFee[]>([])
  const [waivers, setWaivers] = useState<FinanceWaiver[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalBills: 0,
    totalPayments: 0,
    totalOutstanding: 0,
    totalWaivers: 0,
    pendingCollections: 0,
    overdueBills: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [selectedBill, setSelectedBill] = useState<FinanceBill | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<FinancePayment | null>(null)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)

  useEffect(() => {
    loadDemoData()
  }, [])

  const loadDemoData = async () => {
    setLoading(true)
    try {
      const [billsData, paymentsData, lateFeesData, waiversData] = await Promise.all([
        FinanceDataServiceHelper.getBillsWithFallback(),
        FinanceDataServiceHelper.getPaymentsWithFallback(),
        FinanceDataServiceHelper.getLateFeesWithFallback(),
        FinanceDataServiceHelper.getWaiversWithFallback()
      ])

      // Convert to proper types
      const typedBills = billsData as unknown as FinanceBill[]
      const typedPayments = paymentsData as unknown as FinancePayment[]
      const typedLateFees = lateFeesData as unknown as FinanceLateFee[]
      const typedWaivers = waiversData as unknown as FinanceWaiver[]

      setBills(typedBills)
      setPayments(typedPayments)
      setLateFees(typedLateFees)
      setWaivers(typedWaivers)

      calculateStats(typedBills, typedPayments, typedLateFees, typedWaivers)
    } catch (error) {
      console.error('Error loading demo data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (
    billsData: FinanceBill[],
    paymentsData: FinancePayment[],
    lateFeesData: FinanceLateFee[],
    waiversData: FinanceWaiver[]
  ) => {
    const totalPaymentAmount = paymentsData.reduce((sum, p) => sum + (p.amount || 0), 0)
    const totalBillAmount = billsData.reduce((sum, b) => sum + (b.amount || 0), 0)
    const totalWaiverAmount = waiversData.reduce((sum, w) => sum + (w.amount || 0), 0)
    const overdueBillsList = billsData.filter(b => b.status === 'Overdue')
    const pendingCollectionsList = billsData.filter(b => b.status === 'Issued' || b.status === 'Partial')

    setStats({
      totalBills: billsData.length,
      totalPayments: paymentsData.length,
      totalOutstanding: Math.max(0, totalBillAmount - totalPaymentAmount),
      totalWaivers: totalWaiverAmount,
      pendingCollections: pendingCollectionsList.length,
      overdueBills: overdueBillsList.length
    })
  }

  const filteredBills = bills.filter(bill => {
    const matchesSearch = searchQuery === '' || 
      (bill.billNo?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (bill.studentId?.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = filterStatus === 'All' || bill.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const handleViewBill = (bill: FinanceBill) => {
    setSelectedBill(bill)
    setViewDialogOpen(true)
  }

  const handlePaymentClick = (payment: FinancePayment) => {
    setSelectedPayment(payment)
    setPaymentDialogOpen(true)
  }

  const demoTabs: DemoTab[] = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'bills', label: 'Student Bills', icon: <FileText className="w-4 h-4" /> },
    { id: 'payments', label: 'Payment Records', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'late-fees', label: 'Late Fee Management', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'waivers', label: 'Waivers', icon: <CheckCircle className="w-4 h-4" /> }
  ]

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6 h-24 bg-gray-200 rounded" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Finance Portal Demo</h1>
        <p className="text-gray-600 mt-2">Comprehensive demonstration of Finance Module features and capabilities</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          {demoTabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Student Bills</p>
                    <p className="text-4xl font-bold">{stats.totalBills}</p>
                  </div>
                  <FileText className="w-12 h-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Payment Records</p>
                    <p className="text-4xl font-bold">{stats.totalPayments}</p>
                  </div>
                  <CheckCircle className="w-12 h-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Outstanding Amount</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.totalOutstanding)}</p>
                  </div>
                  <DollarSign className="w-12 h-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Overdue Bills</p>
                    <p className="text-4xl font-bold">{stats.overdueBills}</p>
                  </div>
                  <AlertCircle className="w-12 h-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Waivers</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.totalWaivers)}</p>
                  </div>
                  <CheckCircle className="w-12 h-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Pending Collections</p>
                    <p className="text-4xl font-bold">{stats.pendingCollections}</p>
                  </div>
                  <Clock className="w-12 h-12 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bills.slice(0, 5).map(bill => (
                    <div key={bill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{bill.billNo}</p>
                        <p className="text-sm text-gray-600">Student: {bill.studentId}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{formatCurrency(bill.amount || 0)}</p>
                        <p className={`text-xs font-semibold ${
                          bill.status === 'Paid' ? 'text-green-600' :
                          bill.status === 'Overdue' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {bill.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payments.slice(0, 5).map(payment => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{payment.receiptNo}</p>
                        <p className="text-sm text-gray-600">{payment.paymentMethod || 'Cash'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{formatCurrency(payment.amount || 0)}</p>
                        <p className="text-xs text-gray-600">{payment.paymentDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bills" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Student Bills Management</CardTitle>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Bill
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search bills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    <option>All</option>
                    <option>Draft</option>
                    <option>Issued</option>
                    <option>Partial</option>
                    <option>Paid</option>
                    <option>Overdue</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Bill No</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Student ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBills.slice(0, 10).map(bill => (
                        <tr key={bill.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{bill.billNo}</td>
                          <td className="py-3 px-4 text-gray-600">{bill.studentId}</td>
                          <td className="py-3 px-4 font-semibold text-blue-600">{formatCurrency(bill.amount || 0)}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              bill.status === 'Paid' ? 'bg-green-100 text-green-800' :
                              bill.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                              bill.status === 'Draft' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {bill.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewBill(bill)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-sm text-gray-600">
                  Showing {Math.min(10, filteredBills.length)} of {filteredBills.length} bills
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Payment Records</CardTitle>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Record Payment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Receipt No</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Bill No</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Method</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.slice(0, 10).map(payment => (
                      <tr key={payment.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{payment.receiptNo}</td>
                        <td className="py-3 px-4 text-gray-600">{payment.billId}</td>
                        <td className="py-3 px-4 font-semibold text-green-600">{formatCurrency(payment.amount || 0)}</td>
                        <td className="py-3 px-4 text-gray-600">{payment.paymentMethod || 'Unknown'}</td>
                        <td className="py-3 px-4 text-gray-600">{payment.paymentDate}</td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePaymentClick(payment)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="late-fees" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Late Fee Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Bill No</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Student ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Late Fee Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Rate</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lateFees.slice(0, 10).map(fee => (
                        <tr key={fee.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{fee.billId}</td>
                          <td className="py-3 px-4 text-gray-600">{fee.studentId}</td>
                          <td className="py-3 px-4 font-semibold text-red-600">{formatCurrency(fee.amount || 0)}</td>
                          <td className="py-3 px-4 text-gray-600">{fee.rate}%</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              fee.status === 'Applied' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {fee.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waivers" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Fee Waivers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Waiver ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Student ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Waiver Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Reason</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {waivers.slice(0, 10).map(waiver => (
                        <tr key={waiver.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{waiver.id}</td>
                          <td className="py-3 px-4 text-gray-600">{waiver.studentId}</td>
                          <td className="py-3 px-4 font-semibold text-purple-600">{formatCurrency(waiver.amount || 0)}</td>
                          <td className="py-3 px-4 text-gray-600">{waiver.reason || 'General'}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              waiver.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              waiver.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {waiver.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bill Details</DialogTitle>
          </DialogHeader>
          {selectedBill && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Bill No</label>
                  <p className="font-semibold">{selectedBill.billNo}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Student ID</label>
                  <p className="font-semibold">{selectedBill.studentId}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Amount</label>
                  <p className="font-semibold text-blue-600">{formatCurrency(selectedBill.amount || 0)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <p className="font-semibold">{selectedBill.status}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Bill Date</label>
                  <p className="font-semibold">{selectedBill.billDate}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Due Date</label>
                  <p className="font-semibold">{selectedBill.dueDate}</p>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Receipt No</label>
                  <p className="font-semibold">{selectedPayment.receiptNo}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Amount</label>
                  <p className="font-semibold text-green-600">{formatCurrency(selectedPayment.amount || 0)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Payment Method</label>
                  <p className="font-semibold">{selectedPayment.paymentMethod}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Payment Date</label>
                  <p className="font-semibold">{selectedPayment.paymentDate}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-600">Bill Reference</label>
                  <p className="font-semibold">{selectedPayment.billId}</p>
                </div>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
