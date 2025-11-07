import { CheckCircle, XCircle, Eye, Send, CheckSquare } from 'lucide-react'

interface AuditEvent {
  action: string
  by: string
  date: string
  notes: string
}

interface CorrectionAuditTimelineProps {
  auditTrail: AuditEvent[]
}

export default function CorrectionAuditTimeline({ auditTrail }: CorrectionAuditTimelineProps) {
  const getIcon = (action: string) => {
    const actionLower = action.toLowerCase()
    if (actionLower.includes('approved') || actionLower.includes('applied')) {
      return <CheckCircle className="w-5 h-5 text-green-600" />
    }
    if (actionLower.includes('rejected')) {
      return <XCircle className="w-5 h-5 text-red-600" />
    }
    if (actionLower.includes('review')) {
      return <Eye className="w-5 h-5 text-amber-600" />
    }
    if (actionLower.includes('submitted')) {
      return <Send className="w-5 h-5 text-blue-600" />
    }
    return <CheckSquare className="w-5 h-5 text-gray-600" />
  }

  return (
    <div className="space-y-4">
      {auditTrail.map((event, idx) => (
        <div key={idx} className="relative pl-8">
          {idx !== auditTrail.length - 1 && (
            <div className="absolute left-2 top-7 w-0.5 h-full bg-gray-200" />
          )}
          <div className="absolute left-0 top-1">{getIcon(event.action)}</div>
          <div className="bg-gray-50 rounded-md p-3">
            <div className="flex items-start justify-between mb-1">
              <h4 className="font-semibold text-sm text-deep-plum">{event.action}</h4>
              <span className="text-xs text-gray-500">{event.date}</span>
            </div>
            <p className="text-xs text-gray-600 mb-1">By: {event.by}</p>
            {event.notes && <p className="text-sm text-gray-700 mt-2">{event.notes}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
