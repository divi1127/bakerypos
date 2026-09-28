import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeIndianRupee,
  Flame,
  Package,
  Receipt,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CURRENCY } from '../config/brand'
import CountUp from '../components/CountUp'
import ProductImage from '../components/ProductImage'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { useApp } from '../context/AppContext'
import { categorySales, paymentMix, salesTrend } from '../data/sales'
import { isToday } from '../utils/billing'

const TOOLTIP = {
  contentStyle: {
    borderRadius: 14,
    border: '1px solid #F0DEC7',
    boxShadow: '0 12px 30px -10px rgba(61,41,25,0.25)',
    fontSize: 12,
    fontWeight: 600,
  },
  cursor: { fill: 'rgba(233,188,124,0.14)' },
}

function SectionCard({ title, subtitle, action, children, className = '', delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`card p-5 ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-[17px] leading-tight font-semibold text-chocolate-800 dark:text-cream-100">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-chocolate-400 dark:text-chocolate-300">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </motion.section>
  )
}

export default function Dashboard() {
  const { orders, products, setPage, shop } = useApp()

  const todayOrders = useMemo(() => orders.filter((o) => isToday(o.createdAt)), [orders])
  const pending = useMemo(() => orders.filter((o) => o.status === 'Pending'), [orders])

  const todaySales = useMemo(
    () => todayOrders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0),
    [todayOrders],
  )

  const itemsSold = useMemo(
    () => todayOrders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + o.items.reduce((a, i) => a + i.qty, 0), 0),
    [todayOrders],
  )

  const popular = useMemo(
    () =>
      [...products]
        .filter((p) => p.sold > 0)
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 5),
    [products],
  )

  const chartData = useMemo(
    () => salesTrend.map((s) => ({ ...s, revenueLabel: CURRENCY(s.revenue) })),
    [],
  )

  const recent = useMemo(() => orders.slice(0, 5), [orders])

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-end justify-between gap-3"
      >
        <div>
          <p className="text-[11px] font-bold tracking-[0.14em] text-caramel-600 uppercase dark:text-caramel-400">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long' })}
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-chocolate-800 sm:text-3xl dark:text-cream-100">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, Anitha
          </h1>
          <p className="mt-1 text-sm text-chocolate-400 dark:text-chocolate-300">
            {shop.status === 'OPEN' ? 'Shop is open and billing live.' : 'Shop is currently closed.'} Here is how today is shaping up.
          </p>
        </div>
        <button type="button" onClick={() => setPage('pos')} className="btn-primary px-4 py-2.5">
          <Receipt className="h-4 w-4" />
          Start New Bill
        </button>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          label="Today's Sales"
          value={todaySales}
          prefix="₹"
          icon={BadgeIndianRupee}
          tone="chocolate"
          hint="vs yesterday"
          trend={12.4}
        />
        <StatCard
          index={1}
          label="Today's Orders"
          value={todayOrders.length}
          icon={Receipt}
          tone="sage"
          hint="Bills generated today"
        />
        <StatCard
          index={2}
          label="Items Sold"
          value={itemsSold}
          icon={Package}
          tone="caramel"
          hint="Across all counters"
          trend={6.1}
        />
        <StatCard
          index={3}
          label="Pending Bills"
          value={pending.length}
          icon={Flame}
          tone="peach"
          hint="Awaiting payment"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <SectionCard
          title="Sales Overview"
          subtitle="Revenue across the last 7 days"
          className="xl:col-span-2"
          delay={0.1}
          action={
            <button
              type="button"
              onClick={() => setPage('reports')}
              className="btn-soft px-3 py-1.5 text-xs"
            >
              Full report
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          }
        >
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Revenue', value: 86860, prefix: '₹' },
              { label: 'Orders', value: 309, prefix: '' },
              { label: 'Avg Bill', value: 281, prefix: '₹' },
              { label: 'Growth', value: 8.1, prefix: '', suffix: '%' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-cream-50 px-3.5 py-2.5 dark:bg-chocolate-900/50">
                <p className="text-[10px] font-semibold tracking-[0.1em] text-chocolate-400 uppercase dark:text-chocolate-300">
                  {s.label}
                </p>
                <p className="mt-0.5 font-display text-lg leading-none font-semibold text-chocolate-800 dark:text-cream-100">
                  <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </p>
              </div>
            ))}
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#DDA254" stopOpacity={0.42} />
                    <stop offset="100%" stopColor="#DDA254" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6B9A85" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="#6B9A85" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" stroke="#F0DEC7" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#B08C6E', fontWeight: 600 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#B08C6E', fontWeight: 600 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip {...TOOLTIP} formatter={(value, name) => [name === 'revenue' ? CURRENCY(value) : value, name === 'revenue' ? 'Revenue' : 'Orders']} />
                <Legend
                  verticalAlign="top"
                  height={28}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, fontWeight: 600, color: '#8C6647' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C9862F" strokeWidth={2.5} fill="url(#revenueFill)" activeDot={{ r: 5 }} />
                <Area type="monotone" dataKey="orders" stroke="#4E7D69" strokeWidth={2} fill="url(#ordersFill)" activeDot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Category Split" subtitle="Today's revenue mix" delay={0.16}>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categorySales} dataKey="value" nameKey="name" innerRadius={46} outerRadius={72} paddingAngle={3} stroke="none">
                  {categorySales.map((entry) => (
                    <Cell key={entry.name} fill={entry.tint} />
                  ))}
                </Pie>
                <Tooltip {...TOOLTIP} formatter={(v) => [`${v}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-1.5">
            {categorySales.slice(0, 5).map((c) => (
              <li key={c.name} className="flex items-center gap-2.5 text-[12.5px]">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: c.tint }} />
                <span className="flex-1 text-chocolate-500 dark:text-chocolate-300">{c.name}</span>
                <span className="font-semibold text-chocolate-800 dark:text-cream-100">{c.value}%</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <SectionCard
          title="Popular Products"
          subtitle="Top sellers this month"
          className="xl:col-span-1"
          delay={0.2}
          action={
            <button type="button" onClick={() => setPage('products')} className="btn-soft px-3 py-1.5 text-xs">
              View all
            </button>
          }
        >
          <ul className="space-y-2">
            {popular.map((p, i) => (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.06 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 rounded-xl border border-transparent p-1.5 transition hover:border-cream-300 hover:bg-cream-50 dark:hover:border-chocolate-600 dark:hover:bg-chocolate-900/40"
              >
                <span className="w-4 shrink-0 text-center text-[11px] font-bold text-chocolate-300 dark:text-chocolate-400">
                  {i + 1}
                </span>
                <ProductImage src={p.image} alt={p.name} seed={i} className="h-11 w-11 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-chocolate-800 dark:text-cream-100">{p.name}</p>
                  <p className="text-[11px] text-chocolate-400 dark:text-chocolate-300">{p.sold} sold</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[13px] font-bold text-chocolate-700 dark:text-caramel-300">{CURRENCY(p.sold * p.price)}</p>
                  <p className="text-[10px] text-sage-600 dark:text-sage-300">
                    <TrendingUp className="mr-0.5 inline h-2.5 w-2.5" />
                    {Math.round((p.sold / products[0].sold) * 100)}%
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Recent Orders"
          subtitle="Latest bills at the counter"
          className="xl:col-span-2"
          delay={0.24}
          action={
            <button type="button" onClick={() => setPage('orders')} className="btn-soft px-3 py-1.5 text-xs">
              All orders
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          }
        >
          <div className="-mx-1 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left">
              <thead>
                <tr className="border-b border-cream-200 dark:border-chocolate-700">
                  {['Bill', 'Customer', 'Items', 'Amount', 'Status'].map((h) => (
                    <th key={h} className="px-3 pb-2.5 text-[10px] font-bold tracking-[0.1em] text-chocolate-400 uppercase dark:text-chocolate-300">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200 dark:divide-chocolate-700">
                {recent.map((o, i) => (
                  <motion.tr
                    key={o.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="cursor-pointer transition hover:bg-cream-50 dark:hover:bg-chocolate-900/40"
                    onClick={() => setPage('orders')}
                  >
                    <td className="px-3 py-3 font-mono text-[12.5px] font-semibold text-chocolate-700 dark:text-caramel-300">
                      #{o.billNo.split('-')[1]}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-caramel-200 to-caramel-400 text-[10px] font-bold text-chocolate-800">
                          {o.customer.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </span>
                        <span className="truncate text-[13px] font-medium text-chocolate-800 dark:text-cream-100">{o.customer}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[12.5px] text-chocolate-500 dark:text-chocolate-300">
                      {o.items.reduce((s, i2) => s + i2.qty, 0)} items
                    </td>
                    <td className="px-3 py-3 text-[13px] font-bold text-chocolate-800 dark:text-cream-100">{CURRENCY(o.total)}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Payment Methods" subtitle="How customers paid today" delay={0.3}>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentMix} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="#F0DEC7" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#B08C6E', fontWeight: 600 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#B08C6E', fontWeight: 600 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`} />
                <Tooltip {...TOOLTIP} cursor={{ fill: 'rgba(233,188,124,0.14)' }} formatter={(v) => [CURRENCY(v), 'Collected']} />
                <Bar dataKey="amount" radius={[10, 10, 4, 4]} maxBarSize={64}>
                  {paymentMix.map((entry) => (
                    <Cell key={entry.name} fill={entry.tint} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {paymentMix.map((p) => (
              <div key={p.name} className="rounded-xl border border-cream-200 p-3.5 dark:border-chocolate-700">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.tint }} />
                  <span className="text-[11px] font-bold tracking-[0.1em] text-chocolate-400 uppercase dark:text-chocolate-300">
                    {p.name}
                  </span>
                </div>
                <p className="mt-2 font-display text-lg leading-none font-semibold text-chocolate-800 dark:text-cream-100">
                  {CURRENCY(p.amount)}
                </p>
                <p className="mt-1.5 text-[11px] text-chocolate-400 dark:text-chocolate-300">{p.value}% of orders</p>
              </div>
            ))}
            <div className="rounded-xl border border-caramel-200 bg-caramel-100/60 p-3.5 dark:border-caramel-500/25 dark:bg-caramel-500/10">
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-caramel-600 dark:text-caramel-300" />
                <span className="text-[11px] font-bold tracking-[0.1em] text-caramel-700 uppercase dark:text-caramel-300">Footfall</span>
              </div>
              <p className="mt-2 font-display text-lg leading-none font-semibold text-caramel-700 dark:text-caramel-300">64</p>
              <p className="mt-1.5 text-[11px] text-caramel-600/80 dark:text-caramel-300/80">Walk-ins today</p>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
