import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight, FileText } from 'lucide-react'
import { REPORT_CATEGORIES, getReportsByCategory, ReportDefinition } from '../data/reportsData'

interface ReportCatalogTreeProps {
  selectedReport: ReportDefinition | null
  onSelectReport: (report: ReportDefinition) => void
}

export default function ReportCatalogTree({ selectedReport, onSelectReport }: ReportCatalogTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Enrollment & Admission'])

  const toggleCategory = (category: string) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter(c => c !== category))
    } else {
      setExpandedCategories([...expandedCategories, category])
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <CardTitle className="text-lg">Report Catalog</CardTitle>
        <p className="text-sm text-gray-600">23 Reports</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1 p-2">
          {REPORT_CATEGORIES.map(category => {
            const categoryReports = getReportsByCategory(category)
            const isExpanded = expandedCategories.includes(category)

            return (
              <div key={category}>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-medium text-sm"
                  onClick={() => toggleCategory(category)}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 mr-2" />
                  ) : (
                    <ChevronRight className="w-4 h-4 mr-2" />
                  )}
                  {category}
                  <span className="ml-auto text-xs text-gray-500">({categoryReports.length})</span>
                </Button>

                {isExpanded && (
                  <div className="ml-6 space-y-1">
                    {categoryReports.map(report => (
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
                        <span className="truncate">{report.title}</span>
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
