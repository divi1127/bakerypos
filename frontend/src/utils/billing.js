import { BRAND } from '../config/brand'

const round = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100

export function lineTotal(item) {
  return round(item.price * item.qty)
}

export function cartSubtotal(items) {
  return round(items.reduce((sum, item) => sum + lineTotal(item), 0))
}

export function cartCount(items) {
  return items.reduce((sum, item) => sum + item.qty, 0)
}

export function computeTotals(items, discount = 0, taxRate = BRAND.taxRate, roundOff = false) {
  const subtotal = cartSubtotal(items)
  const cappedDiscount = round(Math.min(Math.max(discount, 0), subtotal))
  const taxable = round(subtotal - cappedDiscount)
  const tax = round(taxable * taxRate)
  const rawTotal = round(taxable + tax)
  const total = roundOff ? roundToNearest(rawTotal, 10) : rawTotal
  return { subtotal, discount: cappedDiscount, tax, total, taxRate, roundOff: round(total - rawTotal) }
}

export function computeChange(received, total) {
  return round(Number(received || 0) - Number(total || 0))
}

export function nextBillNumber(counter) {
  return `${BRAND.billPrefix}-${counter}`
}

export function buildBillNumber(counter) {
  return `${BRAND.billPrefix}-${counter}`
}

export function roundToNearest(value, step = 10) {
  return round(Math.round(value / step) * step)
}

export function averageBill(orders) {
  const completed = orders.filter((o) => o.status === 'Completed')
  if (!completed.length) return 0
  return round(completed.reduce((s, o) => s + o.total, 0) / completed.length)
}

export function totalItems(order) {
  return order.items.reduce((s, i) => s + i.qty, 0)
}

export function formatDateTime(value) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatTime(value) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

export function formatDate(value) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function isToday(value) {
  const d = new Date(value)
  const now = new Date()
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  )
}

export function relativeDay(value) {
  const d = new Date(value)
  const now = new Date()
  const startOf = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime()
  const diff = Math.round((startOf(now) - startOf(d)) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff} days ago`
  return formatDate(value)
}
