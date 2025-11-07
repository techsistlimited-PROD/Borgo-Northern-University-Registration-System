import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight, FileText } from 'lucide-react'
import { REPORTS_CATALOG, REPORT_GROUPS, ReportDefinition } from '../data/reportsCatalog'

interface ReportPickerProps {
  selectedReport: ReportDefinition | null
  onSelectReport: (report: ReportDefinition) => void
}

export default function ReportPicker({ selectedReport, onSelectReport }: ReportPickerProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Enrollment'])

  const toggleGroup = (group: string) => {
    if (expandedGroups.includes(group)) {
      setExpandedGroups(expandedGroups.filter(g => g !== group))
    } else {
      setExpandedGroups([...expandedGroups, group])
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <CardTitle className="text-lg">Report Catalog</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1 p-2">
          {REPORT_GROUPS.map(group => {
            const groupReports = REPORTS_CATALOG.filter(r => r.group === group)
            const isExpanded = expandedGroups.includes(group)

            return (
              <div key={group}>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-medium text-sm"
                  onClick={() => toggleGroup(group)}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 mr-2" />
                  ) : (
                    <ChevronRight className="w-4 h-4 mr-2" />
                  )}
                  {group} ({groupReports.length})
                </Button>

                {isExpanded && (
                  <div className="ml-6 space-y-1">
                    {groupReports.map(report => (
                      <Button
                        key={report.id}
                        variant="ghost"
                        className={`w-full justify-start text-sm ${
                          selectedReport?.id === report.id
                            ? 'bg-purple-50 text-purple-700 font-medium'
                            : 'text-gray-700'
                        }`}
                        onClick={() => onSelectReport(report)}
                      >
                        <FileText className="w-3 h-3 mr-2" />
                        {report.title}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
