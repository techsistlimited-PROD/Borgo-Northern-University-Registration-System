import { Lock, Unlock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LockBannerProps {
  isLocked: boolean
  onToggleLock: () => void
}

export default function LockBanner({ isLocked, onToggleLock }: LockBannerProps) {
  if (!isLocked) return null

  return (
    <div className="bg-amber-50 border border-amber-300 rounded-md p-4 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-900 text-sm">Distribution Locked</h4>
            <p className="text-xs text-amber-800 mt-1">
              This mark distribution is locked for this section. You can upload marks but cannot
              change the weight distribution. Unlock to modify weights or apply a different template.
            </p>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={onToggleLock} className="ml-4">
          <Unlock className="w-4 h-4 mr-2" />
          Unlock
        </Button>
      </div>
    </div>
  )
}
