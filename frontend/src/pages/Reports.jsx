import { motion } from 'framer-motion'
import { BadgeIndianRupee, CakeSlice, Download, Layers, Receipt, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import StatCard from '../components/StatCard'
import { CURRENCY } from '../config/brand'
import { useApp } from '../context/AppContext'
import { categorySales, hourlySales, paymentMix, revenueByRange, revenueSeriesByRange } from '../data/sales'
import { averageBill } from '../utils/billing'

const RANGES = ['Today', 'This Week', 'This Month']

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

export default function Reports() {
  const { orders, products, setPage } = useApp()
  const [range, setRange] = useState('This Week')

  const metrics = useMemo(() => {
    const base = revenueByRange[range]
    const completed = orders.filter((o) => o.status === 'Completed')
    const top = [...products].sort((a, b) => b.sold * b.price - a.sold * a.price)[0]
    return {
      revenue: base.revenue,
      orders: base.orders,
      average: range === 'Today' ? 259 : Math.round(averageBill(completed) || 281),
      top,
      growth: base.growth,
    }
  }, [range, orders, products])

  const series = useMemo(
    () => (revenueSeriesByRange[range] || []).map((s) => ({ ...s, label: s.label })),
    [range],
  )

  const topProducts = useMemo(
    () => [...products].sort((a, b) => b.sold - a.sold).slice(0, 6),
    [products],
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-chocolate-800 dark:text-cream-100">
            Reports
          </h1>
          <p className="mt-0.5 text-sm text-chocolate-400 dark:text-chocolate-300">
            Sales, orders and category performance for {range.toLowerCase()}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1.5 rounded-2xl border border-cream-300 bg-white p-1 dark:border-chocolate-600 dark:bg-chocolate-800">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`relative rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  range === r ? 'text-cream-100 dark:text-chocolate-900' : 'text-chocolate-500 hover:text-chocolate-700 dark:text-chocolate-300'
                }`}
              >
                {range === r && (
                  <motion.span
                    layoutId="report-range"
                    className="absolute inset-0 rounded-xl bg-chocolate-700 dark:bg-caramel-400"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{r}</span>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => window.print()} className="btn-ghost px-3.5 py-2.5 text-[13px]">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard index={0} label="Total Sales" value={metrics.revenue} prefix="₹" icon={BadgeIndianRupee} tone="chocolate" hint="vs previous period" trend={metrics.growth} />
        <StatCard index={1} label="Total Orders" value={metrics.orders} icon={Receipt} tone="sage" hint="Bills generated" trend={7.2} />
        <StatCard index={2} label="Average Bill Value" value={metrics.average} prefix="₹" icon={Layers} tone="caramel" hint="Per transaction" />
        <StatCard
          index={3}
          label="Top Product"
          value={0}
          icon={CakeSlice}
          tone="peach"
          hint={`${metrics.top.name} · ${metrics.top.sold} sold`}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="card p-5"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-[17px] leading-tight font-semibold text-chocolate-800 dark:text-cream-100">
              Revenue &amp; Order Trend
            </h2>
            <p className="mt-0.5 text-xs text-chocolate-400 dark:text-chocolate-300">Bills against collected revenue</p>
          </div>
          <span className="chip bg-sage-100 text-sage-600 dark:bg-sage-900/40 dark:text-sage-300">
            <TrendingUp className="h-3.5 w-3.5" />
            +{metrics.growth}%
          </span>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
              <defs>
                <linearGradient id="repRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9862F" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#C9862F" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="repOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4E7D69" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#4E7D69" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 6" stroke="#F0DEC7" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#B08C6E', fontWeight: 600 }} />
              <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#B08C6E', fontWeight: 600 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#B08C6E', fontWeight: 600 }} />
              <Tooltip
                {...TOOLTIP}
                formatter={(value, name) => [name === 'revenue' ? CURRENCY(value) : value, name === 'revenue' ? 'Revenue' : 'Orders']}
              />
              <Legend verticalAlign="top" height={30} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontWeight: 600, color: '#8C6647' }} />
              <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#C9862F" strokeWidth={2.5} fill="url(#repRevenue)" activeDot={{ r: 5 }} />
              <Area yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#4E7D69" strokeWidth={2} fill="url(#repOrders)" activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
          className="card p-5"
        >
          <h2 className="font-display text-[17px] leading-tight font-semibold text-chocolate-800 dark:text-cream-100">
            Category Sales
          </h2>
          <p className="mt-0.5 text-xs text-chocolate-400 dark:text-chocolate-300">Where the revenue comes from</p>
          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categorySales} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={3} stroke="none">
                  {categorySales.map((entry) => (
                    <Cell key={entry.name} fill={entry.tint} />
                  ))}
                </Pie>
                <Tooltip {...TOOLTIP} formatter={(v, n, p) => [CURRENCY(p.payload.revenue), `${n} (${v}%)`]} />
                <Legend verticalAlign="bottom" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontWeight: 600, color: '#8C6647' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="card p-5"
        >
          <h2 className="font-display text-[17px] leading-tight font-semibold text-chocolate-800 dark:text-cream-100">
            Orders by Hour
          </h2>
          <p className="mt-0.5 text-xs text-chocolate-400 dark:text-chocolate-300">Peak billing windows</p>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlySales} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="#F0DEC7" vertical={false} />
                <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#B08C6E', fontWeight: 600 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#B08C6E', fontWeight: 600 }} />
                <Tooltip {...TOOLTIP} formatter={(v) => [v, 'Orders']} />
                <Bar dataKey="orders" fill="#DDA254" radius={[8, 8, 3, 3]} maxBarSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.24 }}
          className="card p-5"
        >
          <h2 className="font-display text-[17px] leading-tight font-semibold text-chocolate-800 dark:text-cream-100">
            Payment Mix
          </h2>
          <p className="mt-0.5 text-xs text-chocolate-400 dark:text-chocolate-300">Collected per tender type</p>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={paymentMix} margin={{ top: 8, right: 12, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="#F0DEC7" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#B08C6E', fontWeight: 600 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#B08C6E', fontWeight: 600 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`} />
                <Tooltip {...TOOLTIP} formatter={(v) => [CURRENCY(v), 'Collected']} />
                <Line type="monotone" dataKey="amount" stroke="#4E7D69" strokeWidth={3} dot={{ r: 4, fill: '#4E7D69' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-1.5">
            {paymentMix.map((p) => (
              <li key={p.name} className="flex items-center gap-2.5 text-[12.5px]">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.tint }} />
                <span className="flex-1 text-chocolate-500 dark:text-chocolate-300">{p.name}</span>
                <span className="font-semibold text-chocolate-800 dark:text-cream-100">{p.value}%</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.28 }}
        className="card overflow-hidden"
      >
        <div className="flex items-center justify-between gap-3 p-5">
          <div>
            <h2 className="font-display text-[17px] leading-tight font-semibold text-chocolate-800 dark:text-cream-100">
              Product Performance
            </h2>
            <p className="mt-0.5 text-xs text-chocolate-400 dark:text-chocolate-300">Units sold and revenue contribution</p>
          </div>
          <button type="button" onClick={() => setPage('products')} className="btn-soft px-3 py-1.5 text-xs">
            Manage products
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left">
            <thead className="bg-cream-50 dark:bg-chocolate-900/50">
              <tr>
                {['#', 'Product', 'Units Sold', 'Revenue', 'Share'].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] font-bold tracking-[0.1em] text-chocolate-400 uppercase dark:text-chocolate-300">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200 dark:divide-chocolate-700">
              {topProducts.map((p, i) => {
                const revenue = p.sold * p.price
                const share = metrics.revenue ? Math.min(100, Math.round((revenue / metrics.revenue) * 100)) : 0
                return (
                  <tr key={p.id} className="transition hover:bg-cream-50 dark:hover:bg-chocolate-900/40">
                    <td className="px-4 py-3 text-[12px] font-bold text-chocolate-300 dark:text-chocolate-400">{i + 1}</td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-chocolate-800 dark:text-cream-100">{p.name}</td>
                    <td className="px-4 py-3 text-[13px] text-chocolate-600 dark:text-chocolate-200">{p.sold}</td>
                    <td className="px-4 py-3 text-[13px] font-bold text-chocolate-800 dark:text-caramel-300">{CURRENCY(revenue)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-cream-200 dark:bg-chocolate-700">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${share}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 + i * 0.05 }}
                            className="h-full rounded-full bg-gradient-to-r from-caramel-300 to-caramel-500"
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-chocolate-400 dark:text-chocolate-300">{share}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
