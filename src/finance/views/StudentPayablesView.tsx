import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Edit, Trash2, FileText, RefreshCw, Upload, Download, CheckSquare } from 'lucide-react'
import { Repo } from '@/lib/repo'
import { StudentBill, BillLineItem, BillStatus } from '../data/types'
import { formatCurrency, rebuildBillFromPackage, parseBillCSV, exportTableToCSV, downloadCSV } from '../utils/financeUtils'

export default function StudentPayablesView() {
  const [bills, setBills] = useState<StudentBill[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBills, setSelectedBills] = useState<Set<string>>(new Set())
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCSVDialogOpen, setIsCSVDialogOpen] = useState(false)
  const [editingBill, setEditingBill] = useState<StudentBill | null>(null)
  const [lineItems, setLineItems] = useState<BillLineItem[]>([])
  const [csvContent, setCSVContent] = useState('')
  const [csvErrors, setCSVErrors] = useState<string[]>([])

  useEffect(() => {
    loadBills()
    const unsub = Repo.subscribe('finance-student-bills', loadBills)
    return unsub
  }, [])

  const loadBills = () => {
    const data = Repo.get<StudentBill>('finance-student-bills')
    setBills(data)
  }

  const filteredBills = bills.filter(bill =>
    bill.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.billNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.semester.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.program.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedBills)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedBills(newSelected)
  }

  const handleToggleSelectAll = () => {
    if (selectedBills.size === filteredBills.length) {
      setSelectedBills(new Set())
    } else {
      setSelectedBills(new Set(filteredBills.map(b => b.id)))
    }
  }

  const handleFixBill = (bill: StudentBill) => {
    if (!bill.packageId) {
      alert('Bill has no associated package. Cannot rebuild.')
      return
    }

    if (confirm(`Rebuild bill ${bill.billNo} from package? This will recalculate all fees.`)) {
      const rebuiltBill = rebuildBillFromPackage(
        bill.studentId,
        bill.studentName,
        bill.program,
        bill.campus,
        bill.semester,
        bill.packageId,
        12
      )

      Repo.update('finance-student-bills', bill.id, {
        ...rebuiltBill,
        id: bill.id,
        billNo: bill.billNo,
        paidAmount: bill.paidAmount,
        balanceDue: rebuiltBill.netTotal - bill.paidAmount,
        status: bill.paidAmount === 0 ? 'Issued' : bill.paidAmount >= rebuiltBill.netTotal ? 'Paid' : 'Partial'
      })

      alert('Bill rebuilt successfully!')
    }
  }

  const handleEditBill = (bill: StudentBill) => {
    setEditingBill(bill)
    setLineItems([...bill.lineItems])
    setIsEditDialogOpen(true)
  }

  const handleAddLineItem = () => {
    const newItem: BillLineItem = {
      id: `li-${Date.now()}`,
      costHeadCode: 'PER_CREDIT_FEE',
      costHeadName: 'Per credit fee',
      mode: 'Flat',
      quantity: 1,
      rate: 0,
      subtotal: 0,
      waiverPercent: 0,
      scholarshipPercent: 0,
      deduction: 0,
      netAmount: 0
    }
    setLineItems([...lineItems, newItem])
  }

  const handleUpdateLineItem = (id: string, updates: Partial<BillLineItem>) => {
    setLineItems(lineItems.map(li => {
      if (li.id === id) {
        const updated = { ...li, ...updates }
        updated.subtotal = updated.quantity * updated.rate
        updated.netAmount = updated.subtotal * (1 - updated.waiverPercent / 100) * (1 - updated.scholarshipPercent / 100) - updated.deduction
        return updated
      }
      return li
    }))
  }

  const handleRemoveLineItem = (id: string) => {
    setLineItems(lineItems.filter(li => li.id !== id))
  }

  const handleSaveBill = () => {
    if (!editingBill) return

    const grossTotal = lineItems.reduce((sum, li) => sum + li.subtotal, 0)
    const waiverTotal = lineItems.reduce((sum, li) => sum + (li.subtotal * li.waiverPercent / 100), 0)
    const scholarshipTotal = lineItems.reduce((sum, li) => sum + (li.subtotal * li.scholarshipPercent / 100), 0)
    const deductionTotal = lineItems.reduce((sum, li) => sum + li.deduction, 0)
    const netTotal = lineItems.reduce((sum, li) => sum + li.netAmount, 0)

    Repo.update('finance-student-bills', editingBill.id, {
      lineItems,
      grossTotal,
      waiverTotal,
      scholarshipTotal,
      deductionTotal,
      netTotal,
      balanceDue: netTotal - editingBill.paidAmount,
      updatedAt: new Date().toISOString()
    })

    setIsEditDialogOpen(false)
  }

  const handleDeleteBill = (id: string) => {
    if (confirm('Delete this bill permanently?')) {
      Repo.delete('finance-student-bills', id)
    }
  }

  const handleBulkDelete = () => {
    if (selectedBills.size === 0) return
    if (confirm(`Delete ${selectedBills.size} selected bills?`)) {
      selectedBills.forEach(id => Repo.delete('finance-student-bills', id))
      setSelectedBills(new Set())
    }
  }

  const handleBulkExport = () => {
    if (selectedBills.size === 0) {
      alert('Please select bills to export')
      return
    }

    const selectedBillData = bills.filter(b => selectedBills.has(b.id))
    const headers = ['Bill No', 'Student ID', 'Student Name', 'Program', 'Semester', 'Bill Date', 'Due Date', 'Gross Total', 'Net Total', 'Paid', 'Balance', 'Status']
    const rows = selectedBillData.map(b => [
      b.billNo,
      b.studentId,
      b.studentName,
      b.program,
      b.semester,
      b.billDate,
      b.dueDate,
      b.grossTotal.toString(),
      b.netTotal.toString(),
      b.paidAmount.toString(),
      b.balanceDue.toString(),
      b.status
    ])

    const csv = exportTableToCSV(headers, rows)
    downloadCSV('student-bills-export.csv', csv)
  }

  const handleCSVUpload = () => {
    setCSVErrors([])
    try {
      const parsedBills = parseBillCSV(csvContent)

      parsedBills.forEach(billData => {
        const existingBills = bills.filter(b => b.studentId === billData.studentId && b.semester === billData.semester)
        
        if (existingBills.length > 0) {
          const existingBill = existingBills[0]
          const grossTotal = billData.lineItems!.reduce((sum, li) => sum + li.subtotal, 0)
          const netTotal = billData.lineItems!.reduce((sum, li) => sum + li.netAmount, 0)

          Repo.update('finance-student-bills', existingBill.id, {
            lineItems: billData.lineItems,
            grossTotal,
            netTotal,
            balanceDue: netTotal - existingBill.paidAmount,
            updatedAt: new Date().toISOString()
          })
        } else {
          const grossTotal = billData.lineItems!.reduce((sum, li) => sum + li.subtotal, 0)
          const netTotal = billData.lineItems!.reduce((sum, li) => sum + li.netAmount, 0)

          const newBill: StudentBill = {
            id: `bill-${Date.now()}-${Math.random()}`,
            billNo: `INV-${billData.semester!.replace(' ', '')}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`,
            studentId: billData.studentId!,
            studentName: billData.studentId!,
            program: 'CSE',
            campus: 'Main Campus',
            semester: billData.semester!,
            billDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            lineItems: billData.lineItems!,
            grossTotal,
            waiverTotal: 0,
            scholarshipTotal: 0,
            deductionTotal: 0,
            netTotal,
            paidAmount: 0,
            balanceDue: netTotal,
            status: 'Issued',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          Repo.add('finance-student-bills', newBill)
        }
      })

      alert(`Uploaded ${parsedBills.length} bills successfully!`)
      setIsCSVDialogOpen(false)
      setCSVContent('')
    } catch (error: any) {
      setCSVErrors([error.message])
    }
  }

  const costHeads = Repo.get('finance-cost-heads')

  const getStatusBadge = (status: BillStatus) => {
    const colors = {
      Draft: 'bg-gray-100 text-gray-800',
      Issued: 'bg-blue-100 text-blue-800',
      Partial: 'bg-yellow-100 text-yellow-800',
      Paid: 'bg-green-100 text-green-800',
      Overdue: 'bg-red-100 text-red-800'
    }
    return <Badge className={colors[status]}>{status}</Badge>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Student Payables</h1>
          <p className="text-sm text-gray-600">Manage student bills and invoices</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsCSVDialogOpen(true)} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload Bills (CSV)
          </Button>
          {selectedBills.size > 0 && (
            <>
              <Button onClick={handleBulkExport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Selected
              </Button>
              <Button onClick={handleBulkDelete} variant="outline" className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Bills ({filteredBills.length})</CardTitle>
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by ID, name, semester, program..."
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
                  <th className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedBills.size === filteredBills.length && filteredBills.length > 0}
                      onChange={handleToggleSelectAll}
                      className="w-4 h-4"
                    />
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Bill No</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Student ID</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Student Name</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Program</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Semester</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-700">Net Total</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-700">Paid</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-700">Balance</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((bill) => (
                  <tr key={bill.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedBills.has(bill.id)}
                        onChange={() => handleToggleSelect(bill.id)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="p-3 text-sm font-mono">{bill.billNo}</td>
                    <td className="p-3 text-sm">{bill.studentId}</td>
                    <td className="p-3 text-sm font-medium">{bill.studentName}</td>
                    <td className="p-3 text-sm">{bill.program}</td>
                    <td className="p-3 text-sm">{bill.semester}</td>
                    <td className="p-3 text-sm text-right font-semibold">{formatCurrency(bill.netTotal)}</td>
                    <td className="p-3 text-sm text-right">{formatCurrency(bill.paidAmount)}</td>
                    <td className="p-3 text-sm text-right font-semibold text-red-600">
                      {formatCurrency(bill.balanceDue)}
                    </td>
                    <td className="p-3">{getStatusBadge(bill.status)}</td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditBill(bill)}
                          title="Edit line items"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFixBill(bill)}
                          title="Fix Bill (rebuild from package)"
                        >
                          <RefreshCw className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBill(bill.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Bill: {editingBill?.billNo}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <p className="font-medium">{editingBill?.studentName} ({editingBill?.studentId})</p>
                <p className="text-gray-600">{editingBill?.program} - {editingBill?.semester}</p>
              </div>
              <Button onClick={handleAddLineItem} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Line Item
              </Button>
            </div>

            <div className="border rounded overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2 text-xs font-medium">Cost Head</th>
                    <th className="text-left p-2 text-xs font-medium">Mode</th>
                    <th className="text-right p-2 text-xs font-medium">Qty</th>
                    <th className="text-right p-2 text-xs font-medium">Rate</th>
                    <th className="text-right p-2 text-xs font-medium">Subtotal</th>
                    <th className="text-right p-2 text-xs font-medium">Waiver%</th>
                    <th className="text-right p-2 text-xs font-medium">Scholar%</th>
                    <th className="text-right p-2 text-xs font-medium">Deduct</th>
                    <th className="text-right p-2 text-xs font-medium">Net</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map(li => (
                    <tr key={li.id} className="border-t">
                      <td className="p-2">
                        <select
                          value={li.costHeadCode}
                          onChange={(e) => handleUpdateLineItem(li.id, { costHeadCode: e.target.value })}
                          className="w-full px-2 py-1 border rounded text-xs"
                        >
                          {costHeads.map((ch: any) => (
                            <option key={ch.code} value={ch.code}>{ch.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <select
                          value={li.mode}
                          onChange={(e) => handleUpdateLineItem(li.id, { mode: e.target.value as any })}
                          className="w-full px-2 py-1 border rounded text-xs"
                        >
                          <option value="Flat">Flat</option>
                          <option value="Per Credit">Per Credit</option>
                          <option value="Per Course">Per Course</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          value={li.quantity}
                          onChange={(e) => handleUpdateLineItem(li.id, { quantity: parseFloat(e.target.value) || 0 })}
                          className="w-20 text-xs text-right"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          value={li.rate}
                          onChange={(e) => handleUpdateLineItem(li.id, { rate: parseFloat(e.target.value) || 0 })}
                          className="w-24 text-xs text-right"
                        />
                      </td>
                      <td className="p-2 text-xs text-right font-medium">{li.subtotal.toFixed(2)}</td>
                      <td className="p-2">
                        <Input
                          type="number"
                          value={li.waiverPercent}
                          onChange={(e) => handleUpdateLineItem(li.id, { waiverPercent: parseFloat(e.target.value) || 0 })}
                          className="w-16 text-xs text-right"
                          max={100}
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          value={li.scholarshipPercent}
                          onChange={(e) => handleUpdateLineItem(li.id, { scholarshipPercent: parseFloat(e.target.value) || 0 })}
                          className="w-16 text-xs text-right"
                          max={100}
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          value={li.deduction}
                          onChange={(e) => handleUpdateLineItem(li.id, { deduction: parseFloat(e.target.value) || 0 })}
                          className="w-24 text-xs text-right"
                        />
                      </td>
                      <td className="p-2 text-xs text-right font-semibold text-green-600">{li.netAmount.toFixed(2)}</td>
                      <td className="p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveLineItem(li.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 bg-gray-50 font-semibold">
                    <td colSpan={4} className="p-2 text-right text-sm">Totals:</td>
                    <td className="p-2 text-right text-sm">
                      {lineItems.reduce((sum, li) => sum + li.subtotal, 0).toFixed(2)}
                    </td>
                    <td colSpan={3}></td>
                    <td className="p-2 text-right text-sm text-green-600">
                      {lineItems.reduce((sum, li) => sum + li.netAmount, 0).toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveBill} className="nu-button-primary">Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCSVDialogOpen} onOpenChange={setIsCSVDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Bills (CSV)</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                CSV Format: StudentID, Semester, CostHead, Mode, Qty, Rate, Waiver%, Scholarship%, Notes
              </p>
              <textarea
                value={csvContent}
                onChange={(e) => setCSVContent(e.target.value)}
                className="w-full h-64 px-3 py-2 border rounded-md font-mono text-xs"
                placeholder="StudentID,Semester,CostHead,Mode,Qty,Rate,Waiver%,Scholarship%,Notes&#10;2021-1-60-001,Fall 2025,PER_CREDIT_FEE,Per Credit,12,4500,50,0,Merit waiver"
              />
            </div>

            {csvErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-sm font-medium text-red-800 mb-1">Errors:</p>
                <ul className="text-xs text-red-700 space-y-1">
                  {csvErrors.map((err, idx) => (
                    <li key={idx}>• {err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCSVDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCSVUpload} className="nu-button-primary">
                <Upload className="w-4 h-4 mr-2" />
                Upload & Process
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
