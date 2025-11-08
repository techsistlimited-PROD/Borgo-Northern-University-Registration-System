import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Edit, Copy, X, ArrowLeft, ArrowRight, Check, Trash2, GripVertical } from 'lucide-react'
import { Repo } from '@/lib/repo'
import { CostPackage, CostPackageComponent, WaiverRule, FeeMode } from '../data/types'
import { DEMO_MODE, showDemoToast } from '@/config/demo'
import { costPackagesStatic } from '../data/staticSeeds'

export default function CostPackageWizard() {
  const [packages, setPackages] = useState<CostPackage[]>([])
  const [anyText, setAnyText] = useState('')
  const [campusFilter, setCampusFilter] = useState('All')
  const [programFilter, setProgramFilter] = useState('All')
  const [isActiveFilter, setIsActiveFilter] = useState('All')
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [editingPackage, setEditingPackage] = useState<CostPackage | null>(null)

  const [formData, setFormData] = useState<Partial<CostPackage>>({
    programNo: '',
    name: '',
    campus: 'Permanent Campus',
    program: 'CSE',
    semesterFrom: 'Spring 24',
    semesterTo: '',
    currency: 'BDT',
    isForeign: false,
    activeFrom: '',
    activeTo: '',
    remarks: '',
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
    // Use static seeds in DEMO_MODE (already has 12 packages)
    const data = DEMO_MODE ? costPackagesStatic : Repo.get<CostPackage>('finance-cost-packages')
    setPackages(data)
  }

  const filteredPackages = packages.filter(pkg => {
    const matchesAnyText = anyText === '' ||
      pkg.program.toLowerCase().includes(anyText.toLowerCase()) ||
      pkg.campus.toLowerCase().includes(anyText.toLowerCase()) ||
      pkg.name.toLowerCase().includes(anyText.toLowerCase()) ||
      pkg.programNo.toLowerCase().includes(anyText.toLowerCase())

    const matchesCampus = campusFilter === 'All' || pkg.campus === campusFilter
    const matchesProgram = programFilter === 'All' || pkg.program === programFilter
    const matchesIsActive = isActiveFilter === 'All' || 
      (isActiveFilter === 'Yes' && pkg.status === 'Active') ||
      (isActiveFilter === 'No' && pkg.status === 'Inactive')

    return matchesAnyText && matchesCampus && matchesProgram && matchesIsActive
  })

  const handleOpenWizard = (pkg?: CostPackage) => {
    if (pkg) {
      setEditingPackage(pkg)
      setFormData(pkg)
    } else {
      setEditingPackage(null)
      const nextProgramNo = String(packages.length + 700)
      setFormData({
        programNo: nextProgramNo,
        name: '',
        campus: 'Permanent Campus',
        program: 'CSE',
        semesterFrom: 'Spring 24',
        semesterTo: '',
        currency: 'BDT',
        isForeign: false,
        activeFrom: new Date().toISOString().split('T')[0],
        activeTo: '',
        remarks: '',
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
    const nextProgramNo = String(packages.length + 700)
    setFormData({
      ...pkg,
      id: undefined,
      programNo: nextProgramNo,
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
      costHeadCode: '001',
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
        programNo: formData.programNo!,
        name: formData.name!,
        campus: formData.campus!,
        program: formData.program!,
        semesterFrom: formData.semesterFrom!,
        semesterTo: formData.semesterTo || '',
        currency: formData.currency || 'BDT',
        isForeign: formData.isForeign || false,
        activeFrom: formData.activeFrom || '',
        activeTo: formData.activeTo || '',
        remarks: formData.remarks || '',
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

  const campuses = ['All', 'Permanent Campus', 'Main Campus', 'Uttara Campus', 'Banasree Campus']
  const programs = ['All', 'CSE', 'BBA', 'LLB', 'MBA', 'EEE', 'Civil', 'English', 'BANG', 'BPharm', 'MSCM', 'ECSE', 'ELL', 'MAB', 'CE']
  const semesters = ['Spring 24', 'Summer 24', 'Fall 24', 'Spring 25', 'Summer 25', 'Fall 25']

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Cost Package</h1>
          <p className="text-sm text-gray-600">Create and manage program-wise cost packages</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleOpenWizard()} className="nu-button-primary">
            Create Cost Package
          </Button>
          <Button variant="outline">
            Cost Package List
          </Button>
        </div>
      </div>

      {/* Horizontal Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Any Text</label>
              <Input
                value={anyText}
                onChange={(e) => setAnyText(e.target.value)}
                placeholder="Search by any text"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Campus</label>
              <select
                value={campusFilter}
                onChange={(e) => setCampusFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                {campuses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Program</label>
              <select
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                {programs.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Is Active</label>
              <select
                value={isActiveFilter}
                onChange={(e) => setIsActiveFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="All">All</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <Button className="nu-button-primary">
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cost Package List Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Package List ({filteredPackages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Program No</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Program</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Campus</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Semester From</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Semester To</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">For Foreign Students</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Is Active</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPackages.map((pkg) => (
                  <tr key={pkg.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm">{pkg.programNo}</td>
                    <td className="p-3 text-sm font-medium">{pkg.program}</td>
                    <td className="p-3 text-sm">{pkg.campus}</td>
                    <td className="p-3 text-sm">{pkg.semesterFrom}</td>
                    <td className="p-3 text-sm">{pkg.semesterTo || ''}</td>
                    <td className="p-3 text-sm">{pkg.isForeign ? 'Yes' : 'No'}</td>
                    <td className="p-3 text-sm">{pkg.status === 'Active' ? 'Yes' : 'No'}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenWizard(pkg)}
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          View
                        </button>
                        <span className="text-gray-400">/</span>
                        <button
                          onClick={() => handleOpenWizard(pkg)}
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          Edit
                        </button>
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
              <h3 className="font-semibold text-lg">Step 1: Package Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Program No</label>
                  <Input
                    value={formData.programNo}
                    onChange={(e) => setFormData({ ...formData, programNo: e.target.value })}
                    placeholder="Auto-generated"
                    disabled={!!editingPackage}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Package No *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter package name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Campus</label>
                  <select
                    value={formData.campus}
                    onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {campuses.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Program</label>
                  <select
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {programs.filter(p => p !== 'All').map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">From Semester</label>
                  <select
                    value={formData.semesterFrom}
                    onChange={(e) => setFormData({ ...formData, semesterFrom: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">To Semester</label>
                  <select
                    value={formData.semesterTo}
                    onChange={(e) => setFormData({ ...formData, semesterTo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Not specified</option>
                    {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <Input
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    placeholder="BDT"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.status === 'Active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'Active' : 'Inactive' })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">Is Active</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isForeign"
                    checked={formData.isForeign}
                    onChange={(e) => setFormData({ ...formData, isForeign: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isForeign" className="text-sm font-medium">Is Foreign Student</label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Active From</label>
                  <Input
                    type="date"
                    value={formData.activeFrom}
                    onChange={(e) => setFormData({ ...formData, activeFrom: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Active To</label>
                  <Input
                    type="date"
                    value={formData.activeTo}
                    onChange={(e) => setFormData({ ...formData, activeTo: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Remarks</label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    rows={3}
                    placeholder="Optional notes"
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
                  <div><span className="font-medium">Program No:</span> {formData.programNo}</div>
                  <div><span className="font-medium">Campus:</span> {formData.campus}</div>
                  <div><span className="font-medium">Program:</span> {formData.program}</div>
                  <div><span className="font-medium">From Semester:</span> {formData.semesterFrom}</div>
                  <div><span className="font-medium">To Semester:</span> {formData.semesterTo || 'Not specified'}</div>
                  <div><span className="font-medium">Currency:</span> {formData.currency}</div>
                  <div><span className="font-medium">Is Active:</span> {formData.status === 'Active' ? 'Yes' : 'No'}</div>
                  <div><span className="font-medium">For Foreign Students:</span> {formData.isForeign ? 'Yes' : 'No'}</div>
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
