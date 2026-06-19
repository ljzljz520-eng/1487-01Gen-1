# Table Analytics Kit

一套可复用的 React 表格分析组件库，包含表格、筛选条、指标卡和导出按钮，支持主题颜色定制。

## ✨ 特性

- 🎨 **主题定制** - 通过 CSS 变量实现主题色配置，轻松适配不同项目
- 📊 **数据表格** - 支持排序、分页、行选择、自定义渲染等功能
- 🔍 **筛选条** - 内置输入框、下拉、日期、日期范围等多种筛选类型
- 📈 **指标卡** - 展示关键业务指标，支持趋势指示
- 📤 **导出按钮** - 支持 CSV、JSON 等多种格式导出
- 📦 **开箱即用** - TypeScript 编写，类型友好
- 🌳 **按需加载** - 支持 Tree Shaking

## 📦 安装

```bash
npm install table-analytics-kit
```

或使用 yarn / pnpm：

```bash
yarn add table-analytics-kit
pnpm add table-analytics-kit
```

## 🚀 快速开始

### 1. 引入样式

在项目入口文件中引入组件库样式：

```tsx
import 'table-analytics-kit/dist/style.css'
```

### 2. 使用组件

```tsx
import { ThemeProvider, DataTable, FilterBar, MetricCard, ExportButton } from 'table-analytics-kit'

function App() {
  return (
    <ThemeProvider>
      <div>
        <MetricCard title="订单总数" value={1234} trend="up" trendValue="12.5%" />
        <FilterBar filters={filters} values={values} onChange={handleChange} onSearch={handleSearch} />
        <DataTable columns={columns} dataSource={data} pagination={pagination} />
        <ExportButton options={exportOptions} />
      </div>
    </ThemeProvider>
  )
}
```

### 3. 主题定制

通过 `ThemeProvider` 的 `theme` 属性自定义主题色：

```tsx
import { ThemeProvider } from 'table-analytics-kit'

const customTheme = {
  colors: {
    primary: '#52c41a',
    primaryHover: '#73d13d',
    primaryLight: '#f6ffed',
  },
}

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      {/* 你的应用 */}
    </ThemeProvider>
  )
}
```

也可以直接修改 CSS 变量：

```css
:root {
  --tak-color-primary: #52c41a;
  --tak-color-primary-hover: #73d13d;
  --tak-color-primary-light: #f6ffed;
}
```

## 📖 组件文档

### MetricCard 指标卡

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | - | 标题 |
| value | string \| number | - | 数值 |
| prefix | ReactNode | - | 数值前缀 |
| suffix | ReactNode | - | 数值后缀 |
| trend | 'up' \| 'down' \| 'none' | 'none' | 趋势方向 |
| trendValue | string | - | 趋势数值 |
| description | string | - | 描述文案 |
| footer | ReactNode | - | 底部内容 |
| onClick | () => void | - | 点击事件 |

### FilterBar 筛选条

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| filters | FilterConfig[] | - | 筛选配置数组 |
| values | FilterValues | - | 筛选值 |
| onChange | (values) => void | - | 值变化回调 |
| onSearch | () => void | - | 查询按钮回调 |
| onReset | () => void | - | 重置按钮回调 |
| showSearch | boolean | true | 是否显示查询按钮 |
| showReset | boolean | true | 是否显示重置按钮 |

**FilterConfig 类型：**

```typescript
interface FilterConfig {
  key: string
  label: string
  type: 'input' | 'select' | 'date' | 'dateRange'
  placeholder?: string
  options?: { label: string; value: string | number }[]
  width?: number | string
}
```

### DataTable 数据表格

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| columns | Column[] | - | 列配置 |
| dataSource | T[] | - | 数据源 |
| rowKey | string \| (record) => string | 'id' | 行唯一标识 |
| bordered | boolean | false | 是否显示边框 |
| striped | boolean | true | 是否显示斑马纹 |
| pagination | Pagination \| false | false | 分页配置 |
| sorter | Sorter \| null | - | 排序状态（受控） |
| onSorterChange | (sorter) => void | - | 排序变化回调 |
| rowSelection | object | - | 行选择配置 |
| loading | boolean | false | 加载状态 |
| emptyText | ReactNode | '暂无数据' | 空数据文案 |
| scroll | { x?: number, y?: number } | - | 滚动配置 |
| onRowClick | (record, index) => void | - | 行点击事件 |

### ExportButton 导出按钮

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| options | ExportOption[] | - | 导出选项 |
| text | string | '导出' | 按钮文字 |
| type | 'primary' \| 'default' | 'default' | 按钮类型 |
| onExport | (option) => void | - | 导出回调 |

**内置导出工具函数：**

```typescript
import { exportToCSV, exportToJSON } from 'table-analytics-kit'

// 导出 CSV
exportToCSV(data, columns, 'filename.csv')

// 导出 JSON
exportToJSON(data, 'filename.json')
```

## 🔧 开发

### 安装依赖

```bash
npm install
```

### 启动示例站

```bash
npm run dev
```

访问 http://localhost:3000 查看示例。

### 构建组件库

```bash
npm run build:lib
```

构建产物将输出到 `dist` 目录，包含：
- `index.esm.js` - ES Module 格式
- `index.cjs.js` - CommonJS 格式
- `index.d.ts` - TypeScript 类型声明
- `style.css` - 样式文件

### 构建示例站

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## 📤 发布到 npm

### 1. 构建

```bash
npm run build:lib
```

### 2. 登录 npm

```bash
npm login
```

### 3. 发布

```bash
npm publish
```

### 发布前检查清单

- [ ] 更新 `package.json` 中的版本号
- [ ] 运行 `npm run build:lib` 确保构建成功
- [ ] 运行 `npm run lint` 确保代码无错误
- [ ] 更新 README 文档（如有必要）
- [ ] 检查 `package.json` 中的 `files` 字段是否包含所有需要发布的文件

### 版本号规范

遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)：

- **主版本号 (Major)**：不兼容的 API 修改
- **次版本号 (Minor)**：向下兼容的功能性新增
- **修订号 (Patch)**：向下兼容的问题修正

## 📁 项目结构

```
├── src/                     # 组件库源码
│   ├── components/          # 组件
│   │   ├── DataTable/       # 数据表格
│   │   ├── FilterBar/       # 筛选条
│   │   ├── MetricCard/      # 指标卡
│   │   └── ExportButton/    # 导出按钮
│   ├── theme/               # 主题系统
│   ├── styles/              # 全局样式
│   └── index.ts             # 入口文件
├── examples/                # 示例站
│   ├── App.tsx
│   ├── main.tsx
│   └── index.html
├── dist/                    # 构建产物
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 📄 License

MIT
