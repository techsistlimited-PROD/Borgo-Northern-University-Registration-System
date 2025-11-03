import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Hash, Copy, RefreshCw } from 'lucide-react'

interface CodePattern {
  name: string
  description: string
  pattern: string
  example: string
  prefix?: string
}

export default function CodeGenerator() {
  const [patterns] = useState<CodePattern[]>([
    { name: 'Student ID', description: 'Program + Year + Semester + Serial', pattern: '{PROG}{YY}{SEM}{####}', example: 'CS25010042', prefix: 'CS' },
    { name: 'UGC Roll', description: 'UGC registration number', pattern: '029{YY}{S}00{PROG5}{###}', example: '02925100081310042' },
    { name: 'Payment Receipt', description: 'Money receipt number', pattern: 'MR-{YYYY}-{#####}', example: 'MR-2025-44001' },
    { name: 'Admission ID', description: 'Admission application ID', pattern: 'ADM{YYYY}{####}', example: 'ADM20250001' },
    { name: 'Course Code', description: 'Department + Level + Serial', pattern: '{DEPT}{####}', example: 'CSE1101' },
    { name: 'Invoice Number', description: 'Invoice for billing', pattern: 'INV-{YYYY}-{######}', example: 'INV-2025-000001' }
  ])

  const [selectedPattern, setSelectedPattern] = useState<CodePattern>(patterns[0])
  const [customPrefix, setCustomPrefix] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')

  const generateCode = () => {
    let code = selectedPattern.pattern
    const year = new Date().getFullYear()
    const shortYear = year.toString().slice(-2)

    code = code.replace('{YYYY}', year.toString())
    code = code.replace('{YY}', shortYear)
    code = code.replace('{SEM}', '01')
    code = code.replace('{S}', '1')
    code = code.replace('{PROG}', customPrefix || selectedPattern.prefix || 'XX')
    code = code.replace('{PROG5}', '08131')
    code = code.replace('{DEPT}', customPrefix || 'CSE')
    code = code.replace('{######}', Math.floor(Math.random() * 1000000).toString().padStart(6, '0'))
    code = code.replace('{#####}', Math.floor(Math.random() * 100000).toString().padStart(5, '0'))
    code = code.replace('{####}', Math.floor(Math.random() * 10000).toString().padStart(4, '0'))
    code = code.replace('{###}', Math.floor(Math.random() * 1000).toString().padStart(3, '0'))

    setGeneratedCode(code)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode)
    alert('Code copied to clipboard!')
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-deep-plum">Code Generator</h1>
        <p className="text-gray-600 text-sm mt-1">Generate various system codes and IDs</p>
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
            <div className="flex items-center space-x-2 mb-4">
              <Hash className="w-5 h-5 text-deep-plum" />
              <h3 className="font-semibold text-deep-plum">{selectedPattern.name}</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pattern:</p>
                <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
                  {selectedPattern.pattern}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Example:</p>
                <div className="p-3 bg-mint-green/10 rounded-md font-mono text-sm font-medium">
                  {selectedPattern.example}
                </div>
              </div>

              {(selectedPattern.name.includes('Student') || selectedPattern.name.includes('Course')) && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Custom Prefix {selectedPattern.name.includes('Student') ? '(Program)' : '(Department)'}
                  </label>
                  <Input
                    value={customPrefix}
                    onChange={(e) => setCustomPrefix(e.target.value.toUpperCase())}
                    placeholder={selectedPattern.name.includes('Student') ? 'e.g., CSE, BBA' : 'e.g., CSE, EEE'}
                    maxLength={selectedPattern.name.includes('Student') ? 2 : 3}
                  />
                </div>
              )}

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
            <h4 className="font-semibold text-sm mb-2 text-blue-900">Pattern Legend</h4>
            <div className="space-y-1 text-xs text-blue-800">
              <p><code className="bg-blue-100 px-1 rounded">YYYY</code> = Full year (e.g., 2025)</p>
              <p><code className="bg-blue-100 px-1 rounded">YY</code> = Short year (e.g., 25)</p>
              <p><code className="bg-blue-100 px-1 rounded">SEM</code> = Semester code (01, 02, 03)</p>
              <p><code className="bg-blue-100 px-1 rounded">PROG</code> = Program code</p>
              <p><code className="bg-blue-100 px-1 rounded">####</code> = Random digits</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
