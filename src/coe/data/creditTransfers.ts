export type CTStatus = 'Requested' | 'Under Review' | 'Evaluated' | 'Approved' | 'Rejected' | 'Applied'
export type MappingDecision = 'Map' | 'Waive' | 'Reject'

export interface CourseMapping {
  sourceCode: string
  sourceTitle: string
  sourceCredit: number
  sourceGrade?: string
  targetCode?: string
  targetTitle?: string
  targetCredit?: number
  decision: MappingDecision
  reason?: string
}

export interface CTTotals {
  sourceCredits: number
  mappedCredits: number
  waivedCredits: number
}

export interface CTDecision {
  approvedBy: string | null
  decisionAt: string | null
  remarks: string
}

export interface CTAuditEntry {
  action: string
  by: string
  date: string
  remarks: string
}

export interface CreditTransferRequest {
  id: string
  requestId: string
  studentId: string
  studentName: string
  programCode: string
  campus: string
  sourceUniversity: string
  sourceSystem: 'Manual' | 'CSV'
  sourceGPA: number | null
  sourceCredits: number
  requestedAt: string
  updatedAt: string
  status: CTStatus
  evaluator: string | null
  notes: string
  mappings: CourseMapping[]
  totals: CTTotals
  decision: CTDecision
  audit: CTAuditEntry[]
}

export const CREDIT_TRANSFER_REQUESTS: CreditTransferRequest[] = [
  {
    id: 'ct-001',
    requestId: 'CT-2025-001',
    studentId: 'STU-2024-0101',
    studentName: 'Farzana Kabir',
    programCode: 'BBA',
    campus: 'Banani',
    sourceUniversity: 'Dhaka University',
    sourceSystem: 'CSV',
    sourceGPA: 3.68,
    sourceCredits: 24,
    requestedAt: '2025-11-01',
    updatedAt: '2025-11-15',
    status: 'Approved',
    evaluator: 'Dr. Rahman',
    notes: 'Strong academic record from DU',
    mappings: [
      {
        sourceCode: 'BUS101',
        sourceTitle: 'Introduction to Business',
        sourceCredit: 3,
        sourceGrade: 'A',
        targetCode: 'BBA1101',
        targetTitle: 'Business Fundamentals',
        targetCredit: 3,
        decision: 'Map',
        reason: 'Equivalent content'
      },
      {
        sourceCode: 'ACC101',
        sourceTitle: 'Principles of Accounting',
        sourceCredit: 3,
        sourceGrade: 'A-',
        targetCode: 'ACC101',
        targetTitle: 'Principles of Accounting',
        targetCredit: 3,
        decision: 'Map',
        reason: 'Direct equivalence'
      },
      {
        sourceCode: 'ECO101',
        sourceTitle: 'Microeconomics',
        sourceCredit: 3,
        sourceGrade: 'B+',
        targetCode: 'ECO101',
        targetTitle: 'Microeconomics',
        targetCredit: 3,
        decision: 'Map'
      },
      {
        sourceCode: 'MATH101',
        sourceTitle: 'Business Mathematics',
        sourceCredit: 3,
        sourceGrade: 'A',
        decision: 'Waive',
        reason: 'General education waiver'
      },
      {
        sourceCode: 'ENG101',
        sourceTitle: 'English Composition',
        sourceCredit: 3,
        sourceGrade: 'A+',
        decision: 'Waive',
        reason: 'Language requirement waiver'
      }
    ],
    totals: {
      sourceCredits: 15,
      mappedCredits: 9,
      waivedCredits: 6
    },
    decision: {
      approvedBy: 'Academic Committee',
      decisionAt: '2025-11-15',
      remarks: 'All mappings approved'
    },
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-01', remarks: 'Initial request with transcript' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-11-05', remarks: 'Forwarded to evaluator' },
      { action: 'Evaluated', by: 'Dr. Rahman', date: '2025-11-10', remarks: 'Course mapping completed' },
      { action: 'Approved', by: 'Academic Committee', date: '2025-11-15', remarks: 'Approved for transfer' }
    ]
  },
  {
    id: 'ct-002',
    requestId: 'CT-2025-002',
    studentId: 'STU-2023-0005',
    studentName: 'Sabrina Akter',
    programCode: 'CSE',
    campus: 'Permanent',
    sourceUniversity: 'BUET',
    sourceSystem: 'Manual',
    sourceGPA: 3.72,
    sourceCredits: 18,
    requestedAt: '2025-11-10',
    updatedAt: '2025-11-18',
    status: 'Evaluated',
    evaluator: 'Prof. Karim',
    notes: 'Transfer from BUET - strong technical background',
    mappings: [
      {
        sourceCode: 'CSE101',
        sourceTitle: 'Programming Fundamentals',
        sourceCredit: 3,
        sourceGrade: 'A',
        targetCode: 'CSE1101',
        targetTitle: 'Programming Fundamentals',
        targetCredit: 3,
        decision: 'Map'
      },
      {
        sourceCode: 'CSE201',
        sourceTitle: 'Data Structures',
        sourceCredit: 3,
        sourceGrade: 'A+',
        targetCode: 'CSE2211',
        targetTitle: 'Data Structures',
        targetCredit: 3,
        decision: 'Map'
      },
      {
        sourceCode: 'MATH201',
        sourceTitle: 'Discrete Mathematics',
        sourceCredit: 3,
        sourceGrade: 'A',
        targetCode: 'MATH201',
        targetTitle: 'Discrete Mathematics',
        targetCredit: 3,
        decision: 'Map'
      }
    ],
    totals: {
      sourceCredits: 9,
      mappedCredits: 9,
      waivedCredits: 0
    },
    decision: {
      approvedBy: null,
      decisionAt: null,
      remarks: ''
    },
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-10', remarks: 'Manual entry request' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-11-12', remarks: 'Assigned to Prof. Karim' },
      { action: 'Evaluated', by: 'Prof. Karim', date: '2025-11-18', remarks: 'All courses mapped successfully' }
    ]
  },
  {
    id: 'ct-003',
    requestId: 'CT-2025-003',
    studentId: 'STU-2023-0010',
    studentName: 'Mahfuz Rahman',
    programCode: 'CSE',
    campus: 'Permanent',
    sourceUniversity: 'Chittagong University',
    sourceSystem: 'CSV',
    sourceGPA: 3.45,
    sourceCredits: 12,
    requestedAt: '2025-11-15',
    updatedAt: '2025-11-15',
    status: 'Requested',
    evaluator: null,
    notes: 'Blocked by Finance Dues - pending clearance',
    mappings: [],
    totals: {
      sourceCredits: 0,
      mappedCredits: 0,
      waivedCredits: 0
    },
    decision: {
      approvedBy: null,
      decisionAt: null,
      remarks: ''
    },
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-15', remarks: 'CSV upload request' }
    ]
  },
  {
    id: 'ct-004',
    requestId: 'CT-2025-004',
    studentId: 'STU-2022-0055',
    studentName: 'Raihan Ahmed',
    programCode: 'EEE',
    campus: 'Permanent',
    sourceUniversity: 'Rajshahi University',
    sourceSystem: 'Manual',
    sourceGPA: 3.65,
    sourceCredits: 21,
    requestedAt: '2025-10-20',
    updatedAt: '2025-11-10',
    status: 'Applied',
    evaluator: 'Dr. Hasan',
    notes: 'Successfully transferred and applied',
    mappings: [
      {
        sourceCode: 'EEE101',
        sourceTitle: 'Circuit Analysis',
        sourceCredit: 3,
        sourceGrade: 'A',
        targetCode: 'EEE1101',
        targetTitle: 'Circuit Analysis I',
        targetCredit: 3,
        decision: 'Map'
      },
      {
        sourceCode: 'EEE102',
        sourceTitle: 'Digital Logic',
        sourceCredit: 3,
        sourceGrade: 'A-',
        targetCode: 'CSE2101',
        targetTitle: 'Digital Logic Design',
        targetCredit: 3,
        decision: 'Map'
      },
      {
        sourceCode: 'MATH101',
        sourceTitle: 'Calculus I',
        sourceCredit: 3,
        sourceGrade: 'B+',
        decision: 'Waive',
        reason: 'General math waiver'
      }
    ],
    totals: {
      sourceCredits: 9,
      mappedCredits: 6,
      waivedCredits: 3
    },
    decision: {
      approvedBy: 'Academic Committee',
      decisionAt: '2025-11-05',
      remarks: 'Approved and applied to student record'
    },
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-10-20', remarks: 'Transfer request' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-10-22', remarks: 'Under evaluation' },
      { action: 'Evaluated', by: 'Dr. Hasan', date: '2025-10-28', remarks: 'Mapping completed' },
      { action: 'Approved', by: 'Academic Committee', date: '2025-11-05', remarks: 'Approved' },
      { action: 'Applied', by: 'Registrar', date: '2025-11-10', remarks: 'Credits added to student record' }
    ]
  },
  {
    id: 'ct-005',
    requestId: 'CT-2025-005',
    studentId: 'STU-2024-0088',
    studentName: 'Kamal Hossain',
    programCode: 'ENG',
    campus: 'Permanent',
    sourceUniversity: 'Jahangirnagar University',
    sourceSystem: 'Manual',
    sourceGPA: 3.58,
    sourceCredits: 12,
    requestedAt: '2025-11-12',
    updatedAt: '2025-11-16',
    status: 'Under Review',
    evaluator: 'Dr. Sultana',
    notes: 'Under evaluation by English department',
    mappings: [],
    totals: {
      sourceCredits: 0,
      mappedCredits: 0,
      waivedCredits: 0
    },
    decision: {
      approvedBy: null,
      decisionAt: null,
      remarks: ''
    },
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-12', remarks: 'Manual entry' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-11-16', remarks: 'Assigned to Dr. Sultana' }
    ]
  },
  {
    id: 'ct-006',
    requestId: 'CT-2025-006',
    studentId: 'STU-2024-0201',
    studentName: 'Sadia Akter',
    programCode: 'BBA',
    campus: 'Mirpur',
    sourceUniversity: 'IBA Dhaka',
    sourceSystem: 'CSV',
    sourceGPA: 3.82,
    sourceCredits: 18,
    requestedAt: '2025-11-14',
    updatedAt: '2025-11-14',
    status: 'Requested',
    evaluator: null,
    notes: 'Blocked by TER Not Submitted',
    mappings: [],
    totals: {
      sourceCredits: 0,
      mappedCredits: 0,
      waivedCredits: 0
    },
    decision: {
      approvedBy: null,
      decisionAt: null,
      remarks: ''
    },
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-14', remarks: 'CSV upload' }
    ]
  },
  {
    id: 'ct-007',
    requestId: 'CT-2025-007',
    studentId: 'STU-2022-0120',
    studentName: 'Nusrat Jahan',
    programCode: 'MBA',
    campus: 'Banani',
    sourceUniversity: 'Independent University',
    sourceSystem: 'Manual',
    sourceGPA: 3.88,
    sourceCredits: 15,
    requestedAt: '2025-10-15',
    updatedAt: '2025-10-25',
    status: 'Rejected',
    evaluator: 'Prof. Ahmed',
    notes: 'Rejected due to insufficient course alignment',
    mappings: [
      {
        sourceCode: 'MBA501',
        sourceTitle: 'Strategic Management',
        sourceCredit: 3,
        sourceGrade: 'A',
        decision: 'Reject',
        reason: 'Not offered in our curriculum'
      }
    ],
    totals: {
      sourceCredits: 3,
      mappedCredits: 0,
      waivedCredits: 0
    },
    decision: {
      approvedBy: 'Academic Committee',
      decisionAt: '2025-10-25',
      remarks: 'Course not equivalent to any in our program'
    },
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-10-15', remarks: 'Transfer request' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-10-18', remarks: 'Assigned to Prof. Ahmed' },
      { action: 'Evaluated', by: 'Prof. Ahmed', date: '2025-10-22', remarks: 'No equivalent courses found' },
      { action: 'Rejected', by: 'Academic Committee', date: '2025-10-25', remarks: 'No transferable credits' }
    ]
  },
  {
    id: 'ct-008',
    requestId: 'CT-2025-008',
    studentId: 'STU-2023-0145',
    studentName: 'Rahim Uddin',
    programCode: 'EEE',
    campus: 'Permanent',
    sourceUniversity: 'KUET',
    sourceSystem: 'CSV',
    sourceGPA: 3.12,
    sourceCredits: 15,
    requestedAt: '2025-11-16',
    updatedAt: '2025-11-16',
    status: 'Requested',
    evaluator: null,
    notes: 'Blocked by Disciplinary Action',
    mappings: [],
    totals: {
      sourceCredits: 0,
      mappedCredits: 0,
      waivedCredits: 0
    },
    decision: {
      approvedBy: null,
      decisionAt: null,
      remarks: ''
    },
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-16', remarks: 'CSV upload' }
    ]
  },
  {
    id: 'ct-009',
    requestId: 'CT-2025-009',
    studentId: 'STU-2024-0055',
    studentName: 'Lubna Rahman',
    programCode: 'LLB',
    campus: 'Banani',
    sourceUniversity: 'Dhaka University Law Dept',
    sourceSystem: 'Manual',
    sourceGPA: 3.91,
    sourceCredits: 12,
    requestedAt: '2025-11-17',
    updatedAt: '2025-11-19',
    status: 'Evaluated',
    evaluator: 'Prof. Karim',
    notes: 'Excellent law background from DU',
    mappings: [
      {
        sourceCode: 'LAW101',
        sourceTitle: 'Constitutional Law I',
        sourceCredit: 3,
        sourceGrade: 'A+',
        targetCode: 'LAW101',
        targetTitle: 'Constitutional Law I',
        targetCredit: 3,
        decision: 'Map'
      },
      {
        sourceCode: 'LAW102',
        sourceTitle: 'Contract Law',
        sourceCredit: 3,
        sourceGrade: 'A',
        targetCode: 'LAW102',
        targetTitle: 'Contract Law',
        targetCredit: 3,
        decision: 'Map'
      }
    ],
    totals: {
      sourceCredits: 6,
      mappedCredits: 6,
      waivedCredits: 0
    },
    decision: {
      approvedBy: null,
      decisionAt: null,
      remarks: ''
    },
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-17', remarks: 'Manual entry' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-11-18', remarks: 'Assigned to Prof. Karim' },
      { action: 'Evaluated', by: 'Prof. Karim', date: '2025-11-19', remarks: 'Direct equivalence mapping' }
    ]
  },
  {
    id: 'ct-010',
    requestId: 'CT-2025-010',
    studentId: 'STU-2023-0120',
    studentName: 'Fahim Shahriar',
    programCode: 'CSE',
    campus: 'Permanent',
    sourceUniversity: 'American International University',
    sourceSystem: 'CSV',
    sourceGPA: 3.45,
    sourceCredits: 21,
    requestedAt: '2025-11-11',
    updatedAt: '2025-11-14',
    status: 'Under Review',
    evaluator: 'Dr. Rahman',
    notes: 'Under evaluation',
    mappings: [],
    totals: {
      sourceCredits: 0,
      mappedCredits: 0,
      waivedCredits: 0
    },
    decision: {
      approvedBy: null,
      decisionAt: null,
      remarks: ''
    },
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-11', remarks: 'CSV upload' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-11-14', remarks: 'Assigned to Dr. Rahman' }
    ]
  },
  {
    id: 'ct-011',
    requestId: 'CT-2025-011',
    studentId: 'STU-2024-0102',
    studentName: 'Tanvir Hasan',
    programCode: 'BBA',
    campus: 'Mirpur',
    sourceUniversity: 'BRAC University',
    sourceSystem: 'Manual',
    sourceGPA: 3.55,
    sourceCredits: 18,
    requestedAt: '2025-11-08',
    updatedAt: '2025-11-18',
    status: 'Approved',
    evaluator: 'Dr. Rahman',
    notes: 'Well-documented transfer from BRAC',
    mappings: [
      {
        sourceCode: 'BUS201',
        sourceTitle: 'Marketing Principles',
        sourceCredit: 3,
        sourceGrade: 'A',
        targetCode: 'MKT201',
        targetTitle: 'Principles of Marketing',
        targetCredit: 3,
        decision: 'Map'
      },
      {
        sourceCode: 'FIN101',
        sourceTitle: 'Financial Accounting',
        sourceCredit: 3,
        sourceGrade: 'A-',
        targetCode: 'FIN101',
        targetTitle: 'Financial Accounting',
        targetCredit: 3,
        decision: 'Map'
      }
    ],
    totals: {
      sourceCredits: 6,
      mappedCredits: 6,
      waivedCredits: 0
    },
    decision: {
      approvedBy: 'Academic Committee',
      decisionAt: '2025-11-18',
      remarks: 'Approved for transfer'
    },
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-08', remarks: 'Manual entry' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-11-10', remarks: 'Under evaluation' },
      { action: 'Evaluated', by: 'Dr. Rahman', date: '2025-11-15', remarks: 'Mapping completed' },
      { action: 'Approved', by: 'Academic Committee', date: '2025-11-18', remarks: 'Approved' }
    ]
  },
  {
    id: 'ct-012',
    requestId: 'CT-2025-012',
    studentId: 'STU-2022-0175',
    studentName: 'Meher Afroz',
    programCode: 'EEE',
    campus: 'Permanent',
    sourceUniversity: 'AUST',
    sourceSystem: 'CSV',
    sourceGPA: 3.75,
    sourceCredits: 24,
    requestedAt: '2025-11-09',
    updatedAt: '2025-11-09',
    status: 'Requested',
    evaluator: null,
    notes: 'Awaiting initial review',
    mappings: [],
    totals: {
      sourceCredits: 0,
      mappedCredits: 0,
      waivedCredits: 0
    },
    decision: {
      approvedBy: null,
      decisionAt: null,
      remarks: ''
    },
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-09', remarks: 'CSV upload' }
    ]
  }
]

export const getCTByStatus = (status: CTStatus) =>
  CREDIT_TRANSFER_REQUESTS.filter(r => r.status === status)

export const getCTByStudent = (studentId: string) =>
  CREDIT_TRANSFER_REQUESTS.filter(r => r.studentId === studentId)

export const getCTByProgram = (programCode: string) =>
  CREDIT_TRANSFER_REQUESTS.filter(r => r.programCode === programCode)
