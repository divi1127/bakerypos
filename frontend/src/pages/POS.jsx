import { AnimatePresence, motion } from 'framer-motion'
import { LayoutGrid, Search, ShoppingBag, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import Cart from '../components/Cart'
import EmptyState from '../components/EmptyState'
import PaymentModal from '../components/PaymentModal'
import ProductCard from '../components/ProductCard'
import { ProductCardSkeleton } from '../components/Skeleton'
import { CURRENCY } from '../config/brand'
import { useApp } from '../context/AppContext'
import { categoryOrder } from '../data/categories'

const PLACEHOLDERS = {
  All: 'Search cake, brownie, bread...',
  Cakes: 'Search cakes...',
  Pastries: 'Search pastries...',
  Breads: 'Search breads...',
  Cookies: 'Search cookies...',
  Brownies: 'Search brownies...',
  Desserts: 'Search desserts...',
  Snacks: 'Search snacks...',
  Beverages: 'Search beverages...',
}

export default function POS({ cartSheetOpen, setCartSheetOpen }) {
  const { products, addToCart, cart, cartCount, shop } = useApp()
  const [activeCat, setActiveCat] = useState('All')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [payOpen, setPayOpen] = useState(false)
  const [paySession, setPaySession] = useState(0)
  const searchRef = useRef(null)
  const gridRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 620)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && query) setQuery('')
      if (e.key === '/' && document.activeElement !== searchRef.current) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [query])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      const catOk = activeCat === 'All' || p.category === activeCat
      const qOk = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      return catOk && qOk
    })
  }, [products, activeCat, query])

  const counts = useMemo(() => {
    const map = { All: products.length }
    products.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + 1
    })
    return map
  }, [products])

  const inCart = useMemo(() => {
    const map = {}
    cart.items.forEach((i) => {
      map[i.id] = (map[i.id] || 0) + i.qty
    })
    return map
  }, [cart.items])

  const handleAdd = (product) => {
    if (shop.status !== 'OPEN') {
      return
    }
    addToCart(product)
  }

  const openCheckout = () => {
    if (!cart.items.length) return
    setCartSheetOpen(false)
    setPaySession((s) => s + 1)
    setPayOpen(true)
  }

  const categories = categoryOrder.filter((c) => c === 'All' || products.some((p) => p.category === c))

  return (
    <div className="flex min-h-0 flex-col gap-4 lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-chocolate-800 dark:text-cream-100">
              POS / Billing
            </h1>
            <p className="mt-0.5 text-sm text-chocolate-400 dark:text-chocolate-300">
              {filtered.length} products · tap to add to the bill
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="chip bg-cream-200 text-chocolate-500 dark:bg-chocolate-700 dark:text-chocolate-300">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {activeCat}
            </span>
          </div>
        </div>

        <div className="card mt-4 p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-chocolate-300 dark:text-chocolate-400" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={PLACEHOLDERS[activeCat] || 'Search products...'}
              className="field h-12 pl-10 pr-10"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-chocolate-300 hover:text-chocolate-600 dark:hover:text-cream-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="scroll-thin -mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 pb-1">
            {categories.map((cat) => {
              const active = activeCat === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCat(cat)}
                  className={`relative shrink-0 rounded-xl px-3.5 py-2 text-[13px] font-semibold transition ${
                    active
                      ? 'text-cream-100 dark:text-chocolate-900'
                      : 'text-chocolate-500 hover:bg-cream-200 dark:text-chocolate-300 dark:hover:bg-chocolate-700'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="pos-cat"
                      className="absolute inset-0 rounded-xl bg-chocolate-700 dark:bg-caramel-400"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative flex items-center gap-1.5">
                    {cat}
                    <span
                      className={`rounded-full px-1.5 text-[10px] font-bold ${
                        active ? 'bg-black/15 dark:bg-chocolate-900/15' : 'bg-cream-200 text-chocolate-400 dark:bg-chocolate-700'
                      }`}
                    >
                      {counts[cat] || 0}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {shop.status !== 'OPEN' && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-caramel-200 bg-caramel-100/70 px-4 py-3 dark:border-caramel-500/30 dark:bg-caramel-500/10">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-caramel-600 dark:bg-chocolate-800 dark:text-caramel-300">
              <ShoppingBag className="h-4 w-4" />
            </span>
            <p className="text-sm text-caramel-700 dark:text-caramel-300">
              Shop is marked closed. Reopen it from the sidebar to resume billing.
            </p>
          </div>
        )}

        <div ref={gridRef} className="scroll-thin mt-4 min-h-0 flex-1 overflow-y-auto pb-4">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length ? (
            <motion.div layout className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    index={i}
                    inCartQty={inCart[p.id] || 0}
                    onAdd={handleAdd}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <EmptyState
              variant="search"
              title={query ? 'No products found' : 'Nothing in this category yet'}
              message={
                query
                  ? `We could not find anything matching “${query}”. Try a different name or clear the search.`
                  : 'This category is empty. Add a product to start selling here.'
              }
              actionLabel={query ? 'Clear search' : 'Manage products'}
              onAction={() => (query ? setQuery('') : null)}
              secondaryLabel={!query ? 'Add product' : undefined}
            />
          )}
        </div>
      </div>

      <aside className="hidden w-[364px] shrink-0 lg:block">
        <div className="card sticky top-[86px] h-[calc(100vh-110px)] overflow-hidden">
          <Cart onCheckout={openCheckout} />
        </div>
      </aside>

      <AnimatePresence>
        {cartSheetOpen && (
          <div className="fixed inset-0 z-[75] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartSheetOpen(false)}
              className="absolute inset-0 bg-chocolate-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="absolute inset-x-0 bottom-0 h-[88vh] overflow-hidden rounded-t-3xl border-t border-cream-300 bg-white shadow-lift dark:border-chocolate-600 dark:bg-chocolate-800"
            >
              <Cart mobile onClose={() => setCartSheetOpen(false)} onCheckout={openCheckout} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {cartCount > 0 && (
        <motion.button
          type="button"
          onClick={() => setCartSheetOpen(true)}
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="btn-accent fixed right-5 bottom-24 z-40 items-center gap-2 rounded-full py-4 pr-5 pl-4 shadow-glow lg:hidden"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-chocolate-800/15">
            <LayoutGrid className="h-4 w-4" />
          </span>
          <span className="text-left leading-tight">
            <span className="block text-[10px] font-semibold tracking-wider uppercase opacity-80">View Bill</span>
            <span className="block text-sm font-bold">
              {cartCount} item{cartCount > 1 ? 's' : ''} · {CURRENCY(
                cart.items.reduce((s, i) => s + i.price * i.qty, 0),
              )}
            </span>
          </span>
        </motion.button>
      )}

      <PaymentModal key={paySession} open={payOpen} onClose={() => setPayOpen(false)} />
    </div>
  )
}
