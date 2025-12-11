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

export const RECRUITMENT_CANDIDATES: Candidate[] = [
  {
    id: 'CAN-001',
    trackingNo: 'TRK-2025-001',
    name: 'Dr. Farhan Ahmed',
    email: 'farhan.ahmed@email.com',
    phone: '+880 1712-345678',
    appliedForRef: 'VAC-2025-001',
    appliedForTitle: 'Assistant Professor (CSE)',
    department: 'CSE',
    experienceYears: 3,
    highestDegree: 'PhD',
    university: 'BUET',
    cgpa: 3.85,
    portfolioUrl: 'https://github.com/farhanahmed',
    resumeUrl: 'https://example.com/resumes/farhan.pdf',
    status: 'Shortlisted',
    scorecard: { screen: 85, interview: 0, final: 0 },
    tags: ['ML', 'AI', 'Research'],
    notes: 'Strong research background in machine learning',
    history: [
      { date: '2025-10-15', action: 'Applied', by: 'System', remarks: 'Application received' },
      { date: '2025-10-20', action: 'Screened', by: 'HR Officer', remarks: 'Qualifications verified' },
      { date: '2025-10-22', action: 'Shortlisted', by: 'Dr. Rahman', remarks: 'Excellent research profile' }
    ]
  },
  {
    id: 'CAN-002',
    trackingNo: 'TRK-2025-002',
    name: 'Tahmina Sultana',
    email: 'tahmina.s@email.com',
    phone: '+880 1812-345679',
    appliedForRef: 'VAC-2025-002',
    appliedForTitle: 'Lecturer (BBA)',
    department: 'BBA',
    experienceYears: 2,
    highestDegree: 'MBA',
    university: 'DU',
    cgpa: 3.75,
    resumeUrl: 'https://example.com/resumes/tahmina.pdf',
    status: 'Interviewed',
    scorecard: { screen: 78, interview: 82, final: 80 },
    tags: ['Marketing', 'Digital Strategy'],
    notes: 'Strong communication skills, marketing focus',
    history: [
      { date: '2025-10-16', action: 'Applied', by: 'System', remarks: 'Application received' },
      { date: '2025-10-21', action: 'Screened', by: 'HR Officer', remarks: 'Meets requirements' },
      { date: '2025-10-25', action: 'Shortlisted', by: 'Dr. Khaleda', remarks: 'Good academic record' },
      { date: '2025-10-28', action: 'Interviewed', by: 'Interview Panel', remarks: 'Performed well in interview' }
    ]
  },
  {
    id: 'CAN-003',
    trackingNo: 'TRK-2025-003',
    name: 'Rashid Khan',
    email: 'rashid.khan@email.com',
    phone: '+880 1912-345680',
    appliedForRef: 'VAC-2025-001',
    appliedForTitle: 'Assistant Professor (CSE)',
    department: 'CSE',
    experienceYears: 5,
    highestDegree: 'PhD',
    university: 'NSU',
    cgpa: 3.65,
    portfolioUrl: 'https://rashidkhan.com',
    resumeUrl: 'https://example.com/resumes/rashid.pdf',
    status: 'Offered',
    scorecard: { screen: 88, interview: 90, final: 89 },
    tags: ['Cloud Computing', 'DevOps', 'Research'],
    notes: 'Top candidate, industry + academic experience',
    history: [
      { date: '2025-10-14', action: 'Applied', by: 'System', remarks: 'Application received' },
      { date: '2025-10-19', action: 'Screened', by: 'HR Officer', remarks: 'Excellent qualifications' },
      { date: '2025-10-23', action: 'Shortlisted', by: 'Dr. Rahman', remarks: 'Industry experience valuable' },
      { date: '2025-10-27', action: 'Interviewed', by: 'Interview Panel', remarks: 'Outstanding performance' },
      { date: '2025-10-30', action: 'Offered', by: 'Registrar', remarks: 'Offer letter sent' }
    ]
  },
  {
    id: 'CAN-004',
    trackingNo: 'TRK-2025-004',
    name: 'Nusrat Jahan',
    email: 'nusrat.j@email.com',
    phone: '+880 1712-345681',
    appliedForRef: 'VAC-2025-004',
    appliedForTitle: 'HR Officer',
    department: 'HR',
    experienceYears: 3,
    highestDegree: 'MBA',
    university: 'BRAC',
    cgpa: 3.70,
    resumeUrl: 'https://example.com/resumes/nusrat.pdf',
    status: 'Shortlisted',
    scorecard: { screen: 80, interview: 0, final: 0 },
    tags: ['Recruitment', 'HRIS', 'Employee Relations'],
    notes: 'HR experience in education sector',
    history: [
      { date: '2025-10-17', action: 'Applied', by: 'System', remarks: 'Application received' },
      { date: '2025-10-22', action: 'Screened', by: 'HR Manager', remarks: 'Relevant experience' },
      { date: '2025-10-24', action: 'Shortlisted', by: 'HR Manager', remarks: 'Education sector background' }
    ]
  },
  {
    id: 'CAN-005',
    trackingNo: 'TRK-2025-005',
    name: 'Imran Hossain',
    email: 'imran.h@email.com',
    phone: '+880 1812-345682',
    appliedForRef: 'VAC-2025-005',
    appliedForTitle: 'Accounts Officer',
    department: 'Accounts',
    experienceYears: 4,
    highestDegree: 'MBA',
    university: 'DU',
    cgpa: 3.80,
    resumeUrl: 'https://example.com/resumes/imran.pdf',
    status: 'Accepted',
    scorecard: { screen: 85, interview: 87, final: 86 },
    tags: ['CA', 'Audit', 'ERP'],
    notes: 'CA certified, strong accounting background',
    history: [
      { date: '2025-09-25', action: 'Applied', by: 'System', remarks: 'Application received' },
      { date: '2025-09-30', action: 'Screened', by: 'HR Officer', remarks: 'CA certification verified' },
      { date: '2025-10-05', action: 'Shortlisted', by: 'Chief Accountant', remarks: 'Strong profile' },
      { date: '2025-10-12', action: 'Interviewed', by: 'Interview Panel', remarks: 'Excellent technical knowledge' },
      { date: '2025-10-18', action: 'Offered', by: 'Registrar', remarks: 'Offer letter sent' },
      { date: '2025-10-22', action: 'Accepted', by: 'Candidate', remarks: 'Offer accepted, joining Nov 1' }
    ]
  },
  {
    id: 'CAN-006',
    trackingNo: 'TRK-2025-006',
    name: 'Sabbir Ahmed',
    email: 'sabbir.a@email.com',
    phone: '+880 1912-345683',
    appliedForRef: 'VAC-2025-006',
    appliedForTitle: 'IT Support Engineer',
    department: 'IT',
    experienceYears: 2,
    highestDegree: 'BSc',
    university: 'AIUB',
    cgpa: 3.20,
    resumeUrl: 'https://example.com/resumes/sabbir.pdf',
    status: 'Screened',
    scorecard: { screen: 65, interview: 0, final: 0 },
    tags: ['Network', 'CCNA'],
    notes: 'CCNA certified, but limited experience',
    history: [
      { date: '2025-10-12', action: 'Applied', by: 'System', remarks: 'Application received' },
      { date: '2025-10-18', action: 'Screened', by: 'IT Manager', remarks: 'Meets minimum requirements' }
    ]
  },
  {
    id: 'CAN-007',
    trackingNo: 'TRK-2025-007',
    name: 'Ayesha Rahman',
    email: 'ayesha.r@email.com',
    phone: '+880 1712-345684',
    appliedForRef: 'VAC-2025-003',
    appliedForTitle: 'Senior Lecturer (CSE)',
    department: 'CSE',
    experienceYears: 7,
    highestDegree: 'PhD',
    university: 'KUET',
    cgpa: 3.90,
    portfolioUrl: 'https://scholar.google.com/ayesha',
    resumeUrl: 'https://example.com/resumes/ayesha.pdf',
    status: 'Offered',
    scorecard: { screen: 92, interview: 95, final: 93.5 },
    tags: ['AI', 'NLP', 'Publications'],
    notes: 'Outstanding research record, 15+ publications',
    history: [
      { date: '2025-09-20', action: 'Applied', by: 'System', remarks: 'Application received' },
      { date: '2025-09-24', action: 'Screened', by: 'HR Officer', remarks: 'Exceptional qualifications' },
      { date: '2025-09-28', action: 'Shortlisted', by: 'Dr. Rahman', remarks: 'Top tier candidate' },
      { date: '2025-10-08', action: 'Interviewed', by: 'Interview Panel', remarks: 'Excellent presentation' },
      { date: '2025-10-12', action: 'Offered', by: 'VC', remarks: 'Priority offer sent' }
    ]
  },
  {
    id: 'CAN-008',
    trackingNo: 'TRK-2025-008',
    name: 'Kamal Uddin',
    email: 'kamal.u@email.com',
    phone: '+880 1812-345685',
    appliedForRef: 'VAC-2025-007',
    appliedForTitle: 'Lab Instructor (CSE)',
    department: 'CSE',
    experienceYears: 1,
    highestDegree: 'BSc',
    university: 'NSU',
    cgpa: 3.50,
    resumeUrl: 'https://example.com/resumes/kamal.pdf',
    status: 'Applied',
    scorecard: { screen: 0, interview: 0, final: 0 },
    tags: ['Java', 'Python'],
    notes: 'Fresh graduate, strong programming skills',
    history: [
      { date: '2025-10-13', action: 'Applied', by: 'System', remarks: 'Application received' }
    ]
  },
  {
    id: 'CAN-009',
    trackingNo: 'TRK-2025-009',
    name: 'Farhana Akter',
    email: 'farhana.a@email.com',
    phone: '+880 1912-345686',
    appliedForRef: 'VAC-2025-009',
    appliedForTitle: 'Assistant Professor (BBA)',
    department: 'BBA',
    experienceYears: 4,
    highestDegree: 'PhD',
    university: 'DU',
    cgpa: 3.78,
    resumeUrl: 'https://example.com/resumes/farhana.pdf',
    status: 'Shortlisted',
    scorecard: { screen: 83, interview: 0, final: 0 },
    tags: ['Finance', 'Banking', 'Research'],
    notes: 'Banking sector + academic experience',
    history: [
      { date: '2025-09-28', action: 'Applied', by: 'System', remarks: 'Application received' },
      { date: '2025-10-02', action: 'Screened', by: 'HR Officer', remarks: 'Strong credentials' },
      { date: '2025-10-06', action: 'Shortlisted', by: 'Dr. Khaleda', remarks: 'Finance specialization needed' }
    ]
  },
  {
    id: 'CAN-010',
    trackingNo: 'TRK-2025-010',
    name: 'Tanvir Islam',
    email: 'tanvir.i@email.com',
    phone: '+880 1712-345687',
    appliedForRef: 'VAC-2025-001',
    appliedForTitle: 'Assistant Professor (CSE)',
    department: 'CSE',
    experienceYears: 1,
    highestDegree: 'MSc',
    university: 'SUST',
    cgpa: 3.45,
    resumeUrl: 'https://example.com/resumes/tanvir.pdf',
    status: 'Rejected',
    scorecard: { screen: 55, interview: 0, final: 0 },
    tags: [],
    notes: 'Does not meet PhD requirement',
    history: [
      { date: '2025-10-16', action: 'Applied', by: 'System', remarks: 'Application received' },
      { date: '2025-10-21', action: 'Screened', by: 'HR Officer', remarks: 'Missing PhD qualification' },
      { date: '2025-10-22', action: 'Rejected', by: 'HR Manager', remarks: 'Does not meet minimum requirements' }
    ]
  }
]

// Add 10 more candidates for completeness (shortened for brevity)
for (let i = 11; i <= 25; i++) {
  const vacRefs = ['VAC-2025-001', 'VAC-2025-002', 'VAC-2025-003', 'VAC-2025-006', 'VAC-2025-007', 'VAC-2025-009', 'VAC-2025-010']
  const statuses: Candidate['status'][] = ['Applied', 'Screened', 'Shortlisted', 'Interviewed', 'Rejected']
  const depts = ['CSE', 'BBA', 'IT', 'Admission', 'HR']
  const universities = ['BUET', 'DU', 'KUET', 'SUST', 'NSU', 'BRAC', 'AIUB', 'UIU']

  const vacRef = vacRefs[i % vacRefs.length]
  const dept = depts[i % depts.length]

  RECRUITMENT_CANDIDATES.push({
    id: `CAN-${String(i).padStart(3, '0')}`,
    trackingNo: `TRK-2025-${String(i).padStart(3, '0')}`,
    name: `Candidate ${i}`,
    email: `candidate${i}@email.com`,
    phone: `+880 17${String(10000000 + i)}`,
    appliedForRef: vacRef,
    appliedForTitle: RECRUITMENT_VACANCIES.find(v => v.ref === vacRef)?.title || 'Position',
    department: dept,
    experienceYears: Math.floor(Math.random() * 8) + 1,
    highestDegree: i % 3 === 0 ? 'PhD' : i % 2 === 0 ? 'MSc' : 'MBA',
    university: universities[i % universities.length],
    cgpa: 2.80 + Math.random() * 1.2,
    resumeUrl: `https://example.com/resumes/candidate${i}.pdf`,
    status: statuses[i % statuses.length],
    scorecard: { screen: Math.floor(Math.random() * 40) + 60, interview: 0, final: 0 },
    tags: [],
    notes: `Additional candidate ${i} for testing`,
    history: [
      { date: `2025-10-${String(10 + (i % 18)).padStart(2, '0')}`, action: 'Applied', by: 'System', remarks: 'Application received' }
    ]
  })
}

export const INTERVIEW_PANELS: InterviewPanel[] = [
  {
    panelId: 'PNL-001',
    vacancyRef: 'VAC-2025-001',
    panelName: 'CSE Faculty Selection Panel',
    members: [
      { empId: 'EMP-2025-010', name: 'Prof. Dr. Rahim Uddin', designation: 'Dean', dept: 'CSE' },
      { empId: 'EMP-2025-006', name: 'Dr. Farhan Chowdhury', designation: 'Professor', dept: 'CSE' },
      { empId: 'EMP-2025-001', name: 'Dr. Ayesha Karim', designation: 'Associate Professor', dept: 'CSE' }
    ],
    slots: [
      {
        slotId: 'SLOT-001',
        date: '2025-10-27',
        start: '10:00',
        end: '12:00',
        room: 'Meeting Room 301',
        mode: 'In-person',
        candidates: ['CAN-003']
      },
      {
        slotId: 'SLOT-002',
        date: '2025-10-28',
        start: '14:00',
        end: '16:00',
        room: 'Zoom Meeting',
        mode: 'Online',
        candidates: ['CAN-001']
      }
    ]
  },
  {
    panelId: 'PNL-002',
    vacancyRef: 'VAC-2025-002',
    panelName: 'BBA Faculty Selection Panel',
    members: [
      { empId: 'EMP-2025-011', name: 'Dr. Khaleda Rahman', designation: 'Dean', dept: 'BBA' },
      { empId: 'EMP-2025-008', name: 'Rafiqul Islam', designation: 'Assistant Professor', dept: 'BBA' }
    ],
    slots: [
      {
        slotId: 'SLOT-003',
        date: '2025-10-28',
        start: '10:00',
        end: '12:00',
        room: 'Meeting Room 205',
        mode: 'In-person',
        candidates: ['CAN-002']
      }
    ]
  },
  {
    panelId: 'PNL-003',
    vacancyRef: 'VAC-2025-003',
    panelName: 'CSE Senior Faculty Panel',
    members: [
      { empId: 'EMP-2025-010', name: 'Prof. Dr. Rahim Uddin', designation: 'Dean', dept: 'CSE' },
      { empId: 'EMP-2025-006', name: 'Dr. Farhan Chowdhury', designation: 'Professor', dept: 'CSE' }
    ],
    slots: [
      {
        slotId: 'SLOT-004',
        date: '2025-10-08',
        start: '09:00',
        end: '11:00',
        room: 'Dean\'s Office',
        mode: 'In-person',
        candidates: ['CAN-007']
      }
    ]
  }
]

export const OFFER_LETTERS: OfferLetter[] = [
  {
    offerId: 'OFF-001',
    candidateId: 'CAN-003',
    vacancyRef: 'VAC-2025-001',
    offeredDesignation: 'Assistant Professor',
    grade: 'G-7',
    baseSalary: 65000,
    allowances: { house: 15000, medical: 5000, transport: 3000, other: 2000 },
    contractType: 'Permanent',
    joiningDate: '2025-12-01',
    location: 'Permanent Campus, Dhaka',
    status: 'Sent',
    offerPdfUrl: 'https://example.com/offers/OFF-001.pdf',
    notes: 'Priority candidate, offer sent with expedited timeline'
  },
  {
    offerId: 'OFF-002',
    candidateId: 'CAN-005',
    vacancyRef: 'VAC-2025-005',
    offeredDesignation: 'Accounts Officer',
    grade: 'G-4',
    baseSalary: 38000,
    allowances: { house: 8000, medical: 3000, transport: 2000, other: 1000 },
    contractType: 'Permanent',
    joiningDate: '2025-11-01',
    location: 'Permanent Campus, Dhaka',
    status: 'Accepted',
    offerPdfUrl: 'https://example.com/offers/OFF-002.pdf',
    notes: 'Offer accepted, proceeding to onboarding'
  },
  {
    offerId: 'OFF-003',
    candidateId: 'CAN-007',
    vacancyRef: 'VAC-2025-003',
    offeredDesignation: 'Senior Lecturer',
    grade: 'G-8',
    baseSalary: 75000,
    allowances: { house: 18000, medical: 6000, transport: 4000, other: 2000 },
    contractType: 'Permanent',
    joiningDate: '2025-11-15',
    location: 'Permanent Campus, Dhaka',
    status: 'Sent',
    offerPdfUrl: 'https://example.com/offers/OFF-003.pdf',
    notes: 'Top candidate, competitive offer package'
  }
]

export const ONBOARDING_RECORDS: OnboardingRecord[] = [
  {
    onbId: 'ONB-001',
    candidateId: 'CAN-005',
    vacancyRef: 'VAC-2025-005',
    checklist: [
      { key: 'docs', label: 'All documents received', status: 'Done', remarks: 'Received on Oct 25' },
      { key: 'medical', label: 'Medical clearance', status: 'Done', remarks: 'Medical fit certificate attached' },
      { key: 'induction', label: 'Induction scheduled', status: 'Done', remarks: 'Scheduled for Nov 1, 10 AM' },
      { key: 'mentor', label: 'Mentor assigned', status: 'Done', remarks: 'Jahangir Kabir assigned as mentor' },
      { key: 'it', label: 'IT account created', status: 'Done', remarks: 'Email: imran.h@nub.edu.bd created' },
      { key: 'idCard', label: 'ID card requested', status: 'Pending', remarks: 'Photo submitted, printing in progress' }
    ],
    convertedEmployee: {
      employeeId: 'EMP-2025-014',
      designation: 'Accounts Officer',
      department: 'Accounts',
      joiningDate: '2025-11-01',
      supervisor: 'EMP-2025-013',
      employeeType: 'Admin'
    },
    status: 'Completed',
    lastUpdated: '2025-10-30',
    assignedMentor: 'Jahangir Kabir',
    supervisor: 'Jahangir Kabir'
  },
  {
    onbId: 'ONB-002',
    candidateId: 'CAN-003',
    vacancyRef: 'VAC-2025-001',
    checklist: [
      { key: 'docs', label: 'All documents received', status: 'Done', remarks: 'All academic credentials verified' },
      { key: 'medical', label: 'Medical clearance', status: 'Done', remarks: 'Medical checkup completed' },
      { key: 'induction', label: 'Induction scheduled', status: 'Pending', remarks: 'To be scheduled after acceptance' },
      { key: 'mentor', label: 'Mentor assigned', status: 'Pending', remarks: 'Awaiting acceptance confirmation' },
      { key: 'it', label: 'IT account created', status: 'Pending', remarks: 'Will create upon joining confirmation' },
      { key: 'idCard', label: 'ID card requested', status: 'Pending', remarks: 'Pending' }
    ],
    status: 'In Progress',
    lastUpdated: '2025-10-30',
    supervisor: 'Prof. Dr. Rahim Uddin'
  },
  {
    onbId: 'ONB-003',
    candidateId: 'CAN-007',
    vacancyRef: 'VAC-2025-003',
    checklist: [
      { key: 'docs', label: 'All documents received', status: 'Done', remarks: 'PhD certificates and publications received' },
      { key: 'medical', label: 'Medical clearance', status: 'Done', remarks: 'Health certificate on file' },
      { key: 'induction', label: 'Induction scheduled', status: 'Pending', remarks: 'Will schedule post-acceptance' },
      { key: 'mentor', label: 'Mentor assigned', status: 'Pending', remarks: 'Dean to assign' },
      { key: 'it', label: 'IT account created', status: 'Pending', remarks: 'Pending' },
      { key: 'idCard', label: 'ID card requested', status: 'Pending', remarks: 'Pending' }
    ],
    status: 'In Progress',
    lastUpdated: '2025-10-12',
    assignedMentor: 'Dr. Farhan Chowdhury',
    supervisor: 'Prof. Dr. Rahim Uddin'
  }
]
