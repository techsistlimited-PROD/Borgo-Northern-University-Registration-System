import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Edit, Trash2, Building2, DoorOpen } from 'lucide-react'
import { ROOMS, CAMPUSES } from '@/lib/seedData'

interface Room {
  code: string
  building: string
  floor: number
  capacity: number
  type: string
  campus: string
  facilities?: string[]
  status?: 'Available' | 'Under Maintenance' | 'Reserved'
}

export default function BuildingManagement() {
  const [rooms, setRooms] = useState<Room[]>(
    ROOMS.map(r => ({ ...r, facilities: ['Projector', 'Whiteboard'], status: 'Available' as const }))
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCampus, setFilterCampus] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [formData, setFormData] = useState<Room>({
    code: '',
    building: '',
    floor: 1,
    capacity: 30,
    type: 'Classroom',
    campus: '',
    facilities: [],
    status: 'Available'
  })

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.building.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCampus = filterCampus === 'All' || room.campus === filterCampus
    const matchesType = filterType === 'All' || room.type === filterType
    return matchesSearch && matchesCampus && matchesType
  })

  const groupedRooms = filteredRooms.reduce((acc, room) => {
    const key = `${room.campus}-${room.building}`
    if (!acc[key]) {
      acc[key] = {
        campus: room.campus,
        building: room.building,
        rooms: []
      }
    }
    acc[key].rooms.push(room)
    return acc
  }, {} as Record<string, { campus: string; building: string; rooms: Room[] }>)

  const handleAdd = () => {
    setRooms([...rooms, { ...formData }])
    setShowAddDialog(false)
    resetForm()
  }

  const handleEdit = () => {
    setRooms(rooms.map(r => r.code === selectedRoom?.code ? { ...formData } : r))
    setShowEditDialog(false)
    resetForm()
  }

  const handleDelete = (code: string) => {
    if (confirm('Are you sure you want to delete this room?')) {
      setRooms(rooms.filter(r => r.code !== code))
    }
  }

  const openEditDialog = (room: Room) => {
    setSelectedRoom(room)
    setFormData(room)
    setShowEditDialog(true)
  }

  const resetForm = () => {
    setFormData({
      code: '',
      building: '',
      floor: 1,
      capacity: 30,
      type: 'Classroom',
      campus: '',
      facilities: [],
      status: 'Available'
    })
    setSelectedRoom(null)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Building / Floor / Room Management</h1>
          <p className="text-gray-600 text-sm mt-1">Manage campus infrastructure and room allocations</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-deep-plum hover:bg-deep-plum/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Room
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by room code or building..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterCampus}
            onChange={(e) => setFilterCampus(e.target.value)}
            className="p-2 border rounded-md text-sm"
          >
            <option>All</option>
            {CAMPUSES.map(campus => (
              <option key={campus.code} value={campus.code}>{campus.name}</option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2 border rounded-md text-sm"
          >
            <option>All</option>
            <option>Classroom</option>
            <option>Exam Hall</option>
            <option>Lab</option>
            <option>Office</option>
            <option>Auditorium</option>
          </select>
        </div>
      </Card>

      <div className="space-y-4">
        {Object.entries(groupedRooms).map(([key, data]) => (
          <Card key={key}>
            <div className="p-4 bg-gray-50 border-b">
              <div className="flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-deep-plum" />
                <h3 className="font-semibold text-deep-plum">{data.building}</h3>
                <Badge variant="outline">{data.campus}</Badge>
                <Badge>{data.rooms.length} rooms</Badge>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white border-b">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Room Code</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Floor</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Capacity</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Type</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Facilities</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rooms.map((room) => (
                    <tr key={room.code} className="border-b hover:bg-gray-50">
                      <td className="p-4 text-sm font-medium text-deep-plum">
                        <div className="flex items-center space-x-2">
                          <DoorOpen className="w-4 h-4" />
                          <span>{room.code}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm">Floor {room.floor}</td>
                      <td className="p-4 text-sm">{room.capacity} seats</td>
                      <td className="p-4">
                        <Badge variant="outline">{room.type}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {room.facilities?.map((facility, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {facility}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={room.status === 'Available' ? 'default' : 'secondary'}>
                          {room.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(room)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(room.code)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <p className="text-gray-500">No rooms found</p>
          </div>
        </Card>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription>Enter room details</DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Room Code</label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g., AT-303"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Campus</label>
              <select
                value={formData.campus}
                onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Campus</option>
                {CAMPUSES.map(campus => (
                  <option key={campus.code} value={campus.code}>{campus.name}</option>
                ))}
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Building Name</label>
              <Input
                value={formData.building}
                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                placeholder="e.g., Academic Tower A"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Floor Number</label>
              <Input
                type="number"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) || 0 })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Capacity</label>
              <Input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Room Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option>Classroom</option>
                <option>Exam Hall</option>
                <option>Lab</option>
                <option>Office</option>
                <option>Auditorium</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Room['status'] })}
                className="w-full p-2 border rounded-md"
              >
                <option>Available</option>
                <option>Under Maintenance</option>
                <option>Reserved</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddDialog(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleAdd} className="bg-deep-plum hover:bg-deep-plum/90">
              Add Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>Update room details</DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Room Code</label>
              <Input
                value={formData.code}
                disabled
                className="bg-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Campus</label>
              <select
                value={formData.campus}
                onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                {CAMPUSES.map(campus => (
                  <option key={campus.code} value={campus.code}>{campus.name}</option>
                ))}
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Building Name</label>
              <Input
                value={formData.building}
                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Floor Number</label>
              <Input
                type="number"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) || 0 })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Capacity</label>
              <Input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Room Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option>Classroom</option>
                <option>Exam Hall</option>
                <option>Lab</option>
                <option>Office</option>
                <option>Auditorium</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Room['status'] })}
                className="w-full p-2 border rounded-md"
              >
                <option>Available</option>
                <option>Under Maintenance</option>
                <option>Reserved</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowEditDialog(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleEdit} className="bg-deep-plum hover:bg-deep-plum/90">
              Update Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
