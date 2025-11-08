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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date Range</label>
                <select className="w-full p-2 border rounded-md text-sm">
                  <option>Today</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Officer</label>
                <select className="w-full p-2 border rounded-md text-sm">
                  <option>All Officers</option>
                  <option>Mahfuz Rahman</option>
                  <option>Faria Islam</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Payment Method</label>
                <select className="w-full p-2 border rounded-md text-sm">
                  <option>All Methods</option>
                  <option>Cash</option>
                  <option>bKash</option>
                  <option>Bank</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full p-2 border rounded-md text-sm">
                  <option>All Status</option>
                  <option>Normal</option>
                  <option>Refunded</option>
                  <option>Void</option>
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
                  {paymentRecords.map((record, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm font-mono">{record.mr}</td>
                      <td className="p-3 text-sm">
                        <div className="font-mono text-xs">{record.studentId}</div>
                        <div>{record.name}</div>
                      </td>
                      <td className="p-3 text-sm text-right font-semibold">{record.amount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                      <td className="p-3 text-sm">{record.method}</td>
                      <td className="p-3 text-sm font-mono text-xs">{record.invoice}</td>
                      <td className="p-3 text-sm">{record.time}</td>
                      <td className="p-3">
                        <Badge className={record.status === 'Refunded' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-800'}>
                          {record.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <FileText className="w-4 h-4" />
                          </Button>
                          {record.status === 'Normal' && (
                            <Button variant="ghost" size="sm">🔒 Refund</Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
