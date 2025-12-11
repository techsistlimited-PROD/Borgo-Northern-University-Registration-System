import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { X, CheckCircle, XCircle, Eye, Play } from 'lucide-react'
import CorrectionAuditTimeline from './CorrectionAuditTimeline'

interface CorrectionDetail {
  id: string
  requestId: string
  studentId: string
  studentName: string
  programCode: string
  courseCode: string
  courseName: string
  section: string
  semesterId: string
  examType: string
  type: string
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Applied'
  reason: string
  requestedBy: string
  requestDate: string
  reviewedBy: string | null
  reviewDate: string | null
  reviewNotes: string
  auditTrail: Array<{
    action: string
    by: string
    date: string
    notes: string
  }>
  originalMarks: {
    attendance: number | null
    ca: number | null
    midterm: number | null
    final: number | null
    total: number
    letterGrade: string
    gradePoint: number
  }
  requestedMarks: {
    attendance: number | null
    ca: number | null
    midterm: number | null
    final: number | null
    total: number
    letterGrade: string
    gradePoint: number
  }
  attachments?: string[]
}

interface CorrectionDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  correction: CorrectionDetail | null
  onApprove: (id: string, notes: string) => void
  onReject: (id: string, notes: string) => void
  onMarkUnderReview: (id: string, notes: string) => void
  onApplyChanges: (id: string, notes: string) => void
}

export default function CorrectionDetailDrawer({
  open,
  onOpenChange,
  correction,
  onApprove,
  onReject,
  onMarkUnderReview,
  onApplyChanges
}: CorrectionDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'marks' | 'audit' | 'actions'>('summary')
  const [actionNotes, setActionNotes] = useState('')

  if (!correction) return null

  const handleAction = (actionFn: (id: string, notes: string) => void) => {
    if (!actionNotes.trim()) {
      alert('Action notes are required')
      return
    }
    actionFn(correction.id, actionNotes)
    setActionNotes('')
    onOpenChange(false)
  }

  const canApply = correction.status === 'Approved'
  const canApproveReject = correction.status === 'Submitted' || correction.status === 'Under Review'

  const getDiff = (original: number | null, requested: number | null) => {
    if (original === requested) return null
    const diff = (requested || 0) - (original || 0)
    return diff > 0 ? `+${diff}` : `${diff}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle>Correction Request - {correction.requestId}</DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                {correction.studentName} ({correction.studentId}) • {correction.courseCode} - {correction.courseName}
              </p>
            </div>
            <Badge
              className={
                correction.status === 'Approved'
                  ? 'bg-green-100 text-green-700'
                  : correction.status === 'Rejected'
                  ? 'bg-red-100 text-red-700'
                  : correction.status === 'Under Review'
                  ? 'bg-amber-100 text-amber-700'
                  : correction.status === 'Applied'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700'
              }
            >
              {correction.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="border-b mb-4">
          <div className="flex gap-4">
            {(['summary', 'marks', 'audit', 'actions'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-deep-plum border-b-2 border-deep-plum'
                    : 'text-gray-600 hover:text-deep-plum'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600">Program</label>
                  <p className="text-sm font-medium">{correction.programCode}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Section</label>
                  <p className="text-sm font-medium">Section {correction.section}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Exam Type</label>
                  <p className="text-sm font-medium">{correction.examType}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Correction Type</label>
                  <Badge variant="outline">{correction.type}</Badge>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Requested By</label>
                  <p className="text-sm font-medium">{correction.requestedBy}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Requested On</label>
                  <p className="text-sm font-medium">{correction.requestDate}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600">Reason</label>
                <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">{correction.reason}</p>
              </div>

              {correction.reviewedBy && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm text-deep-plum mb-2">Review Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Reviewed By</label>
                      <p className="text-sm font-medium">{correction.reviewedBy}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Reviewed On</label>
                      <p className="text-sm font-medium">{correction.reviewDate}</p>
                    </div>
                  </div>
                  {correction.reviewNotes && (
                    <div className="mt-3">
                      <label className="text-xs font-medium text-gray-600">Review Notes</label>
                      <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">{correction.reviewNotes}</p>
                    </div>
                  )}
                </div>
              )}

              {correction.attachments && correction.attachments.length > 0 && (
                <div className="border-t pt-4">
                  <label className="text-xs font-medium text-gray-600 mb-2 block">Attachments</label>
                  <div className="flex flex-wrap gap-2">
                    {correction.attachments.map((file, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {file}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'marks' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 border font-semibold">Component</th>
                      <th className="text-right p-3 border font-semibold">Original</th>
                      <th className="text-right p-3 border font-semibold">Requested</th>
                      <th className="text-right p-3 border font-semibold">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 border">Attendance</td>
                      <td className="p-3 border text-right">{correction.originalMarks.attendance ?? '-'}</td>
                      <td className="p-3 border text-right font-medium">
                        {correction.requestedMarks.attendance ?? '-'}
                      </td>
                      <td className="p-3 border text-right">
                        {getDiff(correction.originalMarks.attendance, correction.requestedMarks.attendance) && (
                          <Badge
                            variant="outline"
                            className={
                              (correction.requestedMarks.attendance ?? 0) > (correction.originalMarks.attendance ?? 0)
                                ? 'text-green-600 border-green-600'
                                : 'text-red-600 border-red-600'
                            }
                          >
                            {getDiff(correction.originalMarks.attendance, correction.requestedMarks.attendance)}
                          </Badge>
                        )}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 border">CA</td>
                      <td className="p-3 border text-right">{correction.originalMarks.ca ?? '-'}</td>
                      <td className="p-3 border text-right font-medium">
                        {correction.requestedMarks.ca ?? '-'}
                      </td>
                      <td className="p-3 border text-right">
                        {getDiff(correction.originalMarks.ca, correction.requestedMarks.ca) && (
                          <Badge
                            variant="outline"
                            className={
                              (correction.requestedMarks.ca ?? 0) > (correction.originalMarks.ca ?? 0)
                                ? 'text-green-600 border-green-600'
                                : 'text-red-600 border-red-600'
                            }
                          >
                            {getDiff(correction.originalMarks.ca, correction.requestedMarks.ca)}
                          </Badge>
                        )}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 border">Midterm</td>
                      <td className="p-3 border text-right">{correction.originalMarks.midterm ?? '-'}</td>
                      <td className="p-3 border text-right font-medium">
                        {correction.requestedMarks.midterm ?? '-'}
                      </td>
                      <td className="p-3 border text-right">
                        {getDiff(correction.originalMarks.midterm, correction.requestedMarks.midterm) && (
                          <Badge
                            variant="outline"
                            className={
                              (correction.requestedMarks.midterm ?? 0) > (correction.originalMarks.midterm ?? 0)
                                ? 'text-green-600 border-green-600'
                                : 'text-red-600 border-red-600'
                            }
                          >
                            {getDiff(correction.originalMarks.midterm, correction.requestedMarks.midterm)}
                          </Badge>
                        )}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 border">Final</td>
                      <td className="p-3 border text-right">{correction.originalMarks.final ?? '-'}</td>
                      <td className="p-3 border text-right font-medium">
                        {correction.requestedMarks.final ?? '-'}
                      </td>
                      <td className="p-3 border text-right">
                        {getDiff(correction.originalMarks.final, correction.requestedMarks.final) && (
                          <Badge
                            variant="outline"
                            className={
                              (correction.requestedMarks.final ?? 0) > (correction.originalMarks.final ?? 0)
                                ? 'text-green-600 border-green-600'
                                : 'text-red-600 border-red-600'
                            }
                          >
                            {getDiff(correction.originalMarks.final, correction.requestedMarks.final)}
                          </Badge>
                        )}
                      </td>
                    </tr>
                    <tr className="bg-gray-100 font-semibold">
                      <td className="p-3 border">Total</td>
                      <td className="p-3 border text-right">{correction.originalMarks.total.toFixed(2)}</td>
                      <td className="p-3 border text-right">{correction.requestedMarks.total.toFixed(2)}</td>
                      <td className="p-3 border text-right">
                        <Badge
                          variant="outline"
                          className={
                            correction.requestedMarks.total > correction.originalMarks.total
                              ? 'text-green-600 border-green-600'
                              : correction.requestedMarks.total < correction.originalMarks.total
                              ? 'text-red-600 border-red-600'
                              : ''
                          }
                        >
                          {getDiff(correction.originalMarks.total, correction.requestedMarks.total) || '0'}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 border font-semibold">Letter Grade</td>
                      <td className="p-3 border text-right">{correction.originalMarks.letterGrade}</td>
                      <td className="p-3 border text-right font-medium">{correction.requestedMarks.letterGrade}</td>
                      <td className="p-3 border text-right">
                        {correction.originalMarks.letterGrade !== correction.requestedMarks.letterGrade && (
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            Changed
                          </Badge>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 border font-semibold">Grade Point</td>
                      <td className="p-3 border text-right">{correction.originalMarks.gradePoint.toFixed(2)}</td>
                      <td className="p-3 border text-right font-medium">
                        {correction.requestedMarks.gradePoint.toFixed(2)}
                      </td>
                      <td className="p-3 border text-right">
                        {correction.originalMarks.gradePoint !== correction.requestedMarks.gradePoint && (
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            Changed
                          </Badge>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div>
              <CorrectionAuditTimeline auditTrail={correction.auditTrail} />
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Action Notes (Required)</label>
                <Textarea
                  value={actionNotes}
                  onChange={e => setActionNotes(e.target.value)}
                  placeholder="Enter notes for this action..."
                  rows={4}
                  className="w-full"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Notes will be recorded in the audit timeline
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {canApproveReject && (
                  <>
                    <Button
                      onClick={() => handleAction(onApprove)}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleAction(onReject)}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleAction(onMarkUnderReview)}
                      className="bg-amber-600 text-white hover:bg-amber-700"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Mark Under Review
                    </Button>
                  </>
                )}
                {canApply && (
                  <Button
                    onClick={() => handleAction(onApplyChanges)}
                    className="bg-gradient-to-r from-deep-plum to-accent-purple text-white hover:opacity-90"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Apply Changes
                  </Button>
                )}
                {!canApproveReject && !canApply && (
                  <p className="text-sm text-gray-600 italic">
                    No actions available for current status: {correction.status}
                  </p>
                )}
              </div>

              {correction.status === 'Locked' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
                  ⚠️ Section is locked. This is a controller override for demonstration purposes.
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
