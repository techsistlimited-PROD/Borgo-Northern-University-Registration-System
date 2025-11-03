import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Edit, Shield } from 'lucide-react'

interface Permission {
  module: string
  actions: string[]
}

interface Role {
  id: string
  name: string
  description: string
  permissions: { [key: string]: string[] }
  userCount: number
}

export default function RolesPermissions() {
  const availablePermissions: Permission[] = [
    { module: 'Student Management', actions: ['View', 'Create', 'Edit', 'Delete'] },
    { module: 'Course Management', actions: ['View', 'Create', 'Edit', 'Delete'] },
    { module: 'Exam Management', actions: ['View', 'Create', 'Publish Results'] },
    { module: 'Finance', actions: ['View Payments', 'Collect Payment', 'Issue Receipt', 'Manage Waivers'] },
    { module: 'User Management', actions: ['View', 'Create', 'Edit', 'Delete', 'Reset Password'] }
  ]

  const [roles, setRoles] = useState<Role[]>([
    { 
      id: '1', 
      name: 'System Administrator', 
      description: 'Full system access', 
      permissions: {
        'Student Management': ['View', 'Create', 'Edit', 'Delete'],
        'Course Management': ['View', 'Create', 'Edit', 'Delete'],
        'Exam Management': ['View', 'Create', 'Publish Results'],
        'Finance': ['View Payments', 'Collect Payment', 'Issue Receipt', 'Manage Waivers'],
        'User Management': ['View', 'Create', 'Edit', 'Delete', 'Reset Password']
      },
      userCount: 3
    },
    { 
      id: '2', 
      name: 'Controller of Examinations', 
      description: 'Exam and result management', 
      permissions: {
        'Student Management': ['View'],
        'Exam Management': ['View', 'Create', 'Publish Results']
      },
      userCount: 2
    },
    { 
      id: '3', 
      name: 'Finance Officer', 
      description: 'Financial operations', 
      permissions: {
        'Student Management': ['View'],
        'Finance': ['View Payments', 'Collect Payment', 'Issue Receipt']
      },
      userCount: 5
    }
  ])
  const [showDialog, setShowDialog] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: {} as { [key: string]: string[] }
  })

  const handleSave = () => {
    if (editingRole) {
      setRoles(roles.map(r => r.id === editingRole.id ? { ...editingRole, ...formData } : r))
    } else {
      const newRole: Role = {
        id: String(roles.length + 1),
        ...formData,
        userCount: 0
      }
      setRoles([...roles, newRole])
    }
    setShowDialog(false)
    resetForm()
  }

  const openEditDialog = (role: Role) => {
    setEditingRole(role)
    setFormData({
      name: role.name,
      description: role.description,
      permissions: { ...role.permissions }
    })
    setShowDialog(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: {}
    })
    setEditingRole(null)
  }

  const togglePermission = (module: string, action: string) => {
    const modulePerms = formData.permissions[module] || []
    if (modulePerms.includes(action)) {
      setFormData({
        ...formData,
        permissions: {
          ...formData.permissions,
          [module]: modulePerms.filter(a => a !== action)
        }
      })
    } else {
      setFormData({
        ...formData,
        permissions: {
          ...formData.permissions,
          [module]: [...modulePerms, action]
        }
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Roles & Permissions</h1>
          <p className="text-gray-600 text-sm mt-1">Manage user roles and their permissions</p>
        </div>
        <Button onClick={() => setShowDialog(true)} className="bg-deep-plum hover:bg-deep-plum/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => (
          <Card key={role.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-deep-plum" />
                <div>
                  <h3 className="font-semibold text-deep-plum">{role.name}</h3>
                  <p className="text-xs text-gray-500">{role.description}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => openEditDialog(role)}>
                <Edit className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {Object.entries(role.permissions).map(([module, actions]) => (
                <div key={module} className="border-l-2 border-deep-plum pl-3">
                  <p className="text-sm font-medium mb-1">{module}</p>
                  <div className="flex flex-wrap gap-1">
                    {actions.map(action => (
                      <Badge key={action} variant="secondary" className="text-xs">
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-500">{role.userCount} users assigned to this role</p>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingRole ? 'Edit Role' : 'Add New Role'}</DialogTitle>
            <DialogDescription>Configure role and its permissions</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Role Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Department Coordinator"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this role"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Permissions</label>
              <div className="space-y-4 max-h-96 overflow-y-auto border rounded-md p-4">
                {availablePermissions.map(({ module, actions }) => (
                  <div key={module} className="pb-3 border-b last:border-0">
                    <p className="font-medium mb-2">{module}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {actions.map(action => (
                        <div key={action} className="flex items-center space-x-2">
                          <Checkbox
                            checked={(formData.permissions[module] || []).includes(action)}
                            onCheckedChange={() => togglePermission(module, action)}
                          />
                          <label className="text-sm cursor-pointer">{action}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDialog(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-deep-plum hover:bg-deep-plum/90">
              {editingRole ? 'Update Role' : 'Create Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
