import { useState } from 'react'
import { X, CheckCircle2, XCircle, Play, Clock, FileText, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { AdmissionAction } from '@/coe/data/admissionActions'
import { canApproveOrApply, getActionTypeLabel, getStatusColor, formatRequestedChange } from '@/coe/utils/admissionActions'

interface ActionDetailDrawerProps {
  action: AdmissionAction | null
  onClose: () => void
  onApprove: (id: string) => void
  onReject: (id: string, reason: string) => void
  onApply: (id: string) => void
}

export default function ActionDetailDrawer({
  action,
  onClose,
  onApprove,
  onReject,
  onApply
}: ActionDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'audit' | 'notes'>('summary')
  const [notes, setNotes] = useState('')
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  if (!action) return null

  const gating = canApproveOrApply(action)
  const isBlocked = !gating.allowed

  const canApprove = (action.status === 'Requested' || action.status === 'Under Review') && !isBlocked
  const canReject = action.status === 'Requested' || action.status === 'Under Review'
  const canApplyAction = action.status === 'Approved' && !isBlocked

  const handleReject = () => {
    if (!rejectReason.trim() || rejectReason.length < 10) {
      alert('Rejection reason must be at least 10 characters.')
      return
    }
    onReject(action.id, rejectReason)
    setShowRejectDialog(false)
    setRejectReason('')
  }

  return (
    <>
      <div className="fixed inset-y-0 right-0 w-2/3 bg-white shadow-2xl z-50 flex flex-col">
        <div className="bg-gradient-to-r from-deep-plum to-accent-purple text-white p-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">Action Details</h2>
            <p className="text-sm text-white/90">{action.id}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 border-b">
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Student</div>
                <div className="font-semibold text-sm">{action.studentName}</div>
                <div className="text-xs text-gray-600">{action.studentId}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Program & Campus</div>
                <div className="font-semibold text-sm">{action.currentProgram}</div>
                <div className="text-xs text-gray-600">{action.currentCampus} • {action.currentBatch}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Status</div>
                <Badge className={getStatusColor(action.status)}>
                  {action.status}
                </Badge>
              </CardContent>
            </Card>
          </div>

          <div className="border-b">
            <div className="flex gap-4 px-4">
              {(['summary', 'audit', 'notes'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-deep-plum border-b-2 border-deep-plum'
                      : 'text-gray-600 hover:text-deep-plum'
                  }`}
                >
                  {tab === 'summary' && <><FileText className="w-4 h-4 inline mr-1" />Summary</>}
                  {tab === 'audit' && <><Clock className="w-4 h-4 inline mr-1" />Audit</>}
                  {tab === 'notes' && <><MessageSquare className="w-4 h-4 inline mr-1" />Notes</>}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4">
            {activeTab === 'summary' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-deep-plum mb-2">Action Type</h3>
                  <Badge variant="outline">{getActionTypeLabel(action.actionType)}</Badge>
                </div>

                <div>
                  <h3 className="font-semibold text-deep-plum mb-2">Requested Change</h3>
                  <div className="text-sm bg-gray-50 p-3 rounded-md">
                    {formatRequestedChange(action)}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-deep-plum mb-2">Details</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      {action.requestedChange.from && (
                        <tr><td className="font-medium py-1">From:</td><td>{action.requestedChange.from}</td></tr>
                      )}
                      {action.requestedChange.to && (
                        <tr><td className="font-medium py-1">To:</td><td>{action.requestedChange.to}</td></tr>
                      )}
                      {action.requestedChange.effective && (
                        <tr><td className="font-medium py-1">Effective:</td><td>{action.requestedChange.effective}</td></tr>
                      )}
                      {action.requestedChange.reason && (
                        <tr><td className="font-medium py-1">Reason:</td><td>{action.requestedChange.reason}</td></tr>
                      )}
                      {action.requestedChange.lastActive && (
                        <tr><td className="font-medium py-1">Last Active:</td><td>{action.requestedChange.lastActive}</td></tr>
                      )}
                      {action.requestedChange.returning && (
                        <tr><td className="font-medium py-1">Returning:</td><td>{action.requestedChange.returning}</td></tr>
                      )}
                      {action.requestedChange.phone && (
                        <tr><td className="font-medium py-1">Phone:</td><td>{action.requestedChange.phone}</td></tr>
                      )}
                      {action.requestedChange.email && (
                        <tr><td className="font-medium py-1">Email:</td><td>{action.requestedChange.email}</td></tr>
                      )}
                      {action.requestedChange.presentAddress && (
                        <tr><td className="font-medium py-1">Address:</td><td>{action.requestedChange.presentAddress}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {action.attachments.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-deep-plum mb-2">Attachments</h3>
                    <div className="space-y-1">
                      {action.attachments.map((file, idx) => (
                        <div key={idx} className="text-sm bg-blue-50 px-3 py-2 rounded flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          {file}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-deep-plum mb-2">Remarks</h3>
                  <div className="text-sm bg-amber-50 border border-amber-200 p-3 rounded-md">
                    {action.remarks || 'No remarks'}
                  </div>
                </div>

                {isBlocked && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded-md text-sm text-red-800">
                    <strong>⚠ Blocked:</strong> {gating.reason}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="space-y-3">
                <h3 className="font-semibold text-deep-plum mb-3">Action Timeline</h3>
                {action.audit.map((entry, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="w-2 h-2 bg-deep-plum rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge className="text-xs">{entry.action}</Badge>
                          <div className="text-sm text-gray-600 mt-1">by {entry.by}</div>
                          <div className="text-xs text-gray-500 mt-1">{entry.remarks}</div>
                        </div>
                        <div className="text-xs text-gray-500">{entry.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'notes' && (
              <div>
                <h3 className="font-semibold text-deep-plum mb-3">Internal Notes</h3>
                <textarea
                  className="w-full border rounded-md p-3 text-sm min-h-32"
                  placeholder="Add internal notes (session-only)..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <div className="text-xs text-gray-500 mt-2">
                  Notes are session-only and will reset on page refresh.
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t p-4 bg-gray-50 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          {canReject && (
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(true)}
              className="text-red-600 hover:text-red-700"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
          )}
          {canApprove && (
            <Button
              onClick={() => onApprove(action.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve
            </Button>
          )}
          {canApplyAction && (
            <Button
              onClick={() => onApply(action.id)}
              className="bg-deep-plum hover:bg-accent-purple"
            >
              <Play className="w-4 h-4 mr-2" />
              Apply
            </Button>
          )}
        </div>
      </div>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Action Request</DialogTitle>
            <DialogDescription>Provide a detailed reason for rejection (min 10 characters).</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Enter rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
            <Button onClick={handleReject} className="bg-red-600 hover:bg-red-700">
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
