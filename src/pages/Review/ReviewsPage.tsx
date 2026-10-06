import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchReviews } from "@/api/review";
import { StarRating } from "@/components/ui/StarRaiting";
import { Skeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import type { Review } from "@/types";

export function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchReviews(page, 12)
      .then((data) => {
        if (cancelled) return;
        setReviews(data.reviews);
        setAvgRating(data.avgRating);
        setTotal(data.total);
        setTotalPages(data.pagination.totalPages);
      })
      .catch(() => {
        if (!cancelled) setError("Cloud not load reviews right now.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center border-b border-border pb-10 mb-10">
        <span className="block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-2">
          Customer Stories
        </span>
        <h1 className="font-serif text-4xl font-medium text-foreground">
          Our Reviewers Love...
        </h1>
        {avgRating !== null && (
          <p className="mt-3 font-sans text-sm text-secondary">
            {avgRating.toFixed(1)} out of 5, based on {total} review
            {total === 1 ? "" : "s"}
          </p>
        )}
      </div>

      {error && <div className="text-center py-16 text-secondary">{error}</div>}

      {!error && isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="border border-border bg-surface rounded-sm p-5 space-y-3"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-1/3 mt-4" />
            </div>
          ))}
        </div>
      )}

      {!error && !isLoading && reviews.length === 0 && (
        <div className="py-20 text-center">
          <h2 className="font-serif text-2xl font-medium text-foreground">
            Be the first to share your experience.
          </h2>
          <div className="mt-6">
            <Button as={Link} to="/shop" variant="primary" size="md">
              Start Shopping
            </Button>
          </div>
        </div>
      )}

      {!error && !isLoading && reviews.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border border-border bg-surface rounded-sm p-5 flex flex-col gap-2"
              >
                <StarRating rating={review.rating} size={14} />
                <p className="font-sans text-sm text-foreground leading-relaxed">
                  {review.comment}
                </p>
                <p className="font-sans text-xs text-secondary mt-auto pt-2">
                  — on {review.productName}
                </p>
                <p className="font-sans text-xs text-secondary">
                  {review.user.name} ·{" "}
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}



export default ReviewsPage;