import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Download, Printer, FileSpreadsheet, Eye, Award, FileText, ScrollText } from 'lucide-react'
import {
  UGC_ANNUAL_RETURN,
  UGC_PROGRAM_ENROLLMENT,
  UGC_GRADUATION_STATS,
  UGC_FACULTY_INFO,
  UGC_INFRASTRUCTURE,
  UGC_GRADUATED_STUDENTS,
  BANBAIS_STUDENT_ENROLLMENT,
  BANBAIS_EXAM_RESULTS,
  BANBAIS_FACULTY_STAFF,
  BANBAIS_FINANCIAL,
  BANBAIS_FACILITY,
  BANBAIS_GRADUATED_STUDENTS,
  AUDIT_TRAIL,
  DATA_ACCESS_LOG,
  RESULT_PUBLICATION_LOG,
  CERTIFICATE_ISSUANCE_LOG,
  TABULATION_APPROVAL_LOG
} from '@/coe/data/compliance'

type TabType = 'ugc' | 'banbais' | 'logs'

type ReportId = 
  | 'ugc-annual' | 'ugc-enrollment' | 'ugc-graduation' | 'ugc-faculty' | 'ugc-infrastructure' | 'ugc-graduates'
  | 'banbais-student' | 'banbais-exam' | 'banbais-faculty' | 'banbais-financial' | 'banbais-facility' | 'banbais-graduates'
  | 'audit-trail' | 'data-access' | 'result-pub' | 'cert-issue' | 'tabulation'

interface ReportDefinition {
  id: ReportId
  name: string
  description: string
}

interface GraduatedStudent {
  sl: number
  ugcId?: string
  banbaisId?: string
  studentId: string
  studentName: string
  program: string
  programCode: string
  session: string
  passingYear: number
  cgpa: string
  classification: string
  totalCredits: number
  gender: string
  dateOfBirth: string
  graduationDate: string
}

const UGC_REPORTS: ReportDefinition[] = [
  { id: 'ugc-annual', name: 'Annual Return', description: 'Complete annual statistics for UGC submission' },
  { id: 'ugc-enrollment', name: 'Program-wise Enrollment', description: 'Enrollment breakdown by program and gender' },
  { id: 'ugc-graduation', name: 'Graduation Statistics', description: 'Graduate distribution by classification' },
  { id: 'ugc-faculty', name: 'Faculty Information', description: 'Faculty qualifications and experience' },
  { id: 'ugc-infrastructure', name: 'Infrastructure Report', description: 'Facility inventory and utilization' },
  { id: 'ugc-graduates', name: 'Graduated Students Registry', description: 'Complete registry of graduated students with UGC IDs' }
]

const BANBAIS_REPORTS: ReportDefinition[] = [
  { id: 'banbais-student', name: 'Student Enrollment Data', description: 'Detailed student enrollment for BANBAIS format' },
  { id: 'banbais-exam', name: 'Examination Results', description: 'Semester-wise examination outcomes' },
  { id: 'banbais-faculty', name: 'Faculty and Staff Data', description: 'Employee records and qualifications' },
  { id: 'banbais-financial', name: 'Financial Summary', description: 'Revenue, expenses, and surplus data' },
  { id: 'banbais-facility', name: 'Facility Utilization', description: 'Infrastructure usage and maintenance' },
  { id: 'banbais-graduates', name: 'Graduated Students Registry', description: 'Complete registry of graduated students with BANBAIS IDs' }
]

const LOG_REPORTS: ReportDefinition[] = [
  { id: 'audit-trail', name: 'Audit Trail', description: 'Complete system action log for compliance' },
  { id: 'data-access', name: 'Data Access Log', description: 'Record of who accessed what data and when' },
  { id: 'result-pub', name: 'Result Publication History', description: 'History of all result publications' },
  { id: 'cert-issue', name: 'Certificate Issuance Log', description: 'All issued certificates with serial numbers' },
  { id: 'tabulation', name: 'Tabulation Approval Log', description: 'Board approvals and corrections' }
]

export default function ComplianceUGCView() {
  const [activeTab, setActiveTab] = useState<TabType>('ugc')
  const [selectedReport, setSelectedReport] = useState<ReportId>('ugc-annual')
  const [showDocViewer, setShowDocViewer] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<GraduatedStudent | null>(null)
  const [activeDocTab, setActiveDocTab] = useState<'certificate' | 'transcript' | 'testimonial'>('certificate')

  const getCurrentReports = () => {
    switch (activeTab) {
      case 'ugc': return UGC_REPORTS
      case 'banbais': return BANBAIS_REPORTS
      case 'logs': return LOG_REPORTS
    }
  }

  const handleExportCSV = () => {
    const data = getReportData()
    const headers = getReportHeaders()
    
    const csvContent = [
      headers.join(','),
      ...data.map((row: any) => Object.values(row).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${selectedReport}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const handlePrint = () => {
    window.print()
  }

  const handleViewDocuments = (student: GraduatedStudent) => {
    setSelectedStudent(student)
    setShowDocViewer(true)
    setActiveDocTab('certificate')
  }

  const getReportData = (): any[] => {
    switch (selectedReport) {
      case 'ugc-annual': return UGC_ANNUAL_RETURN
      case 'ugc-enrollment': return UGC_PROGRAM_ENROLLMENT
      case 'ugc-graduation': return UGC_GRADUATION_STATS
      case 'ugc-faculty': return UGC_FACULTY_INFO
      case 'ugc-infrastructure': return UGC_INFRASTRUCTURE
      case 'ugc-graduates': return UGC_GRADUATED_STUDENTS
      case 'banbais-student': return BANBAIS_STUDENT_ENROLLMENT
      case 'banbais-exam': return BANBAIS_EXAM_RESULTS
      case 'banbais-faculty': return BANBAIS_FACULTY_STAFF
      case 'banbais-financial': return BANBAIS_FINANCIAL
      case 'banbais-facility': return BANBAIS_FACILITY
      case 'banbais-graduates': return BANBAIS_GRADUATED_STUDENTS
      case 'audit-trail': return AUDIT_TRAIL
      case 'data-access': return DATA_ACCESS_LOG
      case 'result-pub': return RESULT_PUBLICATION_LOG
      case 'cert-issue': return CERTIFICATE_ISSUANCE_LOG
      case 'tabulation': return TABULATION_APPROVAL_LOG
      default: return []
    }
  }

  const isGraduateReport = selectedReport === 'ugc-graduates' || selectedReport === 'banbais-graduates'

  const getReportHeaders = (): string[] => {
    const data = getReportData()
    if (data.length === 0) return []
    
    // For graduated students, we'll use custom headers
    if (isGraduateReport) {
      return ['SL', selectedReport === 'ugc-graduates' ? 'UGC ID' : 'BANBAIS ID', 'Student ID', 'Name', 'Program', 'Session', 'Passing Year', 'CGPA', 'Classification', 'Actions']
    }
    
    return Object.keys(data[0])
  }

  const renderTableHeaders = () => {
    const headers = getReportHeaders()
    return (
      <TableHeader>
        <TableRow>
          {headers.map(header => (
            <TableHead key={header} className="whitespace-nowrap capitalize">
              {header.replace(/([A-Z])/g, ' $1').trim()}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
    )
  }

  const renderTableBody = () => {
    const data = getReportData()
    
    // Special rendering for graduated students reports
    if (isGraduateReport) {
      return (
        <TableBody>
          {data.map((row: GraduatedStudent, idx) => (
            <TableRow key={idx}>
              <TableCell className="whitespace-nowrap">{row.sl}</TableCell>
              <TableCell className="whitespace-nowrap font-mono text-sm">
                {selectedReport === 'ugc-graduates' ? row.ugcId : row.banbaisId}
              </TableCell>
              <TableCell className="whitespace-nowrap">{row.studentId}</TableCell>
              <TableCell className="whitespace-nowrap">{row.studentName}</TableCell>
              <TableCell className="whitespace-nowrap">{row.program}</TableCell>
              <TableCell className="whitespace-nowrap">{row.session}</TableCell>
              <TableCell className="whitespace-nowrap">{row.passingYear}</TableCell>
              <TableCell className="whitespace-nowrap font-semibold text-deep-plum">{row.cgpa}</TableCell>
              <TableCell className="whitespace-nowrap">
                <Badge className={
                  row.classification.includes('Distinction') ? 'bg-purple-100 text-purple-800' :
                  row.classification.includes('First') ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }>
                  {row.classification}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewDocuments(row)}
                  className="gap-1"
                >
                  <Eye className="w-3 h-3" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      )
    }
    
    // Default rendering for other reports
    return (
      <TableBody>
        {data.map((row, idx) => (
          <TableRow key={idx}>
            {Object.values(row).map((cell, cellIdx) => (
              <TableCell key={cellIdx} className="whitespace-nowrap">
                {typeof cell === 'number' ? cell.toLocaleString() : cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    )
  }

  const selectedReportDef = getCurrentReports().find(r => r.id === selectedReport)

  return (
    <div className="p-6 space-y-6 print:p-0">
      <div className="flex justify-between items-start print:hidden">
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

      <div className="border-b border-gray-200 print:hidden">
        <div className="flex gap-1">
          <button
            onClick={() => {
              setActiveTab('ugc')
              setSelectedReport('ugc-annual')
            }}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'ugc'
                ? 'border-purple-600 text-purple-700 bg-purple-50'
                : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            UGC Reports
          </button>
          <button
            onClick={() => {
              setActiveTab('banbais')
              setSelectedReport('banbais-student')
            }}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'banbais'
                ? 'border-purple-600 text-purple-700 bg-purple-50'
                : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            BANBAIS Reports
          </button>
          <button
            onClick={() => {
              setActiveTab('logs')
              setSelectedReport('audit-trail')
            }}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'logs'
                ? 'border-purple-600 text-purple-700 bg-purple-50'
                : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Compliance Logs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1 print:hidden">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {activeTab === 'ugc' ? 'UGC Reports' : activeTab === 'banbais' ? 'BANBAIS Reports' : 'Compliance Logs'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 p-2">
                {getCurrentReports().map(report => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedReport === report.id
                        ? 'bg-purple-50 text-purple-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{report.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{report.description}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3 print:col-span-4">
          <Card>
            <CardHeader className="border-b print:border-purple-600 print:bg-purple-50">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl print:text-center">
                    {selectedReportDef?.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1 print:text-center">
                    {selectedReportDef?.description}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 print:justify-center">
                    <span><strong>Generated:</strong> {new Date().toLocaleString()}</span>
                    <span><strong>Records:</strong> {getReportData().length}</span>
                    <Badge className="bg-indigo-100 text-indigo-700">
                      {activeTab === 'ugc' ? 'UGC Standard' : activeTab === 'banbais' ? 'BANBAIS Format' : 'Compliance Log'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="border rounded-lg bg-white overflow-x-auto" style={{ maxHeight: '600px' }}>
                <Table>
                  {renderTableHeaders()}
                  {renderTableBody()}
                </Table>
              </div>
              <div className="mt-4 pt-4 border-t text-xs text-gray-500 print:text-center">
                Generated on {new Date().toLocaleDateString()} • Officer: COE Exam Officer • Northern University Bangladesh
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Document Viewer Dialog */}
      <Dialog open={showDocViewer} onOpenChange={setShowDocViewer}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Graduate Documents - {selectedStudent?.studentName}</DialogTitle>
            <DialogDescription>
              {selectedStudent?.studentId} • {selectedStudent?.program} • Graduated {selectedStudent?.passingYear}
            </DialogDescription>
          </DialogHeader>

          <div className="border-b border-gray-200 mb-4">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveDocTab('certificate')}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeDocTab === 'certificate'
                    ? 'border-purple-600 text-purple-700 bg-purple-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Award className="w-4 h-4 inline mr-2" />
                Certificate
              </button>
              <button
                onClick={() => setActiveDocTab('transcript')}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeDocTab === 'transcript'
                    ? 'border-purple-600 text-purple-700 bg-purple-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Transcript
              </button>
              <button
                onClick={() => setActiveDocTab('testimonial')}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeDocTab === 'testimonial'
                    ? 'border-purple-600 text-purple-700 bg-purple-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <ScrollText className="w-4 h-4 inline mr-2" />
                Testimonial
              </button>
            </div>
          </div>

          <div className="min-h-[500px]">
            {activeDocTab === 'certificate' && selectedStudent && (
              <div className="p-8 border-4 border-double border-purple-600 bg-gradient-to-br from-white to-purple-50">
                <div className="text-center space-y-6">
                  <div className="text-4xl font-serif text-purple-900 mb-8">
                    Northern University Bangladesh
                  </div>
                  
                  <div className="text-2xl font-serif text-gray-700">
                    Bachelor's Degree Certificate
                  </div>
                  
                  <div className="my-8 text-gray-600 leading-relaxed">
                    This is to certify that
                  </div>
                  
                  <div className="text-3xl font-bold text-deep-plum border-b-2 border-purple-400 inline-block pb-2">
                    {selectedStudent.studentName}
                  </div>
                  
                  <div className="text-gray-600 leading-relaxed max-w-2xl mx-auto mt-8">
                    has successfully completed the requirements for the degree of
                  </div>
                  
                  <div className="text-xl font-semibold text-purple-800 my-4">
                    {selectedStudent.program}
                  </div>
                  
                  <div className="text-gray-600">
                    with a Cumulative Grade Point Average (CGPA) of
                  </div>
                  
                  <div className="text-2xl font-bold text-deep-plum">
                    {selectedStudent.cgpa} / 4.00
                  </div>
                  
                  <div className="text-gray-600 mt-2">
                    achieving <span className="font-semibold text-purple-700">{selectedStudent.classification}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t">
                    <div className="text-sm text-gray-600">
                      <div className="mb-2">Student ID: <span className="font-semibold">{selectedStudent.studentId}</span></div>
                      <div className="mb-2">Session: <span className="font-semibold">{selectedStudent.session}</span></div>
                      <div className="mb-2">Date of Birth: <span className="font-semibold">{selectedStudent.dateOfBirth}</span></div>
                      <div>UGC ID: <span className="font-mono font-semibold">{selectedStudent.ugcId || selectedStudent.banbaisId}</span></div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="mb-2">Total Credits: <span className="font-semibold">{selectedStudent.totalCredits}</span></div>
                      <div className="mb-2">Graduation Date: <span className="font-semibold">{selectedStudent.graduationDate}</span></div>
                      <div className="mb-2">Certificate No: <span className="font-mono">CERT-{selectedStudent.passingYear}-{String(selectedStudent.sl).padStart(4, '0')}</span></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-16 mt-16 pt-8">
                    <div className="text-center">
                      <div className="border-t border-gray-400 pt-2 mt-12">
                        <div className="font-semibold">Controller of Examinations</div>
                        <div className="text-sm text-gray-600">Northern University Bangladesh</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="border-t border-gray-400 pt-2 mt-12">
                        <div className="font-semibold">Vice Chancellor</div>
                        <div className="text-sm text-gray-600">Northern University Bangladesh</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeDocTab === 'transcript' && selectedStudent && (
              <div className="p-6 bg-white border border-gray-300">
                <div className="text-center border-b-2 border-purple-600 pb-4 mb-6">
                  <div className="text-2xl font-bold text-purple-900">Northern University Bangladesh</div>
                  <div className="text-lg font-semibold text-gray-700 mt-2">Official Academic Transcript</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <div className="mb-2"><span className="font-semibold">Name:</span> {selectedStudent.studentName}</div>
                    <div className="mb-2"><span className="font-semibold">Student ID:</span> {selectedStudent.studentId}</div>
                    <div className="mb-2"><span className="font-semibold">UGC ID:</span> <span className="font-mono">{selectedStudent.ugcId || selectedStudent.banbaisId}</span></div>
                  </div>
                  <div>
                    <div className="mb-2"><span className="font-semibold">Program:</span> {selectedStudent.program}</div>
                    <div className="mb-2"><span className="font-semibold">Session:</span> {selectedStudent.session}</div>
                    <div className="mb-2"><span className="font-semibold">Graduation Date:</span> {selectedStudent.graduationDate}</div>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden mb-6">
                  <table className="w-full text-sm">
                    <thead className="bg-purple-100">
                      <tr>
                        <th className="p-2 text-left">Course Code</th>
                        <th className="p-2 text-left">Course Title</th>
                        <th className="p-2 text-center">Credits</th>
                        <th className="p-2 text-center">Grade</th>
                        <th className="p-2 text-center">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr className="bg-gray-50">
                        <td colSpan={5} className="p-2 font-semibold text-purple-800">Semester 1 - Fall {selectedStudent.session.split('-')[0]}</td>
                      </tr>
                      <tr>
                        <td className="p-2">CSE1101</td>
                        <td className="p-2">Programming Fundamentals</td>
                        <td className="p-2 text-center">3.0</td>
                        <td className="p-2 text-center font-semibold">A+</td>
                        <td className="p-2 text-center">4.00</td>
                      </tr>
                      <tr>
                        <td className="p-2">MATH201</td>
                        <td className="p-2">Calculus & Analytical Geometry</td>
                        <td className="p-2 text-center">3.0</td>
                        <td className="p-2 text-center font-semibold">A</td>
                        <td className="p-2 text-center">3.75</td>
                      </tr>
                      <tr>
                        <td className="p-2">ENG101</td>
                        <td className="p-2">English Composition</td>
                        <td className="p-2 text-center">3.0</td>
                        <td className="p-2 text-center font-semibold">A+</td>
                        <td className="p-2 text-center">4.00</td>
                      </tr>
                      <tr className="bg-purple-50 font-semibold">
                        <td className="p-2" colSpan={2}>Semester GPA</td>
                        <td className="p-2 text-center">9.0</td>
                        <td className="p-2 text-center" colSpan={2}>3.92</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td colSpan={5} className="p-2 font-semibold text-purple-800">... (Additional semesters)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="border-t-2 border-purple-600 pt-4 mt-6">
                  <div className="grid grid-cols-2 gap-8 text-sm">
                    <div>
                      <div className="mb-2"><span className="font-semibold">Total Credits Required:</span> {selectedStudent.totalCredits}</div>
                      <div className="mb-2"><span className="font-semibold">Total Credits Earned:</span> {selectedStudent.totalCredits}</div>
                    </div>
                    <div>
                      <div className="mb-2"><span className="font-semibold">Final CGPA:</span> <span className="text-lg font-bold text-purple-800">{selectedStudent.cgpa} / 4.00</span></div>
                      <div className="mb-2"><span className="font-semibold">Classification:</span> {selectedStudent.classification}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-4 border-t text-xs text-gray-500 text-center">
                  This is an official transcript issued by Northern University Bangladesh<br />
                  Transcript No: TR-{selectedStudent.passingYear}-{String(selectedStudent.sl).padStart(4, '0')} | Issued: {new Date().toLocaleDateString()}
                </div>
              </div>
            )}

            {activeDocTab === 'testimonial' && selectedStudent && (
              <div className="p-8 bg-white border border-gray-300">
                <div className="text-center border-b-2 border-purple-600 pb-4 mb-8">
                  <div className="text-3xl font-serif text-purple-900">Northern University Bangladesh</div>
                  <div className="text-sm text-gray-600 mt-2">Permanent Campus, Banani, Dhaka-1213, Bangladesh</div>
                </div>
                
                <div className="text-center mb-8">
                  <div className="text-2xl font-bold text-gray-800">TESTIMONIAL</div>
                  <div className="text-sm text-gray-600 mt-1">Ref: NU/COE/TEST/{selectedStudent.passingYear}/{String(selectedStudent.sl).padStart(4, '0')}</div>
                </div>
                
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p className="text-justify">
                    This is to certify that <span className="font-semibold text-black">{selectedStudent.studentName}</span>, 
                    bearing Student ID <span className="font-mono font-semibold">{selectedStudent.studentId}</span> and 
                    UGC ID <span className="font-mono font-semibold">{selectedStudent.ugcId || selectedStudent.banbaisId}</span>, 
                    was a bonafide student of Northern University Bangladesh.
                  </p>
                  
                  <p className="text-justify">
                    {selectedStudent.gender === 'Male' ? 'He' : 'She'} has successfully completed the degree program 
                    of <span className="font-semibold">{selectedStudent.program}</span> during the academic 
                    session <span className="font-semibold">{selectedStudent.session}</span> and graduated 
                    on <span className="font-semibold">{selectedStudent.graduationDate}</span>.
                  </p>
                  
                  <p className="text-justify">
                    During {selectedStudent.gender === 'Male' ? 'his' : 'her'} time at this institution, 
                    {selectedStudent.gender === 'Male' ? 'he' : 'she'} demonstrated excellent academic performance, 
                    achieving a Cumulative Grade Point Average (CGPA) of <span className="font-semibold">{selectedStudent.cgpa}</span> out 
                    of 4.00, which places {selectedStudent.gender === 'Male' ? 'him' : 'her'} in 
                    the <span className="font-semibold">{selectedStudent.classification}</span> category.
                  </p>
                  
                  <p className="text-justify">
                    {selectedStudent.gender === 'Male' ? 'He' : 'She'} completed a total 
                    of <span className="font-semibold">{selectedStudent.totalCredits} credit hours</span> as required by the degree program. 
                    Throughout {selectedStudent.gender === 'Male' ? 'his' : 'her'} academic journey, 
                    {selectedStudent.gender === 'Male' ? 'he' : 'she'} maintained good conduct and discipline.
                  </p>
                  
                  <p className="text-justify">
                    I wish {selectedStudent.gender === 'Male' ? 'him' : 'her'} every success in {selectedStudent.gender === 'Male' ? 'his' : 'her'} future endeavors.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-8 mt-16">
                  <div className="text-sm text-gray-600">
                    <div className="mb-1"><span className="font-semibold">Date of Issue:</span> {new Date().toLocaleDateString('en-GB')}</div>
                    <div className="mb-1"><span className="font-semibold">Place:</span> Dhaka, Bangladesh</div>
                  </div>
                </div>
                
                <div className="mt-12 pt-8 text-right">
                  <div className="border-t border-gray-400 pt-2 inline-block min-w-[250px]">
                    <div className="font-semibold">Controller of Examinations</div>
                    <div className="text-sm text-gray-600">Northern University Bangladesh</div>
                  </div>
                </div>
                
                <div className="mt-8 pt-4 border-t text-xs text-gray-500 text-center">
                  This is an official testimonial issued by Northern University Bangladesh<br />
                  Testimonial No: TEST-{selectedStudent.passingYear}-{String(selectedStudent.sl).padStart(4, '0')}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4 print:hidden">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" />
              Print Document
            </Button>
            <Button onClick={() => setShowDocViewer(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
