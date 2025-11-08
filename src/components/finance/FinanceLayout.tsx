import { ReactNode } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Home, BarChart3, User, Search } from 'lucide-react'
import { useFinanceFilters } from '@/contexts/FinanceFilterContext'

interface FinanceLayoutProps {
  children: ReactNode
  showGlobalFilter?: boolean
}

const routeNameMap: Record<string, string> = {
  '/finance/dashboard': 'Dashboard',
  '/finance/student-ledger': 'Student Ledger',
  '/finance/payables': 'Students Payable',
  '/finance/late-fee': 'Assign Late Fee',
  '/finance/drop-readmission': 'Drop/Re-admission Fees',
  '/finance/collect-payment': 'Create Students Payment',
  '/finance/payment-records': 'Payment Records',
  '/finance/waivers': 'Waiver & Scholarship',
  '/finance/fines-holds': 'Fines & Holds',
  '/finance/bank-recon': 'Bank Reconciliation',
  '/finance/reports': 'Finance Reports',
  '/finance/employee-notices': 'Employee Notices',
  '/finance/setup/cost-heads': 'Cost Heads',
  '/finance/setup/cost-packages': 'Cost Packages'
}

export default function FinanceLayout({ children, showGlobalFilter = false }: FinanceLayoutProps) {
  const location = useLocation()
  const { filters, setFilters } = useFinanceFilters()

  const currentPageName = routeNameMap[location.pathname] || 'Dashboard'

  const semesters = ['Spring 2025', 'Fall 2025', 'Summer 2025', 'Spring 2024', 'Fall 2024']
  const campuses = ['All', 'Main Campus', 'Permanent Campus', 'Uttara Campus', 'Banasree Campus']
  const programs = ['All', 'CSE', 'BBA', 'LLB', 'MBA', 'EEE', 'Civil', 'English', 'BANG', 'BPharm']

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Top Bar */}
      <div className="bg-white border-b shadow-sm">
        {/* Breadcrumb + Icons */}
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-deep-plum transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <span>/</span>
            <span className="text-gray-400">Student Finance</span>
            <span>/</span>
            <span className="text-deep-plum font-medium">{currentPageName}</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Analytics">
              <BarChart3 className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Profile">
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Global Filter Bar */}
        {showGlobalFilter && (
          <div className="bg-gray-50 border-t px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Semester</label>
                  <select
                    value={filters.semester}
                    onChange={(e) => setFilters({ semester: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  >
                    {semesters.map(sem => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Annex/Campus</label>
                  <select
                    value={filters.campus}
                    onChange={(e) => setFilters({ campus: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  >
                    {campuses.map(campus => (
                      <option key={campus} value={campus}>{campus}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Program</label>
                  <select
                    value={filters.program}
                    onChange={(e) => setFilters({ program: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  >
                    {programs.map(prog => (
                      <option key={prog} value={prog}>{prog}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Student Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      value={filters.studentSearch}
                      onChange={(e) => setFilters({ studentSearch: e.target.value })}
                      placeholder="ID or Name"
                      className="pl-10 text-sm"
                    />
                  </div>
                </div>
              </div>

              <Button className="mt-5 nu-button-primary">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
