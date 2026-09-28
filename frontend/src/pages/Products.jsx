import { AnimatePresence, motion } from 'framer-motion'
import { CakeSlice, Download, Pencil, Plus, Search, Trash2, TrendingUp, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'
import ProductImage from '../components/ProductImage'
import StatusBadge from '../components/StatusBadge'
import { TableSkeleton } from '../components/Skeleton'
import { CURRENCY } from '../config/brand'
import { useApp } from '../context/AppContext'
import { categoryOrder } from '../data/categories'

const IMAGE_CHOICES = [
  '/images/chocolate-truffle-cake.jpg',
  '/images/black-forest-cake.jpg',
  '/images/red-velvet-cake.jpg',
  '/images/croissant.jpg',
  '/images/classic-brownie.jpg',
  '/images/choc-chip-cookies.jpg',
  '/images/cheesecake-slice.jpg',
  '/images/cold-coffee.jpg',
]

const BLANK = {
  id: null,
  name: '',
  category: 'Cakes',
  price: '',
  cost: '',
  stock: '',
  description: '',
  image: '/images/chocolate-truffle-cake.jpg',
  status: 'Available',
}

export default function Products() {
  const { products, upsertProduct, deleteProduct, pushToast, categories } = useApp()
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('All')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(BLANK)
  const [errors, setErrors] = useState({})
  const [confirm, setConfirm] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 520)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      const catOk = cat === 'All' || p.category === cat
      const qOk = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      return catOk && qOk
    })
  }, [products, query, cat])

  const stats = useMemo(
    () => ({
      total: products.length,
      value: products.reduce((s, p) => s + p.price * p.stock, 0),
      low: products.filter((p) => p.status === 'Low Stock').length,
      out: products.filter((p) => p.status === 'Out of Stock').length,
    }),
    [products],
  )

  const openAdd = () => {
    setForm(BLANK)
    setErrors({})
    setEditing('new')
  }

  const openEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      category: product.category,
      price: String(product.price),
      cost: String(product.cost),
      stock: String(product.stock),
      description: product.description || '',
      image: product.image,
      status: product.status,
    })
    setErrors({})
    setEditing(product.id)
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Product name is required'
    if (!form.price || Number(form.price) <= 0) next.price = 'Enter a valid price'
    if (form.stock === '' || Number(form.stock) < 0) next.stock = 'Enter stock quantity'
    if (form.cost !== '' && Number(form.cost) > Number(form.price)) next.cost = 'Cost cannot exceed price'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) {
      pushToast({ title: 'Check the form', message: 'Some fields need attention.', variant: 'error' })
      return
    }
    upsertProduct({
      id: form.id,
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      cost: Number(form.cost) || 0,
      stock: Number(form.stock),
      description: form.description.trim(),
      image: form.image,
      status:
        form.status === 'Available' && Number(form.stock) === 0
          ? 'Out of Stock'
          : form.status === 'Available' && Number(form.stock) <= 4
            ? 'Low Stock'
            : form.status,
    })
    setEditing(null)
  }

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-chocolate-800 dark:text-cream-100">Products</h1>
          <p className="mt-0.5 text-sm text-chocolate-400 dark:text-chocolate-300">
            {stats.total} products · stock value {CURRENCY(stats.value)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-ghost px-3.5 py-2.5 text-[13px]"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button type="button" onClick={openAdd} className="btn-primary px-4 py-2.5 text-[13px]">
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Total Products', value: stats.total, tone: 'bg-caramel-100 text-caramel-700 dark:bg-chocolate-700 dark:text-caramel-300' },
          { label: 'Low Stock', value: stats.low, tone: 'bg-peach-100 text-peach-500 dark:bg-chocolate-700 dark:text-peach-300' },
          { label: 'Out of Stock', value: stats.out, tone: 'bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-300' },
          { label: 'Stock Value', value: stats.value, prefix: '₹', tone: 'bg-sage-100 text-sage-600 dark:bg-chocolate-700 dark:text-sage-300' },
        ].map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-4"
          >
            <p className="text-[10px] font-bold tracking-[0.1em] text-chocolate-400 uppercase dark:text-chocolate-300">
              {s.label}
            </p>
            <p className={`mt-2 inline-block rounded-lg px-2.5 py-1 font-display text-lg font-semibold ${s.tone}`}>
              {s.prefix || ''}
              {s.value.toLocaleString('en-IN')}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="card p-3.5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-chocolate-300 dark:text-chocolate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="field h-11 pl-10 pr-9"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-chocolate-300 hover:text-chocolate-600 dark:hover:text-cream-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="scroll-thin -mx-1 flex gap-1.5 overflow-x-auto px-1">
            {['All', ...categoryOrder.slice(1)].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`shrink-0 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  cat === c
                    ? 'bg-chocolate-700 text-cream-100 dark:bg-caramel-400 dark:text-chocolate-900'
                    : 'bg-cream-200 text-chocolate-500 hover:bg-cream-300 dark:bg-chocolate-700 dark:text-chocolate-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <TableSkeleton rows={7} cols={6} />
        ) : filtered.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-cream-50 dark:bg-chocolate-900/50">
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-[10px] font-bold tracking-[0.1em] text-chocolate-400 uppercase dark:text-chocolate-300"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200 dark:divide-chocolate-700">
                <AnimatePresence initial={false}>
                  {filtered.map((p) => (
                    <motion.tr
                      key={p.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="transition hover:bg-cream-50 dark:hover:bg-chocolate-900/40"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <ProductImage src={p.image} alt={p.name} seed={p.id.length} className="h-10 w-10 shrink-0" />
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-semibold text-chocolate-800 dark:text-cream-100">{p.name}</p>
                            <p className="truncate text-[11px] text-chocolate-400 dark:text-chocolate-300">{p.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="chip bg-cream-200 text-chocolate-600 dark:bg-chocolate-700 dark:text-chocolate-200">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[13px] font-bold text-chocolate-800 dark:text-cream-100">{CURRENCY(p.price)}</p>
                        <p className="text-[10.5px] text-chocolate-400 dark:text-chocolate-300">cost {CURRENCY(p.cost)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[13px] font-semibold text-chocolate-800 dark:text-cream-100">{p.stock}</p>
                        <p className="flex items-center gap-1 text-[10.5px] text-sage-600 dark:text-sage-300">
                          <TrendingUp className="h-2.5 w-2.5" />
                          {p.sold} sold
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(p)}
                            aria-label={`Edit ${p.name}`}
                            className="btn-icon h-8 w-8 hover:bg-caramel-100 hover:text-caramel-700 dark:hover:bg-chocolate-700"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirm(p)}
                            aria-label={`Delete ${p.name}`}
                            className="btn-icon h-8 w-8 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <EmptyState
              variant="products"
              title={query || cat !== 'All' ? 'No products found' : 'No products yet'}
              message={
                query || cat !== 'All'
                  ? 'Try another search term or reset the category filter to see everything.'
                  : 'Add your first bakery product to start selling at the counter.'
              }
              actionLabel={query || cat !== 'All' ? 'Reset filters' : 'Add Product'}
              onAction={() => {
                if (query || cat !== 'All') {
                  setQuery('')
                  setCat('All')
                } else {
                  openAdd()
                }
              }}
            />
          </div>
        )}
      </div>

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        size="lg"
        icon={CakeSlice}
        title={editing === 'new' ? 'Add New Product' : 'Edit Product'}
        subtitle={editing === 'new' ? 'Create a new item in your bakery catalogue' : form.name}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={() => setEditing(null)} className="btn-ghost px-4 py-2.5">
              Cancel
            </button>
            <button type="button" onClick={submit} className="btn-primary px-5 py-2.5">
              {editing === 'new' ? 'Add Product' : 'Save Changes'}
            </button>
          </div>
        }
      >
        <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <p className="label">Product Name</p>
            <input
              value={form.name}
              onChange={set('name')}
              placeholder="e.g. Chocolate Truffle Cake"
              className={`field ${errors.name ? 'border-red-300' : ''}`}
            />
            {errors.name && <p className="mt-1 text-[11px] text-red-500">{errors.name}</p>}
          </div>

          <div>
            <p className="label">Category</p>
            <select value={form.category} onChange={set('category')} className="field">
              {categoryOrder
                .slice(1)
                .filter((c) => categories.some((x) => x.name === c) || true)
                .map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <p className="label">Status</p>
            <select value={form.status} onChange={set('status')} className="field">
              {['Available', 'Low Stock', 'Out of Stock'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="label">Selling Price</p>
            <div className="relative">
              <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-chocolate-400">₹</span>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={set('price')}
                placeholder="650"
                className={`field pl-8 ${errors.price ? 'border-red-300' : ''}`}
              />
            </div>
            {errors.price && <p className="mt-1 text-[11px] text-red-500">{errors.price}</p>}
          </div>

          <div>
            <p className="label">Cost Price</p>
            <div className="relative">
              <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-chocolate-400">₹</span>
              <input
                type="number"
                min={0}
                value={form.cost}
                onChange={set('cost')}
                placeholder="380"
                className={`field pl-8 ${errors.cost ? 'border-red-300' : ''}`}
              />
            </div>
            {errors.cost && <p className="mt-1 text-[11px] text-red-500">{errors.cost}</p>}
          </div>

          <div>
            <p className="label">Stock Quantity</p>
            <input
              type="number"
              min={0}
              value={form.stock}
              onChange={set('stock')}
              placeholder="12"
              className={`field ${errors.stock ? 'border-red-300' : ''}`}
            />
            {errors.stock && <p className="mt-1 text-[11px] text-red-500">{errors.stock}</p>}
          </div>

          <div>
            <p className="label">Image</p>
            <div className="grid grid-cols-4 gap-2">
              {IMAGE_CHOICES.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, image: src }))}
                  className={`relative overflow-hidden rounded-lg border-2 transition ${
                    form.image === src ? 'border-caramel-400' : 'border-transparent hover:border-cream-300'
                  }`}
                >
                  <ProductImage src={src} alt="option" className="h-12 w-full" />
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <p className="label">Description</p>
            <textarea
              rows={3}
              value={form.description}
              onChange={set('description')}
              placeholder="Short description shown on the billing screen"
              className="field resize-none"
            />
          </div>

          <div className="sm:col-span-2">
            <div className="flex items-center gap-4 rounded-2xl border border-cream-200 bg-cream-50 p-3 dark:border-chocolate-700 dark:bg-chocolate-900/40">
              <ProductImage src={form.image} alt={form.name || 'preview'} className="h-16 w-16 shrink-0" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-chocolate-800 dark:text-cream-100">
                  {form.name || 'Untitled product'}
                </p>
                <p className="truncate text-[11px] text-chocolate-400 dark:text-chocolate-300">
                  {form.category} · {form.stock || 0} in stock · {form.price ? CURRENCY(Number(form.price)) : '₹0'}
                </p>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        size="sm"
        icon={Trash2}
        title="Delete product?"
        subtitle={confirm?.name}
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setConfirm(null)} className="btn-ghost px-4 py-2.5">
              Keep it
            </button>
            <button
              type="button"
              onClick={() => {
                deleteProduct(confirm.id)
                setConfirm(null)
              }}
              className="btn px-4 py-2.5 bg-red-500 text-white hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        }
      >
        <p className="text-sm text-chocolate-500 dark:text-chocolate-300">
          This removes the item from the catalogue and the POS screen. Past orders keep their record. This demo change is
          saved only in your browser.
        </p>
      </Modal>
    </div>
  )
}
