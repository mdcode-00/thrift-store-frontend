import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

// ============================================================
// SeasonalCollectionSection — MASTER.md §12
// Large editorial imagery, split asymmetric layout
// Curated feel, not an ad banner
// ============================================================

export function SeasonalCollectionSection() {
  return (
    <section
      aria-labelledby="seasonal-heading"
      className="py-16 sm:py-20 bg-surface"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">

        {/* Section header */}
        <div className="mb-10">
          <span className="block font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary mb-2">
            Autumn — Winter 2026
          </span>
          <h2
            id="seasonal-heading"
            className="font-serif text-3xl font-medium text-foreground sm:text-4xl"
          >
            The Warmth Edit
          </h2>
        </div>

        {/* Asymmetric editorial grid */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3 md:grid-rows-2">

          {/* Primary large image */}
          <Link
            to="/shop?collection=warmth"
            aria-label="Shop The Warmth Edit collection"
            className="group relative overflow-hidden rounded-sm md:col-span-2 md:row-span-2"
          >
            <div className="aspect-[4/3] md:aspect-auto md:h-full min-h-[280px]">
              <img
                src="https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=900&h=750&fit=crop&q=80&auto=format"
                alt="A model in a corduroy jacket and wide-leg trousers — Autumn 2026 collection"
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-serif text-2xl font-medium text-white">
                  Autumn Outerwear
                </h3>
                <p className="mt-1 font-sans text-sm text-white/75">
                  Jackets for the season
                </p>
              </div>
            </div>
          </Link>

          {/* Secondary image 1 */}
          <Link
            to="/category/womens"
            aria-label="Shop Women's collection"
            className="group relative overflow-hidden rounded-sm"
          >
            <div className="aspect-[3/2] sm:aspect-square h-full">
              <img
                src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=500&h=500&fit=crop&q=80&auto=format"
                alt="Women's vintage autumn fashion"
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                loading="lazy"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-foreground/30" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-white">
                  Women&apos;s
                </h3>
              </div>
            </div>
          </Link>

          {/* Secondary image 2 */}
          <Link
            to="/category/mens"
            aria-label="Shop Men's collection"
            className="group relative overflow-hidden rounded-sm"
          >
            <div className="aspect-[3/2] sm:aspect-square h-full">
              <img
                src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&h=500&fit=crop&q=80&auto=format"
                alt="Men's vintage autumn fashion"
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                loading="lazy"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-foreground/30" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-white">
                  Men&apos;s
                </h3>
              </div>
            </div>
          </Link>
        </div>

        {/* CTA */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/shop?collection=warmth"
            className="inline-flex items-center gap-2 font-sans text-sm font-medium text-foreground hover:text-primary transition-colors duration-150 group border-b border-border hover:border-primary pb-0.5"
          >
            Shop the full collection
            <ArrowRight
              size={14}
              aria-hidden="true"
              className="transition-transform duration-150 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}