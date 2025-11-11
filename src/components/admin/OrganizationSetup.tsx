import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Download, Eye, Edit, MoreVertical } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

export default function OrganizationSetup() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [viewOrg, setViewOrg] = useState<any>(null)
  const [editOrg, setEditOrg] = useState<any>(null)

  const handleViewOrg = (org: any) => {
    setViewOrg(org)
  }

  const handleEditOrg = (org: any) => {
    setEditOrg(org)
  }

  const handleSaveOrg = () => {
    alert('Organization updated successfully (Demo)')
    setEditOrg(null)
  }

  const organizations = [
    { code: 'SOB', name: 'School of Business & Economics', contact: 'Prof. Nazmul Karim', phone: '01711-223344', email: 'sob@nub.ac.bd', address: 'Dhaka Campus, Banani', status: 'Active', updated: '02 Nov 2025 14:22' },
    { code: 'SOE', name: 'School of Engineering & Technology', contact: 'Engr. Shakil Rahman', phone: '01812-998877', email: 'soe@nub.ac.bd', address: 'Permanent Campus, Kallyanpur', status: 'Active', updated: '01 Nov 2025 10:05' },
    { code: 'SOL', name: 'School of Law & Governance', contact: 'Barr. Fahmida Anwar', phone: '01700-555666', email: 'sol@nub.ac.bd', address: 'Dhaka Campus, Tejgaon', status: 'Inactive', updated: '28 Oct 2025 09:10' }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Organization Setup</h1>
          <p className="text-sm text-gray-600 mt-1">Define university entities and organizational structure</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button className="nu-button-primary" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Organization
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <Input placeholder="Search by Name / Code..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select className="w-full p-2 border rounded-md">
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organizations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Org Code</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Organization Name</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Contact Person</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Phone / Email</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Address</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Last Updated</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((org, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-mono font-semibold">{org.code}</td>
                    <td className="p-3 text-sm font-medium">{org.name}</td>
                    <td className="p-3 text-sm">{org.contact}</td>
                    <td className="p-3 text-sm">
                      <div>{org.phone}</div>
                      <div className="text-xs text-gray-600">{org.email}</div>
                    </td>
                    <td className="p-3 text-sm">{org.address}</td>
                    <td className="p-3">
                      <Badge className={org.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {org.status === 'Active' ? '🟢' : '⚪'} {org.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm">{org.updated}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewOrg(org)} title="View Details">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditOrg(org)} title="Edit Organization">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Organization</DialogTitle>
            <DialogDescription>Create a new university organization entity</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
              <Input placeholder="e.g., School of Engineering" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Code</label>
              <Input placeholder="e.g., SOE (auto-suggested)" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea className="w-full p-2 border rounded-md" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                <Input />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                <Input />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <Input type="email" />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="active" defaultChecked />
              <label htmlFor="active" className="text-sm font-medium text-gray-700">Active</label>
            </div>
            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-md">
              System will auto-generate unique organization code and link this org to programs/campuses for reporting.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button className="nu-button-primary">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Organization Dialog */}
      <Dialog open={!!viewOrg} onOpenChange={() => setViewOrg(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Organization Details</DialogTitle>
            <DialogDescription>{viewOrg?.name}</DialogDescription>
          </DialogHeader>
          {viewOrg && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Organization Code</p>
                  <p className="text-base font-mono font-semibold">{viewOrg.code}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Organization Name</p>
                  <p className="text-base font-semibold">{viewOrg.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Contact Person</p>
                  <p className="text-base">{viewOrg.contact}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Phone</p>
                  <p className="text-base">{viewOrg.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-base">{viewOrg.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-600">Address</p>
                  <p className="text-base">{viewOrg.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <Badge className={viewOrg.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {viewOrg.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Updated</p>
                  <p className="text-base">{viewOrg.updated}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Organization Dialog */}
      <Dialog open={!!editOrg} onOpenChange={() => setEditOrg(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
            <DialogDescription>Update organization details</DialogDescription>
          </DialogHeader>
          {editOrg && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Code</label>
                <Input value={editOrg.code} disabled className="font-mono" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                <Input value={editOrg.name} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea className="w-full p-2 border rounded-md" rows={3} defaultValue={editOrg.address} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                  <Input value={editOrg.contact} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                  <Input value={editOrg.phone} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <Input type="email" value={editOrg.email} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full p-2 border rounded-md" defaultValue={editOrg.status}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setEditOrg(null)}>Cancel</Button>
                <Button onClick={handleSaveOrg} className="nu-button-primary">Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
