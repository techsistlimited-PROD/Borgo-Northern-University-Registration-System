import { Repo } from './repo'
import { DEMO_MODE } from '@/config/demo'
import { 
  Student, 
  Guardian, 
  GuardianLink, 
  AttendanceRecord, 
  Grade, 
  TermResult, 
  TER, 
  StudentPayable, 
  Receipt, 
  Notification,
  Course,
  Semester
} from './seedAll'

function now() { 
  return new Date().toISOString() 
}

function nowMinus(days: number) { 
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

function buildAttendance(studentId: string, courseId: string, section: string, n: number): AttendanceRecord[] {
  const rows: AttendanceRecord[] = []
  for (let i = 0; i < n; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const status: 'P' | 'A' | 'L' = i % 7 === 0 ? 'A' : (i % 13 === 0 ? 'L' : 'P')
    rows.push({ 
      id: `att_${studentId}_${courseId}_${i}`, 
      studentId, 
      sectionId: section,
      date: d.toISOString().slice(0, 10), 
      status,
      recordedAt: d.toISOString(),
      facultyId: 'F001'
    })
  }
  return rows
}

export function seedGuardianDemoData() {
  if (!DEMO_MODE) return

  Repo.seedOnceDemo('guardian-portal-demo:v1', () => {
    // USERS (roles: GUARDIAN) - these will be added to auth context
    // Demo credentials: father.cse@demo.nu / guardian123, guardian.bba@demo.nu / guardian123

    // GUARDIANS
    const guardians: Guardian[] = [
      { 
        id: 'g_father_01', 
        name: 'Abdul Karim', 
        email: 'father.cse@demo.nu', 
        mobile: '01711111111', 
        status: 'Active',
        preferences: { erpPush: true, sms: true, email: true }
      },
      { 
        id: 'g_mother_01', 
        name: 'Rokia Begum', 
        email: 'mother.cse@demo.nu', 
        mobile: '01722222222', 
        status: 'Active',
        preferences: { erpPush: true, sms: false, email: true }
      },
      { 
        id: 'g_guardian_02', 
        name: 'Shahidul Islam', 
        email: 'guardian.bba@demo.nu', 
        mobile: '01833333333', 
        status: 'Active',
        preferences: { erpPush: true, sms: true, email: false }
      }
    ]

    // STUDENTS (ensure these exist)
    const students: Student[] = [
      { 
        id: 'stu_cse_01', 
        ugcId: 'CSE-25010345', 
        name: 'Mahin Hasan', 
        program: 'CSE',
        programName: 'BSc in Computer Science & Engg.',
        campusId: 'PRM',
        email: 'mahin.cse@nub.edu.bd', 
        mobile: '01711234567',
        batch: 'Batch 25C',
        semester: 'Spring 2025',
        cgpa: 3.35, 
        photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MahinHasan',
        admitBlocked: false
      },
      { 
        id: 'stu_cse_02', 
        ugcId: 'CSE-25010346', 
        name: 'Arisha Khan', 
        program: 'CSE',
        programName: 'BSc in Computer Science & Engg.',
        campusId: 'PRM',
        email: 'arisha.cse@nub.edu.bd', 
        mobile: '01711234568',
        batch: 'Batch 25C',
        semester: 'Spring 2025',
        cgpa: 3.82, 
        photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ArishaKhan',
        admitBlocked: false
      },
      { 
        id: 'stu_bba_01', 
        ugcId: 'BBA-25030312', 
        name: 'Rafi Ahmed', 
        program: 'BBA',
        programName: 'BBA in Accounting & Finance',
        campusId: 'BAN',
        email: 'rafi.bba@nub.edu.bd',
        mobile: '01711234569',
        batch: 'Batch 25C',
        semester: 'Fall 2025',
        cgpa: 3.12, 
        photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RafiAhmed',
        admitBlocked: false
      }
    ]

    // GUARDIAN LINKS
    const guardianLinks: GuardianLink[] = [
      { id: 'link1', guardianId: 'g_father_01', studentId: 'stu_cse_01', relation: 'Father', isPrimary: true, createdAt: now() },
      { id: 'link2', guardianId: 'g_mother_01', studentId: 'stu_cse_01', relation: 'Mother', isPrimary: false, createdAt: now() },
      { id: 'link3', guardianId: 'g_guardian_02', studentId: 'stu_bba_01', relation: 'Guardian', isPrimary: true, createdAt: now() }
    ]

    // TERMS (active)
    const terms: Semester[] = [
      { 
        id: 'FALL-2025', 
        code: 'FA25', 
        name: 'Fall 2025',
        idCode: '03',
        startDate: '2025-09-01', 
        endDate: '2025-12-31',
        status: 'Active'
      },
      { 
        id: 'SPR-2025', 
        code: 'SP25', 
        name: 'Spring 2025',
        idCode: '01',
        startDate: '2025-01-20', 
        endDate: '2025-05-31',
        status: 'Closed'
      }
    ]

    // COURSES (subset)
    const courses: Course[] = [
      { id: 'cse101', code: 'CSE101', title: 'Intro to Programming', credit: 3, type: 'Core', program: 'CSE' },
      { id: 'cse102', code: 'CSE102', title: 'Programming Lab', credit: 1, type: 'Lab', program: 'CSE' },
      { id: 'cse203', code: 'CSE203', title: 'Data Structures', credit: 3, type: 'Core', program: 'CSE', prereq: 'CSE101' },
      { id: 'bba101', code: 'BBA101', title: 'Principles of Management', credit: 3, type: 'Core', program: 'BBA' }
    ]

    // ATTENDANCE — last 30 days rolling
    const attendance: AttendanceRecord[] = [
      ...buildAttendance('stu_cse_01', 'cse101', 'A1', 30),
      ...buildAttendance('stu_cse_01', 'cse102', 'B1', 12),
      ...buildAttendance('stu_cse_01', 'cse203', 'A2', 20),
      ...buildAttendance('stu_bba_01', 'bba101', 'M1', 18)
    ]

    // RESULTS — transcript-like past + current term status
    const grades: Grade[] = [
      // Historical (Spring-2025) for CSE student
      { id: 'res1', studentId: 'stu_cse_01', courseId: 'cse101', sectionId: 'SEC1', termId: 'SPR-2025', grade: 'A-', gradePoint: 3.7, credit: 3 },
      { id: 'res2', studentId: 'stu_cse_01', courseId: 'cse102', sectionId: 'SEC2', termId: 'SPR-2025', grade: 'A', gradePoint: 4.0, credit: 1 },
      // Current term in-progress (will be shown but locked if blocked)
      { id: 'res3', studentId: 'stu_cse_01', courseId: 'cse203', sectionId: 'SEC3', termId: 'FALL-2025', grade: 'B+', gradePoint: 3.25, credit: 3 },
      // BBA historical
      { id: 'res4', studentId: 'stu_bba_01', courseId: 'bba101', sectionId: 'SEC10', termId: 'SPR-2025', grade: 'B+', gradePoint: 3.3, credit: 3 }
    ]

    const termResults: TermResult[] = [
      { id: 'tr1', studentId: 'stu_cse_01', termId: 'SPR-2025', gpa: 3.85, cgpa: 3.85, creditsEarned: 4, status: 'Published' },
      { id: 'tr2', studentId: 'stu_cse_01', termId: 'FALL-2025', gpa: 3.25, cgpa: 3.55, creditsEarned: 7, status: 'Published' },
      { id: 'tr3', studentId: 'stu_bba_01', termId: 'SPR-2025', gpa: 3.3, cgpa: 3.3, creditsEarned: 3, status: 'Published' },
      { id: 'tr4', studentId: 'stu_bba_01', termId: 'FALL-2025', gpa: 3.5, cgpa: 3.4, creditsEarned: 6, status: 'Published' }
    ]

    // FINANCE — payables & payments (simulate dues)
    const payables: StudentPayable[] = [
      { 
        id: 'p1', 
        billNo: 'INV-2025-FA-001',
        studentId: 'stu_cse_01', 
        semesterId: 'FALL-2025', 
        lines: [
          { costHeadId: 'TUITION', amount: 35000, waiverAmount: 0, scholarshipAmount: 0, netAmount: 35000 },
          { costHeadId: 'LABFEE', amount: 3000, waiverAmount: 0, scholarshipAmount: 0, netAmount: 3000 },
          { costHeadId: 'LIBFEE', amount: 1000, waiverAmount: 0, scholarshipAmount: 0, netAmount: 1000 }
        ], 
        totalAmount: 39000, 
        paidAmount: 22000, 
        dueAmount: 17000,
        status: 'Partially Paid',
        billDate: '2025-09-01',
        dueDate: '2025-11-30'
      },
      { 
        id: 'p2', 
        billNo: 'INV-2025-FA-002',
        studentId: 'stu_bba_01', 
        semesterId: 'FALL-2025', 
        lines: [
          { costHeadId: 'TUITION', amount: 32000, waiverAmount: 0, scholarshipAmount: 0, netAmount: 32000 },
          { costHeadId: 'REGFEE', amount: 1500, waiverAmount: 0, scholarshipAmount: 0, netAmount: 1500 }
        ], 
        totalAmount: 33500, 
        paidAmount: 33500, 
        dueAmount: 0,
        status: 'Paid',
        billDate: '2025-09-01',
        dueDate: '2025-11-30'
      }
    ]

    const receipts: Receipt[] = [
      { 
        id: 'mr-10021', 
        moneyReceiptNo: 'MR-2025-10021',
        studentId: 'stu_cse_01', 
        payableId: 'p1',
        amount: 22000, 
        method: 'Bank', 
        reference: 'TXN-CSE-22000',
        date: nowMinus(10).slice(0, 10),
        collectedBy: 'Mahfuz Rahman'
      },
      { 
        id: 'mr-10055', 
        moneyReceiptNo: 'MR-2025-10055',
        studentId: 'stu_bba_01', 
        payableId: 'p2',
        amount: 33500, 
        method: 'Bank', 
        reference: 'TXN-BBA-33500',
        date: nowMinus(5).slice(0, 10),
        collectedBy: 'Mahfuz Rahman'
      }
    ]

    // TER (Teacher Evaluation Report) flags — guardian result visibility depends on this
    const terFlags: TER[] = [
      { id: 'ter_cse_01_fall', studentId: 'stu_cse_01', termId: 'FALL-2025', status: 'PENDING', submittedAt: undefined },
      { id: 'ter_bba_01_fall', studentId: 'stu_bba_01', termId: 'FALL-2025', status: 'SUBMITTED', submittedAt: nowMinus(15) }
    ]

    // NOTIFICATIONS
    const notifications: Notification[] = [
      { 
        id: 'NOT_DEMO_001', 
        recipientId: 'g_father_01', 
        recipientType: 'GUARDIAN', 
        channel: 'ERP', 
        title: 'Attendance Alert', 
        message: 'Your ward Mahin Hasan was marked absent in CSE101 on 2025-10-07', 
        createdAt: nowMinus(7), 
        status: 'Unread' 
      },
      { 
        id: 'NOT_DEMO_002', 
        recipientId: 'g_father_01', 
        recipientType: 'GUARDIAN', 
        channel: 'SMS', 
        title: 'Payment Reminder', 
        message: 'Outstanding dues: 17,000 BDT. Please clear before 2025-11-30 to view results.', 
        createdAt: nowMinus(5), 
        status: 'Read' 
      },
      { 
        id: 'NOT_DEMO_003', 
        recipientId: 'g_guardian_02', 
        recipientType: 'GUARDIAN', 
        channel: 'ERP', 
        title: 'Result Published', 
        message: 'Fall 2025 results for Rafi Ahmed are now available', 
        createdAt: nowMinus(3), 
        status: 'Unread' 
      }
    ]

    // Upsert data
    Repo.upsertMany('guardians', guardians)
    Repo.upsertMany('students', students)
    Repo.upsertMany('guardianLinks', guardianLinks)
    Repo.upsertMany('semesters', terms)
    Repo.upsertMany('courses', courses)
    Repo.upsertMany('attendanceRecords', attendance)
    Repo.upsertMany('grades', grades)
    Repo.upsertMany('termResults', termResults)
    Repo.upsertMany('studentPayables', payables)
    Repo.upsertMany('receipts', receipts)
    Repo.upsertMany('ters', terFlags)
    Repo.upsertMany('notifications', notifications)

    console.log('✅ Guardian Portal demo data seeded successfully')
  })
}
