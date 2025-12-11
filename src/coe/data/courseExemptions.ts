export type CEStatus = 'Requested' | 'Under Review' | 'Evaluated' | 'Approved' | 'Rejected' | 'Applied'

export interface RequestedCourse {
  code: string
  title: string
  credit: number
  selected?: boolean
}

export interface CEAuditEntry {
  action: string
  by: string
  date: string
  remarks: string
}

export interface CourseExemptionRequest {
  id: string
  studentId: string
  studentName: string
  programCode: string
  campus: string
  semester: string
  requestedCourses: RequestedCourse[]
  exemptedCourses: RequestedCourse[]
  status: CEStatus
  reason: string
  requestedAt: string
  updatedAt: string
  notes: string
  audit: CEAuditEntry[]
}

export const COURSE_EXEMPTION_REQUESTS: CourseExemptionRequest[] = [
  {
    id: 'ce-001',
    studentId: 'STU-2024-0101',
    studentName: 'Farzana Kabir',
    programCode: 'BBA',
    campus: 'Banani',
    semester: 'Fall 2025',
    requestedCourses: [
      { code: 'BUS101', title: 'Introduction to Business', credit: 3 },
      { code: 'ACC101', title: 'Principles of Accounting', credit: 3 },
      { code: 'ECO101', title: 'Microeconomics', credit: 3 }
    ],
    exemptedCourses: [
      { code: 'BUS101', title: 'Introduction to Business', credit: 3, selected: true },
      { code: 'ACC101', title: 'Principles of Accounting', credit: 3, selected: true }
    ],
    status: 'Evaluated',
    reason: 'Completed equivalent courses at previous institution',
    requestedAt: '2025-11-10',
    updatedAt: '2025-11-15',
    notes: 'Strong portfolio from DU',
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-10', remarks: 'Initial request' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-11-12', remarks: 'Forwarded to evaluator' },
      { action: 'Evaluated', by: 'Dr. Rahman', date: '2025-11-15', remarks: '2 courses exempted' }
    ]
  },
  {
    id: 'ce-002',
    studentId: 'STU-2023-0005',
    studentName: 'Sabrina Akter',
    programCode: 'CSE',
    campus: 'Permanent',
    semester: 'Fall 2025',
    requestedCourses: [
      { code: 'CSE1101', title: 'Programming Fundamentals', credit: 3 },
      { code: 'CSE2211', title: 'Data Structures', credit: 3 },
      { code: 'MATH201', title: 'Discrete Mathematics', credit: 3 }
    ],
    exemptedCourses: [
      { code: 'CSE1101', title: 'Programming Fundamentals', credit: 3, selected: true },
      { code: 'CSE2211', title: 'Data Structures', credit: 3, selected: true },
      { code: 'MATH201', title: 'Discrete Mathematics', credit: 3, selected: true }
    ],
    status: 'Approved',
    reason: 'Previous programming experience and certifications',
    requestedAt: '2025-11-08',
    updatedAt: '2025-11-18',
    notes: 'Has industry certifications',
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-08', remarks: 'Request with certificates' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-11-10', remarks: 'Assigned to Prof. Karim' },
      { action: 'Evaluated', by: 'Prof. Karim', date: '2025-11-15', remarks: 'All 3 courses qualify' },
      { action: 'Approved', by: 'Academic Committee', date: '2025-11-18', remarks: 'Approved for exemption' }
    ]
  },
  {
    id: 'ce-003',
    studentId: 'STU-2023-0010',
    studentName: 'Mahfuz Rahman',
    programCode: 'CSE',
    campus: 'Permanent',
    semester: 'Fall 2025',
    requestedCourses: [
      { code: 'CSE1101', title: 'Programming Fundamentals', credit: 3 },
      { code: 'ENG101', title: 'English Composition', credit: 3 }
    ],
    exemptedCourses: [],
    status: 'Requested',
    reason: 'Online courses completed',
    requestedAt: '2025-11-16',
    updatedAt: '2025-11-16',
    notes: 'Blocked by Finance Dues',
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-16', remarks: 'Request submitted' }
    ]
  },
  {
    id: 'ce-004',
    studentId: 'STU-2022-0055',
    studentName: 'Raihan Ahmed',
    programCode: 'EEE',
    campus: 'Permanent',
    semester: 'Fall 2025',
    requestedCourses: [
      { code: 'EEE1101', title: 'Circuit Analysis', credit: 3 },
      { code: 'PHY101', title: 'Physics I', credit: 3 }
    ],
    exemptedCourses: [
      { code: 'EEE1101', title: 'Circuit Analysis', credit: 3, selected: true }
    ],
    status: 'Applied',
    reason: 'Transfer student from BUET',
    requestedAt: '2025-10-20',
    updatedAt: '2025-11-10',
    notes: 'Successfully applied',
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-10-20', remarks: 'Transfer request' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-10-22', remarks: 'Under evaluation' },
      { action: 'Evaluated', by: 'Dr. Hasan', date: '2025-10-28', remarks: '1 course exempted' },
      { action: 'Approved', by: 'Academic Committee', date: '2025-11-05', remarks: 'Approved' },
      { action: 'Applied', by: 'Registrar', date: '2025-11-10', remarks: 'Exemption applied to student record' }
    ]
  },
  {
    id: 'ce-005',
    studentId: 'STU-2024-0088',
    studentName: 'Kamal Hossain',
    programCode: 'ENG',
    campus: 'Permanent',
    semester: 'Fall 2025',
    requestedCourses: [
      { code: 'ENG101', title: 'English Composition', credit: 3 },
      { code: 'ENG102', title: 'Creative Writing', credit: 3 }
    ],
    exemptedCourses: [],
    status: 'Under Review',
    reason: 'Published author with portfolio',
    requestedAt: '2025-11-12',
    updatedAt: '2025-11-14',
    notes: 'Under evaluation by English department',
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-12', remarks: 'Request with portfolio' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-11-14', remarks: 'Assigned to Dr. Sultana' }
    ]
  },
  {
    id: 'ce-006',
    studentId: 'STU-2024-0201',
    studentName: 'Sadia Akter',
    programCode: 'BBA',
    campus: 'Mirpur',
    semester: 'Fall 2025',
    requestedCourses: [
      { code: 'BUS101', title: 'Introduction to Business', credit: 3 },
      { code: 'MKT201', title: 'Principles of Marketing', credit: 3 }
    ],
    exemptedCourses: [],
    status: 'Requested',
    reason: 'Work experience in marketing',
    requestedAt: '2025-11-14',
    updatedAt: '2025-11-14',
    notes: 'Blocked by TER Not Submitted',
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-14', remarks: 'Experience letter attached' }
    ]
  },
  {
    id: 'ce-007',
    studentId: 'STU-2022-0120',
    studentName: 'Nusrat Jahan',
    programCode: 'MBA',
    campus: 'Banani',
    semester: 'Fall 2025',
    requestedCourses: [
      { code: 'MGT501', title: 'Strategic Management', credit: 3 }
    ],
    exemptedCourses: [],
    status: 'Rejected',
    reason: 'Previous course work',
    requestedAt: '2025-10-15',
    updatedAt: '2025-10-25',
    notes: 'Rejected - insufficient evidence',
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-10-15', remarks: 'Exemption request' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-10-18', remarks: 'Assigned to Prof. Ahmed' },
      { action: 'Evaluated', by: 'Prof. Ahmed', date: '2025-10-22', remarks: 'Does not meet criteria' },
      { action: 'Rejected', by: 'Academic Committee', date: '2025-10-25', remarks: 'Insufficient documentation' }
    ]
  },
  {
    id: 'ce-008',
    studentId: 'STU-2023-0145',
    studentName: 'Rahim Uddin',
    programCode: 'EEE',
    campus: 'Permanent',
    semester: 'Fall 2025',
    requestedCourses: [
      { code: 'EEE1101', title: 'Circuit Analysis', credit: 3 },
      { code: 'EEE2101', title: 'Digital Electronics', credit: 3 }
    ],
    exemptedCourses: [],
    status: 'Requested',
    reason: 'Industry experience',
    requestedAt: '2025-11-17',
    updatedAt: '2025-11-17',
    notes: 'Blocked by Disciplinary Action',
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-17', remarks: 'Experience certificates attached' }
    ]
  },
  {
    id: 'ce-009',
    studentId: 'STU-2024-0055',
    studentName: 'Lubna Rahman',
    programCode: 'LLB',
    campus: 'Banani',
    semester: 'Fall 2025',
    requestedCourses: [
      { code: 'LAW101', title: 'Constitutional Law I', credit: 3 },
      { code: 'LAW102', title: 'Contract Law', credit: 3 }
    ],
    exemptedCourses: [
      { code: 'LAW101', title: 'Constitutional Law I', credit: 3, selected: true },
      { code: 'LAW102', title: 'Contract Law', credit: 3, selected: true }
    ],
    status: 'Evaluated',
    reason: 'Previous law degree from DU',
    requestedAt: '2025-11-11',
    updatedAt: '2025-11-16',
    notes: 'Strong law background',
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-11', remarks: 'Previous degree credentials' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-11-13', remarks: 'Assigned to Prof. Karim' },
      { action: 'Evaluated', by: 'Prof. Karim', date: '2025-11-16', remarks: 'Both courses qualify' }
    ]
  },
  {
    id: 'ce-010',
    studentId: 'STU-2023-0120',
    studentName: 'Fahim Shahriar',
    programCode: 'CSE',
    campus: 'Permanent',
    semester: 'Fall 2025',
    requestedCourses: [
      { code: 'CSE1101', title: 'Programming Fundamentals', credit: 3 }
    ],
    exemptedCourses: [],
    status: 'Under Review',
    reason: 'Programming bootcamp graduate',
    requestedAt: '2025-11-13',
    updatedAt: '2025-11-15',
    notes: 'Under evaluation',
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-13', remarks: 'Bootcamp certificate' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-11-15', remarks: 'Assigned to Dr. Rahman' }
    ]
  },
  {
    id: 'ce-011',
    studentId: 'STU-2024-0102',
    studentName: 'Tanvir Hasan',
    programCode: 'BBA',
    campus: 'Mirpur',
    semester: 'Fall 2025',
    requestedCourses: [
      { code: 'ACC101', title: 'Principles of Accounting', credit: 3 },
      { code: 'FIN101', title: 'Financial Accounting', credit: 3 }
    ],
    exemptedCourses: [
      { code: 'ACC101', title: 'Principles of Accounting', credit: 3, selected: true }
    ],
    status: 'Approved',
    reason: 'ACCA certification holder',
    requestedAt: '2025-11-09',
    updatedAt: '2025-11-17',
    notes: 'Professional certification verified',
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-09', remarks: 'ACCA certificate attached' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-11-11', remarks: 'Under evaluation' },
      { action: 'Evaluated', by: 'Dr. Rahman', date: '2025-11-14', remarks: '1 course exempted' },
      { action: 'Approved', by: 'Academic Committee', date: '2025-11-17', remarks: 'Approved' }
    ]
  },
  {
    id: 'ce-012',
    studentId: 'STU-2022-0175',
    studentName: 'Meher Afroz',
    programCode: 'EEE',
    campus: 'Permanent',
    semester: 'Fall 2025',
    requestedCourses: [
      { code: 'MATH101', title: 'Calculus I', credit: 3 },
      { code: 'MATH102', title: 'Linear Algebra', credit: 3 }
    ],
    exemptedCourses: [
      { code: 'MATH101', title: 'Calculus I', credit: 3, selected: true }
    ],
    status: 'Evaluated',
    reason: 'Advanced mathematics background',
    requestedAt: '2025-11-10',
    updatedAt: '2025-11-16',
    notes: 'Mathematics olympiad participant',
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-10', remarks: 'Olympiad certificates' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-11-12', remarks: 'Assigned to Dr. Khan' },
      { action: 'Evaluated', by: 'Dr. Khan', date: '2025-11-16', remarks: '1 course exempted' }
    ]
  },
  {
    id: 'ce-013',
    studentId: 'STU-2023-0099',
    studentName: 'Arif Rahman',
    programCode: 'CSE',
    campus: 'Banani',
    semester: 'Fall 2025',
    requestedCourses: [
      { code: 'CSE1101', title: 'Programming Fundamentals', credit: 3 },
      { code: 'CSE1102', title: 'Programming Lab', credit: 1.5 }
    ],
    exemptedCourses: [],
    status: 'Rejected',
    reason: 'Online course completion',
    requestedAt: '2025-10-18',
    updatedAt: '2025-10-28',
    notes: 'Rejected - not from accredited institution',
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-10-18', remarks: 'Online certificates' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-10-20', remarks: 'Under evaluation' },
      { action: 'Evaluated', by: 'Prof. Karim', date: '2025-10-25', remarks: 'Does not meet criteria' },
      { action: 'Rejected', by: 'Academic Committee', date: '2025-10-28', remarks: 'Not from accredited source' }
    ]
  },
  {
    id: 'ce-014',
    studentId: 'STU-2024-0175',
    studentName: 'Imran Hossain',
    programCode: 'ENG',
    campus: 'Permanent',
    semester: 'Fall 2025',
    requestedCourses: [
      { code: 'ENG101', title: 'English Composition', credit: 3 }
    ],
    exemptedCourses: [],
    status: 'Requested',
    reason: 'IELTS 8.0 score',
    requestedAt: '2025-11-18',
    updatedAt: '2025-11-18',
    notes: 'High IELTS score',
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-18', remarks: 'IELTS scorecard attached' }
    ]
  }
]

export const getCEByStatus = (status: CEStatus) =>
  COURSE_EXEMPTION_REQUESTS.filter(r => r.status === status)

export const getCEByStudent = (studentId: string) =>
  COURSE_EXEMPTION_REQUESTS.filter(r => r.studentId === studentId)

export const getCEByProgram = (programCode: string) =>
  COURSE_EXEMPTION_REQUESTS.filter(r => r.programCode === programCode)
