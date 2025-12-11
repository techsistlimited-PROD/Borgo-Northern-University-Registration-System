// HRM.5 Static Demo Data - Training, ESS, Notices, Compliance

export type TrainingProgram = {
  id: string
  title: string
  type: 'Workshop' | 'Seminar' | 'Course'
  dept: string
  audience: 'Faculty' | 'Admin' | 'All'
  durationDays: number
  startDate: string
  endDate: string
  trainer: string
  mode: 'Online' | 'On-site'
  capacity: number
  registered: number
  status: 'Upcoming' | 'Ongoing' | 'Completed'
  location: string
  description?: string
}

export type TrainingSession = {
  id: string
  trainingId: string
  date: string
  startTime: string
  endTime: string
  room: string
  slotCode: string
}

export type Nomination = {
  id: string
  trainingId: string
  empId: string
  empName: string
  dept: string
  designation: string
  status: 'Nominated' | 'Approved' | 'Rejected'
  attended: boolean
  attendanceNote?: string
}

export type TrainingEvaluation = {
  id: string
  trainingId: string
  empId: string
  empName: string
  rating: number
  feedback: string
  improvementObserved: 'Yes' | 'No'
  followUp: 'Coaching' | 'None' | 'Re-Training'
  submittedAt: string
}

export type Certificate = {
  id: string
  trainingId: string
  empId: string
  empName: string
  certificateNo: string
  issuedOn: string
  fileUrl: string
  status: 'Generated' | 'Pending'
}

export type ESSEmployee = {
  id: string
  code: string
  name: string
  email: string
  phone: string
  gender: string
  dob: string
  bloodGroup: string
  nid: string
  presentAddress: string
  permanentAddress: string
  maritalStatus: string
  emergencyContact: {
    name: string
    relation: string
    phone: string
  }
  dept: string
  designation: string
  joiningDate: string
  employmentType: string
  grade: string
  photoUrl: string
  bank: {
    name: string
    account: string
  }
  taxId: string
}

export type LeaveBalance = {
  casual: number
  medical: number
  earned: number
  maternity: number
  duty: number
  study: number
  semesterBreak: number
}

export type LeaveRequest = {
  id: string
  type: string
  from: string
  to: string
  days: number
  reason: string
  status: 'Pending' | 'Approved' | 'Rejected'
  approver: string
  appliedOn: string
}

export type AttendanceRecord = {
  date: string
  inTime: string
  outTime: string
  status: 'Present' | 'Absent' | 'Late' | 'WFH' | 'Leave'
  remarks?: string
}

export type Payslip = {
  month: string
  year: number
  basic: number
  houseRent: number
  medical: number
  transport: number
  other: number
  pf: number
  tax: number
  loan: number
  net: number
  pdfUrl: string
}

export type TaxCertificate = {
  year: number
  gross: number
  taxable: number
  taxPaid: number
  pdfUrl: string
}

export type Loan = {
  id: string
  type: 'Loan' | 'Advance'
  principal: number
  issuedOn: string
  tenureMonths: number
  emi: number
  paidInstallments: number
  balance: number
  status: 'Active' | 'Closed'
}

export type SelfAppraisal = {
  period: string
  kpiScore: number
  peer: number
  supervisor: number
  final: number
  outcome: 'Increment' | 'Promotion' | 'Training' | 'NA'
  reportUrl: string
}

export type TrainingAttended = {
  trainingId: string
  title: string
  score?: number
  certificateUrl: string
}

export type Notice = {
  id: string
  title: string
  type: 'Holiday' | 'Exam' | 'Academic' | 'HR' | 'Accounts' | 'General'
  body: string
  attachments: { name: string; url: string }[]
  audience: 'Students' | 'Faculty' | 'Employees' | 'All'
  target: string[]
  expiry: string
  status: 'Draft' | 'Published' | 'Archived'
  pinned: boolean
  publishedOn: string
}

export type InboxItem = {
  noticeId: string
  read: boolean
  acknowledged: boolean
  ackAt?: string
  requireAck: boolean
}

export type TaxLedger = {
  month: string
  year: number
  gross: number
  taxable: number
  tds: number
  adjustment: number
  netAfterTax: number
}

export type PFLedger = {
  month: string
  year: number
  employee: number
  employer: number
  opening: number
  closing: number
}

export type GratuityAccrual = {
  year: number
  opening: number
  accrual: number
  utilization: number
  closing: number
}

// Static Data

export const TRAINING_PROGRAMS: TrainingProgram[] = [
  {
    id: 'TRN-001',
    title: 'Outcome-Based Education (OBE) Workshop',
    type: 'Workshop',
    dept: 'CSE',
    audience: 'Faculty',
    durationDays: 2,
    startDate: '2025-02-10',
    endDate: '2025-02-11',
    trainer: 'Dr. Rahman Ahmed',
    mode: 'On-site',
    capacity: 30,
    registered: 28,
    status: 'Upcoming',
    location: 'Seminar Hall A',
    description: 'Comprehensive workshop on implementing OBE framework'
  },
  {
    id: 'TRN-002',
    title: 'Advanced Excel for Finance',
    type: 'Course',
    dept: 'Accounts',
    audience: 'Admin',
    durationDays: 1,
    startDate: '2024-12-15',
    endDate: '2024-12-15',
    trainer: 'Mr. Karim Uddin',
    mode: 'Online',
    capacity: 25,
    registered: 25,
    status: 'Completed',
    location: 'Zoom',
    description: 'Advanced Excel techniques for financial reporting'
  },
  {
    id: 'TRN-003',
    title: 'Classroom Management Skills',
    type: 'Workshop',
    dept: 'BBA',
    audience: 'Faculty',
    durationDays: 1,
    startDate: '2025-01-20',
    endDate: '2025-01-20',
    trainer: 'Dr. Nasrin Sultana',
    mode: 'On-site',
    capacity: 35,
    registered: 32,
    status: 'Ongoing',
    location: 'Room 501',
    description: 'Interactive session on modern classroom management'
  },
  {
    id: 'TRN-004',
    title: 'Research Methodology & Publication',
    type: 'Seminar',
    dept: 'CSE',
    audience: 'Faculty',
    durationDays: 3,
    startDate: '2024-11-05',
    endDate: '2024-11-07',
    trainer: 'Prof. Dr. Hasan Ali',
    mode: 'On-site',
    capacity: 40,
    registered: 38,
    status: 'Completed',
    location: 'Auditorium',
    description: 'Research paper writing and publication strategies'
  },
  {
    id: 'TRN-005',
    title: 'HR Compliance & Labor Laws',
    type: 'Workshop',
    dept: 'HR',
    audience: 'Admin',
    durationDays: 2,
    startDate: '2025-02-01',
    endDate: '2025-02-02',
    trainer: 'Adv. Shahnaz Begum',
    mode: 'On-site',
    capacity: 20,
    registered: 18,
    status: 'Upcoming',
    location: 'Conference Room',
    description: 'Legal compliance in HR operations'
  },
  {
    id: 'TRN-006',
    title: 'Digital Marketing for Education',
    type: 'Course',
    dept: 'Marketing',
    audience: 'All',
    durationDays: 2,
    startDate: '2024-12-20',
    endDate: '2024-12-21',
    trainer: 'Mr. Sabbir Rahman',
    mode: 'Online',
    capacity: 50,
    registered: 45,
    status: 'Completed',
    location: 'Google Meet',
    description: 'Modern digital marketing strategies'
  },
  {
    id: 'TRN-007',
    title: 'Leadership & Team Management',
    type: 'Workshop',
    dept: 'Administration',
    audience: 'All',
    durationDays: 1,
    startDate: '2025-01-25',
    endDate: '2025-01-25',
    trainer: 'Mr. Imran Hossain',
    mode: 'On-site',
    capacity: 30,
    registered: 29,
    status: 'Ongoing',
    location: 'Seminar Hall B',
    description: 'Building effective leadership skills'
  },
  {
    id: 'TRN-008',
    title: 'Data Analytics with Python',
    type: 'Course',
    dept: 'CSE',
    audience: 'Faculty',
    durationDays: 5,
    startDate: '2024-10-15',
    endDate: '2024-10-19',
    trainer: 'Dr. Tanvir Ahmed',
    mode: 'Online',
    capacity: 30,
    registered: 28,
    status: 'Completed',
    location: 'Zoom',
    description: 'Comprehensive Python data analytics training'
  },
  {
    id: 'TRN-009',
    title: 'Student Counseling Techniques',
    type: 'Seminar',
    dept: 'Student Affairs',
    audience: 'Faculty',
    durationDays: 1,
    startDate: '2025-02-15',
    endDate: '2025-02-15',
    trainer: 'Dr. Farhana Islam',
    mode: 'On-site',
    capacity: 25,
    registered: 20,
    status: 'Upcoming',
    location: 'Room 302',
    description: 'Modern counseling approaches for students'
  },
  {
    id: 'TRN-010',
    title: 'Financial Planning & Budgeting',
    type: 'Workshop',
    dept: 'Accounts',
    audience: 'Admin',
    durationDays: 2,
    startDate: '2024-11-20',
    endDate: '2024-11-21',
    trainer: 'Mr. Khalid Mahmud',
    mode: 'On-site',
    capacity: 20,
    registered: 19,
    status: 'Completed',
    location: 'Finance Office',
    description: 'Strategic financial planning techniques'
  }
]

export const TRAINING_SESSIONS: TrainingSession[] = [
  { id: 'SES-001', trainingId: 'TRN-001', date: '2025-02-10', startTime: '09:00', endTime: '13:00', room: 'Seminar Hall A', slotCode: 'M1' },
  { id: 'SES-002', trainingId: 'TRN-001', date: '2025-02-11', startTime: '09:00', endTime: '13:00', room: 'Seminar Hall A', slotCode: 'M1' },
  { id: 'SES-003', trainingId: 'TRN-002', date: '2024-12-15', startTime: '10:00', endTime: '16:00', room: 'Online', slotCode: 'A1' },
  { id: 'SES-004', trainingId: 'TRN-003', date: '2025-01-20', startTime: '14:00', endTime: '18:00', room: 'Room 501', slotCode: 'E1' },
  { id: 'SES-005', trainingId: 'TRN-004', date: '2024-11-05', startTime: '09:00', endTime: '13:00', room: 'Auditorium', slotCode: 'M1' },
  { id: 'SES-006', trainingId: 'TRN-004', date: '2024-11-06', startTime: '09:00', endTime: '13:00', room: 'Auditorium', slotCode: 'M1' },
  { id: 'SES-007', trainingId: 'TRN-004', date: '2024-11-07', startTime: '09:00', endTime: '13:00', room: 'Auditorium', slotCode: 'M1' }
]

// Generate nominations (60+ entries)
const generateNominations = (): Nomination[] => {
  const nominations: Nomination[] = []
  const statuses: Nomination['status'][] = ['Nominated', 'Approved', 'Rejected']
  const designations = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Officer', 'Manager']
  const depts = ['CSE', 'BBA', 'HR', 'Accounts', 'IT', 'Library']
  
  TRAINING_PROGRAMS.forEach((prog, progIdx) => {
    for (let i = 0; i < 8; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const attended = prog.status === 'Completed' ? Math.random() > 0.2 : false
      
      nominations.push({
        id: `NOM-${progIdx}-${i}`,
        trainingId: prog.id,
        empId: `EMP-2025-${(i + 1).toString().padStart(3, '0')}`,
        empName: `Employee ${i + 1}`,
        dept: depts[i % depts.length],
        designation: designations[i % designations.length],
        status,
        attended,
        attendanceNote: attended ? 'Attended full session' : undefined
      })
    }
  })
  
  return nominations
}

export const NOMINATIONS: Nomination[] = generateNominations()

export const TRAINING_EVALUATIONS: TrainingEvaluation[] = [
  {
    id: 'EVAL-001',
    trainingId: 'TRN-002',
    empId: 'EMP-2025-001',
    empName: 'Employee 1',
    rating: 5,
    feedback: 'Excellent training, very practical examples',
    improvementObserved: 'Yes',
    followUp: 'None',
    submittedAt: '2024-12-16'
  },
  {
    id: 'EVAL-002',
    trainingId: 'TRN-002',
    empId: 'EMP-2025-002',
    empName: 'Employee 2',
    rating: 4,
    feedback: 'Good content, need more hands-on practice',
    improvementObserved: 'Yes',
    followUp: 'Coaching',
    submittedAt: '2024-12-16'
  },
  {
    id: 'EVAL-003',
    trainingId: 'TRN-004',
    empId: 'EMP-2025-003',
    empName: 'Employee 3',
    rating: 5,
    feedback: 'Very informative, helped in research planning',
    improvementObserved: 'Yes',
    followUp: 'None',
    submittedAt: '2024-11-08'
  },
  {
    id: 'EVAL-004',
    trainingId: 'TRN-006',
    empId: 'EMP-2025-004',
    empName: 'Employee 4',
    rating: 4,
    feedback: 'Great insights into digital marketing',
    improvementObserved: 'Yes',
    followUp: 'None',
    submittedAt: '2024-12-22'
  },
  {
    id: 'EVAL-005',
    trainingId: 'TRN-008',
    empId: 'EMP-2025-005',
    empName: 'Employee 5',
    rating: 5,
    feedback: 'Comprehensive Python training',
    improvementObserved: 'Yes',
    followUp: 'None',
    submittedAt: '2024-10-20'
  }
]

export const CERTIFICATES: Certificate[] = [
  { id: 'CERT-001', trainingId: 'TRN-002', empId: 'EMP-2025-001', empName: 'Employee 1', certificateNo: 'CERT/2024/12/001', issuedOn: '2024-12-20', fileUrl: '/demo/cert.pdf', status: 'Generated' },
  { id: 'CERT-002', trainingId: 'TRN-004', empId: 'EMP-2025-003', empName: 'Employee 3', certificateNo: 'CERT/2024/11/003', issuedOn: '2024-11-10', fileUrl: '/demo/cert.pdf', status: 'Generated' },
  { id: 'CERT-003', trainingId: 'TRN-006', empId: 'EMP-2025-004', empName: 'Employee 4', certificateNo: 'CERT/2024/12/004', issuedOn: '2024-12-25', fileUrl: '/demo/cert.pdf', status: 'Pending' },
  { id: 'CERT-004', trainingId: 'TRN-008', empId: 'EMP-2025-005', empName: 'Employee 5', certificateNo: 'CERT/2024/10/005', issuedOn: '2024-10-22', fileUrl: '/demo/cert.pdf', status: 'Generated' },
  { id: 'CERT-005', trainingId: 'TRN-010', empId: 'EMP-2025-006', empName: 'Employee 6', certificateNo: 'CERT/2024/11/006', issuedOn: '2024-11-25', fileUrl: '/demo/cert.pdf', status: 'Generated' }
]

// ESS Data
export const CURRENT_EMPLOYEE: ESSEmployee = {
  id: 'EMP-2025-001',
  code: 'E001',
  name: 'Md. Imran Hossain',
  email: 'imran.hossain@northern.edu.bd',
  phone: '+880 1712-345678',
  gender: 'Male',
  dob: '1990-05-15',
  bloodGroup: 'A+',
  nid: '1234567890123',
  presentAddress: 'House 12, Road 5, Banani, Dhaka-1213',
  permanentAddress: 'Village: Madhupur, District: Tangail',
  maritalStatus: 'Married',
  emergencyContact: {
    name: 'Ayesha Hossain',
    relation: 'Spouse',
    phone: '+880 1712-987654'
  },
  dept: 'CSE',
  designation: 'Assistant Professor',
  joiningDate: '2020-01-15',
  employmentType: 'Permanent',
  grade: 'G-7',
  photoUrl: '/demo/avatar.jpg',
  bank: {
    name: 'Dutch Bangla Bank',
    account: '1234567890'
  },
  taxId: 'TIN-123456789'
}

export const ESS_LEAVE_BALANCE: LeaveBalance = {
  casual: 8,
  medical: 12,
  earned: 25,
  maternity: 0,
  duty: 5,
  study: 10,
  semesterBreak: 15
}

export const ESS_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'LR-001',
    type: 'Casual',
    from: '2025-01-28',
    to: '2025-01-29',
    days: 2,
    reason: 'Personal work',
    status: 'Pending',
    approver: 'HOD, CSE',
    appliedOn: '2025-01-20'
  },
  {
    id: 'LR-002',
    type: 'Medical',
    from: '2024-12-10',
    to: '2024-12-12',
    days: 3,
    reason: 'Fever and flu',
    status: 'Approved',
    approver: 'HOD, CSE',
    appliedOn: '2024-12-08'
  },
  {
    id: 'LR-003',
    type: 'Casual',
    from: '2024-11-25',
    to: '2024-11-25',
    days: 1,
    reason: 'Family function',
    status: 'Rejected',
    approver: 'HOD, CSE',
    appliedOn: '2024-11-20'
  }
]

// Generate 30 days attendance
const generateAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = []
  const statuses: AttendanceRecord['status'][] = ['Present', 'Present', 'Present', 'Present', 'Late', 'WFH', 'Leave']
  
  for (let i = 0; i < 30; i++) {
    const date = new Date('2025-01-01')
    date.setDate(date.getDate() + i)
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    
    records.push({
      date: date.toISOString().split('T')[0],
      inTime: status === 'Present' ? '08:30' : status === 'Late' ? '09:15' : '-',
      outTime: status === 'Present' || status === 'Late' ? '16:30' : '-',
      status,
      remarks: status === 'WFH' ? 'Work from home approved' : undefined
    })
  }
  
  return records
}

export const ESS_ATTENDANCE: AttendanceRecord[] = generateAttendance()

export const ESS_PAYSLIPS: Payslip[] = [
  {
    month: 'December',
    year: 2024,
    basic: 45000,
    houseRent: 22500,
    medical: 6000,
    transport: 3500,
    other: 5000,
    pf: 8200,
    tax: 9840,
    loan: 0,
    net: 63960,
    pdfUrl: '/demo/payslip-dec-2024.pdf'
  },
  {
    month: 'November',
    year: 2024,
    basic: 45000,
    houseRent: 22500,
    medical: 6000,
    transport: 3500,
    other: 5000,
    pf: 8200,
    tax: 9840,
    loan: 0,
    net: 63960,
    pdfUrl: '/demo/payslip-nov-2024.pdf'
  },
  {
    month: 'October',
    year: 2024,
    basic: 45000,
    houseRent: 22500,
    medical: 6000,
    transport: 3500,
    other: 5000,
    pf: 8200,
    tax: 9840,
    loan: 0,
    net: 63960,
    pdfUrl: '/demo/payslip-oct-2024.pdf'
  }
]

export const ESS_TAX_CERTIFICATES: TaxCertificate[] = [
  {
    year: 2024,
    gross: 984000,
    taxable: 884000,
    taxPaid: 118080,
    pdfUrl: '/demo/tax-cert-2024.pdf'
  },
  {
    year: 2023,
    gross: 960000,
    taxable: 860000,
    taxPaid: 115200,
    pdfUrl: '/demo/tax-cert-2023.pdf'
  }
]

export const ESS_LOANS: Loan[] = [
  {
    id: 'LOAN-001',
    type: 'Loan',
    principal: 50000,
    issuedOn: '2024-06-01',
    tenureMonths: 12,
    emi: 4500,
    paidInstallments: 7,
    balance: 22500,
    status: 'Active'
  },
  {
    id: 'ADV-001',
    type: 'Advance',
    principal: 10000,
    issuedOn: '2024-12-01',
    tenureMonths: 3,
    emi: 3500,
    paidInstallments: 1,
    balance: 7000,
    status: 'Active'
  }
]

export const ESS_APPRAISALS: SelfAppraisal[] = [
  {
    period: '2024 Annual',
    kpiScore: 86,
    peer: 4.4,
    supervisor: 4.6,
    final: 87,
    outcome: 'Increment',
    reportUrl: '/demo/appraisal-2024.pdf'
  },
  {
    period: '2023 Annual',
    kpiScore: 82,
    peer: 4.2,
    supervisor: 4.3,
    final: 83,
    outcome: 'Increment',
    reportUrl: '/demo/appraisal-2023.pdf'
  }
]

export const ESS_TRAININGS_ATTENDED: TrainingAttended[] = [
  { trainingId: 'TRN-004', title: 'Research Methodology & Publication', score: 5, certificateUrl: '/demo/cert-trn004.pdf' },
  { trainingId: 'TRN-008', title: 'Data Analytics with Python', score: 5, certificateUrl: '/demo/cert-trn008.pdf' }
]

// Notices
export const NOTICES: Notice[] = [
  {
    id: 'NOT-001',
    title: 'University Closed for Victory Day',
    type: 'Holiday',
    body: 'The university will remain closed on December 16, 2024 in observance of Victory Day.',
    attachments: [],
    audience: 'All',
    target: ['All'],
    expiry: '2024-12-16',
    status: 'Published',
    pinned: true,
    publishedOn: '2024-12-01'
  },
  {
    id: 'NOT-002',
    title: 'Final Exam Schedule Published',
    type: 'Exam',
    body: 'Final exam schedule for Fall 2024 semester has been published. Please check the academic portal.',
    attachments: [{ name: 'exam-schedule.pdf', url: '/demo/exam-schedule.pdf' }],
    audience: 'Students',
    target: ['All'],
    expiry: '2025-01-31',
    status: 'Published',
    pinned: true,
    publishedOn: '2024-12-20'
  },
  {
    id: 'NOT-003',
    title: 'Salary Disbursement - December 2024',
    type: 'HR',
    body: 'December 2024 salary has been disbursed to all employees. Please check your bank accounts.',
    attachments: [],
    audience: 'Employees',
    target: ['Faculty', 'Admin'],
    expiry: '2025-01-05',
    status: 'Published',
    pinned: false,
    publishedOn: '2024-12-28'
  },
  {
    id: 'NOT-004',
    title: 'Training: OBE Workshop Registration Open',
    type: 'HR',
    body: 'Registration is now open for the Outcome-Based Education workshop scheduled for February 10-11, 2025.',
    attachments: [],
    audience: 'Faculty',
    target: ['Faculty'],
    expiry: '2025-02-08',
    status: 'Published',
    pinned: true,
    publishedOn: '2025-01-15'
  },
  {
    id: 'NOT-005',
    title: 'Pending Fee Payment Reminder',
    type: 'Accounts',
    body: 'Students with pending fee payments must clear dues by January 31, 2025 to avoid late fees.',
    attachments: [],
    audience: 'Students',
    target: ['All'],
    expiry: '2025-01-31',
    status: 'Published',
    pinned: false,
    publishedOn: '2025-01-10'
  },
  {
    id: 'NOT-006',
    title: 'Spring 2025 Semester Registration',
    type: 'Academic',
    body: 'Spring 2025 semester registration will open on February 1, 2025. Students are advised to complete course advising.',
    attachments: [],
    audience: 'Students',
    target: ['All'],
    expiry: '2025-02-15',
    status: 'Published',
    pinned: false,
    publishedOn: '2025-01-18'
  },
  {
    id: 'NOT-007',
    title: 'Campus Maintenance Notice',
    type: 'General',
    body: 'Campus will undergo maintenance work on Saturday, January 25. Some areas may be inaccessible.',
    attachments: [],
    audience: 'All',
    target: ['All'],
    expiry: '2025-01-25',
    status: 'Published',
    pinned: false,
    publishedOn: '2025-01-20'
  },
  {
    id: 'NOT-008',
    title: 'Library Hours Extended',
    type: 'Academic',
    body: 'Library hours have been extended to 10 PM during exam period (January 15 - February 5).',
    attachments: [],
    audience: 'All',
    target: ['All'],
    expiry: '2025-02-05',
    status: 'Published',
    pinned: false,
    publishedOn: '2025-01-12'
  },
  {
    id: 'NOT-009',
    title: 'Emergency Contact Update Required',
    type: 'HR',
    body: 'All employees must update their emergency contact information in the ESS portal by January 31.',
    attachments: [],
    audience: 'Employees',
    target: ['Faculty', 'Admin'],
    expiry: '2025-01-31',
    status: 'Published',
    pinned: false,
    publishedOn: '2025-01-05'
  },
  {
    id: 'NOT-010',
    title: 'Research Grant Applications Open',
    type: 'Academic',
    body: 'Research grant applications for 2025 are now open. Deadline: February 28, 2025.',
    attachments: [{ name: 'grant-guidelines.pdf', url: '/demo/grant.pdf' }],
    audience: 'Faculty',
    target: ['Faculty'],
    expiry: '2025-02-28',
    status: 'Published',
    pinned: false,
    publishedOn: '2025-01-10'
  },
  {
    id: 'NOT-011',
    title: 'Summer Vacation Notice',
    type: 'Holiday',
    body: 'University will observe summer vacation from May 1 to May 15, 2025.',
    attachments: [],
    audience: 'All',
    target: ['All'],
    expiry: '2024-12-31',
    status: 'Published',
    pinned: false,
    publishedOn: '2024-11-30'
  },
  {
    id: 'NOT-012',
    title: 'New Policy Draft for Review',
    type: 'General',
    body: 'Draft policy on remote work is available for review and feedback.',
    attachments: [{ name: 'policy-draft.pdf', url: '/demo/policy.pdf' }],
    audience: 'Employees',
    target: ['Faculty', 'Admin'],
    expiry: '2025-03-01',
    status: 'Draft',
    pinned: false,
    publishedOn: ''
  }
]

export const INBOX_ITEMS: InboxItem[] = [
  { noticeId: 'NOT-001', read: true, acknowledged: true, ackAt: '2024-12-02', requireAck: false },
  { noticeId: 'NOT-002', read: true, acknowledged: false, requireAck: false },
  { noticeId: 'NOT-003', read: true, acknowledged: true, ackAt: '2024-12-29', requireAck: true },
  { noticeId: 'NOT-004', read: false, acknowledged: false, requireAck: true },
  { noticeId: 'NOT-009', read: false, acknowledged: false, requireAck: true }
]

// Compliance Data
export const TAX_LEDGER: TaxLedger[] = [
  { month: 'December', year: 2024, gross: 82000, taxable: 73800, tds: 9840, adjustment: 0, netAfterTax: 72160 },
  { month: 'November', year: 2024, gross: 82000, taxable: 73800, tds: 9840, adjustment: 0, netAfterTax: 72160 },
  { month: 'October', year: 2024, gross: 82000, taxable: 73800, tds: 9840, adjustment: 0, netAfterTax: 72160 },
  { month: 'September', year: 2024, gross: 82000, taxable: 73800, tds: 9840, adjustment: 0, netAfterTax: 72160 }
]

export const PF_LEDGER: PFLedger[] = [
  { month: 'December', year: 2024, employee: 8200, employer: 8200, opening: 90000, closing: 106400 },
  { month: 'November', year: 2024, employee: 8200, employer: 8200, opening: 73600, closing: 90000 },
  { month: 'October', year: 2024, employee: 8200, employer: 8200, opening: 57200, closing: 73600 }
]

export const GRATUITY_ACCRUALS: GratuityAccrual[] = [
  { year: 2024, opening: 150000, accrual: 25000, utilization: 0, closing: 175000 },
  { year: 2023, opening: 125000, accrual: 25000, utilization: 0, closing: 150000 },
  { year: 2022, opening: 100000, accrual: 25000, utilization: 0, closing: 125000 }
]
