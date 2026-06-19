import React from 'react'
import './MetricCard.css'

export type TrendType = 'up' | 'down' | 'none'

export interface MetricCardProps {
  title: string
  value: string | number
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  trend?: TrendType
  trendValue?: string
  description?: string
  footer?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  trend = 'none',
  trendValue,
  description,
  footer,
  className = '',
  style,
  onClick,
}) => {
  const trendIcon = {
    up: '↑',
    down: '↓',
    none: '',
  }[trend]

  return (
    <div
      className={`tak-metric-card ${className}`}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="tak-metric-card-header">
        <span className="tak-metric-card-title">{title}</span>
      </div>
      <div className="tak-metric-card-body">
        <div className="tak-metric-card-value">
          {prefix && <span className="tak-metric-card-prefix">{prefix}</span>}
          <span className="tak-metric-card-number">{value}</span>
          {suffix && <span className="tak-metric-card-suffix">{suffix}</span>}
        </div>
        {trendValue && (
          <div className={`tak-metric-card-trend tak-metric-card-trend-${trend}`}>
            <span className="tak-metric-card-trend-icon">{trendIcon}</span>
            <span className="tak-metric-card-trend-value">{trendValue}</span>
          </div>
        )}
      </div>
      {description && <div className="tak-metric-card-description">{description}</div>}
      {footer && <div className="tak-metric-card-footer">{footer}</div>}
    </div>
  )
}
