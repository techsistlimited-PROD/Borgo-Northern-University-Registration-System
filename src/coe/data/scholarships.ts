export interface ScholarshipRule {
  id: string
  tier: string
  cgpaMin: number
  cgpaMax: number
  waiverPercent: number
  color: string
  description: string
}

export interface ScholarshipProposal {
  id: string
  studentId: string
  studentName: string
  program: string
  semester: string
  cgpa: number
  tierSuggested: string
  waiverPercent: number
  status: 'Proposed' | 'Approved' | 'Rejected' | 'Assigned'
  notes: string
  proposedBy: string
  proposedDate: string
  approverTrail: Array<{
    action: string
    by: string
    date: string
    remarks: string
  }>
}

export const SCHOLARSHIP_RULES: ScholarshipRule[] = [
  {
    id: 'tier-1',
    tier: 'Tier 1 - Excellence',
    cgpaMin: 3.75,
    cgpaMax: 4.0,
    waiverPercent: 100,
    color: 'purple',
    description: 'Full waiver for exceptional academic performance'
  },
  {
    id: 'tier-2',
    tier: 'Tier 2 - Outstanding',
    cgpaMin: 3.5,
    cgpaMax: 3.74,
    waiverPercent: 75,
    color: 'indigo',
    description: '75% waiver for outstanding students'
  },
  {
    id: 'tier-3',
    tier: 'Tier 3 - Merit',
    cgpaMin: 3.25,
    cgpaMax: 3.49,
    waiverPercent: 50,
    color: 'violet',
    description: '50% waiver for meritorious students'
  },
  {
    id: 'tier-4',
    tier: 'Tier 4 - Good Standing',
    cgpaMin: 3.0,
    cgpaMax: 3.24,
    waiverPercent: 25,
    color: 'purple',
    description: '25% waiver for good academic standing'
  }
]

export const SCHOLARSHIP_PROPOSALS: ScholarshipProposal[] = [
  {
    id: 'sch-p-001',
    studentId: 'STU-2023-0012',
    studentName: 'Mahfuz Rahman',
    program: 'CSE',
    semester: 'Fall 2025',
    cgpa: 3.85,
    tierSuggested: 'Tier 1 - Excellence',
    waiverPercent: 100,
    status: 'Approved',
    notes: 'Excellent academic record. Full waiver recommended.',
    proposedBy: 'Academic Office',
    proposedDate: '2025-11-10',
    approverTrail: [
      {
        action: 'Proposed',
        by: 'Academic Office',
        date: '2025-11-10',
        remarks: 'Auto-generated based on CGPA'
      },
      {
        action: 'Approved',
        by: 'Dr. Rahman',
        date: '2025-11-15',
        remarks: 'Approved by HOD'
      }
    ]
  },
  {
    id: 'sch-p-002',
    studentId: 'STU-2023-0034',
    studentName: 'Sadia Akter',
    program: 'BBA',
    semester: 'Fall 2025',
    cgpa: 3.62,
    tierSuggested: 'Tier 2 - Outstanding',
    waiverPercent: 75,
    status: 'Assigned',
    notes: 'Strong performance. 75% waiver assigned.',
    proposedBy: 'Academic Office',
    proposedDate: '2025-11-12',
    approverTrail: [
      {
        action: 'Proposed',
        by: 'Academic Office',
        date: '2025-11-12',
        remarks: 'Auto-generated'
      },
      {
        action: 'Approved',
        by: 'Prof. Hasan',
        date: '2025-11-16',
        remarks: 'Approved'
      },
      {
        action: 'Assigned',
        by: 'Finance Office',
        date: '2025-11-18',
        remarks: 'Waiver applied to account'
      }
    ]
  },
  {
    id: 'sch-p-003',
    studentId: 'STU-2023-0045',
    studentName: 'Rahim Uddin',
    program: 'EEE',
    semester: 'Fall 2025',
    cgpa: 3.41,
    tierSuggested: 'Tier 3 - Merit',
    waiverPercent: 50,
    status: 'Proposed',
    notes: 'Awaiting HOD approval.',
    proposedBy: 'Academic Office',
    proposedDate: '2025-11-20',
    approverTrail: [
      {
        action: 'Proposed',
        by: 'Academic Office',
        date: '2025-11-20',
        remarks: 'Auto-generated'
      }
    ]
  },
  {
    id: 'sch-p-004',
    studentId: 'STU-2023-0067',
    studentName: 'Nusrat Jahan',
    program: 'LLB',
    semester: 'Fall 2025',
    cgpa: 3.18,
    tierSuggested: 'Tier 4 - Good Standing',
    waiverPercent: 25,
    status: 'Approved',
    notes: 'Good standing. 25% waiver approved.',
    proposedBy: 'Academic Office',
    proposedDate: '2025-11-14',
    approverTrail: [
      {
        action: 'Proposed',
        by: 'Academic Office',
        date: '2025-11-14',
        remarks: 'Auto-generated'
      },
      {
        action: 'Approved',
        by: 'Dean',
        date: '2025-11-17',
        remarks: 'Approved by Dean'
      }
    ]
  },
  {
    id: 'sch-p-005',
    studentId: 'STU-2023-0089',
    studentName: 'Farhan Ahmed',
    program: 'CSE',
    semester: 'Fall 2025',
    cgpa: 2.95,
    tierSuggested: 'None',
    waiverPercent: 0,
    status: 'Rejected',
    notes: 'CGPA below minimum threshold for scholarship.',
    proposedBy: 'Academic Office',
    proposedDate: '2025-11-13',
    approverTrail: [
      {
        action: 'Proposed',
        by: 'Academic Office',
        date: '2025-11-13',
        remarks: 'Manual review requested'
      },
      {
        action: 'Rejected',
        by: 'Dr. Ahmed',
        date: '2025-11-16',
        remarks: 'Does not meet minimum criteria'
      }
    ]
  },
  {
    id: 'sch-p-006',
    studentId: 'STU-2024-0101',
    studentName: 'Tahmid Hassan',
    program: 'Physics',
    semester: 'Fall 2025',
    cgpa: 3.92,
    tierSuggested: 'Tier 1 - Excellence',
    waiverPercent: 100,
    status: 'Assigned',
    notes: 'Top performer. Full waiver assigned.',
    proposedBy: 'Academic Office',
    proposedDate: '2025-11-11',
    approverTrail: [
      {
        action: 'Proposed',
        by: 'Academic Office',
        date: '2025-11-11',
        remarks: 'Auto-generated'
      },
      {
        action: 'Approved',
        by: 'HOD',
        date: '2025-11-13',
        remarks: 'Highly recommended'
      },
      {
        action: 'Assigned',
        by: 'Finance Office',
        date: '2025-11-15',
        remarks: 'Applied to student account'
      }
    ]
  },
  {
    id: 'sch-p-007',
    studentId: 'STU-2024-0115',
    studentName: 'Amina Khatun',
    program: 'English',
    semester: 'Fall 2025',
    cgpa: 3.55,
    tierSuggested: 'Tier 2 - Outstanding',
    waiverPercent: 75,
    status: 'Proposed',
    notes: 'Pending review.',
    proposedBy: 'Academic Office',
    proposedDate: '2025-11-21',
    approverTrail: [
      {
        action: 'Proposed',
        by: 'Academic Office',
        date: '2025-11-21',
        remarks: 'Auto-generated'
      }
    ]
  },
  {
    id: 'sch-p-008',
    studentId: 'STU-2023-0156',
    studentName: 'Kamal Hossain',
    program: 'BBA',
    semester: 'Fall 2025',
    cgpa: 3.33,
    tierSuggested: 'Tier 3 - Merit',
    waiverPercent: 50,
    status: 'Approved',
    notes: '50% waiver approved.',
    proposedBy: 'Academic Office',
    proposedDate: '2025-11-12',
    approverTrail: [
      {
        action: 'Proposed',
        by: 'Academic Office',
        date: '2025-11-12',
        remarks: 'Auto-generated'
      },
      {
        action: 'Approved',
        by: 'Dean',
        date: '2025-11-19',
        remarks: 'Approved'
      }
    ]
  }
]

export const getTierByGPA = (cgpa: number): ScholarshipRule | null => {
  return SCHOLARSHIP_RULES.find(r => cgpa >= r.cgpaMin && cgpa <= r.cgpaMax) || null
}

export const getProposalsByStatus = (status: string) =>
  SCHOLARSHIP_PROPOSALS.filter(p => p.status === status)
