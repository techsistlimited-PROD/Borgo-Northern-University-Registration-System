import { Repo } from '@/lib/repo'
import {
  costHeadsStatic,
  costPackagesStatic,
  paymentsStatic,
  refundsStatic,
  finesStatic,
  holdsStatic,
  ledgerEntriesStatic,
  bankStatementsStatic,
  waiverPoliciesStatic,
  waiverAssignmentsStatic,
  unregisteredStudentsStatic
} from './staticSeeds'
import {
  studentBillsSeed,
  lateFeePoliciesSeed,
  dropReadmissionPoliciesSeed,
  employeeNoticesSeed
} from './seedData'

export const seedFinanceData = () => {
  // Force clear old seed flag to allow re-seeding with updated data
  localStorage.removeItem('nu-erp-demo-seeded-finance-all')

  Repo.seedOnceDemo('finance-all', () => {
    Repo.set('finance-cost-heads', costHeadsStatic)
    Repo.set('finance-cost-packages', costPackagesStatic)
    Repo.set('finance-student-bills', studentBillsSeed)
    Repo.set('finance-payments', paymentsStatic)
    Repo.set('finance-payment-refunds', refundsStatic)
    Repo.set('finance-student-fines', finesStatic)
    Repo.set('finance-student-holds', holdsStatic)
    Repo.set('finance-student-ledger', ledgerEntriesStatic)
    Repo.set('finance-bank-statements', bankStatementsStatic)
    Repo.set('finance-waiver-policies', waiverPoliciesStatic)
    Repo.set('finance-waiver-assignments', waiverAssignmentsStatic)
    Repo.set('finance-unregistered-students', unregisteredStudentsStatic)
    Repo.set('finance-late-fee-policies', lateFeePoliciesSeed)
    Repo.set('finance-drop-readmission-policies', dropReadmissionPoliciesSeed)
    Repo.set('finance-employee-notices', employeeNoticesSeed)

    console.log('✅ Finance data seeded with expanded datasets:')
    console.log(`   - Cost Heads: ${costHeadsStatic.length}`)
    console.log(`   - Cost Packages: ${costPackagesStatic.length}`)
    console.log(`   - Student Bills: ${studentBillsSeed.length}`)
    console.log(`   - Payments: ${paymentsStatic.length}`)
    console.log(`   - Refunds: ${refundsStatic.length}`)
    console.log(`   - Fines: ${finesStatic.length}`)
    console.log(`   - Holds: ${holdsStatic.length}`)
    console.log(`   - Ledger Entries: ${ledgerEntriesStatic.length}`)
    console.log(`   - Bank Statements: ${bankStatementsStatic.length}`)
  })
}
