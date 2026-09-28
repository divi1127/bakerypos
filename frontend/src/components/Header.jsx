import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  Check,
  ChevronRight,
  Menu,
  Moon,
  Search,
  ShoppingBag,
  Sun,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { BRAND } from '../config/brand'
import { useApp } from '../context/AppContext'
import { CURRENCY } from '../config/brand'
import ProductImage from './ProductImage'
import { BrandMark } from './Sidebar'
import { MOBILE_NAV_ITEMS } from '../config/nav'

function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export default function Header({ onOpenMenu, onGoToCart }) {
  const { setPage, theme, toggleTheme, shop, products, cartCount, orders } = useApp()
  const now = useClock()
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const boxRef = useRef(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)).slice(0, 6)
  }, [query, products])

  const notifications = useMemo(
    () => orders.filter((o) => o.status === 'Pending').slice(0, 4),
    [orders],
  )

  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setSearchOpen(false)
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setNotifOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const isOpen = shop.status === 'OPEN'

  return (
    <header className="no-print sticky top-0 z-50 border-b border-cream-200 bg-cream-50/85 backdrop-blur-xl dark:border-chocolate-700 dark:bg-chocolate-900/80">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <button type="button" onClick={onOpenMenu} aria-label="Open menu" className="btn-icon lg:hidden">
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden items-center gap-2.5 lg:flex">
          <BrandMark size="sm" />
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold text-chocolate-800 dark:text-cream-100">{BRAND.name}</p>
            <p className="text-[10px] tracking-wide text-chocolate-400 dark:text-chocolate-300">{BRAND.address}</p>
          </div>
        </div>

        <div ref={boxRef} className="relative ml-auto w-full max-w-md lg:ml-0 lg:mr-auto lg:max-w-lg">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-chocolate-300 dark:text-chocolate-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSearchOpen(true)
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search cake, brownie, bread..."
              className="field h-10 pl-9"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-chocolate-300 hover:text-chocolate-600 dark:hover:text-cream-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 rounded border border-cream-300 bg-cream-100 px-1.5 py-0.5 text-[10px] font-semibold text-chocolate-300 sm:block dark:border-chocolate-600 dark:bg-chocolate-700 dark:text-chocolate-300">
                ⌘K
              </kbd>
            )}
          </div>

          <AnimatePresence>
            {searchOpen && query.trim() && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.16 }}
                className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border border-cream-300 bg-white shadow-lift dark:border-chocolate-600 dark:bg-chocolate-800"
              >
                {results.length ? (
                  <ul className="scroll-thin max-h-80 overflow-y-auto p-1.5">
                    {results.map((p) => (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setQuery('')
                            setSearchOpen(false)
                            setPage('pos')
                          }}
                          className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-cream-100 dark:hover:bg-chocolate-700"
                        >
                          <ProductImage src={p.image} alt={p.name} seed={p.id.length} className="h-10 w-10 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-chocolate-800 dark:text-cream-100">{p.name}</p>
                            <p className="text-[11px] text-chocolate-400 dark:text-chocolate-300">{p.category}</p>
                          </div>
                          <span className="text-sm font-semibold text-chocolate-700 dark:text-caramel-300">{CURRENCY(p.price)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-5 text-center text-sm text-chocolate-400 dark:text-chocolate-300">
                    No products match “{query}”
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden items-center gap-2 xl:flex">
          <div className="rounded-xl border border-cream-300 bg-white px-3 py-1.5 text-right dark:border-chocolate-600 dark:bg-chocolate-800">
            <p className="text-[11px] font-semibold text-chocolate-700 dark:text-cream-100">
              {now.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })}
            </p>
            <p className="font-mono text-[11px] text-chocolate-400 dark:text-chocolate-300">
              {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
            className="btn-icon relative border border-cream-300 dark:border-chocolate-600"
          >
            <Bell className="h-4 w-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-caramel-500 px-1 text-[9px] font-bold text-white">
                {notifications.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.16 }}
                className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-cream-300 bg-white shadow-lift dark:border-chocolate-600 dark:bg-chocolate-800"
              >
                <div className="flex items-center justify-between border-b border-cream-200 px-4 py-3 dark:border-chocolate-700">
                  <p className="text-sm font-semibold text-chocolate-800 dark:text-cream-100">Notifications</p>
                  <span className="chip bg-caramel-100 text-caramel-700 dark:bg-caramel-900/40 dark:text-caramel-300">
                    {notifications.length} pending
                  </span>
                </div>
                {notifications.length ? (
                  <ul className="scroll-thin max-h-72 divide-y divide-cream-200 overflow-y-auto dark:divide-chocolate-700">
                    {notifications.map((o) => (
                      <li key={o.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setNotifOpen(false)
                            setPage('orders')
                          }}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-cream-50 dark:hover:bg-chocolate-700"
                        >
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-caramel-100 text-caramel-600 dark:bg-chocolate-700 dark:text-caramel-300">
                            <ShoppingBag className="h-4 w-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-medium text-chocolate-800 dark:text-cream-100">
                              {o.billNo} · {o.customer}
                            </p>
                            <p className="text-[11px] text-chocolate-400 dark:text-chocolate-300">
                              Awaiting payment · {CURRENCY(o.total)}
                            </p>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-chocolate-300" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-6 text-center text-sm text-chocolate-400 dark:text-chocolate-300">
                    Nothing pending. All bills are settled.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="btn-icon hidden border border-cream-300 sm:inline-flex dark:border-chocolate-600"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button
          type="button"
          onClick={onGoToCart}
          className="btn-primary relative h-10 px-3 sm:px-4"
          aria-label="Open current bill"
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="hidden sm:inline">Bill</span>
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="grid h-5 min-w-5 place-items-center rounded-full bg-caramel-400 px-1 text-[11px] font-bold text-chocolate-900"
              >
                {cartCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <div className="hidden items-center gap-2.5 pl-1 xl:flex">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-caramel-300 to-caramel-500 text-xs font-bold text-chocolate-800">
            {BRAND.admin.initials}
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-chocolate-800 dark:text-cream-100">{BRAND.admin.name}</p>
            <p className="flex items-center gap-1 text-[10px] text-chocolate-400 dark:text-chocolate-300">
              {isOpen ? <Check className="h-3 w-3 text-sage-500" /> : null}
              Shop {shop.status === 'OPEN' ? 'Open' : 'Closed'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-cream-200 px-4 py-1.5 text-[11px] text-chocolate-400 xl:hidden dark:border-chocolate-700 dark:text-chocolate-300">
        <span>{now.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'short' })}</span>
        <span className="opacity-40">·</span>
        <span className="font-mono">{now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? 'bg-sage-500' : 'bg-chocolate-300'}`} />
          {shop.status}
        </span>
      </div>
    </header>
  )
}

export function MobileNav({ onOpenCart }) {
  const { page, setPage, cartCount } = useApp()
  const items = MOBILE_NAV_ITEMS

  return (
    <nav className="no-print fixed inset-x-0 bottom-0 z-50 border-t border-cream-200 bg-white/95 backdrop-blur-xl lg:hidden dark:border-chocolate-700 dark:bg-chocolate-800/95">
      <div className="grid grid-cols-6">
        {items.map((item) => {
          const Icon = item.icon
          const active = page === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setPage(item.id)}
              className={`relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition ${
                active ? 'text-chocolate-700 dark:text-caramel-300' : 'text-chocolate-400 dark:text-chocolate-400'
              }`}
            >
              {active && (
                <motion.span layoutId="mobile-nav-active" className="absolute top-0 h-0.5 w-8 rounded-full bg-caramel-400" />
              )}
              <Icon className="h-[18px] w-[18px]" />
              <span className="truncate px-0.5">{item.label.split(' / ')[0]}</span>
            </button>
          )
        })}
        <button
          type="button"
          onClick={onOpenCart}
          className="relative -mt-5 flex flex-col items-center gap-1"
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-chocolate-700 text-cream-100 shadow-glow dark:bg-caramel-400 dark:text-chocolate-900">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-caramel-500 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </span>
          <span className="text-[10px] font-semibold text-chocolate-500 dark:text-chocolate-300">Bill</span>
        </button>
      </div>
    </nav>
  )
}
