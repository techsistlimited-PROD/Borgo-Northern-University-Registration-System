import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'
import { ReportDefinition } from '../data/reportsCatalog'
import { ReportFilters } from '../utils/reports'

interface ReportFiltersPanelProps {
  report: ReportDefinition
  filters: ReportFilters
  onFiltersChange: (filters: ReportFilters) => void
  onReset: () => void
}

export default function ReportFiltersPanel({
  report,
  filters,
  onFiltersChange,
  onReset
}: ReportFiltersPanelProps) {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-sm text-gray-700">Filters</h3>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw className="w-3 h-3 mr-2" />
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {report.filters.map(filter => {
            switch (filter.type) {
              case 'semester':
                return (
                  <div key={filter.type}>
                    <Label className="text-xs">
                      {filter.label} {filter.required && <span className="text-red-500">*</span>}
                    </Label>
                    <Select
                      value={filters.semester || 'all'}
                      onValueChange={(v) => updateFilter('semester', v)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Semesters</SelectItem>
                        <SelectItem value="Fall 2025">Fall 2025</SelectItem>
                        <SelectItem value="Summer 2025">Summer 2025</SelectItem>
                        <SelectItem value="Spring 2025">Spring 2025</SelectItem>
                        <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )

              case 'program':
                return (
                  <div key={filter.type}>
                    <Label className="text-xs">{filter.label}</Label>
                    <Select
                      value={filters.program || 'all'}
                      onValueChange={(v) => updateFilter('program', v)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
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
                  </div>
                )

              case 'campus':
                return (
                  <div key={filter.type}>
                    <Label className="text-xs">{filter.label}</Label>
                    <Select
                      value={filters.campus || 'all'}
                      onValueChange={(v) => updateFilter('campus', v)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Campuses</SelectItem>
                        <SelectItem value="Permanent">Permanent Campus</SelectItem>
                        <SelectItem value="Banani">Banani Campus</SelectItem>
                        <SelectItem value="Mirpur">Mirpur Campus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )

              case 'status':
                return (
                  <div key={filter.type}>
                    <Label className="text-xs">{filter.label}</Label>
                    <Select
                      value={filters.status || 'all'}
                      onValueChange={(v) => updateFilter('status', v)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        {filter.options?.map(opt => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )

              case 'cgpaRange':
                return (
                  <div key={filter.type} className="col-span-2">
                    <Label className="text-xs">
                      {filter.label} {filter.required && <span className="text-red-500">*</span>}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Min"
                        value={filters.cgpaMin || ''}
                        onChange={(e) => updateFilter('cgpaMin', parseFloat(e.target.value))}
                        className="h-9"
                      />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Max"
                        value={filters.cgpaMax || ''}
                        onChange={(e) => updateFilter('cgpaMax', parseFloat(e.target.value))}
                        className="h-9"
                      />
                    </div>
                  </div>
                )

              case 'dateRange':
                return (
                  <div key={filter.type} className="col-span-2">
                    <Label className="text-xs">{filter.label}</Label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={filters.dateFrom || ''}
                        onChange={(e) => updateFilter('dateFrom', e.target.value)}
                        className="h-9"
                      />
                      <Input
                        type="date"
                        value={filters.dateTo || ''}
                        onChange={(e) => updateFilter('dateTo', e.target.value)}
                        className="h-9"
                      />
                    </div>
                  </div>
                )

              case 'section':
                return (
                  <div key={filter.type}>
                    <Label className="text-xs">{filter.label}</Label>
                    <Input
                      placeholder="Section..."
                      value={filters.section || ''}
                      onChange={(e) => updateFilter('section', e.target.value)}
                      className="h-9"
                    />
                  </div>
                )

              case 'period':
                return (
                  <div key={filter.type}>
                    <Label className="text-xs">
                      {filter.label} {filter.required && <span className="text-red-500">*</span>}
                    </Label>
                    <Select
                      value={filters.period || 'daily'}
                      onValueChange={(v) => updateFilter('period', v)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )

              default:
                return null
            }
          })}
        </div>
      </CardContent>
    </Card>
  )
}
