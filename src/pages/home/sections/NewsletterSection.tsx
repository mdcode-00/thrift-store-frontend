import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'

// ============================================================
// NewsletterSection — MASTER.md §5 item 11
// Simple email capture, warm cream tones, centered editorial
// ============================================================

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    // TODO: connect to backend newsletter endpoint
    console.info('Newsletter signup:', email)
    setSubmitted(true)
    setEmail('')
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="bg-foreground py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="block font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50 mb-3">
            Stay in the loop
          </span>
          <h2
            id="newsletter-heading"
            className="font-serif text-3xl font-medium text-white sm:text-4xl"
          >
            The Vintage Edit
          </h2>
          <p className="mt-4 font-sans text-sm leading-relaxed text-white/65 max-w-md mx-auto">
            New arrivals, styling notes, and exclusive offers — delivered to your inbox.
            No spam, ever. Unsubscribe anytime.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-sm border border-white/20 bg-white/10 px-6 py-4">
              <p className="font-sans text-sm font-medium text-white">
                You&apos;re on the list. Thanks for joining — something good is coming your way.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8"
              noValidate
              aria-label="Newsletter signup form"
            >
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <div className="flex-1 max-w-sm">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                    aria-describedby={error ? 'newsletter-error' : undefined}
                    aria-invalid={!!error}
                    className={[
                      'w-full rounded-sm border bg-white/10 px-4 py-3',
                      'font-sans text-sm text-white placeholder:text-white/40',
                      'transition-all duration-150',
                      'focus:outline-none focus:ring-2 focus:ring-white/40',
                      error ? 'border-destructive' : 'border-white/20 focus:border-white/40',
                    ].join(' ')}
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="bg-accent text-foreground border-accent hover:bg-muted hover:border-muted shrink-0"
                >
                  Subscribe
                </Button>
              </div>

              {error && (
                <p
                  id="newsletter-error"
                  role="alert"
                  className="mt-2 font-sans text-xs text-destructive"
                >
                  {error}
                </p>
              )}

              <p className="mt-4 font-sans text-[11px] text-white/40">
                By subscribing you agree to our{' '}
                <a href="/privacy" className="underline hover:text-white/70 transition-colors">
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}