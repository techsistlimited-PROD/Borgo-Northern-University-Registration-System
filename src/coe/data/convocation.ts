export interface ConvocationEvent {
  id: string
  convocationNo: string
  title: string
  coveredSemFrom: string
  coveredSemTo: string
  cbeFrom: string
  cbeTo: string
  regStart: string
  regEnd: string
  eventDate: string
  isHeldByMark: boolean
  status: 'Draft' | 'Open' | 'Closed' | 'Completed'
  venue: string
  totalRegistrations: number
  approvedRegistrations: number
}

export interface ConvocationRegistration {
  id: string
  eventId: string
  studentId: string
  studentName: string
  program: string
  completedCredits: number
  cgpa: number
  feeStatus: 'Paid' | 'Unpaid'
  regStatus: 'Requested' | 'Approved' | 'Rejected'
  regDate: string
  approvedBy: string | null
  approvedDate: string | null
  notes: string
  auditLog: Array<{
    action: string
    by: string
    date: string
    remarks: string
  }>
}

export const CONVOCATION_EVENTS: ConvocationEvent[] = [
  {
    id: 'conv-e-001',
    convocationNo: '25th',
    title: '25th Convocation',
    coveredSemFrom: 'Spring 2024',
    coveredSemTo: 'Fall 2025',
    cbeFrom: 'CBE/2024/01',
    cbeTo: 'CBE/2025/02',
    regStart: '2025-11-01',
    regEnd: '2025-12-15',
    eventDate: '2026-01-20',
    isHeldByMark: true,
    status: 'Open',
    venue: 'Main Auditorium',
    totalRegistrations: 8,
    approvedRegistrations: 5
  },
  {
    id: 'conv-e-002',
    convocationNo: '24th',
    title: '24th Convocation',
    coveredSemFrom: 'Fall 2023',
    coveredSemTo: 'Spring 2024',
    cbeFrom: 'CBE/2023/02',
    cbeTo: 'CBE/2024/01',
    regStart: '2024-10-01',
    regEnd: '2024-11-30',
    eventDate: '2024-12-18',
    isHeldByMark: true,
    status: 'Completed',
    venue: 'Main Auditorium',
    totalRegistrations: 15,
    approvedRegistrations: 15
  },
  {
    id: 'conv-e-003',
    convocationNo: '26th',
    title: '26th Convocation (Planned)',
    coveredSemFrom: 'Spring 2026',
    coveredSemTo: 'Fall 2026',
    cbeFrom: 'CBE/2026/01',
    cbeTo: 'CBE/2026/03',
    regStart: '2026-11-01',
    regEnd: '2026-12-20',
    eventDate: '2027-01-25',
    isHeldByMark: false,
    status: 'Draft',
    venue: 'TBD',
    totalRegistrations: 0,
    approvedRegistrations: 0
  }
]

export const CONVOCATION_REGISTRATIONS: ConvocationRegistration[] = [
  {
    id: 'conv-r-001',
    eventId: 'conv-e-001',
    studentId: 'STU-2021-0012',
    studentName: 'Mahfuz Rahman',
    program: 'CSE',
    completedCredits: 120,
    cgpa: 3.45,
    feeStatus: 'Paid',
    regStatus: 'Approved',
    regDate: '2025-11-05',
    approvedBy: 'COE Office',
    approvedDate: '2025-11-10',
    notes: 'Cleared by CBE. Fee paid.',
    auditLog: [
      {
        action: 'Registered',
        by: 'Student Portal',
        date: '2025-11-05',
        remarks: 'Online registration'
      },
      {
        action: 'Fee Paid',
        by: 'Finance System',
        date: '2025-11-08',
        remarks: 'Convocation fee received'
      },
      {
        action: 'Approved',
        by: 'COE Office',
        date: '2025-11-10',
        remarks: 'Verified eligibility'
      }
    ]
  },
  {
    id: 'conv-r-002',
    eventId: 'conv-e-001',
    studentId: 'STU-2021-0034',
    studentName: 'Sadia Akter',
    program: 'BBA',
    completedCredits: 118,
    cgpa: 3.28,
    feeStatus: 'Unpaid',
    regStatus: 'Requested',
    regDate: '2025-11-12',
    approvedBy: null,
    approvedDate: null,
    notes: 'Awaiting fee payment.',
    auditLog: [
      {
        action: 'Registered',
        by: 'Student Portal',
        date: '2025-11-12',
        remarks: 'Online registration'
      }
    ]
  },
  {
    id: 'conv-r-003',
    eventId: 'conv-e-001',
    studentId: 'STU-2021-0045',
    studentName: 'Rahim Uddin',
    program: 'EEE',
    completedCredits: 125,
    cgpa: 3.67,
    feeStatus: 'Paid',
    regStatus: 'Approved',
    regDate: '2025-11-03',
    approvedBy: 'COE Office',
    approvedDate: '2025-11-09',
    notes: 'Early registration. Approved.',
    auditLog: [
      {
        action: 'Registered',
        by: 'Student Portal',
        date: '2025-11-03',
        remarks: 'Online registration'
      },
      {
        action: 'Fee Paid',
        by: 'Finance System',
        date: '2025-11-07',
        remarks: 'Payment confirmed'
      },
      {
        action: 'Approved',
        by: 'COE Office',
        date: '2025-11-09',
        remarks: 'Approved'
      }
    ]
  },
  {
    id: 'conv-r-004',
    eventId: 'conv-e-001',
    studentId: 'STU-2021-0067',
    studentName: 'Nusrat Jahan',
    program: 'LLB',
    completedCredits: 112,
    cgpa: 3.15,
    feeStatus: 'Paid',
    regStatus: 'Rejected',
    regDate: '2025-11-15',
    approvedBy: 'COE Office',
    approvedDate: '2025-11-18',
    notes: 'Not cleared by CBE. Incomplete credits.',
    auditLog: [
      {
        action: 'Registered',
        by: 'Student Portal',
        date: '2025-11-15',
        remarks: 'Online registration'
      },
      {
        action: 'Fee Paid',
        by: 'Finance System',
        date: '2025-11-16',
        remarks: 'Payment received'
      },
      {
        action: 'Rejected',
        by: 'COE Office',
        date: '2025-11-18',
        remarks: 'CBE clearance missing'
      }
    ]
  },
  {
    id: 'conv-r-005',
    eventId: 'conv-e-001',
    studentId: 'STU-2021-0089',
    studentName: 'Farhan Ahmed',
    program: 'CSE',
    completedCredits: 120,
    cgpa: 3.52,
    feeStatus: 'Paid',
    regStatus: 'Approved',
    regDate: '2025-11-06',
    approvedBy: 'COE Office',
    approvedDate: '2025-11-11',
    notes: 'All requirements met.',
    auditLog: [
      {
        action: 'Registered',
        by: 'Student Portal',
        date: '2025-11-06',
        remarks: 'Online registration'
      },
      {
        action: 'Fee Paid',
        by: 'Finance System',
        date: '2025-11-08',
        remarks: 'Payment confirmed'
      },
      {
        action: 'Approved',
        by: 'COE Office',
        date: '2025-11-11',
        remarks: 'Approved'
      }
    ]
  },
  {
    id: 'conv-r-006',
    eventId: 'conv-e-001',
    studentId: 'STU-2021-0101',
    studentName: 'Tahmid Hassan',
    program: 'MBA',
    completedCredits: 48,
    cgpa: 3.72,
    feeStatus: 'Unpaid',
    regStatus: 'Requested',
    regDate: '2025-11-20',
    approvedBy: null,
    approvedDate: null,
    notes: 'Pending fee payment.',
    auditLog: [
      {
        action: 'Registered',
        by: 'Student Portal',
        date: '2025-11-20',
        remarks: 'Online registration'
      }
    ]
  },
  {
    id: 'conv-r-007',
    eventId: 'conv-e-001',
    studentId: 'STU-2022-0015',
    studentName: 'Amina Khatun',
    program: 'English',
    completedCredits: 120,
    cgpa: 3.41,
    feeStatus: 'Paid',
    regStatus: 'Approved',
    regDate: '2025-11-04',
    approvedBy: 'COE Office',
    approvedDate: '2025-11-09',
    notes: 'Approved for convocation.',
    auditLog: [
      {
        action: 'Registered',
        by: 'Student Portal',
        date: '2025-11-04',
        remarks: 'Online registration'
      },
      {
        action: 'Fee Paid',
        by: 'Finance System',
        date: '2025-11-07',
        remarks: 'Payment confirmed'
      },
      {
        action: 'Approved',
        by: 'COE Office',
        date: '2025-11-09',
        remarks: 'Approved'
      }
    ]
  },
  {
    id: 'conv-r-008',
    eventId: 'conv-e-001',
    studentId: 'STU-2021-0123',
    studentName: 'Kamal Hossain',
    program: 'Physics',
    completedCredits: 120,
    cgpa: 3.33,
    feeStatus: 'Unpaid',
    regStatus: 'Requested',
    regDate: '2025-11-22',
    approvedBy: null,
    approvedDate: null,
    notes: 'Registration pending fee.',
    auditLog: [
      {
        action: 'Registered',
        by: 'Student Portal',
        date: '2025-11-22',
        remarks: 'Online registration'
      }
    ]
  }
]

export const getRegistrationsByEvent = (eventId: string) =>
  CONVOCATION_REGISTRATIONS.filter(r => r.eventId === eventId)

export const getEventById = (id: string) =>
  CONVOCATION_EVENTS.find(e => e.id === id)
