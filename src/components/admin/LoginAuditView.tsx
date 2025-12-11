import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Download, Printer, Eye } from 'lucide-react'
import { loginHistoryStatic, invalidAttemptsStatic } from '@/lib/adminSecuritySeeds'

export default function LoginAuditView() {
  const [activeTab, setActiveTab] = useState<'history' | 'invalid'>('history')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [viewLoginDetails, setViewLoginDetails] = useState<any>(null)

  const handleViewDetails = (entry: any) => {
    setViewLoginDetails(entry)
  }

  const loginHistory = loginHistoryStatic
  const invalidAttempts = invalidAttemptsStatic

  const filteredHistory = loginHistory.filter(entry => {
    const matchesSearch = entry.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.ip.includes(searchQuery)
    const matchesStatus = statusFilter === 'All' || entry.result === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredInvalid = invalidAttempts.filter(entry => {
    const matchesSearch = entry.usernameAttempted.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.ip.includes(searchQuery)
    return matchesSearch
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
          <h1 className="text-2xl font-bold text-deep-plum">Login Audit & Security</h1>
          <p className="text-sm text-gray-600 mt-1">Monitor login attempts and detect suspicious activity</p>
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

      {/* Tabs */}
      <div className="flex space-x-1 border-b">
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-deep-plum text-deep-plum'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Login History ({filteredHistory.length})
        </button>
        <button
          onClick={() => setActiveTab('invalid')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'invalid'
              ? 'border-deep-plum text-deep-plum'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Invalid Attempts ({filteredInvalid.length})
        </button>
      </div>

      {/* Filters */}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {activeTab === 'history' ? 'Status' : 'Action'}
          </label>
          <select 
            className="w-full p-2 border rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            {activeTab === 'history' ? (
              <>
                <option>Success</option>
                <option>Failed</option>
                <option>Locked</option>
                <option>OTP Failed</option>
              </>
            ) : (
              <>
                <option>Lock Applied</option>
                <option>Blocked by IP List</option>
                <option>Warning Sent</option>
                <option>None</option>
              </>
            )}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <Input 
            placeholder="User / IP..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Login History Tab */}
      {activeTab === 'history' && (
        <Card>
          <CardHeader>
            <CardTitle>Login History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Timestamp</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">User</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Role</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">IP Address</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Device</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Result</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">OTP</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((entry) => (
                    <tr key={entry.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm">{entry.timestamp}</td>
                      <td className="p-3 text-sm">
                        <div className="font-medium">{entry.user}</div>
                        <div className="text-xs text-gray-600">{entry.userId}</div>
                      </td>
                      <td className="p-3 text-sm">{entry.role}</td>
                      <td className="p-3 text-sm font-mono">{entry.ip}</td>
                      <td className="p-3 text-sm">{entry.device}</td>
                      <td className="p-3">
                        <Badge className={
                          entry.result === 'Success' ? 'bg-green-100 text-green-800' :
                          entry.result === 'Failed' ? 'bg-red-100 text-red-800' :
                          entry.result === 'Locked' ? 'bg-orange-100 text-orange-800' :
                          'bg-amber-100 text-amber-800'
                        }>
                          {entry.result === 'Success' && '✓'}
                          {entry.result === 'Failed' && '✗'}
                          {entry.result === 'Locked' && '🔒'}
                          {entry.result === 'OTP Failed' && '⚠'}
                          {' '}{entry.result}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm">
                        {entry.otpAttempts ? `${entry.otpAttempts}/3` : '-'}
                      </td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(entry)} title="View Details">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredHistory.length} record(s)
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invalid Attempts Tab */}
      {activeTab === 'invalid' && (
        <Card>
          <CardHeader>
            <CardTitle>Invalid Login Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Timestamp</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Username Attempted</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">IP Address</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Attempt Count</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Time Window</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Action Taken</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvalid.map((entry) => (
                    <tr key={entry.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm">{entry.timestamp}</td>
                      <td className="p-3 text-sm font-mono">{entry.usernameAttempted}</td>
                      <td className="p-3 text-sm font-mono">{entry.ip}</td>
                      <td className="p-3 text-sm">
                        <Badge className={entry.attemptCount >= 5 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}>
                          {entry.attemptCount}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm">
                        {entry.windowStart} - {entry.windowEnd}
                      </td>
                      <td className="p-3">
                        <Badge className={
                          entry.action === 'Lock Applied' ? 'bg-red-100 text-red-800' :
                          entry.action === 'Blocked by IP List' ? 'bg-orange-100 text-orange-800' :
                          entry.action === 'Warning Sent' ? 'bg-amber-100 text-amber-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {entry.action}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-gray-600">{entry.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredInvalid.length} record(s)
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Login Details Dialog */}
      <Dialog open={!!viewLoginDetails} onOpenChange={() => setViewLoginDetails(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Login Attempt Details</DialogTitle>
            <DialogDescription>Complete information about this login attempt</DialogDescription>
          </DialogHeader>
          {viewLoginDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Timestamp</p>
                  <p className="text-base">{viewLoginDetails.timestamp}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">User</p>
                  <p className="text-base font-semibold">{viewLoginDetails.user}</p>
                  <p className="text-xs text-gray-500">{viewLoginDetails.userId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Role</p>
                  <p className="text-base">{viewLoginDetails.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">IP Address</p>
                  <p className="text-base font-mono">{viewLoginDetails.ip}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Device/Browser</p>
                  <p className="text-base">{viewLoginDetails.device}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Result</p>
                  <Badge className={
                    viewLoginDetails.result === 'Success' ? 'bg-green-100 text-green-800' :
                    viewLoginDetails.result === 'Failed' ? 'bg-red-100 text-red-800' :
                    viewLoginDetails.result === 'Locked' ? 'bg-orange-100 text-orange-800' :
                    'bg-amber-100 text-amber-800'
                  }>
                    {viewLoginDetails.result}
                  </Badge>
                </div>
                {viewLoginDetails.otpAttempts !== undefined && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">OTP Attempts</p>
                    <p className="text-base">{viewLoginDetails.otpAttempts} / 3</p>
                  </div>
                )}
                {viewLoginDetails.id && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Log ID</p>
                    <p className="text-base font-mono text-xs">{viewLoginDetails.id}</p>
                  </div>
                )}
              </div>

              {viewLoginDetails.result === 'Failed' && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-800">Failed Login Attempt</p>
                  <p className="text-sm text-red-700 mt-1">This login attempt was unsuccessful. Check for potential security issues.</p>
                </div>
              )}

              {viewLoginDetails.result === 'Locked' && (
                <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm font-medium text-orange-800">Account Locked</p>
                  <p className="text-sm text-orange-700 mt-1">The account was locked due to multiple failed attempts.</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
