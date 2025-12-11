import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Hash, Copy, RefreshCw, RotateCcw, Settings } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface CodePattern {
  name: string
  description: string
  pattern: string
  example: string
  fields: string[]
}

const STORAGE_KEY_PREFIX = 'code_gen_counter_'

export default function CodeGenerator() {
  const [patterns] = useState<CodePattern[]>([
    { 
      name: 'Student ID', 
      description: 'Program + Year + Semester + Serial', 
      pattern: '{PROG}{YY}{SEM}{####}', 
      example: 'CS25010042',
      fields: ['PROG', 'YY', 'SEM', '####']
    },
    { 
      name: 'UGC Roll', 
      description: 'UGC registration number', 
      pattern: '029{YY}{S}00{PROG5}{###}', 
      example: '02925100081310042',
      fields: ['YY', 'S', 'PROG5', '###']
    },
    { 
      name: 'Payment Receipt', 
      description: 'Money receipt number', 
      pattern: 'MR-{YYYY}-{#####}', 
      example: 'MR-2025-44001',
      fields: ['YYYY', '#####']
    },
    { 
      name: 'Admission ID', 
      description: 'Admission application ID', 
      pattern: 'ADM{YYYY}{####}', 
      example: 'ADM20250001',
      fields: ['YYYY', '####']
    },
    { 
      name: 'Course Code', 
      description: 'Department + Level + Serial', 
      pattern: '{DEPT}{####}', 
      example: 'CSE1101',
      fields: ['DEPT', '####']
    },
    { 
      name: 'Invoice Number', 
      description: 'Invoice for billing', 
      pattern: 'INV-{YYYY}-{######}', 
      example: 'INV-2025-000001',
      fields: ['YYYY', '######']
    }
  ])

  const [selectedPattern, setSelectedPattern] = useState<CodePattern>(patterns[0])
  const [generatedCode, setGeneratedCode] = useState('')
  
  // User inputs
  const [programCode, setProgramCode] = useState('CS')
  const [departmentCode, setDepartmentCode] = useState('CSE')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedSemester, setSelectedSemester] = useState('01')
  const [ugcProgCode, setUgcProgCode] = useState('08131')
  
  // Counter management
  const [counter, setCounter] = useState(1)
  const [showCounterDialog, setShowCounterDialog] = useState(false)
  const [newCounterValue, setNewCounterValue] = useState('')

  // Common program codes
  const commonPrograms = [
    'CS', 'CSE', 'BBA', 'MBA', 'EEE', 'CE', 'ME', 'LLB', 'ENG', 'PHY'
  ]

  // Common departments
  const commonDepartments = [
    'CSE', 'EEE', 'CE', 'ME', 'BBA', 'ENG', 'LAW', 'PHY', 'MAT', 'CHE'
  ]

  // Semesters
  const semesters = [
    { value: '01', label: 'Spring' },
    { value: '02', label: 'Summer' },
    { value: '03', label: 'Fall' }
  ]

  // Generate year options (current year and past 5 years)
  const yearOptions = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i)

  // Load counter from localStorage on pattern change
  useEffect(() => {
    const storageKey = STORAGE_KEY_PREFIX + selectedPattern.name.replace(/\s+/g, '_')
    const savedCounter = localStorage.getItem(storageKey)
    setCounter(savedCounter ? parseInt(savedCounter) : 1)
  }, [selectedPattern])

  // Save counter to localStorage
  const saveCounter = (value: number) => {
    const storageKey = STORAGE_KEY_PREFIX + selectedPattern.name.replace(/\s+/g, '_')
    localStorage.setItem(storageKey, value.toString())
    setCounter(value)
  }

  const generateCode = () => {
    let code = selectedPattern.pattern
    const shortYear = selectedYear.toString().slice(-2)

    // Replace placeholders based on user inputs
    code = code.replace('{YYYY}', selectedYear.toString())
    code = code.replace('{YY}', shortYear)
    code = code.replace('{SEM}', selectedSemester)
    code = code.replace('{S}', selectedSemester.charAt(1))
    code = code.replace('{PROG}', programCode)
    code = code.replace('{PROG5}', ugcProgCode)
    code = code.replace('{DEPT}', departmentCode)
    
    // Replace serial numbers with incremental counter
    code = code.replace('{######}', counter.toString().padStart(6, '0'))
    code = code.replace('{#####}', counter.toString().padStart(5, '0'))
    code = code.replace('{####}', counter.toString().padStart(4, '0'))
    code = code.replace('{###}', counter.toString().padStart(3, '0'))

    setGeneratedCode(code)
    
    // Increment counter for next generation
    saveCounter(counter + 1)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode)
    alert('Code copied to clipboard!')
  }

  const resetCounter = () => {
    saveCounter(1)
    setShowCounterDialog(false)
    setNewCounterValue('')
  }

  const setCustomCounter = () => {
    const value = parseInt(newCounterValue)
    if (!isNaN(value) && value > 0) {
      saveCounter(value)
      setShowCounterDialog(false)
      setNewCounterValue('')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Code Generator</h1>
          <p className="text-gray-600 text-sm mt-1">Generate various system codes and IDs with incremental serial numbers</p>
        </div>
        <Dialog open={showCounterDialog} onOpenChange={setShowCounterDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Manage Counter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Counter Management - {selectedPattern.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                <p className="text-sm font-medium text-blue-900">Current Counter Value</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{counter}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Set Custom Counter Value</label>
                <Input
                  type="number"
                  min="1"
                  value={newCounterValue}
                  onChange={(e) => setNewCounterValue(e.target.value)}
                  placeholder="Enter counter value"
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={setCustomCounter} className="flex-1">
                  Apply Custom Value
                </Button>
                <Button onClick={resetCounter} variant="destructive" className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to 1
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4 text-deep-plum">Select Code Type</h3>
            <div className="space-y-2">
              {patterns.map((pattern, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPattern(pattern)}
                  className={`w-full text-left p-3 rounded-md border transition-colors ${
                    selectedPattern.name === pattern.name
                      ? 'bg-mint-green/20 border-deep-plum'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{pattern.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{pattern.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {pattern.example}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Hash className="w-5 h-5 text-deep-plum" />
                <h3 className="font-semibold text-deep-plum">{selectedPattern.name}</h3>
              </div>
              <Badge className="bg-deep-plum">
                Counter: {counter}
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pattern:</p>
                <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
                  {selectedPattern.pattern}
                </div>
              </div>

              <div className="space-y-3 p-4 bg-mint-green/5 rounded-md border border-mint-green/30">
                <h4 className="text-sm font-semibold text-deep-plum">Configure Parameters</h4>
                
                {selectedPattern.fields.includes('YYYY') && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Year</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      className="w-full p-2 border rounded-md text-sm"
                    >
                      {yearOptions.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedPattern.fields.includes('YY') && !selectedPattern.fields.includes('YYYY') && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Year</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      className="w-full p-2 border rounded-md text-sm"
                    >
                      {yearOptions.map(year => (
                        <option key={year} value={year}>{year} ({year.toString().slice(-2)})</option>
                      ))}
                    </select>
                  </div>
                )}

                {(selectedPattern.fields.includes('SEM') || selectedPattern.fields.includes('S')) && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Semester</label>
                    <select
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      className="w-full p-2 border rounded-md text-sm"
                    >
                      {semesters.map(sem => (
                        <option key={sem.value} value={sem.value}>
                          {sem.label} ({sem.value})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedPattern.fields.includes('PROG') && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Program Code</label>
                    <div className="space-y-2">
                      <Input
                        value={programCode}
                        onChange={(e) => setProgramCode(e.target.value.toUpperCase())}
                        placeholder="e.g., CS, BBA"
                        maxLength={3}
                      />
                      <div className="flex flex-wrap gap-1">
                        {commonPrograms.map(prog => (
                          <Button
                            key={prog}
                            variant="outline"
                            size="sm"
                            onClick={() => setProgramCode(prog)}
                            className="text-xs h-7"
                          >
                            {prog}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedPattern.fields.includes('DEPT') && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Department Code</label>
                    <div className="space-y-2">
                      <Input
                        value={departmentCode}
                        onChange={(e) => setDepartmentCode(e.target.value.toUpperCase())}
                        placeholder="e.g., CSE, EEE"
                        maxLength={4}
                      />
                      <div className="flex flex-wrap gap-1">
                        {commonDepartments.map(dept => (
                          <Button
                            key={dept}
                            variant="outline"
                            size="sm"
                            onClick={() => setDepartmentCode(dept)}
                            className="text-xs h-7"
                          >
                            {dept}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedPattern.fields.includes('PROG5') && (
                  <div>
                    <label className="block text-sm font-medium mb-1">UGC Program Code (5 digits)</label>
                    <Input
                      value={ugcProgCode}
                      onChange={(e) => setUgcProgCode(e.target.value)}
                      placeholder="e.g., 08131"
                      maxLength={5}
                      pattern="[0-9]*"
                    />
                  </div>
                )}

                {(selectedPattern.fields.includes('####') || 
                  selectedPattern.fields.includes('###') ||
                  selectedPattern.fields.includes('#####') ||
                  selectedPattern.fields.includes('######')) && (
                  <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                    <p className="text-xs font-medium text-blue-900">Serial Number (Auto-increment)</p>
                    <p className="text-lg font-bold text-blue-900 mt-1">
                      {selectedPattern.fields.includes('######') && counter.toString().padStart(6, '0')}
                      {selectedPattern.fields.includes('#####') && counter.toString().padStart(5, '0')}
                      {selectedPattern.fields.includes('####') && counter.toString().padStart(4, '0')}
                      {selectedPattern.fields.includes('###') && counter.toString().padStart(3, '0')}
                    </p>
                    <p className="text-xs text-blue-700 mt-1">Will increment after generation</p>
                  </div>
                )}
              </div>

              <Button 
                onClick={generateCode} 
                className="w-full bg-deep-plum hover:bg-deep-plum/90"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate Code
              </Button>
            </div>
          </Card>

          {generatedCode && (
            <Card className="p-6">
              <h3 className="font-semibold mb-3 text-deep-plum">Generated Code</h3>
              <div className="flex items-center justify-between p-4 bg-mint-green/20 rounded-md border border-deep-plum">
                <span className="font-mono text-lg font-bold text-deep-plum">
                  {generatedCode}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="hover:bg-deep-plum/10"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Click the copy icon to copy to clipboard</p>
            </Card>
          )}

          <Card className="p-6 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-sm mb-2 text-blue-900">How It Works</h4>
            <div className="space-y-2 text-xs text-blue-800">
              <p>• Select a code type from the list</p>
              <p>• Configure the parameters using dropdowns and inputs</p>
              <p>• Serial numbers increment automatically with each generation</p>
              <p>• Use "Manage Counter" to reset or set custom values</p>
              <p>• Each code type maintains its own counter</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
