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
  Filter,
  Users,
  Wallet,
  Award,
  Building2,
  BarChart3,
  Settings,
  XCircle,
  ArrowUpDown,
  Calendar
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
  todayCollection: number
  monthCollection: number
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
    overdueBills: 0,
    todayCollection: 0,
    monthCollection: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [selectedBill, setSelectedBill] = useState<FinanceBill | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

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

    const today = new Date().toISOString().split('T')[0]
    const todayPayments = paymentsData.filter(p => p.paymentDate === today)
    const todayCollection = todayPayments.reduce((sum, p) => sum + (p.amount || 0), 0)

    const thisMonth = new Date().toISOString().substring(0, 7)
    const monthPayments = paymentsData.filter(p => p.paymentDate.startsWith(thisMonth))
    const monthCollection = monthPayments.reduce((sum, p) => sum + (p.amount || 0), 0)

    setStats({
      totalBills: billsData.length,
      totalPayments: paymentsData.length,
      totalOutstanding: Math.max(0, totalBillAmount - totalPaymentAmount),
      totalWaivers: totalWaiverAmount,
      pendingCollections: pendingCollectionsList.length,
      overdueBills: overdueBillsList.length,
      todayCollection,
      monthCollection
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

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
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
        <h1 className="text-3xl font-bold text-gray-900">Finance Portal - Complete Demo</h1>
        <p className="text-gray-600 mt-2">Comprehensive demonstration of all Finance Module features</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 lg:w-auto gap-1">
          <TabsTrigger value="dashboard"><TrendingUp className="w-4 h-4 mr-1" />Dashboard</TabsTrigger>
          <TabsTrigger value="ledger"><Users className="w-4 h-4 mr-1" />Ledger</TabsTrigger>
          <TabsTrigger value="payables"><FileText className="w-4 h-4 mr-1" />Bills</TabsTrigger>
          <TabsTrigger value="late-fees"><Clock className="w-4 h-4 mr-1" />Late Fees</TabsTrigger>
          <TabsTrigger value="drop-readmit"><ArrowUpDown className="w-4 h-4 mr-1" />Drop/Readmit</TabsTrigger>
          <TabsTrigger value="collect"><Wallet className="w-4 h-4 mr-1" />Collect</TabsTrigger>
          <TabsTrigger value="payments"><DollarSign className="w-4 h-4 mr-1" />Payments</TabsTrigger>
          <TabsTrigger value="waivers"><Award className="w-4 h-4 mr-1" />Waivers</TabsTrigger>
          <TabsTrigger value="fines"><XCircle className="w-4 h-4 mr-1" />Fines</TabsTrigger>
          <TabsTrigger value="bank-recon"><Building2 className="w-4 h-4 mr-1" />Bank</TabsTrigger>
          <TabsTrigger value="reports"><BarChart3 className="w-4 h-4 mr-1" />Reports</TabsTrigger>
          <TabsTrigger value="setup"><Settings className="w-4 h-4 mr-1" />Setup</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Bills</p>
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
                    <p className="text-sm opacity-90">Payments</p>
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
                    <p className="text-sm opacity-90">Outstanding</p>
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
                    <p className="text-sm opacity-90">Overdue</p>
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
                    <p className="text-sm opacity-90">Waivers</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.totalWaivers)}</p>
                  </div>
                  <Award className="w-12 h-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Pending</p>
                    <p className="text-4xl font-bold">{stats.pendingCollections}</p>
                  </div>
                  <Clock className="w-12 h-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Today's Collection</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.todayCollection)}</p>
                  </div>
                  <Calendar className="w-12 h-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">This Month</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.monthCollection)}</p>
                  </div>
                  <TrendingUp className="w-12 h-12 opacity-80" />
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

        {/* Student Ledger Tab */}
        <TabsContent value="ledger" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Student Ledger / Account Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input placeholder="Student ID" className="w-full" />
                  <Input placeholder="Student Name" className="w-full" />
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => alert('Search Ledger - Demo Feature: In production, this will search for student accounts and display detailed transaction history')}>
                    <Search className="w-4 h-4 mr-2" />
                    Search Ledger
                  </Button>
                </div>
                
                <div className="border rounded-lg p-6 bg-gray-50">
                  <h3 className="font-bold text-lg mb-4">Student Account Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Billed</p>
                      <p className="text-xl font-bold text-blue-600">{formatCurrency(45000)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Paid</p>
                      <p className="text-xl font-bold text-green-600">{formatCurrency(30000)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Balance Due</p>
                      <p className="text-xl font-bold text-orange-600">{formatCurrency(15000)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Waivers</p>
                      <p className="text-xl font-bold text-purple-600">{formatCurrency(5000)}</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Debit</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Credit</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4">2025-01-15</td>
                        <td className="py-3 px-4">Tuition Fee - Fall 2024</td>
                        <td className="py-3 px-4 text-right font-semibold text-blue-600">{formatCurrency(25000)}</td>
                        <td className="py-3 px-4 text-right">-</td>
                        <td className="py-3 px-4 text-right font-bold">{formatCurrency(25000)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">2025-01-20</td>
                        <td className="py-3 px-4">Payment - Bank Transfer</td>
                        <td className="py-3 px-4 text-right">-</td>
                        <td className="py-3 px-4 text-right font-semibold text-green-600">{formatCurrency(15000)}</td>
                        <td className="py-3 px-4 text-right font-bold">{formatCurrency(10000)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">2025-02-01</td>
                        <td className="py-3 px-4">Lab Fee</td>
                        <td className="py-3 px-4 text-right font-semibold text-blue-600">{formatCurrency(5000)}</td>
                        <td className="py-3 px-4 text-right">-</td>
                        <td className="py-3 px-4 text-right font-bold">{formatCurrency(15000)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => alert('Export PDF - Demo Feature: In production, this will generate a PDF of the student ledger')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="outline" onClick={() => alert('Export Excel - Demo Feature: In production, this will export ledger data to Excel format')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Excel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bills Tab - existing comprehensive implementation */}
        <TabsContent value="payables" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Student Payables / Bills Management</CardTitle>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => alert('Create Bill - Demo Feature: In production, this will open a form to create a new student bill')}>
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
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Due Date</th>
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
                          <td className="py-3 px-4 text-gray-600">{bill.dueDate}</td>
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

        {/* Late Fees Tab */}
        <TabsContent value="late-fees" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Bulk Late Fee Assignment</CardTitle>
                <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => alert('Assign Late Fees - Demo Feature: In production, this will bulk assign late fees to selected bills')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Assign Late Fees
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
                    <select className="w-full px-3 py-2 border rounded-lg">
                      <option>All Programs</option>
                      <option>BBA</option>
                      <option>BTech</option>
                      <option>MBA</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Campus</label>
                    <select className="w-full px-3 py-2 border rounded-lg">
                      <option>All Campuses</option>
                      <option>Main Campus</option>
                      <option>Uttara</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Late Fee Rate</label>
                    <select className="w-full px-3 py-2 border rounded-lg">
                      <option>2%</option>
                      <option>3%</option>
                      <option>5%</option>
                      <option>10%</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => alert('Calculate Fees - Demo Feature: In production, this will calculate late fees based on selected criteria')}>
                      Calculate Fees
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4">
                          <input type="checkbox" className="rounded" />
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Bill No</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Student ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Original Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Days Overdue</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Late Fee</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lateFees.slice(0, 10).map(fee => (
                        <tr key={fee.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <input type="checkbox" className="rounded" />
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-900">{fee.billId}</td>
                          <td className="py-3 px-4 text-gray-600">{fee.studentId}</td>
                          <td className="py-3 px-4 font-semibold text-blue-600">{formatCurrency(15000)}</td>
                          <td className="py-3 px-4 text-gray-600">{Math.floor(Math.random() * 60)} days</td>
                          <td className="py-3 px-4 font-semibold text-red-600">{formatCurrency(fee.amount || 0)}</td>
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

        {/* Drop/Readmission Tab */}
        <TabsContent value="drop-readmit" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Drop / Re-admission Fee Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-6 bg-blue-50">
                    <h3 className="font-bold text-lg mb-4 text-blue-900">Semester Drop Applications</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <div>
                          <p className="font-semibold">STU12345 - John Doe</p>
                          <p className="text-sm text-gray-600">Fall 2024 Drop Request</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange-600">{formatCurrency(5000)}</p>
                          <p className="text-xs text-gray-600">Drop Fee</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <div>
                          <p className="font-semibold">STU12346 - Jane Smith</p>
                          <p className="text-sm text-gray-600">Spring 2025 Drop Request</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange-600">{formatCurrency(5000)}</p>
                          <p className="text-xs text-gray-600">Drop Fee</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-6 bg-green-50">
                    <h3 className="font-bold text-lg mb-4 text-green-900">Re-admission Applications</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <div>
                          <p className="font-semibold">STU12347 - Mike Johnson</p>
                          <p className="text-sm text-gray-600">Re-admission to Fall 2025</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{formatCurrency(10000)}</p>
                          <p className="text-xs text-gray-600">Re-admission Fee</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <div>
                          <p className="font-semibold">STU12348 - Sarah Williams</p>
                          <p className="text-sm text-gray-600">Re-admission to Spring 2025</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{formatCurrency(10000)}</p>
                          <p className="text-xs text-gray-600">Re-admission Fee</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Collection Tab */}
        <TabsContent value="collect" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                    <Input placeholder="Enter Student ID" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <select className="w-full px-3 py-2 border rounded-lg">
                      <option>Cash</option>
                      <option>Bank Transfer</option>
                      <option>Card</option>
                      <option>Cheque</option>
                      <option>Online Gateway</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <Input type="number" placeholder="Enter Amount" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reference No</label>
                    <Input placeholder="Transaction/Cheque Reference" />
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-semibold mb-3">Outstanding Bills for Selected Student</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-white rounded">
                      <div>
                        <input type="checkbox" className="mr-3 rounded" />
                        <span className="font-medium">BILL000123 - Tuition Fee</span>
                      </div>
                      <span className="font-bold text-blue-600">{formatCurrency(25000)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded">
                      <div>
                        <input type="checkbox" className="mr-3 rounded" />
                        <span className="font-medium">BILL000124 - Lab Fee</span>
                      </div>
                      <span className="font-bold text-blue-600">{formatCurrency(5000)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="font-semibold text-lg">Total Collection Amount:</span>
                  <span className="font-bold text-2xl text-green-600">{formatCurrency(30000)}</span>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => alert('Confirm Payment - Demo Feature: In production, this will process the payment and update student account')}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Payment
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => alert('Print Receipt - Demo Feature: In production, this will generate and print a payment receipt')}>
                    <Download className="w-4 h-4 mr-2" />
                    Print Receipt
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Records Tab */}
        <TabsContent value="payments" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Records & History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Receipt No</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Bill No</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Student ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Method</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.slice(0, 15).map(payment => (
                      <tr key={payment.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{payment.receiptNo}</td>
                        <td className="py-3 px-4 text-gray-600">{payment.billId}</td>
                        <td className="py-3 px-4 text-gray-600">STU{Math.floor(Math.random() * 10000)}</td>
                        <td className="py-3 px-4 font-semibold text-green-600">{formatCurrency(payment.amount || 0)}</td>
                        <td className="py-3 px-4 text-gray-600">{payment.paymentMethod || 'Cash'}</td>
                        <td className="py-3 px-4 text-gray-600">{payment.paymentDate}</td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm" onClick={() => alert(`View Payment Details for ${payment.receiptNo}`)}>
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

        {/* Waivers Tab */}
        <TabsContent value="waivers" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Fee Waivers & Scholarships</CardTitle>
                <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => alert('Create Waiver - Demo Feature: In production, this will open a form to create a new fee waiver application')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Waiver
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Waiver ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Student ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Reason</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Request Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {waivers.slice(0, 10).map(waiver => (
                      <tr key={waiver.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{waiver.id.substring(0, 8)}</td>
                        <td className="py-3 px-4 text-gray-600">{waiver.studentId}</td>
                        <td className="py-3 px-4 font-semibold text-purple-600">{formatCurrency(waiver.amount || 0)}</td>
                        <td className="py-3 px-4 text-gray-600">{waiver.reason || 'Merit Based'}</td>
                        <td className="py-3 px-4 text-gray-600">{waiver.requestDate}</td>
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fines & Holds Tab */}
        <TabsContent value="fines" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Fines & Account Holds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-red-50">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <XCircle className="w-12 h-12 text-red-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-red-600">45</p>
                        <p className="text-sm text-gray-600">Active Holds</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-yellow-50">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-yellow-600">23</p>
                        <p className="text-sm text-gray-600">Pending Fines</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-green-600">187</p>
                        <p className="text-sm text-gray-600">Cleared This Month</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Student ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Hold Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Reason</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount Due</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Applied Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">STU{String(i).padStart(5, '0')}</td>
                          <td className="py-3 px-4 text-gray-600">Financial Hold</td>
                          <td className="py-3 px-4 text-gray-600">Outstanding Tuition</td>
                          <td className="py-3 px-4 font-semibold text-red-600">{formatCurrency(15000 + i * 1000)}</td>
                          <td className="py-3 px-4 text-gray-600">2025-01-{String(i * 5).padStart(2, '0')}</td>
                          <td className="py-3 px-4">
                            <Button variant="outline" size="sm">
                              Release Hold
                            </Button>
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

        {/* Bank Reconciliation Tab */}
        <TabsContent value="bank-recon" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Bank Reconciliation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account</label>
                    <select className="w-full px-3 py-2 border rounded-lg">
                      <option>Account 1234-5678-9012</option>
                      <option>Account 9876-5432-1098</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                    <Input type="date" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <h4 className="font-semibold mb-3 text-blue-900">System Balance</h4>
                    <p className="text-3xl font-bold text-blue-600">{formatCurrency(1250000)}</p>
                    <p className="text-sm text-gray-600 mt-2">As per finance records</p>
                  </div>
                  <div className="border rounded-lg p-4 bg-green-50">
                    <h4 className="font-semibold mb-3 text-green-900">Bank Balance</h4>
                    <p className="text-3xl font-bold text-green-600">{formatCurrency(1248500)}</p>
                    <p className="text-sm text-gray-600 mt-2">As per bank statement</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-yellow-50">
                  <h4 className="font-semibold mb-3 text-yellow-900">Reconciliation Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Unreconciled Transactions:</span>
                      <span className="font-bold">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Difference Amount:</span>
                      <span className="font-bold text-red-600">{formatCurrency(1500)}</span>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">System Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Bank Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3].map((i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">2025-01-{String(i * 5).padStart(2, '0')}</td>
                          <td className="py-3 px-4">Payment Collection Batch #{i}</td>
                          <td className="py-3 px-4 font-semibold text-blue-600">{formatCurrency(50000)}</td>
                          <td className="py-3 px-4 font-semibold text-green-600">{formatCurrency(i === 2 ? 49500 : 50000)}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              i === 2 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {i === 2 ? 'Mismatch' : 'Matched'}
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

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports & Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Collection Summary', icon: DollarSign, color: 'green' },
                  { name: 'Outstanding Report', icon: AlertCircle, color: 'orange' },
                  { name: 'Payment Analysis', icon: TrendingUp, color: 'blue' },
                  { name: 'Waiver Summary', icon: Award, color: 'purple' },
                  { name: 'Late Fee Report', icon: Clock, color: 'red' },
                  { name: 'Campus-wise Collection', icon: Building2, color: 'teal' },
                  { name: 'Program-wise Revenue', icon: BarChart3, color: 'indigo' },
                  { name: 'Monthly Trends', icon: Calendar, color: 'pink' },
                  { name: 'Refund Analysis', icon: ArrowUpDown, color: 'cyan' }
                ].map((report, i) => {
                  const Icon = report.icon
                  return (
                    <Card key={i} className={`cursor-pointer hover:shadow-lg transition-shadow bg-${report.color}-50 border-${report.color}-200`}>
                      <CardContent className="pt-6">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 bg-${report.color}-100 rounded-lg`}>
                            <Icon className={`w-6 h-6 text-${report.color}-600`} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{report.name}</p>
                            <p className="text-sm text-gray-600">Generate Report</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Setup Tab */}
        <TabsContent value="setup" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Cost Heads</CardTitle>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['Tuition Fee', 'Lab Fee', 'Library Fee', 'Sports Fee', 'Examination Fee'].map((head, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">{head}</p>
                        <p className="text-sm text-gray-600">CH{String(i + 1).padStart(3, '0')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{formatCurrency((i + 1) * 5000)}</p>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Cost Packages</CardTitle>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['BBA - Full Package', 'BTech - Full Package', 'MBA - Full Package'].map((pkg, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">{pkg}</p>
                        <p className="text-sm text-gray-600">PKG{String(i + 1).padStart(3, '0')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{formatCurrency(75000 + i * 10000)}</p>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
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
    </div>
  )
}
