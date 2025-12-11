import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Download, History, ArrowRight } from 'lucide-react'
import { HRM_HISTORY, HRM_EMPLOYEES } from '@/lib/hrmStatic'

export default function HRMHistory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterChangeType, setFilterChangeType] = useState('')

  const filteredHistory = HRM_HISTORY.filter(hist => {
    const employee = HRM_EMPLOYEES.find(e => e.id === hist.employeeId)
    if (!employee) return false

    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hist.remarks.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !filterChangeType || hist.changeType === filterChangeType

    return matchesSearch && matchesType
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const changeTypes = ['Joining', 'Promotion', 'Transfer', 'Grade Change', 'Contract Renewal', 'Resignation', 'Retirement']

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'Joining': return 'default'
      case 'Promotion': return 'default'
      case 'Resignation': return 'destructive'
      case 'Retirement': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="w-5 h-5 mr-2 text-blue-600" />
            Employment Change History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by employee or remarks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={filterChangeType}
              onChange={(e) => setFilterChangeType(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Change Types</option>
              {changeTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </Button>
          </div>

          {/* History Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Employee</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Department</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Change Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Change Details</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredHistory.map(hist => {
                  const employee = HRM_EMPLOYEES.find(e => e.id === hist.employeeId)
                  if (!employee) return null

                  return (
                    <tr key={hist.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{hist.date}</td>
                      <td className="px-4 py-3 text-sm font-medium">{employee.name}</td>
                      <td className="px-4 py-3 text-sm">{employee.department}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant={getChangeTypeColor(hist.changeType)}>
                          {hist.changeType}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {hist.oldValue && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500">{hist.oldValue}</span>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{hist.newValue}</span>
                          </div>
                        )}
                        {!hist.oldValue && (
                          <span className="font-medium">{hist.newValue}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{hist.remarks}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filteredHistory.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No history records found matching your criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
