import { AnimatePresence, motion } from 'framer-motion'
import { Check, Plus, PackageX } from 'lucide-react'
import { CURRENCY } from '../config/brand'
import ProductImage from './ProductImage'

export default function ProductCard({ product, index = 0, onAdd, inCartQty = 0 }) {
  const soldOut = product.stock <= 0
  const low = !soldOut && product.stock <= 5

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.32, delay: Math.min(index * 0.025, 0.3), ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="card group flex flex-col overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-200">
        <ProductImage
          src={product.image}
          alt={product.name}
          seed={index}
          rounded="rounded-none"
          className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-chocolate-900/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <span className="absolute top-2.5 left-2.5 rounded-lg bg-white/92 px-2 py-1 text-[10px] font-bold tracking-wide text-chocolate-600 uppercase backdrop-blur dark:bg-chocolate-800/90 dark:text-caramel-300">
          {product.category}
        </span>

        <AnimatePresence>
          {inCartQty > 0 && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 24 }}
              className="absolute top-2.5 right-2.5 grid h-7 min-w-7 place-items-center rounded-lg bg-sage-600 px-1.5 text-[11px] font-bold text-white shadow-md"
            >
              {inCartQty}
            </motion.span>
          )}
        </AnimatePresence>

        {soldOut && (
          <div className="absolute inset-0 grid place-items-center bg-cream-100/80 backdrop-blur-[2px] dark:bg-chocolate-900/75">
            <span className="flex flex-col items-center gap-1.5 text-chocolate-500 dark:text-cream-200">
              <PackageX className="h-6 w-6" />
              <span className="text-[11px] font-bold tracking-wide uppercase">Sold Out</span>
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="line-clamp-2 min-h-[2.25rem] text-[13.5px] leading-snug font-semibold text-chocolate-800 dark:text-cream-100">
          {product.name}
        </h3>

        <div className="mt-2 flex items-end justify-between gap-2">
          <div>
            <p className="font-display text-base leading-none font-semibold text-chocolate-700 dark:text-caramel-300">
              {CURRENCY(product.price)}
            </p>
            <p className="mt-1.5 flex items-center gap-1 text-[10.5px]">
              <span className={`h-1.5 w-1.5 rounded-full ${low ? 'bg-caramel-500' : 'bg-sage-500'}`} />
              <span className={low ? 'font-semibold text-caramel-600 dark:text-caramel-300' : 'text-chocolate-400 dark:text-chocolate-300'}>
                {low ? `Only ${product.stock} left` : `${product.stock} in stock`}
              </span>
            </p>
          </div>
        </div>

        <motion.button
          type="button"
          onClick={() => onAdd?.(product)}
          disabled={soldOut}
          whileTap={{ scale: 0.94 }}
          whileHover={soldOut ? undefined : { scale: 1.03 }}
          className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13px] font-bold transition ${
            soldOut
              ? 'cursor-not-allowed bg-cream-200 text-chocolate-300 dark:bg-chocolate-700 dark:text-chocolate-400'
              : 'bg-chocolate-700 text-cream-100 hover:bg-chocolate-600 hover:shadow-lift dark:bg-caramel-400 dark:text-chocolate-900 dark:hover:bg-caramel-300'
          }`}
        >
          {inCartQty > 0 ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {soldOut ? 'Unavailable' : inCartQty > 0 ? 'Add Another' : 'Add'}
        </motion.button>
      </div>
    </motion.div>
  )
}
