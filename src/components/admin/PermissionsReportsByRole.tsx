import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Download, Printer, Eye } from 'lucide-react'

// Generate demo data for permissions by role
const generatePermissionsByRole = () => {
  const baseRoles = [
    { name: 'System Admin', userCount: 3, permCount: 120, lastEdited: '01 Nov 2025' },
    { name: 'Deputy Admin', userCount: 2, permCount: 95, lastEdited: '28 Oct 2025' },
    { name: 'Registrar', userCount: 2, permCount: 85, lastEdited: '25 Oct 2025' },
    { name: 'Exam Controller', userCount: 3, permCount: 65, lastEdited: '22 Oct 2025' },
    { name: 'Finance Officer', userCount: 4, permCount: 72, lastEdited: '20 Oct 2025' },
    { name: 'Faculty (SOE)', userCount: 25, permCount: 45, lastEdited: '18 Oct 2025' },
    { name: 'Faculty (SOB)', userCount: 20, permCount: 45, lastEdited: '18 Oct 2025' },
    { name: 'Faculty (SOL)', userCount: 15, permCount: 45, lastEdited: '18 Oct 2025' },
    { name: 'Course Coordinator', userCount: 8, permCount: 50, lastEdited: '17 Oct 2025' },
    { name: 'Department Head', userCount: 6, permCount: 60, lastEdited: '17 Oct 2025' },
    { name: 'Student (Undergraduate)', userCount: 1500, permCount: 12, lastEdited: '15 Oct 2025' },
    { name: 'Student (Graduate)', userCount: 350, permCount: 15, lastEdited: '15 Oct 2025' },
    { name: 'Library Staff', userCount: 8, permCount: 25, lastEdited: '10 Oct 2025' },
    { name: 'HR Officer', userCount: 5, permCount: 55, lastEdited: '08 Oct 2025' },
    { name: 'Admission Officer', userCount: 6, permCount: 40, lastEdited: '05 Oct 2025' }
  ]

  // Extend with department-specific roles to get 25+ rows
  const depts = ['CSE', 'BBA', 'LLB', 'EEE', 'English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics']
  const extendedRoles = [...baseRoles]
  
  depts.forEach((dept, idx) => {
    extendedRoles.push({
      name: `${dept} Coordinator`,
      userCount: Math.floor(Math.random() * 5) + 2,
      permCount: 45 + Math.floor(Math.random() * 10),
      lastEdited: `${15 - idx} Oct 2025`
    })
  })
  
  return extendedRoles.slice(0, 30)
}

export default function PermissionsReportsByRole() {
  const [searchQuery, setSearchQuery] = useState('')

  const roles = generatePermissionsByRole()

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleExport = () => {
    alert('Exporting to CSV... (Demo)')
  }

  const handlePrint = () => {
    window.print()
  }

  const handleViewDetails = (roleName: string) => {
    alert(`View detailed permissions for role: ${roleName}... (Demo)`)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Permissions by Role</h1>
          <p className="text-sm text-gray-600 mt-1">View permissions assigned to each role</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <Input 
            placeholder="Search role name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Role Name</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Users Assigned</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Permissions Count</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Last Edited</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map((role, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-medium">{role.name}</td>
                    <td className="p-3 text-sm">
                      <Badge className="bg-purple-100 text-purple-800">
                        {role.userCount} users
                      </Badge>
                    </td>
                    <td className="p-3 text-sm">
                      <Badge className="bg-blue-100 text-blue-800">
                        {role.permCount} permissions
                      </Badge>
                    </td>
                    <td className="p-3 text-sm">{role.lastEdited}</td>
                    <td className="p-3">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(role.name)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredRoles.length} record(s)
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
