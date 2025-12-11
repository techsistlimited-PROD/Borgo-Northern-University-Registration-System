import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Edit, Trash2, MapPin } from 'lucide-react'

interface Location {
  id: string
  type: 'Division' | 'District' | 'Upazila' | 'Union'
  code: string
  name: string
  parentCode?: string
  parentName?: string
}

export default function LocationDirectory() {
  const [locations, setLocations] = useState<Location[]>([
    { id: '1', type: 'Division', code: 'DHA', name: 'Dhaka Division' },
    { id: '2', type: 'District', code: 'DHA-DHK', name: 'Dhaka District', parentCode: 'DHA', parentName: 'Dhaka Division' },
    { id: '3', type: 'District', code: 'DHA-GAZ', name: 'Gazipur District', parentCode: 'DHA', parentName: 'Dhaka Division' },
    { id: '4', type: 'Upazila', code: 'DHA-DHK-DHM', name: 'Dhanmondi', parentCode: 'DHA-DHK', parentName: 'Dhaka District' },
    { id: '5', type: 'Division', code: 'CHI', name: 'Chittagong Division' },
    { id: '6', type: 'District', code: 'CHI-CHT', name: 'Chittagong District', parentCode: 'CHI', parentName: 'Chittagong Division' }
  ])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [formData, setFormData] = useState<Omit<Location, 'id'>>({
    type: 'Division',
    code: '',
    name: '',
    parentCode: '',
    parentName: ''
  })

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'All' || location.type === filterType
    return matchesSearch && matchesType
  })

  const handleAdd = () => {
    const newLocation: Location = {
      id: String(locations.length + 1),
      ...formData
    }
    setLocations([...locations, newLocation])
    setShowAddDialog(false)
    resetForm()
  }

  const handleEdit = () => {
    setLocations(locations.map(l => l.id === selectedLocation?.id ? { ...selectedLocation, ...formData } : l))
    setShowEditDialog(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this location?')) {
      setLocations(locations.filter(l => l.id !== id))
    }
  }

  const openEditDialog = (location: Location) => {
    setSelectedLocation(location)
    setFormData({
      type: location.type,
      code: location.code,
      name: location.name,
      parentCode: location.parentCode,
      parentName: location.parentName
    })
    setShowEditDialog(true)
  }

  const resetForm = () => {
    setFormData({
      type: 'Division',
      code: '',
      name: '',
      parentCode: '',
      parentName: ''
    })
    setSelectedLocation(null)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Location Directory</h1>
          <p className="text-gray-600 text-sm mt-1">Manage geographical locations for addresses</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-deep-plum hover:bg-deep-plum/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by location name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2 border rounded-md text-sm"
          >
            <option>All</option>
            <option>Division</option>
            <option>District</option>
            <option>Upazila</option>
            <option>Union</option>
          </select>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Type</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Code</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Parent Location</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLocations.map((location) => (
                <tr key={location.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <Badge variant="outline">{location.type}</Badge>
                  </td>
                  <td className="p-4 text-sm font-medium text-deep-plum">{location.code}</td>
                  <td className="p-4 text-sm">{location.name}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {location.parentName || '-'}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(location)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(location.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No locations found</p>
          </div>
        )}
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Location</DialogTitle>
            <DialogDescription>Add a new geographical location</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Location['type'] })}
                className="w-full p-2 border rounded-md"
              >
                <option>Division</option>
                <option>District</option>
                <option>Upazila</option>
                <option>Union</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location Code</label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g., DHA, DHA-DHK"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Dhaka Division"
              />
            </div>

            {formData.type !== 'Division' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Parent Code (Optional)</label>
                  <Input
                    value={formData.parentCode}
                    onChange={(e) => setFormData({ ...formData, parentCode: e.target.value })}
                    placeholder="e.g., DHA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Parent Name (Optional)</label>
                  <Input
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="e.g., Dhaka Division"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddDialog(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleAdd} className="bg-deep-plum hover:bg-deep-plum/90">
              Add Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogDescription>Update location details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Location['type'] })}
                className="w-full p-2 border rounded-md"
              >
                <option>Division</option>
                <option>District</option>
                <option>Upazila</option>
                <option>Union</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location Code</label>
              <Input
                value={formData.code}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {formData.type !== 'Division' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Parent Code (Optional)</label>
                  <Input
                    value={formData.parentCode}
                    onChange={(e) => setFormData({ ...formData, parentCode: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Parent Name (Optional)</label>
                  <Input
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowEditDialog(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleEdit} className="bg-deep-plum hover:bg-deep-plum/90">
              Update Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
