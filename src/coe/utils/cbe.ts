import { CBEMeeting, CBECandidate } from '../data/cbe'
import { getActiveBlocks } from '../data/blockSettings'

export const validateMeetingWindow = (
  coveredSemFrom: string,
  coveredSemTo: string
): { valid: boolean; error?: string } => {
  if (!coveredSemFrom || !coveredSemTo) {
    return { valid: false, error: 'Both semester dates are required' }
  }
  if (coveredSemFrom > coveredSemTo) {
    return { valid: false, error: 'From semester cannot be after To semester' }
  }
  return { valid: true }
}

export const canApproveCBECandidate = (studentId: string): boolean => {
  const activeBlocks = getActiveBlocks()
  const hasDisciplinaryBlock = activeBlocks.some(
    b => b.studentId === studentId && b.reason === 'Disciplinary Action'
  )
  return !hasDisciplinaryBlock
}

export const getCBEDecisionColor = (decision: string): string => {
  switch (decision) {
    case 'Eligible':
      return 'bg-purple-100 text-purple-700'
    case 'Not Eligible':
      return 'bg-gray-100 text-gray-700'
    case 'Withheld':
      return 'bg-amber-100 text-amber-700'
    case 'Pending':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export const getCBEStatusColor = (status: string): string => {
  switch (status) {
    case 'Published':
      return 'bg-purple-100 text-purple-700'
    case 'Closed':
      return 'bg-gray-100 text-gray-700'
    case 'Draft':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export const candidateToCsv = (candidates: CBECandidate[]): string => {
  const headers = [
    'Student ID',
    'Name',
    'Program',
    'Admit Year',
    'Credits',
    'CGPA',
    'Decision',
    'Notes',
    'Decided By',
    'Decided Date'
  ]

  const rows = candidates.map(c => [
    c.studentId,
    c.studentName,
    c.program,
    c.admitYear,
    c.completedCredits.toString(),
    c.cgpa.toFixed(2),
    c.decision,
    c.notes,
    c.decidedBy || '',
    c.decidedDate || ''
  ])

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  return csvContent
}

export const downloadCBECsv = (candidates: CBECandidate[], filename: string = 'cbe-candidates.csv') => {
  const csv = candidateToCsv(candidates)
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

export const meetingToCsv = (meetings: CBEMeeting[]): string => {
  const headers = [
    'Meeting No.',
    'Title',
    'Meeting Date',
    'Covered Sem (From)',
    'Covered Sem (To)',
    'Status',
    'Candidates',
    'Remarks'
  ]

  const rows = meetings.map(m => [
    m.number,
    m.title,
    m.meetingDate,
    m.coveredSemFrom,
    m.coveredSemTo,
    m.status,
    m.candidatesCount.toString(),
    m.remarks
  ])

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  return csvContent
}

export const downloadMeetingsCsv = (meetings: CBEMeeting[], filename: string = 'cbe-meetings.csv') => {
  const csv = meetingToCsv(meetings)
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
