import React, { useState, useRef, useEffect } from 'react'
import './ExportButton.css'

export interface ExportOption {
  key: string
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}

export interface ExportButtonProps {
  options: ExportOption[]
  text?: string
  icon?: React.ReactNode
  type?: 'primary' | 'default'
  disabled?: boolean
  loading?: boolean
  onExport?: (option: ExportOption) => void
  className?: string
  style?: React.CSSProperties
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  options,
  text = '导出',
  icon = '↓',
  type = 'default',
  disabled = false,
  loading = false,
  onExport,
  className = '',
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = () => {
    if (!disabled && !loading) {
      setIsOpen(!isOpen)
    }
  }

  const handleOptionClick = (option: ExportOption) => {
    if (option.disabled) return

    setIsOpen(false)
    option.onClick?.()
    onExport?.(option)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleToggle()
    }
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div
      ref={containerRef}
      className={`tak-export-button ${className}`}
      style={style}
    >
      <button
        className={`tak-btn tak-btn-${type} tak-export-btn ${isOpen ? 'tak-export-btn-open' : ''}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled || loading}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {loading ? (
          <span className="tak-export-loading" />
        ) : (
          <span className="tak-export-icon">{icon}</span>
        )}
        <span>{text}</span>
        <span className={`tak-export-caret ${isOpen ? 'tak-export-caret-open' : ''}`}>
          ▾
        </span>
      </button>

      {isOpen && (
        <div className="tak-export-dropdown" role="listbox">
          {options.map((option) => (
            <div
              key={option.key}
              className={`tak-export-option ${option.disabled ? 'tak-export-option-disabled' : ''}`}
              onClick={() => handleOptionClick(option)}
              role="option"
              aria-disabled={option.disabled}
            >
              {option.icon && <span className="tak-export-option-icon">{option.icon}</span>}
              <span className="tak-export-option-label">{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const exportToCSV = <T extends Record<string, any>>(
  data: T[],
  columns: { key: string; title: string; dataIndex?: keyof T }[],
  filename = 'export.csv',
) => {
  const headers = columns.map((col) => col.title).join(',')
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const dataIndex = col.dataIndex || (col.key as keyof T)
        const value = row[dataIndex]
        const str = value !== undefined && value !== null ? String(value) : ''
        return `"${str.replace(/"/g, '""')}"`
      })
      .join(','),
  )

  const csvContent = [headers, ...rows].join('\n')
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const exportToJSON = <T extends Record<string, any>>(
  data: T[],
  filename = 'export.json',
) => {
  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
