import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, RefreshCw } from 'lucide-react'
import { ScholarshipRule, ScholarshipProposal, SCHOLARSHIP_RULES, SCHOLARSHIP_PROPOSALS } from '../data/scholarships'
import { downloadScholarshipsCsv } from '../utils/scholarships'
import ScholarshipRuleCard from '../components/ScholarshipRuleCard'
import ScholarshipProposalsTable from '../components/ScholarshipProposalsTable'
import ScholarshipDecisionDialog from '../components/ScholarshipDecisionDialog'

export default function ScholarshipAssignView() {
  const [rules, setRules] = useState<ScholarshipRule[]>(SCHOLARSHIP_RULES)
  const [proposals, setProposals] = useState<ScholarshipProposal[]>(SCHOLARSHIP_PROPOSALS)
  const [selectedProposal, setSelectedProposal] = useState<ScholarshipProposal | null>(null)
  const [showDecisionDialog, setShowDecisionDialog] = useState(false)

  const [filters, setFilters] = useState({
    program: 'all',
    status: 'all',
    search: ''
  })

  const filteredProposals = useMemo(() => {
    return proposals.filter(p => {
      if (filters.program !== 'all' && p.program !== filters.program) return false
      if (filters.status !== 'all' && p.status !== filters.status) return false
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        return (
          p.studentId.toLowerCase().includes(searchLower) ||
          p.studentName.toLowerCase().includes(searchLower)
        )
      }
      return true
    })
  }, [proposals, filters])

  const handleUpdateRule = (ruleId: string, waiverPercent: number) => {
    setRules(rules.map(r =>
      r.id === ruleId ? { ...r, waiverPercent } : r
    ))
  }

  const handleResetRules = () => {
    setRules(SCHOLARSHIP_RULES)
  }

  const handleEvaluate = (proposal: ScholarshipProposal) => {
    setSelectedProposal(proposal)
    setShowDecisionDialog(true)
  }

  const handleDecision = (proposalId: string, tier: string, waiverPercent: number, notes: string) => {
    setProposals(proposals.map(p =>
      p.id === proposalId
        ? {
            ...p,
            tierSuggested: tier,
            waiverPercent,
            notes,
            approverTrail: [
              ...p.approverTrail,
              {
                action: 'Evaluated',
                by: 'COE Office',
                date: new Date().toISOString().split('T')[0],
                remarks: `Set to ${tier} with ${waiverPercent}% waiver`
              }
            ]
          }
        : p
    ))
  }

  const handleApprove = (proposalId: string) => {
    setProposals(proposals.map(p =>
      p.id === proposalId
        ? {
            ...p,
            status: 'Approved' as const,
            approverTrail: [
              ...p.approverTrail,
              {
                action: 'Approved',
                by: 'COE Office',
                date: new Date().toISOString().split('T')[0],
                remarks: 'Scholarship approved'
              }
            ]
          }
        : p
    ))
  }

  const handleReject = (proposalId: string) => {
    setProposals(proposals.map(p =>
      p.id === proposalId
        ? {
            ...p,
            status: 'Rejected' as const,
            approverTrail: [
              ...p.approverTrail,
              {
                action: 'Rejected',
                by: 'COE Office',
                date: new Date().toISOString().split('T')[0],
                remarks: 'Scholarship rejected'
              }
            ]
          }
        : p
    ))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Scholarship Assign</h1>
          <p className="text-gray-600 mt-1">
            Manage scholarship tiers and evaluate student proposals
          </p>
        </div>
        <Button variant="outline" onClick={() => downloadScholarshipsCsv(proposals)}>
          <Download className="w-4 h-4 mr-2" />
          Export Proposals
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Scholarship Tiers</CardTitle>
                <Button size="sm" variant="ghost" onClick={handleResetRules}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {rules.map((rule) => (
                <ScholarshipRuleCard
                  key={rule.id}
                  rule={rule}
                  onUpdate={handleUpdateRule}
                />
              ))}
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-4">
              <div className="text-sm text-blue-900">
                <div className="font-medium mb-2">Notice</div>
                <p className="text-blue-700">
                  Finance or TER holds do not block scholarship assignment. They are read-only notices.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <Select value={filters.program} onValueChange={(v) => setFilters({ ...filters, program: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Programs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Programs</SelectItem>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="BBA">BBA</SelectItem>
                    <SelectItem value="EEE">EEE</SelectItem>
                    <SelectItem value="LLB">LLB</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Proposed">Proposed</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Assigned">Assigned</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Search..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Scholarship Proposals</CardTitle>
                <div className="text-sm text-gray-500">
                  {filteredProposals.length} proposal{filteredProposals.length !== 1 ? 's' : ''}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScholarshipProposalsTable
                proposals={filteredProposals}
                onEvaluate={handleEvaluate}
                onApprove={handleApprove}
                onReject={handleReject}
                onView={(p) => {
                  setSelectedProposal(p)
                  setShowDecisionDialog(true)
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <ScholarshipDecisionDialog
        open={showDecisionDialog}
        onClose={() => setShowDecisionDialog(false)}
        proposal={selectedProposal}
        onDecide={handleDecision}
      />
    </div>
  )
}
