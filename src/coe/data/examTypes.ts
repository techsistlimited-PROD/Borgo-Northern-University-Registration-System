export interface ExamType {
  id: string
  code: string
  name: string
  shortName: string
  defaultWeightage: number
  description: string
}

export const EXAM_TYPES: ExamType[] = [
  {
    id: 'exam-midterm',
    code: 'MID',
    name: 'Mid-term Examination',
    shortName: 'Midterm',
    defaultWeightage: 30,
    description: 'Regular mid-semester examination'
  },
  {
    id: 'exam-final',
    code: 'FINAL',
    name: 'Final Examination',
    shortName: 'Final',
    defaultWeightage: 40,
    description: 'End of semester final examination'
  },
  {
    id: 'exam-special',
    code: 'SPECIAL',
    name: 'Special Examination',
    shortName: 'Special',
    defaultWeightage: 100,
    description: 'Special arrangement for medical/emergency cases'
  },
  {
    id: 'exam-resit',
    code: 'RESIT',
    name: 'Re-sit Examination',
    shortName: 'Re-sit',
    defaultWeightage: 100,
    description: 'Retake examination for failed students'
  },
  {
    id: 'exam-improvement',
    code: 'IMPROVE',
    name: 'Improvement Examination',
    shortName: 'Improvement',
    defaultWeightage: 100,
    description: 'Grade improvement for passed students'
  }
]

export const getExamTypeByCode = (code: string) => EXAM_TYPES.find(e => e.code === code)
