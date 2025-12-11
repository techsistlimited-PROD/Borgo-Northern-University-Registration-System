import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Activity } from 'lucide-react'

interface ActivityLogEntry {
  id: string
  timestamp: string
  user: string
  role: string
  action: string
  module: string
  details: string
  ipAddress: string
  status: 'Success' | 'Failed' | 'Warning'
}

export default function ActivityLog() {
  const [logs] = useState<ActivityLogEntry[]>([
    { id: '1', timestamp: '2025-01-15 14:32:15', user: 'admin@nub.ac', role: 'Admin', action: 'Created Program', module: 'Academic Setup', details: 'Created CSE program', ipAddress: '192.168.1.100', status: 'Success' },
    { id: '2', timestamp: '2025-01-15 14:28:42', user: 'coe@nub.ac', role: 'COE', action: 'Published Results', module: 'Exam', details: 'Published CSE1101 final exam results', ipAddress: '192.168.1.105', status: 'Success' },
    { id: '3', timestamp: '2025-01-15 14:15:08', user: 'finance@nub.ac', role: 'Finance', action: 'Payment Collected', module: 'Finance', details: 'Collected payment MR-2025-44001', ipAddress: '192.168.1.110', status: 'Success' },
    { id: '4', timestamp: '2025-01-15 13:58:33', user: 'admin@nub.ac', role: 'Admin', action: 'Modified User', module: 'User Management', details: 'Updated user permissions for faculty@nub.ac', ipAddress: '192.168.1.100', status: 'Success' },
    { id: '5', timestamp: '2025-01-15 13:45:19', user: 'coe@nub.ac', role: 'COE', action: 'Failed Login Attempt', module: 'Authentication', details: 'Invalid password entered', ipAddress: '192.168.1.120', status: 'Failed' }
  ])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterModule, setFilterModule] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesModule = filterModule === 'All' || log.module === filterModule
    const matchesStatus = filterStatus === 'All' || log.status === filterStatus
    return matchesSearch && matchesModule && matchesStatus
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Activity Log</h1>
          <p className="text-gray-600 text-sm mt-1">Track all system activities and user actions</p>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by user, action, or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="p-2 border rounded-md text-sm"
            >
              <option>All</option>
              <option>Academic Setup</option>
              <option>Exam</option>
              <option>Finance</option>
              <option>User Management</option>
              <option>Authentication</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border rounded-md text-sm"
            >
              <option>All</option>
              <option>Success</option>
              <option>Failed</option>
              <option>Warning</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Timestamp</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">User</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Role</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Action</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Module</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Details</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">IP Address</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-xs text-gray-600">{log.timestamp}</td>
                  <td className="p-4 text-sm font-medium">{log.user}</td>
                  <td className="p-4">
                    <Badge variant="outline">{log.role}</Badge>
                  </td>
                  <td className="p-4 text-sm">{log.action}</td>
                  <td className="p-4">
                    <Badge variant="secondary">{log.module}</Badge>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{log.details}</td>
                  <td className="p-4 text-xs font-mono text-gray-500">{log.ipAddress}</td>
                  <td className="p-4">
                    <Badge 
                      variant={log.status === 'Success' ? 'default' : log.status === 'Failed' ? 'destructive' : 'secondary'}
                    >
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
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No activity logs found</p>
          </div>
        )}
      </Card>
    </div>
  )
}
