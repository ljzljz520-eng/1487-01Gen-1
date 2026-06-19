import type { Theme, ThemeConfig } from './types'
import { defaultTheme } from './defaultTheme'

export function mergeTheme(customTheme: ThemeConfig = {}): Theme {
  return {
    colors: { ...defaultTheme.colors, ...customTheme.colors },
    borderRadius: { ...defaultTheme.borderRadius, ...customTheme.borderRadius },
    spacing: { ...defaultTheme.spacing, ...customTheme.spacing },
    fontSize: { ...defaultTheme.fontSize, ...customTheme.fontSize },
  }
}

export function generateCSSVariables(theme: Theme): Record<string, string> {
  const variables: Record<string, string> = {}

  Object.entries(theme.colors).forEach(([key, value]) => {
    variables[`--tak-color-${key}`] = value
  })

  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    variables[`--tak-radius-${key}`] = value
  })

  Object.entries(theme.spacing).forEach(([key, value]) => {
    variables[`--tak-spacing-${key}`] = value
  })

  Object.entries(theme.fontSize).forEach(([key, value]) => {
    variables[`--tak-font-size-${key}`] = value
  })

  return variables
}

export function applyThemeToElement(element: HTMLElement, theme: Theme): void {
  const variables = generateCSSVariables(theme)
  Object.entries(variables).forEach(([key, value]) => {
    element.style.setProperty(key, value)
  })
}
