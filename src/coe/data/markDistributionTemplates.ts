export interface MarkDistribution {
  id: string
  courseCode: string
  courseName: string
  section: string
  semesterId: string
  programCode: string
  attendance: { enabled: boolean; max: number; percentage: number }
  ca: { enabled: boolean; max: number; percentage: number }
  midterm: { enabled: boolean; max: number; percentage: number }
  final: { enabled: boolean; max: number; percentage: number }
  total: number
  is100MarkScheme: boolean
  locked: boolean
  lastModified: string
  modifiedBy: string
}

export const MARK_DISTRIBUTION_TEMPLATES: MarkDistribution[] = [
  {
    id: 'dist-cse1101-a',
    courseCode: 'CSE1101',
    courseName: 'Programming Fundamentals',
    section: 'A',
    semesterId: 'sem-2025-fall',
    programCode: 'CSE',
    attendance: { enabled: true, max: 10, percentage: 10 },
    ca: { enabled: true, max: 20, percentage: 20 },
    midterm: { enabled: true, max: 30, percentage: 30 },
    final: { enabled: true, max: 40, percentage: 40 },
    total: 100,
    is100MarkScheme: false,
    locked: false,
    lastModified: '2025-10-15',
    modifiedBy: 'Dr. Rahman'
  },
  {
    id: 'dist-cse2211-a',
    courseCode: 'CSE2211',
    courseName: 'Data Structures',
    section: 'A',
    semesterId: 'sem-2025-fall',
    programCode: 'CSE',
    attendance: { enabled: true, max: 10, percentage: 10 },
    ca: { enabled: true, max: 20, percentage: 20 },
    midterm: { enabled: true, max: 30, percentage: 30 },
    final: { enabled: true, max: 40, percentage: 40 },
    total: 100,
    is100MarkScheme: false,
    locked: true,
    lastModified: '2025-10-10',
    modifiedBy: 'Prof. Khan'
  },
  {
    id: 'dist-bba1102-a',
    courseCode: 'BBA1102',
    courseName: 'Principles of Management',
    section: 'A',
    semesterId: 'sem-2025-fall',
    programCode: 'BBA',
    attendance: { enabled: true, max: 10, percentage: 10 },
    ca: { enabled: true, max: 20, percentage: 20 },
    midterm: { enabled: true, max: 30, percentage: 30 },
    final: { enabled: true, max: 40, percentage: 40 },
    total: 100,
    is100MarkScheme: false,
    locked: false,
    lastModified: '2025-10-12',
    modifiedBy: 'Ms. Akter'
  },
  {
    id: 'dist-law302-a',
    courseCode: 'LAW302',
    courseName: 'Constitutional Law',
    section: 'A',
    semesterId: 'sem-2025-fall',
    programCode: 'LLB',
    attendance: { enabled: false, max: 0, percentage: 0 },
    ca: { enabled: false, max: 0, percentage: 0 },
    midterm: { enabled: false, max: 0, percentage: 0 },
    final: { enabled: true, max: 100, percentage: 100 },
    total: 100,
    is100MarkScheme: true,
    locked: false,
    lastModified: '2025-10-08',
    modifiedBy: 'Prof. Hasan'
  },
  {
    id: 'dist-eee2101-b',
    courseCode: 'EEE2101',
    courseName: 'Circuit Analysis',
    section: 'B',
    semesterId: 'sem-2025-fall',
    programCode: 'EEE',
    attendance: { enabled: true, max: 5, percentage: 5 },
    ca: { enabled: true, max: 25, percentage: 25 },
    midterm: { enabled: true, max: 30, percentage: 30 },
    final: { enabled: true, max: 40, percentage: 40 },
    total: 100,
    is100MarkScheme: false,
    locked: false,
    lastModified: '2025-10-14',
    modifiedBy: 'Dr. Karim'
  }
]

export const getDistributionByCourse = (courseCode: string, section: string, semesterId: string) =>
  MARK_DISTRIBUTION_TEMPLATES.find(
    d => d.courseCode === courseCode && d.section === section && d.semesterId === semesterId
  )

export const getDefaultDistribution = (): Omit<MarkDistribution, 'id' | 'courseCode' | 'courseName' | 'section'> => ({
  semesterId: 'sem-2025-fall',
  programCode: '',
  attendance: { enabled: true, max: 10, percentage: 10 },
  ca: { enabled: true, max: 20, percentage: 20 },
  midterm: { enabled: true, max: 30, percentage: 30 },
  final: { enabled: true, max: 40, percentage: 40 },
  total: 100,
  is100MarkScheme: false,
  locked: false,
  lastModified: new Date().toISOString().split('T')[0],
  modifiedBy: 'System'
})
