import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { CURRENT_EMPLOYEE } from '@/lib/hrmDemoSeed'

export default function MyProfile() {
  const [editMode, setEditMode] = useState(false)
  const [profile, setProfile] = useState(CURRENT_EMPLOYEE)

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20 border-4 border-white">
            <AvatarFallback className="text-2xl">MI</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p>{profile.designation}, {profile.dept}</p>
            <p className="text-sm text-blue-100">ID: {profile.code} | Joining: {profile.joiningDate}</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)}>
              {editMode ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input value={profile.email} disabled={!editMode} />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input value={profile.phone} disabled={!editMode} />
            </div>
            <div>
              <label className="text-sm font-medium">Blood Group</label>
              <Input value={profile.bloodGroup} disabled />
            </div>
            <div>
              <label className="text-sm font-medium">NID</label>
              <Input value={profile.nid} disabled />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Present Address</label>
              <Input value={profile.presentAddress} disabled={!editMode} />
            </div>
          </div>
          {editMode && (
            <div className="mt-4 flex gap-2">
              <Button>Submit Changes</Button>
              <Badge className="bg-yellow-100 text-yellow-800 self-center">
                Pending HR Approval
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Official Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="text-gray-600">Department</label>
              <p className="font-medium">{profile.dept}</p>
            </div>
            <div>
              <label className="text-gray-600">Designation</label>
              <p className="font-medium">{profile.designation}</p>
            </div>
            <div>
              <label className="text-gray-600">Employment Type</label>
              <p className="font-medium">{profile.employmentType}</p>
            </div>
            <div>
              <label className="text-gray-600">Grade</label>
              <p className="font-medium">{profile.grade}</p>
            </div>
            <div>
              <label className="text-gray-600">Bank</label>
              <p className="font-medium">{profile.bank.name}</p>
            </div>
            <div>
              <label className="text-gray-600">Account</label>
              <p className="font-medium">{profile.bank.account}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <label className="text-gray-600">Name</label>
              <p className="font-medium">{profile.emergencyContact.name}</p>
            </div>
            <div>
              <label className="text-gray-600">Relation</label>
              <p className="font-medium">{profile.emergencyContact.relation}</p>
            </div>
            <div>
              <label className="text-gray-600">Phone</label>
              <p className="font-medium">{profile.emergencyContact.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
