import React from 'react'

export interface FilterOption {
  label: string
  value: string | number
}

export type FilterType = 'input' | 'select' | 'date' | 'dateRange'

export interface FilterConfig {
  key: string
  label: string
  type: FilterType
  placeholder?: string
  options?: FilterOption[]
  width?: number | string
}

export interface FilterValues {
  [key: string]: any
}

export interface FilterBarProps {
  filters: FilterConfig[]
  values: FilterValues
  onChange: (values: FilterValues) => void
  onSearch?: () => void
  onReset?: () => void
  showSearch?: boolean
  showReset?: boolean
  searchText?: string
  resetText?: string
  className?: string
  style?: React.CSSProperties
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  values,
  onChange,
  onSearch,
  onReset,
  showSearch = true,
  showReset = true,
  searchText = '查询',
  resetText = '重置',
  className = '',
  style,
}) => {
  const handleValueChange = (key: string, value: any) => {
    onChange({ ...values, [key]: value })
  }

  const handleReset = () => {
    const resetValues: FilterValues = {}
    filters.forEach((filter) => {
      resetValues[filter.key] = ''
    })
    onChange(resetValues)
    onReset?.()
  }

  const handleSearch = () => {
    onSearch?.()
  }

  const renderFilterItem = (filter: FilterConfig) => {
    const value = values[filter.key] ?? ''
    const inputStyle: React.CSSProperties = {
      width: filter.width || 200,
    }

    switch (filter.type) {
      case 'input':
        return (
          <input
            type="text"
            className="tak-filter-input"
            placeholder={filter.placeholder}
            value={value}
            style={inputStyle}
            onChange={(e) => handleValueChange(filter.key, e.target.value)}
          />
        )

      case 'select':
        return (
          <select
            className="tak-filter-select"
            value={value}
            style={inputStyle}
            onChange={(e) => handleValueChange(filter.key, e.target.value)}
          >
            <option value="">{filter.placeholder || '请选择'}</option>
            {filter.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )

      case 'date':
        return (
          <input
            type="date"
            className="tak-filter-input"
            value={value}
            style={inputStyle}
            onChange={(e) => handleValueChange(filter.key, e.target.value)}
          />
        )

      case 'dateRange':
        return (
          <div className="tak-filter-date-range" style={inputStyle}>
            <input
              type="date"
              className="tak-filter-input"
              value={value?.[0] || ''}
              onChange={(e) =>
                handleValueChange(filter.key, [e.target.value, value?.[1] || ''])
              }
            />
            <span className="tak-filter-date-range-sep">至</span>
            <input
              type="date"
              className="tak-filter-input"
              value={value?.[1] || ''}
              onChange={(e) =>
                handleValueChange(filter.key, [value?.[0] || '', e.target.value])
              }
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`tak-filter-bar ${className}`} style={style}>
      <div className="tak-filter-bar-filters">
        {filters.map((filter) => (
          <div key={filter.key} className="tak-filter-item">
            <label className="tak-filter-label">{filter.label}：</label>
            {renderFilterItem(filter)}
          </div>
        ))}
      </div>
      <div className="tak-filter-bar-actions">
        {showSearch && (
          <button className="tak-btn tak-btn-primary" onClick={handleSearch}>
            {searchText}
          </button>
        )}
        {showReset && (
          <button className="tak-btn tak-btn-default" onClick={handleReset}>
            {resetText}
          </button>
        )}
      </div>
    </div>
  )
}
