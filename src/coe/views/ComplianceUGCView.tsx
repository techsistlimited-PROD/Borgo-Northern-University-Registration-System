import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Download, Printer, FileSpreadsheet } from 'lucide-react'
import {
  UGC_ANNUAL_RETURN,
  UGC_PROGRAM_ENROLLMENT,
  UGC_GRADUATION_STATS,
  UGC_FACULTY_INFO,
  UGC_INFRASTRUCTURE,
  BANBAIS_STUDENT_ENROLLMENT,
  BANBAIS_EXAM_RESULTS,
  BANBAIS_FACULTY_STAFF,
  BANBAIS_FINANCIAL,
  BANBAIS_FACILITY,
  AUDIT_TRAIL,
  DATA_ACCESS_LOG,
  RESULT_PUBLICATION_LOG,
  CERTIFICATE_ISSUANCE_LOG,
  TABULATION_APPROVAL_LOG
} from '@/coe/data/compliance'

type TabType = 'ugc' | 'banbais' | 'logs'

type ReportId = 
  | 'ugc-annual' | 'ugc-enrollment' | 'ugc-graduation' | 'ugc-faculty' | 'ugc-infrastructure'
  | 'banbais-student' | 'banbais-exam' | 'banbais-faculty' | 'banbais-financial' | 'banbais-facility'
  | 'audit-trail' | 'data-access' | 'result-pub' | 'cert-issue' | 'tabulation'

interface ReportDefinition {
  id: ReportId
  name: string
  description: string
}

const UGC_REPORTS: ReportDefinition[] = [
  { id: 'ugc-annual', name: 'Annual Return', description: 'Complete annual statistics for UGC submission' },
  { id: 'ugc-enrollment', name: 'Program-wise Enrollment', description: 'Enrollment breakdown by program and gender' },
  { id: 'ugc-graduation', name: 'Graduation Statistics', description: 'Graduate distribution by classification' },
  { id: 'ugc-faculty', name: 'Faculty Information', description: 'Faculty qualifications and experience' },
  { id: 'ugc-infrastructure', name: 'Infrastructure Report', description: 'Facility inventory and utilization' }
]

const BANBAIS_REPORTS: ReportDefinition[] = [
  { id: 'banbais-student', name: 'Student Enrollment Data', description: 'Detailed student enrollment for BANBAIS format' },
  { id: 'banbais-exam', name: 'Examination Results', description: 'Semester-wise examination outcomes' },
  { id: 'banbais-faculty', name: 'Faculty and Staff Data', description: 'Employee records and qualifications' },
  { id: 'banbais-financial', name: 'Financial Summary', description: 'Revenue, expenses, and surplus data' },
  { id: 'banbais-facility', name: 'Facility Utilization', description: 'Infrastructure usage and maintenance' }
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
      ...data.map(row => Object.values(row).join(','))
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

  const getReportData = (): any[] => {
    switch (selectedReport) {
      case 'ugc-annual': return UGC_ANNUAL_RETURN
      case 'ugc-enrollment': return UGC_PROGRAM_ENROLLMENT
      case 'ugc-graduation': return UGC_GRADUATION_STATS
      case 'ugc-faculty': return UGC_FACULTY_INFO
      case 'ugc-infrastructure': return UGC_INFRASTRUCTURE
      case 'banbais-student': return BANBAIS_STUDENT_ENROLLMENT
      case 'banbais-exam': return BANBAIS_EXAM_RESULTS
      case 'banbais-faculty': return BANBAIS_FACULTY_STAFF
      case 'banbais-financial': return BANBAIS_FINANCIAL
      case 'banbais-facility': return BANBAIS_FACILITY
      case 'audit-trail': return AUDIT_TRAIL
      case 'data-access': return DATA_ACCESS_LOG
      case 'result-pub': return RESULT_PUBLICATION_LOG
      case 'cert-issue': return CERTIFICATE_ISSUANCE_LOG
      case 'tabulation': return TABULATION_APPROVAL_LOG
      default: return []
    }
  }

  const getReportHeaders = (): string[] => {
    const data = getReportData()
    if (data.length === 0) return []
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
    </div>
  )
}
