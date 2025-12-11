export type CertificateType =
  | 'Official Transcript (Full)'
  | 'Official Transcript (Partial)'
  | 'Unofficial Transcript (Performance Report)'
  | 'Provisional Certificate'
  | 'Main Certificate'
  | 'Migration Certificate'
  | 'Medium of Instruction (MOI)'
  | 'Testimonial'
  | 'Character Certificate'
  | 'Recommendation Letter'
  | 'Grading System Letter'
  | 'Backlog Certificate'
  | 'PVC Equivalency Letter'
  | 'Result Publication Letter'

export type CertificateTypeCode =
  | 'OTRN'
  | 'PTRN'
  | 'UTRP'
  | 'PROV'
  | 'MAIN'
  | 'MIGR'
  | 'MOI'
  | 'TEST'
  | 'CHAR'
  | 'RECO'
  | 'GRDL'
  | 'BACK'
  | 'PVCE'
  | 'LRP'

export interface CertificateRequest {
  id: string
  requestId: string
  studentId: string
  studentName: string
  programCode: string
  batch: string
  campus: string
  creditsCompleted: number
  cgpa: number | null
  documentType: CertificateType
  purpose: string
  quantity: number
  requestDate: string
  status: 'Requested' | 'Processing' | 'Ready' | 'Collected' | 'Rejected'
  processedBy: string | null
  processedDate: string | null
  readyDate: string | null
  collectedBy: string | null
  collectionDate: string | null
  rejectedReason: string | null
  notes: string
  urgentRequest: boolean
  serial: string | null
  qrToken: string | null
}

export const CERTIFICATE_REQUESTS: CertificateRequest[] = [
  {
    id: 'cert-001',
    requestId: 'CERT-2025-001',
    studentId: 'STU-2023-0001',
    studentName: 'Nishat Sultana',
    programCode: 'CSE',
    batch: 'Spring 2023',
    campus: 'Permanent',
    creditsCompleted: 96,
    cgpa: 3.96,
    documentType: 'Official Transcript (Full)',
    purpose: 'Higher Education Application',
    quantity: 2,
    requestDate: '2025-11-10',
    status: 'Ready',
    processedBy: 'COE Office',
    processedDate: '2025-11-12',
    readyDate: '2025-11-12',
    collectedBy: null,
    collectionDate: null,
    rejectedReason: null,
    notes: 'Ready for collection. Valid until Dec 31, 2025.',
    urgentRequest: false,
    serial: 'SER-2025-00001',
    qrToken: 'Q7X9M2P1'
  },
  {
    id: 'cert-002',
    requestId: 'CERT-2025-002',
    studentId: 'STU-2024-0101',
    studentName: 'Farzana Kabir',
    programCode: 'BBA',
    batch: 'Spring 2024',
    campus: 'Banani',
    creditsCompleted: 45,
    cgpa: 3.68,
    documentType: 'Medium of Instruction (MOI)',
    purpose: 'IELTS Exemption',
    quantity: 1,
    requestDate: '2025-11-15',
    status: 'Processing',
    processedBy: 'Ms. Rahman',
    processedDate: '2025-11-15',
    readyDate: null,
    collectedBy: null,
    collectionDate: null,
    rejectedReason: null,
    notes: 'Under verification. Expected by Nov 18.',
    urgentRequest: true,
    serial: null,
    qrToken: null
  },
  {
    id: 'cert-003',
    requestId: 'CERT-2025-003',
    studentId: 'STU-2021-0001',
    studentName: 'Tahmina Akter',
    programCode: 'LLB',
    batch: 'Spring 2021',
    campus: 'Permanent',
    creditsCompleted: 132,
    cgpa: 3.82,
    documentType: 'Provisional Certificate',
    purpose: 'Job Application',
    quantity: 1,
    requestDate: '2025-10-20',
    status: 'Collected',
    processedBy: 'COE Office',
    processedDate: '2025-10-22',
    readyDate: '2025-10-22',
    collectedBy: 'Tahmina Akter',
    collectionDate: '2025-10-25',
    rejectedReason: null,
    notes: 'Collected successfully',
    urgentRequest: false,
    serial: 'SER-2025-00002',
    qrToken: 'K4L8N3V2'
  },
  {
    id: 'cert-004',
    requestId: 'CERT-2025-004',
    studentId: 'STU-2023-0010',
    studentName: 'Mahfuz Rahman',
    programCode: 'CSE',
    batch: 'Spring 2023',
    campus: 'Permanent',
    creditsCompleted: 78,
    cgpa: 3.45,
    documentType: 'Character Certificate',
    purpose: 'Internship Application',
    quantity: 1,
    requestDate: '2025-11-16',
    status: 'Requested',
    processedBy: null,
    processedDate: null,
    readyDate: null,
    collectedBy: null,
    collectionDate: null,
    rejectedReason: null,
    notes: 'Blocked by Finance Dues. Cannot process until cleared.',
    urgentRequest: false,
    serial: null,
    qrToken: null
  },
  {
    id: 'cert-005',
    requestId: 'CERT-2025-005',
    studentId: 'STU-2024-0102',
    studentName: 'Tanvir Hasan',
    programCode: 'BBA',
    batch: 'Spring 2024',
    campus: 'Mirpur',
    creditsCompleted: 54,
    cgpa: 3.55,
    documentType: 'Grading System Letter',
    purpose: 'Foreign University Application',
    quantity: 1,
    requestDate: '2025-11-17',
    status: 'Ready',
    processedBy: 'COE Office',
    processedDate: '2025-11-18',
    readyDate: '2025-11-18',
    collectedBy: null,
    collectionDate: null,
    rejectedReason: null,
    notes: 'Ready for collection',
    urgentRequest: false,
    serial: 'SER-2025-00003',
    qrToken: 'R5T7Y9U1'
  },
  {
    id: 'cert-006',
    requestId: 'CERT-2025-006',
    studentId: 'STU-2023-0005',
    studentName: 'Sabrina Akter',
    programCode: 'CSE',
    batch: 'Spring 2023',
    campus: 'Permanent',
    creditsCompleted: 84,
    cgpa: 3.72,
    documentType: 'Unofficial Transcript (Performance Report)',
    purpose: 'Personal Record',
    quantity: 1,
    requestDate: '2025-11-18',
    status: 'Processing',
    processedBy: 'Mr. Karim',
    processedDate: '2025-11-18',
    readyDate: null,
    collectedBy: null,
    collectionDate: null,
    rejectedReason: null,
    notes: 'Processing',
    urgentRequest: false,
    serial: null,
    qrToken: null
  },
  {
    id: 'cert-007',
    requestId: 'CERT-2025-007',
    studentId: 'STU-2021-0001',
    studentName: 'Tahmina Akter',
    programCode: 'LLB',
    batch: 'Spring 2021',
    campus: 'Permanent',
    creditsCompleted: 132,
    cgpa: 3.82,
    documentType: 'Main Certificate',
    purpose: 'Official Degree',
    quantity: 1,
    requestDate: '2025-01-05',
    status: 'Collected',
    processedBy: 'COE Office',
    processedDate: '2025-01-10',
    readyDate: '2025-01-10',
    collectedBy: 'Tahmina Akter',
    collectionDate: '2025-01-15',
    rejectedReason: null,
    notes: 'Convocation certificate issued and collected',
    urgentRequest: false,
    serial: 'SER-2025-00004',
    qrToken: 'W8X2Z5C6'
  },
  {
    id: 'cert-008',
    requestId: 'CERT-2025-008',
    studentId: 'STU-2024-0103',
    studentName: 'Ahmed Karim',
    programCode: 'BBA',
    batch: 'Spring 2024',
    campus: 'Banani',
    creditsCompleted: 42,
    cgpa: 3.20,
    documentType: 'Backlog Certificate',
    purpose: 'Job Application',
    quantity: 1,
    requestDate: '2025-11-12',
    status: 'Rejected',
    processedBy: 'COE Office',
    processedDate: '2025-11-13',
    readyDate: null,
    collectedBy: null,
    collectionDate: null,
    rejectedReason: 'Student has pending finance dues',
    notes: 'Rejected: Student has pending dues',
    urgentRequest: false,
    serial: null,
    qrToken: null
  },
  {
    id: 'cert-009',
    requestId: 'CERT-2025-009',
    studentId: 'STU-2022-0055',
    studentName: 'Raihan Ahmed',
    programCode: 'EEE',
    batch: 'Spring 2022',
    campus: 'Permanent',
    creditsCompleted: 108,
    cgpa: 3.65,
    documentType: 'Migration Certificate',
    purpose: 'Transfer to Another University',
    quantity: 1,
    requestDate: '2025-11-14',
    status: 'Ready',
    processedBy: 'Dr. Hasan',
    processedDate: '2025-11-15',
    readyDate: '2025-11-15',
    collectedBy: null,
    collectionDate: null,
    rejectedReason: null,
    notes: 'Approved by Academic Committee',
    urgentRequest: true,
    serial: 'SER-2025-00005',
    qrToken: 'D3F5H7J9'
  },
  {
    id: 'cert-010',
    requestId: 'CERT-2025-010',
    studentId: 'STU-2023-0088',
    studentName: 'Farhan Ahmed',
    programCode: 'CSE',
    batch: 'Spring 2023',
    campus: 'Permanent',
    creditsCompleted: 72,
    cgpa: 3.28,
    documentType: 'Testimonial',
    purpose: 'Visa Application',
    quantity: 1,
    requestDate: '2025-11-19',
    status: 'Requested',
    processedBy: null,
    processedDate: null,
    readyDate: null,
    collectedBy: null,
    collectionDate: null,
    rejectedReason: null,
    notes: 'Blocked due to exam malpractice investigation pending',
    urgentRequest: false,
    serial: null,
    qrToken: null
  },
  {
    id: 'cert-011',
    requestId: 'CERT-2025-011',
    studentId: 'STU-2022-0120',
    studentName: 'Nusrat Jahan',
    programCode: 'MBA',
    batch: 'Fall 2022',
    campus: 'Banani',
    creditsCompleted: 48,
    cgpa: 3.88,
    documentType: 'Recommendation Letter',
    purpose: 'PhD Application',
    quantity: 2,
    requestDate: '2025-11-11',
    status: 'Processing',
    processedBy: 'Prof. Karim',
    processedDate: '2025-11-12',
    readyDate: null,
    collectedBy: null,
    collectionDate: null,
    rejectedReason: null,
    notes: 'Awaiting departmental approval',
    urgentRequest: true,
    serial: null,
    qrToken: null
  },
  {
    id: 'cert-012',
    requestId: 'CERT-2025-012',
    studentId: 'STU-2023-0201',
    studentName: 'Sadia Akter',
    programCode: 'BBA',
    batch: 'Spring 2023',
    campus: 'Mirpur',
    creditsCompleted: 60,
    cgpa: 3.42,
    documentType: 'PVC Equivalency Letter',
    purpose: 'Foreign Job Application',
    quantity: 1,
    requestDate: '2025-11-13',
    status: 'Requested',
    processedBy: null,
    processedDate: null,
    readyDate: null,
    collectedBy: null,
    collectionDate: null,
    rejectedReason: null,
    notes: 'Blocked by TER Not Submitted',
    urgentRequest: false,
    serial: null,
    qrToken: null
  },
  {
    id: 'cert-013',
    requestId: 'CERT-2025-013',
    studentId: 'STU-2024-0088',
    studentName: 'Kamal Hossain',
    programCode: 'ENG',
    batch: 'Spring 2024',
    campus: 'Permanent',
    creditsCompleted: 36,
    cgpa: 3.58,
    documentType: 'Result Publication Letter',
    purpose: 'Scholarship Application',
    quantity: 1,
    requestDate: '2025-11-16',
    status: 'Ready',
    processedBy: 'COE Office',
    processedDate: '2025-11-17',
    readyDate: '2025-11-17',
    collectedBy: null,
    collectionDate: null,
    rejectedReason: null,
    notes: 'Ready for pickup',
    urgentRequest: false,
    serial: 'SER-2025-00006',
    qrToken: 'P9L3K6M2'
  },
  {
    id: 'cert-014',
    requestId: 'CERT-2025-014',
    studentId: 'STU-2022-0175',
    studentName: 'Meher Afroz',
    programCode: 'EEE',
    batch: 'Fall 2022',
    campus: 'Permanent',
    creditsCompleted: 120,
    cgpa: 3.75,
    documentType: 'Official Transcript (Partial)',
    purpose: 'Exchange Program',
    quantity: 1,
    requestDate: '2025-11-09',
    status: 'Collected',
    processedBy: 'COE Office',
    processedDate: '2025-11-10',
    readyDate: '2025-11-10',
    collectedBy: 'Meher Afroz',
    collectionDate: '2025-11-11',
    rejectedReason: null,
    notes: 'Transcript for first 6 semesters only',
    urgentRequest: false,
    serial: 'SER-2025-00007',
    qrToken: 'V4B8N2M5'
  },
  {
    id: 'cert-015',
    requestId: 'CERT-2025-015',
    studentId: 'STU-2023-0145',
    studentName: 'Rahim Uddin',
    programCode: 'EEE',
    batch: 'Spring 2023',
    campus: 'Permanent',
    creditsCompleted: 90,
    cgpa: 3.12,
    documentType: 'Character Certificate',
    purpose: 'Bank Loan Application',
    quantity: 1,
    requestDate: '2025-11-18',
    status: 'Requested',
    processedBy: null,
    processedDate: null,
    readyDate: null,
    collectedBy: null,
    collectionDate: null,
    rejectedReason: null,
    notes: 'Blocked by Disciplinary Action',
    urgentRequest: false,
    serial: null,
    qrToken: null
  },
  {
    id: 'cert-016',
    requestId: 'CERT-2025-016',
    studentId: 'STU-2024-0055',
    studentName: 'Lubna Rahman',
    programCode: 'LLB',
    batch: 'Spring 2024',
    campus: 'Banani',
    creditsCompleted: 48,
    cgpa: 3.91,
    documentType: 'Provisional Certificate',
    purpose: 'Internship',
    quantity: 1,
    requestDate: '2025-11-19',
    status: 'Processing',
    processedBy: 'Ms. Sultana',
    processedDate: '2025-11-19',
    readyDate: null,
    collectedBy: null,
    collectionDate: null,
    rejectedReason: null,
    notes: 'Under processing',
    urgentRequest: false,
    serial: null,
    qrToken: null
  }
]

export const getRequestsByStatus = (status: CertificateRequest['status']) =>
  CERTIFICATE_REQUESTS.filter(r => r.status === status)

export const getRequestsByStudent = (studentId: string) =>
  CERTIFICATE_REQUESTS.filter(r => r.studentId === studentId)

export const getUrgentRequests = () =>
  CERTIFICATE_REQUESTS.filter(r => r.urgentRequest && r.status !== 'Collected')

export const getCertificateTypes = (): CertificateType[] => [
  'Official Transcript (Full)',
  'Official Transcript (Partial)',
  'Unofficial Transcript (Performance Report)',
  'Provisional Certificate',
  'Main Certificate',
  'Migration Certificate',
  'Medium of Instruction (MOI)',
  'Testimonial',
  'Character Certificate',
  'Recommendation Letter',
  'Grading System Letter',
  'Backlog Certificate',
  'PVC Equivalency Letter',
  'Result Publication Letter'
]

export const getCertificateTypeCode = (type: CertificateType): CertificateTypeCode => {
  const typeMap: Record<CertificateType, CertificateTypeCode> = {
    'Official Transcript (Full)': 'OTRN',
    'Official Transcript (Partial)': 'PTRN',
    'Unofficial Transcript (Performance Report)': 'UTRP',
    'Provisional Certificate': 'PROV',
    'Main Certificate': 'MAIN',
    'Migration Certificate': 'MIGR',
    'Medium of Instruction (MOI)': 'MOI',
    'Testimonial': 'TEST',
    'Character Certificate': 'CHAR',
    'Recommendation Letter': 'RECO',
    'Grading System Letter': 'GRDL',
    'Backlog Certificate': 'BACK',
    'PVC Equivalency Letter': 'PVCE',
    'Result Publication Letter': 'LRP'
  }
  return typeMap[type]
}
