import { Repo } from './repo'
import { DEMO_FINANCE_BILLS, DEMO_FINANCE_PAYMENTS, DEMO_LATE_FEES, DEMO_WAIVERS, DEMO_COST_HEADS, DEMO_COST_PACKAGES } from '@/finance/data/demoDemoSeeds'
import { DEMO_HRM_EMPLOYEES, DEMO_HRM_DEPARTMENTS, DEMO_HRM_DESIGNATIONS, DEMO_HRM_ATTENDANCE, DEMO_HRM_LEAVE_APPLICATIONS, DEMO_HRM_SALARY_STRUCTURES, DEMO_HRM_PAYSLIPS } from '@/components/hrm/data/demoHRMSeeds'

export function initializeDemoData() {
  const initialized = localStorage.getItem('demo_data_initialized')
  
  if (initialized === 'true') {
    return
  }

  try {
    // Initialize Finance Data
    const existingBills = Repo.get('finance-bills')
    if (!existingBills || existingBills.length === 0) {
      DEMO_FINANCE_BILLS.forEach(bill => Repo.add('finance-bills', bill))
    }

    const existingPayments = Repo.get('finance-payments')
    if (!existingPayments || existingPayments.length === 0) {
      DEMO_FINANCE_PAYMENTS.forEach(payment => Repo.add('finance-payments', payment))
    }

    const existingLateFees = Repo.get('finance-late-fees')
    if (!existingLateFees || existingLateFees.length === 0) {
      DEMO_LATE_FEES.forEach(fee => Repo.add('finance-late-fees', fee))
    }

    const existingWaivers = Repo.get('finance-waivers')
    if (!existingWaivers || existingWaivers.length === 0) {
      DEMO_WAIVERS.forEach(waiver => Repo.add('finance-waivers', waiver))
    }

    const existingCostHeads = Repo.get('finance-cost-heads')
    if (!existingCostHeads || existingCostHeads.length === 0) {
      DEMO_COST_HEADS.forEach(head => Repo.add('finance-cost-heads', head))
    }

    const existingCostPackages = Repo.get('finance-cost-packages')
    if (!existingCostPackages || existingCostPackages.length === 0) {
      DEMO_COST_PACKAGES.forEach(pkg => Repo.add('finance-cost-packages', pkg))
    }

    // Initialize HRM Data
    const existingEmployees = Repo.get('hrm-employees')
    if (!existingEmployees || existingEmployees.length === 0) {
      DEMO_HRM_EMPLOYEES.forEach(emp => Repo.add('hrm-employees', emp))
    }

    const existingDepartments = Repo.get('hrm-departments')
    if (!existingDepartments || existingDepartments.length === 0) {
      DEMO_HRM_DEPARTMENTS.forEach(dept => Repo.add('hrm-departments', dept))
    }

    const existingDesignations = Repo.get('hrm-designations')
    if (!existingDesignations || existingDesignations.length === 0) {
      DEMO_HRM_DESIGNATIONS.forEach(desig => Repo.add('hrm-designations', desig))
    }

    const existingAttendance = Repo.get('hrm-attendance')
    if (!existingAttendance || existingAttendance.length === 0) {
      DEMO_HRM_ATTENDANCE.forEach(att => Repo.add('hrm-attendance', att))
    }

    const existingLeaves = Repo.get('hrm-leave-applications')
    if (!existingLeaves || existingLeaves.length === 0) {
      DEMO_HRM_LEAVE_APPLICATIONS.forEach(leave => Repo.add('hrm-leave-applications', leave))
    }

    const existingSalaryStructures = Repo.get('hrm-salary-structures')
    if (!existingSalaryStructures || existingSalaryStructures.length === 0) {
      DEMO_HRM_SALARY_STRUCTURES.forEach(structure => Repo.add('hrm-salary-structures', structure))
    }

    const existingPayslips = Repo.get('hrm-payslips')
    if (!existingPayslips || existingPayslips.length === 0) {
      DEMO_HRM_PAYSLIPS.forEach(payslip => Repo.add('hrm-payslips', payslip))
    }

    localStorage.setItem('demo_data_initialized', 'true')
  } catch (error) {
    console.error('Error initializing demo data:', error)
  }
}
