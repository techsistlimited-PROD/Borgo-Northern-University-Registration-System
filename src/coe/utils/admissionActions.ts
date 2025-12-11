import { AdmissionAction, RequestedChange, ActionType } from '@/coe/data/admissionActions'
import { getActiveBlocks } from '@/coe/data/blockSettings'
import { CertificateRequest } from '@/coe/data/certificates'

export const canApproveOrApply = (action: AdmissionAction): { allowed: boolean; reason?: string } => {
  const activeBlocks = getActiveBlocks()
  const studentBlocks = activeBlocks.filter(b => b.studentId === action.studentId)
  
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

export const validateActionRequest = (
  actionType: ActionType,
  requestedChange: Partial<RequestedChange>
): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  switch (actionType) {
    case 'PROGRAM_CHANGE':
      if (!requestedChange.from) errors.push('Current program is required')
      if (!requestedChange.to) errors.push('Target program is required')
      if (!requestedChange.effective) errors.push('Effective semester is required')
      if (!requestedChange.reason) errors.push('Reason is required')
      if (requestedChange.reason && requestedChange.reason.length < 10) {
        errors.push('Reason must be at least 10 characters')
      }
      break

    case 'CAMPUS_CHANGE':
      if (!requestedChange.from) errors.push('Current campus is required')
      if (!requestedChange.to) errors.push('Target campus is required')
      if (!requestedChange.effective) errors.push('Effective semester is required')
      break

    case 'ADMISSION_CANCEL':
      if (!requestedChange.effective) errors.push('Effective semester is required')
      if (!requestedChange.reason) errors.push('Reason is required')
      if (requestedChange.reason && requestedChange.reason.length < 10) {
        errors.push('Reason must be at least 10 characters')
      }
      break

    case 'READMISSION':
      if (!requestedChange.lastActive) errors.push('Last active term is required')
      if (!requestedChange.returning) errors.push('Returning term is required')
      if (!requestedChange.reason) errors.push('Reason is required')
      if (requestedChange.reason && requestedChange.reason.length < 10) {
        errors.push('Reason must be at least 10 characters')
      }
      break

    case 'STUDENT_INFO_UPDATE':
      const hasPhone = requestedChange.phone && requestedChange.phone.trim()
      const hasEmail = requestedChange.email && requestedChange.email.trim()
      const hasAddress = requestedChange.presentAddress && requestedChange.presentAddress.trim()
      
      if (!hasPhone && !hasEmail && !hasAddress) {
        errors.push('At least one field (phone, email, or address) must be provided')
      }
      
      if (hasPhone && !/^01[0-9]{9}$/.test(requestedChange.phone!)) {
        errors.push('Phone must be 11 digits starting with 01')
      }
      
      if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(requestedChange.email!)) {
        errors.push('Invalid email format')
      }
      break
  }

  return { valid: errors.length === 0, errors }
}

export const toCsv = (actions: AdmissionAction[]): string => {
  const headers = ['Student ID', 'Name', 'Program', 'Campus', 'Action Type', 'Status', 'Requested', 'Updated', 'Remarks']
  const rows = actions.map(a => [
    a.studentId,
    a.studentName,
    a.currentProgram,
    a.currentCampus,
    a.actionType,
    a.status,
    a.requestedAt,
    a.updatedAt,
    a.remarks
  ])
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  return csvContent
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

export const getActionTypeLabel = (type: ActionType): string => {
  const labels: Record<ActionType, string> = {
    'STUDENT_INFO_UPDATE': 'Info Update',
    'PROGRAM_CHANGE': 'Program Change',
    'CAMPUS_CHANGE': 'Campus Change',
    'ADMISSION_CANCEL': 'Admission Cancel',
    'READMISSION': 'Readmission'
  }
  return labels[type]
}

export const getStatusColor = (status: AdmissionAction['status']): string => {
  const colors: Record<AdmissionAction['status'], string> = {
    'Requested': 'bg-blue-100 text-blue-800',
    'Under Review': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Applied': 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const formatRequestedChange = (action: AdmissionAction): string => {
  const { requestedChange, actionType } = action
  
  switch (actionType) {
    case 'PROGRAM_CHANGE':
      return `${requestedChange.from} �� ${requestedChange.to} (${requestedChange.effective})`
    case 'CAMPUS_CHANGE':
      return `${requestedChange.from} → ${requestedChange.to} (${requestedChange.effective})`
    case 'ADMISSION_CANCEL':
      return `Effective: ${requestedChange.effective}`
    case 'READMISSION':
      return `Returning: ${requestedChange.returning}`
    case 'STUDENT_INFO_UPDATE':
      const updates = []
      if (requestedChange.phone) updates.push('Phone')
      if (requestedChange.email) updates.push('Email')
      if (requestedChange.presentAddress) updates.push('Address')
      return updates.join(', ')
    default:
      return 'N/A'
  }
}
