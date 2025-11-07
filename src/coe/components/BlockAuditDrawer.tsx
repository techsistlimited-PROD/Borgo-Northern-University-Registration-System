import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Unlock, Edit, CheckSquare, FileText, Award, CreditCard } from 'lucide-react'

interface BlockDetail {
  id: string
  studentId: string
  studentName: string
  programCode: string
  courseCode?: string
  section?: string
  blockType: 'Finance' | 'TER' | 'Disciplinary' | 'Custom'
  scope: 'Course-only' | 'Term-wide' | 'Program-wide'
  actionsHeld: string[]
  source: 'Auto' | 'Manual'
  status: 'Active' | 'Cleared'
  reason: string
  notes: string
  createdOn: string
  createdBy: string
  clearedOn: string | null
  clearedBy: string | null
  auditLog: Array<{ action: string; by: string; date: string; remarks: string }>
}

interface BlockAuditDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  block: BlockDetail | null
  onClear: (id: string, notes: string) => void
  onEdit: (id: string, updates: { scope: string; actionsHeld: string[]; notes: string }) => void
}

export default function BlockAuditDrawer({
  open,
  onOpenChange,
  block,
  onClear,
  onEdit
}: BlockAuditDrawerProps) {
  const [clearNotes, setClearNotes] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [editScope, setEditScope] = useState('')
  const [editActions, setEditActions] = useState<string[]>([])
  const [editNotes, setEditNotes] = useState('')

  if (!block) return null

  const handleClear = () => {
    if (!clearNotes.trim()) {
      alert('Clear notes are required')
      return
    }
    onClear(block.id, clearNotes)
    setClearNotes('')
    onOpenChange(false)
  }

  const handleEdit = () => {
    if (block.source === 'Auto') {
      alert('Auto-generated blocks cannot be edited')
      return
    }
    if (!editMode) {
      setEditMode(true)
      setEditScope(block.scope)
      setEditActions(block.actionsHeld)
      setEditNotes(block.notes)
    } else {
      onEdit(block.id, { scope: editScope, actionsHeld: editActions, notes: editNotes })
      setEditMode(false)
      onOpenChange(false)
    }
  }

  const toggleAction = (action: string) => {
    if (editActions.includes(action)) {
      setEditActions(editActions.filter(a => a !== action))
    } else {
      setEditActions([...editActions, action])
    }
  }

  const actionIcons: Record<string, React.ReactNode> = {
    Results: <CheckSquare className="w-4 h-4" />,
    Transcript: <FileText className="w-4 h-4" />,
    Certificates: <Award className="w-4 h-4" />,
    Admit: <CreditCard className="w-4 h-4" />
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle>Result Block Details</DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                {block.studentName} ({block.studentId}) • {block.programCode}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge className={block.status === 'Active' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}>
                {block.status}
              </Badge>
              <Badge variant="outline">{block.source}</Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-gray-50 rounded-md p-4">
            <h4 className="font-semibold text-sm text-deep-plum mb-3">Summary</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600">Block Type</label>
                <p className="text-sm font-medium mt-1">
                  <Badge className={
                    block.blockType === 'Disciplinary' ? 'bg-red-100 text-red-700' :
                    block.blockType === 'Finance' || block.blockType === 'TER' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }>
                    {block.blockType}
                  </Badge>
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Scope</label>
                {editMode ? (
                  <select
                    value={editScope}
                    onChange={e => setEditScope(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm mt-1"
                  >
                    <option value="Course-only">Course-only</option>
                    <option value="Term-wide">Term-wide</option>
                    <option value="Program-wide">Program-wide</option>
                  </select>
                ) : (
                  <p className="text-sm font-medium mt-1">{block.scope}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Created On</label>
                <p className="text-sm mt-1">{block.createdOn}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Created By</label>
                <p className="text-sm mt-1">{block.createdBy}</p>
              </div>
              {block.clearedOn && (
                <>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Cleared On</label>
                    <p className="text-sm mt-1">{block.clearedOn}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Cleared By</label>
                    <p className="text-sm mt-1">{block.clearedBy}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-deep-plum mb-2">Reason & Notes</h4>
            <div className="p-3 bg-gray-50 rounded-md text-sm mb-2">
              <strong>Reason:</strong> {block.reason}
            </div>
            {editMode ? (
              <Textarea
                value={editNotes}
                onChange={e => setEditNotes(e.target.value)}
                placeholder="Additional notes..."
                rows={3}
                className="w-full"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md text-sm">
                {block.notes}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-sm text-deep-plum mb-2">Actions Held</h4>
            {editMode ? (
              <div className="flex flex-wrap gap-2">
                {Object.entries(actionIcons).map(([action, icon]) => (
                  <label key={action} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editActions.includes(action)}
                      onChange={() => toggleAction(action)}
                      className="rounded"
                    />
                    <span className="flex items-center gap-1 text-sm">
                      {icon}
                      {action}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {block.actionsHeld.map((action, idx) => (
                  <Badge key={idx} variant="outline" className="flex items-center gap-1">
                    {actionIcons[action]}
                    {action}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-sm text-deep-plum mb-3">Audit Timeline</h4>
            <div className="space-y-3">
              {block.auditLog.map((log, idx) => (
                <div key={idx} className="relative pl-8">
                  {idx !== block.auditLog.length - 1 && (
                    <div className="absolute left-2 top-7 w-0.5 h-full bg-gray-200" />
                  )}
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-purple-600" />
                  <div className="bg-gray-50 rounded-md p-3">
                    <div className="flex items-start justify-between mb-1">
                      <h5 className="font-semibold text-sm text-deep-plum">{log.action}</h5>
                      <span className="text-xs text-gray-500">{log.date}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">By: {log.by}</p>
                    {log.remarks && <p className="text-sm text-gray-700 mt-2">{log.remarks}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {block.status === 'Active' && (
            <div className="border-t pt-4">
              <h4 className="font-semibold text-sm text-deep-plum mb-2">Actions</h4>
              {!editMode && (
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clear Notes (Required)</label>
                  <Textarea
                    value={clearNotes}
                    onChange={e => setClearNotes(e.target.value)}
                    placeholder="Enter reason for clearing this block..."
                    rows={3}
                    className="w-full"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={handleEdit}
                  disabled={block.source === 'Auto' && !editMode}
                  variant="outline"
                  title={block.source === 'Auto' ? 'Auto-generated blocks cannot be edited' : ''}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {editMode ? 'Save Edit' : 'Edit Block'}
                </Button>
                {!editMode && (
                  <Button
                    onClick={handleClear}
                    disabled={!clearNotes.trim()}
                    className="bg-gradient-to-r from-deep-plum to-accent-purple text-white hover:opacity-90"
                  >
                    <Unlock className="w-4 h-4 mr-2" />
                    Clear Block
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
