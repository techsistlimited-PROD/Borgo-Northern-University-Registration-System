import { useState, useEffect } from 'react'
import { Repo } from '@/lib/repo'
import { ExamSchedule, Section, Offering, Course, Room, ExamSlot, InvigilationAssignment } from '@/lib/seedAll'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, List, Download, Lock, Unlock, Plus, AlertCircle } from 'lucide-react'
import { exportToCSV } from '@/lib/exportUtils'

export default function ExamScheduleManagement() {
  const [examSchedules, setExamSchedules] = useState<ExamSchedule[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [offerings, setOfferings] = useState<Offering[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [examSlots, setExamSlots] = useState<ExamSlot[]>([])
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table')

  useEffect(() => {
    loadData()
    const unsubSchedules = Repo.subscribe<ExamSchedule>('examSchedules', setExamSchedules)
    const unsubSections = Repo.subscribe<Section>('sections', setSections)
    const unsubOfferings = Repo.subscribe<Offering>('offerings', setOfferings)
    const unsubCourses = Repo.subscribe<Course>('courses', setCourses)
    const unsubRooms = Repo.subscribe<Room>('rooms', setRooms)
    const unsubSlots = Repo.subscribe<ExamSlot>('examSlots', setExamSlots)

    return () => {
      unsubSchedules()
      unsubSections()
      unsubOfferings()
      unsubCourses()
      unsubRooms()
      unsubSlots()
    }
  }, [])

  const loadData = () => {
    setExamSchedules(Repo.get<ExamSchedule>('examSchedules'))
    setSections(Repo.get<Section>('sections'))
    setOfferings(Repo.get<Offering>('offerings'))
    setCourses(Repo.get<Course>('courses'))
    setRooms(Repo.get<Room>('rooms'))
    setExamSlots(Repo.get<ExamSlot>('examSlots'))
  }

  const getScheduleDetails = (schedule: ExamSchedule) => {
    const section = sections.find(s => s.id === schedule.sectionId)
    const offering = section ? offerings.find(o => o.id === section.offeringId) : null
    const course = offering ? courses.find(c => c.id === offering.courseId) : null
    const room = rooms.find(r => r.id === schedule.roomId)
    const slot = examSlots.find(s => s.id === schedule.slotId)

    return { section, course, room, slot }
  }

  const handleLock = (scheduleId: string) => {
    const schedule = examSchedules.find(s => s.id === scheduleId)
    if (!schedule) return

    const conflicts = checkConflicts(schedule)
    if (conflicts.length > 0) {
      alert(`Cannot lock schedule due to conflicts:\n${conflicts.join('\n')}`)
      return
    }

    Repo.update<ExamSchedule>('examSchedules', scheduleId, { status: 'Locked' })
  }

  const handleUnlock = (scheduleId: string) => {
    const confirmed = confirm('Are you sure you want to unlock this exam schedule?')
    if (confirmed) {
      Repo.update<ExamSchedule>('examSchedules', scheduleId, { status: 'Draft' })
    }
  }

  const checkConflicts = (schedule: ExamSchedule): string[] => {
    const conflicts: string[] = []

    const roomConflicts = examSchedules.filter(s =>
      s.id !== schedule.id &&
      s.roomId === schedule.roomId &&
      s.date === schedule.date &&
      s.slotId === schedule.slotId
    )

    if (roomConflicts.length > 0) {
      conflicts.push('Room already booked at this time')
    }

    const room = rooms.find(r => r.id === schedule.roomId)
    const section = sections.find(s => s.id === schedule.sectionId)
    if (room && section && section.enrolled > room.capacity) {
      conflicts.push(`Room capacity (${room.capacity}) less than enrolled students (${section.enrolled})`)
    }

    return conflicts
  }

  const handleExport = () => {
    const exportData = examSchedules.map(schedule => {
      const { course, section, room, slot } = getScheduleDetails(schedule)
      return {
        'Date': schedule.date,
        'Slot': slot?.name || '',
        'Time': slot ? `${slot.startTime} - ${slot.endTime}` : '',
        'Course': course?.code || '',
        'Section': section?.code || '',
        'Exam Type': schedule.examType,
        'Room': room?.code || '',
        'Capacity': room?.capacity || 0,
        'Invigilators': schedule.invigilatorIds.length,
        'Status': schedule.status
      }
    })
    exportToCSV(exportData, 'exam-schedule')
  }

  const groupByDate = () => {
    const grouped: Record<string, ExamSchedule[]> = {}
    examSchedules.forEach(schedule => {
      if (!grouped[schedule.date]) {
        grouped[schedule.date] = []
      }
      grouped[schedule.date].push(schedule)
    })
    return grouped
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Exam Schedule</h1>
          <p className="text-sm text-gray-600">Manage examination schedules and venues</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            onClick={() => setViewMode('table')}
          >
            <List className="w-4 h-4 mr-2" />
            Table
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            onClick={() => setViewMode('calendar')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Calendar
          </Button>
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-deep-plum">{examSchedules.length}</div>
              <div className="text-sm text-gray-600">Total Exams</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {examSchedules.filter(s => s.status === 'Locked').length}
              </div>
              <div className="text-sm text-gray-600">Locked</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {examSchedules.filter(s => s.status === 'Draft').length}
              </div>
              <div className="text-sm text-gray-600">Draft</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {examSchedules.filter(s => s.invigilatorIds.length === 0).length}
              </div>
              <div className="text-sm text-gray-600">No Invigilators</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {viewMode === 'table' ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Slot</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Course/Section</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Exam Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Room</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Capacity</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Invigilators</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {examSchedules.map(schedule => {
                    const { course, section, room, slot } = getScheduleDetails(schedule)
                    const conflicts = checkConflicts(schedule)
                    
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
                          <Badge variant="outline">{schedule.examType}</Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div>{room?.code}</div>
                          <div className="text-xs text-gray-500">{room?.building}</div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className={section && room && section.enrolled > room.capacity ? 'text-red-600 font-medium' : ''}>
                            {section?.enrolled || 0} / {room?.capacity || 0}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Badge variant={schedule.invigilatorIds.length > 0 ? 'default' : 'secondary'}>
                            {schedule.invigilatorIds.length}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Badge variant={schedule.status === 'Locked' ? 'default' : 'secondary'}>
                              {schedule.status}
                            </Badge>
                            {conflicts.length > 0 && (
                              <AlertCircle className="w-4 h-4 text-red-600" title={conflicts.join(', ')} />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            {schedule.status === 'Draft' ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleLock(schedule.id)}
                                disabled={conflicts.length > 0}
                              >
                                <Lock className="w-4 h-4 mr-1" />
                                Lock
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUnlock(schedule.id)}
                              >
                                <Unlock className="w-4 h-4 mr-1" />
                                Unlock
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {examSchedules.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No exam schedules found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupByDate()).map(([date, schedules]) => (
            <Card key={date}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <Badge variant="outline">{schedules.length} exams</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {schedules.map(schedule => {
                    const { course, section, room, slot } = getScheduleDetails(schedule)
                    const conflicts = checkConflicts(schedule)

                    return (
                      <div
                        key={schedule.id}
                        className={`p-4 border rounded-lg ${conflicts.length > 0 ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-sm">{slot?.name}</div>
                          <Badge variant={schedule.status === 'Locked' ? 'default' : 'secondary'} className="text-xs">
                            {schedule.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {slot?.startTime} - {slot?.endTime}
                        </div>
                        <div className="font-medium text-sm mb-1">
                          {course?.code} - {section?.code}
                        </div>
                        <div className="text-xs text-gray-600 mb-2">{course?.title}</div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>Room: {room?.code}</div>
                          <div>Type: {schedule.examType}</div>
                          <div>Invigilators: {schedule.invigilatorIds.length}</div>
                        </div>
                        {conflicts.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-red-200">
                            <div className="flex items-start gap-1 text-xs text-red-600">
                              <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              <div>{conflicts[0]}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
          {Object.keys(groupByDate()).length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No exam schedules found
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
