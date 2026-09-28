import { motion } from 'framer-motion'
import { CakeSlice, SearchX, Users, Receipt, PackageOpen, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'

const ART = {
  products: { icon: PackageOpen, ring: 'bg-caramel-100 text-caramel-600 dark:bg-chocolate-700 dark:text-caramel-300' },
  orders: { icon: Receipt, ring: 'bg-sage-100 text-sage-600 dark:bg-chocolate-700 dark:text-sage-300' },
  customers: { icon: Users, ring: 'bg-peach-100 text-peach-500 dark:bg-chocolate-700 dark:text-peach-300' },
  search: { icon: SearchX, ring: 'bg-cream-200 text-chocolate-400 dark:bg-chocolate-700 dark:text-chocolate-300' },
  error: { icon: CakeSlice, ring: 'bg-red-50 text-red-500 dark:bg-chocolate-700' },
}

export default function EmptyState({
  variant = 'search',
  title,
  message,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  compact = false,
}) {
  const art = ART[variant] || ART.search
  const Icon = art.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-cream-300 bg-cream-50/70 text-center dark:border-chocolate-600 dark:bg-chocolate-900/30 ${compact ? 'px-5 py-8' : 'px-6 py-14'}`}
    >
      <div className="relative">
        <span className="absolute inset-0 -m-3 rounded-full bg-caramel-100/60 dark:bg-chocolate-700/40" />
        <span className={`relative grid ${compact ? 'h-12 w-12' : 'h-16 w-16'} place-items-center rounded-2xl ${art.ring}`}>
          <Icon className={compact ? 'h-6 w-6' : 'h-8 w-8'} />
        </span>
      </div>

      <h3 className={`mt-5 font-display font-semibold text-chocolate-800 dark:text-cream-100 ${compact ? 'text-base' : 'text-lg'}`}>
        {title}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-chocolate-400 dark:text-chocolate-300">{message}</p>

      {(actionLabel || secondaryLabel) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {actionLabel && (
            <button type="button" onClick={onAction} className="btn-primary px-4 py-2.5">
              <RefreshCw className="h-4 w-4" />
              {actionLabel}
            </button>
          )}
          {secondaryLabel && (
            <button type="button" onClick={onSecondary} className="btn-ghost px-4 py-2.5">
              {secondaryLabel}
            </button>
          )}
        </div>
      )}

      {!compact && (
        <div className="mt-7 flex items-center gap-4 text-[11px] font-medium tracking-wide text-chocolate-300 uppercase dark:text-chocolate-400">
          <span className="h-px w-10 bg-cream-300 dark:bg-chocolate-600" />
          {BRAND_MOTTO}
          <span className="h-px w-10 bg-cream-300 dark:bg-chocolate-600" />
        </div>
      )}
    </motion.div>
  )
}

const BRAND_MOTTO = 'Freshly baked daily'

export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/60 px-6 py-12 text-center dark:border-red-900/50 dark:bg-red-950/20">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-red-100 text-red-500 dark:bg-red-950/60">
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="2">
          <path d="M12 8v5M12 17h.01" strokeLinecap="round" />
          <path d="M10.3 3.9 2.6 17.3A2 2 0 0 0 4.3 20.3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinejoin="round" />
        </svg>
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold text-chocolate-800 dark:text-cream-100">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-chocolate-500 dark:text-chocolate-300">
        {message || 'This demo could not load that view. Your data is safe — try again in a moment.'}
      </p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-primary mt-5 px-5 py-2.5">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  )
}

export function Delta({ value, suffix = '%' }) {
  const up = value >= 0
  const Icon = up ? TrendingUp : TrendingDown
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        up ? 'bg-sage-100 text-sage-600 dark:bg-sage-900/40 dark:text-sage-300' : 'bg-red-50 text-red-500 dark:bg-red-950/40'
      }`}
    >
      <Icon className="h-3 w-3" />
      {up ? '+' : ''}
      {value}
      {suffix}
    </span>
  )
}
