import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

// ============================================================
// HeroSection — MASTER.md §7
// Split layout: editorial text left, large fashion photo right
// No parallax, no gradients, no animations on background
// Photography-led, editorial campaign feel
// ============================================================

export function HeroSection() {
  return (
    <section
      aria-label="Hero — Vintage Thrift Room"
      className="relative w-full overflow-hidden bg-background"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid min-h-[520px] grid-cols-1 lg:grid-cols-[1fr_1.1fr] lg:min-h-[620px]">

          {/* Text panel */}
          <div className="flex flex-col justify-center px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
            {/* Eyebrow */}
            <span className="mb-5 block font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary">
              New arrivals — Autumn 2026
            </span>

            {/* Headline */}
            <h1 className="font-serif text-[2.6rem] font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
              Wear Your
              <br />
              <em className="not-italic text-primary">Confidence</em>
            </h1>

            {/* Sub-text */}
            <p className="mt-5 max-w-sm font-sans text-base leading-relaxed text-secondary">
              Curated vintage pieces for your everyday wardrobe. Thoughtfully sourced, authentically
              worn, endlessly wearable.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button as={Link} to="/shop" size="lg" variant="primary">
                Shop Collection
              </Button>
              <Link
                to="/category/womens"
                className="inline-flex items-center gap-2 font-sans text-sm font-medium text-secondary hover:text-primary transition-colors duration-150 group"
              >
                Explore Women&apos;s
                <ArrowRight
                  size={14}
                  aria-hidden="true"
                  className="transition-transform duration-150 group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            {/* Trust signals */}
            <div className="mt-12 flex items-center gap-6">
              <div>
                <p className="font-serif text-2xl font-medium text-foreground">4,200+</p>
                <p className="font-sans text-[11px] uppercase tracking-wider text-secondary">Pieces sold</p>
              </div>
              <div className="h-8 w-px bg-border" aria-hidden="true" />
              <div>
                <p className="font-serif text-2xl font-medium text-foreground">98%</p>
                <p className="font-sans text-[11px] uppercase tracking-wider text-secondary">5-star reviews</p>
              </div>
              <div className="h-8 w-px bg-border" aria-hidden="true" />
              <div>
                <p className="font-serif text-2xl font-medium text-foreground">100%</p>
                <p className="font-sans text-[11px] uppercase tracking-wider text-secondary">Authenticated</p>
              </div>
            </div>
          </div>

          {/* Image panel */}
          <div className="relative order-first lg:order-last h-72 sm:h-96 lg:h-auto">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&h=1100&fit=crop&q=85&auto=format"
              alt="A woman wearing a curated vintage outfit — warm tones, editorial styling"
              className="absolute inset-0 h-full w-full object-cover object-center"
              fetchPriority="high"
            />
            {/* Very subtle warm overlay to tie into the cream palette */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-foreground/5"
            />
          </div>
        </div>
      </div>
    </section>
  )
}