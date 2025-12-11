import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Download, Printer } from 'lucide-react'
import { permissionChangeLogsStatic } from '@/lib/adminSecuritySeeds'

export default function PermissionLogsView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [changeTypeFilter, setChangeTypeFilter] = useState('All')

  const logs = permissionChangeLogsStatic

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.targetUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.permission.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = changeTypeFilter === 'All' || log.changeType === changeTypeFilter
    return matchesSearch && matchesType
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
          <h1 className="text-2xl font-bold text-deep-plum">Permission Change Logs</h1>
          <p className="text-sm text-gray-600 mt-1">Track all permission and role modifications</p>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Change Type</label>
          <select 
            className="w-full p-2 border rounded-md"
            value={changeTypeFilter}
            onChange={(e) => setChangeTypeFilter(e.target.value)}
          >
            <option>All</option>
            <option>Add Permission</option>
            <option>Remove Permission</option>
            <option>Add Role</option>
            <option>Remove Role</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <Input 
            placeholder="Actor / Target / Permission..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permission Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Time</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Actor</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Target User/Role</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Change</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Permission/Role</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Scope</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">IP</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm">{log.timestamp}</td>
                    <td className="p-3 text-sm">
                      <div className="font-medium">{log.actor}</div>
                      <div className="text-xs text-gray-600">{log.actorId}</div>
                    </td>
                    <td className="p-3 text-sm">
                      <div className="font-medium">{log.targetUser}</div>
                      <div className="text-xs text-gray-600">{log.targetUserId}</div>
                    </td>
                    <td className="p-3">
                      <Badge className={
                        log.changeType.includes('Add') ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {log.changeType.includes('Add') && '+ '}
                        {log.changeType.includes('Remove') && '- '}
                        {log.changeType}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm font-mono text-xs">{log.permission}</td>
                    <td className="p-3 text-sm">{log.scope}</td>
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
