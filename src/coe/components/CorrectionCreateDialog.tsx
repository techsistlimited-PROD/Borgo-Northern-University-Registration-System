import { useState, useEffect, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { X, Plus, AlertCircle } from 'lucide-react'
import {
  getStudentMarksList,
  getAllSemesters,
  getAllPrograms,
  getExamTypeList,
  listCoursesByProgram,
  listSections,
  getStudentMarks
} from '@/coe/data/selectors'
import { recomputeAfterCorrection } from '@/coe/utils/marks'
import { GLOBAL_GRADE_SCALE } from '@/coe/data/gradePolicy'

interface CorrectionCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (correction: any) => void
}

export default function CorrectionCreateDialog({
  open,
  onOpenChange,
  onSubmit
}: CorrectionCreateDialogProps) {
  const studentMarks = getStudentMarksList()
  const semesters = getAllSemesters()
  const programs = getAllPrograms()
  const examTypes = getExamTypeList()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<{
    id: string
    name: string
    programCode: string
  } | null>(null)

  const [semesterId, setSemesterId] = useState(semesters.find(s => s.isCurrentExam)?.id || semesters[0]?.id)
  const [programCode, setProgramCode] = useState('')
  const [courseCode, setCourseCode] = useState('')
  const [section, setSection] = useState('')
  const [examType, setExamType] = useState('Final')
  const [correctionType, setCorrectionType] = useState<
    'Recheck' | 'Script Error' | 'Late Entry' | 'Component Update' | 'Grade Override'
  >('Script Error')

  const [originalMarks, setOriginalMarks] = useState({
    attendance: 0,
    ca: 0,
    midterm: 0,
    final: 0
  })

  const [requestedMarks, setRequestedMarks] = useState({
    attendance: 0,
    ca: 0,
    midterm: 0,
    final: 0
  })

  const [reason, setReason] = useState('')
  const [attachments, setAttachments] = useState<string[]>([])
  const [newAttachment, setNewAttachment] = useState('')

  const [gradeOverride, setGradeOverride] = useState({
    enabled: false,
    letter: '',
    gradePoint: 0
  })

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return []
    const term = searchTerm.toLowerCase()
    return studentMarks
      .filter(
        m =>
          m.studentId.toLowerCase().includes(term) ||
          m.studentName.toLowerCase().includes(term)
      )
      .slice(0, 10)
  }, [searchTerm, studentMarks])

  const courses = useMemo(
    () => (programCode ? listCoursesByProgram(programCode, semesterId) : []),
    [programCode, semesterId]
  )

  const sections = useMemo(
    () => (courseCode ? listSections(courseCode, semesterId) : []),
    [courseCode, semesterId]
  )

  useEffect(() => {
    if (selectedStudent) {
      setProgramCode(selectedStudent.programCode)
    }
  }, [selectedStudent])

  useEffect(() => {
    if (selectedStudent && courseCode && section && semesterId) {
      const marks = getStudentMarks(selectedStudent.id, courseCode, section, semesterId)
      if (marks) {
        setOriginalMarks({
          attendance: marks.attendance ?? 0,
          ca: marks.ca ?? 0,
          midterm: marks.midterm ?? 0,
          final: marks.final ?? 0
        })
        setRequestedMarks({
          attendance: marks.attendance ?? 0,
          ca: marks.ca ?? 0,
          midterm: marks.midterm ?? 0,
          final: marks.final ?? 0
        })
      }
    }
  }, [selectedStudent, courseCode, section, semesterId])

  const computed = useMemo(() => {
    const weights = { attendance: 10, ca: 20, midterm: 30, final: 40 }
    return recomputeAfterCorrection(
      requestedMarks.attendance,
      requestedMarks.ca,
      requestedMarks.midterm,
      requestedMarks.final,
      weights,
      GLOBAL_GRADE_SCALE,
      'round-half-up',
      gradeOverride.enabled,
      gradeOverride.letter,
      gradeOverride.gradePoint
    )
  }, [requestedMarks, gradeOverride])

  const handleSelectStudent = (student: any) => {
    setSelectedStudent({
      id: student.studentId,
      name: student.studentName,
      programCode: student.programCode
    })
    setSearchTerm('')
  }

  const handleAddAttachment = () => {
    if (newAttachment.trim()) {
      setAttachments([...attachments, newAttachment.trim()])
      setNewAttachment('')
    }
  }

  const handleRemoveAttachment = (idx: number) => {
    setAttachments(attachments.filter((_, i) => i !== idx))
  }

  const handleSubmit = () => {
    if (!selectedStudent || !courseCode || !section || !reason.trim() || reason.length < 10) {
      alert('Please fill all required fields (reason must be at least 10 characters)')
      return
    }

    const correction = {
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      programCode,
      courseCode,
      courseName: courses.find(c => c.code === courseCode)?.name || courseCode,
      section,
      semesterId,
      examType,
      type: correctionType,
      originalMarks: {
        attendance: originalMarks.attendance,
        ca: originalMarks.ca,
        midterm: originalMarks.midterm,
        final: originalMarks.final,
        total:
          (originalMarks.attendance * 10) / 100 +
          (originalMarks.ca * 20) / 100 +
          (originalMarks.midterm * 30) / 100 +
          (originalMarks.final * 40) / 100
      },
      requestedMarks: {
        attendance: requestedMarks.attendance,
        ca: requestedMarks.ca,
        midterm: requestedMarks.midterm,
        final: requestedMarks.final,
        total: computed.total,
        letterGrade: computed.letterGrade,
        gradePoint: computed.gradePoint
      },
      reason,
      attachments,
      gradeOverride: gradeOverride.enabled ? gradeOverride : null
    }

    onSubmit(correction)
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setSelectedStudent(null)
    setSearchTerm('')
    setProgramCode('')
    setCourseCode('')
    setSection('')
    setExamType('Final')
    setCorrectionType('Script Error')
    setOriginalMarks({ attendance: 0, ca: 0, midterm: 0, final: 0 })
    setRequestedMarks({ attendance: 0, ca: 0, midterm: 0, final: 0 })
    setReason('')
    setAttachments([])
    setGradeOverride({ enabled: false, letter: '', gradePoint: 0 })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Correction Request</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by Student ID or Name..."
                disabled={!!selectedStudent}
              />
              {selectedStudent && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-between">
                  <div>
                    <span className="font-medium">{selectedStudent.name}</span>
                    <span className="text-sm text-gray-600 ml-2">({selectedStudent.id})</span>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setSelectedStudent(null)}>
                    Change
                  </Button>
                </div>
              )}
              {!selectedStudent && filteredStudents.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border shadow-lg rounded-md max-h-60 overflow-y-auto z-10">
                  {filteredStudents.map((student, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectStudent(student)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b last:border-b-0"
                    >
                      <div className="font-medium">{student.studentName}</div>
                      <div className="text-xs text-gray-600">
                        {student.studentId} • {student.programCode}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <select
                value={semesterId}
                onChange={e => setSemesterId(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {semesters.map(sem => (
                  <option key={sem.id} value={sem.id}>
                    {sem.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
              <select
                value={programCode}
                onChange={e => setProgramCode(e.target.value)}
                className="w-full p-2 border rounded-md"
                disabled={!!selectedStudent}
              >
                <option value="">Select Program</option>
                {programs
                  .filter(p => p.code !== 'ALL')
                  .map(prog => (
                    <option key={prog.id} value={prog.code}>
                      {prog.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course <span className="text-red-500">*</span>
              </label>
              <select
                value={courseCode}
                onChange={e => setCourseCode(e.target.value)}
                className="w-full p-2 border rounded-md"
                disabled={!programCode}
              >
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course.code} value={course.code}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section <span className="text-red-500">*</span>
              </label>
              <select
                value={section}
                onChange={e => setSection(e.target.value)}
                className="w-full p-2 border rounded-md"
                disabled={!courseCode}
              >
                <option value="">Select Section</option>
                {sections.map(sec => (
                  <option key={sec} value={sec}>
                    Section {sec}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
              <select
                value={examType}
                onChange={e => setExamType(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {examTypes.map(type => (
                  <option key={type.code} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correction Type</label>
              <select
                value={correctionType}
                onChange={e =>
                  setCorrectionType(
                    e.target.value as
                      | 'Recheck'
                      | 'Script Error'
                      | 'Late Entry'
                      | 'Component Update'
                      | 'Grade Override'
                  )
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="Recheck">Recheck</option>
                <option value="Script Error">Script Error</option>
                <option value="Late Entry">Late Entry</option>
                <option value="Component Update">Component Update</option>
                <option value="Grade Override">Grade Override</option>
              </select>
            </div>
          </div>

          {correctionType === 'Grade Override' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="gradeOverrideEnabled"
                  checked={gradeOverride.enabled}
                  onChange={e => setGradeOverride({ ...gradeOverride, enabled: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="gradeOverrideEnabled" className="text-sm font-medium">
                  Enable Grade Override
                </label>
              </div>
              {gradeOverride.enabled && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">Override Letter Grade</label>
                    <Input
                      value={gradeOverride.letter}
                      onChange={e => setGradeOverride({ ...gradeOverride, letter: e.target.value })}
                      placeholder="e.g., A+"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Override Grade Point</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={gradeOverride.gradePoint}
                      onChange={e =>
                        setGradeOverride({ ...gradeOverride, gradePoint: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="e.g., 4.00"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <h4 className="font-semibold text-sm text-deep-plum mb-2">Component Marks</h4>
            <div className="overflow-x-auto border rounded-md">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2 border-b font-semibold">Component</th>
                    <th className="text-right p-2 border-b font-semibold">Original</th>
                    <th className="text-right p-2 border-b font-semibold">Requested</th>
                  </tr>
                </thead>
                <tbody>
                  {(['attendance', 'ca', 'midterm', 'final'] as const).map(comp => (
                    <tr key={comp} className="border-b">
                      <td className="p-2 capitalize">{comp}</td>
                      <td className="p-2 text-right text-gray-600">{originalMarks[comp]}</td>
                      <td className="p-2 text-right">
                        <Input
                          type="number"
                          min="0"
                          max={comp === 'attendance' ? 10 : comp === 'ca' ? 20 : comp === 'midterm' ? 30 : 40}
                          value={requestedMarks[comp]}
                          onChange={e =>
                            setRequestedMarks({
                              ...requestedMarks,
                              [comp]: parseFloat(e.target.value) || 0
                            })
                          }
                          className="w-20 text-right"
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-semibold">
                    <td className="p-2">Total</td>
                    <td className="p-2 text-right">
                      {(
                        (originalMarks.attendance * 10) / 100 +
                        (originalMarks.ca * 20) / 100 +
                        (originalMarks.midterm * 30) / 100 +
                        (originalMarks.final * 40) / 100
                      ).toFixed(2)}
                    </td>
                    <td className="p-2 text-right">{computed.total.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="p-2">Letter Grade</td>
                    <td className="p-2 text-right">-</td>
                    <td className="p-2 text-right">
                      <Badge variant="outline">{computed.letterGrade}</Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2">Grade Point</td>
                    <td className="p-2 text-right">-</td>
                    <td className="p-2 text-right">{computed.gradePoint.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Grades computed using current grading policy (weights: Attendance 10%, CA 20%, Midterm 30%, Final 40%)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Explain the reason for this correction request (minimum 10 characters)..."
              rows={4}
              className="w-full"
            />
            {reason.length > 0 && reason.length < 10 && (
              <p className="text-xs text-red-600 mt-1">
                <AlertCircle className="w-3 h-3 inline mr-1" />
                Reason must be at least 10 characters ({reason.length}/10)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attachments (Optional)</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newAttachment}
                onChange={e => setNewAttachment(e.target.value)}
                placeholder="Enter file name (e.g., script_page3.pdf)"
                onKeyPress={e => e.key === 'Enter' && handleAddAttachment()}
              />
              <Button type="button" size="sm" onClick={handleAddAttachment}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachments.map((file, idx) => (
                  <Badge key={idx} variant="outline" className="flex items-center gap-1">
                    {file}
                    <button onClick={() => handleRemoveAttachment(idx)} className="ml-1 hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedStudent || !courseCode || !section || reason.length < 10}
            className="bg-gradient-to-r from-deep-plum to-accent-purple text-white hover:opacity-90"
          >
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
