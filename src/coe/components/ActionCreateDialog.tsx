import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TRANSCRIPTS } from '@/coe/data/transcripts'
import { PROGRAMS } from '@/coe/data/programs'
import { SEMESTERS } from '@/coe/data/semesters'
import { ActionType, RequestedChange } from '@/coe/data/admissionActions'
import { validateActionRequest } from '@/coe/utils/admissionActions'

interface ActionCreateDialogProps {
  open: boolean
  onClose: () => void
  onCreate: (data: {
    studentId: string
    studentName: string
    currentProgram: string
    currentCampus: string
    currentBatch: string
    actionType: ActionType
    requestedChange: RequestedChange
  }) => void
}

export default function ActionCreateDialog({ open, onClose, onCreate }: ActionCreateDialogProps) {
  const [step, setStep] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<typeof TRANSCRIPTS[0] | null>(null)
  const [actionType, setActionType] = useState<ActionType | ''>('')
  const [showStudentList, setShowStudentList] = useState(false)
  
  const [formData, setFormData] = useState<Partial<RequestedChange>>({})

  const filteredStudents = TRANSCRIPTS.filter(t =>
    t.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const programs = PROGRAMS.map(p => p.code)
  const campuses = ['Permanent', 'Banani', 'Mirpur']
  const semesters = SEMESTERS.map(s => s.name)

  const handleStudentSelect = (student: typeof TRANSCRIPTS[0]) => {
    setSelectedStudent(student)
    setSearchTerm(`${student.studentId} - ${student.studentName}`)
    setShowStudentList(false)
  }

  const handleNext = () => {
    if (step === 1 && !selectedStudent) {
      alert('Please select a student.')
      return
    }
    if (step === 2 && !actionType) {
      alert('Please select an action type.')
      return
    }
    setStep(step + 1)
  }

  const handleSubmit = () => {
    if (!selectedStudent || !actionType) return

    const validation = validateActionRequest(actionType, formData)
    if (!validation.valid) {
      alert(`Validation errors:\n${validation.errors.join('\n')}`)
      return
    }

    onCreate({
      studentId: selectedStudent.studentId,
      studentName: selectedStudent.studentName,
      currentProgram: selectedStudent.programCode,
      currentCampus: 'Permanent',
      currentBatch: selectedStudent.batch,
      actionType,
      requestedChange: formData as RequestedChange
    })

    handleClose()
  }

  const handleClose = () => {
    setStep(1)
    setSearchTerm('')
    setSelectedStudent(null)
    setActionType('')
    setFormData({})
    setShowStudentList(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Action Request - Step {step} of 4</DialogTitle>
          <DialogDescription>
            {step === 1 && 'Select a student'}
            {step === 2 && 'Choose action type'}
            {step === 3 && 'Fill in details'}
            {step === 4 && 'Review and create'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 min-h-64">
          {step === 1 && (
            <div className="relative">
              <label className="text-sm font-medium mb-1 block">Student</label>
              <Input
                placeholder="Search by ID or Name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setShowStudentList(true)
                }}
                onFocus={() => setShowStudentList(true)}
              />
              {showStudentList && searchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map(student => (
                      <div
                        key={student.studentId}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleStudentSelect(student)}
                      >
                        <div className="font-medium">{student.studentId}</div>
                        <div className="text-gray-600 text-xs">
                          {student.studentName} • {student.programCode} • {student.batch}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-sm text-gray-500 text-center">No students found</div>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="text-sm font-medium mb-1 block">Action Type</label>
              <Select value={actionType} onValueChange={(val) => setActionType(val as ActionType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STUDENT_INFO_UPDATE">Student Info Update</SelectItem>
                  <SelectItem value="PROGRAM_CHANGE">Program Change</SelectItem>
                  <SelectItem value="CAMPUS_CHANGE">Campus Change</SelectItem>
                  <SelectItem value="ADMISSION_CANCEL">Admission Cancel</SelectItem>
                  <SelectItem value="READMISSION">Readmission</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 3 && actionType === 'PROGRAM_CHANGE' && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">From Program</label>
                <Select value={formData.from} onValueChange={(val) => setFormData({...formData, from: val})}>
                  <SelectTrigger><SelectValue placeholder="Current program..." /></SelectTrigger>
                  <SelectContent>
                    {programs.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">To Program</label>
                <Select value={formData.to} onValueChange={(val) => setFormData({...formData, to: val})}>
                  <SelectTrigger><SelectValue placeholder="Target program..." /></SelectTrigger>
                  <SelectContent>
                    {programs.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Effective Semester</label>
                <Select value={formData.effective} onValueChange={(val) => setFormData({...formData, effective: val})}>
                  <SelectTrigger><SelectValue placeholder="Select semester..." /></SelectTrigger>
                  <SelectContent>
                    {semesters.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Reason (min 10 chars)</label>
                <Input
                  placeholder="Reason for program change..."
                  value={formData.reason || ''}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                />
              </div>
            </div>
          )}

          {step === 3 && actionType === 'CAMPUS_CHANGE' && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">From Campus</label>
                <Select value={formData.from} onValueChange={(val) => setFormData({...formData, from: val})}>
                  <SelectTrigger><SelectValue placeholder="Current campus..." /></SelectTrigger>
                  <SelectContent>
                    {campuses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">To Campus</label>
                <Select value={formData.to} onValueChange={(val) => setFormData({...formData, to: val})}>
                  <SelectTrigger><SelectValue placeholder="Target campus..." /></SelectTrigger>
                  <SelectContent>
                    {campuses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Effective Semester</label>
                <Select value={formData.effective} onValueChange={(val) => setFormData({...formData, effective: val})}>
                  <SelectTrigger><SelectValue placeholder="Select semester..." /></SelectTrigger>
                  <SelectContent>
                    {semesters.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && actionType === 'ADMISSION_CANCEL' && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Effective Semester</label>
                <Select value={formData.effective} onValueChange={(val) => setFormData({...formData, effective: val})}>
                  <SelectTrigger><SelectValue placeholder="Select semester..." /></SelectTrigger>
                  <SelectContent>
                    {semesters.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Reason (min 10 chars)</label>
                <Input
                  placeholder="Reason for cancellation..."
                  value={formData.reason || ''}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                />
              </div>
            </div>
          )}

          {step === 3 && actionType === 'READMISSION' && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Last Active Term</label>
                <Select value={formData.lastActive} onValueChange={(val) => setFormData({...formData, lastActive: val})}>
                  <SelectTrigger><SelectValue placeholder="Select term..." /></SelectTrigger>
                  <SelectContent>
                    {semesters.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Returning Term</label>
                <Select value={formData.returning} onValueChange={(val) => setFormData({...formData, returning: val})}>
                  <SelectTrigger><SelectValue placeholder="Select term..." /></SelectTrigger>
                  <SelectContent>
                    {semesters.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Reason (min 10 chars)</label>
                <Input
                  placeholder="Reason for readmission..."
                  value={formData.reason || ''}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                />
              </div>
            </div>
          )}

          {step === 3 && actionType === 'STUDENT_INFO_UPDATE' && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Phone (11 digits, starts with 01)</label>
                <Input
                  placeholder="01XXXXXXXXX"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <Input
                  type="email"
                  placeholder="student@example.com"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Present Address</label>
                <Input
                  placeholder="Full address..."
                  value={formData.presentAddress || ''}
                  onChange={(e) => setFormData({...formData, presentAddress: e.target.value})}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3 bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold text-deep-plum">Review Request</h3>
              <div className="text-sm space-y-1">
                <div><strong>Student:</strong> {selectedStudent?.studentName} ({selectedStudent?.studentId})</div>
                <div><strong>Action Type:</strong> {actionType}</div>
                <div><strong>Details:</strong></div>
                <pre className="text-xs bg-white p-2 rounded border">{JSON.stringify(formData, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
          )}
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          {step < 4 ? (
            <Button onClick={handleNext} className="bg-deep-plum hover:bg-accent-purple">Next</Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-deep-plum hover:bg-accent-purple">Create Request</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
