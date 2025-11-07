import { CertificateType } from './certificates'

export interface DocumentRecord {
  id: string
  studentId: string
  studentName: string
  programCode: string
  campus: string
  batch: string
  creditsCompleted: number
  cgpa: number | null
  documentType: CertificateType
  issuedDate: string
  serial: string
  qrToken: string
  purpose: string
  remarks: string
}

export const DOCUMENT_RECORDS: DocumentRecord[] = [
  {
    id: 'doc-001',
    studentId: 'STU-2023-0001',
    studentName: 'Nishat Sultana',
    programCode: 'CSE',
    campus: 'Permanent',
    batch: 'Spring 2023',
    creditsCompleted: 96,
    cgpa: 3.96,
    documentType: 'Official Transcript (Full)',
    issuedDate: '2025-11-12',
    serial: 'SER-2025-00001',
    qrToken: 'Q7X9M2P1',
    purpose: 'Higher Education Application',
    remarks: 'Ready for printing'
  },
  {
    id: 'doc-002',
    studentId: 'STU-2021-0001',
    studentName: 'Tahmina Akter',
    programCode: 'LLB',
    campus: 'Permanent',
    batch: 'Spring 2021',
    creditsCompleted: 132,
    cgpa: 3.82,
    documentType: 'Provisional Certificate',
    issuedDate: '2025-10-22',
    serial: 'SER-2025-00002',
    qrToken: 'K4L8N3V2',
    purpose: 'Job Application',
    remarks: 'Collected'
  },
  {
    id: 'doc-003',
    studentId: 'STU-2024-0102',
    studentName: 'Tanvir Hasan',
    programCode: 'BBA',
    campus: 'Mirpur',
    batch: 'Spring 2024',
    creditsCompleted: 54,
    cgpa: 3.55,
    documentType: 'Grading System Letter',
    issuedDate: '2025-11-18',
    serial: 'SER-2025-00003',
    qrToken: 'R5T7Y9U1',
    purpose: 'Foreign University Application',
    remarks: 'Ready for pickup'
  },
  {
    id: 'doc-004',
    studentId: 'STU-2022-0055',
    studentName: 'Raihan Ahmed',
    programCode: 'EEE',
    campus: 'Permanent',
    batch: 'Spring 2022',
    creditsCompleted: 108,
    cgpa: 3.65,
    documentType: 'Migration Certificate',
    issuedDate: '2025-11-15',
    serial: 'SER-2025-00005',
    qrToken: 'D3F5H7J9',
    purpose: 'Transfer to Another University',
    remarks: 'Approved by Academic Committee'
  },
  {
    id: 'doc-005',
    studentId: 'STU-2024-0101',
    studentName: 'Farzana Kabir',
    programCode: 'BBA',
    campus: 'Banani',
    batch: 'Spring 2024',
    creditsCompleted: 45,
    cgpa: 3.68,
    documentType: 'Medium of Instruction (MOI)',
    issuedDate: '2025-11-18',
    serial: 'SER-2025-00008',
    qrToken: 'M4N8K2L5',
    purpose: 'IELTS Exemption',
    remarks: 'Verified'
  },
  {
    id: 'doc-006',
    studentId: 'STU-2021-0001',
    studentName: 'Tahmina Akter',
    programCode: 'LLB',
    campus: 'Permanent',
    batch: 'Spring 2021',
    creditsCompleted: 132,
    cgpa: 3.82,
    documentType: 'Main Certificate',
    issuedDate: '2025-01-10',
    serial: 'SER-2025-00004',
    qrToken: 'W8X2Z5C6',
    purpose: 'Official Degree',
    remarks: 'Convocation certificate'
  },
  {
    id: 'doc-007',
    studentId: 'STU-2022-0120',
    studentName: 'Nusrat Jahan',
    programCode: 'MBA',
    campus: 'Banani',
    batch: 'Fall 2022',
    creditsCompleted: 48,
    cgpa: 3.88,
    documentType: 'Recommendation Letter',
    issuedDate: '2025-11-16',
    serial: 'SER-2025-00009',
    qrToken: 'P3Q7R2S6',
    purpose: 'PhD Application',
    remarks: 'Department approved'
  },
  {
    id: 'doc-008',
    studentId: 'STU-2024-0088',
    studentName: 'Kamal Hossain',
    programCode: 'ENG',
    campus: 'Permanent',
    batch: 'Spring 2024',
    creditsCompleted: 36,
    cgpa: 3.58,
    documentType: 'Result Publication Letter',
    issuedDate: '2025-11-17',
    serial: 'SER-2025-00006',
    qrToken: 'P9L3K6M2',
    purpose: 'Scholarship Application',
    remarks: 'Ready for pickup'
  },
  {
    id: 'doc-009',
    studentId: 'STU-2022-0175',
    studentName: 'Meher Afroz',
    programCode: 'EEE',
    campus: 'Permanent',
    batch: 'Fall 2022',
    creditsCompleted: 120,
    cgpa: 3.75,
    documentType: 'Official Transcript (Partial)',
    issuedDate: '2025-11-10',
    serial: 'SER-2025-00007',
    qrToken: 'V4B8N2M5',
    purpose: 'Exchange Program',
    remarks: 'First 6 semesters only'
  },
  {
    id: 'doc-010',
    studentId: 'STU-2023-0005',
    studentName: 'Sabrina Akter',
    programCode: 'CSE',
    campus: 'Permanent',
    batch: 'Spring 2023',
    creditsCompleted: 84,
    cgpa: 3.72,
    documentType: 'Testimonial',
    issuedDate: '2025-11-14',
    serial: 'SER-2025-00010',
    qrToken: 'T5Y8U3I6',
    purpose: 'Visa Application',
    remarks: 'COE verified'
  },
  {
    id: 'doc-011',
    studentId: 'STU-2024-0055',
    studentName: 'Lubna Rahman',
    programCode: 'LLB',
    campus: 'Banani',
    batch: 'Spring 2024',
    creditsCompleted: 48,
    cgpa: 3.91,
    documentType: 'Character Certificate',
    issuedDate: '2025-11-19',
    serial: 'SER-2025-00011',
    qrToken: 'C7H3A9R2',
    purpose: 'Internship',
    remarks: 'Approved'
  },
  {
    id: 'doc-012',
    studentId: 'STU-2023-0120',
    studentName: 'Fahim Shahriar',
    programCode: 'CSE',
    campus: 'Permanent',
    batch: 'Fall 2023',
    creditsCompleted: 72,
    cgpa: 3.45,
    documentType: 'PVC Equivalency Letter',
    issuedDate: '2025-11-15',
    serial: 'SER-2025-00012',
    qrToken: 'E2Q5V8C3',
    purpose: 'Foreign Job Application',
    remarks: 'PVC verified'
  }
]

export const getDocumentsByProgram = (programCode: string) =>
  DOCUMENT_RECORDS.filter(d => d.programCode === programCode)

export const getDocumentsByCampus = (campus: string) =>
  DOCUMENT_RECORDS.filter(d => d.campus === campus)

export const getDocumentsByType = (type: CertificateType) =>
  DOCUMENT_RECORDS.filter(d => d.documentType === type)
