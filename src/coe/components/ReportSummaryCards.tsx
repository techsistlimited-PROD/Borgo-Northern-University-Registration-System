import { Card, CardContent } from '@/components/ui/card'
import { ReportDefinition } from '../data/reportsData'

interface ReportSummaryCardsProps {
  report: ReportDefinition
  data: any[]
}

const getColorClasses = (color?: string) => {
  switch (color) {
    case 'purple':
      return 'bg-purple-50 border-purple-200 text-purple-700'
    case 'indigo':
      return 'bg-indigo-50 border-indigo-200 text-indigo-700'
    case 'violet':
      return 'bg-violet-50 border-violet-200 text-violet-700'
    case 'blue':
      return 'bg-blue-50 border-blue-200 text-blue-700'
    default:
      return 'bg-gray-50 border-gray-200 text-gray-700'
  }
}

export default function ReportSummaryCards({ report, data }: ReportSummaryCardsProps) {
  if (!report.summaryCards || report.summaryCards.length === 0) return null

  return (
    <div className="grid grid-cols-4 gap-4">
      {report.summaryCards.map((card, idx) => (
        <Card key={idx} className={getColorClasses(card.color)}>
          <CardContent className="pt-4">
            <div className="text-sm font-medium mb-1">{card.label}</div>
            <div className="text-2xl font-bold">{card.getValue(data)}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
