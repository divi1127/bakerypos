import {
  BadgePercent,
  BarChart3,
  CakeSlice,
  LayoutDashboard,
  Receipt,
  Settings,
  ShoppingBag,
  Tags,
  Users,
} from 'lucide-react'

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pos', label: 'POS / Billing', icon: ShoppingBag },
  { id: 'products', label: 'Products', icon: CakeSlice },
  { id: 'categories', label: 'Categories', icon: Tags },
  { id: 'orders', label: 'Orders', icon: Receipt },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'offers', label: 'Offers', icon: BadgePercent },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export const MOBILE_NAV_ITEMS = NAV_ITEMS.slice(0, 5)
