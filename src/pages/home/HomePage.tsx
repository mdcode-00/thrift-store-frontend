import { HeroSection } from './sections/HeroSection'
import { LatestProductsSection } from './sections/LatestProductsSection'
import { TrustBenefitsSection } from './sections/TrustBenefitsSection'
import { CategoriesSection } from './sections/CategoriesSection'
import { ExclusiveOfferSection } from './sections/ExclusiveOfferSection'
// import { FeaturedProductsSection } from './sections/FeaturedProductsSection'
import { SeasonalCollectionSection } from './sections/SeasonalCollectionSection'
import { CustomerReviewsSection } from './sections/CustomerReviewsSection'
// import { NewsletterSection } from './sections/NewsletterSection'

export function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <LatestProductsSection />
      <TrustBenefitsSection />
      <CategoriesSection />
      <ExclusiveOfferSection />
      {/* <FeaturedProductsSection /> */}
      <SeasonalCollectionSection />
      <CustomerReviewsSection />
      {/* <NewsletterSection /> */}
    </div>
  )
}

export default HomePage