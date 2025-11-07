import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Lock, Unlock, RotateCcw, Save } from 'lucide-react'
import LockBanner from './LockBanner'

interface ComponentRow {
  name: string
  weight: number
  policyNote: string
}

interface CourseDistributionGridProps {
  courseCode: string
  courseName: string
  section: string
  initialComponents: ComponentRow[]
  isLocked: boolean
  onSave: (components: ComponentRow[]) => void
  onRevert: () => void
  onToggleLock: () => void
}

export default function CourseDistributionGrid({
  courseCode,
  courseName,
  section,
  initialComponents,
  isLocked,
  onSave,
  onRevert,
  onToggleLock
}: CourseDistributionGridProps) {
  const [components, setComponents] = useState<ComponentRow[]>(initialComponents)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setComponents(initialComponents)
    setHasChanges(false)
  }, [initialComponents])

  const handleWeightChange = (index: number, value: string) => {
    const numValue = parseFloat(value) || 0
    const updated = [...components]
    updated[index].weight = numValue
    setComponents(updated)
    setHasChanges(true)
  }

  const totalWeight = components.reduce((sum, c) => sum + c.weight, 0)
  const isValidTotal = totalWeight === 100

  const handleSave = () => {
    if (isValidTotal) {
      onSave(components)
      setHasChanges(false)
    }
  }

  const handleRevert = () => {
    setComponents(initialComponents)
    setHasChanges(false)
    onRevert()
  }

  return (
    <div>
      <LockBanner isLocked={isLocked} onToggleLock={onToggleLock} />

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">Course Distribution</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {courseCode} - {courseName} (Section {section})
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isLocked ? 'default' : 'outline'} className="flex items-center gap-1">
                {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                {isLocked ? 'Locked' : 'Unlocked'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-semibold text-sm text-gray-700">Component</th>
                  <th className="text-right p-3 font-semibold text-sm text-gray-700">Weight (%)</th>
                  <th className="text-left p-3 font-semibold text-sm text-gray-700">Policy Note</th>
                </tr>
              </thead>
              <tbody>
                {components.map((comp, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium text-sm capitalize">{comp.name}</td>
                    <td className="p-3 text-right">
                      <Input
                        type="number"
                        value={comp.weight}
                        onChange={e => handleWeightChange(idx, e.target.value)}
                        disabled={isLocked}
                        className="w-20 text-right"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                    </td>
                    <td className="p-3 text-xs text-gray-600 italic">{comp.policyNote}</td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-semibold">
                  <td className="p-3 text-sm">Total</td>
                  <td className="p-3 text-right">
                    <span
                      className={`text-sm font-bold ${
                        isValidTotal ? 'text-purple-600' : 'text-red-600'
                      }`}
                    >
                      {totalWeight.toFixed(2)}%
                    </span>
                  </td>
                  <td className="p-3 text-xs text-gray-600">
                    {isValidTotal ? 'Valid distribution' : 'Must equal 100%'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="text-xs text-gray-600">
              {hasChanges && <span className="text-amber-600">● Unsaved changes</span>}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleRevert} disabled={!hasChanges}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Revert
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!hasChanges || !isValidTotal || isLocked}
                className="bg-gradient-to-r from-deep-plum to-accent-purple text-white hover:opacity-90"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
