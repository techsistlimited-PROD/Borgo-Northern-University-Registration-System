export type Ward = {
  id: string
  name: string
  program: 'BSc CSE' | 'BBA' | 'LLB'
  batch: string
  universityId: string
  cgpa: number
  photoUrl?: string
}

export const DEMO_GUARDIANS = [
  { id: 'g_father_01', name: 'Abdul Karim', email: 'father.cse@demo.nu' },
  { id: 'g_mother_01', name: 'Rokia Begum', email: 'mother.cse@demo.nu' },
  { id: 'g_guardian_02', name: 'Shahidul Islam', email: 'guardian.bba@demo.nu' }
]

export const DEMO_WARDS: Record<string, Ward[]> = {
  g_father_01: [
    {
      id: 'stu_cse_01',
      name: 'Mahin Hasan',
      program: 'BSc CSE',
      batch: 'Spring 2025',
      universityId: 'CSE-25010341',
      cgpa: 3.62,
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MahinHasan'
    }
  ],
  g_mother_01: [
    {
      id: 'stu_cse_01',
      name: 'Mahin Hasan',
      program: 'BSc CSE',
      batch: 'Spring 2025',
      universityId: 'CSE-25010341',
      cgpa: 3.62,
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MahinHasan'
    }
  ],
  g_guardian_02: [
    {
      id: 'stu_bba_01',
      name: 'Rafi Ahmed',
      program: 'BBA',
      batch: 'Fall 2025',
      universityId: 'BBA-25030327',
      cgpa: 3.28,
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RafiAhmed'
    }
  ]
}

// Attendance (last 30 days)
export const DEMO_ATTENDANCE = [
  // stu_cse_01 - CSE student
  { wardId: 'stu_cse_01', date: '2025-10-01', course: 'CSE101', title: 'Intro to Programming', slot: '10:00-11:30', status: 'P' },
  { wardId: 'stu_cse_01', date: '2025-10-02', course: 'CSE101', title: 'Intro to Programming', slot: '10:00-11:30', status: 'P' },
  { wardId: 'stu_cse_01', date: '2025-10-03', course: 'CSE102', title: 'Programming Lab', slot: '12:00-13:30', status: 'A' },
  { wardId: 'stu_cse_01', date: '2025-10-04', course: 'CSE101', title: 'Intro to Programming', slot: '10:00-11:30', status: 'P' },
  { wardId: 'stu_cse_01', date: '2025-10-05', course: 'CSE102', title: 'Programming Lab', slot: '12:00-13:30', status: 'P' },
  { wardId: 'stu_cse_01', date: '2025-10-07', course: 'CSE101', title: 'Intro to Programming', slot: '10:00-11:30', status: 'A' },
  { wardId: 'stu_cse_01', date: '2025-10-08', course: 'CSE101', title: 'Intro to Programming', slot: '10:00-11:30', status: 'P' },
  { wardId: 'stu_cse_01', date: '2025-10-09', course: 'CSE102', title: 'Programming Lab', slot: '12:00-13:30', status: 'P' },
  { wardId: 'stu_cse_01', date: '2025-10-10', course: 'MAT101', title: 'Calculus I', slot: '14:00-15:30', status: 'P' },
  { wardId: 'stu_cse_01', date: '2025-10-11', course: 'CSE101', title: 'Intro to Programming', slot: '10:00-11:30', status: 'L' },
  { wardId: 'stu_cse_01', date: '2025-10-12', course: 'MAT101', title: 'Calculus I', slot: '14:00-15:30', status: 'P' },
  { wardId: 'stu_cse_01', date: '2025-10-14', course: 'CSE101', title: 'Intro to Programming', slot: '10:00-11:30', status: 'P' },
  { wardId: 'stu_cse_01', date: '2025-10-15', course: 'CSE102', title: 'Programming Lab', slot: '12:00-13:30', status: 'P' },
  { wardId: 'stu_cse_01', date: '2025-10-16', course: 'CSE101', title: 'Intro to Programming', slot: '10:00-11:30', status: 'P' },
  { wardId: 'stu_cse_01', date: '2025-10-17', course: 'MAT101', title: 'Calculus I', slot: '14:00-15:30', status: 'P' },
  { wardId: 'stu_cse_01', date: '2025-10-18', course: 'CSE101', title: 'Intro to Programming', slot: '10:00-11:30', status: 'P' },
  { wardId: 'stu_cse_01', date: '2025-10-19', course: 'CSE102', title: 'Programming Lab', slot: '12:00-13:30', status: 'P' },
  { wardId: 'stu_cse_01', date: '2025-10-21', course: 'CSE101', title: 'Intro to Programming', slot: '10:00-11:30', status: 'A' },
  { wardId: 'stu_cse_01', date: '2025-10-22', course: 'CSE101', title: 'Intro to Programming', slot: '10:00-11:30', status: 'P' },
  { wardId: 'stu_cse_01', date: '2025-10-23', course: 'MAT101', title: 'Calculus I', slot: '14:00-15:30', status: 'P' },
  { wardId: 'stu_cse_01', date: '2025-10-24', course: 'CSE102', title: 'Programming Lab', slot: '12:00-13:30', status: 'P' },
  { wardId: 'stu_cse_01', date: '2025-10-25', course: 'CSE101', title: 'Intro to Programming', slot: '10:00-11:30', status: 'P' },
  { wardId: 'stu_cse_01', date: '2025-10-26', course: 'MAT101', title: 'Calculus I', slot: '14:00-15:30', status: 'P' },
  { wardId: 'stu_cse_01', date: '2025-10-28', course: 'CSE101', title: 'Intro to Programming', slot: '10:00-11:30', status: 'P' },
  { wardId: 'stu_cse_01', date: '2025-10-29', course: 'CSE102', title: 'Programming Lab', slot: '12:00-13:30', status: 'P' },

  // stu_bba_01 - BBA student
  { wardId: 'stu_bba_01', date: '2025-10-02', course: 'BUS101', title: 'Principles of Management', slot: '09:00-10:30', status: 'P' },
  { wardId: 'stu_bba_01', date: '2025-10-03', course: 'ACC110', title: 'Financial Accounting', slot: '11:00-12:30', status: 'P' },
  { wardId: 'stu_bba_01', date: '2025-10-04', course: 'BUS101', title: 'Principles of Management', slot: '09:00-10:30', status: 'P' },
  { wardId: 'stu_bba_01', date: '2025-10-05', course: 'ACC110', title: 'Financial Accounting', slot: '11:00-12:30', status: 'P' },
  { wardId: 'stu_bba_01', date: '2025-10-07', course: 'BUS101', title: 'Principles of Management', slot: '09:00-10:30', status: 'P' },
  { wardId: 'stu_bba_01', date: '2025-10-09', course: 'BUS101', title: 'Principles of Management', slot: '09:00-10:30', status: 'P' },
  { wardId: 'stu_bba_01', date: '2025-10-10', course: 'ACC110', title: 'Financial Accounting', slot: '11:00-12:30', status: 'P' },
  { wardId: 'stu_bba_01', date: '2025-10-11', course: 'BUS101', title: 'Principles of Management', slot: '09:00-10:30', status: 'P' },
  { wardId: 'stu_bba_01', date: '2025-10-12', course: 'ACC110', title: 'Financial Accounting', slot: '11:00-12:30', status: 'P' },
  { wardId: 'stu_bba_01', date: '2025-10-14', course: 'BUS101', title: 'Principles of Management', slot: '09:00-10:30', status: 'P' },
  { wardId: 'stu_bba_01', date: '2025-10-16', course: 'BUS101', title: 'Principles of Management', slot: '09:00-10:30', status: 'P' },
  { wardId: 'stu_bba_01', date: '2025-10-17', course: 'ACC110', title: 'Financial Accounting', slot: '11:00-12:30', status: 'P' },
  { wardId: 'stu_bba_01', date: '2025-10-18', course: 'BUS101', title: 'Principles of Management', slot: '09:00-10:30', status: 'P' },
  { wardId: 'stu_bba_01', date: '2025-10-19', course: 'ACC110', title: 'Financial Accounting', slot: '11:00-12:30', status: 'P' },
  { wardId: 'stu_bba_01', date: '2025-10-21', course: 'BUS101', title: 'Principles of Management', slot: '09:00-10:30', status: 'P' },
  { wardId: 'stu_bba_01', date: '2025-10-23', course: 'BUS101', title: 'Principles of Management', slot: '09:00-10:30', status: 'P' },
  { wardId: 'stu_bba_01', date: '2025-10-24', course: 'ACC110', title: 'Financial Accounting', slot: '11:00-12:30', status: 'P' },
  { wardId: 'stu_bba_01', date: '2025-10-25', course: 'BUS101', title: 'Principles of Management', slot: '09:00-10:30', status: 'P' },
  { wardId: 'stu_bba_01', date: '2025-10-26', course: 'ACC110', title: 'Financial Accounting', slot: '11:00-12:30', status: 'P' },
  { wardId: 'stu_bba_01', date: '2025-10-28', course: 'BUS101', title: 'Principles of Management', slot: '09:00-10:30', status: 'P' }
]

// Results (current + previous semesters)
export const DEMO_RESULTS: Record<string, any> = {
  stu_cse_01: {
    cgpa: 3.62,
    semesters: [
      {
        term: 'Spring 2025',
        gpa: 3.55,
        released: true,
        courses: [
          { code: 'CSE101', title: 'Intro to Programming', credit: 3, grade: 'A-', gp: 3.7 },
          { code: 'MAT101', title: 'Calculus I', credit: 3, grade: 'B+', gp: 3.3 },
          { code: 'ENG101', title: 'English Composition', credit: 2, grade: 'A', gp: 4.0 }
        ]
      },
      {
        term: 'Fall 2025',
        gpa: 3.7,
        released: true,
        courses: [
          { code: 'CSE102', title: 'Programming Lab', credit: 1, grade: 'A', gp: 4.0 },
          { code: 'PHY101', title: 'Physics I', credit: 3, grade: 'A-', gp: 3.7 }
        ]
      }
    ],
    gates: { dues: 17000, terPending: true } // BLOCK current results
  },
  stu_bba_01: {
    cgpa: 3.28,
    semesters: [
      {
        term: 'Fall 2025',
        gpa: 3.3,
        released: true,
        courses: [
          { code: 'BUS101', title: 'Principles of Management', credit: 3, grade: 'B+', gp: 3.3 },
          { code: 'ACC110', title: 'Financial Accounting', credit: 3, grade: 'B', gp: 3.0 }
        ]
      }
    ],
    gates: { dues: 0, terPending: false } // UNLOCKED
  }
}

// Finance (payables + payments)
export const DEMO_FINANCE: Record<string, any> = {
  stu_cse_01: {
    summary: { totalBill: 52000, totalPaid: 35000, due: 17000 },
    payables: [
      { mr: 'INV-25-000341', head: 'Tuition Fee', amount: 40000, due: '2025-10-15', status: 'Partial' },
      { mr: 'INV-25-000342', head: 'Lab Fee', amount: 7000, due: '2025-10-15', status: 'Paid' },
      { mr: 'INV-25-000343', head: 'Library Fee', amount: 5000, due: '2025-10-15', status: 'Unpaid' }
    ],
    payments: [
      { mr: 'MR-25-000781', date: '2025-10-05', amount: 30000, method: 'Online (bKash)' },
      { mr: 'MR-25-000812', date: '2025-10-20', amount: 5000, method: 'Cash' }
    ]
  },
  stu_bba_01: {
    summary: { totalBill: 38000, totalPaid: 38000, due: 0 },
    payables: [
      { mr: 'INV-25-000511', head: 'Tuition Fee', amount: 35000, due: '2025-10-10', status: 'Paid' },
      { mr: 'INV-25-000512', head: 'ID Card', amount: 3000, due: '2025-10-10', status: 'Paid' }
    ],
    payments: [{ mr: 'MR-25-000921', date: '2025-10-08', amount: 38000, method: 'Bank (Sonali)' }]
  }
}

// Notifications
export const DEMO_NOTIFICATIONS = (guardianId: string) => {
  const notifsByGuardian: Record<string, any[]> = {
    g_father_01: [
      {
        id: 'n1',
        ts: '2025-10-28T09:05:00Z',
        title: 'Absence Alert',
        body: 'Mahin Hasan was absent in CSE102 Programming Lab on Oct 3.',
        read: false
      },
      {
        id: 'n2',
        ts: '2025-10-29T12:30:00Z',
        title: 'Payment Reminder',
        body: 'Fall 2025 dues pending: 17,000 BDT. Please clear before results are released.',
        read: false
      },
      {
        id: 'n3',
        ts: '2025-10-27T10:15:00Z',
        title: 'TER Pending',
        body: 'Teacher Evaluation Report (TER) for Mahin Hasan is still pending. Results will be locked until submitted.',
        read: true
      }
    ],
    g_mother_01: [
      {
        id: 'n1',
        ts: '2025-10-28T09:05:00Z',
        title: 'Absence Alert',
        body: 'Mahin Hasan was absent in CSE102 Programming Lab on Oct 3.',
        read: false
      },
      {
        id: 'n2',
        ts: '2025-10-29T12:30:00Z',
        title: 'Payment Reminder',
        body: 'Fall 2025 dues pending: 17,000 BDT. Please clear before results are released.',
        read: true
      }
    ],
    g_guardian_02: [
      {
        id: 'n4',
        ts: '2025-10-26T14:20:00Z',
        title: 'Result Published',
        body: 'Fall 2025 results for Rafi Ahmed are now available. CGPA: 3.28',
        read: false
      },
      {
        id: 'n5',
        ts: '2025-10-25T08:00:00Z',
        title: 'Payment Confirmed',
        body: 'Payment of 38,000 BDT received on Oct 8. All dues cleared.',
        read: true
      }
    ]
  }

  return notifsByGuardian[guardianId] || []
}
