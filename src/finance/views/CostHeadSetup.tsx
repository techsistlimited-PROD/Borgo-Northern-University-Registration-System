import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { X, Eye, Pencil } from 'lucide-react'
import { Repo } from '@/lib/repo'
import { CostHead } from '../data/types'
import { DEMO_MODE, showDemoToast } from '@/config/demo'
import { costHeadsStatic } from '../data/staticSeeds'

export default function CostHeadSetup() {
  const [costHeads, setCostHeads] = useState<CostHead[]>([])
  const [anyText, setAnyText] = useState('')
  const [codeFilter, setCodeFilter] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [editingCostHead, setEditingCostHead] = useState<CostHead | null>(null)
  const [viewingCostHead, setViewingCostHead] = useState<CostHead | null>(null)

  const [formData, setFormData] = useState({
    code: '',
    serialNo: '',
    name: '',
    isActive: true,
    remarks: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadCostHeads()
    const unsub = Repo.subscribe('finance-cost-heads', loadCostHeads)
    return unsub
  }, [])

  const loadCostHeads = () => {
    // Use static seeds in DEMO_MODE (already has 23 cost heads)
    const data = DEMO_MODE ? costHeadsStatic : Repo.get<CostHead>('finance-cost-heads')
    setCostHeads(data)
  }

  const filteredCostHeads = costHeads.filter(ch => {
    const matchesAnyText = anyText === '' || 
      ch.code.toLowerCase().includes(anyText.toLowerCase()) ||
      ch.name.toLowerCase().includes(anyText.toLowerCase()) ||
      (ch.description || '').toLowerCase().includes(anyText.toLowerCase())
    
    const matchesCode = codeFilter === '' || ch.code.includes(codeFilter)
    const matchesName = nameFilter === '' || ch.name.toLowerCase().includes(nameFilter.toLowerCase())

    return matchesAnyText && matchesCode && matchesName
  })

  const handleSearch = () => {
    // Filter is reactive, this just forces a re-render
    loadCostHeads()
  }

  const handleOpenForm = (costHead?: CostHead) => {
    if (costHead) {
      setEditingCostHead(costHead)
      setFormData({
        code: costHead.code,
        serialNo: costHead.serialNo.toString(),
        name: costHead.name,
        isActive: costHead.status === 'Active',
        remarks: costHead.description || ''
      })
    } else {
      setEditingCostHead(null)
      setFormData({
        code: '',
        serialNo: '',
        name: '',
        isActive: true,
        remarks: ''
      })
    }
    setErrors({})
    setIsFormOpen(true)
  }

  const handleView = (costHead: CostHead) => {
    setViewingCostHead(costHead)
    setIsViewOpen(true)
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.code) {
      newErrors.code = 'Code is required'
    } else {
      const duplicate = costHeads.find(ch => ch.code === formData.code && ch.id !== editingCostHead?.id)
      if (duplicate) {
        newErrors.code = 'Code already exists'
      }
    }

    if (!formData.serialNo) {
      newErrors.serialNo = 'Serial No is required'
    } else if (!/^\d+$/.test(formData.serialNo)) {
      newErrors.serialNo = 'Serial No must be numeric'
    }

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validate()) return

    if (DEMO_MODE) {
      alert(showDemoToast('Create/Edit Cost Head'))
      setIsFormOpen(false)
      return
    }

    const now = new Date().toISOString().split('T')[0]

    if (editingCostHead) {
      Repo.update('finance-cost-heads', editingCostHead.id, {
        code: formData.code,
        serialNo: parseInt(formData.serialNo),
        name: formData.name,
        status: formData.isActive ? 'Active' : 'Inactive',
        description: formData.remarks,
        updatedAt: now
      })
    } else {
      const existingCostHead = costHeads.find(ch => ch.code === formData.code)
      if (existingCostHead) {
        const newCostHead: CostHead = {
          ...existingCostHead,
          code: formData.code,
          serialNo: parseInt(formData.serialNo),
          name: formData.name,
          status: formData.isActive ? 'Active' : 'Inactive',
          description: formData.remarks,
          createdAt: now,
          updatedAt: now
        }
        Repo.update('finance-cost-heads', existingCostHead.id, newCostHead)
      } else {
        const newCostHead: CostHead = {
          id: `ch-${Date.now()}`,
          code: formData.code,
          serialNo: parseInt(formData.serialNo),
          name: formData.name,
          type: 'Others',
          glAccount: '',
          taxable: false,
          status: formData.isActive ? 'Active' : 'Inactive',
          description: formData.remarks,
          createdAt: now,
          updatedAt: now
        }
        Repo.add('finance-cost-heads', newCostHead)
      }
    }

    setIsFormOpen(false)
  }

  // Generate code options (001-999)
  const codeOptions = Array.from({ length: 999 }, (_, i) => {
    const num = i + 1
    return String(num).padStart(3, '0')
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Cost Head</h1>
          <p className="text-sm text-gray-600">Dynamic Cost Head Creation & Management</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleOpenForm()} className="nu-button-primary">
            Create Cost Head
          </Button>
          <Button variant="outline">
            Cost Head List
          </Button>
        </div>
      </div>

      {/* Horizontal Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Any Text</label>
              <Input
                value={anyText}
                onChange={(e) => setAnyText(e.target.value)}
                placeholder="Search by any text"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Code</label>
              <Input
                value={codeFilter}
                onChange={(e) => setCodeFilter(e.target.value)}
                placeholder="Search by code"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                placeholder="Search by name"
              />
            </div>
            <Button onClick={handleSearch} className="nu-button-primary">
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cost Head List Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Head List ({filteredCostHeads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">code</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Serial Number</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Name</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Is Active</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Remarks</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCostHeads.map((ch) => (
                  <tr key={ch.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm">{ch.code}</td>
                    <td className="p-3 text-sm">{ch.serialNo}</td>
                    <td className="p-3 text-sm">{ch.name}</td>
                    <td className="p-3 text-sm">{ch.status === 'Active' ? 'Yes' : 'No'}</td>
                    <td className="p-3 text-sm text-gray-600">{ch.description || ''}</td>
                    <td className="p-3">
                      <div className="flex justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(ch)}
                          title="View"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenForm(ch)}
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4 text-amber-600" />
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

      {/* Create/Edit Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{editingCostHead ? 'Edit Cost Head' : 'Create Cost Head'}</DialogTitle>
              <button onClick={() => setIsFormOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">Code *</label>
              <select
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select code</option>
                {codeOptions.map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
              {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Serial No *</label>
              <Input
                type="number"
                value={formData.serialNo}
                onChange={(e) => setFormData({ ...formData, serialNo: e.target.value })}
                placeholder="Enter serial number"
                className={errors.serialNo ? 'border-red-500' : ''}
              />
              {errors.serialNo && <p className="text-red-500 text-xs mt-1">{errors.serialNo}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Name (Cost Head Name) *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter the name of the cost head"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-sm font-medium">Is Active</label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Remarks</label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
                placeholder="Optional notes or description"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} className="nu-button-primary">Create</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Modal (shows additional fields) */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>View Cost Head</DialogTitle>
              <button onClick={() => setIsViewOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogHeader>

          {viewingCostHead && (
            <div className="space-y-3 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Code</label>
                  <p className="text-sm mt-1">{viewingCostHead.code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Serial Number</label>
                  <p className="text-sm mt-1">{viewingCostHead.serialNo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-sm mt-1">{viewingCostHead.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Is Active</label>
                  <p className="text-sm mt-1">{viewingCostHead.status === 'Active' ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Type</label>
                  <p className="text-sm mt-1">{viewingCostHead.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">GL Account</label>
                  <p className="text-sm mt-1">{viewingCostHead.glAccount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Taxable</label>
                  <p className="text-sm mt-1">{viewingCostHead.taxable ? 'Yes' : 'No'}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600">Remarks</label>
                  <p className="text-sm mt-1">{viewingCostHead.description || '—'}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button onClick={() => setIsViewOpen(false)}>Close</Button>
                <Button 
                  onClick={() => {
                    setIsViewOpen(false)
                    handleOpenForm(viewingCostHead)
                  }} 
                  className="nu-button-primary"
                >
                  Edit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
