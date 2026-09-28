import { AnimatePresence, motion } from 'framer-motion'
import { CakeSlice } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BRAND } from '../config/brand'

export default function LoadingScreen({ onDone }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const hide = window.setTimeout(() => setVisible(false), 1900)
    const done = window.setTimeout(onDone, 2250)
    return () => {
      window.clearTimeout(hide)
      window.clearTimeout(done)
    }
  }, [onDone])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-cream-100"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '-110%', opacity: [0, 0.35, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, delay: i * 0.24, ease: 'linear' }}
                className="absolute h-2 w-2 rounded-full bg-caramel-300/70"
                style={{ left: `${6 + i * 6.6}%` }}
              />
            ))}
          </div>

          <div className="flex flex-col items-center px-8 text-center">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="relative"
            >
              <span className="absolute inset-0 -m-4 rounded-full bg-caramel-200/50" />
              <motion.span
                animate={{ rotate: [0, -6, 6, -4, 0], y: [0, -4, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative grid h-20 w-20 place-items-center rounded-3xl bg-chocolate-700 shadow-lift dark:bg-caramel-400"
              >
                <CakeSlice className="h-10 w-10 text-caramel-200 dark:text-chocolate-900" />
              </motion.span>
              <motion.span
                animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0, 0.35] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-0 rounded-3xl border-2 border-caramel-400"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-8 font-display text-2xl font-semibold tracking-tight text-chocolate-800 sm:text-3xl"
            >
              {BRAND.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-1.5 text-xs tracking-[0.18em] text-chocolate-400 uppercase"
            >
              {BRAND.tagline}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ delay: 0.5, duration: 1.8, repeat: Infinity }}
              className="mt-10 text-sm text-chocolate-500"
            >
              Preparing something delicious...
            </motion.p>

            <div className="mt-5 h-1 w-48 overflow-hidden rounded-full bg-cream-300">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                className="h-full w-1/2 rounded-full bg-gradient-to-r from-caramel-300 to-caramel-500"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
