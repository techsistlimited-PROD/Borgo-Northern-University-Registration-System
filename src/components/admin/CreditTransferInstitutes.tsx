import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Home, Building, Eye, Pencil, Trash2, Download, Printer, Search } from 'lucide-react'
import { DEMO_MODE, showDemoToast } from '@/config/demo'
import { creditTransferInstitutesStatic, type CreditTransferInstitute } from '@/lib/generalSettingsSeeds'

export default function CreditTransferInstitutesView() {
  const [data, setData] = useState<CreditTransferInstitute[]>(creditTransferInstitutesStatic)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [viewItem, setViewItem] = useState<CreditTransferInstitute | null>(null)
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false)
  const [editItem, setEditItem] = useState<CreditTransferInstitute | null>(null)
  const [editDrawerOpen, setEditDrawerOpen] = useState(false)

  const filtered = data.filter(item => {
    const matchesSearch = item.instituteName.toLowerCase().includes(search.toLowerCase()) ||
                         item.country.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'All' || item.type === typeFilter
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const handleView = (item: CreditTransferInstitute) => {
    setViewItem(item)
    setViewDrawerOpen(true)
  }

  const handleEdit = (item: CreditTransferInstitute) => {
    setEditItem(item)
    setEditDrawerOpen(true)
  }

  const handleSaveEdit = () => {
    if (editItem && DEMO_MODE) {
      setData(data.map(d => d.id === editItem.id ? editItem : d))
      alert(showDemoToast(`Updated "${editItem.instituteName}"`))
      setEditDrawerOpen(false)
      setEditItem(null)
    }
  }

  const handleDelete = (item: CreditTransferInstitute) => {
    if (DEMO_MODE) {
      setData(data.filter(d => d.id !== item.id))
      alert(showDemoToast(`Delete "${item.instituteName}"`))
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
          <span className="text-deep-plum font-medium">Credit Transfer Institute List</span>
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
            <Building className="w-5 h-5" />
            <span>Credit Transfer Institute List</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by institute name or country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="All">All Types</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
              <option value="International Partner">International Partner</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 text-sm font-medium">Institute Name</th>
                  <th className="text-left p-3 text-sm font-medium">Country</th>
                  <th className="text-left p-3 text-sm font-medium">Type</th>
                  <th className="text-left p-3 text-sm font-medium">Status</th>
                  <th className="text-left p-3 text-sm font-medium">Contact Email</th>
                  <th className="text-right p-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-medium">{item.instituteName}</td>
                    <td className="p-3 text-sm">{item.country}</td>
                    <td className="p-3 text-sm">{item.type}</td>
                    <td className="p-3">
                      <Badge 
                        variant={item.status === 'Active' ? 'default' : item.status === 'Pending' ? 'secondary' : 'outline'}
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-blue-600">{item.contactEmail}</td>
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
            <DialogTitle>Credit Transfer Institute Details</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">ID</label>
                <p className="text-base mt-1">{viewItem.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Institute Name</label>
                <p className="text-base mt-1">{viewItem.instituteName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Country</label>
                <p className="text-base mt-1">{viewItem.country}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Type</label>
                <p className="text-base mt-1">{viewItem.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <p className="text-base mt-1">
                  <Badge 
                    variant={viewItem.status === 'Active' ? 'default' : viewItem.status === 'Pending' ? 'secondary' : 'outline'}
                  >
                    {viewItem.status}
                  </Badge>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Contact Email</label>
                <p className="text-base mt-1 text-blue-600">{viewItem.contactEmail}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDrawerOpen} onOpenChange={setEditDrawerOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Credit Transfer Institute</DialogTitle>
          </DialogHeader>
          {editItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">Institute Name</label>
                  <Input
                    value={editItem.instituteName}
                    onChange={(e) => setEditItem({...editItem, instituteName: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Country</label>
                  <Input
                    value={editItem.country}
                    onChange={(e) => setEditItem({...editItem, country: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <select
                    className="w-full p-2 border rounded-md mt-1"
                    value={editItem.type}
                    onChange={(e) => setEditItem({...editItem, type: e.target.value})}
                  >
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                    <option value="International Partner">International Partner</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select
                    className="w-full p-2 border rounded-md mt-1"
                    value={editItem.status}
                    onChange={(e) => setEditItem({...editItem, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Contact Email</label>
                  <Input
                    type="email"
                    value={editItem.contactEmail}
                    onChange={(e) => setEditItem({...editItem, contactEmail: e.target.value})}
                    className="mt-1"
                  />
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
