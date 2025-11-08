import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Home, Database, Eye, Download, Printer, Search } from 'lucide-react'
import { DEMO_MODE, showDemoToast } from '@/config/demo'
import { dataUpdateHistoryStatic, type DataUpdateHistoryEntry } from '@/lib/adminSecuritySeeds'

export default function DataUpdateHistoryView() {
  const [data, setData] = useState<DataUpdateHistoryEntry[]>(dataUpdateHistoryStatic)
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [userIdFilter, setUserIdFilter] = useState('')
  const [moduleFilter, setModuleFilter] = useState<string>('All')
  const [actionTypeFilter, setActionTypeFilter] = useState<string>('All')
  const [viewItem, setViewItem] = useState<DataUpdateHistoryEntry | null>(null)
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false)

  const filtered = data.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(search.toLowerCase()) ||
                         item.itemId.toLowerCase().includes(search.toLowerCase()) ||
                         item.userName.toLowerCase().includes(search.toLowerCase())
    const matchesUserId = !userIdFilter || item.userId.toLowerCase().includes(userIdFilter.toLowerCase())
    const matchesModule = moduleFilter === 'All' || item.module === moduleFilter
    const matchesActionType = actionTypeFilter === 'All' || item.actionType === actionTypeFilter
    return matchesSearch && matchesUserId && matchesModule && matchesActionType
  })

  const handleView = (item: DataUpdateHistoryEntry) => {
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
          <span className="text-deep-plum font-medium">Data Update History</span>
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
            <Database className="w-5 h-5" />
            <span>Data Update History</span>
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
                <label className="text-sm font-medium mb-1 block">User ID</label>
                <Input
                  placeholder="e.g., ADM-0001"
                  value={userIdFilter}
                  onChange={(e) => setUserIdFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Module</label>
                <select
                  value={moduleFilter}
                  onChange={(e) => setModuleFilter(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="All">All Modules</option>
                  <option value="Student">Student</option>
                  <option value="Admission">Admission</option>
                  <option value="Exam">Exam</option>
                  <option value="Finance">Finance</option>
                  <option value="Admin">Admin</option>
                  <option value="General Settings">General Settings</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Action Type</label>
                <select
                  value={actionTypeFilter}
                  onChange={(e) => setActionTypeFilter(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="All">All Actions</option>
                  <option value="Created">Created</option>
                  <option value="Updated">Updated</option>
                  <option value="Deleted">Deleted</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by description, item ID, or user name..."
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
                    <th className="text-left p-3 text-sm font-medium">Module</th>
                    <th className="text-left p-3 text-sm font-medium">Action Type</th>
                    <th className="text-left p-3 text-sm font-medium">Item ID</th>
                    <th className="text-left p-3 text-sm font-medium">Description</th>
                    <th className="text-right p-3 text-sm font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm">{item.timestamp}</td>
                      <td className="p-3 text-sm font-mono">{item.userId}</td>
                      <td className="p-3 text-sm">{item.module}</td>
                      <td className="p-3">
                        <Badge 
                          variant={
                            item.actionType === 'Created' ? 'default' : 
                            item.actionType === 'Updated' ? 'secondary' : 
                            'destructive'
                          }
                        >
                          {item.actionType}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm font-mono">{item.itemId}</td>
                      <td className="p-3 text-sm">{item.description}</td>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Data Update Details</DialogTitle>
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
                  <label className="text-sm font-medium text-gray-600">Module</label>
                  <p className="text-base mt-1">{viewItem.module}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Action Type</label>
                  <p className="text-base mt-1">
                    <Badge 
                      variant={
                        viewItem.actionType === 'Created' ? 'default' : 
                        viewItem.actionType === 'Updated' ? 'secondary' : 
                        'destructive'
                      }
                    >
                      {viewItem.actionType}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Item ID</label>
                  <p className="text-base mt-1 font-mono">{viewItem.itemId}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600">Summary</label>
                  <p className="text-base mt-1">{viewItem.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Before Values</label>
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <pre className="text-xs font-mono overflow-x-auto">{viewItem.beforeValues}</pre>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">After Values</label>
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <pre className="text-xs font-mono overflow-x-auto">{viewItem.afterValues}</pre>
                  </div>
                </div>
              </div>
              
              {DEMO_MODE && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4">
                  <p className="text-sm text-blue-800">
                    <strong>Demo Mode:</strong> This is sample update history data for demonstration purposes.
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
