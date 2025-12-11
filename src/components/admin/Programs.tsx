import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Edit, Trash2, Filter } from 'lucide-react'
import { PROGRAMS, DEPARTMENTS } from '@/lib/seedData'

interface Program {
  code: string
  name: string
  level: string
  duration: number
  durationUnit: string
  totalCredits: number
  deptCode: string
  status?: 'Active' | 'Inactive'
}

export default function Programs() {
  const [programs, setPrograms] = useState<Program[]>(
    PROGRAMS.map(p => ({ ...p, status: 'Active' as const }))
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [filterLevel, setFilterLevel] = useState('All')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [formData, setFormData] = useState<Program>({
    code: '',
    name: '',
    level: 'Undergraduate',
    duration: 8,
    durationUnit: 'Semester',
    totalCredits: 120,
    deptCode: '',
    status: 'Active'
  })

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         program.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = filterLevel === 'All' || program.level === filterLevel
    return matchesSearch && matchesLevel
  })

  const handleAdd = () => {
    setPrograms([...programs, { ...formData }])
    setShowAddDialog(false)
    resetForm()
  }

  const handleEdit = () => {
    setPrograms(programs.map(p => p.code === selectedProgram?.code ? { ...formData } : p))
    setShowEditDialog(false)
    resetForm()
  }

  const handleDelete = (code: string) => {
    if (confirm('Are you sure you want to delete this program?')) {
      setPrograms(programs.filter(p => p.code !== code))
    }
  }

  const handleToggleStatus = (code: string) => {
    setPrograms(programs.map(p => 
      p.code === code ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p
    ))
  }

  const openEditDialog = (program: Program) => {
    setSelectedProgram(program)
    setFormData(program)
    setShowEditDialog(true)
  }

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      level: 'Undergraduate',
      duration: 8,
      durationUnit: 'Semester',
      totalCredits: 120,
      deptCode: '',
      status: 'Active'
    })
    setSelectedProgram(null)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Programs</h1>
          <p className="text-gray-600 text-sm mt-1">Manage academic programs and degree offerings</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-deep-plum hover:bg-deep-plum/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Program
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by program name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="p-2 border rounded-md text-sm"
            >
              <option>All</option>
              <option>Undergraduate</option>
              <option>Graduate</option>
              <option>Diploma</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Code</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Program Name</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Level</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Duration</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Credits</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Department</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrograms.map((program) => (
                <tr key={program.code} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-sm font-medium text-deep-plum">{program.code}</td>
                  <td className="p-4 text-sm">{program.name}</td>
                  <td className="p-4 text-sm">{program.level}</td>
                  <td className="p-4 text-sm">{program.duration} {program.durationUnit}s</td>
                  <td className="p-4 text-sm">{program.totalCredits}</td>
                  <td className="p-4 text-sm">
                    <Badge variant="outline">{program.deptCode}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge 
                      variant={program.status === 'Active' ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => handleToggleStatus(program.code)}
                    >
                      {program.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(program)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(program.code)}
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
        
        {filteredPrograms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No programs found</p>
          </div>
        )}
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Program</DialogTitle>
            <DialogDescription>Enter the details for the new academic program</DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Program Code</label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g., CSE, BBA"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Department Code</label>
              <select
                value={formData.deptCode}
                onChange={(e) => setFormData({ ...formData, deptCode: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept.code} value={dept.code}>{dept.name}</option>
                ))}
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Program Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., BSc in Computer Science & Engineering"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option>Undergraduate</option>
                <option>Graduate</option>
                <option>Diploma</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Duration Unit</label>
              <select
                value={formData.durationUnit}
                onChange={(e) => setFormData({ ...formData, durationUnit: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option>Semester</option>
                <option>Trimester</option>
                <option>Year</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Duration</label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                placeholder="e.g., 8"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Total Credits</label>
              <Input
                type="number"
                value={formData.totalCredits}
                onChange={(e) => setFormData({ ...formData, totalCredits: parseInt(e.target.value) || 0 })}
                placeholder="e.g., 120"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddDialog(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleAdd} className="bg-deep-plum hover:bg-deep-plum/90">
              Add Program
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Program</DialogTitle>
            <DialogDescription>Update the program details</DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Program Code</label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                disabled
                className="bg-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Department Code</label>
              <select
                value={formData.deptCode}
                onChange={(e) => setFormData({ ...formData, deptCode: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                {DEPARTMENTS.map(dept => (
                  <option key={dept.code} value={dept.code}>{dept.name}</option>
                ))}
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Program Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option>Undergraduate</option>
                <option>Graduate</option>
                <option>Diploma</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Duration Unit</label>
              <select
                value={formData.durationUnit}
                onChange={(e) => setFormData({ ...formData, durationUnit: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option>Semester</option>
                <option>Trimester</option>
                <option>Year</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Duration</label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Total Credits</label>
              <Input
                type="number"
                value={formData.totalCredits}
                onChange={(e) => setFormData({ ...formData, totalCredits: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowEditDialog(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleEdit} className="bg-deep-plum hover:bg-deep-plum/90">
              Update Program
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
