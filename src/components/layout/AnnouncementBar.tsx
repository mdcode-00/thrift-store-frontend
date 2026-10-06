import { X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

// ============================================================
// AnnouncementBar — Thin top bar, dismissible
// MASTER.md §5: First element above the header
// ============================================================

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div
      role="banner"
      className="relative flex items-center justify-center bg-foreground px-10 py-2.5 text-center text-white"
    >
      <p className="font-sans text-xs font-medium tracking-wide">
        Free shipping on orders over $75 &mdash;{' '}
        <Link
          to="/shop"
          className="underline underline-offset-2 hover:no-underline transition-all duration-150"
        >
          Shop now
        </Link>
      </p>
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