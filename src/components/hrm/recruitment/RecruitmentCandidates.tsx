import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Search, Eye, Download, Tag, X } from 'lucide-react'
import { RECRUITMENT_CANDIDATES, type Candidate, SHORTLIST_RULES } from '@/lib/recruitmentStatic'

export default function RecruitmentCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>(RECRUITMENT_CANDIDATES)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [viewCandidate, setViewCandidate] = useState<Candidate | null>(null)
  const [activeTab, setActiveTab] = useState<'profile' | 'resume' | 'history'>('profile')

  const filtered = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                         c.email.toLowerCase().includes(search.toLowerCase()) ||
                         c.trackingNo.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !filterStatus || c.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    applied: candidates.filter(c => c.status === 'Applied').length,
    screened: candidates.filter(c => c.status === 'Screened').length,
    shortlisted: candidates.filter(c => c.status === 'Shortlisted').length,
    interviewed: candidates.filter(c => c.status === 'Interviewed').length,
    offered: candidates.filter(c => c.status === 'Offered').length,
    onboarded: candidates.filter(c => c.status === 'Onboarded').length
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, any> = {
      'Applied': 'secondary',
      'Screened': 'outline',
      'Shortlisted': 'default',
      'Interviewed': 'default',
      'Offered': 'default',
      'Accepted': 'default',
      'Rejected': 'destructive',
      'Onboarded': 'default'
    }
    return colors[status] || 'outline'
  }

  const getEligibility = (candidate: Candidate): { label: string; color: string } => {
    const { cgpa, experienceYears, university } = candidate
    const { minGPA, minExperience, preferredUniversities } = SHORTLIST_RULES

    if (cgpa >= minGPA && experienceYears >= minExperience && preferredUniversities.includes(university)) {
      return { label: 'Eligible', color: 'text-green-600' }
    } else if (cgpa >= minGPA - 0.2 && experienceYears >= minExperience - 1) {
      return { label: 'Borderline', color: 'text-yellow-600' }
    }
    return { label: 'Not Eligible', color: 'text-red-600' }
  }

  const handleStatusChange = (id: string, newStatus: Candidate['status']) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: newStatus,
          history: [...c.history, {
            date: new Date().toISOString().slice(0, 10),
            action: newStatus,
            by: 'HR Officer',
            remarks: `Status changed to ${newStatus}`
          }]
        }
      }
      return c
    }))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: 'Applied', count: stats.applied, color: 'gray' },
          { label: 'Screened', count: stats.screened, color: 'blue' },
          { label: 'Shortlisted', count: stats.shortlisted, color: 'purple' },
          { label: 'Interviewed', count: stats.interviewed, color: 'indigo' },
          { label: 'Offered', count: stats.offered, color: 'teal' },
          { label: 'Onboarded', count: stats.onboarded, color: 'emerald' }
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.count}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters & Table */}
      <Card>
        <CardHeader>
          <CardTitle>Candidate Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search name, email, tracking no..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border rounded-md px-3 py-2">
              <option value="">All Status</option>
              <option value="Applied">Applied</option>
              <option value="Screened">Screened</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interviewed">Interviewed</option>
              <option value="Offered">Offered</option>
              <option value="Rejected">Rejected</option>
            </select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Tracking No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Applied For</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Degree</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Univ</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Exp</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">GPA</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Scores</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(c => {
                  const eligibility = getEligibility(c)
                  return (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{c.trackingNo}</td>
                      <td className="px-4 py-3 text-sm">{c.name}</td>
                      <td className="px-4 py-3 text-sm text-xs">
                        <div>{c.appliedForRef}</div>
                        <div className="text-gray-500">{c.appliedForTitle}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">{c.highestDegree}</td>
                      <td className="px-4 py-3 text-sm">{c.university}</td>
                      <td className="px-4 py-3 text-sm">{c.experienceYears}y</td>
                      <td className="px-4 py-3 text-sm">{c.cgpa.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm"><Badge variant={getStatusColor(c.status)}>{c.status}</Badge></td>
                      <td className="px-4 py-3 text-sm">
                        <div className="text-xs">
                          {c.scorecard.screen > 0 && <div>S: {c.scorecard.screen}</div>}
                          {c.scorecard.interview > 0 && <div>I: {c.scorecard.interview}</div>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => setViewCandidate(c)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          {c.status === 'Screened' && (
                            <Button size="sm" variant="ghost" onClick={() => handleStatusChange(c.id, 'Shortlisted')} title="Shortlist">
                              <Tag className="w-4 h-4" />
                            </Button>
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

      {/* View Candidate Drawer */}
      {viewCandidate && (
        <Dialog open={!!viewCandidate} onOpenChange={() => setViewCandidate(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{viewCandidate.name}</DialogTitle>
            </DialogHeader>
            
            {/* Tabs */}
            <div className="border-b">
              <div className="flex gap-4">
                {(['profile', 'resume', 'history'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-4">
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-semibold">Email:</span> {viewCandidate.email}</div>
                    <div><span className="font-semibold">Phone:</span> {viewCandidate.phone}</div>
                    <div><span className="font-semibold">Degree:</span> {viewCandidate.highestDegree}</div>
                    <div><span className="font-semibold">University:</span> {viewCandidate.university}</div>
                    <div><span className="font-semibold">CGPA:</span> {viewCandidate.cgpa.toFixed(2)}</div>
                    <div><span className="font-semibold">Experience:</span> {viewCandidate.experienceYears} years</div>
                  </div>
                  <div>
                    <span className="font-semibold">Eligibility: </span>
                    <span className={getEligibility(viewCandidate).color}>
                      {getEligibility(viewCandidate).label}
                    </span>
                  </div>
                  {viewCandidate.tags.length > 0 && (
                    <div>
                      <span className="font-semibold">Tags: </span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {viewCandidate.tags.map((tag, i) => <Badge key={i} variant="outline">{tag}</Badge>)}
                      </div>
                    </div>
                  )}
                  {viewCandidate.notes && (
                    <div>
                      <span className="font-semibold">Notes: </span>
                      <p className="text-sm text-gray-600 mt-1">{viewCandidate.notes}</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'resume' && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <p className="text-gray-500 mb-4">PDF Preview</p>
                  <a href={viewCandidate.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {viewCandidate.resumeUrl}
                  </a>
                </div>
              )}
              
              {activeTab === 'history' && (
                <div className="space-y-3">
                  {viewCandidate.history.map((h, i) => (
                    <div key={i} className="border-l-4 border-blue-600 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-sm">{h.action}</div>
                          <div className="text-xs text-gray-600">{h.remarks}</div>
                        </div>
                        <div className="text-xs text-gray-500">
                          <div>{h.date}</div>
                          <div>by {h.by}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
