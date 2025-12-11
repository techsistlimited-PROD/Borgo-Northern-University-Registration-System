export interface ReportMetadata {
  id: string
  reportName: string
  category: 'Student' | 'Academic' | 'Compliance' | 'Statistical' | 'Administrative'
  description: string
  availableFilters: string[]
  exportFormats: Array<'PDF' | 'Excel' | 'CSV'>
  lastGenerated: string
  frequency: 'On-demand' | 'Weekly' | 'Monthly' | 'Semester'
}

export const REPORT_CATALOG: ReportMetadata[] = [
  {
    id: 'rpt-001',
    reportName: 'Registered Student List',
    category: 'Student',
    description: 'Complete list of registered students for a semester',
    availableFilters: ['Semester', 'Program', 'Campus', 'Section'],
    exportFormats: ['PDF', 'Excel', 'CSV'],
    lastGenerated: '2025-11-18',
    frequency: 'On-demand'
  },
  {
    id: 'rpt-002',
    reportName: 'Admission List (Detailed)',
    category: 'Student',
    description: 'Detailed admission list with student addresses and contact info',
    availableFilters: ['Semester', 'Program', 'Admission Type'],
    exportFormats: ['PDF', 'Excel'],
    lastGenerated: '2025-11-15',
    frequency: 'Monthly'
  },
  {
    id: 'rpt-003',
    reportName: 'Completed Students (UGC Format)',
    category: 'Compliance',
    description: 'List of students who completed degree requirements in UGC format',
    availableFilters: ['Semester', 'Program', 'Year'],
    exportFormats: ['PDF', 'Excel'],
    lastGenerated: '2025-11-10',
    frequency: 'Semester'
  },
  {
    id: 'rpt-004',
    reportName: 'Grade Sheet (Course-wise)',
    category: 'Academic',
    description: 'Detailed grade sheet by course and section',
    availableFilters: ['Semester', 'Course', 'Section', 'Exam Type'],
    exportFormats: ['PDF', 'Excel', 'CSV'],
    lastGenerated: '2025-11-17',
    frequency: 'On-demand'
  },
  {
    id: 'rpt-005',
    reportName: 'Dropout List',
    category: 'Student',
    description: 'List of students who dropped out or withdrew',
    availableFilters: ['Semester', 'Program', 'Reason'],
    exportFormats: ['PDF', 'Excel'],
    lastGenerated: '2025-11-05',
    frequency: 'Semester'
  },
  {
    id: 'rpt-006',
    reportName: 'CGPA Range-wise Lists',
    category: 'Statistical',
    description: 'Students grouped by CGPA ranges',
    availableFilters: ['Semester', 'Program', 'CGPA Range'],
    exportFormats: ['PDF', 'Excel'],
    lastGenerated: '2025-11-12',
    frequency: 'Semester'
  },
  {
    id: 'rpt-007',
    reportName: 'CBE-wise Graduated Students',
    category: 'Academic',
    description: 'Students graduated per CBE meeting',
    availableFilters: ['CBE Number', 'Program', 'Year'],
    exportFormats: ['PDF', 'Excel'],
    lastGenerated: '2025-08-25',
    frequency: 'On-demand'
  },
  {
    id: 'rpt-008',
    reportName: 'Unpublished Sections',
    category: 'Administrative',
    description: 'Sections with unpublished results by semester and program',
    availableFilters: ['Semester', 'Program', 'Exam Type'],
    exportFormats: ['PDF', 'Excel', 'CSV'],
    lastGenerated: '2025-11-18',
    frequency: 'Weekly'
  },
  {
    id: 'rpt-009',
    reportName: 'Semester-wise GPA List',
    category: 'Academic',
    description: 'GPA distribution by semester',
    availableFilters: ['Semester', 'Program'],
    exportFormats: ['PDF', 'Excel'],
    lastGenerated: '2025-11-16',
    frequency: 'Semester'
  },
  {
    id: 'rpt-010',
    reportName: 'Students Below CGPA 2.00',
    category: 'Academic',
    description: 'Probation list - students with CGPA below 2.00',
    availableFilters: ['Semester', 'Program', 'Campus'],
    exportFormats: ['PDF', 'Excel'],
    lastGenerated: '2025-11-14',
    frequency: 'Semester'
  },
  {
    id: 'rpt-011',
    reportName: 'Credit Completion Status',
    category: 'Academic',
    description: 'Students who completed required credits',
    availableFilters: ['Semester', 'Program', 'Batch'],
    exportFormats: ['PDF', 'Excel'],
    lastGenerated: '2025-11-13',
    frequency: 'Semester'
  },
  {
    id: 'rpt-012',
    reportName: 'Scholarship Eligibility List',
    category: 'Administrative',
    description: 'Students eligible for merit-based scholarships',
    availableFilters: ['Semester', 'Program', 'CGPA Threshold'],
    exportFormats: ['PDF', 'Excel'],
    lastGenerated: '2025-11-10',
    frequency: 'Semester'
  },
  {
    id: 'rpt-013',
    reportName: 'Gold Medal Eligible Students',
    category: 'Academic',
    description: 'Top performers eligible for gold medals',
    availableFilters: ['Program', 'Year', 'CGPA Threshold'],
    exportFormats: ['PDF', 'Excel'],
    lastGenerated: '2025-11-08',
    frequency: 'Semester'
  },
  {
    id: 'rpt-014',
    reportName: 'Convocation Numbers',
    category: 'Statistical',
    description: 'Number of graduates by convocation',
    availableFilters: ['Convocation Year', 'Program'],
    exportFormats: ['PDF', 'Excel'],
    lastGenerated: '2025-01-20',
    frequency: 'On-demand'
  },
  {
    id: 'rpt-015',
    reportName: 'Top 3 / Top 10 Lists',
    category: 'Academic',
    description: 'Top performers by program and semester',
    availableFilters: ['Semester', 'Program', 'Rank Limit'],
    exportFormats: ['PDF', 'Excel'],
    lastGenerated: '2025-11-15',
    frequency: 'Semester'
  },
  {
    id: 'rpt-016',
    reportName: 'BANBAIS Format Report',
    category: 'Compliance',
    description: 'Student data in BANBAIS format for regulatory submission',
    availableFilters: ['Year', 'Program'],
    exportFormats: ['Excel'],
    lastGenerated: '2025-10-30',
    frequency: 'On-demand'
  },
  {
    id: 'rpt-017',
    reportName: 'UGC Multi-format Variants',
    category: 'Compliance',
    description: 'UGC submission reports in various required formats',
    availableFilters: ['Year', 'Report Type'],
    exportFormats: ['Excel', 'PDF'],
    lastGenerated: '2025-10-28',
    frequency: 'On-demand'
  },
  {
    id: 'rpt-018',
    reportName: 'Certificate Issuance Counts',
    category: 'Administrative',
    description: 'Daily/Weekly/Monthly counts of issued certificates and MOI',
    availableFilters: ['Date Range', 'Document Type', 'Period'],
    exportFormats: ['PDF', 'Excel', 'CSV'],
    lastGenerated: '2025-11-18',
    frequency: 'Monthly'
  },
  {
    id: 'rpt-019',
    reportName: 'Result Publication Timestamp Log',
    category: 'Compliance',
    description: 'Audit trail of result publication times',
    availableFilters: ['Semester', 'Program', 'Course', 'Date Range'],
    exportFormats: ['PDF', 'Excel', 'CSV'],
    lastGenerated: '2025-11-17',
    frequency: 'On-demand'
  },
  {
    id: 'rpt-020',
    reportName: 'Pass/Fail Summary by Program',
    category: 'Statistical',
    description: 'Pass and fail statistics by program',
    availableFilters: ['Semester', 'Program', 'Exam Type'],
    exportFormats: ['PDF', 'Excel'],
    lastGenerated: '2025-11-16',
    frequency: 'Semester'
  }
]

export const getReportsByCategory = (category: ReportMetadata['category']) =>
  REPORT_CATALOG.filter(r => r.category === category)

export const getReportById = (id: string) =>
  REPORT_CATALOG.find(r => r.id === id)

export const getReportByName = (name: string) =>
  REPORT_CATALOG.find(r => r.reportName === name)
