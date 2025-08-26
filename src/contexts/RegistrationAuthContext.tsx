import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'student' | 'advisor' | 'admin' | 'teacher'

export interface User {
  id: string
  name: string
  role: UserRole
  email?: string
  program?: string
  semester?: string
  advisorId?: string
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
  advisor: { username: 'ADV001', password: 'advisor123' },
  admin: { username: 'admin', password: 'admin123' }
}

// Demo users
const demoUsers: Record<string, User> = {
  '2021-1-60-001': {
    id: '2021-1-60-001',
    name: 'John Doe',
    role: 'student',
    email: 'john.doe@nu.edu.bd',
    program: 'Computer Science & Engineering',
    semester: 'Fall 2024',
    advisorId: 'ADV001'
  },
  'ADV001': {
    id: 'ADV001',
    name: 'Dr. Sarah Johnson',
    role: 'advisor',
    email: 'sarah.johnson@nu.edu.bd'
  },
  'admin': {
    id: 'admin',
    name: 'System Administrator',
    role: 'admin',
    email: 'admin@nu.edu.bd'
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
    const { username, password, role } = credentials
    
    // Check demo credentials
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
