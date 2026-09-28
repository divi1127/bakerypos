import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import Header, { MobileNav } from './components/Header'
import LoadingScreen from './components/LoadingScreen'
import Sidebar from './components/Sidebar'
import ToastStack from './components/Toast'
import { AppProvider, useApp } from './context/AppContext'
import Categories from './pages/Categories'
import Customers from './pages/Customers'
import Dashboard from './pages/Dashboard'
import Offers from './pages/Offers'
import Orders from './pages/Orders'
import POS from './pages/POS'
import Products from './pages/Products'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

const PAGES = {
  dashboard: Dashboard,
  pos: POS,
  products: Products,
  categories: Categories,
  orders: Orders,
  customers: Customers,
  offers: Offers,
  reports: Reports,
  settings: Settings,
}

const TRANSITIONS = {
  enter: { opacity: 0, y: 14, filter: 'blur(4px)' },
  center: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -10, filter: 'blur(4px)' },
}

function Shell() {
  const { page, setPage, toasts, dismissToast, booted, cart } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const [splash, setSplash] = useState(true)
  const [cartSheetOpen, setCartSheetOpen] = useState(false)

  const Current = PAGES[page] || Dashboard

  const openCart = useCallback(() => {
    setPage('pos')
    if (cart.items.length) setCartSheetOpen(true)
  }, [cart.items.length, setPage])

  useEffect(() => {
    document.title = 'Bake & Bloom · Bakery POS'
  }, [])

  useEffect(() => {
    if (!booted) return
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        openCart()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [booted, openCart])

  return (
    <div className="flex min-h-dvh bg-cream-100 text-chocolate-700 transition-colors dark:bg-chocolate-900 dark:text-cream-200">
      <AnimatePresence>{splash && <LoadingScreen key="splash" onDone={() => setSplash(false)} />}</AnimatePresence>

      <Sidebar mobileOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onOpenMenu={() => setMenuOpen(true)} onGoToCart={openCart} />

        <main className="min-w-0 flex-1 px-4 pt-4 pb-28 sm:px-6 lg:pb-8">
          <div className="mx-auto w-full max-w-[1500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={TRANSITIONS.enter}
                animate={TRANSITIONS.center}
                exit={TRANSITIONS.exit}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                <Current cartSheetOpen={cartSheetOpen} setCartSheetOpen={setCartSheetOpen} />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <footer className="no-print hidden items-center justify-between gap-4 border-t border-cream-200 px-6 py-4 text-[11px] text-chocolate-400 lg:flex dark:border-chocolate-700 dark:text-chocolate-400">
          <p>
            <span className="font-semibold text-chocolate-600 dark:text-cream-200">Bake &amp; Bloom</span> · demo workspace with local
            data only
          </p>
          <p className="font-mono">Madurai, Tamil Nadu · +91 98765 43210</p>
        </footer>
      </div>

      <MobileNav onOpenCart={openCart} />
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
