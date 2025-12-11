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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Calendar Item</DialogTitle>
            <DialogDescription>Modify calendar item dates and notes</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Type</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                defaultValue={selectedItem?.type}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md"
                  defaultValue={selectedItem?.startDate}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md"
                  defaultValue={selectedItem?.endDate}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                defaultValue={selectedItem?.notes}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="w-full p-2 border rounded-md" defaultValue={selectedItem?.status}>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button className="nu-button-primary" onClick={() => {
              setShowEditModal(false)
              alert('Calendar item updated successfully')
            }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Calendar Item</DialogTitle>
            <DialogDescription>Add a new item to the exam calendar</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Type</label>
              <select className="w-full p-2 border rounded-md">
                <option value="">Select type...</option>
                <option value="Paper Setting Deadline">Paper Setting Deadline</option>
                <option value="Exam Window (Midterm)">Exam Window (Midterm)</option>
                <option value="Exam Window (Final)">Exam Window (Final)</option>
                <option value="Result Publish">Result Publish</option>
                <option value="Recheck Window">Recheck Window</option>
                <option value="Grade Appeal Deadline">Grade Appeal Deadline</option>
                <option value="Convocation">Convocation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Instructions</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Add any relevant notes or instructions..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Status</label>
              <select className="w-full p-2 border rounded-md" defaultValue="Draft">
                <option value="Draft">Draft (not visible to others)</option>
                <option value="Published">Published (visible to all)</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button className="nu-button-primary" onClick={() => {
              setShowCreateModal(false)
              alert('Calendar item created successfully')
            }}>Create Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPolicyModal} onOpenChange={setShowPolicyModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedItem?.title}</DialogTitle>
            <DialogDescription>Policy details and rules</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">{selectedItem?.description}</p>
            </div>

            {selectedItem?.title === 'Eligibility Policy' && (
              <div className="border rounded-md p-4">
                <h4 className="font-medium text-sm mb-2">Rule Details (JSON)</h4>
                <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
{`{
  "attendance": { "min": 70, "unit": "%" },
  "finance": { "holds": false },
  "registration": { "current_semester": true },
  "academic": { "probation_override": false }
}`}
                </pre>
              </div>
            )}

            {selectedItem?.title === 'Malpractice Policy' && (
              <div className="border rounded-md p-4">
                <h4 className="font-medium text-sm mb-3">Actions by Severity</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="font-medium text-red-600">•</span>
                    <span>Unauthorized device: Script cancellation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-medium text-red-600">•</span>
                    <span>Copying/Cheating: 1-term exam ban + script cancellation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-medium text-red-600">•</span>
                    <span>Repeat offense: Permanent expulsion from university</span>
                  </li>
                </ul>
              </div>
            )}

            {selectedItem?.title === 'Recheck Policy' && (
              <div className="border rounded-md p-4">
                <h4 className="font-medium text-sm mb-3">Recheck Window Configuration</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Days After Publication</label>
                    <input type="number" className="w-full p-2 border rounded-md" defaultValue="7" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recheck Fee (BDT)</label>
                    <input type="number" className="w-full p-2 border rounded-md" defaultValue="1000" />
                  </div>
                  <Button className="nu-button-primary w-full" onClick={() => {
                    setShowPolicyModal(false)
                    alert('Recheck policy updated')
                  }}>
                    Update Policy
                  </Button>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPolicyModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
