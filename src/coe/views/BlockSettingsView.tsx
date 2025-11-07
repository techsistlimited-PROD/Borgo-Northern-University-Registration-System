import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Download, Save, RotateCcw, Plus, Edit, Trash2, Eye, AlertCircle, CheckSquare, FileText, Award, CreditCard, GripVertical } from 'lucide-react'
import {
  getBlockSettings,
  updateBlockSettings,
  resetBlockSettings,
  BlockSettingsStore,
  AutoBlockRule,
  ManualBlockReason,
  ScopeConfig
} from '@/coe/data/settingsStore'
import { RESULT_BLOCKS } from '@/coe/data/blockSettings'
import { getStudentMarksList } from '@/coe/data/selectors'

export default function BlockSettingsView() {
  const [activeTab, setActiveTab] = useState<'auto' | 'manual' | 'scopes'>('auto')
  const [settings, setSettings] = useState<BlockSettingsStore>(getBlockSettings())
  const [hasChanges, setHasChanges] = useState(false)

  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showReasonDialog, setShowReasonDialog] = useState(false)
  const [editingReason, setEditingReason] = useState<ManualBlockReason | null>(null)

  const [reasonForm, setReasonForm] = useState({
    code: '',
    label: '',
    category: 'Finance' as const,
    defaultActions: [] as string[],
    enabled: true
  })

  useEffect(() => {
    const initial = getBlockSettings()
    setSettings(initial)
  }, [])

  const handleSave = () => {
    updateBlockSettings(settings)
    setHasChanges(false)
    alert('Settings saved successfully')
  }

  const handleRevert = () => {
    resetBlockSettings()
    setSettings(getBlockSettings())
    setHasChanges(false)
  }

  const handleExportCSV = () => {
    const csvRows = [
      ['Block/Unblock Settings Export'],
      [''],
      ['AUTO-BLOCK RULES'],
      ['Rule', 'Enabled', 'Threshold', 'Affected Actions'],
      ...settings.autoBlockRules.map(r => [
        r.id,
        r.enabled ? 'Yes' : 'No',
        r.threshold?.toString() || 'N/A',
        r.affectedActions.join('; ')
      ]),
      [''],
      ['MANUAL BLOCK REASONS'],
      ['Code', 'Label', 'Category', 'Default Actions', 'Enabled', 'Order'],
      ...settings.manualReasons.map(r => [
        r.code,
        r.label,
        r.category,
        r.defaultActions.join('; '),
        r.enabled ? 'Yes' : 'No',
        r.order.toString()
      ]),
      [''],
      ['SCOPES & ACTIONS'],
      ['Scope', 'Enabled', 'Allowed Actions'],
      ...settings.scopeConfigs.map(s => [
        s.scope,
        s.enabled ? 'Yes' : 'No',
        s.allowedActions.join('; ')
      ])
    ]

    const csvContent = csvRows.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `block-settings-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const updateAutoRule = (id: string, updates: Partial<AutoBlockRule>) => {
    setSettings({
      ...settings,
      autoBlockRules: settings.autoBlockRules.map(r => (r.id === id ? { ...r, ...updates } : r))
    })
    setHasChanges(true)
  }

  const handleAddReason = () => {
    setEditingReason(null)
    setReasonForm({
      code: '',
      label: '',
      category: 'Finance',
      defaultActions: [],
      enabled: true
    })
    setShowReasonDialog(true)
  }

  const handleEditReason = (reason: ManualBlockReason) => {
    setEditingReason(reason)
    setReasonForm({
      code: reason.code,
      label: reason.label,
      category: reason.category,
      defaultActions: reason.defaultActions,
      enabled: reason.enabled
    })
    setShowReasonDialog(true)
  }

  const handleSaveReason = () => {
    if (!reasonForm.code || !reasonForm.label || reasonForm.label.length < 3 || reasonForm.label.length > 80) {
      alert('Code is required and label must be 3-80 characters')
      return
    }

    const isDuplicate = settings.manualReasons.some(
      r => r.code === reasonForm.code && r.code !== editingReason?.code
    )
    if (isDuplicate) {
      alert('Code must be unique')
      return
    }

    if (editingReason) {
      setSettings({
        ...settings,
        manualReasons: settings.manualReasons.map(r =>
          r.code === editingReason.code
            ? { ...reasonForm, order: r.order }
            : r
        )
      })
    } else {
      const maxOrder = Math.max(...settings.manualReasons.map(r => r.order), 0)
      setSettings({
        ...settings,
        manualReasons: [
          ...settings.manualReasons,
          { ...reasonForm, order: maxOrder + 1 }
        ]
      })
    }

    setHasChanges(true)
    setShowReasonDialog(false)
  }

  const handleDeleteReason = (code: string) => {
    if (confirm('Delete this reason?')) {
      setSettings({
        ...settings,
        manualReasons: settings.manualReasons.filter(r => r.code !== code)
      })
      setHasChanges(true)
    }
  }

  const moveReason = (code: string, direction: 'up' | 'down') => {
    const index = settings.manualReasons.findIndex(r => r.code === code)
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === settings.manualReasons.length - 1)) {
      return
    }

    const newReasons = [...settings.manualReasons]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    ;[newReasons[index], newReasons[swapIndex]] = [newReasons[swapIndex], newReasons[index]]

    newReasons.forEach((r, i) => (r.order = i + 1))

    setSettings({ ...settings, manualReasons: newReasons })
    setHasChanges(true)
  }

  const updateScope = (scope: string, updates: Partial<ScopeConfig>) => {
    setSettings({
      ...settings,
      scopeConfigs: settings.scopeConfigs.map(s => (s.scope === scope ? { ...s, ...updates } : s))
    })
    setHasChanges(true)
  }

  const toggleScopeAction = (scope: string, action: string) => {
    const config = settings.scopeConfigs.find(s => s.scope === scope)
    if (!config) return

    const newActions = config.allowedActions.includes(action)
      ? config.allowedActions.filter(a => a !== action)
      : [...config.allowedActions, action]

    updateScope(scope, { allowedActions: newActions })
  }

  const computePreviewImpact = () => {
    const studentMarks = getStudentMarksList()
    const uniqueStudents = new Set(studentMarks.map(m => m.studentId))

    const financeRule = settings.autoBlockRules.find(r => r.id === 'finance-dues')
    const terRule = settings.autoBlockRules.find(r => r.id === 'ter-not-submitted')
    const discRule = settings.autoBlockRules.find(r => r.id === 'disciplinary-hold')

    const financeBlocked = financeRule?.enabled ? RESULT_BLOCKS.filter(b => b.reason === 'Finance Dues' && b.status === 'Active').length : 0
    const terBlocked = terRule?.enabled ? RESULT_BLOCKS.filter(b => b.reason === 'TER Not Submitted' && b.status === 'Active').length : 0
    const discBlocked = discRule?.enabled ? RESULT_BLOCKS.filter(b => b.reason === 'Disciplinary Action' && b.status === 'Active').length : 0

    return {
      total: uniqueStudents.size,
      financeBlocked,
      terBlocked,
      discBlocked,
      totalBlocked: financeBlocked + terBlocked + discBlocked
    }
  }

  const actionIcons: Record<string, React.ReactNode> = {
    Results: <CheckSquare className="w-4 h-4" />,
    Transcript: <FileText className="w-4 h-4" />,
    Certificates: <Award className="w-4 h-4" />,
    Admit: <CreditCard className="w-4 h-4" />
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Block/Unblock Settings</h1>
          <p className="text-sm text-gray-600 mt-1">
            Configure auto-block rules, manual reasons, and scopes
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleRevert} disabled={!hasChanges}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Revert
          </Button>
          <Button size="sm" variant="outline" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges}
            className="bg-gradient-to-r from-deep-plum to-accent-purple text-white hover:opacity-90"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {hasChanges && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <span className="text-sm text-amber-800">You have unsaved changes</span>
        </div>
      )}

      <div className="border-b">
        <div className="flex gap-4">
          {(['auto', 'manual', 'scopes'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-deep-plum border-b-2 border-deep-plum'
                  : 'text-gray-600 hover:text-deep-plum'
              }`}
            >
              {tab === 'auto' && 'Auto-Block Rules'}
              {tab === 'manual' && 'Manual Block Reasons'}
              {tab === 'scopes' && 'Scopes & Actions'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'auto' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" variant="outline" onClick={() => setShowPreviewModal(true)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview Impact
            </Button>
          </div>

          {settings.autoBlockRules.map(rule => (
            <Card key={rule.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-deep-plum mb-1 capitalize">
                      {rule.id.replace(/-/g, ' ')}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {rule.id === 'finance-dues' && 'Auto-block when finance dues exceed threshold'}
                      {rule.id === 'ter-not-submitted' && 'Auto-block when TER not submitted by deadline'}
                      {rule.id === 'disciplinary-hold' && 'Auto-block for disciplinary committee decisions'}
                    </p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={e => updateAutoRule(rule.id, { enabled: e.target.checked })}
                      className="w-5 h-5 rounded"
                    />
                    <span className="text-sm font-medium">{rule.enabled ? 'Enabled' : 'Disabled'}</span>
                  </label>
                </div>

                {rule.id === 'finance-dues' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Threshold (BDT)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={rule.threshold || 0}
                      onChange={e => updateAutoRule(rule.id, { threshold: parseInt(e.target.value) || 0 })}
                      className="w-48"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Affected Actions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {rule.affectedActions.map((action, idx) => (
                      <Badge key={idx} variant="outline" className="flex items-center gap-1">
                        {actionIcons[action]}
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'manual' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={handleAddReason} className="bg-gradient-to-r from-deep-plum to-accent-purple text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Reason
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 border-b font-semibold">Order</th>
                      <th className="text-left p-3 border-b font-semibold">Code</th>
                      <th className="text-left p-3 border-b font-semibold">Label</th>
                      <th className="text-left p-3 border-b font-semibold">Category</th>
                      <th className="text-left p-3 border-b font-semibold">Default Actions</th>
                      <th className="text-left p-3 border-b font-semibold">Enabled</th>
                      <th className="text-left p-3 border-b font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settings.manualReasons.sort((a, b) => a.order - b.order).map((reason, idx) => (
                      <tr key={reason.code} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <GripVertical className="w-4 h-4 text-gray-400" />
                            <span>{reason.order}</span>
                            <div className="flex flex-col ml-2">
                              <button
                                onClick={() => moveReason(reason.code, 'up')}
                                disabled={idx === 0}
                                className="text-xs text-gray-500 hover:text-deep-plum disabled:opacity-30"
                              >
                                ▲
                              </button>
                              <button
                                onClick={() => moveReason(reason.code, 'down')}
                                disabled={idx === settings.manualReasons.length - 1}
                                className="text-xs text-gray-500 hover:text-deep-plum disabled:opacity-30"
                              >
                                ▼
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-xs">{reason.code}</td>
                        <td className="p-3 font-medium">{reason.label}</td>
                        <td className="p-3">
                          <Badge
                            className={
                              reason.category === 'Disciplinary'
                                ? 'bg-red-100 text-red-700'
                                : reason.category === 'Finance' || reason.category === 'TER'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-blue-100 text-blue-700'
                            }
                          >
                            {reason.category}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            {reason.defaultActions.map((action, i) => (
                              <span key={i} className="text-gray-600">
                                {actionIcons[action]}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge className={reason.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                            {reason.enabled ? 'Yes' : 'No'}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => handleEditReason(reason)}>
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeleteReason(reason.code)}>
                              <Trash2 className="w-3 h-3 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'scopes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="col-span-4 bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="font-semibold text-blue-900 text-sm mb-2">Actions Legend</h4>
              <div className="flex flex-wrap gap-4">
                {Object.entries(actionIcons).map(([action, icon]) => (
                  <div key={action} className="flex items-center gap-2 text-sm text-blue-800">
                    {icon}
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {settings.scopeConfigs.map(config => (
            <Card key={config.scope}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-deep-plum mb-1">{config.scope}</h4>
                    <p className="text-sm text-gray-600">
                      {config.scope === 'Course-only' && 'Block applies to a specific course section only'}
                      {config.scope === 'Term-wide' && 'Block applies to all courses in the semester'}
                      {config.scope === 'Program-wide' && 'Block applies to the entire program'}
                    </p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.enabled}
                      onChange={e => updateScope(config.scope, { enabled: e.target.checked })}
                      className="w-5 h-5 rounded"
                    />
                    <span className="text-sm font-medium">{config.enabled ? 'Enabled' : 'Disabled'}</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allowed Actions
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(actionIcons).map(([action, icon]) => (
                      <label key={action} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.allowedActions.includes(action)}
                          onChange={() => toggleScopeAction(config.scope, action)}
                          className="rounded"
                        />
                        <span className="flex items-center gap-1 text-sm">
                          {icon}
                          {action}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preview Impact</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {(() => {
              const impact = computePreviewImpact()
              return (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Current Block Impact</h4>
                    <p className="text-sm text-blue-800">
                      Based on current settings and active blocks in the system
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-deep-plum">{impact.total}</div>
                          <div className="text-sm text-gray-600 mt-1">Total Students</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-600">{impact.totalBlocked}</div>
                          <div className="text-sm text-gray-600 mt-1">Currently Blocked</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    {settings.autoBlockRules.map(rule => (
                      <div key={rule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" checked={rule.enabled} readOnly className="rounded" />
                          <div>
                            <div className="font-medium text-sm capitalize">
                              {rule.id.replace(/-/g, ' ')}
                            </div>
                            {rule.threshold !== undefined && (
                              <div className="text-xs text-gray-600">Threshold: ৳{rule.threshold}</div>
                            )}
                          </div>
                        </div>
                        <Badge className="bg-purple-100 text-purple-700">
                          {rule.id === 'finance-dues'
                            ? impact.financeBlocked
                            : rule.id === 'ter-not-submitted'
                            ? impact.terBlocked
                            : impact.discBlocked}{' '}
                          blocked
                        </Badge>
                      </div>
                    ))}
                  </div>
                </>
              )
            })()}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showReasonDialog} onOpenChange={setShowReasonDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingReason ? 'Edit Reason' : 'Add New Reason'}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code <span className="text-red-500">*</span>
                </label>
                <Input
                  value={reasonForm.code}
                  onChange={e => setReasonForm({ ...reasonForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., FIN001"
                  disabled={!!editingReason}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={reasonForm.category}
                  onChange={e => setReasonForm({ ...reasonForm, category: e.target.value as any })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Finance">Finance</option>
                  <option value="TER">TER</option>
                  <option value="Disciplinary">Disciplinary</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label <span className="text-red-500">*</span> (3-80 chars)
              </label>
              <Input
                value={reasonForm.label}
                onChange={e => setReasonForm({ ...reasonForm, label: e.target.value })}
                placeholder="e.g., Finance dues pending"
                maxLength={80}
              />
              <p className="text-xs text-gray-600 mt-1">{reasonForm.label.length}/80 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Actions <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {Object.entries(actionIcons).map(([action, icon]) => (
                  <label key={action} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reasonForm.defaultActions.includes(action)}
                      onChange={e => {
                        if (e.target.checked) {
                          setReasonForm({ ...reasonForm, defaultActions: [...reasonForm.defaultActions, action] })
                        } else {
                          setReasonForm({
                            ...reasonForm,
                            defaultActions: reasonForm.defaultActions.filter(a => a !== action)
                          })
                        }
                      }}
                      className="rounded"
                    />
                    <span className="flex items-center gap-1 text-sm">
                      {icon}
                      {action}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reasonForm.enabled}
                  onChange={e => setReasonForm({ ...reasonForm, enabled: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
                <span className="text-sm font-medium">Enabled</span>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReasonDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveReason}
              disabled={!reasonForm.code || !reasonForm.label || reasonForm.label.length < 3}
              className="bg-gradient-to-r from-deep-plum to-accent-purple text-white"
            >
              {editingReason ? 'Update' : 'Add'} Reason
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
