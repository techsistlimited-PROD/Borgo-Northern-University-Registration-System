import { Repo } from '@/lib/repo'
import {
  costHeadsSeed,
  costPackagesSeed,
  studentBillsSeed,
  paymentsSeed,
  waiverPoliciesSeed,
  waiverAssignmentsSeed,
  lateFeePoliciesSeed,
  dropReadmissionPoliciesSeed,
  employeeNoticesSeed,
  bankStatementsSeed
} from './seedData'

export const seedFinanceData = () => {
  Repo.seedOnceDemo('finance-all', () => {
    Repo.set('finance-cost-heads', costHeadsSeed)
    Repo.set('finance-cost-packages', costPackagesSeed)
    Repo.set('finance-student-bills', studentBillsSeed)
    Repo.set('finance-payments', paymentsSeed)
    Repo.set('finance-waiver-policies', waiverPoliciesSeed)
    Repo.set('finance-waiver-assignments', waiverAssignmentsSeed)
    Repo.set('finance-late-fee-policies', lateFeePoliciesSeed)
    Repo.set('finance-drop-readmission-policies', dropReadmissionPoliciesSeed)
    Repo.set('finance-employee-notices', employeeNoticesSeed)
    Repo.set('finance-bank-statements', bankStatementsSeed)
    Repo.set('finance-student-ledger', [])
    
    console.log('✅ Finance data seeded successfully')
  })
}
