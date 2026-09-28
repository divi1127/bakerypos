export const KEYS = {
  theme: 'bb.theme',
  cart: 'bb.cart',
  products: 'bb.products',
  orders: 'bb.orders',
  customers: 'bb.customers',
  categories: 'bb.categories',
  offers: 'bb.offers',
  billCounter: 'bb.billCounter',
  shop: 'bb.shop',
}

export function readStore(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeStore(key, value) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full or unavailable - demo keeps working in memory */
  }
}

export function removeStore(key) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* noop */
  }
}

export function readCollection(key, seed) {
  const stored = readStore(key, null)
  if (!Array.isArray(stored) || stored.length === 0) {
    writeStore(key, seed)
    return seed
  }
  return stored
}
