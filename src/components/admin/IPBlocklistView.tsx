import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Download, Printer, Plus, Power, PowerOff } from 'lucide-react'
import { ipBlocklistStatic } from '@/lib/adminSecuritySeeds'
import { DEMO_MODE, showDemoToast } from '@/config/demo'

export default function IPBlocklistView() {
  const [activeTab, setActiveTab] = useState<'blocklist' | 'whitelist'>('blocklist')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    ip: '',
    type: 'Single IP',
    reason: '',
    expiresAt: ''
  })

  const allIps = ipBlocklistStatic
  const blocklistIps = allIps.filter(ip => ip.category === 'Blocklist')
  const whitelistIps = allIps.filter(ip => ip.category === 'Whitelist')

  const currentList = activeTab === 'blocklist' ? blocklistIps : whitelistIps

  const filteredIps = currentList.filter(ip => {
    const matchesSearch = ip.ip.includes(searchQuery) || ip.reason.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'All' || ip.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleToggleStatus = (id: string) => {
    if (DEMO_MODE) {
      alert(showDemoToast(`Toggle IP status`))
    }
  }

  const handleAddIP = () => {
    if (!formData.ip || !formData.reason) {
      alert('Please fill in all required fields')
      return
    }

    if (DEMO_MODE) {
      alert(showDemoToast(`Add IP to ${activeTab}`))
      setAddDialogOpen(false)
      setFormData({ ip: '', type: 'Single IP', reason: '', expiresAt: '' })
    }
  }

  const handleExport = () => {
    alert('Exporting to CSV... (Demo)')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">IP Access Control</h1>
          <p className="text-sm text-gray-600 mt-1">Manage IP blocklist and whitelist for enhanced security</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button className="nu-button-primary" onClick={() => setAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add IP
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b">
        <button
          onClick={() => setActiveTab('blocklist')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'blocklist'
              ? 'border-deep-plum text-deep-plum'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Blocklist ({blocklistIps.length})
        </button>
        <button
          onClick={() => setActiveTab('whitelist')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'whitelist'
              ? 'border-deep-plum text-deep-plum'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Whitelist ({whitelistIps.length})
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select 
            className="w-full p-2 border rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Active</option>
            <option>Disabled</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <Input 
            placeholder="Search IP or reason..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{activeTab === 'blocklist' ? 'Blocked IPs' : 'Whitelisted IPs'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">IP/CIDR</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Type</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Reason</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Added By</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Added At</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Expires At</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIps.map((ip) => (
                  <tr key={ip.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-mono font-semibold">{ip.ip}</td>
                    <td className="p-3 text-sm">
                      <Badge className="bg-blue-100 text-blue-800">
                        {ip.type}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm">{ip.reason}</td>
                    <td className="p-3 text-sm">{ip.addedBy}</td>
                    <td className="p-3 text-sm">{ip.addedAt}</td>
                    <td className="p-3 text-sm">
                      {ip.expiresAt || <span className="text-gray-400">Never</span>}
                    </td>
                    <td className="p-3">
                      <Badge className={ip.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {ip.status === 'Active' ? '🟢' : '⚪'} {ip.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleToggleStatus(ip.id)}
                        title={ip.status === 'Active' ? 'Disable' : 'Enable'}
                      >
                        {ip.status === 'Active' ? 
                          <PowerOff className="w-4 h-4 text-red-600" /> :
                          <Power className="w-4 h-4 text-green-600" />
                        }
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredIps.length} record(s)
          </div>
        </CardContent>
      </Card>

      {/* Add IP Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add IP to {activeTab === 'blocklist' ? 'Blocklist' : 'Whitelist'}</DialogTitle>
            <DialogDescription>
              {activeTab === 'blocklist' 
                ? 'Block an IP address or CIDR range from accessing the system'
                : 'Whitelist an IP address or CIDR range to always allow access'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IP Address / CIDR Range *</label>
              <Input 
                placeholder="e.g., 192.168.1.100 or 192.168.0.0/16"
                value={formData.ip}
                onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option>Single IP</option>
                <option>CIDR Range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
              <textarea 
                className="w-full p-2 border rounded-md" 
                rows={3}
                placeholder={activeTab === 'blocklist' 
                  ? 'e.g., Repeated failed login attempts' 
                  : 'e.g., University campus network'}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expires At (Optional)
              </label>
              <input 
                type="date" 
                className="w-full p-2 border rounded-md"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              />
              <p className="text-xs text-gray-600 mt-1">Leave empty for permanent {activeTab === 'blocklist' ? 'block' : 'whitelist'}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button className="nu-button-primary" onClick={handleAddIP}>
              Add to {activeTab === 'blocklist' ? 'Blocklist' : 'Whitelist'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
