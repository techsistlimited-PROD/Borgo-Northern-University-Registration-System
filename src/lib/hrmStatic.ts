// Letterhead configuration
export const NUB_LOGO_PATH = '/assets/nub-logo.svg'

export type Employee = {
  id: string
  name: string
  type: 'Teacher' | 'Admin'
  department: string
  designation: string
  grade: string
  status: 'Active' | 'On Leave' | 'Resigned' | 'Retired'
  email: string
  mobile: string
  joiningDate: string
  photoUrl?: string
  
  // Personal Info
  dob: string
  gender: 'Male' | 'Female'
  nid: string
  bloodGroup: string
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed'
  presentAddress: string
  permanentAddress: string
  emergencyContact: {
    name: string
    relation: string
    mobile: string
  }
  
  // Job Info
  employmentType: 'Permanent' | 'Contractual' | 'Part-time'
  reportingTo?: string
  salary: number
}

export type Document = {
  id: string
  employeeId: string
  type: 'CV' | 'Certificate' | 'NID' | 'Contract' | 'Appointment Letter' | 'Other'
  fileName: string
  uploadDate: string
  fileUrl?: string
}

export type EmploymentHistory = {
  id: string
  employeeId: string
  date: string
  changeType: 'Joining' | 'Promotion' | 'Transfer' | 'Grade Change' | 'Contract Renewal' | 'Resignation' | 'Retirement'
  oldValue?: string
  newValue: string
  remarks: string
}

export const HRM_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-2025-001',
    name: 'Dr. Ayesha Karim',
    type: 'Teacher',
    department: 'CSE',
    designation: 'Associate Professor',
    grade: 'G-9',
    status: 'Active',
    email: 'ayesha.karim@nub.edu.bd',
    mobile: '01711234567',
    joiningDate: '2018-01-15',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AyeshaKarim',
    dob: '1985-03-12',
    gender: 'Female',
    nid: '1234567890123',
    bloodGroup: 'A+',
    maritalStatus: 'Married',
    presentAddress: 'House 45, Road 12, Dhanmondi, Dhaka-1209',
    permanentAddress: 'Village: Rampur, Upazila: Savar, Dhaka',
    emergencyContact: {
      name: 'Karim Ahmed',
      relation: 'Husband',
      mobile: '01812345678'
    },
    employmentType: 'Permanent',
    reportingTo: 'EMP-2025-010',
    salary: 85000
  },
  {
    id: 'EMP-2025-002',
    name: 'Mahbub Alam',
    type: 'Teacher',
    department: 'BBA',
    designation: 'Lecturer',
    grade: 'G-6',
    status: 'On Leave',
    email: 'mahbub.alam@nub.edu.bd',
    mobile: '01722345678',
    joiningDate: '2020-08-01',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MahbubAlam',
    dob: '1990-07-20',
    gender: 'Male',
    nid: '2345678901234',
    bloodGroup: 'B+',
    maritalStatus: 'Single',
    presentAddress: 'Flat 3B, Building 12, Gulshan-2, Dhaka-1212',
    permanentAddress: 'Village: Matlab, Upazila: Chandpur, Chittagong',
    emergencyContact: {
      name: 'Fatema Begum',
      relation: 'Mother',
      mobile: '01923456789'
    },
    employmentType: 'Contractual',
    reportingTo: 'EMP-2025-011',
    salary: 45000
  },
  {
    id: 'EMP-2025-003',
    name: 'Saiful Islam',
    type: 'Admin',
    department: 'HR',
    designation: 'Officer',
    grade: 'G-4',
    status: 'Active',
    email: 'saiful.islam@nub.edu.bd',
    mobile: '01833456789',
    joiningDate: '2019-03-10',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SaifulIslam',
    dob: '1988-11-05',
    gender: 'Male',
    nid: '3456789012345',
    bloodGroup: 'O+',
    maritalStatus: 'Married',
    presentAddress: 'House 78, Mohammadpur, Dhaka-1207',
    permanentAddress: 'Village: Narsingdi, Upazila: Narsingdi Sadar',
    emergencyContact: {
      name: 'Nazma Begum',
      relation: 'Wife',
      mobile: '01734567890'
    },
    employmentType: 'Permanent',
    reportingTo: 'EMP-2025-012',
    salary: 35000
  },
  {
    id: 'EMP-2025-004',
    name: 'Nusrat Jahan',
    type: 'Admin',
    department: 'Accounts',
    designation: 'Assistant Manager',
    grade: 'G-5',
    status: 'Active',
    email: 'nusrat.jahan@nub.edu.bd',
    mobile: '01645678901',
    joiningDate: '2017-06-20',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NusratJahan',
    dob: '1987-09-15',
    gender: 'Female',
    nid: '4567890123456',
    bloodGroup: 'AB+',
    maritalStatus: 'Married',
    presentAddress: 'Flat 5A, Banani, Dhaka-1213',
    permanentAddress: 'Village: Feni, Upazila: Feni Sadar',
    emergencyContact: {
      name: 'Jahangir Alam',
      relation: 'Husband',
      mobile: '01556789012'
    },
    employmentType: 'Permanent',
    reportingTo: 'EMP-2025-013',
    salary: 55000
  },
  {
    id: 'EMP-2025-005',
    name: 'Tanvir Rahman',
    type: 'Admin',
    department: 'IT',
    designation: 'Network Engineer',
    grade: 'G-5',
    status: 'Resigned',
    email: 'tanvir.rahman@nub.edu.bd',
    mobile: '01467890123',
    joiningDate: '2019-11-01',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TanvirRahman',
    dob: '1992-04-08',
    gender: 'Male',
    nid: '5678901234567',
    bloodGroup: 'A-',
    maritalStatus: 'Single',
    presentAddress: 'House 23, Uttara, Dhaka-1230',
    permanentAddress: 'Village: Mymensingh, Upazila: Mymensingh Sadar',
    emergencyContact: {
      name: 'Rashid Rahman',
      relation: 'Father',
      mobile: '01378901234'
    },
    employmentType: 'Contractual',
    salary: 48000
  },
  {
    id: 'EMP-2025-006',
    name: 'Dr. Farhan Chowdhury',
    type: 'Teacher',
    department: 'CSE',
    designation: 'Professor',
    grade: 'G-10',
    status: 'Active',
    email: 'farhan.chowdhury@nub.edu.bd',
    mobile: '01289012345',
    joiningDate: '2015-02-01',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FarhanChowdhury',
    dob: '1980-05-18',
    gender: 'Male',
    nid: '6789012345678',
    bloodGroup: 'B-',
    maritalStatus: 'Married',
    presentAddress: 'House 12, Baridhara DOHS, Dhaka-1206',
    permanentAddress: 'Village: Chittagong, Upazila: Chittagong Sadar',
    emergencyContact: {
      name: 'Laila Chowdhury',
      relation: 'Wife',
      mobile: '01190123456'
    },
    employmentType: 'Permanent',
    reportingTo: 'EMP-2025-010',
    salary: 120000
  },
  {
    id: 'EMP-2025-007',
    name: 'Shabnam Akter',
    type: 'Admin',
    department: 'Library',
    designation: 'Librarian',
    grade: 'G-5',
    status: 'Active',
    email: 'shabnam.akter@nub.edu.bd',
    mobile: '01601234567',
    joiningDate: '2018-09-15',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ShabnamAkter',
    dob: '1989-12-10',
    gender: 'Female',
    nid: '7890123456789',
    bloodGroup: 'O-',
    maritalStatus: 'Single',
    presentAddress: 'House 45, Mirpur-10, Dhaka-1216',
    permanentAddress: 'Village: Jessore, Upazila: Jessore Sadar',
    emergencyContact: {
      name: 'Nasima Begum',
      relation: 'Mother',
      mobile: '01512345678'
    },
    employmentType: 'Permanent',
    salary: 42000
  },
  {
    id: 'EMP-2025-008',
    name: 'Rafiqul Islam',
    type: 'Teacher',
    department: 'BBA',
    designation: 'Assistant Professor',
    grade: 'G-7',
    status: 'Active',
    email: 'rafiqul.islam@nub.edu.bd',
    mobile: '01423456789',
    joiningDate: '2016-07-01',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RafiqulIslam',
    dob: '1983-08-25',
    gender: 'Male',
    nid: '8901234567890',
    bloodGroup: 'A+',
    maritalStatus: 'Married',
    presentAddress: 'House 89, Lalmatia, Dhaka-1207',
    permanentAddress: 'Village: Bogra, Upazila: Bogra Sadar',
    emergencyContact: {
      name: 'Shamima Islam',
      relation: 'Wife',
      mobile: '01334567890'
    },
    employmentType: 'Permanent',
    reportingTo: 'EMP-2025-011',
    salary: 65000
  },
  {
    id: 'EMP-2025-009',
    name: 'Tasneem Hossain',
    type: 'Admin',
    department: 'Admission',
    designation: 'Senior Officer',
    grade: 'G-4',
    status: 'Active',
    email: 'tasneem.hossain@nub.edu.bd',
    mobile: '01245678901',
    joiningDate: '2020-01-10',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TasneemHossain',
    dob: '1991-02-14',
    gender: 'Female',
    nid: '9012345678901',
    bloodGroup: 'B+',
    maritalStatus: 'Single',
    presentAddress: 'Flat 2C, Bashundhara R/A, Dhaka-1229',
    permanentAddress: 'Village: Comilla, Upazila: Comilla Sadar',
    emergencyContact: {
      name: 'Hossain Ahmed',
      relation: 'Father',
      mobile: '01156789012'
    },
    employmentType: 'Permanent',
    salary: 38000
  },
  {
    id: 'EMP-2025-010',
    name: 'Prof. Dr. Rahim Uddin',
    type: 'Teacher',
    department: 'CSE',
    designation: 'Dean',
    grade: 'G-11',
    status: 'Active',
    email: 'rahim.uddin@nub.edu.bd',
    mobile: '01067890123',
    joiningDate: '2012-08-01',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RahimUddin',
    dob: '1975-06-30',
    gender: 'Male',
    nid: '0123456789012',
    bloodGroup: 'AB-',
    maritalStatus: 'Married',
    presentAddress: 'House 3, Road 5, Banani, Dhaka-1213',
    permanentAddress: 'Village: Sylhet, Upazila: Sylhet Sadar',
    emergencyContact: {
      name: 'Rahima Begum',
      relation: 'Wife',
      mobile: '01978901234'
    },
    employmentType: 'Permanent',
    salary: 150000
  },
  {
    id: 'EMP-2025-011',
    name: 'Dr. Khaleda Rahman',
    type: 'Teacher',
    department: 'BBA',
    designation: 'Dean',
    grade: 'G-11',
    status: 'Active',
    email: 'khaleda.rahman@nub.edu.bd',
    mobile: '01889012345',
    joiningDate: '2013-01-15',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KhaledaRahman',
    dob: '1978-09-20',
    gender: 'Female',
    nid: '1234509876543',
    bloodGroup: 'O+',
    maritalStatus: 'Married',
    presentAddress: 'House 67, Gulshan-1, Dhaka-1212',
    permanentAddress: 'Village: Khulna, Upazila: Khulna Sadar',
    emergencyContact: {
      name: 'Rahman Ali',
      relation: 'Husband',
      mobile: '01790123456'
    },
    employmentType: 'Permanent',
    salary: 145000
  },
  {
    id: 'EMP-2025-012',
    name: 'Aminul Haque',
    type: 'Admin',
    department: 'HR',
    designation: 'Manager',
    grade: 'G-6',
    status: 'Active',
    email: 'aminul.haque@nub.edu.bd',
    mobile: '01601234589',
    joiningDate: '2016-05-10',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AminulHaque',
    dob: '1984-11-12',
    gender: 'Male',
    nid: '2345609876543',
    bloodGroup: 'A-',
    maritalStatus: 'Married',
    presentAddress: 'House 34, Uttara Sector 7, Dhaka-1230',
    permanentAddress: 'Village: Rajshahi, Upazila: Rajshahi Sadar',
    emergencyContact: {
      name: 'Selina Begum',
      relation: 'Wife',
      mobile: '01512345690'
    },
    employmentType: 'Permanent',
    salary: 75000
  },
  {
    id: 'EMP-2025-013',
    name: 'Jahangir Kabir',
    type: 'Admin',
    department: 'Accounts',
    designation: 'Chief Accountant',
    grade: 'G-7',
    status: 'Active',
    email: 'jahangir.kabir@nub.edu.bd',
    mobile: '01423456790',
    joiningDate: '2014-03-01',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JahangirKabir',
    dob: '1982-04-18',
    gender: 'Male',
    nid: '3456709876543',
    bloodGroup: 'B+',
    maritalStatus: 'Married',
    presentAddress: 'House 12, Dhanmondi Road 8, Dhaka-1205',
    permanentAddress: 'Village: Rangpur, Upazila: Rangpur Sadar',
    emergencyContact: {
      name: 'Nasrin Kabir',
      relation: 'Wife',
      mobile: '01334567891'
    },
    employmentType: 'Permanent',
    salary: 95000
  }
]

export const HRM_DOCUMENTS: Document[] = [
  { id: 'DOC-001', employeeId: 'EMP-2025-001', type: 'CV', fileName: 'AyeshaKarim_CV.pdf', uploadDate: '2018-01-10' },
  { id: 'DOC-002', employeeId: 'EMP-2025-001', type: 'Certificate', fileName: 'PhD_Certificate.pdf', uploadDate: '2018-01-10' },
  { id: 'DOC-003', employeeId: 'EMP-2025-001', type: 'NID', fileName: 'NID_Copy.pdf', uploadDate: '2018-01-10' },
  { id: 'DOC-004', employeeId: 'EMP-2025-001', type: 'Appointment Letter', fileName: 'Appointment_2018.pdf', uploadDate: '2018-01-15' },
  
  { id: 'DOC-005', employeeId: 'EMP-2025-002', type: 'CV', fileName: 'MahbubAlam_CV.pdf', uploadDate: '2020-07-25' },
  { id: 'DOC-006', employeeId: 'EMP-2025-002', type: 'Certificate', fileName: 'Masters_Certificate.pdf', uploadDate: '2020-07-25' },
  { id: 'DOC-007', employeeId: 'EMP-2025-002', type: 'Contract', fileName: 'Contract_2020.pdf', uploadDate: '2020-08-01' },
  
  { id: 'DOC-008', employeeId: 'EMP-2025-003', type: 'CV', fileName: 'SaifulIslam_CV.pdf', uploadDate: '2019-03-05' },
  { id: 'DOC-009', employeeId: 'EMP-2025-003', type: 'NID', fileName: 'NID_Copy.pdf', uploadDate: '2019-03-05' },
  
  { id: 'DOC-010', employeeId: 'EMP-2025-004', type: 'CV', fileName: 'NusratJahan_CV.pdf', uploadDate: '2017-06-15' },
  { id: 'DOC-011', employeeId: 'EMP-2025-004', type: 'Certificate', fileName: 'MBA_Certificate.pdf', uploadDate: '2017-06-15' },
  { id: 'DOC-012', employeeId: 'EMP-2025-004', type: 'Appointment Letter', fileName: 'Appointment_2017.pdf', uploadDate: '2017-06-20' }
]

export const HRM_HISTORY: EmploymentHistory[] = [
  {
    id: 'HIST-001',
    employeeId: 'EMP-2025-001',
    date: '2018-01-15',
    changeType: 'Joining',
    newValue: 'Lecturer - G-6',
    remarks: 'Joined as Lecturer in CSE Department'
  },
  {
    id: 'HIST-002',
    employeeId: 'EMP-2025-001',
    date: '2020-06-01',
    changeType: 'Promotion',
    oldValue: 'Lecturer - G-6',
    newValue: 'Assistant Professor - G-7',
    remarks: 'Promoted based on performance and research'
  },
  {
    id: 'HIST-003',
    employeeId: 'EMP-2025-001',
    date: '2023-01-01',
    changeType: 'Promotion',
    oldValue: 'Assistant Professor - G-7',
    newValue: 'Associate Professor - G-9',
    remarks: 'Promoted after completing PhD and publications'
  },
  {
    id: 'HIST-004',
    employeeId: 'EMP-2025-002',
    date: '2020-08-01',
    changeType: 'Joining',
    newValue: 'Lecturer - G-6',
    remarks: 'Joined as Contractual Lecturer in BBA Department'
  },
  {
    id: 'HIST-005',
    employeeId: 'EMP-2025-002',
    date: '2023-08-01',
    changeType: 'Contract Renewal',
    oldValue: 'Contract 2020-2023',
    newValue: 'Contract 2023-2026',
    remarks: 'Contract renewed for 3 years'
  },
  {
    id: 'HIST-006',
    employeeId: 'EMP-2025-003',
    date: '2019-03-10',
    changeType: 'Joining',
    newValue: 'Assistant Officer - G-3',
    remarks: 'Joined as Assistant Officer in HR Department'
  },
  {
    id: 'HIST-007',
    employeeId: 'EMP-2025-003',
    date: '2022-01-01',
    changeType: 'Promotion',
    oldValue: 'Assistant Officer - G-3',
    newValue: 'Officer - G-4',
    remarks: 'Promoted to Officer grade'
  },
  {
    id: 'HIST-008',
    employeeId: 'EMP-2025-004',
    date: '2017-06-20',
    changeType: 'Joining',
    newValue: 'Officer - G-4',
    remarks: 'Joined as Officer in Accounts Department'
  },
  {
    id: 'HIST-009',
    employeeId: 'EMP-2025-004',
    date: '2021-07-01',
    changeType: 'Promotion',
    oldValue: 'Officer - G-4',
    newValue: 'Assistant Manager - G-5',
    remarks: 'Promoted to Assistant Manager'
  },
  {
    id: 'HIST-010',
    employeeId: 'EMP-2025-005',
    date: '2019-11-01',
    changeType: 'Joining',
    newValue: 'Network Engineer - G-5',
    remarks: 'Joined as Contractual Network Engineer'
  },
  {
    id: 'HIST-011',
    employeeId: 'EMP-2025-005',
    date: '2024-11-30',
    changeType: 'Resignation',
    oldValue: 'Network Engineer - G-5',
    newValue: 'Resigned',
    remarks: 'Resigned for better opportunity abroad'
  }
]

export const HRM_STATS = {
  activeStaff: 11,
  onLeave: 1,
  resigned: 1,
  retired: 0,
  totalStaff: 13
}

export const HRM_DEPT_DISTRIBUTION = [
  { department: 'CSE', count: 3 },
  { department: 'BBA', count: 3 },
  { department: 'HR', count: 2 },
  { department: 'Accounts', count: 2 },
  { department: 'IT', count: 1 },
  { department: 'Library', count: 1 },
  { department: 'Admission', count: 1 }
]

export type AttendanceRecord = {
  id: string
  empId: string
  name: string
  dept: string
  date: string
  inTime: string
  outTime: string
  hours: number
  late: number
  status: 'Present' | 'Absent' | 'Late' | 'On Leave'
  shift: string
  remarks?: string
}

export type Shift = {
  id: string
  name: string
  start: string
  end: string
  type: 'Regular' | 'Night' | 'Flex'
  campus: string
  remarks?: string
}

export type Roster = {
  dept: string
  date: string
  shiftId: string
  employees: string[]
}

export type LeaveType = 'Casual' | 'Medical' | 'Earn' | 'Maternity' | 'Special' | 'Duty' | 'Study' | 'Semester Break'

export type LeaveApplication = {
  id: string
  empId: string
  name: string
  dept: string
  type: LeaveType
  from: string
  to: string
  totalDays: number
  reason: string
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled'
  workflow: {
    hod: 'Pending' | 'Approved' | 'Rejected'
    dean: 'Pending' | 'Approved' | 'Rejected'
    hr: 'Pending' | 'Approved' | 'Rejected'
    registrar: 'Pending' | 'Approved' | 'Rejected'
    vc: 'Pending' | 'Approved' | 'Rejected'
  }
  remarks?: string
  appliedOn: string
}

export type LeaveBalance = {
  empId: string
  name: string
  dept: string
  casual: number
  medical: number
  earn: number
  special: number
  used: number
  remaining: number
}

export const HRM_SHIFTS: Shift[] = [
  { id: 'R1', name: 'Regular Day', start: '08:30', end: '16:30', type: 'Regular', campus: 'Permanent Campus' },
  { id: 'R2', name: 'Night Shift', start: '16:00', end: '00:00', type: 'Night', campus: 'Banani Campus' },
  { id: 'F1', name: 'Flex Morning', start: '07:00', end: '15:00', type: 'Flex', campus: 'Permanent Campus' },
  { id: 'F2', name: 'Flex Evening', start: '14:00', end: '22:00', type: 'Flex', campus: 'Banani Campus' }
]

const generateAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = []
  const depts = ['CSE', 'BBA', 'HR', 'Accounts', 'IT']
  const employees = HRM_EMPLOYEES.filter(e => e.status === 'Active').slice(0, 10)
  const statuses: AttendanceRecord['status'][] = ['Present', 'Present', 'Present', 'Present', 'Late', 'On Leave', 'Absent']

  for (let day = 1; day <= 12; day++) {
    employees.forEach(emp => {
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const late = status === 'Late' ? Math.floor(Math.random() * 45) + 5 : 0
      const hours = status === 'Present' ? 8 : status === 'Late' ? 7.5 : 0
      const inTime = status === 'Present' ? '08:30' : status === 'Late' ? `08:${35 + late}` : '-'
      const outTime = status === 'Present' || status === 'Late' ? '16:30' : '-'

      records.push({
        id: `ATT-${emp.id}-2025-01-${day.toString().padStart(2, '0')}`,
        empId: emp.id,
        name: emp.name,
        dept: emp.department,
        date: `2025-01-${day.toString().padStart(2, '0')}`,
        inTime,
        outTime,
        hours,
        late,
        status,
        shift: 'R1'
      })
    })
  }

  return records
}

export const HRM_ATTENDANCE: AttendanceRecord[] = generateAttendance()

export const HRM_ROSTER: Roster[] = [
  { dept: 'CSE', date: '2025-01-20', shiftId: 'R1', employees: ['EMP-2025-001', 'EMP-2025-006'] },
  { dept: 'CSE', date: '2025-01-21', shiftId: 'R1', employees: ['EMP-2025-001', 'EMP-2025-006'] },
  { dept: 'BBA', date: '2025-01-20', shiftId: 'R1', employees: ['EMP-2025-002', 'EMP-2025-008'] },
  { dept: 'BBA', date: '2025-01-21', shiftId: 'F1', employees: ['EMP-2025-008'] },
  { dept: 'HR', date: '2025-01-20', shiftId: 'R1', employees: ['EMP-2025-003', 'EMP-2025-012'] },
  { dept: 'Accounts', date: '2025-01-20', shiftId: 'R1', employees: ['EMP-2025-004', 'EMP-2025-013'] }
]

export const HRM_LEAVE_APPLICATIONS: LeaveApplication[] = [
  {
    id: 'LV-001',
    empId: 'EMP-2025-002',
    name: 'Mahbub Alam',
    dept: 'BBA',
    type: 'Medical',
    from: '2025-01-15',
    to: '2025-01-17',
    totalDays: 3,
    reason: 'Fever and flu',
    status: 'Approved',
    workflow: { hod: 'Approved', dean: 'Approved', hr: 'Approved', registrar: 'Approved', vc: 'Approved' },
    appliedOn: '2025-01-14'
  },
  {
    id: 'LV-002',
    empId: 'EMP-2025-001',
    name: 'Dr. Ayesha Karim',
    dept: 'CSE',
    type: 'Casual',
    from: '2025-01-22',
    to: '2025-01-23',
    totalDays: 2,
    reason: 'Personal work',
    status: 'Pending',
    workflow: { hod: 'Approved', dean: 'Pending', hr: 'Pending', registrar: 'Pending', vc: 'Pending' },
    appliedOn: '2025-01-18'
  },
  {
    id: 'LV-003',
    empId: 'EMP-2025-003',
    name: 'Saiful Islam',
    dept: 'HR',
    type: 'Earn',
    from: '2025-02-01',
    to: '2025-02-10',
    totalDays: 10,
    reason: 'Family vacation',
    status: 'Pending',
    workflow: { hod: 'Approved', dean: 'Approved', hr: 'Approved', registrar: 'Pending', vc: 'Pending' },
    appliedOn: '2025-01-10'
  },
  {
    id: 'LV-004',
    empId: 'EMP-2025-004',
    name: 'Nusrat Jahan',
    dept: 'Accounts',
    type: 'Casual',
    from: '2025-01-25',
    to: '2025-01-25',
    totalDays: 1,
    reason: 'Medical appointment',
    status: 'Rejected',
    workflow: { hod: 'Approved', dean: 'Rejected', hr: 'Pending', registrar: 'Pending', vc: 'Pending' },
    remarks: 'Request for different date',
    appliedOn: '2025-01-20'
  },
  {
    id: 'LV-005',
    empId: 'EMP-2025-006',
    name: 'Dr. Farhan Chowdhury',
    dept: 'CSE',
    type: 'Study',
    from: '2025-03-01',
    to: '2025-03-15',
    totalDays: 15,
    reason: 'Conference in Singapore',
    status: 'Approved',
    workflow: { hod: 'Approved', dean: 'Approved', hr: 'Approved', registrar: 'Approved', vc: 'Approved' },
    appliedOn: '2025-01-05'
  },
  {
    id: 'LV-006',
    empId: 'EMP-2025-007',
    name: 'Shabnam Akter',
    dept: 'Library',
    type: 'Casual',
    from: '2025-01-28',
    to: '2025-01-29',
    totalDays: 2,
    reason: 'Family function',
    status: 'Pending',
    workflow: { hod: 'Pending', dean: 'Pending', hr: 'Pending', registrar: 'Pending', vc: 'Pending' },
    appliedOn: '2025-01-19'
  },
  {
    id: 'LV-007',
    empId: 'EMP-2025-008',
    name: 'Rafiqul Islam',
    dept: 'BBA',
    type: 'Medical',
    from: '2025-01-12',
    to: '2025-01-14',
    totalDays: 3,
    reason: 'Back pain treatment',
    status: 'Approved',
    workflow: { hod: 'Approved', dean: 'Approved', hr: 'Approved', registrar: 'Approved', vc: 'Approved' },
    appliedOn: '2025-01-11'
  },
  {
    id: 'LV-008',
    empId: 'EMP-2025-009',
    name: 'Tasneem Hossain',
    dept: 'Admission',
    type: 'Special',
    from: '2025-02-14',
    to: '2025-02-14',
    totalDays: 1,
    reason: 'Marriage anniversary',
    status: 'Approved',
    workflow: { hod: 'Approved', dean: 'Approved', hr: 'Approved', registrar: 'Approved', vc: 'Approved' },
    appliedOn: '2025-01-30'
  },
  {
    id: 'LV-009',
    empId: 'EMP-2025-010',
    name: 'Prof. Dr. Rahim Uddin',
    dept: 'CSE',
    type: 'Duty',
    from: '2025-02-05',
    to: '2025-02-07',
    totalDays: 3,
    reason: 'University accreditation visit',
    status: 'Approved',
    workflow: { hod: 'Approved', dean: 'Approved', hr: 'Approved', registrar: 'Approved', vc: 'Approved' },
    appliedOn: '2025-01-25'
  },
  {
    id: 'LV-010',
    empId: 'EMP-2025-011',
    name: 'Dr. Khaleda Rahman',
    dept: 'BBA',
    type: 'Earn',
    from: '2025-03-20',
    to: '2025-03-30',
    totalDays: 11,
    reason: 'Umrah pilgrimage',
    status: 'Pending',
    workflow: { hod: 'Approved', dean: 'Approved', hr: 'Approved', registrar: 'Approved', vc: 'Pending' },
    appliedOn: '2025-01-15'
  },
  {
    id: 'LV-011',
    empId: 'EMP-2025-012',
    name: 'Aminul Haque',
    dept: 'HR',
    type: 'Casual',
    from: '2025-01-24',
    to: '2025-01-24',
    totalDays: 1,
    reason: 'Personal emergency',
    status: 'Cancelled',
    workflow: { hod: 'Pending', dean: 'Pending', hr: 'Pending', registrar: 'Pending', vc: 'Pending' },
    remarks: 'Cancelled by employee',
    appliedOn: '2025-01-23'
  },
  {
    id: 'LV-012',
    empId: 'EMP-2025-013',
    name: 'Jahangir Kabir',
    dept: 'Accounts',
    type: 'Medical',
    from: '2025-02-01',
    to: '2025-02-02',
    totalDays: 2,
    reason: 'Dental surgery',
    status: 'Pending',
    workflow: { hod: 'Approved', dean: 'Approved', hr: 'Pending', registrar: 'Pending', vc: 'Pending' },
    appliedOn: '2025-01-19'
  },
  {
    id: 'LV-013',
    empId: 'EMP-2025-001',
    name: 'Dr. Ayesha Karim',
    dept: 'CSE',
    type: 'Study',
    from: '2025-04-10',
    to: '2025-04-20',
    totalDays: 11,
    reason: 'Research workshop in Malaysia',
    status: 'Pending',
    workflow: { hod: 'Pending', dean: 'Pending', hr: 'Pending', registrar: 'Pending', vc: 'Pending' },
    appliedOn: '2025-01-21'
  },
  {
    id: 'LV-014',
    empId: 'EMP-2025-003',
    name: 'Saiful Islam',
    dept: 'HR',
    type: 'Casual',
    from: '2025-01-30',
    to: '2025-01-31',
    totalDays: 2,
    reason: 'Child illness',
    status: 'Approved',
    workflow: { hod: 'Approved', dean: 'Approved', hr: 'Approved', registrar: 'Approved', vc: 'Approved' },
    appliedOn: '2025-01-29'
  },
  {
    id: 'LV-015',
    empId: 'EMP-2025-007',
    name: 'Shabnam Akter',
    dept: 'Library',
    type: 'Medical',
    from: '2025-01-20',
    to: '2025-01-21',
    totalDays: 2,
    reason: 'Medical checkup',
    status: 'Approved',
    workflow: { hod: 'Approved', dean: 'Approved', hr: 'Approved', registrar: 'Approved', vc: 'Approved' },
    appliedOn: '2025-01-18'
  }
]

export const HRM_LEAVE_BALANCES: LeaveBalance[] = [
  { empId: 'EMP-2025-001', name: 'Dr. Ayesha Karim', dept: 'CSE', casual: 15, medical: 20, earn: 30, special: 10, used: 13, remaining: 62 },
  { empId: 'EMP-2025-002', name: 'Mahbub Alam', dept: 'BBA', casual: 12, medical: 15, earn: 20, special: 5, used: 3, remaining: 49 },
  { empId: 'EMP-2025-003', name: 'Saiful Islam', dept: 'HR', casual: 15, medical: 20, earn: 25, special: 10, used: 12, remaining: 58 },
  { empId: 'EMP-2025-004', name: 'Nusrat Jahan', dept: 'Accounts', casual: 15, medical: 20, earn: 28, special: 10, used: 0, remaining: 73 },
  { empId: 'EMP-2025-006', name: 'Dr. Farhan Chowdhury', dept: 'CSE', casual: 15, medical: 20, earn: 35, special: 15, used: 15, remaining: 70 },
  { empId: 'EMP-2025-007', name: 'Shabnam Akter', dept: 'Library', casual: 15, medical: 20, earn: 25, special: 10, used: 4, remaining: 66 },
  { empId: 'EMP-2025-008', name: 'Rafiqul Islam', dept: 'BBA', casual: 15, medical: 20, earn: 30, special: 10, used: 3, remaining: 72 },
  { empId: 'EMP-2025-009', name: 'Tasneem Hossain', dept: 'Admission', casual: 12, medical: 15, earn: 18, special: 5, used: 1, remaining: 49 },
  { empId: 'EMP-2025-010', name: 'Prof. Dr. Rahim Uddin', dept: 'CSE', casual: 15, medical: 20, earn: 40, special: 20, used: 3, remaining: 92 },
  { empId: 'EMP-2025-011', name: 'Dr. Khaleda Rahman', dept: 'BBA', casual: 15, medical: 20, earn: 38, special: 20, used: 11, remaining: 82 },
  { empId: 'EMP-2025-012', name: 'Aminul Haque', dept: 'HR', casual: 15, medical: 20, earn: 32, special: 15, used: 0, remaining: 82 },
  { empId: 'EMP-2025-013', name: 'Jahangir Kabir', dept: 'Accounts', casual: 15, medical: 20, earn: 35, special: 15, used: 2, remaining: 83 }
]
