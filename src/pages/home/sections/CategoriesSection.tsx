import { Link } from 'react-router-dom'
// import { CATEGORIES } from '@/data/categories'

// ============================================================
// CategoriesSection — MASTER.md §10
// Large editorial magazine tiles, restrained text overlay
// ============================================================


const CATEGORIES = [
  { label: "Women's", href: '/category/Womens' , image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&h=800&fit=crop&q=80' },
  { label: "Men's", href: '/category/Mens', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&h=800&fit=crop&q=80',},
  { label: 'Outerwear', href: '/category/Outerwear' , image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&h=800&fit=crop&q=80'},
  { label: 'Denim', href: '/category/Denim', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop&q=80' },
  { label: 'Accessories', href: '/category/Accessories', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop&q=80' },
  { label: 'Offers', href: '/category/Offers', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&h=800&fit=crop&q=80' }
]


export function CategoriesSection() {
  return (
    <section
      aria-labelledby="categories-heading"
      className="py-16 sm:py-20 bg-surface"
    >
      <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-10">

        {/* Section header */}
        <div className="mb-10 text-center">
          <span className="block font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary mb-2">
            Browse by
          </span>
          <h2
            id="categories-heading"
            className="font-serif text-3xl font-medium text-foreground sm:text-4xl"
          >
            Shop the Collection
          </h2>
        </div>

        {/* Category grid: 3 cols desktop, 2 tablet, 2 mobile */}
    <ul
  role="list"
  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
>
  {CATEGORIES.map((category, index) => {
    const isLarge = index === 0 // First tile spans 2 rows on medium/large screens
    return (
      <li
        key={category.href}
        className={isLarge ? 'md:row-span-2' : ''}
      >
        <Link
          to={category.href}
          className="group relative flex flex-col h-full overflow-hidden rounded-sm bg-neutral-100 border border-border"
          aria-label={`Shop ${category.label}`}
        >
          {/* Image Container */}
          <div className={`relative overflow-hidden flex-grow ${isLarge ? 'aspect-[3/4] md:aspect-auto md:h-full' : 'aspect-[3/4]'}`}>
            <img
              src={category.image}
              alt={`${category.label} — clothing`}
              className="h-full w-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-105"
              loading="lazy"
            />
          </div>

          {/* Solid Bottom Banner for Label Guarantee */}
          <div className="relative bg-neutral-900 px-4 py-3 text-center transition-colors group-hover:bg-black">
            <h3 
              className="font-sans text-xs sm:text-sm font-bold uppercase tracking-widest"
              style={{ color: '#FFFFFF' }}
            >
              {category.label}
            </h3>
          </div>
        </Link>
      </li>
    )
  })}
</ul>
      </div>
    </section>
  )
}