export interface ResultCorrection {
  id: string
  requestId: string
  studentId: string
  studentName: string
  courseCode: string
  courseName: string
  section: string
  semesterId: string
  programCode: string
  originalAttendance: number | null
  originalCA: number | null
  originalMidterm: number | null
  originalFinal: number | null
  originalTotal: number
  originalGrade: string
  requestedAttendance: number | null
  requestedCA: number | null
  requestedMidterm: number | null
  requestedFinal: number | null
  requestedTotal: number
  requestedGrade: string
  reason: string
  requestedBy: string
  requestDate: string
  reviewedBy: string | null
  reviewDate: string | null
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected'
  reviewNotes: string
  auditTrail: Array<{
    action: string
    by: string
    date: string
    notes: string
  }>
}

export const RESULT_CORRECTION_QUEUE: ResultCorrection[] = [
  {
    id: 'corr-001',
    requestId: 'RC-2025-001',
    studentId: 'STU-2023-0004',
    studentName: 'Raihan Ahmed',
    courseCode: 'CSE1101',
    courseName: 'Programming Fundamentals',
    section: 'A',
    semesterId: 'sem-2025-fall',
    programCode: 'CSE',
    originalAttendance: 7,
    originalCA: 14,
    originalMidterm: 20,
    originalFinal: 28,
    originalTotal: 69,
    originalGrade: 'B+',
    requestedAttendance: 7,
    requestedCA: 14,
    requestedMidterm: 20,
    requestedFinal: 32,
    requestedTotal: 73,
    requestedGrade: 'A-',
    reason: 'Re-checking final exam paper found 4 additional marks in Question 3',
    requestedBy: 'Dr. Rahman',
    requestDate: '2025-11-17',
    reviewedBy: null,
    reviewDate: null,
    status: 'Submitted',
    reviewNotes: '',
    auditTrail: [
      {
        action: 'Created',
        by: 'Dr. Rahman',
        date: '2025-11-17 10:30',
        notes: 'Initial correction request created'
      },
      {
        action: 'Submitted',
        by: 'Dr. Rahman',
        date: '2025-11-17 10:35',
        notes: 'Request submitted for review'
      }
    ]
  },
  {
    id: 'corr-002',
    requestId: 'RC-2025-002',
    studentId: 'STU-2024-0103',
    studentName: 'Ahmed Karim',
    courseCode: 'BBA1102',
    courseName: 'Principles of Management',
    section: 'A',
    semesterId: 'sem-2025-fall',
    programCode: 'BBA',
    originalAttendance: 5,
    originalCA: 10,
    originalMidterm: 15,
    originalFinal: 20,
    originalTotal: 50,
    originalGrade: 'C+',
    requestedAttendance: 5,
    requestedCA: 12,
    requestedMidterm: 15,
    requestedFinal: 20,
    requestedTotal: 52,
    requestedGrade: 'C+',
    reason: 'CA marks entry error - attendance worksheet shows 12/20 not 10/20',
    requestedBy: 'Ms. Akter',
    requestDate: '2025-11-16',
    reviewedBy: 'Prof. Nazmul',
    reviewDate: '2025-11-17',
    status: 'Approved',
    reviewNotes: 'Verified with original worksheet. Correction approved.',
    auditTrail: [
      {
        action: 'Created',
        by: 'Ms. Akter',
        date: '2025-11-16 14:20',
        notes: 'Correction request for CA marks entry error'
      },
      {
        action: 'Submitted',
        by: 'Ms. Akter',
        date: '2025-11-16 14:25',
        notes: 'Submitted for COE review'
      },
      {
        action: 'Approved',
        by: 'Prof. Nazmul',
        date: '2025-11-17 09:15',
        notes: 'Verified and approved. Grade recalculated.'
      }
    ]
  },
  {
    id: 'corr-003',
    requestId: 'RC-2025-003',
    studentId: 'STU-2023-0005',
    studentName: 'Sabrina Akter',
    courseCode: 'CSE1101',
    courseName: 'Programming Fundamentals',
    section: 'A',
    semesterId: 'sem-2025-fall',
    programCode: 'CSE',
    originalAttendance: 6,
    originalCA: 12,
    originalMidterm: 18,
    originalFinal: 24,
    originalTotal: 60,
    originalGrade: 'B',
    requestedAttendance: 6,
    requestedCA: 12,
    requestedMidterm: 18,
    requestedFinal: 28,
    requestedTotal: 64,
    requestedGrade: 'B',
    reason: 'Student appeal - requested recount of final exam',
    requestedBy: 'Dr. Rahman',
    requestDate: '2025-11-18',
    reviewedBy: 'Dr. Hasan',
    reviewDate: '2025-11-18',
    status: 'Rejected',
    reviewNotes: 'Recount performed. No discrepancy found. Original marks confirmed.',
    auditTrail: [
      {
        action: 'Created',
        by: 'Dr. Rahman',
        date: '2025-11-18 11:00',
        notes: 'Student appeal for recount'
      },
      {
        action: 'Submitted',
        by: 'Dr. Rahman',
        date: '2025-11-18 11:10',
        notes: 'Forwarded to exam committee'
      },
      {
        action: 'Rejected',
        by: 'Dr. Hasan',
        date: '2025-11-18 15:30',
        notes: 'Recount completed. No error found.'
      }
    ]
  },
  {
    id: 'corr-004',
    requestId: 'RC-2025-004',
    studentId: 'STU-2023-0003',
    studentName: 'Tahmina Khan',
    courseCode: 'CSE2211',
    courseName: 'Data Structures',
    section: 'A',
    semesterId: 'sem-2025-fall',
    programCode: 'CSE',
    originalAttendance: 10,
    originalCA: 18,
    originalMidterm: 25,
    originalFinal: 35,
    originalTotal: 88,
    originalGrade: 'A+',
    requestedAttendance: 10,
    requestedCA: 18,
    requestedMidterm: 25,
    requestedFinal: 35,
    requestedTotal: 88,
    requestedGrade: 'A+',
    reason: 'Clerical error in grade calculation - should remain A+ not changed to A',
    requestedBy: 'Prof. Khan',
    requestDate: '2025-11-15',
    reviewedBy: null,
    reviewDate: null,
    status: 'Under Review',
    reviewNotes: '',
    auditTrail: [
      {
        action: 'Created',
        by: 'Prof. Khan',
        date: '2025-11-15 16:45',
        notes: 'Grade calculation verification needed'
      },
      {
        action: 'Submitted',
        by: 'Prof. Khan',
        date: '2025-11-15 16:50',
        notes: 'Under review by COE office'
      }
    ]
  }
]

export const getCorrectionsByStatus = (status: ResultCorrection['status']) =>
  RESULT_CORRECTION_QUEUE.filter(c => c.status === status)

export const getCorrectionsByStudent = (studentId: string) =>
  RESULT_CORRECTION_QUEUE.filter(c => c.studentId === studentId)

export const getCorrectionsByCourse = (courseCode: string, section: string, semesterId: string) =>
  RESULT_CORRECTION_QUEUE.filter(
    c => c.courseCode === courseCode && c.section === section && c.semesterId === semesterId
  )
