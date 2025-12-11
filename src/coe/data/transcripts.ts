export interface TranscriptCourse {
  courseCode: string
  courseName: string
  credit: number
  letterGrade: string
  gradePoint: number
  semesterId: string
}

export interface SemesterResult {
  semesterId: string
  semesterName: string
  courses: TranscriptCourse[]
  totalCredit: number
  earnedCredit: number
  gpa: number
  cgpa: number
}

export interface Transcript {
  studentId: string
  studentName: string
  programCode: string
  programName: string
  batch: string
  enrollmentDate: string
  completionDate: string | null
  status: 'Enrolled' | 'Completed' | 'Graduated'
  semesters: SemesterResult[]
  totalCreditsRequired: number
  totalCreditsEarned: number
  finalCGPA: number
  classification: string
}

export const TRANSCRIPTS: Transcript[] = [
  {
    studentId: 'STU-2023-0001',
    studentName: 'Nishat Sultana',
    programCode: 'CSE',
    programName: 'Computer Science & Engineering',
    batch: 'Spring 2023',
    enrollmentDate: '2023-01-15',
    completionDate: null,
    status: 'Enrolled',
    semesters: [
      {
        semesterId: 'sem-2025-fall',
        semesterName: 'Fall 2025',
        courses: [
          { courseCode: 'CSE1101', courseName: 'Programming Fundamentals', credit: 3, letterGrade: 'A+', gradePoint: 4.00, semesterId: 'sem-2025-fall' },
          { courseCode: 'CSE2211', courseName: 'Data Structures', credit: 3, letterGrade: 'A+', gradePoint: 4.00, semesterId: 'sem-2025-fall' },
          { courseCode: 'MATH201', courseName: 'Discrete Mathematics', credit: 3, letterGrade: 'A', gradePoint: 3.75, semesterId: 'sem-2025-fall' },
          { courseCode: 'ENG101', courseName: 'English Composition', credit: 3, letterGrade: 'A+', gradePoint: 4.00, semesterId: 'sem-2025-fall' }
        ],
        totalCredit: 12,
        earnedCredit: 12,
        gpa: 3.94,
        cgpa: 3.96
      },
      {
        semesterId: 'sem-2025-summer',
        semesterName: 'Summer 2025',
        courses: [
          { courseCode: 'CSE1102', courseName: 'Programming Lab', credit: 1.5, letterGrade: 'A+', gradePoint: 4.00, semesterId: 'sem-2025-summer' },
          { courseCode: 'CSE2101', courseName: 'Digital Logic Design', credit: 3, letterGrade: 'A', gradePoint: 3.75, semesterId: 'sem-2025-summer' },
          { courseCode: 'PHY101', courseName: 'Physics I', credit: 3, letterGrade: 'A+', gradePoint: 4.00, semesterId: 'sem-2025-summer' }
        ],
        totalCredit: 7.5,
        earnedCredit: 7.5,
        gpa: 3.92,
        cgpa: 3.95
      }
    ],
    totalCreditsRequired: 144,
    totalCreditsEarned: 19.5,
    finalCGPA: 3.96,
    classification: 'First Class (Distinction)'
  },
  {
    studentId: 'STU-2024-0101',
    studentName: 'Farzana Kabir',
    programCode: 'BBA',
    programName: 'Bachelor of Business Administration',
    batch: 'Spring 2024',
    enrollmentDate: '2024-01-10',
    completionDate: null,
    status: 'Enrolled',
    semesters: [
      {
        semesterId: 'sem-2025-fall',
        semesterName: 'Fall 2025',
        courses: [
          { courseCode: 'BBA1102', courseName: 'Principles of Management', credit: 3, letterGrade: 'A+', gradePoint: 4.00, semesterId: 'sem-2025-fall' },
          { courseCode: 'ACC101', courseName: 'Principles of Accounting', credit: 3, letterGrade: 'A', gradePoint: 3.75, semesterId: 'sem-2025-fall' },
          { courseCode: 'ECO101', courseName: 'Microeconomics', credit: 3, letterGrade: 'A-', gradePoint: 3.50, semesterId: 'sem-2025-fall' }
        ],
        totalCredit: 9,
        earnedCredit: 9,
        gpa: 3.75,
        cgpa: 3.68
      }
    ],
    totalCreditsRequired: 120,
    totalCreditsEarned: 9,
    finalCGPA: 3.68,
    classification: 'First Class'
  },
  {
    studentId: 'STU-2021-0001',
    studentName: 'Tahmina Akter',
    programCode: 'LLB',
    programName: 'Bachelor of Laws',
    batch: 'Spring 2021',
    enrollmentDate: '2021-01-10',
    completionDate: '2024-12-20',
    status: 'Graduated',
    semesters: [
      {
        semesterId: 'sem-2024-fall',
        semesterName: 'Fall 2024',
        courses: [
          { courseCode: 'LAW401', courseName: 'Constitutional Law II', credit: 3, letterGrade: 'A+', gradePoint: 4.00, semesterId: 'sem-2024-fall' },
          { courseCode: 'LAW402', courseName: 'Criminal Law', credit: 3, letterGrade: 'A', gradePoint: 3.75, semesterId: 'sem-2024-fall' }
        ],
        totalCredit: 6,
        earnedCredit: 6,
        gpa: 3.88,
        cgpa: 3.82
      }
    ],
    totalCreditsRequired: 132,
    totalCreditsEarned: 132,
    finalCGPA: 3.82,
    classification: 'First Class (Distinction)'
  }
]

export const getTranscriptByStudent = (studentId: string) =>
  TRANSCRIPTS.find(t => t.studentId === studentId)

export const getTranscriptsByProgram = (programCode: string) =>
  TRANSCRIPTS.filter(t => t.programCode === programCode)

export const getGraduatedTranscripts = () =>
  TRANSCRIPTS.filter(t => t.status === 'Graduated')
