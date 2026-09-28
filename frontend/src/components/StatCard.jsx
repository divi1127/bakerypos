import { motion } from 'framer-motion'
import CountUp from './CountUp'

const TONES = {
  chocolate: 'bg-chocolate-50 text-chocolate-600 dark:bg-chocolate-700 dark:text-caramel-300',
  caramel: 'bg-caramel-100 text-caramel-600 dark:bg-chocolate-700 dark:text-caramel-300',
  sage: 'bg-sage-100 text-sage-600 dark:bg-chocolate-700 dark:text-sage-300',
  peach: 'bg-peach-100 text-peach-500 dark:bg-chocolate-700 dark:text-peach-300',
}

const BARS = {
  chocolate: 'from-chocolate-400 to-chocolate-600',
  caramel: 'from-caramel-300 to-caramel-500',
  sage: 'from-sage-300 to-sage-500',
  peach: 'from-peach-300 to-peach-500',
}

export default function StatCard({ label, value, prefix = '', suffix = '', icon: Icon, tone = 'chocolate', hint, trend, decimals = 0, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card group relative overflow-hidden p-5"
    >
      <span
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${BARS[tone] || BARS.chocolate} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.1em] text-chocolate-400 uppercase dark:text-chocolate-300">
            {label}
          </p>
          <p className="mt-2 font-display text-2xl leading-none font-semibold text-chocolate-800 sm:text-[28px] dark:text-cream-100">
            <CountUp value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
          </p>
          {hint && (
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-chocolate-400 dark:text-chocolate-300">
              {trend && (
                <span
                  className={`rounded-full px-1.5 py-0.5 font-semibold ${
                    trend >= 0
                      ? 'bg-sage-100 text-sage-600 dark:bg-sage-900/40 dark:text-sage-300'
                      : 'bg-red-50 text-red-500 dark:bg-red-950/40'
                  }`}
                >
                  {trend >= 0 ? '+' : ''}
                  {trend}%
                </span>
              )}
              {hint}
            </p>
          )}
        </div>
        <motion.span
          whileHover={{ rotate: -8, scale: 1.08 }}
          transition={{ type: 'spring', stiffness: 300, damping: 16 }}
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${TONES[tone] || TONES.chocolate}`}
        >
          {Icon && <Icon className="h-5 w-5" />}
        </motion.span>
      </div>
    </motion.div>
  )
}
