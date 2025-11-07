export interface Semester {
  id: string
  code: string
  name: string
  year: number
  type: 'Spring' | 'Summer' | 'Fall'
  startDate: string
  endDate: string
  status: 'Active' | 'Upcoming' | 'Completed'
  isCurrentExam: boolean
}

export const SEMESTERS: Semester[] = [
  {
    id: 'sem-2025-fall',
    code: 'F25',
    name: 'Fall 2025',
    year: 2025,
    type: 'Fall',
    startDate: '2025-09-01',
    endDate: '2025-12-31',
    status: 'Active',
    isCurrentExam: true
  },
  {
    id: 'sem-2025-summer',
    code: 'S25',
    name: 'Summer 2025',
    year: 2025,
    type: 'Summer',
    startDate: '2025-05-01',
    endDate: '2025-08-31',
    status: 'Completed',
    isCurrentExam: false
  },
  {
    id: 'sem-2025-spring',
    code: 'SP25',
    name: 'Spring 2025',
    year: 2025,
    type: 'Spring',
    startDate: '2025-01-01',
    endDate: '2025-04-30',
    status: 'Completed',
    isCurrentExam: false
  },
  {
    id: 'sem-2024-fall',
    code: 'F24',
    name: 'Fall 2024',
    year: 2024,
    type: 'Fall',
    startDate: '2024-09-01',
    endDate: '2024-12-31',
    status: 'Completed',
    isCurrentExam: false
  },
  {
    id: 'sem-2024-summer',
    code: 'S24',
    name: 'Summer 2024',
    year: 2024,
    type: 'Summer',
    startDate: '2024-05-01',
    endDate: '2024-08-31',
    status: 'Completed',
    isCurrentExam: false
  },
  {
    id: 'sem-2024-spring',
    code: 'SP24',
    name: 'Spring 2024',
    year: 2024,
    type: 'Spring',
    startDate: '2024-01-01',
    endDate: '2024-04-30',
    status: 'Completed',
    isCurrentExam: false
  }
]

export const getCurrentSemester = () => SEMESTERS.find(s => s.isCurrentExam) || SEMESTERS[0]
export const getActiveSemesters = () => SEMESTERS.filter(s => s.status === 'Active')
