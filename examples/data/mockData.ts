export interface Order {
  id: number
  orderNo: string
  customer: string
  product: string
  amount: number
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled'
  createTime: string
  region: string
}

const customers = ['张三科技', '李四贸易', '王五电子', '赵六服装', '钱七食品', '孙八建材', '周九化工', '吴十机械']
const products = ['笔记本电脑', '无线耳机', '智能手表', '机械键盘', '显示器', '鼠标', '打印机', '扫描仪']
const statuses: Order['status'][] = ['pending', 'processing', 'shipped', 'completed', 'cancelled']
const regions = ['华东', '华北', '华南', '西南', '西北', '东北', '华中']

function padZero(num: number, len = 2): string {
  return String(num).padStart(len, '0')
}

export function generateOrders(count: number): Order[] {
  const orders: Order[] = []

  for (let i = 1; i <= count; i++) {
    const month = Math.floor(Math.random() * 12) + 1
    const day = Math.floor(Math.random() * 28) + 1
    const hour = Math.floor(Math.random() * 24)
    const minute = Math.floor(Math.random() * 60)

    orders.push({
      id: i,
      orderNo: `ORD${2024}${padZero(month)}${padZero(day)}${padZero(i, 5)}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      product: products[Math.floor(Math.random() * products.length)],
      amount: Math.floor(Math.random() * 50000) + 1000,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createTime: `2024-${padZero(month)}-${padZero(day)} ${padZero(hour)}:${padZero(minute)}`,
      region: regions[Math.floor(Math.random() * regions.length)],
    })
  }

  return orders
}

export const statusMap: Record<Order['status'], { label: string; color: string }> = {
  pending: { label: '待付款', color: '#faad14' },
  processing: { label: '处理中', color: '#1677ff' },
  shipped: { label: '已发货', color: '#722ed1' },
  completed: { label: '已完成', color: '#52c41a' },
  cancelled: { label: '已取消', color: '#ff4d4f' },
}

export const regionOptions = regions.map((r) => ({ label: r, value: r }))

export const statusOptions = Object.entries(statusMap).map(([value, { label }]) => ({
  label,
  value,
}))
