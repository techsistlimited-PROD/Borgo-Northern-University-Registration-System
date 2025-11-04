import React, { createContext, useContext, useState, useEffect } from 'react'
import { DEMO_MODE, DEMO_STATIC_GUARDIAN } from '@/config/demo'
import { DEMO_GUARDIANS, DEMO_WARDS } from '@/lib/guardianStatic'

export type UserRole = 'student' | 'acad' | 'teacher' | 'coe' | 'finance' | 'admin' | 'guardian' | 'hr_officer' | 'hr_head' | 'system_admin'

export interface User {
  id: string
  name: string
  role: UserRole
  email?: string
  program?: string
  semester?: string
}

interface AuthContextType {
  user: User | null
  login: (credentials: { username: string; password: string; role: UserRole }) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo credentials
const demoCredentials = {
  student: { username: '2021-1-60-001', password: 'student123' },
  acad: { username: 'academic', password: 'academic123' },
  teacher: { username: 'T001', password: 'teacher123' },
  coe: { username: 'coe', password: 'coe123' },
  finance: { username: 'finance', password: 'finance123' },
  admin: { username: 'admin', password: 'admin123' },
  guardian: {
    'father.cse@demo.nu': 'guardian123',
    'guardian.bba@demo.nu': 'guardian123',
    'mother.cse@demo.nu': 'guardian123'
  },
  hr_officer: { username: 'hr_officer', password: 'hrm123' },
  hr_head: { username: 'hr_head', password: 'hrm123' },
  system_admin: { username: 'sys_admin', password: 'hrm123' }
}

// Demo users
const demoUsers: Record<string, User> = {
  '2021-1-60-001': {
    id: '2021-1-60-001',
    name: 'John Doe',
    role: 'student',
    email: 'john.doe@nu.edu.bd',
    program: 'Computer Science & Engineering',
    semester: 'Fall 2024'
  },
  'academic': {
    id: 'academic',
    name: 'Academic Affairs Officer',
    role: 'acad',
    email: 'acad@nu.edu.bd'
  },
  'T001': {
    id: 'T001',
    name: 'Dr. Abdul Rahman',
    role: 'teacher',
    email: 'abdul.rahman@nu.edu.bd',
    program: 'Computer Science & Engineering'
  },
  'coe': {
    id: 'coe',
    name: 'Md. Arif Hossain',
    role: 'coe',
    email: 'exam.controller@nu.edu.bd'
  },
  'finance': {
    id: 'finance',
    name: 'Mahfuz Rahman',
    role: 'finance',
    email: 'finance@nu.edu.bd'
  },
  'admin': {
    id: 'admin',
    name: 'Md. Imran Hossain',
    role: 'admin',
    email: 'admin@nu.edu.bd'
  },
  'father.cse@demo.nu': {
    id: 'g_father_01',
    name: 'Abdul Karim',
    role: 'guardian',
    email: 'father.cse@demo.nu'
  },
  'guardian.bba@demo.nu': {
    id: 'g_guardian_02',
    name: 'Shahidul Islam',
    role: 'guardian',
    email: 'guardian.bba@demo.nu'
  },
  'mother.cse@demo.nu': {
    id: 'g_mother_01',
    name: 'Rokia Begum',
    role: 'guardian',
    email: 'mother.cse@demo.nu'
  },
  'hr_officer': {
    id: 'hr_officer_01',
    name: 'Sadia Akter',
    role: 'hr_officer',
    email: 'hr.officer@nu.edu.bd'
  },
  'hr_head': {
    id: 'hr_head_01',
    name: 'Md. Kamal Hossain',
    role: 'hr_head',
    email: 'hr.head@nu.edu.bd'
  },
  'sys_admin': {
    id: 'sys_admin_01',
    name: 'System Administrator',
    role: 'system_admin',
    email: 'sysadmin@nu.edu.bd'
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('nu-user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (credentials: { username: string; password: string; role: UserRole }): Promise<boolean> => {
    const role = credentials.role
    const username = credentials.username.trim()
    const password = credentials.password.trim()

    // Special handling for guardian role (email-based)
    if (role === 'guardian') {
      // Static guardian demo mode
      if (DEMO_MODE && DEMO_STATIC_GUARDIAN && password === 'guardian123') {
        const guardian = DEMO_GUARDIANS.find(g => g.email.toLowerCase() === username.toLowerCase())
        if (guardian) {
          const userData: User = {
            id: guardian.id,
            name: guardian.name,
            role: 'guardian',
            email: guardian.email
          }
          setUser(userData)
          localStorage.setItem('nu-user', JSON.stringify(userData))

          // Auto-set first ward as active
          const wards = DEMO_WARDS[guardian.id]
          if (wards && wards.length > 0) {
            localStorage.setItem('guardian.activeWard', wards[0].id)
          }

          console.log('✅ Static guardian login:', guardian.id, '→', guardian.email)
          return true
        }
      }

      // Fallback to regular demo credentials
      const guardianCreds = demoCredentials.guardian as Record<string, string>
      if (guardianCreds[username] === password) {
        const userData = demoUsers[username]
        if (userData) {
          setUser(userData)
          localStorage.setItem('nu-user', JSON.stringify(userData))
          return true
        }
      }
      return false
    }

    // Check demo credentials for other roles
    if (demoCredentials[role]?.username === username && demoCredentials[role]?.password === password) {
      const userData = demoUsers[username]
      if (userData) {
        setUser(userData)
        localStorage.setItem('nu-user', JSON.stringify(userData))
        return true
      }
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('nu-user')
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
