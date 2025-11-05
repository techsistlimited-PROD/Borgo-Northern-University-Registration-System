import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, FileText, Download, CheckCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { useState } from 'react'

export default function CertificatesQueue() {
  const [showReqPreview, setShowReqPreview] = useState(false)
  const [showDocModal, setShowDocModal] = useState(false)
  const [selectedReq, setSelectedReq] = useState<any>(null)
  const requests = [
    { 
      id: 'DOC-2025-114', 
      name: 'Ayesha Rahman', 
      studentId: 'CSE-25-011234', 
      program: 'BSc CSE', 
      type: 'Official Transcript', 
      payment: 'Paid',
      status: 'Pending Print',
      statusColor: 'bg-amber-100 text-amber-800'
    },
    { 
      id: 'DOC-2025-127', 
      name: 'Nishat Sultana', 
      studentId: 'BBA-25-004412', 
      program: 'BBA', 
      type: 'Provisional Certificate', 
      payment: 'Paid',
      status: 'Ready for Pickup',
      statusColor: 'bg-green-100 text-green-800'
    },
    { 
      id: 'DOC-2025-131', 
      name: 'Tanvir Ahmed', 
      studentId: 'CSE-25-011255', 
      program: 'BSc CSE', 
      type: 'Medium of Instruction', 
      payment: 'Paid',
      status: 'In Progress',
      statusColor: 'bg-blue-100 text-blue-800'
    }
  ]

  const gazettes = [
    { semester: 'Fall 2025', program: 'BSc CSE', publishTime: '02 Dec 2025 11:14 AM', approvedBy: 'Exam Controller, Registrar', status: 'Published' },
    { semester: 'Fall 2025', program: 'BBA', publishTime: '02 Dec 2025 14:22 AM', approvedBy: 'Exam Controller, Registrar', status: 'Published' },
    { semester: 'Summer 2025', program: 'LLB (Hons)', publishTime: '15 Aug 2025 10:05 AM', approvedBy: 'Exam Controller, Registrar', status: 'Published' }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Certificates & Documents</h1>
          <p className="text-sm text-gray-600 mt-1">Manage transcript and certificate requests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Request Type</label>
          <select className="w-full p-2 border rounded-md text-sm">
            <option>All Types</option>
            <option>Official Transcript</option>
            <option>Provisional Certificate</option>
            <option>Medium of Instruction</option>
            <option>Character Certificate</option>
            <option>Migration Certificate</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select className="w-full p-2 border rounded-md text-sm">
            <option>All Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Ready for Pickup</option>
            <option>Delivered</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input type="text" placeholder="Student ID or name..." className="w-full p-2 border rounded-md text-sm" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Request Queue</CardTitle>
          <CardDescription>Process transcript and certificate requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Req ID</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Student Name</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">University ID</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Program</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Type</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Payment</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-mono">{req.id}</td>
                    <td className="p-3 text-sm">{req.name}</td>
                    <td className="p-3 text-sm font-mono">{req.studentId}</td>
                    <td className="p-3 text-sm">{req.program}</td>
                    <td className="p-3 text-sm">{req.type}</td>
                    <td className="p-3">
                      <Badge className="bg-green-100 text-green-800">{req.payment}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={req.statusColor}>{req.status}</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedReq(req); setShowReqPreview(true) }}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedReq(req); setShowDocModal(true) }}>
                          <FileText className="w-4 h-4" />
                        </Button>
                        {req.status === 'Ready for Pickup' && (
                          <Button variant="ghost" size="sm" onClick={() => alert('Marked as collected for ' + req.name)}>
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gazette Archive</CardTitle>
          <CardDescription>Published results official record</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Semester</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Program</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Publish Time</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Approved By</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gazettes.map((gazette, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-medium">{gazette.semester}</td>
                    <td className="p-3 text-sm">{gazette.program}</td>
                    <td className="p-3 text-sm">{gazette.publishTime}</td>
                    <td className="p-3 text-sm text-gray-600">{gazette.approvedBy}</td>
                    <td className="p-3">
                      <Badge className="bg-blue-100 text-blue-800">{gazette.status}</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-1" />
                          View PDF
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Excel
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

      <Dialog open={showReqPreview} onOpenChange={setShowReqPreview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Preview</DialogTitle>
            <DialogDescription>Preview document request details</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <div><strong>Request ID:</strong> {selectedReq?.id}</div>
            <div><strong>Name:</strong> {selectedReq?.name}</div>
            <div><strong>Program:</strong> {selectedReq?.program}</div>
            <div><strong>Type:</strong> {selectedReq?.type}</div>
            <div><strong>Status:</strong> <Badge className={selectedReq?.statusColor}>{selectedReq?.status}</Badge></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReqPreview(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDocModal} onOpenChange={setShowDocModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Document Viewer</DialogTitle>
            <DialogDescription>Preview the requested document</DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-gray-50 rounded-md border">[Document preview would appear here in production]</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDocModal(false)}>Close</Button>
            <Button className="nu-button-primary">Download</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
