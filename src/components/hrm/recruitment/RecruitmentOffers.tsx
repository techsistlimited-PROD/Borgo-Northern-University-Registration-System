import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Eye, Send, CheckCircle, X, Plus, ArrowLeft, FileText, DollarSign } from 'lucide-react'
import { OFFER_LETTERS, RECRUITMENT_CANDIDATES, RECRUITMENT_VACANCIES, type OfferLetter } from '@/lib/recruitmentStatic'
import { DEMO_MODE, showDemoToast } from '@/config/demo'

export default function RecruitmentOffers() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<OfferLetter | null>(null)
  
  // Create form state
  const [selectedCandidate, setSelectedCandidate] = useState('')
  const [selectedVacancy, setSelectedVacancy] = useState('')
  const [offeredDesignation, setOfferedDesignation] = useState('')
  const [grade, setGrade] = useState('')
  const [baseSalary, setBaseSalary] = useState('')
  const [houseAllowance, setHouseAllowance] = useState('')
  const [medicalAllowance, setMedicalAllowance] = useState('')
  const [transportAllowance, setTransportAllowance] = useState('')
  const [otherAllowance, setOtherAllowance] = useState('')
  const [joiningDate, setJoiningDate] = useState('')
  const [location, setLocation] = useState('')
  const [contractType, setContractType] = useState<'Permanent' | 'Contract' | 'Visiting'>('Permanent')

  const stats = {
    draft: OFFER_LETTERS.filter(o => o.status === 'Draft').length,
    sent: OFFER_LETTERS.filter(o => o.status === 'Sent').length,
    accepted: OFFER_LETTERS.filter(o => o.status === 'Accepted').length,
    rejected: OFFER_LETTERS.filter(o => o.status === 'Rejected').length
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, any> = {
      'Draft': 'secondary',
      'Sent': 'outline',
      'Accepted': 'default',
      'Rejected': 'destructive',
      'Expired': 'secondary'
    }
    return colors[status] || 'outline'
  }

  // Filter candidates who have been interviewed
  const interviewedCandidates = RECRUITMENT_CANDIDATES.filter(c => c.status === 'Interviewed')

  const handleCreateOffer = () => {
    if (DEMO_MODE) {
      alert(showDemoToast('Create offer letter'))
      resetCreateForm()
      setShowCreateDialog(false)
      return
    }
  }

  const resetCreateForm = () => {
    setSelectedCandidate('')
    setSelectedVacancy('')
    setOfferedDesignation('')
    setGrade('')
    setBaseSalary('')
    setHouseAllowance('')
    setMedicalAllowance('')
    setTransportAllowance('')
    setOtherAllowance('')
    setJoiningDate('')
    setLocation('')
    setContractType('Permanent')
  }

  const handleViewOffer = (offer: OfferLetter) => {
    setSelectedOffer(offer)
  }

  const handleSendOffer = (offerId: string) => {
    if (DEMO_MODE) {
      alert(showDemoToast('Send offer letter to candidate'))
    }
  }

  const handleAcceptOffer = (offerId: string) => {
    if (DEMO_MODE) {
      alert(showDemoToast('Mark offer as accepted'))
    }
  }

  const handleRejectOffer = (offerId: string) => {
    if (DEMO_MODE) {
      alert(showDemoToast('Mark offer as rejected'))
    }
  }

  const calculateTotal = () => {
    const base = parseFloat(baseSalary) || 0
    const house = parseFloat(houseAllowance) || 0
    const medical = parseFloat(medicalAllowance) || 0
    const transport = parseFloat(transportAllowance) || 0
    const other = parseFloat(otherAllowance) || 0
    return base + house + medical + transport + other
  }

  // Detail View
  if (selectedOffer) {
    const candidate = RECRUITMENT_CANDIDATES.find(c => c.id === selectedOffer.candidateId)
    const totalPackage = selectedOffer.baseSalary + selectedOffer.allowances.house + selectedOffer.allowances.medical + selectedOffer.allowances.transport + selectedOffer.allowances.other

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setSelectedOffer(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-deep-plum">Offer Letter Details</h1>
              <p className="text-gray-600 text-sm mt-1">{selectedOffer.offerId}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {selectedOffer.status === 'Draft' && (
              <Button onClick={() => handleSendOffer(selectedOffer.offerId)} className="bg-deep-plum">
                <Send className="w-4 h-4 mr-2" />
                Send Offer
              </Button>
            )}
            {selectedOffer.status === 'Sent' && (
              <>
                <Button onClick={() => handleAcceptOffer(selectedOffer.offerId)} variant="outline" className="text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Accepted
                </Button>
                <Button onClick={() => handleRejectOffer(selectedOffer.offerId)} variant="outline" className="text-red-600">
                  <X className="w-4 h-4 mr-2" />
                  Mark Rejected
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Candidate Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Candidate Name</p>
                  <p className="font-medium">{candidate?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{candidate?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Vacancy Reference</p>
                  <p className="font-medium">{selectedOffer.vacancyRef}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-medium">{candidate?.department}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Offer Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge variant={getStatusColor(selectedOffer.status)} className="mt-1">
                  {selectedOffer.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Offer ID</p>
                <p className="font-medium">{selectedOffer.offerId}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Position Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Designation</p>
                  <p className="font-medium">{selectedOffer.offeredDesignation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Grade</p>
                  <p className="font-medium">{selectedOffer.grade}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contract Type</p>
                  <p className="font-medium">{selectedOffer.contractType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{selectedOffer.location}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Joining Date</p>
                  <p className="font-medium">{new Date(selectedOffer.joiningDate).toLocaleDateString('en-GB')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Compensation Package
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Base Salary</span>
                  <span className="font-medium">৳ {selectedOffer.baseSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">House Allowance</span>
                  <span className="font-medium">৳ {selectedOffer.allowances.house.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Medical Allowance</span>
                  <span className="font-medium">৳ {selectedOffer.allowances.medical.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Transport Allowance</span>
                  <span className="font-medium">৳ {selectedOffer.allowances.transport.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Other Allowances</span>
                  <span className="font-medium">৳ {selectedOffer.allowances.other.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold">Total Package</span>
                  <span className="font-bold text-deep-plum text-lg">৳ {totalPackage.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedOffer.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{selectedOffer.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Draft', count: stats.draft, color: 'gray' },
          { label: 'Sent', count: stats.sent, color: 'blue' },
          { label: 'Accepted', count: stats.accepted, color: 'green' },
          { label: 'Rejected', count: stats.rejected, color: 'red' }
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="pt-6 text-center">
              <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.count}</p>
              <p className="text-sm">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Offer Management</CardTitle>
            <Button onClick={() => setShowCreateDialog(true)} className="bg-deep-plum hover:bg-deep-plum/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Offer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Offer ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Candidate</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Vacancy</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Designation</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Grade</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Base Salary</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Total Package</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Joining Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {OFFER_LETTERS.map(offer => {
                  const candidate = RECRUITMENT_CANDIDATES.find(c => c.id === offer.candidateId)
                  const totalPackage = offer.baseSalary + offer.allowances.house + offer.allowances.medical + offer.allowances.transport + offer.allowances.other
                  
                  return (
                    <tr key={offer.offerId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{offer.offerId}</td>
                      <td className="px-4 py-3 text-sm">{candidate?.name || 'Unknown'}</td>
                      <td className="px-4 py-3 text-sm">{offer.vacancyRef}</td>
                      <td className="px-4 py-3 text-sm">{offer.offeredDesignation}</td>
                      <td className="px-4 py-3 text-sm">{offer.grade}</td>
                      <td className="px-4 py-3 text-sm">৳ {offer.baseSalary.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm font-medium">৳ {totalPackage.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">{offer.joiningDate}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant={getStatusColor(offer.status)}>{offer.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => handleViewOffer(offer)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          {offer.status === 'Draft' && (
                            <Button size="sm" variant="ghost" onClick={() => handleSendOffer(offer.offerId)}>
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                          {offer.status === 'Sent' && (
                            <>
                              <Button size="sm" variant="ghost" className="text-green-600" onClick={() => handleAcceptOffer(offer.offerId)}>
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleRejectOffer(offer.offerId)}>
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Offer Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Offer Letter</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Candidate Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold text-deep-plum">Candidate Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Candidate *</label>
                  <select
                    value={selectedCandidate}
                    onChange={(e) => {
                      setSelectedCandidate(e.target.value)
                      const candidate = RECRUITMENT_CANDIDATES.find(c => c.id === e.target.value)
                      if (candidate) {
                        setSelectedVacancy(candidate.appliedForRef)
                      }
                    }}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select interviewed candidate</option>
                    {interviewedCandidates.map(can => (
                      <option key={can.id} value={can.id}>
                        {can.name} - {can.trackingNo} ({can.appliedForTitle})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Vacancy Reference</label>
                  <Input value={selectedVacancy} disabled />
                </div>
              </div>
            </div>

            {/* Position Details */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-deep-plum">Position Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Offered Designation *</label>
                  <Input
                    value={offeredDesignation}
                    onChange={(e) => setOfferedDesignation(e.target.value)}
                    placeholder="e.g., Assistant Professor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Grade *</label>
                  <Input
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="e.g., G-7"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contract Type *</label>
                  <select
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value as any)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Permanent">Permanent</option>
                    <option value="Contract">Contract</option>
                    <option value="Visiting">Visiting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location *</label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Permanent Campus"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Joining Date *</label>
                  <Input
                    type="date"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

            {/* Compensation */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-deep-plum">Compensation Package</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Base Salary (BDT) *</label>
                  <Input
                    type="number"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(e.target.value)}
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">House Allowance (BDT)</label>
                  <Input
                    type="number"
                    value={houseAllowance}
                    onChange={(e) => setHouseAllowance(e.target.value)}
                    placeholder="15000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Medical Allowance (BDT)</label>
                  <Input
                    type="number"
                    value={medicalAllowance}
                    onChange={(e) => setMedicalAllowance(e.target.value)}
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Transport Allowance (BDT)</label>
                  <Input
                    type="number"
                    value={transportAllowance}
                    onChange={(e) => setTransportAllowance(e.target.value)}
                    placeholder="3000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Other Allowances (BDT)</label>
                  <Input
                    type="number"
                    value={otherAllowance}
                    onChange={(e) => setOtherAllowance(e.target.value)}
                    placeholder="2000"
                  />
                </div>
                <div className="flex items-end">
                  <div className="w-full p-3 bg-mint-green/20 rounded-md border border-deep-plum">
                    <p className="text-sm text-gray-600">Total Package</p>
                    <p className="text-xl font-bold text-deep-plum">৳ {calculateTotal().toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => {
                  resetCreateForm()
                  setShowCreateDialog(false)
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateOffer}
                disabled={!selectedCandidate || !offeredDesignation || !grade || !baseSalary || !joiningDate || !location}
                className="bg-deep-plum hover:bg-deep-plum/90"
              >
                <FileText className="w-4 h-4 mr-2" />
                Create Offer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
