import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Edit, CheckCircle, XCircle } from 'lucide-react'
import { CBEMeeting } from '../data/cbe'
import { getCBEStatusColor } from '../utils/cbe'

interface CBEMeetingTableProps {
  meetings: CBEMeeting[]
  onView: (meeting: CBEMeeting) => void
  onEdit: (meeting: CBEMeeting) => void
  onPublish: (meeting: CBEMeeting) => void
  onClose: (meeting: CBEMeeting) => void
}

export default function CBEMeetingTable({
  meetings,
  onView,
  onEdit,
  onPublish,
  onClose
}: CBEMeetingTableProps) {
  return (
    <div className="border rounded-lg bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Meeting No.</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Covered Semester</TableHead>
            <TableHead>Meeting Date</TableHead>
            <TableHead>Candidates</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meetings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                No CBE meetings found
              </TableCell>
            </TableRow>
          ) : (
            meetings.map((meeting) => (
              <TableRow key={meeting.id}>
                <TableCell className="font-medium">{meeting.number}</TableCell>
                <TableCell>{meeting.title}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {meeting.coveredSemFrom} → {meeting.coveredSemTo}
                  </div>
                </TableCell>
                <TableCell>{meeting.meetingDate}</TableCell>
                <TableCell>
                  <Badge variant="outline">{meeting.candidatesCount}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getCBEStatusColor(meeting.status)}>
                    {meeting.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onView(meeting)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {meeting.status === 'Draft' && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(meeting)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onPublish(meeting)}
                      >
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                      </Button>
                    </>
                  )}
                  {meeting.status === 'Published' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onClose(meeting)}
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
