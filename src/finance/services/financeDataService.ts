import {
  FinanceBill,
  FinancePayment,
  FinanceCostHead,
  FinanceCostPackage,
  FinanceLateFee,
  FinanceWaiver,
  FinanceWaiverAssignment,
  AcadStudent
} from '@/lib/oracleSchema'
import { Repo } from '@/lib/repo'

interface DataServiceConfig {
  useOracle?: boolean
  apiBaseUrl?: string
  headers?: Record<string, string>
}

class FinanceDataService {
  private config: DataServiceConfig
  private readonly STORAGE_KEYS = {
    BILLS: 'finance-bills',
    PAYMENTS: 'finance-payments',
    COST_HEADS: 'finance-cost-heads',
    COST_PACKAGES: 'finance-cost-packages',
    LATE_FEES: 'finance-late-fees',
    WAIVERS: 'finance-waivers',
    WAIVER_ASSIGNMENTS: 'finance-waiver-assignments',
    STUDENTS: 'finance-students'
  }

  constructor(config: DataServiceConfig = {}) {
    this.config = {
      useOracle: false,
      ...config
    }
  }

  // Configuration Methods
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

  // Bills Methods
  async getBills(filters?: {
    studentId?: string
    status?: string
    campus?: string
  }): Promise<FinanceBill[]> {
    if (this.config.useOracle) {
      try {
        let endpoint = '/api/bills'
        if (filters) {
          const params = new URLSearchParams()
          if (filters.studentId) params.append('studentId', filters.studentId)
          if (filters.status) params.append('status', filters.status)
          if (filters.campus) params.append('campus', filters.campus)
          if (params.toString()) endpoint += `?${params.toString()}`
        }
        return await this.fetchFromOracle<FinanceBill>(endpoint)
      } catch (error) {
        console.error('Error fetching bills from Oracle:', error)
        return this.getBillsFromStorage()
      }
    }
    return this.getBillsFromStorage()
  }

  private getBillsFromStorage(): FinanceBill[] {
    return Repo.get<FinanceBill>(this.STORAGE_KEYS.BILLS)
  }

  async createBill(bill: Omit<FinanceBill, 'id' | 'createdAt' | 'updatedAt'>): Promise<FinanceBill> {
    const newBill: FinanceBill = {
      ...bill,
      id: `BILL-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (this.config.useOracle) {
      try {
        return await this.fetchFromOracle<FinanceBill>('/api/bills', 'POST', newBill)
      } catch (error) {
        console.error('Error creating bill in Oracle:', error)
        Repo.add(this.STORAGE_KEYS.BILLS, newBill)
        return newBill
      }
    }

    Repo.add(this.STORAGE_KEYS.BILLS, newBill)
    return newBill
  }

  async updateBill(id: string, updates: Partial<FinanceBill>): Promise<FinanceBill | null> {
    if (this.config.useOracle) {
      try {
        const bill = await this.fetchFromOracle<FinanceBill>(`/api/bills/${id}`, 'PUT', updates)
        return bill[0] || null
      } catch (error) {
        console.error('Error updating bill in Oracle:', error)
        Repo.update(this.STORAGE_KEYS.BILLS, id, updates)
        const bills = this.getBillsFromStorage()
        return bills.find(b => b.id === id) || null
      }
    }

    Repo.update(this.STORAGE_KEYS.BILLS, id, updates)
    const bills = this.getBillsFromStorage()
    return bills.find(b => b.id === id) || null
  }

  async deleteBill(id: string): Promise<boolean> {
    if (this.config.useOracle) {
      try {
        await this.fetchFromOracle(`/api/bills/${id}`, 'DELETE')
        return true
      } catch (error) {
        console.error('Error deleting bill from Oracle:', error)
        Repo.delete(this.STORAGE_KEYS.BILLS, id)
        return true
      }
    }

    Repo.delete(this.STORAGE_KEYS.BILLS, id)
    return true
  }

  // Payments Methods
  async getPayments(filters?: {
    studentId?: string
    billId?: string
    status?: string
  }): Promise<FinancePayment[]> {
    if (this.config.useOracle) {
      try {
        let endpoint = '/api/payments'
        if (filters) {
          const params = new URLSearchParams()
          if (filters.studentId) params.append('studentId', filters.studentId)
          if (filters.billId) params.append('billId', filters.billId)
          if (filters.status) params.append('status', filters.status)
          if (params.toString()) endpoint += `?${params.toString()}`
        }
        return await this.fetchFromOracle<FinancePayment>(endpoint)
      } catch (error) {
        console.error('Error fetching payments from Oracle:', error)
        return this.getPaymentsFromStorage()
      }
    }
    return this.getPaymentsFromStorage()
  }

  private getPaymentsFromStorage(): FinancePayment[] {
    return Repo.get<FinancePayment>(this.STORAGE_KEYS.PAYMENTS)
  }

  async createPayment(payment: Omit<FinancePayment, 'id' | 'createdAt' | 'updatedAt'>): Promise<FinancePayment> {
    const newPayment: FinancePayment = {
      ...payment,
      id: `PAY-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (this.config.useOracle) {
      try {
        return await this.fetchFromOracle<FinancePayment>('/api/payments', 'POST', newPayment)
      } catch (error) {
        console.error('Error creating payment in Oracle:', error)
        Repo.add(this.STORAGE_KEYS.PAYMENTS, newPayment)
        return newPayment
      }
    }

    Repo.add(this.STORAGE_KEYS.PAYMENTS, newPayment)
    return newPayment
  }

  // Cost Heads Methods
  async getCostHeads(): Promise<FinanceCostHead[]> {
    if (this.config.useOracle) {
      try {
        return await this.fetchFromOracle<FinanceCostHead>('/api/cost-heads')
      } catch (error) {
        console.error('Error fetching cost heads from Oracle:', error)
        return this.getCostHeadsFromStorage()
      }
    }
    return this.getCostHeadsFromStorage()
  }

  private getCostHeadsFromStorage(): FinanceCostHead[] {
    return Repo.get<FinanceCostHead>(this.STORAGE_KEYS.COST_HEADS)
  }

  async createCostHead(costHead: Omit<FinanceCostHead, 'id' | 'createdAt' | 'updatedAt'>): Promise<FinanceCostHead> {
    const newCostHead: FinanceCostHead = {
      ...costHead,
      id: `CH-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (this.config.useOracle) {
      try {
        return await this.fetchFromOracle<FinanceCostHead>('/api/cost-heads', 'POST', newCostHead)
      } catch (error) {
        console.error('Error creating cost head in Oracle:', error)
        Repo.add(this.STORAGE_KEYS.COST_HEADS, newCostHead)
        return newCostHead
      }
    }

    Repo.add(this.STORAGE_KEYS.COST_HEADS, newCostHead)
    return newCostHead
  }

  // Cost Packages Methods
  async getCostPackages(filters?: {
    program?: string
    campus?: string
    status?: string
  }): Promise<FinanceCostPackage[]> {
    if (this.config.useOracle) {
      try {
        let endpoint = '/api/cost-packages'
        if (filters) {
          const params = new URLSearchParams()
          if (filters.program) params.append('program', filters.program)
          if (filters.campus) params.append('campus', filters.campus)
          if (filters.status) params.append('status', filters.status)
          if (params.toString()) endpoint += `?${params.toString()}`
        }
        return await this.fetchFromOracle<FinanceCostPackage>(endpoint)
      } catch (error) {
        console.error('Error fetching cost packages from Oracle:', error)
        return this.getCostPackagesFromStorage()
      }
    }
    return this.getCostPackagesFromStorage()
  }

  private getCostPackagesFromStorage(): FinanceCostPackage[] {
    return Repo.get<FinanceCostPackage>(this.STORAGE_KEYS.COST_PACKAGES)
  }

  // Late Fees Methods
  async getLateFees(filters?: {
    studentId?: string
    status?: string
  }): Promise<FinanceLateFee[]> {
    if (this.config.useOracle) {
      try {
        let endpoint = '/api/late-fees'
        if (filters) {
          const params = new URLSearchParams()
          if (filters.studentId) params.append('studentId', filters.studentId)
          if (filters.status) params.append('status', filters.status)
          if (params.toString()) endpoint += `?${params.toString()}`
        }
        return await this.fetchFromOracle<FinanceLateFee>(endpoint)
      } catch (error) {
        console.error('Error fetching late fees from Oracle:', error)
        return this.getLateFeesFro mStorage()
      }
    }
    return this.getLateFeesFro mStorage()
  }

  private getLateFeesFro mStorage(): FinanceLateFee[] {
    return Repo.get<FinanceLateFee>(this.STORAGE_KEYS.LATE_FEES)
  }

  async applyLateFee(lateFee: Omit<FinanceLateFee, 'id' | 'createdAt' | 'updatedAt'>): Promise<FinanceLateFee> {
    const newLateFee: FinanceLateFee = {
      ...lateFee,
      id: `LF-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (this.config.useOracle) {
      try {
        return await this.fetchFromOracle<FinanceLateFee>('/api/late-fees', 'POST', newLateFee)
      } catch (error) {
        console.error('Error applying late fee in Oracle:', error)
        Repo.add(this.STORAGE_KEYS.LATE_FEES, newLateFee)
        return newLateFee
      }
    }

    Repo.add(this.STORAGE_KEYS.LATE_FEES, newLateFee)
    return newLateFee
  }

  // Waivers Methods
  async getWaivers(): Promise<FinanceWaiver[]> {
    if (this.config.useOracle) {
      try {
        return await this.fetchFromOracle<FinanceWaiver>('/api/waivers')
      } catch (error) {
        console.error('Error fetching waivers from Oracle:', error)
        return this.getWaiversFromStorage()
      }
    }
    return this.getWaiversFromStorage()
  }

  private getWaiversFromStorage(): FinanceWaiver[] {
    return Repo.get<FinanceWaiver>(this.STORAGE_KEYS.WAIVERS)
  }

  // Waiver Assignments Methods
  async getWaiverAssignments(filters?: {
    studentId?: string
    status?: string
  }): Promise<FinanceWaiverAssignment[]> {
    if (this.config.useOracle) {
      try {
        let endpoint = '/api/waiver-assignments'
        if (filters) {
          const params = new URLSearchParams()
          if (filters.studentId) params.append('studentId', filters.studentId)
          if (filters.status) params.append('status', filters.status)
          if (params.toString()) endpoint += `?${params.toString()}`
        }
        return await this.fetchFromOracle<FinanceWaiverAssignment>(endpoint)
      } catch (error) {
        console.error('Error fetching waiver assignments from Oracle:', error)
        return this.getWaiverAssignmentsFromStorage()
      }
    }
    return this.getWaiverAssignmentsFromStorage()
  }

  private getWaiverAssignmentsFromStorage(): FinanceWaiverAssignment[] {
    return Repo.get<FinanceWaiverAssignment>(this.STORAGE_KEYS.WAIVER_ASSIGNMENTS)
  }

  async assignWaiver(assignment: Omit<FinanceWaiverAssignment, 'id' | 'createdAt' | 'updatedAt'>): Promise<FinanceWaiverAssignment> {
    const newAssignment: FinanceWaiverAssignment = {
      ...assignment,
      id: `WA-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (this.config.useOracle) {
      try {
        return await this.fetchFromOracle<FinanceWaiverAssignment>('/api/waiver-assignments', 'POST', newAssignment)
      } catch (error) {
        console.error('Error assigning waiver in Oracle:', error)
        Repo.add(this.STORAGE_KEYS.WAIVER_ASSIGNMENTS, newAssignment)
        return newAssignment
      }
    }

    Repo.add(this.STORAGE_KEYS.WAIVER_ASSIGNMENTS, newAssignment)
    return newAssignment
  }

  // Students Methods
  async getStudents(filters?: {
    campus?: string
    program?: string
    status?: string
  }): Promise<AcadStudent[]> {
    if (this.config.useOracle) {
      try {
        let endpoint = '/api/students'
        if (filters) {
          const params = new URLSearchParams()
          if (filters.campus) params.append('campus', filters.campus)
          if (filters.program) params.append('program', filters.program)
          if (filters.status) params.append('status', filters.status)
          if (params.toString()) endpoint += `?${params.toString()}`
        }
        return await this.fetchFromOracle<AcadStudent>(endpoint)
      } catch (error) {
        console.error('Error fetching students from Oracle:', error)
        return this.getStudentsFromStorage()
      }
    }
    return this.getStudentsFromStorage()
  }

  private getStudentsFromStorage(): AcadStudent[] {
    return Repo.get<AcadStudent>(this.STORAGE_KEYS.STUDENTS)
  }

  async getStudentById(studentId: string): Promise<AcadStudent | null> {
    const students = await this.getStudents()
    return students.find(s => s.studentId === studentId) || null
  }

  // Subscription Methods
  subscribeToBills(callback: (bills: FinanceBill[]) => void): () => void {
    return Repo.subscribe(this.STORAGE_KEYS.BILLS, callback)
  }

  subscribeToPayments(callback: (payments: FinancePayment[]) => void): () => void {
    return Repo.subscribe(this.STORAGE_KEYS.PAYMENTS, callback)
  }

  // Utility Methods
  async getBillsForStudent(studentId: string): Promise<FinanceBill[]> {
    const bills = await this.getBills({ studentId })
    return bills
  }

  async getStudentBalance(studentId: string): Promise<number> {
    const bills = await this.getBillsForStudent(studentId)
    const totalDue = bills
      .filter(b => ['Issued', 'Partial', 'Overdue'].includes(b.status))
      .reduce((sum, b) => sum + (b.amount - ((b as any).paidAmount || 0)), 0)
    return totalDue
  }

  async getPaymentsForBill(billId: string): Promise<FinancePayment[]> {
    const payments = await this.getPayments({ billId })
    return payments
  }

  // Bulk Operations
  async createBulkBills(bills: Array<Omit<FinanceBill, 'id' | 'createdAt' | 'updatedAt'>>): Promise<FinanceBill[]> {
    const createdBills: FinanceBill[] = []
    for (const bill of bills) {
      const created = await this.createBill(bill)
      createdBills.push(created)
    }
    return createdBills
  }
}

export const financeDataService = new FinanceDataService()