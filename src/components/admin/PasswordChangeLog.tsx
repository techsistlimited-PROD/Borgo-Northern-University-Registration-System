import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Key } from 'lucide-react'

interface PasswordChange {
  id: string
  timestamp: string
  userId: string
  userName: string
  role: string
  changedBy: string
  reason: string
  ipAddress: string
  status: 'Success' | 'Failed'
}

export default function PasswordChangeLog() {
  const [logs] = useState<PasswordChange[]>([
    { id: '1', timestamp: '2025-01-15 10:15:30', userId: 'CS25010042', userName: 'Ayesha Rahman', role: 'Student', changedBy: 'Self', reason: 'User initiated', ipAddress: '192.168.1.50', status: 'Success' },
    { id: '2', timestamp: '2025-01-14 16:42:18', userId: 'faculty001', userName: 'Dr. Nusrat Jahan', role: 'Faculty', changedBy: 'admin@nub.ac', reason: 'Password reset by admin', ipAddress: '192.168.1.100', status: 'Success' },
    { id: '3', timestamp: '2025-01-14 14:23:05', userId: 'CS25010043', userName: 'Tanvir Ahmed', role: 'Student', changedBy: 'Self', reason: 'User initiated', ipAddress: '192.168.1.51', status: 'Success' },
    { id: '4', timestamp: '2025-01-13 09:12:44', userId: 'faculty002', userName: 'Engr. Shakil Rahman', role: 'Faculty', changedBy: 'Self', reason: 'Security update', ipAddress: '192.168.1.102', status: 'Success' },
    { id: '5', timestamp: '2025-01-12 11:58:19', userId: 'BB25010001', userName: 'Fatima Khan', role: 'Student', changedBy: 'admin@nub.ac', reason: 'Forgot password', ipAddress: '192.168.1.100', status: 'Success' }
  ])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('All')

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.userName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'All' || log.role === filterRole
    return matchesSearch && matchesRole
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Password Change Log</h1>
          <p className="text-gray-600 text-sm mt-1">Track all password change activities</p>
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
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="p-2 border rounded-md text-sm"
          >
            <option>All</option>
            <option>Student</option>
            <option>Faculty</option>
            <option>Admin</option>
            <option>Staff</option>
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
                <th className="text-left p-4 text-sm font-semibold text-gray-700">User Name</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Role</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Changed By</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Reason</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">IP Address</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-xs text-gray-600">{log.timestamp}</td>
                  <td className="p-4 text-sm font-medium text-deep-plum">{log.userId}</td>
                  <td className="p-4 text-sm">{log.userName}</td>
                  <td className="p-4">
                    <Badge variant="outline">{log.role}</Badge>
                  </td>
                  <td className="p-4 text-sm">{log.changedBy}</td>
                  <td className="p-4 text-sm text-gray-600">{log.reason}</td>
                  <td className="p-4 text-xs font-mono text-gray-500">{log.ipAddress}</td>
                  <td className="p-4">
                    <Badge variant={log.status === 'Success' ? 'default' : 'destructive'}>
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
            <Key className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No password change logs found</p>
          </div>
        )}
      </Card>
    </div>
  )
}
