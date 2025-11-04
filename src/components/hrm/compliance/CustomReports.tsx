import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { FileDown, FileText } from 'lucide-react'

export default function CustomReports() {
  const [reportType, setReportType] = useState('active-staff')

  const reportData: Record<string, any[]> = {
    'active-staff': [
      { id: 'EMP-001', name: 'Md. Imran Hossain', dept: 'CSE', designation: 'Assistant Professor' },
      { id: 'EMP-002', name: 'Dr. Ayesha Karim', dept: 'CSE', designation: 'Associate Professor' }
    ],
    'salary-report': [
      { id: 'EMP-001', name: 'Md. Imran Hossain', gross: 82000, net: 63960 },
      { id: 'EMP-002', name: 'Dr. Ayesha Karim', gross: 108000, net: 85200 }
    ]
  }

  const currentData = reportData[reportType] || []

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800">Custom Reports</h2>

      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active-staff">Active Staff</SelectItem>
                  <SelectItem value="inactive-staff">Inactive Staff</SelectItem>
                  <SelectItem value="salary-report">Salary Report</SelectItem>
                  <SelectItem value="leave-summary">Leave Summary</SelectItem>
                  <SelectItem value="recruitment">Recruitment Pipeline</SelectItem>
                  <SelectItem value="training">Training Participation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Department</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="BBA">BBA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">From Date</label>
              <Input type="date" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">To Date</label>
              <Input type="date" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Report Results ({currentData.length})</CardTitle>
            <div className="flex gap-2">
              <Button className="flex items-center gap-2" variant="outline">
                <FileText className="w-4 h-4" />
                Export CSV
              </Button>
              <Button className="flex items-center gap-2">
                <FileDown className="w-4 h-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(currentData[0] || {}).map(key => (
                  <th key={key} className="px-3 py-2 text-left capitalize">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {currentData.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((val: any, i) => (
                    <td key={i} className="px-3 py-2">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
