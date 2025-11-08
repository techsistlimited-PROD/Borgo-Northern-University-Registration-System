import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Download, Printer } from 'lucide-react'
import { emailVerificationLogsStatic } from '@/lib/adminSecuritySeeds'

export default function EmailLogsView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [eventFilter, setEventFilter] = useState('All')

  const logs = emailVerificationLogsStatic

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.newEmail?.toLowerCase().includes(searchQuery.toLowerCase()) || false
    const matchesEvent = eventFilter === 'All' || log.event === eventFilter
    return matchesSearch && matchesEvent
  })

  const handleExport = () => {
    alert('Exporting to CSV... (Demo)')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Email Verification Logs</h1>
          <p className="text-sm text-gray-600 mt-1">Track email verifications, changes, and OTP validations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
          <input type="date" className="w-full p-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
          <input type="date" className="w-full p-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
          <select 
            className="w-full p-2 border rounded-md"
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
          >
            <option>All</option>
            <option>Email Verification</option>
            <option>Email Change</option>
            <option>OTP Verification</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <Input 
            placeholder="User / Email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Verification History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Time</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">User</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Event</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Email Change</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">OTP Code</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">IP</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm">{log.timestamp}</td>
                    <td className="p-3 text-sm">
                      <div className="font-medium">{log.user}</div>
                      <div className="text-xs text-gray-600">{log.userId}</div>
                    </td>
                    <td className="p-3 text-sm">
                      <Badge className="bg-blue-100 text-blue-800">
                        {log.event}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={
                        log.status === 'Success' ? 'bg-green-100 text-green-800' :
                        log.status === 'Failed' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }>
                        {log.status === 'Success' && '✓ '}
                        {log.status === 'Failed' && '✗ '}
                        {log.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm">
                      {log.oldEmail && log.newEmail ? (
                        <div className="text-xs">
                          <div className="text-gray-600 line-through">{log.oldEmail}</div>
                          <div className="text-green-600">→ {log.newEmail}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-3 text-sm">
                      {log.otpCode ? (
                        <span className="font-mono text-xs">{log.otpCode}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-3 text-sm font-mono text-xs">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredLogs.length} record(s)
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
