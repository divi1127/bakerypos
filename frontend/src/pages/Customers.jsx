import { motion } from 'framer-motion'
import { Award, Crown, Phone, Plus, Search, TrendingUp, UserPlus, Users, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import Drawer from '../components/Drawer'
import EmptyState, { ErrorState } from '../components/EmptyState'
import Modal from '../components/Modal'
import StatusBadge from '../components/StatusBadge'
import { CURRENCY } from '../config/brand'
import { useApp } from '../context/AppContext'
import { isToday, relativeDay } from '../utils/billing'

const BLANK = { name: '', phone: '', email: '' }

export default function Customers() {
  const { customers, orders, addCustomer, setPage } = useApp()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState(BLANK)
  const [error, setError] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return customers
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q),
    )
  }, [customers, query])

  const stats = useMemo(() => {
    const todayIds = new Set(orders.filter((o) => isToday(o.createdAt) && o.customerId).map((o) => o.customerId))
    const returning = customers.filter((c) => c.orders > 1).length
    return {
      total: customers.length,
      today: todayIds.size,
      returning,
      value: customers.reduce((s, c) => s + c.spent, 0),
    }
  }, [customers, orders])

  const history = useMemo(
    () => (selected ? orders.filter((o) => o.customerId === selected.id) : []),
    [orders, selected],
  )

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    addCustomer({ name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim() })
    setForm(BLANK)
    setAddOpen(false)
  }

  if (error) {
    return (
      <div className="py-10">
        <ErrorState message="We could not load your customer list just now." onRetry={() => setError(false)} />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-chocolate-800 dark:text-cream-100">
            Customers
          </h1>
          <p className="mt-0.5 text-sm text-chocolate-400 dark:text-chocolate-300">
            {stats.total} customers · lifetime value {CURRENCY(stats.value)}
          </p>
        </div>
        <button type="button" onClick={() => setAddOpen(true)} className="btn-primary px-4 py-2.5 text-[13px]">
          <UserPlus className="h-4 w-4" />
          Add Customer
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: 'Total Customers', value: stats.total, icon: Users, tone: 'bg-sage-100 text-sage-600 dark:bg-chocolate-700 dark:text-sage-300' },
          { label: "Today's Customers", value: stats.today, icon: TrendingUp, tone: 'bg-caramel-100 text-caramel-700 dark:bg-chocolate-700 dark:text-caramel-300' },
          { label: 'Returning Customers', value: stats.returning, icon: Award, tone: 'bg-peach-100 text-peach-500 dark:bg-chocolate-700 dark:text-peach-300' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -3 }}
            className="card flex items-center gap-4 p-5"
          >
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${s.tone}`}>
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-bold tracking-[0.1em] text-chocolate-400 uppercase dark:text-chocolate-300">
                {s.label}
              </p>
              <p className="font-display text-2xl leading-none font-semibold text-chocolate-800 dark:text-cream-100">
                {s.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="card p-3.5">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-chocolate-300 dark:text-chocolate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, phone or email..."
            className="field h-11 pl-10 pr-9"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-chocolate-300 hover:text-chocolate-600 dark:hover:text-cream-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="card overflow-hidden">
        {filtered.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead className="bg-cream-50 dark:bg-chocolate-900/50">
                <tr>
                  {['Name', 'Phone', 'Orders', 'Total Spent', 'Last Visit', 'Tier'].map((h) => (
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
                {filtered.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                    onClick={() => setSelected(c)}
                    className="cursor-pointer transition hover:bg-cream-50 dark:hover:bg-chocolate-900/40"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-caramel-200 to-caramel-400 text-[11px] font-bold text-chocolate-800">
                          {c.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-chocolate-800 dark:text-cream-100">{c.name}</p>
                          <p className="truncate text-[10.5px] text-chocolate-400 dark:text-chocolate-300">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[12.5px] text-chocolate-600 dark:text-chocolate-300">
                      {c.phone}
                    </td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-chocolate-800 dark:text-cream-100">{c.orders}</td>
                    <td className="px-4 py-3 text-[13px] font-bold text-chocolate-800 dark:text-caramel-300">
                      {CURRENCY(c.spent)}
                    </td>
                    <td className="px-4 py-3 text-[12.5px] text-chocolate-500 dark:text-chocolate-300">{c.lastVisit}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.tier} dot={false} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <EmptyState
              variant="customers"
              title={query ? 'No customers found' : 'No customers yet'}
              message={
                query
                  ? `No one matches “${query}”. Try searching by phone number instead.`
                  : 'Customers are created automatically when you attach a name to a bill in POS.'
              }
              actionLabel={query ? 'Clear search' : 'Add Customer'}
              onAction={() => (query ? setQuery('') : setAddOpen(true))}
            />
          </div>
        )}
      </div>

      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        icon={Crown}
        title={selected?.name || ''}
        subtitle={selected ? `Member since ${selected.joined}` : ''}
        badge={selected && <StatusBadge status={selected.tier} dot={false} />}
        footer={
          selected && (
            <button
              type="button"
              onClick={() => {
                setPage('pos')
                setSelected(null)
              }}
              className="btn-primary w-full py-3"
            >
              <Plus className="h-4 w-4" />
              Create Bill for {selected.name.split(' ')[0]}
            </button>
          )
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-caramel-100 to-cream-50 p-4 dark:from-chocolate-700 dark:to-chocolate-800">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-caramel-300 to-caramel-500 text-lg font-bold text-chocolate-800">
                {selected.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </span>
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-semibold text-chocolate-800 dark:text-cream-100">
                  {selected.name}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-chocolate-500 dark:text-chocolate-300">
                  <Phone className="h-3 w-3" />
                  {selected.phone}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Orders', value: selected.orders },
                { label: 'Spent', value: CURRENCY(selected.spent) },
                { label: 'Avg Bill', value: CURRENCY(Math.round(selected.spent / Math.max(selected.orders, 1))) },
              ].map((m) => (
                <div key={m.label} className="rounded-xl border border-cream-200 p-3 text-center dark:border-chocolate-700">
                  <p className="text-[10px] font-bold tracking-[0.1em] text-chocolate-400 uppercase dark:text-chocolate-300">
                    {m.label}
                  </p>
                  <p className="mt-1 font-display text-base font-semibold text-chocolate-800 dark:text-cream-100">{m.value}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="label">Order History</p>
              {history.length ? (
                <ul className="space-y-2">
                  {history.map((o) => (
                    <li
                      key={o.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-cream-200 p-3 dark:border-chocolate-700"
                    >
                      <div className="min-w-0">
                        <p className="font-mono text-[12px] font-bold text-chocolate-700 dark:text-caramel-300">{o.billNo}</p>
                        <p className="text-[10.5px] text-chocolate-400 dark:text-chocolate-300">{relativeDay(o.createdAt)}</p>
                      </div>
                      <span className="text-[13px] font-bold text-chocolate-800 dark:text-cream-100">{CURRENCY(o.total)}</span>
                      <StatusBadge status={o.status} />
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  compact
                  variant="orders"
                  title="No past bills"
                  message="This customer has not been billed in the current demo data."
                />
              )}
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        icon={UserPlus}
        size="sm"
        title="Add Customer"
        subtitle="Save a walk-in as a returning customer"
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setAddOpen(false)} className="btn-ghost px-4 py-2.5">
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!form.name.trim() || !form.phone.trim()}
              className="btn-primary px-5 py-2.5"
            >
              Save Customer
            </button>
          </div>
        }
      >
        <form onSubmit={submit} className="space-y-4">
          <div>
            <p className="label">Full Name</p>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Rahul Menon"
              className="field"
            />
          </div>
          <div>
            <p className="label">Phone Number</p>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="98430 12345"
              className="field"
            />
          </div>
          <div>
            <p className="label">Email (optional)</p>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="name@email.com"
              className="field"
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}
