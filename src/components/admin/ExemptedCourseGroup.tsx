import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Trash2, ShieldCheck } from 'lucide-react'
import { PROGRAMS, COURSES } from '@/lib/seedData'

interface ExemptedGroup {
  id: string
  name: string
  program: string
  description: string
  exemptionType: 'Transfer' | 'Prior Learning' | 'Competency Test' | 'Professional'
  maxCreditExemption: number
  courses: string[]
  status: 'Active' | 'Inactive'
}

export default function ExemptedCourseGroup() {
  const [groups, setGroups] = useState<ExemptedGroup[]>([
    { 
      id: '1', 
      name: 'Transfer Student Exemptions', 
      program: 'CSE', 
      description: 'Courses that can be exempted for transfer students', 
      exemptionType: 'Transfer',
      maxCreditExemption: 30,
      courses: ['CSE1101'],
      status: 'Active'
    },
    { 
      id: '2', 
      name: 'Professional Certification Exemptions', 
      program: 'BBA', 
      description: 'Courses exempted based on professional certifications', 
      exemptionType: 'Professional',
      maxCreditExemption: 12,
      courses: ['BUS1302'],
      status: 'Active'
    }
  ])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterProgram, setFilterProgram] = useState('All')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    program: '',
    description: '',
    exemptionType: 'Transfer' as ExemptedGroup['exemptionType'],
    maxCreditExemption: 30,
    courses: [] as string[]
  })

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProgram = filterProgram === 'All' || group.program === filterProgram
    return matchesSearch && matchesProgram
  })

  const handleAdd = () => {
    const newGroup: ExemptedGroup = {
      id: String(groups.length + 1),
      ...formData,
      status: 'Active'
    }
    setGroups([...groups, newGroup])
    setShowAddDialog(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this exemption group?')) {
      setGroups(groups.filter(g => g.id !== id))
    }
  }

  const handleToggleStatus = (id: string) => {
    setGroups(groups.map(g => 
      g.id === id ? { ...g, status: g.status === 'Active' ? 'Inactive' : 'Active' } : g
    ))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      program: '',
      description: '',
      exemptionType: 'Transfer',
      maxCreditExemption: 30,
      courses: []
    })
  }

  const toggleCourseSelection = (courseCode: string) => {
    if (formData.courses.includes(courseCode)) {
      setFormData({ ...formData, courses: formData.courses.filter(c => c !== courseCode) })
    } else {
      setFormData({ ...formData, courses: [...formData.courses, courseCode] })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Exempted Course Groups</h1>
          <p className="text-gray-600 text-sm mt-1">Manage course exemptions for various scenarios</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-deep-plum hover:bg-deep-plum/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Exemption Group
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search exemption groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterProgram}
            onChange={(e) => setFilterProgram(e.target.value)}
            className="p-2 border rounded-md text-sm"
          >
            <option>All</option>
            {PROGRAMS.map(program => (
              <option key={program.code} value={program.code}>{program.code}</option>
            ))}
          </select>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {filteredGroups.map((group) => (
          <Card key={group.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <ShieldCheck className="w-5 h-5 text-deep-plum" />
                  <h3 className="font-semibold text-lg text-deep-plum">{group.name}</h3>
                  <Badge variant={group.status === 'Active' ? 'default' : 'secondary'}>
                    {group.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">{group.description}</p>
                
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Program</p>
                    <Badge>{group.program}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Exemption Type</p>
                    <Badge variant="outline">{group.exemptionType}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Max Credit Exemption</p>
                    <p className="text-sm font-medium">{group.maxCreditExemption} credits</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Eligible Courses</p>
                    <p className="text-sm font-medium">{group.courses.length} courses</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 mb-2">Courses in this group:</p>
                  <div className="flex flex-wrap gap-2">
                    {group.courses.map(courseCode => (
                      <Badge key={courseCode} variant="secondary">
                        {courseCode}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleStatus(group.id)}
                >
                  {group.status === 'Active' ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(group.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <p className="text-gray-500">No exemption groups found</p>
          </div>
        </Card>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Exemption Group</DialogTitle>
            <DialogDescription>Create a new course exemption group</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Group Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Transfer Student Exemptions"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Program</label>
                <select
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Program</option>
                  {PROGRAMS.map(program => (
                    <option key={program.code} value={program.code}>{program.code}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Exemption Type</label>
                <select
                  value={formData.exemptionType}
                  onChange={(e) => setFormData({ ...formData, exemptionType: e.target.value as ExemptedGroup['exemptionType'] })}
                  className="w-full p-2 border rounded-md"
                >
                  <option>Transfer</option>
                  <option>Prior Learning</option>
                  <option>Competency Test</option>
                  <option>Professional</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this exemption group"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Max Credit Exemption</label>
              <Input
                type="number"
                value={formData.maxCreditExemption}
                onChange={(e) => setFormData({ ...formData, maxCreditExemption: parseInt(e.target.value) || 0 })}
                placeholder="30"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Select Eligible Courses</label>
              <div className="border rounded-md p-4 space-y-2 max-h-60 overflow-y-auto">
                {COURSES
                  .filter(c => !formData.program || c.program === formData.program)
                  .map(course => (
                    <div key={course.code} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.courses.includes(course.code)}
                        onChange={() => toggleCourseSelection(course.code)}
                        className="rounded"
                      />
                      <label className="text-sm cursor-pointer flex-1">
                        <span className="font-medium">{course.code}</span> - {course.title} ({course.credit} cr)
                      </label>
                    </div>
                  ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">{formData.courses.length} courses selected</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddDialog(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleAdd} className="bg-deep-plum hover:bg-deep-plum/90">
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
