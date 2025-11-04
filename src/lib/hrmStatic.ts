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
