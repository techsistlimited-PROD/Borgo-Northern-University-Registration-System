import {
  HrmEiEmp,
  HrmStpDesig,
  HrmStpDept,
  HrmAttendance,
  HrmLeaveApplication,
  HrmSalaryStructure,
  HrmPayroll,
  HrmPayslip
} from '@/lib/oracleSchema'
import { Repo } from '@/lib/repo'

interface DataServiceConfig {
  useOracle?: boolean
  apiBaseUrl?: string
  headers?: Record<string, string>
}

class HRMDataService {
  private config: DataServiceConfig
  private readonly STORAGE_KEYS = {
    EMPLOYEES: 'hrm-employees',
    DESIGNATIONS: 'hrm-designations',
    DEPARTMENTS: 'hrm-departments',
    ATTENDANCE: 'hrm-attendance',
    LEAVE_APPLICATIONS: 'hrm-leave-applications',
    SALARY_STRUCTURES: 'hrm-salary-structures',
    PAYROLL: 'hrm-payroll',
    PAYSLIPS: 'hrm-payslips'
  }

  constructor(config: DataServiceConfig = {}) {
    this.config = {
      useOracle: false,
      ...config
    }
  }

  setConfig(config: DataServiceConfig): void {
    this.config = { ...this.config, ...config }
  }

  setUseOracle(useOracle: boolean, apiBaseUrl?: string): void {
    this.config.useOracle = useOracle
    if (apiBaseUrl) {
      this.config.apiBaseUrl = apiBaseUrl
    }
  }

  private getHeaders(): Record<string, string> {
    return this.config.headers || {
      'Content-Type': 'application/json'
    }
  }

  private async fetchFromOracle<T>(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any): Promise<T[]> {
    if (!this.config.apiBaseUrl) {
      throw new Error('Oracle API base URL not configured')
    }

    const url = `${this.config.apiBaseUrl}${endpoint}`
    const options: RequestInit = {
      method,
      headers: this.getHeaders()
    }

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data)
    }

    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(`Oracle API error: ${response.statusText}`)
    }

    return response.json()
  }

  async getEmployees(filters?: {
    department?: string
    designation?: string
    status?: string
  }): Promise<HrmEiEmp[]> {
    if (this.config.useOracle) {
      try {
        let endpoint = '/api/employees'
        if (filters) {
          const params = new URLSearchParams()
          if (filters.department) params.append('department', filters.department)
          if (filters.designation) params.append('designation', filters.designation)
          if (filters.status) params.append('status', filters.status)
          if (params.toString()) endpoint += `?${params.toString()}`
        }
        return await this.fetchFromOracle<HrmEiEmp>(endpoint)
      } catch (error) {
        console.error('Error fetching employees from Oracle:', error)
        return this.getEmployeesFromStorage()
      }
    }
    return this.getEmployeesFromStorage()
  }

  private getEmployeesFromStorage(): HrmEiEmp[] {
    return Repo.get<HrmEiEmp>(this.STORAGE_KEYS.EMPLOYEES)
  }

  async getEmployeeById(empId: string): Promise<HrmEiEmp | null> {
    const employees = await this.getEmployees()
    return employees.find(e => e.id === empId || e.empCode === empId) || null
  }

  async createEmployee(emp: Omit<HrmEiEmp, 'id' | 'createdAt' | 'updatedAt'>): Promise<HrmEiEmp> {
    const newEmp: HrmEiEmp = {
      ...emp,
      id: `EMP-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (this.config.useOracle) {
      try {
        return await this.fetchFromOracle<HrmEiEmp>('/api/employees', 'POST', newEmp)
      } catch (error) {
        console.error('Error creating employee in Oracle:', error)
        Repo.add(this.STORAGE_KEYS.EMPLOYEES, newEmp)
        return newEmp
      }
    }

    Repo.add(this.STORAGE_KEYS.EMPLOYEES, newEmp)
    return newEmp
  }

  async updateEmployee(id: string, updates: Partial<HrmEiEmp>): Promise<HrmEiEmp | null> {
    if (this.config.useOracle) {
      try {
        const emp = await this.fetchFromOracle<HrmEiEmp>(`/api/employees/${id}`, 'PUT', updates)
        return emp[0] || null
      } catch (error) {
        console.error('Error updating employee in Oracle:', error)
        Repo.update(this.STORAGE_KEYS.EMPLOYEES, id, updates)
        const employees = this.getEmployeesFromStorage()
        return employees.find(e => e.id === id) || null
      }
    }

    Repo.update(this.STORAGE_KEYS.EMPLOYEES, id, updates)
    const employees = this.getEmployeesFromStorage()
    return employees.find(e => e.id === id) || null
  }

  async getDesignations(): Promise<HrmStpDesig[]> {
    if (this.config.useOracle) {
      try {
        return await this.fetchFromOracle<HrmStpDesig>('/api/designations')
      } catch (error) {
        console.error('Error fetching designations from Oracle:', error)
        return this.getDesignationsFromStorage()
      }
    }
    return this.getDesignationsFromStorage()
  }

  private getDesignationsFromStorage(): HrmStpDesig[] {
    return Repo.get<HrmStpDesig>(this.STORAGE_KEYS.DESIGNATIONS)
  }

  async createDesignation(desig: Omit<HrmStpDesig, 'id' | 'createdAt' | 'updatedAt'>): Promise<HrmStpDesig> {
    const newDesig: HrmStpDesig = {
      ...desig,
      id: `DESIG-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (this.config.useOracle) {
      try {
        return await this.fetchFromOracle<HrmStpDesig>('/api/designations', 'POST', newDesig)
      } catch (error) {
        console.error('Error creating designation in Oracle:', error)
        Repo.add(this.STORAGE_KEYS.DESIGNATIONS, newDesig)
        return newDesig
      }
    }

    Repo.add(this.STORAGE_KEYS.DESIGNATIONS, newDesig)
    return newDesig
  }

  async getDepartments(): Promise<HrmStpDept[]> {
    if (this.config.useOracle) {
      try {
        return await this.fetchFromOracle<HrmStpDept>('/api/departments')
      } catch (error) {
        console.error('Error fetching departments from Oracle:', error)
        return this.getDepartmentsFromStorage()
      }
    }
    return this.getDepartmentsFromStorage()
  }

  private getDepartmentsFromStorage(): HrmStpDept[] {
    return Repo.get<HrmStpDept>(this.STORAGE_KEYS.DEPARTMENTS)
  }

  async createDepartment(dept: Omit<HrmStpDept, 'id' | 'createdAt' | 'updatedAt'>): Promise<HrmStpDept> {
    const newDept: HrmStpDept = {
      ...dept,
      id: `DEPT-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (this.config.useOracle) {
      try {
        return await this.fetchFromOracle<HrmStpDept>('/api/departments', 'POST', newDept)
      } catch (error) {
        console.error('Error creating department in Oracle:', error)
        Repo.add(this.STORAGE_KEYS.DEPARTMENTS, newDept)
        return newDept
      }
    }

    Repo.add(this.STORAGE_KEYS.DEPARTMENTS, newDept)
    return newDept
  }

  async getAttendance(filters?: {
    empId?: string
    fromDate?: string
    toDate?: string
    status?: string
  }): Promise<HrmAttendance[]> {
    if (this.config.useOracle) {
      try {
        let endpoint = '/api/attendance'
        if (filters) {
          const params = new URLSearchParams()
          if (filters.empId) params.append('empId', filters.empId)
          if (filters.fromDate) params.append('fromDate', filters.fromDate)
          if (filters.toDate) params.append('toDate', filters.toDate)
          if (filters.status) params.append('status', filters.status)
          if (params.toString()) endpoint += `?${params.toString()}`
        }
        return await this.fetchFromOracle<HrmAttendance>(endpoint)
      } catch (error) {
        console.error('Error fetching attendance from Oracle:', error)
        return this.getAttendanceFromStorage()
      }
    }
    return this.getAttendanceFromStorage()
  }

  private getAttendanceFromStorage(): HrmAttendance[] {
    return Repo.get<HrmAttendance>(this.STORAGE_KEYS.ATTENDANCE)
  }

  async recordAttendance(attendance: Omit<HrmAttendance, 'id' | 'createdAt' | 'updatedAt'>): Promise<HrmAttendance> {
    const newAttendance: HrmAttendance = {
      ...attendance,
      id: `ATT-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (this.config.useOracle) {
      try {
        return await this.fetchFromOracle<HrmAttendance>('/api/attendance', 'POST', newAttendance)
      } catch (error) {
        console.error('Error recording attendance in Oracle:', error)
        Repo.add(this.STORAGE_KEYS.ATTENDANCE, newAttendance)
        return newAttendance
      }
    }

    Repo.add(this.STORAGE_KEYS.ATTENDANCE, newAttendance)
    return newAttendance
  }

  async getLeaveApplications(filters?: {
    empId?: string
    status?: string
    leaveType?: string
  }): Promise<HrmLeaveApplication[]> {
    if (this.config.useOracle) {
      try {
        let endpoint = '/api/leave-applications'
        if (filters) {
          const params = new URLSearchParams()
          if (filters.empId) params.append('empId', filters.empId)
          if (filters.status) params.append('status', filters.status)
          if (filters.leaveType) params.append('leaveType', filters.leaveType)
          if (params.toString()) endpoint += `?${params.toString()}`
        }
        return await this.fetchFromOracle<HrmLeaveApplication>(endpoint)
      } catch (error) {
        console.error('Error fetching leave applications from Oracle:', error)
        return this.getLeaveApplicationsFromStorage()
      }
    }
    return this.getLeaveApplicationsFromStorage()
  }

  private getLeaveApplicationsFromStorage(): HrmLeaveApplication[] {
    return Repo.get<HrmLeaveApplication>(this.STORAGE_KEYS.LEAVE_APPLICATIONS)
  }

  async applyLeave(leave: Omit<HrmLeaveApplication, 'id' | 'createdAt' | 'updatedAt'>): Promise<HrmLeaveApplication> {
    const newLeave: HrmLeaveApplication = {
      ...leave,
      id: `LEAVE-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (this.config.useOracle) {
      try {
        return await this.fetchFromOracle<HrmLeaveApplication>('/api/leave-applications', 'POST', newLeave)
      } catch (error) {
        console.error('Error applying leave in Oracle:', error)
        Repo.add(this.STORAGE_KEYS.LEAVE_APPLICATIONS, newLeave)
        return newLeave
      }
    }

    Repo.add(this.STORAGE_KEYS.LEAVE_APPLICATIONS, newLeave)
    return newLeave
  }

  async approveLeave(leaveId: string, approvedBy: string): Promise<HrmLeaveApplication | null> {
    const updates: Partial<HrmLeaveApplication> = {
      status: 'Approved',
      approvedBy,
      approvalDate: new Date().toISOString()
    }

    if (this.config.useOracle) {
      try {
        const leave = await this.fetchFromOracle<HrmLeaveApplication>(`/api/leave-applications/${leaveId}`, 'PUT', updates)
        return leave[0] || null
      } catch (error) {
        console.error('Error approving leave in Oracle:', error)
        Repo.update(this.STORAGE_KEYS.LEAVE_APPLICATIONS, leaveId, updates)
        const leaves = this.getLeaveApplicationsFromStorage()
        return leaves.find(l => l.id === leaveId) || null
      }
    }

    Repo.update(this.STORAGE_KEYS.LEAVE_APPLICATIONS, leaveId, updates)
    const leaves = this.getLeaveApplicationsFromStorage()
    return leaves.find(l => l.id === leaveId) || null
  }

  async getSalaryStructures(filters?: {
    empId?: string
    status?: string
  }): Promise<HrmSalaryStructure[]> {
    if (this.config.useOracle) {
      try {
        let endpoint = '/api/salary-structures'
        if (filters) {
          const params = new URLSearchParams()
          if (filters.empId) params.append('empId', filters.empId)
          if (filters.status) params.append('status', filters.status)
          if (params.toString()) endpoint += `?${params.toString()}`
        }
        return await this.fetchFromOracle<HrmSalaryStructure>(endpoint)
      } catch (error) {
        console.error('Error fetching salary structures from Oracle:', error)
        return this.getSalaryStructuresFromStorage()
      }
    }
    return this.getSalaryStructuresFromStorage()
  }

  private getSalaryStructuresFromStorage(): HrmSalaryStructure[] {
    return Repo.get<HrmSalaryStructure>(this.STORAGE_KEYS.SALARY_STRUCTURES)
  }

  async createSalaryStructure(salary: Omit<HrmSalaryStructure, 'id' | 'createdAt' | 'updatedAt'>): Promise<HrmSalaryStructure> {
    const newSalary: HrmSalaryStructure = {
      ...salary,
      id: `SAL-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (this.config.useOracle) {
      try {
        return await this.fetchFromOracle<HrmSalaryStructure>('/api/salary-structures', 'POST', newSalary)
      } catch (error) {
        console.error('Error creating salary structure in Oracle:', error)
        Repo.add(this.STORAGE_KEYS.SALARY_STRUCTURES, newSalary)
        return newSalary
      }
    }

    Repo.add(this.STORAGE_KEYS.SALARY_STRUCTURES, newSalary)
    return newSalary
  }

  async getPayroll(filters?: {
    empId?: string
    payPeriod?: string
    status?: string
  }): Promise<HrmPayroll[]> {
    if (this.config.useOracle) {
      try {
        let endpoint = '/api/payroll'
        if (filters) {
          const params = new URLSearchParams()
          if (filters.empId) params.append('empId', filters.empId)
          if (filters.payPeriod) params.append('payPeriod', filters.payPeriod)
          if (filters.status) params.append('status', filters.status)
          if (params.toString()) endpoint += `?${params.toString()}`
        }
        return await this.fetchFromOracle<HrmPayroll>(endpoint)
      } catch (error) {
        console.error('Error fetching payroll from Oracle:', error)
        return this.getPayrollFromStorage()
      }
    }
    return this.getPayrollFromStorage()
  }

  private getPayrollFromStorage(): HrmPayroll[] {
    return Repo.get<HrmPayroll>(this.STORAGE_KEYS.PAYROLL)
  }

  async createPayroll(payroll: Omit<HrmPayroll, 'id' | 'createdAt' | 'updatedAt'>): Promise<HrmPayroll> {
    const newPayroll: HrmPayroll = {
      ...payroll,
      id: `PR-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (this.config.useOracle) {
      try {
        return await this.fetchFromOracle<HrmPayroll>('/api/payroll', 'POST', newPayroll)
      } catch (error) {
        console.error('Error creating payroll in Oracle:', error)
        Repo.add(this.STORAGE_KEYS.PAYROLL, newPayroll)
        return newPayroll
      }
    }

    Repo.add(this.STORAGE_KEYS.PAYROLL, newPayroll)
    return newPayroll
  }

  async approvePayroll(payrollId: string): Promise<HrmPayroll | null> {
    const updates: Partial<HrmPayroll> = {
      status: 'Approved'
    }

    if (this.config.useOracle) {
      try {
        const payroll = await this.fetchFromOracle<HrmPayroll>(`/api/payroll/${payrollId}`, 'PUT', updates)
        return payroll[0] || null
      } catch (error) {
        console.error('Error approving payroll in Oracle:', error)
        Repo.update(this.STORAGE_KEYS.PAYROLL, payrollId, updates)
        const payrolls = this.getPayrollFromStorage()
        return payrolls.find(p => p.id === payrollId) || null
      }
    }

    Repo.update(this.STORAGE_KEYS.PAYROLL, payrollId, updates)
    const payrolls = this.getPayrollFromStorage()
    return payrolls.find(p => p.id === payrollId) || null
  }

  async getPayslips(filters?: {
    empId?: string
    payPeriod?: string
  }): Promise<HrmPayslip[]> {
    if (this.config.useOracle) {
      try {
        let endpoint = '/api/payslips'
        if (filters) {
          const params = new URLSearchParams()
          if (filters.empId) params.append('empId', filters.empId)
          if (filters.payPeriod) params.append('payPeriod', filters.payPeriod)
          if (params.toString()) endpoint += `?${params.toString()}`
        }
        return await this.fetchFromOracle<HrmPayslip>(endpoint)
      } catch (error) {
        console.error('Error fetching payslips from Oracle:', error)
        return this.getPayslipsFromStorage()
      }
    }
    return this.getPayslipsFromStorage()
  }

  private getPayslipsFromStorage(): HrmPayslip[] {
    return Repo.get<HrmPayslip>(this.STORAGE_KEYS.PAYSLIPS)
  }

  async generatePayslip(payslip: Omit<HrmPayslip, 'id' | 'createdAt'>): Promise<HrmPayslip> {
    const newPayslip: HrmPayslip = {
      ...payslip,
      id: `SLIP-${Date.now()}`,
      createdAt: new Date().toISOString()
    }

    if (this.config.useOracle) {
      try {
        return await this.fetchFromOracle<HrmPayslip>('/api/payslips', 'POST', newPayslip)
      } catch (error) {
        console.error('Error generating payslip in Oracle:', error)
        Repo.add(this.STORAGE_KEYS.PAYSLIPS, newPayslip)
        return newPayslip
      }
    }

    Repo.add(this.STORAGE_KEYS.PAYSLIPS, newPayslip)
    return newPayslip
  }

  subscribeToEmployees(callback: (employees: HrmEiEmp[]) => void): () => void {
    return Repo.subscribe(this.STORAGE_KEYS.EMPLOYEES, callback)
  }

  subscribeToAttendance(callback: (attendance: HrmAttendance[]) => void): () => void {
    return Repo.subscribe(this.STORAGE_KEYS.ATTENDANCE, callback)
  }

  subscribeToPayroll(callback: (payroll: HrmPayroll[]) => void): () => void {
    return Repo.subscribe(this.STORAGE_KEYS.PAYROLL, callback)
  }

  async getEmployeeAttendanceSummary(empId: string, fromDate: string, toDate: string): Promise<{
    present: number
    absent: number
    leave: number
    halfDay: number
  }> {
    const attendance = await this.getAttendance({ empId, fromDate, toDate })
    return {
      present: attendance.filter(a => a.status === 'Present').length,
      absent: attendance.filter(a => a.status === 'Absent').length,
      leave: attendance.filter(a => a.status === 'Leave').length,
      halfDay: attendance.filter(a => a.status === 'Half Day').length
    }
  }

  async getDepartmentEmployeeCount(deptId: string): Promise<number> {
    const employees = await this.getEmployees()
    return employees.filter(e => e.department === deptId).length
  }

  async createBulkAttendance(attendance: Array<Omit<HrmAttendance, 'id' | 'createdAt' | 'updatedAt'>>): Promise<HrmAttendance[]> {
    const created: HrmAttendance[] = []
    for (const att of attendance) {
      const record = await this.recordAttendance(att)
      created.push(record)
    }
    return created
  }
}

export const hrmDataService = new HRMDataService()
