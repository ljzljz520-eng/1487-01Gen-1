import { useState, useMemo } from 'react'
import {
  ThemeProvider,
  MetricCard,
  FilterBar,
  DataTable,
  ExportButton,
  exportToCSV,
  exportToJSON,
  type FilterValues,
  type Column,
  type Pagination,
  type Sorter,
  type ThemeConfig,
} from '../src'
import { generateOrders, statusMap, regionOptions, statusOptions, type Order } from './data/mockData'
import './App.css'

const themePresets: Record<string, ThemeConfig> = {
  default: {
    colors: {
      primary: '#1677ff',
      primaryHover: '#4096ff',
      primaryLight: '#e6f4ff',
    },
  },
  green: {
    colors: {
      primary: '#52c41a',
      primaryHover: '#73d13d',
      primaryLight: '#f6ffed',
    },
  },
  purple: {
    colors: {
      primary: '#722ed1',
      primaryHover: '#9254de',
      primaryLight: '#f9f0ff',
    },
  },
  orange: {
    colors: {
      primary: '#fa8c16',
      primaryHover: '#ffa940',
      primaryLight: '#fff7e6',
    },
  },
}

function App() {
  const [themeKey, setThemeKey] = useState<string>('default')
  const allData = useMemo(() => generateOrders(86), [])

  const [filterValues, setFilterValues] = useState<FilterValues>({
    keyword: '',
    status: '',
    region: '',
    dateRange: ['', ''],
  })

  const [appliedFilters, setAppliedFilters] = useState<FilterValues>(filterValues)

  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: [5, 10, 20, 50],
  })

  const [sorter, setSorter] = useState<Sorter | null>(null)

  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([])
  const [selectedRows, setSelectedRows] = useState<Order[]>([])

  const filteredData = useMemo(() => {
    return allData.filter((item) => {
      if (appliedFilters.keyword) {
        const keyword = String(appliedFilters.keyword).toLowerCase()
        if (
          !item.orderNo.toLowerCase().includes(keyword) &&
          !item.customer.toLowerCase().includes(keyword) &&
          !item.product.toLowerCase().includes(keyword)
        ) {
          return false
        }
      }
      if (appliedFilters.status && item.status !== appliedFilters.status) {
        return false
      }
      if (appliedFilters.region && item.region !== appliedFilters.region) {
        return false
      }
      if (appliedFilters.dateRange?.[0] && item.createTime < appliedFilters.dateRange[0]) {
        return false
      }
      if (appliedFilters.dateRange?.[1] && item.createTime > appliedFilters.dateRange[1] + ' 23:59:59') {
        return false
      }
      return true
    })
  }, [allData, appliedFilters])

  const displayData = useMemo(() => {
    const { current, pageSize } = pagination
    const start = (current - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, pagination])

  const stats = useMemo(() => {
    const total = filteredData.length
    const totalAmount = filteredData.reduce((sum, item) => sum + item.amount, 0)
    const completed = filteredData.filter((item) => item.status === 'completed').length
    const pending = filteredData.filter((item) => item.status === 'pending').length
    return { total, totalAmount, completed, pending }
  }, [filteredData])

  const columns: Column<Order>[] = [
    {
      key: 'id',
      title: '序号',
      dataIndex: 'id',
      width: 80,
      align: 'center',
    },
    {
      key: 'orderNo',
      title: '订单号',
      dataIndex: 'orderNo',
      width: 180,
      ellipsis: true,
      sorter: true,
    },
    {
      key: 'customer',
      title: '客户名称',
      dataIndex: 'customer',
      width: 140,
      sorter: true,
    },
    {
      key: 'product',
      title: '产品',
      dataIndex: 'product',
      width: 120,
    },
    {
      key: 'amount',
      title: '金额',
      dataIndex: 'amount',
      width: 120,
      align: 'right',
      sorter: true,
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      render: (value: Order['status']) => {
        const info = statusMap[value]
        return (
          <span
            className="status-tag"
            style={{
              background: info.color + '15',
              color: info.color,
              border: `1px solid ${info.color}30`,
            }}
          >
            {info.label}
          </span>
        )
      },
    },
    {
      key: 'region',
      title: '地区',
      dataIndex: 'region',
      width: 100,
    },
    {
      key: 'createTime',
      title: '创建时间',
      dataIndex: 'createTime',
      width: 160,
      sorter: true,
    },
    {
      key: 'action',
      title: '操作',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <div className="action-links">
          <span className="action-link" onClick={() => alert(`查看订单: ${record.orderNo}`)}>
            查看
          </span>
          <span className="action-link" onClick={() => alert(`编辑订单: ${record.orderNo}`)}>
            编辑
          </span>
        </div>
      ),
    },
  ]

  const filterConfigs = [
    {
      key: 'keyword',
      label: '关键词',
      type: 'input' as const,
      placeholder: '订单号/客户/产品',
      width: 220,
    },
    {
      key: 'status',
      label: '订单状态',
      type: 'select' as const,
      options: statusOptions,
      width: 150,
    },
    {
      key: 'region',
      label: '地区',
      type: 'select' as const,
      options: regionOptions,
      width: 120,
    },
    {
      key: 'dateRange',
      label: '创建时间',
      type: 'dateRange' as const,
      width: 280,
    },
  ]

  const handleSearch = () => {
    setAppliedFilters(filterValues)
    setPagination((prev) => ({ ...prev, current: 1, total: 0 }))
  }

  const handleReset = () => {
    const resetValues: FilterValues = {
      keyword: '',
      status: '',
      region: '',
      dateRange: ['', ''],
    }
    setFilterValues(resetValues)
    setAppliedFilters(resetValues)
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
    }))
  }

  const handleExportCSV = () => {
    exportToCSV(
      selectedRows.length > 0 ? selectedRows : filteredData,
      columns.filter((c) => c.dataIndex),
      `订单数据_${new Date().toISOString().slice(0, 10)}.csv`,
    )
  }

  const handleExportJSON = () => {
    exportToJSON(
      selectedRows.length > 0 ? selectedRows : filteredData,
      `订单数据_${new Date().toISOString().slice(0, 10)}.json`,
    )
  }

  const exportOptions = [
    { key: 'csv', label: '导出 CSV', icon: '📊', onClick: handleExportCSV },
    { key: 'json', label: '导出 JSON', icon: '📋', onClick: handleExportJSON },
    {
      key: 'selected',
      label: `导出选中 (${selectedRowKeys.length})`,
      icon: '✅',
      disabled: selectedRowKeys.length === 0,
      onClick: () => {
        exportToCSV(selectedRows, columns.filter((c) => c.dataIndex), '选中订单.csv')
      },
    },
  ]

  return (
    <ThemeProvider theme={themePresets[themeKey]}>
      <div className="demo-app">
        <header className="demo-header">
          <div className="demo-header-content">
            <div>
              <h1 className="demo-title">Table Analytics Kit</h1>
              <p className="demo-subtitle">可复用的表格分析组件库 · 支持主题定制</p>
            </div>
            <div className="theme-switcher">
              <span className="theme-label">主题色：</span>
              <div className="theme-options">
                {Object.entries(themePresets).map(([key, config]) => (
                  <button
                    key={key}
                    className={`theme-option ${themeKey === key ? 'theme-option-active' : ''}`}
                    style={{ background: config.colors?.primary }}
                    onClick={() => setThemeKey(key)}
                    title={key}
                  />
                ))}
              </div>
            </div>
          </div>
        </header>

        <main className="demo-main">
          <section className="demo-section">
            <h2 className="section-title">📈 指标卡</h2>
            <p className="section-desc">展示关键业务指标，支持趋势指示</p>
            <div className="metric-grid">
              <MetricCard
                title="订单总数"
                value={stats.total}
                suffix="单"
                trend="up"
                trendValue="12.5%"
                description="较上周"
                onClick={() => console.log('点击订单总数')}
              />
              <MetricCard
                title="交易总额"
                value={stats.totalAmount.toLocaleString()}
                prefix="¥"
                trend="up"
                trendValue="8.3%"
                description="较上周"
              />
              <MetricCard
                title="已完成"
                value={stats.completed}
                suffix="单"
                trend="up"
                trendValue="15.2%"
                description="完成率"
              />
              <MetricCard
                title="待处理"
                value={stats.pending}
                suffix="单"
                trend="down"
                trendValue="5.1%"
                description="较昨日"
              />
            </div>
          </section>

          <section className="demo-section">
            <h2 className="section-title">🔍 筛选条</h2>
            <p className="section-desc">支持输入框、下拉、日期等多种筛选类型</p>
            <FilterBar
              filters={filterConfigs}
              values={filterValues}
              onChange={setFilterValues}
              onSearch={handleSearch}
              onReset={handleReset}
            />
          </section>

          <section className="demo-section">
            <div className="table-header">
              <div>
                <h2 className="section-title">📊 数据表格</h2>
                <p className="section-desc">支持排序、分页、行选择、自定义渲染</p>
              </div>
              <ExportButton
                options={exportOptions}
                text="导出"
                type="primary"
                onExport={(opt) => console.log('导出:', opt.key)}
              />
            </div>

            {selectedRowKeys.length > 0 && (
              <div className="selection-tip">
                已选择 <strong>{selectedRowKeys.length}</strong> 条数据
                <button className="clear-selection" onClick={() => {
                  setSelectedRowKeys([])
                  setSelectedRows([])
                }}>
                  清空选择
                </button>
              </div>
            )}

            <DataTable<Order>
              columns={columns}
              dataSource={filteredData}
              rowKey="id"
              bordered
              striped
              rowSelection={{
                selectedRowKeys,
                onChange: (keys, rows) => {
                  setSelectedRowKeys(keys)
                  setSelectedRows(rows)
                },
              }}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: filteredData.length,
                showSizeChanger: true,
                pageSizeOptions: [5, 10, 20, 50],
                onChange: handlePageChange,
              }}
              sorter={sorter}
              onSorterChange={setSorter}
              scroll={{ x: 1200 }}
              onRowClick={(record) => console.log('点击行:', record)}
            />
          </section>

          <section className="demo-section">
            <h2 className="section-title">📦 快速上手</h2>
            <div className="usage-cards">
              <div className="usage-card">
                <h3>安装</h3>
                <pre className="code-block">npm install table-analytics-kit</pre>
              </div>
              <div className="usage-card">
                <h3>引入组件</h3>
                <pre className="code-block">{`import {
  ThemeProvider,
  DataTable,
  FilterBar,
  MetricCard,
  ExportButton,
} from 'table-analytics-kit'
import 'table-analytics-kit/dist/style.css'`}</pre>
              </div>
              <div className="usage-card">
                <h3>主题定制</h3>
                <pre className="code-block">{`<ThemeProvider theme={{
  colors: {
    primary: '#52c41a',
  },
}}>
  <App />
</ThemeProvider>`}</pre>
              </div>
            </div>
          </section>
        </main>

        <footer className="demo-footer">
          <p>Table Analytics Kit v1.0.0 · 基于 React + TypeScript + Vite 构建</p>
        </footer>
      </div>
    </ThemeProvider>
  )
}

export default App
