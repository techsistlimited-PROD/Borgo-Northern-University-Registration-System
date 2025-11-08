export const DEMO_MODE = true
export const DEMO_STATIC_GUARDIAN = true

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
