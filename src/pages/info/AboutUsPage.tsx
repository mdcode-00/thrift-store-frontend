import { Button } from '@/components/ui/Button'
import { Link } from 'react-router-dom'

export function AboutUsPage() {
  return (
    <div className="mx-auto max-w-[800px] py-16 text-center">
      <h1 className="font-serif text-4xl mb-4">About Us</h1>
      <p className="font-sans text-lg text-[var(--color-secondary)] mb-6">
        Vintage Thrift Room curates timeless pieces with a sustainable mindset. Our story began ...
      </p>
      <Button as={Link} to="/" className="mt-4">Return Home</Button>
    </div>
  )
}