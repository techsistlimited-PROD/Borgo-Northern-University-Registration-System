import { DEMO_STATIC_GUARDIAN, DEMO_MODE } from '@/config/demo'
import {
  DEMO_WARDS,
  DEMO_ATTENDANCE,
  DEMO_RESULTS,
  DEMO_FINANCE,
  DEMO_NOTIFICATIONS,
  Ward
} from '@/lib/guardianStatic'

function ensureDemo() {
  if (!(DEMO_MODE && DEMO_STATIC_GUARDIAN)) {
    throw new Error('Not in static demo mode')
  }
}

function getSessionGuardianId(): string | null {
  const userStr = localStorage.getItem('nu-user')
  if (!userStr) return null
  const user = JSON.parse(userStr)
  return user.role === 'guardian' ? user.id : null
}

export const GuardianDemo = {
  getWards(): Ward[] {
    ensureDemo()
    const gid = getSessionGuardianId()
    return gid && DEMO_WARDS[gid] ? DEMO_WARDS[gid] : []
  },

  getActiveWardId(): string | null {
    return localStorage.getItem('guardian.activeWard')
  },

  setActiveWardId(id: string) {
    localStorage.setItem('guardian.activeWard', id)
  },

  getAttendance(
    wardId: string,
    filters?: { from?: string; to?: string; course?: string; status?: string }
  ) {
    ensureDemo()
    let rows = DEMO_ATTENDANCE.filter(r => r.wardId === wardId)

    if (filters?.course) {
      rows = rows.filter(r => r.course === filters.course)
    }
    if (filters?.from) {
      rows = rows.filter(r => r.date >= filters.from!)
    }
    if (filters?.to) {
      rows = rows.filter(r => r.date <= filters.to!)
    }
    if (filters?.status) {
      rows = rows.filter(r => r.status === filters.status)
    }

    return rows.sort((a, b) => b.date.localeCompare(a.date)) // Most recent first
  },

  getAttendanceStats(wardId: string) {
    ensureDemo()
    const rows = DEMO_ATTENDANCE.filter(r => r.wardId === wardId)
    const present = rows.filter(r => r.status === 'P').length
    const absent = rows.filter(r => r.status === 'A').length
    const late = rows.filter(r => r.status === 'L').length
    const total = rows.length
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0

    return { present, absent, late, percentage }
  },

  getResults(wardId: string) {
    ensureDemo()
    return (
      DEMO_RESULTS[wardId] || {
        cgpa: 0,
        semesters: [],
        gates: { dues: 0, terPending: false }
      }
    )
  },

  getFinance(wardId: string) {
    ensureDemo()
    return (
      DEMO_FINANCE[wardId] || {
        summary: { totalBill: 0, totalPaid: 0, due: 0 },
        payables: [],
        payments: []
      }
    )
  },

  getNotifications() {
    ensureDemo()
    const gid = getSessionGuardianId()
    if (!gid) return []
    return DEMO_NOTIFICATIONS(gid)
  },

  getUnreadCount() {
    ensureDemo()
    const notifs = this.getNotifications()
    return notifs.filter(n => !n.read).length
  },

  markAsRead(notifId: string) {
    // In static demo, this is a no-op (no persistence)
    console.log('Static demo: mark notification as read', notifId)
  }
}
