export interface GradeScale {
  letterGrade: string
  gradePoint: number
  minMarks: number
  maxMarks: number
  description: string
}

export interface CGPABand {
  band: string
  minCGPA: number
  maxCGPA: number
  classification: string
}

export interface ProgramGradePolicy {
  programCode: string
  customScale?: GradeScale[]
  useGlobalScale: boolean
}

export const GLOBAL_GRADE_SCALE: GradeScale[] = [
  { letterGrade: 'A+', gradePoint: 4.00, minMarks: 80, maxMarks: 100, description: 'Excellent' },
  { letterGrade: 'A', gradePoint: 3.75, minMarks: 75, maxMarks: 79, description: 'Very Good' },
  { letterGrade: 'A-', gradePoint: 3.50, minMarks: 70, maxMarks: 74, description: 'Good' },
  { letterGrade: 'B+', gradePoint: 3.25, minMarks: 65, maxMarks: 69, description: 'Above Average' },
  { letterGrade: 'B', gradePoint: 3.00, minMarks: 60, maxMarks: 64, description: 'Average' },
  { letterGrade: 'B-', gradePoint: 2.75, minMarks: 55, maxMarks: 59, description: 'Below Average' },
  { letterGrade: 'C+', gradePoint: 2.50, minMarks: 50, maxMarks: 54, description: 'Pass' },
  { letterGrade: 'C', gradePoint: 2.25, minMarks: 45, maxMarks: 49, description: 'Marginal Pass' },
  { letterGrade: 'D', gradePoint: 2.00, minMarks: 40, maxMarks: 44, description: 'Minimum Pass' },
  { letterGrade: 'F', gradePoint: 0.00, minMarks: 0, maxMarks: 39, description: 'Fail' }
]

export const CGPA_BANDS: CGPABand[] = [
  { band: 'First Class (Distinction)', minCGPA: 3.75, maxCGPA: 4.00, classification: 'Distinction' },
  { band: 'First Class', minCGPA: 3.50, maxCGPA: 3.74, classification: 'First' },
  { band: 'Second Class (Upper)', minCGPA: 3.25, maxCGPA: 3.49, classification: 'Second Upper' },
  { band: 'Second Class (Lower)', minCGPA: 3.00, maxCGPA: 3.24, classification: 'Second Lower' },
  { band: 'Third Class', minCGPA: 2.50, maxCGPA: 2.99, classification: 'Third' },
  { band: 'Pass', minCGPA: 2.00, maxCGPA: 2.49, classification: 'Pass' },
  { band: 'Fail', minCGPA: 0.00, maxCGPA: 1.99, classification: 'Fail' }
]

export const PROGRAM_GRADE_POLICIES: ProgramGradePolicy[] = [
  { programCode: 'CSE', useGlobalScale: true },
  { programCode: 'EEE', useGlobalScale: true },
  { programCode: 'BBA', useGlobalScale: true },
  { programCode: 'LLB', useGlobalScale: true },
  { programCode: 'ENG', useGlobalScale: true },
  { programCode: 'MBA', useGlobalScale: true }
]

export const calculateLetterGrade = (marks: number, scale: GradeScale[] = GLOBAL_GRADE_SCALE): string => {
  const grade = scale.find(g => marks >= g.minMarks && marks <= g.maxMarks)
  return grade?.letterGrade || 'F'
}

export const calculateGradePoint = (marks: number, scale: GradeScale[] = GLOBAL_GRADE_SCALE): number => {
  const grade = scale.find(g => marks >= g.minMarks && marks <= g.maxMarks)
  return grade?.gradePoint || 0.00
}

export const getCGPAClassification = (cgpa: number): string => {
  const band = CGPA_BANDS.find(b => cgpa >= b.minCGPA && cgpa <= b.maxCGPA)
  return band?.classification || 'Unclassified'
}
