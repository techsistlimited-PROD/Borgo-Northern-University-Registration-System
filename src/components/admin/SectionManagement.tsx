import { useState, useEffect } from 'react'
import { Repo } from '@/lib/repo'
import { Section, Offering, Course, Room, Faculty, Semester, Campus, Program } from '@/lib/seedAll'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Download, Edit, AlertCircle } from 'lucide-react'
import { exportToCSV } from '@/lib/exportUtils'

export default function SectionManagement() {
  const [sections, setSections] = useState<Section[]>([])
  const [offerings, setOfferings] = useState<Offering[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [campuses, setCampuses] = useState<Campus[]>([])
  const [programs, setPrograms] = useState<Program[]>([])

  const [filters, setFilters] = useState({
    semester: '',
    campus: '',
    program: '',
    course: '',
    status: ''
  })

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingSection, setEditingSection] = useState<Section | null>(null)

  useEffect(() => {
    loadData()
    const unsubSections = Repo.subscribe<Section>('sections', setSections)
    const unsubOfferings = Repo.subscribe<Offering>('offerings', setOfferings)
    const unsubCourses = Repo.subscribe<Course>('courses', setCourses)
    const unsubRooms = Repo.subscribe<Room>('rooms', setRooms)
    const unsubFaculty = Repo.subscribe<Faculty>('faculty', setFaculty)
    const unsubSemesters = Repo.subscribe<Semester>('semesters', setSemesters)
    const unsubCampuses = Repo.subscribe<Campus>('campuses', setCampuses)
    const unsubPrograms = Repo.subscribe<Program>('programs', setPrograms)

    return () => {
      unsubSections()
      unsubOfferings()
      unsubCourses()
      unsubRooms()
      unsubFaculty()
      unsubSemesters()
      unsubCampuses()
      unsubPrograms()
    }
  }, [])

  const loadData = () => {
    setSections(Repo.get<Section>('sections'))
    setOfferings(Repo.get<Offering>('offerings'))
    setCourses(Repo.get<Course>('courses'))
    setRooms(Repo.get<Room>('rooms'))
    setFaculty(Repo.get<Faculty>('faculty'))
    setSemesters(Repo.get<Semester>('semesters'))
    setCampuses(Repo.get<Campus>('campuses'))
    setPrograms(Repo.get<Program>('programs'))
  }

  const getFilteredSections = () => {
    return sections.filter(section => {
      const offering = offerings.find(o => o.id === section.offeringId)
      if (!offering) return false

      const course = courses.find(c => c.id === offering.courseId)
      if (!course) return false

      if (filters.semester && offering.semesterId !== filters.semester) return false
      if (filters.campus && offering.campusId !== filters.campus) return false
      if (filters.program && course.program !== filters.program) return false
      if (filters.course && offering.courseId !== filters.course) return false
      if (filters.status && section.status !== filters.status) return false

      return true
    })
  }

  const getSectionDetails = (section: Section) => {
    const offering = offerings.find(o => o.id === section.offeringId)
    const course = offering ? courses.find(c => c.id === offering.courseId) : null
    const room = section.roomId ? rooms.find(r => r.id === section.roomId) : null
    const facultyMember = section.facultyId ? faculty.find(f => f.id === section.facultyId) : null

    return { offering, course, room, facultyMember }
  }

  const handleExport = () => {
    const filtered = getFilteredSections()
    const exportData = filtered.map(section => {
      const { course, room, facultyMember } = getSectionDetails(section)
      return {
        'Course Code': course?.code || '',
        'Course Title': course?.title || '',
        'Section': section.code,
        'Capacity': section.capacity,
        'Enrolled': section.enrolled,
        'Room': room?.code || 'Not Assigned',
        'Timeslot': section.timeslot || 'Not Assigned',
        'Faculty': facultyMember?.name || 'Not Assigned',
        'Status': section.status
      }
    })
    exportToCSV(exportData, 'sections')
  }

  const handlePublish = (sectionId: string) => {
    Repo.update<Section>('sections', sectionId, { status: 'Published' })
  }

  const handleUnpublish = (sectionId: string) => {
    Repo.update<Section>('sections', sectionId, { status: 'Draft' })
  }

  const filteredSections = getFilteredSections()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Section Management</h1>
          <p className="text-sm text-gray-600">Manage course sections and assignments</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => setShowAddDialog(true)} className="bg-deep-plum hover:bg-deep-plum/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Semester</label>
              <select
                value={filters.semester}
                onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">All Semesters</option>
                {semesters.map(sem => (
                  <option key={sem.id} value={sem.id}>{sem.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Campus</label>
              <select
                value={filters.campus}
                onChange={(e) => setFilters({ ...filters, campus: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">All Campuses</option>
                {campuses.map(campus => (
                  <option key={campus.id} value={campus.id}>{campus.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Program</label>
              <select
                value={filters.program}
                onChange={(e) => setFilters({ ...filters, program: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">All Programs</option>
                {programs.map(prog => (
                  <option key={prog.id} value={prog.code}>{prog.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Course</label>
              <select
                value={filters.course}
                onChange={(e) => setFilters({ ...filters, course: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">All Courses</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.code} - {course.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Course Code</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Course Title</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Section</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Capacity</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Enrolled</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Room</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Timeslot</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Faculty</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredSections.map(section => {
                  const { course, room, facultyMember } = getSectionDetails(section)
                  return (
                    <tr key={section.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{course?.code}</td>
                      <td className="px-4 py-3 text-sm">{course?.title}</td>
                      <td className="px-4 py-3 text-sm font-medium">{section.code}</td>
                      <td className="px-4 py-3 text-sm">{section.capacity}</td>
                      <td className="px-4 py-3 text-sm">{section.enrolled}</td>
                      <td className="px-4 py-3 text-sm">{room?.code || <span className="text-gray-400">Not Assigned</span>}</td>
                      <td className="px-4 py-3 text-sm">{section.timeslot || <span className="text-gray-400">Not Assigned</span>}</td>
                      <td className="px-4 py-3 text-sm">{facultyMember?.name || <span className="text-gray-400">Not Assigned</span>}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant={section.status === 'Published' ? 'default' : 'secondary'}>
                          {section.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingSection(section)
                              setShowEditDialog(true)
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {section.status === 'Draft' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePublish(section.id)}
                            >
                              Publish
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnpublish(section.id)}
                            >
                              Unpublish
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filteredSections.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No sections found matching the filters
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {filteredSections.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>Showing {filteredSections.length} sections</div>
          <div className="flex gap-4">
            <div>Published: {filteredSections.filter(s => s.status === 'Published').length}</div>
            <div>Draft: {filteredSections.filter(s => s.status === 'Draft').length}</div>
          </div>
        </div>
      )}
    </div>
  )
}
