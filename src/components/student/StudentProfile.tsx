import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  User, 
  Edit, 
  Key, 
  Save,
  X,
  Upload,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface StudentProfileProps {
  onClose: () => void
  onEdit: () => void
}

// Mock student data - modified from real data
const studentData = {
  studentId: '20241601234',
  fullName: 'Ahmed Hassan Rahman',
  fatherName: 'Md. Abdul Rahman',
  motherName: 'Fatema Begum',
  dateOfBirth: '15/03/2005',
  gender: 'Male',
  contactNo: '01712345678',
  email: 'ahmed.hassan@nu.edu.bd',
  emailVerified: true,
  campus: 'Main Campus',
  programType: 'Bachelor',
  program: 'CSE-Bachelor of Science in Computer Science and Engineering',
  admissionSemester: 'Fall 2024',
  completionSemester: '',
  creditTransferred: 'No',
  academicStatus: 'Active',
  convocationNo: '',
  registeredForConvocation: '',
  presentAddress: 'Dhanmondi, Dhaka-1205',
  permanentAddress: 'Cumilla Sadar, Cumilla',
  presentCountry: 'Bangladesh',
  permanentCountry: 'Bangladesh',
  presentDivision: 'Dhaka',
  permanentDivision: 'Chittagong',
  presentDistrict: 'Dhaka',
  permanentDistrict: 'Cumilla',
  presentThana: 'Dhanmondi',
  permanentThana: 'Cumilla Sadar',
  religion: 'Islam',
  nationalId: '1234567890123',
  birthCertificateNo: '',
  passportNo: '',
  profileImage: '/placeholder-avatar.jpg'
}

const academicHistory = [
  {
    level: 'SSC',
    exam: 'SSC',
    concentration: 'Science',
    board: 'Cumilla',
    institute: 'Cumilla Zilla School',
    passingYear: '2020',
    grade: '5.0'
  },
  {
    level: 'HSC',
    exam: 'HSC', 
    concentration: 'Science',
    board: 'Cumilla',
    institute: 'Cumilla Government College',
    passingYear: '2022',
    grade: '4.83'
  }
]

export const StudentProfile = ({ onClose, onEdit }: StudentProfileProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-deep-plum">Student Profile</h2>
          <div className="flex space-x-2">
            <Button onClick={onEdit} className="nu-button-primary">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button onClick={onClose} variant="outline">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-32 w-32 border-4 border-deep-plum">
                  <AvatarImage src={studentData.profileImage} alt={studentData.fullName} />
                  <AvatarFallback className="bg-gradient-to-br from-deep-plum to-accent-purple text-white text-2xl font-bold">
                    {getInitials(studentData.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-deep-plum">{studentData.fullName}</h3>
                  <p className="text-lg text-gray-600">ID: {studentData.studentId}</p>
                  <p className="text-gray-600">{studentData.program}</p>
                  <p className="text-gray-600">Admission: {studentData.admissionSemester}</p>
                  <div className="flex items-center mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      studentData.academicStatus === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {studentData.academicStatus}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Student ID:</span>
                    <span className="col-span-2">{studentData.studentId}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Full Name:</span>
                    <span className="col-span-2">{studentData.fullName}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Father's Name:</span>
                    <span className="col-span-2">{studentData.fatherName}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Mother's Name:</span>
                    <span className="col-span-2">{studentData.motherName}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Date of Birth:</span>
                    <span className="col-span-2">{studentData.dateOfBirth}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Gender:</span>
                    <span className="col-span-2">{studentData.gender}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Contact No:</span>
                    <span className="col-span-2">{studentData.contactNo}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="col-span-2">
                      {studentData.email}
                      {studentData.emailVerified && (
                        <CheckCircle className="inline w-4 h-4 ml-2 text-green-600" />
                      )}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Campus:</span>
                    <span className="col-span-2">{studentData.campus}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Program Type:</span>
                    <span className="col-span-2">{studentData.programType}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Program:</span>
                    <span className="col-span-2">{studentData.program}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Admission Semester:</span>
                    <span className="col-span-2">{studentData.admissionSemester}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Credit Transferred:</span>
                    <span className="col-span-2">{studentData.creditTransferred}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Academic Status:</span>
                    <span className="col-span-2">{studentData.academicStatus}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Religion:</span>
                    <span className="col-span-2">{studentData.religion}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">National ID:</span>
                    <span className="col-span-2">{studentData.nationalId}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-deep-plum mb-3">Present Address</h4>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-medium text-gray-700">Address:</span>
                      <span className="col-span-2">{studentData.presentAddress}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-medium text-gray-700">Country:</span>
                      <span className="col-span-2">{studentData.presentCountry}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-medium text-gray-700">Division:</span>
                      <span className="col-span-2">{studentData.presentDivision}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-medium text-gray-700">District:</span>
                      <span className="col-span-2">{studentData.presentDistrict}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-medium text-gray-700">Thana:</span>
                      <span className="col-span-2">{studentData.presentThana}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-deep-plum mb-3">Permanent Address</h4>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-medium text-gray-700">Address:</span>
                      <span className="col-span-2">{studentData.permanentAddress}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-medium text-gray-700">Country:</span>
                      <span className="col-span-2">{studentData.permanentCountry}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-medium text-gray-700">Division:</span>
                      <span className="col-span-2">{studentData.permanentDivision}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-medium text-gray-700">District:</span>
                      <span className="col-span-2">{studentData.permanentDistrict}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-medium text-gray-700">Thana:</span>
                      <span className="col-span-2">{studentData.permanentThana}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic History */}
          <Card>
            <CardHeader>
              <CardTitle>Academic History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Education Level</TableHead>
                    <TableHead>Exam</TableHead>
                    <TableHead>Concentration</TableHead>
                    <TableHead>Board/University</TableHead>
                    <TableHead>Institute</TableHead>
                    <TableHead>Passing Year</TableHead>
                    <TableHead>Grade/Class</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {academicHistory.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{record.level}</TableCell>
                      <TableCell>{record.exam}</TableCell>
                      <TableCell>{record.concentration}</TableCell>
                      <TableCell>{record.board}</TableCell>
                      <TableCell>{record.institute}</TableCell>
                      <TableCell>{record.passingYear}</TableCell>
                      <TableCell>{record.grade}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export const EditStudentProfile = ({ onClose, onSave }: { onClose: () => void, onSave: () => void }) => {
  const [profileUpdated, setProfileUpdated] = useState(false)

  // Check if profile was already updated (this would come from backend in real app)
  const hasAlreadyUpdated = false // This should be fetched from backend

  if (hasAlreadyUpdated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span>Profile Already Updated</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              You have already submitted a profile update request. Please wait for ACAD approval before making another request.
            </p>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmit = () => {
    // Here you would submit the profile update request to backend
    setProfileUpdated(true)
    setTimeout(() => {
      onSave()
    }, 2000)
  }

  if (profileUpdated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Profile Update Submitted</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Your profile update request has been submitted successfully. ACAD will review your changes and approve them shortly.
            </p>
            <Button onClick={onSave} className="w-full nu-button-primary">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-deep-plum">Edit Profile</h2>
          <Button onClick={onClose} variant="outline">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Important Notice</p>
                <p className="text-sm text-yellow-700">
                  Profile updates require ACAD approval. You can only submit one update request at a time.
                </p>
              </div>
            </div>
          </div>

          {/* Profile Picture Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24 border-4 border-deep-plum">
                  <AvatarImage src={studentData.profileImage} alt={studentData.fullName} />
                  <AvatarFallback className="bg-gradient-to-br from-deep-plum to-accent-purple text-white text-xl font-bold">
                    AH
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload New Picture</span>
                  </Button>
                  <p className="text-sm text-gray-600 mt-2">JPG, PNG up to 2MB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Editable Fields */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input id="contact" defaultValue={studentData.contactNo} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" defaultValue={studentData.email} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="presentAddress">Present Address</Label>
                  <Input id="presentAddress" defaultValue={studentData.presentAddress} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="permanentAddress">Permanent Address</Label>
                  <Input id="permanentAddress" defaultValue={studentData.permanentAddress} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-4 pt-4">
            <Button onClick={handleSubmit} className="nu-button-primary">
              <Save className="w-4 h-4 mr-2" />
              Submit for Approval
            </Button>
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const ChangePassword = ({ onClose, onSave }: { onClose: () => void, onSave: () => void }) => {
  const [passwordChanged, setPasswordChanged] = useState(false)

  const handleSubmit = () => {
    // Here you would submit the password change request to backend
    setPasswordChanged(true)
    setTimeout(() => {
      onSave()
    }, 2000)
  }

  if (passwordChanged) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Password Change Request Submitted</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Your password change request has been submitted successfully. ACAD will review and approve your request shortly.
            </p>
            <Button onClick={onSave} className="w-full nu-button-primary">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Password changes require ACAD approval for security.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <p className="text-sm text-blue-700">
                For security reasons, password changes require ACAD approval. You will be notified once your request is processed.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" />
          </div>

          <div className="flex space-x-4 pt-4">
            <Button onClick={handleSubmit} className="nu-button-primary">
              <Key className="w-4 h-4 mr-2" />
              Submit Request
            </Button>
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
