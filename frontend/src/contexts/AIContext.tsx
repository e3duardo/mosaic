import { createContext, useContext, useState, type ReactNode } from 'react'

type AIContextValue = {
  useAI: boolean
  setUseAI: (v: boolean) => void
}

const AIContext = createContext<AIContextValue | null>(null)

export function AIProvider({ children }: { children: ReactNode }) {
  const [useAI, setUseAI] = useState(true)
  return (
    <AIContext.Provider value={{ useAI, setUseAI }}>
      {children}
    </AIContext.Provider>
  )
}

export function useAI() {
  const ctx = useContext(AIContext)
  if (!ctx) return { useAI: true, setUseAI: () => {} }
  return ctx
}
