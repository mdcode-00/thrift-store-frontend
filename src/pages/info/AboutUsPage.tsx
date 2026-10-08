import { Link } from "react-router-dom";
import { ShoppingBag, Heart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AboutUsPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-border pb-6 mb-12 text-center sm:text-left">
        <span className="block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-1">
          Our Story
        </span>
        <h1 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">
          About Us
        </h1>
      </div>

      {/* Hero / Intro Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-medium text-foreground sm:text-3xl leading-snug">
            Curated vintage pieces and timeless treasures, brought to your doorstep.
          </h2>
          <p className="font-sans text-sm text-secondary leading-relaxed">
            Founded with a passion for exceptional quality and authentic design, our collection brings together unique pieces that tell a story. We believe that style should be both conscious and enduring, offering carefully selected items designed to last a lifetime.
          </p>
          <p className="font-sans text-sm text-secondary leading-relaxed">
            Every item in our catalogue is chosen with intent—valuing craftsmanship, heritage, and sustainable beauty above all else.
          </p>
          <div className="pt-2">
            <Button as={Link} to="/shop" variant="primary" size="md">
              Explore Our Collection
            </Button>
          </div>
        </div>

        {/* Visual Card / Placeholder */}
      <div className="bg-surface border border-border rounded-lg p-2 sm:p-3 shadow-sm overflow-hidden flex flex-col items-center justify-center min-h-[320px]">
  <div className="w-full h-full min-h-[300px] rounded-sm overflow-hidden bg-muted">
    <img 
      src="/public/stor.png"
      alt="Contact Support" 
      className="w-full h-full object-cover object-center rounded-sm"
      onError={(e) => {
        // Fallback display if image fails to load
        e.currentTarget.style.display = 'none';
      }}
    />
  </div>
</div>
      </div>

      {/* Core Values Grid */}
      <div className="border-t border-border pt-16 mb-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-1">
            Why Choose Us
          </span>
          <h2 className="font-serif text-2xl font-medium text-foreground">
            Our Core Principles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Value 1 */}
          <div className="bg-surface border border-border rounded-lg p-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ShoppingBag size={20} />
            </div>
            <h3 className="font-serif text-lg font-medium text-foreground">Curated Selection</h3>
            <p className="font-sans text-xs text-secondary leading-relaxed">
              Hand-picked items that meet strict standards of quality, authenticity, and aesthetic appeal.
            </p>
          </div>

          {/* Value 2 */}
          <div className="bg-surface border border-border rounded-lg p-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Heart size={20} />
            </div>
            <h3 className="font-serif text-lg font-medium text-foreground">Customer First</h3>
            <p className="font-sans text-xs text-secondary leading-relaxed">
              We care deeply about your experience, offering seamless support and dedicated care every step of the way.
            </p>
          </div>

          {/* Value 3 */}
          <div className="bg-surface border border-border rounded-lg p-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-serif text-lg font-medium text-foreground">Trusted Quality</h3>
            <p className="font-sans text-xs text-secondary leading-relaxed">
              Reliable delivery, secure transactions, and transparent policies you can always depend on.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="bg-surface border border-border rounded-lg p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-4 shadow-sm">
        <h3 className="font-serif text-2xl font-medium text-foreground">Have a question or need assistance?</h3>
        <p className="font-sans text-sm text-secondary max-w-md mx-auto">
          Our team is always here to help you find what you are looking for or assist with your orders.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Button as={Link} to="/contact" variant="primary" size="md">
            Contact Us
          </Button>
          <Button as={Link} to="/orders" variant="outline" size="md">
            View Your Orders
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AboutUsPage;