import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Edit, Copy, X, ArrowLeft, ArrowRight, Check, Trash2, GripVertical } from 'lucide-react'
import { Repo } from '@/lib/repo'
import { CostPackage, CostPackageComponent, WaiverRule, FeeMode } from '../data/types'

export default function CostPackageWizard() {
  const [packages, setPackages] = useState<CostPackage[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [editingPackage, setEditingPackage] = useState<CostPackage | null>(null)

  const [formData, setFormData] = useState<Partial<CostPackage>>({
    name: '',
    campus: 'Main Campus',
    program: 'CSE',
    semesterTerm: 'Fall',
    effectiveTerm: 'FA25',
    components: [],
    waiverRules: [],
    status: 'Active'
  })

  useEffect(() => {
    loadPackages()
    const unsub = Repo.subscribe('finance-cost-packages', loadPackages)
    return unsub
  }, [])

  const loadPackages = () => {
    const data = Repo.get<CostPackage>('finance-cost-packages')
    setPackages(data)
  }

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.campus.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenWizard = (pkg?: CostPackage) => {
    if (pkg) {
      setEditingPackage(pkg)
      setFormData(pkg)
    } else {
      setEditingPackage(null)
      setFormData({
        name: '',
        campus: 'Main Campus',
        program: 'CSE',
        semesterTerm: 'Fall',
        effectiveTerm: 'FA25',
        components: [],
        waiverRules: [],
        status: 'Active'
      })
    }
    setCurrentStep(1)
    setIsWizardOpen(true)
  }

  const handleDuplicate = (pkg: CostPackage) => {
    setEditingPackage(null)
    setFormData({
      ...pkg,
      id: undefined,
      name: `${pkg.name} (Copy)`,
      status: 'Active'
    })
    setCurrentStep(1)
    setIsWizardOpen(true)
  }

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active'
    Repo.update('finance-cost-packages', id, { status: newStatus })
  }

  const handleAddComponent = () => {
    const newComponent: CostPackageComponent = {
      id: `comp-${Date.now()}`,
      costHeadCode: 'PER_CREDIT_FEE',
      mode: 'Flat',
      rate: 0,
      order: (formData.components?.length || 0) + 1
    }
    setFormData({
      ...formData,
      components: [...(formData.components || []), newComponent]
    })
  }

  const handleRemoveComponent = (id: string) => {
    setFormData({
      ...formData,
      components: formData.components?.filter(c => c.id !== id) || []
    })
  }

  const handleUpdateComponent = (id: string, updates: Partial<CostPackageComponent>) => {
    setFormData({
      ...formData,
      components: formData.components?.map(c => c.id === id ? { ...c, ...updates } : c) || []
    })
  }

  const handleAddWaiverRule = () => {
    const newRule: WaiverRule = {
      id: `wr-${Date.now()}`,
      policyCode: 'MERIT50',
      percentCap: 50,
      allowBillOverride: true
    }
    setFormData({
      ...formData,
      waiverRules: [...(formData.waiverRules || []), newRule]
    })
  }

  const handleRemoveWaiverRule = (id: string) => {
    setFormData({
      ...formData,
      waiverRules: formData.waiverRules?.filter(w => w.id !== id) || []
    })
  }

  const handleUpdateWaiverRule = (id: string, updates: Partial<WaiverRule>) => {
    setFormData({
      ...formData,
      waiverRules: formData.waiverRules?.map(w => w.id === id ? { ...w, ...updates } : w) || []
    })
  }

  const handleSavePackage = () => {
    const now = new Date().toISOString()

    if (editingPackage) {
      Repo.update('finance-cost-packages', editingPackage.id, {
        ...formData,
        updatedAt: now
      })
    } else {
      const newPackage: CostPackage = {
        id: `pkg-${Date.now()}`,
        name: formData.name!,
        campus: formData.campus!,
        program: formData.program!,
        semesterTerm: formData.semesterTerm!,
        effectiveTerm: formData.effectiveTerm!,
        components: formData.components || [],
        waiverRules: formData.waiverRules || [],
        status: formData.status || 'Active',
        createdAt: now,
        updatedAt: now
      }
      Repo.add('finance-cost-packages', newPackage)
    }

    setIsWizardOpen(false)
  }

  const costHeads = Repo.get('finance-cost-heads')
  const waiverPolicies = Repo.get('finance-waiver-policies')

  const campuses = ['Main Campus', 'Uttara Campus', 'Banasree Campus']
  const programs = ['CSE', 'BBA', 'LLB', 'MBA', 'EEE', 'Civil', 'English']
  const terms = ['Spring', 'Summer', 'Fall']

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Cost Package Setup</h1>
          <p className="text-sm text-gray-600">Program-wise fee packages with waiver rules</p>
        </div>
        <Button onClick={() => handleOpenWizard()} className="nu-button-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Package
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Cost Packages ({filteredPackages.length})</CardTitle>
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by program, campus, or package name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Program</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Campus</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Effective Term</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Package Name</th>
                  <th className="text-center p-3 text-sm font-medium text-gray-700">Components</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPackages.map((pkg) => (
                  <tr key={pkg.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-medium">{pkg.program}</td>
                    <td className="p-3 text-sm">{pkg.campus}</td>
                    <td className="p-3 text-sm">{pkg.effectiveTerm}</td>
                    <td className="p-3 text-sm">{pkg.name}</td>
                    <td className="p-3 text-center">
                      <Badge variant="outline">{pkg.components.length} items</Badge>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleStatus(pkg.id, pkg.status)}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          pkg.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {pkg.status}
                      </button>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenWizard(pkg)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDuplicate(pkg)}>
                          <Copy className="w-4 h-4" />
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

      <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPackage ? 'Edit Package' : 'New Package'} - Step {currentStep} of 4
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3, 4].map(step => (
              <div
                key={step}
                className={`flex items-center ${step < 4 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === currentStep
                      ? 'bg-accent-purple text-white'
                      : step < currentStep
                      ? 'bg-mint-green text-deep-plum'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step < currentStep ? <Check className="w-4 h-4" /> : step}
                </div>
                {step < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${step < currentStep ? 'bg-mint-green' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Step 1: Scope</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Campus *</label>
                  <select
                    value={formData.campus}
                    onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {campuses.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Program *</label>
                  <select
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {programs.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Semester/Term *</label>
                  <select
                    value={formData.semesterTerm}
                    onChange={(e) => setFormData({ ...formData, semesterTerm: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {terms.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Effective Term *</label>
                  <Input
                    value={formData.effectiveTerm}
                    onChange={(e) => setFormData({ ...formData, effectiveTerm: e.target.value })}
                    placeholder="e.g., FA25, SP26"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Package Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., CSE - Main Campus - FA25"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Step 2: Fee Structure</h3>
                <Button onClick={handleAddComponent} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Row
                </Button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {formData.components?.map((comp, idx) => (
                  <div key={comp.id} className="border rounded p-3 bg-gray-50">
                    <div className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-1 flex items-center justify-center">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-xs mb-1">Cost Head</label>
                        <select
                          value={comp.costHeadCode}
                          onChange={(e) => handleUpdateComponent(comp.id, { costHeadCode: e.target.value })}
                          className="w-full px-2 py-1 border rounded text-sm"
                        >
                          {costHeads.map((ch: any) => (
                            <option key={ch.code} value={ch.code}>{ch.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs mb-1">Mode</label>
                        <select
                          value={comp.mode}
                          onChange={(e) => handleUpdateComponent(comp.id, { mode: e.target.value as FeeMode })}
                          className="w-full px-2 py-1 border rounded text-sm"
                        >
                          <option value="Flat">Flat</option>
                          <option value="Per Credit">Per Credit</option>
                          <option value="Per Course">Per Course</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs mb-1">Rate</label>
                        <Input
                          type="number"
                          value={comp.rate}
                          onChange={(e) => handleUpdateComponent(comp.id, { rate: parseFloat(e.target.value) || 0 })}
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-xs mb-1">Min</label>
                        <Input
                          type="number"
                          value={comp.minCap || ''}
                          onChange={(e) => handleUpdateComponent(comp.id, { minCap: e.target.value ? parseFloat(e.target.value) : undefined })}
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-xs mb-1">Max</label>
                        <Input
                          type="number"
                          value={comp.maxCap || ''}
                          onChange={(e) => handleUpdateComponent(comp.id, { maxCap: e.target.value ? parseFloat(e.target.value) : undefined })}
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-2 flex items-end justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveComponent(comp.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Step 3: Scholarship/Waiver Rules</h3>
                <Button onClick={handleAddWaiverRule} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Rule
                </Button>
              </div>
              <div className="space-y-2">
                {formData.waiverRules?.map(rule => (
                  <div key={rule.id} className="border rounded p-3 bg-gray-50">
                    <div className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-4">
                        <label className="block text-xs mb-1">Policy Code</label>
                        <select
                          value={rule.policyCode}
                          onChange={(e) => handleUpdateWaiverRule(rule.id, { policyCode: e.target.value })}
                          className="w-full px-2 py-1 border rounded text-sm"
                        >
                          {waiverPolicies.map((wp: any) => (
                            <option key={wp.code} value={wp.code}>{wp.code} - {wp.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-3">
                        <label className="block text-xs mb-1">% Cap</label>
                        <Input
                          type="number"
                          value={rule.percentCap}
                          onChange={(e) => handleUpdateWaiverRule(rule.id, { percentCap: parseFloat(e.target.value) || 0 })}
                          className="text-sm"
                          max={100}
                        />
                      </div>
                      <div className="col-span-3 flex items-center space-x-2 pt-5">
                        <input
                          type="checkbox"
                          checked={rule.allowBillOverride}
                          onChange={(e) => handleUpdateWaiverRule(rule.id, { allowBillOverride: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <label className="text-xs">Allow bill-level override</label>
                      </div>
                      <div className="col-span-2 flex items-end justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveWaiverRule(rule.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Step 4: Review & Save</h3>
              <div className="bg-gray-50 rounded p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="font-medium">Campus:</span> {formData.campus}</div>
                  <div><span className="font-medium">Program:</span> {formData.program}</div>
                  <div><span className="font-medium">Term:</span> {formData.semesterTerm}</div>
                  <div><span className="font-medium">Effective:</span> {formData.effectiveTerm}</div>
                  <div className="col-span-2"><span className="font-medium">Name:</span> {formData.name}</div>
                </div>
                <div className="border-t pt-3">
                  <p className="font-medium text-sm mb-2">Components ({formData.components?.length}):</p>
                  <ul className="space-y-1 text-sm">
                    {formData.components?.map(comp => (
                      <li key={comp.id} className="flex justify-between">
                        <span>{comp.costHeadCode} ({comp.mode})</span>
                        <span className="font-medium">Rate: {comp.rate}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t pt-3">
                  <p className="font-medium text-sm mb-2">Waiver Rules ({formData.waiverRules?.length}):</p>
                  <ul className="space-y-1 text-sm">
                    {formData.waiverRules?.map(rule => (
                      <li key={rule.id}>
                        {rule.policyCode} - Cap: {rule.percentCap}% {rule.allowBillOverride && '(Override allowed)'}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setIsWizardOpen(false)}
            >
              {currentStep === 1 ? <X className="w-4 h-4 mr-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </Button>
            <Button
              onClick={() => currentStep < 4 ? setCurrentStep(currentStep + 1) : handleSavePackage()}
              className="nu-button-primary"
            >
              {currentStep === 4 ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Save Package
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
