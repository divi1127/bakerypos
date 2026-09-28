import { motion } from 'framer-motion'
import {
  CakeSlice,
  Coffee,
  Cookie,
  Croissant,
  IceCreamBowl,
  Package,
  Pencil,
  Plus,
  Sandwich,
  SquareStack,
  Tags,
  Trash2,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'
import StatusBadge from '../components/StatusBadge'
import { useApp } from '../context/AppContext'

const ICONS = { CakeSlice, Croissant, Sandwich, SquareStack, Cookie, IceCreamBowl, Coffee }

const TONES = {
  peach: {
    card: 'from-peach-100 to-cream-100 dark:from-chocolate-700 dark:to-chocolate-800',
    icon: 'bg-white/80 text-peach-500 dark:bg-chocolate-800 dark:text-peach-300',
    text: 'text-peach-500 dark:text-peach-300',
    dot: 'bg-peach-400',
  },
  caramel: {
    card: 'from-caramel-100 to-cream-100 dark:from-chocolate-700 dark:to-chocolate-800',
    icon: 'bg-white/80 text-caramel-600 dark:bg-chocolate-800 dark:text-caramel-300',
    text: 'text-caramel-600 dark:text-caramel-300',
    dot: 'bg-caramel-400',
  },
  sage: {
    card: 'from-sage-100 to-cream-100 dark:from-chocolate-700 dark:to-chocolate-800',
    icon: 'bg-white/80 text-sage-600 dark:bg-chocolate-800 dark:text-sage-300',
    text: 'text-sage-600 dark:text-sage-300',
    dot: 'bg-sage-400',
  },
  chocolate: {
    card: 'from-chocolate-100 to-cream-100 dark:from-chocolate-700 dark:to-chocolate-800',
    icon: 'bg-white/80 text-chocolate-600 dark:bg-chocolate-800 dark:text-caramel-300',
    text: 'text-chocolate-600 dark:text-caramel-300',
    dot: 'bg-chocolate-400',
  },
}

const BLANK = { id: null, name: '', description: '', color: 'caramel', icon: 'CakeSlice', active: true }

export default function Categories() {
  const { categories, products, upsertCategory, deleteCategory, setPage } = useApp()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(BLANK)
  const [confirm, setConfirm] = useState(null)

  const withCounts = useMemo(
    () =>
      categories.map((c) => ({
        ...c,
        liveCount: products.filter((p) => p.category === c.name).length,
      })),
    [categories, products],
  )

  const totals = useMemo(
    () => ({
      listed: categories.reduce((s, c) => s + c.productCount, 0),
      live: products.length,
      active: categories.filter((c) => c.active).length,
    }),
    [categories, products],
  )

  const open = (category) => {
    if (category === 'new') {
      setForm(BLANK)
    } else {
      setForm({ ...category })
    }
    setEditing(category)
  }

  const submit = () => {
    if (!form.name.trim()) return
    upsertCategory({
      id: form.id,
      name: form.name.trim(),
      description: form.description.trim(),
      color: form.color,
      icon: form.icon,
      active: form.active,
      productCount: form.productCount ?? 0,
    })
    setEditing(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-chocolate-800 dark:text-cream-100">
            Categories
          </h1>
          <p className="mt-0.5 text-sm text-chocolate-400 dark:text-chocolate-300">
            {totals.active} active · {totals.live} products live in POS
          </p>
        </div>
        <button type="button" onClick={() => open('new')} className="btn-primary px-4 py-2.5 text-[13px]">
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card flex flex-wrap items-center gap-x-6 gap-y-3 p-4"
      >
        {[
          { label: 'Listed Products', value: totals.listed, icon: Package, tone: 'text-caramel-600 dark:text-caramel-300' },
          { label: 'Live in POS', value: totals.live, icon: Tags, tone: 'text-sage-600 dark:text-sage-300' },
          { label: 'Active Categories', value: totals.active, icon: CakeSlice, tone: 'text-peach-500 dark:text-peach-300' },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-2.5">
            <s.icon className={`h-4 w-4 ${s.tone}`} />
            <div>
              <p className="text-[10px] font-bold tracking-[0.1em] text-chocolate-400 uppercase dark:text-chocolate-300">
                {s.label}
              </p>
              <p className="font-display text-lg leading-none font-semibold text-chocolate-800 dark:text-cream-100">
                {s.value}
              </p>
            </div>
          </div>
        ))}
        <div className="ml-auto text-[11px] text-chocolate-300 dark:text-chocolate-400">
          Listed counts include planned catalogue items not yet in POS.
        </div>
      </motion.div>

      {withCounts.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {withCounts.map((c, i) => {
            const Icon = ICONS[c.icon] || CakeSlice
            const tone = TONES[c.color] || TONES.caramel
            return (
              <motion.article
                key={c.id}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -5 }}
                className={`group relative overflow-hidden rounded-2xl border border-cream-200 bg-gradient-to-br ${tone.card} p-5 shadow-soft transition-shadow hover:shadow-lift dark:border-chocolate-700`}
              >
                <span className={`absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-20 ${tone.dot}`} />

                <div className="relative flex items-start justify-between">
                  <span className={`grid h-12 w-12 place-items-center rounded-xl ${tone.icon}`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <StatusBadge status={c.active ? 'Active' : 'Inactive'} />
                </div>

                <h3 className="relative mt-4 font-display text-lg leading-tight font-semibold text-chocolate-800 dark:text-cream-100">
                  {c.name}
                </h3>
                <p className="relative mt-1 min-h-[2.5rem] text-[12px] leading-relaxed text-chocolate-500 dark:text-chocolate-300">
                  {c.description}
                </p>

                <div className="relative mt-4 flex items-center justify-between border-t border-chocolate-200/60 pt-3.5 dark:border-chocolate-600/60">
                  <div>
                    <p className={`font-display text-xl leading-none font-semibold ${tone.text}`}>{c.productCount}</p>
                    <p className="text-[10.5px] text-chocolate-400 dark:text-chocolate-300">Products</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setPage('pos')
                      }}
                      className="btn-icon h-8 w-8 hover:bg-white/70 dark:hover:bg-chocolate-700"
                      aria-label={`View ${c.name} in POS`}
                    >
                      <Tags className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => open(c)}
                      aria-label={`Edit ${c.name}`}
                      className="btn-icon h-8 w-8 hover:bg-white/70 dark:hover:bg-chocolate-700"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirm(c)}
                      aria-label={`Delete ${c.name}`}
                      className="btn-icon h-8 w-8 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      ) : (
        <EmptyState
          variant="products"
          title="No categories yet"
          message="Create categories like Cakes, Pastries or Beverages to organise your catalogue."
          actionLabel="Add Category"
          onAction={() => open('new')}
        />
      )}

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        icon={Tags}
        title={editing === 'new' ? 'Add Category' : 'Edit Category'}
        subtitle={editing === 'new' ? 'Group similar products together' : form.name}
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(null)} className="btn-ghost px-4 py-2.5">
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!form.name.trim()}
              className="btn-primary px-5 py-2.5"
            >
              {editing === 'new' ? 'Create Category' : 'Save Changes'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="label">Category Name</p>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Cookies"
              className="field"
            />
          </div>
          <div>
            <p className="label">Description</p>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What belongs in this category?"
              className="field resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="label">Listed Products</p>
              <input
                type="number"
                min={0}
                value={form.productCount ?? 0}
                onChange={(e) => setForm((f) => ({ ...f, productCount: Number(e.target.value) }))}
                className="field"
              />
            </div>
            <div>
              <p className="label">Status</p>
              <select
                value={form.active ? 'Active' : 'Inactive'}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.value === 'Active' }))}
                className="field"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <p className="label">Accent Colour</p>
            <div className="flex gap-2">
              {Object.keys(TONES).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, color: c }))}
                  aria-label={c}
                  className={`h-9 w-9 rounded-xl border-2 transition ${
                    form.color === c ? 'border-chocolate-700 dark:border-caramel-400' : 'border-transparent'
                  } ${TONES[c].card}`}
                >
                  <span className={`mx-auto block h-3 w-3 rounded-full ${TONES[c].dot}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="label">Icon</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(ICONS).map(([key, Icon]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, icon: key }))}
                  aria-label={key}
                  className={`grid h-10 w-10 place-items-center rounded-xl border-2 transition ${
                    form.icon === key
                      ? 'border-caramel-400 bg-caramel-100 text-caramel-700 dark:bg-chocolate-700'
                      : 'border-cream-200 text-chocolate-400 hover:border-caramel-300 dark:border-chocolate-600'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        size="sm"
        icon={Trash2}
        title="Delete category?"
        subtitle={confirm?.name}
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setConfirm(null)} className="btn-ghost px-4 py-2.5">
              Keep it
            </button>
            <button
              type="button"
              onClick={() => {
                deleteCategory(confirm.id)
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
          Products already in this category stay in the catalogue but will not be grouped under it in POS.
        </p>
      </Modal>
    </div>
  )
}
