import { useState } from 'react'
import { GradeScale, PolicyEditFormData } from '@/coe/data/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus, RotateCcw, Trash2, AlertTriangle } from 'lucide-react'
import { GLOBAL_GRADE_SCALE } from '@/coe/data/gradePolicy'
import { EXAM_TYPES } from '@/coe/data/examTypes'

interface PolicyEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPolicy: PolicyEditFormData
  onSave: (policy: PolicyEditFormData) => void
}

export default function PolicyEditorDialog({
  open,
  onOpenChange,
  currentPolicy,
  onSave
}: PolicyEditorDialogProps) {
  const [activeTab, setActiveTab] = useState<'scale' | 'settings'>('scale')
  const [editedPolicy, setEditedPolicy] = useState<PolicyEditFormData>(currentPolicy)
  const [errors, setErrors] = useState<string[]>([])

  const validateGradeScale = (scale: GradeScale[]): string[] => {
    const validationErrors: string[] = []
    const letters = new Set<string>()
    
    scale.forEach((grade, idx) => {
      // Check min < max
      if (grade.minMarks >= grade.maxMarks) {
        validationErrors.push(`Row ${idx + 1}: Minimum must be less than maximum`)
      }

      // Check unique letters
      if (letters.has(grade.letterGrade)) {
        validationErrors.push(`Row ${idx + 1}: Letter grade "${grade.letterGrade}" is duplicate`)
      }
      letters.add(grade.letterGrade)

      // Check grade point range
      if (grade.gradePoint < 0 || grade.gradePoint > 4.00) {
        validationErrors.push(`Row ${idx + 1}: Grade point must be between 0.00 and 4.00`)
      }

      // Check for overlaps
      scale.forEach((other, otherIdx) => {
        if (idx !== otherIdx) {
          const overlaps =
            (grade.minMarks >= other.minMarks && grade.minMarks <= other.maxMarks) ||
            (grade.maxMarks >= other.minMarks && grade.maxMarks <= other.maxMarks) ||
            (grade.minMarks <= other.minMarks && grade.maxMarks >= other.maxMarks)
          
          if (overlaps) {
            validationErrors.push(
              `Row ${idx + 1} and ${otherIdx + 1}: Score ranges overlap`
            )
          }
        }
      })
    })

    return [...new Set(validationErrors)]
  }

  const handleSave = () => {
    const validationErrors = validateGradeScale(editedPolicy.gradeScale)
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors([])
    onSave(editedPolicy)
    onOpenChange(false)
  }

  const handleResetToDefaults = () => {
    setEditedPolicy({
      ...editedPolicy,
      gradeScale: [...GLOBAL_GRADE_SCALE],
      passingGrade: 'D',
      tieBreakRule: 'round-half-up'
    })
    setErrors([])
  }

  const handleAddRow = () => {
    setEditedPolicy({
      ...editedPolicy,
      gradeScale: [
        ...editedPolicy.gradeScale,
        {
          letterGrade: 'X',
          gradePoint: 0.0,
          minMarks: 0,
          maxMarks: 0,
          description: 'New Grade'
        }
      ]
    })
  }

  const handleRemoveRow = (idx: number) => {
    setEditedPolicy({
      ...editedPolicy,
      gradeScale: editedPolicy.gradeScale.filter((_, i) => i !== idx)
    })
  }

  const handleUpdateRow = (idx: number, field: keyof GradeScale, value: any) => {
    const updated = [...editedPolicy.gradeScale]
    updated[idx] = { ...updated[idx], [field]: value }
    setEditedPolicy({ ...editedPolicy, gradeScale: updated })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Grading Policy</DialogTitle>
          <DialogDescription>
            Modify grade scale and policy settings
          </DialogDescription>
        </DialogHeader>

        <div className="border-b">
          <div className="flex gap-1">
            <button
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === 'scale'
                  ? 'border-b-2 border-deep-plum text-deep-plum'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('scale')}
            >
              Grade Scale
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === 'settings'
                  ? 'border-b-2 border-deep-plum text-deep-plum'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-800 text-sm">Validation Errors</h4>
                <ul className="mt-1 text-xs text-red-700 space-y-1">
                  {errors.map((error, idx) => (
                    <li key={idx}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'scale' && (
            <div className="space-y-4 p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-deep-plum">Grade Scale Rows</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleResetToDefaults}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset to Defaults
                  </Button>
                  <Button size="sm" onClick={handleAddRow} className="bg-deep-plum hover:bg-accent-purple">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Row
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-2 text-left border">Letter</th>
                      <th className="p-2 text-left border">Grade Point</th>
                      <th className="p-2 text-left border">Min Marks</th>
                      <th className="p-2 text-left border">Max Marks</th>
                      <th className="p-2 text-left border">Description</th>
                      <th className="p-2 text-center border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editedPolicy.gradeScale.map((grade, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2 border">
                          <input
                            type="text"
                            value={grade.letterGrade}
                            onChange={e =>
                              handleUpdateRow(idx, 'letterGrade', e.target.value.toUpperCase())
                            }
                            className="w-full p-1 border rounded"
                            maxLength={3}
                          />
                        </td>
                        <td className="p-2 border">
                          <input
                            type="number"
                            value={grade.gradePoint}
                            onChange={e =>
                              handleUpdateRow(idx, 'gradePoint', parseFloat(e.target.value) || 0)
                            }
                            step="0.25"
                            min="0"
                            max="4"
                            className="w-full p-1 border rounded"
                          />
                        </td>
                        <td className="p-2 border">
                          <input
                            type="number"
                            value={grade.minMarks}
                            onChange={e =>
                              handleUpdateRow(idx, 'minMarks', parseInt(e.target.value) || 0)
                            }
                            min="0"
                            max="100"
                            className="w-full p-1 border rounded"
                          />
                        </td>
                        <td className="p-2 border">
                          <input
                            type="number"
                            value={grade.maxMarks}
                            onChange={e =>
                              handleUpdateRow(idx, 'maxMarks', parseInt(e.target.value) || 0)
                            }
                            min="0"
                            max="100"
                            className="w-full p-1 border rounded"
                          />
                        </td>
                        <td className="p-2 border">
                          <input
                            type="text"
                            value={grade.description}
                            onChange={e => handleUpdateRow(idx, 'description', e.target.value)}
                            className="w-full p-1 border rounded"
                          />
                        </td>
                        <td className="p-2 border text-center">
                          <button
                            onClick={() => handleRemoveRow(idx)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6 p-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Passing Grade
                </label>
                <select
                  value={editedPolicy.passingGrade}
                  onChange={e =>
                    setEditedPolicy({ ...editedPolicy, passingGrade: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                >
                  {editedPolicy.gradeScale.map(grade => (
                    <option key={grade.letterGrade} value={grade.letterGrade}>
                      {grade.letterGrade} ({grade.gradePoint.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tie-break Rule
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="round-half-up"
                      checked={editedPolicy.tieBreakRule === 'round-half-up'}
                      onChange={e =>
                        setEditedPolicy({
                          ...editedPolicy,
                          tieBreakRule: e.target.value as 'round-half-up' | 'truncate'
                        })
                      }
                    />
                    <span className="text-sm">Round Half Up (0.5 → 1)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="truncate"
                      checked={editedPolicy.tieBreakRule === 'truncate'}
                      onChange={e =>
                        setEditedPolicy({
                          ...editedPolicy,
                          tieBreakRule: e.target.value as 'round-half-up' | 'truncate'
                        })
                      }
                    />
                    <span className="text-sm">Truncate (0.5 → 0)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Apply to Exam Types
                </label>
                <div className="space-y-2">
                  {EXAM_TYPES.map(examType => (
                    <label key={examType.code} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editedPolicy.applicableExamTypes.includes(examType.code)}
                        onChange={e => {
                          if (e.target.checked) {
                            setEditedPolicy({
                              ...editedPolicy,
                              applicableExamTypes: [
                                ...editedPolicy.applicableExamTypes,
                                examType.code
                              ]
                            })
                          } else {
                            setEditedPolicy({
                              ...editedPolicy,
                              applicableExamTypes: editedPolicy.applicableExamTypes.filter(
                                code => code !== examType.code
                              )
                            })
                          }
                        }}
                      />
                      <span className="text-sm">{examType.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-deep-plum hover:bg-accent-purple">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
