import { motion } from 'framer-motion'
import {
  BadgeIndianRupee,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  Receipt,
  Search,
  XCircle,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Drawer from '../components/Drawer'
import EmptyState from '../components/EmptyState'
import { PrintButton, PrintSizePicker } from '../components/PrintControls'
import ReceiptView from '../components/Receipt'
import StatusBadge from '../components/StatusBadge'
import { TableSkeleton } from '../components/Skeleton'
import { CURRENCY } from '../config/brand'
import { useApp } from '../context/AppContext'
import { formatDate, formatDateTime, formatTime, totalItems } from '../utils/billing'

const FILTERS = ['All', 'Completed', 'Pending', 'Cancelled']

export default function Orders() {
  const { orders, updateOrderStatus, pushToast } = useApp()
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 620)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter((o) => {
      const fOk = filter === 'All' || o.status === filter
      const qOk = !q || o.billNo.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.payment.toLowerCase().includes(q)
      return fOk && qOk
    })
  }, [orders, filter, query])

  const counts = useMemo(
    () => ({
      All: orders.length,
      Completed: orders.filter((o) => o.status === 'Completed').length,
      Pending: orders.filter((o) => o.status === 'Pending').length,
      Cancelled: orders.filter((o) => o.status === 'Cancelled').length,
    }),
    [orders],
  )

  const revenue = useMemo(
    () => orders.filter((o) => o.status === 'Completed').reduce((s, o) => s + o.total, 0),
    [orders],
  )

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card flex items-center gap-3 p-4">
              <div className="skeleton h-5 w-5 rounded-md" />
              <div className="space-y-2">
                <div className="skeleton h-2.5 w-16" />
                <div className="skeleton h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
        <div className="card overflow-hidden">
          <TableSkeleton rows={8} cols={7} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-10">
        <EmptyState
          variant="error"
          title="Something went wrong"
          message="The order list failed to load. Your saved bills are still safe in this browser."
          actionLabel="Try Again"
          onAction={() => {
            setError(false)
            setLoading(true)
            window.setTimeout(() => setLoading(false), 600)
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-chocolate-800 dark:text-cream-100">
            Orders
          </h1>
          <p className="mt-0.5 text-sm text-chocolate-400 dark:text-chocolate-300">
            {counts.All} bills · {CURRENCY(revenue)} collected
          </p>
        </div>
        <button type="button" onClick={() => window.print()} className="btn-ghost px-3.5 py-2.5 text-[13px]">
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Total Bills', value: counts.All, icon: Receipt, tone: 'text-chocolate-600 dark:text-caramel-300' },
          { label: 'Completed', value: counts.Completed, icon: CheckCircle2, tone: 'text-sage-600 dark:text-sage-300' },
          { label: 'Pending', value: counts.Pending, icon: Clock3, tone: 'text-caramel-600 dark:text-caramel-300' },
          { label: 'Revenue', value: revenue, prefix: '₹', icon: BadgeIndianRupee, tone: 'text-peach-500 dark:text-peach-300' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="card flex items-center gap-3 p-4"
          >
            <s.icon className={`h-5 w-5 shrink-0 ${s.tone}`} />
            <div>
              <p className="text-[10px] font-bold tracking-[0.1em] text-chocolate-400 uppercase dark:text-chocolate-300">
                {s.label}
              </p>
              <p className="font-display text-xl leading-none font-semibold text-chocolate-800 dark:text-cream-100">
                {s.prefix || ''}
                {s.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="card p-3.5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-chocolate-300 dark:text-chocolate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bill number, customer or payment..."
              className="field h-11 pl-10"
            />
          </div>
          <div className="flex gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`relative rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                  filter === f
                    ? 'text-cream-100 dark:text-chocolate-900'
                    : 'bg-cream-200 text-chocolate-500 hover:bg-cream-300 dark:bg-chocolate-700 dark:text-chocolate-300'
                }`}
              >
                {filter === f && (
                  <motion.span
                    layoutId="order-filter"
                    className="absolute inset-0 rounded-xl bg-chocolate-700 dark:bg-caramel-400"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">
                  {f}
                  <span
                    className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      filter === f ? 'bg-black/15 dark:bg-chocolate-900/15' : 'bg-white/60 dark:bg-chocolate-800'
                    }`}
                  >
                    {counts[f]}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {filtered.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead className="bg-cream-50 dark:bg-chocolate-900/50">
                <tr>
                  {['Bill No', 'Customer', 'Items', 'Amount', 'Payment', 'Status', 'Date', 'Action'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-[10px] font-bold tracking-[0.1em] text-chocolate-400 uppercase dark:text-chocolate-300"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200 dark:divide-chocolate-700">
                {filtered.map((o, i) => (
                  <motion.tr
                    key={o.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                    className="cursor-pointer transition hover:bg-cream-50 dark:hover:bg-chocolate-900/40"
                    onClick={() => setSelected(o)}
                  >
                    <td className="px-4 py-3 font-mono text-[12.5px] font-bold text-chocolate-700 dark:text-caramel-300">
                      {o.billNo}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-caramel-200 to-caramel-400 text-[10px] font-bold text-chocolate-800">
                          {o.customer.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium text-chocolate-800 dark:text-cream-100">
                            {o.customer}
                          </p>
                          {o.phone && <p className="text-[10.5px] text-chocolate-400 dark:text-chocolate-300">{o.phone}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12.5px] text-chocolate-500 dark:text-chocolate-300">
                      {totalItems(o)} items
                    </td>
                    <td className="px-4 py-3 text-[13px] font-bold text-chocolate-800 dark:text-cream-100">
                      {CURRENCY(o.total)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={o.payment} dot={false} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[12.5px] text-chocolate-700 dark:text-cream-200">{formatDate(o.createdAt)}</p>
                      <p className="text-[10.5px] text-chocolate-400 dark:text-chocolate-300">{formatTime(o.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelected(o)
                        }}
                        className="btn-icon h-8 w-8 hover:bg-caramel-100 hover:text-caramel-700 dark:hover:bg-chocolate-700"
                        aria-label={`View ${o.billNo}`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <EmptyState
              variant="orders"
              title={query ? 'No orders found' : `No ${filter.toLowerCase()} orders`}
              message={
                query
                  ? `No bills match “${query}”. Try a bill number like BW-1025 or a customer name.`
                  : filter === 'All'
                    ? 'Bills you create in the POS will appear here instantly.'
                    : `There are no ${filter.toLowerCase()} bills right now. Switch filter to see others.`
              }
              actionLabel={query ? 'Clear search' : filter !== 'All' ? 'Show all orders' : undefined}
              onAction={() => (query ? setQuery('') : setFilter('All'))}
            />
          </div>
        )}
      </div>

      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        icon={Receipt}
        title={selected?.billNo || ''}
        subtitle={selected ? `${selected.customer} · ${formatDateTime(selected.createdAt)}` : ''}
        badge={selected && <StatusBadge status={selected.status} />}
        footer={
          selected && (
            <div className="flex flex-wrap gap-2">
              <PrintButton
                label="Print Bill"
                className="btn-ghost flex-1 px-3 py-2.5"
                onPrint={() => pushToast({ title: 'Sending to printer', message: selected.billNo, variant: 'success' })}
              />
              {selected.status !== 'Completed' && (
                <button
                  type="button"
                  onClick={() => {
                    updateOrderStatus(selected.id, 'Completed')
                    setSelected((s) => ({ ...s, status: 'Completed' }))
                  }}
                  className="btn-primary flex-1 px-3 py-2.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark Paid
                </button>
              )}
              {selected.status !== 'Cancelled' && (
                <button
                  type="button"
                  onClick={() => {
                    updateOrderStatus(selected.id, 'Cancelled')
                    setSelected((s) => ({ ...s, status: 'Cancelled' }))
                  }}
                  className="btn px-3 py-2.5 bg-red-500 text-white hover:bg-red-600"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel
                </button>
              )}
            </div>
          )
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Bill Number', value: selected.billNo },
                { label: 'Payment', value: selected.payment },
                { label: 'Cashier', value: selected.cashier || '—' },
                { label: 'Items', value: totalItems(selected) },
              ].map((m) => (
                <div key={m.label} className="rounded-xl border border-cream-200 p-3 dark:border-chocolate-700">
                  <p className="text-[10px] font-bold tracking-[0.1em] text-chocolate-400 uppercase dark:text-chocolate-300">
                    {m.label}
                  </p>
                  <p className="mt-1 truncate text-[13px] font-semibold text-chocolate-800 dark:text-cream-100">{m.value}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="label">Line Items</p>
              <ul className="space-y-2">
                {selected.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-cream-200 p-3 dark:border-chocolate-700"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-chocolate-800 dark:text-cream-100">{item.name}</p>
                      <p className="text-[11px] text-chocolate-400 dark:text-chocolate-300">
                        {item.qty} × {CURRENCY(item.price)}
                      </p>
                    </div>
                    <span className="shrink-0 text-[13px] font-bold text-chocolate-800 dark:text-caramel-300">
                      {CURRENCY(item.price * item.qty)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-cream-50 p-4 dark:bg-chocolate-900/50">
              <dl className="space-y-2 text-[13px]">
                <div className="flex justify-between">
                  <dt className="text-chocolate-500 dark:text-chocolate-300">Subtotal</dt>
                  <dd className="font-semibold text-chocolate-800 dark:text-cream-100">{CURRENCY(selected.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-chocolate-500 dark:text-chocolate-300">Discount</dt>
                  <dd className="font-semibold text-sage-600 dark:text-sage-300">-{CURRENCY(selected.discount)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-chocolate-500 dark:text-chocolate-300">Tax</dt>
                  <dd className="font-semibold text-chocolate-800 dark:text-cream-100">{CURRENCY(selected.tax)}</dd>
                </div>
                {Number(selected.roundOff || 0) !== 0 && (
                  <div className="flex justify-between">
                    <dt className="text-chocolate-500 dark:text-chocolate-300">Round Off</dt>
                    <dd className="font-semibold text-chocolate-800 dark:text-cream-100">
                      {selected.roundOff > 0 ? '+' : '-'}
                      {CURRENCY(Math.abs(selected.roundOff))}
                    </dd>
                  </div>
                )}
                {selected.payment === 'Cash' && (
                  <div className="flex justify-between">
                    <dt className="text-chocolate-500 dark:text-chocolate-300">Cash Received</dt>
                    <dd className="font-semibold text-chocolate-800 dark:text-cream-100">
                      {CURRENCY(selected.cashReceived ?? selected.total)}
                    </dd>
                  </div>
                )}
                {selected.payment === 'Cash' && (
                  <div className="flex justify-between">
                    <dt className="text-chocolate-500 dark:text-chocolate-300">Change Returned</dt>
                    <dd className="font-semibold text-sage-600 dark:text-sage-300">
                      {CURRENCY(selected.change || 0)}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between border-t border-dashed border-cream-300 pt-2 dark:border-chocolate-600">
                  <dt className="text-[11px] font-bold tracking-[0.1em] text-chocolate-800 uppercase dark:text-cream-100">
                    Total
                  </dt>
                  <dd className="font-display text-lg font-semibold text-chocolate-800 dark:text-caramel-300">
                    {CURRENCY(selected.total)}
                  </dd>
                </div>
              </dl>
            </div>

            {selected.note && (
              <div className="rounded-xl border border-cream-200 bg-caramel-100/50 p-3 text-[12px] text-caramel-800 dark:border-caramel-500/25 dark:bg-caramel-500/10 dark:text-caramel-300">
                Note: {selected.note}
              </div>
            )}

            <div className="border-t border-cream-200 pt-4 dark:border-chocolate-700">
              <div className="mb-2.5 flex items-center justify-between gap-2">
                <p className="label mb-0">Receipt Preview</p>
                <PrintSizePicker />
              </div>
              <ReceiptView order={selected} compact />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
