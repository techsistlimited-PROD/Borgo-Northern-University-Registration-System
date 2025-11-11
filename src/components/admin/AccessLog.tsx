import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Download, Eye } from 'lucide-react'

export default function AccessLog() {
  const [viewLog, setViewLog] = useState<any>(null)

  const handleViewLog = (log: any) => {
    setViewLog(log)
  }

  const logs = [
    { timestamp: '03 Nov 2025 10:14 AM', user: 'Md. Imran Hossain', role: 'System Admin', module: 'Admin → Code Generator', ip: '103.102.xx.1', device: 'Chrome / Windows 11', status: 'Success' },
    { timestamp: '03 Nov 2025 10:12 AM', user: 'Sharmin Akter', role: 'Finance Officer', module: 'Finance → Student Ledger', ip: '203.91.xx.77', device: 'Chrome / MacOS', status: 'Success' },
    { timestamp: '03 Nov 2025 10:05 AM', user: 'Fahim Rahman', role: 'Exam Controller', module: 'Exam → Seat Plan', ip: '10.10.xx.12', device: 'Edge / Windows 10', status: 'Success' },
    { timestamp: '03 Nov 2025 09:58 AM', user: 'Md. Imran Hossain', role: 'System Admin', module: 'Admin → Roles & Access', ip: '103.102.xx.1', device: 'Chrome / Windows 11', status: 'Failed(2FA)' }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Access Log</h1>
          <p className="text-sm text-gray-600 mt-1">Monitor user login activity and module access</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
          <input type="date" className="w-full p-2 border rounded-md" defaultValue="2025-11-01" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
          <input type="date" className="w-full p-2 border rounded-md" defaultValue="2025-11-03" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
          <input type="text" className="w-full p-2 border rounded-md" placeholder="Search user..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
          <select className="w-full p-2 border rounded-md">
            <option>All Modules</option>
            <option>Admin</option>
            <option>Finance</option>
            <option>Exam</option>
          </select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Access History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Timestamp</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">User</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Role</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Module Accessed</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">IP Address</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Device</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm">{log.timestamp}</td>
                    <td className="p-3 text-sm font-medium">{log.user}</td>
                    <td className="p-3 text-sm">{log.role}</td>
                    <td className="p-3 text-sm">{log.module}</td>
                    <td className="p-3 text-sm font-mono">{log.ip}</td>
                    <td className="p-3 text-sm">{log.device}</td>
                    <td className="p-3">
                      <Badge className={log.status.includes('Failed') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                        {log.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm" onClick={() => handleViewLog(log)} title="View Details">
                        <Eye className="w-4 h-4" />
                      </Button>
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
