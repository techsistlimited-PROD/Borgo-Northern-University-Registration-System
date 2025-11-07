export interface CBEMeeting {
  id: string
  cbeNo: string
  meetingDate: string
  coverage: {
    semesterIds: string[]
    programs: string[]
  }
  status: 'Scheduled' | 'Completed' | 'Archived'
  venue: string
  chairman: string
  members: string[]
  remarks: string
  agendaItems: string[]
  eligibleStudentsCount: number
  approvedCount: number
  deferredCount: number
}

export interface CBECandidate {
  id: string
  cbeNo: string
  studentId: string
  studentName: string
  programCode: string
  batch: string
  totalCreditsEarned: number
  requiredCredits: number
  cgpa: number
  eligibilityStatus: 'Eligible' | 'Conditionally Eligible' | 'Not Eligible'
  eligibilityNotes: string
  boardDecision: 'Approved' | 'Deferred' | 'Pending' | null
  decisionRemarks: string
}

export const CBE_MEETINGS: CBEMeeting[] = [
  {
    id: 'cbe-001',
    cbeNo: 'CBE-2025-01',
    meetingDate: '2025-12-15',
    coverage: {
      semesterIds: ['sem-2025-fall', 'sem-2025-summer'],
      programs: ['CSE', 'EEE', 'BBA', 'LLB']
    },
    status: 'Scheduled',
    venue: 'Senate Hall, Main Campus',
    chairman: 'Prof. Dr. Abdul Mannan',
    members: [
      'Prof. Dr. Nasreen Akhter',
      'Prof. Dr. Kamal Ahmed',
      'Dr. Rashid Hasan',
      'Ms. Farzana Rahman'
    ],
    remarks: 'Regular CBE for Fall 2025 semester',
    agendaItems: [
      'Review of student eligibility',
      'Approval of degree awards',
      'Discussion on academic performance',
      'Special cases review'
    ],
    eligibleStudentsCount: 142,
    approvedCount: 0,
    deferredCount: 0
  },
  {
    id: 'cbe-002',
    cbeNo: 'CBE-2025-02',
    meetingDate: '2025-08-20',
    coverage: {
      semesterIds: ['sem-2025-summer', 'sem-2025-spring'],
      programs: ['CSE', 'BBA', 'LLB']
    },
    status: 'Completed',
    venue: 'Conference Room A',
    chairman: 'Prof. Dr. Nazmul Karim',
    members: [
      'Prof. Dr. Shahida Begum',
      'Dr. Tanvir Hossain',
      'Ms. Nusrat Jahan'
    ],
    remarks: 'Summer 2025 CBE completed successfully',
    agendaItems: [
      'Student degree approvals',
      'Grade disputes resolution',
      'Merit list finalization'
    ],
    eligibleStudentsCount: 89,
    approvedCount: 85,
    deferredCount: 4
  },
  {
    id: 'cbe-003',
    cbeNo: 'CBE-2024-03',
    meetingDate: '2024-12-18',
    coverage: {
      semesterIds: ['sem-2024-fall'],
      programs: ['CSE', 'EEE', 'BBA', 'LLB', 'ENG']
    },
    status: 'Archived',
    venue: 'Senate Hall, Main Campus',
    chairman: 'Prof. Dr. Abdul Mannan',
    members: [
      'Prof. Dr. Nasreen Akhter',
      'Dr. Ahmed Karim',
      'Ms. Tasnim Rahman'
    ],
    remarks: 'Fall 2024 CBE - Archived',
    agendaItems: [
      'Degree approvals',
      'Merit scholarship awards',
      'Gold medal nominations'
    ],
    eligibleStudentsCount: 156,
    approvedCount: 152,
    deferredCount: 4
  }
]

export const CBE_CANDIDATES: CBECandidate[] = [
  {
    id: 'cand-001',
    cbeNo: 'CBE-2025-01',
    studentId: 'STU-2021-0001',
    studentName: 'Tahmina Akter',
    programCode: 'LLB',
    batch: 'Spring 2021',
    totalCreditsEarned: 132,
    requiredCredits: 132,
    cgpa: 3.82,
    eligibilityStatus: 'Eligible',
    eligibilityNotes: 'All requirements met. Recommended for degree award.',
    boardDecision: null,
    decisionRemarks: ''
  },
  {
    id: 'cand-002',
    cbeNo: 'CBE-2025-01',
    studentId: 'STU-2021-0045',
    studentName: 'Rahim Uddin',
    programCode: 'CSE',
    batch: 'Spring 2021',
    totalCreditsEarned: 144,
    requiredCredits: 144,
    cgpa: 3.65,
    eligibilityStatus: 'Eligible',
    eligibilityNotes: 'Completed all requirements successfully.',
    boardDecision: null,
    decisionRemarks: ''
  },
  {
    id: 'cand-003',
    cbeNo: 'CBE-2025-01',
    studentId: 'STU-2021-0078',
    studentName: 'Sabina Rahman',
    programCode: 'BBA',
    batch: 'Spring 2021',
    totalCreditsEarned: 118,
    requiredCredits: 120,
    cgpa: 3.45,
    eligibilityStatus: 'Conditionally Eligible',
    eligibilityNotes: 'Missing 2 credits. Conditional approval pending course completion.',
    boardDecision: null,
    decisionRemarks: ''
  },
  {
    id: 'cand-004',
    cbeNo: 'CBE-2025-01',
    studentId: 'STU-2021-0092',
    studentName: 'Kamal Ahmed',
    programCode: 'EEE',
    batch: 'Spring 2021',
    totalCreditsEarned: 138,
    requiredCredits: 144,
    cgpa: 2.85,
    eligibilityStatus: 'Not Eligible',
    eligibilityNotes: 'Incomplete credits. 6 credits remaining.',
    boardDecision: null,
    decisionRemarks: ''
  },
  {
    id: 'cand-005',
    cbeNo: 'CBE-2025-02',
    studentId: 'STU-2021-0010',
    studentName: 'Nusrat Jahan',
    programCode: 'CSE',
    batch: 'Spring 2021',
    totalCreditsEarned: 144,
    requiredCredits: 144,
    cgpa: 3.92,
    eligibilityStatus: 'Eligible',
    eligibilityNotes: 'Excellent academic record. Gold medal candidate.',
    boardDecision: 'Approved',
    decisionRemarks: 'Approved for degree award. Recommended for Gold Medal.'
  }
]

export const getCBEByNo = (cbeNo: string) =>
  CBE_MEETINGS.find(c => c.cbeNo === cbeNo)

export const getCandidatesByCBE = (cbeNo: string) =>
  CBE_CANDIDATES.filter(c => c.cbeNo === cbeNo)

export const getEligibleCandidates = (cbeNo: string) =>
  CBE_CANDIDATES.filter(c => c.cbeNo === cbeNo && c.eligibilityStatus === 'Eligible')
