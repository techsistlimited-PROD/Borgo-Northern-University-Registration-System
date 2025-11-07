import { useState } from 'react'
import { X, CheckCircle2, XCircle, Clock, FileText, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CourseExemptionRequest, RequestedCourse } from '@/coe/data/courseExemptions'
import { canProceed, getStatusColor, computeTotalRequestedCredits, computeTotalExemptedCredits } from '@/coe/utils/courseExemption'
import CECoursePicker from './CECoursePicker'

interface CEDetailDrawerProps {
  request: CourseExemptionRequest | null
  onClose: () => void
  onEvaluate: (id: string, exemptedCourses: RequestedCourse[]) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export default function CEDetailDrawer({
  request,
  onClose,
  onEvaluate,
  onApprove,
  onReject
}: CEDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'courses' | 'audit'>('summary')

  if (!request) return null

  const approveGating = canProceed(request, 'approve')
  const canApproveAction = approveGating.allowed
  const canRejectAction = request.status === 'Requested' || request.status === 'Under Review' || request.status === 'Evaluated'

  const totalRequested = computeTotalRequestedCredits(request)
  const totalExempted = computeTotalExemptedCredits(request)

  return (
    <div className="fixed inset-y-0 right-0 w-2/3 bg-white shadow-2xl z-50 flex flex-col">
      <div className="bg-gradient-to-r from-deep-plum to-accent-purple text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">Exemption Request Details</h2>
          <p className="text-sm text-white/90">{request.studentId}</p>
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
            {(['summary', 'courses', 'audit'] as const).map(tab => (
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
                {tab === 'courses' && <><MessageSquare className="w-4 h-4 inline mr-1" />Courses</>}
                {tab === 'audit' && <><Clock className="w-4 h-4 inline mr-1" />Audit</>}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-deep-plum mb-2">Request Information</h3>
                <table className="w-full text-sm">
                  <tbody>
                    <tr><td className="font-medium py-1 w-48">Semester:</td><td>{request.semester}</td></tr>
                    <tr><td className="font-medium py-1">Reason:</td><td>{request.reason}</td></tr>
                    <tr><td className="font-medium py-1">Requested At:</td><td>{request.requestedAt}</td></tr>
                    <tr><td className="font-medium py-1">Updated At:</td><td>{request.updatedAt}</td></tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="font-semibold text-deep-plum mb-2">Credit Summary</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-xs text-gray-600 mb-1">Total Requested</div>
                      <div className="text-2xl font-bold text-deep-plum">{totalRequested}</div>
                      <div className="text-xs text-gray-600">credits</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-xs text-gray-600 mb-1">Total Exempted</div>
                      <div className="text-2xl font-bold text-green-600">{totalExempted}</div>
                      <div className="text-xs text-gray-600">credits</div>
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

              {!approveGating.allowed && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-md text-sm text-red-800">
                  <strong>⚠ Blocked:</strong> {approveGating.reason}
                </div>
              )}
            </div>
          )}

          {activeTab === 'courses' && (
            <div>
              <h3 className="font-semibold text-deep-plum mb-3">Course Exemption Selection</h3>
              <CECoursePicker
                requestedCourses={request.requestedCourses}
                exemptedCourses={request.exemptedCourses}
                onUpdate={(exemptedCourses) => onEvaluate(request.id, exemptedCourses)}
                readOnly={request.status === 'Approved' || request.status === 'Applied' || request.status === 'Rejected'}
              />
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
      </div>
    </div>
  )
}
