import type { Theme } from './types'

export const defaultTheme: Theme = {
  colors: {
    primary: '#1677ff',
    primaryHover: '#4096ff',
    primaryLight: '#e6f4ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    text: '#1f2937',
    textSecondary: '#6b7280',
    textDisabled: '#9ca3af',
    background: '#ffffff',
    backgroundSecondary: '#f9fafb',
    border: '#e5e7eb',
    borderHover: '#d1d5db',
    shadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  fontSize: {
    xs: '12px',
    sm: '13px',
    md: '14px',
    lg: '16px',
    xl: '20px',
  },
}
