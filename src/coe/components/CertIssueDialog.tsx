import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TRANSCRIPTS } from '@/coe/data/transcripts'
import { getCertificateTypes, CertificateType } from '@/coe/data/certificates'

interface CertIssueDialogProps {
  open: boolean
  onClose: () => void
  onIssue: (data: {
    studentId: string
    studentName: string
    programCode: string
    batch: string
    campus: string
    creditsCompleted: number
    cgpa: number | null
    documentType: CertificateType
    purpose: string
  }) => void
}

export default function CertIssueDialog({ open, onClose, onIssue }: CertIssueDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<typeof TRANSCRIPTS[0] | null>(null)
  const [documentType, setDocumentType] = useState<CertificateType | ''>('')
  const [purpose, setPurpose] = useState('')
  const [showStudentList, setShowStudentList] = useState(false)

  const certificateTypes = getCertificateTypes()

  const filteredStudents = TRANSCRIPTS.filter(t =>
    t.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleStudentSelect = (student: typeof TRANSCRIPTS[0]) => {
    setSelectedStudent(student)
    setSearchTerm(`${student.studentId} - ${student.studentName}`)
    setShowStudentList(false)
  }

  const handleSubmit = () => {
    if (!selectedStudent || !documentType) {
      alert('Please select a student and document type.')
      return
    }

    onIssue({
      studentId: selectedStudent.studentId,
      studentName: selectedStudent.studentName,
      programCode: selectedStudent.programCode,
      batch: selectedStudent.batch,
      campus: 'Permanent',
      creditsCompleted: selectedStudent.totalCreditsEarned,
      cgpa: selectedStudent.finalCGPA,
      documentType: documentType as CertificateType,
      purpose: purpose || 'General Purpose'
    })

    setSearchTerm('')
    setSelectedStudent(null)
    setDocumentType('')
    setPurpose('')
    onClose()
  }

  const handleClose = () => {
    setSearchTerm('')
    setSelectedStudent(null)
    setDocumentType('')
    setPurpose('')
    setShowStudentList(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Issue New Certificate</DialogTitle>
          <DialogDescription>
            Select a student and certificate type to create a new request.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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

          <div>
            <label className="text-sm font-medium mb-1 block">Certificate Type</label>
            <Select value={documentType} onValueChange={(val) => setDocumentType(val as CertificateType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select certificate type..." />
              </SelectTrigger>
              <SelectContent>
                {certificateTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Purpose (Optional)</label>
            <Input
              placeholder="e.g., Higher Education, Job Application..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-deep-plum hover:bg-accent-purple">
            Issue & Process
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
