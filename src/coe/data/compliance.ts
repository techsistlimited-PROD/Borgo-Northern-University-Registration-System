// Compliance & UGC/BANBAIS Reporting Data

// UGC Annual Return Data (35 records)
export const UGC_ANNUAL_RETURN = Array.from({ length: 35 }, (_, i) => ({
  sl: i + 1,
  program: ['CSE', 'BBA', 'EEE', 'LLB', 'MBA', 'English', 'Physics'][i % 7],
  level: i % 3 === 0 ? 'Undergraduate' : i % 3 === 1 ? 'Graduate' : 'Postgraduate',
  enrolled: 120 + i * 5,
  graduated: 100 + i * 4,
  retention: (85 + Math.random() * 10).toFixed(1),
  facultyCount: 8 + (i % 5),
  labCount: 2 + (i % 3),
  academicYear: `202${3 + Math.floor(i / 12)}-202${4 + Math.floor(i / 12)}`
}))

// UGC Program-wise Enrollment (42 records)
export const UGC_PROGRAM_ENROLLMENT = Array.from({ length: 42 }, (_, i) => ({
  sl: i + 1,
  programCode: `PRG-${String(i + 1).padStart(3, '0')}`,
  programName: ['Computer Science & Engineering', 'Business Administration', 'Electrical & Electronic Eng', 'Law', 'MBA', 'English', 'Physics', 'Mathematics'][i % 8],
  department: ['CSE', 'BBA', 'EEE', 'LAW', 'MBA', 'ENG', 'PHY', 'MATH'][i % 8],
  semester: `Fall 202${3 + Math.floor(i / 14)}`,
  male: 60 + i * 2,
  female: 40 + i,
  total: 100 + i * 3,
  newAdmissions: 25 + (i % 10),
  continuing: 75 + (i % 15)
}))

// UGC Graduation Statistics (38 records)
export const UGC_GRADUATION_STATS = Array.from({ length: 38 }, (_, i) => ({
  sl: i + 1,
  program: ['CSE', 'BBA', 'EEE', 'LLB', 'MBA', 'English'][i % 6],
  semester: `${['Spring', 'Summer', 'Fall'][i % 3]} 202${3 + Math.floor(i / 12)}`,
  totalGraduates: 80 + i * 3,
  distinction: 5 + (i % 5),
  firstClass: 20 + (i % 10),
  secondUpper: 25 + (i % 8),
  secondLower: 15 + (i % 6),
  thirdClass: 10 + (i % 4),
  pass: 5 + (i % 3),
  avgCGPA: (3.2 + Math.random() * 0.5).toFixed(2),
  completionRate: (82 + Math.random() * 12).toFixed(1)
}))

// UGC Faculty Information (30 records)
export const UGC_FACULTY_INFO = Array.from({ length: 30 }, (_, i) => ({
  sl: i + 1,
  facultyId: `FAC-202${3 + Math.floor(i / 10)}-${String(i + 1).padStart(3, '0')}`,
  name: `Dr. ${['Ahmed', 'Rahman', 'Hassan', 'Khan', 'Ali', 'Karim', 'Hossain', 'Islam'][i % 8]} ${['Mahmud', 'Rahim', 'Haque', 'Uddin'][i % 4]}`,
  department: ['CSE', 'BBA', 'EEE', 'LLB', 'MBA', 'English'][i % 6],
  designation: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'][i % 4],
  qualification: i % 3 === 0 ? 'PhD' : 'Masters',
  experience: 5 + (i % 20),
  courseLoad: 6 + (i % 6),
  researchPapers: i % 5
}))

// UGC Infrastructure Report (25 records)
export const UGC_INFRASTRUCTURE = Array.from({ length: 25 }, (_, i) => ({
  sl: i + 1,
  facilityType: ['Classroom', 'Laboratory', 'Library', 'Seminar Hall', 'Computer Lab'][i % 5],
  location: ['Permanent Campus', 'Banani Campus', 'Mirpur Campus'][i % 3],
  roomNo: `${['A', 'B', 'C', 'D'][i % 4]}-${100 + i}`,
  capacity: 30 + i * 2,
  equipped: i % 2 === 0 ? 'Yes' : 'Partial',
  condition: ['Excellent', 'Good', 'Fair'][i % 3],
  lastMaintenance: `202${4 + Math.floor(i / 8)}-${String(1 + (i % 12)).padStart(2, '0')}-15`,
  utilization: (60 + Math.random() * 30).toFixed(1)
}))

// BANBAIS Student Enrollment Data (50 records)
export const BANBAIS_STUDENT_ENROLLMENT = Array.from({ length: 50 }, (_, i) => ({
  sl: i + 1,
  studentId: `STU-202${2 + Math.floor(i / 15)}-${String(i + 1).padStart(4, '0')}`,
  name: `${['Ahmed', 'Rahman', 'Sultana', 'Akter', 'Khan', 'Ali', 'Begum', 'Hossain'][i % 8]} ${['Karim', 'Rahim', 'Hassan', 'Mahmud'][i % 4]}`,
  program: ['CSE', 'BBA', 'EEE', 'LLB', 'MBA'][i % 5],
  semester: `Fall 202${3 + Math.floor(i / 16)}`,
  gender: i % 3 === 0 ? 'Female' : 'Male',
  dob: `199${5 + (i % 5)}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`,
  district: ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna'][i % 5],
  status: ['Active', 'Inactive', 'Graduated'][i % 10 < 7 ? 0 : i % 10 < 9 ? 2 : 1]
}))

// BANBAIS Examination Results (45 records)
export const BANBAIS_EXAM_RESULTS = Array.from({ length: 45 }, (_, i) => ({
  sl: i + 1,
  studentId: `STU-202${2 + Math.floor(i / 15)}-${String(i + 1).padStart(4, '0')}`,
  program: ['CSE', 'BBA', 'EEE', 'LLB', 'MBA'][i % 5],
  semester: `${['Spring', 'Summer', 'Fall'][i % 3]} 202${3 + Math.floor(i / 15)}`,
  examType: ['Midterm', 'Final'][i % 2],
  coursesRegistered: 4 + (i % 3),
  coursesPassed: 3 + (i % 4),
  gpa: (2.5 + Math.random() * 1.5).toFixed(2),
  cgpa: (2.8 + Math.random() * 1.2).toFixed(2),
  result: i % 10 < 8 ? 'Pass' : 'Fail',
  remarks: i % 10 < 8 ? 'Regular' : i % 10 === 8 ? 'Backlog' : 'Special Exam'
}))

// BANBAIS Faculty and Staff Data (32 records)
export const BANBAIS_FACULTY_STAFF = Array.from({ length: 32 }, (_, i) => ({
  sl: i + 1,
  employeeId: `EMP-202${2 + Math.floor(i / 10)}-${String(i + 1).padStart(3, '0')}`,
  name: `${i % 3 === 0 ? 'Dr.' : i % 3 === 1 ? 'Prof.' : ''} ${['Ahmed', 'Rahman', 'Hassan', 'Khan'][i % 4]} ${['Ali', 'Karim', 'Hossain'][i % 3]}`,
  type: i % 4 === 0 ? 'Faculty' : i % 4 === 1 ? 'Admin' : i % 4 === 2 ? 'Support' : 'Technical',
  department: ['CSE', 'BBA', 'EEE', 'LLB', 'Administration', 'IT'][i % 6],
  designation: ['Professor', 'Associate Prof', 'Assistant Prof', 'Officer', 'Assistant'][i % 5],
  joiningDate: `20${15 + (i % 10)}-${String(1 + (i % 12)).padStart(2, '0')}-01`,
  qualification: ['PhD', 'Masters', 'Bachelors'][i % 3],
  salary: 50000 + i * 2000
}))

// BANBAIS Financial Summary (30 records)
export const BANBAIS_FINANCIAL = Array.from({ length: 30 }, (_, i) => ({
  sl: i + 1,
  semester: `${['Spring', 'Summer', 'Fall'][i % 3]} 202${3 + Math.floor(i / 9)}`,
  tuitionRevenue: 5000000 + i * 100000,
  scholarships: 500000 + i * 10000,
  operatingExpenses: 3000000 + i * 80000,
  salaries: 2500000 + i * 60000,
  infrastructure: 800000 + i * 20000,
  netSurplus: 1200000 + i * 40000,
  studentCount: 800 + i * 10,
  avgTuitionPerStudent: 60000 + i * 500
}))

// BANBAIS Facility Utilization (28 records)
export const BANBAIS_FACILITY = Array.from({ length: 28 }, (_, i) => ({
  sl: i + 1,
  facility: ['Classroom', 'Lab', 'Library', 'Auditorium', 'Cafeteria', 'Sports'][i % 6],
  campus: ['Permanent', 'Banani', 'Mirpur'][i % 3],
  totalCapacity: 100 + i * 20,
  avgUtilization: 50 + i * 2,
  peakUtilization: 80 + i,
  utilizationRate: (60 + Math.random() * 30).toFixed(1),
  maintenanceCost: 50000 + i * 5000,
  lastUpgrade: `202${3 + Math.floor(i / 9)}-${String(1 + (i % 12)).padStart(2, '0')}`
}))

// Audit Trail (40 records)
export const AUDIT_TRAIL = Array.from({ length: 40 }, (_, i) => ({
  sl: i + 1,
  timestamp: `2025-${String(10 + (i % 3)).padStart(2, '0')}-${String(1 + i).padStart(2, '0')} ${String(9 + (i % 8)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`,
  action: ['Result Published', 'Certificate Issued', 'Block Applied', 'Correction Approved', 'Transcript Generated'][i % 5],
  module: ['Publish Results', 'Certificates', 'Block Manager', 'Corrections', 'Transcripts'][i % 5],
  performedBy: `${['Dr. Ahmed', 'Prof. Karim', 'COE Officer', 'Exam Coordinator'][i % 4]}`,
  targetEntity: `${['STU-2023', 'STU-2024', 'STU-2025'][i % 3]}-${String((i % 100) + 1).padStart(4, '0')}`,
  details: `${['Published', 'Issued', 'Applied', 'Approved', 'Generated'][i % 5]} for ${['Fall 2024', 'Spring 2025'][i % 2]}`,
  ipAddress: `192.168.${i % 255}.${(i * 7) % 255}`
}))

// Data Access Log (35 records)
export const DATA_ACCESS_LOG = Array.from({ length: 35 }, (_, i) => ({
  sl: i + 1,
  timestamp: `2025-11-${String(1 + i).padStart(2, '0')} ${String(8 + (i % 12)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`,
  user: `${['admin', 'coe_officer', 'coordinator', 'dean'][i % 4]}@nu.edu.bd`,
  accessType: ['View', 'Download', 'Export', 'Print'][i % 4],
  dataType: ['Student Records', 'Transcripts', 'Certificates', 'Results', 'Blocks'][i % 5],
  recordCount: 1 + (i % 50),
  purpose: ['Administrative Review', 'Report Generation', 'Verification Request', 'Audit Compliance'][i % 4],
  ipAddress: `10.0.${i % 255}.${(i * 3) % 255}`
}))

// Result Publication History (38 records)
export const RESULT_PUBLICATION_LOG = Array.from({ length: 38 }, (_, i) => ({
  sl: i + 1,
  publishDate: `2025-${String(9 + (i % 3)).padStart(2, '0')}-${String(1 + i).padStart(2, '0')}`,
  semester: `${['Spring', 'Summer', 'Fall'][i % 3]} 202${4 + Math.floor(i / 12)}`,
  program: ['CSE', 'BBA', 'EEE', 'LLB', 'MBA'][i % 5],
  section: String.fromCharCode(65 + (i % 5)),
  examType: ['Midterm', 'Final', 'Supplementary'][i % 3],
  studentCount: 30 + i,
  publishedBy: `${['Dr. Ahmed', 'Prof. Rahman', 'COE Officer'][i % 3]}`,
  avgGPA: (2.8 + Math.random() * 1.0).toFixed(2),
  passRate: (75 + Math.random() * 20).toFixed(1),
  remarks: i % 10 === 0 ? 'Delayed' : 'On Time'
}))

// Certificate Issuance Log (45 records)
export const CERTIFICATE_ISSUANCE_LOG = Array.from({ length: 45 }, (_, i) => ({
  sl: i + 1,
  issueDate: `2025-${String(10 + (i % 2)).padStart(2, '0')}-${String(1 + i).padStart(2, '0')}`,
  serialNo: `SER-2025-${String(i + 100).padStart(5, '0')}`,
  studentId: `STU-202${2 + Math.floor(i / 15)}-${String(i + 1).padStart(4, '0')}`,
  studentName: `${['Ahmed', 'Rahman', 'Sultana', 'Khan', 'Ali', 'Begum'][i % 6]} ${['Karim', 'Hassan'][i % 2]}`,
  documentType: ['Transcript', 'Degree Certificate', 'Provisional Cert', 'Migration Cert', 'Character Cert'][i % 5],
  program: ['CSE', 'BBA', 'EEE', 'LLB', 'MBA'][i % 5],
  issuedBy: 'COE Office',
  collectionDate: i % 3 === 0 ? `2025-${String(10 + (i % 2)).padStart(2, '0')}-${String(3 + i).padStart(2, '0')}` : 'Pending',
  status: i % 3 === 0 ? 'Collected' : 'Ready'
}))

// Tabulation Approval Log (32 records)
export const TABULATION_APPROVAL_LOG = Array.from({ length: 32 }, (_, i) => ({
  sl: i + 1,
  approvalDate: `2025-${String(9 + (i % 3)).padStart(2, '0')}-${String(5 + i).padStart(2, '0')}`,
  semester: `${['Spring', 'Summer', 'Fall'][i % 3]} 202${4 + Math.floor(i / 10)}`,
  program: ['CSE', 'BBA', 'EEE', 'LLB'][i % 4],
  examType: ['Midterm', 'Final'][i % 2],
  studentCount: 35 + i,
  approvedBy: `Tabulation Board - ${['Dr. Ahmed (Chair)', 'Prof. Rahman (Member)', 'Dr. Hassan (Member)'][i % 3]}`,
  corrections: i % 5,
  avgCGPA: (3.0 + Math.random() * 0.8).toFixed(2),
  remarks: i % 8 === 0 ? 'Corrections Applied' : 'No Issues',
  meetingNo: `TB-202${4 + Math.floor(i / 10)}-${String(i + 1).padStart(2, '0')}`
}))

// UGC Graduated Students Registry (50 records)
export const UGC_GRADUATED_STUDENTS = Array.from({ length: 50 }, (_, i) => ({
  sl: i + 1,
  ugcId: `UGC-NU-202${Math.floor(i / 20) + 2}-${String((i % 20) + 1).padStart(4, '0')}`,
  studentId: `STU-202${Math.floor(i / 20) + 2}-${String((i % 100) + 1).padStart(4, '0')}`,
  studentName: `${['Nishat', 'Arif', 'Tahmina', 'Raihan', 'Sabrina', 'Farzana', 'Tanvir', 'Ahmed', 'Sadia', 'Mahfuz'][i % 10]} ${['Sultana', 'Hossain', 'Khan', 'Ahmed', 'Akter', 'Kabir', 'Rahman', 'Karim', 'Hassan', 'Ali'][i % 10]}`,
  program: ['BSc in Computer Science & Engineering', 'BBA', 'BSc in Electrical & Electronic Engineering', 'LLB (Hons)', 'MBA'][i % 5],
  programCode: ['CSE', 'BBA', 'EEE', 'LLB', 'MBA'][i % 5],
  session: `${2019 + Math.floor(i / 12)}-${2020 + Math.floor(i / 12)}`,
  passingYear: 2022 + Math.floor(i / 15),
  cgpa: (3.0 + Math.random() * 1.0).toFixed(2),
  classification: i % 10 < 2 ? 'First Class (Distinction)' : i % 10 < 6 ? 'First Class' : i % 10 < 8 ? 'Second Class (Upper)' : 'Second Class (Lower)',
  totalCredits: 120 + (i % 3) * 12,
  gender: i % 3 === 0 ? 'Female' : 'Male',
  dateOfBirth: `199${4 + (i % 5)}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`,
  graduationDate: `202${2 + Math.floor(i / 15)}-12-${String(15 + (i % 10)).padStart(2, '0')}`
}))

// BANBAIS Graduated Students Registry (50 records)
export const BANBAIS_GRADUATED_STUDENTS = Array.from({ length: 50 }, (_, i) => ({
  sl: i + 1,
  banbaisId: `BAN-NU-202${Math.floor(i / 20) + 2}-${String((i % 20) + 1).padStart(4, '0')}`,
  studentId: `STU-202${Math.floor(i / 20) + 2}-${String((i % 100) + 1).padStart(4, '0')}`,
  studentName: `${['Nishat', 'Arif', 'Tahmina', 'Raihan', 'Sabrina', 'Farzana', 'Tanvir', 'Ahmed', 'Sadia', 'Mahfuz'][i % 10]} ${['Sultana', 'Hossain', 'Khan', 'Ahmed', 'Akter', 'Kabir', 'Rahman', 'Karim', 'Hassan', 'Ali'][i % 10]}`,
  program: ['BSc in Computer Science & Engineering', 'BBA', 'BSc in Electrical & Electronic Engineering', 'LLB (Hons)', 'MBA'][i % 5],
  programCode: ['CSE', 'BBA', 'EEE', 'LLB', 'MBA'][i % 5],
  session: `${2019 + Math.floor(i / 12)}-${2020 + Math.floor(i / 12)}`,
  passingYear: 2022 + Math.floor(i / 15),
  cgpa: (3.0 + Math.random() * 1.0).toFixed(2),
  classification: i % 10 < 2 ? 'First Class (Distinction)' : i % 10 < 6 ? 'First Class' : i % 10 < 8 ? 'Second Class (Upper)' : 'Second Class (Lower)',
  totalCredits: 120 + (i % 3) * 12,
  gender: i % 3 === 0 ? 'Female' : 'Male',
  dateOfBirth: `199${4 + (i % 5)}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`,
  graduationDate: `202${2 + Math.floor(i / 15)}-12-${String(15 + (i % 10)).padStart(2, '0')}`
}))
