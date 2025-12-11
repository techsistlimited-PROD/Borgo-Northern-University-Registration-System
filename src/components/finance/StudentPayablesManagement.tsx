import { useState, useEffect } from 'react'
import { Repo } from '@/lib/repo'
import { StudentPayable, Student, Receipt, Semester, Campus, Program, CostHead } from '@/lib/seedAll'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, Eye, Plus, Printer } from 'lucide-react'
import { exportToCSV, printContent, generateTableHTML } from '@/lib/exportUtils'

export default function StudentPayablesManagement() {
  const [payables, setPayables] = useState<StudentPayable[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [campuses, setCampuses] = useState<Campus[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [costHeads, setCostHeads] = useState<CostHead[]>([])

  const [filters, setFilters] = useState({
    semester: '',
    campus: '',
    program: '',
    search: ''
  })

  const [selectedPayable, setSelectedPayable] = useState<StudentPayable | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showReceiptDialog, setShowReceiptDialog] = useState(false)
  const [newReceipt, setNewReceipt] = useState({
    amount: 0,
    method: 'Cash' as 'Cash' | 'Bank' | 'bKash' | 'Card' | 'SSLCommerz',
    reference: '',
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    loadData()
    const unsubPayables = Repo.subscribe<StudentPayable>('studentPayables', setPayables)
    const unsubStudents = Repo.subscribe<Student>('students', setStudents)
    const unsubReceipts = Repo.subscribe<Receipt>('receipts', setReceipts)
    const unsubSemesters = Repo.subscribe<Semester>('semesters', setSemesters)
    const unsubCampuses = Repo.subscribe<Campus>('campuses', setCampuses)
    const unsubPrograms = Repo.subscribe<Program>('programs', setPrograms)
    const unsubCostHeads = Repo.subscribe<CostHead>('costHeads', setCostHeads)

    return () => {
      unsubPayables()
      unsubStudents()
      unsubReceipts()
      unsubSemesters()
      unsubCampuses()
      unsubPrograms()
      unsubCostHeads()
    }
  }, [])

  const loadData = () => {
    setPayables(Repo.get<StudentPayable>('studentPayables'))
    setStudents(Repo.get<Student>('students'))
    setReceipts(Repo.get<Receipt>('receipts'))
    setSemesters(Repo.get<Semester>('semesters'))
    setCampuses(Repo.get<Campus>('campuses'))
    setPrograms(Repo.get<Program>('programs'))
    setCostHeads(Repo.get<CostHead>('costHeads'))
  }

  const getFilteredPayables = () => {
    return payables.filter(payable => {
      const student = students.find(s => s.id === payable.studentId)
      if (!student) return false

      if (filters.semester && payable.semesterId !== filters.semester) return false
      if (filters.campus && student.campusId !== filters.campus) return false
      if (filters.program && student.program !== filters.program) return false
      if (filters.search && !student.name.toLowerCase().includes(filters.search.toLowerCase()) && !student.id.includes(filters.search)) return false

      return true
    })
  }

  const getPayableReceipts = (payableId: string) => {
    return receipts.filter(r => r.payableId === payableId)
  }

  const handleAddReceipt = () => {
    if (!selectedPayable || newReceipt.amount <= 0) return

    const receipt: Receipt = {
      id: `RCP${receipts.length + 1}`,
      moneyReceiptNo: `MR-2025-${(44000 + receipts.length).toString().padStart(5, '0')}`,
      studentId: selectedPayable.studentId,
      payableId: selectedPayable.id,
      amount: newReceipt.amount,
      method: newReceipt.method,
      reference: newReceipt.reference,
      date: newReceipt.date,
      collectedBy: 'Finance Officer'
    }

    Repo.add<Receipt>('receipts', receipt)

    const newPaidAmount = selectedPayable.paidAmount + newReceipt.amount
    const newDueAmount = selectedPayable.totalAmount - newPaidAmount
    const newStatus = newDueAmount === 0 ? 'Paid' : newDueAmount < selectedPayable.totalAmount ? 'Partially Paid' : selectedPayable.status

    Repo.update<StudentPayable>('studentPayables', selectedPayable.id, {
      paidAmount: newPaidAmount,
      dueAmount: newDueAmount,
      status: newStatus as StudentPayable['status']
    })

    setShowReceiptDialog(false)
    setNewReceipt({ amount: 0, method: 'Cash', reference: '', date: new Date().toISOString().split('T')[0] })
    loadData()
  }

  const handlePrintStatement = (payable: StudentPayable) => {
    const student = students.find(s => s.id === payable.studentId)
    const payableReceipts = getPayableReceipts(payable.id)

    const lineRows = payable.lines.map(line => {
      const costHead = costHeads.find(c => c.id === line.costHeadId)
      return [
        costHead?.name || '',
        line.amount.toFixed(2),
        line.waiverAmount.toFixed(2),
        line.scholarshipAmount.toFixed(2),
        line.netAmount.toFixed(2)
      ]
    })

    const receiptRows = payableReceipts.map(r => [
      r.date,
      r.moneyReceiptNo,
      r.method,
      r.reference,
      r.amount.toFixed(2)
    ])

    const html = `
      <div style="margin-bottom: 20px;">
        <h2>Statement of Account</h2>
        <div style="margin-top: 10px;">
          <strong>Student:</strong> ${student?.name} (${student?.id})<br>
          <strong>Program:</strong> ${student?.programName}<br>
          <strong>Bill No:</strong> ${payable.billNo}<br>
          <strong>Bill Date:</strong> ${payable.billDate}<br>
          <strong>Due Date:</strong> ${payable.dueDate}
        </div>
      </div>

      <h3>Line Items</h3>
      ${generateTableHTML(
        ['Cost Head', 'Amount', 'Waiver', 'Scholarship', 'Net Amount'],
        lineRows
      )}

      <div style="margin-top: 20px; text-align: right;">
        <strong>Total: ${payable.totalAmount.toFixed(2)} BDT</strong><br>
        <strong>Paid: ${payable.paidAmount.toFixed(2)} BDT</strong><br>
        <strong style="color: ${payable.dueAmount > 0 ? 'red' : 'green'};">Due: ${payable.dueAmount.toFixed(2)} BDT</strong>
      </div>

      ${payableReceipts.length > 0 ? `
        <h3 style="margin-top: 30px;">Payment History</h3>
        ${generateTableHTML(
          ['Date', 'MR No', 'Method', 'Reference', 'Amount'],
          receiptRows
        )}
      ` : ''}
    `

    printContent(`Statement - ${student?.name}`, html)
  }

  const handleExport = () => {
    const filtered = getFilteredPayables()
    const exportData = filtered.map(payable => {
      const student = students.find(s => s.id === payable.studentId)
      return {
        'Student ID': student?.id || '',
        'Student Name': student?.name || '',
        'Program': student?.program || '',
        'Bill No': payable.billNo,
        'Total': payable.totalAmount,
        'Paid': payable.paidAmount,
        'Due': payable.dueAmount,
        'Status': payable.status,
        'Bill Date': payable.billDate,
        'Due Date': payable.dueDate
      }
    })
    exportToCSV(exportData, 'student-payables')
  }

  const filteredPayables = getFilteredPayables()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Student Payables</h1>
          <p className="text-sm text-gray-600">Manage student billing and payments</p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Semester</label>
              <select
                value={filters.semester}
                onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">All Semesters</option>
                {semesters.map(sem => (
                  <option key={sem.id} value={sem.id}>{sem.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Campus</label>
              <select
                value={filters.campus}
                onChange={(e) => setFilters({ ...filters, campus: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">All Campuses</option>
                {campuses.map(campus => (
                  <option key={campus.id} value={campus.id}>{campus.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Program</label>
              <select
                value={filters.program}
                onChange={(e) => setFilters({ ...filters, program: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">All Programs</option>
                {programs.map(prog => (
                  <option key={prog.id} value={prog.code}>{prog.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Search</label>
              <Input
                placeholder="Name or ID..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Student</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Program</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Bill No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Paid</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Due</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPayables.map(payable => {
                  const student = students.find(s => s.id === payable.studentId)
                  const aging = Math.floor((new Date().getTime() - new Date(payable.dueDate).getTime()) / (1000 * 60 * 60 * 24))

                  return (
                    <tr key={payable.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        <div className="font-medium">{student?.name}</div>
                        <div className="text-xs text-gray-600">{student?.id}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">{student?.program}</td>
                      <td className="px-4 py-3 text-sm font-medium">{payable.billNo}</td>
                      <td className="px-4 py-3 text-sm">{payable.totalAmount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-green-600">{payable.paidAmount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className={payable.dueAmount > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                          {payable.dueAmount.toFixed(2)}
                        </div>
                        {aging > 0 && payable.dueAmount > 0 && (
                          <div className="text-xs text-red-500">{aging} days overdue</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant={payable.status === 'Paid' ? 'default' : payable.status === 'Overdue' ? 'destructive' : 'secondary'}>
                          {payable.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedPayable(payable)
                              setShowDetailsDialog(true)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePrintStatement(payable)}
                          >
                            <Printer className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filteredPayables.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No payables found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Payable Details</DialogTitle>
          </DialogHeader>
          {selectedPayable && (
            <Tabs defaultValue="lines">
              <TabsList>
                <TabsTrigger value="lines">Line Items</TabsTrigger>
                <TabsTrigger value="receipts">Receipts</TabsTrigger>
              </TabsList>

              <TabsContent value="lines" className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm">Cost Head</th>
                        <th className="px-4 py-2 text-right text-sm">Amount</th>
                        <th className="px-4 py-2 text-right text-sm">Waiver</th>
                        <th className="px-4 py-2 text-right text-sm">Scholarship</th>
                        <th className="px-4 py-2 text-right text-sm">Net Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPayable.lines.map((line, idx) => {
                        const costHead = costHeads.find(c => c.id === line.costHeadId)
                        return (
                          <tr key={idx} className="border-t">
                            <td className="px-4 py-2 text-sm">{costHead?.name}</td>
                            <td className="px-4 py-2 text-sm text-right">{line.amount.toFixed(2)}</td>
                            <td className="px-4 py-2 text-sm text-right text-green-600">{line.waiverAmount.toFixed(2)}</td>
                            <td className="px-4 py-2 text-sm text-right text-blue-600">{line.scholarshipAmount.toFixed(2)}</td>
                            <td className="px-4 py-2 text-sm text-right font-medium">{line.netAmount.toFixed(2)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                    <tfoot className="border-t-2 bg-gray-50">
                      <tr>
                        <td className="px-4 py-2 text-sm font-bold" colSpan={4}>Total</td>
                        <td className="px-4 py-2 text-sm text-right font-bold">{selectedPayable.totalAmount.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="receipts" className="space-y-4">
                <div className="flex justify-end">
                  <Button onClick={() => setShowReceiptDialog(true)} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Receipt
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm">Date</th>
                        <th className="px-4 py-2 text-left text-sm">MR No</th>
                        <th className="px-4 py-2 text-left text-sm">Method</th>
                        <th className="px-4 py-2 text-left text-sm">Reference</th>
                        <th className="px-4 py-2 text-right text-sm">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPayableReceipts(selectedPayable.id).map(receipt => (
                        <tr key={receipt.id} className="border-t">
                          <td className="px-4 py-2 text-sm">{receipt.date}</td>
                          <td className="px-4 py-2 text-sm">{receipt.moneyReceiptNo}</td>
                          <td className="px-4 py-2 text-sm"><Badge variant="outline">{receipt.method}</Badge></td>
                          <td className="px-4 py-2 text-sm">{receipt.reference}</td>
                          <td className="px-4 py-2 text-sm text-right font-medium">{receipt.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {getPayableReceipts(selectedPayable.id).length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No receipts yet
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Receipt</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Amount</label>
              <Input
                type="number"
                value={newReceipt.amount}
                onChange={(e) => setNewReceipt({ ...newReceipt, amount: parseFloat(e.target.value) || 0 })}
                max={selectedPayable?.dueAmount}
              />
              <div className="text-xs text-gray-500 mt-1">Max: {selectedPayable?.dueAmount.toFixed(2)} BDT</div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Payment Method</label>
              <select
                value={newReceipt.method}
                onChange={(e) => setNewReceipt({ ...newReceipt, method: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="Cash">Cash</option>
                <option value="Bank">Bank</option>
                <option value="bKash">bKash</option>
                <option value="Card">Card</option>
                <option value="SSLCommerz">SSLCommerz</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Reference</label>
              <Input
                value={newReceipt.reference}
                onChange={(e) => setNewReceipt({ ...newReceipt, reference: e.target.value })}
                placeholder="Transaction reference..."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Date</label>
              <Input
                type="date"
                value={newReceipt.date}
                onChange={(e) => setNewReceipt({ ...newReceipt, date: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowReceiptDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddReceipt} disabled={newReceipt.amount <= 0 || newReceipt.amount > (selectedPayable?.dueAmount || 0)}>
                Add Receipt
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
