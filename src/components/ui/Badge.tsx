import type { ProductBadge } from '@/types'

// ============================================================
// Badge — Product card badges (NEW, SALE, VINTAGE, STAFF PICK)
// Earthy tones only — no neon, no red-dominant (MASTER.md)
// ============================================================

interface BadgeProps {
  label: ProductBadge | string
  className?: string
}

const badgeStyles: Record<string, string> = {
  NEW: 'bg-foreground text-white',
  SALE: 'bg-secondary text-white',
  VINTAGE: 'bg-accent text-foreground',
  'STAFF PICK': 'bg-muted text-foreground',
}

export function Badge({ label, className = '' }: BadgeProps) {
  const style = badgeStyles[label] ?? 'bg-muted text-foreground'

  return (
    <span
      className={[
        'inline-block px-2 py-0.5',
        'text-[10px] font-sans font-semibold uppercase tracking-widest',
        'rounded-sm',
        style,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </span>
  )
}