// Admin Security Seeds - Demo data for security features
// All datasets seeded with ≥25 rows for comprehensive demo

export interface LoginHistoryEntry {
  id: string
  timestamp: string
  user: string
  userId: string
  role: string
  ip: string
  device: string
  result: 'Success' | 'Failed' | 'Locked' | 'OTP Failed'
  otpAttempts?: number
}

export interface InvalidAttemptEntry {
  id: string
  timestamp: string
  usernameAttempted: string
  ip: string
  attemptCount: number
  windowStart: string
  windowEnd: string
  action: 'Lock Applied' | 'Blocked by IP List' | 'None' | 'Warning Sent'
  reason: string
}

export interface PermissionChangeLog {
  id: string
  timestamp: string
  actor: string
  actorId: string
  targetUser: string
  targetUserId: string
  changeType: 'Add Permission' | 'Remove Permission' | 'Add Role' | 'Remove Role'
  permission: string
  scope: string
  ip: string
}

export interface EmailVerificationLog {
  id: string
  timestamp: string
  user: string
  userId: string
  event: 'Email Verification' | 'Email Change' | 'OTP Verification'
  status: 'Success' | 'Failed' | 'Pending'
  oldEmail?: string
  newEmail?: string
  ip: string
  otpCode?: string
}

export interface PasswordResetLog {
  id: string
  timestamp: string
  user: string
  userId: string
  initiatedBy: 'Self' | 'Admin' | 'System'
  initiatorId?: string
  outcome: 'Success' | 'Failed' | 'Expired' | 'Cancelled'
  ip: string
  method: 'Email Link' | 'OTP' | 'Admin Panel'
}

export interface IPBlocklistEntry {
  id: string
  ip: string
  type: 'Single IP' | 'CIDR Range'
  reason: string
  addedBy: string
  addedAt: string
  status: 'Active' | 'Disabled'
  category: 'Blocklist' | 'Whitelist'
  expiresAt?: string
}

// Simple LCG for deterministic demo data
function lcg(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

const rng = lcg(987654321)
const rand = () => rng()
const randInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min
const randItem = <T,>(arr: T[]): T => arr[randInt(0, arr.length - 1)]

const users = [
  { id: 'ADM-0001', name: 'Md. Imran Hossain', role: 'System Admin' },
  { id: 'REG-0102', name: 'Tania Sultana', role: 'Registrar' },
  { id: 'EXAM-2045', name: 'Rafiq Ahmed', role: 'Exam Controller' },
  { id: 'FIN-8890', name: 'Sharmin Akter', role: 'Finance Officer' },
  { id: 'FAC-ENG-1123', name: 'Engr. Shakil Rahman', role: 'Faculty (SOE)' },
  { id: 'FAC-BBA-5567', name: 'Prof. Nazmul Karim', role: 'Faculty (SOB)' },
  { id: 'STU-CSE-0042', name: 'Md. Asif Rahman', role: 'Student' },
  { id: 'STU-BBA-1205', name: 'Faria Islam', role: 'Student' },
  { id: 'ADM-0002', name: 'Kamal Uddin', role: 'System Admin' },
  { id: 'ADM-0003', name: 'Sultana Begum', role: 'Deputy Admin' }
]

const ips = [
  '103.102.101.1', '203.91.77.45', '10.10.12.5', '192.168.1.100',
  '8.8.8.8', '1.1.1.1', '45.76.123.45', '157.240.2.1',
  '103.15.200.12', '202.134.4.56', '114.31.192.78', '180.211.99.44'
]

const devices = [
  'Chrome / Windows 11', 'Chrome / MacOS', 'Edge / Windows 10', 
  'Firefox / Ubuntu', 'Safari / macOS', 'Chrome / Android 12',
  'Safari / iOS 16', 'Edge / Windows 11', 'Firefox / Windows 10'
]

const permissions = [
  'admissions.application.view', 'admissions.application.approve', 
  'exam.sessions.create', 'exam.result.publish',
  'finance.payment.refund', 'finance.payment.create',
  'student.portal.view_grades', 'admin.users.manage',
  'admin.roles.edit', 'academic.course.create',
  'academic.course.delete', 'reports.financial.view'
]

const scopes = [
  'All Campuses', 'Dhaka Campus', 'Permanent Campus',
  'All Programs', 'CSE Program', 'BBA Program',
  'Finance Module', 'Exam Module', 'Admin Module'
]

// Generate Login History (30 rows)
export const loginHistoryStatic: LoginHistoryEntry[] = Array.from({ length: 30 }, (_, i) => {
  const user = randItem(users)
  const daysAgo = randInt(0, 7)
  const hoursAgo = randInt(0, 23)
  const minsAgo = randInt(0, 59)
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  date.setHours(date.getHours() - hoursAgo)
  date.setMinutes(date.getMinutes() - minsAgo)
  
  const result = rand() < 0.85 ? 'Success' : randItem(['Failed', 'Locked', 'OTP Failed'] as const)
  
  return {
    id: `login-${1000 + i}`,
    timestamp: date.toLocaleString('en-GB', { 
      day: '2-digit', month: 'short', year: 'numeric', 
      hour: '2-digit', minute: '2-digit', hour12: true 
    }),
    user: user.name,
    userId: user.id,
    role: user.role,
    ip: randItem(ips),
    device: randItem(devices),
    result,
    otpAttempts: result === 'OTP Failed' ? randInt(1, 3) : undefined
  }
})

// Generate Invalid Attempts (25 rows)
export const invalidAttemptsStatic: InvalidAttemptEntry[] = Array.from({ length: 25 }, (_, i) => {
  const daysAgo = randInt(0, 14)
  const hoursAgo = randInt(0, 23)
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  date.setHours(date.getHours() - hoursAgo)
  
  const windowStart = new Date(date)
  const windowEnd = new Date(date.getTime() + 10 * 60 * 1000)
  const attemptCount = randInt(3, 12)
  const action = attemptCount >= 5 ? randItem(['Lock Applied', 'Blocked by IP List'] as const) : randItem(['None', 'Warning Sent'] as const)
  
  return {
    id: `invalid-${2000 + i}`,
    timestamp: date.toLocaleString('en-GB', { 
      day: '2-digit', month: 'short', year: 'numeric', 
      hour: '2-digit', minute: '2-digit', hour12: true 
    }),
    usernameAttempted: rand() < 0.5 ? randItem(users).id : `unknown-${randInt(100, 999)}`,
    ip: randItem(ips),
    attemptCount,
    windowStart: windowStart.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }),
    windowEnd: windowEnd.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }),
    action,
    reason: action === 'Lock Applied' ? 'Exceeded 5 attempts in 10 minutes' :
            action === 'Blocked by IP List' ? 'IP in blocklist' :
            action === 'Warning Sent' ? 'Suspicious activity detected' :
            'Below threshold'
  }
})

// Generate Permission Change Logs (30 rows)
export const permissionChangeLogsStatic: PermissionChangeLog[] = Array.from({ length: 30 }, (_, i) => {
  const actor = randItem(users.filter(u => u.role.includes('Admin')))
  const targetUser = randItem(users)
  const daysAgo = randInt(0, 30)
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  
  return {
    id: `perm-${3000 + i}`,
    timestamp: date.toLocaleString('en-GB', { 
      day: '2-digit', month: 'short', year: 'numeric', 
      hour: '2-digit', minute: '2-digit', hour12: true 
    }),
    actor: actor.name,
    actorId: actor.id,
    targetUser: targetUser.name,
    targetUserId: targetUser.id,
    changeType: randItem(['Add Permission', 'Remove Permission', 'Add Role', 'Remove Role'] as const),
    permission: randItem(permissions),
    scope: randItem(scopes),
    ip: randItem(ips)
  }
})

// Generate Email Verification Logs (28 rows)
export const emailVerificationLogsStatic: EmailVerificationLog[] = Array.from({ length: 28 }, (_, i) => {
  const user = randItem(users)
  const daysAgo = randInt(0, 60)
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  
  const event = randItem(['Email Verification', 'Email Change', 'OTP Verification'] as const)
  const status = rand() < 0.9 ? 'Success' : randItem(['Failed', 'Pending'] as const)
  
  return {
    id: `email-${4000 + i}`,
    timestamp: date.toLocaleString('en-GB', { 
      day: '2-digit', month: 'short', year: 'numeric', 
      hour: '2-digit', minute: '2-digit', hour12: true 
    }),
    user: user.name,
    userId: user.id,
    event,
    status,
    oldEmail: event === 'Email Change' ? `old.${user.id.toLowerCase()}@nub.ac.bd` : undefined,
    newEmail: event === 'Email Change' ? `new.${user.id.toLowerCase()}@nub.ac.bd` : `${user.id.toLowerCase()}@nub.ac.bd`,
    ip: randItem(ips),
    otpCode: event === 'OTP Verification' ? String(randInt(100000, 999999)) : undefined
  }
})

// Generate Password Reset Logs (27 rows)
export const passwordResetLogsStatic: PasswordResetLog[] = Array.from({ length: 27 }, (_, i) => {
  const user = randItem(users)
  const daysAgo = randInt(0, 90)
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  
  const initiatedBy = randItem(['Self', 'Admin', 'System'] as const)
  const outcome = rand() < 0.85 ? 'Success' : randItem(['Failed', 'Expired', 'Cancelled'] as const)
  const method = randItem(['Email Link', 'OTP', 'Admin Panel'] as const)
  
  return {
    id: `reset-${5000 + i}`,
    timestamp: date.toLocaleString('en-GB', { 
      day: '2-digit', month: 'short', year: 'numeric', 
      hour: '2-digit', minute: '2-digit', hour12: true 
    }),
    user: user.name,
    userId: user.id,
    initiatedBy,
    initiatorId: initiatedBy === 'Admin' ? randItem(users.filter(u => u.role.includes('Admin'))).id : undefined,
    outcome,
    ip: randItem(ips),
    method
  }
})

// Generate IP Blocklist/Whitelist (30 total: 20 blocklist, 10 whitelist)
export const ipBlocklistStatic: IPBlocklistEntry[] = [
  // Blocklist entries (20)
  ...Array.from({ length: 20 }, (_, i) => {
    const daysAgo = randInt(0, 180)
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    
    const admin = randItem(users.filter(u => u.role.includes('Admin')))
    const ipType = rand() < 0.7 ? 'Single IP' : 'CIDR Range'
    const ip = ipType === 'Single IP' ? randItem(ips) : `${randInt(1, 255)}.${randInt(1, 255)}.0.0/16`
    
    return {
      id: `block-${6000 + i}`,
      ip,
      type: ipType,
      reason: randItem([
        'Repeated failed login attempts',
        'Suspicious activity detected',
        'Known malicious IP',
        'Brute force attack',
        'Data scraping attempt',
        'Unauthorized access attempt'
      ]),
      addedBy: admin.name,
      addedAt: date.toLocaleString('en-GB', { 
        day: '2-digit', month: 'short', year: 'numeric'
      }),
      status: rand() < 0.8 ? 'Active' : 'Disabled',
      category: 'Blocklist',
      expiresAt: rand() < 0.3 ? new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleString('en-GB', { 
        day: '2-digit', month: 'short', year: 'numeric'
      }) : undefined
    }
  }),
  
  // Whitelist entries (10)
  ...Array.from({ length: 10 }, (_, i) => {
    const daysAgo = randInt(0, 365)
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    
    const admin = randItem(users.filter(u => u.role.includes('Admin')))
    const ipType = rand() < 0.5 ? 'Single IP' : 'CIDR Range'
    const ip = ipType === 'Single IP' ? `103.102.${randInt(1, 255)}.${randInt(1, 255)}` : `103.102.0.0/16`
    
    return {
      id: `white-${7000 + i}`,
      ip,
      type: ipType,
      reason: randItem([
        'University campus network',
        'Admin office static IP',
        'Trusted partner institution',
        'VPN gateway',
        'Cloud service provider'
      ]),
      addedBy: admin.name,
      addedAt: date.toLocaleString('en-GB', { 
        day: '2-digit', month: 'short', year: 'numeric'
      }),
      status: 'Active',
      category: 'Whitelist'
    }
  })
]

// Helper to ensure minimum rows
export function ensureMinSecurityRows<T>(
  baseArray: T[],
  minCount: number,
  buildFn: (index: number) => T
): T[] {
  if (baseArray.length >= minCount) {
    return baseArray
  }

  const result = [...baseArray]
  const needed = minCount - baseArray.length

  for (let i = 0; i < needed; i++) {
    result.push(buildFn(baseArray.length + i))
  }

  return result
}
