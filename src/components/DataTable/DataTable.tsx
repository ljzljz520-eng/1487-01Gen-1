import React, { useState, useMemo } from 'react'
import './DataTable.css'

export type SortOrder = 'asc' | 'desc' | null

export interface Sorter {
  field: string
  order: SortOrder
}

export interface Column<T = any> {
  key: string
  title: string
  dataIndex?: keyof T
  width?: number | string
  align?: 'left' | 'center' | 'right'
  sorter?: boolean
  render?: (value: any, record: T, index: number) => React.ReactNode
  fixed?: 'left' | 'right'
  ellipsis?: boolean
}

export interface Pagination {
  current: number
  pageSize: number
  total: number
  onChange?: (page: number, pageSize: number) => void
  showSizeChanger?: boolean
  pageSizeOptions?: number[]
}

export interface DataTableProps<T = any> {
  columns: Column<T>[]
  dataSource: T[]
  rowKey?: keyof T | ((record: T) => string)
  loading?: boolean
  bordered?: boolean
  striped?: boolean
  pagination?: Pagination | false
  sorter?: Sorter | null
  onSorterChange?: (sorter: Sorter | null) => void
  rowSelection?: {
    selectedRowKeys: (string | number)[]
    onChange: (selectedRowKeys: (string | number)[], selectedRows: T[]) => void
  }
  emptyText?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  scroll?: {
    x?: number | string
    y?: number | string
  }
  onRowClick?: (record: T, index: number) => void
}

export function DataTable<T extends Record<string, any>>({
  columns,
  dataSource,
  rowKey = 'id',
  loading = false,
  bordered = false,
  striped = true,
  pagination = false,
  sorter: externalSorter,
  onSorterChange,
  rowSelection,
  emptyText = '暂无数据',
  className = '',
  style,
  scroll,
  onRowClick,
}: DataTableProps<T>) {
  const [internalSorter, setInternalSorter] = useState<Sorter | null>(null)

  const isControlled = externalSorter !== undefined
  const currentSorter = isControlled ? externalSorter : internalSorter

  const getRowKey = (record: T, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(record)
    }
    return record[rowKey] ?? index
  }

  const sortedData = useMemo(() => {
    if (!currentSorter?.order) {
      return dataSource
    }

    const { field, order } = currentSorter
    const column = columns.find((c) => c.key === field)
    const dataIndex = column?.dataIndex || (field as keyof T)

    return [...dataSource].sort((a, b) => {
      const aVal = a[dataIndex]
      const bVal = b[dataIndex]

      if (aVal === bVal) return 0
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return order === 'asc' ? aVal - bVal : bVal - aVal
      }

      const aStr = String(aVal)
      const bStr = String(bVal)
      return order === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
    })
  }, [dataSource, currentSorter, columns])

  const paginatedData = useMemo(() => {
    if (!pagination) {
      return sortedData
    }
    const { current, pageSize } = pagination
    const start = (current - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, pagination])

  const handleSort = (column: Column<T>) => {
    if (!column.sorter) return

    let newSorter: Sorter | null = null
    const currentOrder = currentSorter?.field === column.key ? currentSorter.order : null

    if (currentOrder === null) {
      newSorter = { field: column.key, order: 'asc' }
    } else if (currentOrder === 'asc') {
      newSorter = { field: column.key, order: 'desc' }
    } else {
      newSorter = null
    }

    if (!isControlled) {
      setInternalSorter(newSorter)
    }
    onSorterChange?.(newSorter)
  }

  const handleSelectAll = (checked: boolean) => {
    if (!rowSelection) return

    if (checked) {
      const allKeys = sortedData.map((record) => getRowKey(record, sortedData.indexOf(record)))
      const allRows = [...sortedData]
      rowSelection.onChange(allKeys, allRows)
    } else {
      rowSelection.onChange([], [])
    }
  }

  const handleSelectRow = (record: T, index: number, checked: boolean) => {
    if (!rowSelection) return

    const key = getRowKey(record, index)
    const { selectedRowKeys } = rowSelection

    let newKeys: (string | number)[]
    let newRows: T[]

    if (checked) {
      newKeys = [...selectedRowKeys, key]
      newRows = [...(rowSelection as any)._selectedRows || [], record]
    } else {
      newKeys = selectedRowKeys.filter((k) => k !== key)
      newRows = (rowSelection as any)._selectedRows?.filter(
        (r: T) => getRowKey(r, 0) !== key,
      ) || []
    }

    rowSelection.onChange(newKeys, newRows)
  }

  const isAllSelected = useMemo(() => {
    if (!rowSelection || sortedData.length === 0) return false
    return sortedData.every((record, index) =>
      rowSelection.selectedRowKeys.includes(getRowKey(record, index)),
    )
  }, [rowSelection, sortedData, getRowKey])

  const isIndeterminate = useMemo(() => {
    if (!rowSelection || sortedData.length === 0) return false
    const selectedCount = sortedData.filter((record, index) =>
      rowSelection.selectedRowKeys.includes(getRowKey(record, index)),
    ).length
    return selectedCount > 0 && selectedCount < sortedData.length
  }, [rowSelection, sortedData, getRowKey])

  const handlePageChange = (page: number) => {
    if (pagination && pagination.onChange) {
      pagination.onChange(page, pagination.pageSize)
    }
  }

  const handlePageSizeChange = (size: number) => {
    if (pagination && pagination.onChange) {
      pagination.onChange(1, size)
    }
  }

  const renderPagination = () => {
    if (!pagination) return null

    const { current, pageSize, total, showSizeChanger, pageSizeOptions = [10, 20, 50, 100] } = pagination
    const totalPages = Math.ceil(total / pageSize)

    const pages: (number | string)[] = []
    const maxVisiblePages = 7
    let startPage = Math.max(1, current - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) pages.push('...')
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }

    return (
      <div className="tak-table-pagination">
        <div className="tak-table-pagination-info">
          共 {total} 条数据
        </div>
        {showSizeChanger && (
          <select
            className="tak-table-page-size"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} 条/页
              </option>
            ))}
          </select>
        )}
        <div className="tak-table-pagination-pages">
          <button
            className="tak-page-btn"
            disabled={current === 1}
            onClick={() => handlePageChange(current - 1)}
          >
            上一页
          </button>
          {pages.map((page, idx) =>
            typeof page === 'number' ? (
              <button
                key={idx}
                className={`tak-page-btn ${page === current ? 'tak-page-btn-active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ) : (
              <span key={idx} className="tak-page-ellipsis">
                {page}
              </span>
            ),
          )}
          <button
            className="tak-page-btn"
            disabled={current === totalPages || totalPages === 0}
            onClick={() => handlePageChange(current + 1)}
          >
            下一页
          </button>
        </div>
      </div>
    )
  }

  const tableStyle: React.CSSProperties = {}
  if (scroll?.x) {
    tableStyle.width = typeof scroll.x === 'number' ? `${scroll.x}px` : scroll.x
    tableStyle.minWidth = '100%'
  }

  const bodyStyle: React.CSSProperties = {}
  if (scroll?.y) {
    bodyStyle.maxHeight = typeof scroll.y === 'number' ? `${scroll.y}px` : scroll.y
    bodyStyle.overflowY = 'auto'
  }

  return (
    <div
      className={`tak-data-table ${bordered ? 'tak-table-bordered' : ''} ${className}`}
      style={style}
    >
      {loading && (
        <div className="tak-table-loading">
          <div className="tak-table-loading-spinner" />
        </div>
      )}

      <div className="tak-table-scroll" style={{ overflowX: scroll?.x ? 'auto' : undefined }}>
        <table className="tak-table" style={tableStyle}>
          <thead className="tak-table-header">
            <tr>
              {rowSelection && (
                <th className="tak-table-cell tak-table-cell-checkbox" style={{ width: 48 }}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )}
              {columns.map((column) => {
                const isSorted = currentSorter?.field === column.key
                const sortOrder = isSorted ? currentSorter?.order : null

                return (
                  <th
                    key={column.key}
                    className={`tak-table-cell tak-table-header-cell ${
                      column.sorter ? 'tak-table-cell-sortable' : ''
                    } ${column.align ? `tak-table-align-${column.align}` : ''}`}
                    style={{ width: column.width }}
                    onClick={() => handleSort(column)}
                  >
                    <span className="tak-table-cell-content">
                      {column.title}
                      {column.sorter && (
                        <span className="tak-table-sorter">
                          <span
                            className={`tak-sorter-icon tak-sorter-up ${
                              sortOrder === 'asc' ? 'tak-sorter-active' : ''
                            }`}
                          >
                            ↑
                          </span>
                          <span
                            className={`tak-sorter-icon tak-sorter-down ${
                              sortOrder === 'desc' ? 'tak-sorter-active' : ''
                            }`}
                          >
                            ↓
                          </span>
                        </span>
                      )}
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="tak-table-body" style={bodyStyle}>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  className="tak-table-cell tak-table-empty"
                  colSpan={columns.length + (rowSelection ? 1 : 0)}
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              paginatedData.map((record, index) => {
                const rowIndex = (pagination ? (pagination.current - 1) * pagination.pageSize : 0) + index
                const key = getRowKey(record, rowIndex)
                const isSelected = rowSelection?.selectedRowKeys.includes(key)

                return (
                  <tr
                    key={key}
                    className={`tak-table-row ${
                      striped && index % 2 === 1 ? 'tak-table-row-striped' : ''
                    } ${isSelected ? 'tak-table-row-selected' : ''} ${
                      onRowClick ? 'tak-table-row-clickable' : ''
                    }`}
                    onClick={() => onRowClick?.(record, rowIndex)}
                  >
                    {rowSelection && (
                      <td className="tak-table-cell tak-table-cell-checkbox">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleSelectRow(record, rowIndex, e.target.checked)}
                        />
                      </td>
                    )}
                    {columns.map((column) => {
                      const dataIndex = column.dataIndex || (column.key as keyof T)
                      const value = record[dataIndex]
                      const cellContent = column.render
                        ? column.render(value, record, rowIndex)
                        : value

                      return (
                        <td
                          key={column.key}
                          className={`tak-table-cell ${
                            column.align ? `tak-table-align-${column.align}` : ''
                          } ${column.ellipsis ? 'tak-table-cell-ellipsis' : ''}`}
                          style={{ width: column.width }}
                          title={column.ellipsis && typeof cellContent === 'string' ? cellContent : undefined}
                        >
                          {cellContent}
                        </td>
                      )
                    })}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {renderPagination()}
    </div>
  )
}
