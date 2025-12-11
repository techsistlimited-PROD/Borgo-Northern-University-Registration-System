import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Save, AlertTriangle } from 'lucide-react'
import { RequestedCourse } from '@/coe/data/courseExemptions'

interface CECoursePickerProps {
  requestedCourses: RequestedCourse[]
  exemptedCourses: RequestedCourse[]
  onUpdate: (exemptedCourses: RequestedCourse[]) => void
  readOnly?: boolean
}

export default function CECoursePicker({
  requestedCourses,
  exemptedCourses,
  onUpdate,
  readOnly = false
}: CECoursePickerProps) {
  const [localExempted, setLocalExempted] = useState<RequestedCourse[]>(exemptedCourses)

  useEffect(() => {
    setLocalExempted(exemptedCourses)
  }, [exemptedCourses])

  const handleToggleCourse = (course: RequestedCourse) => {
    const exists = localExempted.find(c => c.code === course.code)
    
    if (exists) {
      const updated = localExempted.map(c =>
        c.code === course.code ? { ...c, selected: !c.selected } : c
      )
      setLocalExempted(updated)
    } else {
      setLocalExempted([...localExempted, { ...course, selected: true }])
    }
  }

  const handleSave = () => {
    onUpdate(localExempted)
  }

  const totalRequestedCredits = requestedCourses.reduce((sum, c) => sum + c.credit, 0)
  const totalExemptedCredits = localExempted
    .filter(c => c.selected)
    .reduce((sum, c) => sum + c.credit, 0)
  
  const exceedsLimit = totalExemptedCredits > 12

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-deep-plum mb-2">Requested Courses</h3>
          <div className="border rounded-md p-3 space-y-2 max-h-64 overflow-y-auto">
            {requestedCourses.map((course, idx) => {
              const isExempted = localExempted.find(c => c.code === course.code && c.selected)
              
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-2 rounded ${
                    isExempted ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                  }`}
                >
                  <Checkbox
                    checked={!!isExempted}
                    onCheckedChange={() => handleToggleCourse(course)}
                    disabled={readOnly}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{course.code}</div>
                    <div className="text-xs text-gray-600">{course.title}</div>
                    <Badge variant="outline" className="text-xs mt-1">
                      {course.credit} credits
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-deep-plum mb-2">Exemptable Courses (Selected)</h3>
          <div className="border rounded-md p-3 space-y-2 max-h-64 overflow-y-auto">
            {localExempted.filter(c => c.selected).length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-4">
                No courses selected for exemption
              </div>
            ) : (
              localExempted
                .filter(c => c.selected)
                .map((course, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-2 rounded bg-green-50 border border-green-200"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">{course.code}</div>
                      <div className="text-xs text-gray-600">{course.title}</div>
                      <Badge className="bg-green-100 text-green-800 text-xs mt-1">
                        {course.credit} credits
                      </Badge>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md border">
        <div className="flex gap-4 text-sm">
          <div>
            <span className="font-medium">Total Requested:</span>{' '}
            <Badge variant="outline">{totalRequestedCredits} cr</Badge>
          </div>
          <div>
            <span className="font-medium">Total Exempted:</span>{' '}
            <Badge className={exceedsLimit ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
              {totalExemptedCredits} cr
            </Badge>
          </div>
          {exceedsLimit && (
            <div className="flex items-center gap-1 text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span>Exceeds 12 credit limit</span>
            </div>
          )}
        </div>

        {!readOnly && (
          <Button size="sm" onClick={handleSave} className="bg-deep-plum hover:bg-accent-purple">
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
        )}
      </div>

      {!readOnly && localExempted.filter(c => c.selected).length === 0 && (
        <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 p-3 rounded-md">
          Please select at least one course to mark as Evaluated.
        </div>
      )}
    </div>
  )
}
