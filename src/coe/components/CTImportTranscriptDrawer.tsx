import { useState } from 'react'
import { X, Upload, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TRANSCRIPTS } from '@/coe/data/transcripts'
import { CourseMapping } from '@/coe/data/creditTransfers'
import { parseCsv } from '@/coe/utils/creditTransfer'

interface CTImportTranscriptDrawerProps {
  open: boolean
  onClose: () => void
  onCreate: (data: {
    studentId: string
    studentName: string
    programCode: string
    campus: string
    sourceUniversity: string
    sourceSystem: 'Manual' | 'CSV'
    mappings: Partial<CourseMapping>[]
  }) => void
}

export default function CTImportTranscriptDrawer({ open, onClose, onCreate }: CTImportTranscriptDrawerProps) {
  const [mode, setMode] = useState<'csv' | 'manual'>('csv')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<typeof TRANSCRIPTS[0] | null>(null)
  const [showStudentList, setShowStudentList] = useState(false)
  const [sourceUniversity, setSourceUniversity] = useState('')
  const [csvContent, setCsvContent] = useState('')
  const [manualEntries, setManualEntries] = useState<Partial<CourseMapping>[]>([])
  const [currentEntry, setCurrentEntry] = useState<Partial<CourseMapping>>({ decision: 'Map' })

  const filteredStudents = TRANSCRIPTS.filter(t =>
    t.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleStudentSelect = (student: typeof TRANSCRIPTS[0]) => {
    setSelectedStudent(student)
    setSearchTerm(`${student.studentId} - ${student.studentName}`)
    setShowStudentList(false)
  }

  const handleCsvParse = () => {
    const mappings = parseCsv(csvContent)
    if (mappings.length === 0) {
      alert('No valid courses found in CSV. Format: sourceCode,sourceTitle,sourceCredit,grade')
      return
    }
    return mappings
  }

  const handleAddManualEntry = () => {
    if (!currentEntry.sourceCode || !currentEntry.sourceTitle || !currentEntry.sourceCredit) {
      alert('Please fill in all required fields (Code, Title, Credit)')
      return
    }
    setManualEntries([...manualEntries, currentEntry])
    setCurrentEntry({ decision: 'Map' })
  }

  const handleSubmit = () => {
    if (!selectedStudent) {
      alert('Please select a student')
      return
    }
    if (!sourceUniversity.trim()) {
      alert('Please enter source university')
      return
    }

    let mappings: Partial<CourseMapping>[] = []
    if (mode === 'csv') {
      mappings = handleCsvParse() || []
      if (mappings.length === 0) return
    } else {
      mappings = manualEntries
      if (mappings.length === 0) {
        alert('Please add at least one course entry')
        return
      }
    }

    onCreate({
      studentId: selectedStudent.studentId,
      studentName: selectedStudent.studentName,
      programCode: selectedStudent.programCode,
      campus: 'Permanent',
      sourceUniversity,
      sourceSystem: mode === 'csv' ? 'CSV' : 'Manual',
      mappings
    })

    handleClose()
  }

  const handleClose = () => {
    setMode('csv')
    setSearchTerm('')
    setSelectedStudent(null)
    setSourceUniversity('')
    setCsvContent('')
    setManualEntries([])
    setCurrentEntry({ decision: 'Map' })
    setShowStudentList(false)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-y-0 right-0 w-2/3 bg-white shadow-2xl z-50 flex flex-col">
      <div className="bg-gradient-to-r from-deep-plum to-accent-purple text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">Import Transcript</h2>
          <p className="text-sm text-white/90">Create new credit transfer request</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleClose} className="text-white hover:bg-white/20">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
              {filteredStudents.map(student => (
                <div
                  key={student.studentId}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleStudentSelect(student)}
                >
                  <div className="font-medium">{student.studentId}</div>
                  <div className="text-gray-600 text-xs">
                    {student.studentName} • {student.programCode}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Source University</label>
          <Input
            placeholder="e.g., Dhaka University, BUET..."
            value={sourceUniversity}
            onChange={(e) => setSourceUniversity(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Import Mode</label>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={mode === 'csv' ? 'default' : 'outline'}
              onClick={() => setMode('csv')}
              className={mode === 'csv' ? 'bg-deep-plum' : ''}
            >
              <Upload className="w-4 h-4 mr-2" />
              CSV Upload
            </Button>
            <Button
              size="sm"
              variant={mode === 'manual' ? 'default' : 'outline'}
              onClick={() => setMode('manual')}
              className={mode === 'manual' ? 'bg-deep-plum' : ''}
            >
              <Plus className="w-4 h-4 mr-2" />
              Manual Entry
            </Button>
          </div>
        </div>

        {mode === 'csv' && (
          <div>
            <label className="text-sm font-medium mb-1 block">Paste CSV Content</label>
            <textarea
              className="w-full border rounded-md p-3 text-sm font-mono min-h-48"
              placeholder="sourceCode,sourceTitle,sourceCredit,grade&#10;CSE101,Programming,3,A&#10;MATH201,Calculus,3,A-"
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
            />
            <div className="text-xs text-gray-500 mt-1">
              Format: sourceCode,sourceTitle,sourceCredit,grade
            </div>
          </div>
        )}

        {mode === 'manual' && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              <Input
                placeholder="Code"
                value={currentEntry.sourceCode || ''}
                onChange={(e) => setCurrentEntry({ ...currentEntry, sourceCode: e.target.value })}
              />
              <Input
                placeholder="Title"
                value={currentEntry.sourceTitle || ''}
                onChange={(e) => setCurrentEntry({ ...currentEntry, sourceTitle: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Credit"
                value={currentEntry.sourceCredit || ''}
                onChange={(e) => setCurrentEntry({ ...currentEntry, sourceCredit: parseFloat(e.target.value) || 0 })}
              />
              <Input
                placeholder="Grade"
                value={currentEntry.sourceGrade || ''}
                onChange={(e) => setCurrentEntry({ ...currentEntry, sourceGrade: e.target.value })}
              />
            </div>
            <Button size="sm" onClick={handleAddManualEntry} className="bg-deep-plum hover:bg-accent-purple">
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>

            {manualEntries.length > 0 && (
              <div className="border rounded-md p-3 max-h-64 overflow-y-auto">
                <div className="text-sm font-medium mb-2">Added Courses ({manualEntries.length})</div>
                <div className="space-y-2">
                  {manualEntries.map((entry, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded">
                      <div>
                        <span className="font-semibold">{entry.sourceCode}</span> - {entry.sourceTitle}
                        <span className="ml-2 text-gray-600">
                          ({entry.sourceCredit} cr, {entry.sourceGrade || 'N/A'})
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setManualEntries(manualEntries.filter((_, i) => i !== idx))}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t p-4 bg-gray-50 flex justify-end gap-2">
        <Button variant="outline" onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} className="bg-deep-plum hover:bg-accent-purple">
          Create Request
        </Button>
      </div>
    </div>
  )
}
