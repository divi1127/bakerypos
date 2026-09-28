import { motion } from 'framer-motion'
import {
  Building2,
  Database,
  Download,
  Info,
  Mail,
  MapPin,
  Moon,
  Phone,
  Receipt,
  RefreshCcw,
  Save,
  Sun,
} from 'lucide-react'
import { useState } from 'react'
import Modal from '../components/Modal'
import { PrintButton, PrintSizePicker } from '../components/PrintControls'
import StatusBadge from '../components/StatusBadge'
import { BRAND } from '../config/brand'
import { useApp } from '../context/AppContext'
import { KEYS } from '../utils/storage'

const TABS = [
  { id: 'shop', label: 'Shop Profile', icon: Building2 },
  { id: 'billing', label: 'Billing & Tax', icon: Receipt },
  { id: 'appearance', label: 'Appearance', icon: Sun },
  { id: 'data', label: 'Data & Storage', icon: Database },
]

function storageFootprint() {
  try {
    const bytes = Object.values(KEYS).reduce((sum, k) => sum + ((localStorage.getItem(k) || '').length), 0)
    return `${(bytes / 1024).toFixed(1)} KB`
  } catch {
    return '0 KB'
  }
}

function Section({ title, hint, children }) {
  return (
    <section className="card p-5">
      <div className="mb-4">
        <h2 className="font-display text-[17px] leading-tight font-semibold text-chocolate-800 dark:text-cream-100">
          {title}
        </h2>
        {hint && <p className="mt-0.5 text-xs text-chocolate-400 dark:text-chocolate-300">{hint}</p>}
      </div>
      {children}
    </section>
  )
}

function Toggle({ checked, onChange, label, hint }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-cream-200 p-3.5 transition hover:border-caramel-300 dark:border-chocolate-700 dark:hover:border-caramel-500/40">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 shrink-0 rounded-full transition ${checked ? 'bg-sage-500' : 'bg-cream-300 dark:bg-chocolate-600'}`}
        style={{ height: '1.375rem', width: '2.375rem' }}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 520, damping: 32 }}
          className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-soft"
          style={{ left: checked ? '1.125rem' : '0.125rem' }}
        />
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-semibold text-chocolate-800 dark:text-cream-100">{label}</p>
        {hint && <p className="mt-0.5 text-[11.5px] text-chocolate-400 dark:text-chocolate-300">{hint}</p>}
      </div>
    </label>
  )
}

export default function Settings() {
  const { shop, setShop, theme, toggleTheme, resetDemo, pushToast, printSize, roundOff, setRoundOff } = useApp()
  const [tab, setTab] = useState('shop')
  const [form, setForm] = useState({ ...shop })
  const [confirm, setConfirm] = useState(false)
  const [saved, setSaved] = useState(false)

  const dirty =
    form.name !== shop.name ||
    form.address !== shop.address ||
    form.phone !== shop.phone ||
    form.email !== shop.email ||
    form.gstin !== shop.gstin

  const save = () => {
    setShop((s) => ({ ...s, name: form.name.trim() || s.name, address: form.address, phone: form.phone, email: form.email, gstin: form.gstin }))
    setSaved(true)
    pushToast({ title: 'Settings saved', message: 'Shop details updated for this browser.', variant: 'success' })
    window.setTimeout(() => setSaved(false), 1800)
  }

  const exportData = () => {
    const payload = { shop, products, orders, customers, offers, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bake-and-bloom-data-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    pushToast({ title: 'Data exported', message: 'A JSON snapshot was downloaded.', variant: 'success' })
  }

  const storageSize = storageFootprint()

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-chocolate-800 dark:text-cream-100">
            Settings
          </h1>
          <p className="mt-0.5 text-sm text-chocolate-400 dark:text-chocolate-300">
            Store details, billing preferences and demo data
          </p>
        </div>
        <button type="button" onClick={save} className="btn-primary px-4 py-2.5 text-[13px]">
          {saved ? <Info className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? 'Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="scroll-thin -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {TABS.map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-semibold transition ${
                active ? 'text-cream-100 dark:text-chocolate-900' : 'text-chocolate-500 hover:bg-cream-200 dark:text-chocolate-300 dark:hover:bg-chocolate-700'
              }`}
            >
              {active && (
                <motion.span layoutId="settings-tab" className="absolute inset-0 rounded-xl bg-chocolate-700 dark:bg-caramel-400" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
              )}
              <t.icon className="relative h-3.5 w-3.5" />
              <span className="relative">{t.label}</span>
            </button>
          )
        })}
      </div>

      {tab === 'shop' && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2 space-y-4">
            <Section title="Shop Profile" hint="Printed on every thermal receipt and shown in the sidebar">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="label">Shop Name</p>
                  <input value={form.name || ''} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="field" />
                </div>
                <div>
                  <p className="label">GSTIN</p>
                  <input value={form.gstin || ''} onChange={(e) => setForm((f) => ({ ...f, gstin: e.target.value.toUpperCase() }))} className="field font-mono tracking-wide" />
                </div>
                <div className="sm:col-span-2">
                  <p className="label">Address</p>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-chocolate-300 dark:text-chocolate-400" />
                    <input value={form.address || ''} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className="field pl-10" />
                  </div>
                </div>
                <div>
                  <p className="label">Phone</p>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-chocolate-300 dark:text-chocolate-400" />
                    <input value={form.phone || ''} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="field pl-10" />
                  </div>
                </div>
                <div>
                  <p className="label">Email</p>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-chocolate-300 dark:text-chocolate-400" />
                    <input value={form.email || ''} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="field pl-10" />
                  </div>
                </div>
              </div>
            </Section>
          </div>

          <div className="space-y-4">
            <Section title="Store Status" hint="POS blocks new bills while closed">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-cream-200 p-3.5 dark:border-chocolate-700">
                <div>
                  <p className="text-[13.5px] font-semibold text-chocolate-800 dark:text-cream-100">Currently {shop.status}</p>
                  <p className="mt-0.5 text-[11.5px] text-chocolate-400 dark:text-chocolate-300">Tap to flip the status</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShop((s) => ({ ...s, status: s.status === 'OPEN' ? 'CLOSED' : 'OPEN' }))}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${shop.status === 'OPEN' ? 'bg-sage-500' : 'bg-cream-300 dark:bg-chocolate-600'}`}
                >
                  <motion.span layout transition={{ type: 'spring', stiffness: 520, damping: 32 }} className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-soft" style={{ left: shop.status === 'OPEN' ? '1.75rem' : '0.25rem' }} />
                </button>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <StatusBadge status={shop.status === 'OPEN' ? 'Active' : 'Inactive'} />
                <span className="text-[11.5px] text-chocolate-400 dark:text-chocolate-300">Persisted in localStorage</span>
              </div>
            </Section>

            <Section title="UPI for Payments" hint="Shown on the UPI payment step">
              <div className="rounded-xl border border-dashed border-caramel-300 bg-caramel-100/50 p-3.5 dark:border-caramel-500/30 dark:bg-caramel-500/10">
                <p className="font-mono text-[14px] font-bold tracking-wide text-chocolate-800 dark:text-cream-100">{BRAND.upiId}</p>
                <p className="mt-1 text-[11.5px] text-chocolate-500 dark:text-chocolate-300">Demo only — no real payment is captured.</p>
              </div>
            </Section>
          </div>
        </div>
      )}

      {tab === 'billing' && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Section title="Printer & Paper Size" hint="Applied to every bill you print or export">
            <PrintSizePicker size="md" />
            <div className="mt-4 rounded-xl border border-cream-200 bg-cream-50 p-3.5 dark:border-chocolate-700 dark:bg-chocolate-900/50">
              <p className="text-[10px] font-bold tracking-[0.12em] text-chocolate-400 uppercase dark:text-chocolate-300">
                {printSize === 'thermal' ? '80mm × Auto' : 'A4 Portrait'}
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-chocolate-500 dark:text-chocolate-300">
                {printSize === 'thermal'
                  ? 'Narrow receipt layout for 80mm counter roll printers. Item names wrap onto two lines.'
                  : 'Full-width layout for A4 sheets and “Save as PDF” exports from the browser print dialog.'}
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <PrintButton label="Test print" className="btn-soft px-3.5 py-2.5 text-[13px]" />
              <PrintButton label="Print as A4" size="a4" className="btn-ghost px-3.5 py-2.5 text-[13px]" />
            </div>
          </Section>

          <Section title="Tax & Rounding" hint="Applied to every bill in POS">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="label">Tax Label</p>
                <input value={BRAND.taxLabel} readOnly className="field" />
              </div>
              <div>
                <p className="label">Tax Rate</p>
                <div className="relative">
                  <input value={`${Math.round(BRAND.taxRate * 100)}%`} readOnly className="field pr-10" />
                  <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[11px] font-semibold text-chocolate-300 dark:text-chocolate-400">fixed</span>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2.5">
              <Toggle
                checked={roundOff}
                onChange={setRoundOff}
                label="Round off grand total"
                hint="Round the payable amount to the nearest ₹10 and show the difference on the bill"
              />
              <Toggle
                checked={Boolean(shop.autoPrint)}
                onChange={(v) => setShop((s) => ({ ...s, autoPrint: v }))}
                label="Open print dialog after payment"
                hint="Turn off if your thermal printer opens automatically"
              />
            </div>
          </Section>
        </div>
      )}

      {tab === 'appearance' && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Section title="Theme" hint="Applies instantly and stays after refresh">
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'light', label: 'Warm Light', icon: Sun, preview: 'bg-cream-100' },
                { id: 'dark', label: 'Cocoa Dark', icon: Moon, preview: 'bg-chocolate-800' },
              ].map((opt) => {
                const active = theme === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => theme !== opt.id && toggleTheme()}
                    className={`relative overflow-hidden rounded-2xl border-2 p-4 text-left transition ${active ? 'border-caramel-400' : 'border-cream-200 hover:border-caramel-300 dark:border-chocolate-700'}`}
                  >
                    <span className={`block h-20 rounded-xl ${opt.preview}`} />
                    <span className="mt-3 flex items-center gap-2 text-[13.5px] font-semibold text-chocolate-800 dark:text-cream-100">
                      <opt.icon className="h-4 w-4" />
                      {opt.label}
                    </span>
                    {active && (
                      <span className="absolute top-3 right-3 rounded-full bg-sage-500 px-2 py-0.5 text-[10px] font-bold text-white">Active</span>
                    )}
                  </button>
                )
              })}
            </div>
          </Section>

          <Section title="Motion & Density" hint="Interface preferences">
            <div className="space-y-2.5">
              <Toggle checked onChange={() => {}} label="Framer Motion animations" hint="Page transitions, cart springs and count-ups" />
              <Toggle checked onChange={() => {}} label="Compact data tables" hint="Shows more rows per screen on desktop" />
              <Toggle checked={false} onChange={() => {}} label="Reduce motion for accessibility" hint="Honours your system preference" />
            </div>
          </Section>
        </div>
      )}

      {tab === 'data' && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Section title="Local Storage" hint="This demo keeps everything in your browser">
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Products', value: products.length },
                { label: 'Orders', value: orders.length },
                { label: 'Customers', value: customers.length },
                { label: 'Offers', value: offers.length },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-cream-200 p-3 text-center dark:border-chocolate-700">
                  <p className="font-display text-lg leading-none font-semibold text-chocolate-800 dark:text-cream-100">{s.value}</p>
                  <p className="mt-1 text-[10px] font-bold tracking-[0.1em] text-chocolate-400 uppercase dark:text-chocolate-300">{s.label}</p>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-[11.5px] text-chocolate-400 dark:text-chocolate-300">Approx. {storageSize} used of ~5 MB quota.</p>
            <button type="button" onClick={exportData} className="btn-soft mt-4 px-3.5 py-2.5 text-[13px]">
              <Download className="h-4 w-4" />
              Export JSON snapshot
            </button>
          </Section>

          <Section title="Reset Demo Data" hint="Restores the original seeded records">
            <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
              <p className="text-[13.5px] font-semibold text-red-600 dark:text-red-400">This cannot be undone</p>
              <p className="mt-1 text-[12px] leading-relaxed text-chocolate-500 dark:text-chocolate-300">
                All products, categories, bills, customers and offers return to the demo defaults. Anything you created in this
                browser will be removed.
              </p>
              <button type="button" onClick={() => setConfirm(true)} className="btn mt-4 bg-red-500 px-4 py-2.5 text-white hover:bg-red-600">
                <RefreshCcw className="h-4 w-4" />
                Reset everything
              </button>
            </div>
          </Section>
        </div>
      )}

      {dirty && tab !== 'data' && (
        <p className="text-center text-[11.5px] text-caramel-600 dark:text-caramel-400">
          You have unsaved changes. Hit “Save Changes” to keep them.
        </p>
      )}

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        size="sm"
        icon={RefreshCcw}
        title="Reset demo data?"
        subtitle="Products, bills, customers and offers"
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setConfirm(false)} className="btn-ghost px-4 py-2.5">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                resetDemo()
                setConfirm(false)
              }}
              className="btn bg-red-500 px-4 py-2.5 text-white hover:bg-red-600"
            >
              <RefreshCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        }
      >
        <p className="text-sm text-chocolate-500 dark:text-chocolate-300">Everything you added in this browser will be cleared.</p>
      </Modal>
    </div>
  )
}
