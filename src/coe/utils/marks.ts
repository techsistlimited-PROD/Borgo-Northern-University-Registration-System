import { GradeScale } from '@/coe/data/types'

export interface MarkComponent {
  name: string
  weight: number
  marks?: number
}

export interface DistributionValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface GradeResult {
  total: number
  letterGrade: string
  gradePoint: number
}

export interface MarkDistributionTemplate {
  name: string
  schemeType: 'four-part' | 'single-100'
  components: MarkComponent[]
  total: number
}

export function computeTotals(
  components: { name: string; marks: number; weight: number }[],
  schemeType: 'four-part' | 'single-100'
): number {
  if (schemeType === 'single-100') {
    const total100 = components.find(c => c.name.toLowerCase() === 'total' || c.name.toLowerCase() === 'total100')
    return total100?.marks || 0
  }

  let total = 0
  for (const component of components) {
    total += (component.marks * component.weight) / 100
  }

  return Math.round(total * 100) / 100
}

export function validateTemplate(template: MarkDistributionTemplate): DistributionValidation {
  const errors: string[] = []
  const warnings: string[] = []

  const totalWeight = template.components.reduce((sum, c) => sum + c.weight, 0)

  if (totalWeight !== 100) {
    errors.push(`Total weight must equal 100% (currently ${totalWeight}%)`)
  }

  const hasNegative = template.components.some(c => c.weight < 0)
  if (hasNegative) {
    errors.push('Component weights cannot be negative')
  }

  const componentNames = template.components.map(c => c.name.toLowerCase())
  const uniqueNames = new Set(componentNames)
  if (componentNames.length !== uniqueNames.size) {
    errors.push('Component names must be unique')
  }

  const hasEmptyName = template.components.some(c => !c.name.trim())
  if (hasEmptyName) {
    errors.push('All components must have a name')
  }

  if (template.schemeType === 'single-100') {
    if (template.components.length !== 1) {
      warnings.push('Single 100-mark scheme should typically have one component')
    }
  }

  if (template.schemeType === 'four-part') {
    const standardComponents = ['attendance', 'ca', 'midterm', 'final']
    const hasAllStandard = standardComponents.every(sc =>
      template.components.some(c => c.name.toLowerCase() === sc)
    )
    if (!hasAllStandard) {
      warnings.push('Four-part scheme missing standard components (Attendance, CA, Midterm, Final)')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export function applyPolicy(
  total: number,
  gradeScale: GradeScale[],
  tieBreakRule: 'round-half-up' | 'truncate' = 'round-half-up'
): GradeResult {
  let adjustedTotal = total

  if (tieBreakRule === 'round-half-up') {
    adjustedTotal = Math.round(total * 100) / 100
  } else {
    adjustedTotal = Math.floor(total * 100) / 100
  }

  const sortedScale = [...gradeScale].sort((a, b) => b.minMarks - a.minMarks)

  for (const grade of sortedScale) {
    if (adjustedTotal >= grade.minMarks && adjustedTotal <= grade.maxMarks) {
      return {
        total: adjustedTotal,
        letterGrade: grade.letterGrade,
        gradePoint: grade.gradePoint
      }
    }
  }

  return {
    total: adjustedTotal,
    letterGrade: 'F',
    gradePoint: 0.0
  }
}

export function parseExcelData(
  csvContent: string,
  schemeType: 'four-part' | 'single-100'
): Array<{
  studentId: string
  components: { [key: string]: number }
}> {
  const rows = csvContent.trim().split('\n')
  if (rows.length < 2) return []

  const headers = rows[0].split(',').map(h => h.trim())
  const data: Array<{ studentId: string; components: { [key: string]: number } }> = []

  for (let i = 1; i < rows.length; i++) {
    const values = rows[i].split(',').map(v => v.trim())
    if (values.length < headers.length) continue

    const studentId = values[0]
    const components: { [key: string]: number } = {}

    if (schemeType === 'four-part') {
      components.attendance = parseFloat(values[1]) || 0
      components.ca = parseFloat(values[2]) || 0
      components.midterm = parseFloat(values[3]) || 0
      components.final = parseFloat(values[4]) || 0
    } else {
      components.total100 = parseFloat(values[1]) || 0
    }

    data.push({ studentId, components })
  }

  return data
}

export interface CorrectionRecomputeResult {
  attendance: number | null
  ca: number | null
  midterm: number | null
  final: number | null
  total: number
  letterGrade: string
  gradePoint: number
}

export function recomputeAfterCorrection(
  attendance: number | null,
  ca: number | null,
  midterm: number | null,
  final: number | null,
  weights: { attendance: number; ca: number; midterm: number; final: number },
  gradeScale: GradeScale[],
  tieBreakRule: 'round-half-up' | 'truncate' = 'round-half-up',
  isGradeOverride: boolean = false,
  overrideGrade?: string,
  overrideGP?: number
): CorrectionRecomputeResult {
  if (isGradeOverride && overrideGrade) {
    const total =
      ((attendance || 0) * weights.attendance) / 100 +
      ((ca || 0) * weights.ca) / 100 +
      ((midterm || 0) * weights.midterm) / 100 +
      ((final || 0) * weights.final) / 100

    return {
      attendance,
      ca,
      midterm,
      final,
      total: Math.round(total * 100) / 100,
      letterGrade: overrideGrade,
      gradePoint: overrideGP !== undefined ? overrideGP : 0.0
    }
  }

  const total =
    ((attendance || 0) * weights.attendance) / 100 +
    ((ca || 0) * weights.ca) / 100 +
    ((midterm || 0) * weights.midterm) / 100 +
    ((final || 0) * weights.final) / 100

  const gradeResult = applyPolicy(total, gradeScale, tieBreakRule)

  return {
    attendance,
    ca,
    midterm,
    final,
    total: gradeResult.total,
    letterGrade: gradeResult.letterGrade,
    gradePoint: gradeResult.gradePoint
  }
}
