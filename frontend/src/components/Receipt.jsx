import { forwardRef } from 'react'
import { BRAND, CURRENCY } from '../config/brand'
import { useApp } from '../context/AppContext'
import { formatDateTime } from '../utils/billing'

const Receipt = forwardRef(function Receipt({ order, compact = false, size }, ref) {
  const { printSize } = useApp()
  if (!order) return null
  const rows = order.items || []
  const totalQty = rows.reduce((s, i) => s + i.qty, 0)
  const thermal = (size || printSize) === 'thermal'
  const roundOff = Number(order.roundOff || 0)

  return (
    <div
      ref={ref}
      data-print-size={thermal ? 'thermal' : 'a4'}
      className={`print-area mx-auto w-full ${
        thermal ? 'max-w-[19rem] text-[11.5px]' : 'max-w-[46rem] text-[13px]'
      } ${compact ? 'rounded-2xl border border-cream-300 bg-white p-4 shadow-soft dark:border-chocolate-600 dark:bg-chocolate-900' : 'bg-white p-5 sm:p-7'}`}
    >
      <div className="text-center">
        <p className={`font-display font-bold tracking-tight text-chocolate-800 ${thermal ? 'text-lg' : 'text-2xl'}`}>
          {BRAND.name}
        </p>
        <p className="mt-0.5 text-[10.5px] text-chocolate-400">{BRAND.address}</p>
        <p className="text-[10.5px] text-chocolate-400">
          {BRAND.phone}
          {!thermal && ` · GSTIN ${BRAND.gstin}`}
        </p>
      </div>

      <div className="my-4 border-t border-dashed border-chocolate-300" />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-bold text-chocolate-800">BILL {order.billNo}</p>
          <p className="text-chocolate-400">{formatDateTime(order.createdAt)}</p>
          <p className="text-chocolate-400">Cashier: {order.cashier || BRAND.admin.name}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-bold text-chocolate-800">{order.customer}</p>
          {order.phone && <p className="text-chocolate-400">{order.phone}</p>}
        </div>
      </div>

      <div className="my-4 border-t border-dashed border-chocolate-300" />

      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] font-bold tracking-[0.1em] text-chocolate-400 uppercase">
          <span>Item</span>
          <span className="flex gap-5">
            <span>Qty</span>
            <span>Amount</span>
          </span>
        </div>
        {rows.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-2">
            <span className="min-w-0 flex-1 break-words text-chocolate-700">
              {item.name}
              <span className="block text-[10px] text-chocolate-400">
                {item.qty} × {CURRENCY(item.price)}
              </span>
            </span>
            <span className={`shrink-0 text-right font-semibold text-chocolate-800 ${thermal ? 'w-16' : 'w-20'}`}>
              {CURRENCY(item.price * item.qty)}
            </span>
          </div>
        ))}
      </div>

      <div className="my-4 border-t border-dashed border-chocolate-300" />

      <div className="space-y-1.5">
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
        {roundOff !== 0 && (
          <div className="flex justify-between">
            <span className="text-chocolate-500">Round Off</span>
            <span className="font-semibold text-chocolate-800">
              {roundOff > 0 ? '+' : '-'}
              {CURRENCY(Math.abs(roundOff))}
            </span>
          </div>
        )}
      </div>

      <div className="my-3 border-t-2 border-chocolate-800" />

      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[11px] font-bold tracking-[0.12em] text-chocolate-800 uppercase">Total</span>
        <span className={`font-display font-bold text-chocolate-800 ${thermal ? 'text-lg' : 'text-2xl'}`}>
          {CURRENCY(order.total)}
        </span>
      </div>

      {order.payment && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-chocolate-500">Payment</span>
          <span className="font-bold text-chocolate-800">{order.payment}</span>
        </div>
      )}

      {order.payment === 'Cash' && (
        <>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-chocolate-500">Cash Received</span>
            <span className="font-bold text-chocolate-800">{CURRENCY(order.cashReceived ?? order.total)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between border-t border-dashed border-chocolate-300 pt-1.5">
            <span className="font-bold text-chocolate-800">Change</span>
            <span className="font-bold text-chocolate-800">{CURRENCY(order.change || 0)}</span>
          </div>
        </>
      )}

      {order.note && (
        <div className="mt-3 rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-[10.5px] text-chocolate-500">
          Note: {order.note}
        </div>
      )}

      <div className="my-4 border-t border-dashed border-chocolate-300" />

      <p className="text-center text-[12px] font-semibold text-chocolate-700">Thank you for visiting!</p>
      <p className="text-center text-[12px] text-peach-500">Visit Again</p>
      <p className="mt-2 text-center font-mono text-[9px] tracking-wider text-chocolate-300">
        {BRAND.shopName.toUpperCase()} · FRESHLY BAKED DAILY
      </p>
    </div>
  )
})

export default Receipt
