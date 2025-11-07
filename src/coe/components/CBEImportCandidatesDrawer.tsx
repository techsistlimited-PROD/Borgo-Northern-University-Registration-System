import { useState } from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Plus } from 'lucide-react'

interface CBEImportCandidatesDrawerProps {
  open: boolean
  onClose: () => void
  meetingId: string
  onImport: (candidates: Array<{
    studentId: string
    studentName: string
    program: string
    cgpa: number
    completedCredits: number
  }>) => void
}

export default function CBEImportCandidatesDrawer({
  open,
  onClose,
  meetingId,
  onImport
}: CBEImportCandidatesDrawerProps) {
  const [manualEntry, setManualEntry] = useState({
    studentId: '',
    studentName: '',
    program: '',
    cgpa: '',
    completedCredits: ''
  })

  const handleManualAdd = () => {
    if (!manualEntry.studentId || !manualEntry.studentName || !manualEntry.program) {
      return
    }
    onImport([{
      studentId: manualEntry.studentId,
      studentName: manualEntry.studentName,
      program: manualEntry.program,
      cgpa: parseFloat(manualEntry.cgpa) || 0,
      completedCredits: parseInt(manualEntry.completedCredits) || 0
    }])
    setManualEntry({
      studentId: '',
      studentName: '',
      program: '',
      cgpa: '',
      completedCredits: ''
    })
  }

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="max-w-2xl mx-auto max-h-[90vh]">
        <DrawerHeader className="border-b">
          <div className="flex justify-between items-start">
            <div>
              <DrawerTitle>Import CBE Candidates</DrawerTitle>
              <DrawerDescription>
                Add candidates to this CBE meeting manually or via CSV upload
              </DrawerDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DrawerHeader>

        <div className="p-6 space-y-6 overflow-y-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload CSV file with candidate data
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Format: studentId, name, program, cgpa, credits
                    </p>
                    <Button variant="outline" size="sm">
                      Select CSV File
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium text-sm mb-4">Add Candidate Manually</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Student ID</Label>
                    <Input
                      value={manualEntry.studentId}
                      onChange={(e) => setManualEntry({ ...manualEntry, studentId: e.target.value })}
                      placeholder="STU-2021-0001"
                    />
                  </div>
                  <div>
                    <Label>Student Name</Label>
                    <Input
                      value={manualEntry.studentName}
                      onChange={(e) => setManualEntry({ ...manualEntry, studentName: e.target.value })}
                      placeholder="Full Name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Program</Label>
                    <Input
                      value={manualEntry.program}
                      onChange={(e) => setManualEntry({ ...manualEntry, program: e.target.value })}
                      placeholder="CSE"
                    />
                  </div>
                  <div>
                    <Label>CGPA</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={manualEntry.cgpa}
                      onChange={(e) => setManualEntry({ ...manualEntry, cgpa: e.target.value })}
                      placeholder="3.50"
                    />
                  </div>
                  <div>
                    <Label>Credits</Label>
                    <Input
                      type="number"
                      value={manualEntry.completedCredits}
                      onChange={(e) => setManualEntry({ ...manualEntry, completedCredits: e.target.value })}
                      placeholder="120"
                    />
                  </div>
                </div>
                <Button onClick={handleManualAdd} className="w-full nu-button-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Candidate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
