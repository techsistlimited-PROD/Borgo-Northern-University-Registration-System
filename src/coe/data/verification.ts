export interface VerificationProfile {
  id: string
  studentId: string
  name: string
  program: string
  admitYear: string
  completedCredits: number
  cgpa: number
  token: string
  qr: string
  status: 'Verified' | 'Pending' | 'Rejected'
  remarks: string
  verifiedBy: string | null
  verifiedDate: string | null
  history: Array<{
    action: string
    by: string
    date: string
    remarks: string
  }>
}

export const VERIFICATION_PROFILES: VerificationProfile[] = [
  {
    id: 'ver-001',
    studentId: 'STU-2021-0012',
    name: 'Mahfuz Rahman',
    program: 'CSE',
    admitYear: '2021',
    completedCredits: 120,
    cgpa: 3.45,
    token: 'VER-2021-CSE-0012',
    qr: 'QR-VER-2021-CSE-0012-ABC123',
    status: 'Verified',
    remarks: 'All documents verified. Degree awarded.',
    verifiedBy: 'COE Office',
    verifiedDate: '2025-11-20',
    history: [
      {
        action: 'Requested',
        by: 'Student Portal',
        date: '2025-11-10',
        remarks: 'Verification requested by student'
      },
      {
        action: 'Verified',
        by: 'COE Office',
        date: '2025-11-20',
        remarks: 'Documents verified and approved'
      }
    ]
  },
  {
    id: 'ver-002',
    studentId: 'STU-2021-0034',
    name: 'Sadia Akter',
    program: 'BBA',
    admitYear: '2021',
    completedCredits: 118,
    cgpa: 3.28,
    token: 'VER-2021-BBA-0034',
    qr: 'QR-VER-2021-BBA-0034-XYZ456',
    status: 'Pending',
    remarks: 'Awaiting final transcript.',
    verifiedBy: null,
    verifiedDate: null,
    history: [
      {
        action: 'Requested',
        by: 'Student Portal',
        date: '2025-11-15',
        remarks: 'Verification requested'
      }
    ]
  },
  {
    id: 'ver-003',
    studentId: 'STU-2021-0045',
    name: 'Rahim Uddin',
    program: 'EEE',
    admitYear: '2021',
    completedCredits: 125,
    cgpa: 3.67,
    token: 'VER-2021-EEE-0045',
    qr: 'QR-VER-2021-EEE-0045-DEF789',
    status: 'Verified',
    remarks: 'Excellent record. Verified.',
    verifiedBy: 'COE Office',
    verifiedDate: '2025-11-18',
    history: [
      {
        action: 'Requested',
        by: 'Employer',
        date: '2025-11-12',
        remarks: 'Requested by prospective employer'
      },
      {
        action: 'Verified',
        by: 'COE Office',
        date: '2025-11-18',
        remarks: 'All credentials verified'
      }
    ]
  },
  {
    id: 'ver-004',
    studentId: 'STU-2021-0067',
    name: 'Nusrat Jahan',
    program: 'LLB',
    admitYear: '2021',
    completedCredits: 112,
    cgpa: 3.15,
    token: 'VER-2021-LLB-0067',
    qr: 'QR-VER-2021-LLB-0067-GHI012',
    status: 'Rejected',
    remarks: 'Incomplete degree requirements.',
    verifiedBy: 'COE Office',
    verifiedDate: '2025-11-19',
    history: [
      {
        action: 'Requested',
        by: 'Student Portal',
        date: '2025-11-14',
        remarks: 'Verification requested'
      },
      {
        action: 'Rejected',
        by: 'COE Office',
        date: '2025-11-19',
        remarks: 'Credits incomplete (112/120)'
      }
    ]
  },
  {
    id: 'ver-005',
    studentId: 'STU-2021-0089',
    name: 'Farhan Ahmed',
    program: 'CSE',
    admitYear: '2021',
    completedCredits: 120,
    cgpa: 3.52,
    token: 'VER-2021-CSE-0089',
    qr: 'QR-VER-2021-CSE-0089-JKL345',
    status: 'Verified',
    remarks: 'Degree verified successfully.',
    verifiedBy: 'COE Office',
    verifiedDate: '2025-11-21',
    history: [
      {
        action: 'Requested',
        by: 'University Abroad',
        date: '2025-11-16',
        remarks: 'Requested for higher studies abroad'
      },
      {
        action: 'Verified',
        by: 'COE Office',
        date: '2025-11-21',
        remarks: 'Verified and letter issued'
      }
    ]
  },
  {
    id: 'ver-006',
    studentId: 'STU-2020-0145',
    name: 'Tahmid Hassan',
    program: 'MBA',
    admitYear: '2020',
    completedCredits: 48,
    cgpa: 3.72,
    token: 'VER-2020-MBA-0145',
    qr: 'QR-VER-2020-MBA-0145-MNO678',
    status: 'Verified',
    remarks: 'MBA degree verified.',
    verifiedBy: 'COE Office',
    verifiedDate: '2025-10-15',
    history: [
      {
        action: 'Requested',
        by: 'Employer',
        date: '2025-10-10',
        remarks: 'Requested by HR department'
      },
      {
        action: 'Verified',
        by: 'COE Office',
        date: '2025-10-15',
        remarks: 'Verified MBA credentials'
      }
    ]
  },
  {
    id: 'ver-007',
    studentId: 'STU-2022-0015',
    name: 'Amina Khatun',
    program: 'English',
    admitYear: '2022',
    completedCredits: 120,
    cgpa: 3.41,
    token: 'VER-2022-ENG-0015',
    qr: 'QR-VER-2022-ENG-0015-PQR901',
    status: 'Pending',
    remarks: 'Under review.',
    verifiedBy: null,
    verifiedDate: null,
    history: [
      {
        action: 'Requested',
        by: 'Student Portal',
        date: '2025-11-23',
        remarks: 'Verification requested'
      }
    ]
  },
  {
    id: 'ver-008',
    studentId: 'STU-2021-0123',
    name: 'Kamal Hossain',
    program: 'Physics',
    admitYear: '2021',
    completedCredits: 120,
    cgpa: 3.33,
    token: 'VER-2021-PHY-0123',
    qr: 'QR-VER-2021-PHY-0123-STU234',
    status: 'Verified',
    remarks: 'Physics degree verified.',
    verifiedBy: 'COE Office',
    verifiedDate: '2025-11-22',
    history: [
      {
        action: 'Requested',
        by: 'Research Institute',
        date: '2025-11-18',
        remarks: 'Requested for research position'
      },
      {
        action: 'Verified',
        by: 'COE Office',
        date: '2025-11-22',
        remarks: 'Credentials verified'
      }
    ]
  }
]

export const getProfileByStudentId = (studentId: string) =>
  VERIFICATION_PROFILES.find(p => p.studentId === studentId)

export const getProfileByToken = (token: string) =>
  VERIFICATION_PROFILES.find(p => p.token === token)

export const getProfilesByStatus = (status: string) =>
  VERIFICATION_PROFILES.filter(p => p.status === status)
