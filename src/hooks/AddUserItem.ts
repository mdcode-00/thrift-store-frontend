import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "@/api/axiosInstance";
import type { AppDispatch, RootState } from "@/store";
import type { Product } from "@/types";
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

export function useWishlist(product: Product) {
  const dispatch = useDispatch<AppDispatch>();

  const isWishlisted = useSelector((state: RootState) =>
    selectIsWishlisted(product._id)(state),
  );

  const handleWishlist = async () => {
    const wasWishlisted = isWishlisted;

    // Optimistic Redux update
    dispatch(
      wasWishlisted
        ? removeFromWishlist(product._id)
        : toggleWishlist(product),
    );

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
  };

  return {
    isWishlisted,
    handleWishlist,
  };
}


export function useCart(product: Product) {
  const dispatch = useDispatch<AppDispatch>();

  const isInCart = useSelector((state: RootState) =>
    selectIsInCart(product._id)(state),
  );

  const handleAddToCart = async () => {
    if (product.stock === 0 || isInCart) return;

    // Optimistic Redux update
    dispatch(addToCart({ product }));

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
  };

  return {
    isInCart,
    handleAddToCart,
  };
}
