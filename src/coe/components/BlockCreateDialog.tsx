import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { getStudentMarksList } from '@/coe/data/selectors'

interface BlockCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (block: any) => void
}

export default function BlockCreateDialog({ open, onOpenChange, onSubmit }: BlockCreateDialogProps) {
  const studentMarks = getStudentMarksList()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<{
    id: string
    name: string
    programCode: string
  } | null>(null)

  const [scope, setScope] = useState<'Course-only' | 'Term-wide' | 'Program-wide'>('Term-wide')
  const [blockType, setBlockType] = useState<'Finance' | 'TER' | 'Disciplinary' | 'Custom'>('Finance')
  const [actionsHeld, setActionsHeld] = useState<string[]>(['Results'])
  const [effectiveFrom, setEffectiveFrom] = useState('')
  const [effectiveTo, setEffectiveTo] = useState('')
  const [untilCleared, setUntilCleared] = useState(true)
  const [reasonPreset, setReasonPreset] = useState('Finance dues')
  const [customNotes, setCustomNotes] = useState('')

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return []
    const term = searchTerm.toLowerCase()
    return studentMarks
      .filter(m => m.studentId.toLowerCase().includes(term) || m.studentName.toLowerCase().includes(term))
      .slice(0, 10)
  }, [searchTerm, studentMarks])

  const uniqueStudents = useMemo(() => {
    const seen = new Set<string>()
    return filteredStudents.filter(s => {
      if (seen.has(s.studentId)) return false
      seen.add(s.studentId)
      return true
    })
  }, [filteredStudents])

  const handleSelectStudent = (student: any) => {
    setSelectedStudent({
      id: student.studentId,
      name: student.studentName,
      programCode: student.programCode
    })
    setSearchTerm('')
  }

  const toggleAction = (action: string) => {
    if (actionsHeld.includes(action)) {
      setActionsHeld(actionsHeld.filter(a => a !== action))
    } else {
      setActionsHeld([...actionsHeld, action])
    }
  }

  const handleSubmit = () => {
    if (!selectedStudent || !customNotes.trim() || customNotes.length < 10) {
      alert('Please select a student and enter notes (minimum 10 characters)')
      return
    }

    if (actionsHeld.length === 0) {
      alert('Please select at least one action to hold')
      return
    }

    const block = {
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      programCode: selectedStudent.programCode,
      scope,
      blockType,
      actionsHeld,
      effectiveFrom: effectiveFrom || new Date().toISOString().split('T')[0],
      effectiveTo: untilCleared ? null : effectiveTo,
      reasonPreset,
      customNotes
    }

    onSubmit(block)
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setSelectedStudent(null)
    setSearchTerm('')
    setScope('Term-wide')
    setBlockType('Finance')
    setActionsHeld(['Results'])
    setEffectiveFrom('')
    setEffectiveTo('')
    setUntilCleared(true)
    setReasonPreset('Finance dues')
    setCustomNotes('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Result Block</DialogTitle>
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
              {!selectedStudent && uniqueStudents.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border shadow-lg rounded-md max-h-60 overflow-y-auto z-10">
                  {uniqueStudents.map((student, idx) => (
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scope <span className="text-red-500">*</span>
              </label>
              <select value={scope} onChange={e => setScope(e.target.value as any)} className="w-full p-2 border rounded-md">
                <option value="Course-only">Course-only</option>
                <option value="Term-wide">Term-wide</option>
                <option value="Program-wide">Program-wide</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Block Type <span className="text-red-500">*</span>
              </label>
              <select value={blockType} onChange={e => setBlockType(e.target.value as any)} className="w-full p-2 border rounded-md">
                <option value="Finance">Finance</option>
                <option value="TER">TER</option>
                <option value="Disciplinary">Disciplinary</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actions Held <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {['Results', 'Transcript', 'Certificates', 'Admit'].map(action => (
                <label key={action} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={actionsHeld.includes(action)}
                    onChange={() => toggleAction(action)}
                    className="rounded"
                  />
                  <span className="text-sm">{action}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Effective From</label>
              <Input
                type="date"
                value={effectiveFrom}
                onChange={e => setEffectiveFrom(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Effective To</label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="untilCleared"
                  checked={untilCleared}
                  onChange={e => setUntilCleared(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="untilCleared" className="text-sm">Until Cleared</label>
              </div>
              {!untilCleared && (
                <Input
                  type="date"
                  value={effectiveTo}
                  onChange={e => setEffectiveTo(e.target.value)}
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason Preset</label>
            <select value={reasonPreset} onChange={e => setReasonPreset(e.target.value)} className="w-full p-2 border rounded-md">
              <option value="Finance dues">Finance dues</option>
              <option value="TER pending">TER pending</option>
              <option value="Disciplinary hold">Disciplinary hold</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Notes <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={customNotes}
              onChange={e => setCustomNotes(e.target.value)}
              placeholder="Enter detailed reason (minimum 10 characters)..."
              rows={4}
              className="w-full"
            />
            {customNotes.length > 0 && customNotes.length < 10 && (
              <p className="text-xs text-red-600 mt-1">
                Notes must be at least 10 characters ({customNotes.length}/10)
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedStudent || customNotes.length < 10 || actionsHeld.length === 0}
            className="bg-gradient-to-r from-deep-plum to-accent-purple text-white hover:opacity-90"
          >
            Create Block
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
