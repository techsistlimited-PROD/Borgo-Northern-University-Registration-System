import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { validateMeetingWindow } from '../utils/cbe'

interface CBECreateMeetingDialogProps {
  open: boolean
  onClose: () => void
  onCreate: (data: {
    number: string
    title: string
    meetingDate: string
    coveredSemFrom: string
    coveredSemTo: string
    remarks: string
  }) => void
}

export default function CBECreateMeetingDialog({
  open,
  onClose,
  onCreate
}: CBECreateMeetingDialogProps) {
  const [formData, setFormData] = useState({
    number: '',
    title: '',
    meetingDate: '',
    coveredSemFrom: '',
    coveredSemTo: '',
    remarks: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = () => {
    const validation = validateMeetingWindow(formData.coveredSemFrom, formData.coveredSemTo)
    if (!validation.valid) {
      setError(validation.error || 'Invalid semester range')
      return
    }
    if (!formData.number || !formData.title || !formData.meetingDate) {
      setError('Please fill in all required fields')
      return
    }
    onCreate(formData)
    setFormData({
      number: '',
      title: '',
      meetingDate: '',
      coveredSemFrom: '',
      coveredSemTo: '',
      remarks: ''
    })
    setError('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create CBE Meeting</DialogTitle>
          <DialogDescription>
            Create a new CBE meeting for candidate evaluation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <Label>Meeting Number *</Label>
            <Input
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              placeholder="CBE/2025/01"
            />
          </div>

          <div>
            <Label>Meeting Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="1st CBE Meeting - Fall 2025"
            />
          </div>

          <div>
            <Label>Meeting Date *</Label>
            <Input
              type="date"
              value={formData.meetingDate}
              onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Covered Sem From</Label>
              <Input
                value={formData.coveredSemFrom}
                onChange={(e) => setFormData({ ...formData, coveredSemFrom: e.target.value })}
                placeholder="Fall 2024"
              />
            </div>
            <div>
              <Label>Covered Sem To</Label>
              <Input
                value={formData.coveredSemTo}
                onChange={(e) => setFormData({ ...formData, coveredSemTo: e.target.value })}
                placeholder="Fall 2025"
              />
            </div>
          </div>

          <div>
            <Label>Remarks</Label>
            <Textarea
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="nu-button-primary">
            Create Meeting
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
