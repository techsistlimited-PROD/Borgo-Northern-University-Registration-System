import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye } from 'lucide-react'
import { ConvocationRegistration } from '../data/convocation'
import { getRegStatusColor, getFeeStatusColor } from '../utils/convocation'

interface ConvocationRegistrationTableProps {
  registrations: ConvocationRegistration[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  onView: (registration: ConvocationRegistration) => void
}

export default function ConvocationRegistrationTable({
  registrations,
  selectedIds,
  onSelectionChange,
  onView
}: ConvocationRegistrationTableProps) {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(registrations.map(r => r.id))
    } else {
      onSelectionChange([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id])
    } else {
      onSelectionChange(selectedIds.filter(sid => sid !== id))
    }
  }

  return (
    <div className="border rounded-lg bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.length === registrations.length && registrations.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Student ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead>CGPA</TableHead>
            <TableHead>Fee Status</TableHead>
            <TableHead>Reg Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                No registrations found
              </TableCell>
            </TableRow>
          ) : (
            registrations.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(registration.id)}
                    onCheckedChange={(checked) => handleSelectOne(registration.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell className="font-medium">{registration.studentId}</TableCell>
                <TableCell>{registration.studentName}</TableCell>
                <TableCell>{registration.program}</TableCell>
                <TableCell>{registration.completedCredits}</TableCell>
                <TableCell>{registration.cgpa.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={getFeeStatusColor(registration.feeStatus)}>
                    {registration.feeStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getRegStatusColor(registration.regStatus)}>
                    {registration.regStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onView(registration)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
