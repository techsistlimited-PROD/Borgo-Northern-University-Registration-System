import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Lock, Unlock } from 'lucide-react'
import { Repo } from '@/lib/repo'
import { WaiverPolicy, WaiverAssignment } from '../data/types'

export default function WaiverAssignmentView() {
  const [activeTab, setActiveTab] = useState<'policies' | 'assigned'>('policies')
  const [policies, setPolicies] = useState<WaiverPolicy[]>([])
  const [assignments, setAssignments] = useState<WaiverAssignment[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [isEditPolicyOpen, setIsEditPolicyOpen] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<WaiverPolicy | null>(null)
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    policyCode: '',
    policyName: '',
    percent: 0,
    effectiveTerm: 'FA25',
    locked: false
  })
  const [policyFormData, setPolicyFormData] = useState({
    code: '',
    name: '',
    percentCap: 0,
    description: '',
    active: true
  })

  useEffect(() => {
    loadData()
    const unsub1 = Repo.subscribe('finance-waiver-policies', loadData)
    const unsub2 = Repo.subscribe('finance-waiver-assignments', loadData)
    return () => {
      unsub1()
      unsub2()
    }
  }, [])

  const loadData = () => {
    setPolicies(Repo.get<WaiverPolicy>('finance-waiver-policies'))
    setAssignments(Repo.get<WaiverAssignment>('finance-waiver-assignments'))
  }

  const filteredPolicies = policies.filter(p =>
    p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredAssignments = assignments.filter(a =>
    a.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.policyCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenAssignDialog = () => {
    setFormData({
      studentId: '',
      studentName: '',
      policyCode: policies[0]?.code || '',
      policyName: policies[0]?.name || '',
      percent: policies[0]?.percentCap || 0,
      effectiveTerm: 'FA25',
      locked: false
    })
    setIsAssignDialogOpen(true)
  }

  const handlePolicyChange = (code: string) => {
    const policy = policies.find(p => p.code === code)
    if (policy) {
      setFormData({
        ...formData,
        policyCode: code,
        policyName: policy.name,
        percent: policy.percentCap
      })
    }
  }

  const handleAssign = () => {
    if (!formData.studentId.trim()) {
      alert('Student ID is required')
      return
    }

    const newAssignment: WaiverAssignment = {
      id: `wa-${Date.now()}`,
      studentId: formData.studentId,
      studentName: formData.studentName || formData.studentId,
      policyCode: formData.policyCode,
      policyName: formData.policyName,
      percent: formData.percent,
      effectiveTerm: formData.effectiveTerm,
      locked: formData.locked,
      assignedBy: 'Accounts Officer',
      assignedDate: new Date().toISOString().split('T')[0]
    }

    Repo.add('finance-waiver-assignments', newAssignment)
    setIsAssignDialogOpen(false)
    alert('Waiver assigned successfully')
  }

  const handleToggleLock = (id: string, currentLocked: boolean) => {
    Repo.update('finance-waiver-assignments', id, { locked: !currentLocked })
  }

  const handleTogglePolicyStatus = (id: string, currentActive: boolean) => {
    Repo.update('finance-waiver-policies', id, { active: !currentActive })
  }

  const handleOpenEditPolicy = (policy: WaiverPolicy) => {
    setEditingPolicy(policy)
    setPolicyFormData({
      code: policy.code,
      name: policy.name,
      percentCap: policy.percentCap,
      description: policy.description || '',
      active: policy.active
    })
    setIsEditPolicyOpen(true)
  }

  const handleSavePolicy = () => {
    if (!editingPolicy) return

    if (!policyFormData.code.trim() || !policyFormData.name.trim()) {
      alert('Code and Name are required')
      return
    }

    if (policyFormData.percentCap < 0 || policyFormData.percentCap > 100) {
      alert('Percent Cap must be between 0 and 100')
      return
    }

    Repo.update('finance-waiver-policies', editingPolicy.id, {
      code: policyFormData.code,
      name: policyFormData.name,
      percentCap: policyFormData.percentCap,
      description: policyFormData.description,
      active: policyFormData.active
    })

    setIsEditPolicyOpen(false)
    setEditingPolicy(null)
    alert('Policy updated successfully')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Waiver & Scholarship</h1>
          <p className="text-sm text-gray-600">Manage policies and student assignments</p>
        </div>
        {activeTab === 'assigned' && (
          <Button onClick={handleOpenAssignDialog} className="nu-button-primary">
            <Plus className="w-4 h-4 mr-2" />
            Assign Waiver
          </Button>
        )}
      </div>

      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('policies')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'policies'
              ? 'border-b-2 border-accent-purple text-accent-purple'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Policies ({policies.length})
        </button>
        <button
          onClick={() => setActiveTab('assigned')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'assigned'
              ? 'border-b-2 border-accent-purple text-accent-purple'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Assigned ({assignments.length})
        </button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{activeTab === 'policies' ? 'Waiver Policies' : 'Assigned Waivers'}</CardTitle>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={activeTab === 'policies' ? 'Search policies...' : 'Search assignments...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === 'policies' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Code</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Name</th>
                    <th className="text-right p-3 text-sm font-medium text-gray-700">Percent Cap</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Description</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-right p-3 text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPolicies.map(policy => (
                    <tr key={policy.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm font-mono font-semibold">{policy.code}</td>
                      <td className="p-3 text-sm font-medium">{policy.name}</td>
                      <td className="p-3 text-sm text-right font-semibold text-green-600">{policy.percentCap}%</td>
                      <td className="p-3 text-sm text-gray-600">{policy.description}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleTogglePolicyStatus(policy.id, policy.active)}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            policy.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {policy.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Student ID</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Student Name</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Policy</th>
                    <th className="text-right p-3 text-sm font-medium text-gray-700">Percent</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Effective Term</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Assigned By</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-right p-3 text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssignments.map(assignment => (
                    <tr key={assignment.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm font-mono">{assignment.studentId}</td>
                      <td className="p-3 text-sm font-medium">{assignment.studentName}</td>
                      <td className="p-3 text-sm">
                        <div className="font-medium">{assignment.policyCode}</div>
                        <div className="text-xs text-gray-600">{assignment.policyName}</div>
                      </td>
                      <td className="p-3 text-sm text-right font-semibold text-green-600">
                        {assignment.percent}%
                      </td>
                      <td className="p-3 text-sm">{assignment.effectiveTerm}</td>
                      <td className="p-3 text-sm text-gray-600">{assignment.assignedBy}</td>
                      <td className="p-3">
                        {assignment.locked ? (
                          <Badge className="bg-purple-100 text-purple-800">
                            <Lock className="w-3 h-3 mr-1 inline" />
                            Locked
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">
                            <Unlock className="w-3 h-3 mr-1 inline" />
                            Unlocked
                          </Badge>
                        )}
                      </td>
                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleLock(assignment.id, assignment.locked)}
                        >
                          {assignment.locked ? 'Unlock' : 'Lock'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Waiver</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">Student ID *</label>
              <Input
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                placeholder="e.g., 2021-1-60-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Student Name (optional)</label>
              <Input
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                placeholder="Auto-filled or enter manually"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Policy *</label>
              <select
                value={formData.policyCode}
                onChange={(e) => handlePolicyChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                {policies.filter(p => p.active).map(policy => (
                  <option key={policy.code} value={policy.code}>
                    {policy.code} - {policy.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Percent (≤ {formData.policyCode ? policies.find(p => p.code === formData.policyCode)?.percentCap : 100}%) *</label>
              <Input
                type="number"
                value={formData.percent}
                onChange={(e) => setFormData({ ...formData, percent: parseFloat(e.target.value) || 0 })}
                max={policies.find(p => p.code === formData.policyCode)?.percentCap || 100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Effective Term *</label>
              <Input
                value={formData.effectiveTerm}
                onChange={(e) => setFormData({ ...formData, effectiveTerm: e.target.value })}
                placeholder="e.g., FA25"
              />
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="locked"
                checked={formData.locked}
                onChange={(e) => setFormData({ ...formData, locked: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="locked" className="text-sm font-medium">
                <Lock className="w-3 h-3 inline mr-1" />
                Lock this assignment
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAssign} className="nu-button-primary">Assign Waiver</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
