import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, UserCog } from 'lucide-react'

interface NameChange {
  id: string
  timestamp: string
  userId: string
  role: string
  oldName: string
  newName: string
  requestedBy: string
  approvedBy: string
  reason: string
  documentRef: string
  status: 'Pending' | 'Approved' | 'Rejected'
}

export default function NameChangeLog() {
  const [logs] = useState<NameChange[]>([
    { id: '1', timestamp: '2025-01-15 09:20:12', userId: 'CS25010042', role: 'Student', oldName: 'Ayesha Rahman', newName: 'Ayesha Rahman Khan', requestedBy: 'CS25010042', approvedBy: 'registrar@nub.ac', reason: 'Legal name change after marriage', documentRef: 'DOC-2025-001', status: 'Approved' },
    { id: '2', timestamp: '2025-01-12 14:35:44', userId: 'BB25010001', role: 'Student', oldName: 'Fatima Khan', newName: 'Fatima Begum', requestedBy: 'BB25010001', approvedBy: 'registrar@nub.ac', reason: 'Correction in academic certificates', documentRef: 'DOC-2025-002', status: 'Approved' },
    { id: '3', timestamp: '2025-01-10 11:15:28', userId: 'faculty003', role: 'Faculty', oldName: 'Dr. Tanvir Hasan', newName: 'Prof. Dr. Tanvir Hasan', requestedBy: 'faculty003', approvedBy: 'hr@nub.ac', reason: 'Promotion to Professor', documentRef: 'DOC-2025-003', status: 'Approved' },
    { id: '4', timestamp: '2025-01-08 16:42:50', userId: 'CS25010050', role: 'Student', oldName: 'Mohammed Ali', newName: 'Mohammad Ali Ahmed', requestedBy: 'CS25010050', approvedBy: 'Pending', reason: 'Official passport name', documentRef: 'DOC-2025-004', status: 'Pending' }
  ])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.oldName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.newName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'All' || log.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Name Change Log</h1>
          <p className="text-gray-600 text-sm mt-1">Track all name modification requests</p>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by user ID or name..."
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
                <th className="text-left p-4 text-sm font-semibold text-gray-700">User ID</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Role</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Old Name</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">New Name</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Reason</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Document Ref</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Approved By</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-xs text-gray-600">{log.timestamp}</td>
                  <td className="p-4 text-sm font-medium text-deep-plum">{log.userId}</td>
                  <td className="p-4">
                    <Badge variant="outline">{log.role}</Badge>
                  </td>
                  <td className="p-4 text-sm">{log.oldName}</td>
                  <td className="p-4 text-sm font-medium">{log.newName}</td>
                  <td className="p-4 text-sm text-gray-600">{log.reason}</td>
                  <td className="p-4 text-xs font-mono text-gray-500">{log.documentRef}</td>
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
            <UserCog className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No name changes found</p>
          </div>
        )}
      </Card>
    </div>
  )
}
