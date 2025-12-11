import { Badge } from '@/components/ui/badge'
import { AlertCircle } from 'lucide-react'

interface AutoBlockBannerProps {
  settings: {
    autoBlockOnDues: boolean
    autoBlockOnTER: boolean
    disciplinaryHold: boolean
  }
}

export default function AutoBlockBanner({ settings }: AutoBlockBannerProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-blue-900 text-sm mb-2">Auto-Block Rules (Read-Only)</h4>
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-blue-800">Finance Dues &gt; 0:</span>
              <Badge className={settings.autoBlockOnDues ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                {settings.autoBlockOnDues ? 'Enabled' : 'Disabled'}
              </Badge>
              <span className="text-xs text-blue-700">→ auto-block results</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-800">TER Not Submitted:</span>
              <Badge className={settings.autoBlockOnTER ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                {settings.autoBlockOnTER ? 'Enabled' : 'Disabled'}
              </Badge>
              <span className="text-xs text-blue-700">→ auto-block results</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-800">Disciplinary Hold:</span>
              <Badge className={settings.disciplinaryHold ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                {settings.disciplinaryHold ? 'Enabled' : 'Disabled'}
              </Badge>
              <span className="text-xs text-blue-700">→ auto-block transcript/certificates</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
