// src/pages/home/sections/CustomerReviewsSection.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchReviews } from '@/api/review';
import { StarRating } from '@/components/ui/StarRaiting';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Review } from '@/types';

export function CustomerReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews(1, 3) // just the first 3 for a homepage teaser — no pagination needed here
      .then((data: any) => {
        setReviews(data.reviews);
        setAvgRating(data.avgRating);
      })
      .catch(() => {
        // fail quietly on the homepage — a missing reviews section
        // shouldn't break the rest of the page
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Nothing to show and nothing loading — skip the section entirely
  // rather than showing an empty "Customer Reviews" heading with nothing under it
  if (!isLoading && reviews.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <span className="block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-2">
          Customer Stories
        </span>
        <h2 className="font-serif text-3xl font-medium text-foreground">
          Our Reviewers Love...
        </h2>
        {avgRating !== null && (
          <p className="mt-2 font-sans text-sm text-secondary">
            {avgRating.toFixed(1)} out of 5 stars
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-border bg-surface rounded-sm p-5 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review._id} className="border border-border bg-surface rounded-sm p-5 flex flex-col gap-2">
                <StarRating rating={review.rating} size={14} />
                <p className="font-sans text-sm text-foreground leading-relaxed line-clamp-4">
                  {review.comment}
                </p>
                <p className="font-sans text-xs text-secondary mt-auto pt-2">
                  {review.user.name} · on {review.productName}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/reviews"
              className="font-sans text-sm font-semibold text-primary hover:underline"
            >
              Read all reviews &rarr;
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

export default CustomerReviewsSection;