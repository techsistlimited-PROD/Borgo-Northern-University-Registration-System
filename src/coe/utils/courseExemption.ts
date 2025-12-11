import { CourseExemptionRequest, CEStatus } from '@/coe/data/courseExemptions'
import { getActiveBlocks } from '@/coe/data/blockSettings'

export const computeTotalRequestedCredits = (request: CourseExemptionRequest): number => {
  return request.requestedCourses.reduce((sum, course) => sum + course.credit, 0)
}

export const computeTotalExemptedCredits = (request: CourseExemptionRequest): number => {
  return request.exemptedCourses
    .filter(c => c.selected)
    .reduce((sum, course) => sum + course.credit, 0)
}

export const validateExemption = (request: CourseExemptionRequest): { ok: boolean; message?: string } => {
  const exemptedCount = request.exemptedCourses.filter(c => c.selected).length
  
  if (exemptedCount === 0) {
    return { ok: false, message: 'At least one course must be selected for exemption' }
  }

  const totalExemptedCredits = computeTotalExemptedCredits(request)
  if (totalExemptedCredits > 12) {
    return { ok: false, message: 'Total exempted credits cannot exceed 12 per semester' }
  }

  return { ok: true }
}

export const isGated = (request: CourseExemptionRequest): { blocked: boolean; reason?: string } => {
  const activeBlocks = getActiveBlocks()
  const studentBlocks = activeBlocks.filter(b => b.studentId === request.studentId)
  
  if (studentBlocks.length > 0) {
    const reasons = studentBlocks.map(b => 
      b.reason === 'Custom' ? b.customReason || 'Custom block' : b.reason
    ).join(', ')
    return {
      blocked: true,
      reason: `Blocked by: ${reasons}. Clear in Block Manager.`
    }
  }
  
  return { blocked: false }
}

export const canProceed = (
  request: CourseExemptionRequest,
  action: 'evaluate' | 'approve' | 'apply'
): { allowed: boolean; reason?: string } => {
  const gating = isGated(request)
  
  if (gating.blocked) {
    return { allowed: false, reason: gating.reason }
  }

  if (action === 'evaluate') {
    if (request.status !== 'Requested' && request.status !== 'Under Review') {
      return { allowed: false, reason: 'Can only evaluate Requested or Under Review status' }
    }
  }

  if (action === 'approve') {
    if (request.status !== 'Evaluated') {
      return { allowed: false, reason: 'Can only approve Evaluated requests' }
    }
    const validation = validateExemption(request)
    if (!validation.ok) {
      return { allowed: false, reason: validation.message }
    }
  }

  if (action === 'apply') {
    if (request.status !== 'Approved') {
      return { allowed: false, reason: 'Can only apply Approved requests' }
    }
  }

  return { allowed: true }
}

export const toCsv = (requests: CourseExemptionRequest[]): string => {
  const headers = [
    'Student ID',
    'Name',
    'Program',
    'Campus',
    'Total Requested Credits',
    'Selected Exempted Credits',
    'Status',
    'Requested',
    'Updated'
  ]
  
  const rows = requests.map(r => [
    r.studentId,
    r.studentName,
    r.programCode,
    r.campus,
    computeTotalRequestedCredits(r),
    computeTotalExemptedCredits(r),
    r.status,
    r.requestedAt,
    r.updatedAt
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

export const getStatusColor = (status: CEStatus): string => {
  const colors: Record<CEStatus, string> = {
    'Requested': 'bg-blue-100 text-blue-800',
    'Under Review': 'bg-yellow-100 text-yellow-800',
    'Evaluated': 'bg-purple-100 text-purple-800',
    'Approved': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Applied': 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const fakeToast = (message: string) => {
  const toast = document.createElement('div')
  toast.className = 'fixed top-4 right-4 bg-deep-plum text-white px-6 py-3 rounded-lg shadow-lg z-50'
  toast.textContent = message
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.classList.add('opacity-0', 'transition-opacity')
    setTimeout(() => document.body.removeChild(toast), 300)
  }, 2000)
}
