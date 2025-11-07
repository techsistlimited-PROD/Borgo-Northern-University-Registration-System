import { CertificateRequest } from '@/coe/data/certificates'
import { getActiveBlocks } from '@/coe/data/blockSettings'

export const canIssueOrPrint = (request: CertificateRequest): { allowed: boolean; reason?: string } => {
  const activeBlocks = getActiveBlocks()
  const studentBlocks = activeBlocks.filter(b => b.studentId === request.studentId)
  
  if (studentBlocks.length > 0) {
    const reasons = studentBlocks.map(b => 
      b.reason === 'Custom' ? b.customReason || 'Custom block' : b.reason
    ).join(', ')
    return {
      allowed: false,
      reason: `Blocked by: ${reasons}. Clear in Block Manager.`
    }
  }
  
  return { allowed: true }
}

export const generateSerial = (request: CertificateRequest, index: number): string => {
  const year = new Date().getFullYear()
  const paddedIndex = String(index + 1).padStart(5, '0')
  return `SER-${year}-${paddedIndex}`
}

export const generateQrToken = (request: CertificateRequest): string => {
  const data = `${request.studentId}|${request.documentType}|${Date.now()}`
  const hash = btoa(data).substring(0, 8).toUpperCase()
  return hash
}

export const toCsv = (requests: CertificateRequest[]): string => {
  const headers = ['Student ID', 'Name', 'Program', 'Type', 'Status', 'Requested', 'Updated', 'Serial']
  const rows = requests.map(r => [
    r.studentId,
    r.studentName,
    r.programCode,
    r.documentType,
    r.status,
    r.requestDate,
    r.processedDate || r.requestDate,
    r.serial || 'N/A'
  ])
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  return csvContent
}

export const formatType = (type: string): string => {
  return type
}

export const downloadCsv = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const getStatusColor = (status: CertificateRequest['status']): string => {
  const colors: Record<CertificateRequest['status'], string> = {
    'Requested': 'bg-blue-100 text-blue-800',
    'Processing': 'bg-yellow-100 text-yellow-800',
    'Ready': 'bg-indigo-100 text-indigo-800',
    'Collected': 'bg-gray-100 text-gray-800',
    'Rejected': 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
