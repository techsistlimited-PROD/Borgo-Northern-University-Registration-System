import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FinanceSidebar from '@/components/finance/FinanceSidebar'
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
import FinesHolds from '@/components/finance/FinesHolds'
import { seedFinanceData } from '@/finance/data/seedFinance'

export default function FinanceDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const navigate = useNavigate()

  useEffect(() => {
    seedFinanceData()
    const token = localStorage.getItem('finance-token')
    if (!token) {
      navigate('/finance-login')
    }
  }, [navigate])

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <FinanceDashboardView />
      case 'Search Student / Ledger':
        return <StudentLedger />
      case 'Student Payables':
        return <StudentPayablesView />
      case 'Bulk Late Fee Assignment':
        return <LateFeeAssignmentView />
      case 'Drop/Re-admission Fees':
        return <DropReadmissionView />
      case 'Collect Payment':
        return <PaymentCollectionView />
      case 'Payment Records':
        return <PaymentRecordsView />
      case 'Waiver & Scholarship':
        return <WaiverAssignmentView />
      case 'Fines & Holds':
        return <FinesHolds />
      case 'Bank Reconciliation':
        return <BankReconciliationView />
      case 'Cost Heads':
        return <CostHeadSetup />
      case 'Cost Packages':
        return <CostPackageWizard />
      case 'Employee Notices':
        return <EmployeeNoticesView />
      case 'Finance Reports':
        return <FinanceReportsView />
      default:
        return <FinanceDashboardView />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <FinanceSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  )
}
