import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { canPortal } from '../utils/portal'

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
}

export default function Modal({ open, onClose, title, subtitle, icon: Icon, size = 'md', children, footer }) {

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!canPortal()) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-chocolate-900/45 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            className={`relative flex max-h-[92dvh] w-full ${SIZES[size]} flex-col overflow-hidden rounded-t-3xl border border-cream-300 bg-white shadow-lift sm:rounded-3xl dark:border-chocolate-600 dark:bg-chocolate-800`}
          >
            <div className="flex items-start gap-3 border-b border-cream-200 px-5 py-4 sm:px-6 dark:border-chocolate-700">
              {Icon && (
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-caramel-100 text-caramel-600 dark:bg-chocolate-700 dark:text-caramel-300">
                  <Icon className="h-5 w-5" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-lg leading-tight font-semibold text-chocolate-800 dark:text-cream-100">{title}</h2>
                {subtitle && <p className="mt-0.5 text-xs text-chocolate-400 dark:text-chocolate-300">{subtitle}</p>}
              </div>
              <button type="button" onClick={onClose} aria-label="Close" className="btn-icon -mt-1 -mr-1.5">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="scroll-thin min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
              {children}
            </div>

            {footer && (
              <div className="shrink-0 border-t border-cream-200 bg-cream-50 px-5 py-3.5 sm:px-6 dark:border-chocolate-700 dark:bg-chocolate-900/40">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
