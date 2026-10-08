import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "@/api/axiosInstance";
import {
  setCredentials,
  logout,
  finishInitializing,
  selectIsInitializing,
} from "@/store/slices/authSlice";
import type { AppDispatch, RootState } from "@/store";

import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AppBootSkeleton } from "@/components/ui/AppBootSkeleton";
import { GuestRoute, ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";

// import { HomePage } from "@/pages/home/HomePage";
// import { PlaceholderPage } from "@/pages/PlaceholderPage";
// import { LoginPage } from "@/pages/auth/LoginPage";
// import { RegisterPage } from "@/pages/auth/RegisterPage";
// import { AccountPage } from "@/pages/auth/AccountPage";
// import { CartPage } from "@/pages/cart/CartPage";
// import { WishlistPage } from "@/pages/wishlist/WishlistPage";
// import { ShopPage } from "./pages/shop/ShopPage";
// import { CategoryPage } from "./pages/category/CategoryPage";
// import { ProductDetailPage } from "./pages/product/ProductDetailPage";
// import { CheckoutPage } from "./pages/checkout/CheckoutPage";
// import { SearchPage } from "./pages/search/SearchPage";
import {
  setWishlistItems,
  setWishlistLoading,
} from "./store/slices/wishlistSlice";
import { setCartItems, setCartLoading } from "./store/slices/cartSlice";
import WhatsAppSupportForm from "./pages/info/ReturnAndRefund";
import AboutUsPage from "./pages/info/AboutUsPage";
import { ContactUsPage } from "./pages/info/ContactUs";


// import OrdersPage from "./pages/orders/OrdersPage";
// import OrderDetailPage from "./pages/orders/OrderDetailPage";
// import ReviewsPage from "./pages/Review/ReviewsPage";
// import { AdminProductPage } from "./pages/admin/AdminProductsPage";
// import AdminProductFormPage from "./pages/admin/AdminProductFormPage";
// import AdminOrdersPage from "./pages/admin/AdminOrderPages";
// import AdminUsersPage from "./pages/admin/AdminUsersPage";
// import AdminUserDetailPage from "./pages/admin/AdminUserDetailPage";
// import AdminDashboardPage from "./pages/admin/AdminDashboardPage";


// ============================================================
// Lazy-loaded Pages (Code Splitting to fix large bundle size)
// ============================================================
const HomePage = lazy(() => import("@/pages/home/HomePage").then(m => ({ default: m.HomePage })));
const ShopPage = lazy(() => import("./pages/shop/ShopPage").then(m => ({ default: m.ShopPage })));
const CategoryPage = lazy(() => import("./pages/category/CategoryPage").then(m => ({ default: m.CategoryPage })));
const ProductDetailPage = lazy(() => import("./pages/product/ProductDetailPage").then(m => ({ default: m.ProductDetailPage })));
const SearchPage = lazy(() => import("./pages/search/SearchPage").then(m => ({ default: m.SearchPage })));
const ReviewsPage = lazy(() => import("./pages/Review/ReviewsPage").then(m => ({ default: m.ReviewsPage })));

const LoginPage = lazy(() => import("@/pages/auth/LoginPage").then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage").then(m => ({ default: m.RegisterPage })));
const AccountPage = lazy(() => import("@/pages/auth/AccountPage").then(m => ({ default: m.AccountPage })));

const CartPage = lazy(() => import("@/pages/cart/CartPage").then(m => ({ default: m.CartPage })));
const WishlistPage = lazy(() => import("@/pages/wishlist/WishlistPage").then(m => ({ default: m.WishlistPage })));
const CheckoutPage = lazy(() => import("./pages/checkout/CheckoutPage").then(m => ({ default: m.CheckoutPage })));

const OrdersPage = lazy(() => import("./pages/orders/OrdersPage"));
const OrderDetailPage = lazy(() => import("./pages/orders/OrderDetailPage"));

const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const AdminProductPage = lazy(() => import("./pages/admin/AdminProductsPage").then(m => ({ default: m.AdminProductPage })));
const AdminProductFormPage = lazy(() => import("./pages/admin/AdminProductFormPage"));
const AdminOrdersPage = lazy(() => import("./pages/admin/AdminOrderPages"));
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage"));
const AdminUserDetailPage = lazy(() => import("./pages/admin/AdminUserDetailPage"));

const PlaceholderPage = lazy(() => import("@/pages/PlaceholderPage").then(m => ({ default: m.PlaceholderPage })));

export function App() {
  const dispatch = useDispatch<AppDispatch>();
  const isInitializing = useSelector((state: RootState) =>
    selectIsInitializing(state),
  );

  useEffect(() => {
    let isMounted = true;

    async function silentRefresh() {
      try {
        const res = await axiosInstance.post("/auth/refresh");
        const data = res.data;
        const token =
          data.accessToken ||
          data.token ||
          data.data?.accessToken ||
          data.data?.token;
        const user = data.user || data.data?.user;

        if (token && user) {
          dispatch(setCredentials({ user, token }));

          dispatch(setWishlistLoading(true));
          dispatch(setCartLoading(true));

          const [wishlistRes, cartRes] = await Promise.allSettled([
            axiosInstance.get("/wishlist"),
            axiosInstance.get("/cart"),
          ]);

          if (isMounted) {
            if (wishlistRes.status === "fulfilled") {
              dispatch(setWishlistItems(wishlistRes.value.data.items || []));
            } else {
              dispatch(setWishlistLoading(false));
            }

            if (cartRes.status === "fulfilled") {
              dispatch(setCartItems(cartRes.value.data.items || []));
            } else {
              dispatch(setCartLoading(false));
            }
          }
        } else {
          dispatch(logout());
        }
      } catch {
        dispatch(logout());
      } finally {
        if (isMounted) {
          dispatch(finishInitializing());
        }
      }
    }

    silentRefresh();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  if (isInitializing) {
    return <AppBootSkeleton />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-muted selection:text-foreground">
      {/* Toast notifications with Vintage Thrift Room styling */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--color-surface, #FBF8F3)",
            color: "var(--color-foreground, #3E2B22)",
            border: "1px solid var(--color-border, #D5C7B8)",
            fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
            fontSize: "13px",
            borderRadius: "4px",
            boxShadow: "var(--shadow-hover, 0 4px 16px rgba(62, 43, 34, 0.12))",
          },
          success: {
            iconTheme: {
              primary: "var(--color-primary, #6B4A38)",
              secondary: "#FFFFFF",
            },
          },
          error: {
            iconTheme: {
              primary: "var(--color-destructive, #B42318)",
              secondary: "#FFFFFF",
            },
          },
        }}
      />

      {/* Top announcement bar */}
      <AnnouncementBar />

      {/* Main navigation header */}
      <Header />

      {/* Main page content */}
      <main className="flex-1">
        <Suspense fallback={<AppBootSkeleton />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />



          {/* Guest-only routes */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/account" element={<AccountPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path='/return-and-refund' element={<WhatsAppSupportForm />} />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminRoute />}>
            <Route
              path="/admin"
              element={<AdminDashboardPage/>}
            />
            <Route path="/admin/products" element={<AdminProductPage />} />
            <Route
              path="/admin/products/new"
              element={<AdminProductFormPage />}
            />
            <Route
              path="/admin/products/:id/edit"
              element={<AdminProductFormPage />}
            />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />

            <Route path="/admin/users" element={<AdminUsersPage />} />

            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users/:id" element={<AdminUserDetailPage />} />
          </Route>

          <Route
            path="*"
            element={<PlaceholderPage title="Page Not Found" is404 />}
          />
        </Routes>
        </Suspense>
      </main>

      {/* Editorial footer */}
      <Footer />
    </div>
  );
}

export default App;
