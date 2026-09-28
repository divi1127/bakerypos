import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from 'lucide-react'

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: TriangleAlert,
  info: Info,
  neutral: Info,
}

const TONES = {
  success: 'text-sage-600 dark:text-sage-300',
  error: 'text-red-500',
  warning: 'text-caramel-600 dark:text-caramel-300',
  info: 'text-chocolate-600 dark:text-caramel-300',
  neutral: 'text-chocolate-500 dark:text-chocolate-300',
}

const BARS = {
  success: 'bg-sage-500',
  error: 'bg-red-500',
  warning: 'bg-caramel-400',
  info: 'bg-chocolate-500',
  neutral: 'bg-chocolate-400',
}

export default function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="no-print pointer-events-none fixed inset-x-0 bottom-20 z-[90] flex flex-col items-center gap-2 px-4 sm:bottom-auto sm:right-5 sm:top-5 sm:left-auto sm:items-end sm:px-0">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.variant] || Info
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.94, transition: { duration: 0.18 } }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className="pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl border border-cream-300 bg-white/95 p-3.5 pr-10 shadow-lift backdrop-blur dark:border-chocolate-600 dark:bg-chocolate-800/95"
            >
              <span className={`absolute inset-y-0 left-0 w-1 ${BARS[toast.variant] || BARS.info}`} />
              <div className="flex items-start gap-3">
                <Icon className={`mt-0.5 h-[18px] w-[18px] shrink-0 ${TONES[toast.variant] || TONES.info}`} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-chocolate-800 dark:text-cream-100">{toast.title}</p>
                  {toast.message && (
                    <p className="mt-0.5 truncate text-xs text-chocolate-400 dark:text-chocolate-300">{toast.message}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                aria-label="Dismiss notification"
                className="absolute top-2.5 right-2.5 rounded-lg p-1 text-chocolate-300 transition hover:bg-cream-200 hover:text-chocolate-600 dark:hover:bg-chocolate-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
