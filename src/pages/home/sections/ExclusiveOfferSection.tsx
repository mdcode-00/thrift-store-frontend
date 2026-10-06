import { Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

// ============================================================
// ExclusiveOfferSection — MASTER.md §11
// Split editorial layout: warm brown text side + large image
// No flashy gradients, warm brown as primary promo color
// ============================================================

export function ExclusiveOfferSection() {
  return (
    <section
      aria-labelledby="offer-heading"
      className="overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* Text / offer panel */}
          <div className="flex flex-col justify-center bg-primary px-8 py-16 sm:px-12 sm:py-20 lg:px-16">
            <span className="block font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60 mb-4">
              Limited Offer
            </span>
            <h2
              id="offer-heading"
              className="font-serif text-3xl font-medium leading-tight text-white sm:text-4xl lg:text-[2.6rem]"
            >
              The Weekend
              <br />
              Wardrobe Edit
            </h2>
            <p className="mt-5 font-sans text-sm leading-relaxed text-white/75 max-w-sm">
              Up to 40% off a curated selection of our most-loved jackets, knitwear, and denim.
              Updated every Friday — pieces sell fast.
            </p>

            {/* Countdown-style label */}
            <div className="mt-6 inline-flex w-fit items-center gap-2 rounded-sm border border-white/20 bg-white/10 px-4 py-2">
              <Clock size={14} className="text-white/70" aria-hidden="true" />
              <span className="font-sans text-xs font-medium text-white/80">
                Offer ends Sunday midnight
              </span>
            </div>

            <div className="mt-8">
              <Button
                as={Link}
                to="/shop?filter=sale"
                variant="secondary"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                Shop the Sale
              </Button>
            </div>
          </div>

          {/* Image panel */}
          <div className="relative h-72 sm:h-96 lg:h-auto min-h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=900&fit=crop&q=80&auto=format"
              alt="A curated selection of vintage jackets and knitwear on a rack"
              className="absolute inset-0 h-full w-full object-cover object-center"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}