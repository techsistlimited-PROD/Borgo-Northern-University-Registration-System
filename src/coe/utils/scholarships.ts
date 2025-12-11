import { ScholarshipRule, ScholarshipProposal, getTierByGPA } from '../data/scholarships'

export const suggestTier = (cgpa: number): ScholarshipRule | null => {
  return getTierByGPA(cgpa)
}

export const getTierColor = (tier: string): string => {
  if (tier.includes('Tier 1')) return 'bg-purple-100 text-purple-700'
  if (tier.includes('Tier 2')) return 'bg-indigo-100 text-indigo-700'
  if (tier.includes('Tier 3')) return 'bg-violet-100 text-violet-700'
  if (tier.includes('Tier 4')) return 'bg-purple-100 text-purple-600'
  return 'bg-gray-100 text-gray-700'
}

export const getProposalStatusColor = (status: string): string => {
  switch (status) {
    case 'Proposed':
      return 'bg-blue-100 text-blue-700'
    case 'Approved':
      return 'bg-purple-100 text-purple-700'
    case 'Rejected':
      return 'bg-gray-100 text-gray-700'
    case 'Assigned':
      return 'bg-indigo-100 text-indigo-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export const proposalsToCsv = (proposals: ScholarshipProposal[]): string => {
  const headers = [
    'Student ID',
    'Name',
    'Program',
    'Semester',
    'CGPA',
    'Tier Suggested',
    'Waiver %',
    'Status',
    'Notes',
    'Proposed By',
    'Proposed Date'
  ]

  const rows = proposals.map(p => [
    p.studentId,
    p.studentName,
    p.program,
    p.semester,
    p.cgpa.toFixed(2),
    p.tierSuggested,
    p.waiverPercent.toString(),
    p.status,
    p.notes,
    p.proposedBy,
    p.proposedDate
  ])

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  return csvContent
}

export const downloadScholarshipsCsv = (proposals: ScholarshipProposal[], filename: string = 'scholarships.csv') => {
  const csv = proposalsToCsv(proposals)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const validateWaiverPercent = (percent: number): { valid: boolean; error?: string } => {
  if (percent < 0 || percent > 100) {
    return { valid: false, error: 'Waiver percent must be between 0 and 100' }
  }
  return { valid: true }
}
