import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar, Users, Video, MapPin, Plus, X } from 'lucide-react'
import { INTERVIEW_PANELS, RECRUITMENT_CANDIDATES, RECRUITMENT_VACANCIES } from '@/lib/recruitmentStatic'
import { HRM_EMPLOYEES } from '@/lib/hrmStatic'
import { DEMO_MODE, showDemoToast } from '@/config/demo'

export default function RecruitmentInterviews() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [panelName, setPanelName] = useState('')
  const [selectedVacancy, setSelectedVacancy] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [slotDate, setSlotDate] = useState('')
  const [slotStartTime, setSlotStartTime] = useState('')
  const [slotEndTime, setSlotEndTime] = useState('')
  const [slotRoom, setSlotRoom] = useState('')
  const [slotMode, setSlotMode] = useState<'In-person' | 'Online'>('In-person')
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])

  const scheduledToday = INTERVIEW_PANELS.flatMap(p => p.slots).filter(s => s.date === new Date().toISOString().slice(0, 10)).length

  // Filter available candidates for selected vacancy
  const availableCandidates = selectedVacancy 
    ? RECRUITMENT_CANDIDATES.filter(c => 
        c.appliedForRef === selectedVacancy && 
        (c.status === 'Shortlisted' || c.status === 'Screened')
      )
    : []

  // Filter teachers for panel members
  const teacherEmployees = HRM_EMPLOYEES.filter(emp => emp.type === 'Teacher')

  const handleCreatePanel = () => {
    if (DEMO_MODE) {
      alert(showDemoToast('Create interview panel and schedule'))
      resetForm()
      setShowCreateDialog(false)
      return
    }
    // Real implementation would save to backend
  }

  const resetForm = () => {
    setPanelName('')
    setSelectedVacancy('')
    setSelectedMembers([])
    setSlotDate('')
    setSlotStartTime('')
    setSlotEndTime('')
    setSlotRoom('')
    setSlotMode('In-person')
    setSelectedCandidates([])
  }

  const toggleMember = (empId: string) => {
    setSelectedMembers(prev => 
      prev.includes(empId) 
        ? prev.filter(id => id !== empId)
        : [...prev, empId]
    )
  }

  const toggleCandidate = (canId: string) => {
    setSelectedCandidates(prev => 
      prev.includes(canId) 
        ? prev.filter(id => id !== canId)
        : [...prev, canId]
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-deep-plum">Interview Management</h2>
          <p className="text-gray-600 text-sm mt-1">Schedule and manage candidate interviews</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger onClick={() => setShowCreateDialog(true)} asChild>
            <Button className="bg-deep-plum hover:bg-deep-plum/90">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Interview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule New Interview</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Panel Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-deep-plum">Panel Information</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Panel Name</label>
                  <Input
                    value={panelName}
                    onChange={(e) => setPanelName(e.target.value)}
                    placeholder="e.g., CSE Faculty Selection Panel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Vacancy</label>
                  <select
                    value={selectedVacancy}
                    onChange={(e) => {
                      setSelectedVacancy(e.target.value)
                      setSelectedCandidates([])
                    }}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select vacancy</option>
                    {RECRUITMENT_VACANCIES.filter(v => v.status === 'Published').map(vac => (
                      <option key={vac.ref} value={vac.ref}>
                        {vac.ref} - {vac.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Panel Members</label>
                  <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                    {teacherEmployees.map(emp => (
                      <label key={emp.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(emp.id)}
                          onChange={() => toggleMember(emp.id)}
                          className="rounded"
                        />
                        <span className="text-sm flex-1">
                          {emp.name} - {emp.designation} ({emp.department})
                        </span>
                      </label>
                    ))}
                  </div>
                  {selectedMembers.length > 0 && (
                    <p className="text-xs text-gray-600 mt-1">{selectedMembers.length} member(s) selected</p>
                  )}
                </div>
              </div>

              {/* Interview Slot */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-deep-plum">Interview Slot</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <Input
                      type="date"
                      value={slotDate}
                      onChange={(e) => setSlotDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Mode</label>
                    <select
                      value={slotMode}
                      onChange={(e) => setSlotMode(e.target.value as 'In-person' | 'Online')}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="In-person">In-person</option>
                      <option value="Online">Online</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Time</label>
                    <Input
                      type="time"
                      value={slotStartTime}
                      onChange={(e) => setSlotStartTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Time</label>
                    <Input
                      type="time"
                      value={slotEndTime}
                      onChange={(e) => setSlotEndTime(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {slotMode === 'Online' ? 'Meeting Link / Room' : 'Room / Location'}
                  </label>
                  <Input
                    value={slotRoom}
                    onChange={(e) => setSlotRoom(e.target.value)}
                    placeholder={slotMode === 'Online' ? 'e.g., Zoom Meeting' : 'e.g., Meeting Room 301'}
                  />
                </div>

                {selectedVacancy && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Candidates</label>
                    {availableCandidates.length === 0 ? (
                      <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
                        No shortlisted or screened candidates available for this vacancy
                      </p>
                    ) : (
                      <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                        {availableCandidates.map(can => (
                          <label key={can.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <input
                              type="checkbox"
                              checked={selectedCandidates.includes(can.id)}
                              onChange={() => toggleCandidate(can.id)}
                              className="rounded"
                            />
                            <span className="text-sm flex-1">
                              {can.name} - {can.trackingNo}
                              <Badge variant="outline" className="ml-2 text-xs">
                                {can.status}
                              </Badge>
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                    {selectedCandidates.length > 0 && (
                      <p className="text-xs text-gray-600 mt-1">{selectedCandidates.length} candidate(s) selected</p>
                    )}
                  </div>
                )}
              </div>

              {/* Summary */}
              {panelName && selectedVacancy && selectedMembers.length > 0 && slotDate && slotStartTime && slotEndTime && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-deep-plum mb-3">Summary</h3>
                  <div className="bg-mint-green/10 p-4 rounded-md space-y-2 text-sm">
                    <p><strong>Panel:</strong> {panelName}</p>
                    <p><strong>Vacancy:</strong> {RECRUITMENT_VACANCIES.find(v => v.ref === selectedVacancy)?.title}</p>
                    <p><strong>Members:</strong> {selectedMembers.length} selected</p>
                    <p><strong>Date & Time:</strong> {slotDate} | {slotStartTime} - {slotEndTime}</p>
                    <p><strong>Mode:</strong> {slotMode}</p>
                    <p><strong>Location:</strong> {slotRoom || 'Not specified'}</p>
                    <p><strong>Candidates:</strong> {selectedCandidates.length} selected</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    resetForm()
                    setShowCreateDialog(false)
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreatePanel}
                  disabled={!panelName || !selectedVacancy || selectedMembers.length === 0 || !slotDate || !slotStartTime || !slotEndTime}
                  className="bg-deep-plum hover:bg-deep-plum/90"
                >
                  Create Interview Schedule
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{scheduledToday}</p>
            <p className="text-sm">Scheduled Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-600">{INTERVIEW_PANELS.flatMap(p => p.slots).length}</p>
            <p className="text-sm">Total Slots</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-purple-600">{INTERVIEW_PANELS.length}</p>
            <p className="text-sm">Active Panels</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Interview Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          {INTERVIEW_PANELS.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Interviews Scheduled</h3>
              <p className="text-gray-600 mb-4">Get started by scheduling your first interview</p>
              <Button onClick={() => setShowCreateDialog(true)} className="bg-deep-plum hover:bg-deep-plum/90">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Interview
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {INTERVIEW_PANELS.map(panel => (
                <div key={panel.panelId} className="border rounded-lg p-4">
                  <div className="mb-3">
                    <h3 className="font-semibold">{panel.panelName}</h3>
                    <p className="text-sm text-gray-600">Vacancy: {panel.vacancyRef}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div className="flex flex-wrap gap-2">
                        {panel.members.map((m, i) => (
                          <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {m.name} ({m.designation})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {panel.slots.map(slot => {
                      const candidates = slot.candidates.map(id => RECRUITMENT_CANDIDATES.find(c => c.id === id)).filter(Boolean)
                      return (
                        <div key={slot.slotId} className="bg-gray-50 p-3 rounded border-l-4 border-blue-600">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{slot.date} | {slot.start} - {slot.end}</p>
                              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                {slot.mode === 'Online' ? (
                                  <span className="flex items-center gap-1"><Video className="w-4 h-4" /> Online</span>
                                ) : (
                                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {slot.room}</span>
                                )}
                              </div>
                            </div>
                            <Badge variant="outline">{slot.candidates.length} Candidates</Badge>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {candidates.map(c => c && (
                              <span key={c.id} className="text-xs bg-white px-2 py-1 rounded border">
                                {c.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
