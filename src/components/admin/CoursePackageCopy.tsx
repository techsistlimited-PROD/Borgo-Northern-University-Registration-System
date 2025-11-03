import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, ArrowRight, CheckCircle } from 'lucide-react'
import { PROGRAMS, SEMESTERS } from '@/lib/seedData'

export default function CoursePackageCopy() {
  const [sourceProgram, setSourceProgram] = useState('')
  const [sourceSemester, setSourceSemester] = useState('')
  const [targetProgram, setTargetProgram] = useState('')
  const [targetSemester, setTargetSemester] = useState('')
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleCopy = () => {
    if (!sourceProgram || !sourceSemester || !targetProgram || !targetSemester) {
      alert('Please select all required fields')
      return
    }

    if (sourceProgram === targetProgram && sourceSemester === targetSemester) {
      alert('Source and target cannot be the same')
      return
    }

    setTimeout(() => {
      setCopyStatus('success')
      setTimeout(() => setCopyStatus('idle'), 3000)
    }, 1000)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-deep-plum">Course Package Copy</h1>
        <p className="text-gray-600 text-sm mt-1">Copy course offerings from one semester/program to another</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <Card className="p-6">
          <h3 className="font-semibold mb-4 text-deep-plum">Source</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Program</label>
              <select
                value={sourceProgram}
                onChange={(e) => setSourceProgram(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Program</option>
                {PROGRAMS.map(program => (
                  <option key={program.code} value={program.code}>{program.code} - {program.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Semester</label>
              <select
                value={sourceSemester}
                onChange={(e) => setSourceSemester(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Semester</option>
                {SEMESTERS.map(semester => (
                  <option key={semester.code} value={semester.code}>{semester.name}</option>
                ))}
              </select>
            </div>

            {sourceProgram && sourceSemester && (
              <div className="p-3 bg-mint-green/10 rounded-md border border-mint-green">
                <p className="text-xs text-gray-600 mb-1">Selected Source:</p>
                <p className="font-medium text-sm">{sourceProgram} - {sourceSemester}</p>
                <p className="text-xs text-gray-500 mt-1">12 courses will be copied</p>
              </div>
            )}
          </div>
        </Card>

        <div className="flex justify-center">
          <div className="p-4 bg-gray-100 rounded-full">
            <ArrowRight className="w-8 h-8 text-deep-plum" />
          </div>
        </div>

        <Card className="p-6">
          <h3 className="font-semibold mb-4 text-deep-plum">Target</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Program</label>
              <select
                value={targetProgram}
                onChange={(e) => setTargetProgram(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Program</option>
                {PROGRAMS.map(program => (
                  <option key={program.code} value={program.code}>{program.code} - {program.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Semester</label>
              <select
                value={targetSemester}
                onChange={(e) => setTargetSemester(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Semester</option>
                {SEMESTERS.map(semester => (
                  <option key={semester.code} value={semester.code}>{semester.name}</option>
                ))}
              </select>
            </div>

            {targetProgram && targetSemester && (
              <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">Selected Target:</p>
                <p className="font-medium text-sm">{targetProgram} - {targetSemester}</p>
                <p className="text-xs text-gray-500 mt-1">Courses will be copied here</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-deep-plum">Copy Options</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Copy course offerings</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Copy faculty assignments</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Copy section configurations</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Copy room allocations</span>
            </label>
          </div>
        </div>
      </Card>

      <div className="flex justify-center">
        <Button 
          onClick={handleCopy}
          className="bg-deep-plum hover:bg-deep-plum/90 px-8"
          disabled={!sourceProgram || !sourceSemester || !targetProgram || !targetSemester}
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Course Package
        </Button>
      </div>

      {copyStatus === 'success' && (
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">Copy Successful!</p>
              <p className="text-sm text-green-700 mt-1">
                Course package copied from {sourceProgram}/{sourceSemester} to {targetProgram}/{targetSemester}
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="font-semibold mb-3 text-deep-plum">What will be copied?</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start space-x-2">
            <Badge variant="outline" className="mt-0.5">1</Badge>
            <p>All course offerings including course code, title, and credit hours</p>
          </div>
          <div className="flex items-start space-x-2">
            <Badge variant="outline" className="mt-0.5">2</Badge>
            <p>Faculty assignments for each course section</p>
          </div>
          <div className="flex items-start space-x-2">
            <Badge variant="outline" className="mt-0.5">3</Badge>
            <p>Section configurations including capacity and timing</p>
          </div>
          <div className="flex items-start space-x-2">
            <Badge variant="outline" className="mt-0.5">4</Badge>
            <p>Prerequisites and co-requisites information</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
