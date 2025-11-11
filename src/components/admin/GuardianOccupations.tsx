import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Home, Briefcase, Eye, Pencil, Trash2, Download, Printer, Search } from 'lucide-react'
import { DEMO_MODE, showDemoToast } from '@/config/demo'
import { guardianOccupationsStatic, type GuardianOccupation } from '@/lib/generalSettingsSeeds'

export default function GuardianOccupationsView() {
  const [data, setData] = useState<GuardianOccupation[]>(guardianOccupationsStatic)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [viewItem, setViewItem] = useState<GuardianOccupation | null>(null)
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false)
  const [editItem, setEditItem] = useState<GuardianOccupation | null>(null)
  const [editDrawerOpen, setEditDrawerOpen] = useState(false)

  const filtered = data.filter(item => {
    const matchesSearch = item.occupationName.toLowerCase().includes(search.toLowerCase()) ||
                         item.code.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleView = (item: GuardianOccupation) => {
    setViewItem(item)
    setViewDrawerOpen(true)
  }

  const handleEdit = (item: GuardianOccupation) => {
    setEditItem(item)
    setEditDrawerOpen(true)
  }

  const handleSaveEdit = () => {
    if (editItem && DEMO_MODE) {
      setData(data.map(d => d.id === editItem.id ? editItem : d))
      alert(showDemoToast(`Updated "${editItem.occupationName}"`))
      setEditDrawerOpen(false)
      setEditItem(null)
    }
  }

  const handleDelete = (item: GuardianOccupation) => {
    if (DEMO_MODE) {
      setData(data.filter(d => d.id !== item.id))
      alert(showDemoToast(`Delete "${item.occupationName}"`))
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
          <span className="text-deep-plum font-medium">Guardian/Parents Job & Occupation Types</span>
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
            <Briefcase className="w-5 h-5" />
            <span>Guardian/Parent Occupation Types</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by occupation name or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="All">All Categories</option>
              <option value="Government">Government</option>
              <option value="Private">Private</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 text-sm font-medium">Code</th>
                  <th className="text-left p-3 text-sm font-medium">Occupation Name</th>
                  <th className="text-left p-3 text-sm font-medium">Category</th>
                  <th className="text-left p-3 text-sm font-medium">Status</th>
                  <th className="text-right p-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-mono">{item.code}</td>
                    <td className="p-3 text-sm font-medium">{item.occupationName}</td>
                    <td className="p-3 text-sm">{item.category}</td>
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
            <DialogTitle>Guardian Occupation Details</DialogTitle>
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
                <label className="text-sm font-medium text-gray-600">Occupation Name</label>
                <p className="text-base mt-1">{viewItem.occupationName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Category</label>
                <p className="text-base mt-1">{viewItem.category}</p>
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

      {/* Edit Dialog */}
      <Dialog open={editDrawerOpen} onOpenChange={setEditDrawerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Guardian Occupation</DialogTitle>
          </DialogHeader>
          {editItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Code</label>
                  <Input
                    value={editItem.code}
                    onChange={(e) => setEditItem({...editItem, code: e.target.value})}
                    className="mt-1 font-mono"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Occupation Name</label>
                  <Input
                    value={editItem.occupationName}
                    onChange={(e) => setEditItem({...editItem, occupationName: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <select
                    className="w-full p-2 border rounded-md mt-1"
                    value={editItem.category}
                    onChange={(e) => setEditItem({...editItem, category: e.target.value as 'Government' | 'Private' | 'Self-Employed' | 'Other'})}
                  >
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select
                    className="w-full p-2 border rounded-md mt-1"
                    value={editItem.active ? 'Active' : 'Inactive'}
                    onChange={(e) => setEditItem({...editItem, active: e.target.value === 'Active'})}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setEditDrawerOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveEdit} className="nu-button-primary">Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
