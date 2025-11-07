import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Download, Plus, HelpCircle, FileText, FileSpreadsheet } from 'lucide-react'
import BlockListTable, { BlockListItem } from '@/coe/components/BlockListTable'
import BlockCreateDialog from '@/coe/components/BlockCreateDialog'
import BlockAuditDrawer from '@/coe/components/BlockAuditDrawer'
import BlockBulkActionsBar from '@/coe/components/BlockBulkActionsBar'
import AutoBlockBanner from '@/coe/components/AutoBlockBanner'
import { RESULT_BLOCKS, BLOCK_SETTINGS } from '@/coe/data/blockSettings'
import { getAllSemesters, getAllPrograms } from '@/coe/data/selectors'

export default function BlockManagerView() {
  const semesters = getAllSemesters()
  const programs = getAllPrograms()

  const [selectedSemester, setSelectedSemester] = useState(
    semesters.find(s => s.isCurrentExam)?.id || semesters[0]?.id
  )
  const [selectedProgram, setSelectedProgram] = useState('ALL')
  const [selectedBlockType, setSelectedBlockType] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const [blocks, setBlocks] = useState(
    RESULT_BLOCKS.map(b => ({
      ...b,
      scope: 'Term-wide' as const,
      actionsHeld: ['Results'],
      source: b.blockedBy.includes('System') ? ('Auto' as const) : ('Manual' as const)
    }))
  )

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [viewingBlock, setViewingBlock] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showHelpPopover, setShowHelpPopover] = useState(false)

  const autoBlockSettings = {
    autoBlockOnDues: BLOCK_SETTINGS.autoBlockOnDues,
    autoBlockOnTER: BLOCK_SETTINGS.autoBlockOnTER,
    disciplinaryHold: true
  }

  const filteredData = useMemo(() => {
    let filtered = blocks

    if (selectedSemester) {
      filtered = filtered.filter(b => b.semesterId === selectedSemester)
    }

    if (selectedProgram && selectedProgram !== 'ALL') {
      filtered = filtered.filter(b => b.programCode === selectedProgram)
    }

    if (selectedBlockType) {
      const typeMap: Record<string, string> = {
        Finance: 'Finance Dues',
        TER: 'TER Not Submitted',
        Disciplinary: 'Disciplinary Action',
        Custom: 'Custom'
      }
      filtered = filtered.filter(b => b.reason === typeMap[selectedBlockType] || b.reason === selectedBlockType)
    }

    if (selectedStatus) {
      filtered = filtered.filter(b => b.status === selectedStatus)
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        b => b.studentId.toLowerCase().includes(term) || b.studentName.toLowerCase().includes(term)
      )
    }

    return filtered
  }, [blocks, selectedSemester, selectedProgram, selectedBlockType, selectedStatus, searchTerm])

  const getBlockType = (reason: string): 'Finance' | 'TER' | 'Disciplinary' | 'Custom' => {
    if (reason.includes('Finance')) return 'Finance'
    if (reason.includes('TER')) return 'TER'
    if (reason.includes('Disciplinary')) return 'Disciplinary'
    return 'Custom'
  }

  const blockListData: BlockListItem[] = filteredData.map(b => ({
    id: b.id,
    studentId: b.studentId,
    studentName: b.studentName,
    programCode: b.programCode,
    blockType: getBlockType(b.reason),
    scope: (b as any).scope || 'Term-wide',
    actionsHeld: (b as any).actionsHeld || ['Results'],
    source: (b as any).source || 'Manual',
    status: b.status === 'Removed' ? 'Cleared' : 'Active',
    createdOn: b.blockDate,
    clearedOn: b.removeDate,
    clearedBy: b.removedBy
  }))

  const handleBulkAction = (action: string, prompt: string) => {
    const notes = window.prompt(prompt)
    if (!notes || !notes.trim()) {
      alert('Notes are required')
      return
    }

    const timestamp = new Date().toISOString().split('T')[0]

    if (action === 'clear') {
      setBlocks(
        blocks.map(b =>
          selectedIds.includes(b.id)
            ? {
                ...b,
                status: 'Removed' as const,
                removedBy: 'COE Officer',
                removeDate: timestamp,
                auditLog: [
                  ...b.auditLog,
                  { action: 'Cleared', by: 'COE Officer', date: timestamp, remarks: notes }
                ]
              }
            : b
        )
      )
    } else {
      const reasonMap: Record<string, string> = {
        disciplinary: 'Disciplinary Action',
        finance: 'Finance Dues',
        ter: 'TER Not Submitted'
      }
      setBlocks(
        blocks.map(b =>
          selectedIds.includes(b.id)
            ? {
                ...b,
                reason: reasonMap[action] as any,
                auditLog: [
                  ...b.auditLog,
                  { action: `Updated to ${reasonMap[action]}`, by: 'COE Officer', date: timestamp, remarks: notes }
                ]
              }
            : b
        )
      )
    }

    setSelectedIds([])
  }

  const handleClearBlock = (id: string, notes: string) => {
    const timestamp = new Date().toISOString().split('T')[0]
    setBlocks(
      blocks.map(b =>
        b.id === id
          ? {
              ...b,
              status: 'Removed' as const,
              removedBy: 'COE Officer',
              removeDate: timestamp,
              auditLog: [
                ...b.auditLog,
                { action: 'Cleared', by: 'COE Officer', date: timestamp, remarks: notes }
              ]
            }
          : b
      )
    )
  }

  const handleEditBlock = (
    id: string,
    updates: { scope: string; actionsHeld: string[]; notes: string }
  ) => {
    const timestamp = new Date().toISOString().split('T')[0]
    setBlocks(
      blocks.map(b =>
        b.id === id
          ? {
              ...b,
              scope: updates.scope as any,
              actionsHeld: updates.actionsHeld,
              notes: b.notes + '\n' + updates.notes,
              auditLog: [
                ...b.auditLog,
                { action: 'Updated', by: 'COE Officer', date: timestamp, remarks: 'Block details updated' }
              ]
            }
          : b
      )
    )
  }

  const handleCreateBlock = (blockData: any) => {
    const newId = `block-${Date.now()}`
    const timestamp = new Date().toISOString().split('T')[0]

    const newBlock = {
      id: newId,
      studentId: blockData.studentId,
      studentName: blockData.studentName,
      programCode: blockData.programCode,
      semesterId: selectedSemester,
      reason: blockData.reasonPreset as any,
      customReason: blockData.blockType === 'Custom' ? blockData.customNotes : undefined,
      startDate: blockData.effectiveFrom,
      endDate: blockData.effectiveTo,
      status: 'Active' as const,
      blockedBy: 'COE Officer',
      blockDate: timestamp,
      removedBy: null,
      removeDate: null,
      notes: blockData.customNotes,
      scope: blockData.scope,
      actionsHeld: blockData.actionsHeld,
      source: 'Manual' as const,
      auditLog: [
        {
          action: 'Created',
          by: 'COE Officer',
          date: timestamp,
          remarks: 'Block created manually'
        }
      ]
    }

    setBlocks([...blocks, newBlock])
  }

  const handleExportCSV = () => {
    const csvRows = [
      [
        'Student ID',
        'Name',
        'Program',
        'Block Type',
        'Scope',
        'Actions Held',
        'Status',
        'Source',
        'Created On',
        'Cleared On'
      ],
      ...blockListData.map(item => [
        item.studentId,
        item.studentName,
        item.programCode,
        item.blockType,
        item.scope,
        item.actionsHeld.join('; '),
        item.status,
        item.source,
        item.createdOn,
        item.clearedOn || ''
      ])
    ]

    const csvContent = csvRows.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `result-blocks-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExportPDF = () => {
    window.print()
  }

  const viewingBlockDetail = useMemo(() => {
    if (!viewingBlock) return null
    const block = blocks.find(b => b.id === viewingBlock)
    if (!block) return null

    return {
      id: block.id,
      studentId: block.studentId,
      studentName: block.studentName,
      programCode: block.programCode,
      blockType: getBlockType(block.reason),
      scope: (block as any).scope || 'Term-wide',
      actionsHeld: (block as any).actionsHeld || ['Results'],
      source: (block as any).source || 'Manual',
      status: block.status === 'Removed' ? ('Cleared' as const) : ('Active' as const),
      reason: block.reason,
      notes: block.notes,
      createdOn: block.blockDate,
      createdBy: block.blockedBy,
      clearedOn: block.removeDate,
      clearedBy: block.removedBy,
      auditLog: block.auditLog
    }
  }, [viewingBlock, blocks])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Result Block / Unblock</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage student result blocks and unblocks
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-deep-plum to-accent-purple text-white hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Block
          </Button>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onMouseEnter={() => setShowHelpPopover(true)}
              onMouseLeave={() => setShowHelpPopover(false)}
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
            {showHelpPopover && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border shadow-lg rounded-md p-4 z-10">
                <p className="text-xs text-gray-700">
                  <strong>Result Blocks</strong> prevent students from accessing results, transcripts, or certificates.
                  Auto-blocks trigger based on finance dues or TER submission status. Manual blocks can be created for
                  disciplinary or custom reasons.
                </p>
              </div>
            )}
          </div>
          <div className="relative group">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <div className="absolute right-0 top-full mt-1 w-40 bg-white border shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={handleExportCSV}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={handleExportPDF}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <AutoBlockBanner settings={autoBlockSettings} />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-700">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <select
                value={selectedSemester}
                onChange={e => setSelectedSemester(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {semesters.map(sem => (
                  <option key={sem.id} value={sem.id}>
                    {sem.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
              <select
                value={selectedProgram}
                onChange={e => setSelectedProgram(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {programs.map(prog => (
                  <option key={prog.id} value={prog.code}>
                    {prog.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Block Type</label>
              <select
                value={selectedBlockType}
                onChange={e => setSelectedBlockType(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Types</option>
                <option value="Finance">Finance</option>
                <option value="TER">TER</option>
                <option value="Disciplinary">Disciplinary</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Removed">Cleared</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <Input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Student ID / Name"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <BlockBulkActionsBar
        selectedCount={selectedIds.length}
        onClearBlocks={() => handleBulkAction('clear', 'Enter clear notes:')}
        onMarkDisciplinary={() => handleBulkAction('disciplinary', 'Enter disciplinary notes:')}
        onMarkFinance={() => handleBulkAction('finance', 'Enter finance notes:')}
        onMarkTER={() => handleBulkAction('ter', 'Enter TER notes:')}
        onExportSelected={handleExportCSV}
        onClearSelection={() => setSelectedIds([])}
      />

      <BlockListTable
        data={blockListData}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onView={setViewingBlock}
      />

      <BlockAuditDrawer
        open={!!viewingBlock}
        onOpenChange={open => !open && setViewingBlock(null)}
        block={viewingBlockDetail}
        onClear={handleClearBlock}
        onEdit={handleEditBlock}
      />

      <BlockCreateDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateBlock}
      />
    </div>
  )
}
