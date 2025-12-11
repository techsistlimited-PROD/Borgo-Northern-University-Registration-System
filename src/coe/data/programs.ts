export interface Program {
  id: string
  code: string
  name: string
  degree: string
  department: string
  requiredCredits: number
  durationYears: number
  sections: string[]
}

export const PROGRAMS: Program[] = [
  {
    id: 'prog-cse',
    code: 'CSE',
    name: 'Computer Science & Engineering',
    degree: 'BSc',
    department: 'Engineering',
    requiredCredits: 144,
    durationYears: 4,
    sections: ['A', 'B', 'C', 'D']
  },
  {
    id: 'prog-eee',
    code: 'EEE',
    name: 'Electrical & Electronic Engineering',
    degree: 'BSc',
    department: 'Engineering',
    requiredCredits: 144,
    durationYears: 4,
    sections: ['A', 'B', 'C']
  },
  {
    id: 'prog-bba',
    code: 'BBA',
    name: 'Bachelor of Business Administration',
    degree: 'BBA',
    department: 'Business',
    requiredCredits: 120,
    durationYears: 4,
    sections: ['A', 'B', 'C', 'D', 'E']
  },
  {
    id: 'prog-llb',
    code: 'LLB',
    name: 'Bachelor of Laws',
    degree: 'LLB',
    department: 'Law',
    requiredCredits: 132,
    durationYears: 4,
    sections: ['A', 'B']
  },
  {
    id: 'prog-eng',
    code: 'ENG',
    name: 'English Literature',
    degree: 'BA',
    department: 'Arts',
    requiredCredits: 120,
    durationYears: 4,
    sections: ['A', 'B']
  },
  {
    id: 'prog-mba',
    code: 'MBA',
    name: 'Master of Business Administration',
    degree: 'MBA',
    department: 'Business',
    requiredCredits: 60,
    durationYears: 2,
    sections: ['A', 'B']
  }
]

export const getProgramByCode = (code: string) => PROGRAMS.find(p => p.code === code)
export const getProgramSections = (programCode: string) => PROGRAMS.find(p => p.code === programCode)?.sections || []
