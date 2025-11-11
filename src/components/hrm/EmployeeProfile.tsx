import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Users, 
  FileText,
  Edit,
  Trash2,
  Download
} from 'lucide-react'
import { HRM_EMPLOYEES, type Employee } from '@/lib/hrmStatic'
import { DEMO_MODE, showDemoToast } from '@/config/demo'

interface EmployeeProfileProps {
  employeeId: string
}

export default function EmployeeProfile({ employeeId }: EmployeeProfileProps) {
  const navigate = useNavigate()
  const [employee, setEmployee] = useState<Employee | null>(null)

  useEffect(() => {
    const emp = HRM_EMPLOYEES.find(e => e.id === employeeId)
    setEmployee(emp || null)
  }, [employeeId])

  if (!employee) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Employee Not Found</h3>
              <p className="text-gray-600 mb-4">The employee with ID {employeeId} could not be found.</p>
              <Button onClick={() => navigate('/hrm/employees')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Employee List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default'
      case 'On Leave': return 'secondary'
      case 'Resigned': return 'destructive'
      default: return 'outline'
    }
  }

  const handleEdit = () => {
    if (DEMO_MODE) {
      alert(showDemoToast('Edit employee profile'))
      return
    }
  }

  const handleDelete = () => {
    if (DEMO_MODE) {
      alert(showDemoToast('Delete employee'))
      return
    }
  }

  const handleDownloadProfile = () => {
    if (DEMO_MODE) {
      alert(showDemoToast('Download employee profile as PDF'))
      return
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/hrm/employees')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-deep-plum">Employee Profile</h1>
            <p className="text-gray-600 text-sm mt-1">Complete employee information</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleDownloadProfile}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-6">
            <Avatar className="w-32 h-32">
              <AvatarImage src={employee.photoUrl} alt={employee.name} />
              <AvatarFallback className="text-3xl bg-deep-plum text-white">
                {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-deep-plum">{employee.name}</h2>
                  <p className="text-xl text-gray-600 mt-1">{employee.designation}</p>
                  <div className="flex items-center space-x-3 mt-3">
                    <Badge variant="outline">{employee.id}</Badge>
                    <Badge>{employee.department}</Badge>
                    <Badge variant={getStatusColor(employee.status)}>{employee.status}</Badge>
                    <Badge variant="outline">{employee.type}</Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{employee.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{employee.mobile}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Joined: {new Date(employee.joiningDate).toLocaleDateString('en-GB')}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm">Grade: {employee.grade}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-deep-plum">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-medium">{new Date(employee.dob).toLocaleDateString('en-GB')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-medium">{employee.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">NID</p>
                <p className="font-medium">{employee.nid}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Blood Group</p>
                <p className="font-medium">{employee.bloodGroup}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Marital Status</p>
                <p className="font-medium">{employee.maritalStatus}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Present Address
              </p>
              <p className="font-medium text-sm">{employee.presentAddress}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Permanent Address
              </p>
              <p className="font-medium text-sm">{employee.permanentAddress}</p>
            </div>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-deep-plum">Employment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Employee Type</p>
                <p className="font-medium">{employee.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium">{employee.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Designation</p>
                <p className="font-medium">{employee.designation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Grade</p>
                <p className="font-medium">{employee.grade}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Employment Type</p>
                <p className="font-medium">{employee.employmentType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge variant={getStatusColor(employee.status)}>{employee.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Joining Date</p>
                <p className="font-medium">{new Date(employee.joiningDate).toLocaleDateString('en-GB')}</p>
              </div>
              {employee.reportingTo && (
                <div>
                  <p className="text-sm text-gray-600">Reporting To</p>
                  <p className="font-medium">{employee.reportingTo}</p>
                </div>
              )}
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Basic Salary</p>
                <p className="text-2xl font-bold text-deep-plum">৳ {employee.salary.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-deep-plum">Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{employee.emergencyContact.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Relation</p>
              <p className="font-medium">{employee.emergencyContact.relation}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Mobile</p>
              <p className="font-medium flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                {employee.emergencyContact.mobile}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-deep-plum">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/hrm/employees/documents')}>
              <FileText className="w-4 h-4 mr-2" />
              View Documents
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/hrm/employees/history')}>
              <Calendar className="w-4 h-4 mr-2" />
              View Employment History
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/hrm/payroll/payslips')}>
              <FileText className="w-4 h-4 mr-2" />
              View Payslips
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/hrm/leave/applications')}>
              <Calendar className="w-4 h-4 mr-2" />
              View Leave Records
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
