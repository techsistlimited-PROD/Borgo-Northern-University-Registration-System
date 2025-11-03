// Shared fixture seed data for the entire ERP system

export const SEMESTERS = [
  { code: 'SP25', name: 'Spring 2025', idCode: '01' },
  { code: 'SU25', name: 'Summer 2025', idCode: '02' },
  { code: 'FA25', name: 'Fall 2025', idCode: '03' }
]

export const CAMPUSES = [
  { code: 'BAN', name: 'Banani Campus' },
  { code: 'DHM', name: 'Dhanmondi Campus' },
  { code: 'PRM', name: 'Permanent Campus' }
]

export const PROGRAMS = [
  { code: 'BBA', name: 'BBA in Accounting & Finance', level: 'Undergraduate', duration: 8, durationUnit: 'Semester', totalCredits: 126, deptCode: 'BB' },
  { code: 'CSE', name: 'BSc in Computer Science & Engg.', level: 'Undergraduate', duration: 12, durationUnit: 'Trimester', totalCredits: 160, deptCode: 'CS' },
  { code: 'LLB', name: 'LLB (Hons)', level: 'Undergraduate', duration: 8, durationUnit: 'Semester', totalCredits: 132, deptCode: 'LW' },
  { code: 'MBA', name: 'MBA in Marketing', level: 'Graduate', duration: 4, durationUnit: 'Trimester', totalCredits: 60, deptCode: 'MB' }
]

export const DEPARTMENTS = [
  { code: 'CS', name: 'CSE' },
  { code: 'BB', name: 'BBA' },
  { code: 'LW', name: 'LAW' },
  { code: 'MB', name: 'MBA' }
]

export const EXAM_TYPES = ['Midterm', 'Final', 'Improvement', 'Special']

export const ROOMS = [
  { code: 'AT-303', building: 'Academic Tower A', floor: 3, capacity: 48, type: 'Classroom', campus: 'PRM' },
  { code: 'AT-305', building: 'Academic Tower A', floor: 3, capacity: 120, type: 'Exam Hall', campus: 'PRM' },
  { code: 'SB-N105', building: 'Science Block North', floor: 1, capacity: 32, type: 'Lab', campus: 'PRM' },
  { code: 'DHC-201', building: 'Dhaka Campus Main', floor: 2, capacity: 60, type: 'Classroom', campus: 'DHM' },
  { code: 'BAN-401', building: 'Banani Tower', floor: 4, capacity: 80, type: 'Exam Hall', campus: 'BAN' }
]

export const EXAM_OFFICERS = [
  { id: 'MA', name: 'Md. Arif Hossain', initial: 'MA' },
  { id: 'RA', name: 'Rafiq Ahmed', initial: 'RA' }
]

export const INVIGILATORS = [
  { id: 'F001', name: 'Dr. Nusrat Jahan', dept: 'CSE' },
  { id: 'F002', name: 'Engr. Shakil Rahman', dept: 'CSE' },
  { id: 'F003', name: 'Dr. Tanvir Hasan', dept: 'CSE' },
  { id: 'F004', name: 'Prof. Nazmul Karim', dept: 'BBA' },
  { id: 'F005', name: 'Farzana Kabir', dept: 'BBA' },
  { id: 'F006', name: 'Sharmin Akter', dept: 'BBA' },
  { id: 'F007', name: 'Barr. Fahmida Anwar', dept: 'LAW' },
  { id: 'F008', name: 'Adv. Kamal Hossain', dept: 'LAW' },
  { id: 'F009', name: 'Dr. Rashida Sultana', dept: 'LAW' },
  { id: 'F010', name: 'Prof. Ahmed Khan', dept: 'MBA' },
  { id: 'F011', name: 'Dr. Tasnim Rahman', dept: 'MBA' },
  { id: 'F012', name: 'Jahangir Alam', dept: 'MBA' }
]

export const FINANCE_OFFICERS = [
  { id: 'MR', name: 'Mahfuz Rahman', initial: 'MR' }
]

export const SYSTEM_ADMINS = [
  { id: 'MI', name: 'Md. Imran Hossain', initial: 'MI' }
]

// Generate student IDs: {DEPT-2}{YY}{SEM}{####}
function generateStudentID(deptCode: string, year: string, semCode: string, serial: number): string {
  return `${deptCode}${year}${semCode}${serial.toString().padStart(4, '0')}`
}

// Generate UGC ID: 029{YY}{SEM1or2}{00}{PROG5}{CLS###}
function generateUGCID(year: string, semCode: string, progCode: string, classSerial: number): string {
  const semCodeUGC = semCode === '01' ? '1' : '2' // 1 for Spring, 2 for Summer/Fall
  return `029${year}${semCodeUGC}00${progCode.padStart(5, '0')}${classSerial.toString().padStart(3, '0')}`
}

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
  'Milon Rahman', 'Suraya Khatun', 'Badrul Islam', 'Morzina Begum', 'Shahidul Ahmed'
]

export const STUDENTS = STUDENT_NAMES.map((name, idx) => {
  const programIdx = idx % 4
  const program = PROGRAMS[programIdx]
  const year = '25'
  const semCode = '01' // Spring intake
  const serial = idx + 1
  
  return {
    id: generateStudentID(program.deptCode, year, semCode, serial),
    ugcId: generateUGCID(year, semCode, String(8131 + programIdx * 100), serial),
    name,
    program: program.code,
    programName: program.name,
    email: `${program.deptCode.toLowerCase()}${year}${semCode}${serial.toString().padStart(4, '0')}@student.nub.ac`,
    mobile: `0174${4 + Math.floor(Math.random() * 5)}${String(100000 + idx).substring(0, 6)}`,
    batch: `Batch ${year}C`,
    semester: 'Fall 2025',
    cgpa: 2.5 + Math.random() * 2
  }
})

export const COST_HEADS = [
  { code: 'ADMFEE', name: 'Admission Fee', type: 'Admission', glAccount: 'DR: Admission Revenue / CR: A/R', taxable: false },
  { code: 'TUITION', name: 'Tuition Fee', type: 'Tuition', glAccount: 'DR: Tuition Revenue / CR: A/R', taxable: false },
  { code: 'REGFEE', name: 'Registration Fee', type: 'Registration', glAccount: 'DR: Registration Revenue / CR: A/R', taxable: false },
  { code: 'LABFEE', name: 'Lab Fee', type: 'Lab', glAccount: 'DR: Lab Revenue / CR: A/R', taxable: false },
  { code: 'LIBFEE', name: 'Library Fee', type: 'Library', glAccount: 'DR: Library Revenue / CR: A/R', taxable: false },
  { code: 'EXMFEE', name: 'Exam Fee', type: 'Exam', glAccount: 'DR: Exam Revenue / CR: A/R', taxable: false },
  { code: 'LATEFEE', name: 'Late Fee', type: 'Penalty', glAccount: 'DR: Penalty Revenue / CR: A/R', taxable: false }
]

export const COST_PACKAGES = [
  {
    program: 'CSE',
    name: 'CSE Trimester Package',
    effectiveFrom: '2025-01-01',
    effectiveTo: '2025-12-31',
    components: [
      { head: 'TUITION', rule: 'Per Credit', rate: 5500, min: 0, max: 0 },
      { head: 'EXMFEE', rule: 'Per Course', rate: 600, min: 0, max: 0 },
      { head: 'REGFEE', rule: 'Flat', rate: 1000, min: 0, max: 0 },
      { head: 'LABFEE', rule: 'Flat', rate: 1500, min: 0, max: 0 }
    ]
  },
  {
    program: 'BBA',
    name: 'BBA Semester Package',
    effectiveFrom: '2025-01-01',
    effectiveTo: '2025-12-31',
    components: [
      { head: 'TUITION', rule: 'Flat', rate: 65000, min: 0, max: 0 },
      { head: 'REGFEE', rule: 'Flat', rate: 1000, min: 0, max: 0 },
      { head: 'LIBFEE', rule: 'Flat', rate: 500, min: 0, max: 0 }
    ]
  },
  {
    program: 'MBA',
    name: 'MBA Evening Package',
    effectiveFrom: '2025-01-01',
    effectiveTo: '2025-12-31',
    components: [
      { head: 'TUITION', rule: 'Per Credit', rate: 7000, min: 0, max: 0 },
      { head: 'EXMFEE', rule: 'Per Course', rate: 800, min: 0, max: 0 },
      { head: 'ADMFEE', rule: 'Flat (First Time)', rate: 5000, min: 0, max: 0 }
    ]
  }
]

export const WAIVER_TYPES = [
  { code: 'MERIT50', name: 'Merit 50%', type: 'Merit', percent: 50, criteria: 'CGPA >= 3.50' },
  { code: 'MERIT80', name: 'Merit 80%', type: 'Merit', percent: 80, criteria: 'CGPA >= 4.00' },
  { code: 'SIBLING25', name: 'Sibling 25%', type: 'Sibling', percent: 25, criteria: 'Has sibling enrolled' },
  { code: 'STAFF100', name: 'Staff 100%', type: 'Staff', percent: 100, criteria: 'Staff member child' }
]

export const SCHOLARSHIPS = [
  { code: 'DEANS30', name: "Dean's List 30%", type: 'Scholarship', percent: 30, criteria: 'CGPA >= 3.75 in semester' },
  { code: 'VC60', name: 'VC Special 60%', type: 'Scholarship', percent: 60, criteria: 'Exceptional achievement' }
]

export const COURSES = [
  { code: 'CSE1101', title: 'Programming Fundamentals', credit: 3, type: 'Core', program: 'CSE', prereq: null },
  { code: 'CSE2205', title: 'Data Structures & Algorithms', credit: 3, type: 'Core', program: 'CSE', prereq: 'CSE1101' },
  { code: 'CSE2303', title: 'Digital Logic Design Lab', credit: 1, type: 'Lab', program: 'CSE', prereq: null },
  { code: 'BUS1302', title: 'Principles of Marketing', credit: 3, type: 'Major', program: 'BBA', prereq: null },
  { code: 'LAW2107', title: 'Constitutional Law of Bangladesh', credit: 3, type: 'Core', program: 'LLB', prereq: 'LAW1101' },
  { code: 'MBA5107', title: 'Strategic Management', credit: 3, type: 'Core', program: 'MBA', prereq: null }
]

// Generate 120 payment receipts
export const PAYMENT_METHODS = ['Cash', 'Bank Deposit', 'bKash', 'SSLCommerz', 'DBBL Nexus', 'Card']

export const PAYMENTS = Array.from({ length: 120 }, (_, idx) => {
  const student = STUDENTS[idx % STUDENTS.length]
  const method = PAYMENT_METHODS[idx % PAYMENT_METHODS.length]
  const amount = 5000 + Math.floor(Math.random() * 45000)
  
  return {
    mrNo: `MR-2025-${(44000 + idx).toString().padStart(5, '0')}`,
    date: `2025-${String(9 + Math.floor(idx / 60)).padStart(2, '0')}-${String(1 + (idx % 30)).padStart(2, '0')}`,
    studentId: student.id,
    studentName: student.name,
    program: student.program,
    method,
    amount,
    collectedBy: FINANCE_OFFICERS[0].name,
    reference: method.includes('bKash') ? `TXN-${100000 + idx}` : method.includes('Bank') ? `SLIP-${200000 + idx}` : '',
    allocatedTo: `INV-2025-${(900 + Math.floor(idx / 2)).toString().padStart(6, '0')}`
  }
})

export function formatStudentID(id: string): string {
  // Convert CS25010042 to CSE-25-01-0042
  if (id.length >= 10) {
    return `${id.substring(0, 2)}-${id.substring(2, 4)}-${id.substring(4, 6)}-${id.substring(6)}`
  }
  return id
}

export function formatUGCID(id: string): string {
  // Format 02925100081310027 as 029 25 1 00 08131 027
  if (id.length >= 16) {
    return `${id.substring(0, 3)} ${id.substring(3, 5)} ${id.substring(5, 6)} ${id.substring(6, 8)} ${id.substring(8, 13)} ${id.substring(13)}`
  }
  return id
}
