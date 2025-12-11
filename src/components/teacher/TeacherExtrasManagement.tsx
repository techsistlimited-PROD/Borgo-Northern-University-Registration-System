import { useState, useEffect } from 'react'
import { Repo } from '@/lib/repo'
import { TeacherMaterial, TeacherAnnouncement, ExamSchedule, Section, Offering, Course, Room, ExamSlot } from '@/lib/seedAll'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Bell, Users, CheckCircle, XCircle, Printer } from 'lucide-react'
import { printContent, generateTableHTML } from '@/lib/exportUtils'

interface Props {
  type: 'materials' | 'announcements' | 'invigilation'
}

export default function TeacherExtrasManagement({ type }: Props) {
  const [materials, setMaterials] = useState<TeacherMaterial[]>([])
  const [announcements, setAnnouncements] = useState<TeacherAnnouncement[]>([])
  const [examSchedules, setExamSchedules] = useState<ExamSchedule[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [offerings, setOfferings] = useState<Offering[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [examSlots, setExamSlots] = useState<ExamSlot[]>([])

  useEffect(() => {
    loadData()
    const unsubMaterials = Repo.subscribe<TeacherMaterial>('teacherMaterials', setMaterials)
    const unsubAnnouncements = Repo.subscribe<TeacherAnnouncement>('teacherAnnouncements', setAnnouncements)
    const unsubSchedules = Repo.subscribe<ExamSchedule>('examSchedules', setExamSchedules)
    const unsubSections = Repo.subscribe<Section>('sections', setSections)
    const unsubOfferings = Repo.subscribe<Offering>('offerings', setOfferings)
    const unsubCourses = Repo.subscribe<Course>('courses', setCourses)
    const unsubRooms = Repo.subscribe<Room>('rooms', setRooms)
    const unsubSlots = Repo.subscribe<ExamSlot>('examSlots', setExamSlots)

    return () => {
      unsubMaterials()
      unsubAnnouncements()
      unsubSchedules()
      unsubSections()
      unsubOfferings()
      unsubCourses()
      unsubRooms()
      unsubSlots()
    }
  }, [])

  const loadData = () => {
    setMaterials(Repo.get<TeacherMaterial>('teacherMaterials'))
    setAnnouncements(Repo.get<TeacherAnnouncement>('teacherAnnouncements'))
    setExamSchedules(Repo.get<ExamSchedule>('examSchedules'))
    setSections(Repo.get<Section>('sections'))
    setOfferings(Repo.get<Offering>('offerings'))
    setCourses(Repo.get<Course>('courses'))
    setRooms(Repo.get<Room>('rooms'))
    setExamSlots(Repo.get<ExamSlot>('examSlots'))
  }

  const getSectionDetails = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId)
    const offering = section ? offerings.find(o => o.id === section.offeringId) : null
    const course = offering ? courses.find(c => c.id === offering.courseId) : null
    return { section, course }
  }

  const handlePrintDutySlip = (schedule: ExamSchedule) => {
    const section = sections.find(s => s.id === schedule.sectionId)
    const offering = section ? offerings.find(o => o.id === section.offeringId) : null
    const course = offering ? courses.find(c => c.id === offering.courseId) : null
    const room = rooms.find(r => r.id === schedule.roomId)
    const slot = examSlots.find(s => s.id === schedule.slotId)

    const html = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h2>Invigilation Duty Slip</h2>
      </div>
      <div style="margin-bottom: 20px;">
        <table style="width: 100%; border: none;">
          <tr>
            <td style="border: none; padding: 5px;"><strong>Date:</strong> ${schedule.date}</td>
            <td style="border: none; padding: 5px;"><strong>Slot:</strong> ${slot?.name}</td>
          </tr>
          <tr>
            <td style="border: none; padding: 5px;"><strong>Time:</strong> ${slot?.startTime} - ${slot?.endTime}</td>
            <td style="border: none; padding: 5px;"><strong>Room:</strong> ${room?.code}</td>
          </tr>
          <tr>
            <td style="border: none; padding: 5px;" colspan="2"><strong>Course:</strong> ${course?.code} - ${course?.title}</td>
          </tr>
          <tr>
            <td style="border: none; padding: 5px;" colspan="2"><strong>Section:</strong> ${section?.code}</td>
          </tr>
          <tr>
            <td style="border: none; padding: 5px;" colspan="2"><strong>Exam Type:</strong> ${schedule.examType}</td>
          </tr>
        </table>
      </div>
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
        <p style="text-align: center; font-size: 12px; color: #666;">Please report 15 minutes before the exam starts</p>
      </div>
    `

    printContent('Invigilation Duty Slip', html)
  }

  if (type === 'materials') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-deep-plum">Course Materials</h1>
            <p className="text-sm text-gray-600">Upload and manage course materials</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Course/Section</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Uploaded</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {materials.map(material => {
                  const { course, section } = getSectionDetails(material.sectionId)
                  return (
                    <tr key={material.id}>
                      <td className="px-4 py-3 text-sm">
                        <div className="font-medium">{course?.code} - {section?.code}</div>
                        <div className="text-xs text-gray-600">{course?.title}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">{material.title}</td>
                      <td className="px-4 py-3 text-sm"><Badge variant="outline">{material.type}</Badge></td>
                      <td className="px-4 py-3 text-sm text-gray-600">{material.uploadedDate}</td>
                      <td className="px-4 py-3 text-sm">
                        <Button size="sm" variant="outline" onClick={() => window.open(material.url, '_blank')}>
                          <FileText className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {materials.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No materials uploaded yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (type === 'announcements') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-deep-plum">Announcements</h1>
            <p className="text-sm text-gray-600">Create and manage announcements</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Course/Section</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Audience</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Published</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {announcements.map(announcement => {
                  const { course, section } = getSectionDetails(announcement.sectionId)
                  return (
                    <tr key={announcement.id}>
                      <td className="px-4 py-3 text-sm">
                        <div className="font-medium">{course?.code} - {section?.code}</div>
                        <div className="text-xs text-gray-600">{course?.title}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="font-medium">{announcement.title}</div>
                        <div className="text-xs text-gray-600">{announcement.content}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant={announcement.audience === 'All' ? 'default' : 'outline'}>
                          {announcement.audience}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{announcement.publishedDate}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {announcements.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No announcements yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (type === 'invigilation') {
    const myInvigilationDuties = examSchedules.filter(s => s.invigilatorIds.length > 0).slice(0, 10)

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-deep-plum">Invigilation Duties</h1>
            <p className="text-sm text-gray-600">View and manage your invigilation assignments</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Slot</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Room</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Session</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Reporting Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {myInvigilationDuties.map(schedule => {
                  const section = sections.find(s => s.id === schedule.sectionId)
                  const offering = section ? offerings.find(o => o.id === section.offeringId) : null
                  const course = offering ? courses.find(c => c.id === offering.courseId) : null
                  const room = rooms.find(r => r.id === schedule.roomId)
                  const slot = examSlots.find(s => s.id === schedule.slotId)

                  return (
                    <tr key={schedule.id}>
                      <td className="px-4 py-3 text-sm">{schedule.date}</td>
                      <td className="px-4 py-3 text-sm">
                        <div>{slot?.name}</div>
                        <div className="text-xs text-gray-500">
                          {slot?.startTime} - {slot?.endTime}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div>{room?.code}</div>
                        <div className="text-xs text-gray-500">{room?.building}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="font-medium">{course?.code} - {section?.code}</div>
                        <div className="text-xs text-gray-600">{course?.title}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-orange-600">
                        {slot ? `${slot.startTime.split(':')[0]}:${(parseInt(slot.startTime.split(':')[1]) - 15).toString().padStart(2, '0')}` : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="default">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Accepted
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Button size="sm" variant="outline" onClick={() => handlePrintDutySlip(schedule)}>
                          <Printer className="w-4 h-4 mr-1" />
                          Print Slip
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {myInvigilationDuties.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No invigilation duties assigned
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
