import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronDown,
  Minus,
  Percent,
  Plus,
  Receipt,
  ShoppingBag,
  Trash2,
  UserRound,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { BRAND, CURRENCY } from '../config/brand'
import { useApp } from '../context/AppContext'
import { lineTotal } from '../utils/billing'
import EmptyState from './EmptyState'
import ProductImage from './ProductImage'

function CustomerPicker({ value, onChange, customers }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const filtered = customers.filter((c) =>
    `${c.name} ${c.phone}`.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2.5 rounded-xl border border-cream-300 bg-white px-3 py-2.5 text-left transition hover:border-caramel-300 dark:border-chocolate-600 dark:bg-chocolate-700"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-peach-100 text-peach-500 dark:bg-chocolate-800 dark:text-peach-300">
          <UserRound className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold tracking-[0.1em] text-chocolate-400 uppercase dark:text-chocolate-300">
            Customer
          </p>
          <p className="truncate text-sm font-semibold text-chocolate-800 dark:text-cream-100">
            {value ? value.name : 'Walk-in Customer'}
          </p>
        </div>
        <ChevronDown className={`h-4 w-4 shrink-0 text-chocolate-300 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="absolute right-0 left-0 z-40 mt-2 overflow-hidden rounded-2xl border border-cream-300 bg-white shadow-lift dark:border-chocolate-600 dark:bg-chocolate-800"
            >
              <div className="border-b border-cream-200 p-2 dark:border-chocolate-700">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name or phone..."
                  className="field h-9 text-[13px]"
                />
              </div>
              <ul className="scroll-thin max-h-56 overflow-y-auto p-1.5">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(null)
                      setOpen(false)
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition hover:bg-cream-100 dark:hover:bg-chocolate-700"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-cream-200 text-chocolate-400 dark:bg-chocolate-800">
                      <UserRound className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[13px] font-medium text-chocolate-600 dark:text-cream-200">Walk-in Customer</span>
                  </button>
                </li>
                {filtered.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(c.id)
                        setOpen(false)
                        setQuery('')
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition hover:bg-cream-100 dark:hover:bg-chocolate-700 ${
                        value?.id === c.id ? 'bg-caramel-100 dark:bg-chocolate-700' : ''
                      }`}
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-caramel-200 to-caramel-400 text-[10px] font-bold text-chocolate-800">
                        {c.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-chocolate-800 dark:text-cream-100">{c.name}</p>
                        <p className="text-[11px] text-chocolate-400 dark:text-chocolate-300">{c.phone}</p>
                      </div>
                    </button>
                  </li>
                ))}
                {!filtered.length && (
                  <li className="px-3 py-4 text-center text-xs text-chocolate-400 dark:text-chocolate-300">
                    No customer found
                  </li>
                )}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Cart({ onClose, onCheckout, mobile = false }) {
  const {
    cart,
    cartCustomer,
    customers,
    totals,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
    setCartCustomer,
    setCartNote,
    setDiscount,
    orders,
    offers,
    applyOffer,
  } = useApp()

  const billNumber = useMemo(() => {
    const highest = orders.reduce((max, o) => {
      const num = Number(String(o.billNo).split('-')[1])
      return Number.isFinite(num) && num > max ? num : max
    }, BRAND.billStart - 1)
    return `${BRAND.billPrefix}-${highest + 1}`
  }, [orders])

  const [showDiscount, setShowDiscount] = useState(false)
  const [discountInput, setDiscountInput] = useState(String(cart.discount || ''))
  const [offerOpen, setOfferOpen] = useState(false)
  const [noteOpen, setNoteOpen] = useState(false)

  const activeOffers = offers.filter((o) => o.active)

  return (
    <div className="flex h-full flex-col bg-white dark:bg-chocolate-800">
      <div className="flex items-start gap-3 border-b border-cream-200 px-4 py-3.5 dark:border-chocolate-700">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-chocolate-700 text-cream-100 dark:bg-caramel-400 dark:text-chocolate-900">
          <Receipt className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold tracking-[0.14em] text-caramel-600 uppercase dark:text-caramel-400">
            Current Bill
          </p>
          <p className="font-display text-lg leading-tight font-semibold text-chocolate-800 dark:text-cream-100">
            {billNumber}
          </p>
        </div>
        {mobile && (
          <button type="button" onClick={onClose} aria-label="Close bill" className="btn-icon -mt-1 -mr-1.5">
            <X className="h-4 w-4" />
          </button>
        )}
        {cart.items.length > 0 && (
          <button
            type="button"
            onClick={() => clearCart()}
            className="btn-soft hidden px-2.5 py-2 text-xs sm:inline-flex"
          >
            Clear
          </button>
        )}
      </div>

      <div className="border-b border-cream-200 px-4 py-3 dark:border-chocolate-700">
        <CustomerPicker value={cartCustomer} onChange={setCartCustomer} customers={customers} />
      </div>

      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {cart.items.length === 0 ? (
          <EmptyState
            compact
            variant="orders"
            title="Your bill is empty"
            message="Tap a product to add it. Everything you add shows up here instantly."
          />
        ) : (
          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {cart.items.map((item) => (
                <motion.li
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 26, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 40, scale: 0.9, transition: { duration: 0.18 } }}
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  className="group relative overflow-hidden rounded-xl border border-cream-200 bg-cream-50/70 p-2.5 dark:border-chocolate-700 dark:bg-chocolate-900/40"
                >
                  <div className="flex items-center gap-2.5">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      seed={item.id.length}
                      className="h-11 w-11 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-chocolate-800 dark:text-cream-100">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-chocolate-400 dark:text-chocolate-300">
                        {CURRENCY(item.price)} × {item.qty}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-display text-sm font-semibold text-chocolate-800 dark:text-caramel-300">
                        {CURRENCY(lineTotal(item))}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => decrementItem(item.id)}
                          aria-label={`Decrease ${item.name}`}
                          className="grid h-6 w-6 place-items-center rounded-md border border-cream-300 bg-white text-chocolate-600 transition hover:border-caramel-400 hover:text-caramel-600 dark:border-chocolate-600 dark:bg-chocolate-700 dark:text-cream-200"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <motion.span
                          key={item.qty}
                          initial={{ scale: 1.4 }}
                          animate={{ scale: 1 }}
                          className="w-5 text-center text-[13px] font-bold text-chocolate-800 dark:text-cream-100"
                        >
                          {item.qty}
                        </motion.span>
                        <button
                          type="button"
                          onClick={() => incrementItem(item.id)}
                          aria-label={`Increase ${item.name}`}
                          className="grid h-6 w-6 place-items-center rounded-md border border-cream-300 bg-white text-chocolate-600 transition hover:border-caramel-400 hover:text-caramel-600 dark:border-chocolate-600 dark:bg-chocolate-700 dark:text-cream-200"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="absolute top-1.5 right-1.5 rounded-md p-1 text-chocolate-300 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 focus:opacity-100 dark:hover:bg-red-950/40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}

        {cart.items.length > 0 && (
          <div className="mt-3 space-y-2">
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setShowDiscount((v) => !v)}
                className="chip border border-cream-300 bg-white text-chocolate-500 hover:border-caramel-400 hover:text-caramel-600 dark:border-chocolate-600 dark:bg-chocolate-700 dark:text-chocolate-200"
              >
                <Percent className="h-3 w-3" />
                Discount
                {cart.discount > 0 && (
                  <span className="rounded-full bg-caramel-400 px-1.5 text-[10px] font-bold text-chocolate-900">
                    {CURRENCY(cart.discount)}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setOfferOpen((v) => !v)}
                className="chip border border-cream-300 bg-white text-chocolate-500 hover:border-caramel-400 hover:text-caramel-600 dark:border-chocolate-600 dark:bg-chocolate-700 dark:text-chocolate-200"
              >
                <ShoppingBag className="h-3 w-3" />
                Apply Offer
                {cart.discountCode && (
                  <span className="rounded-full bg-sage-500 px-1.5 text-[10px] font-bold text-white">{cart.discountCode}</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setNoteOpen((v) => !v)}
                className="chip border border-cream-300 bg-white text-chocolate-500 hover:border-caramel-400 hover:text-caramel-600 dark:border-chocolate-600 dark:bg-chocolate-700 dark:text-chocolate-200"
              >
                Note
              </button>
            </div>

            <AnimatePresence>
              {showDiscount && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-2 rounded-xl border border-cream-200 bg-white p-2.5 dark:border-chocolate-700 dark:bg-chocolate-900/50">
                    <input
                      type="number"
                      min={0}
                      max={totals.subtotal}
                      value={discountInput}
                      onChange={(e) => setDiscountInput(e.target.value)}
                      placeholder="0"
                      className="field h-9"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setDiscount(Number(discountInput) || 0)
                        setShowDiscount(false)
                      }}
                      className="btn-primary px-3.5"
                    >
                      Apply
                    </button>
                    {cart.discount > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setDiscount(0)
                          setDiscountInput('')
                        }}
                        className="btn-ghost px-3"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {offerOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="scroll-thin max-h-44 space-y-1.5 overflow-y-auto rounded-xl border border-cream-200 bg-white p-2 dark:border-chocolate-700 dark:bg-chocolate-900/50">
                    {activeOffers.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => {
                          applyOffer(o)
                          setOfferOpen(false)
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-caramel-100 dark:hover:bg-chocolate-700"
                      >
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-peach-100 text-[10px] font-bold text-peach-500 dark:bg-chocolate-800 dark:text-peach-300">
                          {o.type === 'Percentage' ? `${o.value}%` : o.type === 'Flat' ? `₹${o.value}` : '2+1'}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12.5px] font-semibold text-chocolate-800 dark:text-cream-100">{o.title}</p>
                          <p className="truncate text-[10.5px] text-chocolate-400 dark:text-chocolate-300">{o.category}</p>
                        </div>
                        <span className="shrink-0 rounded-md bg-cream-100 px-1.5 py-0.5 font-mono text-[10px] text-chocolate-400 dark:bg-chocolate-800">
                          {o.code}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {noteOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <textarea
                    rows={2}
                    value={cart.note}
                    onChange={(e) => setCartNote(e.target.value)}
                    placeholder="Add a note for the kitchen, e.g. write 'Happy Birthday' on the cake"
                    className="field resize-none text-[13px]"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="border-t border-cream-200 bg-cream-50 px-4 py-3.5 dark:border-chocolate-700 dark:bg-chocolate-900/40">
        <dl className="space-y-1.5 text-[13px]">
          <div className="flex items-center justify-between">
            <dt className="text-chocolate-500 dark:text-chocolate-300">Subtotal</dt>
            <dd className="font-semibold text-chocolate-800 dark:text-cream-100">{CURRENCY(totals.subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-chocolate-500 dark:text-chocolate-300">
              Discount {cart.discountCode && <span className="ml-1 font-mono text-[10px] text-caramel-600">{cart.discountCode}</span>}
            </dt>
            <dd className={`font-semibold ${totals.discount ? 'text-sage-600 dark:text-sage-300' : 'text-chocolate-300 dark:text-chocolate-400'}`}>
              {totals.discount ? `-${CURRENCY(totals.discount)}` : CURRENCY(0)}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-chocolate-500 dark:text-chocolate-300">{BRAND.taxLabel}</dt>
            <dd className="font-semibold text-chocolate-800 dark:text-cream-100">{CURRENCY(totals.tax)}</dd>
          </div>
          {totals.roundOff !== 0 && (
            <div className="flex items-center justify-between">
              <dt className="text-chocolate-500 dark:text-chocolate-300">Round Off</dt>
              <dd className="font-semibold text-chocolate-800 dark:text-cream-100">
                {totals.roundOff > 0 ? '+' : '-'}
                {CURRENCY(Math.abs(totals.roundOff))}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-3 flex items-end justify-between border-t border-dashed border-cream-300 pt-3 dark:border-chocolate-600">
          <span className="text-[11px] font-bold tracking-[0.12em] text-chocolate-400 uppercase dark:text-chocolate-300">
            Grand Total
          </span>
          <motion.span
            key={totals.total}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            className="font-display text-2xl leading-none font-semibold text-chocolate-800 dark:text-caramel-300"
          >
            {CURRENCY(totals.total)}
          </motion.span>
        </div>

        <motion.button
          type="button"
          onClick={onCheckout}
          disabled={!cart.items.length}
          whileHover={cart.items.length ? { y: -2 } : undefined}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 26 }}
          className="btn-accent mt-3.5 w-full py-3.5 text-[13px] tracking-[0.08em] uppercase disabled:shadow-none"
        >
          Proceed to Payment
        </motion.button>
        <p className="mt-2 text-center text-[10.5px] text-chocolate-300 dark:text-chocolate-400">{BRAND.currencyNote}</p>
      </div>
    </div>
  )
}
