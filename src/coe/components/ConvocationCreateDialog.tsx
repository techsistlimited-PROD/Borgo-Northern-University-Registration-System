import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ConvocationCreateDialogProps {
  open: boolean
  onClose: () => void
  onCreate: (data: {
    convocationNo: string
    title: string
    coveredSemFrom: string
    coveredSemTo: string
    cbeFrom: string
    cbeTo: string
    regStart: string
    regEnd: string
    eventDate: string
    venue: string
  }) => void
}

export default function ConvocationCreateDialog({
  open,
  onClose,
  onCreate
}: ConvocationCreateDialogProps) {
  const [formData, setFormData] = useState({
    convocationNo: '',
    title: '',
    coveredSemFrom: '',
    coveredSemTo: '',
    cbeFrom: '',
    cbeTo: '',
    regStart: '',
    regEnd: '',
    eventDate: '',
    venue: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!formData.convocationNo || !formData.title || !formData.eventDate) {
      setError('Please fill in all required fields')
      return
    }
    onCreate(formData)
    setFormData({
      convocationNo: '',
      title: '',
      coveredSemFrom: '',
      coveredSemTo: '',
      cbeFrom: '',
      cbeTo: '',
      regStart: '',
      regEnd: '',
      eventDate: '',
      venue: ''
    })
    setError('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Convocation Event</DialogTitle>
          <DialogDescription>
            Create a new convocation event
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Convocation No. *</Label>
              <Input
                value={formData.convocationNo}
                onChange={(e) => setFormData({ ...formData, convocationNo: e.target.value })}
                placeholder="25th"
              />
            </div>
            <div>
              <Label>Event Date *</Label>
              <Input
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="25th Convocation"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Covered Sem From</Label>
              <Input
                value={formData.coveredSemFrom}
                onChange={(e) => setFormData({ ...formData, coveredSemFrom: e.target.value })}
                placeholder="Spring 2024"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>CBE From</Label>
              <Input
                value={formData.cbeFrom}
                onChange={(e) => setFormData({ ...formData, cbeFrom: e.target.value })}
                placeholder="CBE/2024/01"
              />
            </div>
            <div>
              <Label>CBE To</Label>
              <Input
                value={formData.cbeTo}
                onChange={(e) => setFormData({ ...formData, cbeTo: e.target.value })}
                placeholder="CBE/2025/02"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Reg Start</Label>
              <Input
                type="date"
                value={formData.regStart}
                onChange={(e) => setFormData({ ...formData, regStart: e.target.value })}
              />
            </div>
            <div>
              <Label>Reg End</Label>
              <Input
                type="date"
                value={formData.regEnd}
                onChange={(e) => setFormData({ ...formData, regEnd: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Venue</Label>
            <Input
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder="Main Auditorium"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="nu-button-primary">
            Create Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
