export interface ReportDefinition {
  id: string
  code: string
  title: string
  description: string
  category: string
  filters: string[]
  columns: string[]
  getData: () => any[]
  summaryCards?: Array<{
    label: string
    getValue: (data: any[]) => string | number
    color?: string
  }>
}

// Generate 30-40 student records for realistic previews
const generateStudentData = (count: number) => {
  const programs = ['CSE', 'BBA', 'EEE', 'LLB', 'MBA', 'English', 'Physics', 'Mathematics']
  const campuses = ['Permanent', 'Banani', 'Mirpur']
  const statuses = ['Active', 'Inactive', 'Graduated', 'Dropout']
  const names = ['Ahmed', 'Rahman', 'Hassan', 'Khan', 'Ali', 'Hossain', 'Islam', 'Mahmud', 'Karim', 'Rahim']
  
  return Array.from({ length: count }, (_, i) => ({
    studentId: `STU-202${3 + Math.floor(i / 10)}-${String(i + 1).padStart(4, '0')}`,
    name: `${names[i % names.length]} ${names[(i + 1) % names.length]}`,
    program: programs[i % programs.length],
    campus: campuses[i % campuses.length],
    semester: `Fall 202${3 + Math.floor(i / 20)}`,
    credits: 12 + (i % 9) * 3,
    cgpa: 2.5 + Math.random() * 1.5,
    status: statuses[i % statuses.length],
    admitYear: `202${1 + Math.floor(i / 15)}`
  }))
}

export const REPORTS_CATALOG: ReportDefinition[] = [
  // CATEGORY: Enrollment & Admission (3 reports)
  {
    id: 'reg-student-list',
    code: 'REG_STU_LIST',
    title: 'Registered Student List',
    description: 'Complete list of all registered students for selected semester',
    category: 'Enrollment & Admission',
    filters: ['semester', 'program', 'campus'],
    columns: ['Student ID', 'Name', 'Program', 'Semester', 'Credits', 'CGPA', 'Status', 'Campus'],
    getData: () => {
      const students = generateStudentData(35)
      return students.map(s => [
        s.studentId, s.name, s.program, s.semester, s.credits, s.cgpa.toFixed(2), s.status, s.campus
      ])
    },
    summaryCards: [
      { label: 'Total Students', getValue: (data) => data.length, color: 'purple' },
      { label: 'Average CGPA', getValue: (data) => (data.reduce((sum, row) => sum + parseFloat(row[5]), 0) / data.length).toFixed(2), color: 'indigo' }
    ]
  },
  {
    id: 'admission-list',
    code: 'ADM_LIST',
    title: 'Admission List — Summary & Detail',
    description: 'Comprehensive admission records with approval status',
    category: 'Enrollment & Admission',
    filters: ['semester', 'program', 'status'],
    columns: ['Student ID', 'Name', 'Program', 'Admission Date', 'Status', 'Approved By', 'Remarks'],
    getData: () => {
      const students = generateStudentData(30)
      return students.map((s, i) => [
        s.studentId, s.name, s.program, `2025-08-${15 + (i % 10)}`, 
        ['Pending', 'Approved', 'Rejected'][i % 3], 
        i % 3 === 1 ? 'Dean Office' : i % 3 === 2 ? 'Rejected' : 'Pending',
        i % 3 === 2 ? 'Incomplete documents' : 'Regular admission'
      ])
    }
  },
  {
    id: 'dropout-list',
    code: 'DROPOUT_LIST',
    title: 'Dropout/Inactive List',
    description: 'Students who dropped out or became inactive',
    category: 'Enrollment & Admission',
    filters: ['semester', 'program', 'dateRange'],
    columns: ['Student ID', 'Name', 'Program', 'Last Semester', 'Dropout Date', 'Reason', 'Contact'],
    getData: () => {
      const students = generateStudentData(25).filter((_, i) => i % 4 === 0)
      return students.map((s, i) => [
        s.studentId, s.name, s.program, 'Spring 2024', `2024-${6 + (i % 6)}-${10 + i}`,
        ['Financial', 'Personal', 'Academic', 'Health', 'Migration'][i % 5],
        `+880170000${1000 + i}`
      ])
    }
  },

  // CATEGORY: Academic Progress (4 reports)
  {
    id: 'credit-completed',
    code: 'CRED_COMP_REQ',
    title: 'Credit Completed vs Required',
    description: 'Students progress towards degree completion',
    category: 'Academic Progress',
    filters: ['program', 'semester'],
    columns: ['Student ID', 'Name', 'Program', 'Completed', 'Required', 'Remaining', 'Progress %', 'Status'],
    getData: () => {
      const students = generateStudentData(40)
      return students.map((s, i) => {
        const completed = 60 + i * 2
        const required = 120
        const progress = ((completed / required) * 100).toFixed(1)
        return [
          s.studentId, s.name, s.program, completed, required, required - completed,
          `${progress}%`, completed >= required ? 'Complete' : completed >= 100 ? 'Near Complete' : 'In Progress'
        ]
      })
    }
  },
  {
    id: 'req-cred-done',
    code: 'REQ_CRED_DONE',
    title: 'Students Who Completed Required Credits',
    description: 'Students eligible for degree completion',
    category: 'Academic Progress',
    filters: ['semester', 'program'],
    columns: ['Student ID', 'Name', 'Program', 'Completed Credits', 'Required', 'CGPA', 'Eligible For', 'Remarks'],
    getData: () => {
      const students = generateStudentData(28).filter((_, i) => i % 2 === 0)
      return students.map(s => [
        s.studentId, s.name, s.program, 120, 120, s.cgpa.toFixed(2), 'Graduation', 'All requirements met'
      ])
    }
  },
  {
    id: 'sem-gpa-list',
    code: 'SEM_GPA_LIST',
    title: 'Semester GPA List',
    description: 'GPA listing for all students by semester',
    category: 'Academic Progress',
    filters: ['semester', 'program'],
    columns: ['Student ID', 'Name', 'Program', 'Semester', 'Credits', 'GPA', 'CGPA', 'Rank'],
    getData: () => {
      const students = generateStudentData(38)
      return students.map((s, i) => [
        s.studentId, s.name, s.program, s.semester, s.credits, s.cgpa.toFixed(2), 
        (s.cgpa + 0.1).toFixed(2), i + 1
      ]).sort((a, b) => parseFloat(b[6]) - parseFloat(a[6]))
    }
  },
  {
    id: 'cgpa-range',
    code: 'CGPA_RANGE',
    title: 'CGPA Range Wise Students',
    description: 'Students grouped by CGPA performance bands',
    category: 'Academic Progress',
    filters: ['program', 'cgpaRange'],
    columns: ['Student ID', 'Name', 'Program', 'CGPA', 'Credits', 'Classification', 'Standing'],
    getData: () => {
      const students = generateStudentData(42)
      return students.map(s => {
        const classification = s.cgpa >= 3.75 ? 'Excellent' : s.cgpa >= 3.5 ? 'Very Good' : 
                              s.cgpa >= 3.0 ? 'Good' : s.cgpa >= 2.5 ? 'Satisfactory' : 'Below Standard'
        return [
          s.studentId, s.name, s.program, s.cgpa.toFixed(2), s.credits, classification,
          s.cgpa >= 3.0 ? 'Good Standing' : 'Probation'
        ]
      })
    }
  },

  // CATEGORY: Graduation & Completion (4 reports)
  {
    id: 'completed-ugc',
    code: 'COMPLETED_UGC',
    title: 'Completed Students — UGC Format',
    description: 'Students who completed degrees in UGC reporting format',
    category: 'Graduation & Completion',
    filters: ['semester', 'program'],
    columns: ['Student ID', 'Name', 'Program', 'Session', 'Credits', 'CGPA', 'Class', 'Completion Date', 'Certificate No'],
    getData: () => {
      const students = generateStudentData(32).filter((_, i) => i % 3 === 0)
      return students.map((s, i) => [
        s.studentId, s.name, s.program, `${s.admitYear}-2025`, 120, s.cgpa.toFixed(2),
        s.cgpa >= 3.5 ? 'First' : s.cgpa >= 3.0 ? 'Second' : 'Third',
        `2025-12-${15 + i}`, `CERT-2025-${1000 + i}`
      ])
    }
  },
  {
    id: 'cbe-grads',
    code: 'CBE_GRADS',
    title: 'CBE-wise Graduated Students',
    description: 'Students cleared by CBE meetings',
    category: 'Graduation & Completion',
    filters: ['cbe', 'program'],
    columns: ['Student ID', 'Name', 'Program', 'CBE Meeting', 'Decision', 'CGPA', 'Credits', 'Cleared Date'],
    getData: () => {
      const students = generateStudentData(26).filter((_, i) => i % 4 === 0)
      return students.map((s, i) => [
        s.studentId, s.name, s.program, `CBE/2025/${(i % 3) + 1}`, 'Eligible', s.cgpa.toFixed(2), 120,
        `2025-11-${20 + i}`
      ])
    }
  },
  {
    id: 'convocation-candidates',
    code: 'CONV_CANDIDATES',
    title: 'Convocation Candidate List',
    description: 'Eligible candidates for upcoming convocation',
    category: 'Graduation & Completion',
    filters: ['convocation', 'program'],
    columns: ['Student ID', 'Name', 'Program', 'CGPA', 'Reg Status', 'Fee Status', 'Gown Size', 'Guest Count'],
    getData: () => {
      const students = generateStudentData(30).filter((_, i) => i % 3 === 0)
      return students.map((s, i) => [
        s.studentId, s.name, s.program, s.cgpa.toFixed(2),
        ['Registered', 'Pending', 'Confirmed'][i % 3],
        ['Paid', 'Unpaid'][i % 2],
        ['S', 'M', 'L', 'XL'][i % 4],
        i % 3 + 1
      ])
    }
  },
  {
    id: 'top-rankers',
    code: 'TOP_RANKERS',
    title: 'Top 3 & Top 10 Students',
    description: 'Highest performing students overall or per program',
    category: 'Graduation & Completion',
    filters: ['semester', 'program', 'topCount'],
    columns: ['Rank', 'Student ID', 'Name', 'Program', 'CGPA', 'Credits', 'Award Eligible'],
    getData: () => {
      // Generate 100 students to ensure we have enough for program-wise filtering (10+ per program)
      const allStudents = generateStudentData(100)
      // Boost CGPA for more realistic top performers and return unsorted
      // (sorting will happen in applyFilters based on program selection)
      return allStudents.map(s => ({
        ...s,
        cgpa: 3.2 + Math.random() * 0.8 // CGPA range 3.2-4.0 for top performers
      })).map((s, i) => [
        i + 1, s.studentId, s.name, s.program, s.cgpa.toFixed(2), 120,
        i === 0 ? 'Gold Medal' : i < 3 ? 'Merit Certificate' : 'Recognition'
      ])
    }
  },

  // CATEGORY: Results & Performance (4 reports)
  {
    id: 'grade-sheet-sec',
    code: 'GRADE_SHEET_SEC',
    title: 'Grade Sheet Summary — Section-wise',
    description: 'Detailed grade sheets organized by section',
    category: 'Results & Performance',
    filters: ['semester', 'program', 'section'],
    columns: ['Student ID', 'Name', 'Section', 'Course', 'Credits', 'Grade', 'Grade Point', 'Remarks'],
    getData: () => {
      const students = generateStudentData(35)
      return students.map((s, i) => [
        s.studentId, s.name, ['A', 'B', 'C'][i % 3], `CSE${101 + (i % 5)}`, 3,
        ['A', 'A-', 'B+', 'B', 'B-', 'C+'][i % 6],
        [4.0, 3.7, 3.3, 3.0, 2.7, 2.3][i % 6],
        i % 10 === 0 ? 'Improvement shown' : ''
      ])
    }
  },
  {
    id: 'cgpa-below-2',
    code: 'CGPA_BELOW_2',
    title: 'CGPA Below 2.00',
    description: 'Students below minimum academic threshold',
    category: 'Results & Performance',
    filters: ['semester', 'program'],
    columns: ['Student ID', 'Name', 'Program', 'CGPA', 'Credits', 'Status', 'Warning Level', 'Action Required'],
    getData: () => {
      const students = generateStudentData(15).filter(() => Math.random() > 0.3)
      return students.map((s, i) => {
        const lowCGPA = 1.5 + Math.random() * 0.5
        return [
          s.studentId, s.name, s.program, lowCGPA.toFixed(2), s.credits, 'Probation',
          `Warning ${(i % 3) + 1}`, i % 3 === 2 ? 'Show Cause' : 'Academic Counseling'
        ]
      })
    }
  },
  {
    id: 'perf-report',
    code: 'PERF_REPORT',
    title: 'Students Performance Report',
    description: 'Comprehensive academic performance overview',
    category: 'Results & Performance',
    filters: ['semester', 'program'],
    columns: ['Student ID', 'Name', 'Program', 'GPA', 'CGPA', 'Credits', 'Rank', 'Status', 'Trend'],
    getData: () => {
      const students = generateStudentData(40)
      return students.map((s, i) => [
        s.studentId, s.name, s.program, s.cgpa.toFixed(2), (s.cgpa + 0.1).toFixed(2), s.credits,
        i + 1, s.cgpa >= 3.5 ? 'Excellent' : s.cgpa >= 3.0 ? 'Good' : 'Satisfactory',
        i % 2 === 0 ? '↑ Improving' : '→ Stable'
      ])
    }
  },
  {
    id: 'unpub-sections',
    code: 'UNPUB_SECTIONS',
    title: 'Unpublished Sections',
    description: 'Sections with pending result publication',
    category: 'Results & Performance',
    filters: ['semester', 'program'],
    columns: ['Program', 'Course', 'Section', 'Instructor', 'Students', 'Status', 'Pending Since', 'Action'],
    getData: () => {
      return [
        ['CSE', 'CSE301', 'A', 'Dr. Rahman', 45, 'Draft', '2025-11-15', 'Awaiting marks'],
        ['BBA', 'BBA201', 'B', 'Prof. Hasan', 38, 'Under Review', '2025-11-20', 'HOD review'],
        ['EEE', 'EEE101', 'C', 'Dr. Ahmed', 42, 'Draft', '2025-11-18', 'Data entry'],
        ['LLB', 'LLB202', 'A', 'Prof. Karim', 35, 'Ready', '2025-11-25', 'Final approval']
      ]
    }
  },

  // CATEGORY: Scholarships & Honors (3 reports)
  {
    id: 'scholarship-list',
    code: 'SCHOLARSHIP_LIST',
    title: 'Scholarship Eligibility Report',
    description: 'Students awarded scholarships and waivers',
    category: 'Scholarships & Honors',
    filters: ['semester', 'program'],
    columns: ['Student ID', 'Name', 'Program', 'CGPA', 'Tier', 'Waiver %', 'Amount', 'Status'],
    getData: () => {
      const students = generateStudentData(25).filter((_, i) => i % 2 === 0)
      return students.map((s, i) => {
        const tier = s.cgpa >= 3.75 ? 'Tier 1' : s.cgpa >= 3.5 ? 'Tier 2' : s.cgpa >= 3.25 ? 'Tier 3' : 'Tier 4'
        const waiver = s.cgpa >= 3.75 ? 100 : s.cgpa >= 3.5 ? 75 : s.cgpa >= 3.25 ? 50 : 25
        return [
          s.studentId, s.name, s.program, s.cgpa.toFixed(2), tier, `${waiver}%`,
          `${waiver * 400} BDT`, ['Assigned', 'Approved', 'Pending'][i % 3]
        ]
      })
    }
  },
  {
    id: 'gold-eligible',
    code: 'GOLD_ELIGIBLE',
    title: 'Gold Medal Eligibility List',
    description: 'Students eligible for gold medal awards',
    category: 'Scholarships & Honors',
    filters: ['program', 'year'],
    columns: ['Student ID', 'Name', 'Program', 'CGPA', 'Credits', 'Rank', 'Medal Type', 'Criteria Met'],
    getData: () => {
      const students = generateStudentData(8).filter(() => Math.random() > 0.5).sort((a, b) => b.cgpa - a.cgpa)
      return students.map((s, i) => [
        s.studentId, s.name, s.program, (3.9 + Math.random() * 0.1).toFixed(2), 120,
        i + 1, i === 0 ? 'Gold' : i === 1 ? 'Silver' : 'Recognition',
        'CGPA, Credits, Conduct'
      ])
    }
  },
  {
    id: 'merit-scholars',
    code: 'MERIT_SCHOLARS',
    title: 'Merit Scholarship Recipients',
    description: 'Students receiving merit-based financial aid',
    category: 'Scholarships & Honors',
    filters: ['semester', 'program'],
    columns: ['Student ID', 'Name', 'Program', 'CGPA', 'Scholarship Type', 'Amount', 'Duration', 'Status'],
    getData: () => {
      const students = generateStudentData(20).filter((_, i) => i % 3 === 0)
      return students.map((s, i) => [
        s.studentId, s.name, s.program, s.cgpa.toFixed(2),
        ['Merit', 'Need-based', 'Sports', 'Cultural'][i % 4],
        `${20000 + i * 5000} BDT`, '1 Semester', 'Active'
      ])
    }
  },

  // CATEGORY: Documents & Operations (3 reports)
  {
    id: 'doc-issue-counts',
    code: 'DOC_ISSUE_COUNTS',
    title: 'Document Issue Summary',
    description: 'Summary of issued certificates and documents',
    category: 'Documents & Operations',
    filters: ['dateRange', 'docType'],
    columns: ['Document Type', 'Issued', 'Pending', 'Rejected', 'Total', 'Avg Processing Days'],
    getData: () => {
      return [
        ['Transcript', 145, 32, 8, 185, 3.5],
        ['Degree Certificate', 89, 15, 4, 108, 7.2],
        ['Provisional Certificate', 67, 12, 3, 82, 2.1],
        ['Course Completion', 234, 45, 12, 291, 1.5],
        ['Verification Letter', 156, 23, 7, 186, 1.2]
      ]
    }
  },
  {
    id: 'doc-request-summary',
    code: 'DOC_REQ_SUMMARY',
    title: 'Student Document Request Summary',
    description: 'Detailed document request tracking',
    category: 'Documents & Operations',
    filters: ['dateRange', 'status'],
    columns: ['Student ID', 'Name', 'Document Type', 'Request Date', 'Status', 'Processing Time', 'Collected'],
    getData: () => {
      const students = generateStudentData(30)
      return students.map((s, i) => [
        s.studentId, s.name, ['Transcript', 'Certificate', 'Verification'][i % 3],
        `2025-11-${10 + (i % 20)}`, ['Issued', 'Processing', 'Ready'][i % 3],
        `${1 + (i % 10)} days`, i % 3 === 0 ? 'Yes' : 'No'
      ])
    }
  },
  {
    id: 'daily-doc-summary',
    code: 'DAILY_DOC_SUMMARY',
    title: 'Daily Document Processing Summary',
    description: 'Daily statistics of document processing',
    category: 'Documents & Operations',
    filters: ['dateRange'],
    columns: ['Date', 'Document Type', 'Requested', 'Processed', 'Pending', 'Approval Rate', 'Revenue'],
    getData: () => {
      return Array.from({ length: 20 }, (_, i) => [
        `2025-11-${10 + i}`, ['Transcript', 'Certificate', 'Verification'][i % 3],
        15 + (i % 10), 12 + (i % 8), 3, `${((12 + (i % 8)) / (15 + (i % 10)) * 100).toFixed(1)}%`,
        `${(12 + (i % 8)) * 500} BDT`
      ])
    }
  },

  // CATEGORY: Multi-format Reports (2 reports)
  {
    id: 'banbais-report',
    code: 'BANBAIS_MULTI',
    title: 'BANBAIS Multi-format Report',
    description: 'BANBAIS compliance reporting format',
    category: 'Multi-format Reports',
    filters: ['semester', 'format'],
    columns: ['Program', 'Total Enrolled', 'Active', 'Graduated', 'Retention %', 'Pass Rate', 'Accredited'],
    getData: () => {
      return [
        ['CSE', 450, 425, 85, 94.4, 92.1, 'Yes'],
        ['BBA', 380, 360, 72, 94.7, 89.5, 'Yes'],
        ['EEE', 320, 305, 58, 95.3, 91.2, 'Yes'],
        ['LLB', 280, 265, 52, 94.6, 87.8, 'Yes'],
        ['MBA', 150, 142, 35, 94.7, 93.5, 'Yes']
      ]
    }
  },
  {
    id: 'ugc-metrics',
    code: 'UGC_METRICS',
    title: 'UGC Accreditation Metrics',
    description: 'UGC standard performance metrics',
    category: 'Multi-format Reports',
    filters: ['year', 'program'],
    columns: ['Metric', 'Value', 'Benchmark', 'Status', 'Trend', 'Action Required'],
    getData: () => {
      return [
        ['Student-Faculty Ratio', '18:1', '20:1', 'Compliant', '↓ Improving', 'None'],
        ['Graduation Rate', '87%', '75%', 'Above', '↑ Excellent', 'Maintain'],
        ['Research Publications', '145', '100', 'Above', '↑ Growing', 'None'],
        ['Industry Collaboration', '23', '15', 'Above', '↑ Strong', 'Expand'],
        ['Infrastructure Score', '8.5/10', '7/10', 'Above', '→ Stable', 'Upgrade labs']
      ]
    }
  }
]

export const getReportsByCategory = (category: string) =>
  REPORTS_CATALOG.filter(r => r.category === category)

export const REPORT_CATEGORIES = [
  'Enrollment & Admission',
  'Academic Progress',
  'Graduation & Completion',
  'Results & Performance',
  'Scholarships & Honors',
  'Documents & Operations',
  'Multi-format Reports'
]
