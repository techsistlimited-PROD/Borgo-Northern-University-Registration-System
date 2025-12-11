import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Home, Shield, Eye, Download, Printer, Search } from 'lucide-react'
import { DEMO_MODE, showDemoToast } from '@/config/demo'
import { ipLoginAuditStatic, type IPLoginAuditEntry } from '@/lib/adminSecuritySeeds'

export default function IPLoginAuditView() {
  const [data, setData] = useState<IPLoginAuditEntry[]>(ipLoginAuditStatic)
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [ipFilter, setIpFilter] = useState('')
  const [userIdFilter, setUserIdFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [viewItem, setViewItem] = useState<IPLoginAuditEntry | null>(null)
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false)

  const filtered = data.filter(item => {
    const matchesSearch = item.userName.toLowerCase().includes(search.toLowerCase()) ||
                         item.userId.toLowerCase().includes(search.toLowerCase()) ||
                         item.ipAddress.includes(search.toLowerCase())
    const matchesIp = !ipFilter || item.ipAddress.includes(ipFilter)
    const matchesUserId = !userIdFilter || item.userId.toLowerCase().includes(userIdFilter.toLowerCase())
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter
    return matchesSearch && matchesIp && matchesUserId && matchesStatus
  })

  const handleView = (item: IPLoginAuditEntry) => {
    setViewItem(item)
    setViewDrawerOpen(true)
  }

  const handleExport = () => {
    alert(showDemoToast('Export to CSV'))
  }

  const handlePrint = () => {
    alert(showDemoToast('Print'))
  }

  const handleSearch = () => {
    alert(showDemoToast('Search with filters applied'))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Home className="w-4 h-4" />
          <span>/</span>
          <span>Admin & Security</span>
          <span>/</span>
          <span className="text-deep-plum font-medium">IP Based Login Audit</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>IP-Based Login Audit</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Date From</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Date To</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">IP Address</label>
                <Input
                  placeholder="e.g., 103.102.101.1"
                  value={ipFilter}
                  onChange={(e) => setIpFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">User ID</label>
                <Input
                  placeholder="e.g., ADM-0001"
                  value={userIdFilter}
                  onChange={(e) => setUserIdFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="All">All</option>
                  <option value="Success">Success</option>
                  <option value="Failed">Failed</option>
                  <option value="Locked">Locked</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by user name, user ID, or IP address..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch}>Search</Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">Date & Time</th>
                    <th className="text-left p-3 text-sm font-medium">User ID</th>
                    <th className="text-left p-3 text-sm font-medium">User Name</th>
                    <th className="text-left p-3 text-sm font-medium">IP Address</th>
                    <th className="text-left p-3 text-sm font-medium">Location</th>
                    <th className="text-left p-3 text-sm font-medium">Device</th>
                    <th className="text-left p-3 text-sm font-medium">Status</th>
                    <th className="text-right p-3 text-sm font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm">{item.timestamp}</td>
                      <td className="p-3 text-sm font-mono">{item.userId}</td>
                      <td className="p-3 text-sm font-medium">{item.userName}</td>
                      <td className="p-3 text-sm font-mono">{item.ipAddress}</td>
                      <td className="p-3 text-sm">{item.location}</td>
                      <td className="p-3 text-sm">{item.device}</td>
                      <td className="p-3">
                        <Badge 
                          variant={
                            item.status === 'Success' ? 'default' : 
                            item.status === 'Failed' ? 'destructive' : 
                            'outline'
                          }
                        >
                          {item.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end">
                          <Button variant="ghost" size="sm" onClick={() => handleView(item)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Showing {filtered.length} of {data.length} records
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={viewDrawerOpen} onOpenChange={setViewDrawerOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Login Audit Details</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Timestamp</label>
                  <p className="text-base mt-1">{viewItem.timestamp}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">User ID</label>
                  <p className="text-base mt-1 font-mono">{viewItem.userId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">User Name</label>
                  <p className="text-base mt-1">{viewItem.userName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">IP Address</label>
                  <p className="text-base mt-1 font-mono">{viewItem.ipAddress}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Geo-Location</label>
                  <p className="text-base mt-1">{viewItem.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Device Information</label>
                  <p className="text-base mt-1">{viewItem.device}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <p className="text-base mt-1">
                    <Badge 
                      variant={
                        viewItem.status === 'Success' ? 'default' : 
                        viewItem.status === 'Failed' ? 'destructive' : 
                        'outline'
                      }
                    >
                      {viewItem.status}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Login Result Message</label>
                  <p className="text-base mt-1">{viewItem.loginResultMessage}</p>
                </div>
              </div>
              
              {DEMO_MODE && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4">
                  <p className="text-sm text-blue-800">
                    <strong>Demo Mode:</strong> This is sample audit data for demonstration purposes.
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
