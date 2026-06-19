export interface ThemeColors {
  primary: string
  primaryHover: string
  primaryLight: string
  success: string
  warning: string
  error: string
  text: string
  textSecondary: string
  textDisabled: string
  background: string
  backgroundSecondary: string
  border: string
  borderHover: string
  shadow: string
}

export interface Theme {
  colors: ThemeColors
  borderRadius: {
    sm: string
    md: string
    lg: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  fontSize: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
}

export type ThemeConfig = Partial<Theme>
