import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Download, ChevronDown, Printer, FileSpreadsheet } from 'lucide-react'
import { REPORTS_CATALOG, ReportDefinition } from '../data/reportsCatalog'
import { buildReportRows, downloadCSV, printReport, calculateSummaryStats, ReportFilters } from '../utils/reports'
import ReportPicker from '../components/ReportPicker'
import ReportFiltersPanel from '../components/ReportFiltersPanel'
import ReportPreviewTable from '../components/ReportPreviewTable'
import ReportSummaryCards from '../components/ReportSummaryCards'

export default function ReportsFactoryView() {
  const [selectedReport, setSelectedReport] = useState<ReportDefinition | null>(REPORTS_CATALOG[0])
  const [filters, setFilters] = useState<ReportFilters>({
    semester: 'all',
    program: 'all',
    campus: 'all',
    status: 'all'
  })

  const filteredRows = useMemo(() => {
    if (!selectedReport) return []
    return buildReportRows(selectedReport, filters)
  }, [selectedReport, filters])

  const summaryCards = useMemo(() => {
    if (!selectedReport || filteredRows.length === 0) return []
    return calculateSummaryStats(filteredRows, selectedReport.columns)
  }, [selectedReport, filteredRows])

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
      downloadCSV(selectedReport, filteredRows)
    }
  }

  const handlePrint = () => {
    if (selectedReport) {
      printReport(selectedReport, filteredRows)
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
            Generate and export institutional reports
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
          <ReportPicker
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
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-xl">{selectedReport.title}</CardTitle>
                        <span className="text-xs font-mono px-2 py-1 bg-purple-100 text-purple-700 rounded">
                          {selectedReport.code}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedReport.description}
                      </p>
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

              {summaryCards.length > 0 && (
                <ReportSummaryCards cards={summaryCards} />
              )}

              <Card>
                <CardHeader className="border-b">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Preview</CardTitle>
                    <div className="text-sm text-gray-500">
                      {filteredRows.length} record{filteredRows.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <ReportPreviewTable
                    report={selectedReport}
                    rows={filteredRows}
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
