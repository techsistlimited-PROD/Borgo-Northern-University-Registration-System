import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScholarshipProposal, SCHOLARSHIP_RULES } from '../data/scholarships'
import { validateWaiverPercent } from '../utils/scholarships'

interface ScholarshipDecisionDialogProps {
  open: boolean
  onClose: () => void
  proposal: ScholarshipProposal | null
  onDecide: (proposalId: string, tier: string, waiverPercent: number, notes: string) => void
}

export default function ScholarshipDecisionDialog({
  open,
  onClose,
  proposal,
  onDecide
}: ScholarshipDecisionDialogProps) {
  const [selectedTier, setSelectedTier] = useState('')
  const [waiverPercent, setWaiverPercent] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  if (!proposal) return null

  const handleSubmit = () => {
    const validation = validateWaiverPercent(parseInt(waiverPercent))
    if (!validation.valid) {
      setError(validation.error || 'Invalid waiver percentage')
      return
    }
    if (!selectedTier) {
      setError('Please select a tier')
      return
    }
    onDecide(proposal.id, selectedTier, parseInt(waiverPercent), notes)
    setSelectedTier('')
    setWaiverPercent('')
    setNotes('')
    setError('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Evaluate Scholarship Proposal</DialogTitle>
          <DialogDescription>
            {proposal.studentName} - {proposal.studentId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="text-xs text-gray-500">CGPA</div>
              <div className="font-medium">{proposal.cgpa.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Suggested Tier</div>
              <div className="font-medium text-sm">{proposal.tierSuggested}</div>
            </div>
          </div>

          <div>
            <Label>Select Tier</Label>
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger>
                <SelectValue placeholder="Choose tier..." />
              </SelectTrigger>
              <SelectContent>
                {SCHOLARSHIP_RULES.map((rule) => (
                  <SelectItem key={rule.id} value={rule.tier}>
                    {rule.tier} ({rule.waiverPercent}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Waiver Percentage</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={waiverPercent}
              onChange={(e) => setWaiverPercent(e.target.value)}
              placeholder="0-100"
            />
          </div>

          <div>
            <Label>Decision Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter notes..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="nu-button-primary">
            Save Decision
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
