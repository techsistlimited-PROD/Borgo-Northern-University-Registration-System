import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Lock, Unlock, Eye, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

export default function PublishResults() {
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [selectedResult, setSelectedResult] = useState<any>(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  const results = [
    { 
      scope: 'BSc CSE · Fall 2025', 
      sections: 24, 
      status: 'Ready', 
      lastPublish: '-',
      blockedCount: 0,
      statusColor: 'bg-green-100 text-green-800'
    },
    { 
      scope: 'BBA · Fall 2025', 
      sections: 14, 
      status: 'Published', 
      lastPublish: '02 Dec 2025 · 11:14 AM',
      blockedCount: 2,
      statusColor: 'bg-blue-100 text-blue-800'
    },
    { 
      scope: 'LLB (Hons) · Fall 2025', 
      sections: 12, 
      status: 'Draft', 
      lastPublish: '-',
      blockedCount: 1,
      statusColor: 'bg-gray-100 text-gray-800'
    }
  ]

  const handlePublish = (result: any) => {
    setSelectedResult(result)
    setShowPublishModal(true)
  }

  const confirmPublish = () => {
    setShowPublishModal(false)
    alert('Results published successfully! Faculty editing has been frozen and timestamp logged.')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Publish Results</h1>
          <p className="text-sm text-gray-600 mt-1">Publish examination results and manage student result blocks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
          <select className="w-full p-2 border rounded-md">
            <option>Fall 2025</option>
            <option>Summer 2025</option>
            <option>Spring 2025</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
          <select className="w-full p-2 border rounded-md">
            <option>All Programs</option>
            <option>BSc CSE</option>
            <option>BBA</option>
            <option>LLB</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Publish Scope</label>
          <select className="w-full p-2 border rounded-md">
            <option>Full Program</option>
            <option>Single Section</option>
            <option>Single Course</option>
          </select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Result Publication Overview</CardTitle>
          <CardDescription>Manage result publication status and student blocks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Scope</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Sections</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Publish Status</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Last Publish Time</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Result Blocks</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-medium">{result.scope}</td>
                    <td className="p-3 text-sm">{result.sections}</td>
                    <td className="p-3">
                      <Badge className={result.statusColor}>{result.status}</Badge>
                    </td>
                    <td className="p-3 text-sm text-gray-600">{result.lastPublish}</td>
                    <td className="p-3">
                      {result.blockedCount > 0 ? (
                        <Badge className="bg-red-100 text-red-800">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {result.blockedCount} blocked
                        </Badge>
                      ) : (
                        <span className="text-sm text-gray-500">None</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {result.status === 'Ready' && (
                          <Button 
                            className="nu-button-primary" 
                            size="sm"
                            onClick={() => handlePublish(result)}
                          >
                            Publish Now
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedResult(result)
                            setShowBlockModal(true)
                          }}
                        >
                          <Lock className="w-4 h-4" />
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

      <Dialog open={showPublishModal} onOpenChange={setShowPublishModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Results</DialogTitle>
            <DialogDescription>
              Confirm publication of examination results
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-900">Important Notice</p>
                  <p className="text-amber-700 mt-1">
                    This will freeze teacher edit rights for these sections and log the publish timestamp for compliance.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Scope:</span>
                <span className="font-medium">{selectedResult?.scope}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Sections:</span>
                <span className="font-medium">{selectedResult?.sections}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Status:</span>
                <Badge className={selectedResult?.statusColor}>{selectedResult?.status}</Badge>
              </div>
            </div>

            <div className="p-3 bg-mint-green/20 rounded-md">
              <p className="text-sm text-gray-700">
                ✓ Freeze Faculty Editing<br />
                ✓ Log Publish Timestamp<br />
                ✓ Make Results Visible to Students
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPublishModal(false)}>
              Cancel
            </Button>
            <Button className="nu-button-primary" onClick={confirmPublish}>
              Confirm & Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showBlockModal} onOpenChange={setShowBlockModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block / Unblock Student Result</DialogTitle>
            <DialogDescription>
              Prevent specific students from viewing their results
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
              <input 
                type="text" 
                placeholder="Enter student ID..." 
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Block Reason</label>
              <select className="w-full p-2 border rounded-md">
                <option>Select reason...</option>
                <option>Finance Dues</option>
                <option>Malpractice Hold</option>
                <option>Registrar Hold</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea 
                className="w-full p-2 border rounded-md" 
                rows={3}
                placeholder="Enter additional notes..."
              />
            </div>

            <div className="p-3 bg-gray-50 rounded-md text-xs text-gray-600">
              This action will be logged: "Result blocked for [Student ID] by Controller on [Timestamp]. Reason: [Selected Reason]."
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlockModal(false)}>
              Cancel
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Block Result
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
