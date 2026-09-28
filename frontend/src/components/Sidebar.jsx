import { AnimatePresence, motion } from 'framer-motion'
import { CakeSlice, LogOut, Moon, Sun, X } from 'lucide-react'
import { BRAND } from '../config/brand'
import { NAV_ITEMS } from '../config/nav'
import { useApp } from '../context/AppContext'

export function BrandMark({ size = 'md', className = '' }) {
  const dims = size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
  return (
    <span className={`relative grid ${dims} shrink-0 place-items-center rounded-2xl bg-chocolate-700 shadow-soft dark:bg-caramel-400 ${className}`}>
      <CakeSlice className={`${size === 'lg' ? 'h-6 w-6' : size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} text-caramel-200 dark:text-chocolate-900`} />
    </span>
  )
}

function NavButton({ item, active, onClick, badge }) {
  const Icon = item.icon
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition duration-200 ${
        active
          ? 'bg-chocolate-700 text-cream-100 shadow-soft dark:bg-caramel-400 dark:text-chocolate-900'
          : 'text-chocolate-500 hover:bg-cream-200 hover:text-chocolate-800 dark:text-chocolate-300 dark:hover:bg-chocolate-700 dark:hover:text-cream-100'
      }`}
    >
      {active && (
        <motion.span
          layoutId="nav-active"
          className="absolute top-1/2 -left-2.5 h-5 w-1 -translate-y-1/2 rounded-full bg-caramel-400"
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
        />
      )}
      <Icon className={`h-[18px] w-[18px] shrink-0 transition ${active ? '' : 'group-hover:scale-110'}`} />
      <span className="truncate">{item.label}</span>
      {badge ? (
        <span
          className={`ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
            active ? 'bg-chocolate-800 text-caramel-200 dark:bg-chocolate-900/30 dark:text-chocolate-800' : 'bg-caramel-100 text-caramel-700 dark:bg-chocolate-700 dark:text-caramel-300'
          }`}
        >
          {badge}
        </span>
      ) : null}
    </button>
  )
}

export default function Sidebar({ mobileOpen, onClose }) {
  const { page, setPage, theme, toggleTheme, shop, setShop, orders } = useApp()
  const pending = orders.filter((o) => o.status === 'Pending').length
  const isOpen = shop.status === 'OPEN'

  const go = (id) => {
    setPage(id)
    onClose?.()
  }

  const body = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-4 py-4">
        <BrandMark />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[15px] leading-tight font-semibold tracking-tight text-chocolate-800 dark:text-cream-100">
            {BRAND.name}
          </p>
          <p className="truncate text-[11px] text-chocolate-400 dark:text-chocolate-300">{BRAND.tagline}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close menu" className="btn-icon lg:hidden">
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="scroll-thin mt-1 flex-1 space-y-1 overflow-y-auto px-3">
        <p className="px-3 pt-2 pb-1.5 text-[10px] font-bold tracking-[0.14em] text-chocolate-300 uppercase dark:text-chocolate-400">
          Workspace
        </p>
        {NAV_ITEMS.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            active={page === item.id}
            onClick={() => go(item.id)}
            badge={item.id === 'orders' && pending ? pending : null}
          />
        ))}
      </nav>

      <div className="mt-3 space-y-2 border-t border-cream-200 px-3 pt-3 dark:border-chocolate-700">
        <button
          type="button"
          onClick={() => {
            setShop((s) => ({ ...s, status: isOpen ? 'CLOSED' : 'OPEN' }))
            onClose?.()
          }}
          className={`flex w-full items-center gap-3 rounded-xl border border-dashed px-3 py-2.5 text-left transition ${
            isOpen
              ? 'border-caramel-300 bg-caramel-100/60 hover:bg-caramel-100 dark:border-caramel-500/30 dark:bg-caramel-500/10'
              : 'border-sage-300 bg-sage-100/60 hover:bg-sage-100 dark:border-sage-500/30 dark:bg-sage-500/10'
          }`}
        >
          <span className="relative flex h-2 w-2">
            {isOpen && <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-sage-400" />}
            <span className={`relative inline-flex h-2 w-2 rounded-full ${isOpen ? 'bg-sage-500' : 'bg-chocolate-300'}`} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold tracking-[0.12em] text-chocolate-400 uppercase dark:text-chocolate-300">
              {isOpen ? 'Tap to close' : 'Tap to reopen'}
            </p>
            <p className="truncate text-[13px] font-semibold text-chocolate-700 dark:text-cream-200">
              Shop Status: {shop.status}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="btn-icon border border-cream-300 dark:border-chocolate-600"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2 }}
                className="grid place-items-center"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </motion.span>
            </AnimatePresence>
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-cream-300 bg-white px-2.5 py-1.5 dark:border-chocolate-600 dark:bg-chocolate-700">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-caramel-300 to-caramel-500 text-[11px] font-bold text-chocolate-800">
              {BRAND.admin.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] leading-tight font-semibold text-chocolate-800 dark:text-cream-100">
                {BRAND.admin.name}
              </p>
              <p className="truncate text-[11px] text-chocolate-400 dark:text-chocolate-300">{BRAND.admin.role}</p>
            </div>
            <LogOut className="h-3.5 w-3.5 shrink-0 text-chocolate-300" />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <motion.aside
        initial={{ x: -24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="no-print hidden w-[248px] shrink-0 border-r border-cream-200 bg-white lg:block dark:border-chocolate-700 dark:bg-chocolate-800"
      >
        {body}
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <div className="no-print fixed inset-0 z-[70] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-chocolate-900/50 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              className="relative h-full w-[272px] border-r border-cream-200 bg-white dark:border-chocolate-700 dark:bg-chocolate-800"
            >
              {body}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
