import { CGPABand } from '@/coe/data/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface CgpaBandsCardProps {
  cgpaBands: CGPABand[]
}

export default function CgpaBandsCard({ cgpaBands }: CgpaBandsCardProps) {
  const getBandColor = (classification: string) => {
    switch (classification) {
      case 'Distinction':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'First':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'Second Upper':
        return 'bg-cyan-100 text-cyan-800 border-cyan-300'
      case 'Second Lower':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300'
      case 'Third':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'Pass':
        return 'bg-slate-100 text-slate-800 border-slate-300'
      default:
        return 'bg-red-100 text-red-800 border-red-300'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">CGPA Classification Bands</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {cgpaBands.map((band, idx) => (
            <div
              key={idx}
              className="p-3 border rounded-lg hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-deep-plum text-sm">{band.band}</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    CGPA: {band.minCGPA.toFixed(2)} – {band.maxCGPA.toFixed(2)}
                  </p>
                </div>
                <Badge className={`${getBandColor(band.classification)} border`}>
                  {band.classification}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-xs text-gray-700">
            <span className="font-semibold">Note:</span> Band labels are used in analytics and
            award eligibility summaries.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
