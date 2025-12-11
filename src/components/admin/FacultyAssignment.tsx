import { useState, useEffect } from 'react'
import { Repo } from '@/lib/repo'
import { Section, Offering, Course, Faculty, Department, Program } from '@/lib/seedAll'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Users, AlertTriangle, CheckCircle, Wand2 } from 'lucide-react'

export default function FacultyAssignment() {
  const [sections, setSections] = useState<Section[]>([])
  const [offerings, setOfferings] = useState<Offering[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [programs, setPrograms] = useState<Program[]>([])

  const [filters, setFilters] = useState({
    department: '',
    program: '',
    timeslot: ''
  })

  const [facultyFilters, setFacultyFilters] = useState({
    department: '',
    search: ''
  })

  const [selectedSection, setSelectedSection] = useState<Section | null>(null)
  const [showAssignDialog, setShowAssignDialog] = useState(false)

  useEffect(() => {
    loadData()
    const unsubSections = Repo.subscribe<Section>('sections', setSections)
    const unsubOfferings = Repo.subscribe<Offering>('offerings', setOfferings)
    const unsubCourses = Repo.subscribe<Course>('courses', setCourses)
    const unsubFaculty = Repo.subscribe<Faculty>('faculty', setFaculty)
    const unsubDepartments = Repo.subscribe<Department>('departments', setDepartments)
    const unsubPrograms = Repo.subscribe<Program>('programs', setPrograms)

    return () => {
      unsubSections()
      unsubOfferings()
      unsubCourses()
      unsubFaculty()
      unsubDepartments()
      unsubPrograms()
    }
  }, [])

  const loadData = () => {
    setSections(Repo.get<Section>('sections'))
    setOfferings(Repo.get<Offering>('offerings'))
    setCourses(Repo.get<Course>('courses'))
    setFaculty(Repo.get<Faculty>('faculty'))
    setDepartments(Repo.get<Department>('departments'))
    setPrograms(Repo.get<Program>('programs'))
  }

  const getFilteredSections = () => {
    return sections.filter(section => {
      const offering = offerings.find(o => o.id === section.offeringId)
      if (!offering) return false

      const course = courses.find(c => c.id === offering.courseId)
      if (!course) return false

      const program = programs.find(p => p.code === course.program)
      if (!program) return false

      if (filters.department && program.deptCode !== filters.department) return false
      if (filters.program && course.program !== filters.program) return false
      if (filters.timeslot && section.timeslot !== filters.timeslot) return false

      return true
    })
  }

  const getFilteredFaculty = () => {
    return faculty.filter(f => {
      if (facultyFilters.department && f.dept !== facultyFilters.department) return false
      if (facultyFilters.search && !f.name.toLowerCase().includes(facultyFilters.search.toLowerCase())) return false
      return true
    })
  }

  const getSectionDetails = (section: Section) => {
    const offering = offerings.find(o => o.id === section.offeringId)
    const course = offering ? courses.find(c => c.id === offering.courseId) : null
    const assignedFaculty = section.facultyId ? faculty.find(f => f.id === section.facultyId) : null
    return { course, assignedFaculty }
  }

  const handleAssignFaculty = (sectionId: string, facultyId: string) => {
    const section = sections.find(s => s.id === sectionId)
    if (!section) return

    const hasConflict = checkTimeConflict(section, facultyId)
    if (hasConflict) {
      alert('Time conflict detected! This faculty is already assigned to another section at the same timeslot.')
      return
    }

    Repo.update<Section>('sections', sectionId, { facultyId })
    setShowAssignDialog(false)
    setSelectedSection(null)
  }

  const checkTimeConflict = (section: Section, facultyId: string): boolean => {
    if (!section.timeslot) return false

    return sections.some(s => 
      s.id !== section.id && 
      s.facultyId === facultyId && 
      s.timeslot === section.timeslot
    )
  }

  const handleAutoAssign = () => {
    const unassignedSections = sections.filter(s => !s.facultyId)
    let assignedCount = 0

    unassignedSections.forEach(section => {
      const offering = offerings.find(o => o.id === section.offeringId)
      if (!offering) return

      const course = courses.find(c => c.id === offering.courseId)
      if (!course) return

      const program = programs.find(p => p.code === course.program)
      if (!program) return

      const sameDeptFaculty = faculty.filter(f => f.dept === program.deptCode)
      
      for (const f of sameDeptFaculty) {
        if (!checkTimeConflict(section, f.id)) {
          const assignedSections = sections.filter(s => s.facultyId === f.id).length
          if (assignedSections < 4) {
            Repo.update<Section>('sections', section.id, { facultyId: f.id })
            assignedCount++
            break
          }
        }
      }
    })

    alert(`Auto-assigned ${assignedCount} sections`)
    loadData()
  }

  const filteredSections = getFilteredSections()
  const filteredFaculty = getFilteredFaculty()
  const assignedSections = filteredSections.filter(s => s.facultyId).length
  const unassignedSections = filteredSections.length - assignedSections

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Faculty Assignment</h1>
          <p className="text-sm text-gray-600">Assign faculty to course sections</p>
        </div>
        <Button onClick={handleAutoAssign} className="bg-deep-plum hover:bg-deep-plum/90">
          <Wand2 className="w-4 h-4 mr-2" />
          Auto-Assign
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-deep-plum">{filteredSections.length}</div>
              <div className="text-sm text-gray-600">Total Sections</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{assignedSections}</div>
              <div className="text-sm text-gray-600">Assigned</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{unassignedSections}</div>
              <div className="text-sm text-gray-600">Unassigned</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Sections</span>
              <Badge variant="secondary">{filteredSections.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-medium mb-1 block">Department</label>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                  className="w-full px-2 py-1 text-sm border rounded"
                >
                  <option value="">All</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.code}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Program</label>
                <select
                  value={filters.program}
                  onChange={(e) => setFilters({ ...filters, program: e.target.value })}
                  className="w-full px-2 py-1 text-sm border rounded"
                >
                  <option value="">All</option>
                  {programs.map(prog => (
                    <option key={prog.id} value={prog.code}>{prog.code}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Timeslot</label>
                <select
                  value={filters.timeslot}
                  onChange={(e) => setFilters({ ...filters, timeslot: e.target.value })}
                  className="w-full px-2 py-1 text-sm border rounded"
                >
                  <option value="">All</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredSections.map(section => {
                const { course, assignedFaculty } = getSectionDetails(section)
                return (
                  <div
                    key={section.id}
                    className="p-3 border rounded-lg hover:border-deep-plum cursor-pointer transition-all"
                    onClick={() => {
                      setSelectedSection(section)
                      setShowAssignDialog(true)
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-sm">{course?.code} - {section.code}</div>
                        <div className="text-xs text-gray-600">{course?.title}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {section.timeslot || 'No timeslot'} · {section.enrolled}/{section.capacity} students
                        </div>
                      </div>
                      {assignedFaculty ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {assignedFaculty.initial}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Unassigned
                        </Badge>
                      )}
                    </div>
                    {assignedFaculty && (
                      <div className="mt-2 text-xs text-gray-600 border-t pt-2">
                        Faculty: {assignedFaculty.name}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Faculty Pool</span>
              <Badge variant="secondary">{filteredFaculty.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium mb-1 block">Department</label>
                <select
                  value={facultyFilters.department}
                  onChange={(e) => setFacultyFilters({ ...facultyFilters, department: e.target.value })}
                  className="w-full px-2 py-1 text-sm border rounded"
                >
                  <option value="">All</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.code}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Search</label>
                <Input
                  placeholder="Search faculty..."
                  value={facultyFilters.search}
                  onChange={(e) => setFacultyFilters({ ...facultyFilters, search: e.target.value })}
                  className="h-8 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredFaculty.map(f => {
                const assignedCount = sections.filter(s => s.facultyId === f.id).length
                return (
                  <div key={f.id} className="p-3 border rounded-lg hover:border-deep-plum transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-sm">{f.name}</div>
                        <div className="text-xs text-gray-600">{f.designation}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Dept: {f.dept} · Load: {assignedCount} sections
                        </div>
                      </div>
                      <Badge variant="outline">{f.initial}</Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Faculty</DialogTitle>
          </DialogHeader>
          {selectedSection && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium">
                  {getSectionDetails(selectedSection).course?.code} - Section {selectedSection.code}
                </div>
                <div className="text-sm text-gray-600">
                  {getSectionDetails(selectedSection).course?.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Timeslot: {selectedSection.timeslot || 'Not set'}
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {faculty.map(f => {
                  const hasConflict = checkTimeConflict(selectedSection, f.id)
                  const assignedCount = sections.filter(s => s.facultyId === f.id).length

                  return (
                    <button
                      key={f.id}
                      onClick={() => !hasConflict && handleAssignFaculty(selectedSection.id, f.id)}
                      disabled={hasConflict}
                      className={`w-full p-3 border rounded-lg text-left transition-all ${
                        hasConflict 
                          ? 'bg-red-50 border-red-200 cursor-not-allowed opacity-60' 
                          : 'hover:border-deep-plum hover:bg-mint-green/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{f.name}</div>
                          <div className="text-xs text-gray-600">{f.designation} · {f.dept}</div>
                          <div className="text-xs text-gray-500">Load: {assignedCount} sections</div>
                        </div>
                        {hasConflict && (
                          <Badge variant="destructive">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Conflict
                          </Badge>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
