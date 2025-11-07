import { VerificationProfile } from '../data/verification'

export const formatToken = (studentId: string, program: string): string => {
  const year = studentId.split('-')[1]
  const id = studentId.split('-')[2]
  return `VER-${year}-${program}-${id}`
}

export const generateQR = (token: string): string => {
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `QR-${token}-${randomSuffix}`
}

export const getVerificationStatusColor = (status: string): string => {
  switch (status) {
    case 'Verified':
      return 'bg-purple-100 text-purple-700'
    case 'Pending':
      return 'bg-blue-100 text-blue-700'
    case 'Rejected':
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export const verificationToCsv = (profiles: VerificationProfile[]): string => {
  const headers = [
    'Student ID',
    'Name',
    'Program',
    'Admit Year',
    'Credits',
    'CGPA',
    'Token',
    'QR',
    'Status',
    'Remarks',
    'Verified By',
    'Verified Date'
  ]

  const rows = profiles.map(p => [
    p.studentId,
    p.name,
    p.program,
    p.admitYear,
    p.completedCredits.toString(),
    p.cgpa.toFixed(2),
    p.token,
    p.qr,
    p.status,
    p.remarks,
    p.verifiedBy || '',
    p.verifiedDate || ''
  ])

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  return csvContent
}

export const downloadVerificationCsv = (profiles: VerificationProfile[], filename: string = 'verification-records.csv') => {
  const csv = verificationToCsv(profiles)
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

export const validateVerificationRequest = (
  completedCredits: number,
  requiredCredits: number = 120
): { valid: boolean; error?: string } => {
  if (completedCredits < requiredCredits) {
    return {
      valid: false,
      error: `Incomplete degree requirements: ${completedCredits}/${requiredCredits} credits`
    }
  }
  return { valid: true }
}
