import { X, Truck } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

// ============================================================
// AnnouncementBar — Thin top bar, dismissible
// ============================================================

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div
      role="banner"
      className="relative flex items-center justify-center bg-[#4a3525] px-10 py-2.5 text-center text-white shadow-sm"
    >
      <div className="flex items-center gap-2">
        <Truck size={15} className="text-white/90 shrink-0" aria-hidden="true" />
        <p className="font-sans text-xs font-medium tracking-wide">
          Enjoy <span className="font-semibold text-amber-200">Free Shipping</span> on all orders &mdash;{' '}
          <Link
            to="/shop"
            className="underline underline-offset-2 hover:text-amber-200 transition-colors duration-150"
          >
            Shop now
          </Link>
        </p>
      </div>

      <button
        onClick={() => setVisible(false)}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/70 hover:text-white transition-colors duration-150 rounded focus-visible:outline-2 focus-visible:outline-white"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  )
}