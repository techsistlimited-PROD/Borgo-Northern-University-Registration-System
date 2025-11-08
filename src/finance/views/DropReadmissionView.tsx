import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Play, FileText } from 'lucide-react'
import { Repo } from '@/lib/repo'
import { DropReadmissionPolicy, StudentBill, BillLineItem } from '../data/types'
import { formatCurrency } from '../utils/financeUtils'

interface EligibleStudent {
  studentId: string
  studentName: string
  program: string
  campus: string
  absentSemesters: number
  feeType: 'Drop' | 'Readmission'
  amount: number
}

export default function DropReadmissionView() {
  const [policies, setPolicies] = useState<DropReadmissionPolicy[]>([])
  const [selectedPolicy, setSelectedPolicy] = useState<DropReadmissionPolicy | null>(null)
  const [eligibleStudents, setEligibleStudents] = useState<EligibleStudent[]>([])
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadPolicies()
    const unsub = Repo.subscribe('finance-drop-readmission-policies', loadPolicies)
    return unsub
  }, [])

  const loadPolicies = () => {
    const data = Repo.get<DropReadmissionPolicy>('finance-drop-readmission-policies')
    setPolicies(data)
    if (data.length > 0) {
      setSelectedPolicy(data[0])
    }
  }

  const handleDetectEligible = () => {
    if (!selectedPolicy) return

    const mockEligibleStudents: EligibleStudent[] = [
      {
        studentId: '2019-1-60-050',
        studentName: 'Rahul Ahmed',
        program: 'CSE',
        campus: 'Main Campus',
        absentSemesters: 3,
        feeType: 'Readmission',
        amount: selectedPolicy.readmissionFee
      },
      {
        studentId: '2020-2-50-032',
        studentName: 'Sadia Rahman',
        program: 'BBA',
        campus: 'Main Campus',
        absentSemesters: 2,
        feeType: 'Drop',
        amount: selectedPolicy.dropFee
      },
      {
        studentId: '2019-3-40-018',
        studentName: 'Kamal Hossain',
        program: 'LLB',
        campus: 'Uttara Campus',
        absentSemesters: 4,
        feeType: 'Readmission',
        amount: selectedPolicy.readmissionFee
      }
    ]

    setEligibleStudents(mockEligibleStudents)
  }

  const handleApplyFees = () => {
    if (selectedStudents.size === 0) {
      alert('No students selected')
      return
    }

    if (!confirm(`Generate fees for ${selectedStudents.size} selected students?`)) {
      return
    }

    const costHeads = Repo.get('finance-cost-heads')

    eligibleStudents.forEach(student => {
      if (!selectedStudents.has(student.studentId)) return

      const costHeadCode = student.feeType === 'Drop' ? selectedPolicy!.dropCostHeadCode : selectedPolicy!.readmissionCostHeadCode
      const costHead = costHeads.find((ch: any) => ch.code === costHeadCode)

      const lineItem: BillLineItem = {
        id: `li-${Date.now()}-${Math.random()}`,
        costHeadCode,
        costHeadName: costHead?.name || (student.feeType === 'Drop' ? 'Drop Fee' : 'Re-admission Fee'),
        mode: 'Flat',
        quantity: 1,
        rate: student.amount,
        subtotal: student.amount,
        waiverPercent: 0,
        scholarshipPercent: 0,
        deduction: 0,
        netAmount: student.amount
      }

      const newBill: StudentBill = {
        id: `bill-${Date.now()}-${Math.random()}`,
        billNo: `INV-FA25-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`,
        studentId: student.studentId,
        studentName: student.studentName,
        program: student.program,
        campus: student.campus,
        semester: 'Fall 2025',
        billDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lineItems: [lineItem],
        grossTotal: student.amount,
        waiverTotal: 0,
        scholarshipTotal: 0,
        deductionTotal: 0,
        netTotal: student.amount,
        paidAmount: 0,
        balanceDue: student.amount,
        status: 'Issued',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      Repo.add('finance-student-bills', newBill)
    })

    alert(`Fees generated for ${selectedStudents.size} students`)
    setEligibleStudents([])
    setSelectedStudents(new Set())
  }

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedStudents)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedStudents(newSelected)
  }

  const handleToggleSelectAll = () => {
    if (selectedStudents.size === eligibleStudents.length) {
      setSelectedStudents(new Set())
    } else {
      setSelectedStudents(new Set(eligibleStudents.map(s => s.studentId)))
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Semester Drop & Re-admission Fees</h1>
          <p className="text-sm text-gray-600">Auto-detect and generate drop/re-admission fees</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {policies.map(policy => (
          <Card key={policy.id} className={selectedPolicy?.id === policy.id ? 'border-accent-purple border-2' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{policy.systemType}</CardTitle>
                {selectedPolicy?.id === policy.id && <Badge className="bg-accent-purple text-white">Selected</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Drop Fee:</span>
                  <span className="font-semibold">{formatCurrency(policy.dropFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Re-admission Fee:</span>
                  <span className="font-semibold">{formatCurrency(policy.readmissionFee)}</span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-600">
                    <AlertCircle className="w-3 h-3 inline mr-1" />
                    Applies if absent/unregistered &gt; {policy.absentThreshold} semester(s)
                  </p>
                </div>
                <Button
                  onClick={() => setSelectedPolicy(policy)}
                  variant={selectedPolicy?.id === policy.id ? 'default' : 'outline'}
                  className="w-full mt-2"
                >
                  {selectedPolicy?.id === policy.id ? 'Selected' : 'Select'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPolicy && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Detect & Apply Fees</CardTitle>
              <Button onClick={handleDetectEligible} className="nu-button-primary">
                <Play className="w-4 h-4 mr-2" />
                Detect Eligible Students
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {eligibleStudents.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Found {eligibleStudents.length} eligible students. Select to generate fees.
                  </p>
                  {selectedStudents.size > 0 && (
                    <Button onClick={handleApplyFees} className="nu-button-primary">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Fees ({selectedStudents.size})
                    </Button>
                  )}
                </div>

                <div className="overflow-x-auto border rounded">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedStudents.size === eligibleStudents.length}
                            onChange={handleToggleSelectAll}
                            className="w-4 h-4"
                          />
                        </th>
                        <th className="text-left p-3 text-xs font-medium">Student ID</th>
                        <th className="text-left p-3 text-xs font-medium">Name</th>
                        <th className="text-left p-3 text-xs font-medium">Program</th>
                        <th className="text-left p-3 text-xs font-medium">Campus</th>
                        <th className="text-center p-3 text-xs font-medium">Absent Semesters</th>
                        <th className="text-left p-3 text-xs font-medium">Fee Type</th>
                        <th className="text-right p-3 text-xs font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eligibleStudents.map(student => (
                        <tr key={student.studentId} className="border-t hover:bg-gray-50">
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={selectedStudents.has(student.studentId)}
                              onChange={() => handleToggleSelect(student.studentId)}
                              className="w-4 h-4"
                            />
                          </td>
                          <td className="p-3 text-sm">{student.studentId}</td>
                          <td className="p-3 text-sm font-medium">{student.studentName}</td>
                          <td className="p-3 text-sm">{student.program}</td>
                          <td className="p-3 text-sm">{student.campus}</td>
                          <td className="p-3 text-sm text-center">
                            <Badge className="bg-red-100 text-red-800">{student.absentSemesters}</Badge>
                          </td>
                          <td className="p-3 text-sm">
                            <Badge className={student.feeType === 'Drop' ? 'bg-yellow-100 text-yellow-800' : 'bg-purple-100 text-purple-800'}>
                              {student.feeType}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm text-right font-semibold">{formatCurrency(student.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Click "Detect Eligible Students" to find students requiring drop/re-admission fees</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
