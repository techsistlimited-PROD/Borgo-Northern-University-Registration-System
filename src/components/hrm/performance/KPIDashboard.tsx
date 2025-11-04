import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { KPIS } from '@/lib/payrollPerformanceStatic'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip, ResponsiveContainer } from 'recharts'

export default function KPIDashboard() {
  const [selectedDept, setSelectedDept] = useState('all')
  const [selectedRole, setSelectedRole] = useState('all')

  const filteredKPIs = KPIS.filter(k => {
    if (selectedDept !== 'all' && k.department !== selectedDept) return false
    if (selectedRole !== 'all' && k.role !== selectedRole) return false
    return true
  })

  const avgScore = filteredKPIs.length > 0 
    ? (filteredKPIs.reduce((sum, k) => sum + k.score, 0) / filteredKPIs.length).toFixed(1)
    : 0

  const deptScores = ['CSE', 'BBA', 'HR', 'Accounts'].map(dept => {
    const deptKPIs = KPIS.filter(k => k.department === dept)
    const avg = deptKPIs.length > 0 ? deptKPIs.reduce((sum, k) => sum + k.score, 0) / deptKPIs.length : 0
    return { dept, score: avg }
  })

  const bestDept = deptScores.reduce((max, curr) => curr.score > max.score ? curr : max, deptScores[0])
  const lowestPerformer = filteredKPIs.length > 0 
    ? filteredKPIs.reduce((min, curr) => curr.score < min.score ? curr : min, filteredKPIs[0])
    : null

  const radarData = selectedDept !== 'all' 
    ? filteredKPIs.map(k => ({
        kpi: k.kpi.substring(0, 15),
        target: k.target,
        achieved: k.achieved
      }))
    : ['CSE', 'BBA', 'HR', 'Accounts'].map(dept => {
        const deptKPIs = KPIS.filter(k => k.department === dept)
        const avgTarget = deptKPIs.reduce((sum, k) => sum + k.target, 0) / (deptKPIs.length || 1)
        const avgAchieved = deptKPIs.reduce((sum, k) => sum + k.achieved, 0) / (deptKPIs.length || 1)
        return {
          kpi: dept,
          target: Math.round(avgTarget),
          achieved: Math.round(avgAchieved)
        }
      })

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">KPI Dashboard</h2>
          <p className="text-gray-600">Track key performance indicators and achievements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Avg KPI Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgScore}%</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Best Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bestDept.dept}</div>
            <div className="text-sm text-white/80">{bestDept.score.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Lowest Performer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{lowestPerformer?.department || 'N/A'}</div>
            <div className="text-sm text-white/80">{lowestPerformer?.score.toFixed(1) || 0}%</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
          </CardContent>
        </Card>
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
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Role</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Professor">Professor</SelectItem>
                  <SelectItem value="Lecturer">Lecturer</SelectItem>
                  <SelectItem value="Officer">Officer</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Period</label>
              <Select defaultValue="2024">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024 Annual</SelectItem>
                  <SelectItem value="2023">2023 Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Target vs Achieved Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="kpi" />
              <PolarRadiusAxis />
              <Radar name="Target" dataKey="target" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              <Radar name="Achieved" dataKey="achieved" stroke="#22c55e" fill="#22c55e" fillOpacity={0.5} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>KPI Details ({filteredKPIs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">KPI</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Achieved</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dept</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredKPIs.map((kpi) => (
                  <tr key={kpi.id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{kpi.kpi}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{kpi.target}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-600">{kpi.achieved}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{kpi.weight}%</td>
                    <td className="px-4 py-3 text-sm font-bold text-blue-600">{kpi.score.toFixed(1)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{kpi.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {kpi.achieved >= kpi.target ? 'Exceeded' : 'Below Target'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
