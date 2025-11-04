import { DEMO_MODE } from '@/config/demo'

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

// Make it available in console for debugging
if (DEMO_MODE && typeof window !== 'undefined') {
  (window as any).resetDemoData = resetDemoData
}
