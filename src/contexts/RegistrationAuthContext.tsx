import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'student' | 'acad' | 'teacher'

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
  acad: { username: 'acad', password: 'acad123' },
  teacher: { username: 'T001', password: 'teacher123' }
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
  'acad': {
    id: 'acad',
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
