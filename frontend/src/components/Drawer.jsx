import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { canPortal } from '../utils/portal'

export default function Drawer({ open, onClose, title, subtitle, icon: Icon, badge, children, footer }) {

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
        <div className="fixed inset-0 z-[85] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-chocolate-900/40 backdrop-blur-sm"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="relative flex h-full w-full max-w-md flex-col border-l border-cream-300 bg-white shadow-lift dark:border-chocolate-600 dark:bg-chocolate-800"
          >
            <div className="flex items-start gap-3 border-b border-cream-200 px-5 py-4 dark:border-chocolate-700">
              {Icon && (
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sage-100 text-sage-600 dark:bg-chocolate-700 dark:text-sage-300">
                  <Icon className="h-5 w-5" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-display text-lg leading-tight font-semibold text-chocolate-800 dark:text-cream-100">{title}</h2>
                {subtitle && <p className="mt-0.5 truncate text-xs text-chocolate-400 dark:text-chocolate-300">{subtitle}</p>}
              </div>
              {badge}
              <button type="button" onClick={onClose} aria-label="Close" className="btn-icon -mt-1 -mr-1.5">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="scroll-thin min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">{children}</div>

            {footer && (
              <div className="shrink-0 border-t border-cream-200 bg-cream-50 px-5 py-3.5 dark:border-chocolate-700 dark:bg-chocolate-900/40">
                {footer}
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
