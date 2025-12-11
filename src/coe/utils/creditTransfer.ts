import { CreditTransferRequest, CourseMapping, CTTotals, CTStatus } from '@/coe/data/creditTransfers'
import { getActiveBlocks } from '@/coe/data/blockSettings'

export const computeTotals = (mappings: CourseMapping[]): CTTotals => {
  const sourceCredits = mappings.reduce((sum, m) => sum + m.sourceCredit, 0)
  const mappedCredits = mappings
    .filter(m => m.decision === 'Map')
    .reduce((sum, m) => sum + (m.targetCredit || m.sourceCredit), 0)
  const waivedCredits = mappings
    .filter(m => m.decision === 'Waive')
    .reduce((sum, m) => sum + m.sourceCredit, 0)
  
  return { sourceCredits, mappedCredits, waivedCredits }
}

export const getMappingPercentage = (totals: CTTotals): number => {
  if (totals.sourceCredits === 0) return 0
  return Math.round(((totals.mappedCredits + totals.waivedCredits) / totals.sourceCredits) * 100)
}

export const canProceed = (
  request: CreditTransferRequest,
  action: 'evaluate' | 'approve' | 'apply'
): { allowed: boolean; reason?: string } => {
  const activeBlocks = getActiveBlocks()
  const studentBlocks = activeBlocks.filter(b => b.studentId === request.studentId)
  
  if (studentBlocks.length > 0) {
    const reasons = studentBlocks.map(b => 
      b.reason === 'Custom' ? b.customReason || 'Custom block' : b.reason
    ).join(', ')
    return {
      allowed: false,
      reason: `Blocked by: ${reasons}. Clear holds in Block Manager.`
    }
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
    if (request.mappings.length === 0) {
      return { allowed: false, reason: 'No course mappings to approve' }
    }
  }

  if (action === 'apply') {
    if (request.status !== 'Approved') {
      return { allowed: false, reason: 'Can only apply Approved requests' }
    }
  }

  return { allowed: true }
}

export const validateMapping = (
  mapping: CourseMapping,
  existingMappings: CourseMapping[]
): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (mapping.decision === 'Map') {
    if (!mapping.targetCode) {
      errors.push('Target course is required for Map decision')
    }
    
    if (mapping.targetCode) {
      const duplicate = existingMappings.find(
        m => m.targetCode === mapping.targetCode && m !== mapping
      )
      if (duplicate) {
        errors.push(`Target course ${mapping.targetCode} is already mapped`)
      }
    }

    if (mapping.targetCredit && mapping.sourceCredit !== mapping.targetCredit) {
      errors.push(
        `Credit mismatch: Source (${mapping.sourceCredit}) ≠ Target (${mapping.targetCredit})`
      )
    }
  }

  if (mapping.decision === 'Waive' && !mapping.reason) {
    errors.push('Reason is required for Waive decision')
  }

  if (mapping.decision === 'Reject' && !mapping.reason) {
    errors.push('Reason is required for Reject decision')
  }

  return { valid: errors.length === 0, errors }
}

export const toCsv = (requests: CreditTransferRequest[]): string => {
  const headers = [
    'Student ID',
    'Name',
    'Program',
    'Campus',
    'Source University',
    'Source Credits',
    'Mapped Credits',
    'Waived Credits',
    'Status',
    'Updated'
  ]
  
  const rows = requests.map(r => [
    r.studentId,
    r.studentName,
    r.programCode,
    r.campus,
    r.sourceUniversity,
    r.totals.sourceCredits,
    r.totals.mappedCredits,
    r.totals.waivedCredits,
    r.status,
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

export const getStatusColor = (status: CTStatus): string => {
  const colors: Record<CTStatus, string> = {
    'Requested': 'bg-blue-100 text-blue-800',
    'Under Review': 'bg-yellow-100 text-yellow-800',
    'Evaluated': 'bg-purple-100 text-purple-800',
    'Approved': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Applied': 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const parseCsv = (content: string): Partial<CourseMapping>[] => {
  const lines = content.trim().split('\n')
  if (lines.length < 2) return []
  
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const mappings: Partial<CourseMapping>[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    const mapping: Partial<CourseMapping> = { decision: 'Map' }
    
    headers.forEach((header, idx) => {
      const value = values[idx]
      if (header.includes('code') || header.includes('sourcecode')) {
        mapping.sourceCode = value
      } else if (header.includes('title') || header.includes('name')) {
        mapping.sourceTitle = value
      } else if (header.includes('credit')) {
        mapping.sourceCredit = parseFloat(value) || 0
      } else if (header.includes('grade')) {
        mapping.sourceGrade = value
      }
    })
    
    if (mapping.sourceCode && mapping.sourceTitle && mapping.sourceCredit) {
      mappings.push(mapping)
    }
  }
  
  return mappings
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
