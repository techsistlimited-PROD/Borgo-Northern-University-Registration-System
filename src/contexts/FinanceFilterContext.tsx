import { createContext, useContext, useState, ReactNode } from 'react'

interface FinanceFilters {
  semester: string
  campus: string
  program: string
  studentSearch: string
}

interface FinanceFilterContextType {
  filters: FinanceFilters
  setFilters: (filters: Partial<FinanceFilters>) => void
  resetFilters: () => void
}

const defaultFilters: FinanceFilters = {
  semester: 'Fall 2025',
  campus: 'All',
  program: 'All',
  studentSearch: ''
}

const FinanceFilterContext = createContext<FinanceFilterContextType | undefined>(undefined)

export function FinanceFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<FinanceFilters>(() => {
    const saved = localStorage.getItem('finance-global-filters')
    return saved ? JSON.parse(saved) : defaultFilters
  })

  const setFilters = (newFilters: Partial<FinanceFilters>) => {
    const updated = { ...filters, ...newFilters }
    setFiltersState(updated)
    localStorage.setItem('finance-global-filters', JSON.stringify(updated))
  }

  const resetFilters = () => {
    setFiltersState(defaultFilters)
    localStorage.removeItem('finance-global-filters')
  }

  return (
    <FinanceFilterContext.Provider value={{ filters, setFilters, resetFilters }}>
      {children}
    </FinanceFilterContext.Provider>
  )
}

export function useFinanceFilters() {
  const context = useContext(FinanceFilterContext)
  if (!context) {
    throw new Error('useFinanceFilters must be used within FinanceFilterProvider')
  }
  return context
}
