import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react'
import { parseExcelData, computeTotals, applyPolicy } from '@/coe/utils/marks'
import { GradeScale } from '@/coe/data/types'

interface ProcessedMark {
  studentId: string
  studentName: string
  components: { [key: string]: number }
  total: number
  letterGrade: string
  gradePoint: number
  status: 'Draft'
}

interface UploadExcelDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  schemeType: 'four-part' | 'single-100'
  componentWeights: { name: string; weight: number }[]
  gradeScale: GradeScale[]
  tieBreakRule: 'round-half-up' | 'truncate'
  onSave: (marks: ProcessedMark[]) => void
}

export default function UploadExcelDrawer({
  open,
  onOpenChange,
  schemeType,
  componentWeights,
  gradeScale,
  tieBreakRule,
  onSave
}: UploadExcelDrawerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<ProcessedMark[]>([])
  const [parseError, setParseError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validExtensions = ['.xlsx', '.csv']
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()

    if (!validExtensions.includes(fileExtension)) {
      setParseError('Invalid file format. Please upload .xlsx or .csv file.')
      return
    }

    setSelectedFile(file)
    setParseError(null)
  }

  const handleProcess = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setParseError(null)

    try {
      const fileContent = await selectedFile.text()

      const parsedData = parseExcelData(fileContent, schemeType)

      if (parsedData.length === 0) {
        setParseError('No valid data found in file. Ensure it has the correct format.')
        setIsProcessing(false)
        return
      }

      const processedMarks: ProcessedMark[] = parsedData.map((row, idx) => {
        let total = 0

        if (schemeType === 'single-100') {
          total = row.components.total100 || 0
        } else {
          const componentsArray = componentWeights.map(cw => ({
            name: cw.name.toLowerCase(),
            marks: row.components[cw.name.toLowerCase()] || 0,
            weight: cw.weight
          }))
          total = computeTotals(componentsArray, schemeType)
        }

        const gradeResult = applyPolicy(total, gradeScale, tieBreakRule)

        return {
          studentId: row.studentId,
          studentName: `Student ${row.studentId}`,
          components: row.components,
          total: gradeResult.total,
          letterGrade: gradeResult.letterGrade,
          gradePoint: gradeResult.gradePoint,
          status: 'Draft'
        }
      })

      setPreviewData(processedMarks)
    } catch (error) {
      setParseError('Error parsing file. Please check the format and try again.')
      console.error('Parse error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSaveMarks = () => {
    onSave(previewData)
    handleClose()
  }

  const handleClose = () => {
    setSelectedFile(null)
    setPreviewData([])
    setParseError(null)
    onOpenChange(false)
  }

  const expectedFormat =
    schemeType === 'four-part'
      ? 'StudentID, Attendance, CA, Midterm, Final'
      : 'StudentID, Total100'

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Class Marks (Excel/CSV)</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 text-sm">Expected Format</h4>
                <p className="text-xs text-blue-800 mt-1">
                  Your file should have the following columns: <code className="bg-blue-100 px-1 py-0.5 rounded">{expectedFormat}</code>
                </p>
                <p className="text-xs text-blue-800 mt-1">
                  This is a client-side feature. Files are processed locally in your browser.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select File</label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept=".xlsx,.csv"
                onChange={handleFileSelect}
                className="flex-1"
              />
              <Button
                onClick={handleProcess}
                disabled={!selectedFile || isProcessing}
                className="bg-gradient-to-r from-deep-plum to-accent-purple text-white hover:opacity-90"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Process'}
              </Button>
            </div>
          </div>

          {parseError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-800 text-sm">Error</h4>
                  <p className="text-xs text-red-700 mt-1">{parseError}</p>
                </div>
              </div>
            </div>
          )}

          {previewData.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-deep-plum">
                  Preview ({previewData.length} students)
                </h4>
                <Badge className="bg-purple-600 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Ready to Save
                </Badge>
              </div>

              <div className="border rounded-md overflow-hidden">
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full border-collapse text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="text-left p-2 border-b font-semibold">Student ID</th>
                        <th className="text-left p-2 border-b font-semibold">Name</th>
                        {schemeType === 'four-part' ? (
                          <>
                            <th className="text-right p-2 border-b font-semibold">Attendance</th>
                            <th className="text-right p-2 border-b font-semibold">CA</th>
                            <th className="text-right p-2 border-b font-semibold">Midterm</th>
                            <th className="text-right p-2 border-b font-semibold">Final</th>
                          </>
                        ) : (
                          <th className="text-right p-2 border-b font-semibold">Total (100)</th>
                        )}
                        <th className="text-right p-2 border-b font-semibold">Total</th>
                        <th className="text-center p-2 border-b font-semibold">Grade</th>
                        <th className="text-center p-2 border-b font-semibold">GP</th>
                        <th className="text-center p-2 border-b font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((mark, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="p-2">{mark.studentId}</td>
                          <td className="p-2">{mark.studentName}</td>
                          {schemeType === 'four-part' ? (
                            <>
                              <td className="p-2 text-right">{mark.components.attendance || 0}</td>
                              <td className="p-2 text-right">{mark.components.ca || 0}</td>
                              <td className="p-2 text-right">{mark.components.midterm || 0}</td>
                              <td className="p-2 text-right">{mark.components.final || 0}</td>
                            </>
                          ) : (
                            <td className="p-2 text-right">{mark.components.total100 || 0}</td>
                          )}
                          <td className="p-2 text-right font-semibold">{mark.total.toFixed(2)}</td>
                          <td className="p-2 text-center">
                            <Badge variant="outline">{mark.letterGrade}</Badge>
                          </td>
                          <td className="p-2 text-center">{mark.gradePoint.toFixed(2)}</td>
                          <td className="p-2 text-center">
                            <Badge variant="outline" className="bg-amber-50 text-amber-700">
                              {mark.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="text-xs text-gray-600 mt-2">
                Grades computed using current grading policy. Changes are saved to page state only
                and will reset on page reload.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {previewData.length > 0 && (
            <Button
              onClick={handleSaveMarks}
              className="bg-gradient-to-r from-deep-plum to-accent-purple text-white hover:opacity-90"
            >
              Save to Page State
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`border rounded-md px-3 py-2 text-sm ${props.className || ''}`}
    />
  )
}
