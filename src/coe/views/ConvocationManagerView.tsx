import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Download, Printer } from 'lucide-react'
import { ConvocationEvent, ConvocationRegistration, CONVOCATION_EVENTS, CONVOCATION_REGISTRATIONS, getRegistrationsByEvent } from '../data/convocation'
import { downloadConvocationCsv, downloadEventsCsv } from '../utils/convocation'
import ConvocationEventTable from '../components/ConvocationEventTable'
import ConvocationRegistrationTable from '../components/ConvocationRegistrationTable'
import ConvocationCreateDialog from '../components/ConvocationCreateDialog'
import ConvocationBulkActionsBar from '../components/ConvocationBulkActionsBar'

export default function ConvocationManagerView() {
  const [events, setEvents] = useState<ConvocationEvent[]>(CONVOCATION_EVENTS)
  const [registrations, setRegistrations] = useState<ConvocationRegistration[]>(CONVOCATION_REGISTRATIONS)
  const [selectedEvent, setSelectedEvent] = useState<ConvocationEvent | null>(null)
  const [selectedRegIds, setSelectedRegIds] = useState<string[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  })

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (filters.status !== 'all' && e.status !== filters.status) return false
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        return (
          e.convocationNo.toLowerCase().includes(searchLower) ||
          e.title.toLowerCase().includes(searchLower)
        )
      }
      return true
    })
  }, [events, filters])

  const eventRegistrations = useMemo(() => {
    if (!selectedEvent) return []
    return registrations.filter(r => r.eventId === selectedEvent.id)
  }, [registrations, selectedEvent])

  const handleCreateEvent = (data: any) => {
    const newEvent: ConvocationEvent = {
      id: `conv-e-${Date.now()}`,
      convocationNo: data.convocationNo,
      title: data.title,
      coveredSemFrom: data.coveredSemFrom,
      coveredSemTo: data.coveredSemTo,
      cbeFrom: data.cbeFrom,
      cbeTo: data.cbeTo,
      regStart: data.regStart,
      regEnd: data.regEnd,
      eventDate: data.eventDate,
      isHeldByMark: false,
      status: 'Draft',
      venue: data.venue,
      totalRegistrations: 0,
      approvedRegistrations: 0
    }
    setEvents([newEvent, ...events])
  }

  const handleOpenReg = (event: ConvocationEvent) => {
    setEvents(events.map(e =>
      e.id === event.id ? { ...e, status: 'Open' as const, isHeldByMark: true } : e
    ))
  }

  const handleCloseReg = (event: ConvocationEvent) => {
    setEvents(events.map(e =>
      e.id === event.id ? { ...e, status: 'Closed' as const } : e
    ))
  }

  const handleViewEvent = (event: ConvocationEvent) => {
    setSelectedEvent(event)
  }

  const handleBulkApprove = () => {
    setRegistrations(registrations.map(r =>
      selectedRegIds.includes(r.id)
        ? {
            ...r,
            regStatus: 'Approved' as const,
            approvedBy: 'COE Office',
            approvedDate: new Date().toISOString().split('T')[0],
            auditLog: [
              ...r.auditLog,
              {
                action: 'Approved',
                by: 'COE Office',
                date: new Date().toISOString(),
                remarks: 'Bulk approved'
              }
            ]
          }
        : r
    ))
    setSelectedRegIds([])
    updateEventCounts()
  }

  const handleBulkReject = () => {
    setRegistrations(registrations.map(r =>
      selectedRegIds.includes(r.id)
        ? {
            ...r,
            regStatus: 'Rejected' as const,
            approvedBy: 'COE Office',
            approvedDate: new Date().toISOString().split('T')[0],
            auditLog: [
              ...r.auditLog,
              {
                action: 'Rejected',
                by: 'COE Office',
                date: new Date().toISOString(),
                remarks: 'Bulk rejected'
              }
            ]
          }
        : r
    ))
    setSelectedRegIds([])
    updateEventCounts()
  }

  const handleBulkMarkPaid = () => {
    setRegistrations(registrations.map(r =>
      selectedRegIds.includes(r.id)
        ? {
            ...r,
            feeStatus: 'Paid' as const,
            auditLog: [
              ...r.auditLog,
              {
                action: 'Fee Marked Paid',
                by: 'COE Office',
                date: new Date().toISOString(),
                remarks: 'Bulk payment processed'
              }
            ]
          }
        : r
    ))
    setSelectedRegIds([])
  }

  const handleBulkExport = () => {
    const selected = registrations.filter(r => selectedRegIds.includes(r.id))
    downloadConvocationCsv(selected)
  }

  const handleBulkPrint = () => {
    window.print()
  }

  const updateEventCounts = () => {
    events.forEach(event => {
      const eventRegs = registrations.filter(r => r.eventId === event.id)
      const approved = eventRegs.filter(r => r.regStatus === 'Approved').length
      setEvents(prevEvents => prevEvents.map(e =>
        e.id === event.id
          ? { ...e, totalRegistrations: eventRegs.length, approvedRegistrations: approved }
          : e
      ))
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Convocation Manager</h1>
          <p className="text-gray-600 mt-1">
            Manage convocation events and student registrations
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateDialog(true)} className="nu-button-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
          <Button variant="outline" onClick={() => downloadEventsCsv(events)}>
            <Download className="w-4 h-4 mr-2" />
            Export Events
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
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
            <CardTitle>Convocation Events</CardTitle>
            <div className="text-sm text-gray-500">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ConvocationEventTable
            events={filteredEvents}
            onView={handleViewEvent}
            onEdit={() => {}}
            onOpenReg={handleOpenReg}
            onCloseReg={handleCloseReg}
          />
        </CardContent>
      </Card>

      {selectedEvent && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Registrations - {selectedEvent.convocationNo}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">{selectedEvent.title}</p>
              </div>
              <Button variant="outline" onClick={() => downloadConvocationCsv(eventRegistrations)}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ConvocationRegistrationTable
              registrations={eventRegistrations}
              selectedIds={selectedRegIds}
              onSelectionChange={setSelectedRegIds}
              onView={() => {}}
            />
          </CardContent>
        </Card>
      )}

      <ConvocationBulkActionsBar
        selectedCount={selectedRegIds.length}
        onApprove={handleBulkApprove}
        onReject={handleBulkReject}
        onMarkPaid={handleBulkMarkPaid}
        onExport={handleBulkExport}
        onPrint={handleBulkPrint}
        onClear={() => setSelectedRegIds([])}
      />

      <ConvocationCreateDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreate={handleCreateEvent}
      />
    </div>
  )
}
