import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Search, FileText, Download, Eye } from 'lucide-react'
import { Repo } from '@/lib/repo'
import { Payment } from '@/finance/data/types'
import { formatCurrency } from '@/finance/utils/financeUtils'

export default function PaymentCollection() {
  const [activeTab, setActiveTab] = useState<'collect' | 'records'>('collect')
  const [payments, setPayments] = useState<Payment[]>([])
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [dateFilter, setDateFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadPayments()
    const unsub = Repo.subscribe('finance-payments', loadPayments)
    return unsub
  }, [])

  const loadPayments = () => {
    const data = Repo.get<Payment>('finance-payments')
    setPayments(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment)
    setViewDialogOpen(true)
  }

  const handlePrintReceipt = (payment: Payment) => {
    alert(`Print Receipt: ${payment.receiptNo}\n\nThis would open a print preview or generate a PDF receipt.\n\nStudent: ${payment.studentName}\nAmount: ${formatCurrency(payment.amount)}\nMethod: ${payment.method}`)
    // In production, this would call a print utility or open a print dialog
    // window.print() or navigate to a receipt print page
  }

  const filteredPayments = payments.filter(p => {
    if (methodFilter !== 'all' && p.method !== methodFilter) return false
    if (statusFilter !== 'all' && p.status !== statusFilter) return false
    return true
  })

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-deep-plum">Payments</h1>

      <div className="border-b">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('collect')}
            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'collect' ? 'border-deep-plum text-deep-plum' : 'border-transparent text-gray-500'
            }`}
          >
            Collect Payment
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'records' ? 'border-deep-plum text-deep-plum' : 'border-transparent text-gray-500'
            }`}
          >
            Payment Records
          </button>
        </div>
      </div>

      {activeTab === 'collect' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Lookup</CardTitle>
              <CardDescription>Fetch outstanding dues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID / Invoice No.</label>
                <Input placeholder="Enter Student ID or Invoice No." />
              </div>
              <Button className="nu-button-primary w-full">
                <Search className="w-4 h-4 mr-2" />
                Fetch Dues
              </Button>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle>Outstanding Summary</CardTitle>
              <CardDescription>CSE-25-01-0037 — Md. Arif Hossain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Semester:</span>
                  <span className="font-medium">Fall 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Outstanding:</span>
                  <span className="font-semibold text-red-600">BDT 18,750.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Oldest Invoice:</span>
                  <Badge className="bg-red-100 text-red-800">INV-2025-000923 (Overdue)</Badge>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select className="w-full p-2 border rounded-md">
                  <option>Cash</option>
                  <option>Bank Deposit</option>
                  <option>SSLCommerz Gateway</option>
                  <option>bKash</option>
                  <option>Card</option>
                  <option>DBBL Nexus</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount Received (BDT)</label>
                <Input type="number" placeholder="0.00" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Money Receipt No.</label>
                <Input defaultValue="MR-2025-44113" />
              </div>

              <Button className="w-full nu-button-primary">
                <FileText className="w-4 h-4 mr-2" />
                Post Payment & Print MR
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'records' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Payment Records</CardTitle>
                <CardDescription>View and manage payment transactions</CardDescription>
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date Range</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="all">All Methods</option>
                  <option value="Cash">Cash</option>
                  <option value="bKash">bKash</option>
                  <option value="Bank">Bank</option>
                  <option value="Card">Card</option>
                  <option value="SSLCommerz">SSLCommerz</option>
                  <option value="DBBL Nexus">DBBL Nexus</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-medium text-gray-700">MR No.</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Student ID / Name</th>
                    <th className="text-right p-3 text-sm font-medium text-gray-700">Amount (BDT)</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Method</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Allocated Invoice(s)</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Time</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-gray-500">
                        No payment records found
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr key={payment.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm font-mono">{payment.receiptNo}</td>
                        <td className="p-3 text-sm">
                          <div className="font-mono text-xs text-gray-600">{payment.studentId}</div>
                          <div className="font-medium">{payment.studentName}</div>
                        </td>
                        <td className="p-3 text-sm text-right font-semibold text-green-600">
                          {formatCurrency(payment.totalAmount)}
                        </td>
                        <td className="p-3 text-sm">
                          <Badge variant="outline">{payment.method}</Badge>
                        </td>
                        <td className="p-3 text-sm font-mono text-xs">
                          {payment.allocations?.map(a => a.billNo).join(', ') || '-'}
                        </td>
                        <td className="p-3 text-sm">
                          {new Date(payment.createdAt).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="p-3">
                          <Badge className={
                            payment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            payment.status === 'Refunded' ? 'bg-teal-100 text-teal-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {payment.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewPayment(payment)}
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Print Receipt"
                              onClick={() => handlePrintReceipt(payment)}
                            >
                              <FileText className="w-4 h-4 text-orange-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Receipt Details</DialogTitle>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded">
                <div>
                  <p className="text-sm text-gray-600">Receipt No</p>
                  <p className="font-mono font-semibold">{selectedPayment.receiptNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Date</p>
                  <p className="font-medium">{selectedPayment.paymentDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Student ID</p>
                  <p className="font-mono">{selectedPayment.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Student Name</p>
                  <p className="font-medium">{selectedPayment.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Program</p>
                  <p className="font-medium">{selectedPayment.program}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Semester</p>
                  <p className="font-medium">{selectedPayment.semester}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount Paid</p>
                  <p className="font-semibold text-green-600 text-lg">
                    {formatCurrency(selectedPayment.totalAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium">{selectedPayment.method}</p>
                </div>
                {selectedPayment.transactionRef && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Transaction Reference</p>
                    <p className="font-mono text-sm">{selectedPayment.transactionRef}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Allocated to Bills</p>
                  <div className="mt-1 space-y-1">
                    {selectedPayment.allocations?.map((alloc, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="font-mono">{alloc.billNo}</span>
                        <span className="font-semibold">{formatCurrency(alloc.allocatedAmount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {selectedPayment.collectedBy && (
                  <div>
                    <p className="text-sm text-gray-600">Collected By</p>
                    <p className="font-medium">{selectedPayment.collectedBy}</p>
                  </div>
                )}
                {selectedPayment.notes && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Notes</p>
                    <p className="font-medium">{selectedPayment.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Close
                </Button>
                <Button className="nu-button-primary" onClick={() => selectedPayment && handlePrintReceipt(selectedPayment)}>
                  <FileText className="w-4 h-4 mr-2" />
                  Print Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
