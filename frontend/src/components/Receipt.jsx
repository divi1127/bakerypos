import { Download, Printer } from 'lucide-react'
import { forwardRef } from 'react'
import { BRAND, CURRENCY } from '../config/brand'
import { formatDateTime } from '../utils/billing'

const Receipt = forwardRef(function Receipt({ order, compact = false }, ref) {
  if (!order) return null
  const rows = order.items || []
  const totalQty = rows.reduce((s, i) => s + i.qty, 0)

  return (
    <div
      ref={ref}
      className={`print-area mx-auto w-full ${compact ? 'max-w-sm rounded-2xl border border-cream-300 bg-white p-5 shadow-soft dark:border-chocolate-600 dark:bg-chocolate-900' : 'max-w-md bg-white p-7'}`}
    >
      <div className="text-center">
        <p className="font-display text-xl font-bold tracking-tight text-chocolate-800">{BRAND.name}</p>
        <p className="mt-0.5 text-[11px] text-chocolate-400">{BRAND.address}</p>
        <p className="text-[11px] text-chocolate-400">
          {BRAND.phone} · GSTIN {BRAND.gstin}
        </p>
      </div>

      <div className="my-4 border-t border-dashed border-chocolate-300" />

      <div className="flex items-start justify-between text-[11.5px]">
        <div>
          <p className="font-bold text-chocolate-800">BILL {order.billNo}</p>
          <p className="text-chocolate-400">{formatDateTime(order.createdAt)}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-chocolate-800">{order.customer}</p>
          {order.phone && <p className="text-chocolate-400">{order.phone}</p>}
        </div>
      </div>

      <div className="my-4 border-t border-dashed border-chocolate-300" />

      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold tracking-[0.1em] text-chocolate-400 uppercase">
          <span>Item</span>
          <span className="flex gap-6">
            <span>Qty</span>
            <span>Amount</span>
          </span>
        </div>
        {rows.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-3 text-[12px]">
            <span className="min-w-0 flex-1 text-chocolate-700">{item.name}</span>
            <span className="shrink-0 font-mono text-chocolate-400">
              {item.qty} × {CURRENCY(item.price)}
            </span>
            <span className="w-14 shrink-0 text-right font-semibold text-chocolate-800">
              {CURRENCY(item.price * item.qty)}
            </span>
          </div>
        ))}
      </div>

      <div className="my-4 border-t border-dashed border-chocolate-300" />

      <div className="space-y-1.5 text-[12px]">
        <div className="flex justify-between">
          <span className="text-chocolate-500">Subtotal ({totalQty} items)</span>
          <span className="font-semibold text-chocolate-800">{CURRENCY(order.subtotal)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between">
            <span className="text-chocolate-500">
              Discount{order.discountCode ? ` (${order.discountCode})` : ''}
            </span>
            <span className="font-semibold text-sage-600">-{CURRENCY(order.discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-chocolate-500">{BRAND.taxLabel}</span>
          <span className="font-semibold text-chocolate-800">{CURRENCY(order.tax)}</span>
        </div>
      </div>

      <div className="my-3 border-t-2 border-chocolate-800" />

      <div className="flex items-baseline justify-between">
        <span className="text-[11px] font-bold tracking-[0.12em] text-chocolate-800 uppercase">Total</span>
        <span className="font-display text-xl font-bold text-chocolate-800">{CURRENCY(order.total)}</span>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11.5px]">
        <span className="text-chocolate-500">Payment</span>
        <span className="font-bold text-chocolate-800">{order.payment}</span>
      </div>
      {order.change > 0 && (
        <div className="mt-1 flex items-center justify-between text-[11.5px]">
          <span className="text-chocolate-500">Change</span>
          <span className="font-bold text-chocolate-800">{CURRENCY(order.change)}</span>
        </div>
      )}

      {order.note && (
        <div className="mt-3 rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-[11px] text-chocolate-500">
          Note: {order.note}
        </div>
      )}

      <div className="my-4 border-t border-dashed border-chocolate-300" />

      <p className="text-center text-[12px] font-semibold text-chocolate-700">Thank you for visiting!</p>
      <p className="text-center text-[12px] text-peach-500">Visit Again ❤️</p>
      <p className="mt-2 text-center font-mono text-[9.5px] tracking-wider text-chocolate-300">
        {BRAND.shopName.toUpperCase()} · FRESHLY BAKED DAILY
      </p>
    </div>
  )
})

export default Receipt

export function ReceiptActions({ className = '' }) {
  return (
    <div className={`no-print flex flex-wrap items-center gap-2 ${className}`}>
      <button type="button" onClick={() => window.print()} className="btn-ghost px-4 py-2.5">
        <Printer className="h-4 w-4" />
        Print Receipt
      </button>
      <button type="button" onClick={() => window.print()} className="btn-primary px-4 py-2.5">
        <Download className="h-4 w-4" />
        Download Receipt
      </button>
    </div>
  )
}
