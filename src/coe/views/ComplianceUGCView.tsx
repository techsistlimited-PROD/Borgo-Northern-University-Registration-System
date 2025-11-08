import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Download, Printer } from 'lucide-react'

type ReportSection = 'ugc-completion' | 'ugc-cbe' | 'ugc-graduation' | 'ugc-enrollment' | 'banbais-summary' | 'banbais-semester' | 'banbais-program' | 'result-pub-log' | 'cert-issue-log' | 'transcript-log' | 'tabulation-log'

const REPORT_SECTIONS = [
  { id: 'ugc-completion', name: 'UGC Completed Students Format', category: 'UGC Standards' },
  { id: 'ugc-cbe', name: 'UGC CBE-wise Completion Format', category: 'UGC Standards' },
  { id: 'ugc-graduation', name: 'UGC Graduation Report', category: 'UGC Standards' },
  { id: 'ugc-enrollment', name: 'UGC Program-Wise Enrollment', category: 'UGC Standards' },
  { id: 'banbais-summary', name: 'BANBAIS Student Summary', category: 'BANBAIS Format' },
  { id: 'banbais-semester', name: 'BANBAIS Semester Statistics', category: 'BANBAIS Format' },
  { id: 'banbais-program', name: 'BANBAIS Accredited Program', category: 'BANBAIS Format' },
  { id: 'result-pub-log', name: 'Result Publication Log', category: 'Compliance Logs' },
  { id: 'cert-issue-log', name: 'Certificate Issue Log', category: 'Compliance Logs' },
  { id: 'transcript-log', name: 'Transcript Issue Log', category: 'Compliance Logs' },
  { id: 'tabulation-log', name: 'Tabulation Approval Log', category: 'Compliance Logs' }
]

const UGC_COMPLETION_DATA = [
  ['STU-2021-0012', 'Mahfuz Rahman', 'CSE', 'Male', '2021-2025', 120, 3.45, 'First Class', 'Regular', '2025-12-15'],
  ['STU-2021-0045', 'Rahim Uddin', 'EEE', 'Male', '2021-2025', 125, 3.67, 'First Class', 'Regular', '2025-12-15'],
  ['STU-2021-0089', 'Farhan Ahmed', 'CSE', 'Male', '2021-2025', 120, 3.52, 'First Class', 'Regular', '2025-12-15'],
  ['STU-2021-0101', 'Tahmid Hassan', 'MBA', 'Male', '2021-2023', 48, 3.72, 'First Class', 'Evening', '2023-08-20']
]

const BANBAIS_SUMMARY_DATA = [
  ['CSE', 450, 425, 25, 94.4, 380, 85],
  ['BBA', 380, 360, 20, 94.7, 320, 60],
  ['EEE', 320, 305, 15, 95.3, 270, 50],
  ['LLB', 280, 265, 15, 94.6, 230, 50]
]

const RESULT_PUB_LOG_DATA = [
  ['CSE101', 'A', 'Dr. Ahmed', '2025-11-25 14:30', 42, 'Published', 'No issues'],
  ['BBA101', 'B', 'Prof. Karim', '2025-11-26 10:15', 35, 'Published', 'Late by 2 days'],
  ['EEE201', 'A', 'Dr. Hassan', '2025-11-27 09:00', 38, 'Published', 'No issues']
]

export default function ComplianceUGCView() {
  const [activeSection, setActiveSection] = useState<ReportSection>('ugc-completion')

  const handleExportCSV = () => {
    const reportName = REPORT_SECTIONS.find(s => s.id === activeSection)?.name || 'Report'
    const filename = `${activeSection}_${new Date().toISOString().split('T')[0]}.csv`
    
    let data: any[] = []
    let headers: string[] = []
    
    switch(activeSection) {
      case 'ugc-completion':
        headers = ['Student ID', 'Name', 'Program', 'Gender', 'Session', 'Credits', 'CGPA', 'Class', 'Shift', 'Completion Date']
        data = UGC_COMPLETION_DATA
        break
      case 'banbais-summary':
        headers = ['Program', 'Total Enrolled', 'Active', 'Inactive', 'Retention %', 'Passed', 'Failed']
        data = BANBAIS_SUMMARY_DATA
        break
      case 'result-pub-log':
        headers = ['Course', 'Section', 'Published By', 'Timestamp', 'Students', 'Status', 'Remarks']
        data = RESULT_PUB_LOG_DATA
        break
      default:
        headers = ['Data', 'Not', 'Available']
        data = [['Sample', 'Data', 'Placeholder']]
    }
    
    const csvContent = [headers.join(','), ...data.map(row => row.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
  }

  const handlePrint = () => {
    window.print()
  }

  const renderTableContent = () => {
    switch(activeSection) {
      case 'ugc-completion':
        return (
          <>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>CGPA</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Completion Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {UGC_COMPLETION_DATA.map((row, idx) => (
                <TableRow key={idx}>
                  {row.map((cell, cellIdx) => (
                    <TableCell key={cellIdx}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </>
        )
      
      case 'banbais-summary':
        return (
          <>
            <TableHeader>
              <TableRow>
                <TableHead>Program</TableHead>
                <TableHead>Total Enrolled</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Inactive</TableHead>
                <TableHead>Retention %</TableHead>
                <TableHead>Passed</TableHead>
                <TableHead>Failed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {BANBAIS_SUMMARY_DATA.map((row, idx) => (
                <TableRow key={idx}>
                  {row.map((cell, cellIdx) => (
                    <TableCell key={cellIdx}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </>
        )
      
      case 'result-pub-log':
        return (
          <>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Published By</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RESULT_PUB_LOG_DATA.map((row, idx) => (
                <TableRow key={idx}>
                  {row.map((cell, cellIdx) => (
                    <TableCell key={cellIdx}>
                      {cellIdx === 5 ? (
                        <Badge className="bg-purple-100 text-purple-700">{cell}</Badge>
                      ) : cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </>
        )
      
      default:
        return (
          <>
            <TableHeader>
              <TableRow>
                <TableHead>Field 1</TableHead>
                <TableHead>Field 2</TableHead>
                <TableHead>Field 3</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                  Sample data for {REPORT_SECTIONS.find(s => s.id === activeSection)?.name}
                </TableCell>
              </TableRow>
            </TableBody>
          </>
        )
    }
  }

  const groupedSections = REPORT_SECTIONS.reduce((acc, section) => {
    if (!acc[section.category]) acc[section.category] = []
    acc[section.category].push(section)
    return acc
  }, {} as Record<string, typeof REPORT_SECTIONS>)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Compliance & UGC/BANBAIS</h1>
          <p className="text-gray-600 mt-1">
            Standardized reporting formats for regulatory compliance
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handlePrint} variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Report Sections</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2 p-2">
                {Object.entries(groupedSections).map(([category, sections]) => (
                  <div key={category}>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                      {category}
                    </div>
                    {sections.map(section => (
                      <Button
                        key={section.id}
                        variant="ghost"
                        className={`w-full justify-start text-sm ${
                          activeSection === section.id
                            ? 'bg-purple-50 text-purple-700 font-medium'
                            : 'text-gray-700'
                        }`}
                        onClick={() => setActiveSection(section.id as ReportSection)}
                      >
                        {section.name}
                      </Button>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3">
          <Card>
            <CardHeader className="border-b">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">
                    {REPORT_SECTIONS.find(s => s.id === activeSection)?.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Generated: {new Date().toLocaleString()}
                  </p>
                </div>
                <Badge className="bg-indigo-100 text-indigo-700">
                  {REPORT_SECTIONS.find(s => s.id === activeSection)?.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="border rounded-lg bg-white overflow-x-auto">
                <Table>
                  {renderTableContent()}
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
