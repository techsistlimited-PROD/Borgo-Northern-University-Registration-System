export type ReportFilterType = 'semester' | 'program' | 'campus' | 'dateRange' | 'status' | 'cgpaRange' | 'section' | 'period'

export interface ReportFilter {
  type: ReportFilterType
  label: string
  required?: boolean
  options?: string[]
}

export interface ReportDefinition {
  id: string
  code: string
  title: string
  description: string
  group: 'Enrollment' | 'Progress' | 'Grades' | 'Honors' | 'Publication' | 'Documents'
  filters: ReportFilter[]
  columns: string[]
  sampleRowsProvider: () => any[]
  summaryCards?: Array<{
    label: string
    value: string | number
    color?: string
  }>
}

export const REPORTS_CATALOG: ReportDefinition[] = [
  {
    id: 'reg-stu-list',
    code: 'REG_STU_LIST',
    title: 'Registered Student List',
    description: 'List of all registered students for selected semester',
    group: 'Enrollment',
    filters: [
      { type: 'semester', label: 'Semester', required: true },
      { type: 'program', label: 'Program' },
      { type: 'campus', label: 'Campus' }
    ],
    columns: ['Student ID', 'Name', 'Program', 'Semester', 'Credits', 'Status', 'Campus'],
    sampleRowsProvider: () => [
      ['STU-2023-0001', 'Ahmed Ali', 'CSE', 'Fall 2025', 15, 'Active', 'Permanent'],
      ['STU-2023-0002', 'Fatima Khan', 'BBA', 'Fall 2025', 12, 'Active', 'Banani'],
      ['STU-2023-0003', 'Hassan Mahmud', 'EEE', 'Fall 2025', 18, 'Active', 'Permanent']
    ]
  },
  {
    id: 'adm-list',
    code: 'ADM_LIST',
    title: 'Admission List — Summary & Detail',
    description: 'Comprehensive admission records with status tracking',
    group: 'Enrollment',
    filters: [
      { type: 'semester', label: 'Admission Term', required: true },
      { type: 'program', label: 'Program' },
      { type: 'status', label: 'Status', options: ['Pending', 'Approved', 'Rejected'] }
    ],
    columns: ['Student ID', 'Name', 'Program', 'Admission Date', 'Status', 'Remarks'],
    sampleRowsProvider: () => [
      ['STU-2025-0100', 'Nusrat Jahan', 'CSE', '2025-08-15', 'Approved', 'Regular admission'],
      ['STU-2025-0101', 'Kamal Hossain', 'BBA', '2025-08-16', 'Pending', 'Document verification']
    ]
  },
  {
    id: 'dropout-list',
    code: 'DROPOUT_LIST',
    title: 'Dropout List',
    description: 'Students who dropped out or discontinued',
    group: 'Enrollment',
    filters: [
      { type: 'semester', label: 'Semester' },
      { type: 'program', label: 'Program' },
      { type: 'dateRange', label: 'Dropout Date Range' }
    ],
    columns: ['Student ID', 'Name', 'Program', 'Last Semester', 'Dropout Date', 'Reason'],
    sampleRowsProvider: () => [
      ['STU-2022-0050', 'Rahim Ahmed', 'EEE', 'Spring 2024', '2024-06-15', 'Financial'],
      ['STU-2023-0075', 'Sadia Rahman', 'LLB', 'Fall 2024', '2024-12-20', 'Personal']
    ]
  },
  {
    id: 'completed-ugc',
    code: 'COMPLETED_UGC',
    title: 'Completed Students — UGC Format',
    description: 'Students who completed degrees in UGC reporting format',
    group: 'Progress',
    filters: [
      { type: 'semester', label: 'Completion Term', required: true },
      { type: 'program', label: 'Program' }
    ],
    columns: ['Student ID', 'Name', 'Program', 'Credits', 'CGPA', 'Completion Date', 'Degree Class'],
    sampleRowsProvider: () => [
      ['STU-2021-0012', 'Mahfuz Rahman', 'CSE', 120, 3.45, '2025-12-15', 'First Class'],
      ['STU-2021-0045', 'Rahim Uddin', 'EEE', 125, 3.67, '2025-12-15', 'First Class']
    ]
  },
  {
    id: 'req-cred-done',
    code: 'REQ_CRED_DONE',
    title: 'Students Who Completed Required Credits',
    description: 'Students meeting minimum credit requirements',
    group: 'Progress',
    filters: [
      { type: 'semester', label: 'Semester' },
      { type: 'program', label: 'Program' }
    ],
    columns: ['Student ID', 'Name', 'Program', 'Completed Credits', 'Required Credits', 'Status'],
    sampleRowsProvider: () => [
      ['STU-2021-0089', 'Farhan Ahmed', 'CSE', 120, 120, 'Eligible'],
      ['STU-2021-0101', 'Tahmid Hassan', 'MBA', 48, 48, 'Eligible']
    ]
  },
  {
    id: 'cbe-grads',
    code: 'CBE_GRADS',
    title: 'CBE-wise Graduated Students',
    description: 'Students cleared by specific CBE meetings',
    group: 'Progress',
    filters: [
      { type: 'semester', label: 'CBE Meeting', required: true }
    ],
    columns: ['Student ID', 'Name', 'Program', 'CBE Meeting', 'Decision', 'CGPA', 'Credits'],
    sampleRowsProvider: () => [
      ['STU-2021-0012', 'Mahfuz Rahman', 'CSE', 'CBE/2025/01', 'Eligible', 3.45, 120],
      ['STU-2021-0045', 'Rahim Uddin', 'EEE', 'CBE/2025/01', 'Eligible', 3.67, 125]
    ]
  },
  {
    id: 'grade-sheet-sec',
    code: 'GRADE_SHEET_SEC',
    title: 'Grade Sheet Reports — Section-wise',
    description: 'Detailed grade sheets organized by section',
    group: 'Grades',
    filters: [
      { type: 'semester', label: 'Semester', required: true },
      { type: 'program', label: 'Program' },
      { type: 'section', label: 'Section' }
    ],
    columns: ['Student ID', 'Name', 'Section', 'Course', 'Credits', 'Grade', 'Grade Point'],
    sampleRowsProvider: () => [
      ['STU-2023-0010', 'Ali Hassan', 'CSE-A', 'CSE101', 3, 'A', 4.0],
      ['STU-2023-0011', 'Nadia Ahmed', 'CSE-A', 'CSE101', 3, 'A-', 3.7]
    ]
  },
  {
    id: 'sem-gpa-list',
    code: 'SEM_GPA_LIST',
    title: 'Semester GPA List',
    description: 'GPA listing for all students by semester',
    group: 'Grades',
    filters: [
      { type: 'semester', label: 'Semester', required: true },
      { type: 'program', label: 'Program' }
    ],
    columns: ['Student ID', 'Name', 'Program', 'Semester', 'Credits', 'GPA', 'CGPA'],
    sampleRowsProvider: () => [
      ['STU-2023-0015', 'Karim Uddin', 'CSE', 'Fall 2025', 15, 3.67, 3.52],
      ['STU-2023-0020', 'Ayesha Khan', 'BBA', 'Fall 2025', 12, 3.83, 3.71]
    ]
  },
  {
    id: 'cgpa-range',
    code: 'CGPA_RANGE',
    title: 'CGPA Range Wise Students',
    description: 'Students grouped by CGPA ranges',
    group: 'Grades',
    filters: [
      { type: 'semester', label: 'Semester' },
      { type: 'program', label: 'Program' },
      { type: 'cgpaRange', label: 'CGPA Range', required: true }
    ],
    columns: ['Student ID', 'Name', 'Program', 'CGPA', 'Credits', 'Classification'],
    sampleRowsProvider: () => [
      ['STU-2023-0025', 'Hasan Mahmud', 'CSE', 3.85, 90, 'Excellent'],
      ['STU-2023-0030', 'Razia Sultana', 'BBA', 3.62, 85, 'Very Good']
    ]
  },
  {
    id: 'cgpa-below-2',
    code: 'CGPA_BELOW_2',
    title: 'CGPA Below 2.00',
    description: 'Students with CGPA below minimum threshold',
    group: 'Grades',
    filters: [
      { type: 'semester', label: 'Semester' },
      { type: 'program', label: 'Program' }
    ],
    columns: ['Student ID', 'Name', 'Program', 'CGPA', 'Credits', 'Status', 'Warning Level'],
    sampleRowsProvider: () => [
      ['STU-2024-0088', 'Jamal Hossain', 'EEE', 1.95, 45, 'Probation', 'Warning 1'],
      ['STU-2024-0092', 'Salma Begum', 'LLB', 1.87, 40, 'Probation', 'Warning 2']
    ]
  },
  {
    id: 'perf-report',
    code: 'PERF_REPORT',
    title: 'Students Performance Report',
    description: 'Comprehensive academic performance overview',
    group: 'Grades',
    filters: [
      { type: 'semester', label: 'Semester', required: true },
      { type: 'program', label: 'Program' }
    ],
    columns: ['Student ID', 'Name', 'Program', 'GPA', 'CGPA', 'Credits', 'Rank', 'Status'],
    sampleRowsProvider: () => [
      ['STU-2023-0040', 'Tanzim Ahmed', 'CSE', 3.92, 3.85, 90, 1, 'Excellent'],
      ['STU-2023-0042', 'Fariha Islam', 'CSE', 3.88, 3.79, 88, 2, 'Excellent']
    ]
  },
  {
    id: 'scholarship-list',
    code: 'SCHOLARSHIP_LIST',
    title: 'Scholarship List',
    description: 'Students awarded scholarships and waivers',
    group: 'Honors',
    filters: [
      { type: 'semester', label: 'Semester', required: true },
      { type: 'program', label: 'Program' }
    ],
    columns: ['Student ID', 'Name', 'Program', 'CGPA', 'Tier', 'Waiver %', 'Status'],
    sampleRowsProvider: () => [
      ['STU-2023-0012', 'Mahfuz Rahman', 'CSE', 3.85, 'Tier 1', 100, 'Assigned'],
      ['STU-2024-0101', 'Tahmid Hassan', 'Physics', 3.92, 'Tier 1', 100, 'Assigned']
    ]
  },
  {
    id: 'gold-eligible',
    code: 'GOLD_ELIGIBLE',
    title: 'Gold Medal Eligible',
    description: 'Students eligible for gold medal awards',
    group: 'Honors',
    filters: [
      { type: 'semester', label: 'Graduation Term', required: true },
      { type: 'program', label: 'Program' }
    ],
    columns: ['Student ID', 'Name', 'Program', 'CGPA', 'Credits', 'Rank', 'Medal Type'],
    sampleRowsProvider: () => [
      ['STU-2021-0088', 'Nusrat Ahmed', 'CSE', 3.98, 120, 1, 'Gold'],
      ['STU-2021-0090', 'Kamal Hassan', 'BBA', 3.96, 120, 1, 'Gold']
    ]
  },
  {
    id: 'top-rankers',
    code: 'TOP_RANKERS',
    title: 'Top 3 & Top 10 per Program/Term',
    description: 'Highest performing students by program and semester',
    group: 'Honors',
    filters: [
      { type: 'semester', label: 'Semester', required: true },
      { type: 'program', label: 'Program', required: true }
    ],
    columns: ['Rank', 'Student ID', 'Name', 'Program', 'CGPA', 'Credits', 'Category'],
    sampleRowsProvider: () => [
      [1, 'STU-2023-0001', 'Arif Rahman', 'CSE', 3.98, 90, 'Top 3'],
      [2, 'STU-2023-0005', 'Nadia Islam', 'CSE', 3.95, 88, 'Top 3'],
      [3, 'STU-2023-0010', 'Hassan Ali', 'CSE', 3.91, 87, 'Top 3']
    ]
  },
  {
    id: 'unpub-sections',
    code: 'UNPUB_SECTIONS',
    title: 'Unpublished Sections — Program/Semester',
    description: 'Sections with pending result publication',
    group: 'Publication',
    filters: [
      { type: 'semester', label: 'Semester', required: true },
      { type: 'program', label: 'Program' }
    ],
    columns: ['Program', 'Course Code', 'Section', 'Instructor', 'Students', 'Status', 'Pending Since'],
    sampleRowsProvider: () => [
      ['CSE', 'CSE301', 'A', 'Dr. Rahman', 45, 'Draft', '2025-11-15'],
      ['BBA', 'BBA201', 'B', 'Prof. Hasan', 38, 'Under Review', '2025-11-20']
    ]
  },
  {
    id: 'result-pub-log',
    code: 'RESULT_PUB_LOG',
    title: 'Result Publication Timestamp Log',
    description: 'Audit trail of result publication activities',
    group: 'Publication',
    filters: [
      { type: 'semester', label: 'Semester', required: true },
      { type: 'dateRange', label: 'Publication Date Range' }
    ],
    columns: ['Program', 'Course', 'Section', 'Published By', 'Published Date', 'Students Count', 'Status'],
    sampleRowsProvider: () => [
      ['CSE', 'CSE101', 'A', 'Dr. Ahmed', '2025-11-25 14:30', 42, 'Published'],
      ['BBA', 'BBA101', 'B', 'Prof. Karim', '2025-11-26 10:15', 35, 'Published']
    ]
  },
  {
    id: 'banbais-ugc-fmt',
    code: 'BANBAIS_UGC_FMT',
    title: 'BANBAIS/UGC Multi-format',
    description: 'Data export in BANBAIS and UGC compliance formats',
    group: 'Publication',
    filters: [
      { type: 'semester', label: 'Semester', required: true },
      { type: 'program', label: 'Program' }
    ],
    columns: ['Student ID', 'Name', 'Program', 'Session', 'Result', 'Credits', 'CGPA', 'Class'],
    sampleRowsProvider: () => [
      ['STU-2021-0012', 'Mahfuz Rahman', 'CSE', '2021-2025', 'Passed', 120, 3.45, 'First'],
      ['STU-2021-0045', 'Rahim Uddin', 'EEE', '2021-2025', 'Passed', 125, 3.67, 'First']
    ]
  },
  {
    id: 'doc-issue-counts',
    code: 'DOC_ISSUE_COUNTS',
    title: 'Document Issue Counts',
    description: 'Summary of issued certificates and documents',
    group: 'Documents',
    filters: [
      { type: 'dateRange', label: 'Issue Date Range', required: true },
      { type: 'status', label: 'Document Type' }
    ],
    columns: ['Document Type', 'Issued Count', 'Pending Count', 'Rejected Count', 'Total'],
    sampleRowsProvider: () => [
      ['Transcript', 45, 12, 3, 60],
      ['Degree Certificate', 32, 8, 1, 41],
      ['Provisional Certificate', 28, 5, 2, 35]
    ]
  },
  {
    id: 'doc-summary',
    code: 'DOC_SUMMARY',
    title: 'Daily/Weekly/Monthly Document Summary',
    description: 'Periodic summary of document processing activities',
    group: 'Documents',
    filters: [
      { type: 'period', label: 'Period', required: true },
      { type: 'dateRange', label: 'Date Range' }
    ],
    columns: ['Date/Period', 'Document Type', 'Requested', 'Processed', 'Pending', 'Approval Rate'],
    sampleRowsProvider: () => [
      ['2025-11-25', 'Transcript', 15, 12, 3, '80%'],
      ['2025-11-26', 'Certificate', 10, 8, 2, '80%'],
      ['2025-11-27', 'Verification', 8, 8, 0, '100%']
    ]
  },
  {
    id: 'convocation-counts',
    code: 'CONVOCATION_COUNTS',
    title: 'Convocation-wise Numbers',
    description: 'Statistical summary of convocation events',
    group: 'Documents',
    filters: [
      { type: 'semester', label: 'Convocation Event', required: true }
    ],
    columns: ['Convocation', 'Program', 'Eligible', 'Registered', 'Fee Paid', 'Approved', 'Attendance Rate'],
    sampleRowsProvider: () => [
      ['25th', 'CSE', 45, 42, 40, 38, '84%'],
      ['25th', 'BBA', 38, 35, 33, 32, '84%'],
      ['25th', 'EEE', 32, 30, 28, 27, '84%']
    ]
  }
]

export const getReportByCode = (code: string) =>
  REPORTS_CATALOG.find(r => r.code === code)

export const getReportsByGroup = (group: string) =>
  REPORTS_CATALOG.filter(r => r.group === group)

export const REPORT_GROUPS = ['Enrollment', 'Progress', 'Grades', 'Honors', 'Publication', 'Documents'] as const
