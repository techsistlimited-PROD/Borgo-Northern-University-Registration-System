import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Printer } from 'lucide-react'
import { Repo } from '@/lib/repo'
import { DropReadmissionPolicy } from '../data/types'
import { formatCurrency } from '../utils/financeUtils'
import { generateUnregisteredReportPDF } from '../utils/pdfExport'
import { useFinanceFilters } from '@/contexts/FinanceFilterContext'

interface UnregisteredStudent {
  studentId: string
  studentName: string
  from: string
  to: string
  discontinuedCount: number
}

export default function DropReadmissionView() {
  const [mode, setMode] = useState<'fees' | 'report'>('report')
  const [policies, setPolicies] = useState<DropReadmissionPolicy[]>([])
  const { filters } = useFinanceFilters()
  
  const [unregisteredStudents, setUnregisteredStudents] = useState<UnregisteredStudent[]>([])

  useEffect(() => {
    loadPolicies()
    loadUnregisteredReport()
    const unsub = Repo.subscribe('finance-drop-readmission-policies', loadPolicies)
    return unsub
  }, [filters])

  const loadPolicies = () => {
    const data = Repo.get<DropReadmissionPolicy>('finance-drop-readmission-policies')
    setPolicies(data)
  }

  const loadUnregisteredReport = () => {
    const mockUnregisteredStudents: UnregisteredStudent[] = [
      {
        studentId: '2019-1-60-050',
        studentName: 'Rahul Ahmed Khan',
        from: 'Spring 2023',
        to: 'Summer 2024',
        discontinuedCount: 4
      },
      {
        studentId: '2020-2-50-032',
        studentName: 'Sadia Rahman',
        from: 'Fall 2023',
        to: 'Spring 2024',
        discontinuedCount: 2
      },
      {
        studentId: '2019-3-40-018',
        studentName: 'Kamal Hossain',
        from: 'Summer 2022',
        to: 'Fall 2024',
        discontinuedCount: 6
      },
      {
        studentId: '2020-1-60-089',
        studentName: 'Nafisa Chowdhury',
        from: 'Fall 2023',
        to: 'Summer 2024',
        discontinuedCount: 3
      },
      {
        studentId: '2018-2-50-045',
        studentName: 'Imran Sheikh',
        from: 'Spring 2023',
        to: 'Fall 2023',
        discontinuedCount: 2
      },
      {
        studentId: '2019-1-60-122',
        studentName: 'Tahsin Alam',
        from: 'Summer 2023',
        to: 'Spring 2024',
        discontinuedCount: 3
      },
      {
        studentId: '2020-3-40-067',
        studentName: 'Farhana Islam',
        from: 'Fall 2022',
        to: 'Summer 2024',
        discontinuedCount: 5
      },
      {
        studentId: '2019-2-50-091',
        studentName: 'Abdullah Al Mamun',
        from: 'Spring 2024',
        to: 'Summer 2024',
        discontinuedCount: 2
      },
      {
        studentId: '2018-1-60-033',
        studentName: 'Razia Sultana',
        from: 'Fall 2022',
        to: 'Fall 2023',
        discontinuedCount: 3
      },
      {
        studentId: '2020-2-50-108',
        studentName: 'Mehedi Hassan',
        from: 'Summer 2023',
        to: 'Fall 2024',
        discontinuedCount: 4
      },
      {
        studentId: '2019-3-40-054',
        studentName: 'Nusrat Jahan',
        from: 'Spring 2023',
        to: 'Spring 2024',
        discontinuedCount: 3
      },
      {
        studentId: '2018-1-60-076',
        studentName: 'Shakil Ahmed',
        from: 'Fall 2022',
        to: 'Summer 2024',
        discontinuedCount: 5
      },
      {
        studentId: '2020-1-60-145',
        studentName: 'Ayesha Siddiqua',
        from: 'Summer 2023',
        to: 'Summer 2024',
        discontinuedCount: 3
      },
      {
        studentId: '2019-2-50-078',
        studentName: 'Rakib Hasan',
        from: 'Fall 2023',
        to: 'Spring 2024',
        discontinuedCount: 2
      },
      {
        studentId: '2018-3-40-029',
        studentName: 'Sumaiya Akter',
        from: 'Spring 2022',
        to: 'Fall 2024',
        discontinuedCount: 7
      }
    ]

    const filtered = mockUnregisteredStudents.filter(student => {
      if (filters.studentSearch && 
          !student.studentId.toLowerCase().includes(filters.studentSearch.toLowerCase()) &&
          !student.studentName.toLowerCase().includes(filters.studentSearch.toLowerCase())) {
        return false
      }
      return true
    })

    setUnregisteredStudents(filtered)
  }

  const handlePrintReport = () => {
    generateUnregisteredReportPDF(
      unregisteredStudents,
      filters.campus === 'All' ? 'All Campuses' : filters.campus,
      filters.program === 'All' ? 'All Programs' : filters.program,
      filters.semester === 'All' ? 'All Semesters' : filters.semester
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-deep-plum">Drop & Re-admission Management</h1>
        <div className="flex gap-2">
          <Button
            variant={mode === 'report' ? 'default' : 'outline'}
            onClick={() => setMode('report')}
          >
            Unregistered Report
          </Button>
          <Button
            variant={mode === 'fees' ? 'default' : 'outline'}
            onClick={() => setMode('fees')}
          >
            Fee Management
          </Button>
        </div>
      </div>

      {mode === 'report' ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Registered Students Unregistered in Previous Semesters</CardTitle>
              <Button onClick={handlePrintReport} className="nu-button-primary">
                <Printer className="w-4 h-4 mr-2" />
                Print Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-4 bg-blue-50 rounded border border-blue-200">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Campus:</span> {filters.campus === 'All' ? 'All Campuses' : filters.campus}
                </div>
                <div>
                  <span className="font-semibold">Program:</span> {filters.program === 'All' ? 'All Programs' : filters.program}
                </div>
                <div>
                  <span className="font-semibold">Semester:</span> {filters.semester === 'All' ? 'All Semesters' : filters.semester}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto border rounded">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-center p-3 text-sm font-medium text-gray-700">Sl No.</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Student Id</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Student Name</th>
                    <th className="text-center p-3 text-sm font-medium text-gray-700">
                      Recently Not Registered<br/>From
                    </th>
                    <th className="text-center p-3 text-sm font-medium text-gray-700">
                      Recently Not Registered<br/>To
                    </th>
                    <th className="text-center p-3 text-sm font-medium text-gray-700">
                      Number of Discontinued<br/>Semesters
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {unregisteredStudents.map((student, index) => (
                    <tr key={student.studentId} className="border-t hover:bg-gray-50">
                      <td className="p-3 text-sm text-center">{index + 1}</td>
                      <td className="p-3 text-sm">{student.studentId}</td>
                      <td className="p-3 text-sm font-medium">{student.studentName}</td>
                      <td className="p-3 text-sm text-center">{student.from}</td>
                      <td className="p-3 text-sm text-center">{student.to}</td>
                      <td className="p-3 text-sm text-center">
                        <Badge className="bg-red-100 text-red-800">{student.discontinuedCount}</Badge>
                      </td>
                    </tr>
                  ))}
                  {unregisteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-500">
                        No unregistered students found for the selected filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {policies.map(policy => (
            <Card key={policy.id}>
              <CardHeader>
                <CardTitle>{policy.systemType}</CardTitle>
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
                  <div className="pt-2 border-t text-xs text-gray-600">
                    Applies if absent/unregistered &gt; {policy.absentThreshold} semester(s)
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
