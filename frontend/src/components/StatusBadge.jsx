const TONES = {
  Completed: 'bg-sage-100 text-sage-600 dark:bg-sage-900/40 dark:text-sage-300',
  Pending: 'bg-caramel-100 text-caramel-700 dark:bg-caramel-900/40 dark:text-caramel-300',
  Cancelled: 'bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-300',
  Available: 'bg-sage-100 text-sage-600 dark:bg-sage-900/40 dark:text-sage-300',
  'Low Stock': 'bg-caramel-100 text-caramel-700 dark:bg-caramel-900/40 dark:text-caramel-300',
  'Out of Stock': 'bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-300',
  Active: 'bg-sage-100 text-sage-600 dark:bg-sage-900/40 dark:text-sage-300',
  Inactive: 'bg-cream-200 text-chocolate-400 dark:bg-chocolate-700 dark:text-chocolate-300',
  UPI: 'bg-peach-100 text-peach-500 dark:bg-peach-900/30 dark:text-peach-300',
  Cash: 'bg-sage-100 text-sage-600 dark:bg-sage-900/40 dark:text-sage-300',
  Card: 'bg-caramel-100 text-caramel-700 dark:bg-caramel-900/40 dark:text-caramel-300',
  Gold: 'bg-caramel-100 text-caramel-700 dark:bg-caramel-900/40 dark:text-caramel-300',
  Platinum: 'bg-chocolate-100 text-chocolate-600 dark:bg-chocolate-700 dark:text-cream-200',
  Silver: 'bg-cream-200 text-chocolate-500 dark:bg-chocolate-700 dark:text-chocolate-300',
  Bronze: 'bg-peach-100 text-peach-500 dark:bg-peach-900/30 dark:text-peach-300',
}

const DOTS = {
  Completed: 'bg-sage-500',
  Pending: 'bg-caramel-400',
  Cancelled: 'bg-red-500',
  Available: 'bg-sage-500',
  'Low Stock': 'bg-caramel-400',
  'Out of Stock': 'bg-red-500',
  Active: 'bg-sage-500',
  Inactive: 'bg-chocolate-300',
}

export default function StatusBadge({ status, dot = true, className = '' }) {
  const tone = TONES[status] || TONES.Inactive
  return (
    <span className={`chip ${tone} ${className}`}>
      {dot && DOTS[status] && <span className={`h-1.5 w-1.5 rounded-full ${DOTS[status]}`} />}
      {status}
    </span>
  )
}
