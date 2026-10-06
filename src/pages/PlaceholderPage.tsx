import { ArrowLeft } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface PlaceholderPageProps {
  title: string
  is404?: boolean
}

export function PlaceholderPage({ title, is404 = false }: PlaceholderPageProps) {
  const location = useLocation()

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mx-auto max-w-lg">
        <span className="mb-3 block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
          {is404 ? '404 Error' : 'Coming Soon'}
        </span>
        <h1 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 font-sans text-sm leading-relaxed text-secondary">
          {is404
            ? `The page at "${location.pathname}" could not be found. It may have been moved or removed.`
            : `This section (${location.pathname}) is part of the planned storefront and will be populated in the next phase.`}
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md border border-primary bg-primary px-6 py-3 font-sans text-xs font-semibold uppercase tracking-widest text-white transition-colors duration-200 hover:bg-foreground hover:border-foreground"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PlaceholderPage