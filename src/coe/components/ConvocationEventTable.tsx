import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Edit, CheckCircle, XCircle } from 'lucide-react'
import { ConvocationEvent } from '../data/convocation'
import { getEventStatusColor } from '../utils/convocation'

interface ConvocationEventTableProps {
  events: ConvocationEvent[]
  onView: (event: ConvocationEvent) => void
  onEdit: (event: ConvocationEvent) => void
  onOpenReg: (event: ConvocationEvent) => void
  onCloseReg: (event: ConvocationEvent) => void
}

export default function ConvocationEventTable({
  events,
  onView,
  onEdit,
  onOpenReg,
  onCloseReg
}: ConvocationEventTableProps) {
  return (
    <div className="border rounded-lg bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Convocation No.</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Covered Semester</TableHead>
            <TableHead>CBE Range</TableHead>
            <TableHead>Reg Window</TableHead>
            <TableHead>Event Date</TableHead>
            <TableHead>Registrations</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                No convocation events found
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.convocationNo}</TableCell>
                <TableCell>{event.title}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {event.coveredSemFrom} → {event.coveredSemTo}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {event.cbeFrom} → {event.cbeTo}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {event.regStart} → {event.regEnd}
                  </div>
                </TableCell>
                <TableCell>{event.eventDate}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {event.approvedRegistrations} / {event.totalRegistrations}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getEventStatusColor(event.status)}>
                    {event.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onView(event)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {event.status === 'Draft' && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(event)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onOpenReg(event)}
                      >
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                      </Button>
                    </>
                  )}
                  {event.status === 'Open' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onCloseReg(event)}
                    >
                      <XCircle className="w-4 h-4 text-gray-600" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
