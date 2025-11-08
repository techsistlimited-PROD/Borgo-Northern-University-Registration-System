import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Search, FileText, Eye, Edit } from 'lucide-react'
import { Repo } from '@/lib/repo'
import { StudentBill, BillLineItem } from '../data/types'
import { formatCurrency } from '../utils/financeUtils'

export default function StudentPayablesView() {
  const [bills, setBills] = useState<StudentBill[]>([])
  const [anyText, setAnyText] = useState('')
  const [studentIdFilter, setStudentIdFilter] = useState('')
  const [semesterFilter, setSemesterFilter] = useState('All')
  const [annexFilter, setAnnexFilter] = useState('All')
  const [programFilter, setProgramFilter] = useState('All')
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedBill, setSelectedBill] = useState<StudentBill | null>(null)

  useEffect(() => {
    loadBills()
    const unsub = Repo.subscribe('finance-student-bills', loadBills)
    return unsub
  }, [])

  const loadBills = () => {
    const data = Repo.get<StudentBill>('finance-student-bills')
    setBills(data)
  }

  const handleSearch = () => {
    loadBills()
  }

  const filteredBills = bills.filter(bill => {
    const matchesAnyText = anyText === '' || 
      bill.billNo.toLowerCase().includes(anyText.toLowerCase()) ||
      bill.studentId.toLowerCase().includes(anyText.toLowerCase()) ||
      bill.studentName.toLowerCase().includes(anyText.toLowerCase())
    
    const matchesStudentId = studentIdFilter === '' || 
      bill.studentId.toLowerCase().includes(studentIdFilter.toLowerCase())
    
    const matchesSemester = semesterFilter === 'All' || bill.semester.includes(semesterFilter)
    const matchesAnnex = annexFilter === 'All' || bill.campus === annexFilter
    const matchesProgram = programFilter === 'All' || bill.program === programFilter

    return matchesAnyText && matchesStudentId && matchesSemester && matchesAnnex && matchesProgram
  })

  const handleViewBill = (bill: StudentBill) => {
    setSelectedBill(bill)
    setViewDialogOpen(true)
  }

  const handleEditBill = (bill: StudentBill) => {
    setSelectedBill(bill)
    setViewDialogOpen(true)
  }

  const generateCode = (index: number) => {
    return `BL-${String(index + 1).padStart(4, '0')}`
  }

  const generateSemesterRegId = (bill: StudentBill) => {
    const semCode = bill.semester.includes('Fall') ? 'F' : bill.semester.includes('Spring') ? 'S' : 'M'
    const year = bill.semester.match(/\d{2}/)?.[0] || '25'
    return `${bill.studentId}-${semCode}${year}`
  }

  const semesters = ['All', 'Fall 2024', 'Spring 2025', 'Summer 2025', 'Fall 2025']
  const annexes = ['All', 'Permanent Campus', 'Uttara', 'Lakshmipur']
  const programs = ['All', 'CSE', 'BBA', 'LLB', 'EEE', 'English']

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button className="nu-button-primary">
          New Students Payable
        </Button>
        <div className="text-xl font-bold text-deep-plum">
          Students Payable List
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3 items-end mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Any Text</label>
              <Input
                placeholder="Search..."
                value={anyText}
                onChange={(e) => setAnyText(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Student ID</label>
              <Input
                placeholder="Student ID"
                value={studentIdFilter}
                onChange={(e) => setStudentIdFilter(e.target.value)}
              />
            </div>
            <div className="flex-1">
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
            <div className="flex-1">
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
            <div className="flex-1">
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
            <Button onClick={handleSearch} className="nu-button-primary">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Code</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Semester Registration Id</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Student Id</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Student Name</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Semester</th>
                  <th className="text-center p-3 text-sm font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((bill, index) => (
                  <tr key={bill.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-mono">{generateCode(index)}</td>
                    <td className="p-3 text-sm font-mono">{generateSemesterRegId(bill)}</td>
                    <td className="p-3 text-sm">{bill.studentId}</td>
                    <td className="p-3 text-sm font-medium">{bill.studentName}</td>
                    <td className="p-3 text-sm">{bill.semester}</td>
                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewBill(bill)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </Button>
                        <span className="text-gray-400">|</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditBill(bill)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </Button>
                        <span className="text-gray-400">|</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="PDF"
                        >
                          <FileText className="w-4 h-4 text-red-600" />
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

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Student Bill Details</DialogTitle>
              <Button variant="link" className="text-blue-600">
                Found any error? Click here to Fix The Bill
              </Button>
            </div>
          </DialogHeader>

          {selectedBill && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded">
                <div>
                  <p className="text-sm text-gray-600">Student ID</p>
                  <p className="font-medium">{selectedBill.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Student Name</p>
                  <p className="font-medium">{selectedBill.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Program</p>
                  <p className="font-medium">{selectedBill.program}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Semester</p>
                  <p className="font-medium">{selectedBill.semester}</p>
                </div>
              </div>

              <div className="border rounded">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium">Cost Head</th>
                      <th className="text-right p-3 text-sm font-medium">Credit Taken</th>
                      <th className="text-right p-3 text-sm font-medium">Cost Amount</th>
                      <th className="text-right p-3 text-sm font-medium">Deductive Amount</th>
                      <th className="text-left p-3 text-sm font-medium">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBill.lineItems.map(item => (
                      <tr key={item.id} className="border-t">
                        <td className="p-3 text-sm">{item.costHeadName}</td>
                        <td className="p-3 text-sm text-right">
                          {item.mode === 'Per Credit' ? item.quantity : '-'}
                        </td>
                        <td className="p-3 text-sm text-right font-medium">
                          {formatCurrency(item.subtotal)}
                        </td>
                        <td className="p-3 text-sm text-right font-medium text-red-600">
                          {formatCurrency(item.deduction + (item.subtotal * (item.waiverPercent + item.scholarshipPercent) / 100))}
                        </td>
                        <td className="p-3 text-sm">{item.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 bg-gray-50 font-semibold">
                    <tr>
                      <td colSpan={2} className="p-3 text-sm text-right">Total Cost Amount:</td>
                      <td className="p-3 text-sm text-right">
                        {formatCurrency(selectedBill.grossTotal)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="p-3 text-sm text-right">Total Deductive Amount:</td>
                      <td colSpan={1}></td>
                      <td className="p-3 text-sm text-right text-red-600">
                        {formatCurrency(selectedBill.waiverTotal + selectedBill.scholarshipTotal + selectedBill.deductionTotal)}
                      </td>
                      <td></td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td colSpan={2} className="p-3 text-sm text-right font-bold">Payable Amount:</td>
                      <td className="p-3 text-sm text-right font-bold text-green-600" colSpan={3}>
                        {formatCurrency(selectedBill.netTotal)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Close
                </Button>
                <Button className="nu-button-primary">
                  <FileText className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
