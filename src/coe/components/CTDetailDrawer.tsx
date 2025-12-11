import { useState } from 'react'
import { X, CheckCircle2, XCircle, Play, Clock, FileText, MessageSquare, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CreditTransferRequest } from '@/coe/data/creditTransfers'
import { canProceed, getStatusColor, getMappingPercentage } from '@/coe/utils/creditTransfer'
import CTCourseMapGrid from './CTCourseMapGrid'

interface CTDetailDrawerProps {
  request: CreditTransferRequest | null
  onClose: () => void
  onEvaluate: (id: string, mappings: CreditTransferRequest['mappings']) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onApply: (id: string) => void
}

export default function CTDetailDrawer({
  request,
  onClose,
  onEvaluate,
  onApprove,
  onReject,
  onApply
}: CTDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'mapping' | 'attachments' | 'audit'>('summary')
  const [notes, setNotes] = useState('')

  if (!request) return null

  const evalGating = canProceed(request, 'evaluate')
  const approveGating = canProceed(request, 'approve')
  const applyGating = canProceed(request, 'apply')

  const canEvaluate = evalGating.allowed
  const canApproveAction = approveGating.allowed
  const canApplyAction = applyGating.allowed
  const canRejectAction = request.status === 'Requested' || request.status === 'Under Review' || request.status === 'Evaluated'

  const mappingPct = getMappingPercentage(request.totals)

  return (
    <div className="fixed inset-y-0 right-0 w-2/3 bg-white shadow-2xl z-50 flex flex-col">
      <div className="bg-gradient-to-r from-deep-plum to-accent-purple text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">Transfer Request Details</h2>
          <p className="text-sm text-white/90">{request.requestId}</p>
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
              <div className="font-semibold text-sm">{request.studentName}</div>
              <div className="text-xs text-gray-600">{request.studentId}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-xs text-gray-600">Program & Campus</div>
              <div className="font-semibold text-sm">{request.programCode}</div>
              <div className="text-xs text-gray-600">{request.campus}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-xs text-gray-600">Status</div>
              <Badge className={getStatusColor(request.status)}>
                {request.status}
              </Badge>
            </CardContent>
          </Card>
        </div>

        <div className="border-b">
          <div className="flex gap-4 px-4">
            {(['summary', 'mapping', 'attachments', 'audit'] as const).map(tab => (
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
                {tab === 'mapping' && <><MessageSquare className="w-4 h-4 inline mr-1" />Mapping</>}
                {tab === 'attachments' && <><Paperclip className="w-4 h-4 inline mr-1" />Attachments</>}
                {tab === 'audit' && <><Clock className="w-4 h-4 inline mr-1" />Audit</>}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-deep-plum mb-2">Transfer Information</h3>
                <table className="w-full text-sm">
                  <tbody>
                    <tr><td className="font-medium py-1 w-48">Source University:</td><td>{request.sourceUniversity}</td></tr>
                    <tr><td className="font-medium py-1">Source System:</td><td>{request.sourceSystem}</td></tr>
                    <tr><td className="font-medium py-1">Source GPA:</td><td>{request.sourceGPA?.toFixed(2) || 'N/A'}</td></tr>
                    <tr><td className="font-medium py-1">Source Credits:</td><td>{request.sourceCredits}</td></tr>
                    <tr><td className="font-medium py-1">Evaluator:</td><td>{request.evaluator || 'Not assigned'}</td></tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="font-semibold text-deep-plum mb-2">Transfer Summary</h3>
                <div className="grid grid-cols-4 gap-3">
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-xs text-gray-600 mb-1">Source</div>
                      <div className="text-2xl font-bold text-deep-plum">{request.totals.sourceCredits}</div>
                      <div className="text-xs text-gray-600">credits</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-xs text-gray-600 mb-1">Mapped</div>
                      <div className="text-2xl font-bold text-green-600">{request.totals.mappedCredits}</div>
                      <div className="text-xs text-gray-600">credits</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-xs text-gray-600 mb-1">Waived</div>
                      <div className="text-2xl font-bold text-blue-600">{request.totals.waivedCredits}</div>
                      <div className="text-xs text-gray-600">credits</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-xs text-gray-600 mb-1">Coverage</div>
                      <div className="text-2xl font-bold text-purple-600">{mappingPct}%</div>
                      <div className="text-xs text-gray-600">mapped</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {request.notes && (
                <div>
                  <h3 className="font-semibold text-deep-plum mb-2">Notes</h3>
                  <div className="text-sm bg-amber-50 border border-amber-200 p-3 rounded-md">
                    {request.notes}
                  </div>
                </div>
              )}

              {(!evalGating.allowed || !approveGating.allowed || !applyGating.allowed) && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-md text-sm text-red-800">
                  <strong>⚠ Blocked:</strong>{' '}
                  {!evalGating.allowed && evalGating.reason}
                  {!approveGating.allowed && approveGating.reason}
                  {!applyGating.allowed && applyGating.reason}
                </div>
              )}
            </div>
          )}

          {activeTab === 'mapping' && (
            <div>
              <h3 className="font-semibold text-deep-plum mb-3">Course Equivalence Mapping</h3>
              <CTCourseMapGrid
                mappings={request.mappings}
                onUpdate={(mappings) => onEvaluate(request.id, mappings)}
                readOnly={request.status === 'Approved' || request.status === 'Applied' || request.status === 'Rejected'}
              />
            </div>
          )}

          {activeTab === 'attachments' && (
            <div className="space-y-3">
              <h3 className="font-semibold text-deep-plum mb-3">Attached Documents</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded border">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">transcript_{request.sourceUniversity.toLowerCase().replace(/\s/g, '_')}.pdf</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded border">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">course_descriptions_{request.requestId}.pdf</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Attachments are simulated for this static frontend.
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-3">
              <h3 className="font-semibold text-deep-plum mb-3">Audit Trail</h3>
              {request.audit.map((entry, idx) => (
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
        </div>
      </div>

      <div className="border-t p-4 bg-gray-50 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Close</Button>
        {canRejectAction && (
          <Button
            variant="outline"
            onClick={() => onReject(request.id)}
            className="text-red-600 hover:text-red-700"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
        )}
        {canApproveAction && (
          <Button
            onClick={() => onApprove(request.id)}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Approve
          </Button>
        )}
        {canApplyAction && (
          <Button
            onClick={() => onApply(request.id)}
            className="bg-deep-plum hover:bg-accent-purple"
          >
            <Play className="w-4 h-4 mr-2" />
            Apply
          </Button>
        )}
      </div>
    </div>
  )
}
