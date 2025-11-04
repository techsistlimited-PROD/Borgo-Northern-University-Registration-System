export type Vacancy = {
  id: string
  ref: string
  title: string
  department: string
  employmentType: 'Permanent' | 'Contract' | 'Part-Time' | 'Visiting'
  grade: string
  campus: string
  openings: number
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Published' | 'Closed'
  workflow: {
    dept: boolean
    hr: boolean
    registrar: boolean
    vc: boolean
    bot: boolean
  }
  postedOn: string
  deadline: string
  description: string
  requirements: string[]
  desiredSkills: string[]
}

export type Candidate = {
  id: string
  trackingNo: string
  name: string
  email: string
  phone: string
  appliedForRef: string
  appliedForTitle: string
  department: string
  experienceYears: number
  highestDegree: string
  university: string
  cgpa: number
  portfolioUrl?: string
  resumeUrl: string
  status: 'Applied' | 'Screened' | 'Shortlisted' | 'Interviewed' | 'Offered' | 'Accepted' | 'Rejected' | 'Onboarded'
  scorecard: {
    screen: number
    interview: number
    final: number
  }
  tags: string[]
  notes: string
  history: Array<{
    date: string
    action: string
    by: string
    remarks: string
  }>
}

export type InterviewPanel = {
  panelId: string
  vacancyRef: string
  panelName: string
  members: Array<{
    empId: string
    name: string
    designation: string
    dept: string
  }>
  slots: Array<{
    slotId: string
    date: string
    start: string
    end: string
    room: string
    mode: 'In-person' | 'Online'
    candidates: string[]
  }>
}

export type OfferLetter = {
  offerId: string
  candidateId: string
  vacancyRef: string
  offeredDesignation: string
  grade: string
  baseSalary: number
  allowances: {
    house: number
    medical: number
    transport: number
    other: number
  }
  contractType: 'Permanent' | 'Contract' | 'Visiting'
  joiningDate: string
  location: string
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired'
  offerPdfUrl: string
  notes: string
}

export type OnboardingRecord = {
  onbId: string
  candidateId: string
  vacancyRef: string
  checklist: Array<{
    key: string
    label: string
    status: 'Done' | 'Pending'
    remarks: string
  }>
  convertedEmployee?: {
    employeeId: string
    designation: string
    department: string
    joiningDate: string
    supervisor: string
    employeeType: 'Teacher' | 'Admin'
  }
  status: 'In Progress' | 'Completed' | 'Hold' | 'Cancelled'
  lastUpdated: string
  assignedMentor?: string
  supervisor?: string
}

export const SHORTLIST_RULES = {
  minGPA: 3.0,
  minExperience: 2,
  preferredUniversities: ['BUET', 'DU', 'KUET', 'SUST', 'NSU', 'BRAC', 'IUT'],
  blacklistEmails: ['spam@example.com']
}

export const RECRUITMENT_VACANCIES: Vacancy[] = [
  {
    id: 'VAC-2025-001',
    ref: 'VAC-2025-001',
    title: 'Assistant Professor (CSE)',
    department: 'CSE',
    employmentType: 'Permanent',
    grade: 'G-7',
    campus: 'Permanent Campus',
    openings: 2,
    status: 'Published',
    workflow: { dept: true, hr: true, registrar: true, vc: true, bot: true },
    postedOn: '2025-10-01',
    deadline: '2025-11-20',
    description: 'Seeking passionate Assistant Professor for Computer Science & Engineering department with strong research background.',
    requirements: ['PhD in Computer Science or related field', 'Minimum 2 years teaching experience', 'Published research papers', 'Strong programming skills'],
    desiredSkills: ['Machine Learning', 'Data Science', 'Cloud Computing', 'Research Publications']
  },
  {
    id: 'VAC-2025-002',
    ref: 'VAC-2025-002',
    title: 'Lecturer (BBA)',
    department: 'BBA',
    employmentType: 'Contract',
    grade: 'G-6',
    campus: 'Permanent Campus',
    openings: 1,
    status: 'Published',
    workflow: { dept: true, hr: true, registrar: true, vc: true, bot: true },
    postedOn: '2025-10-05',
    deadline: '2025-11-25',
    description: 'Looking for dynamic Lecturer in Business Administration with industry experience.',
    requirements: ['MBA from reputed university', 'CGPA 3.5+', 'Teaching or corporate experience', 'Excellent communication skills'],
    desiredSkills: ['Marketing', 'Finance', 'Strategic Management', 'Business Analytics']
  },
  {
    id: 'VAC-2025-003',
    ref: 'VAC-2025-003',
    title: 'Senior Lecturer (CSE)',
    department: 'CSE',
    employmentType: 'Permanent',
    grade: 'G-8',
    campus: 'Permanent Campus',
    openings: 1,
    status: 'Published',
    workflow: { dept: true, hr: true, registrar: true, vc: true, bot: true },
    postedOn: '2025-09-15',
    deadline: '2025-11-10',
    description: 'Experienced Senior Lecturer position in CSE department for curriculum development and research.',
    requirements: ['PhD in CS/IT', '5+ years teaching experience', 'Strong publication record', 'Research supervision experience'],
    desiredSkills: ['Artificial Intelligence', 'Software Engineering', 'Cybersecurity', 'IoT']
  },
  {
    id: 'VAC-2025-004',
    ref: 'VAC-2025-004',
    title: 'HR Officer',
    department: 'HR',
    employmentType: 'Permanent',
    grade: 'G-4',
    campus: 'Permanent Campus',
    openings: 1,
    status: 'Pending Approval',
    workflow: { dept: true, hr: true, registrar: false, vc: false, bot: false },
    postedOn: '2025-10-15',
    deadline: '2025-12-01',
    description: 'HR Officer to manage recruitment, employee relations, and HR operations.',
    requirements: ['MBA in HRM', '2+ years HR experience', 'Knowledge of labor laws', 'Strong interpersonal skills'],
    desiredSkills: ['Recruitment', 'HRIS', 'Performance Management', 'Employee Engagement']
  },
  {
    id: 'VAC-2025-005',
    ref: 'VAC-2025-005',
    title: 'Accounts Officer',
    department: 'Accounts',
    employmentType: 'Permanent',
    grade: 'G-4',
    campus: 'Permanent Campus',
    openings: 1,
    status: 'Published',
    workflow: { dept: true, hr: true, registrar: true, vc: true, bot: true },
    postedOn: '2025-09-20',
    deadline: '2025-11-15',
    description: 'Accounts Officer for managing university financial operations and reporting.',
    requirements: ['MBA/MBS in Accounting/Finance', 'Professional certification (CA/CMA preferred)', '3+ years experience', 'ERP knowledge'],
    desiredSkills: ['Financial Reporting', 'Budgeting', 'Tally/SAP', 'Audit']
  },
  {
    id: 'VAC-2025-006',
    ref: 'VAC-2025-006',
    title: 'IT Support Engineer',
    department: 'IT',
    employmentType: 'Contract',
    grade: 'G-5',
    campus: 'Permanent Campus',
    openings: 2,
    status: 'Published',
    workflow: { dept: true, hr: true, registrar: true, vc: true, bot: true },
    postedOn: '2025-10-10',
    deadline: '2025-11-30',
    description: 'IT Support Engineer to maintain university network and infrastructure.',
    requirements: ['BSc in CSE/IT', 'Network certification (CCNA/MCSE)', '2+ years IT support', 'Hardware troubleshooting'],
    desiredSkills: ['Network Administration', 'Server Management', 'Windows/Linux', 'Cloud Services']
  },
  {
    id: 'VAC-2025-007',
    ref: 'VAC-2025-007',
    title: 'Lab Instructor (CSE)',
    department: 'CSE',
    employmentType: 'Part-Time',
    grade: 'G-5',
    campus: 'Permanent Campus',
    openings: 3,
    status: 'Published',
    workflow: { dept: true, hr: true, registrar: true, vc: true, bot: true },
    postedOn: '2025-10-12',
    deadline: '2025-11-22',
    description: 'Part-time Lab Instructor for CSE programming labs.',
    requirements: ['BSc in CSE', 'Strong programming skills', 'Lab teaching experience preferred'],
    desiredSkills: ['Java', 'Python', 'C++', 'Data Structures', 'Database']
  },
  {
    id: 'VAC-2025-008',
    ref: 'VAC-2025-008',
    title: 'Librarian',
    department: 'Library',
    employmentType: 'Permanent',
    grade: 'G-5',
    campus: 'Permanent Campus',
    openings: 1,
    status: 'Draft',
    workflow: { dept: false, hr: false, registrar: false, vc: false, bot: false },
    postedOn: '2025-10-18',
    deadline: '2025-12-10',
    description: 'Librarian to manage university library operations and digital resources.',
    requirements: ['Master in Library Science', '3+ years library experience', 'Digital library management', 'Cataloging expertise'],
    desiredSkills: ['Library Management Software', 'Digital Archiving', 'Research Support', 'Classification']
  },
  {
    id: 'VAC-2025-009',
    ref: 'VAC-2025-009',
    title: 'Assistant Professor (BBA)',
    department: 'BBA',
    employmentType: 'Permanent',
    grade: 'G-7',
    campus: 'Permanent Campus',
    openings: 1,
    status: 'Published',
    workflow: { dept: true, hr: true, registrar: true, vc: true, bot: true },
    postedOn: '2025-09-25',
    deadline: '2025-11-18',
    description: 'Assistant Professor for Business Administration with specialization in Marketing or Finance.',
    requirements: ['PhD in Business/Marketing/Finance', 'Teaching experience', 'Research publications', 'Industry exposure'],
    desiredSkills: ['Marketing Strategy', 'Financial Analysis', 'Business Research', 'Case Teaching']
  },
  {
    id: 'VAC-2025-010',
    ref: 'VAC-2025-010',
    title: 'Admission Officer',
    department: 'Admission',
    employmentType: 'Permanent',
    grade: 'G-4',
    campus: 'Permanent Campus',
    openings: 2,
    status: 'Approved',
    workflow: { dept: true, hr: true, registrar: true, vc: true, bot: false },
    postedOn: '2025-10-08',
    deadline: '2025-11-28',
    description: 'Admission Officer to manage student admission process and counseling.',
    requirements: ['MBA/Masters degree', 'Customer service skills', 'Computer proficiency', 'Team player'],
    desiredSkills: ['Student Counseling', 'CRM', 'Communication', 'Process Management']
  },
  {
    id: 'VAC-2025-011',
    ref: 'VAC-2025-011',
    title: 'Visiting Faculty (CSE)',
    department: 'CSE',
    employmentType: 'Visiting',
    grade: 'G-9',
    campus: 'Permanent Campus',
    openings: 2,
    status: 'Published',
    workflow: { dept: true, hr: true, registrar: true, vc: true, bot: true },
    postedOn: '2025-10-05',
    deadline: '2025-11-15',
    description: 'Visiting Faculty position for specialized courses in CSE.',
    requirements: ['PhD or Industry expert', 'Subject matter expertise', 'Teaching experience'],
    desiredSkills: ['Industry Experience', 'Research', 'Guest Lectures', 'Mentoring']
  },
  {
    id: 'VAC-2025-012',
    ref: 'VAC-2025-012',
    title: 'Network Administrator',
    department: 'IT',
    employmentType: 'Permanent',
    grade: 'G-6',
    campus: 'Permanent Campus',
    openings: 1,
    status: 'Closed',
    workflow: { dept: true, hr: true, registrar: true, vc: true, bot: true },
    postedOn: '2025-08-15',
    deadline: '2025-09-30',
    description: 'Network Administrator for campus-wide network management.',
    requirements: ['BSc in CSE/IT', 'CCNA/CCNP certified', '4+ years experience', 'Network security knowledge'],
    desiredSkills: ['Cisco', 'Firewall', 'VPN', 'Network Monitoring', 'Troubleshooting']
  }
]

// Continue in next file due to size...
