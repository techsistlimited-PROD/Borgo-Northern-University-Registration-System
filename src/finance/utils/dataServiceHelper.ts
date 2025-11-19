import { financeDataService } from '../services/financeDataService'
import { FinanceBill, FinancePayment, AcadStudent } from '@/lib/oracleSchema'
import { StudentBill, Payment } from '../data/types'
import { Repo } from '@/lib/repo'

export class FinanceDataServiceHelper {
  static async getBillsWithFallback(): Promise<(StudentBill | FinanceBill)[]> {
    try {
      const bills = await financeDataService.getBills()
      if (bills && bills.length > 0) {
        return bills
      }
    } catch (error) {
      console.warn('Failed to load bills from data service, using fallback', error)
    }

    return Repo.get<StudentBill>('finance-student-bills')
  }

  static async getStudentBalance(studentId: string): Promise<number> {
    try {
      return await financeDataService.getStudentBalance(studentId)
    } catch (error) {
      console.warn('Failed to calculate balance from data service', error)

      const bills = Repo.get<StudentBill>('finance-student-bills')
      return bills
        .filter(b => b.studentId === studentId && ['Issued', 'Partial', 'Overdue'].includes(b.status))
        .reduce((sum, b) => sum + (b.balanceDue || 0), 0)
    }
  }

  static async getPaymentsWithFallback(): Promise<(Payment | FinancePayment)[]> {
    try {
      const payments = await financeDataService.getPayments()
      if (payments && payments.length > 0) {
        return payments
      }
    } catch (error) {
      console.warn('Failed to load payments from data service, using fallback', error)
    }

    return Repo.get<Payment>('finance-payments')
  }

  static async createBillWithFallback(bill: Omit<FinanceBill, 'id' | 'createdAt' | 'updatedAt'>): Promise<FinanceBill> {
    try {
      return await financeDataService.createBill(bill)
    } catch (error) {
      console.warn('Failed to create bill via data service, using fallback', error)

      const newBill: FinanceBill = {
        ...bill,
        id: `BILL-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      Repo.add('finance-bills', newBill)
      return newBill
    }
  }

  static async createPaymentWithFallback(payment: Omit<FinancePayment, 'id' | 'createdAt' | 'updatedAt'>): Promise<FinancePayment> {
    try {
      return await financeDataService.createPayment(payment)
    } catch (error) {
      console.warn('Failed to create payment via data service, using fallback', error)

      const newPayment: FinancePayment = {
        ...payment,
        id: `PAY-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      Repo.add('finance-payments', newPayment)
      return newPayment
    }
  }

  static async getStudentsWithFallback(): Promise<AcadStudent[]> {
    try {
      const students = await financeDataService.getStudents()
      if (students && students.length > 0) {
        return students
      }
    } catch (error) {
      console.warn('Failed to load students from data service, using fallback', error)
    }

    return Repo.get<AcadStudent>('finance-students')
  }

  static async getBillsForStudentWithFallback(studentId: string): Promise<(StudentBill | FinanceBill)[]> {
    try {
      const bills = await financeDataService.getBillsForStudent(studentId)
      if (bills && bills.length > 0) {
        return bills
      }
    } catch (error) {
      console.warn('Failed to load student bills from data service', error)
    }

    const allBills = Repo.get<StudentBill>('finance-student-bills')
    return allBills.filter(b => b.studentId === studentId)
  }

  static subscribeToUpdates(
    onBillsUpdate: (bills: any[]) => void,
    onPaymentsUpdate: (payments: any[]) => void
  ): () => void {
    const unsubscribeBills = financeDataService.subscribeToBills((bills) => {
      if (bills && bills.length > 0) {
        onBillsUpdate(bills)
      } else {
        const fallbackBills = Repo.get('finance-student-bills')
        onBillsUpdate(fallbackBills)
      }
    })

    const unsubscribePayments = financeDataService.subscribeToPayments((payments) => {
      if (payments && payments.length > 0) {
        onPaymentsUpdate(payments)
      } else {
        const fallbackPayments = Repo.get('finance-payments')
        onPaymentsUpdate(fallbackPayments)
      }
    })

    return () => {
      unsubscribeBills()
      unsubscribePayments()
    }
  }

  static async updateBillWithFallback(id: string, updates: Partial<FinanceBill>): Promise<FinanceBill | null> {
    try {
      return await financeDataService.updateBill(id, updates)
    } catch (error) {
      console.warn('Failed to update bill via data service', error)
      Repo.update('finance-bills', id, updates)
      const bills = Repo.get<FinanceBill>('finance-bills')
      return bills.find(b => b.id === id) || null
    }
  }

  static async deleteBillWithFallback(id: string): Promise<boolean> {
    try {
      return await financeDataService.deleteBill(id)
    } catch (error) {
      console.warn('Failed to delete bill via data service', error)
      Repo.delete('finance-bills', id)
      return true
    }
  }

  static async getCostHeadsWithFallback(): Promise<any[]> {
    try {
      const heads = await financeDataService.getCostHeads()
      if (heads && heads.length > 0) {
        return heads
      }
    } catch (error) {
      console.warn('Failed to load cost heads from data service', error)
    }

    return Repo.get('finance-cost-heads')
  }

  static async getCostPackagesWithFallback(): Promise<any[]> {
    try {
      const packages = await financeDataService.getCostPackages()
      if (packages && packages.length > 0) {
        return packages
      }
    } catch (error) {
      console.warn('Failed to load cost packages from data service', error)
    }

    return Repo.get('finance-cost-packages')
  }

  static async getLateFeeWithFallback(): Promise<any[]> {
    try {
      const fees = await financeDataService.getLateFees()
      if (fees && fees.length > 0) {
        return fees
      }
    } catch (error) {
      console.warn('Failed to load late fees from data service', error)
    }

    return Repo.get('finance-late-fees')
  }

  static async getWaiverWithFallback(): Promise<any[]> {
    try {
      const waivers = await financeDataService.getWaivers()
      if (waivers && waivers.length > 0) {
        return waivers
      }
    } catch (error) {
      console.warn('Failed to load waivers from data service', error)
    }

    return Repo.get('finance-waivers')
  }

  static async getWaiverAssignmentWithFallback(): Promise<any[]> {
    try {
      const assignments = await financeDataService.getWaiverAssignments()
      if (assignments && assignments.length > 0) {
        return assignments
      }
    } catch (error) {
      console.warn('Failed to load waiver assignments from data service', error)
    }

    return Repo.get('finance-waiver-assignments')
  }

  static convertStudentBillToFinanceBill(bill: StudentBill): FinanceBill {
    return {
      id: bill.id,
      billNo: bill.billNo,
      studentId: bill.studentId,
      billDate: bill.billDate,
      dueDate: bill.dueDate,
      amount: bill.netTotal,
      status: bill.status,
      createdAt: bill.createdAt,
      updatedAt: bill.updatedAt
    }
  }

  static convertFinanceBillToStudentBill(bill: FinanceBill): StudentBill {
    return {
      id: bill.id,
      billNo: bill.billNo,
      studentId: bill.studentId,
      studentName: '',
      program: '',
      campus: '',
      semester: '',
      billDate: bill.billDate,
      dueDate: bill.dueDate,
      lineItems: [],
      grossTotal: bill.amount,
      waiverTotal: 0,
      scholarshipTotal: 0,
      deductionTotal: 0,
      netTotal: bill.amount,
      paidAmount: 0,
      balanceDue: bill.amount,
      status: bill.status,
      createdAt: bill.createdAt,
      updatedAt: bill.updatedAt
    }
  }
}
