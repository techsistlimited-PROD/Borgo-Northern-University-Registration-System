import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Save } from 'lucide-react'

export default function AccessControl() {
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
    </div>
  )
}
