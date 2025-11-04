import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, UserX, UserMinus, TrendingUp, Calendar } from 'lucide-react'
import { HRM_STATS, HRM_DEPT_DISTRIBUTION, HRM_EMPLOYEES } from '@/lib/hrmStatic'

export default function HRMDashboardView() {
  const upcomingJoining = HRM_EMPLOYEES
    .filter(e => new Date(e.joiningDate) > new Date())
    .sort((a, b) => new Date(a.joiningDate).getTime() - new Date(b.joiningDate).getTime())
    .slice(0, 5)

  const recentJoining = HRM_EMPLOYEES
    .filter(e => e.status === 'Active')
    .sort((a, b) => new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime())
    .slice(0, 5)

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Active Staff</p>
                <p className="text-4xl font-bold">{HRM_STATS.activeStaff}</p>
              </div>
              <UserCheck className="w-12 h-12 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">On Leave</p>
                <p className="text-4xl font-bold">{HRM_STATS.onLeave}</p>
              </div>
              <Calendar className="w-12 h-12 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Resigned</p>
                <p className="text-4xl font-bold">{HRM_STATS.resigned}</p>
              </div>
              <UserX className="w-12 h-12 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-500 to-gray-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Retired</p>
                <p className="text-4xl font-bold">{HRM_STATS.retired}</p>
              </div>
              <UserMinus className="w-12 h-12 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Staff by Department
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {HRM_DEPT_DISTRIBUTION.map(dept => (
                <div key={dept.department} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-32 font-medium text-gray-700">{dept.department}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all" 
                        style={{ width: `${(dept.count / HRM_STATS.totalStaff) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="font-semibold text-blue-600">{dept.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Joining */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Recent Joining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentJoining.length > 0 ? (
                recentJoining.map(emp => (
                  <div key={emp.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <div className="font-medium text-gray-900">{emp.name}</div>
                      <div className="text-sm text-gray-600">{emp.designation} • {emp.department}</div>
                    </div>
                    <div className="text-sm text-gray-500">{emp.joiningDate}</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent joining</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Total Staff Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Total Staff Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{HRM_STATS.totalStaff}</p>
              <p className="text-sm text-gray-600 mt-1">Total Staff</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{HRM_EMPLOYEES.filter(e => e.type === 'Teacher').length}</p>
              <p className="text-sm text-gray-600 mt-1">Teachers</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">{HRM_EMPLOYEES.filter(e => e.type === 'Admin').length}</p>
              <p className="text-sm text-gray-600 mt-1">Admin Staff</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <p className="text-3xl font-bold text-amber-600">{HRM_EMPLOYEES.filter(e => e.employmentType === 'Permanent').length}</p>
              <p className="text-sm text-gray-600 mt-1">Permanent</p>
            </div>
            <div className="text-center p-4 bg-cyan-50 rounded-lg">
              <p className="text-3xl font-bold text-cyan-600">{HRM_EMPLOYEES.filter(e => e.employmentType === 'Contractual').length}</p>
              <p className="text-sm text-gray-600 mt-1">Contractual</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
