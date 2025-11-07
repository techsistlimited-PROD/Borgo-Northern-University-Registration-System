export interface CBEMeeting {
  id: string
  number: string
  title: string
  meetingDate: string
  coveredSemFrom: string
  coveredSemTo: string
  remarks: string
  status: 'Draft' | 'Published' | 'Closed'
  createdBy: string
  createdDate: string
  publishedDate: string | null
  candidatesCount: number
}

export interface CBECandidate {
  id: string
  meetingId: string
  studentId: string
  studentName: string
  program: string
  admitYear: string
  completedCredits: number
  cgpa: number
  decision: 'Eligible' | 'Not Eligible' | 'Withheld' | 'Pending'
  notes: string
  decidedBy: string | null
  decidedDate: string | null
  auditLog: Array<{
    action: string
    by: string
    date: string
    remarks: string
  }>
}

export const CBE_MEETINGS: CBEMeeting[] = [
  {
    id: 'cbe-m-001',
    number: 'CBE/2025/01',
    title: '1st CBE Meeting - Fall 2025',
    meetingDate: '2025-12-15',
    coveredSemFrom: 'Fall 2024',
    coveredSemTo: 'Fall 2025',
    remarks: 'Regular CBE meeting for Fall 2025 graduates',
    status: 'Published',
    createdBy: 'Dr. Rahman',
    createdDate: '2025-11-01',
    publishedDate: '2025-11-20',
    candidatesCount: 12
  },
  {
    id: 'cbe-m-002',
    number: 'CBE/2025/02',
    title: '2nd CBE Meeting - Summer 2025',
    meetingDate: '2025-08-20',
    coveredSemFrom: 'Spring 2024',
    coveredSemTo: 'Summer 2025',
    remarks: 'Summer semester CBE clearance',
    status: 'Closed',
    createdBy: 'Prof. Hasan',
    createdDate: '2025-07-10',
    publishedDate: '2025-07-25',
    candidatesCount: 8
  },
  {
    id: 'cbe-m-003',
    number: 'CBE/2026/01',
    title: 'CBE Meeting - Spring 2026 (Draft)',
    meetingDate: '2026-05-10',
    coveredSemFrom: 'Fall 2025',
    coveredSemTo: 'Spring 2026',
    remarks: 'Draft meeting for Spring 2026 candidates',
    status: 'Draft',
    createdBy: 'Dr. Ahmed',
    createdDate: '2025-11-25',
    publishedDate: null,
    candidatesCount: 5
  },
  {
    id: 'cbe-m-004',
    number: 'CBE/2024/03',
    title: '3rd CBE Meeting - Fall 2024',
    meetingDate: '2024-12-10',
    coveredSemFrom: 'Spring 2024',
    coveredSemTo: 'Fall 2024',
    remarks: 'Year-end clearance for 2024',
    status: 'Closed',
    createdBy: 'Prof. Karim',
    createdDate: '2024-10-15',
    publishedDate: '2024-11-05',
    candidatesCount: 15
  }
]

export const CBE_CANDIDATES: CBECandidate[] = [
  {
    id: 'cbe-c-001',
    meetingId: 'cbe-m-001',
    studentId: 'STU-2021-0012',
    studentName: 'Mahfuz Rahman',
    program: 'CSE',
    admitYear: '2021',
    completedCredits: 120,
    cgpa: 3.45,
    decision: 'Eligible',
    notes: 'All requirements met. Cleared for convocation.',
    decidedBy: 'Dr. Rahman',
    decidedDate: '2025-11-22',
    auditLog: [
      {
        action: 'Submitted',
        by: 'System',
        date: '2025-11-15',
        remarks: 'Auto-added from eligibility list'
      },
      {
        action: 'Approved',
        by: 'Dr. Rahman',
        date: '2025-11-22',
        remarks: 'Verified credits and CGPA'
      }
    ]
  },
  {
    id: 'cbe-c-002',
    meetingId: 'cbe-m-001',
    studentId: 'STU-2021-0034',
    studentName: 'Sadia Akter',
    program: 'BBA',
    admitYear: '2021',
    completedCredits: 118,
    cgpa: 3.28,
    decision: 'Withheld',
    notes: 'Active disciplinary block. Pending committee decision.',
    decidedBy: 'Prof. Hasan',
    decidedDate: '2025-11-23',
    auditLog: [
      {
        action: 'Submitted',
        by: 'System',
        date: '2025-11-15',
        remarks: 'Auto-added from eligibility list'
      },
      {
        action: 'Withheld',
        by: 'Prof. Hasan',
        date: '2025-11-23',
        remarks: 'Disciplinary action active'
      }
    ]
  },
  {
    id: 'cbe-c-003',
    meetingId: 'cbe-m-001',
    studentId: 'STU-2021-0045',
    studentName: 'Rahim Uddin',
    program: 'EEE',
    admitYear: '2021',
    completedCredits: 125,
    cgpa: 3.67,
    decision: 'Eligible',
    notes: 'Excellent academic record. Cleared.',
    decidedBy: 'Dr. Rahman',
    decidedDate: '2025-11-22',
    auditLog: [
      {
        action: 'Submitted',
        by: 'System',
        date: '2025-11-15',
        remarks: 'Auto-added from eligibility list'
      },
      {
        action: 'Approved',
        by: 'Dr. Rahman',
        date: '2025-11-22',
        remarks: 'All requirements verified'
      }
    ]
  },
  {
    id: 'cbe-c-004',
    meetingId: 'cbe-m-001',
    studentId: 'STU-2021-0067',
    studentName: 'Nusrat Jahan',
    program: 'LLB',
    admitYear: '2021',
    completedCredits: 112,
    cgpa: 3.15,
    decision: 'Not Eligible',
    notes: 'Incomplete credits (112/120). Deferred to next meeting.',
    decidedBy: 'Prof. Karim',
    decidedDate: '2025-11-24',
    auditLog: [
      {
        action: 'Submitted',
        by: 'Academic Office',
        date: '2025-11-16',
        remarks: 'Manual submission'
      },
      {
        action: 'Rejected',
        by: 'Prof. Karim',
        date: '2025-11-24',
        remarks: 'Credits incomplete'
      }
    ]
  },
  {
    id: 'cbe-c-005',
    meetingId: 'cbe-m-001',
    studentId: 'STU-2021-0089',
    studentName: 'Farhan Ahmed',
    program: 'CSE',
    admitYear: '2021',
    completedCredits: 120,
    cgpa: 3.52,
    decision: 'Pending',
    notes: 'Awaiting final verification from Accounts.',
    decidedBy: null,
    decidedDate: null,
    auditLog: [
      {
        action: 'Submitted',
        by: 'System',
        date: '2025-11-15',
        remarks: 'Auto-added from eligibility list'
      }
    ]
  },
  {
    id: 'cbe-c-006',
    meetingId: 'cbe-m-002',
    studentId: 'STU-2021-0101',
    studentName: 'Tahmid Hassan',
    program: 'MBA',
    admitYear: '2021',
    completedCredits: 48,
    cgpa: 3.72,
    decision: 'Eligible',
    notes: 'MBA program completed. Cleared.',
    decidedBy: 'Dr. Rahman',
    decidedDate: '2025-07-28',
    auditLog: [
      {
        action: 'Submitted',
        by: 'System',
        date: '2025-07-20',
        remarks: 'Auto-added'
      },
      {
        action: 'Approved',
        by: 'Dr. Rahman',
        date: '2025-07-28',
        remarks: 'All MBA requirements met'
      }
    ]
  },
  {
    id: 'cbe-c-007',
    meetingId: 'cbe-m-003',
    studentId: 'STU-2022-0015',
    studentName: 'Amina Khatun',
    program: 'English',
    admitYear: '2022',
    completedCredits: 120,
    cgpa: 3.41,
    decision: 'Pending',
    notes: 'Draft candidate for review.',
    decidedBy: null,
    decidedDate: null,
    auditLog: [
      {
        action: 'Submitted',
        by: 'Academic Office',
        date: '2025-11-26',
        remarks: 'Draft entry'
      }
    ]
  },
  {
    id: 'cbe-c-008',
    meetingId: 'cbe-m-001',
    studentId: 'STU-2021-0123',
    studentName: 'Kamal Hossain',
    program: 'Physics',
    admitYear: '2021',
    completedCredits: 120,
    cgpa: 3.33,
    decision: 'Eligible',
    notes: 'All requirements satisfied.',
    decidedBy: 'Dr. Ahmed',
    decidedDate: '2025-11-22',
    auditLog: [
      {
        action: 'Submitted',
        by: 'System',
        date: '2025-11-15',
        remarks: 'Auto-added'
      },
      {
        action: 'Approved',
        by: 'Dr. Ahmed',
        date: '2025-11-22',
        remarks: 'Verified'
      }
    ]
  }
]

export const getCandidatesByMeeting = (meetingId: string) =>
  CBE_CANDIDATES.filter(c => c.meetingId === meetingId)

export const getMeetingById = (id: string) =>
  CBE_MEETINGS.find(m => m.id === id)
