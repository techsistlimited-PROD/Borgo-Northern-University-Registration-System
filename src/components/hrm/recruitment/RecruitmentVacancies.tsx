import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Search, Plus, Eye, Send, CheckCircle, X, Copy } from 'lucide-react'
import { RECRUITMENT_VACANCIES, type Vacancy } from '@/lib/recruitmentStatic'

export default function RecruitmentVacancies() {
  const [vacancies, setVacancies] = useState<Vacancy[]>(RECRUITMENT_VACANCIES)
  const [search, setSearch] = useState('')
  const [filterDept, setFilterDept] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showNewModal, setShowNewModal] = useState(false)
  const [viewVacancy, setViewVacancy] = useState<Vacancy | null>(null)

  const filtered = vacancies.filter(v => {
    const matchesSearch = v.ref.toLowerCase().includes(search.toLowerCase()) || 
                         v.title.toLowerCase().includes(search.toLowerCase())
    const matchesDept = !filterDept || v.department === filterDept
    const matchesType = !filterType || v.employmentType === filterType
    const matchesStatus = !filterStatus || v.status === filterStatus
    return matchesSearch && matchesDept && matchesType && matchesStatus
  })

  const stats = {
    draft: vacancies.filter(v => v.status === 'Draft').length,
    pending: vacancies.filter(v => v.status === 'Pending Approval').length,
    published: vacancies.filter(v => v.status === 'Published').length,
    closed: vacancies.filter(v => v.status === 'Closed').length
  }

  const departments = [...new Set(vacancies.map(v => v.department))]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'secondary'
      case 'Pending Approval': return 'outline'
      case 'Approved': return 'default'
      case 'Published': return 'default'
      case 'Closed': return 'destructive'
      default: return 'outline'
    }
  }

  const handleStatusChange = (id: string, newStatus: Vacancy['status']) => {
    setVacancies(prev => prev.map(v => {
      if (v.id === id) {
        const updated = { ...v, status: newStatus }
        if (newStatus === 'Pending Approval') {
          updated.workflow = { ...v.workflow, dept: true, hr: true }
        } else if (newStatus === 'Approved') {
          updated.workflow = { dept: true, hr: true, registrar: true, vc: true, bot: false }
        } else if (newStatus === 'Published') {
          updated.workflow = { dept: true, hr: true, registrar: true, vc: true, bot: true }
        }
        return updated
      }
      return v
    }))
  }

  const WorkflowBadge = ({ workflow }: { workflow: Vacancy['workflow'] }) => (
    <div className="flex gap-1">
      {workflow.dept && <span className="text-green-600">✓D</span>}
      {workflow.hr && <span className="text-green-600">✓H</span>}
      {workflow.registrar && <span className="text-green-600">✓R</span>}
      {workflow.vc && <span className="text-green-600">✓V</span>}
      {workflow.bot && <span className="text-green-600">✓B</span>}
      {!workflow.registrar && <span className="text-gray-400">⏳R</span>}
      {!workflow.vc && workflow.registrar && <span className="text-gray-400">⏳V</span>}
      {!workflow.bot && workflow.vc && <span className="text-gray-400">⏳B</span>}
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600">{stats.draft}</p>
              <p className="text-sm text-gray-600 mt-1">Draft</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-gray-600 mt-1">Pending Approval</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats.published}</p>
              <p className="text-sm text-gray-600 mt-1">Published</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{stats.closed}</p>
              <p className="text-sm text-gray-600 mt-1">Closed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Vacancy Management</CardTitle>
            <Button onClick={() => setShowNewModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Vacancy
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search ref or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="border rounded-md px-3 py-2">
              <option value="">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border rounded-md px-3 py-2">
              <option value="">All Types</option>
              <option value="Permanent">Permanent</option>
              <option value="Contract">Contract</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Visiting">Visiting</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border rounded-md px-3 py-2">
              <option value="">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Published">Published</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Ref</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Dept</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Grade</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Openings</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Workflow</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Deadline</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(v => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{v.ref}</td>
                    <td className="px-4 py-3 text-sm">{v.title}</td>
                    <td className="px-4 py-3 text-sm">{v.department}</td>
                    <td className="px-4 py-3 text-sm"><Badge variant="outline">{v.employmentType}</Badge></td>
                    <td className="px-4 py-3 text-sm">{v.grade}</td>
                    <td className="px-4 py-3 text-sm text-center">{v.openings}</td>
                    <td className="px-4 py-3 text-sm"><WorkflowBadge workflow={v.workflow} /></td>
                    <td className="px-4 py-3 text-sm"><Badge variant={getStatusColor(v.status)}>{v.status}</Badge></td>
                    <td className="px-4 py-3 text-sm">{v.deadline}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setViewVacancy(v)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {v.status === 'Draft' && (
                          <Button size="sm" variant="ghost" onClick={() => handleStatusChange(v.id, 'Pending Approval')}>
                            <Send className="w-4 h-4" />
                          </Button>
                        )}
                        {v.status === 'Pending Approval' && (
                          <Button size="sm" variant="ghost" onClick={() => handleStatusChange(v.id, 'Published')}>
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Drawer */}
      {viewVacancy && (
        <Dialog open={!!viewVacancy} onOpenChange={() => setViewVacancy(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{viewVacancy.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-semibold">Ref:</span> {viewVacancy.ref}</div>
                <div><span className="font-semibold">Department:</span> {viewVacancy.department}</div>
                <div><span className="font-semibold">Type:</span> {viewVacancy.employmentType}</div>
                <div><span className="font-semibold">Grade:</span> {viewVacancy.grade}</div>
                <div><span className="font-semibold">Openings:</span> {viewVacancy.openings}</div>
                <div><span className="font-semibold">Deadline:</span> {viewVacancy.deadline}</div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-gray-600">{viewVacancy.description}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Requirements</h4>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {viewVacancy.requirements.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Desired Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {viewVacancy.desiredSkills.map((s, i) => <Badge key={i} variant="outline">{s}</Badge>)}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
