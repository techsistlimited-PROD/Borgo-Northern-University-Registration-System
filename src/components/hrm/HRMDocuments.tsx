import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Download, FileText, Eye } from 'lucide-react'
import { HRM_DOCUMENTS, HRM_EMPLOYEES } from '@/lib/hrmStatic'
import { DEMO_MODE, showDemoToast } from '@/config/demo'

export default function HRMDocuments() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDept, setFilterDept] = useState('')
  const [filterDocType, setFilterDocType] = useState('')

  const filteredDocs = HRM_DOCUMENTS.filter(doc => {
    const employee = HRM_EMPLOYEES.find(e => e.id === doc.employeeId)
    if (!employee) return false

    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = !filterDept || employee.department === filterDept
    const matchesDocType = !filterDocType || doc.type === filterDocType

    return matchesSearch && matchesDept && matchesDocType
  })

  const departments = [...new Set(HRM_EMPLOYEES.map(e => e.department))]
  const docTypes = ['CV', 'Certificate', 'NID', 'Contract', 'Appointment Letter', 'Other']

  const handleViewDoc = (doc: any) => {
    window.open(`https://example.com/documents/${doc.fileName}`, '_blank')
  }

  const handleDownloadDoc = (doc: any) => {
    if (DEMO_MODE) {
      alert(showDemoToast(`Download ${doc.fileName}`))
      return
    }

    alert(`Downloading: ${doc.fileName}`)
  }

  const handleExportList = () => {
    if (DEMO_MODE) {
      alert(showDemoToast('Export document list as CSV'))
      return
    }

    const csvHeaders = ['File Name', 'Employee', 'Department', 'Type', 'Uploaded', 'Size']
    const csvRows = filteredDocs.map(doc => {
      const employee = HRM_EMPLOYEES.find(e => e.id === doc.employeeId)
      return [
        doc.fileName,
        employee?.name || 'Unknown',
        employee?.department || 'Unknown',
        doc.type,
        doc.uploadDate,
        doc.size
      ]
    })

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `documents-list-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Document Archive
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by employee or file..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={filterDocType}
              onChange={(e) => setFilterDocType(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Document Types</option>
              {docTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <Button variant="outline" className="flex items-center space-x-2" onClick={handleExportList}>
              <Download className="w-4 h-4" />
              <span>Export List</span>
            </Button>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map(doc => {
              const employee = HRM_EMPLOYEES.find(e => e.id === doc.employeeId)
              if (!employee) return null

              return (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <FileText className="w-10 h-10 text-blue-600" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{doc.fileName}</p>
                        <p className="text-sm text-gray-600">{employee.name}</p>
                        <p className="text-xs text-gray-500">{employee.department}</p>
                        <Badge variant="outline" className="mt-2">{doc.type}</Badge>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                      <span>Uploaded: {doc.uploadDate}</span>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => handleViewDoc(doc)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDownloadDoc(doc)}>
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredDocs.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No documents found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
