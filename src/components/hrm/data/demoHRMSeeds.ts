import { HrmEiEmp, HrmStpDesig, HrmStpDept, HrmAttendance, HrmLeaveApplication, HrmSalaryStructure, HrmPayslip } from '@/lib/oracleSchema'

const generateId = () => Math.random().toString(36).substring(2, 11)
const generateEmpCode = (index: number) => `EMP${String(index).padStart(5, '0')}`
const generatePayslipNo = (index: number) => `PSL${String(index).padStart(6, '0')}`

const departments = ['Finance', 'HR', 'IT', 'Operations', 'Marketing', 'Administration', 'Academic', 'Support']
const designations = ['Manager', 'Senior Executive', 'Executive', 'Assistant', 'Coordinator', 'Officer', 'Director', 'Supervisor']
const leaveTypes = ['Casual Leave', 'Sick Leave', 'Annual Leave', 'Maternity Leave', 'Study Leave', 'Unpaid Leave']
const firstNames = ['Ahmed', 'Fatima', 'Hassan', 'Ayesha', 'Muhammad', 'Zainab', 'Ali', 'Noor', 'Omar', 'Hana']
const lastNames = ['Khan', 'Ahmed', 'Hassan', 'Ali', 'Islam', 'Rahman', 'Malik', 'Hussain', 'Shah', 'Siddiqui']

const generateRandomDate = (daysInPast: number = 365): string => {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysInPast))
  return date.toISOString().split('T')[0]
}

const getRandomElement = <T,>(array: T[]): T => array[Math.floor(Math.random() * array.length)]

export function generateDemoEmployees(count: number = 200): HrmEiEmp[] {
  const employees: HrmEiEmp[] = []
  const statuses: Array<'Active' | 'Inactive' | 'On Leave'> = ['Active', 'Inactive', 'On Leave']
  
  for (let i = 0; i < count; i++) {
    const ctcBase = 300000 + Math.random() * 700000
    
    employees.push({
      id: generateId(),
      empCode: generateEmpCode(i + 1),
      firstName: getRandomElement(firstNames),
      lastName: getRandomElement(lastNames),
      email: `emp${i + 1}@university.edu.bd`,
      phone: `01${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
      dateOfBirth: generateRandomDate(8000),
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      departmentId: getRandomElement(departments),
      designation: getRandomElement(designations),
      joiningDate: generateRandomDate(1825),
      ctc: Math.round(ctcBase),
      status: getRandomElement(statuses),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }
  
  return employees
}

export function generateDemoDepartments(count: number = 8): HrmStpDept[] {
  const depts: HrmStpDept[] = []
  
  for (let i = 0; i < Math.min(count, departments.length); i++) {
    depts.push({
      id: generateId(),
      deptCode: `DEP${String(i + 1).padStart(3, '0')}`,
      deptName: departments[i],
      headOfDept: `HOD_${i + 1}`,
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }
  
  return depts
}

export function generateDemoDesignations(count: number = 8): HrmStpDesig[] {
  const desigs: HrmStpDesig[] = []
  
  for (let i = 0; i < Math.min(count, designations.length); i++) {
    desigs.push({
      id: generateId(),
      desigCode: `DESIG${String(i + 1).padStart(3, '0')}`,
      desigName: designations[i],
      description: `Position for ${designations[i].toLowerCase()}`,
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }
  
  return desigs
}

export function generateDemoAttendance(empCount: number = 200, daysBack: number = 30): HrmAttendance[] {
  const attendance: HrmAttendance[] = []
  const statuses: Array<'Present' | 'Absent' | 'Half Day' | 'Leave'> = ['Present', 'Absent', 'Half Day', 'Leave']
  
  for (let day = 0; day < daysBack; day++) {
    for (let emp = 0; emp < Math.min(empCount, 150); emp++) {
      const date = new Date()
      date.setDate(date.getDate() - day)
      const dateStr = date.toISOString().split('T')[0]
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue
      
      const status = getRandomElement(statuses)
      
      attendance.push({
        id: generateId(),
        empId: generateEmpCode(emp + 1),
        attendanceDate: dateStr,
        checkIn: status === 'Absent' ? undefined : `${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        checkOut: status === 'Absent' || status === 'Half Day' ? undefined : `${String(Math.floor(Math.random() * 12) + 16).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }
  }
  
  return attendance
}

export function generateDemoLeaveApplications(count: number = 100): HrmLeaveApplication[] {
  const leaves: HrmLeaveApplication[] = []
  const statuses: Array<'Pending' | 'Approved' | 'Rejected'> = ['Pending', 'Approved', 'Rejected']
  
  for (let i = 0; i < count; i++) {
    const fromDate = generateRandomDate(180)
    const noOfDays = Math.floor(Math.random() * 10) + 1
    const toDate = new Date(new Date(fromDate).getTime() + (noOfDays - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    leaves.push({
      id: generateId(),
      empId: generateEmpCode(Math.floor(Math.random() * 200) + 1),
      leaveType: getRandomElement(leaveTypes),
      fromDate,
      toDate,
      noOfDays,
      reason: `Leave request for personal/medical reasons`,
      status: getRandomElement(statuses),
      appliedDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      approvalDate: Math.random() > 0.3 ? new Date().toISOString().split('T')[0] : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }
  
  return leaves
}

export function generateDemoSalaryStructures(count: number = 20): HrmSalaryStructure[] {
  const structures: HrmSalaryStructure[] = []
  
  for (let i = 0; i < count; i++) {
    const baseSalary = 200000 + Math.random() * 400000
    const hra = baseSalary * 0.15
    const da = baseSalary * 0.1
    const grossSalary = baseSalary + hra + da
    const pf = grossSalary * 0.12
    const tax = grossSalary * 0.08
    const deductions = pf + tax
    const netSalary = grossSalary - deductions
    
    structures.push({
      id: generateId(),
      empId: generateEmpCode(Math.floor(Math.random() * 200) + 1),
      baseSalary: Math.round(baseSalary),
      hra: Math.round(hra),
      da: Math.round(da),
      allowances: Math.round(Math.random() * 20000),
      grossSalary: Math.round(grossSalary),
      pf: Math.round(pf),
      tax: Math.round(tax),
      insurance: Math.round(Math.random() * 5000),
      deductions: Math.round(deductions),
      netSalary: Math.round(netSalary),
      effectiveFrom: generateRandomDate(365),
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }
  
  return structures
}

export function generateDemoPayslips(count: number = 150): HrmPayslip[] {
  const payslips: HrmPayslip[] = []
  
  for (let i = 0; i < count; i++) {
    const baseSalary = 200000 + Math.random() * 400000
    const hra = baseSalary * 0.15
    const da = baseSalary * 0.1
    const grossSalary = baseSalary + hra + da
    const pf = grossSalary * 0.12
    const tax = grossSalary * 0.08
    const deductions = pf + tax
    const netSalary = grossSalary - deductions
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const month = months[Math.floor(Math.random() * months.length)]
    const year = 2024 + Math.floor(Math.random() * 2)
    
    payslips.push({
      id: generateId(),
      payslipNo: generatePayslipNo(i + 1),
      empId: generateEmpCode(Math.floor(Math.random() * 200) + 1),
      monthYear: `${month} ${year}`,
      baseSalary: Math.round(baseSalary),
      allowances: Math.round(Math.random() * 30000),
      grossSalary: Math.round(grossSalary),
      deductions: Math.round(deductions),
      netSalary: Math.round(netSalary),
      generatedDate: generateRandomDate(90),
      status: Math.random() > 0.3 ? 'Released' : 'Generated',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }
  
  return payslips
}

export const DEMO_HRM_EMPLOYEES = generateDemoEmployees()
export const DEMO_HRM_DEPARTMENTS = generateDemoDepartments()
export const DEMO_HRM_DESIGNATIONS = generateDemoDesignations()
export const DEMO_HRM_ATTENDANCE = generateDemoAttendance()
export const DEMO_HRM_LEAVE_APPLICATIONS = generateDemoLeaveApplications()
export const DEMO_HRM_SALARY_STRUCTURES = generateDemoSalaryStructures()
export const DEMO_HRM_PAYSLIPS = generateDemoPayslips()
