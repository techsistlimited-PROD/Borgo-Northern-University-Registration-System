import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Edit, Trash2, Building } from 'lucide-react'

interface Institute {
  id: string
  code: string
  name: string
  type: 'University' | 'College' | 'School' | 'Training Center' | 'Professional Body'
  country: string
  city: string
  recognizedBy: string
  status: 'Verified' | 'Pending' | 'Unverified'
}

export default function ExternalInstitutes() {
  const [institutes, setInstitutes] = useState<Institute[]>([
    { id: '1', code: 'DU', name: 'University of Dhaka', type: 'University', country: 'Bangladesh', city: 'Dhaka', recognizedBy: 'UGC Bangladesh', status: 'Verified' },
    { id: '2', code: 'BUET', name: 'Bangladesh University of Engineering & Technology', type: 'University', country: 'Bangladesh', city: 'Dhaka', recognizedBy: 'UGC Bangladesh', status: 'Verified' },
    { id: '3', code: 'NDC', name: 'Notre Dame College', type: 'College', country: 'Bangladesh', city: 'Dhaka', recognizedBy: 'Education Board', status: 'Verified' },
    { id: '4', code: 'MIT', name: 'Massachusetts Institute of Technology', type: 'University', country: 'USA', city: 'Cambridge', recognizedBy: 'ABET', status: 'Verified' },
    { id: '5', code: 'ICAB', name: 'Institute of Chartered Accountants of Bangladesh', type: 'Professional Body', country: 'Bangladesh', city: 'Dhaka', recognizedBy: 'Government of Bangladesh', status: 'Verified' }
  ])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [filterCountry, setFilterCountry] = useState('All')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null)
  const [formData, setFormData] = useState<Omit<Institute, 'id'>>({
    code: '',
    name: '',
    type: 'University',
    country: 'Bangladesh',
    city: '',
    recognizedBy: '',
    status: 'Pending'
  })

  const filteredInstitutes = institutes.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inst.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'All' || inst.type === filterType
    const matchesCountry = filterCountry === 'All' || inst.country === filterCountry
    return matchesSearch && matchesType && matchesCountry
  })

  const countries = [...new Set(institutes.map(i => i.country))]

  const handleAdd = () => {
    const newInstitute: Institute = {
      id: String(institutes.length + 1),
      ...formData
    }
    setInstitutes([...institutes, newInstitute])
    setShowAddDialog(false)
    resetForm()
  }

  const handleEdit = () => {
    setInstitutes(institutes.map(i => i.id === selectedInstitute?.id ? { ...selectedInstitute, ...formData } : i))
    setShowEditDialog(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this institute?')) {
      setInstitutes(institutes.filter(i => i.id !== id))
    }
  }

  const openEditDialog = (institute: Institute) => {
    setSelectedInstitute(institute)
    setFormData({
      code: institute.code,
      name: institute.name,
      type: institute.type,
      country: institute.country,
      city: institute.city,
      recognizedBy: institute.recognizedBy,
      status: institute.status
    })
    setShowEditDialog(true)
  }

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      type: 'University',
      country: 'Bangladesh',
      city: '',
      recognizedBy: '',
      status: 'Pending'
    })
    setSelectedInstitute(null)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">External Institutes</h1>
          <p className="text-gray-600 text-sm mt-1">Manage external educational institutions</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-deep-plum hover:bg-deep-plum/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Institute
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by institute name or code..."
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
            <option>University</option>
            <option>College</option>
            <option>School</option>
            <option>Training Center</option>
            <option>Professional Body</option>
          </select>
          <select
            value={filterCountry}
            onChange={(e) => setFilterCountry(e.target.value)}
            className="p-2 border rounded-md text-sm"
          >
            <option>All</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Code</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Institute Name</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Type</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Location</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Recognized By</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInstitutes.map((institute) => (
                <tr key={institute.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-sm font-medium text-deep-plum">{institute.code}</td>
                  <td className="p-4 text-sm">{institute.name}</td>
                  <td className="p-4">
                    <Badge variant="outline">{institute.type}</Badge>
                  </td>
                  <td className="p-4 text-sm">
                    {institute.city}, {institute.country}
                  </td>
                  <td className="p-4 text-sm text-gray-600">{institute.recognizedBy}</td>
                  <td className="p-4">
                    <Badge variant={institute.status === 'Verified' ? 'default' : 'secondary'}>
                      {institute.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(institute)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(institute.id)}
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

        {filteredInstitutes.length === 0 && (
          <div className="text-center py-12">
            <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No institutes found</p>
          </div>
        )}
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add External Institute</DialogTitle>
            <DialogDescription>Add a new external educational institution</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Institute Code</label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g., DU, BUET"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Institute Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Institute['type'] })}
                className="w-full p-2 border rounded-md"
              >
                <option>University</option>
                <option>College</option>
                <option>School</option>
                <option>Training Center</option>
                <option>Professional Body</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Institute Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., University of Dhaka"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <Input
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="e.g., Bangladesh"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g., Dhaka"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Recognized By</label>
              <Input
                value={formData.recognizedBy}
                onChange={(e) => setFormData({ ...formData, recognizedBy: e.target.value })}
                placeholder="e.g., UGC Bangladesh"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Institute['status'] })}
                className="w-full p-2 border rounded-md"
              >
                <option>Verified</option>
                <option>Pending</option>
                <option>Unverified</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddDialog(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleAdd} className="bg-deep-plum hover:bg-deep-plum/90">
              Add Institute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit External Institute</DialogTitle>
            <DialogDescription>Update institute details</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Institute Code</label>
              <Input
                value={formData.code}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Institute Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Institute['type'] })}
                className="w-full p-2 border rounded-md"
              >
                <option>University</option>
                <option>College</option>
                <option>School</option>
                <option>Training Center</option>
                <option>Professional Body</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Institute Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <Input
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Recognized By</label>
              <Input
                value={formData.recognizedBy}
                onChange={(e) => setFormData({ ...formData, recognizedBy: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Institute['status'] })}
                className="w-full p-2 border rounded-md"
              >
                <option>Verified</option>
                <option>Pending</option>
                <option>Unverified</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowEditDialog(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleEdit} className="bg-deep-plum hover:bg-deep-plum/90">
              Update Institute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
