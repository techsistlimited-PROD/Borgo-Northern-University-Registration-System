import { useState, useEffect } from 'react'
import { Repo } from '@/lib/repo'
import { ExamSchedule, Faculty, Room, ExamSlot, Section, Offering, Course, Semester, Campus, Program } from '@/lib/seedAll'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Download, UserPlus, Wand2, Printer, Users } from 'lucide-react'
import { exportToCSV, printContent, generateTableHTML } from '@/lib/exportUtils'

export default function InvigilationDutyManagement() {
  const [examSchedules, setExamSchedules] = useState<ExamSchedule[]>([])
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [examSlots, setExamSlots] = useState<ExamSlot[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [offerings, setOfferings] = useState<Offering[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [campuses, setCampuses] = useState<Campus[]>([])
  const [programs, setPrograms] = useState<Program[]>([])

  const [filters, setFilters] = useState({
    semester: '',
    campus: '',
    program: '',
    examType: '',
    dateFrom: '',
    dateTo: ''
  })

  const [selectedSchedule, setSelectedSchedule] = useState<ExamSchedule | null>(null)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [selectedFaculty, setSelectedFaculty] = useState<string[]>([])

  useEffect(() => {
    loadData()
    const unsubSchedules = Repo.subscribe<ExamSchedule>('examSchedules', setExamSchedules)
    const unsubFaculty = Repo.subscribe<Faculty>('faculty', setFaculty)
    const unsubRooms = Repo.subscribe<Room>('rooms', setRooms)
    const unsubSlots = Repo.subscribe<ExamSlot>('examSlots', setExamSlots)
    const unsubSections = Repo.subscribe<Section>('sections', setSections)
    const unsubOfferings = Repo.subscribe<Offering>('offerings', setOfferings)
    const unsubCourses = Repo.subscribe<Course>('courses', setCourses)
    const unsubSemesters = Repo.subscribe<Semester>('semesters', setSemesters)
    const unsubCampuses = Repo.subscribe<Campus>('campuses', setCampuses)
    const unsubPrograms = Repo.subscribe<Program>('programs', setPrograms)

    return () => {
      unsubSchedules()
      unsubFaculty()
      unsubRooms()
      unsubSlots()
      unsubSections()
      unsubOfferings()
      unsubCourses()
      unsubSemesters()
      unsubCampuses()
      unsubPrograms()
    }
  }, [])

  const loadData = () => {
    setExamSchedules(Repo.get<ExamSchedule>('examSchedules'))
    setFaculty(Repo.get<Faculty>('faculty'))
    setRooms(Repo.get<Room>('rooms'))
    setExamSlots(Repo.get<ExamSlot>('examSlots'))
    setSections(Repo.get<Section>('sections'))
    setOfferings(Repo.get<Offering>('offerings'))
    setCourses(Repo.get<Course>('courses'))
    setSemesters(Repo.get<Semester>('semesters'))
    setCampuses(Repo.get<Campus>('campuses'))
    setPrograms(Repo.get<Program>('programs'))
  }

  const getFilteredSchedules = () => {
    return examSchedules.filter(schedule => {
      const section = sections.find(s => s.id === schedule.sectionId)
      if (!section) return false

      const offering = offerings.find(o => o.id === section.offeringId)
      if (!offering) return false

      if (filters.semester && offering.semesterId !== filters.semester) return false
      if (filters.campus && offering.campusId !== filters.campus) return false
      if (filters.examType && schedule.examType !== filters.examType) return false
      if (filters.dateFrom && schedule.date < filters.dateFrom) return false
      if (filters.dateTo && schedule.date > filters.dateTo) return false

      return true
    })
  }

  const getScheduleDetails = (schedule: ExamSchedule) => {
    const section = sections.find(s => s.id === schedule.sectionId)
    const offering = section ? offerings.find(o => o.id === section.offeringId) : null
    const course = offering ? courses.find(c => c.id === offering.courseId) : null
    const room = rooms.find(r => r.id === schedule.roomId)
    const slot = examSlots.find(s => s.id === schedule.slotId)
    const assignedFaculty = faculty.filter(f => schedule.invigilatorIds.includes(f.id))

    return { section, course, room, slot, assignedFaculty }
  }

  const handleAssignFaculty = () => {
    if (!selectedSchedule || selectedFaculty.length === 0) return

    Repo.update<ExamSchedule>('examSchedules', selectedSchedule.id, {
      invigilatorIds: selectedFaculty
    })

    setShowAssignDialog(false)
    setSelectedSchedule(null)
    setSelectedFaculty([])
  }

  const handleStatusChange = (newStatus: 'Draft' | 'Locked') => {
    if (!selectedSchedule) return

    Repo.update<ExamSchedule>('examSchedules', selectedSchedule.id, {
      status: newStatus
    })

    setShowStatusDialog(false)
    setSelectedSchedule(null)
  }

  const handleAutoAssign = () => {
    let assigned = 0
    const schedulesToAssign = examSchedules.filter(s => s.invigilatorIds.length === 0)

    schedulesToAssign.forEach(schedule => {
      const availableFaculty = faculty.filter(f => {
        const hasConflict = examSchedules.some(s => 
          s.id !== schedule.id &&
          s.date === schedule.date &&
          s.slotId === schedule.slotId &&
          s.invigilatorIds.includes(f.id)
        )
        return !hasConflict
      })

      if (availableFaculty.length >= 2) {
        const assignedIds = availableFaculty.slice(0, 2).map(f => f.id)
        Repo.update<ExamSchedule>('examSchedules', schedule.id, {
          invigilatorIds: assignedIds
        })
        assigned++
      }
    })

    alert(`Auto-assigned ${assigned} exam sessions`)
    loadData()
  }

  const handleExport = () => {
    const filtered = getFilteredSchedules()
    const exportData = filtered.map(schedule => {
      const { course, section, room, slot, assignedFaculty } = getScheduleDetails(schedule)
      return {
        'Date': schedule.date,
        'Slot': slot?.name || '',
        'Course/Section': `${course?.code} - ${section?.code}`,
        'Room': room?.code || '',
        'Capacity': room?.capacity || 0,
        'Assigned': assignedFaculty.map(f => f.name).join(', ') || 'None',
        'Count': assignedFaculty.length,
        'Status': schedule.status
      }
    })
    exportToCSV(exportData, 'invigilation-duty')
  }

  const handlePrintDutySheet = () => {
    const filtered = getFilteredSchedules()
    const rows = filtered.map(schedule => {
      const { course, section, room, slot, assignedFaculty } = getScheduleDetails(schedule)
      return [
        schedule.date,
        slot?.name || '',
        `${slot?.startTime} - ${slot?.endTime}`,
        `${course?.code} - ${section?.code}`,
        room?.code || '',
        assignedFaculty.map(f => f.name).join(', ') || 'Not Assigned'
      ]
    })

    const html = generateTableHTML(
      ['Date', 'Slot', 'Time', 'Course/Section', 'Room', 'Invigilators'],
      rows
    )
    printContent('Invigilation Duty Sheet', html)
  }

  const filteredSchedules = getFilteredSchedules()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Invigilation Duty</h1>
          <p className="text-sm text-gray-600">Assign and manage exam invigilators</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePrintDutySheet} variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print Duty Sheet
          </Button>
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleAutoAssign} className="bg-deep-plum hover:bg-deep-plum/90">
            <Wand2 className="w-4 h-4 mr-2" />
            Auto-Assign
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <label className="text-sm font-medium mb-1 block">Exam Type</label>
              <select
                value={filters.examType}
                onChange={(e) => setFilters({ ...filters, examType: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">All Types</option>
                <option value="Midterm">Midterm</option>
                <option value="Final">Final</option>
                <option value="Improvement">Improvement</option>
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
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Slot</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Course/Section</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Room</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Capacity</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Assigned</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredSchedules.map(schedule => {
                  const { course, section, room, slot, assignedFaculty } = getScheduleDetails(schedule)
                  
                  return (
                    <tr key={schedule.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{schedule.date}</td>
                      <td className="px-4 py-3 text-sm">
                        <div>{slot?.name}</div>
                        <div className="text-xs text-gray-500">
                          {slot?.startTime} - {slot?.endTime}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="font-medium">{course?.code} - {section?.code}</div>
                        <div className="text-xs text-gray-600">{course?.title}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div>{room?.code}</div>
                        <div className="text-xs text-gray-500">{room?.building}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">{room?.capacity || 0}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant={assignedFaculty.length > 0 ? 'default' : 'secondary'}>
                            <Users className="w-3 h-3 mr-1" />
                            {assignedFaculty.length}
                          </Badge>
                          {assignedFaculty.length > 0 && (
                            <div className="text-xs text-gray-600">
                              {assignedFaculty.map(f => f.initial).join(', ')}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant={schedule.status === 'Locked' ? 'default' : 'secondary'}>
                          {schedule.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedSchedule(schedule)
                            setSelectedFaculty(schedule.invigilatorIds)
                            setShowAssignDialog(true)
                          }}
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Assign
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filteredSchedules.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No exam schedules found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Invigilators</DialogTitle>
          </DialogHeader>
          {selectedSchedule && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium">
                  {getScheduleDetails(selectedSchedule).course?.code} - Section {getScheduleDetails(selectedSchedule).section?.code}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {getScheduleDetails(selectedSchedule).slot?.name} · {selectedSchedule.date} · {getScheduleDetails(selectedSchedule).room?.code}
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {faculty.map(f => {
                  const isSelected = selectedFaculty.includes(f.id)
                  const hasConflict = examSchedules.some(s => 
                    s.id !== selectedSchedule.id &&
                    s.date === selectedSchedule.date &&
                    s.slotId === selectedSchedule.slotId &&
                    s.invigilatorIds.includes(f.id)
                  )

                  return (
                    <div
                      key={f.id}
                      className={`flex items-center gap-3 p-3 border rounded-lg ${
                        hasConflict ? 'bg-red-50 border-red-200' : 'hover:bg-gray-50'
                      }`}
                    >
                      <Checkbox
                        checked={isSelected}
                        disabled={hasConflict}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedFaculty([...selectedFaculty, f.id])
                          } else {
                            setSelectedFaculty(selectedFaculty.filter(id => id !== f.id))
                          }
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{f.name}</div>
                        <div className="text-xs text-gray-600">{f.designation} · {f.dept}</div>
                        {hasConflict && (
                          <div className="text-xs text-red-600 mt-1">Conflict: Already assigned at this time</div>
                        )}
                      </div>
                      <Badge variant="outline">{f.initial}</Badge>
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAssignFaculty} className="bg-deep-plum hover:bg-deep-plum/90">
                  Assign {selectedFaculty.length} Invigilators
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
