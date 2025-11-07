export interface ResultBlock {
  id: string
  studentId: string
  studentName: string
  programCode: string
  semesterId: string
  reason: 'Finance Dues' | 'TER Not Submitted' | 'Disciplinary Action' | 'Incomplete Documents' | 'Custom'
  customReason?: string
  startDate: string
  endDate: string | null
  status: 'Active' | 'Expired' | 'Removed'
  blockedBy: string
  blockDate: string
  removedBy: string | null
  removeDate: string | null
  notes: string
  auditLog: Array<{
    action: string
    by: string
    date: string
    remarks: string
  }>
}

export interface BlockSettings {
  autoBlockOnDues: boolean
  autoBlockOnTER: boolean
  manualOnlyMode: boolean
  duesThreshold: number
  gracePeriodDays: number
  notifyStudent: boolean
  notifyGuardian: boolean
  allowExtension: boolean
  maxExtensionDays: number
  blockColors: {
    active: string
    expired: string
    removed: string
  }
}

export const RESULT_BLOCKS: ResultBlock[] = [
  {
    id: 'block-001',
    studentId: 'STU-2023-0010',
    studentName: 'Mahfuz Rahman',
    programCode: 'CSE',
    semesterId: 'sem-2025-fall',
    reason: 'Finance Dues',
    startDate: '2025-11-01',
    endDate: null,
    status: 'Active',
    blockedBy: 'System Auto-Block',
    blockDate: '2025-11-01',
    removedBy: null,
    removeDate: null,
    notes: 'Outstanding dues: ৳45,000. Result blocked until payment.',
    auditLog: [
      {
        action: 'Auto-Blocked',
        by: 'System',
        date: '2025-11-01 00:05',
        remarks: 'Finance dues exceeded threshold'
      }
    ]
  },
  {
    id: 'block-002',
    studentId: 'STU-2024-0201',
    studentName: 'Sadia Akter',
    programCode: 'BBA',
    semesterId: 'sem-2025-fall',
    reason: 'TER Not Submitted',
    startDate: '2025-11-05',
    endDate: null,
    status: 'Active',
    blockedBy: 'Dr. Hasan',
    blockDate: '2025-11-05',
    removedBy: null,
    removeDate: null,
    notes: 'TER submission deadline passed. Result blocked until TER submitted.',
    auditLog: [
      {
        action: 'Blocked',
        by: 'Dr. Hasan',
        date: '2025-11-05 10:30',
        remarks: 'TER deadline expired'
      }
    ]
  },
  {
    id: 'block-003',
    studentId: 'STU-2023-0025',
    studentName: 'Rahim Uddin',
    programCode: 'EEE',
    semesterId: 'sem-2025-fall',
    reason: 'Disciplinary Action',
    startDate: '2025-10-20',
    endDate: '2025-12-31',
    status: 'Active',
    blockedBy: 'Prof. Karim',
    blockDate: '2025-10-20',
    removedBy: null,
    removeDate: null,
    notes: 'Disciplinary committee decision. Block until semester end.',
    auditLog: [
      {
        action: 'Blocked',
        by: 'Prof. Karim',
        date: '2025-10-20 14:15',
        remarks: 'Disciplinary committee verdict'
      }
    ]
  },
  {
    id: 'block-004',
    studentId: 'STU-2024-0150',
    studentName: 'Nusrat Jahan',
    programCode: 'LLB',
    semesterId: 'sem-2025-summer',
    reason: 'Finance Dues',
    startDate: '2025-08-01',
    endDate: '2025-08-15',
    status: 'Removed',
    blockedBy: 'System Auto-Block',
    blockDate: '2025-08-01',
    removedBy: 'Finance Office',
    removeDate: '2025-08-15',
    notes: 'Dues cleared. Block removed.',
    auditLog: [
      {
        action: 'Auto-Blocked',
        by: 'System',
        date: '2025-08-01 00:05',
        remarks: 'Finance dues detected'
      },
      {
        action: 'Unblocked',
        by: 'Finance Office',
        date: '2025-08-15 11:20',
        remarks: 'Payment received and verified'
      }
    ]
  },
  {
    id: 'block-005',
    studentId: 'STU-2023-0088',
    studentName: 'Farhan Ahmed',
    programCode: 'CSE',
    semesterId: 'sem-2025-fall',
    reason: 'Custom',
    customReason: 'Exam malpractice investigation pending',
    startDate: '2025-11-10',
    endDate: null,
    status: 'Active',
    blockedBy: 'COE Office',
    blockDate: '2025-11-10',
    removedBy: null,
    removeDate: null,
    notes: 'Result withheld pending investigation outcome.',
    auditLog: [
      {
        action: 'Blocked',
        by: 'COE Office',
        date: '2025-11-10 09:00',
        remarks: 'Investigation initiated by exam committee'
      }
    ]
  }
]

export const BLOCK_SETTINGS: BlockSettings = {
  autoBlockOnDues: true,
  autoBlockOnTER: true,
  manualOnlyMode: false,
  duesThreshold: 5000,
  gracePeriodDays: 7,
  notifyStudent: true,
  notifyGuardian: true,
  allowExtension: true,
  maxExtensionDays: 30,
  blockColors: {
    active: '#ef4444',
    expired: '#6b7280',
    removed: '#10b981'
  }
}

export const getActiveBlocks = () => RESULT_BLOCKS.filter(b => b.status === 'Active')

export const getBlocksByStudent = (studentId: string) =>
  RESULT_BLOCKS.filter(b => b.studentId === studentId)

export const getBlocksBySemester = (semesterId: string) =>
  RESULT_BLOCKS.filter(b => b.semesterId === semesterId)
