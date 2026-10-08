import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/api/axiosInstance";
import type { AppDispatch, RootState } from "@/store";
import type { Product } from "@/types";
import { selectIsAuthenticated } from "@/store/slices/authSlice"; // Adjust path if needed
import {
  removeFromWishlist,
  selectIsWishlisted,
  toggleWishlist,
} from "@/store/slices/wishlistSlice";
import {
  addToCart,
  removeFromCart,
  selectIsInCart,
} from "@/store/slices/cartSlice";

interface UseCartWishlistOptions {
  onToggleWishlist?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
}

export function useWishlist(product: Product, options?: UseCartWishlistOptions) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const isAuthenticated = useSelector((state: RootState) =>
    selectIsAuthenticated(state)
  );

  const isWishlisted = useSelector((state: RootState) =>
    selectIsWishlisted(product._id)(state),
  );

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const wasWishlisted = isWishlisted;

    // Optimistic Redux update
    dispatch(
      wasWishlisted
        ? removeFromWishlist(product._id)
        : toggleWishlist(product),
    );

    options?.onToggleWishlist?.(product._id);

    void (async () => {
      try {
        if (wasWishlisted) {
          await axiosInstance.delete(`/wishlist/${product._id}`);
        } else {
          await axiosInstance.post("/wishlist", {
            productId: product._id,
          });
        }
      } catch (error) {
        // Rollback
        dispatch(
          wasWishlisted
            ? toggleWishlist(product)
            : removeFromWishlist(product._id),
        );

        console.error("Could not update wishlist:", error);
      }
    })();
  };

  return {
    isWishlisted,
    handleWishlist,
  };
}

export function useCart(product: Product, options?: UseCartWishlistOptions) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state: RootState) =>
    selectIsAuthenticated(state)
  );

  const isInCart = useSelector((state: RootState) =>
    selectIsInCart(product._id)(state),
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (product.stock === 0 || isInCart) return;

    // Optimistic Redux update
    dispatch(addToCart({ product }));
    options?.onAddToCart?.(product._id);

    void (async () => {
      try {
        await axiosInstance.post("/cart", {
          productId: product._id,
          quantity: 1,
        });
      } catch (error) {
        // Rollback
        dispatch(
          removeFromCart({
            productId: product._id,
          }),
        );

        console.error("Could not add to cart:", error);
      }
    })();
  };

  return {
    isInCart,
    handleAddToCart,
  };
}