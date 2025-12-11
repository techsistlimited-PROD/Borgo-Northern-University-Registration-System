import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Edit, Archive, Check } from 'lucide-react'

interface TemplateComponent {
  name: string
  percentage: number
  enabled: boolean
}

interface DistributionTemplateCardProps {
  id: string
  name: string
  schemeType: 'four-part' | 'single-100'
  components: TemplateComponent[]
  locked: boolean
  onApply: (id: string) => void
  onEdit: (id: string) => void
  onDuplicate: (id: string) => void
  onArchive: (id: string) => void
}

export default function DistributionTemplateCard({
  id,
  name,
  schemeType,
  components,
  locked,
  onApply,
  onEdit,
  onDuplicate,
  onArchive
}: DistributionTemplateCardProps) {
  const enabledComponents = components.filter(c => c.enabled)
  const total = enabledComponents.reduce((sum, c) => sum + c.percentage, 0)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm font-semibold text-deep-plum">{name}</CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {schemeType === 'four-part' ? '4-Part' : '100-Mark'}
              </Badge>
              {locked && <Badge className="bg-amber-500 text-white text-xs">Locked</Badge>}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          {enabledComponents.map((comp, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-gray-700 capitalize">{comp.name}</span>
              <span className="font-medium text-deep-plum">{comp.percentage}%</span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t">
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-deep-plum">Total</span>
            <span className={total === 100 ? 'text-green-600' : 'text-red-600'}>{total}%</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            className="flex-1 bg-gradient-to-r from-deep-plum to-accent-purple text-white hover:opacity-90"
            onClick={() => onApply(id)}
          >
            <Check className="w-3 h-3 mr-1" />
            Apply
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(id)}>
            <Edit className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDuplicate(id)}>
            <Copy className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onArchive(id)}>
            <Archive className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
