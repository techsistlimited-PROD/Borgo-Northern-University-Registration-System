import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CourseMapping, MappingDecision } from '@/coe/data/creditTransfers'
import { computeTotals, getMappingPercentage, validateMapping } from '@/coe/utils/creditTransfer'
import { AlertTriangle, Save } from 'lucide-react'

interface CTCourseMapGridProps {
  mappings: CourseMapping[]
  onUpdate: (mappings: CourseMapping[]) => void
  readOnly?: boolean
}

const SAMPLE_COURSES = [
  { code: 'CSE1101', title: 'Programming Fundamentals', credit: 3 },
  { code: 'CSE2211', title: 'Data Structures', credit: 3 },
  { code: 'CSE2101', title: 'Digital Logic Design', credit: 3 },
  { code: 'MATH201', title: 'Discrete Mathematics', credit: 3 },
  { code: 'BBA1101', title: 'Business Fundamentals', credit: 3 },
  { code: 'ACC101', title: 'Principles of Accounting', credit: 3 },
  { code: 'ECO101', title: 'Microeconomics', credit: 3 },
  { code: 'MKT201', title: 'Principles of Marketing', credit: 3 },
  { code: 'FIN101', title: 'Financial Accounting', credit: 3 },
  { code: 'EEE1101', title: 'Circuit Analysis I', credit: 3 },
  { code: 'LAW101', title: 'Constitutional Law I', credit: 3 },
  { code: 'LAW102', title: 'Contract Law', credit: 3 }
]

export default function CTCourseMapGrid({ mappings, onUpdate, readOnly = false }: CTCourseMapGridProps) {
  const [localMappings, setLocalMappings] = useState<CourseMapping[]>(mappings)
  const [errors, setErrors] = useState<Record<number, string[]>>({})

  const handleDecisionChange = (index: number, decision: MappingDecision) => {
    const updated = [...localMappings]
    updated[index] = {
      ...updated[index],
      decision,
      targetCode: decision === 'Map' ? updated[index].targetCode : undefined,
      targetTitle: decision === 'Map' ? updated[index].targetTitle : undefined,
      targetCredit: decision === 'Map' ? updated[index].targetCredit : undefined,
      reason: decision !== 'Map' ? updated[index].reason : undefined
    }
    setLocalMappings(updated)
    validateRow(index, updated[index], updated)
  }

  const handleTargetChange = (index: number, courseCode: string) => {
    const course = SAMPLE_COURSES.find(c => c.code === courseCode)
    if (!course) return

    const updated = [...localMappings]
    updated[index] = {
      ...updated[index],
      targetCode: course.code,
      targetTitle: course.title,
      targetCredit: course.credit
    }
    setLocalMappings(updated)
    validateRow(index, updated[index], updated)
  }

  const handleReasonChange = (index: number, reason: string) => {
    const updated = [...localMappings]
    updated[index] = { ...updated[index], reason }
    setLocalMappings(updated)
    validateRow(index, updated[index], updated)
  }

  const validateRow = (index: number, mapping: CourseMapping, allMappings: CourseMapping[]) => {
    const validation = validateMapping(mapping, allMappings)
    setErrors(prev => ({
      ...prev,
      [index]: validation.errors
    }))
  }

  const handleSave = () => {
    const hasErrors = Object.values(errors).some(e => e.length > 0)
    if (hasErrors) {
      alert('Please fix validation errors before saving')
      return
    }
    onUpdate(localMappings)
  }

  const totals = computeTotals(localMappings)
  const mappingPct = getMappingPercentage(totals)

  const getDecisionColor = (decision: MappingDecision) => {
    const colors: Record<MappingDecision, string> = {
      'Map': 'bg-green-100 text-green-800',
      'Waive': 'bg-blue-100 text-blue-800',
      'Reject': 'bg-red-100 text-red-800'
    }
    return colors[decision]
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-2 text-left">Source Course</th>
              <th className="p-2 text-left">Credits</th>
              <th className="p-2 text-left">Grade</th>
              <th className="p-2 text-left">Decision</th>
              <th className="p-2 text-left">Target Course / Reason</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {localMappings.map((mapping, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  <div className="font-medium">{mapping.sourceCode}</div>
                  <div className="text-xs text-gray-600">{mapping.sourceTitle}</div>
                </td>
                <td className="p-2">{mapping.sourceCredit}</td>
                <td className="p-2">
                  <Badge variant="outline" className="text-xs">
                    {mapping.sourceGrade || 'N/A'}
                  </Badge>
                </td>
                <td className="p-2">
                  <Select
                    value={mapping.decision}
                    onValueChange={(val) => handleDecisionChange(idx, val as MappingDecision)}
                    disabled={readOnly}
                  >
                    <SelectTrigger className="w-24 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Map">Map</SelectItem>
                      <SelectItem value="Waive">Waive</SelectItem>
                      <SelectItem value="Reject">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2">
                  {mapping.decision === 'Map' ? (
                    <Select
                      value={mapping.targetCode || ''}
                      onValueChange={(val) => handleTargetChange(idx, val)}
                      disabled={readOnly}
                    >
                      <SelectTrigger className="w-full text-xs">
                        <SelectValue placeholder="Select target..." />
                      </SelectTrigger>
                      <SelectContent>
                        {SAMPLE_COURSES.map(course => (
                          <SelectItem key={course.code} value={course.code}>
                            {course.code} - {course.title} ({course.credit} cr)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      placeholder="Enter reason..."
                      value={mapping.reason || ''}
                      onChange={(e) => handleReasonChange(idx, e.target.value)}
                      disabled={readOnly}
                      className="text-xs"
                    />
                  )}
                </td>
                <td className="p-2">
                  <div className="space-y-1">
                    <Badge className={getDecisionColor(mapping.decision)}>
                      {mapping.decision}
                    </Badge>
                    {errors[idx] && errors[idx].length > 0 && (
                      <div className="text-xs text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {errors[idx][0]}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md border">
        <div className="flex gap-4 text-sm">
          <div>
            <span className="font-medium">Source:</span>{' '}
            <Badge variant="outline">{totals.sourceCredits} cr</Badge>
          </div>
          <div>
            <span className="font-medium">Mapped:</span>{' '}
            <Badge className="bg-green-100 text-green-800">{totals.mappedCredits} cr</Badge>
          </div>
          <div>
            <span className="font-medium">Waived:</span>{' '}
            <Badge className="bg-blue-100 text-blue-800">{totals.waivedCredits} cr</Badge>
          </div>
          <div>
            <span className="font-medium">Mapping:</span>{' '}
            <Badge className="bg-purple-100 text-purple-800">{mappingPct}%</Badge>
          </div>
        </div>

        {!readOnly && (
          <Button size="sm" onClick={handleSave} className="bg-deep-plum hover:bg-accent-purple">
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
        )}
      </div>
    </div>
  )
}
