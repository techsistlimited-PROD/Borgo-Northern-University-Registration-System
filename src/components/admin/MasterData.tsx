import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Database } from 'lucide-react'

interface MasterDataEntry {
  id: string
  category: string
  code: string
  value: string
  description: string
  status: 'Active' | 'Inactive'
}

export default function MasterData() {
  const [activeCategory, setActiveCategory] = useState('Nationality')
  const [data, setData] = useState<MasterDataEntry[]>([
    { id: '1', category: 'Nationality', code: 'BD', value: 'Bangladeshi', description: 'Bangladesh citizen', status: 'Active' },
    { id: '2', category: 'Nationality', code: 'IN', value: 'Indian', description: 'India citizen', status: 'Active' },
    { id: '3', category: 'Religion', code: 'ISL', value: 'Islam', description: 'Islamic faith', status: 'Active' },
    { id: '4', category: 'Religion', code: 'HIN', value: 'Hinduism', description: 'Hindu faith', status: 'Active' },
    { id: '5', category: 'Religion', code: 'CHR', value: 'Christianity', description: 'Christian faith', status: 'Active' },
    { id: '6', category: 'Blood Group', code: 'A+', value: 'A Positive', description: 'A+ blood type', status: 'Active' },
    { id: '7', category: 'Blood Group', code: 'O+', value: 'O Positive', description: 'O+ blood type', status: 'Active' },
    { id: '8', category: 'Gender', code: 'M', value: 'Male', description: 'Male gender', status: 'Active' },
    { id: '9', category: 'Gender', code: 'F', value: 'Female', description: 'Female gender', status: 'Active' },
    { id: '10', category: 'Marital Status', code: 'S', value: 'Single', description: 'Not married', status: 'Active' },
    { id: '11', category: 'Marital Status', code: 'M', value: 'Married', description: 'Married', status: 'Active' }
  ])
  const [showDialog, setShowDialog] = useState(false)
  const [editingEntry, setEditingEntry] = useState<MasterDataEntry | null>(null)
  const [formData, setFormData] = useState({
    category: '',
    code: '',
    value: '',
    description: ''
  })

  const categories = ['Nationality', 'Religion', 'Blood Group', 'Gender', 'Marital Status', 'Document Type', 'Contact Type']

  const filteredData = data.filter(entry => entry.category === activeCategory)

  const handleSave = () => {
    if (editingEntry) {
      setData(data.map(d => d.id === editingEntry.id ? { ...editingEntry, ...formData } : d))
    } else {
      const newEntry: MasterDataEntry = {
        id: String(data.length + 1),
        ...formData,
        status: 'Active'
      }
      setData([...data, newEntry])
    }
    setShowDialog(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      setData(data.filter(d => d.id !== id))
    }
  }

  const openEditDialog = (entry: MasterDataEntry) => {
    setEditingEntry(entry)
    setFormData({
      category: entry.category,
      code: entry.code,
      value: entry.value,
      description: entry.description
    })
    setShowDialog(true)
  }

  const openAddDialog = () => {
    setFormData({
      ...formData,
      category: activeCategory
    })
    setShowDialog(true)
  }

  const resetForm = () => {
    setFormData({
      category: '',
      code: '',
      value: '',
      description: ''
    })
    setEditingEntry(null)
  }

  const handleToggleStatus = (id: string) => {
    setData(data.map(d => 
      d.id === id ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' } : d
    ))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Master Data Management</h1>
          <p className="text-gray-600 text-sm mt-1">Manage system-wide reference data</p>
        </div>
        <Button onClick={openAddDialog} className="bg-deep-plum hover:bg-deep-plum/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Entry
        </Button>
      </div>

      <div className="flex space-x-2 border-b overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 font-medium whitespace-nowrap ${activeCategory === category ? 'text-deep-plum border-b-2 border-deep-plum' : 'text-gray-500'}`}
          >
            {category}
          </button>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Code</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Value</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Description</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((entry) => (
                <tr key={entry.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-sm font-medium text-deep-plum">{entry.code}</td>
                  <td className="p-4 text-sm">{entry.value}</td>
                  <td className="p-4 text-sm text-gray-600">{entry.description}</td>
                  <td className="p-4">
                    <Badge 
                      variant={entry.status === 'Active' ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => handleToggleStatus(entry.id)}
                    >
                      {entry.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(entry)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(entry.id)}
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

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Database className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No data found for {activeCategory}</p>
          </div>
        )}
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEntry ? 'Edit Entry' : 'Add New Entry'}</DialogTitle>
            <DialogDescription>Manage master data entry for {activeCategory}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Code</label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g., BD, ISL, A+"
                disabled={!!editingEntry}
                className={editingEntry ? 'bg-gray-100' : ''}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Value</label>
              <Input
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="e.g., Bangladeshi, Islam"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDialog(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-deep-plum hover:bg-deep-plum/90">
              {editingEntry ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
