import { Printer } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { printBill, PRINT_SIZES } from '../utils/print'

export function PrintSizePicker({ size = 'sm', className = '' }) {
  const { printSize, setPrintSize } = useApp()
  const compact = size === 'sm'

  return (
    <div className={compact ? 'flex gap-1.5' : 'grid grid-cols-2 gap-2'}>
      {PRINT_SIZES.map((option) => {
        const active = printSize === option.id
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setPrintSize(option.id)}
            className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-left transition ${
              active
                ? 'border-caramel-400 bg-caramel-100/70 dark:bg-caramel-500/10'
                : 'border-cream-200 bg-white hover:border-caramel-300 dark:border-chocolate-600 dark:bg-chocolate-900/40'
            } ${className}`}
          >
            <Printer
              className={`shrink-0 ${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} ${
                active ? 'text-caramel-600 dark:text-caramel-300' : 'text-chocolate-400 dark:text-chocolate-300'
              }`}
            />
            <span className="min-w-0">
              <span className="block truncate text-[12.5px] font-semibold text-chocolate-800 dark:text-cream-100">
                {option.label}
              </span>
              {!compact && (
                <span className="block truncate text-[10.5px] text-chocolate-400 dark:text-chocolate-300">
                  {option.hint}
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export function PrintButton({ label = 'Print Bill', className = '', icon: Icon = Printer, size, onPrint }) {
  const { printSize } = useApp()
  return (
    <button
      type="button"
      onClick={() => {
        printBill(size || printSize)
        onPrint?.()
      }}
      className={className}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}
