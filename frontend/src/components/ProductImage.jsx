import { useState } from 'react'
import { CakeSlice } from 'lucide-react'

const GRADIENTS = [
  'from-peach-200 via-cream-200 to-caramel-200',
  'from-caramel-200 via-cream-100 to-peach-200',
  'from-sage-200 via-cream-100 to-caramel-200',
  'from-chocolate-200 via-caramel-200 to-peach-200',
]

export default function ProductImage({ src, alt, className = '', seed = 0, rounded = 'rounded-xl' }) {
  const [failed, setFailed] = useState(false)
  const gradient = GRADIENTS[Math.abs(seed) % GRADIENTS.length]

  if (!src || failed) {
    return (
      <div className={`grid place-items-center bg-gradient-to-br ${gradient} ${rounded} ${className}`}>
        <CakeSlice className="h-1/3 w-1/3 text-chocolate-400/50" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`${rounded} bg-cream-200 object-cover ${className}`}
    />
  )
}
