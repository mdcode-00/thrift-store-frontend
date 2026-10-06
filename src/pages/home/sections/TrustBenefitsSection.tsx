import { Shield, RefreshCcw, Leaf, Award } from 'lucide-react'

// ============================================================
// TrustBenefitsSection — MASTER.md §5 item 5
// Simple, minimal, non-dominant, editorial feel
// ============================================================

const BENEFITS = [
  {
    icon: Shield,
    title: 'Authenticated',
    description: 'Every piece individually checked for quality, condition, and authenticity before listing.',
  },
  {
    icon: RefreshCcw,
    title: 'Easy Returns',
    description: '14-day hassle-free returns. If something is not right, we make it right.',
  },
  {
    icon: Leaf,
    title: 'Sustainably Sourced',
    description: 'Pre-loved clothing that reduces waste and keeps good clothes out of landfill.',
  },
  {
    icon: Award,
    title: 'Curated Quality',
    description: 'Hand-picked by our team. Only pieces we would wear ourselves make the cut.',
  },
]

export function TrustBenefitsSection() {
  return (
    <section
      aria-label="Why shop with us"
      className="border-y border-border bg-surface py-10"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <ul
          role="list"
          className="grid grid-cols-2 gap-6 lg:grid-cols-4"
        >
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-3 lg:flex-col lg:text-center lg:items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-muted/50 text-primary">
                <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-sans text-sm font-semibold text-foreground">{title}</h3>
                <p className="mt-1 font-sans text-xs leading-relaxed text-secondary hidden sm:block">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}