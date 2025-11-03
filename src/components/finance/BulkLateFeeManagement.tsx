import { useState, useEffect } from 'react'
import { Repo } from '@/lib/repo'
import { StudentPayable, Student, Semester, Campus, Program } from '@/lib/seedAll'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DollarSign } from 'lucide-react'

export default function BulkLateFeeManagement() {
  const [payables, setPayables] = useState<StudentPayable[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [campuses, setCampuses] = useState<Campus[]>([])
  const [programs, setPrograms] = useState<Program[]>([])

  const [filters, setFilters] = useState({
    semester: '',
    campus: '',
    program: ''
  })

  const [feeRule, setFeeRule] = useState({
    type: 'flat' as 'flat' | 'percent',
    amount: 0,
    min: 0,
    max: 0
  })

  const [selectedPayables, setSelectedPayables] = useState<string[]>([])

  useEffect(() => {
    loadData()
    const unsubPayables = Repo.subscribe<StudentPayable>('studentPayables', setPayables)
    const unsubStudents = Repo.subscribe<Student>('students', setStudents)
    const unsubSemesters = Repo.subscribe<Semester>('semesters', setSemesters)
    const unsubCampuses = Repo.subscribe<Campus>('campuses', setCampuses)
    const unsubPrograms = Repo.subscribe<Program>('programs', setPrograms)

    return () => {
      unsubPayables()
      unsubStudents()
      unsubSemesters()
      unsubCampuses()
      unsubPrograms()
    }
  }, [])

  const loadData = () => {
    setPayables(Repo.get<StudentPayable>('studentPayables'))
    setStudents(Repo.get<Student>('students'))
    setSemesters(Repo.get<Semester>('semesters'))
    setCampuses(Repo.get<Campus>('campuses'))
    setPrograms(Repo.get<Program>('programs'))
  }

  const getEligiblePayables = () => {
    return payables.filter(payable => {
      const student = students.find(s => s.id === payable.studentId)
      if (!student || payable.dueAmount <= 0) return false

      if (filters.semester && payable.semesterId !== filters.semester) return false
      if (filters.campus && student.campusId !== filters.campus) return false
      if (filters.program && student.program !== filters.program) return false

      return true
    })
  }

  const calculateLateFee = (dueAmount: number) => {
    if (feeRule.type === 'flat') {
      return Math.min(Math.max(feeRule.amount, feeRule.min), feeRule.max || feeRule.amount)
    } else {
      const percent = dueAmount * (feeRule.amount / 100)
      return Math.min(Math.max(percent, feeRule.min), feeRule.max || percent)
    }
  }

  const handleApply = () => {
    if (selectedPayables.length === 0) {
      alert('Please select at least one payable')
      return
    }

    selectedPayables.forEach(payableId => {
      const payable = payables.find(p => p.id === payableId)
      if (!payable) return

      const lateFee = calculateLateFee(payable.dueAmount)
      const newLines = [
        ...payable.lines,
        {
          costHeadId: 'LATEFEE',
          amount: lateFee,
          waiverAmount: 0,
          scholarshipAmount: 0,
          netAmount: lateFee
        }
      ]

      Repo.update<StudentPayable>('studentPayables', payableId, {
        lines: newLines,
        totalAmount: payable.totalAmount + lateFee,
        dueAmount: payable.dueAmount + lateFee
      })
    })

    alert(`Applied late fee to ${selectedPayables.length} students`)
    setSelectedPayables([])
    loadData()
  }

  const eligiblePayables = getEligiblePayables()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Bulk Late Fee Assignment</h1>
          <p className="text-sm text-gray-600">Apply late fees to overdue payables</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Step 1: Scope</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Semester</label>
              <select
                value={filters.semester}
                onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
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
                className="w-full px-3 py-2 border rounded-md text-sm"
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
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">All Programs</option>
                {programs.map(prog => (
                  <option key={prog.id} value={prog.code}>{prog.name}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Step 2: Fee Rule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Type</label>
              <select
                value={feeRule.type}
                onChange={(e) => setFeeRule({ ...feeRule, type: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="flat">Flat Amount</option>
                <option value="percent">Percentage of Due</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                {feeRule.type === 'flat' ? 'Amount (BDT)' : 'Percentage (%)'}
              </label>
              <Input
                type="number"
                value={feeRule.amount}
                onChange={(e) => setFeeRule({ ...feeRule, amount: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Min (BDT)</label>
              <Input
                type="number"
                value={feeRule.min}
                onChange={(e) => setFeeRule({ ...feeRule, min: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Max (BDT)</label>
              <Input
                type="number"
                value={feeRule.max}
                onChange={(e) => setFeeRule({ ...feeRule, max: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Step 3: Preview & Apply</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Eligible Students:</span>
                <span className="font-bold">{eligiblePayables.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Selected:</span>
                <span className="font-bold">{selectedPayables.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Late Fee:</span>
                <span className="font-bold text-red-600">
                  {selectedPayables.reduce((sum, id) => {
                    const payable = payables.find(p => p.id === id)
                    return sum + (payable ? calculateLateFee(payable.dueAmount) : 0)
                  }, 0).toFixed(2)} BDT
                </span>
              </div>
            </div>

            <Button
              onClick={handleApply}
              disabled={selectedPayables.length === 0}
              className="w-full mt-4 bg-deep-plum hover:bg-deep-plum/90"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Apply Late Fee
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between">
              <span>Select Students ({eligiblePayables.length})</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedPayables(eligiblePayables.map(p => p.id))}>
                  Select All
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedPayables([])}>
                  Clear
                </Button>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 w-12"></th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Student</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Bill No</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Due Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Late Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {eligiblePayables.map(payable => {
                const student = students.find(s => s.id === payable.studentId)
                const lateFee = calculateLateFee(payable.dueAmount)
                const isSelected = selectedPayables.includes(payable.id)

                return (
                  <tr key={payable.id} className={isSelected ? 'bg-mint-green/10' : ''}>
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPayables([...selectedPayables, payable.id])
                          } else {
                            setSelectedPayables(selectedPayables.filter(id => id !== payable.id))
                          }
                        }}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium">{student?.name}</div>
                      <div className="text-xs text-gray-600">{student?.id}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">{payable.billNo}</td>
                    <td className="px-4 py-3 text-sm text-red-600 font-medium">{payable.dueAmount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant="destructive">{lateFee.toFixed(2)} BDT</Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {eligiblePayables.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No eligible payables found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
