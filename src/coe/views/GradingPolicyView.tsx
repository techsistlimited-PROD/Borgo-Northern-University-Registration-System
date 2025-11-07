import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Edit, Eye, FileText, FileSpreadsheet } from 'lucide-react'
import GradeScaleTable from '@/coe/components/GradeScaleTable'
import CgpaBandsCard from '@/coe/components/CgpaBandsCard'
import PolicyEditorDialog from '@/coe/components/PolicyEditorDialog'
import PreviewCalculationDrawer from '@/coe/components/PreviewCalculationDrawer'
import { PolicyEditFormData } from '@/coe/data/types'
import { GLOBAL_GRADE_SCALE, CGPA_BANDS } from '@/coe/data/gradePolicy'
import { getAllSemesters, getAllPrograms, getExamTypeList } from '@/coe/data/selectors'
import { EXAM_TYPES } from '@/coe/data/examTypes'

export default function GradingPolicyView() {
  const semesters = getAllSemesters()
  const programs = getAllPrograms()
  const examTypes = getExamTypeList()

  const [selectedSemester, setSelectedSemester] = useState(semesters.find(s => s.isCurrentExam)?.id || semesters[0]?.id)
  const [selectedProgram, setSelectedProgram] = useState('all')
  const [selectedExamType, setSelectedExamType] = useState('FINAL')

  const [currentPolicy, setCurrentPolicy] = useState<PolicyEditFormData>({
    gradeScale: [...GLOBAL_GRADE_SCALE],
    passingGrade: 'D',
    tieBreakRule: 'round-half-up',
    applicableExamTypes: EXAM_TYPES.map(t => t.code)
  })

  const [showEditorDialog, setShowEditorDialog] = useState(false)
  const [showPreviewDrawer, setShowPreviewDrawer] = useState(false)
  const [isPolicyEdited, setIsPolicyEdited] = useState(false)

  const handleSavePolicy = (policy: PolicyEditFormData) => {
    setCurrentPolicy(policy)
    setIsPolicyEdited(true)
  }

  const handleExportCSV = () => {
    const csvRows = [
      ['Letter Grade', 'Grade Point', 'Min Marks', 'Max Marks', 'Description'],
      ...currentPolicy.gradeScale.map(g => [
        g.letterGrade,
        g.gradePoint.toFixed(2),
        g.minMarks.toString(),
        g.maxMarks.toString(),
        g.description
      ])
    ]

    const csvContent = csvRows.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `grading-policy-${new Date().toISOString().split('T')[0]}.csv`
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
          <h1 className="text-2xl font-bold text-deep-plum">Grading Policy</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage grade scale and CGPA classification bands
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreviewDrawer(true)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Calculation
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEditorDialog(true)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Policy
          </Button>
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
          <div className="grid grid-cols-3 gap-4">
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
          </div>
          <p className="text-xs text-gray-600 mt-3">
            Filters affect preview calculations and mark distribution notes. The policy table is
            global.
          </p>
        </CardContent>
      </Card>

      {isPolicyEdited && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <h4 className="font-semibold text-amber-800 text-sm">Policy Modified</h4>
              <p className="text-xs text-amber-700 mt-1">
                You have edited the grading policy. Changes are applied to calculations but not
                permanently saved. Refresh the page to revert to defaults.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Grade Scale</CardTitle>
            </CardHeader>
            <CardContent>
              <GradeScaleTable
                gradeScale={currentPolicy.gradeScale}
                passingGrade={currentPolicy.passingGrade}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <CgpaBandsCard cgpaBands={CGPA_BANDS} />
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Note:</span> Mark distributions are managed separately
          under Mark Distribution Manager. This policy is used for grade computation across all
          mark templates.
        </p>
      </div>

      <PolicyEditorDialog
        open={showEditorDialog}
        onOpenChange={setShowEditorDialog}
        currentPolicy={currentPolicy}
        onSave={handleSavePolicy}
      />

      <PreviewCalculationDrawer
        open={showPreviewDrawer}
        onOpenChange={setShowPreviewDrawer}
        currentGradeScale={currentPolicy.gradeScale}
        isEdited={isPolicyEdited}
      />

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content, .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
