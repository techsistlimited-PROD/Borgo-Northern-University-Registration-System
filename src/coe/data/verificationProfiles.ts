export interface VerificationProfile {
  id: string
  studentId: string
  studentName: string
  programCode: string
  batch: string
  enrollmentStatus: 'Active' | 'Graduated' | 'Withdrawn'
  verificationToken: string
  qrCode: string
  lastVerified: string
  verificationCount: number
  remarks: string
  semesterPerformance: Array<{
    semesterId: string
    semesterName: string
    gpa: number
    cgpa: number
    credits: number
    status: string
  }>
  coursePerformance: Array<{
    courseCode: string
    courseName: string
    semesterId: string
    letterGrade: string
    gradePoint: number
  }>
}

export const VERIFICATION_PROFILES: VerificationProfile[] = [
  {
    id: 'verify-001',
    studentId: 'STU-2023-0001',
    studentName: 'Nishat Sultana',
    programCode: 'CSE',
    batch: 'Spring 2023',
    enrollmentStatus: 'Active',
    verificationToken: 'VT-2023-0001-NUB-CSE',
    qrCode: 'QR-2023-0001-NUB',
    lastVerified: '2025-11-18 14:30:00',
    verificationCount: 5,
    remarks: 'Verified student in good academic standing',
    semesterPerformance: [
      {
        semesterId: 'sem-2025-fall',
        semesterName: 'Fall 2025',
        gpa: 3.94,
        cgpa: 3.96,
        credits: 12,
        status: 'Published'
      },
      {
        semesterId: 'sem-2025-summer',
        semesterName: 'Summer 2025',
        gpa: 3.92,
        cgpa: 3.95,
        credits: 7.5,
        status: 'Published'
      },
      {
        semesterId: 'sem-2025-spring',
        semesterName: 'Spring 2025',
        gpa: 3.98,
        cgpa: 3.98,
        credits: 9,
        status: 'Published'
      }
    ],
    coursePerformance: [
      { courseCode: 'CSE1101', courseName: 'Programming Fundamentals', semesterId: 'sem-2025-fall', letterGrade: 'A+', gradePoint: 4.00 },
      { courseCode: 'CSE2211', courseName: 'Data Structures', semesterId: 'sem-2025-fall', letterGrade: 'A+', gradePoint: 4.00 },
      { courseCode: 'MATH201', courseName: 'Discrete Mathematics', semesterId: 'sem-2025-fall', letterGrade: 'A', gradePoint: 3.75 },
      { courseCode: 'ENG101', courseName: 'English Composition', semesterId: 'sem-2025-fall', letterGrade: 'A+', gradePoint: 4.00 }
    ]
  },
  {
    id: 'verify-002',
    studentId: 'STU-2021-0001',
    studentName: 'Tahmina Akter',
    programCode: 'LLB',
    batch: 'Spring 2021',
    enrollmentStatus: 'Graduated',
    verificationToken: 'VT-2021-0001-NUB-LLB',
    qrCode: 'QR-2021-0001-NUB',
    lastVerified: '2025-10-05 09:15:00',
    verificationCount: 12,
    remarks: 'Graduated with First Class Distinction',
    semesterPerformance: [
      {
        semesterId: 'sem-2024-fall',
        semesterName: 'Fall 2024',
        gpa: 3.88,
        cgpa: 3.82,
        credits: 6,
        status: 'Published'
      },
      {
        semesterId: 'sem-2024-summer',
        semesterName: 'Summer 2024',
        gpa: 3.85,
        cgpa: 3.81,
        credits: 9,
        status: 'Published'
      },
      {
        semesterId: 'sem-2024-spring',
        semesterName: 'Spring 2024',
        gpa: 3.75,
        cgpa: 3.80,
        credits: 12,
        status: 'Published'
      }
    ],
    coursePerformance: [
      { courseCode: 'LAW401', courseName: 'Constitutional Law II', semesterId: 'sem-2024-fall', letterGrade: 'A+', gradePoint: 4.00 },
      { courseCode: 'LAW402', courseName: 'Criminal Law', semesterId: 'sem-2024-fall', letterGrade: 'A', gradePoint: 3.75 }
    ]
  },
  {
    id: 'verify-003',
    studentId: 'STU-2024-0101',
    studentName: 'Farzana Kabir',
    programCode: 'BBA',
    batch: 'Spring 2024',
    enrollmentStatus: 'Active',
    verificationToken: 'VT-2024-0101-NUB-BBA',
    qrCode: 'QR-2024-0101-NUB',
    lastVerified: '2025-11-15 11:20:00',
    verificationCount: 2,
    remarks: 'Active student with good academic standing',
    semesterPerformance: [
      {
        semesterId: 'sem-2025-fall',
        semesterName: 'Fall 2025',
        gpa: 3.75,
        cgpa: 3.68,
        credits: 9,
        status: 'Published'
      },
      {
        semesterId: 'sem-2025-summer',
        semesterName: 'Summer 2025',
        gpa: 3.65,
        cgpa: 3.62,
        credits: 6,
        status: 'Published'
      }
    ],
    coursePerformance: [
      { courseCode: 'BBA1102', courseName: 'Principles of Management', semesterId: 'sem-2025-fall', letterGrade: 'A+', gradePoint: 4.00 },
      { courseCode: 'ACC101', courseName: 'Principles of Accounting', semesterId: 'sem-2025-fall', letterGrade: 'A', gradePoint: 3.75 },
      { courseCode: 'ECO101', courseName: 'Microeconomics', semesterId: 'sem-2025-fall', letterGrade: 'A-', gradePoint: 3.50 }
    ]
  }
]

export const getVerificationByStudent = (studentId: string) =>
  VERIFICATION_PROFILES.find(v => v.studentId === studentId)

export const getVerificationByToken = (token: string) =>
  VERIFICATION_PROFILES.find(v => v.verificationToken === token)

export const getActiveVerifications = () =>
  VERIFICATION_PROFILES.filter(v => v.enrollmentStatus === 'Active')

export const getGraduatedVerifications = () =>
  VERIFICATION_PROFILES.filter(v => v.enrollmentStatus === 'Graduated')
