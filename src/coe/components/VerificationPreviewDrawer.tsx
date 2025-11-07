import { useState } from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { X, CheckCircle, XCircle, Printer, QrCode } from 'lucide-react'
import { VerificationProfile } from '../data/verification'
import { getVerificationStatusColor } from '../utils/verification'

interface VerificationPreviewDrawerProps {
  open: boolean
  onClose: () => void
  profile: VerificationProfile | null
  onVerify: (profileId: string, remarks: string) => void
  onReject: (profileId: string, reason: string) => void
  onPrint: (profile: VerificationProfile) => void
}

export default function VerificationPreviewDrawer({
  open,
  onClose,
  profile,
  onVerify,
  onReject,
  onPrint
}: VerificationPreviewDrawerProps) {
  const [remarks, setRemarks] = useState('')

  if (!profile) return null

  const handleVerify = () => {
    onVerify(profile.id, remarks)
    setRemarks('')
  }

  const handleReject = () => {
    onReject(profile.id, remarks)
    setRemarks('')
  }

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="max-w-3xl mx-auto max-h-[90vh]">
        <DrawerHeader className="border-b">
          <div className="flex justify-between items-start">
            <div>
              <DrawerTitle>Verification Details</DrawerTitle>
              <DrawerDescription>
                {profile.studentId} - {profile.name}
              </DrawerDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DrawerHeader>

        <div className="p-6 space-y-6 overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Student Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Student ID</div>
                <div className="font-medium">{profile.studentId}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Name</div>
                <div className="font-medium">{profile.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Program</div>
                <div className="font-medium">{profile.program}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Admit Year</div>
                <div className="font-medium">{profile.admitYear}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Completed Credits</div>
                <div className="font-medium">{profile.completedCredits}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">CGPA</div>
                <div className="font-medium">{profile.cgpa.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Verification Token</div>
                <div className="font-mono text-sm text-purple-600">{profile.token}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">QR Code</div>
                <div className="flex items-center gap-2">
                  <div className="font-mono text-xs text-gray-600">{profile.qr}</div>
                  <QrCode className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <Badge className={getVerificationStatusColor(profile.status)}>
                  {profile.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Verification History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.history.map((entry, idx) => (
                  <div key={idx} className="border-l-2 border-purple-200 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-sm">{entry.action}</div>
                      <div className="text-xs text-gray-500">{entry.date}</div>
                    </div>
                    <div className="text-sm text-gray-600">By: {entry.by}</div>
                    <div className="text-sm text-gray-500">{entry.remarks}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {profile.status === 'Pending' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Take Action</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Remarks / Reason</label>
                  <Textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter remarks or rejection reason..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleVerify} className="nu-button-primary">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Verified
                  </Button>
                  <Button onClick={handleReject} variant="outline">
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {profile.status === 'Verified' && (
            <div className="flex justify-end">
              <Button onClick={() => onPrint(profile)} variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print Verification Letter
              </Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
