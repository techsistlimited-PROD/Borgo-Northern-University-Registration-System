import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Trash2, MapPin } from 'lucide-react'
import { CAMPUSES, PROGRAMS } from '@/lib/seedData'
import { Checkbox } from '@/components/ui/checkbox'

interface CampusProgramMap {
  id: string
  campusCode: string
  campusName: string
  programCode: string
  programName: string
  effectiveFrom: string
  capacity: number
  status: 'Active' | 'Inactive'
}

export default function CampusProgramMapping() {
  const [mappings, setMappings] = useState<CampusProgramMap[]>([
    { id: '1', campusCode: 'BAN', campusName: 'Banani Campus', programCode: 'BBA', programName: 'BBA in Accounting & Finance', effectiveFrom: '2020-01-01', capacity: 120, status: 'Active' },
    { id: '2', campusCode: 'BAN', campusName: 'Banani Campus', programCode: 'MBA', programName: 'MBA in Marketing', effectiveFrom: '2021-09-01', capacity: 60, status: 'Active' },
    { id: '3', campusCode: 'PRM', campusName: 'Permanent Campus', programCode: 'CSE', programName: 'BSc in Computer Science & Engg.', effectiveFrom: '2019-01-01', capacity: 200, status: 'Active' },
    { id: '4', campusCode: 'PRM', campusName: 'Permanent Campus', programCode: 'BBA', programName: 'BBA in Accounting & Finance', effectiveFrom: '2019-01-01', capacity: 150, status: 'Active' },
    { id: '5', campusCode: 'DHM', campusName: 'Dhanmondi Campus', programCode: 'LLB', programName: 'LLB (Hons)', effectiveFrom: '2020-09-01', capacity: 80, status: 'Active' }
  ])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCampus, setFilterCampus] = useState('All')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showBulkDialog, setShowBulkDialog] = useState(false)
  const [formData, setFormData] = useState({
    campusCode: '',
    programCode: '',
    effectiveFrom: new Date().toISOString().split('T')[0],
    capacity: 100
  })
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([])

  const filteredMappings = mappings.filter(mapping => {
    const matchesSearch = mapping.campusName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mapping.programName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCampus = filterCampus === 'All' || mapping.campusCode === filterCampus
    return matchesSearch && matchesCampus
  })

  const handleAdd = () => {
    const campus = CAMPUSES.find(c => c.code === formData.campusCode)
    const program = PROGRAMS.find(p => p.code === formData.programCode)
    
    if (campus && program) {
      const newMapping: CampusProgramMap = {
        id: String(mappings.length + 1),
        campusCode: campus.code,
        campusName: campus.name,
        programCode: program.code,
        programName: program.name,
        effectiveFrom: formData.effectiveFrom,
        capacity: formData.capacity,
        status: 'Active'
      }
      setMappings([...mappings, newMapping])
      setShowAddDialog(false)
      resetForm()
    }
  }

  const handleBulkAdd = () => {
    const campus = CAMPUSES.find(c => c.code === formData.campusCode)
    
    if (campus && selectedPrograms.length > 0) {
      const newMappings = selectedPrograms.map((programCode, idx) => {
        const program = PROGRAMS.find(p => p.code === programCode)!
        return {
          id: String(mappings.length + idx + 1),
          campusCode: campus.code,
          campusName: campus.name,
          programCode: program.code,
          programName: program.name,
          effectiveFrom: formData.effectiveFrom,
          capacity: formData.capacity,
          status: 'Active' as const
        }
      })
      setMappings([...mappings, ...newMappings])
      setShowBulkDialog(false)
      setSelectedPrograms([])
      resetForm()
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this mapping?')) {
      setMappings(mappings.filter(m => m.id !== id))
    }
  }

  const handleToggleStatus = (id: string) => {
    setMappings(mappings.map(m => 
      m.id === id ? { ...m, status: m.status === 'Active' ? 'Inactive' : 'Active' } : m
    ))
  }

  const resetForm = () => {
    setFormData({
      campusCode: '',
      programCode: '',
      effectiveFrom: new Date().toISOString().split('T')[0],
      capacity: 100
    })
  }

  const toggleProgramSelection = (programCode: string) => {
    if (selectedPrograms.includes(programCode)) {
      setSelectedPrograms(selectedPrograms.filter(p => p !== programCode))
    } else {
      setSelectedPrograms([...selectedPrograms, programCode])
    }
  }

  const groupedMappings = filteredMappings.reduce((acc, mapping) => {
    if (!acc[mapping.campusCode]) {
      acc[mapping.campusCode] = {
        campusName: mapping.campusName,
        programs: []
      }
    }
    acc[mapping.campusCode].programs.push(mapping)
    return acc
  }, {} as Record<string, { campusName: string; programs: CampusProgramMap[] }>)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Campus ↔ Program Mapping</h1>
          <p className="text-gray-600 text-sm mt-1">Define which programs are offered at each campus</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowBulkDialog(true)} variant="outline">
            <MapPin className="w-4 h-4 mr-2" />
            Bulk Map
          </Button>
          <Button onClick={() => setShowAddDialog(true)} className="bg-deep-plum hover:bg-deep-plum/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Mapping
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by campus or program..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterCampus}
            onChange={(e) => setFilterCampus(e.target.value)}
            className="p-2 border rounded-md text-sm"
          >
            <option>All</option>
            {CAMPUSES.map(campus => (
              <option key={campus.code} value={campus.code}>{campus.name}</option>
            ))}
          </select>
        </div>
      </Card>

      <div className="space-y-4">
        {Object.entries(groupedMappings).map(([campusCode, data]) => (
          <Card key={campusCode}>
            <div className="p-4 bg-gray-50 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-deep-plum" />
                  <h3 className="font-semibold text-deep-plum">{data.campusName}</h3>
                  <Badge variant="outline">{data.programs.length} Programs</Badge>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white border-b">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Program Code</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Program Name</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Effective From</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Capacity</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.programs.map((mapping) => (
                    <tr key={mapping.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 text-sm font-medium text-deep-plum">{mapping.programCode}</td>
                      <td className="p-4 text-sm">{mapping.programName}</td>
                      <td className="p-4 text-sm">{new Date(mapping.effectiveFrom).toLocaleDateString()}</td>
                      <td className="p-4 text-sm">{mapping.capacity} students</td>
                      <td className="p-4">
                        <Badge 
                          variant={mapping.status === 'Active' ? 'default' : 'secondary'}
                          className="cursor-pointer"
                          onClick={() => handleToggleStatus(mapping.id)}
                        >
                          {mapping.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(mapping.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))}
      </div>

      {filteredMappings.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <p className="text-gray-500">No campus-program mappings found</p>
          </div>
        </Card>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Campus-Program Mapping</DialogTitle>
            <DialogDescription>Map a program to a campus location</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Campus</label>
              <select
                value={formData.campusCode}
                onChange={(e) => setFormData({ ...formData, campusCode: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Campus</option>
                {CAMPUSES.map(campus => (
                  <option key={campus.code} value={campus.code}>{campus.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Program</label>
              <select
                value={formData.programCode}
                onChange={(e) => setFormData({ ...formData, programCode: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Program</option>
                {PROGRAMS.map(program => (
                  <option key={program.code} value={program.code}>
                    {program.code} - {program.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Effective From</label>
              <Input
                type="date"
                value={formData.effectiveFrom}
                onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Capacity (Students)</label>
              <Input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                placeholder="100"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddDialog(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleAdd} className="bg-deep-plum hover:bg-deep-plum/90">
              Add Mapping
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Campus-Program Mapping</DialogTitle>
            <DialogDescription>Map multiple programs to a campus at once</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Campus</label>
              <select
                value={formData.campusCode}
                onChange={(e) => setFormData({ ...formData, campusCode: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Campus</option>
                {CAMPUSES.map(campus => (
                  <option key={campus.code} value={campus.code}>{campus.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Select Programs</label>
              <div className="border rounded-md p-4 space-y-2 max-h-60 overflow-y-auto">
                {PROGRAMS.map(program => (
                  <div key={program.code} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedPrograms.includes(program.code)}
                      onCheckedChange={() => toggleProgramSelection(program.code)}
                    />
                    <label className="text-sm cursor-pointer">
                      <span className="font-medium">{program.code}</span> - {program.name}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">{selectedPrograms.length} programs selected</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Effective From</label>
                <Input
                  type="date"
                  value={formData.effectiveFrom}
                  onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Default Capacity</label>
                <Input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  placeholder="100"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowBulkDialog(false); setSelectedPrograms([]); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleBulkAdd} className="bg-deep-plum hover:bg-deep-plum/90">
              Map {selectedPrograms.length} Programs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
