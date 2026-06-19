import React, { createContext, useContext, useMemo, useEffect } from 'react'
import type { Theme, ThemeConfig } from './types'
import { mergeTheme, generateCSSVariables } from './utils'
import { defaultTheme } from './defaultTheme'

interface ThemeContextValue {
  theme: Theme
  setTheme: (config: ThemeConfig) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

interface ThemeProviderProps {
  theme?: ThemeConfig
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ theme: customTheme, children }) => {
  const mergedTheme = useMemo(() => mergeTheme(customTheme), [customTheme])

  useEffect(() => {
    const variables = generateCSSVariables(mergedTheme)
    const root = document.documentElement
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }, [mergedTheme])

  const value = useMemo(
    () => ({
      theme: mergedTheme,
      setTheme: () => {},
    }),
    [mergedTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext)
  if (!context) {
    return defaultTheme
  }
  return context.theme
}
