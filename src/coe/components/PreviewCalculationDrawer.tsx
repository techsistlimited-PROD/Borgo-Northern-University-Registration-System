import { useState, useEffect, useMemo } from 'react'
import { GradeScale, GradeCalculationResult } from '@/coe/data/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getUniqueStudents } from '@/coe/data/selectors'
import { STUDENT_MARKS } from '@/coe/data/studentMarks'
import { GLOBAL_GRADE_SCALE } from '@/coe/data/gradePolicy'
import { Badge } from '@/components/ui/badge'
import { Info } from 'lucide-react'

interface PreviewCalculationDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentGradeScale: GradeScale[]
  isEdited: boolean
}

export default function PreviewCalculationDrawer({
  open,
  onOpenChange,
  currentGradeScale,
  isEdited
}: PreviewCalculationDrawerProps) {
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])
  const availableStudents = useMemo(() => getUniqueStudents(), [])

  useEffect(() => {
    if (selectedStudentIds.length === 0 && availableStudents.length > 0) {
      setSelectedStudentIds(availableStudents.slice(0, 5).map(s => s.studentId))
    }
  }, [availableStudents])

  const calculateGrade = (total: number, gradeScale: GradeScale[]): { letter: string; point: number } => {
    const grade = gradeScale.find(g => total >= g.minMarks && total <= g.maxMarks)
    return {
      letter: grade?.letterGrade || 'F',
      point: grade?.gradePoint || 0.0
    }
  }

  const calculationResults: GradeCalculationResult[] = useMemo(() => {
    return STUDENT_MARKS.filter(mark => selectedStudentIds.includes(mark.studentId)).map(mark => {
      const { letter, point } = calculateGrade(mark.total, currentGradeScale)
      return {
        studentId: mark.studentId,
        studentName: mark.studentName,
        attendance: mark.attendance,
        ca: mark.ca,
        midterm: mark.midterm,
        final: mark.final,
        total: mark.total,
        letterGrade: letter,
        gradePoint: point
      }
    })
  }, [selectedStudentIds, currentGradeScale])

  const toggleStudent = (studentId: string) => {
    if (selectedStudentIds.includes(studentId)) {
      setSelectedStudentIds(selectedStudentIds.filter(id => id !== studentId))
    } else {
      if (selectedStudentIds.length < 10) {
        setSelectedStudentIds([...selectedStudentIds, studentId])
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Grade Calculation Preview</DialogTitle>
        </DialogHeader>

        {isEdited && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-amber-800 text-sm">Policy Modified</h4>
                <p className="text-xs text-amber-700 mt-1">
                  Calculations below use your edited policy, not the system defaults. Changes are
                  not saved to the database until you click "Save Changes" in the policy editor.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 flex-1 overflow-hidden">
          <div className="w-64 flex-shrink-0 overflow-y-auto border-r pr-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Students (max 10)
                </label>
                <p className="text-xs text-gray-600 mb-3">
                  {selectedStudentIds.length} of 10 selected
                </p>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {availableStudents.map(student => (
                    <label
                      key={student.studentId}
                      className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.includes(student.studentId)}
                        onChange={() => toggleStudent(student.studentId)}
                        disabled={
                          !selectedStudentIds.includes(student.studentId) &&
                          selectedStudentIds.length >= 10
                        }
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">
                          {student.studentName}
                        </div>
                        <div className="text-xs text-gray-600">{student.studentId}</div>
                        <div className="text-xs text-gray-500">
                          {student.courseCode} - {student.section}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {calculationResults.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No students selected. Please select at least one student to preview calculations.</p>
                </div>
              ) : (
                calculationResults.map(result => {
                  const originalMark = STUDENT_MARKS.find(m => m.studentId === result.studentId)
                  const originalGrade = originalMark
                    ? calculateGrade(originalMark.total, GLOBAL_GRADE_SCALE)
                    : null
                  const gradeChanged =
                    originalGrade &&
                    (originalGrade.letter !== result.letterGrade ||
                      originalGrade.point !== result.gradePoint)

                  return (
                    <div key={result.studentId} className="border rounded-lg p-4 bg-white shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-deep-plum">{result.studentName}</h4>
                          <p className="text-xs text-gray-600">{result.studentId}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Badge
                              className={`text-lg font-bold ${
                                gradeChanged ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {result.letterGrade}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              ({result.gradePoint.toFixed(2)})
                            </span>
                          </div>
                          {gradeChanged && (
                            <p className="text-xs text-amber-600 mt-1">
                              Changed from {originalGrade?.letter}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-5 gap-3 text-sm">
                        {result.attendance !== null && (
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-xs text-gray-600">Attendance</p>
                            <p className="font-semibold text-deep-plum">{result.attendance}</p>
                          </div>
                        )}
                        {result.ca !== null && (
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-xs text-gray-600">CA</p>
                            <p className="font-semibold text-deep-plum">{result.ca}</p>
                          </div>
                        )}
                        {result.midterm !== null && (
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-xs text-gray-600">Midterm</p>
                            <p className="font-semibold text-deep-plum">{result.midterm}</p>
                          </div>
                        )}
                        {result.final !== null && (
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-xs text-gray-600">Final</p>
                            <p className="font-semibold text-deep-plum">{result.final}</p>
                          </div>
                        )}
                        <div className="bg-gradient-to-br from-deep-plum to-accent-purple p-2 rounded text-white">
                          <p className="text-xs">Total</p>
                          <p className="font-bold text-lg">{result.total}</p>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
