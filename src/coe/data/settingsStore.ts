import { BLOCK_SETTINGS } from './blockSettings'

export interface AutoBlockRule {
  id: string
  enabled: boolean
  threshold?: number
  affectedActions: string[]
}

export interface ManualBlockReason {
  code: string
  label: string
  category: 'Finance' | 'TER' | 'Disciplinary' | 'Custom'
  defaultActions: string[]
  enabled: boolean
  order: number
}

export interface ScopeConfig {
  scope: 'Course-only' | 'Term-wide' | 'Program-wide'
  enabled: boolean
  allowedActions: string[]
}

export interface BlockSettingsStore {
  autoBlockRules: AutoBlockRule[]
  manualReasons: ManualBlockReason[]
  scopeConfigs: ScopeConfig[]
}

const initialAutoBlockRules: AutoBlockRule[] = [
  {
    id: 'finance-dues',
    enabled: BLOCK_SETTINGS.autoBlockOnDues,
    threshold: BLOCK_SETTINGS.duesThreshold,
    affectedActions: ['Results', 'Transcript']
  },
  {
    id: 'ter-not-submitted',
    enabled: BLOCK_SETTINGS.autoBlockOnTER,
    affectedActions: ['Results']
  },
  {
    id: 'disciplinary-hold',
    enabled: true,
    affectedActions: ['Transcript', 'Certificates']
  }
]

const initialManualReasons: ManualBlockReason[] = [
  {
    code: 'FIN001',
    label: 'Finance dues',
    category: 'Finance',
    defaultActions: ['Results', 'Transcript'],
    enabled: true,
    order: 1
  },
  {
    code: 'TER001',
    label: 'TER pending',
    category: 'TER',
    defaultActions: ['Results'],
    enabled: true,
    order: 2
  },
  {
    code: 'DIS001',
    label: 'Disciplinary hold',
    category: 'Disciplinary',
    defaultActions: ['Transcript', 'Certificates'],
    enabled: true,
    order: 3
  },
  {
    code: 'CUS001',
    label: 'Other',
    category: 'Custom',
    defaultActions: ['Results'],
    enabled: true,
    order: 4
  }
]

const initialScopeConfigs: ScopeConfig[] = [
  {
    scope: 'Course-only',
    enabled: true,
    allowedActions: ['Results']
  },
  {
    scope: 'Term-wide',
    enabled: true,
    allowedActions: ['Results', 'Transcript']
  },
  {
    scope: 'Program-wide',
    enabled: true,
    allowedActions: ['Results', 'Transcript', 'Certificates', 'Admit']
  }
]

let settingsStore: BlockSettingsStore = {
  autoBlockRules: JSON.parse(JSON.stringify(initialAutoBlockRules)),
  manualReasons: JSON.parse(JSON.stringify(initialManualReasons)),
  scopeConfigs: JSON.parse(JSON.stringify(initialScopeConfigs))
}

export const getBlockSettings = (): BlockSettingsStore => {
  return JSON.parse(JSON.stringify(settingsStore))
}

export const updateBlockSettings = (settings: BlockSettingsStore): void => {
  settingsStore = JSON.parse(JSON.stringify(settings))
}

export const resetBlockSettings = (): void => {
  settingsStore = {
    autoBlockRules: JSON.parse(JSON.stringify(initialAutoBlockRules)),
    manualReasons: JSON.parse(JSON.stringify(initialManualReasons)),
    scopeConfigs: JSON.parse(JSON.stringify(initialScopeConfigs))
  }
}

export const getInitialSettings = (): BlockSettingsStore => {
  return {
    autoBlockRules: JSON.parse(JSON.stringify(initialAutoBlockRules)),
    manualReasons: JSON.parse(JSON.stringify(initialManualReasons)),
    scopeConfigs: JSON.parse(JSON.stringify(initialScopeConfigs))
  }
}
