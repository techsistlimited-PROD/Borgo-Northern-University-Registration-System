import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Eye } from 'lucide-react'
import { HRM_LEAVE_BALANCES, HRM_LEAVE_APPLICATIONS, type LeaveBalance } from '@/lib/hrmStatic'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function LeaveBalances() {
  const [selectedDept, setSelectedDept] = useState('all')
  const [selectedEmpType, setSelectedEmpType] = useState('all')
  const [selectedCampus, setSelectedCampus] = useState('all')
  const [viewHistoryEmp, setViewHistoryEmp] = useState<string | null>(null)

  const filteredBalances = HRM_LEAVE_BALANCES.filter(bal => {
    if (selectedDept !== 'all' && bal.dept !== selectedDept) return false
    return true
  })

  const chartData = selectedDept !== 'all' 
    ? filteredBalances.map(bal => ({
        name: bal.name.split(' ')[0],
        Casual: bal.casual,
        Medical: bal.medical,
        Earn: bal.earn,
        Special: bal.special
      }))
    : [
        { name: 'Casual', Used: 45, Remaining: 135 },
        { name: 'Medical', Used: 28, Remaining: 212 },
        { name: 'Earn', Used: 67, Remaining: 313 },
        { name: 'Special', Used: 12, Remaining: 108 }
      ]

  const empHistory = viewHistoryEmp 
    ? HRM_LEAVE_APPLICATIONS.filter(app => app.empId === viewHistoryEmp && app.status === 'Approved')
    : []

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Leave Balances</h2>
          <p className="text-gray-600">Track employee leave entitlements and utilization</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Department</label>
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="BBA">BBA</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Accounts">Accounts</SelectItem>
                  <SelectItem value="Library">Library</SelectItem>
                  <SelectItem value="Admission">Admission</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Employment Type</label>
              <Select value={selectedEmpType} onValueChange={setSelectedEmpType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Permanent">Permanent</SelectItem>
                  <SelectItem value="Contractual">Contractual</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Campus</label>
              <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campuses</SelectItem>
                  <SelectItem value="Permanent">Permanent Campus</SelectItem>
                  <SelectItem value="Banani">Banani Campus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDept === 'all' ? 'Overall Leave Balance' : `${selectedDept} Department Leave Balance`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedDept === 'all' ? (
                <>
                  <Bar dataKey="Used" fill="#ef4444" stackId="a" />
                  <Bar dataKey="Remaining" fill="#22c55e" stackId="a" />
                </>
              ) : (
                <>
                  <Bar dataKey="Casual" fill="#3b82f6" />
                  <Bar dataKey="Medical" fill="#8b5cf6" />
                  <Bar dataKey="Earn" fill="#f59e0b" />
                  <Bar dataKey="Special" fill="#ec4899" />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employee Leave Balances ({filteredBalances.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emp ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dept</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Casual</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medical</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Earn</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Special</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Used</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remaining</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBalances.map((balance) => (
                  <tr key={balance.empId}>
                    <td className="px-4 py-3 text-sm text-gray-600">{balance.empId}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{balance.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{balance.dept}</td>
                    <td className="px-4 py-3 text-sm text-blue-600 font-semibold">{balance.casual}</td>
                    <td className="px-4 py-3 text-sm text-purple-600 font-semibold">{balance.medical}</td>
                    <td className="px-4 py-3 text-sm text-orange-600 font-semibold">{balance.earn}</td>
                    <td className="px-4 py-3 text-sm text-pink-600 font-semibold">{balance.special}</td>
                    <td className="px-4 py-3 text-sm text-red-600 font-semibold">{balance.used}</td>
                    <td className="px-4 py-3 text-sm text-green-600 font-semibold">{balance.remaining}</td>
                    <td className="px-4 py-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setViewHistoryEmp(balance.empId)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View History
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!viewHistoryEmp} onOpenChange={() => setViewHistoryEmp(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Leave History</DialogTitle>
          </DialogHeader>
          <div className="mt-4 max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">From</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">To</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Days</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {empHistory.length > 0 ? (
                  empHistory.map((app) => (
                    <tr key={app.id}>
                      <td className="px-4 py-2 text-sm">{app.id}</td>
                      <td className="px-4 py-2 text-sm">{app.type}</td>
                      <td className="px-4 py-2 text-sm">{app.from}</td>
                      <td className="px-4 py-2 text-sm">{app.to}</td>
                      <td className="px-4 py-2 text-sm font-semibold">{app.totalDays}</td>
                      <td className="px-4 py-2 text-sm">{app.reason}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No approved leave history found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
