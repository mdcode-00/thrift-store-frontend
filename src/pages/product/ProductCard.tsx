import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { axiosInstance } from "@/api/axiosInstance";
import { Badge } from "@/components/ui/Badge";
import {
  removeFromWishlist,
  selectIsWishlisted,
  toggleWishlist,
} from "@/store/slices/wishlistSlice";
import type { AppDispatch, RootState } from "@/store";
import type { Product } from "@/types";
import {
  addToCart,
  removeFromCart,
  selectIsInCart,
} from "@/store/slices/cartSlice";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
}

export function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
}: ProductCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isWishlisted = useSelector((state: RootState) =>
    selectIsWishlisted(product._id)(state),
  );
  const isNew =
    Date.now() - new Date(product.createdAt).getTime() <
    7 * 24 * 60 * 60 * 1000;
  const isInCart = useSelector((state: RootState) =>
    selectIsInCart(product._id)(state),
  );


  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const wasWishlisted = isWishlisted;
    dispatch(
      wasWishlisted ? removeFromWishlist(product._id) : toggleWishlist(product),
    );
    onToggleWishlist?.(product._id);
    void (async () => {
      try {
        if (wasWishlisted) {
          await axiosInstance.delete(`/wishlist/${product._id}`);
        } else {
          await axiosInstance.post("/wishlist", { productId: product._id });
        }
      } catch (error) {
        dispatch(
          wasWishlisted
            ? toggleWishlist(product)
            : removeFromWishlist(product._id),
        );
        console.error("Could not update wishlist:", error);
      }
    })();
  }

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0 || isInCart) return;
    dispatch(addToCart({ product }));
    onAddToCart?.(product._id);

    void (async () => {
      try {
        await axiosInstance.post("/cart", {
          productId: product._id,
          quantity: 1,
        });
      } catch (error) {
        dispatch(removeFromCart({ productId: product._id }));
        console.error("Could not add to cart:", error);
      }
    })();
  }

return (
  <article className="group relative flex flex-col">
    <Link
      to={`/product/${product._id}`}
      className="relative block overflow-hidden rounded-sm bg-surface"
      aria-label={`View ${product.name}`}
    >
      <div className="aspect-3/4 w-full overflow-hidden">
        <img
          src={product.image[0]?.url}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {isNew && (
        <div className="absolute left-3 top-3">
          <Badge label="NEW" />
        </div>
      )}

      <button
        onClick={handleWishlist}
        aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        aria-pressed={isWishlisted}
        className={[
          "absolute right-3 top-3",
          "flex h-8 w-8 items-center justify-center rounded-full",
          "bg-white/90 shadow-sm",
          "transition-all duration-200",
          "md:opacity-0 md:group-hover:opacity-100",
          isWishlisted ? "text-primary" : "text-secondary hover:text-primary",
        ].join(" ")}
      >
        <Heart size={16} strokeWidth={1.5} fill={isWishlisted ? "currentColor" : "none"} aria-hidden="true" />
      </button>

      {/* Desktop hover "Add to bag" — belongs HERE, inside the image Link, not in the info section below */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0 hidden md:block">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isInCart}
          className="flex w-full items-center justify-center gap-2 bg-foreground/90 py-3 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm transition-colors hover:bg-foreground disabled:opacity-50"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingBag size={14} aria-hidden="true" />
          {product.stock === 0 ? "Sold out" : isInCart ? "In your bag" : "Add to bag"}
        </button>
      </div>
    </Link>

    <div className="mt-3 flex flex-col gap-1">
      <Link to={`/product/${product._id}`} className="block">
        <h3 className="font-sans text-sm font-medium text-foreground leading-snug hover:text-primary transition-colors duration-150 line-clamp-2">
          {product.name}
        </h3>
      </Link>

      <span className="font-sans text-sm font-semibold text-foreground">${product.price}</span>

      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0 || isInCart}
        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-sm border border-border py-2 text-[11px] font-semibold uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50 md:hidden"
        aria-label={`Add ${product.name} to cart`}
      >
        <ShoppingBag size={12} aria-hidden="true" />
        {product.stock === 0 ? "Sold out" : isInCart ? "In your bag" : "Add to bag"}
      </button>
    </div>
  </article>
);
}
