import { hrmDataService } from '../services/hrmDataService'
import { HrmEiEmp, HrmAttendance, HrmLeaveApplication, HrmPayroll, HrmPayslip } from '@/lib/oracleSchema'
import { Repo } from '@/lib/repo'

export class HRMDataServiceHelper {
  static async getEmployeesWithFallback(filters?: {
    department?: string
    designation?: string
    status?: string
  }): Promise<HrmEiEmp[]> {
    try {
      const employees = await hrmDataService.getEmployees(filters)
      if (employees && employees.length > 0) {
        return employees
      }
    } catch (error) {
      console.warn('Failed to load employees from data service, using fallback', error)
    }

    const allEmployees = Repo.get<HrmEiEmp>('hrm-employees')
    if (!filters) return allEmployees

    return allEmployees.filter(e => {
      if (filters.department && e.department !== filters.department) return false
      if (filters.designation && e.designation !== filters.designation) return false
      if (filters.status && e.status !== filters.status) return false
      return true
    })
  }

  static async getEmployeeByIdWithFallback(empId: string): Promise<HrmEiEmp | null> {
    try {
      return await hrmDataService.getEmployeeById(empId)
    } catch (error) {
      console.warn('Failed to load employee from data service', error)
    }

    const employees = Repo.get<HrmEiEmp>('hrm-employees')
    return employees.find(e => e.id === empId || e.empCode === empId) || null
  }

  static async getDesignationsWithFallback(): Promise<any[]> {
    try {
      const designations = await hrmDataService.getDesignations()
      if (designations && designations.length > 0) {
        return designations
      }
    } catch (error) {
      console.warn('Failed to load designations from data service', error)
    }

    return Repo.get('hrm-designations')
  }

  static async getDepartmentsWithFallback(): Promise<any[]> {
    try {
      const departments = await hrmDataService.getDepartments()
      if (departments && departments.length > 0) {
        return departments
      }
    } catch (error) {
      console.warn('Failed to load departments from data service', error)
    }

    return Repo.get('hrm-departments')
  }

  static async getAttendanceWithFallback(filters?: {
    empId?: string
    fromDate?: string
    toDate?: string
    status?: string
  }): Promise<HrmAttendance[]> {
    try {
      const attendance = await hrmDataService.getAttendance(filters)
      if (attendance && attendance.length > 0) {
        return attendance
      }
    } catch (error) {
      console.warn('Failed to load attendance from data service', error)
    }

    const allAttendance = Repo.get<HrmAttendance>('hrm-attendance')
    if (!filters) return allAttendance

    return allAttendance.filter(a => {
      if (filters.empId && a.empId !== filters.empId) return false
      if (filters.status && a.status !== filters.status) return false
      if (filters.fromDate && a.attendanceDate < filters.fromDate) return false
      if (filters.toDate && a.attendanceDate > filters.toDate) return false
      return true
    })
  }

  static async recordAttendanceWithFallback(attendance: Omit<HrmAttendance, 'id' | 'createdAt' | 'updatedAt'>): Promise<HrmAttendance> {
    try {
      return await hrmDataService.recordAttendance(attendance)
    } catch (error) {
      console.warn('Failed to record attendance via data service', error)

      const newAttendance: HrmAttendance = {
        ...attendance,
        id: `ATT-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      Repo.add('hrm-attendance', newAttendance)
      return newAttendance
    }
  }

  static async getLeaveApplicationsWithFallback(filters?: {
    empId?: string
    status?: string
    leaveType?: string
  }): Promise<HrmLeaveApplication[]> {
    try {
      const leaves = await hrmDataService.getLeaveApplications(filters)
      if (leaves && leaves.length > 0) {
        return leaves
      }
    } catch (error) {
      console.warn('Failed to load leave applications from data service', error)
    }

    const allLeaves = Repo.get<HrmLeaveApplication>('hrm-leave-applications')
    if (!filters) return allLeaves

    return allLeaves.filter(l => {
      if (filters.empId && l.empId !== filters.empId) return false
      if (filters.status && l.status !== filters.status) return false
      if (filters.leaveType && l.leaveType !== filters.leaveType) return false
      return true
    })
  }

  static async applyLeaveWithFallback(leave: Omit<HrmLeaveApplication, 'id' | 'createdAt' | 'updatedAt'>): Promise<HrmLeaveApplication> {
    try {
      return await hrmDataService.applyLeave(leave)
    } catch (error) {
      console.warn('Failed to apply leave via data service', error)

      const newLeave: HrmLeaveApplication = {
        ...leave,
        id: `LEAVE-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      Repo.add('hrm-leave-applications', newLeave)
      return newLeave
    }
  }

  static async approveLeaveWithFallback(leaveId: string, approvedBy: string): Promise<HrmLeaveApplication | null> {
    try {
      return await hrmDataService.approveLeave(leaveId, approvedBy)
    } catch (error) {
      console.warn('Failed to approve leave via data service', error)

      const updates = {
        status: 'Approved' as const,
        approvedBy,
        approvalDate: new Date().toISOString()
      }

      Repo.update('hrm-leave-applications', leaveId, updates)
      const leaves = Repo.get<HrmLeaveApplication>('hrm-leave-applications')
      return leaves.find(l => l.id === leaveId) || null
    }
  }

  static async getSalaryStructuresWithFallback(filters?: {
    empId?: string
    status?: string
  }): Promise<any[]> {
    try {
      const structures = await hrmDataService.getSalaryStructures(filters)
      if (structures && structures.length > 0) {
        return structures
      }
    } catch (error) {
      console.warn('Failed to load salary structures from data service', error)
    }

    const allStructures = Repo.get('hrm-salary-structures')
    if (!filters) return allStructures

    return allStructures.filter((s: any) => {
      if (filters.empId && s.empId !== filters.empId) return false
      if (filters.status && s.status !== filters.status) return false
      return true
    })
  }

  static async getPayrollWithFallback(filters?: {
    empId?: string
    payPeriod?: string
    status?: string
  }): Promise<HrmPayroll[]> {
    try {
      const payroll = await hrmDataService.getPayroll(filters)
      if (payroll && payroll.length > 0) {
        return payroll
      }
    } catch (error) {
      console.warn('Failed to load payroll from data service', error)
    }

    const allPayroll = Repo.get<HrmPayroll>('hrm-payroll')
    if (!filters) return allPayroll

    return allPayroll.filter(p => {
      if (filters.empId && p.empId !== filters.empId) return false
      if (filters.payPeriod && p.payPeriod !== filters.payPeriod) return false
      if (filters.status && p.status !== filters.status) return false
      return true
    })
  }

  static async createPayrollWithFallback(payroll: Omit<HrmPayroll, 'id' | 'createdAt' | 'updatedAt'>): Promise<HrmPayroll> {
    try {
      return await hrmDataService.createPayroll(payroll)
    } catch (error) {
      console.warn('Failed to create payroll via data service', error)

      const newPayroll: HrmPayroll = {
        ...payroll,
        id: `PR-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      Repo.add('hrm-payroll', newPayroll)
      return newPayroll
    }
  }

  static async approvePayrollWithFallback(payrollId: string): Promise<HrmPayroll | null> {
    try {
      return await hrmDataService.approvePayroll(payrollId)
    } catch (error) {
      console.warn('Failed to approve payroll via data service', error)

      Repo.update('hrm-payroll', payrollId, { status: 'Approved' })
      const payrolls = Repo.get<HrmPayroll>('hrm-payroll')
      return payrolls.find(p => p.id === payrollId) || null
    }
  }

  static async getPayslipsWithFallback(filters?: {
    empId?: string
    payPeriod?: string
  }): Promise<HrmPayslip[]> {
    try {
      const payslips = await hrmDataService.getPayslips(filters)
      if (payslips && payslips.length > 0) {
        return payslips
      }
    } catch (error) {
      console.warn('Failed to load payslips from data service', error)
    }

    const allPayslips = Repo.get<HrmPayslip>('hrm-payslips')
    if (!filters) return allPayslips

    return allPayslips.filter(ps => {
      if (filters.empId && ps.empId !== filters.empId) return false
      if (filters.payPeriod && ps.payPeriod !== filters.payPeriod) return false
      return true
    })
  }

  static async generatePayslipWithFallback(payslip: Omit<HrmPayslip, 'id' | 'createdAt'>): Promise<HrmPayslip> {
    try {
      return await hrmDataService.generatePayslip(payslip)
    } catch (error) {
      console.warn('Failed to generate payslip via data service', error)

      const newPayslip: HrmPayslip = {
        ...payslip,
        id: `SLIP-${Date.now()}`,
        createdAt: new Date().toISOString()
      }

      Repo.add('hrm-payslips', newPayslip)
      return newPayslip
    }
  }

  static subscribeToEmployeesUpdates(callback: (employees: HrmEiEmp[]) => void): () => void {
    return hrmDataService.subscribeToEmployees((employees) => {
      if (employees && employees.length > 0) {
        callback(employees)
      } else {
        const fallbackEmployees = Repo.get<HrmEiEmp>('hrm-employees')
        callback(fallbackEmployees)
      }
    })
  }

  static subscribeToAttendanceUpdates(callback: (attendance: HrmAttendance[]) => void): () => void {
    return hrmDataService.subscribeToAttendance((attendance) => {
      if (attendance && attendance.length > 0) {
        callback(attendance)
      } else {
        const fallbackAttendance = Repo.get<HrmAttendance>('hrm-attendance')
        callback(fallbackAttendance)
      }
    })
  }

  static subscribeToPayrollUpdates(callback: (payroll: HrmPayroll[]) => void): () => void {
    return hrmDataService.subscribeToPayroll((payroll) => {
      if (payroll && payroll.length > 0) {
        callback(payroll)
      } else {
        const fallbackPayroll = Repo.get<HrmPayroll>('hrm-payroll')
        callback(fallbackPayroll)
      }
    })
  }

  static async getEmployeeAttendanceSummary(empId: string, fromDate: string, toDate: string): Promise<{
    present: number
    absent: number
    leave: number
    halfDay: number
  }> {
    try {
      return await hrmDataService.getEmployeeAttendanceSummary(empId, fromDate, toDate)
    } catch (error) {
      console.warn('Failed to calculate attendance summary', error)

      const attendance = await this.getAttendanceWithFallback({
        empId,
        fromDate,
        toDate
      })

      return {
        present: attendance.filter(a => a.status === 'Present').length,
        absent: attendance.filter(a => a.status === 'Absent').length,
        leave: attendance.filter(a => a.status === 'Leave').length,
        halfDay: attendance.filter(a => a.status === 'Half Day').length
      }
    }
  }

  static async getDepartmentEmployeeCount(deptId: string): Promise<number> {
    try {
      return await hrmDataService.getDepartmentEmployeeCount(deptId)
    } catch (error) {
      console.warn('Failed to get department employee count', error)

      const employees = await this.getEmployeesWithFallback()
      return employees.filter(e => e.department === deptId).length
    }
  }

  static async createBulkAttendanceWithFallback(attendance: Array<Omit<HrmAttendance, 'id' | 'createdAt' | 'updatedAt'>>): Promise<HrmAttendance[]> {
    try {
      return await hrmDataService.createBulkAttendance(attendance)
    } catch (error) {
      console.warn('Failed to create bulk attendance via data service', error)

      const created: HrmAttendance[] = []
      for (const att of attendance) {
        const record = await this.recordAttendanceWithFallback(att)
        created.push(record)
      }
      return created
    }
  }
}
