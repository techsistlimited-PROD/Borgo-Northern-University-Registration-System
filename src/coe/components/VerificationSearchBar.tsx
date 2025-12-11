import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface VerificationSearchBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  programFilter: string
  onProgramChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
}

export default function VerificationSearchBar({
  searchQuery,
  onSearchChange,
  programFilter,
  onProgramChange,
  statusFilter,
  onStatusChange
}: VerificationSearchBarProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by Student ID or Token..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={programFilter} onValueChange={onProgramChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All Programs" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Programs</SelectItem>
          <SelectItem value="CSE">CSE</SelectItem>
          <SelectItem value="BBA">BBA</SelectItem>
          <SelectItem value="EEE">EEE</SelectItem>
          <SelectItem value="LLB">LLB</SelectItem>
          <SelectItem value="MBA">MBA</SelectItem>
          <SelectItem value="English">English</SelectItem>
          <SelectItem value="Physics">Physics</SelectItem>
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="Verified">Verified</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
