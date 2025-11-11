import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Eye, Download, Users, UserCheck, UserX } from 'lucide-react'
import { HRM_EMPLOYEES } from '@/lib/hrmStatic'
import { DEMO_MODE, showDemoToast } from '@/config/demo'

interface HRMEmployeeListProps {
  onNavigate?: (path: string) => void
}

export default function HRMEmployeeList({ onNavigate }: HRMEmployeeListProps = {}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDept, setFilterDept] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const handleExportCSV = () => {
    if (DEMO_MODE) {
      alert(showDemoToast('Export employee list as CSV'))
      return
    }

    const csvHeaders = ['Employee ID', 'Name', 'Department', 'Designation', 'Type', 'Grade', 'Status']
    const csvRows = filteredEmployees.map(emp => [
      emp.id,
      emp.name,
      emp.department,
      emp.designation,
      emp.type,
      emp.grade,
      emp.status
    ])

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `employee-list-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const filteredEmployees = HRM_EMPLOYEES.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = !filterDept || emp.department === filterDept
    const matchesType = !filterType || emp.type === filterType
    const matchesStatus = !filterStatus || emp.status === filterStatus
    
    return matchesSearch && matchesDept && matchesType && matchesStatus
  })

  const activeCount = HRM_EMPLOYEES.filter(e => e.status === 'Active').length
  const onLeaveCount = HRM_EMPLOYEES.filter(e => e.status === 'On Leave').length
  const resignedCount = HRM_EMPLOYEES.filter(e => e.status === 'Resigned').length

  const departments = [...new Set(HRM_EMPLOYEES.map(e => e.department))]

  const handleViewProfile = (empId: string) => {
    if (onNavigate) {
      onNavigate(`/hrm/employees/view/${empId}`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default'
      case 'On Leave': return 'secondary'
      case 'Resigned': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-3xl font-bold text-green-600">{activeCount}</p>
              </div>
              <UserCheck className="w-10 h-10 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On Leave</p>
                <p className="text-3xl font-bold text-yellow-600">{onLeaveCount}</p>
              </div>
              <Users className="w-10 h-10 text-yellow-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resigned</p>
                <p className="text-3xl font-bold text-red-600">{resignedCount}</p>
              </div>
              <UserX className="w-10 h-10 text-red-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-3xl font-bold text-blue-600">{HRM_EMPLOYEES.length}</p>
              </div>
              <Users className="w-10 h-10 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Master List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Types</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Resigned">Resigned</option>
              <option value="Retired">Retired</option>
            </select>

            <Button variant="outline" className="flex items-center space-x-2" onClick={handleExportCSV}>
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>
          </div>

          {/* Employee Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Employee ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Department</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Designation</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Grade</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{emp.id}</td>
                    <td className="px-4 py-3 text-sm">{emp.name}</td>
                    <td className="px-4 py-3 text-sm">{emp.department}</td>
                    <td className="px-4 py-3 text-sm">{emp.designation}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant="outline">{emp.type}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">{emp.grade}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant={getStatusColor(emp.status)}>{emp.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleViewProfile(emp.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredEmployees.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No employees found matching your criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
