import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Plus, Download, Upload, Eye, Edit, Lock, AlertTriangle, Unlock } from 'lucide-react'
import { DEMO_MODE, showDemoToast } from '@/config/demo'

export default function UserManagement() {
  const [viewUser, setViewUser] = useState<any>(null)
  const [editUser, setEditUser] = useState<any>(null)

  const handleViewUser = (user: any) => {
    setViewUser(user)
  }

  const handleEditUser = (user: any) => {
    setEditUser(user)
  }

  const handleSaveUser = () => {
    alert(showDemoToast('User details updated successfully'))
    setEditUser(null)
  }

  const users = [
    { id: 'ADM-0001', name: 'Md. Imran Hossain', role: 'System Admin', email: 'imran.hossain@nub.ac.bd', mobile: '01711-000111', status: 'Active', lastLogin: '03 Nov 2025 10:14 AM' },
    { id: 'REG-0102', name: 'Tania Sultana', role: 'Registrar', email: 'registrar.office@nub.ac.bd', mobile: '01722-111222', status: 'Active', lastLogin: '03 Nov 2025 09:50 AM' },
    { id: 'EXAM-2045', name: 'Rafiq Ahmed', role: 'Exam Controller', email: 'exam.controller@nub.ac.bd', mobile: '01888-777555', status: 'Active', lastLogin: '03 Nov 2025 10:05 AM' },
    { id: 'FIN-8890', name: 'Sharmin Akter', role: 'Finance Officer', email: 'sharmin.akter@nub.ac.bd', mobile: '01755-333444', status: 'Active', lastLogin: '03 Nov 2025 10:12 AM' },
    { id: 'FAC-ENG-1123', name: 'Engr. Shakil Rahman', role: 'Faculty (SOE)', email: 'shakil.rahman@nub.ac.bd', mobile: '01666-999000', status: 'Active', lastLogin: '03 Nov 2025 08:40 AM' },
    { id: 'STU-CSE-0042', name: 'Md. Asif Rahman', role: 'Student', email: 'cse-25-01-0042@student.nub.ac', mobile: '01744-101010', status: 'Locked', lastLogin: '02 Nov 2025 11:30 PM' }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">User Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage system users, roles, and access</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Import
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="nu-button-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select className="w-full p-2 border rounded-md">
            <option>All Roles</option>
            <option>System Admin</option>
            <option>Registrar</option>
            <option>Exam Controller</option>
            <option>Finance Officer</option>
            <option>Faculty</option>
            <option>Student</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select className="w-full p-2 border rounded-md">
            <option>All Status</option>
            <option>Active</option>
            <option>Deactivated</option>
            <option>Locked</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
          <select className="w-full p-2 border rounded-md">
            <option>All Campuses</option>
            <option>Dhaka Campus</option>
            <option>Permanent Campus</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <Input placeholder="Search users..." />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">User ID</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Full Name</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Primary Role</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Email</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Mobile</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Last Login</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <>
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm font-mono">{user.id}</td>
                      <td className="p-3 text-sm font-medium">{user.name}</td>
                      <td className="p-3 text-sm">{user.role}</td>
                      <td className="p-3 text-sm">{user.email}</td>
                      <td className="p-3 text-sm">{user.mobile}</td>
                      <td className="p-3">
                        <Badge className={
                          user.status === 'Active' ? 'bg-green-100 text-green-800' :
                          user.status === 'Locked' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {user.status === 'Active' && '🟢'}
                          {user.status === 'Locked' && '🔒'}
                          {user.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm">{user.lastLogin}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewUser(user)} title="View Details">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)} title="Edit User">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {user.status === 'Active' && (
                            <Button variant="ghost" size="sm">Deactivate</Button>
                          )}
                          {user.status === 'Locked' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => alert(showDemoToast('Unlock user account'))}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Unlock className="w-4 h-4 mr-1" />
                              Unlock
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Lock className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {/* Locked Account Banner */}
                    {user.status === 'Locked' && (
                      <tr key={`${idx}-locked-banner`}>
                        <td colSpan={8} className="p-0">
                          <div className="mx-3 mb-2 p-3 bg-red-50 border border-red-200 rounded-md flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                              <span className="text-sm text-red-800 font-medium">
                                Auto-locked due to repeated failures
                              </span>
                              <span className="text-xs text-red-600">
                                (5+ failed login attempts in 10 minutes)
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => alert(showDemoToast('Unlock user account'))}
                              className="border-red-300 text-red-700 hover:bg-red-50"
                            >
                              <Unlock className="w-4 h-4 mr-1" />
                              Unlock Account
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
