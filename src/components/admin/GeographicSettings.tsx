import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Home, MapPin, Eye, Pencil, Trash2, Download, Printer, Search } from 'lucide-react'
import { DEMO_MODE, showDemoToast } from '@/config/demo'
import {
  countriesStatic, divisionsStatic, districtsStatic, policeStationsStatic, postOfficesStatic,
  type Country, type Division, type District, type PoliceStation, type PostOffice
} from '@/lib/generalSettingsSeeds'

type TabType = 'country' | 'division' | 'district' | 'policeStation' | 'postOffice'

export default function GeographicSettingsView() {
  const [activeTab, setActiveTab] = useState<TabType>('country')
  const [search, setSearch] = useState('')
  
  const [countries, setCountries] = useState<Country[]>(countriesStatic)
  const [divisions, setDivisions] = useState<Division[]>(divisionsStatic)
  const [districts, setDistricts] = useState<District[]>(districtsStatic)
  const [policeStations, setPoliceStations] = useState<PoliceStation[]>(policeStationsStatic)
  const [postOffices, setPostOffices] = useState<PostOffice[]>(postOfficesStatic)

  const [viewItem, setViewItem] = useState<any>(null)
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [editDrawerOpen, setEditDrawerOpen] = useState(false)

  const getCurrentData = () => {
    switch (activeTab) {
      case 'country': return countries
      case 'division': return divisions
      case 'district': return districts
      case 'policeStation': return policeStations
      case 'postOffice': return postOffices
    }
  }

  const filtered = getCurrentData().filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.code.toLowerCase().includes(search.toLowerCase())
  )

  const handleView = (item: any) => {
    setViewItem(item)
    setViewDrawerOpen(true)
  }

  const handleEdit = (item: any) => {
    setEditItem(item)
    setEditDrawerOpen(true)
  }

  const handleSaveEdit = () => {
    if (editItem && DEMO_MODE) {
      alert(showDemoToast(`Updated "${editItem.name}"`))
      setEditDrawerOpen(false)
      setEditItem(null)
    }
  }

  const handleDelete = (item: any) => {
    if (DEMO_MODE) {
      alert(showDemoToast(`Delete "${item.name}"`))
    }
  }

  const handleExport = () => {
    alert(showDemoToast('Export to CSV'))
  }

  const handlePrint = () => {
    alert(showDemoToast('Print'))
  }

  const renderTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-3 text-sm font-medium">Code</th>
            <th className="text-left p-3 text-sm font-medium">Name</th>
            {activeTab !== 'country' && (
              <th className="text-left p-3 text-sm font-medium">Parent</th>
            )}
            <th className="text-left p-3 text-sm font-medium">Status</th>
            <th className="text-right p-3 text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              <td className="p-3 text-sm">{item.code}</td>
              <td className="p-3 text-sm font-medium">{item.name}</td>
              {activeTab !== 'country' && (
                <td className="p-3 text-sm text-gray-600">
                  {activeTab === 'division' && (item as any).countryCode}
                  {activeTab === 'district' && (item as any).divisionCode}
                  {activeTab === 'policeStation' && (item as any).districtCode}
                  {activeTab === 'postOffice' && (item as any).policeStationCode}
                </td>
              )}
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
  )

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
          <span className="text-deep-plum font-medium">Geographic Settings</span>
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
            <MapPin className="w-5 h-5" />
            <span>Geographic Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-b mb-4">
            <div className="flex space-x-1">
              {[
                { key: 'country' as TabType, label: 'Country' },
                { key: 'division' as TabType, label: 'Division' },
                { key: 'district' as TabType, label: 'District' },
                { key: 'policeStation' as TabType, label: 'Police Station' },
                { key: 'postOffice' as TabType, label: 'Post Office' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-deep-plum text-deep-plum'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

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

          {renderTable()}

          <div className="mt-4 text-sm text-gray-600">
            Showing {filtered.length} of {getCurrentData().length} records
          </div>
        </CardContent>
      </Card>

      <Dialog open={viewDrawerOpen} onOpenChange={setViewDrawerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Geographic Details</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">ID</label>
                <p className="text-base mt-1">{viewItem.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Code</label>
                <p className="text-base mt-1">{viewItem.code}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-base mt-1">{viewItem.name}</p>
              </div>
              {viewItem.countryCode && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Country Code</label>
                  <p className="text-base mt-1">{viewItem.countryCode}</p>
                </div>
              )}
              {viewItem.divisionCode && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Division Code</label>
                  <p className="text-base mt-1">{viewItem.divisionCode}</p>
                </div>
              )}
              {viewItem.districtCode && (
                <div>
                  <label className="text-sm font-medium text-gray-600">District Code</label>
                  <p className="text-base mt-1">{viewItem.districtCode}</p>
                </div>
              )}
              {viewItem.policeStationCode && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Police Station Code</label>
                  <p className="text-base mt-1">{viewItem.policeStationCode}</p>
                </div>
              )}
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
            <DialogTitle>Edit Geographic Entry</DialogTitle>
          </DialogHeader>
          {editItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Code</label>
                  <Input
                    value={editItem.code}
                    onChange={(e) => setEditItem({...editItem, code: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <Input
                    value={editItem.name}
                    onChange={(e) => setEditItem({...editItem, name: e.target.value})}
                    className="mt-1"
                  />
                </div>
                {editItem.countryCode !== undefined && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Country Code</label>
                    <Input
                      value={editItem.countryCode}
                      onChange={(e) => setEditItem({...editItem, countryCode: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                )}
                {editItem.divisionCode !== undefined && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Division Code</label>
                    <Input
                      value={editItem.divisionCode}
                      onChange={(e) => setEditItem({...editItem, divisionCode: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                )}
                {editItem.districtCode !== undefined && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">District Code</label>
                    <Input
                      value={editItem.districtCode}
                      onChange={(e) => setEditItem({...editItem, districtCode: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                )}
                {editItem.policeStationCode !== undefined && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Police Station Code</label>
                    <Input
                      value={editItem.policeStationCode}
                      onChange={(e) => setEditItem({...editItem, policeStationCode: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                )}
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
