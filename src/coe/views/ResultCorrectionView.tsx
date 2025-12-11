import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Download, Plus, HelpCircle, FileText, FileSpreadsheet } from 'lucide-react'
import CorrectionQueueTable, { CorrectionQueueItem } from '@/coe/components/CorrectionQueueTable'
import CorrectionDetailDrawer from '@/coe/components/CorrectionDetailDrawer'
import CorrectionCreateDialog from '@/coe/components/CorrectionCreateDialog'
import CorrectionBulkActionsBar from '@/coe/components/CorrectionBulkActionsBar'
import { RESULT_CORRECTION_QUEUE } from '@/coe/data/resultCorrectionQueue'
import {
  getAllSemesters,
  getAllPrograms,
  listCoursesByProgram,
  listSections
} from '@/coe/data/selectors'

export default function ResultCorrectionView() {
  const semesters = getAllSemesters()
  const programs = getAllPrograms()

  const [selectedSemester, setSelectedSemester] = useState(
    semesters.find(s => s.isCurrentExam)?.id || semesters[0]?.id
  )
  const [selectedProgram, setSelectedProgram] = useState('ALL')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const [corrections, setCorrections] = useState(
    RESULT_CORRECTION_QUEUE.map(c => ({
      ...c,
      status: c.status as 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Applied'
    }))
  )

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [viewingCorrection, setViewingCorrection] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showHelpPopover, setShowHelpPopover] = useState(false)

  const courses = useMemo(
    () => (selectedProgram !== 'ALL' ? listCoursesByProgram(selectedProgram, selectedSemester) : []),
    [selectedProgram, selectedSemester]
  )

  const sections = useMemo(
    () => (selectedCourse ? listSections(selectedCourse, selectedSemester) : []),
    [selectedCourse, selectedSemester]
  )

  const filteredData = useMemo(() => {
    let filtered = corrections

    if (selectedSemester) {
      filtered = filtered.filter(c => c.semesterId === selectedSemester)
    }

    if (selectedProgram && selectedProgram !== 'ALL') {
      filtered = filtered.filter(c => c.programCode === selectedProgram)
    }

    if (selectedCourse) {
      filtered = filtered.filter(c => c.courseCode === selectedCourse)
    }

    if (selectedSection) {
      filtered = filtered.filter(c => c.section === selectedSection)
    }

    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(c => selectedStatuses.includes(c.status))
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter(c => {
        const type = getTypeName(c)
        return selectedTypes.includes(type)
      })
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        c =>
          c.studentId.toLowerCase().includes(term) ||
          c.studentName.toLowerCase().includes(term) ||
          c.requestId.toLowerCase().includes(term)
      )
    }

    return filtered
  }, [
    corrections,
    selectedSemester,
    selectedProgram,
    selectedCourse,
    selectedSection,
    selectedStatuses,
    selectedTypes,
    searchTerm
  ])

  const getTypeName = (correction: any): string => {
    if (correction.originalAttendance !== correction.requestedAttendance) return 'Component Update'
    if (correction.originalCA !== correction.requestedCA) return 'Component Update'
    if (correction.originalMidterm !== correction.requestedMidterm) return 'Script Error'
    if (correction.originalFinal !== correction.requestedFinal) return 'Script Error'
    if (correction.originalGrade !== correction.requestedGrade) return 'Grade Override'
    return 'Recheck'
  }

  const getRequestedChange = (correction: any): string => {
    const changes: string[] = []
    if (correction.originalAttendance !== correction.requestedAttendance) {
      changes.push(`Attendance ${correction.originalAttendance} → ${correction.requestedAttendance}`)
    }
    if (correction.originalCA !== correction.requestedCA) {
      changes.push(`CA ${correction.originalCA} → ${correction.requestedCA}`)
    }
    if (correction.originalMidterm !== correction.requestedMidterm) {
      changes.push(`Midterm ${correction.originalMidterm} → ${correction.requestedMidterm}`)
    }
    if (correction.originalFinal !== correction.requestedFinal) {
      changes.push(`Final ${correction.originalFinal} → ${correction.requestedFinal}`)
    }
    if (correction.originalGrade !== correction.requestedGrade) {
      changes.push(`Grade ${correction.originalGrade} → ${correction.requestedGrade}`)
    }
    if (changes.length === 0) {
      return 'Recheck requested (no value change)'
    }
    return changes.join(', ')
  }

  const queueData: CorrectionQueueItem[] = filteredData.map(c => ({
    id: c.id,
    requestId: c.requestId,
    studentId: c.studentId,
    studentName: c.studentName,
    programCode: c.programCode,
    courseCode: c.courseCode,
    courseName: c.courseName,
    section: c.section,
    examType: 'Final',
    type: getTypeName(c),
    requestedChange: getRequestedChange(c),
    status: c.status,
    submittedOn: c.requestDate,
    lastUpdated: c.reviewDate || c.requestDate
  }))

  const handleToggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status))
    } else {
      setSelectedStatuses([...selectedStatuses, status])
    }
  }

  const handleToggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type))
    } else {
      setSelectedTypes([...selectedTypes, type])
    }
  }

  const handleBulkAction = (action: string, notePrompt: string) => {
    const notes = prompt(notePrompt)
    if (!notes || !notes.trim()) {
      alert('Action notes are required')
      return
    }

    const timestamp = new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString()

    setCorrections(
      corrections.map(c => {
        if (!selectedIds.includes(c.id)) return c

        let newStatus: any = c.status
        if (action === 'approve') newStatus = 'Approved'
        if (action === 'reject') newStatus = 'Rejected'
        if (action === 'review') newStatus = 'Under Review'
        if (action === 'apply') {
          if (c.status !== 'Approved') {
            alert(`Cannot apply correction ${c.requestId} - must be Approved first`)
            return c
          }
          newStatus = 'Applied'
        }

        return {
          ...c,
          status: newStatus,
          reviewedBy: action === 'approve' || action === 'reject' ? 'COE Officer' : c.reviewedBy,
          reviewDate: action === 'approve' || action === 'reject' ? timestamp : c.reviewDate,
          reviewNotes: notes,
          auditTrail: [
            ...c.auditTrail,
            {
              action: action.charAt(0).toUpperCase() + action.slice(1),
              by: 'COE Officer',
              date: timestamp,
              notes
            }
          ]
        }
      })
    )

    setSelectedIds([])
  }

  const handleApprove = (id: string, notes: string) => {
    const timestamp = new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString()
    setCorrections(
      corrections.map(c =>
        c.id === id
          ? {
              ...c,
              status: 'Approved' as const,
              reviewedBy: 'COE Officer',
              reviewDate: timestamp,
              reviewNotes: notes,
              auditTrail: [
                ...c.auditTrail,
                {
                  action: 'Approved',
                  by: 'COE Officer',
                  date: timestamp,
                  notes
                }
              ]
            }
          : c
      )
    )
  }

  const handleReject = (id: string, notes: string) => {
    const timestamp = new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString()
    setCorrections(
      corrections.map(c =>
        c.id === id
          ? {
              ...c,
              status: 'Rejected' as const,
              reviewedBy: 'COE Officer',
              reviewDate: timestamp,
              reviewNotes: notes,
              auditTrail: [
                ...c.auditTrail,
                {
                  action: 'Rejected',
                  by: 'COE Officer',
                  date: timestamp,
                  notes
                }
              ]
            }
          : c
      )
    )
  }

  const handleMarkUnderReview = (id: string, notes: string) => {
    const timestamp = new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString()
    setCorrections(
      corrections.map(c =>
        c.id === id
          ? {
              ...c,
              status: 'Under Review' as const,
              auditTrail: [
                ...c.auditTrail,
                {
                  action: 'Under Review',
                  by: 'COE Officer',
                  date: timestamp,
                  notes
                }
              ]
            }
          : c
      )
    )
  }

  const handleApplyChanges = (id: string, notes: string) => {
    const correction = corrections.find(c => c.id === id)
    if (!correction || correction.status !== 'Approved') {
      alert('Correction must be Approved before applying changes')
      return
    }

    const timestamp = new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString()
    setCorrections(
      corrections.map(c =>
        c.id === id
          ? {
              ...c,
              status: 'Applied' as const,
              auditTrail: [
                ...c.auditTrail,
                {
                  action: 'Applied',
                  by: 'COE Officer',
                  date: timestamp,
                  notes: notes + ' - Marks updated in system.'
                }
              ]
            }
          : c
      )
    )
  }

  const handleCreateCorrection = (correctionData: any) => {
    const newId = `corr-${Date.now()}`
    const requestId = `RC-2025-${String(corrections.length + 1).padStart(3, '0')}`
    const timestamp = new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString()

    const newCorrection = {
      id: newId,
      requestId,
      studentId: correctionData.studentId,
      studentName: correctionData.studentName,
      courseCode: correctionData.courseCode,
      courseName: correctionData.courseName,
      section: correctionData.section,
      semesterId: correctionData.semesterId,
      programCode: correctionData.programCode,
      originalAttendance: correctionData.originalMarks.attendance,
      originalCA: correctionData.originalMarks.ca,
      originalMidterm: correctionData.originalMarks.midterm,
      originalFinal: correctionData.originalMarks.final,
      originalTotal: correctionData.originalMarks.total,
      originalGrade: '-',
      requestedAttendance: correctionData.requestedMarks.attendance,
      requestedCA: correctionData.requestedMarks.ca,
      requestedMidterm: correctionData.requestedMarks.midterm,
      requestedFinal: correctionData.requestedMarks.final,
      requestedTotal: correctionData.requestedMarks.total,
      requestedGrade: correctionData.requestedMarks.letterGrade,
      reason: correctionData.reason,
      requestedBy: 'Current User',
      requestDate: timestamp,
      reviewedBy: null,
      reviewDate: null,
      status: 'Submitted' as const,
      reviewNotes: '',
      auditTrail: [
        {
          action: 'Created',
          by: 'Current User',
          date: timestamp,
          notes: 'Correction request created'
        },
        {
          action: 'Submitted',
          by: 'Current User',
          date: timestamp,
          notes: 'Request submitted for review'
        }
      ]
    }

    setCorrections([...corrections, newCorrection])
  }

  const handleExportCSV = () => {
    const csvRows = [
      [
        'Ref No',
        'Student ID',
        'Student Name',
        'Program',
        'Course',
        'Section',
        'Exam Type',
        'Type',
        'Status',
        'Submitted On',
        'Last Updated',
        'Requested Summary'
      ],
      ...queueData.map(item => [
        item.requestId,
        item.studentId,
        item.studentName,
        item.programCode,
        item.courseCode,
        item.section,
        item.examType,
        item.type,
        item.status,
        item.submittedOn,
        item.lastUpdated,
        item.requestedChange
      ])
    ]

    const csvContent = csvRows.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `correction-queue-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExportPDF = () => {
    window.print()
  }

  const viewingCorrectionDetail = useMemo(() => {
    if (!viewingCorrection) return null
    const correction = corrections.find(c => c.id === viewingCorrection)
    if (!correction) return null

    return {
      id: correction.id,
      requestId: correction.requestId,
      studentId: correction.studentId,
      studentName: correction.studentName,
      programCode: correction.programCode,
      courseCode: correction.courseCode,
      courseName: correction.courseName,
      section: correction.section,
      semesterId: correction.semesterId,
      examType: 'Final',
      type: getTypeName(correction),
      status: correction.status,
      reason: correction.reason,
      requestedBy: correction.requestedBy,
      requestDate: correction.requestDate,
      reviewedBy: correction.reviewedBy,
      reviewDate: correction.reviewDate,
      reviewNotes: correction.reviewNotes,
      auditTrail: correction.auditTrail,
      originalMarks: {
        attendance: correction.originalAttendance,
        ca: correction.originalCA,
        midterm: correction.originalMidterm,
        final: correction.originalFinal,
        total: correction.originalTotal,
        letterGrade: correction.originalGrade,
        gradePoint: 0.0
      },
      requestedMarks: {
        attendance: correction.requestedAttendance,
        ca: correction.requestedCA,
        midterm: correction.requestedMidterm,
        final: correction.requestedFinal,
        total: correction.requestedTotal,
        letterGrade: correction.requestedGrade,
        gradePoint: 0.0
      }
    }
  }, [viewingCorrection, corrections])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Result Correction Manager</h1>
          <p className="text-sm text-gray-600 mt-1">
            Review and process result correction requests
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-deep-plum to-accent-purple text-white hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Correction
          </Button>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onMouseEnter={() => setShowHelpPopover(true)}
              onMouseLeave={() => setShowHelpPopover(false)}
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
            {showHelpPopover && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border shadow-lg rounded-md p-4 z-10">
                <p className="text-xs text-gray-700">
                  <strong>Result Correction Flow:</strong> Submit → Under Review → Approved/Rejected → Applied.
                  Only Approved corrections can have changes applied to update student marks.
                </p>
              </div>
            )}
          </div>
          <div className="relative group">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <div className="absolute right-0 top-full mt-1 w-40 bg-white border shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={handleExportCSV}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={handleExportPDF}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-700">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <select
                value={selectedSemester}
                onChange={e => setSelectedSemester(e.target.value)}
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
                value={selectedProgram}
                onChange={e => setSelectedProgram(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {programs.map(prog => (
                  <option key={prog.id} value={prog.code}>
                    {prog.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <select
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
                className="w-full p-2 border rounded-md"
                disabled={selectedProgram === 'ALL'}
              >
                <option value="">All Courses</option>
                {courses.map(course => (
                  <option key={course.code} value={course.code}>
                    {course.code}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <select
                value={selectedSection}
                onChange={e => setSelectedSection(e.target.value)}
                className="w-full p-2 border rounded-md"
                disabled={!selectedCourse}
              >
                <option value="">All Sections</option>
                {sections.map(section => (
                  <option key={section} value={section}>
                    Section {section}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex flex-wrap gap-2">
                {['Submitted', 'Under Review', 'Approved', 'Rejected', 'Applied'].map(status => (
                  <Badge
                    key={status}
                    variant={selectedStatuses.includes(status) ? 'default' : 'outline'}
                    className={`cursor-pointer ${
                      selectedStatuses.includes(status)
                        ? 'bg-gradient-to-r from-deep-plum to-accent-purple text-white'
                        : ''
                    }`}
                    onClick={() => handleToggleStatus(status)}
                  >
                    {status}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <div className="flex flex-wrap gap-2">
                {['Recheck', 'Script Error', 'Late Entry', 'Component Update', 'Grade Override'].map(type => (
                  <Badge
                    key={type}
                    variant={selectedTypes.includes(type) ? 'default' : 'outline'}
                    className={`cursor-pointer ${
                      selectedTypes.includes(type)
                        ? 'bg-gradient-to-r from-deep-plum to-accent-purple text-white'
                        : ''
                    }`}
                    onClick={() => handleToggleType(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <Input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Student ID / Name / Ref No"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <CorrectionBulkActionsBar
        selectedCount={selectedIds.length}
        onApprove={() => handleBulkAction('approve', 'Enter approval notes:')}
        onReject={() => handleBulkAction('reject', 'Enter rejection notes:')}
        onMarkUnderReview={() => handleBulkAction('review', 'Enter review notes:')}
        onApplyChanges={() => handleBulkAction('apply', 'Enter application notes:')}
        onClearSelection={() => setSelectedIds([])}
      />

      <CorrectionQueueTable
        data={queueData}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onView={setViewingCorrection}
      />

      <CorrectionDetailDrawer
        open={!!viewingCorrection}
        onOpenChange={open => !open && setViewingCorrection(null)}
        correction={viewingCorrectionDetail}
        onApprove={handleApprove}
        onReject={handleReject}
        onMarkUnderReview={handleMarkUnderReview}
        onApplyChanges={handleApplyChanges}
      />

      <CorrectionCreateDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateCorrection}
      />
    </div>
  )
}
