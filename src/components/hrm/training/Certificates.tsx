import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileDown } from 'lucide-react'
import { CERTIFICATES, type Certificate } from '@/lib/hrmDemoSeed'

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>(CERTIFICATES)

  const handleGenerateAll = () => {
    setCertificates(certificates.map(c => ({...c, status: 'Generated' as const})))
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Certificates</h2>
        <Button onClick={handleGenerateAll} className="bg-blue-600 hover:bg-blue-700">
          Generate All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {certificates.map(cert => (
          <Card key={cert.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{cert.empName}</CardTitle>
                <Badge variant={cert.status === 'Generated' ? 'default' : 'secondary'}>
                  {cert.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">Certificate No: <span className="font-medium">{cert.certificateNo}</span></p>
                <p className="text-gray-600">Issued: <span className="font-medium">{cert.issuedOn}</span></p>
                <Button className="w-full mt-4 flex items-center gap-2" size="sm">
                  <FileDown className="w-4 h-4" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
