import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, CheckCircle, XCircle } from 'lucide-react'
import { ScholarshipProposal } from '../data/scholarships'
import { getTierColor, getProposalStatusColor } from '../utils/scholarships'

interface ScholarshipProposalsTableProps {
  proposals: ScholarshipProposal[]
  onEvaluate: (proposal: ScholarshipProposal) => void
  onApprove: (proposalId: string) => void
  onReject: (proposalId: string) => void
  onView: (proposal: ScholarshipProposal) => void
}

export default function ScholarshipProposalsTable({
  proposals,
  onEvaluate,
  onApprove,
  onReject,
  onView
}: ScholarshipProposalsTableProps) {
  return (
    <div className="border rounded-lg bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>CGPA</TableHead>
            <TableHead>Suggested Tier</TableHead>
            <TableHead>Waiver %</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {proposals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                No scholarship proposals found
              </TableCell>
            </TableRow>
          ) : (
            proposals.map((proposal) => (
              <TableRow key={proposal.id}>
                <TableCell className="font-medium">{proposal.studentId}</TableCell>
                <TableCell>{proposal.studentName}</TableCell>
                <TableCell>{proposal.program}</TableCell>
                <TableCell>{proposal.cgpa.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={getTierColor(proposal.tierSuggested)}>
                    {proposal.tierSuggested}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-purple-600">
                    {proposal.waiverPercent}%
                  </span>
                </TableCell>
                <TableCell>
                  <Badge className={getProposalStatusColor(proposal.status)}>
                    {proposal.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onView(proposal)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {proposal.status === 'Proposed' && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEvaluate(proposal)}
                      >
                        Evaluate
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onApprove(proposal.id)}
                      >
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onReject(proposal.id)}
                      >
                        <XCircle className="w-4 h-4 text-gray-600" />
                      </Button>
                    </>
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
