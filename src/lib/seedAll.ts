import { Repo } from './repo'

export interface Semester {
  id: string
  code: string
  name: string
  idCode: string
  startDate: string
  endDate: string
  status: 'Draft' | 'Active' | 'Closed'
}

export interface Campus {
  id: string
  code: string
  name: string
  address: string
}

export interface Program {
  id: string
  code: string
  name: string
  level: 'Undergraduate' | 'Graduate'
  system: 'bi-semester' | 'tri-semester'
  duration: number
  durationUnit: string
  totalCredits: number
  deptCode: string
}

export interface Department {
  id: string
  code: string
  name: string
}

export interface Course {
  id: string
  code: string
  title: string
  credit: number
  type: 'Core' | 'Major' | 'Elective' | 'Lab'
  program: string
  prereq?: string
}

export interface Faculty {
  id: string
  name: string
  initial: string
  dept: string
  email: string
  phone: string
  designation: string
}

export interface Room {
  id: string
  code: string
  building: string
  floor: number
  capacity: number
  type: 'Classroom' | 'Lab' | 'Exam Hall'
  campus: string
}

export interface ExamSlot {
  id: string
  name: string
  startTime: string
  endTime: string
}

export interface Offering {
  id: string
  courseId: string
  semesterId: string
  campusId: string
  status: 'Draft' | 'Published'
}

export interface Section {
  id: string
  offeringId: string
  code: string
  capacity: number
  enrolled: number
  roomId?: string
  timeslot?: string
  facultyId?: string
  status: 'Draft' | 'Published'
}

export interface ExamSchedule {
  id: string
  sectionId: string
  examType: string
  date: string
  slotId: string
  roomId: string
  status: 'Draft' | 'Locked'
  invigilatorIds: string[]
}

export interface Student {
  id: string
  ugcId: string
  name: string
  program: string
  programName: string
  campusId: string
  email: string
  mobile: string
  batch: string
  semester: string
  cgpa: number
  photoUrl: string
  admitBlocked?: boolean
  blockReason?: string
}

export interface InvigilationAssignment {
  id: string
  examScheduleId: string
  facultyIds: string[]
  status: 'Draft' | 'Confirmed'
  reportingTime: string
}

export interface AdmitCardBlock {
  id: string
  studentId: string
  examScheduleId?: string
  reason: string
  blockedBy: string
  blockedDate: string
}

export interface RecheckAppeal {
  id: string
  studentId: string
  courseId: string
  component: 'Midterm' | 'Final' | 'CA'
  feeAmount: number
  feeStatus: 'Unpaid' | 'Paid' | 'Refunded'
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected'
  reviewerId?: string
  submittedDate: string
  timeline: { date: string; action: string; by: string }[]
}

export interface CostHead {
  id: string
  code: string
  name: string
  type: string
  glAccount: string
  taxable: boolean
  status: 'Active' | 'Inactive'
}

export interface CostPackage {
  id: string
  programId: string
  name: string
  effectiveTerm: string
  status: 'Active' | 'Inactive'
  components: {
    lineNo: number
    costHeadId: string
    rule: 'Flat' | 'Per Credit' | 'Per Course'
    rate: number
    min: number
    max: number
  }[]
}

export interface StudentPayable {
  id: string
  billNo: string
  studentId: string
  semesterId: string
  lines: {
    costHeadId: string
    amount: number
    waiverAmount: number
    scholarshipAmount: number
    netAmount: number
  }[]
  totalAmount: number
  paidAmount: number
  dueAmount: number
  status: 'Draft' | 'Billed' | 'Partially Paid' | 'Paid' | 'Overdue'
  billDate: string
  dueDate: string
}

export interface Receipt {
  id: string
  moneyReceiptNo: string
  studentId: string
  payableId: string
  amount: number
  method: 'Cash' | 'Bank' | 'bKash' | 'Card' | 'SSLCommerz'
  reference: string
  date: string
  collectedBy: string
}

export interface BankStatement {
  id: string
  date: string
  amount: number
  reference: string
  narration: string
  matched: boolean
  receiptId?: string
}

export interface WaiverPolicy {
  id: string
  code: string
  name: string
  type: 'Waiver' | 'Scholarship'
  percent: number
  maxAmount?: number
  criteria: string
  status: 'Active' | 'Inactive'
}

export interface AssignedWaiver {
  id: string
  studentId: string
  policyId: string
  percent: number
  amount?: number
  effectiveTerm: string
  assignedBy: string
  assignedDate: string
  locked: boolean
}

export interface TeacherMaterial {
  id: string
  facultyId: string
  sectionId: string
  title: string
  type: 'PDF' | 'PPT' | 'Link'
  url: string
  uploadedDate: string
}

export interface TeacherAnnouncement {
  id: string
  facultyId: string
  sectionId: string
  title: string
  content: string
  audience: 'All' | 'Section'
  publishedDate: string
}

export interface Guardian {
  id: string
  name: string
  email: string
  mobile: string
  status: 'Active' | 'Inactive'
  preferences?: {
    erpPush: boolean
    sms: boolean
    email: boolean
  }
}

export interface GuardianLink {
  id: string
  guardianId: string
  studentId: string
  relation: 'Father' | 'Mother' | 'Guardian'
  isPrimary: boolean
  createdAt: string
}

export interface AttendanceRecord {
  id: string
  studentId: string
  sectionId: string
  date: string
  status: 'P' | 'A' | 'L'
  recordedAt: string
  facultyId: string
}

export interface Grade {
  id: string
  studentId: string
  courseId: string
  sectionId: string
  termId: string
  grade: string
  gradePoint: number
  credit: number
  remarks?: string
}

export interface TermResult {
  id: string
  studentId: string
  termId: string
  gpa: number
  cgpa: number
  creditsEarned: number
  status: 'Draft' | 'Published'
}

export interface TER {
  id: string
  studentId: string
  termId: string
  status: 'PENDING' | 'SUBMITTED' | 'BLOCKED'
  submittedAt?: string
}

export interface Notification {
  id: string
  recipientId: string
  recipientType: 'STUDENT' | 'GUARDIAN' | 'FACULTY'
  channel: 'ERP' | 'SMS' | 'Email'
  title: string
  message: string
  createdAt: string
  status: 'Unread' | 'Read'
}

export interface LogEntry {
  id: string
  actor: string
  actorRole: string
  type: string
  payload?: any
  timestamp: string
}

function generateStudentID(deptCode: string, year: string, semCode: string, serial: number): string {
  return `${deptCode}${year}${semCode}${serial.toString().padStart(4, '0')}`
}

function generateUGCID(year: string, semCode: string, progCode: string, classSerial: number): string {
  const semCodeUGC = semCode === '01' ? '1' : '2'
  return `029${year}${semCodeUGC}00${progCode.padStart(5, '0')}${classSerial.toString().padStart(3, '0')}`
}

export function seedAll() {
  const seeded = localStorage.getItem('nu-erp-seeded')
  if (seeded === 'true') return

  const semesters: Semester[] = [
    { id: 'SP25', code: 'SP25', name: 'Spring 2025', idCode: '01', startDate: '2025-01-01', endDate: '2025-05-31', status: 'Active' },
    { id: 'SU25', code: 'SU25', name: 'Summer 2025', idCode: '02', startDate: '2025-06-01', endDate: '2025-09-30', status: 'Draft' },
    { id: 'FA25', code: 'FA25', name: 'Fall 2025', idCode: '03', startDate: '2025-10-01', endDate: '2026-01-31', status: 'Active' }
  ]

  const campuses: Campus[] = [
    { id: 'BAN', code: 'BAN', name: 'Banani Campus', address: 'Banani, Dhaka' },
    { id: 'DHM', code: 'DHM', name: 'Dhanmondi Campus', address: 'Dhanmondi, Dhaka' },
    { id: 'PRM', code: 'PRM', name: 'Permanent Campus', address: 'Ashulia, Dhaka' }
  ]

  const departments: Department[] = [
    { id: 'CS', code: 'CS', name: 'CSE' },
    { id: 'BB', code: 'BB', name: 'BBA' },
    { id: 'LW', code: 'LW', name: 'LAW' },
    { id: 'MB', code: 'MB', name: 'MBA' }
  ]

  const programs: Program[] = [
    { id: 'BBA', code: 'BBA', name: 'BBA in Accounting & Finance', level: 'Undergraduate', system: 'bi-semester', duration: 8, durationUnit: 'Semester', totalCredits: 126, deptCode: 'BB' },
    { id: 'CSE', code: 'CSE', name: 'BSc in Computer Science & Engg.', level: 'Undergraduate', system: 'tri-semester', duration: 12, durationUnit: 'Trimester', totalCredits: 160, deptCode: 'CS' },
    { id: 'LLB', code: 'LLB', name: 'LLB (Hons)', level: 'Undergraduate', system: 'bi-semester', duration: 8, durationUnit: 'Semester', totalCredits: 132, deptCode: 'LW' },
    { id: 'MBA', code: 'MBA', name: 'MBA in Marketing', level: 'Graduate', system: 'tri-semester', duration: 4, durationUnit: 'Trimester', totalCredits: 60, deptCode: 'MB' }
  ]

  const rooms: Room[] = [
    { id: 'AT303', code: 'AT-303', building: 'Academic Tower A', floor: 3, capacity: 48, type: 'Classroom', campus: 'PRM' },
    { id: 'AT305', code: 'AT-305', building: 'Academic Tower A', floor: 3, capacity: 120, type: 'Exam Hall', campus: 'PRM' },
    { id: 'SBN105', code: 'SB-N105', building: 'Science Block North', floor: 1, capacity: 32, type: 'Lab', campus: 'PRM' },
    { id: 'DHC201', code: 'DHC-201', building: 'Dhaka Campus Main', floor: 2, capacity: 60, type: 'Classroom', campus: 'DHM' },
    { id: 'BAN401', code: 'BAN-401', building: 'Banani Tower', floor: 4, capacity: 80, type: 'Exam Hall', campus: 'BAN' }
  ]

  const examSlots: ExamSlot[] = [
    { id: 'MORN', name: 'Morning', startTime: '09:00', endTime: '11:00' },
    { id: 'AFT', name: 'Afternoon', startTime: '13:00', endTime: '15:00' },
    { id: 'EVE', name: 'Evening', startTime: '16:00', endTime: '18:00' }
  ]

  const faculty: Faculty[] = [
    { id: 'F001', name: 'Dr. Nusrat Jahan', initial: 'NJ', dept: 'CS', email: 'nusrat.jahan@nu.edu.bd', phone: '01711111001', designation: 'Professor' },
    { id: 'F002', name: 'Engr. Shakil Rahman', initial: 'SR', dept: 'CS', email: 'shakil.rahman@nu.edu.bd', phone: '01711111002', designation: 'Lecturer' },
    { id: 'F003', name: 'Dr. Tanvir Hasan', initial: 'TH', dept: 'CS', email: 'tanvir.hasan@nu.edu.bd', phone: '01711111003', designation: 'Associate Professor' },
    { id: 'F004', name: 'Fahmida Karim', initial: 'FK', dept: 'CS', email: 'fahmida.karim@nu.edu.bd', phone: '01711111004', designation: 'Assistant Professor' },
    { id: 'F005', name: 'Prof. Nazmul Karim', initial: 'NK', dept: 'BB', email: 'nazmul.karim@nu.edu.bd', phone: '01711111005', designation: 'Professor' },
    { id: 'F006', name: 'Farzana Kabir', initial: 'FKa', dept: 'BB', email: 'farzana.kabir@nu.edu.bd', phone: '01711111006', designation: 'Senior Lecturer' },
    { id: 'F007', name: 'Sharmin Akter', initial: 'SA', dept: 'BB', email: 'sharmin.akter@nu.edu.bd', phone: '01711111007', designation: 'Lecturer' },
    { id: 'F008', name: 'Barr. Fahmida Anwar', initial: 'FA', dept: 'LW', email: 'fahmida.anwar@nu.edu.bd', phone: '01711111008', designation: 'Professor' },
    { id: 'F009', name: 'Adv. Kamal Hossain', initial: 'KH', dept: 'LW', email: 'kamal.hossain@nu.edu.bd', phone: '01711111009', designation: 'Associate Professor' },
    { id: 'F010', name: 'Dr. Rashida Sultana', initial: 'RS', dept: 'LW', email: 'rashida.sultana@nu.edu.bd', phone: '01711111010', designation: 'Assistant Professor' },
    { id: 'F011', name: 'Prof. Ahmed Khan', initial: 'AK', dept: 'MB', email: 'ahmed.khan@nu.edu.bd', phone: '01711111011', designation: 'Professor' },
    { id: 'F012', name: 'Dr. Tasnim Rahman', initial: 'TR', dept: 'MB', email: 'tasnim.rahman@nu.edu.bd', phone: '01711111012', designation: 'Associate Professor' },
    { id: 'F013', name: 'Jahangir Alam', initial: 'JA', dept: 'MB', email: 'jahangir.alam@nu.edu.bd', phone: '01711111013', designation: 'Senior Lecturer' },
    { id: 'F014', name: 'Dr. Maliha Zaman', initial: 'MZ', dept: 'CS', email: 'maliha.zaman@nu.edu.bd', phone: '01711111014', designation: 'Assistant Professor' },
    { id: 'F015', name: 'Rashed Kabir', initial: 'RK', dept: 'CS', email: 'rashed.kabir@nu.edu.bd', phone: '01711111015', designation: 'Lecturer' },
    { id: 'F016', name: 'Shamima Nasrin', initial: 'SN', dept: 'BB', email: 'shamima.nasrin@nu.edu.bd', phone: '01711111016', designation: 'Assistant Professor' },
    { id: 'F017', name: 'Adv. Rubina Ferdous', initial: 'RF', dept: 'LW', email: 'rubina.ferdous@nu.edu.bd', phone: '01711111017', designation: 'Lecturer' },
    { id: 'F018', name: 'Dr. Sadia Afrin', initial: 'SAf', dept: 'MB', email: 'sadia.afrin@nu.edu.bd', phone: '01711111018', designation: 'Assistant Professor' },
    { id: 'F019', name: 'Imran Hossain', initial: 'IH', dept: 'CS', email: 'imran.hossain@nu.edu.bd', phone: '01711111019', designation: 'Lecturer' },
    { id: 'F020', name: 'Taslima Akter', initial: 'TA', dept: 'BB', email: 'taslima.akter@nu.edu.bd', phone: '01711111020', designation: 'Lecturer' }
  ]

  const courses: Course[] = [
    { id: 'CSE1101', code: 'CSE1101', title: 'Programming Fundamentals', credit: 3, type: 'Core', program: 'CSE' },
    { id: 'CSE1102', code: 'CSE1102', title: 'Programming Fundamentals Lab', credit: 1, type: 'Lab', program: 'CSE' },
    { id: 'CSE2205', code: 'CSE2205', title: 'Data Structures & Algorithms', credit: 3, type: 'Core', program: 'CSE', prereq: 'CSE1101' },
    { id: 'CSE2206', code: 'CSE2206', title: 'Data Structures Lab', credit: 1, type: 'Lab', program: 'CSE', prereq: 'CSE1102' },
    { id: 'CSE2303', code: 'CSE2303', title: 'Digital Logic Design', credit: 3, type: 'Core', program: 'CSE' },
    { id: 'CSE2304', code: 'CSE2304', title: 'Digital Logic Design Lab', credit: 1, type: 'Lab', program: 'CSE' },
    { id: 'CSE3401', code: 'CSE3401', title: 'Database Management Systems', credit: 3, type: 'Core', program: 'CSE' },
    { id: 'CSE3402', code: 'CSE3402', title: 'Database Management Systems Lab', credit: 1, type: 'Lab', program: 'CSE' },
    { id: 'CSE3501', code: 'CSE3501', title: 'Computer Networks', credit: 3, type: 'Core', program: 'CSE' },
    { id: 'CSE4601', code: 'CSE4601', title: 'Software Engineering', credit: 3, type: 'Core', program: 'CSE' },
    { id: 'BUS1101', code: 'BUS1101', title: 'Principles of Management', credit: 3, type: 'Core', program: 'BBA' },
    { id: 'BUS1201', code: 'BUS1201', title: 'Principles of Accounting', credit: 3, type: 'Core', program: 'BBA' },
    { id: 'BUS1302', code: 'BUS1302', title: 'Principles of Marketing', credit: 3, type: 'Major', program: 'BBA' },
    { id: 'BUS2101', code: 'BUS2101', title: 'Financial Accounting', credit: 3, type: 'Core', program: 'BBA', prereq: 'BUS1201' },
    { id: 'BUS2201', code: 'BUS2201', title: 'Managerial Accounting', credit: 3, type: 'Major', program: 'BBA', prereq: 'BUS1201' },
    { id: 'BUS3301', code: 'BUS3301', title: 'Corporate Finance', credit: 3, type: 'Major', program: 'BBA' },
    { id: 'BUS3401', code: 'BUS3401', title: 'Business Statistics', credit: 3, type: 'Core', program: 'BBA' },
    { id: 'BUS4501', code: 'BUS4501', title: 'Strategic Management', credit: 3, type: 'Core', program: 'BBA' },
    { id: 'BUS4601', code: 'BUS4601', title: 'Business Ethics', credit: 3, type: 'Elective', program: 'BBA' },
    { id: 'BUS4701', code: 'BUS4701', title: 'Entrepreneurship', credit: 3, type: 'Elective', program: 'BBA' },
    { id: 'LAW1101', code: 'LAW1101', title: 'Introduction to Law', credit: 3, type: 'Core', program: 'LLB' },
    { id: 'LAW1201', code: 'LAW1201', title: 'Legal Methods', credit: 3, type: 'Core', program: 'LLB' },
    { id: 'LAW2107', code: 'LAW2107', title: 'Constitutional Law of Bangladesh', credit: 3, type: 'Core', program: 'LLB', prereq: 'LAW1101' },
    { id: 'LAW2201', code: 'LAW2201', title: 'Contract Law', credit: 3, type: 'Core', program: 'LLB' },
    { id: 'LAW3301', code: 'LAW3301', title: 'Criminal Law', credit: 3, type: 'Core', program: 'LLB' },
    { id: 'LAW3401', code: 'LAW3401', title: 'Tort Law', credit: 3, type: 'Core', program: 'LLB' },
    { id: 'LAW4501', code: 'LAW4501', title: 'Company Law', credit: 3, type: 'Major', program: 'LLB' },
    { id: 'LAW4601', code: 'LAW4601', title: 'Family Law', credit: 3, type: 'Major', program: 'LLB' },
    { id: 'LAW4701', code: 'LAW4701', title: 'International Law', credit: 3, type: 'Elective', program: 'LLB' },
    { id: 'LAW4801', code: 'LAW4801', title: 'Environmental Law', credit: 3, type: 'Elective', program: 'LLB' },
    { id: 'MBA5101', code: 'MBA5101', title: 'Organizational Behavior', credit: 3, type: 'Core', program: 'MBA' },
    { id: 'MBA5107', code: 'MBA5107', title: 'Strategic Management', credit: 3, type: 'Core', program: 'MBA' },
    { id: 'MBA5201', code: 'MBA5201', title: 'Marketing Management', credit: 3, type: 'Major', program: 'MBA' },
    { id: 'MBA5301', code: 'MBA5301', title: 'Financial Management', credit: 3, type: 'Major', program: 'MBA' },
    { id: 'MBA5401', code: 'MBA5401', title: 'Operations Management', credit: 3, type: 'Core', program: 'MBA' },
    { id: 'MBA5501', code: 'MBA5501', title: 'Human Resource Management', credit: 3, type: 'Major', program: 'MBA' },
    { id: 'MBA5601', code: 'MBA5601', title: 'Business Analytics', credit: 3, type: 'Elective', program: 'MBA' },
    { id: 'MBA5701', code: 'MBA5701', title: 'Digital Marketing', credit: 3, type: 'Elective', program: 'MBA' }
  ]

  const offerings: Offering[] = []
  const sections: Section[] = []
  let sectionCounter = 1

  courses.forEach((course) => {
    const offering: Offering = {
      id: `OFF-${course.id}-FA25`,
      courseId: course.id,
      semesterId: 'FA25',
      campusId: 'PRM',
      status: 'Published'
    }
    offerings.push(offering)

    const numSections = course.type === 'Lab' ? 2 : 3
    for (let i = 0; i < numSections; i++) {
      const sectionCode = String.fromCharCode(65 + i)
      const section: Section = {
        id: `SEC${sectionCounter++}`,
        offeringId: offering.id,
        code: sectionCode,
        capacity: course.type === 'Lab' ? 30 : 40,
        enrolled: 15 + Math.floor(Math.random() * 20),
        status: 'Published'
      }
      sections.push(section)
    }
  })

  const STUDENT_NAMES = [
    'Ayesha Rahman', 'Tanvir Ahmed', 'Nishat Sultana', 'Arman Chowdhury', 'Fatima Khan',
    'Raihan Islam', 'Sabrina Akter', 'Fahim Rahman', 'Nusrat Jahan', 'Sakib Hasan',
    'Tahmina Begum', 'Rafiul Islam', 'Sadia Sultana', 'Imran Hossain', 'Rupa Akter',
    'Kamal Uddin', 'Sharmin Ahmed', 'Asif Rahman', 'Maliha Khan', 'Sazzad Hossain',
    'Farhana Akter', 'Nazmul Karim', 'Tania Sultana', 'Jahid Islam', 'Roksana Begum',
    'Shakil Ahmed', 'Poly Akter', 'Mahbub Rahman', 'Shirin Khan', 'Ripon Hossain',
    'Sultana Razia', 'Kamrul Islam', 'Nasrin Akter', 'Sohel Ahmed', 'Laila Begum',
    'Rahim Uddin', 'Hasina Akter', 'Faruk Islam', 'Rahima Khan', 'Selim Rahman',
    'Parveen Akter', 'Jalal Uddin', 'Kulsum Begum', 'Mannan Ahmed', 'Taslima Khatun',
    'Habib Rahman', 'Yasmin Akter', 'Monir Hossain', 'Salma Begum', 'Aziz Ahmed',
    'Rowshan Ara', 'Hanif Islam', 'Shamima Akter', 'Delwar Hossain', 'Jannatul Ferdous',
    'Milon Rahman', 'Suraya Khatun', 'Badrul Islam', 'Morzina Begum', 'Shahidul Ahmed',
    'Rubina Khatun', 'Alamgir Hossain', 'Nasima Akter', 'Shafiq Rahman', 'Rehana Begum',
    'Altaf Hossain', 'Shamsun Nahar', 'Mizanur Rahman', 'Khaleda Akter', 'Nurul Islam',
    'Rashida Begum', 'Abdur Rahman', 'Anwara Begum', 'Mostafa Kamal', 'Farida Khatun',
    'Habibur Rahman', 'Dilara Begum', 'Shamsul Haque', 'Aleya Khatun', 'Aminul Islam'
  ]

  const students: Student[] = STUDENT_NAMES.map((name, idx) => {
    const programIdx = idx % 4
    const program = programs[programIdx]
    const campusIdx = idx % 3
    const campus = campuses[campusIdx]
    const year = '25'
    const semCode = '03'
    const serial = idx + 1

    return {
      id: generateStudentID(program.deptCode, year, semCode, serial),
      ugcId: generateUGCID(year, semCode, String(8131 + programIdx * 100), serial),
      name,
      program: program.code,
      programName: program.name,
      campusId: campus.id,
      email: `${program.deptCode.toLowerCase()}${year}${semCode}${serial.toString().padStart(4, '0')}@student.nub.ac`,
      mobile: `0174${4 + Math.floor(Math.random() * 5)}${String(100000 + idx).substring(0, 6)}`,
      batch: `Batch ${year}C`,
      semester: 'Fall 2025',
      cgpa: 2.5 + Math.random() * 1.5,
      photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s/g, '')}`,
      admitBlocked: idx % 20 === 0,
      blockReason: idx % 20 === 0 ? 'Outstanding dues' : undefined
    }
  })

  const examSchedules: ExamSchedule[] = []
  sections.slice(0, 30).forEach((section, idx) => {
    const slotIdx = idx % 3
    const roomIdx = idx % 5
    const dateOffset = Math.floor(idx / 9)
    
    examSchedules.push({
      id: `EXAM${idx + 1}`,
      sectionId: section.id,
      examType: 'Midterm',
      date: `2025-11-${(10 + dateOffset).toString().padStart(2, '0')}`,
      slotId: examSlots[slotIdx].id,
      roomId: rooms[roomIdx].id,
      status: idx % 5 === 0 ? 'Draft' : 'Locked',
      invigilatorIds: []
    })
  })

  const costHeads: CostHead[] = [
    { id: 'ADMFEE', code: 'ADMFEE', name: 'Admission Fee', type: 'Admission', glAccount: 'DR: Admission Revenue / CR: A/R', taxable: false, status: 'Active' },
    { id: 'TUITION', code: 'TUITION', name: 'Tuition Fee', type: 'Tuition', glAccount: 'DR: Tuition Revenue / CR: A/R', taxable: false, status: 'Active' },
    { id: 'REGFEE', code: 'REGFEE', name: 'Registration Fee', type: 'Registration', glAccount: 'DR: Registration Revenue / CR: A/R', taxable: false, status: 'Active' },
    { id: 'LABFEE', code: 'LABFEE', name: 'Lab Fee', type: 'Lab', glAccount: 'DR: Lab Revenue / CR: A/R', taxable: false, status: 'Active' },
    { id: 'LIBFEE', code: 'LIBFEE', name: 'Library Fee', type: 'Library', glAccount: 'DR: Library Revenue / CR: A/R', taxable: false, status: 'Active' },
    { id: 'EXMFEE', code: 'EXMFEE', name: 'Exam Fee', type: 'Exam', glAccount: 'DR: Exam Revenue / CR: A/R', taxable: false, status: 'Active' },
    { id: 'LATEFEE', code: 'LATEFEE', name: 'Late Fee', type: 'Penalty', glAccount: 'DR: Penalty Revenue / CR: A/R', taxable: false, status: 'Active' }
  ]

  const costPackages: CostPackage[] = [
    {
      id: 'PKG-CSE-FA25',
      programId: 'CSE',
      name: 'CSE Trimester Package',
      effectiveTerm: 'FA25',
      status: 'Active',
      components: [
        { lineNo: 1, costHeadId: 'TUITION', rule: 'Per Credit', rate: 5500, min: 0, max: 0 },
        { lineNo: 2, costHeadId: 'EXMFEE', rule: 'Per Course', rate: 600, min: 0, max: 0 },
        { lineNo: 3, costHeadId: 'REGFEE', rule: 'Flat', rate: 1000, min: 0, max: 0 },
        { lineNo: 4, costHeadId: 'LABFEE', rule: 'Flat', rate: 1500, min: 0, max: 0 }
      ]
    },
    {
      id: 'PKG-BBA-FA25',
      programId: 'BBA',
      name: 'BBA Semester Package',
      effectiveTerm: 'FA25',
      status: 'Active',
      components: [
        { lineNo: 1, costHeadId: 'TUITION', rule: 'Flat', rate: 65000, min: 0, max: 0 },
        { lineNo: 2, costHeadId: 'REGFEE', rule: 'Flat', rate: 1000, min: 0, max: 0 },
        { lineNo: 3, costHeadId: 'LIBFEE', rule: 'Flat', rate: 500, min: 0, max: 0 }
      ]
    },
    {
      id: 'PKG-MBA-FA25',
      programId: 'MBA',
      name: 'MBA Evening Package',
      effectiveTerm: 'FA25',
      status: 'Active',
      components: [
        { lineNo: 1, costHeadId: 'TUITION', rule: 'Per Credit', rate: 7000, min: 0, max: 0 },
        { lineNo: 2, costHeadId: 'EXMFEE', rule: 'Per Course', rate: 800, min: 0, max: 0 },
        { lineNo: 3, costHeadId: 'ADMFEE', rule: 'Flat', rate: 5000, min: 0, max: 0 }
      ]
    },
    {
      id: 'PKG-LLB-FA25',
      programId: 'LLB',
      name: 'LLB Semester Package',
      effectiveTerm: 'FA25',
      status: 'Active',
      components: [
        { lineNo: 1, costHeadId: 'TUITION', rule: 'Flat', rate: 70000, min: 0, max: 0 },
        { lineNo: 2, costHeadId: 'REGFEE', rule: 'Flat', rate: 1000, min: 0, max: 0 },
        { lineNo: 3, costHeadId: 'LIBFEE', rule: 'Flat', rate: 500, min: 0, max: 0 }
      ]
    }
  ]

  const waiverPolicies: WaiverPolicy[] = [
    { id: 'MERIT50', code: 'MERIT50', name: 'Merit 50%', type: 'Waiver', percent: 50, criteria: 'CGPA >= 3.50', status: 'Active' },
    { id: 'MERIT80', code: 'MERIT80', name: 'Merit 80%', type: 'Waiver', percent: 80, criteria: 'CGPA >= 4.00', status: 'Active' },
    { id: 'MERIT25', code: 'MERIT25', name: 'Merit 25%', type: 'Waiver', percent: 25, criteria: 'CGPA >= 3.25', status: 'Active' },
    { id: 'NEED20', code: 'NEED20', name: 'Need-based 20%', type: 'Scholarship', percent: 20, criteria: 'Financial need verified', status: 'Active' },
    { id: 'NEED40', code: 'NEED40', name: 'Need-based 40%', type: 'Scholarship', percent: 40, criteria: 'Critical financial need', status: 'Active' }
  ]

  const studentPayables: StudentPayable[] = students.slice(0, 50).map((student, idx) => {
    const pkg = costPackages.find(p => p.programId === student.program)
    if (!pkg) return null

    const lines = pkg.components.map(comp => {
      const amount = comp.rule === 'Flat' ? comp.rate : comp.rate * (comp.rule === 'Per Credit' ? 12 : 4)
      const waiverAmount = idx % 5 === 0 ? amount * 0.25 : 0
      return {
        costHeadId: comp.costHeadId,
        amount,
        waiverAmount,
        scholarshipAmount: 0,
        netAmount: amount - waiverAmount
      }
    })

    const totalAmount = lines.reduce((sum, l) => sum + l.netAmount, 0)
    const paidAmount = idx % 3 === 0 ? totalAmount : idx % 3 === 1 ? totalAmount * 0.5 : 0

    return {
      id: `PAY${idx + 1}`,
      billNo: `INV-2025-${(100000 + idx).toString()}`,
      studentId: student.id,
      semesterId: 'FA25',
      lines,
      totalAmount,
      paidAmount,
      dueAmount: totalAmount - paidAmount,
      status: paidAmount === 0 ? 'Billed' : paidAmount === totalAmount ? 'Paid' : 'Partially Paid',
      billDate: '2025-10-01',
      dueDate: '2025-11-30'
    }
  }).filter(Boolean) as StudentPayable[]

  const receipts: Receipt[] = []
  studentPayables.filter(p => p.paidAmount > 0).forEach((payable, idx) => {
    const methods: Array<'Cash' | 'Bank' | 'bKash' | 'Card' | 'SSLCommerz'> = ['Cash', 'Bank', 'bKash', 'Card', 'SSLCommerz']
    receipts.push({
      id: `RCP${idx + 1}`,
      moneyReceiptNo: `MR-2025-${(44000 + idx).toString().padStart(5, '0')}`,
      studentId: payable.studentId,
      payableId: payable.id,
      amount: payable.paidAmount,
      method: methods[idx % methods.length],
      reference: `TXN-${100000 + idx}`,
      date: `2025-10-${(5 + idx % 25).toString().padStart(2, '0')}`,
      collectedBy: 'Mahfuz Rahman'
    })
  })

  const bankStatements: BankStatement[] = receipts.slice(0, 30).map((r, idx) => ({
    id: `BS${idx + 1}`,
    date: r.date,
    amount: r.amount + (idx % 5 === 0 ? 100 : 0),
    reference: r.reference,
    narration: `Payment from ${r.studentId}`,
    matched: idx % 5 !== 0,
    receiptId: idx % 5 !== 0 ? r.id : undefined
  }))

  const recheckAppeals: RecheckAppeal[] = students.slice(0, 15).map((student, idx) => {
    const components: Array<'Midterm' | 'Final' | 'CA'> = ['Midterm', 'Final', 'CA']
    const statuses: Array<'Pending' | 'Under Review' | 'Approved' | 'Rejected'> = ['Pending', 'Under Review', 'Approved', 'Rejected']
    
    return {
      id: `RCH${idx + 1}`,
      studentId: student.id,
      courseId: courses[idx % courses.length].id,
      component: components[idx % 3],
      feeAmount: 1000,
      feeStatus: idx % 3 === 0 ? 'Unpaid' : 'Paid',
      status: statuses[idx % 4],
      reviewerId: idx % 4 >= 2 ? faculty[idx % faculty.length].id : undefined,
      submittedDate: `2025-11-${(1 + idx).toString().padStart(2, '0')}`,
      timeline: [
        { date: `2025-11-${(1 + idx).toString().padStart(2, '0')}`, action: 'Submitted', by: student.name }
      ]
    }
  })

  const teacherMaterials: TeacherMaterial[] = sections.slice(0, 20).map((section, idx) => ({
    id: `MAT${idx + 1}`,
    facultyId: faculty[idx % faculty.length].id,
    sectionId: section.id,
    title: `Lecture ${idx + 1} - Introduction`,
    type: idx % 3 === 0 ? 'PDF' : idx % 3 === 1 ? 'PPT' : 'Link',
    url: `https://example.com/material-${idx + 1}`,
    uploadedDate: `2025-10-${(1 + idx).toString().padStart(2, '0')}`
  }))

  const teacherAnnouncements: TeacherAnnouncement[] = sections.slice(0, 15).map((section, idx) => ({
    id: `ANN${idx + 1}`,
    facultyId: faculty[idx % faculty.length].id,
    sectionId: section.id,
    title: `Important: Class ${idx % 2 === 0 ? 'Rescheduled' : 'Update'}`,
    content: `This is an important announcement regarding the class schedule...`,
    audience: idx % 2 === 0 ? 'Section' : 'All',
    publishedDate: `2025-10-${(5 + idx).toString().padStart(2, '0')}`
  }))

  const guardians: Guardian[] = [
    { id: 'G001', name: 'Md. Abdul Karim', email: 'karim.father@gmail.com', mobile: '01711234001', status: 'Active', preferences: { erpPush: true, sms: true, email: true } },
    { id: 'G002', name: 'Mrs. Fatima Rahman', email: 'fatima.mother@gmail.com', mobile: '01711234002', status: 'Active', preferences: { erpPush: true, sms: false, email: true } },
    { id: 'G003', name: 'Mr. Shahidul Islam', email: 'shahid.guardian@gmail.com', mobile: '01711234003', status: 'Active', preferences: { erpPush: true, sms: true, email: false } },
    { id: 'G004', name: 'Mrs. Rahima Begum', email: 'rahima.mother@gmail.com', mobile: '01711234004', status: 'Active', preferences: { erpPush: true, sms: true, email: true } },
    { id: 'G005', name: 'Mr. Jahangir Alam', email: 'jahangir.father@gmail.com', mobile: '01711234005', status: 'Active', preferences: { erpPush: false, sms: true, email: true } },
    { id: 'G006', name: 'Mrs. Nasrin Sultana', email: 'nasrin.mother@gmail.com', mobile: '01711234006', status: 'Active', preferences: { erpPush: true, sms: true, email: true } }
  ]

  const guardianLinks: GuardianLink[] = [
    { id: 'GL001', guardianId: 'G001', studentId: students[0].id, relation: 'Father', isPrimary: true, createdAt: '2024-08-01' },
    { id: 'GL002', guardianId: 'G002', studentId: students[0].id, relation: 'Mother', isPrimary: false, createdAt: '2024-08-01' },
    { id: 'GL003', guardianId: 'G003', studentId: students[1].id, relation: 'Guardian', isPrimary: true, createdAt: '2024-08-01' },
    { id: 'GL004', guardianId: 'G004', studentId: students[2].id, relation: 'Mother', isPrimary: true, createdAt: '2024-08-01' },
    { id: 'GL005', guardianId: 'G005', studentId: students[3].id, relation: 'Father', isPrimary: true, createdAt: '2024-08-01' },
    { id: 'GL006', guardianId: 'G005', studentId: students[4].id, relation: 'Father', isPrimary: true, createdAt: '2024-08-01' },
    { id: 'GL007', guardianId: 'G006', studentId: students[5].id, relation: 'Mother', isPrimary: true, createdAt: '2024-08-01' }
  ]

  const attendanceRecords: AttendanceRecord[] = []
  students.slice(0, 20).forEach((student, studentIdx) => {
    const studentSections = sections.filter(s => s.enrolled > 0).slice(studentIdx % 5, (studentIdx % 5) + 3)
    studentSections.forEach((section, sectionIdx) => {
      for (let day = 1; day <= 15; day++) {
        const status: 'P' | 'A' | 'L' = day % 7 === 0 ? 'A' : day % 11 === 0 ? 'L' : 'P'
        attendanceRecords.push({
          id: `ATT-${studentIdx}-${sectionIdx}-${day}`,
          studentId: student.id,
          sectionId: section.id,
          date: `2025-10-${day.toString().padStart(2, '0')}`,
          status,
          recordedAt: `2025-10-${day.toString().padStart(2, '0')}T09:00:00+06:00`,
          facultyId: section.facultyId || faculty[0].id
        })
      }
    })
  })

  const grades: Grade[] = []
  const termResults: TermResult[] = []
  students.slice(0, 30).forEach((student, idx) => {
    const studentCourses = courses.filter(c => c.program === student.program).slice(0, 5)
    let totalPoints = 0
    let totalCredits = 0

    studentCourses.forEach(course => {
      const gradeOptions = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C']
      const pointMap: Record<string, number> = { 'A+': 4.0, 'A': 3.75, 'A-': 3.5, 'B+': 3.25, 'B': 3.0, 'B-': 2.75, 'C+': 2.5, 'C': 2.25 }
      const grade = gradeOptions[idx % gradeOptions.length]
      const gradePoint = pointMap[grade]

      grades.push({
        id: `GRD-${student.id}-${course.id}`,
        studentId: student.id,
        courseId: course.id,
        sectionId: sections[0].id,
        termId: 'FA25',
        grade,
        gradePoint,
        credit: course.credit,
        remarks: idx % 5 === 0 ? 'Excellent performance' : undefined
      })

      totalPoints += gradePoint * course.credit
      totalCredits += course.credit
    })

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0
    const cgpa = gpa

    termResults.push({
      id: `TR-${student.id}-FA25`,
      studentId: student.id,
      termId: 'FA25',
      gpa: parseFloat(gpa.toFixed(2)),
      cgpa: parseFloat(cgpa.toFixed(2)),
      creditsEarned: totalCredits,
      status: 'Published'
    })
  })

  const ters: TER[] = students.slice(0, 30).map((student, idx) => ({
    id: `TER-${student.id}-FA25`,
    studentId: student.id,
    termId: 'FA25',
    status: idx % 3 === 0 ? 'PENDING' : 'SUBMITTED',
    submittedAt: idx % 3 !== 0 ? `2025-11-${(5 + idx).toString().padStart(2, '0')}` : undefined
  }))

  const notifications: Notification[] = [
    { id: 'NOT001', recipientId: 'G001', recipientType: 'GUARDIAN', channel: 'ERP', title: 'Attendance Alert', message: `Your ward was marked absent on 2025-10-07`, createdAt: '2025-10-07T10:00:00+06:00', status: 'Unread' },
    { id: 'NOT002', recipientId: 'G001', recipientType: 'GUARDIAN', channel: 'SMS', title: 'Payment Reminder', message: 'Semester fee payment due on 2025-11-30', createdAt: '2025-10-15T09:00:00+06:00', status: 'Read' },
    { id: 'NOT003', recipientId: 'G003', recipientType: 'GUARDIAN', channel: 'ERP', title: 'Result Published', message: 'Fall 2025 results are now available', createdAt: '2025-11-20T14:00:00+06:00', status: 'Unread' },
    { id: 'NOT004', recipientId: 'G004', recipientType: 'GUARDIAN', channel: 'Email', title: 'Fee Due Reminder', message: 'Outstanding dues: 15000 BDT. Please clear to view results.', createdAt: '2025-11-18T08:00:00+06:00', status: 'Unread' }
  ]

  const logEntries: LogEntry[] = []

  Repo.set('semesters', semesters)
  Repo.set('campuses', campuses)
  Repo.set('departments', departments)
  Repo.set('programs', programs)
  Repo.set('rooms', rooms)
  Repo.set('examSlots', examSlots)
  Repo.set('faculty', faculty)
  Repo.set('courses', courses)
  Repo.set('offerings', offerings)
  Repo.set('sections', sections)
  Repo.set('examSchedules', examSchedules)
  Repo.set('students', students)
  Repo.set('costHeads', costHeads)
  Repo.set('costPackages', costPackages)
  Repo.set('waiverPolicies', waiverPolicies)
  Repo.set('studentPayables', studentPayables)
  Repo.set('receipts', receipts)
  Repo.set('bankStatements', bankStatements)
  Repo.set('recheckAppeals', recheckAppeals)
  Repo.set('teacherMaterials', teacherMaterials)
  Repo.set('teacherAnnouncements', teacherAnnouncements)
  Repo.set('invigilationAssignments', [])
  Repo.set('admitCardBlocks', [])
  Repo.set('assignedWaivers', [])

  localStorage.setItem('nu-erp-seeded', 'true')
}
