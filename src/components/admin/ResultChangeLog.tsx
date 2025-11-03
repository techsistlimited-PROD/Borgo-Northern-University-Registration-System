import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, FileEdit } from 'lucide-react'

interface ResultChange {
  id: string
  timestamp: string
  studentId: string
  studentName: string
  courseCode: string
  courseName: string
  oldGrade: string
  newGrade: string
  oldGP: number
  newGP: number
  changedBy: string
  reason: string
  approvedBy: string
  status: 'Pending' | 'Approved' | 'Rejected'
}

export default function ResultChangeLog() {
  const [logs] = useState<ResultChange[]>([
    { id: '1', timestamp: '2025-01-15 11:30:00', studentId: 'CS25010042', studentName: 'Ayesha Rahman', courseCode: 'CSE1101', courseName: 'Programming Fundamentals', oldGrade: 'B', newGrade: 'A-', oldGP: 3.0, newGP: 3.5, changedBy: 'faculty001', reason: 'Recount requested', approvedBy: 'coe@nub.ac', status: 'Approved' },
    { id: '2', timestamp: '2025-01-14 15:45:22', studentId: 'BB25010001', studentName: 'Fatima Khan', courseCode: 'BUS1302', courseName: 'Principles of Marketing', oldGrade: 'C+', newGrade: 'B-', oldGP: 2.5, newGP: 2.75, changedBy: 'faculty004', reason: 'Marking error', approvedBy: 'coe@nub.ac', status: 'Approved' },
    { id: '3', timestamp: '2025-01-13 10:20:15', studentId: 'CS25010043', studentName: 'Tanvir Ahmed', courseCode: 'CSE2205', courseName: 'Data Structures', oldGrade: 'B-', newGrade: 'B', oldGP: 2.75, newGP: 3.0, changedBy: 'faculty002', reason: 'Script review', approvedBy: 'coe@nub.ac', status: 'Approved' },
    { id: '4', timestamp: '2025-01-12 14:10:33', studentId: 'LW25010001', studentName: 'Nishat Sultana', courseCode: 'LAW2107', courseName: 'Constitutional Law', oldGrade: 'A-', newGrade: 'A', oldGP: 3.5, newGP: 4.0, changedBy: 'faculty007', reason: 'Additional credit awarded', approvedBy: 'Pending', status: 'Pending' }
  ])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'All' || log.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Result Change Log</h1>
          <p className="text-gray-600 text-sm mt-1">Track all grade and result modifications</p>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by student ID, name, or course code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border rounded-md text-sm"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Timestamp</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Student</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Course</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Old Grade</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">New Grade</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Changed By</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Reason</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Approved By</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-xs text-gray-600">{log.timestamp}</td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium text-deep-plum">{log.studentId}</p>
                      <p className="text-xs text-gray-500">{log.studentName}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium">{log.courseCode}</p>
                      <p className="text-xs text-gray-500">{log.courseName}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline">{log.oldGrade} ({log.oldGP})</Badge>
                  </td>
                  <td className="p-4">
                    <Badge>{log.newGrade} ({log.newGP})</Badge>
                  </td>
                  <td className="p-4 text-sm">{log.changedBy}</td>
                  <td className="p-4 text-sm text-gray-600">{log.reason}</td>
                  <td className="p-4 text-sm">{log.approvedBy}</td>
                  <td className="p-4">
                    <Badge variant={log.status === 'Approved' ? 'default' : log.status === 'Pending' ? 'secondary' : 'destructive'}>
                      {log.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <FileEdit className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No result changes found</p>
          </div>
        )}
      </Card>
    </div>
  )
}
