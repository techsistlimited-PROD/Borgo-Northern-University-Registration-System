export type CostHeadType = 'Admission' | 'Tuition' | 'Registration' | 'Lab' | 'Library' | 'Exam' | 'Penalty' | 'Others'
export type CostHeadStatus = 'Active' | 'Inactive'
export type FeeMode = 'Flat' | 'Per Credit' | 'Per Course'
export type PaymentMethod = 'Cash' | 'Bank' | 'bKash' | 'Card' | 'SSLCommerz' | 'DBBL Nexus'
export type BillStatus = 'Draft' | 'Issued' | 'Partial' | 'Paid' | 'Overdue'
export type PaymentStatus = 'Pending' | 'Completed' | 'Failed' | 'Refunded'
export type NoticeCategory = 'HR' | 'Accounts' | 'General'

export interface CostHead {
  id: string
  code: string
  serialNo: number
  name: string
  type: CostHeadType
  glAccount: string
  taxable: boolean
  status: CostHeadStatus
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CostPackageComponent {
  id: string
  costHeadCode: string
  mode: FeeMode
  rate: number
  minCap?: number
  maxCap?: number
  order: number
}

export interface WaiverRule {
  id: string
  policyCode: string
  percentCap: number
  allowBillOverride: boolean
}

export interface CostPackage {
  id: string
  programNo: string
  name: string
  campus: string
  program: string
  semesterFrom: string
  semesterTo: string
  currency: string
  isForeign: boolean
  activeFrom: string
  activeTo: string
  remarks?: string
  components: CostPackageComponent[]
  waiverRules: WaiverRule[]
  status: 'Active' | 'Inactive'
  createdAt: string
  updatedAt: string
}

export interface BillLineItem {
  id: string
  costHeadCode: string
  costHeadName: string
  mode: FeeMode
  quantity: number
  rate: number
  subtotal: number
  waiverPercent: number
  scholarshipPercent: number
  deduction: number
  netAmount: number
  notes?: string
}

export interface StudentBill {
  id: string
  billNo: string
  studentId: string
  studentName: string
  program: string
  campus: string
  semester: string
  billDate: string
  dueDate: string
  lineItems: BillLineItem[]
  grossTotal: number
  waiverTotal: number
  scholarshipTotal: number
  deductionTotal: number
  netTotal: number
  paidAmount: number
  balanceDue: number
  status: BillStatus
  packageId?: string
  createdAt: string
  updatedAt: string
}

export interface PaymentAllocation {
  billId: string
  billNo: string
  allocatedAmount: number
}

export interface Payment {
  id: string
  receiptNo: string
  studentId: string
  studentName: string
  program: string
  campus: string
  semester: string
  paymentDate: string
  paymentTime: string
  totalAmount: number
  method: PaymentMethod
  allocations: PaymentAllocation[]
  collectedBy: string
  status: PaymentStatus
  transactionRef?: string
  notes?: string
  bankName?: string
  branchName?: string
  purpose?: string
  createdAt: string
}

export interface LateFeeRule {
  id: string
  name: string
  threshold: number
  feeType: 'Flat' | 'Percent'
  feeAmount: number
  order: number
}

export interface LateFeePolicy {
  id: string
  name: string
  rules: LateFeeRule[]
  costHeadCode: string
  active: boolean
  createdAt: string
}

export interface DropReadmissionPolicy {
  id: string
  systemType: 'Tri-semester' | 'Bi-semester'
  dropFee: number
  readmissionFee: number
  absentThreshold: number
  dropCostHeadCode: string
  readmissionCostHeadCode: string
}

export interface WaiverPolicy {
  id: string
  code: string
  name: string
  percentCap: number
  description?: string
  active: boolean
}

export interface WaiverAssignment {
  id: string
  studentId: string
  studentName: string
  policyCode: string
  policyName: string
  percent: number
  effectiveTerm: string
  locked: boolean
  assignedBy: string
  assignedDate: string
}

export interface EmployeeNotice {
  id: string
  title: string
  category: NoticeCategory
  publishedDate: string
  content: string
  attachments?: string[]
  isNew: boolean
}

export interface BankStatement {
  id: string
  date: string
  reference: string
  amount: number
  matched: boolean
  matchedReceiptNo?: string
  notes?: string
}

export interface StudentLedgerEntry {
  id: string
  studentId: string
  date: string
  type: 'Bill' | 'Payment' | 'Adjustment' | 'Refund' | 'Fine'
  reference: string
  description: string
  debit: number
  credit: number
  runningBalance: number
}

export interface PaymentRefund {
  id: string
  refundNo: string
  refundDate: string
  studentId: string
  studentName: string
  program: string
  semester: string
  originalReceiptNo: string
  originalAmount: number
  refundAmount: number
  refundMethod: 'Cash' | 'Bank' | 'Mobile Banking'
  remarks?: string
  inWords: string
  bankName?: string
  branchName?: string
  allocations: PaymentAllocation[]
  createdAt: string
  createdBy: string
}

export interface StudentFine {
  id: string
  studentId: string
  studentName?: string
  fineType: 'Late Fine' | 'Library Fine' | 'Exam Fine' | 'Misc Fine'
  amount: number
  date: string
  remarks?: string
  createdBy: string
}

export interface StudentHold {
  id: string
  studentId: string
  studentName?: string
  holdType: 'Finance Hold' | 'Registration Hold' | 'Exam Hold'
  reason: string
  date: string
  status: 'Active' | 'Removed'
  createdBy: string
  removedDate?: string
  removedBy?: string
}
