export type ActionType = 
  | 'STUDENT_INFO_UPDATE'
  | 'PROGRAM_CHANGE'
  | 'CAMPUS_CHANGE'
  | 'ADMISSION_CANCEL'
  | 'READMISSION'

export type ActionStatus = 'Requested' | 'Under Review' | 'Approved' | 'Rejected' | 'Applied'

export interface RequestedChange {
  from?: string
  to?: string
  effective?: string
  reason?: string
  lastActive?: string
  returning?: string
  phone?: string
  email?: string
  presentAddress?: string
}

export interface AuditEntry {
  action: string
  by: string
  date: string
  remarks: string
}

export interface AdmissionAction {
  id: string
  studentId: string
  studentName: string
  currentProgram: string
  currentCampus: string
  currentBatch: string
  requestedChange: RequestedChange
  actionType: ActionType
  status: ActionStatus
  requestedAt: string
  updatedAt: string
  remarks: string
  attachments: string[]
  audit: AuditEntry[]
}

export const ADMISSION_ACTIONS: AdmissionAction[] = [
  {
    id: 'aa-001',
    studentId: 'STU-2024-0101',
    studentName: 'Farzana Kabir',
    currentProgram: 'BBA',
    currentCampus: 'Banani',
    currentBatch: 'Spring 2024',
    requestedChange: {
      from: 'BBA',
      to: 'MBA',
      effective: 'Spring 2026',
      reason: 'Graduate progression after completing BBA requirements'
    },
    actionType: 'PROGRAM_CHANGE',
    status: 'Approved',
    requestedAt: '2025-11-10',
    updatedAt: '2025-11-15',
    remarks: 'Approved by Academic Committee',
    attachments: ['transcript.pdf', 'recommendation.pdf'],
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-10', remarks: 'Initial request submitted' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-11-12', remarks: 'Forwarded to Academic Committee' },
      { action: 'Approved', by: 'Academic Committee', date: '2025-11-15', remarks: 'Meets all requirements' }
    ]
  },
  {
    id: 'aa-002',
    studentId: 'STU-2023-0005',
    studentName: 'Sabrina Akter',
    currentProgram: 'CSE',
    currentCampus: 'Permanent',
    currentBatch: 'Spring 2023',
    requestedChange: {
      from: 'Permanent',
      to: 'Banani',
      effective: 'Fall 2025'
    },
    actionType: 'CAMPUS_CHANGE',
    status: 'Under Review',
    requestedAt: '2025-11-18',
    updatedAt: '2025-11-18',
    remarks: 'Under verification by Registrar',
    attachments: ['address_proof.pdf'],
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-18', remarks: 'Campus transfer request' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-11-18', remarks: 'Checking availability' }
    ]
  },
  {
    id: 'aa-003',
    studentId: 'STU-2023-0010',
    studentName: 'Mahfuz Rahman',
    currentProgram: 'CSE',
    currentCampus: 'Permanent',
    currentBatch: 'Spring 2023',
    requestedChange: {
      phone: '01712345678',
      email: 'mahfuz.new@example.com',
      presentAddress: 'House 45, Road 12, Dhanmondi, Dhaka-1209'
    },
    actionType: 'STUDENT_INFO_UPDATE',
    status: 'Requested',
    requestedAt: '2025-11-19',
    updatedAt: '2025-11-19',
    remarks: 'Blocked by Finance Dues. Cannot process until cleared.',
    attachments: [],
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-19', remarks: 'Info update request' }
    ]
  },
  {
    id: 'aa-004',
    studentId: 'STU-2024-0088',
    studentName: 'Kamal Hossain',
    currentProgram: 'ENG',
    currentCampus: 'Permanent',
    currentBatch: 'Spring 2024',
    requestedChange: {
      effective: 'Fall 2025',
      reason: 'Personal circumstances - family relocation abroad'
    },
    actionType: 'ADMISSION_CANCEL',
    status: 'Rejected',
    requestedAt: '2025-10-15',
    updatedAt: '2025-10-20',
    remarks: 'Rejected: Outstanding dues of ৳35,000 must be cleared first',
    attachments: [],
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-10-15', remarks: 'Cancellation request' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-10-16', remarks: 'Checking clearances' },
      { action: 'Rejected', by: 'Finance Office', date: '2025-10-20', remarks: 'Outstanding financial obligations' }
    ]
  },
  {
    id: 'aa-005',
    studentId: 'STU-2022-0150',
    studentName: 'Nusrat Jahan',
    currentProgram: 'LLB',
    currentCampus: 'Permanent',
    currentBatch: 'Spring 2022',
    requestedChange: {
      lastActive: 'Summer 2024',
      returning: 'Spring 2026',
      reason: 'Medical leave - recovered and ready to resume'
    },
    actionType: 'READMISSION',
    status: 'Applied',
    requestedAt: '2025-09-01',
    updatedAt: '2025-09-25',
    remarks: 'Successfully readmitted for Spring 2026',
    attachments: ['medical_certificate.pdf', 'readmission_form.pdf'],
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-09-01', remarks: 'Readmission request' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-09-05', remarks: 'Medical documents verified' },
      { action: 'Approved', by: 'Academic Committee', date: '2025-09-15', remarks: 'Readmission approved' },
      { action: 'Applied', by: 'Registrar', date: '2025-09-25', remarks: 'Student status updated to Active' }
    ]
  },
  {
    id: 'aa-006',
    studentId: 'STU-2023-0145',
    studentName: 'Rahim Uddin',
    currentProgram: 'EEE',
    currentCampus: 'Permanent',
    currentBatch: 'Spring 2023',
    requestedChange: {
      from: 'Permanent',
      to: 'Mirpur',
      effective: 'Spring 2026'
    },
    actionType: 'CAMPUS_CHANGE',
    status: 'Requested',
    requestedAt: '2025-11-16',
    updatedAt: '2025-11-16',
    remarks: 'Blocked by Disciplinary Action',
    attachments: [],
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-16', remarks: 'Campus transfer request' }
    ]
  },
  {
    id: 'aa-007',
    studentId: 'STU-2024-0102',
    studentName: 'Tanvir Hasan',
    currentProgram: 'BBA',
    currentCampus: 'Mirpur',
    currentBatch: 'Spring 2024',
    requestedChange: {
      phone: '01898765432',
      presentAddress: 'Flat 3B, Building 7, Gulshan-2, Dhaka-1212'
    },
    actionType: 'STUDENT_INFO_UPDATE',
    status: 'Approved',
    requestedAt: '2025-11-14',
    updatedAt: '2025-11-17',
    remarks: 'Information verified and approved',
    attachments: ['nid_copy.pdf'],
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-14', remarks: 'Contact update' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-11-15', remarks: 'Document verification' },
      { action: 'Approved', by: 'Registrar', date: '2025-11-17', remarks: 'Documents verified' }
    ]
  },
  {
    id: 'aa-008',
    studentId: 'STU-2022-0055',
    studentName: 'Raihan Ahmed',
    currentProgram: 'EEE',
    currentCampus: 'Permanent',
    currentBatch: 'Spring 2022',
    requestedChange: {
      from: 'EEE',
      to: 'CSE',
      effective: 'Fall 2025',
      reason: 'Career interest shift towards software development'
    },
    actionType: 'PROGRAM_CHANGE',
    status: 'Under Review',
    requestedAt: '2025-11-12',
    updatedAt: '2025-11-13',
    remarks: 'Awaiting Academic Committee decision',
    attachments: ['justification.pdf', 'transcript.pdf'],
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-12', remarks: 'Program change request' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-11-13', remarks: 'Forwarded to committee' }
    ]
  },
  {
    id: 'aa-009',
    studentId: 'STU-2024-0201',
    studentName: 'Sadia Akter',
    currentProgram: 'BBA',
    currentCampus: 'Mirpur',
    currentBatch: 'Spring 2024',
    requestedChange: {
      email: 'sadia.updated@example.com',
      phone: '01756789012'
    },
    actionType: 'STUDENT_INFO_UPDATE',
    status: 'Requested',
    requestedAt: '2025-11-19',
    updatedAt: '2025-11-19',
    remarks: 'Blocked by TER Not Submitted',
    attachments: [],
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-19', remarks: 'Contact info update' }
    ]
  },
  {
    id: 'aa-010',
    studentId: 'STU-2023-0088',
    studentName: 'Farhan Ahmed',
    currentProgram: 'CSE',
    currentCampus: 'Permanent',
    currentBatch: 'Spring 2023',
    requestedChange: {
      effective: 'Spring 2026',
      reason: 'Transfer to foreign university - scholarship opportunity'
    },
    actionType: 'ADMISSION_CANCEL',
    status: 'Under Review',
    requestedAt: '2025-11-11',
    updatedAt: '2025-11-13',
    remarks: 'Under clearance verification',
    attachments: ['acceptance_letter.pdf'],
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-11', remarks: 'Cancellation for transfer' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-11-13', remarks: 'Checking all clearances' }
    ]
  },
  {
    id: 'aa-011',
    studentId: 'STU-2021-0088',
    studentName: 'Khalid Mahmud',
    currentProgram: 'MBA',
    currentCampus: 'Banani',
    currentBatch: 'Fall 2021',
    requestedChange: {
      lastActive: 'Fall 2023',
      returning: 'Fall 2025',
      reason: 'Work experience gap - returning to complete degree'
    },
    actionType: 'READMISSION',
    status: 'Approved',
    requestedAt: '2025-08-15',
    updatedAt: '2025-08-25',
    remarks: 'Readmission approved, awaiting application',
    attachments: ['application.pdf', 'work_certificate.pdf'],
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-08-15', remarks: 'Readmission after work gap' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-08-18', remarks: 'Reviewing academic history' },
      { action: 'Approved', by: 'Academic Committee', date: '2025-08-25', remarks: 'Approved for Fall 2025' }
    ]
  },
  {
    id: 'aa-012',
    studentId: 'STU-2024-0055',
    studentName: 'Lubna Rahman',
    currentProgram: 'LLB',
    currentCampus: 'Banani',
    currentBatch: 'Spring 2024',
    requestedChange: {
      from: 'Banani',
      to: 'Permanent',
      effective: 'Fall 2025'
    },
    actionType: 'CAMPUS_CHANGE',
    status: 'Approved',
    requestedAt: '2025-11-08',
    updatedAt: '2025-11-12',
    remarks: 'Transfer approved, awaiting application',
    attachments: ['request_letter.pdf'],
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-08', remarks: 'Campus transfer' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-11-09', remarks: 'Checking seat availability' },
      { action: 'Approved', by: 'Registrar', date: '2025-11-12', remarks: 'Seat available at Permanent campus' }
    ]
  },
  {
    id: 'aa-013',
    studentId: 'STU-2023-0120',
    studentName: 'Fahim Shahriar',
    currentProgram: 'CSE',
    currentCampus: 'Permanent',
    currentBatch: 'Fall 2023',
    requestedChange: {
      from: 'CSE',
      to: 'EEE',
      effective: 'Spring 2026',
      reason: 'Interest in hardware and electronics systems'
    },
    actionType: 'PROGRAM_CHANGE',
    status: 'Requested',
    requestedAt: '2025-11-17',
    updatedAt: '2025-11-17',
    remarks: 'Pending initial review',
    attachments: ['statement.pdf'],
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-17', remarks: 'Program change to EEE' }
    ]
  },
  {
    id: 'aa-014',
    studentId: 'STU-2022-0120',
    studentName: 'Nusrat Jahan',
    currentProgram: 'MBA',
    currentCampus: 'Banani',
    currentBatch: 'Fall 2022',
    requestedChange: {
      presentAddress: 'House 23, Road 8, Baridhara DOHS, Dhaka-1206',
      phone: '01623456789'
    },
    actionType: 'STUDENT_INFO_UPDATE',
    status: 'Applied',
    requestedAt: '2025-11-05',
    updatedAt: '2025-11-10',
    remarks: 'Information successfully updated in system',
    attachments: ['utility_bill.pdf'],
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-05', remarks: 'Address update' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-11-06', remarks: 'Verifying documents' },
      { action: 'Approved', by: 'Registrar', date: '2025-11-08', remarks: 'Documents verified' },
      { action: 'Applied', by: 'System', date: '2025-11-10', remarks: 'Profile updated' }
    ]
  },
  {
    id: 'aa-015',
    studentId: 'STU-2023-0201',
    studentName: 'Sadia Akter',
    currentProgram: 'BBA',
    currentCampus: 'Mirpur',
    currentBatch: 'Spring 2023',
    requestedChange: {
      from: 'Mirpur',
      to: 'Banani',
      effective: 'Spring 2026'
    },
    actionType: 'CAMPUS_CHANGE',
    status: 'Rejected',
    requestedAt: '2025-10-20',
    updatedAt: '2025-10-25',
    remarks: 'Rejected: No available seats at Banani campus for Spring 2026',
    attachments: [],
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-10-20', remarks: 'Campus transfer request' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-10-22', remarks: 'Checking availability' },
      { action: 'Rejected', by: 'Registrar', date: '2025-10-25', remarks: 'Capacity full' }
    ]
  },
  {
    id: 'aa-016',
    studentId: 'STU-2024-0175',
    studentName: 'Imran Hossain',
    currentProgram: 'ENG',
    currentCampus: 'Permanent',
    currentBatch: 'Spring 2024',
    requestedChange: {
      lastActive: 'Spring 2024',
      returning: 'Fall 2025',
      reason: 'Medical emergency - now recovered'
    },
    actionType: 'READMISSION',
    status: 'Requested',
    requestedAt: '2025-11-18',
    updatedAt: '2025-11-18',
    remarks: 'Medical documentation submitted',
    attachments: ['medical_report.pdf'],
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-18', remarks: 'Readmission after medical leave' }
    ]
  },
  {
    id: 'aa-017',
    studentId: 'STU-2022-0175',
    studentName: 'Meher Afroz',
    currentProgram: 'EEE',
    currentCampus: 'Permanent',
    currentBatch: 'Fall 2022',
    requestedChange: {
      effective: 'Spring 2026',
      reason: 'Family emergency - permanent relocation'
    },
    actionType: 'ADMISSION_CANCEL',
    status: 'Approved',
    requestedAt: '2025-11-01',
    updatedAt: '2025-11-08',
    remarks: 'All clearances obtained, awaiting final application',
    attachments: ['clearance_letter.pdf'],
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-11-01', remarks: 'Cancellation request' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-11-03', remarks: 'Verifying clearances' },
      { action: 'Approved', by: 'Academic Committee', date: '2025-11-08', remarks: 'All clearances verified' }
    ]
  },
  {
    id: 'aa-018',
    studentId: 'STU-2023-0099',
    studentName: 'Arif Rahman',
    currentProgram: 'CSE',
    currentCampus: 'Banani',
    currentBatch: 'Spring 2023',
    requestedChange: {
      from: 'CSE',
      to: 'BBA',
      effective: 'Fall 2025',
      reason: 'Career goals realignment towards business management'
    },
    actionType: 'PROGRAM_CHANGE',
    status: 'Rejected',
    requestedAt: '2025-10-10',
    updatedAt: '2025-10-18',
    remarks: 'Rejected: Insufficient prerequisite courses for BBA program',
    attachments: ['transcript.pdf'],
    audit: [
      { action: 'Requested', by: 'Student Portal', date: '2025-10-10', remarks: 'Program change request' },
      { action: 'Under Review', by: 'Exam Officer', date: '2025-10-12', remarks: 'Transcript review' },
      { action: 'Rejected', by: 'Academic Committee', date: '2025-10-18', remarks: 'Prerequisites not met' }
    ]
  }
]

export const getActionsByStatus = (status: ActionStatus) =>
  ADMISSION_ACTIONS.filter(a => a.status === status)

export const getActionsByType = (type: ActionType) =>
  ADMISSION_ACTIONS.filter(a => a.actionType === type)

export const getActionsByStudent = (studentId: string) =>
  ADMISSION_ACTIONS.filter(a => a.studentId === studentId)
