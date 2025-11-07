// Re-export types from gradePolicy for consistency
export type { GradeScale, CGPABand, ProgramGradePolicy } from './gradePolicy'
export type { Semester } from './semesters'
export type { Program } from './programs'
export type { ExamType } from './examTypes'
export type { StudentMark } from './studentMarks'
export type { MarkDistribution } from './markDistributionTemplates'

// Additional types for Grading Policy UI
export interface GradingPolicyState {
  gradeScale: GradeScale[]
  cgpaBands: CGPABand[]
  passingGrade: string
  tieBreakRule: 'round-half-up' | 'truncate'
  applicableExamTypes: string[]
}

export interface PolicyEditFormData {
  gradeScale: GradeScale[]
  passingGrade: string
  tieBreakRule: 'round-half-up' | 'truncate'
  applicableExamTypes: string[]
}

export interface GradeCalculationResult {
  studentId: string
  studentName: string
  attendance: number | null
  ca: number | null
  midterm: number | null
  final: number | null
  total: number
  letterGrade: string
  gradePoint: number
}
