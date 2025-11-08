import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Download, Save, UserCheck } from 'lucide-react'
import { DEMO_MODE, showDemoToast } from '@/config/demo'

export default function AccessControl() {
  const [checkDialogOpen, setCheckDialogOpen] = useState(false)
  const [checkUserId, setCheckUserId] = useState('')
  const [checkedPermissions, setCheckedPermissions] = useState<any>(null)

  const permissions = [
    { key: 'admissions.application.view', desc: 'View applicant details', sysAdmin: true, registrar: true, examCtrl: false, financeOff: false, faculty: false, student: false },
    { key: 'admissions.application.approve', desc: 'Approve admission & generate ID', sysAdmin: true, registrar: true, examCtrl: false, financeOff: false, faculty: false, student: false },
    { key: 'exam.sessions.create', desc: 'Create exam session / timetable', sysAdmin: true, registrar: false, examCtrl: true, financeOff: false, faculty: false, student: false },
    { key: 'exam.result.publish', desc: 'Publish final result to portal', sysAdmin: true, registrar: true, examCtrl: true, financeOff: false, faculty: false, student: false },
    { key: 'finance.payment.refund', desc: 'Issue/approve refund', sysAdmin: true, registrar: false, examCtrl: false, financeOff: true, faculty: false, student: false },
    { key: 'student.portal.view_grades', desc: 'View published grades in portal', sysAdmin: true, registrar: true, examCtrl: true, financeOff: true, faculty: false, student: true }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Access Control</h1>
          <p className="text-sm text-gray-600 mt-1">Manage module-level permissions and role access matrix</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCheckDialogOpen(true)}
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Check User Permissions
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Matrix
          </Button>
          <Button className="nu-button-primary">
            <Save className="w-4 h-4 mr-2" />
            Apply Role Permissions
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
          <select className="w-full p-2 border rounded-md">
            <option>All Modules</option>
            <option>Admission</option>
            <option>Academic</option>
            <option>Exam</option>
            <option>Finance</option>
            <option>Admin</option>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select className="w-full p-2 border rounded-md">
            <option>All Roles</option>
            <option>System Admin</option>
            <option>Registrar</option>
            <option>Exam Controller</option>
            <option>Finance Officer</option>
          </select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permissions Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-medium text-gray-700">Task / Permission Key</th>
                  <th className="text-left p-3 font-medium text-gray-700">Description</th>
                  <th className="text-center p-3 font-medium text-gray-700">System Admin</th>
                  <th className="text-center p-3 font-medium text-gray-700">Registrar</th>
                  <th className="text-center p-3 font-medium text-gray-700">Exam Ctrl</th>
                  <th className="text-center p-3 font-medium text-gray-700">Finance Off</th>
                  <th className="text-center p-3 font-medium text-gray-700">Faculty</th>
                  <th className="text-center p-3 font-medium text-gray-700">Student</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((perm, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-mono text-xs">{perm.key}</td>
                    <td className="p-3">{perm.desc}</td>
                    <td className="p-3 text-center">
                      <input type="checkbox" checked={perm.sysAdmin} readOnly className="cursor-pointer" />
                    </td>
                    <td className="p-3 text-center">
                      <input type="checkbox" checked={perm.registrar} readOnly className="cursor-pointer" />
                    </td>
                    <td className="p-3 text-center">
                      <input type="checkbox" checked={perm.examCtrl} readOnly className="cursor-pointer" />
                    </td>
                    <td className="p-3 text-center">
                      <input type="checkbox" checked={perm.financeOff} readOnly className="cursor-pointer" />
                    </td>
                    <td className="p-3 text-center">
                      <input type="checkbox" checked={perm.faculty} readOnly className="cursor-pointer" />
                    </td>
                    <td className="p-3 text-center">
                      <input type="checkbox" checked={perm.student} readOnly className="cursor-pointer" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Check User Permissions Dialog */}
      <Dialog open={checkDialogOpen} onOpenChange={setCheckDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Check User Permissions</DialogTitle>
            <DialogDescription>
              Enter a User ID to view their effective permissions (roles + overrides)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User ID
              </label>
              <Input
                placeholder="e.g., ADM-0001, REG-0102, STU-CSE-0042"
                value={checkUserId}
                onChange={(e) => setCheckUserId(e.target.value)}
              />
            </div>

            <Button
              onClick={() => {
                if (!checkUserId) {
                  alert('Please enter a User ID')
                  return
                }

                // Demo: Determine role based on User ID prefix
                let role = 'Student'
                let permCount = 12
                if (checkUserId.startsWith('ADM')) {
                  role = 'System Admin'
                  permCount = 120
                } else if (checkUserId.startsWith('REG')) {
                  role = 'Registrar'
                  permCount = 85
                } else if (checkUserId.startsWith('EXAM')) {
                  role = 'Exam Controller'
                  permCount = 65
                } else if (checkUserId.startsWith('FIN')) {
                  role = 'Finance Officer'
                  permCount = 72
                } else if (checkUserId.startsWith('FAC')) {
                  role = 'Faculty'
                  permCount = 45
                }

                setCheckedPermissions({
                  userId: checkUserId,
                  role,
                  permCount,
                  permissions: permissions.filter(p => {
                    if (role === 'System Admin') return p.sysAdmin
                    if (role === 'Registrar') return p.registrar
                    if (role === 'Exam Controller') return p.examCtrl
                    if (role === 'Finance Officer') return p.financeOff
                    if (role === 'Faculty') return p.faculty
                    if (role === 'Student') return p.student
                    return false
                  })
                })
              }}
              className="nu-button-primary"
            >
              Check Permissions
            </Button>

            {/* Results */}
            {checkedPermissions && (
              <div className="border rounded-md p-4 bg-gray-50">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">User Details</h3>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">User ID:</span>
                      <span className="text-sm font-mono font-semibold">{checkedPermissions.userId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Primary Role:</span>
                      <Badge className="bg-deep-plum/10 text-deep-plum">
                        {checkedPermissions.role}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Effective Permissions:</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {checkedPermissions.permCount} permissions
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Granted Permissions</h3>
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {checkedPermissions.permissions.map((perm: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs bg-white p-2 rounded border"
                      >
                        <span className="text-green-600 font-bold">✓</span>
                        <div className="flex-1">
                          <div className="font-mono font-semibold text-gray-800">{perm.key}</div>
                          <div className="text-gray-600 mt-0.5">{perm.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            {checkedPermissions && (
              <Button
                variant="outline"
                onClick={() => alert(showDemoToast('Export permissions list'))}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            )}
            <Button variant="outline" onClick={() => {
              setCheckDialogOpen(false)
              setCheckUserId('')
              setCheckedPermissions(null)
            }}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
