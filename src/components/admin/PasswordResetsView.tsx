import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Download, Printer } from 'lucide-react'
import { passwordResetLogsStatic } from '@/lib/adminSecuritySeeds'

export default function PasswordResetsView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [outcomeFilter, setOutcomeFilter] = useState('All')

  const logs = passwordResetLogsStatic

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.userId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesOutcome = outcomeFilter === 'All' || log.outcome === outcomeFilter
    return matchesSearch && matchesOutcome
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
          <h1 className="text-2xl font-bold text-deep-plum">Password Reset Logs</h1>
          <p className="text-sm text-gray-600 mt-1">Track password reset requests and outcomes</p>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
          <select 
            className="w-full p-2 border rounded-md"
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
          >
            <option>All</option>
            <option>Success</option>
            <option>Failed</option>
            <option>Expired</option>
            <option>Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <Input 
            placeholder="User / User ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Password Reset History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Time</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">User</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Initiated By</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Method</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Outcome</th>
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
                      <Badge className={
                        log.initiatedBy === 'Self' ? 'bg-blue-100 text-blue-800' :
                        log.initiatedBy === 'Admin' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {log.initiatedBy}
                      </Badge>
                      {log.initiatorId && (
                        <div className="text-xs text-gray-600 mt-1">{log.initiatorId}</div>
                      )}
                    </td>
                    <td className="p-3 text-sm">{log.method}</td>
                    <td className="p-3">
                      <Badge className={
                        log.outcome === 'Success' ? 'bg-green-100 text-green-800' :
                        log.outcome === 'Failed' ? 'bg-red-100 text-red-800' :
                        log.outcome === 'Expired' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {log.outcome === 'Success' && '✓ '}
                        {log.outcome === 'Failed' && '✗ '}
                        {log.outcome}
                      </Badge>
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
