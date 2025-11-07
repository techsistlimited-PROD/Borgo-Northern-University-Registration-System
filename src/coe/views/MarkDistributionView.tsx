import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Plus, HelpCircle, FileText, FileSpreadsheet } from 'lucide-react'
import DistributionTemplateCard from '@/coe/components/DistributionTemplateCard'
import DistributionEditorDialog from '@/coe/components/DistributionEditorDialog'
import CourseDistributionGrid from '@/coe/components/CourseDistributionGrid'
import UploadExcelDrawer from '@/coe/components/UploadExcelDrawer'
import {
  getAllSemesters,
  getAllPrograms,
  getExamTypeList,
  listCoursesByProgram,
  listSections,
  getMarkDistributionTemplates
} from '@/coe/data/selectors'
import { GLOBAL_GRADE_SCALE } from '@/coe/data/gradePolicy'
import { MarkDistributionTemplate } from '@/coe/utils/marks'

interface CourseDistribution {
  courseCode: string
  courseName: string
  section: string
  components: { name: string; weight: number; policyNote: string }[]
  isLocked: boolean
}

interface ProcessedMark {
  studentId: string
  studentName: string
  components: { [key: string]: number }
  total: number
  letterGrade: string
  gradePoint: number
  status: string
}

export default function MarkDistributionView() {
  const semesters = getAllSemesters()
  const programs = getAllPrograms()
  const examTypes = getExamTypeList()
  const distributionTemplates = getMarkDistributionTemplates()

  const [selectedSemester, setSelectedSemester] = useState(
    semesters.find(s => s.isCurrentExam)?.id || semesters[0]?.id
  )
  const [selectedProgram, setSelectedProgram] = useState('ALL')
  const [selectedExamType, setSelectedExamType] = useState('FINAL')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedSection, setSelectedSection] = useState('')

  const [customTemplates, setCustomTemplates] = useState<MarkDistributionTemplate[]>([])
  const [courseDistributions, setCourseDistributions] = useState<
    Map<string, CourseDistribution>
  >(new Map())
  const [uploadedMarks, setUploadedMarks] = useState<ProcessedMark[]>([])

  const [showEditorDialog, setShowEditorDialog] = useState(false)
  const [showUploadDrawer, setShowUploadDrawer] = useState(false)
  const [showHelpPopover, setShowHelpPopover] = useState(false)
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create')
  const [editingTemplateId, setEditingTemplateId] = useState<string | undefined>()

  const courses = useMemo(
    () => listCoursesByProgram(selectedProgram, selectedSemester),
    [selectedProgram, selectedSemester]
  )

  const sections = useMemo(
    () => (selectedCourse ? listSections(selectedCourse, selectedSemester) : []),
    [selectedCourse, selectedSemester]
  )

  useEffect(() => {
    if (courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0].code)
    }
  }, [courses])

  useEffect(() => {
    if (sections.length > 0 && !selectedSection) {
      setSelectedSection(sections[0])
    }
  }, [sections])

  const allTemplates = useMemo(() => {
    const baseTemplates = distributionTemplates.map(dt => {
      const components: { name: string; weight: number }[] = []

      if (dt.attendance.enabled) {
        components.push({ name: 'Attendance', weight: dt.attendance.percentage })
      }
      if (dt.ca.enabled) {
        components.push({ name: 'CA', weight: dt.ca.percentage })
      }
      if (dt.midterm.enabled) {
        components.push({ name: 'Midterm', weight: dt.midterm.percentage })
      }
      if (dt.final.enabled) {
        components.push({ name: 'Final', weight: dt.final.percentage })
      }

      return {
        id: dt.id,
        name: `${dt.courseCode} - ${dt.courseName} (${dt.section})`,
        schemeType: dt.is100MarkScheme ? ('single-100' as const) : ('four-part' as const),
        components,
        locked: dt.locked,
        total: dt.total
      }
    })

    const customTemplateMapped = customTemplates.map((ct, idx) => ({
      id: `custom-${idx}`,
      name: ct.name,
      schemeType: ct.schemeType,
      components: ct.components,
      locked: false,
      total: ct.total
    }))

    return [...baseTemplates, ...customTemplateMapped]
  }, [distributionTemplates, customTemplates])

  const currentDistribution = useMemo(() => {
    if (!selectedCourse || !selectedSection) return null

    const key = `${selectedCourse}-${selectedSection}-${selectedSemester}`
    const existing = courseDistributions.get(key)

    if (existing) {
      return existing
    }

    const templateForCourse = distributionTemplates.find(
      dt =>
        dt.courseCode === selectedCourse &&
        dt.section === selectedSection &&
        dt.semesterId === selectedSemester
    )

    if (templateForCourse) {
      const components: { name: string; weight: number; policyNote: string }[] = []

      if (templateForCourse.attendance.enabled) {
        components.push({
          name: 'Attendance',
          weight: templateForCourse.attendance.percentage,
          policyNote: 'Regular attendance tracking'
        })
      }
      if (templateForCourse.ca.enabled) {
        components.push({
          name: 'CA',
          weight: templateForCourse.ca.percentage,
          policyNote: 'Continuous Assessment (quizzes, assignments)'
        })
      }
      if (templateForCourse.midterm.enabled) {
        components.push({
          name: 'Midterm',
          weight: templateForCourse.midterm.percentage,
          policyNote: 'Mid-semester examination'
        })
      }
      if (templateForCourse.final.enabled) {
        components.push({
          name: 'Final',
          weight: templateForCourse.final.percentage,
          policyNote: 'Final examination using grade policy from Grading Policy view'
        })
      }

      return {
        courseCode: templateForCourse.courseCode,
        courseName: templateForCourse.courseName,
        section: templateForCourse.section,
        components,
        isLocked: templateForCourse.locked
      }
    }

    return null
  }, [selectedCourse, selectedSection, selectedSemester, courseDistributions, distributionTemplates])

  const handleApplyTemplate = (templateId: string) => {
    const template = allTemplates.find(t => t.id === templateId)
    if (!template || !selectedCourse || !selectedSection) return

    const key = `${selectedCourse}-${selectedSection}-${selectedSemester}`
    const courseName =
      courses.find(c => c.code === selectedCourse)?.name || 'Unknown Course'

    const components = template.components.map(c => ({
      name: c.name,
      weight: c.weight,
      policyNote: getPolicyNote(c.name)
    }))

    const newDistribution: CourseDistribution = {
      courseCode: selectedCourse,
      courseName,
      section: selectedSection,
      components,
      isLocked: false
    }

    setCourseDistributions(new Map(courseDistributions.set(key, newDistribution)))
  }

  const getPolicyNote = (componentName: string): string => {
    const name = componentName.toLowerCase()
    if (name.includes('attendance')) return 'Regular attendance tracking'
    if (name.includes('ca')) return 'Continuous Assessment (quizzes, assignments)'
    if (name.includes('midterm') || name.includes('mid')) return 'Mid-semester examination'
    if (name.includes('final')) return 'Final examination using grade policy from Grading Policy view'
    if (name.includes('total') || name.includes('100')) return 'Single 100-mark scheme'
    return 'Additional component'
  }

  const handleEditTemplate = (templateId: string) => {
    const template = allTemplates.find(t => t.id === templateId)
    if (template) {
      setEditorMode('edit')
      setEditingTemplateId(templateId)
      setShowEditorDialog(true)
    }
  }

  const handleDuplicateTemplate = (templateId: string) => {
    const template = allTemplates.find(t => t.id === templateId)
    if (template) {
      const duplicated: MarkDistributionTemplate = {
        ...template,
        name: `${template.name} (Copy)`
      }
      setCustomTemplates([...customTemplates, duplicated])
    }
  }

  const handleArchiveTemplate = (templateId: string) => {
    if (confirm('Archive this template? It will be removed from the library.')) {
      setCustomTemplates(customTemplates.filter((_, idx) => `custom-${idx}` !== templateId))
    }
  }

  const handleSaveTemplate = (template: MarkDistributionTemplate) => {
    if (editorMode === 'create') {
      setCustomTemplates([...customTemplates, template])
    } else if (editorMode === 'edit' && editingTemplateId) {
      const idx = parseInt(editingTemplateId.replace('custom-', ''))
      if (!isNaN(idx)) {
        const updated = [...customTemplates]
        updated[idx] = template
        setCustomTemplates(updated)
      }
    }
  }

  const handleSaveDistribution = (components: { name: string; weight: number; policyNote: string }[]) => {
    if (!selectedCourse || !selectedSection) return

    const key = `${selectedCourse}-${selectedSection}-${selectedSemester}`
    const courseName = courses.find(c => c.code === selectedCourse)?.name || 'Unknown Course'

    const updated: CourseDistribution = {
      courseCode: selectedCourse,
      courseName,
      section: selectedSection,
      components,
      isLocked: currentDistribution?.isLocked || false
    }

    setCourseDistributions(new Map(courseDistributions.set(key, updated)))
  }

  const handleRevertDistribution = () => {
    if (!selectedCourse || !selectedSection) return

    const key = `${selectedCourse}-${selectedSection}-${selectedSemester}`
    const updated = new Map(courseDistributions)
    updated.delete(key)
    setCourseDistributions(updated)
  }

  const handleToggleLock = () => {
    if (!selectedCourse || !selectedSection || !currentDistribution) return

    const key = `${selectedCourse}-${selectedSection}-${selectedSemester}`
    const updated: CourseDistribution = {
      ...currentDistribution,
      isLocked: !currentDistribution.isLocked
    }

    setCourseDistributions(new Map(courseDistributions.set(key, updated)))
  }

  const handleSaveMarks = (marks: ProcessedMark[]) => {
    setUploadedMarks(marks)
  }

  const handleExportCSV = () => {
    if (!currentDistribution) return

    const csvRows = [
      [
        'Component',
        'Weight (%)',
        'Policy Note'
      ],
      ...currentDistribution.components.map(c => [
        c.name,
        c.weight.toString(),
        c.policyNote
      ])
    ]

    if (uploadedMarks.length > 0) {
      csvRows.push([])
      csvRows.push(['Student Marks'])
      csvRows.push([
        'Student ID',
        'Student Name',
        ...Object.keys(uploadedMarks[0].components),
        'Total',
        'Letter Grade',
        'Grade Point',
        'Status'
      ])

      uploadedMarks.forEach(mark => {
        csvRows.push([
          mark.studentId,
          mark.studentName,
          ...Object.values(mark.components).map(String),
          mark.total.toFixed(2),
          mark.letterGrade,
          mark.gradePoint.toFixed(2),
          mark.status
        ])
      })
    }

    const csvContent = csvRows.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `mark-distribution-${selectedCourse}-${selectedSection}-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExportPDF = () => {
    window.print()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Mark Distribution Manager</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage mark distribution weights and upload student marks
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditorMode('create')
              setEditingTemplateId(undefined)
              setShowEditorDialog(true)
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Template
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
                  <strong>Mark Distribution Manager</strong> allows you to define weights for
                  Attendance, CA, Midterm, and Final components, or use a 100-mark single scheme.
                  Templates can be applied to courses and sections. Lock distributions to prevent
                  further weight changes while allowing mark uploads.
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
          <div className="grid grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <select
                value={selectedSemester}
                onChange={e => setSelectedSemester(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {semesters.map(sem => (
                  <option key={sem.id} value={sem.id}>
                    {sem.name} {sem.isCurrentExam ? '(Active)' : ''}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
              <select
                value={selectedExamType}
                onChange={e => setSelectedExamType(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {examTypes.map(type => (
                  <option key={type.code} value={type.code}>
                    {type.name}
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
                disabled={courses.length === 0}
              >
                {courses.length === 0 ? (
                  <option>No courses available</option>
                ) : (
                  courses.map(course => (
                    <option key={course.code} value={course.code}>
                      {course.code} - {course.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <select
                value={selectedSection}
                onChange={e => setSelectedSection(e.target.value)}
                className="w-full p-2 border rounded-md"
                disabled={sections.length === 0}
              >
                {sections.length === 0 ? (
                  <option>No sections</option>
                ) : (
                  sections.map(section => (
                    <option key={section} value={section}>
                      Section {section}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Templates Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {allTemplates.map(template => (
                  <DistributionTemplateCard
                    key={template.id}
                    id={template.id}
                    name={template.name}
                    schemeType={template.schemeType}
                    components={template.components.map(c => ({
                      name: c.name,
                      percentage: c.weight,
                      enabled: true
                    }))}
                    locked={template.locked}
                    onApply={handleApplyTemplate}
                    onEdit={handleEditTemplate}
                    onDuplicate={handleDuplicateTemplate}
                    onArchive={handleArchiveTemplate}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3 space-y-4">
          {currentDistribution ? (
            <>
              <CourseDistributionGrid
                courseCode={currentDistribution.courseCode}
                courseName={currentDistribution.courseName}
                section={currentDistribution.section}
                initialComponents={currentDistribution.components}
                isLocked={currentDistribution.isLocked}
                onSave={handleSaveDistribution}
                onRevert={handleRevertDistribution}
                onToggleLock={handleToggleLock}
              />

              <Card>
                <CardHeader>
                  <CardTitle>Upload Student Marks</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setShowUploadDrawer(true)}
                    disabled={currentDistribution.isLocked && uploadedMarks.length > 0}
                    className="bg-gradient-to-r from-deep-plum to-accent-purple text-white hover:opacity-90"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Upload Class Marks (Excel)
                  </Button>
                  <p className="text-xs text-gray-600 mt-2">
                    Upload student marks in Excel/CSV format. Grades will be computed using the
                    current grading policy.
                  </p>
                  {uploadedMarks.length > 0 && (
                    <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-md">
                      <p className="text-sm text-purple-800">
                        ✓ {uploadedMarks.length} student marks uploaded and processed
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center text-gray-500">
                  <p className="text-lg font-medium">Select a course and section</p>
                  <p className="text-sm mt-1">
                    Choose a course and section from the filters to view or configure its mark
                    distribution
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <DistributionEditorDialog
        open={showEditorDialog}
        onOpenChange={setShowEditorDialog}
        mode={editorMode}
        templateId={editingTemplateId}
        initialData={
          editorMode === 'edit' && editingTemplateId
            ? allTemplates.find(t => t.id === editingTemplateId)
            : undefined
        }
        onSave={handleSaveTemplate}
      />

      <UploadExcelDrawer
        open={showUploadDrawer}
        onOpenChange={setShowUploadDrawer}
        schemeType={
          currentDistribution?.components.length === 1 &&
          currentDistribution.components[0].name.toLowerCase().includes('total')
            ? 'single-100'
            : 'four-part'
        }
        componentWeights={currentDistribution?.components || []}
        gradeScale={GLOBAL_GRADE_SCALE}
        tieBreakRule="round-half-up"
        onSave={handleSaveMarks}
      />
    </div>
  )
}
