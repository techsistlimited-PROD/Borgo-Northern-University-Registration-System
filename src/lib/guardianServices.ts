import { Repo } from './repo'
import { 
  Guardian, 
  GuardianLink, 
  Student, 
  AttendanceRecord, 
  Grade, 
  TermResult, 
  TER, 
  StudentPayable,
  Receipt,
  Notification,
  LogEntry,
  Course,
  Section
} from './seedAll'

// Guardian Service
export class GuardianService {
  getMyProfile(guardianId: string): Guardian | null {
    const guardians = Repo.get<Guardian>('guardians')
    return guardians.find(g => g.id === guardianId) || null
  }

  getMyWards(guardianId: string): Student[] {
    const links = Repo.get<GuardianLink>('guardianLinks')
    const students = Repo.get<Student>('students')
    const guardianLinks = links.filter(l => l.guardianId === guardianId)
    return students.filter(s => guardianLinks.some(l => l.studentId === s.id))
  }

  getActiveWardId(): string | null {
    return localStorage.getItem('guardian.activeWard')
  }

  setActiveWardId(studentId: string): void {
    localStorage.setItem('guardian.activeWard', studentId)
  }

  subscribe(handler: () => void): () => void {
    const unsubGuardians = Repo.subscribe<Guardian>('guardians', handler)
    const unsubLinks = Repo.subscribe<GuardianLink>('guardianLinks', handler)
    const unsubStudents = Repo.subscribe<Student>('students', handler)

    return () => {
      unsubGuardians()
      unsubLinks()
      unsubStudents()
    }
  }

  updatePreferences(guardianId: string, preferences: Guardian['preferences']): void {
    Repo.update<Guardian>('guardians', guardianId, { preferences })
  }
}

// Attendance Service
export class AttendanceService {
  listByStudent(
    studentId: string, 
    filters?: { termId?: string; from?: string; to?: string; courseCode?: string; status?: string }
  ): AttendanceRecord[] {
    let records = Repo.get<AttendanceRecord>('attendanceRecords')
    records = records.filter(r => r.studentId === studentId)

    if (filters?.from) {
      records = records.filter(r => r.date >= filters.from!)
    }
    if (filters?.to) {
      records = records.filter(r => r.date <= filters.to!)
    }
    if (filters?.status) {
      records = records.filter(r => r.status === filters.status)
    }

    return records.sort((a, b) => b.date.localeCompare(a.date))
  }

  getStats(studentId: string, termId?: string): { present: number; absent: number; late: number; total: number; percentage: number } {
    const records = this.listByStudent(studentId, { termId })
    const present = records.filter(r => r.status === 'P').length
    const absent = records.filter(r => r.status === 'A').length
    const late = records.filter(r => r.status === 'L').length
    const total = records.length
    const percentage = total > 0 ? (present / total) * 100 : 0

    return { present, absent, late, total, percentage: parseFloat(percentage.toFixed(1)) }
  }

  subscribeStudentStream(studentId: string, handler: (record: AttendanceRecord) => void): () => void {
    return Repo.subscribe<AttendanceRecord>('attendanceRecords', (records) => {
      const latestRecord = records
        .filter(r => r.studentId === studentId)
        .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))[0]
      
      if (latestRecord) {
        handler(latestRecord)
      }
    })
  }
}

// Result Service
export class ResultService {
  getTermSummary(studentId: string, termId: string): TermResult | null {
    const results = Repo.get<TermResult>('termResults')
    return results.find(r => r.studentId === studentId && r.termId === termId) || null
  }

  listCourseResults(studentId: string, termId: string): Array<{
    courseCode: string
    title: string
    credit: number
    grade: string
    gradePoint: number
    remarks?: string
  }> {
    const grades = Repo.get<Grade>('grades')
    const courses = Repo.get<Course>('courses')
    
    const studentGrades = grades.filter(g => g.studentId === studentId && g.termId === termId)
    
    return studentGrades.map(grade => {
      const course = courses.find(c => c.id === grade.courseId)
      return {
        courseCode: course?.code || '',
        title: course?.title || '',
        credit: grade.credit,
        grade: grade.grade,
        gradePoint: grade.gradePoint,
        remarks: grade.remarks
      }
    })
  }

  isResultUnlocked(studentId: string, termId: string): { unlocked: boolean; reasons: string[] } {
    const reasons: string[] = []

    // Check finance dues
    const payables = Repo.get<StudentPayable>('studentPayables')
    const studentPayables = payables.filter(p => p.studentId === studentId && p.semesterId === termId)
    const totalDue = studentPayables.reduce((sum, p) => sum + p.dueAmount, 0)

    if (totalDue > 0) {
      reasons.push(`Outstanding dues: ${totalDue.toFixed(2)} BDT`)
    }

    // Check TER status
    const ters = Repo.get<TER>('ters')
    const ter = ters.find(t => t.studentId === studentId && t.termId === termId)

    if (!ter || ter.status !== 'SUBMITTED') {
      reasons.push('TER not submitted')
    }

    return {
      unlocked: reasons.length === 0,
      reasons
    }
  }

  subscribe(handler: () => void): () => void {
    const unsubGrades = Repo.subscribe<Grade>('grades', handler)
    const unsubResults = Repo.subscribe<TermResult>('termResults', handler)

    return () => {
      unsubGrades()
      unsubResults()
    }
  }
}

// Finance Service
export class FinanceService {
  listPayables(studentId: string, filters?: { termId?: string }): StudentPayable[] {
    let payables = Repo.get<StudentPayable>('studentPayables')
    payables = payables.filter(p => p.studentId === studentId)

    if (filters?.termId) {
      payables = payables.filter(p => p.semesterId === filters.termId)
    }

    return payables
  }

  listPayments(studentId: string, filters?: { termId?: string }): Receipt[] {
    let receipts = Repo.get<Receipt>('receipts')
    receipts = receipts.filter(r => r.studentId === studentId)

    if (filters?.termId) {
      const payables = this.listPayables(studentId, { termId: filters.termId })
      const payableIds = payables.map(p => p.id)
      receipts = receipts.filter(r => payableIds.includes(r.payableId))
    }

    return receipts.sort((a, b) => b.date.localeCompare(a.date))
  }

  getStatement(studentId: string, filters?: { termId?: string }): {
    totalBill: number
    totalPaid: number
    outstanding: number
    payables: StudentPayable[]
    payments: Receipt[]
  } {
    const payables = this.listPayables(studentId, filters)
    const payments = this.listPayments(studentId, filters)

    const totalBill = payables.reduce((sum, p) => sum + p.totalAmount, 0)
    const totalPaid = payables.reduce((sum, p) => sum + p.paidAmount, 0)
    const outstanding = payables.reduce((sum, p) => sum + p.dueAmount, 0)

    return {
      totalBill,
      totalPaid,
      outstanding,
      payables,
      payments
    }
  }

  downloadReceipt(moneyReceiptNo: string): void {
    // Log the download event
    LogService.add({
      actor: 'GUARDIAN',
      actorRole: 'guardian',
      type: 'GUARDIAN.RECEIPT.DOWNLOAD',
      payload: { moneyReceiptNo }
    })

    // In a real app, this would open a PDF
    window.open(`/api/pdf/money-receipt?mr=${moneyReceiptNo}`, '_blank')
  }

  subscribe(handler: () => void): () => void {
    const unsubPayables = Repo.subscribe<StudentPayable>('studentPayables', handler)
    const unsubReceipts = Repo.subscribe<Receipt>('receipts', handler)

    return () => {
      unsubPayables()
      unsubReceipts()
    }
  }
}

// TER Service
export class TERService {
  getStatus(studentId: string, termId: string): 'SUBMITTED' | 'PENDING' | 'BLOCKED' {
    const ters = Repo.get<TER>('ters')
    const ter = ters.find(t => t.studentId === studentId && t.termId === termId)
    return ter?.status || 'PENDING'
  }

  subscribe(handler: () => void): () => void {
    return Repo.subscribe<TER>('ters', handler)
  }
}

// Log Service
export class LogService {
  static add(entry: Omit<LogEntry, 'id' | 'timestamp'>): void {
    const logs = Repo.get<LogEntry>('logEntries')
    const newEntry: LogEntry = {
      id: `LOG${logs.length + 1}`,
      ...entry,
      timestamp: new Date().toISOString()
    }
    Repo.add<LogEntry>('logEntries', newEntry)
  }

  static list(filters?: { actor?: string; type?: string }): LogEntry[] {
    let logs = Repo.get<LogEntry>('logEntries')

    if (filters?.actor) {
      logs = logs.filter(l => l.actor === filters.actor)
    }
    if (filters?.type) {
      logs = logs.filter(l => l.type === filters.type)
    }

    return logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
  }
}

// Notification Service
export class NotificationService {
  listForGuardian(guardianId: string): Notification[] {
    const notifications = Repo.get<Notification>('notifications')
    return notifications
      .filter(n => n.recipientId === guardianId && n.recipientType === 'GUARDIAN')
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  markAsRead(notificationId: string): void {
    Repo.update<Notification>('notifications', notificationId, { status: 'Read' })
  }

  subscribe(handler: () => void): () => void {
    return Repo.subscribe<Notification>('notifications', handler)
  }

  getUnreadCount(guardianId: string): number {
    const notifications = this.listForGuardian(guardianId)
    return notifications.filter(n => n.status === 'Unread').length
  }
}

// Export instances
export const guardianService = new GuardianService()
export const attendanceService = new AttendanceService()
export const resultService = new ResultService()
export const financeService = new FinanceService()
export const terService = new TERService()
export const notificationService = new NotificationService()
