import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { VerificationProfile } from '../data/verification'
import { getVerificationStatusColor } from '../utils/verification'

interface VerificationResultCardProps {
  profile: VerificationProfile
  onPreview: (profile: VerificationProfile) => void
}

export default function VerificationResultCard({
  profile,
  onPreview
}: VerificationResultCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="font-medium text-lg">{profile.name}</div>
            <div className="text-sm text-gray-500">{profile.studentId}</div>
          </div>
          <Badge className={getVerificationStatusColor(profile.status)}>
            {profile.status}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <div className="text-xs text-gray-500">Program</div>
            <div className="text-sm font-medium">{profile.program}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Admit Year</div>
            <div className="text-sm font-medium">{profile.admitYear}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Credits</div>
            <div className="text-sm font-medium">{profile.completedCredits}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">CGPA</div>
            <div className="text-sm font-medium">{profile.cgpa.toFixed(2)}</div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="text-xs text-gray-500">
            Token: <span className="font-mono text-purple-600">{profile.token}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPreview(profile)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
