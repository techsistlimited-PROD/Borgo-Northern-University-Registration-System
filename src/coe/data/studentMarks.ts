export interface StudentMark {
  id: string
  studentId: string
  studentName: string
  courseCode: string
  section: string
  semesterId: string
  programCode: string
  attendance: number | null
  ca: number | null
  midterm: number | null
  final: number | null
  total: number
  letterGrade: string
  gradePoint: number
  status: 'Draft' | 'Locked' | 'Published'
  enteredBy: string
  enteredDate: string
  locked: boolean
}

export const STUDENT_MARKS: StudentMark[] = [
  {
    id: 'mark-1',
    studentId: 'STU-2023-0001',
    studentName: 'Nishat Sultana',
    courseCode: 'CSE1101',
    section: 'A',
    semesterId: 'sem-2025-fall',
    programCode: 'CSE',
    attendance: 10,
    ca: 18,
    midterm: 27,
    final: 38,
    total: 93,
    letterGrade: 'A+',
    gradePoint: 4.00,
    status: 'Locked',
    enteredBy: 'Dr. Rahman',
    enteredDate: '2025-11-15',
    locked: true
  },
  {
    id: 'mark-2',
    studentId: 'STU-2023-0002',
    studentName: 'Arif Hossain',
    courseCode: 'CSE1101',
    section: 'A',
    semesterId: 'sem-2025-fall',
    programCode: 'CSE',
    attendance: 9,
    ca: 17,
    midterm: 24,
    final: 35,
    total: 85,
    letterGrade: 'A+',
    gradePoint: 4.00,
    status: 'Locked',
    enteredBy: 'Dr. Rahman',
    enteredDate: '2025-11-15',
    locked: true
  },
  {
    id: 'mark-3',
    studentId: 'STU-2023-0003',
    studentName: 'Tahmina Khan',
    courseCode: 'CSE1101',
    section: 'A',
    semesterId: 'sem-2025-fall',
    programCode: 'CSE',
    attendance: 8,
    ca: 15,
    midterm: 22,
    final: 30,
    total: 75,
    letterGrade: 'A',
    gradePoint: 3.75,
    status: 'Locked',
    enteredBy: 'Dr. Rahman',
    enteredDate: '2025-11-15',
    locked: true
  },
  {
    id: 'mark-4',
    studentId: 'STU-2023-0004',
    studentName: 'Raihan Ahmed',
    courseCode: 'CSE1101',
    section: 'A',
    semesterId: 'sem-2025-fall',
    programCode: 'CSE',
    attendance: 7,
    ca: 14,
    midterm: 20,
    final: 28,
    total: 69,
    letterGrade: 'B+',
    gradePoint: 3.25,
    status: 'Draft',
    enteredBy: 'Dr. Rahman',
    enteredDate: '2025-11-16',
    locked: false
  },
  {
    id: 'mark-5',
    studentId: 'STU-2023-0005',
    studentName: 'Sabrina Akter',
    courseCode: 'CSE1101',
    section: 'A',
    semesterId: 'sem-2025-fall',
    programCode: 'CSE',
    attendance: 6,
    ca: 12,
    midterm: 18,
    final: 24,
    total: 60,
    letterGrade: 'B',
    gradePoint: 3.00,
    status: 'Draft',
    enteredBy: 'Dr. Rahman',
    enteredDate: '2025-11-16',
    locked: false
  },
  {
    id: 'mark-6',
    studentId: 'STU-2023-0001',
    studentName: 'Nishat Sultana',
    courseCode: 'CSE2211',
    section: 'A',
    semesterId: 'sem-2025-fall',
    programCode: 'CSE',
    attendance: 10,
    ca: 19,
    midterm: 28,
    final: 39,
    total: 96,
    letterGrade: 'A+',
    gradePoint: 4.00,
    status: 'Published',
    enteredBy: 'Prof. Khan',
    enteredDate: '2025-11-10',
    locked: true
  },
  {
    id: 'mark-7',
    studentId: 'STU-2023-0002',
    studentName: 'Arif Hossain',
    courseCode: 'CSE2211',
    section: 'A',
    semesterId: 'sem-2025-fall',
    programCode: 'CSE',
    attendance: 10,
    ca: 18,
    midterm: 26,
    final: 37,
    total: 91,
    letterGrade: 'A+',
    gradePoint: 4.00,
    status: 'Published',
    enteredBy: 'Prof. Khan',
    enteredDate: '2025-11-10',
    locked: true
  },
  {
    id: 'mark-8',
    studentId: 'STU-2024-0101',
    studentName: 'Farzana Kabir',
    courseCode: 'BBA1102',
    section: 'A',
    semesterId: 'sem-2025-fall',
    programCode: 'BBA',
    attendance: 9,
    ca: 16,
    midterm: 23,
    final: 32,
    total: 80,
    letterGrade: 'A+',
    gradePoint: 4.00,
    status: 'Locked',
    enteredBy: 'Ms. Akter',
    enteredDate: '2025-11-14',
    locked: true
  },
  {
    id: 'mark-9',
    studentId: 'STU-2024-0102',
    studentName: 'Tanvir Hasan',
    courseCode: 'BBA1102',
    section: 'A',
    semesterId: 'sem-2025-fall',
    programCode: 'BBA',
    attendance: 8,
    ca: 14,
    midterm: 21,
    final: 29,
    total: 72,
    letterGrade: 'A-',
    gradePoint: 3.50,
    status: 'Locked',
    enteredBy: 'Ms. Akter',
    enteredDate: '2025-11-14',
    locked: true
  },
  {
    id: 'mark-10',
    studentId: 'STU-2024-0103',
    studentName: 'Ahmed Karim',
    courseCode: 'BBA1102',
    section: 'A',
    semesterId: 'sem-2025-fall',
    programCode: 'BBA',
    attendance: 5,
    ca: 10,
    midterm: 15,
    final: 20,
    total: 50,
    letterGrade: 'C+',
    gradePoint: 2.50,
    status: 'Draft',
    enteredBy: 'Ms. Akter',
    enteredDate: '2025-11-16',
    locked: false
  }
]

export const getMarksByStudent = (studentId: string, semesterId?: string) =>
  STUDENT_MARKS.filter(m => m.studentId === studentId && (!semesterId || m.semesterId === semesterId))

export const getMarksByCourse = (courseCode: string, section: string, semesterId: string) =>
  STUDENT_MARKS.filter(m => m.courseCode === courseCode && m.section === section && m.semesterId === semesterId)
