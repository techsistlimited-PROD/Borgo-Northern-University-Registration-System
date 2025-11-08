import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Home, Building2, FileText, Download, Printer, Pencil } from 'lucide-react'
import { DEMO_MODE, showDemoToast } from '@/config/demo'
import { instituteProfileData, type InstituteProfile } from '@/lib/generalSettingsSeeds'

export default function InstituteProfileView() {
  const [profile, setProfile] = useState<InstituteProfile>(instituteProfileData)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState<InstituteProfile>(profile)

  const handleExport = () => {
    alert(showDemoToast('Export to CSV'))
  }

  const handlePrint = () => {
    alert(showDemoToast('Print'))
  }

  const handleSaveEdit = () => {
    if (DEMO_MODE) {
      setProfile(editForm)
      setEditDialogOpen(false)
      alert(showDemoToast('Institute Profile updated'))
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Home className="w-4 h-4" />
          <span>/</span>
          <span>Admin & Security</span>
          <span>/</span>
          <span>General Settings</span>
          <span>/</span>
          <span className="text-deep-plum font-medium">Institute/Organization Profile</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>Institute/Organization Profile</span>
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">Basic information about the institution</p>
          </div>
          <Button onClick={() => { setEditForm(profile); setEditDialogOpen(true) }}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Institution Name</label>
              <p className="text-base mt-1">{profile.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Short Name</label>
              <p className="text-base mt-1">{profile.shortName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Code</label>
              <p className="text-base mt-1">{profile.code}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Established Year</label>
              <p className="text-base mt-1">{profile.establishedYear}</p>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-600">Address</label>
              <p className="text-base mt-1">{profile.address}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Website</label>
              <p className="text-base mt-1 text-blue-600">{profile.website}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-base mt-1">{profile.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-base mt-1">{profile.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Logo</label>
              <p className="text-base mt-1 text-gray-500">{profile.logo}</p>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-600">About</label>
              <p className="text-base mt-1 text-gray-700">{profile.about}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Institute Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Institution Name</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Short Name</label>
                <Input
                  value={editForm.shortName}
                  onChange={(e) => setEditForm({ ...editForm, shortName: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Code</label>
                <Input
                  value={editForm.code}
                  onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Established Year</label>
                <Input
                  type="number"
                  value={editForm.establishedYear}
                  onChange={(e) => setEditForm({ ...editForm, establishedYear: parseInt(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">Address</label>
                <Input
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Website</label>
                <Input
                  value={editForm.website}
                  onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Logo</label>
                <Input
                  value={editForm.logo}
                  onChange={(e) => setEditForm({ ...editForm, logo: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">About</label>
                <textarea
                  value={editForm.about}
                  onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
                  className="w-full mt-1 p-2 border rounded-md"
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
