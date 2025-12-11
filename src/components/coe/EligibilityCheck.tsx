import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Download, FileCheck } from 'lucide-react'

export default function EligibilityCheck() {
  const [hasRun, setHasRun] = useState(false)
  const [loading, setLoading] = useState(false)

  const runEligibility = () => {
    setLoading(true)
    setTimeout(() => {
      setHasRun(true)
      setLoading(false)
    }, 1500)
  }

  const eligibleStudents = [
    { name: 'Ayesha Rahman', id: 'CSE-25-011234', program: 'BSc CSE', section: 'CSE-B', attendance: 82, finance: 'No', registration: 'Active', eligible: true },
    { name: 'Tanvir Ahmed', id: 'CSE-25-011255', program: 'BSc CSE', section: 'CSE-B', attendance: 64, finance: 'No', registration: 'Active', eligible: false, reason: 'Attendance' },
    { name: 'Nishat Sultana', id: 'BBA-25-004412', program: 'BBA', section: 'BBA-A', attendance: 75, finance: 'Yes', registration: 'Active', eligible: false, reason: 'Finance' },
    { name: 'Arman Chowdhury', id: 'LLB-24-000771', program: 'LLB (Hons)', section: 'LAW-302', attendance: 91, finance: 'No', registration: 'Active', eligible: true }
  ]

  const stats = {
    eligible: 1212,
    financeBlocked: 42,
    attendanceBlocked: 18,
    notRegistered: 12
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Eligibility Check</h1>
          <p className="text-sm text-gray-600 mt-1">Verify student eligibility for final examinations</p>
        </div>
        <Button 
          onClick={runEligibility} 
          disabled={loading}
          className="nu-button-primary"
        >
          <Play className="w-4 h-4 mr-2" />
          {loading ? 'Running...' : 'Run Eligibility'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
          <select className="w-full p-2 border rounded-md">
            <option>Fall 2025</option>
            <option>Summer 2025</option>
            <option>Spring 2025</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
          <select className="w-full p-2 border rounded-md">
            <option>Final</option>
            <option>Midterm</option>
            <option>Improvement</option>
          </select>
        </div>
      </div>

      {hasRun && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-xs">Eligible Students</CardDescription>
                <CardTitle className="text-3xl text-green-600">{stats.eligible}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-xs">Blocked: Finance</CardDescription>
                <CardTitle className="text-3xl text-red-600">{stats.financeBlocked}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-xs">Blocked: Attendance</CardDescription>
                <CardTitle className="text-3xl text-amber-600">{stats.attendanceBlocked}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-xs">Not Registered</CardDescription>
                <CardTitle className="text-3xl text-gray-600">{stats.notRegistered}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Eligibility Results</CardTitle>
                  <CardDescription>Detailed breakdown of student eligibility status</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Blocked List
                  </Button>
                  <Button className="nu-button-primary" size="sm">
                    <FileCheck className="w-4 h-4 mr-2" />
                    Issue Admit Cards
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Student Name</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">University ID</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Program</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Section</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Attendance %</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Finance Hold</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Registration</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Eligible?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eligibleStudents.map((student, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm">{student.name}</td>
                        <td className="p-3 text-sm font-mono">{student.id}</td>
                        <td className="p-3 text-sm">{student.program}</td>
                        <td className="p-3 text-sm">{student.section}</td>
                        <td className="p-3 text-sm">
                          <span className={student.attendance < 70 ? 'text-red-600 font-semibold' : ''}>
                            {student.attendance}%
                          </span>
                        </td>
                        <td className="p-3 text-sm">{student.finance}</td>
                        <td className="p-3 text-sm">{student.registration}</td>
                        <td className="p-3">
                          {student.eligible ? (
                            <Badge className="bg-green-100 text-green-800">Eligible</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">
                              Blocked: {student.reason}
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
