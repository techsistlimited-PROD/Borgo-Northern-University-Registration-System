import { ConvocationEvent, ConvocationRegistration } from '../data/convocation'

export const checkConvocationEligibility = (
  completedCredits: number,
  requiredCredits: number = 120
): { eligible: boolean; reason?: string } => {
  if (completedCredits < requiredCredits) {
    return {
      eligible: false,
      reason: `Incomplete credits: ${completedCredits}/${requiredCredits}`
    }
  }
  return { eligible: true }
}

export const getEventStatusColor = (status: string): string => {
  switch (status) {
    case 'Open':
      return 'bg-purple-100 text-purple-700'
    case 'Closed':
      return 'bg-gray-100 text-gray-700'
    case 'Completed':
      return 'bg-indigo-100 text-indigo-700'
    case 'Draft':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export const getRegStatusColor = (status: string): string => {
  switch (status) {
    case 'Requested':
      return 'bg-blue-100 text-blue-700'
    case 'Approved':
      return 'bg-purple-100 text-purple-700'
    case 'Rejected':
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export const getFeeStatusColor = (status: string): string => {
  switch (status) {
    case 'Paid':
      return 'bg-indigo-100 text-indigo-700'
    case 'Unpaid':
      return 'bg-amber-100 text-amber-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export const registrationsToCsv = (registrations: ConvocationRegistration[]): string => {
  const headers = [
    'Student ID',
    'Name',
    'Program',
    'Credits',
    'CGPA',
    'Fee Status',
    'Reg Status',
    'Reg Date',
    'Approved By',
    'Approved Date',
    'Notes'
  ]

  const rows = registrations.map(r => [
    r.studentId,
    r.studentName,
    r.program,
    r.completedCredits.toString(),
    r.cgpa.toFixed(2),
    r.feeStatus,
    r.regStatus,
    r.regDate,
    r.approvedBy || '',
    r.approvedDate || '',
    r.notes
  ])

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  return csvContent
}

export const downloadConvocationCsv = (registrations: ConvocationRegistration[], filename: string = 'convocation-registrations.csv') => {
  const csv = registrationsToCsv(registrations)
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

export const eventsToCsv = (events: ConvocationEvent[]): string => {
  const headers = [
    'Convocation No.',
    'Title',
    'Covered Sem (From)',
    'Covered Sem (To)',
    'CBE From',
    'CBE To',
    'Reg Start',
    'Reg End',
    'Event Date',
    'Status',
    'Venue',
    'Total Registrations',
    'Approved'
  ]

  const rows = events.map(e => [
    e.convocationNo,
    e.title,
    e.coveredSemFrom,
    e.coveredSemTo,
    e.cbeFrom,
    e.cbeTo,
    e.regStart,
    e.regEnd,
    e.eventDate,
    e.status,
    e.venue,
    e.totalRegistrations.toString(),
    e.approvedRegistrations.toString()
  ])

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  return csvContent
}

export const downloadEventsCsv = (events: ConvocationEvent[], filename: string = 'convocation-events.csv') => {
  const csv = eventsToCsv(events)
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
