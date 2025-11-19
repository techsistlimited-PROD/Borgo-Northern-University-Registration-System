import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import FinanceSidebar from '@/components/finance/FinanceSidebar'
import FinanceLayout from '@/components/finance/FinanceLayout'
import FinanceDashboardView from '@/components/finance/FinanceDashboard'
import StudentLedger from '@/components/finance/StudentLedger'
import CostHeadSetup from '@/finance/views/CostHeadSetup'
import CostPackageWizard from '@/finance/views/CostPackageWizard'
import StudentPayablesView from '@/finance/views/StudentPayablesView'
import LateFeeAssignmentView from '@/finance/views/LateFeeAssignmentView'
import PaymentCollectionView from '@/finance/views/PaymentCollectionView'
import PaymentRecordsView from '@/finance/views/PaymentRecordsView'
import DropReadmissionView from '@/finance/views/DropReadmissionView'
import WaiverAssignmentView from '@/finance/views/WaiverAssignmentView'
import EmployeeNoticesView from '@/finance/views/EmployeeNoticesView'
import BankReconciliationView from '@/finance/views/BankReconciliationView'
import FinanceReportsView from '@/finance/views/FinanceReportsView'
import FinanceDemoView from '@/finance/views/FinanceDemoView'
import FinesHolds from '@/components/finance/FinesHolds'
import { seedFinanceData } from '@/finance/data/seedFinance'
import { FinanceFilterProvider } from '@/contexts/FinanceFilterContext'

export default function FinanceDashboard() {
  useEffect(() => {
    seedFinanceData()
  }, [])

  return (
    <FinanceFilterProvider>
      <div className="flex h-screen bg-gray-50">
        <FinanceSidebar />
        <Routes>
          {/* Dashboard */}
          <Route path="dashboard" element={
            <FinanceLayout>
              <FinanceDashboardView />
            </FinanceLayout>
          } />

          {/* Student Accounts */}
          <Route path="student-ledger" element={
            <FinanceLayout showGlobalFilter>
              <StudentLedger />
            </FinanceLayout>
          } />

          {/* Billing */}
          <Route path="payables" element={
            <FinanceLayout showGlobalFilter>
              <StudentPayablesView />
            </FinanceLayout>
          } />

          <Route path="late-fee" element={
            <FinanceLayout showGlobalFilter>
              <LateFeeAssignmentView />
            </FinanceLayout>
          } />

          <Route path="drop-readmission" element={
            <FinanceLayout showGlobalFilter>
              <DropReadmissionView />
            </FinanceLayout>
          } />

          {/* Payments */}
          <Route path="collect-payment" element={
            <FinanceLayout showGlobalFilter>
              <PaymentCollectionView />
            </FinanceLayout>
          } />

          <Route path="payment-records" element={
            <FinanceLayout showGlobalFilter>
              <PaymentRecordsView />
            </FinanceLayout>
          } />

          {/* Waiver & Scholarship */}
          <Route path="waivers" element={
            <FinanceLayout>
              <WaiverAssignmentView />
            </FinanceLayout>
          } />

          {/* Fines & Holds */}
          <Route path="fines-holds" element={
            <FinanceLayout>
              <FinesHolds />
            </FinanceLayout>
          } />

          {/* Bank Reconciliation */}
          <Route path="bank-recon" element={
            <FinanceLayout>
              <BankReconciliationView />
            </FinanceLayout>
          } />

          {/* Reports */}
          <Route path="reports" element={
            <FinanceLayout showGlobalFilter>
              <FinanceReportsView />
            </FinanceLayout>
          } />

          {/* Employees */}
          <Route path="employee-notices" element={
            <FinanceLayout>
              <EmployeeNoticesView />
            </FinanceLayout>
          } />

          {/* Setup */}
          <Route path="setup/cost-heads" element={
            <FinanceLayout>
              <CostHeadSetup />
            </FinanceLayout>
          } />

          <Route path="setup/cost-packages" element={
            <FinanceLayout>
              <CostPackageWizard />
            </FinanceLayout>
          } />

          {/* Demo */}
          <Route path="demo" element={
            <FinanceLayout>
              <FinanceDemoView />
            </FinanceLayout>
          } />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/finance/dashboard" replace />} />
        </Routes>
      </div>
    </FinanceFilterProvider>
  )
}
