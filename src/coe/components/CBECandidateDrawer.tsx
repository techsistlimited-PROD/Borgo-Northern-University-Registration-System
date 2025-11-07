import { useState } from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { CBECandidate } from '../data/cbe'
import { getCBEDecisionColor, canApproveCBECandidate } from '../utils/cbe'

interface CBECandidateDrawerProps {
  open: boolean
  onClose: () => void
  candidate: CBECandidate | null
  onDecision: (candidateId: string, decision: 'Eligible' | 'Not Eligible' | 'Withheld', notes: string) => void
}

export default function CBECandidateDrawer({
  open,
  onClose,
  candidate,
  onDecision
}: CBECandidateDrawerProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'eligibility' | 'decision' | 'audit'>('summary')
  const [notes, setNotes] = useState('')

  if (!candidate) return null

  const canApprove = canApproveCBECandidate(candidate.studentId)

  const handleDecision = (decision: 'Eligible' | 'Not Eligible' | 'Withheld') => {
    onDecision(candidate.id, decision, notes)
    setNotes('')
  }

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="max-w-3xl mx-auto max-h-[90vh]">
        <DrawerHeader className="border-b">
          <div className="flex justify-between items-start">
            <div>
              <DrawerTitle className="text-xl">CBE Candidate Details</DrawerTitle>
              <DrawerDescription>
                {candidate.studentId} - {candidate.studentName}
              </DrawerDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2 mt-4">
            {(['summary', 'eligibility', 'decision', 'audit'] as const).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? 'nu-button-primary' : ''}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
        </DrawerHeader>

        <div className="p-6 overflow-y-auto">
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Student Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Student ID</div>
                    <div className="font-medium">{candidate.studentId}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Name</div>
                    <div className="font-medium">{candidate.studentName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Program</div>
                    <div className="font-medium">{candidate.program}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Admit Year</div>
                    <div className="font-medium">{candidate.admitYear}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Completed Credits</div>
                    <div className="font-medium">{candidate.completedCredits}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">CGPA</div>
                    <div className="font-medium">{candidate.cgpa.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Decision</div>
                    <Badge className={getCBEDecisionColor(candidate.decision)}>
                      {candidate.decision}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'eligibility' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Eligibility Criteria</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completed Credits (≥120)</span>
                    {candidate.completedCredits >= 120 ? (
                      <Badge className="bg-purple-100 text-purple-700">
                        <CheckCircle className="w-3 h-3 mr-1" /> {candidate.completedCredits}
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-700">
                        <XCircle className="w-3 h-3 mr-1" /> {candidate.completedCredits}
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CGPA (≥2.5)</span>
                    {candidate.cgpa >= 2.5 ? (
                      <Badge className="bg-purple-100 text-purple-700">
                        <CheckCircle className="w-3 h-3 mr-1" /> {candidate.cgpa.toFixed(2)}
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-700">
                        <XCircle className="w-3 h-3 mr-1" /> {candidate.cgpa.toFixed(2)}
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">No Active Blocks</span>
                    {canApprove ? (
                      <Badge className="bg-purple-100 text-purple-700">
                        <CheckCircle className="w-3 h-3 mr-1" /> Clear
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Blocked
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'decision' && (
            <div className="space-y-4">
              {!canApprove && (
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-amber-900">Disciplinary Block Active</div>
                        <div className="text-sm text-amber-700">
                          This candidate has an active disciplinary block. Approval is restricted.
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Make Decision</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Decision Notes</label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Enter decision notes..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleDecision('Eligible')}
                      disabled={!canApprove}
                      className="nu-button-primary"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Eligible
                    </Button>
                    <Button
                      onClick={() => handleDecision('Withheld')}
                      variant="outline"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Withhold
                    </Button>
                    <Button
                      onClick={() => handleDecision('Not Eligible')}
                      variant="outline"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Audit Trail</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {candidate.auditLog.map((log, idx) => (
                      <div key={idx} className="border-l-2 border-purple-200 pl-4 py-2">
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-sm">{log.action}</div>
                          <div className="text-xs text-gray-500">{log.date}</div>
                        </div>
                        <div className="text-sm text-gray-600">By: {log.by}</div>
                        <div className="text-sm text-gray-500">{log.remarks}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
