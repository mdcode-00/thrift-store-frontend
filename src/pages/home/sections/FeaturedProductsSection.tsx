// import { ArrowRight } from 'lucide-react'
// import { Link } from 'react-router-dom'
// import { ProductGrid } from '@/components/product/ProductGrid'
// import { PRODUCTS } from '@/data/products'

// // ============================================================
// // FeaturedProductsSection — MASTER.md §5 item 8
// // Staff picks + vintage items
// // ============================================================

// const FEATURED = PRODUCTS.filter(
//   (p) => p.badge === 'STAFF PICK' || p.badge === 'VINTAGE',
// ).slice(0, 4)

// export function FeaturedProductsSection() {
//   return (
//     <section
//       aria-labelledby="featured-heading"
//       className="py-16 sm:py-20"
//     >
//       <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">

//         {/* Section header */}
//         <div className="mb-10 flex items-end justify-between gap-4">
//           <div>
//             <span className="block font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary mb-2">
//               Curated picks
//             </span>
//             <h2
//               id="featured-heading"
//               className="font-serif text-3xl font-medium text-foreground sm:text-4xl"
//             >
//               Featured Pieces
//             </h2>
//           </div>
//           <Link
//             to="/shop"
//             className="inline-flex shrink-0 items-center gap-1.5 font-sans text-sm font-medium text-secondary hover:text-primary transition-colors duration-150 group"
//             aria-label="View all featured products"
//           >
//             See all
//             <ArrowRight
//               size={14}
//               aria-hidden="true"
//               className="transition-transform duration-150 group-hover:translate-x-0.5"
//             />
//           </Link>
//         </div>

//         <ProductGrid products={FEATURED} columns={4} />
//       </div>
//     </section>
//   )
// }