import { useState, useEffect } from 'react'
import { Repo } from '@/lib/repo'
import { Student, ExamSchedule, Section, Offering, Course, Semester, Campus, Program, AdmitCardBlock } from '@/lib/seedAll'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Download, Printer, Eye, AlertCircle, CheckCircle } from 'lucide-react'
import { printContent, generateTableHTML } from '@/lib/exportUtils'

export default function AdmitCardsManagement() {
  const [students, setStudents] = useState<Student[]>([])
  const [examSchedules, setExamSchedules] = useState<ExamSchedule[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [offerings, setOfferings] = useState<Offering[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [campuses, setCampuses] = useState<Campus[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [blocks, setBlocks] = useState<AdmitCardBlock[]>([])

  const [filters, setFilters] = useState({
    semester: '',
    campus: '',
    program: '',
    examType: '',
    status: '',
    search: ''
  })

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)

  useEffect(() => {
    loadData()
    const unsubStudents = Repo.subscribe<Student>('students', setStudents)
    const unsubSchedules = Repo.subscribe<ExamSchedule>('examSchedules', setExamSchedules)
    const unsubSections = Repo.subscribe<Section>('sections', setSections)
    const unsubOfferings = Repo.subscribe<Offering>('offerings', setOfferings)
    const unsubCourses = Repo.subscribe<Course>('courses', setCourses)
    const unsubSemesters = Repo.subscribe<Semester>('semesters', setSemesters)
    const unsubCampuses = Repo.subscribe<Campus>('campuses', setCampuses)
    const unsubPrograms = Repo.subscribe<Program>('programs', setPrograms)
    const unsubBlocks = Repo.subscribe<AdmitCardBlock>('admitCardBlocks', setBlocks)

    return () => {
      unsubStudents()
      unsubSchedules()
      unsubSections()
      unsubOfferings()
      unsubCourses()
      unsubSemesters()
      unsubCampuses()
      unsubPrograms()
      unsubBlocks()
    }
  }, [])

  const loadData = () => {
    setStudents(Repo.get<Student>('students'))
    setExamSchedules(Repo.get<ExamSchedule>('examSchedules'))
    setSections(Repo.get<Section>('sections'))
    setOfferings(Repo.get<Offering>('offerings'))
    setCourses(Repo.get<Course>('courses'))
    setSemesters(Repo.get<Semester>('semesters'))
    setCampuses(Repo.get<Campus>('campuses'))
    setPrograms(Repo.get<Program>('programs'))
    setBlocks(Repo.get<AdmitCardBlock>('admitCardBlocks'))
  }

  const getFilteredStudents = () => {
    return students.filter(student => {
      if (filters.program && student.program !== filters.program) return false
      if (filters.campus && student.campusId !== filters.campus) return false
      if (filters.search && !student.name.toLowerCase().includes(filters.search.toLowerCase()) && !student.id.includes(filters.search)) return false
      
      const isBlocked = student.admitBlocked || blocks.some(b => b.studentId === student.id)
      if (filters.status === 'BLOCKED' && !isBlocked) return false
      if (filters.status === 'CLEARED' && isBlocked) return false

      return true
    })
  }

  const getStudentExams = (studentId: string) => {
    return examSchedules.filter(schedule => {
      const section = sections.find(s => s.id === schedule.sectionId)
      if (!section) return false
      return true
    }).slice(0, 6)
  }

  const handlePrintAdmitCard = (student: Student) => {
    const exams = getStudentExams(student.id)
    const isBlocked = student.admitBlocked || blocks.some(b => b.studentId === student.id)
    const blockReason = student.blockReason || blocks.find(b => b.studentId === student.id)?.reason

    const examRows = exams.map(schedule => {
      const section = sections.find(s => s.id === schedule.sectionId)
      const offering = section ? offerings.find(o => o.id === section.offeringId) : null
      const course = offering ? courses.find(c => c.id === offering.courseId) : null
      
      return [
        schedule.date,
        course?.code || '',
        course?.title || '',
        schedule.examType,
        isBlocked ? '<span style="color: red;">BLOCKED</span>' : 'CLEARED'
      ]
    })

    const html = `
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="${student.photoUrl}" alt="${student.name}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin: 0 auto;">
      </div>
      <div style="margin-bottom: 20px;">
        <table style="width: 100%; border: none;">
          <tr>
            <td style="border: none; padding: 5px;"><strong>Student ID:</strong> ${student.id}</td>
            <td style="border: none; padding: 5px;"><strong>UGC ID:</strong> ${student.ugcId}</td>
          </tr>
          <tr>
            <td style="border: none; padding: 5px;"><strong>Name:</strong> ${student.name}</td>
            <td style="border: none; padding: 5px;"><strong>Program:</strong> ${student.programName}</td>
          </tr>
          <tr>
            <td style="border: none; padding: 5px;"><strong>Semester:</strong> ${student.semester}</td>
            <td style="border: none; padding: 5px;"><strong>Status:</strong> ${isBlocked ? '<span style="color: red; font-weight: bold;">BLOCKED</span>' : '<span style="color: green; font-weight: bold;">CLEARED</span>'}</td>
          </tr>
        </table>
      </div>
      ${isBlocked ? `<div style="background: #fee; border: 2px solid red; padding: 10px; margin: 20px 0; text-align: center;"><strong style="color: red;">ADMIT CARD BLOCKED</strong><br><small>Reason: ${blockReason}</small></div>` : ''}
      <h3 style="margin-top: 30px;">Exam Schedule</h3>
      ${generateTableHTML(
        ['Date', 'Course Code', 'Course Title', 'Type', 'Status'],
        examRows
      )}
    `

    printContent(`Admit Card - ${student.name}`, html)
  }

  const handleBulkPrint = () => {
    const filtered = getFilteredStudents()
    if (filtered.length === 0) {
      alert('No students to print')
      return
    }

    alert(`Generating admit cards for ${filtered.length} students...`)
    filtered.forEach(student => {
      setTimeout(() => handlePrintAdmitCard(student), 100)
    })
  }

  const filteredStudents = getFilteredStudents()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Admit Cards</h1>
          <p className="text-sm text-gray-600">Generate and manage student admit cards</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleBulkPrint} variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Generate For All ({filteredStudents.length})
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
              <label className="text-sm font-medium mb-1 block">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">All Status</option>
                <option value="CLEARED">CLEARED</option>
                <option value="BLOCKED">BLOCKED</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Search</label>
              <Input
                placeholder="Name or ID..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
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
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Student ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Program</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Exams</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Blocked?</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Last Updated</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredStudents.map(student => {
                  const isBlocked = student.admitBlocked || blocks.some(b => b.studentId === student.id)
                  const blockReason = student.blockReason || blocks.find(b => b.studentId === student.id)?.reason
                  const exams = getStudentExams(student.id)

                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{student.id}</td>
                      <td className="px-4 py-3 text-sm">{student.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{student.program}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline">{exams.length}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {isBlocked ? (
                          <div>
                            <Badge variant="destructive">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              BLOCKED
                            </Badge>
                            {blockReason && (
                              <div className="text-xs text-red-600 mt-1">{blockReason}</div>
                            )}
                          </div>
                        ) : (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            CLEARED
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date().toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedStudent(student)
                              setShowPreviewDialog(true)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePrintAdmitCard(student)}
                          >
                            <Printer className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filteredStudents.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No students found matching the filters
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Admit Card Preview</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="text-center">
                <img
                  src={selectedStudent.photoUrl}
                  alt={selectedStudent.name}
                  className="w-24 h-24 rounded-full mx-auto object-cover mb-4"
                />
                <h3 className="font-bold text-lg">{selectedStudent.name}</h3>
                <div className="text-sm text-gray-600">
                  {selectedStudent.id} · {selectedStudent.ugcId}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-xs text-gray-600">Program</div>
                  <div className="font-medium">{selectedStudent.programName}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Semester</div>
                  <div className="font-medium">{selectedStudent.semester}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Email</div>
                  <div className="font-medium text-sm">{selectedStudent.email}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Mobile</div>
                  <div className="font-medium">{selectedStudent.mobile}</div>
                </div>
              </div>

              {selectedStudent.admitBlocked && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-600 font-medium mb-1">
                    <AlertCircle className="w-4 h-4" />
                    ADMIT CARD BLOCKED
                  </div>
                  <div className="text-sm text-red-600">{selectedStudent.blockReason}</div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  handlePrintAdmitCard(selectedStudent)
                  setShowPreviewDialog(false)
                }} className="bg-deep-plum hover:bg-deep-plum/90">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
