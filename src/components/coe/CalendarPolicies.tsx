import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Eye, Edit } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { useState } from 'react'

export default function CalendarPolicies() {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPolicyModal, setShowPolicyModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const calendarItems = [
    { 
      type: 'Paper Setting Deadline', 
      startDate: '2025-10-20', 
      endDate: '2025-10-24', 
      notes: 'All midterm questions locked by dept heads', 
      status: 'Published',
      statusColor: 'bg-green-100 text-green-800'
    },
    { 
      type: 'Exam Window (Final)', 
      startDate: '2025-11-01', 
      endDate: '2025-11-12', 
      notes: 'Final Term – All campuses', 
      status: 'Published',
      statusColor: 'bg-green-100 text-green-800'
    },
    { 
      type: 'Result Publish', 
      startDate: '2025-12-02', 
      endDate: '2025-12-02', 
      notes: 'CSE/BBA must publish within 48h of board approval', 
      status: 'Draft',
      statusColor: 'bg-gray-100 text-gray-800'
    },
    { 
      type: 'Recheck Window', 
      startDate: '2025-12-10', 
      endDate: '2025-12-17', 
      notes: 'Students may request recheck within 7 days', 
      status: 'Published',
      statusColor: 'bg-green-100 text-green-800'
    }
  ]

  const policies = [
    {
      title: 'Eligibility Policy',
      description: 'Min class attendance 70%, no finance hold, registered this semester.',
      action: 'View JSON Rule'
    },
    {
      title: 'Malpractice Policy',
      description: 'Possession of unauthorized material → script cancellation, possible 1-term ban.',
      action: 'View Policy PDF'
    },
    {
      title: 'Recheck Policy',
      description: 'Students may request recheck within 7 working days of publication. Fee: BDT 1,000.',
      action: 'Edit Window'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Calendar & Policies</h1>
          <p className="text-sm text-gray-600 mt-1">Control the official exam calendar and policies</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Calendar
          </Button>
          <Button className="nu-button-primary" onClick={() => alert('Publishing calendar... This will make all draft items visible to faculty and students.')}>
            Publish Calendar
          </Button>
          <Badge className="bg-green-100 text-green-800">Published v2</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Calendar Timeline</CardTitle>
              <CardDescription>Manage exam calendar items and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Item Type</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Start Date</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">End Date</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Notes</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calendarItems.map((item, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm font-medium">{item.type}</td>
                        <td className="p-3 text-sm">{item.startDate}</td>
                        <td className="p-3 text-sm">{item.endDate}</td>
                        <td className="p-3 text-sm text-gray-600">{item.notes}</td>
                        <td className="p-3">
                          <Badge className={item.statusColor}>{item.status}</Badge>
                        </td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedItem(item); setShowEditModal(true) }}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Policy Sidebar</CardTitle>
              <CardDescription>Examination policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {policies.map((policy, idx) => (
                <Card key={idx} className="border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">{policy.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-600 mb-3">{policy.description}</p>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => { setSelectedItem(policy); setShowPolicyModal(true) }}>
                      <Eye className="w-3 h-3 mr-2" />
                      {policy.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Calendar Item</DialogTitle>
            <DialogDescription>Modify calendar item dates and notes</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><strong>Type:</strong> {selectedItem?.type}</div>
            <div><strong>Start:</strong> {selectedItem?.startDate}</div>
            <div><strong>End:</strong> {selectedItem?.endDate}</div>
            <div className="p-3 bg-gray-50 rounded-md">Notes: {selectedItem?.notes}</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>Close</Button>
            <Button className="nu-button-primary">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPolicyModal} onOpenChange={setShowPolicyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Policy Viewer</DialogTitle>
            <DialogDescription>View full policy details</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <h3 className="font-semibold">{selectedItem?.title}</h3>
            <p className="text-sm text-gray-600">{selectedItem?.description}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPolicyModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
