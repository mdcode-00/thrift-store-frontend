import { Link } from 'react-router-dom'

// ============================================================
// Footer — Editorial, warm, minimal
// ============================================================

const SHOP_LINKS = [
  { label: 'Shop All', href: '/shop' },
  { label: "Women's", href: '/category/Womens' },
  { label: "Men's", href: '/category/Mens' },
  { label: 'Outerwear', href: '/category/Outerwear' },
  { label: 'Dresses', href: '/category/Dresses' },
  { label: 'Denim', href: '/category/Denim' },
  { label: 'Accessories', href: '/category/Accessories' },
]

const ACCOUNT_LINKS = [
  { label: 'My Account', href: '/account' },
  { label: 'Orders', href: '/orders' },
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'Cart', href: '/cart' },
]

const INFO_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Sustainability', href: '/sustainability' },
  { label: 'How We Source', href: '/sourcing' },
  { label: 'Shipping & Returns', href: '/shipping' },
  { label: 'Contact', href: '/contact' },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface" aria-label="Site footer">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">

        {/* Main footer grid */}
        <div className="grid grid-cols-2 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <div className="col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="block font-serif text-xl font-medium text-foreground hover:text-primary transition-colors duration-150"
              aria-label="Vintage Thrift Room — Home"
            >
              Vintage Thrift Room
            </Link>
            <p className="mt-4 font-sans text-sm leading-relaxed text-secondary max-w-xs">
              A carefully curated collection of vintage and pre-loved clothing — for people who
              care about what they wear and where it comes from.
            </p>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://instagram.com"
                aria-label="Follow us on Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-border text-secondary hover:border-primary hover:text-primary transition-all duration-150"
              >
                <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                aria-label="Follow us on Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-border text-secondary hover:border-primary hover:text-primary transition-all duration-150"
              >
                <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                aria-label="Subscribe on YouTube"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-border text-secondary hover:border-primary hover:text-primary transition-all duration-150"
              >
                <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <path d="m10 15 5-3-5-3v6Z" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop links */}
          <nav aria-label="Shop navigation">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground mb-5">
              Shop
            </h3>
            <ul role="list" className="space-y-3">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="font-sans text-sm text-secondary hover:text-primary transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Account links */}
          <nav aria-label="Account navigation">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground mb-5">
              Account
            </h3>
            <ul role="list" className="space-y-3">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="font-sans text-sm text-secondary hover:text-primary transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Info links */}
          <nav aria-label="Information navigation">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground mb-5">
              Information
            </h3>
            <ul role="list" className="space-y-3">
              {INFO_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="font-sans text-sm text-secondary hover:text-primary transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs text-secondary">
            &copy; {new Date().getFullYear()} Vintage Thrift Room. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="font-sans text-xs text-secondary hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="font-sans text-xs text-secondary hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}