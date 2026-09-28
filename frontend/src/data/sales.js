const label = (offset) => {
  const d = new Date()
  d.setDate(d.getDate() - offset)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
}

export const salesTrend = [
  { day: label(6), revenue: 9240, orders: 34 },
  { day: label(5), revenue: 11870, orders: 41 },
  { day: label(4), revenue: 10240, orders: 38 },
  { day: label(3), revenue: 14320, orders: 49 },
  { day: label(2), revenue: 12760, orders: 44 },
  { day: label(1), revenue: 15980, orders: 55 },
  { day: label(0), revenue: 12450, orders: 48 },
]

export const hourlySales = [
  { hour: '7 AM', revenue: 420, orders: 6 },
  { hour: '9 AM', revenue: 1180, orders: 12 },
  { hour: '11 AM', revenue: 2340, orders: 19 },
  { hour: '1 PM', revenue: 1890, orders: 14 },
  { hour: '3 PM', revenue: 1420, orders: 11 },
  { hour: '5 PM', revenue: 2760, orders: 21 },
  { hour: '7 PM', revenue: 1420, orders: 9 },
  { hour: '9 PM', revenue: 1020, orders: 7 },
]

export const categorySales = [
  { name: 'Cakes', value: 38, revenue: 4731, tint: '#E8A17A' },
  { name: 'Breads', value: 21, revenue: 2615, tint: '#6B9A85' },
  { name: 'Brownies', value: 15, revenue: 1868, tint: '#553726' },
  { name: 'Pastries', value: 12, revenue: 1494, tint: '#DDA254' },
  { name: 'Beverages', value: 8, revenue: 995, tint: '#96BBA9' },
  { name: 'Cookies', value: 4, revenue: 498, tint: '#E9BC7C' },
  { name: 'Desserts', value: 2, revenue: 249, tint: '#F3BFA0' },
]

export const paymentMix = [
  { name: 'UPI', value: 46, amount: 5730, tint: '#6B9A85' },
  { name: 'Cash', value: 32, amount: 3984, tint: '#DDA254' },
  { name: 'Card', value: 22, amount: 2736, tint: '#E8A17A' },
]

export const revenueByRange = {
  Today: { revenue: 12450, orders: 48, growth: 12.4 },
  'This Week': { revenue: 86860, orders: 309, growth: 8.1 },
  'This Month': { revenue: 364280, orders: 1294, growth: 16.7 },
}

export const revenueSeriesByRange = {
  Today: salesTrend.map((s, i) => ({ label: ['7a', '9a', '11a', '1p', '3p', '5p', '7p', '9p'][i], revenue: hourlySales[i].revenue, orders: hourlySales[i].orders })),
  'This Week': salesTrend.map((s) => ({ label: s.day, revenue: s.revenue, orders: s.orders })),
  'This Month': [
    { label: 'W1', revenue: 84210, orders: 312 },
    { label: 'W2', revenue: 92740, orders: 341 },
    { label: 'W3', revenue: 88960, orders: 329 },
    { label: 'W4', revenue: 98370, orders: 312 },
  ],
}
