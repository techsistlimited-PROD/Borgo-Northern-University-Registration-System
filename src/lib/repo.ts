type Listener<T> = (data: T[]) => void

class Repository {
  private listeners: Map<string, Set<Listener<any>>> = new Map()

  get<T>(key: string): T[] {
    const data = localStorage.getItem(`nu-erp-${key}`)
    return data ? JSON.parse(data) : []
  }

  set<T>(key: string, data: T[]): void {
    localStorage.setItem(`nu-erp-${key}`, JSON.stringify(data))
    this.notify(key, data)
  }

  add<T extends { id: string | number }>(key: string, item: T): void {
    const items = this.get<T>(key)
    items.push(item)
    this.set(key, items)
  }

  update<T extends { id: string | number }>(key: string, id: string | number, updates: Partial<T>): void {
    const items = this.get<T>(key)
    const index = items.findIndex(item => item.id === id)
    if (index !== -1) {
      items[index] = { ...items[index], ...updates }
      this.set(key, items)
    }
  }

  delete(key: string, id: string | number): void {
    const items = this.get<any>(key)
    const filtered = items.filter((item: any) => item.id !== id)
    this.set(key, filtered)
  }

  subscribe<T>(key: string, listener: Listener<T>): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set())
    }
    this.listeners.get(key)!.add(listener)

    return () => {
      const listeners = this.listeners.get(key)
      if (listeners) {
        listeners.delete(listener)
      }
    }
  }

  private notify<T>(key: string, data: T[]): void {
    const listeners = this.listeners.get(key)
    if (listeners) {
      listeners.forEach(listener => listener(data))
    }
  }

  clear(): void {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('nu-erp-'))
    keys.forEach(k => localStorage.removeItem(k))
    this.listeners.clear()
  }

  clearKey(key: string): void {
    localStorage.removeItem(`nu-erp-${key}`)
    this.notify(key, [])
  }
}

export const Repo = new Repository()
