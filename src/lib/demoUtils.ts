import { DEMO_MODE } from '@/config/demo'
import { Repo } from './repo'

export function resetDemoData() {
  if (!DEMO_MODE) {
    console.warn('Demo mode is disabled. Cannot reset demo data.')
    return
  }

  // Clear all demo seed flags
  const keys = Object.keys(localStorage).filter(k => k.startsWith('nu-erp-demo-seeded-'))
  keys.forEach(k => localStorage.removeItem(k))

  // Clear main seed flag
  localStorage.removeItem('nu-erp-seeded')

  console.log('✅ Demo data reset. Reload the page to re-seed.')
}

export function verifyGuardianData() {
  console.log('\n=== GUARDIAN PORTAL DATA VERIFICATION ===\n')

  const guardians = Repo.get('guardians')
  const students = Repo.get('students')
  const guardianLinks = Repo.get('guardianLinks')
  const user = JSON.parse(localStorage.getItem('nu-user') || '{}')

  console.log('📊 Current User:', user.id, '-', user.email, '(role:', user.role + ')')
  console.log('\n📋 Guardians:', guardians.length)
  guardians.forEach((g: any) => console.log('  -', g.id, '→', g.email, '(', g.name, ')'))

  console.log('\n👥 Students:', students.length)
  students.forEach((s: any) => console.log('  -', s.id, '→', s.name, '(', s.program, ')'))

  console.log('\n🔗 Guardian Links:', guardianLinks.length)
  guardianLinks.forEach((l: any) => console.log('  -', l.guardianId, '→', l.studentId, '(', l.relation, ')'))

  if (user.role === 'guardian') {
    const myLinks = guardianLinks.filter((l: any) => l.guardianId === user.id)
    console.log('\n✅ My Links:', myLinks.length)
    myLinks.forEach((l: any) => {
      const student = students.find((s: any) => s.id === l.studentId)
      console.log('  -', l.studentId, '→', student?.name || 'STUDENT NOT FOUND')
    })

    if (myLinks.length === 0) {
      console.log('\n❌ ERROR: No wards linked to guardian', user.id)
      console.log('   This will cause "No Wards Linked" error')
      console.log('   Expected guardianId in links:', user.id)
      console.log('   Actual guardianIds in links:', [...new Set(guardianLinks.map((l: any) => l.guardianId))])
    }
  }

  console.log('\n=====================================\n')
}

// Make it available in console for debugging
if (DEMO_MODE && typeof window !== 'undefined') {
  (window as any).resetDemoData = resetDemoData;
  (window as any).verifyGuardianData = verifyGuardianData
  console.log('💡 Guardian Debug Commands Available:')
  console.log('   - resetDemoData() - Clear and re-seed demo data')
  console.log('   - verifyGuardianData() - Check guardian portal data')
}
