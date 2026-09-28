import { motion } from 'framer-motion'
import { BadgePercent, Clock, Copy, Gift, Pencil, Plus, Sparkles, Ticket, Trash2, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'
import StatusBadge from '../components/StatusBadge'
import { CURRENCY } from '../config/brand'
import { useApp } from '../context/AppContext'

const TONES = {
  peach: 'from-peach-200 via-peach-100 to-cream-100 dark:from-chocolate-700 dark:via-chocolate-800 dark:to-chocolate-900',
  caramel: 'from-caramel-200 via-caramel-100 to-cream-100 dark:from-chocolate-700 dark:via-chocolate-800 dark:to-chocolate-900',
  sage: 'from-sage-200 via-sage-100 to-cream-100 dark:from-chocolate-700 dark:via-chocolate-800 dark:to-chocolate-900',
  chocolate: 'from-chocolate-200 via-chocolate-100 to-cream-100 dark:from-chocolate-700 dark:via-chocolate-800 dark:to-chocolate-900',
}

const BLANK = {
  id: null,
  title: '',
  code: '',
  type: 'Percentage',
  value: 10,
  category: 'All',
  description: '',
  validTill: '31 Dec 2026',
  color: 'caramel',
  active: true,
}

export default function Offers() {
  const { offers, upsertOffer, deleteOffer, toggleOffer, pushToast } = useApp()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(BLANK)
  const [confirm, setConfirm] = useState(null)

  const stats = useMemo(
    () => ({
      total: offers.length,
      live: offers.filter((o) => o.active).length,
      redemptions: offers.reduce((s, o) => s + o.used, 0),
      revenue: offers.reduce((s, o) => s + o.revenue, 0),
    }),
    [offers],
  )

  const open = (offer) => {
    setForm(offer === 'new' ? BLANK : { ...offer })
    setEditing(offer)
  }

  const submit = () => {
    if (!form.title.trim() || !form.code.trim()) {
      pushToast({ title: 'Add title and code', message: 'Both fields are required for an offer.', variant: 'error' })
      return
    }
    upsertOffer({
      id: form.id,
      title: form.title.trim(),
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value) || 0,
      category: form.category,
      description: form.description.trim(),
      validTill: form.validTill,
      color: form.color,
      active: form.active,
    })
    setEditing(null)
  }

  const copyCode = (code) => {
    try {
      navigator.clipboard?.writeText(code)
      pushToast({ title: 'Code copied', message: code, variant: 'success' })
    } catch {
      pushToast({ title: 'Offer code', message: code, variant: 'info' })
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-chocolate-800 dark:text-cream-100">
            Offers
          </h1>
          <p className="mt-0.5 text-sm text-chocolate-400 dark:text-chocolate-300">
            {stats.live} live promotions · {stats.redemptions} redemptions
          </p>
        </div>
        <button type="button" onClick={() => open('new')} className="btn-primary px-4 py-2.5 text-[13px]">
          <Plus className="h-4 w-4" />
          Create Offer
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Total Offers', value: stats.total, icon: Ticket },
          { label: 'Live Now', value: stats.live, icon: Sparkles },
          { label: 'Redemptions', value: stats.redemptions, icon: Gift },
          { label: 'Revenue Boost', value: stats.revenue, prefix: '₹', icon: TrendingUp },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="card p-4"
          >
            <div className="flex items-center gap-2">
              <s.icon className="h-4 w-4 text-caramel-500" />
              <p className="text-[10px] font-bold tracking-[0.1em] text-chocolate-400 uppercase dark:text-chocolate-300">
                {s.label}
              </p>
            </div>
            <p className="mt-2 font-display text-2xl leading-none font-semibold text-chocolate-800 dark:text-cream-100">
              {s.prefix || ''}
              {s.value.toLocaleString('en-IN')}
            </p>
          </motion.div>
        ))}
      </div>

      {offers.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {offers.map((offer, i) => (
            <motion.article
              key={offer.id}
              initial={{ opacity: 0, y: 22, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border border-cream-200 bg-gradient-to-br ${TONES[offer.color] || TONES.caramel} p-5 shadow-soft transition-shadow hover:shadow-lift dark:border-chocolate-700 ${!offer.active ? 'opacity-70' : ''}`}
            >
              <span className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-white/25" />
              <span className="pointer-events-none absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-white/15" />

              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.14em] text-caramel-700 uppercase dark:text-caramel-300">
                    {offer.category}
                  </p>
                  <h3 className="mt-1 font-display text-xl leading-tight font-bold text-chocolate-800 dark:text-cream-100">
                    {offer.title}
                  </h3>
                </div>
                <StatusBadge status={offer.active ? 'Active' : 'Inactive'} />
              </div>

              <div className="relative mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => copyCode(offer.code)}
                  className="flex items-center gap-2 rounded-xl border border-dashed border-chocolate-300 bg-white/70 px-3 py-2 font-mono text-[13px] font-bold tracking-wider text-chocolate-700 transition hover:border-caramel-400 dark:border-chocolate-500 dark:bg-chocolate-800/70 dark:text-cream-100"
                >
                  {offer.code}
                  <Copy className="h-3.5 w-3.5 opacity-60" />
                </button>
                <span className="flex items-center gap-1.5 text-[11px] text-chocolate-500 dark:text-chocolate-300">
                  <Clock className="h-3 w-3" />
                  till {offer.validTill}
                </span>
              </div>

              <p className="relative mt-3 min-h-[2.75rem] text-[12.5px] leading-relaxed text-chocolate-600 dark:text-cream-200/90">
                {offer.description}
              </p>

              <div className="relative mt-4 grid grid-cols-2 gap-3 border-t border-chocolate-200/50 pt-3.5 dark:border-chocolate-600/60">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.1em] text-chocolate-400 uppercase dark:text-chocolate-300">
                    Used
                  </p>
                  <p className="font-display text-lg leading-none font-semibold text-chocolate-800 dark:text-cream-100">
                    {offer.used}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.1em] text-chocolate-400 uppercase dark:text-chocolate-300">
                    Revenue
                  </p>
                  <p className="font-display text-lg leading-none font-semibold text-chocolate-800 dark:text-cream-100">
                    {CURRENCY(offer.revenue)}
                  </p>
                </div>
              </div>

              <div className="relative mt-3 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => toggleOffer(offer.id)}
                  className="btn-soft flex-1 px-3 py-2 text-[12px]"
                >
                  {offer.active ? 'Pause' : 'Activate'}
                </button>
                <button
                  type="button"
                  onClick={() => open(offer)}
                  aria-label={`Edit ${offer.title}`}
                  className="btn-icon h-9 w-9 border border-chocolate-200/70 bg-white/60 dark:border-chocolate-600 dark:bg-chocolate-800/60"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirm(offer)}
                  aria-label={`Delete ${offer.title}`}
                  className="btn-icon h-9 w-9 border border-chocolate-200/70 bg-white/60 hover:bg-red-50 hover:text-red-500 dark:border-chocolate-600 dark:bg-chocolate-800/60 dark:hover:bg-red-950/40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <EmptyState
          variant="products"
          title="No offers running"
          message="Create a promotion to boost weekend footfall and grow repeat orders."
          actionLabel="Create Offer"
          onAction={() => open('new')}
        />
      )}

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        icon={BadgePercent}
        title={editing === 'new' ? 'Create Offer' : 'Edit Offer'}
        subtitle={editing === 'new' ? 'Launch a new bakery promotion' : form.title}
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(null)} className="btn-ghost px-4 py-2.5">
              Cancel
            </button>
            <button type="button" onClick={submit} className="btn-primary px-5 py-2.5">
              {editing === 'new' ? 'Create Offer' : 'Save Changes'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="label">Offer Title</p>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. 20% OFF Cakes"
              className="field"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="label">Offer Code</p>
              <input
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                placeholder="CAKE20"
                className="field font-mono tracking-wider"
              />
            </div>
            <div>
              <p className="label">Applies To</p>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="field"
              >
                {['All', 'Cakes', 'Pastries', 'Breads', 'Cookies', 'Brownies', 'Desserts', 'Beverages', 'Snacks'].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="label">Discount Type</p>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="field"
              >
                {['Percentage', 'Flat', 'BuyXGetY'].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="label">{form.type === 'Percentage' ? 'Percent Off' : form.type === 'Flat' ? 'Flat Amount' : 'Free Items'}</p>
              <div className="relative">
                {form.type === 'Flat' && (
                  <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-chocolate-400">₹</span>
                )}
                <input
                  type="number"
                  min={0}
                  value={form.value}
                  onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                  className={`field ${form.type === 'Flat' ? 'pl-8' : ''}`}
                />
                {form.type === 'Percentage' && (
                  <span className="absolute top-1/2 right-3.5 -translate-y-1/2 text-sm text-chocolate-400">%</span>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="label">Valid Till</p>
              <input
                value={form.validTill}
                onChange={(e) => setForm((f) => ({ ...f, validTill: e.target.value }))}
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
            <p className="label">Description</p>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Explain the offer in one line"
              className="field resize-none"
            />
          </div>
          <div>
            <p className="label">Card Colour</p>
            <div className="flex gap-2">
              {Object.keys(TONES).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, color: c }))}
                  aria-label={c}
                  className={`h-9 w-9 rounded-xl border-2 bg-gradient-to-br ${TONES[c]} transition ${
                    form.color === c ? 'border-chocolate-700 dark:border-caramel-400' : 'border-transparent'
                  }`}
                />
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
        title="Delete offer?"
        subtitle={confirm?.title}
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setConfirm(null)} className="btn-ghost px-4 py-2.5">
              Keep it
            </button>
            <button
              type="button"
              onClick={() => {
                deleteOffer(confirm.id)
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
          The promo code will stop working in POS immediately.
        </p>
      </Modal>
    </div>
  )
}
