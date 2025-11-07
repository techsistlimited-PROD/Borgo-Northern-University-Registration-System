import { useState } from 'react'
import { X, Printer, Clock, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CertificateRequest } from '@/coe/data/certificates'
import { getTranscriptByStudent } from '@/coe/data/transcripts'
import CertPrintTemplate from './CertPrintTemplate'

interface CertPreviewDrawerProps {
  request: CertificateRequest | null
  onClose: () => void
}

export default function CertPreviewDrawer({ request, onClose }: CertPreviewDrawerProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'history' | 'notes'>('preview')
  const [notes, setNotes] = useState('')

  if (!request) return null

  const transcript = getTranscriptByStudent(request.studentId)

  const handlePrint = () => {
    window.print()
  }

  const statusTimeline = [
    { status: 'Requested', date: request.requestDate, actor: 'Student Portal' },
    ...(request.processedDate ? [{ status: 'Processing', date: request.processedDate, actor: request.processedBy || 'COE Office' }] : []),
    ...(request.readyDate ? [{ status: 'Ready', date: request.readyDate, actor: request.processedBy || 'COE Office' }] : []),
    ...(request.collectionDate ? [{ status: 'Collected', date: request.collectionDate, actor: request.collectedBy || 'Student' }] : []),
    ...(request.rejectedReason ? [{ status: 'Rejected', date: request.processedDate || request.requestDate, actor: request.processedBy || 'COE Office' }] : [])
  ]

  return (
    <div className="fixed inset-y-0 right-0 w-2/3 bg-white shadow-2xl z-50 flex flex-col print:hidden">
      <div className="bg-gradient-to-r from-deep-plum to-accent-purple text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">Certificate Preview</h2>
          <p className="text-sm text-white/90">{request.requestId}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 border-b print:hidden">
          <Card>
            <CardContent className="p-3">
              <div className="text-xs text-gray-600">Student</div>
              <div className="font-semibold text-sm">{request.studentName}</div>
              <div className="text-xs text-gray-600">{request.studentId}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-xs text-gray-600">Program</div>
              <div className="font-semibold text-sm">{request.programCode}</div>
              <div className="text-xs text-gray-600">{request.campus} Campus</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-xs text-gray-600">Academic</div>
              <div className="font-semibold text-sm">{request.creditsCompleted} Credits</div>
              <div className="text-xs text-gray-600">CGPA: {request.cgpa?.toFixed(2) || 'N/A'}</div>
            </CardContent>
          </Card>
        </div>

        <div className="border-b print:hidden">
          <div className="flex gap-4 px-4">
            {(['preview', 'history', 'notes'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-deep-plum border-b-2 border-deep-plum'
                    : 'text-gray-600 hover:text-deep-plum'
                }`}
              >
                {tab === 'preview' && <><FileText className="w-4 h-4 inline mr-1" />Preview</>}
                {tab === 'history' && <><Clock className="w-4 h-4 inline mr-1" />History</>}
                {tab === 'notes' && <>Notes</>}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {activeTab === 'preview' && (
            <div>
              <div className="flex justify-between items-center mb-4 print:hidden">
                <h3 className="font-semibold text-deep-plum">{request.documentType}</h3>
                <Button size="sm" onClick={handlePrint} className="bg-deep-plum hover:bg-accent-purple">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
              <CertPrintTemplate request={request} />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <h3 className="font-semibold text-deep-plum mb-3">Status Timeline</h3>
              {statusTimeline.map((entry, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-2 h-2 bg-deep-plum rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="text-xs">{entry.status}</Badge>
                        <div className="text-sm text-gray-600 mt-1">by {entry.actor}</div>
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
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm">
                <div className="font-semibold text-amber-800 mb-1">Existing Notes:</div>
                <div className="text-gray-700">{request.notes || 'No notes available.'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
