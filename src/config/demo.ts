export const DEMO_MODE = true
export const DEMO_STATIC_GUARDIAN = true

// Demo-only: bypass IP & brute-force (can be toggled via localStorage)
const relaxedSetting = typeof window !== 'undefined'
  ? (localStorage.getItem('DEMO_RELAXED_SECURITY') ?? 'true') === 'true'
  : true
export const DEMO_RELAXED_SECURITY = DEMO_MODE && relaxedSetting

export const demoConfig = {
  enabled: DEMO_MODE,
  showPill: true,
  simulateSuccess: true,
  resetOnRefresh: true,
  gatewaysStubbed: true,
  persistenceDisabled: true
}

export const showDemoToast = (action: string) => {
  if (DEMO_MODE) {
    return `${action} simulated successfully (Demo Mode)`
  }
  return `${action} completed successfully`
}
