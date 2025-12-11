import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit, Save } from 'lucide-react'
import { useState } from 'react'
import { ScholarshipRule } from '../data/scholarships'
import { getTierColor } from '../utils/scholarships'

interface ScholarshipRuleCardProps {
  rule: ScholarshipRule
  onUpdate: (ruleId: string, waiverPercent: number) => void
}

export default function ScholarshipRuleCard({ rule, onUpdate }: ScholarshipRuleCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(rule.waiverPercent.toString())

  const handleSave = () => {
    const newValue = parseInt(editValue)
    if (newValue >= 0 && newValue <= 100) {
      onUpdate(rule.id, newValue)
      setIsEditing(false)
    }
  }

  return (
    <Card className="border-purple-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{rule.tier}</CardTitle>
          {!isEditing ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSave}
            >
              <Save className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-sm text-gray-500">CGPA Range</div>
          <Badge className={getTierColor(rule.tier)}>
            {rule.cgpaMin.toFixed(2)} - {rule.cgpaMax.toFixed(2)}
          </Badge>
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-1">Waiver Percentage</div>
          {isEditing ? (
            <Input
              type="number"
              min="0"
              max="100"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-24"
            />
          ) : (
            <div className="text-2xl font-bold text-purple-600">
              {rule.waiverPercent}%
            </div>
          )}
        </div>
        <div className="text-sm text-gray-600">
          {rule.description}
        </div>
      </CardContent>
    </Card>
  )
}
