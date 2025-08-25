import { useState } from 'react'
import { useAuth } from '@/contexts/RegistrationAuthContext'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Edit, 
  Key, 
  LogOut,
  UserCircle
} from 'lucide-react'

interface StudentProfileDropdownProps {
  onViewProfile: () => void
  onEditProfile: () => void
  onChangePassword: () => void
}

export const StudentProfileDropdown = ({ 
  onViewProfile, 
  onEditProfile, 
  onChangePassword 
}: StudentProfileDropdownProps) => {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-deep-plum">
            <AvatarImage src="/placeholder-avatar.jpg" alt={user?.name} />
            <AvatarFallback className="bg-gradient-to-br from-deep-plum to-accent-purple text-white font-semibold">
              {user?.name ? getInitials(user.name) : 'ST'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              ID: {user?.id}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.program}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onViewProfile} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>View My Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onEditProfile} className="cursor-pointer">
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit My Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onChangePassword} className="cursor-pointer">
          <Key className="mr-2 h-4 w-4" />
          <span>Change Password</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
