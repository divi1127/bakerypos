import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { BRAND } from '../config/brand'
import { seedProducts } from '../data/products'
import { seedCategories } from '../data/categories'
import { seedOrders } from '../data/orders'
import { seedCustomers } from '../data/customers'
import { seedOffers } from '../data/offers'
import { KEYS, readCollection, readStore, removeStore, writeStore } from '../utils/storage'
import { buildBillNumber, computeTotals } from '../utils/billing'

const AppContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { product, qty = 1 } = action
      const existing = state.items.find((i) => i.id === product.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, qty: Math.min(i.qty + qty, product.stock) } : i,
          ),
        }
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            stock: product.stock,
            qty: Math.min(qty, product.stock),
          },
        ],
      }
    }
    case 'inc':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: Math.min(i.qty + 1, i.stock) } : i,
        ),
      }
    case 'dec':
      return {
        ...state,
        items: state.items
          .map((i) => (i.id === action.id ? { ...i, qty: i.qty - 1 } : i))
          .filter((i) => i.qty > 0),
      }
    case 'remove':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) }
    case 'clear':
      return { items: [], customerId: null, discount: 0, discountCode: null, note: '' }
    case 'customer':
      return { ...state, customerId: action.customerId }
    case 'discount':
      return { ...state, discount: action.discount, discountCode: action.discountCode ?? null }
    case 'note':
      return { ...state, note: action.note }
    case 'hydrate':
      return action.state
    default:
      return state
  }
}

const emptyCart = { items: [], customerId: null, discount: 0, discountCode: null, note: '' }

export function AppProvider({ children }) {
  const [page, setPage] = useState('dashboard')
  const [theme, setTheme] = useState(() => readStore(KEYS.theme, 'light'))
  const [shop, setShop] = useState(() =>
    readStore(KEYS.shop, { status: 'OPEN', name: BRAND.shopName, address: BRAND.address, phone: BRAND.phone }),
  )
  const [products, setProducts] = useState(() => readCollection(KEYS.products, seedProducts))
  const [categories, setCategories] = useState(() => readCollection(KEYS.categories, seedCategories))
  const [orders, setOrders] = useState(() => readCollection(KEYS.orders, seedOrders))
  const [customers, setCustomers] = useState(() => readCollection(KEYS.customers, seedCustomers))
  const [offers, setOffers] = useState(() => readCollection(KEYS.offers, seedOffers))
  const [billCounter, setBillCounter] = useState(() => readStore(KEYS.billCounter, BRAND.billStart))
  const [cart, dispatch] = useReducer(cartReducer, emptyCart)
  const [toasts, setToasts] = useState([])
  const [booted, setBooted] = useState(false)
  const timers = useRef({})

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    writeStore(KEYS.theme, theme)
  }, [theme])

  useEffect(() => {
    writeStore(KEYS.products, products)
  }, [products])
  useEffect(() => {
    writeStore(KEYS.categories, categories)
  }, [categories])
  useEffect(() => {
    writeStore(KEYS.orders, orders)
  }, [orders])
  useEffect(() => {
    writeStore(KEYS.customers, customers)
  }, [customers])
  useEffect(() => {
    writeStore(KEYS.offers, offers)
  }, [offers])
  useEffect(() => {
    writeStore(KEYS.billCounter, billCounter)
  }, [billCounter])
  useEffect(() => {
    writeStore(KEYS.shop, shop)
  }, [shop])
  useEffect(() => {
    writeStore(KEYS.cart, cart)
  }, [cart])

  useEffect(() => {
    const stored = readStore(KEYS.cart, null)
    if (stored && Array.isArray(stored.items)) {
      const merged = stored.items
        .map((i) => {
          const product = seedProducts.find((p) => p.id === i.id)
          return product ? { ...i, stock: product.stock, price: product.price, name: product.name, image: product.image } : null
        })
        .filter(Boolean)
        .filter((i) => i.qty > 0)
      dispatch({ type: 'hydrate', state: { ...emptyCart, ...stored, items: merged } })
    }
    const t = window.setTimeout(() => setBooted(true), 40)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), [])

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const pushToast = useCallback(
    (toast) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      const entry = { id, variant: 'success', ...toast }
      setToasts((prev) => [...prev.slice(-3), entry])
      timers.current[id] = setTimeout(() => dismissToast(id), entry.duration || 3200)
      return id
    },
    [dismissToast],
  )

  const addToCart = useCallback(
    (product, qty = 1) => {
      if (product.stock <= 0) {
        pushToast({ title: 'Out of stock', message: `${product.name} is not available right now.`, variant: 'error' })
        return false
      }
      dispatch({ type: 'add', product, qty })
      pushToast({ title: 'Added to bill', message: `${product.name} · ${BRAND.currency}${product.price}` })
      return true
    },
    [pushToast],
  )

  const incrementItem = useCallback(
    (id) => {
      const item = cart.items.find((i) => i.id === id)
      if (!item) return
      if (item.qty >= item.stock) {
        pushToast({ title: 'Stock limit reached', message: `Only ${item.stock} in stock.`, variant: 'warning' })
        return
      }
      dispatch({ type: 'inc', id })
    },
    [cart.items, pushToast],
  )

  const decrementItem = useCallback((id) => dispatch({ type: 'dec', id }), [])

  const removeItem = useCallback(
    (id) => {
      const item = cart.items.find((i) => i.id === id)
      dispatch({ type: 'remove', id })
      if (item) pushToast({ title: 'Product removed', message: item.name, variant: 'neutral' })
    },
    [cart.items, pushToast],
  )

  const clearCart = useCallback((silent = false) => {
    dispatch({ type: 'clear' })
    if (!silent) pushToast({ title: 'New bill started', message: 'Cart cleared and ready.', variant: 'neutral' })
  }, [pushToast])

  const setCartCustomer = useCallback((customerId) => dispatch({ type: 'customer', customerId }), [])
  const setCartNote = useCallback((note) => dispatch({ type: 'note', note }), [])
  const setDiscount = useCallback(
    (discount, discountCode) => dispatch({ type: 'discount', discount, discountCode }),
    [],
  )

  const applyOffer = useCallback(
    (offer) => {
      if (!offer.active) {
        pushToast({ title: 'Offer inactive', message: `${offer.title} is currently paused.`, variant: 'error' })
        return false
      }
      const { subtotal } = computeTotals(cart.items, 0)
      if (offer.type === 'Flat') {
        dispatch({ type: 'discount', discount: offer.value, discountCode: offer.code })
        pushToast({ title: 'Offer applied', message: `${offer.title} · -${BRAND.currency}${offer.value}`, variant: 'success' })
        return true
      }
      if (offer.type === 'Percentage') {
      const value = Math.min(Math.round((subtotal * offer.value) / 100), subtotal)
        dispatch({ type: 'discount', discount: value, discountCode: offer.code })
        pushToast({ title: 'Offer applied', message: `${offer.title} · -${BRAND.currency}${value}`, variant: 'success' })
        return true
      }
      if (offer.type === 'BuyXGetY') {
        const eligible = cart.items.filter((i) => i.category === offer.category)
        const cheapest = eligible.sort((a, b) => a.price - b.price)[0]
        if (!cheapest) {
          pushToast({ title: 'Not eligible', message: `Add a ${offer.category} item to use this offer.`, variant: 'warning' })
          return false
        }
        dispatch({ type: 'discount', discount: cheapest.price, discountCode: offer.code })
        pushToast({ title: 'Offer applied', message: `${cheapest.name} is free today.`, variant: 'success' })
        return true
      }
      return false
    },
    [cart.items, pushToast],
  )

  const totals = useMemo(
    () => computeTotals(cart.items, cart.discount, BRAND.taxRate),
    [cart.items, cart.discount],
  )

  const cartCustomer = useMemo(
    () => customers.find((c) => c.id === cart.customerId) || null,
    [customers, cart.customerId],
  )

  const completePayment = useCallback(
    ({ method, cashReceived }) => {
      if (!cart.items.length) {
        pushToast({ title: 'Cart is empty', message: 'Add a product before taking payment.', variant: 'error' })
        return null
      }
      const billNo = buildBillNumber(billCounter)
      const order = {
        id: `o-${billCounter}`,
        billNo,
        customerId: cart.customerId,
        customer: cartCustomer ? cartCustomer.name : 'Walk-in Customer',
        phone: cartCustomer ? cartCustomer.phone : '',
        items: cart.items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        subtotal: totals.subtotal,
        discount: totals.discount,
        tax: totals.tax,
        total: totals.total,
        payment: method,
        cashReceived: method === 'Cash' ? Number(cashReceived || totals.total) : undefined,
        change: method === 'Cash' ? Number(cashReceived || 0) - totals.total : undefined,
        status: 'Completed',
        note: cart.note,
        createdAt: new Date().toISOString(),
        cashier: BRAND.admin.name,
      }
      setOrders((prev) => [order, ...prev])
      setBillCounter((prev) => prev + 1)
      setProducts((prev) =>
        prev.map((p) => (cart.items.find((i) => i.id === p.id)
          ? {
              ...p,
              stock: Math.max(0, p.stock - (cart.items.find((i) => i.id === p.id)?.qty || 0)),
              sold: p.sold + (cart.items.find((i) => i.id === p.id)?.qty || 0),
              status:
                p.stock - (cart.items.find((i) => i.id === p.id)?.qty || 0) <= 0 ? 'Out of Stock' : p.stock <= 4 ? 'Low Stock' : 'Available',
            }
          : p)),
      )
      if (cartCustomer) {
        setCustomers((prev) =>
          prev.map((c) =>
            c.id === cart.customerId
              ? {
                  ...c,
                  orders: c.orders + 1,
                  spent: Math.round((c.spent + totals.total) * 100) / 100,
                  lastVisit: 'Just now',
                }
              : c,
          ),
        )
      }
      return order
    },
    [billCounter, cart, cartCustomer, pushToast, setBillCounter, totals],
  )

  const upsertProduct = useCallback(
    (payload) => {
      const exists = products.some((p) => p.id === payload.id)
      if (exists) {
        setProducts((prev) => prev.map((p) => (p.id === payload.id ? { ...p, ...payload } : p)))
        pushToast({ title: 'Product updated', message: payload.name, variant: 'success' })
      } else {
        const id = `p-${String(Date.now()).slice(-6)}`
        setProducts((prev) => [
          { sold: 0, featured: false, ...payload, id, stock: Number(payload.stock) || 0, price: Number(payload.price) || 0 },
          ...prev,
        ])
        pushToast({ title: 'Product added', message: payload.name, variant: 'success' })
      }
    },
    [products, pushToast],
  )

  const deleteProduct = useCallback(
    (id) => {
      const product = products.find((p) => p.id === id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      if (product) pushToast({ title: 'Product deleted', message: product.name, variant: 'neutral' })
    },
    [products, pushToast],
  )

  const upsertCategory = useCallback(
    (payload) => {
      const exists = categories.some((c) => c.id === payload.id)
      if (exists) {
        setCategories((prev) => prev.map((c) => (c.id === payload.id ? { ...c, ...payload } : c)))
        pushToast({ title: 'Category updated', message: payload.name, variant: 'success' })
      } else {
        const id = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        setCategories((prev) => [...prev, { icon: 'CakeSlice', color: 'caramel', active: true, ...payload, id }])
        pushToast({ title: 'Category created', message: payload.name, variant: 'success' })
      }
    },
    [categories, pushToast],
  )

  const deleteCategory = useCallback(
    (id) => {
      const category = categories.find((c) => c.id === id)
      setCategories((prev) => prev.filter((c) => c.id !== id))
      if (category) pushToast({ title: 'Category deleted', message: category.name, variant: 'neutral' })
    },
    [categories, pushToast],
  )

  const upsertOffer = useCallback(
    (payload) => {
      const exists = offers.some((o) => o.id === payload.id)
      if (exists) {
        setOffers((prev) => prev.map((o) => (o.id === payload.id ? { ...o, ...payload } : o)))
        pushToast({ title: 'Offer updated', message: payload.title, variant: 'success' })
      } else {
        setOffers((prev) => [{ color: 'caramel', active: true, featured: false, used: 0, revenue: 0, ...payload, id: `ofr-${Date.now()}` }, ...prev])
        pushToast({ title: 'Offer created', message: payload.title, variant: 'success' })
      }
    },
    [offers, pushToast],
  )

  const deleteOffer = useCallback(
    (id) => {
      const offer = offers.find((o) => o.id === id)
      setOffers((prev) => prev.filter((o) => o.id !== id))
      if (offer) pushToast({ title: 'Offer deleted', message: offer.title, variant: 'neutral' })
    },
    [offers, pushToast],
  )

  const toggleOffer = useCallback(
    (id) => {
      const offer = offers.find((o) => o.id === id)
      setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, active: !o.active } : o)))
      if (offer) {
        pushToast({
          title: offer.active ? 'Offer paused' : 'Offer is live',
          message: offer.title,
          variant: offer.active ? 'neutral' : 'success',
        })
      }
    },
    [offers, pushToast],
  )

  const updateOrderStatus = useCallback(
    (id, status) => {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
      pushToast({ title: 'Order updated', message: `Marked as ${status.toLowerCase()}.`, variant: status === 'Completed' ? 'success' : 'neutral' })
    },
    [pushToast],
  )

  const addCustomer = useCallback(
    (payload) => {
      setCustomers((prev) => [
        {
          id: `c-${String(Date.now()).slice(-5)}`,
          orders: 0,
          spent: 0,
          lastVisit: 'Just now',
          tier: 'Bronze',
          joined: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
          ...payload,
        },
        ...prev,
      ])
      pushToast({ title: 'Customer added', message: payload.name, variant: 'success' })
    },
    [pushToast],
  )

  const resetDemo = useCallback(() => {
    removeStore(KEYS.products)
    removeStore(KEYS.orders)
    removeStore(KEYS.customers)
    removeStore(KEYS.categories)
    removeStore(KEYS.offers)
    removeStore(KEYS.cart)
    removeStore(KEYS.billCounter)
    setProducts(seedProducts)
    setCategories(seedCategories)
    setOrders(seedOrders)
    setCustomers(seedCustomers)
    setOffers(seedOffers)
    setBillCounter(BRAND.billStart)
    dispatch({ type: 'clear' })
    pushToast({ title: 'Demo data restored', message: 'All demo records are back to defaults.', variant: 'success' })
  }, [pushToast])

  const value = useMemo(
    () => ({
      page,
      setPage,
      theme,
      toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
      shop,
      setShop,
      products,
      categories,
      orders,
      customers,
      offers,
      cart,
      cartCount: cart.items.reduce((s, i) => s + i.qty, 0),
      cartCustomer,
      totals,
      toasts,
      booted,
      pushToast,
      dismissToast,
      addToCart,
      incrementItem,
      decrementItem,
      removeItem,
      clearCart,
      setCartCustomer,
      setCartNote,
      setDiscount,
      applyOffer,
      completePayment,
      upsertProduct,
      deleteProduct,
      upsertCategory,
      deleteCategory,
      upsertOffer,
      deleteOffer,
      toggleOffer,
      updateOrderStatus,
      addCustomer,
      resetDemo,
    }),
    [
      page, theme, shop, products, categories, orders, customers, offers, cart, cartCustomer, totals,
      toasts, booted, pushToast, dismissToast, addToCart, incrementItem, decrementItem, removeItem,
      clearCart, setCartCustomer, setCartNote, setDiscount, applyOffer, completePayment, upsertProduct,
      deleteProduct, upsertCategory, deleteCategory, upsertOffer, deleteOffer, toggleOffer,
      updateOrderStatus, addCustomer, resetDemo,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
