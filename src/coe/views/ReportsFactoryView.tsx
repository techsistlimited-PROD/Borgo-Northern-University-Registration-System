import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Download, ChevronDown, Printer, FileSpreadsheet } from 'lucide-react'
import { REPORTS_CATALOG, ReportDefinition } from '../data/reportsData'
import { applyFilters, exportToCSV, printReport, ReportFilters } from '../utils/reportsFactory'
import ReportCatalogTree from '../components/ReportCatalogTree'
import ReportFiltersPanel from '../components/ReportFiltersPanel'
import ReportPreview from '../components/ReportPreview'
import ReportSummaryCards from '../components/ReportSummaryCards'

export default function ReportsFactoryView() {
  const [selectedReport, setSelectedReport] = useState<ReportDefinition | null>(REPORTS_CATALOG[0])
  const [filters, setFilters] = useState<ReportFilters>({
    semester: 'all',
    program: 'all',
    campus: 'all',
    status: 'all'
  })

  const reportData = useMemo(() => {
    if (!selectedReport) return []
    const rawData = selectedReport.getData()
    return applyFilters(rawData, filters, selectedReport.columns, selectedReport.code)
  }, [selectedReport, filters])

  const handleResetFilters = () => {
    setFilters({
      semester: 'all',
      program: 'all',
      campus: 'all',
      status: 'all'
    })
  }

  const handleExportCSV = () => {
    if (selectedReport) {
      exportToCSV(selectedReport, reportData)
    }
  }

  const handlePrint = () => {
    if (selectedReport) {
      printReport(selectedReport, reportData)
    }
  }

  const handleSelectReport = (report: ReportDefinition) => {
    setSelectedReport(report)
    handleResetFilters()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Reports Factory</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive institutional reporting system with 23 report types
          </p>
        </div>
        {selectedReport && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="nu-button-primary">
                <Download className="w-4 h-4 mr-2" />
                Export
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportCSV}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1">
          <ReportCatalogTree
            selectedReport={selectedReport}
            onSelectReport={handleSelectReport}
          />
        </div>

        <div className="col-span-3 space-y-6">
          {selectedReport ? (
            <>
              <Card>
                <CardHeader className="border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{selectedReport.title}</CardTitle>
                        <Badge className="bg-purple-100 text-purple-700 font-mono text-xs">
                          {selectedReport.code}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {selectedReport.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span><strong>Category:</strong> {selectedReport.category}</span>
                        <span><strong>Generated:</strong> {new Date().toLocaleString()}</span>
                        <Badge variant="outline" className="text-xs">
                          {reportData.length} records
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {selectedReport.filters.length > 0 && (
                <ReportFiltersPanel
                  report={selectedReport}
                  filters={filters}
                  onFiltersChange={setFilters}
                  onReset={handleResetFilters}
                />
              )}

              <ReportSummaryCards report={selectedReport} data={reportData} />

              <Card>
                <CardHeader className="border-b">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Report Preview</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{reportData.length} total records</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <ReportPreview
                    report={selectedReport}
                    data={reportData}
                  />
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-20 pb-20 text-center">
                <div className="text-gray-500">
                  <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Select a Report</p>
                  <p className="text-sm mt-1">Choose a report from the catalog to get started</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
