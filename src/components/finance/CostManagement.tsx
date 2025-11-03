import { useState, useEffect } from 'react'
import { Repo } from '@/lib/repo'
import { CostHead, CostPackage } from '@/lib/seedAll'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download } from 'lucide-react'
import { exportToCSV } from '@/lib/exportUtils'

export default function CostManagement() {
  const [costHeads, setCostHeads] = useState<CostHead[]>([])
  const [costPackages, setCostPackages] = useState<CostPackage[]>([])

  useEffect(() => {
    loadData()
    const unsubHeads = Repo.subscribe<CostHead>('costHeads', setCostHeads)
    const unsubPackages = Repo.subscribe<CostPackage>('costPackages', setCostPackages)

    return () => {
      unsubHeads()
      unsubPackages()
    }
  }, [])

  const loadData = () => {
    setCostHeads(Repo.get<CostHead>('costHeads'))
    setCostPackages(Repo.get<CostPackage>('costPackages'))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Cost Management</h1>
          <p className="text-sm text-gray-600">Manage cost heads and packages</p>
        </div>
        <Button onClick={() => exportToCSV(costHeads, 'cost-heads')} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <Tabs defaultValue="heads">
        <TabsList>
          <TabsTrigger value="heads">Cost Heads</TabsTrigger>
          <TabsTrigger value="packages">Cost Packages</TabsTrigger>
        </TabsList>

        <TabsContent value="heads">
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Code</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">GL Account</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Taxable</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {costHeads.map(head => (
                    <tr key={head.id}>
                      <td className="px-4 py-3 text-sm font-medium">{head.code}</td>
                      <td className="px-4 py-3 text-sm">{head.name}</td>
                      <td className="px-4 py-3 text-sm"><Badge variant="outline">{head.type}</Badge></td>
                      <td className="px-4 py-3 text-sm text-xs text-gray-600">{head.glAccount}</td>
                      <td className="px-4 py-3 text-sm">{head.taxable ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-3 text-sm"><Badge variant={head.status === 'Active' ? 'default' : 'secondary'}>{head.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packages">
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Program</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Package Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Components</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Effective Term</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {costPackages.map(pkg => (
                    <tr key={pkg.id}>
                      <td className="px-4 py-3 text-sm font-medium">{pkg.programId}</td>
                      <td className="px-4 py-3 text-sm">{pkg.name}</td>
                      <td className="px-4 py-3 text-sm"><Badge>{pkg.components.length} items</Badge></td>
                      <td className="px-4 py-3 text-sm">{pkg.effectiveTerm}</td>
                      <td className="px-4 py-3 text-sm"><Badge variant={pkg.status === 'Active' ? 'default' : 'secondary'}>{pkg.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
