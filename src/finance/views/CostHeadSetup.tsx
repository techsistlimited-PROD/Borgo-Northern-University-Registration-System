import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Edit, Trash2, X } from 'lucide-react'
import { Repo } from '@/lib/repo'
import { CostHead, CostHeadType, CostHeadStatus } from '../data/types'

export default function CostHeadSetup() {
  const [costHeads, setCostHeads] = useState<CostHead[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCostHead, setEditingCostHead] = useState<CostHead | null>(null)
  const [formData, setFormData] = useState<Partial<CostHead>>({
    code: '',
    name: '',
    type: 'Tuition',
    glAccount: '',
    taxable: false,
    status: 'Active',
    description: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadCostHeads()
    const unsub = Repo.subscribe('finance-cost-heads', loadCostHeads)
    return unsub
  }, [])

  const loadCostHeads = () => {
    const data = Repo.get<CostHead>('finance-cost-heads')
    setCostHeads(data)
  }

  const filteredCostHeads = costHeads.filter(ch =>
    ch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ch.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.code?.trim()) {
      newErrors.code = 'Code is required'
    } else if (!/^[A-Z_]+$/.test(formData.code)) {
      newErrors.code = 'Code must be UPPER_SNAKE_CASE'
    } else {
      const duplicate = costHeads.find(ch => ch.code === formData.code && ch.id !== editingCostHead?.id)
      if (duplicate) {
        newErrors.code = 'Code already exists'
      }
    }

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.type) {
      newErrors.type = 'Type is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleOpenDialog = (costHead?: CostHead) => {
    if (costHead) {
      setEditingCostHead(costHead)
      setFormData(costHead)
    } else {
      setEditingCostHead(null)
      setFormData({
        code: '',
        name: '',
        type: 'Tuition',
        glAccount: '',
        taxable: false,
        status: 'Active',
        description: ''
      })
    }
    setErrors({})
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingCostHead(null)
    setFormData({})
    setErrors({})
  }

  const handleSave = () => {
    if (!validate()) return

    const now = new Date().toISOString().split('T')[0]

    if (editingCostHead) {
      Repo.update('finance-cost-heads', editingCostHead.id, {
        ...formData,
        updatedAt: now
      })
    } else {
      const newCostHead: CostHead = {
        id: `ch-${Date.now()}`,
        code: formData.code!,
        name: formData.name!,
        type: formData.type!,
        glAccount: formData.glAccount || '',
        taxable: formData.taxable || false,
        status: formData.status || 'Active',
        description: formData.description,
        createdAt: now,
        updatedAt: now
      }
      Repo.add('finance-cost-heads', newCostHead)
    }

    handleCloseDialog()
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to deactivate this cost head?')) {
      Repo.update('finance-cost-heads', id, { status: 'Inactive' })
    }
  }

  const toggleStatus = (costHead: CostHead) => {
    const newStatus: CostHeadStatus = costHead.status === 'Active' ? 'Inactive' : 'Active'
    Repo.update('finance-cost-heads', costHead.id, { status: newStatus })
  }

  const costHeadTypes: CostHeadType[] = ['Admission', 'Tuition', 'Registration', 'Lab', 'Library', 'Exam', 'Penalty', 'Others']

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Cost Head Setup</h1>
          <p className="text-sm text-gray-600">Manage fee cost heads (types of charges)</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="nu-button-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Cost Head
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Cost Heads ({filteredCostHeads.length})</CardTitle>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by code, name, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Code</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Name</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Type</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">GL Account</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Taxable</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCostHeads.map((ch) => (
                  <tr key={ch.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-mono">{ch.code}</td>
                    <td className="p-3 text-sm font-medium">{ch.name}</td>
                    <td className="p-3 text-sm">
                      <Badge variant="outline">{ch.type}</Badge>
                    </td>
                    <td className="p-3 text-sm">{ch.glAccount}</td>
                    <td className="p-3 text-sm">{ch.taxable ? 'Yes' : 'No'}</td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleStatus(ch)}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          ch.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {ch.status}
                      </button>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(ch)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(ch.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCostHead ? 'Edit Cost Head' : 'New Cost Head'}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">Code *</label>
              <Input
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="UPPER_SNAKE_CASE"
                className={errors.code ? 'border-red-500' : ''}
              />
              {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Display name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type *</label>
              <select
                value={formData.type || 'Tuition'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as CostHeadType })}
                className="w-full px-3 py-2 border rounded-md"
              >
                {costHeadTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">GL Account</label>
              <Input
                value={formData.glAccount || ''}
                onChange={(e) => setFormData({ ...formData, glAccount: e.target.value })}
                placeholder="e.g., 4010"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="taxable"
                checked={formData.taxable || false}
                onChange={(e) => setFormData({ ...formData, taxable: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="taxable" className="text-sm font-medium">Taxable</label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={formData.status || 'Active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as CostHeadStatus })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Description (optional)</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
                placeholder="Optional notes..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSave} className="nu-button-primary">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
