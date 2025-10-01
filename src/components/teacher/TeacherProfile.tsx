import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Edit, 
  Key, 
  Save,
  X,
  Upload,
  AlertCircle,
  CheckCircle,
  GraduationCap
} from 'lucide-react'

interface TeacherProfileProps {
  onClose: () => void
  onEdit: () => void
}

// Mock teacher data
const teacherData = {
  teacherId: 'TCH001',
  fullName: 'Dr. Sarah Ahmed Khan',
  designation: 'Associate Professor',
  department: 'Computer Science & Engineering',
  qualification: 'PhD in Computer Science',
  specialization: 'Machine Learning, Data Science',
  dateOfBirth: '10/06/1980',
  gender: 'Female',
  contactNo: '01712345678',
  email: 'sarah.ahmed@nu.edu.bd',
  emailVerified: true,
  campus: 'Main Campus',
  joinDate: '15/08/2015',
  lastLogin: '2024-01-20 10:15 AM',
  officeRoom: 'Room 205, Faculty Building',
  presentAddress: 'Dhanmondi, Dhaka-1205',
  permanentAddress: 'Chittagong, Bangladesh',
  religion: 'Islam',
  nationalId: '1234567890123',
  profileImage: '/placeholder-avatar.jpg'
}

export const TeacherProfile = ({ onClose, onEdit }: TeacherProfileProps) => {
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
          <h2 className="text-2xl font-bold text-deep-plum">Faculty Profile</h2>
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
                  <AvatarImage src={teacherData.profileImage} alt={teacherData.fullName} />
                  <AvatarFallback className="bg-gradient-to-br from-deep-plum to-accent-purple text-white text-2xl font-bold">
                    {getInitials(teacherData.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-deep-plum">{teacherData.fullName}</h3>
                  <p className="text-lg text-gray-600">ID: {teacherData.teacherId}</p>
                  <p className="text-gray-600 flex items-center">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    {teacherData.designation}
                  </p>
                  <p className="text-gray-600">{teacherData.department}</p>
                  <p className="text-gray-600">{teacherData.qualification}</p>
                  <div className="flex items-center mt-2">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Active Faculty
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
                    <span className="font-medium text-gray-700">Teacher ID:</span>
                    <span className="col-span-2">{teacherData.teacherId}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Full Name:</span>
                    <span className="col-span-2">{teacherData.fullName}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Designation:</span>
                    <span className="col-span-2">{teacherData.designation}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Department:</span>
                    <span className="col-span-2">{teacherData.department}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Qualification:</span>
                    <span className="col-span-2">{teacherData.qualification}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Specialization:</span>
                    <span className="col-span-2">{teacherData.specialization}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Office:</span>
                    <span className="col-span-2">{teacherData.officeRoom}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Date of Birth:</span>
                    <span className="col-span-2">{teacherData.dateOfBirth}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Gender:</span>
                    <span className="col-span-2">{teacherData.gender}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Contact No:</span>
                    <span className="col-span-2">{teacherData.contactNo}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="col-span-2">
                      {teacherData.email}
                      {teacherData.emailVerified && (
                        <CheckCircle className="inline w-4 h-4 ml-2 text-green-600" />
                      )}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Campus:</span>
                    <span className="col-span-2">{teacherData.campus}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Join Date:</span>
                    <span className="col-span-2">{teacherData.joinDate}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-700">Religion:</span>
                    <span className="col-span-2">{teacherData.religion}</span>
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
                  <p className="text-gray-700">{teacherData.presentAddress}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-deep-plum mb-3">Permanent Address</h4>
                  <p className="text-gray-700">{teacherData.permanentAddress}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export const EditTeacherProfile = ({ onClose, onSave }: { onClose: () => void, onSave: () => void }) => {
  const [profileUpdated, setProfileUpdated] = useState(false)

  const handleSubmit = () => {
    setProfileUpdated(true)
    setTimeout(() => {
      onSave()
    }, 1500)
  }

  if (profileUpdated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Profile Updated</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Your profile has been updated successfully.
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
          <h2 className="text-2xl font-bold text-deep-plum">Edit Faculty Profile</h2>
          <Button onClick={onClose} variant="outline">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Picture Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24 border-4 border-deep-plum">
                  <AvatarImage src={teacherData.profileImage} alt={teacherData.fullName} />
                  <AvatarFallback className="bg-gradient-to-br from-deep-plum to-accent-purple text-white text-xl font-bold">
                    SA
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
                  <Input id="contact" defaultValue={teacherData.contactNo} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" defaultValue={teacherData.email} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="officeRoom">Office Room</Label>
                  <Input id="officeRoom" defaultValue={teacherData.officeRoom} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input id="specialization" defaultValue={teacherData.specialization} />
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
                  <Input id="presentAddress" defaultValue={teacherData.presentAddress} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="permanentAddress">Permanent Address</Label>
                  <Input id="permanentAddress" defaultValue={teacherData.permanentAddress} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-4 pt-4">
            <Button onClick={handleSubmit} className="nu-button-primary">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
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

export const ChangeTeacherPassword = ({ onClose, onSave }: { onClose: () => void, onSave: () => void }) => {
  const [passwordChanged, setPasswordChanged] = useState(false)

  const handleSubmit = () => {
    setPasswordChanged(true)
    setTimeout(() => {
      onSave()
    }, 1500)
  }

  if (passwordChanged) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Password Changed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Your password has been changed successfully.
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
            Enter your current password and new password to make changes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
              Change Password
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
