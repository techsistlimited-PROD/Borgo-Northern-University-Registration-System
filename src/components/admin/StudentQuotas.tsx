import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Home, Percent, Eye, Pencil, Trash2, Download, Printer, Search } from 'lucide-react'
import { DEMO_MODE, showDemoToast } from '@/config/demo'
import { studentQuotasStatic, type StudentQuota } from '@/lib/generalSettingsSeeds'

export default function StudentQuotasView() {
  const [data, setData] = useState<StudentQuota[]>(studentQuotasStatic)
  const [search, setSearch] = useState('')
  const [viewItem, setViewItem] = useState<StudentQuota | null>(null)
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false)
  const [editItem, setEditItem] = useState<StudentQuota | null>(null)
  const [editDrawerOpen, setEditDrawerOpen] = useState(false)

  const filtered = data.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.code.toLowerCase().includes(search.toLowerCase())
  )

  const handleView = (item: StudentQuota) => {
    setViewItem(item)
    setViewDrawerOpen(true)
  }

  const handleEdit = (item: StudentQuota) => {
    setEditItem(item)
    setEditDrawerOpen(true)
  }

  const handleSaveEdit = () => {
    if (editItem && DEMO_MODE) {
      setData(data.map(d => d.id === editItem.id ? editItem : d))
      alert(showDemoToast(`Updated "${editItem.name}"`))
      setEditDrawerOpen(false)
      setEditItem(null)
    }
  }

  const handleDelete = (item: StudentQuota) => {
    if (DEMO_MODE) {
      setData(data.filter(d => d.id !== item.id))
      alert(showDemoToast(`Delete "${item.name}"`))
    }
  }

  const handleExport = () => {
    alert(showDemoToast('Export to CSV'))
  }

  const handlePrint = () => {
    alert(showDemoToast('Print'))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Home className="w-4 h-4" />
          <span>/</span>
          <span>Admin & Security</span>
          <span>/</span>
          <span>General Settings</span>
          <span>/</span>
          <span className="text-deep-plum font-medium">Student Quota Types</span>
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
            <Percent className="w-5 h-5" />
            <span>Student Quota Types</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 text-sm font-medium">Code</th>
                  <th className="text-left p-3 text-sm font-medium">Quota Name</th>
                  <th className="text-left p-3 text-sm font-medium">Percentage Cap</th>
                  <th className="text-left p-3 text-sm font-medium">Status</th>
                  <th className="text-right p-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-mono">{item.code}</td>
                    <td className="p-3 text-sm font-medium">{item.name}</td>
                    <td className="p-3 text-sm">{item.percentageCap}%</td>
                    <td className="p-3">
                      <Badge variant={item.active ? 'default' : 'secondary'}>
                        {item.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleView(item)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(item)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
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
        </CardContent>
      </Card>

      <Dialog open={viewDrawerOpen} onOpenChange={setViewDrawerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student Quota Details</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">ID</label>
                <p className="text-base mt-1">{viewItem.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Code</label>
                <p className="text-base mt-1 font-mono">{viewItem.code}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Quota Name</label>
                <p className="text-base mt-1">{viewItem.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Percentage Cap</label>
                <p className="text-base mt-1">{viewItem.percentageCap}%</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <p className="text-base mt-1">
                  <Badge variant={viewItem.active ? 'default' : 'secondary'}>
                    {viewItem.active ? 'Active' : 'Inactive'}
                  </Badge>
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
