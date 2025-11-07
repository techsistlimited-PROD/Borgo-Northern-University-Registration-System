import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, AlertCircle, RotateCcw } from 'lucide-react'
import { validateTemplate, MarkDistributionTemplate } from '@/coe/utils/marks'

interface ComponentRow {
  name: string
  weight: number
}

interface DistributionEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  templateId?: string
  initialData?: MarkDistributionTemplate
  onSave: (template: MarkDistributionTemplate) => void
}

export default function DistributionEditorDialog({
  open,
  onOpenChange,
  mode,
  templateId,
  initialData,
  onSave
}: DistributionEditorDialogProps) {
  const [templateName, setTemplateName] = useState('')
  const [schemeType, setSchemeType] = useState<'four-part' | 'single-100'>('four-part')
  const [components, setComponents] = useState<ComponentRow[]>([
    { name: 'Attendance', weight: 10 },
    { name: 'CA', weight: 20 },
    { name: 'Midterm', weight: 30 },
    { name: 'Final', weight: 40 }
  ])

  useEffect(() => {
    if (open && mode === 'edit' && initialData) {
      setTemplateName(initialData.name)
      setSchemeType(initialData.schemeType)
      setComponents(initialData.components.map(c => ({ name: c.name, weight: c.weight })))
    } else if (open && mode === 'create') {
      resetForm()
    }
  }, [open, mode, initialData])

  const resetForm = () => {
    setTemplateName('')
    setSchemeType('four-part')
    setComponents([
      { name: 'Attendance', weight: 10 },
      { name: 'CA', weight: 20 },
      { name: 'Midterm', weight: 30 },
      { name: 'Final', weight: 40 }
    ])
  }

  const handleSchemeTypeChange = (type: 'four-part' | 'single-100') => {
    setSchemeType(type)
    if (type === 'single-100') {
      setComponents([{ name: 'Total100', weight: 100 }])
    } else {
      setComponents([
        { name: 'Attendance', weight: 10 },
        { name: 'CA', weight: 20 },
        { name: 'Midterm', weight: 30 },
        { name: 'Final', weight: 40 }
      ])
    }
  }

  const handleComponentChange = (index: number, field: 'name' | 'weight', value: string) => {
    const updated = [...components]
    if (field === 'name') {
      updated[index].name = value
    } else {
      updated[index].weight = parseFloat(value) || 0
    }
    setComponents(updated)
  }

  const addComponent = () => {
    setComponents([...components, { name: '', weight: 0 }])
  }

  const removeComponent = (index: number) => {
    setComponents(components.filter((_, i) => i !== index))
  }

  const handleResetToDefaults = () => {
    if (schemeType === 'four-part') {
      setComponents([
        { name: 'Attendance', weight: 10 },
        { name: 'CA', weight: 20 },
        { name: 'Midterm', weight: 30 },
        { name: 'Final', weight: 40 }
      ])
    } else {
      setComponents([{ name: 'Total100', weight: 100 }])
    }
  }

  const handleSave = () => {
    const template: MarkDistributionTemplate = {
      name: templateName,
      schemeType,
      components: components.map(c => ({ ...c, marks: undefined })),
      total: components.reduce((sum, c) => sum + c.weight, 0)
    }

    const validation = validateTemplate(template)

    if (!validation.isValid) {
      alert('Validation errors:\n' + validation.errors.join('\n'))
      return
    }

    onSave(template)
    onOpenChange(false)
  }

  const template: MarkDistributionTemplate = {
    name: templateName,
    schemeType,
    components: components.map(c => ({ ...c, marks: undefined })),
    total: components.reduce((sum, c) => sum + c.weight, 0)
  }

  const validation = validateTemplate(template)
  const totalWeight = components.reduce((sum, c) => sum + c.weight, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Template' : 'Edit Template'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={templateName}
              onChange={e => setTemplateName(e.target.value)}
              placeholder="e.g., Standard 4-Part Distribution"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scheme Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={schemeType === 'four-part' ? 'default' : 'outline'}
                onClick={() => handleSchemeTypeChange('four-part')}
                className={
                  schemeType === 'four-part'
                    ? 'bg-gradient-to-r from-deep-plum to-accent-purple text-white'
                    : ''
                }
              >
                Four-Part (A/CA/Mid/Final)
              </Button>
              <Button
                type="button"
                variant={schemeType === 'single-100' ? 'default' : 'outline'}
                onClick={() => handleSchemeTypeChange('single-100')}
                className={
                  schemeType === 'single-100'
                    ? 'bg-gradient-to-r from-deep-plum to-accent-purple text-white'
                    : ''
                }
              >
                Single 100-Mark
              </Button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Components</label>
              {schemeType === 'four-part' && (
                <Button type="button" size="sm" variant="outline" onClick={addComponent}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Component
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {components.map((comp, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input
                    value={comp.name}
                    onChange={e => handleComponentChange(idx, 'name', e.target.value)}
                    placeholder="Component name"
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={comp.weight}
                    onChange={e => handleComponentChange(idx, 'weight', e.target.value)}
                    placeholder="Weight %"
                    className="w-24"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  {schemeType === 'four-part' && components.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removeComponent(idx)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3 p-3 bg-gray-50 rounded-md flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total Weight:</span>
              <Badge
                variant={totalWeight === 100 ? 'default' : 'destructive'}
                className={
                  totalWeight === 100 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }
              >
                {totalWeight.toFixed(2)}%
              </Badge>
            </div>
          </div>

          {!validation.isValid && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-800 text-sm">Validation Errors</h4>
                  <ul className="list-disc list-inside text-xs text-red-700 mt-1 space-y-1">
                    {validation.errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {validation.warnings.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-amber-800 text-sm">Warnings</h4>
                  <ul className="list-disc list-inside text-xs text-amber-700 mt-1 space-y-1">
                    {validation.warnings.map((warn, idx) => (
                      <li key={idx}>{warn}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleResetToDefaults}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!validation.isValid || !templateName.trim()}
            className="bg-gradient-to-r from-deep-plum to-accent-purple text-white hover:opacity-90"
          >
            Save Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
