import { AnimatePresence, motion } from 'framer-motion'
import {
  Banknote,
  Check,
  CheckCircle2,
  CreditCard,
  Download,
  Loader2,
  Printer,
  QrCode,
  Receipt as ReceiptIcon,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { BRAND, CURRENCY } from '../config/brand'
import { useApp } from '../context/AppContext'
import { computeChange, roundToNearest } from '../utils/billing'
import { printBill } from '../utils/print'
import Modal from './Modal'
import { PrintSizePicker } from './PrintControls'
import Receipt from './Receipt'

const METHODS = [
  { id: 'Cash', icon: Banknote, label: 'Cash', hint: 'Counted at counter' },
  { id: 'UPI', icon: Smartphone, label: 'UPI', hint: 'GPay · PhonePe · Paytm' },
  { id: 'Card', icon: CreditCard, label: 'Card', hint: 'Debit or Credit' },
]

function FakeQr() {
  const cells = 21
  const pattern = useMemo(() => {
    const grid = []
    for (let r = 0; r < cells; r += 1) {
      const row = []
      for (let c = 0; c < cells; c += 1) {
        const finder =
          (r < 7 && c < 7) || (r < 7 && c >= cells - 7) || (r >= cells - 7 && c < 7)
        let on
        if (finder) {
          const rr = r < 7 ? r : r - (cells - 7)
          const cc = c < 7 ? c : c - (cells - 7)
          on = rr === 0 || rr === 6 || cc === 0 || cc === 6 || (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4)
        } else {
          const seed = (r * 31 + c * 17 + r * c) % 7
          on = seed < 3
        }
        row.push(on)
      }
      grid.push(row)
    }
    return grid
  }, [])

  return (
    <div className="mx-auto w-fit rounded-2xl border border-cream-300 bg-white p-3 shadow-soft">
      <svg viewBox={`0 0 ${cells} ${cells}`} className="h-40 w-40 sm:h-44 sm:w-44" shapeRendering="crispEdges">
        <rect width={cells} height={cells} fill="#fff" />
        {pattern.map((row, r) =>
          row.map((on, c) => (on ? <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#2C1D12" /> : null)),
        )}
      </svg>
    </div>
  )
}

function SuccessView({ order, onNewBill, onClose }) {
  const { printSize } = useApp()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center py-2 text-center"
    >
      <div className="relative grid h-24 w-24 place-items-center">
        {[0, 0.35, 0.7].map((delay) => (
          <motion.span
            key={delay}
            initial={{ scale: 0.6, opacity: 0.5 }}
            animate={{ scale: 1.7, opacity: 0 }}
            transition={{ duration: 1.5, delay, repeat: Infinity, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full bg-sage-400"
          />
        ))}
        <motion.span
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
          className="relative grid h-20 w-20 place-items-center rounded-full bg-sage-500 text-white shadow-glow"
        >
          <motion.svg viewBox="0 0 24 24" fill="none" className="h-10 w-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <motion.path
              d="M20 6 9 17l-5-5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, delay: 0.35, ease: 'easeOut' }}
            />
          </motion.svg>
        </motion.span>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-5 font-display text-2xl font-semibold text-chocolate-800 dark:text-cream-100"
      >
        Payment Successful
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        className="mt-1.5 text-sm text-chocolate-400 dark:text-chocolate-300"
      >
        {order.payment} · {CURRENCY(order.total)} received
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.44 }}
        className="mt-5 flex items-center gap-2 rounded-xl border border-cream-300 bg-cream-50 px-4 py-2.5 dark:border-chocolate-600 dark:bg-chocolate-900/50"
      >
        <ReceiptIcon className="h-4 w-4 text-caramel-500" />
        <span className="text-[11px] font-semibold tracking-[0.1em] text-chocolate-400 uppercase dark:text-chocolate-300">Bill</span>
        <span className="font-mono text-sm font-bold text-chocolate-800 dark:text-cream-100">{order.billNo}</span>
      </motion.div>

      {order.change > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-caramel-200 bg-caramel-100 px-4 py-2.5 dark:border-caramel-500/30 dark:bg-caramel-500/10"
        >
          <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.1em] text-caramel-700 uppercase dark:text-caramel-300">
            <Banknote className="h-3.5 w-3.5" />
            Change to return
          </span>
          <span className="font-display text-xl leading-none font-semibold text-caramel-700 dark:text-caramel-300">
            {CURRENCY(order.change)}
          </span>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.56 }}
        className="mt-5 w-full"
      >
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <p className="text-[10px] font-bold tracking-[0.12em] text-chocolate-400 uppercase dark:text-chocolate-300">
            Print Size
          </p>
          <PrintSizePicker />
        </div>
        <Receipt order={order} compact />
      </motion.div>

      <div className="mt-5 grid w-full grid-cols-2 gap-2.5">
        <button type="button" onClick={() => printBill(printSize)} className="btn-ghost col-span-2 py-3 sm:col-span-1">
          <Printer className="h-4 w-4" />
          Print Bill
        </button>
        <button type="button" onClick={() => printBill(printSize)} className="btn-ghost col-span-2 py-3 sm:col-span-1">
          <Download className="h-4 w-4" />
          Download PDF
        </button>
        <button type="button" onClick={onNewBill} className="btn-accent col-span-2 py-3">
          <Sparkles className="h-4 w-4" />
          New Bill
        </button>
      </div>

      <button type="button" onClick={onClose} className="mt-3 text-xs font-semibold text-chocolate-300 hover:text-chocolate-500 dark:text-chocolate-400">
        Close and return to POS
      </button>
    </motion.div>
  )
}

export default function PaymentModal({ open, onClose }) {
  const { cart, totals, completePayment, pushToast, clearCart, printSize, shop } = useApp()
  const [method, setMethod] = useState('UPI')
  const [cashReceived, setCashReceived] = useState('')
  const [stage, setStage] = useState('form')
  const [processing, setProcessing] = useState(false)
  const [order, setOrder] = useState(null)

  const numericCash = Number(cashReceived) || 0
  const delta = computeChange(numericCash, totals.total)
  const change = Math.max(0, delta)
  const short = delta < 0
  const cashValid = method !== 'Cash' || delta >= 0
  const suggestions = useMemo(() => {
    if (!totals.total) return []
    return [...new Set([totals.total, roundToNearest(totals.total, 100), roundToNearest(totals.total, 500), roundToNearest(totals.total, 1000)])]
      .filter((v) => v >= totals.total)
      .sort((a, b) => a - b)
      .slice(0, 4)
  }, [totals.total])

  const pay = () => {
    if (!cashValid) {
      pushToast({ title: 'Amount too low', message: `Enter at least ${CURRENCY(totals.total)}.`, variant: 'error' })
      return
    }
    setProcessing(true)
    window.setTimeout(() => {
      const created = completePayment({ method, cashReceived: method === 'Cash' ? numericCash : undefined })
      setProcessing(false)
      if (created) {
        setOrder(created)
        setStage('success')
        clearCart(true)
        if (shop.autoPrint) window.setTimeout(() => printBill(printSize), 420)
        pushToast({ title: 'Payment completed successfully', message: `${created.billNo} · ${CURRENCY(created.total)}`, variant: 'success' })
      }
    }, 1100)
  }

  const startNewBill = () => {
    clearCart(true)
    setStage('form')
    setOrder(null)
    setCashReceived('')
    pushToast({ title: 'Ready for a new bill', message: 'Cart has been cleared.', variant: 'neutral' })
    onClose?.()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={stage === 'success' ? 'Bill Completed' : 'Complete Payment'}
      subtitle={stage === 'success' ? 'Saved to order history' : `${BRAND.billPrefix} bill · ${cart.items.length} line items`}
      icon={stage === 'success' ? CheckCircle2 : Sparkles}
    >
      <AnimatePresence mode="wait">
        {stage === 'success' && order ? (
          <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SuccessView order={order} onNewBill={startNewBill} onClose={onClose} />
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-5"
          >
            <div className="flex items-center justify-between rounded-2xl bg-chocolate-700 px-5 py-4 text-cream-100 dark:bg-chocolate-900/50">
              <div>
                <p className="text-[10px] font-bold tracking-[0.14em] text-caramel-300 uppercase">Amount Due</p>
                <p className="mt-0.5 text-xs text-cream-300/70">{cart.items.length} items · incl. {BRAND.taxLabel}</p>
              </div>
              <p className="font-display text-3xl leading-none font-semibold">{CURRENCY(totals.total)}</p>
            </div>

            <div>
              <p className="label">Select Payment Method</p>
              <div className="grid grid-cols-3 gap-2.5">
                {METHODS.map((m) => {
                  const Icon = m.icon
                  const active = method === m.id
                  return (
                    <motion.button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id)}
                      whileTap={{ scale: 0.96 }}
                      className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-4 transition ${
                        active
                          ? 'border-caramel-400 bg-caramel-100/70 shadow-soft dark:bg-caramel-500/10'
                          : 'border-cream-200 bg-white hover:border-caramel-300 dark:border-chocolate-600 dark:bg-chocolate-900/40'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="pay-check"
                          className="absolute top-2 right-2 grid h-4 w-4 place-items-center rounded-full bg-caramel-500 text-white"
                        >
                          <Check className="h-2.5 w-2.5" strokeWidth={4} />
                        </motion.span>
                      )}
                      <Icon
                        className={`h-6 w-6 ${active ? 'text-caramel-600 dark:text-caramel-300' : 'text-chocolate-400 dark:text-chocolate-300'}`}
                      />
                      <span className="text-sm font-bold text-chocolate-800 dark:text-cream-100">{m.label}</span>
                      <span className="text-center text-[10px] leading-tight text-chocolate-400 dark:text-chocolate-300">{m.hint}</span>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {method === 'Cash' && (
                <motion.div
                  key="cash"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="label">Amount Received</p>
                      <input
                        type="number"
                        inputMode="numeric"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                        placeholder={String(totals.total)}
                        className={`field h-12 font-mono text-lg font-semibold ${!cashValid ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
                      />
                    </div>
                    <div>
                      <p className="label">Change</p>
                      <div
                        className={`grid h-12 place-items-center rounded-xl border font-mono text-lg font-semibold ${
                          short
                            ? 'border-red-200 bg-red-50 text-red-500 dark:border-red-900/50 dark:bg-red-950/25'
                            : 'border-sage-200 bg-sage-100/70 text-sage-700 dark:border-sage-500/30 dark:bg-sage-900/25 dark:text-sage-300'
                        }`}
                      >
                        {short ? `Short ${CURRENCY(Math.abs(change))}` : CURRENCY(change)}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((s) => (
                      <button key={s} type="button" onClick={() => setCashReceived(String(s))} className="chip border border-cream-300 bg-white text-chocolate-500 hover:border-caramel-400 hover:text-caramel-600 dark:border-chocolate-600 dark:bg-chocolate-700 dark:text-chocolate-200">
                        {CURRENCY(s)}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {method === 'UPI' && (
                <motion.div
                  key="upi"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-3 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-chocolate-400 dark:text-chocolate-300">
                    <QrCode className="h-4 w-4" />
                    Scan with any UPI app
                  </div>
                  <FakeQr />
                  <div className="rounded-xl border border-cream-200 bg-cream-50 px-4 py-3 dark:border-chocolate-600 dark:bg-chocolate-900/50">
                    <p className="text-[10px] font-bold tracking-[0.12em] text-chocolate-400 uppercase dark:text-chocolate-300">UPI ID</p>
                    <p className="mt-0.5 font-mono text-sm font-semibold text-chocolate-800 dark:text-cream-100">{BRAND.upiId}</p>
                    <p className="mt-2 text-[10px] text-chocolate-300 dark:text-chocolate-400">Demo only — no real payment is processed.</p>
                  </div>
                </motion.div>
              )}

              {method === 'Card' && (
                <motion.div
                  key="card"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-3"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-chocolate-700 to-chocolate-500 p-5 text-cream-100 shadow-lift">
                    <div className="flex items-start justify-between">
                      <CreditCard className="h-7 w-7 opacity-80" />
                      <span className="text-xs font-bold tracking-widest text-caramel-300">B&B</span>
                    </div>
                    <p className="mt-6 font-mono text-lg tracking-[0.18em]">•••• •••• •••• 4242</p>
                    <div className="mt-3 flex items-end justify-between text-[10px] uppercase opacity-80">
                      <span>Card Holder</span>
                      <span>12 / 29</span>
                    </div>
                  </div>
                  <p className="flex items-center justify-center gap-1.5 text-[11px] text-chocolate-300 dark:text-chocolate-400">
                    <CheckCircle2 className="h-3.5 w-3.5 text-sage-500" />
                    Insert, swipe or tap — terminal is ready
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="button"
              onClick={pay}
              disabled={processing || !cashValid}
              whileHover={processing || !cashValid ? undefined : { y: -2 }}
              whileTap={{ scale: 0.985 }}
              className="btn-accent w-full py-4 text-sm tracking-[0.08em] uppercase"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing {method}...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {method === 'Cash' ? 'Complete Payment' : `Pay ${CURRENCY(totals.total)}`}
                </>
              )}
            </motion.button>

            <button type="button" onClick={onClose} className="flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-chocolate-300 hover:text-chocolate-500 dark:text-chocolate-400">
              <X className="h-3.5 w-3.5" />
              Cancel and go back to bill
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  )
}
