import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Search, Eye, Edit, Trash2, FileText, Inbox } from 'lucide-react'
import { Repo } from '@/lib/repo'
import { Payment, PaymentMethod } from '../data/types'
import { formatCurrency } from '../utils/financeUtils'
import EmptyState from '@/components/common/EmptyState'
import { DEMO_MODE } from '@/config/demo'

export default function PaymentRecordsView() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('All')
  const [paymentPurposeFilter, setPaymentPurposeFilter] = useState('All')
  const [studentIdFilter, setStudentIdFilter] = useState('')
  const [semesterFilter, setSemesterFilter] = useState('All')
  const [annexFilter, setAnnexFilter] = useState('All')
  const [programFilter, setProgramFilter] = useState('All')
  const [paymentDateFilter, setPaymentDateFilter] = useState('')
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  useEffect(() => {
    loadPayments()
    const unsub = Repo.subscribe('finance-payments', loadPayments)
    return unsub
  }, [])

  const loadPayments = () => {
    const data = Repo.get<Payment>('finance-payments')
    setPayments(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }

  const handleSearch = () => {
    loadPayments()
  }

  const extractPurpose = (payment: Payment): string => {
    if (payment.notes?.includes('Installment')) return 'Installment'
    if (payment.notes?.includes('Full Payment')) return 'Full Payment'
    if (payment.notes?.includes('Readmission')) return 'Readmission Fee'
    return 'Others'
  }

  const filteredPayments = payments.filter(p => {
    const purpose = extractPurpose(p)
    
    const matchesMethod = paymentMethodFilter === 'All' || p.method === paymentMethodFilter
    const matchesPurpose = paymentPurposeFilter === 'All' || purpose === paymentPurposeFilter
    const matchesStudentId = studentIdFilter === '' || p.studentId.toLowerCase().includes(studentIdFilter.toLowerCase())
    const matchesSemester = semesterFilter === 'All' || p.semester.includes(semesterFilter)
    const matchesAnnex = annexFilter === 'All' || p.campus === annexFilter
    const matchesProgram = programFilter === 'All' || p.program === programFilter
    const matchesDate = paymentDateFilter === '' || p.paymentDate === paymentDateFilter

    return matchesMethod && matchesPurpose && matchesStudentId && matchesSemester && 
           matchesAnnex && matchesProgram && matchesDate
  })

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment)
    setViewDialogOpen(true)
  }

  const handleEditPayment = (payment: Payment) => {
    alert('Edit functionality - to be implemented')
  }

  const handleDeletePayment = (id: string) => {
    if (confirm('Delete this payment record?')) {
      Repo.delete('finance-payments', id)
      alert('Payment deleted successfully')
    }
  }

  const paymentMethods: Array<string> = ['All', 'Cash', 'Bank', 'bKash', 'Card', 'SSLCommerz', 'DBBL Nexus']
  const purposes = ['All', 'Installment', 'Full Payment', 'Readmission Fee', 'Others']
  const semesters = ['All', 'Fall 2024', 'Spring 2025', 'Summer 2025', 'Fall 2025']
  const annexes = ['All', 'Permanent Campus', 'Uttara', 'Lakshmipur']
  const programs = ['All', 'CSE', 'BBA', 'LLB', 'EEE', 'English']

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-deep-plum">Students Payment List</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <select
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                {paymentMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Payment Purpose</label>
              <select
                value={paymentPurposeFilter}
                onChange={(e) => setPaymentPurposeFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                {purposes.map(purpose => (
                  <option key={purpose} value={purpose}>{purpose}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Student ID</label>
              <Input
                placeholder="Student ID"
                value={studentIdFilter}
                onChange={(e) => setStudentIdFilter(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Semester</label>
              <select
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                {semesters.map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Annex</label>
              <select
                value={annexFilter}
                onChange={(e) => setAnnexFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                {annexes.map(annex => (
                  <option key={annex} value={annex}>{annex}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Program</label>
              <select
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                {programs.map(prog => (
                  <option key={prog} value={prog}>{prog}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Payment Date</label>
              <Input
                type="date"
                value={paymentDateFilter}
                onChange={(e) => setPaymentDateFilter(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button onClick={handleSearch} className="nu-button-primary w-full">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {filteredPayments.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No payments found"
              subtitle="No payment records match your current filters. Try adjusting your search criteria."
              actionLabel="Clear Filters"
              onAction={() => {
                setPaymentMethodFilter('All')
                setPaymentPurposeFilter('All')
                setStudentIdFilter('')
                setSemesterFilter('All')
                setAnnexFilter('All')
                setProgramFilter('All')
                setPaymentDateFilter('')
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Student Id</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Student Name</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Semester</th>
                    <th className="text-right p-3 text-sm font-medium text-gray-700">Received Amount</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Payment Date</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Payment Method</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Payment Purpose</th>
                    <th className="text-center p-3 text-sm font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map(payment => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm">{payment.studentId}</td>
                      <td className="p-3 text-sm font-medium">{payment.studentName}</td>
                      <td className="p-3 text-sm">{payment.semester}</td>
                      <td className="p-3 text-sm text-right font-semibold text-green-600">
                        {formatCurrency(payment.totalAmount)}
                      </td>
                      <td className="p-3 text-sm">{payment.paymentDate}</td>
                      <td className="p-3 text-sm">
                        <Badge variant="outline">{payment.method}</Badge>
                      </td>
                      <td className="p-3 text-sm">{extractPurpose(payment)}</td>
                      <td className="p-3">
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewPayment(payment)}
                            title="View Receipt"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPayment(payment)}
                            title={DEMO_MODE ? "Disabled in demo" : "Edit"}
                            disabled={DEMO_MODE}
                          >
                            <Edit className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePayment(payment.id)}
                            title={DEMO_MODE ? "Disabled in demo" : "Delete"}
                            disabled={DEMO_MODE}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="PDF"
                          >
                            <FileText className="w-4 h-4 text-orange-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
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
                  <p className="font-medium">{selectedPayment.studentId}</p>
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
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-semibold text-green-600 text-lg">
                    {formatCurrency(selectedPayment.totalAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium">{selectedPayment.method}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Purpose</p>
                  <p className="font-medium">{extractPurpose(selectedPayment)}</p>
                </div>
                {selectedPayment.notes && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Remarks</p>
                    <p className="font-medium">{selectedPayment.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Close
                </Button>
                <Button className="nu-button-primary">
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
