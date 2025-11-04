import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/RegistrationAuthContext'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { 
  LayoutDashboard, 
  Calendar, 
  GraduationCap, 
  DollarSign, 
  Bell, 
  User, 
  LogOut,
  ChevronDown 
} from 'lucide-react'
import { guardianService, LogService, notificationService } from '@/lib/guardianServices'
import { Student, Semester } from '@/lib/seedAll'
import { Repo } from '@/lib/repo'
import GuardianDashboardView from '@/components/guardian/GuardianDashboardView'
import GuardianAttendance from '@/components/guardian/GuardianAttendance'
import GuardianAcademics from '@/components/guardian/GuardianAcademics'
import GuardianFinance from '@/components/guardian/GuardianFinance'
import GuardianNotifications from '@/components/guardian/GuardianNotifications'
import GuardianProfile from '@/components/guardian/GuardianProfile'

type ActiveSection = 'dashboard' | 'attendance' | 'academics' | 'finance' | 'notifications' | 'profile'

export default function GuardianDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard')
  const [wards, setWards] = useState<Student[]>([])
  const [activeWard, setActiveWard] = useState<Student | null>(null)
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [activeTerm, setActiveTerm] = useState<string>('')
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user || user.role !== 'guardian') {
      navigate('/guardian/login')
      return
    }

    // Log guardian login
    LogService.add({
      actor: user.id,
      actorRole: 'GUARDIAN',
      type: 'GUARDIAN.LOGIN.VIEW',
      payload: {}
    })

    // Load wards
    const myWards = guardianService.getMyWards(user.id)
    setWards(myWards)

    // Set active ward
    const savedWardId = guardianService.getActiveWardId()
    const ward = myWards.find(w => w.id === savedWardId) || myWards[0]
    if (ward) {
      setActiveWard(ward)
      guardianService.setActiveWardId(ward.id)
    }

    // Load semesters
    const allSemesters = Repo.get<Semester>('semesters')
    setSemesters(allSemesters)
    const activeSem = allSemesters.find(s => s.status === 'Active')
    if (activeSem) {
      setActiveTerm(activeSem.id)
    }

    // Load unread notifications
    const unread = notificationService.getUnreadCount(user.id)
    setUnreadCount(unread)

    // Subscribe to changes
    const unsubNotif = notificationService.subscribe(() => {
      setUnreadCount(notificationService.getUnreadCount(user.id))
    })

    return () => {
      unsubNotif()
    }
  }, [user, navigate])

  const handleWardChange = (wardId: string) => {
    const newWard = wards.find(w => w.id === wardId)
    if (newWard) {
      setActiveWard(newWard)
      guardianService.setActiveWardId(wardId)

      LogService.add({
        actor: user!.id,
        actorRole: 'GUARDIAN',
        type: 'GUARDIAN.SWITCH_WARD',
        payload: { toStudentId: wardId }
      })
    }
  }

  const handleSectionChange = (section: ActiveSection) => {
    setActiveSection(section)

    const eventMap: Record<ActiveSection, string> = {
      dashboard: 'GUARDIAN.DASHBOARD.VIEW',
      attendance: 'GUARDIAN.ATTENDANCE.VIEW',
      academics: 'GUARDIAN.RESULTS.VIEW',
      finance: 'GUARDIAN.FINANCE.VIEW',
      notifications: 'GUARDIAN.NOTIFICATIONS.VIEW',
      profile: 'GUARDIAN.PROFILE.VIEW'
    }

    if (eventMap[section]) {
      LogService.add({
        actor: user!.id,
        actorRole: 'GUARDIAN',
        type: eventMap[section],
        payload: { wardId: activeWard?.id }
      })
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/guardian/login')
  }

  if (!activeWard) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-deep-plum mb-2">No Wards Linked</h2>
          <p className="text-gray-600 mb-4">Please contact Admission Office to link your ward.</p>
          <Button onClick={handleLogout}>Back to Login</Button>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <GuardianDashboardView wardId={activeWard.id} termId={activeTerm} />
      case 'attendance':
        return <GuardianAttendance wardId={activeWard.id} termId={activeTerm} />
      case 'academics':
        return <GuardianAcademics wardId={activeWard.id} termId={activeTerm} />
      case 'finance':
        return <GuardianFinance wardId={activeWard.id} termId={activeTerm} />
      case 'notifications':
        return <GuardianNotifications guardianId={user!.id} />
      case 'profile':
        return <GuardianProfile guardianId={user!.id} />
      default:
        return <GuardianDashboardView wardId={activeWard.id} termId={activeTerm} />
    }
  }

  const menuItems = [
    { id: 'dashboard' as ActiveSection, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance' as ActiveSection, label: 'Attendance', icon: Calendar },
    { id: 'academics' as ActiveSection, label: 'Academics', icon: GraduationCap },
    { id: 'finance' as ActiveSection, label: 'Finance', icon: DollarSign },
    { id: 'notifications' as ActiveSection, label: 'Notifications', icon: Bell },
    { id: 'profile' as ActiveSection, label: 'Profile', icon: User }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-gradient-to-r from-deep-plum to-accent-purple text-white shadow-lg sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-bold">Guardian Portal</h1>
              
              {/* Ward Selector */}
              {wards.length > 1 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:bg-white/10">
                      <User className="w-4 h-4 mr-2" />
                      {activeWard.name}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Select Ward</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {wards.map(ward => (
                      <DropdownMenuItem
                        key={ward.id}
                        onClick={() => handleWardChange(ward.id)}
                        className={activeWard.id === ward.id ? 'bg-mint-green/20' : ''}
                      >
                        <div>
                          <div className="font-medium">{ward.name}</div>
                          <div className="text-xs text-gray-500">{ward.id} · {ward.program}</div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Term Selector */}
              <select
                value={activeTerm}
                onChange={(e) => setActiveTerm(e.target.value)}
                className="bg-white/10 text-white border-white/20 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-mint-green"
              >
                {semesters.map(sem => (
                  <option key={sem.id} value={sem.id} className="text-gray-900">
                    {sem.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="relative text-white hover:bg-white/10"
                onClick={() => handleSectionChange('notifications')}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white px-1.5 py-0.5 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    <Avatar className="w-8 h-8 mr-2">
                      <AvatarFallback className="bg-mint-green text-deep-plum">
                        {user?.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Guardian Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleSectionChange('profile')}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Ward Info Bar */}
          <div className="mt-3 flex items-center space-x-4 text-sm text-white/90">
            <div>Student: <span className="font-medium">{activeWard.id}</span></div>
            <div>·</div>
            <div>Program: <span className="font-medium">{activeWard.program}</span></div>
            <div>·</div>
            <div>CGPA: <Badge variant="secondary" className="bg-mint-green text-deep-plum">{activeWard.cgpa.toFixed(2)}</Badge></div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gradient-to-b from-deep-plum to-accent-purple min-h-[calc(100vh-80px)] shadow-lg">
          <nav className="p-4 space-y-2">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  activeSection === item.id
                    ? 'bg-mint-green text-deep-plum shadow-md'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.id === 'notifications' && unreadCount > 0 && (
                  <Badge className="ml-auto bg-red-500 text-white px-2 py-0.5 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
