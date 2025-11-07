import { SEMESTERS, getCurrentSemester } from './semesters'
import { PROGRAMS } from './programs'
import { EXAM_TYPES } from './examTypes'
import { STUDENT_MARKS } from './studentMarks'
import { GLOBAL_GRADE_SCALE, CGPA_BANDS } from './gradePolicy'
import { MARK_DISTRIBUTION_TEMPLATES } from './markDistributionTemplates'

export const getActiveSemester = () => getCurrentSemester()

export const getAllSemesters = () => SEMESTERS

export const getProgramList = () => PROGRAMS

export const getAllPrograms = () => [
  { id: 'all', code: 'ALL', name: 'All Programs' },
  ...PROGRAMS
]

export const getExamTypeList = () => EXAM_TYPES

export const getStudentMarksList = () => STUDENT_MARKS

export const getGlobalGradeScale = () => GLOBAL_GRADE_SCALE

export const getCGPABands = () => CGPA_BANDS

export const getStudentsByCourse = (courseCode: string, section: string, semesterId: string) =>
  STUDENT_MARKS.filter(
    m => m.courseCode === courseCode && m.section === section && m.semesterId === semesterId
  )

export const getUniqueStudents = () => {
  const seen = new Set<string>()
  return STUDENT_MARKS.filter(mark => {
    if (seen.has(mark.studentId)) return false
    seen.add(mark.studentId)
    return true
  })
}

export const listCoursesByProgram = (programCode: string, semesterId: string) => {
  const coursesSet = new Set<string>()
  const courses: Array<{ code: string; name: string }> = []

  MARK_DISTRIBUTION_TEMPLATES.filter(
    t => (programCode === 'ALL' || t.programCode === programCode) && t.semesterId === semesterId
  ).forEach(t => {
    if (!coursesSet.has(t.courseCode)) {
      coursesSet.add(t.courseCode)
      courses.push({ code: t.courseCode, name: t.courseName })
    }
  })

  return courses
}

export const listSections = (courseCode: string, semesterId: string) => {
  const sections = new Set<string>()

  MARK_DISTRIBUTION_TEMPLATES.filter(
    t => t.courseCode === courseCode && t.semesterId === semesterId
  ).forEach(t => sections.add(t.section))

  return Array.from(sections).sort()
}

export const getMarkDistributionTemplates = () => MARK_DISTRIBUTION_TEMPLATES
