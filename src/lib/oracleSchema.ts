// Oracle Database Schema Entity Types
// Based on the FK relationships from the ERP system

// Common/Core Entities
export interface CmnCoreOrg {
  id: string
  orgCode: string
  orgName: string
  orgType: string
  parentOrgId?: string
  status: 'Active' | 'Inactive'
  createdAt: string
  updatedAt: string
}

export interface CmnCorePerson {
  id: string
  personCode: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  status: 'Active' | 'Inactive'
  createdAt: string
  updatedAt: string
}

export interface CmnAclUser {
  id: string
  username: string
  email?: string
  fullName: string
  password: string
  status: 'Active' | 'Inactive'
  createdBySessionId?: string
  createdAt: string
  lastUpdatedBySessionId?: string
  lastUpdatedAt: string
  createdByUserId?: string
  lastUpdatedByUserId?: string
}

export interface CmnLogAccess {
  id: string
  sessionId: string
  userId: string
  loginTime: string
  logoutTime?: string
  ipAddress?: string
  userAgent?: string
  status: 'Active' | 'Closed'
}

export interface CmnAclRole {
  id: string
  roleName: string
  description?: string
  status: 'Active' | 'Inactive'
  createdBySessionId?: string
  createdAt: string
  lastUpdatedBySessionId?: string
  lastUpdatedAt: string
  createdByUserId?: string
  lastUpdatedByUserId?: string
}

export interface CmnAclMenu {
  id: string
  menuName: string
  menuUrl?: string
  displayOrder: number
  parentMenuId?: string
  status: 'Active' | 'Inactive'
  createdBySessionId?: string
  createdAt: string
  lastUpdatedBySessionId?: string
  lastUpdatedAt: string
  createdByUserId?: string
  lastUpdatedByUserId?: string
}

export interface CmnAclActionPair {
  id: string
  actionCode: string
  actionName: string
  description?: string
  createdBySessionId?: string
  createdAt: string
  lastUpdatedBySessionId?: string
  lastUpdatedAt: string
  createdByUserId?: string
  lastUpdatedByUserId?: string
}

export interface CmnAclRoleTask {
  id: string
  roleId: string
  menuTaskId: string
  createdBySessionId?: string
  createdAt: string
  lastUpdatedBySessionId?: string
  lastUpdatedAt: string
  createdByUserId?: string
  lastUpdatedByUserId?: string
}

export interface CmnAclUserTask {
  id: string
  userId: string
  menuTaskId: string
  roleId?: string
  createdBySessionId?: string
  createdAt: string
  lastUpdatedBySessionId?: string
  lastUpdatedAt: string
  createdByUserId?: string
  lastUpdatedByUserId?: string
}

export interface CmnAclPersonUserType {
  id: string
  personId: string
  userId: string
  orgId: string
  userType: string
  createdByUserId?: string
  lastUpdatedByUserId?: string
  createdAt: string
  lastUpdatedAt: string
}

// Approval Workflow Entities
export interface CmnApvApvblItem {
  id: string
  itemCode: string
  itemType: string
  description?: string
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected'
  createdBySessionId?: string
  createdAt: string
  lastUpdatedBySessionId?: string
  lastUpdatedAt: string
  createdByUserId?: string
  lastUpdatedByUserId?: string
}

export interface CmnApvApvbdItemDtl {
  id: string
  itemId: string
  itemDetail: string
  approvedByUserId?: string
  approvedByEmployeeId?: string
  approvalDate?: string
  createdBySessionId?: string
  createdAt: string
  lastUpdatedBySessionId?: string
  lastUpdatedAt: string
  createdByUserId?: string
  lastUpdatedByUserId?: string
}

export interface CmnApvApvbngAuth {
  id: string
  approvableItemId: string
  authName: string
  authLevel: number
  status: 'Active' | 'Inactive'
  createdBySessionId?: string
  createdAt: string
  lastUpdatedBySessionId?: string
  lastUpdatedAt: string
  createdByUserId?: string
  lastUpdatedByUserId?: string
}

export interface CmnApvApvbngAuthDtl {
  id: string
  approvingAuthorityId: string
  authorizedEmployeeId: string
  designationId: string
  effectiveFrom: string
  effectiveTo?: string
  createdBySessionId?: string
  createdAt: string
  lastUpdatedBySessionId?: string
  lastUpdatedAt: string
  createdByUserId?: string
  lastUpdatedByUserId?: string
}

// Accounting Entities
export interface AccStpAccPeriod {
  id: string
  periodCode: string
  periodName: string
  fiscalYear: string
  startDate: string
  endDate: string
  status: 'Open' | 'Closed' | 'Archived'
  orgId: string
  createdBySessionId?: string
  createdAt: string
  lastUpdatedBySessionId?: string
  lastUpdatedAt: string
  createdByUserId?: string
  lastUpdatedByUserId?: string
}

export interface AccStpCoa {
  id: string
  accountCode: string
  accountName: string
  accountType: string
  parentAccountId?: string
  status: 'Active' | 'Inactive'
  orgId: string
  createdBySessionId?: string
  createdAt: string
  lastUpdatedBySessionId?: string
  lastUpdatedAt: string
  createdByUserId?: string
  lastUpdatedByUserId?: string
}

export interface AccStpCostCenter {
  id: string
  costCenterCode: string
  costCenterName: string
  description?: string
  status: 'Active' | 'Inactive'
  orgId: string
  createdBySessionId?: string
  createdAt: string
  lastUpdatedBySessionId?: string
  lastUpdatedAt: string
  createdByUserId?: string
  lastUpdatedByUserId?: string
}

export interface AccFaDeprMethod {
  id: string
  methodCode: string
  methodName: string
  description?: string
  status: 'Active' | 'Inactive'
  createdBySessionId?: string
  createdAt: string
  lastUpdatedBySessionId?: string
  lastUpdatedAt: string
}

export interface AccFaDeprSched {
  id: string
  schedCode: string
  schedName: string
  description?: string
  status: 'Active' | 'Inactive'
  createdBySessionId?: string
  createdAt: string
  lastUpdatedBySessionId?: string
  lastUpdatedAt: string
}

export interface AccPcExpense {
  id: string
  expenseCode: string
  expenseDate: string
  costCenterId: string
  employeeId: string
  amount: number
  description?: string
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected'
  orgId: string
  createdBySessionId?: string
  createdAt: string
  lastUpdatedBySessionId?: string
  lastUpdatedAt: string
  createdByUserId?: string
  lastUpdatedByUserId?: string
}

export interface AccPcExpenseDtl {
  id: string
  expenseId: string
  itemId: string
  unitId: string
  quantity: number
  rate: number
  amount: number
  description?: string
  createdBySessionId?: string
  createdAt: string
  lastUpdatedBySessionId?: string
  lastUpdatedAt: string
  createdByUserId?: string
  lastUpdatedByUserId?: string
}

export interface AccPcPcReq {
  id: string
  reqCode: string
  reqDate: string
  costCenterId: string
  employeeId: string
  orgId: string
  description?: string
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected'
  createdBySessionId?: string
  createdAt: string
  lastUpdatedBySessionId?: string
  lastUpdatedAt: string
  createdByUserId?: string
  lastUpdatedByUserId?: string
}

export interface AccPcPcResEmp {
  id: string
  costCenterId: string
  employeeId: string
  description?: string
  createdBySessionId?: string
  createdAt: string
  lastUpdatedBySessionId?: string
  lastUpdatedAt: string
  createdByUserId?: string
  lastUpdatedByUserId?: string
}

export interface AccPcPcStp {
  id: string
  costCenterId: string
  costStep: string
  amount: number
  description?: string
  status: 'Active' | 'Inactive'
  orgId: string
  createdBySessionId?: string
  createdAt: string
  lastUpdatedBySessionId?: string
  lastUpdatedAt: string
  createdByUserId?: string
  lastUpdatedByUserId?: string
}

// HRM Entities
export interface HrmEiEmp {
  id: string
  empCode: string
  empName: string
  empEmail?: string
  empPhone?: string
  dateOfJoining: string
  dateOfBirth?: string
  gender?: string
  status: 'Active' | 'Inactive' | 'On Leave' | 'Resigned'
  designation?: string
  department?: string
  createdAt: string
  updatedAt: string
}

export interface HrmStpDesig {
  id: string
  designationCode: string
  designationName: string
  description?: string
  status: 'Active' | 'Inactive'
  createdAt: string
  updatedAt: string
}

export interface HrmStpDept {
  id: string
  departmentCode: string
  departmentName: string
  description?: string
  status: 'Active' | 'Inactive'
  createdAt: string
  updatedAt: string
}

export interface HrmAttendance {
  id: string
  empId: string
  attendanceDate: string
  status: 'Present' | 'Absent' | 'Leave' | 'Half Day'
  checkInTime?: string
  checkOutTime?: string
  remarks?: string
  createdAt: string
  updatedAt: string
}

export interface HrmLeaveApplication {
  id: string
  empId: string
  leaveType: string
  fromDate: string
  toDate: string
  noOfDays: number
  reason?: string
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected'
  approvedBy?: string
  approvalDate?: string
  createdAt: string
  updatedAt: string
}

export interface HrmSalaryStructure {
  id: string
  empId: string
  basesal: number
  allowances: number
  deductions: number
  grossSalary: number
  netSalary: number
  effectiveFrom: string
  effectiveTo?: string
  status: 'Active' | 'Inactive'
  createdAt: string
  updatedAt: string
}

export interface HrmPayroll {
  id: string
  empId: string
  payPeriod: string
  grossSalary: number
  totalAllowances: number
  totalDeductions: number
  netSalary: number
  status: 'Draft' | 'Processed' | 'Approved' | 'Paid'
  paidDate?: string
  createdAt: string
  updatedAt: string
}

export interface HrmPayslip {
  id: string
  payrollId: string
  empId: string
  payPeriod: string
  basicSalary: number
  allowances: number
  deductions: number
  grossSalary: number
  netSalary: number
  createdAt: string
}

// Inventory Entities
export interface InvStpItem {
  id: string
  itemCode: string
  itemName: string
  description?: string
  status: 'Active' | 'Inactive'
  createdAt: string
  updatedAt: string
}

export interface InvStpUnit {
  id: string
  unitCode: string
  unitName: string
  description?: string
  status: 'Active' | 'Inactive'
  createdAt: string
  updatedAt: string
}

// Academic Entities (based on views referenced)
export interface AcadStudent {
  id: string
  studentId: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  program: string
  campus: string
  enrollmentDate: string
  status: 'Active' | 'Inactive' | 'Graduated' | 'Suspended'
  createdAt: string
  updatedAt: string
}

export interface AcadCourse {
  id: string
  courseCode: string
  courseName: string
  credits: number
  semester: string
  campus?: string
  status: 'Active' | 'Inactive'
  createdAt: string
  updatedAt: string
}

export interface AcadEnrollment {
  id: string
  studentId: string
  courseId: string
  semester: string
  enrollmentDate: string
  status: 'Enrolled' | 'Dropped' | 'Completed'
  createdAt: string
  updatedAt: string
}

export interface AcadGrade {
  id: string
  enrollmentId: string
  studentId: string
  courseId: string
  semester: string
  marks: number
  grade: string
  gpa: number
  submissionDate: string
  status: 'Draft' | 'Submitted' | 'Approved'
  createdAt: string
  updatedAt: string
}

// Finance Entities
export interface FinanceCostHead {
  id: string
  costHeadCode: string
  costHeadName: string
  costHeadType: string
  glAccount?: string
  status: 'Active' | 'Inactive'
  createdAt: string
  updatedAt: string
}

export interface FinanceCostPackage {
  id: string
  packageCode: string
  packageName: string
  program: string
  campus: string
  semester: string
  currency: string
  status: 'Active' | 'Inactive'
  createdAt: string
  updatedAt: string
}

export interface FinanceBill {
  id: string
  billNo: string
  studentId: string
  billDate: string
  dueDate: string
  amount: number
  status: 'Draft' | 'Issued' | 'Partial' | 'Paid' | 'Overdue'
  createdAt: string
  updatedAt: string
}

export interface FinancePayment {
  id: string
  receiptNo: string
  billId: string
  paymentDate: string
  amount: number
  method: 'Cash' | 'Bank' | 'Mobile' | 'Card'
  status: 'Pending' | 'Completed' | 'Failed'
  createdAt: string
  updatedAt: string
}

export interface FinanceLateFee {
  id: string
  billId: string
  studentId: string
  feeAmount: number
  appliedDate: string
  status: 'Applied' | 'Waived' | 'Collected'
  createdAt: string
  updatedAt: string
}

export interface FinanceWaiver {
  id: string
  waiverCode: string
  waiverName: string
  percentCap: number
  status: 'Active' | 'Inactive'
  createdAt: string
  updatedAt: string
}

export interface FinanceWaiverAssignment {
  id: string
  studentId: string
  waiverId: string
  percentAmount: number
  effectiveFrom: string
  effectiveTo?: string
  status: 'Active' | 'Inactive'
  createdAt: string
  updatedAt: string
}

// Schema Aggregation Type
export type OracleEntity = 
  | CmnCoreOrg
  | CmnCorePerson
  | CmnAclUser
  | CmnLogAccess
  | CmnAclRole
  | CmnAclMenu
  | CmnAclActionPair
  | CmnAclRoleTask
  | CmnAclUserTask
  | CmnAclPersonUserType
  | CmnApvApvblItem
  | CmnApvApvbdItemDtl
  | CmnApvApvbngAuth
  | CmnApvApvbngAuthDtl
  | AccStpAccPeriod
  | AccStpCoa
  | AccStpCostCenter
  | AccFaDeprMethod
  | AccFaDeprSched
  | AccPcExpense
  | AccPcExpenseDtl
  | AccPcPcReq
  | AccPcPcResEmp
  | AccPcPcStp
  | HrmEiEmp
  | HrmStpDesig
  | HrmStpDept
  | HrmAttendance
  | HrmLeaveApplication
  | HrmSalaryStructure
  | HrmPayroll
  | HrmPayslip
  | InvStpItem
  | InvStpUnit
  | AcadStudent
  | AcadCourse
  | AcadEnrollment
  | AcadGrade
  | FinanceCostHead
  | FinanceCostPackage
  | FinanceBill
  | FinancePayment
  | FinanceLateFee
  | FinanceWaiver
  | FinanceWaiverAssignment
