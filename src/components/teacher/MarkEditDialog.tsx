import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Edit3, 
  Save, 
  X, 
  Clock, 
  User,
  AlertTriangle,
  CheckCircle,
  Calendar
} from 'lucide-react'

interface EditRecord {
  id: string
  editDate: string
  editTime: string
  reason: string
  oldValue: number
  newValue: number
  editedBy: string
}

interface MarkEditDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (newValue: number, reason: string) => void
  studentName: string
  studentId: string
  currentValue: number
  maxValue: number
  markType: string
  editHistory?: EditRecord[]
}

export default function MarkEditDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  studentName, 
  studentId, 
  currentValue, 
  maxValue, 
  markType,
  editHistory = []
}: MarkEditDialogProps) {
  const [newValue, setNewValue] = useState<number>(currentValue)
  const [reason, setReason] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newValue === currentValue) {
      alert('No changes made to save')
      return
    }

    if (!reason.trim()) {
      alert('Please provide a reason for the edit')
      return
    }

    if (newValue < 0 || newValue > maxValue) {
      alert(`Value must be between 0 and ${maxValue}`)
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      onSave(newValue, reason)
      onClose()
    } catch (error) {
      alert('Error saving changes. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setNewValue(currentValue)
    setReason('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Edit3 className="w-5 h-5" />
                  <span>Edit {markType}</span>
                </CardTitle>
                <CardDescription>
                  {studentName} ({studentId})
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Current vs New Value */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <Label className="text-sm font-medium text-gray-600">Current Value</Label>
                <p className="text-2xl font-bold text-deep-plum">{currentValue}</p>
                <p className="text-sm text-gray-500">out of {maxValue}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <Label className="text-sm font-medium text-blue-600">New Value</Label>
                <p className="text-2xl font-bold text-blue-600">{newValue}</p>
                <p className="text-sm text-blue-500">out of {maxValue}</p>
              </div>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newValue">New {markType} Value</Label>
                <Input
                  id="newValue"
                  type="number"
                  min="0"
                  max={maxValue}
                  value={newValue}
                  onChange={(e) => setNewValue(parseInt(e.target.value) || 0)}
                  className="text-lg font-medium"
                  required
                />
                <p className="text-sm text-gray-500">
                  Enter value between 0 and {maxValue}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Edit</Label>
                <Textarea
                  id="reason"
                  placeholder="Provide a detailed reason for this mark change..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  required
                />
                <p className="text-sm text-gray-500">
                  This reason will be logged and visible in the edit history
                </p>
              </div>

              {/* Warning for significant changes */}
              {Math.abs(newValue - currentValue) > (maxValue * 0.2) && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Significant Change Detected</p>
                    <p className="text-sm text-yellow-700">
                      You are making a change of {Math.abs(newValue - currentValue)} marks, 
                      which is more than 20% of the total. Please ensure this is correct.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || newValue === currentValue || !reason.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Edit History */}
            {editHistory.length > 0 && (
              <div className="border-t pt-6">
                <h4 className="font-semibold text-deep-plum mb-4 flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Edit History</span>
                </h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {editHistory.map((edit, index) => (
                    <div key={edit.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-sm">{edit.editedBy}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{edit.editDate} at {edit.editTime}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-2">
                        <span className="text-sm">
                          Changed from <span className="font-medium text-red-600">{edit.oldValue}</span> to{' '}
                          <span className="font-medium text-green-600">{edit.newValue}</span>
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Edit #{editHistory.length - index}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-700 bg-white p-2 rounded border-l-4 border-blue-200">
                        <strong>Reason:</strong> {edit.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Edit Guidelines */}
            <div className="border-t pt-4">
              <h5 className="font-medium text-gray-700 mb-2">Edit Guidelines</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• All edits are permanently logged and auditable</li>
                <li>• Provide clear and detailed reasons for any changes</li>
                <li>• Large changes may require additional approval</li>
                <li>• Students will be notified of mark changes</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Example usage hook for integrating with mark entry components
export function useMarkEdit() {
  const [editState, setEditState] = useState<{
    isOpen: boolean
    studentName: string
    studentId: string
    currentValue: number
    maxValue: number
    markType: string
    editHistory: EditRecord[]
  } | null>(null)

  const openEdit = (params: {
    studentName: string
    studentId: string
    currentValue: number
    maxValue: number
    markType: string
    editHistory?: EditRecord[]
  }) => {
    setEditState({
      isOpen: true,
      ...params,
      editHistory: params.editHistory || []
    })
  }

  const closeEdit = () => {
    setEditState(null)
  }

  const handleSave = async (newValue: number, reason: string) => {
    if (!editState) return

    // Create new edit record
    const newEditRecord: EditRecord = {
      id: Date.now().toString(),
      editDate: new Date().toLocaleDateString(),
      editTime: new Date().toLocaleTimeString(),
      reason,
      oldValue: editState.currentValue,
      newValue,
      editedBy: 'Dr. Abdul Rahman' // This would come from auth context
    }

    // Here you would typically:
    // 1. Save to backend API
    // 2. Update local state
    // 3. Show success notification
    
    console.log('Mark edit saved:', newEditRecord)
    return newEditRecord
  }

  const EditDialog = editState ? (
    <MarkEditDialog
      isOpen={editState.isOpen}
      onClose={closeEdit}
      onSave={handleSave}
      studentName={editState.studentName}
      studentId={editState.studentId}
      currentValue={editState.currentValue}
      maxValue={editState.maxValue}
      markType={editState.markType}
      editHistory={editState.editHistory}
    />
  ) : null

  return {
    openEdit,
    closeEdit,
    EditDialog
  }
}
