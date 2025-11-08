import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Download, Printer, Eye } from 'lucide-react'

// Generate demo data for permissions by user
const generatePermissionsByUser = () => {
  const users = [
    { id: 'ADM-0001', name: 'Md. Imran Hossain', roles: ['System Admin'], permCount: 120 },
    { id: 'REG-0102', name: 'Tania Sultana', roles: ['Registrar'], permCount: 85 },
    { id: 'EXAM-2045', name: 'Rafiq Ahmed', roles: ['Exam Controller'], permCount: 65 },
    { id: 'FIN-8890', name: 'Sharmin Akter', roles: ['Finance Officer'], permCount: 72 },
    { id: 'FAC-ENG-1123', name: 'Engr. Shakil Rahman', roles: ['Faculty', 'Course Coordinator'], permCount: 45 },
    { id: 'FAC-BBA-5567', name: 'Prof. Nazmul Karim', roles: ['Faculty', 'Department Head'], permCount: 55 },
    { id: 'STU-CSE-0042', name: 'Md. Asif Rahman', roles: ['Student'], permCount: 12 },
    { id: 'STU-BBA-1205', name: 'Faria Islam', roles: ['Student'], permCount: 12 },
    { id: 'ADM-0002', name: 'Kamal Uddin', roles: ['System Admin'], permCount: 115 },
    { id: 'ADM-0003', name: 'Sultana Begum', roles: ['Deputy Admin'], permCount: 95 }
  ]

  // Duplicate to get 25+ rows
  const extendedUsers = []
  for (let i = 0; i < 3; i++) {
    users.forEach((u, idx) => {
      extendedUsers.push({
        ...u,
        id: i === 0 ? u.id : `${u.id}-${i}`,
        lastReviewed: `${15 + (i * 5 + idx) % 15} ${['Jan', 'Feb', 'Mar'][i % 3]} 2025`
      })
    })
  }
  
  return extendedUsers.slice(0, 30)
}

export default function PermissionsReportsByUser() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')

  const users = generatePermissionsByUser()

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'All' || user.roles.some(r => r.includes(roleFilter))
    return matchesSearch && matchesRole
  })

  const handleExport = () => {
    alert('Exporting to CSV... (Demo)')
  }

  const handlePrint = () => {
    window.print()
  }

  const handleViewDetails = (userId: string) => {
    alert(`View detailed permissions for ${userId}... (Demo)`)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Permissions by User</h1>
          <p className="text-sm text-gray-600 mt-1">View effective permissions for each user</p>
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role Filter</label>
          <select 
            className="w-full p-2 border rounded-md"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option>All</option>
            <option>Admin</option>
            <option>Registrar</option>
            <option>Exam</option>
            <option>Finance</option>
            <option>Faculty</option>
            <option>Student</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <Input 
            placeholder="Search user name or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Permissions Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">User ID</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Full Name</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Roles</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Effective Permissions</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Last Reviewed</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, idx) => (
                  <tr key={`${user.id}-${idx}`} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-mono">{user.id}</td>
                    <td className="p-3 text-sm font-medium">{user.name}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role, ridx) => (
                          <Badge key={ridx} className="bg-deep-plum/10 text-deep-plum text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-sm">
                      <Badge className="bg-blue-100 text-blue-800">
                        {user.permCount} permissions
                      </Badge>
                    </td>
                    <td className="p-3 text-sm">{user.lastReviewed}</td>
                    <td className="p-3">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(user.id)}
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
            Showing {filteredUsers.length} record(s)
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
