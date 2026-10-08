import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { fetchProductById } from "@/api/products";
import { ProductDetailSkeleton } from "@/pages/product/ProductDetailSkeleton";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/types";
import { useCart, useWishlist } from "@/hooks/AddUserItem";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<'notfound' | 'other' | null>(null);

  useEffect(() => {
    if (!id) {
      setError('notfound');
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchProductById(id)
      .then((data) => setProduct(data))
      .catch((err) => {
        if (err?.response?.status === 404) setError('notfound');
        else setError('other');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ProductDetailSkeleton />;

  if (error === 'notfound') {
    return (
      <div className="mx-auto max-w-[800px] py-16 text-center">
        <h1 className="font-serif text-4xl mb-4">This piece has already found a home</h1>
        <p className="font-sans text-lg text-[var(--color-secondary)] mb-6">
          Since every item is one of a kind, it's no longer available. Explore similar pieces below.
        </p>
        <Button as={Link} to="/shop" variant="primary" size="md">Browse the collection</Button>
      </div>
    );
  }

  if (!product) return null;

  return <ProductDetails product={product} />;
}

function ProductDetails({ product }: { product: Product }) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const { isInCart, handleAddToCart } = useCart(product);
  const { isWishlisted, handleWishlist } = useWishlist(product);

  const mainImage = product.image[selectedIdx];
  const showUrgency = product.stock > 0 && product.stock <= 3;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

        {/* Image gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-[3/4] w-full overflow-hidden rounded-sm bg-[var(--color-muted)]">
            <img
              src={mainImage?.url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          {product.image.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.image.map((img, idx) => (
                <button
                  key={img.publicId}
                  type="button"
                  onClick={() => setSelectedIdx(idx)}
                  className={`h-20 w-20 overflow-hidden rounded-sm border-2 transition-shadow ${
                    idx === selectedIdx
                      ? "border-[var(--color-primary)]"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          <p className="text-sm uppercase tracking-wider text-[var(--color-secondary)]">
            {product.category}
          </p>

          <h1 className="font-serif text-3xl font-medium text-[var(--color-foreground)]">
            {product.name}
          </h1>

          <p className="font-sans text-2xl font-bold text-[var(--color-primary)]">
            ₹{product.price}
          </p>

          {showUrgency && (
            <p className="font-sans text-sm text-[var(--color-accent)]">
              Only {product.stock} left
            </p>
          )}

          <p className="whitespace-pre-line font-sans text-[var(--color-secondary)]">
            {product.description}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="primary"
              size="md"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isInCart}
            >
              {product.stock === 0
                ? "Sold Out"
                : isInCart
                  ? "In your bag"
                  : "Add to Cart"}
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={handleWishlist}
            >
              <Heart 
                size={16} 
                className="mr-2" 
                fill={isWishlisted ? "currentColor" : "none"} 
              />
              {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;