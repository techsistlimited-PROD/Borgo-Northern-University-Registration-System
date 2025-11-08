import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Receipt, Download, Printer } from 'lucide-react'
import { Repo } from '@/lib/repo'
import { Payment } from '../data/types'
import { formatCurrency, formatShortId } from '../utils/financeUtils'

export default function PaymentRecordsView() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadPayments()
    const unsub = Repo.subscribe('finance-payments', loadPayments)
    return unsub
  }, [])

  const loadPayments = () => {
    const data = Repo.get<Payment>('finance-payments')
    setPayments(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }

  const filteredPayments = payments.filter(p =>
    p.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const colors = {
      Completed: 'bg-green-100 text-green-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Failed: 'bg-red-100 text-red-800',
      Refunded: 'bg-gray-100 text-gray-800'
    }
    return <Badge className={colors[status as keyof typeof colors] || colors.Completed}>{status}</Badge>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Payment Records</h1>
          <p className="text-sm text-gray-600">View all money receipts and payment history</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Money Receipts ({filteredPayments.length})</CardTitle>
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by receipt no, student ID, or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Receipt No</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Date/Time</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Student ID</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Student Name</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Program</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-700">Amount</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Method</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Collected By</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map(payment => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-mono font-medium text-blue-600">{payment.receiptNo}</td>
                    <td className="p-3 text-sm">
                      <div>{payment.paymentDate}</div>
                      <div className="text-xs text-gray-500">{payment.paymentTime}</div>
                    </td>
                    <td className="p-3 text-sm">{payment.studentId}</td>
                    <td className="p-3 text-sm font-medium">{payment.studentName}</td>
                    <td className="p-3 text-sm">{payment.program}</td>
                    <td className="p-3 text-sm text-right font-semibold text-green-600">
                      {formatCurrency(payment.totalAmount)}
                    </td>
                    <td className="p-3 text-sm">
                      <Badge variant="outline">{payment.method}</Badge>
                    </td>
                    <td className="p-3 text-sm">{payment.collectedBy}</td>
                    <td className="p-3">{getStatusBadge(payment.status)}</td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" title="Print Receipt">
                          <Printer className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
