import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle } from 'lucide-react'
import { NOMINATIONS, TRAINING_PROGRAMS, type Nomination } from '@/lib/hrmDemoSeed'

export default function NominationsAttendance() {
  const [nominations, setNominations] = useState<Nomination[]>(NOMINATIONS)
  const [selectedTraining, setSelectedTraining] = useState('all')
  const [selectedDept, setSelectedDept] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const filteredNoms = nominations.filter(n => {
    if (selectedTraining !== 'all' && n.trainingId !== selectedTraining) return false
    if (selectedDept !== 'all' && n.dept !== selectedDept) return false
    if (selectedStatus !== 'all' && n.status !== selectedStatus) return false
    return true
  })

  const totalNominated = nominations.filter(n => n.status === 'Nominated').length
  const totalApproved = nominations.filter(n => n.status === 'Approved').length
  const totalRejected = nominations.filter(n => n.status === 'Rejected').length
  const attendancePercent = Math.round((nominations.filter(n => n.attended).length / nominations.length) * 100)

  const handleApprove = (id: string) => {
    setNominations(nominations.map(n => n.id === id ? {...n, status: 'Approved' as const} : n))
  }

  const handleReject = (id: string) => {
    setNominations(nominations.map(n => n.id === id ? {...n, status: 'Rejected' as const} : n))
  }

  const handleToggleAttendance = (id: string) => {
    setNominations(nominations.map(n => n.id === id ? {...n, attended: !n.attended} : n))
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800">Nominations & Attendance</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Nominated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalNominated}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalApproved}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRejected}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Attendance %</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{attendancePercent}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedTraining} onValueChange={setSelectedTraining}>
              <SelectTrigger>
                <SelectValue placeholder="Select Training" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trainings</SelectItem>
                {TRAINING_PROGRAMS.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDept} onValueChange={setSelectedDept}>
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="CSE">CSE</SelectItem>
                <SelectItem value="BBA">BBA</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Nominated">Nominated</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nominations ({filteredNoms.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Employee</th>
                  <th className="px-3 py-2 text-left">Dept</th>
                  <th className="px-3 py-2 text-left">Designation</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Attended</th>
                  <th className="px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredNoms.slice(0, 50).map(nom => (
                  <tr key={nom.id}>
                    <td className="px-3 py-2 font-medium">{nom.empName}</td>
                    <td className="px-3 py-2">{nom.dept}</td>
                    <td className="px-3 py-2">{nom.designation}</td>
                    <td className="px-3 py-2">
                      <Badge variant={nom.status === 'Approved' ? 'default' : nom.status === 'Rejected' ? 'destructive' : 'secondary'}>
                        {nom.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleAttendance(nom.id)}
                        className={nom.attended ? 'text-green-600' : 'text-gray-400'}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </Button>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        {nom.status === 'Nominated' && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleApprove(nom.id)}>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleReject(nom.id)}>
                              <XCircle className="w-4 h-4 text-red-600" />
                            </Button>
                          </>
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
    </div>
  )
}
