import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileText, Edit2, Maximize2, Save } from 'lucide-react'
import { DEMO_MODE, showDemoToast } from '@/config/demo'

interface ShiftDayRow {
  shiftName: string
  date: string
  day: string
  startTime: string
  endTime: string
  isHoliday: boolean
  inTolerance: number
  outTolerance: number
  dayType: 'DAY' | 'NIGHT'
}

const generateShiftWeek = (template: string, employeeId: string = '5242198', employeeName: string = 'Afra ENG'): ShiftDayRow[] => {
  const baseDate = new Date('2025-01-20')
  const days = ['SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
  const dayAbbrev = ['SA', 'SU', 'M', 'TU', 'W', 'T', 'FR']
  
  const templates = {
    'Regular': [
      { start: '09:15', end: '15:15', holiday: false },
      { start: '09:15', end: '16:00', holiday: true },  // Sunday Holiday
      { start: '09:30', end: '16:00', holiday: false },
      { start: '08:00', end: '15:00', holiday: false },
      { start: '09:30', end: '15:00', holiday: false },
      { start: '11:00', end: '16:00', holiday: false },
      { start: '10:00', end: '15:30', holiday: true }   // Friday Holiday
    ],
    'Night': [
      { start: '22:00', end: '06:00', holiday: false },
      { start: '22:00', end: '06:00', holiday: true },
      { start: '22:00', end: '06:00', holiday: false },
      { start: '22:00', end: '06:00', holiday: false },
      { start: '22:00', end: '06:00', holiday: false },
      { start: '22:00', end: '06:00', holiday: false },
      { start: '22:00', end: '06:00', holiday: true }
    ],
    'Flex Morning': [
      { start: '06:00', end: '14:00', holiday: false },
      { start: '06:00', end: '14:00', holiday: true },
      { start: '06:00', end: '14:00', holiday: false },
      { start: '06:00', end: '14:00', holiday: false },
      { start: '06:00', end: '14:00', holiday: false },
      { start: '06:00', end: '14:00', holiday: false },
      { start: '06:00', end: '14:00', holiday: true }
    ],
    'Flex Evening': [
      { start: '14:00', end: '22:00', holiday: false },
      { start: '14:00', end: '22:00', holiday: true },
      { start: '14:00', end: '22:00', holiday: false },
      { start: '14:00', end: '22:00', holiday: false },
      { start: '14:00', end: '22:00', holiday: false },
      { start: '14:00', end: '22:00', holiday: false },
      { start: '14:00', end: '22:00', holiday: true }
    ]
  }

  const config = templates[template as keyof typeof templates] || templates['Regular']

  return days.map((day, index) => {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + index)
    const dateStr = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
    
    return {
      shiftName: `${employeeId} (${employeeName}) - ${dayAbbrev[index]}`,
      date: dateStr,
      day,
      startTime: config[index].start,
      endTime: config[index].end,
      isHoliday: config[index].holiday,
      inTolerance: 10,
      outTolerance: 10,
      dayType: template === 'Night' ? 'NIGHT' : 'DAY'
    }
  })
}

export default function ShiftRosterPlanner() {
  const [selectedTemplate, setSelectedTemplate] = useState('Regular')
  const [shiftRows, setShiftRows] = useState<ShiftDayRow[]>(generateShiftWeek('Regular'))

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template)
    setShiftRows(generateShiftWeek(template))
  }

  const handleRowChange = (index: number, field: keyof ShiftDayRow, value: any) => {
    const updated = [...shiftRows]
    updated[index] = { ...updated[index], [field]: value }
    setShiftRows(updated)
  }

  const handleSaveRow = (index: number) => {
    if (DEMO_MODE) {
      alert(showDemoToast('Shift row saved'))
    }
  }

  const handleEditToggle = () => {
    alert(showDemoToast('Edit mode toggled'))
  }

  const handleExpand = () => {
    alert(showDemoToast('Expand/collapse view'))
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header Bar */}
      <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Shift Details</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleEditToggle}
            className="p-2 hover:bg-blue-200 rounded transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            onClick={handleExpand}
            className="p-2 hover:bg-blue-200 rounded transition-colors"
            title="Expand/Collapse"
          >
            <Maximize2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Tab (Shift Detail) */}
      <div className="border-b border-gray-200">
        <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
          Shift Detail
        </button>
      </div>

      {/* Template Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium">Select Shift Template:</label>
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Regular">Regular</SelectItem>
                <SelectItem value="Night">Night</SelectItem>
                <SelectItem value="Flex Morning">Flex Morning</SelectItem>
                <SelectItem value="Flex Evening">Flex Evening</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Shift Details Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase border">Shift Name</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase border">Date</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase border">Day</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase border">Start Time</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase border">End Time</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase border">Holiday</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase border">In Tolerance</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase border">Out Tolerance</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase border">Day Type</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase border">Action</th>
                </tr>
              </thead>
              <tbody>
                {shiftRows.map((row, index) => (
                  <tr key={index} className={row.isHoliday ? 'bg-blue-50' : 'bg-white'}>
                    <td className="px-3 py-2 text-sm border">{row.shiftName}</td>
                    <td className="px-3 py-2 text-sm border">{row.date}</td>
                    <td className="px-3 py-2 text-sm border font-medium">{row.day}</td>
                    <td className="px-3 py-2 border">
                      <Input 
                        type="time" 
                        value={row.startTime}
                        onChange={(e) => handleRowChange(index, 'startTime', e.target.value)}
                        disabled={row.isHoliday}
                        className="w-32 h-8 text-sm"
                      />
                    </td>
                    <td className="px-3 py-2 border">
                      <Input 
                        type="time" 
                        value={row.endTime}
                        onChange={(e) => handleRowChange(index, 'endTime', e.target.value)}
                        disabled={row.isHoliday}
                        className="w-32 h-8 text-sm"
                      />
                    </td>
                    <td className="px-3 py-2 border text-center">
                      <input 
                        type="checkbox" 
                        checked={row.isHoliday}
                        onChange={(e) => handleRowChange(index, 'isHoliday', e.target.checked)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-2 border">
                      <Input 
                        type="number" 
                        value={row.inTolerance}
                        onChange={(e) => handleRowChange(index, 'inTolerance', parseInt(e.target.value))}
                        className="w-20 h-8 text-sm"
                        min="0"
                      />
                    </td>
                    <td className="px-3 py-2 border">
                      <Input 
                        type="number" 
                        value={row.outTolerance}
                        onChange={(e) => handleRowChange(index, 'outTolerance', parseInt(e.target.value))}
                        className="w-20 h-8 text-sm"
                        min="0"
                      />
                    </td>
                    <td className="px-3 py-2 border">
                      <Select 
                        value={row.dayType} 
                        onValueChange={(val) => handleRowChange(index, 'dayType', val as 'DAY' | 'NIGHT')}
                      >
                        <SelectTrigger className="w-24 h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DAY">DAY</SelectItem>
                          <SelectItem value="NIGHT">NIGHT</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-2 border text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSaveRow(index)}
                        className="h-8"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {DEMO_MODE && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Demo Mode:</strong> All shift changes are in-memory only. Click the save icon to simulate saving each row.
          </p>
        </div>
      )}
    </div>
  )
}
