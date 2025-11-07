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

export interface CertificateRequest {
  id: string
  requestId: string
  studentId: string
  studentName: string
  programCode: string
  batch: string
  documentType: CertificateType
  purpose: string
  quantity: number
  requestDate: string
  status: 'Pending' | 'Processing' | 'Ready' | 'Collected' | 'Rejected'
  processedBy: string | null
  processedDate: string | null
  collectedBy: string | null
  collectionDate: string | null
  notes: string
  urgentRequest: boolean
}

export const CERTIFICATE_REQUESTS: CertificateRequest[] = [
  {
    id: 'cert-001',
    requestId: 'CERT-2025-001',
    studentId: 'STU-2023-0001',
    studentName: 'Nishat Sultana',
    programCode: 'CSE',
    batch: 'Spring 2023',
    documentType: 'Official Transcript (Full)',
    purpose: 'Higher Education Application',
    quantity: 2,
    requestDate: '2025-11-10',
    status: 'Ready',
    processedBy: 'COE Office',
    processedDate: '2025-11-12',
    collectedBy: null,
    collectionDate: null,
    notes: 'Ready for collection. Valid until Dec 31, 2025.',
    urgentRequest: false
  },
  {
    id: 'cert-002',
    requestId: 'CERT-2025-002',
    studentId: 'STU-2024-0101',
    studentName: 'Farzana Kabir',
    programCode: 'BBA',
    batch: 'Spring 2024',
    documentType: 'Medium of Instruction (MOI)',
    purpose: 'IELTS Exemption',
    quantity: 1,
    requestDate: '2025-11-15',
    status: 'Processing',
    processedBy: 'Ms. Rahman',
    processedDate: null,
    collectedBy: null,
    collectionDate: null,
    notes: 'Under verification. Expected by Nov 18.',
    urgentRequest: true
  },
  {
    id: 'cert-003',
    requestId: 'CERT-2025-003',
    studentId: 'STU-2021-0001',
    studentName: 'Tahmina Akter',
    programCode: 'LLB',
    batch: 'Spring 2021',
    documentType: 'Provisional Certificate',
    purpose: 'Job Application',
    quantity: 1,
    requestDate: '2025-10-20',
    status: 'Collected',
    processedBy: 'COE Office',
    processedDate: '2025-10-22',
    collectedBy: 'Tahmina Akter',
    collectionDate: '2025-10-25',
    notes: 'Collected successfully',
    urgentRequest: false
  },
  {
    id: 'cert-004',
    requestId: 'CERT-2025-004',
    studentId: 'STU-2023-0002',
    studentName: 'Arif Hossain',
    programCode: 'CSE',
    batch: 'Spring 2023',
    documentType: 'Character Certificate',
    purpose: 'Internship Application',
    quantity: 1,
    requestDate: '2025-11-16',
    status: 'Pending',
    processedBy: null,
    processedDate: null,
    collectedBy: null,
    collectionDate: null,
    notes: 'Awaiting faculty clearance',
    urgentRequest: false
  },
  {
    id: 'cert-005',
    requestId: 'CERT-2025-005',
    studentId: 'STU-2024-0102',
    studentName: 'Tanvir Hasan',
    programCode: 'BBA',
    batch: 'Spring 2024',
    documentType: 'Grading System Letter',
    purpose: 'Foreign University Application',
    quantity: 1,
    requestDate: '2025-11-17',
    status: 'Ready',
    processedBy: 'COE Office',
    processedDate: '2025-11-18',
    collectedBy: null,
    collectionDate: null,
    notes: 'Ready for collection',
    urgentRequest: false
  },
  {
    id: 'cert-006',
    requestId: 'CERT-2025-006',
    studentId: 'STU-2023-0005',
    studentName: 'Sabrina Akter',
    programCode: 'CSE',
    batch: 'Spring 2023',
    documentType: 'Unofficial Transcript (Performance Report)',
    purpose: 'Personal Record',
    quantity: 1,
    requestDate: '2025-11-18',
    status: 'Processing',
    processedBy: 'Mr. Karim',
    processedDate: null,
    collectedBy: null,
    collectionDate: null,
    notes: 'Processing',
    urgentRequest: false
  },
  {
    id: 'cert-007',
    requestId: 'CERT-2025-007',
    studentId: 'STU-2021-0001',
    studentName: 'Tahmina Akter',
    programCode: 'LLB',
    batch: 'Spring 2021',
    documentType: 'Main Certificate',
    purpose: 'Official Degree',
    quantity: 1,
    requestDate: '2025-01-05',
    status: 'Collected',
    processedBy: 'COE Office',
    processedDate: '2025-01-10',
    collectedBy: 'Tahmina Akter',
    collectionDate: '2025-01-15',
    notes: 'Convocation certificate issued and collected',
    urgentRequest: false
  },
  {
    id: 'cert-008',
    requestId: 'CERT-2025-008',
    studentId: 'STU-2024-0103',
    studentName: 'Ahmed Karim',
    programCode: 'BBA',
    batch: 'Spring 2024',
    documentType: 'Backlog Certificate',
    purpose: 'Job Application',
    quantity: 1,
    requestDate: '2025-11-12',
    status: 'Rejected',
    processedBy: 'COE Office',
    processedDate: '2025-11-13',
    collectedBy: null,
    collectionDate: null,
    notes: 'Rejected: Student has pending dues',
    urgentRequest: false
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
