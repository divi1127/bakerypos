export const BRAND = {
  name: 'BAKE & BLOOM',
  tagline: 'Freshly Baked. Beautifully Served.',
  shopName: 'Bake & Bloom',
  address: 'Madurai, Tamil Nadu',
  phone: '+91 98765 43210',
  email: 'hello@akeandbloom.in',
  gstin: '33AABCB1234M1Z5',
  currency: '₹',
  billPrefix: 'BW',
  billStart: 1025,
  taxRate: 0.05,
  taxLabel: 'GST (5%)',
  upiId: 'bakeandbloom@upi',
  currencyNote: 'All prices inclusive of packing charges',
  admin: {
    name: 'Anitha Krishnan',
    role: 'Store Manager',
    initials: 'AK',
  },
}

export const CURRENCY = (value) =>
  `${BRAND.currency}${Number(value || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })}`

export const CATEGORIES_META = {
  Cakes: { tint: 'peach', icon: 'CakeSlice' },
  Pastries: { tint: 'caramel', icon: 'Croissant' },
  Breads: { tint: 'sage', icon: 'Sandwich' },
  Brownies: { tint: 'chocolate', icon: 'SquareStack' },
  Cookies: { tint: 'caramel', icon: 'Cookie' },
  Desserts: { tint: 'peach', icon: 'IceCreamBowl' },
  Beverages: { tint: 'sage', icon: 'Coffee' },
  Snacks: { tint: 'chocolate', icon: 'Sandwich' },
}
