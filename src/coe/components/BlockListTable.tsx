import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, ArrowUpDown, CheckSquare, FileText, Award, CreditCard } from 'lucide-react'

export interface BlockListItem {
  id: string
  studentId: string
  studentName: string
  programCode: string
  courseCode?: string
  section?: string
  blockType: 'Finance' | 'TER' | 'Disciplinary' | 'Custom'
  scope: 'Course-only' | 'Term-wide' | 'Program-wide'
  actionsHeld: string[]
  source: 'Auto' | 'Manual'
  status: 'Active' | 'Cleared'
  createdOn: string
  clearedOn: string | null
  clearedBy: string | null
}

interface BlockListTableProps {
  data: BlockListItem[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  onView: (id: string) => void
}

export default function BlockListTable({
  data,
  selectedIds,
  onSelectionChange,
  onView
}: BlockListTableProps) {
  const [sortField, setSortField] = useState<keyof BlockListItem>('createdOn')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSort = (field: keyof BlockListItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]
    if (aVal === null || aVal === undefined) return 1
    if (bVal === null || bVal === undefined) return -1
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSelectAll = () => {
    if (selectedIds.length === data.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(data.map(d => d.id))
    }
  }

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(sid => sid !== id))
    } else {
      onSelectionChange([...selectedIds, id])
    }
  }

  const getStatusBadge = (status: 'Active' | 'Cleared') => {
    return (
      <Badge className={status === 'Active' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}>
        {status}
      </Badge>
    )
  }

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      Finance: 'bg-amber-100 text-amber-700',
      TER: 'bg-amber-100 text-amber-700',
      Disciplinary: 'bg-red-100 text-red-700',
      Custom: 'bg-blue-100 text-blue-700'
    }
    return <Badge className={colors[type] || 'bg-gray-100 text-gray-700'}>{type}</Badge>
  }

  const getActionIcons = (actions: string[]) => {
    const iconMap: Record<string, React.ReactNode> = {
      Results: <CheckSquare className="w-4 h-4 text-purple-600" title="Results" />,
      Transcript: <FileText className="w-4 h-4 text-blue-600" title="Transcript" />,
      Certificates: <Award className="w-4 h-4 text-amber-600" title="Certificates" />,
      Admit: <CreditCard className="w-4 h-4 text-gray-600" title="Admit" />
    }
    return (
      <div className="flex gap-1">
        {actions.map((action, idx) => (
          <span key={idx}>{iconMap[action]}</span>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="border rounded-md overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="text-left p-3 border-b">
                  <Checkbox
                    checked={selectedIds.length === data.length && data.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="text-left p-3 border-b font-semibold">
                  <button onClick={() => handleSort('studentName')} className="flex items-center gap-1 hover:text-deep-plum">
                    Student
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left p-3 border-b font-semibold">Program • Course/Section</th>
                <th className="text-left p-3 border-b font-semibold">
                  <button onClick={() => handleSort('blockType')} className="flex items-center gap-1 hover:text-deep-plum">
                    Block Type
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left p-3 border-b font-semibold">Scope</th>
                <th className="text-left p-3 border-b font-semibold">Actions Held</th>
                <th className="text-left p-3 border-b font-semibold">Source</th>
                <th className="text-left p-3 border-b font-semibold">
                  <button onClick={() => handleSort('status')} className="flex items-center gap-1 hover:text-deep-plum">
                    Status
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left p-3 border-b font-semibold">
                  <button onClick={() => handleSort('createdOn')} className="flex items-center gap-1 hover:text-deep-plum">
                    Created On
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left p-3 border-b font-semibold">Cleared On</th>
                <th className="text-left p-3 border-b font-semibold">Cleared By</th>
                <th className="text-left p-3 border-b font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={12} className="p-8 text-center text-gray-500">
                    No result blocks found
                  </td>
                </tr>
              ) : (
                paginatedData.map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={() => handleSelectOne(item.id)}
                      />
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-deep-plum">{item.studentName}</div>
                      <div className="text-xs text-gray-600">{item.studentId}</div>
                    </td>
                    <td className="p-3 text-xs">
                      <div>{item.programCode}</div>
                      {item.courseCode && (
                        <div className="text-gray-600">
                          {item.courseCode} • {item.section}
                        </div>
                      )}
                    </td>
                    <td className="p-3">{getTypeBadge(item.blockType)}</td>
                    <td className="p-3 text-xs">{item.scope}</td>
                    <td className="p-3">{getActionIcons(item.actionsHeld)}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-xs">
                        {item.source}
                      </Badge>
                    </td>
                    <td className="p-3">{getStatusBadge(item.status)}</td>
                    <td className="p-3 text-xs text-gray-600">{item.createdOn}</td>
                    <td className="p-3 text-xs text-gray-600">{item.clearedOn || '-'}</td>
                    <td className="p-3 text-xs text-gray-600">{item.clearedBy || '-'}</td>
                    <td className="p-3">
                      <Button size="sm" variant="outline" onClick={() => onView(item.id)}>
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  size="sm"
                  variant={currentPage === page ? 'default' : 'outline'}
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? 'bg-gradient-to-r from-deep-plum to-accent-purple text-white' : ''}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
