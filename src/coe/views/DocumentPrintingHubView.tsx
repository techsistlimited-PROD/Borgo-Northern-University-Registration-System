import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Download, Printer, X } from 'lucide-react'
import { DOCUMENT_RECORDS, DocumentRecord } from '@/coe/data/documents'
import { PROGRAMS } from '@/coe/data/programs'
import { getCertificateTypes, CertificateType, CertificateRequest } from '@/coe/data/certificates'
import DocPrintTable from '@/coe/components/DocPrintTable'
import CertPreviewDrawer from '@/coe/components/CertPreviewDrawer'
import { toCsv, downloadCsv } from '@/coe/utils/certificates'

export default function DocumentPrintingHubView() {
  const [documents] = useState<DocumentRecord[]>(DOCUMENT_RECORDS)
  const [selectedProgram, setSelectedProgram] = useState('All')
  const [selectedCampus, setSelectedCampus] = useState('All')
  const [selectedTypes, setSelectedTypes] = useState<CertificateType[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [previewDoc, setPreviewDoc] = useState<DocumentRecord | null>(null)

  const certificateTypes = getCertificateTypes()
  const programs = ['All', ...PROGRAMS.map(p => p.code)]
  const campuses = ['All', 'Permanent', 'Banani', 'Mirpur']

  const filteredDocuments = useMemo(() => {
    return documents.filter(d => {
      if (selectedProgram !== 'All' && d.programCode !== selectedProgram) return false
      if (selectedCampus !== 'All' && d.campus !== selectedCampus) return false
      if (selectedTypes.length > 0 && !selectedTypes.includes(d.documentType)) return false
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        return (
          d.studentId.toLowerCase().includes(term) ||
          d.studentName.toLowerCase().includes(term)
        )
      }
      return true
    })
  }, [documents, selectedProgram, selectedCampus, selectedTypes, searchTerm])

  const toggleTypeFilter = (type: CertificateType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type))
    } else {
      setSelectedTypes([...selectedTypes, type])
    }
  }

  const clearFilters = () => {
    setSelectedProgram('All')
    setSelectedCampus('All')
    setSelectedTypes([])
    setSearchTerm('')
  }

  const handleBulkPrint = () => {
    const selectedDocs = documents.filter(d => selectedIds.includes(d.id))
    if (selectedDocs.length === 0) return
    
    alert(`Preparing to print ${selectedDocs.length} document(s)...`)
    setTimeout(() => {
      window.print()
    }, 100)
  }

  const handleExportCsv = () => {
    const selectedDocs = documents.filter(d => selectedIds.includes(d.id))
    const exportDocs = selectedDocs.length > 0 ? selectedDocs : filteredDocuments
    
    const certRequests: CertificateRequest[] = exportDocs.map(d => ({
      id: d.id,
      requestId: d.serial,
      studentId: d.studentId,
      studentName: d.studentName,
      programCode: d.programCode,
      batch: d.batch,
      campus: d.campus,
      creditsCompleted: d.creditsCompleted,
      cgpa: d.cgpa,
      documentType: d.documentType,
      purpose: d.purpose,
      quantity: 1,
      requestDate: d.issuedDate,
      status: 'Ready',
      processedBy: 'COE Office',
      processedDate: d.issuedDate,
      readyDate: d.issuedDate,
      collectedBy: null,
      collectionDate: null,
      rejectedReason: null,
      notes: d.remarks,
      urgentRequest: false,
      serial: d.serial,
      qrToken: d.qrToken
    }))
    
    const csv = toCsv(certRequests)
    downloadCsv(csv, `documents-print-queue-${Date.now()}.csv`)
  }

  const handlePrint = (doc: DocumentRecord) => {
    setPreviewDoc(doc)
    setTimeout(() => {
      window.print()
    }, 100)
  }

  const convertToPreviewRequest = (doc: DocumentRecord | null): CertificateRequest | null => {
    if (!doc) return null
    return {
      id: doc.id,
      requestId: doc.serial,
      studentId: doc.studentId,
      studentName: doc.studentName,
      programCode: doc.programCode,
      batch: doc.batch,
      campus: doc.campus,
      creditsCompleted: doc.creditsCompleted,
      cgpa: doc.cgpa,
      documentType: doc.documentType,
      purpose: doc.purpose,
      quantity: 1,
      requestDate: doc.issuedDate,
      status: 'Ready',
      processedBy: 'COE Office',
      processedDate: doc.issuedDate,
      readyDate: doc.issuedDate,
      collectedBy: null,
      collectionDate: null,
      rejectedReason: null,
      notes: doc.remarks,
      urgentRequest: false,
      serial: doc.serial,
      qrToken: doc.qrToken
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Document Printing Hub</h1>
          <p className="text-sm text-gray-600">Centralized printing for all certificate types</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCsv}
            disabled={filteredDocuments.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            size="sm"
            onClick={handleBulkPrint}
            disabled={selectedIds.length === 0}
            className="bg-deep-plum hover:bg-accent-purple"
          >
            <Printer className="w-4 h-4 mr-2" />
            Bulk Print ({selectedIds.length})
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium mb-1 block">Program</label>
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {programs.map(prog => (
                    <SelectItem key={prog} value={prog}>{prog}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block">Campus</label>
              <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {campuses.map(campus => (
                    <SelectItem key={campus} value={campus}>{campus}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <label className="text-xs font-medium mb-1 block">Search Student</label>
              <Input
                placeholder="Student ID or Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium mb-2 block">Document Type</label>
            <div className="flex flex-wrap gap-2">
              {certificateTypes.map(type => (
                <Badge
                  key={type}
                  variant={selectedTypes.includes(type) ? 'default' : 'outline'}
                  className={`cursor-pointer ${selectedTypes.includes(type) ? 'bg-deep-plum' : ''}`}
                  onClick={() => toggleTypeFilter(type)}
                >
                  {type}
                  {selectedTypes.includes(type) && <X className="w-3 h-3 ml-1" />}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="text-sm text-gray-600">
              Showing {filteredDocuments.length} of {documents.length} documents
            </div>
            <Button size="sm" variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <DocPrintTable
        documents={filteredDocuments}
        selectedIds={selectedIds}
        onSelect={(id) => {
          if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id))
          } else {
            setSelectedIds([...selectedIds, id])
          }
        }}
        onSelectAll={(checked) => {
          if (checked) {
            setSelectedIds(filteredDocuments.map(d => d.id))
          } else {
            setSelectedIds([])
          }
        }}
        onPreview={(doc) => setPreviewDoc(doc)}
        onPrint={handlePrint}
      />

      {previewDoc && (
        <CertPreviewDrawer
          request={convertToPreviewRequest(previewDoc)}
          onClose={() => setPreviewDoc(null)}
        />
      )}
    </div>
  )
}
