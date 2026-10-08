import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { axiosInstance } from "@/api/axiosInstance";
import { Button } from "@/components/ui/Button";
import {
  setCredentials,
  selectIsAuthenticated,
} from "@/store/slices/authSlice";
import type { AppDispatch, RootState } from "@/store";
import { GoogleSignInButton } from "@/components/ui/GoogleSignInButton";
import { setWishlistItems } from "@/store/slices/wishlistSlice";
import { setCartItems } from "@/store/slices/cartSlice";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) =>
    selectIsAuthenticated(state),
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/";

  if (isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mx-auto max-w-md rounded-sm border border-border bg-surface p-8 shadow-card">
          <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Already Signed In
          </span>
          <h1 className="font-serif text-2xl font-medium text-foreground">
            You are already logged in
          </h1>
          <p className="mt-3 font-sans text-sm text-secondary">
            Visit your account dashboard to view your profile and orders, or
            explore our vintage collection.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button as={Link} to="/account" variant="primary" size="md">
              Go to Account
            </Button>
            <Button as={Link} to="/shop" variant="outline" size="md">
              Explore Shop
            </Button>
          </div>
        </div>
      </div>
    );
  }

  function validate() {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const res = await axiosInstance.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      const data = res.data;
      const token =
        data.accessToken ||
        data.token ||
        data.data?.accessToken ||
        data.data?.token;
      const user = data.user || data.data?.user;

      if (token && user) {
        dispatch(setCredentials({ user, token }));

        const [wishlistRes, cartRes] = await Promise.allSettled([
      axiosInstance.get('/wishlist'),
      axiosInstance.get('/cart'),
    ]);
    if (wishlistRes.status === 'fulfilled') {
      dispatch(setWishlistItems(wishlistRes.value.data.items || []));
    }
    if (cartRes.status === 'fulfilled') {
      dispatch(setCartItems(cartRes.value.data.items || []));
    }

        toast.success(`Welcome back, ${user.name || "Member"}!`);
        navigate(from, { replace: true });
      } else {
        throw new Error("Malformed login response");
      }
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { data?: { message?: string; error?: string } };
      };
      const message =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        "Invalid email or password. Please try again.";
      setErrors({ general: message });
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center">
          <span className="block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Welcome Back
          </span>
          <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Sign In
          </h1>
          <p className="mt-2 font-sans text-sm text-secondary">
            Access your saved vintage pieces and order history.
          </p>
        </div>

        {/* Form Card */}
        <div className="mt-8 rounded-sm border border-border bg-surface p-6 sm:p-8 shadow-card">
          {errors.general && (
            <div
              role="alert"
              className="mb-5 rounded-sm border border-destructive/20 bg-destructive/10 p-3 font-sans text-xs text-destructive"
            >
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email Field */}
            <div>
              <label
                htmlFor="login-email"
                className="block font-sans text-xs font-semibold uppercase tracking-wider text-foreground"
              >
                Email Address
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-secondary">
                  <Mail size={16} aria-hidden="true" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="name@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={
                    errors.email ? "login-email-error" : undefined
                  }
                  className={[
                    "w-full rounded-sm border bg-background py-2.5 pl-10 pr-3.5",
                    "font-sans text-sm text-foreground placeholder:text-secondary/50",
                    "transition-colors duration-150",
                    "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
                    errors.email ? "border-destructive" : "border-border",
                  ].join(" ")}
                />
              </div>
              {errors.email && (
                <p
                  id="login-email-error"
                  className="mt-1 font-sans text-xs text-destructive"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block font-sans text-xs font-semibold uppercase tracking-wider text-foreground"
                >
                  Password
                </label>
              </div>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-secondary">
                  <Lock size={16} aria-hidden="true" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "login-password-error" : undefined
                  }
                  className={[
                    "w-full rounded-sm border bg-background py-2.5 pl-10 pr-10",
                    "font-sans text-sm text-foreground placeholder:text-secondary/50",
                    "transition-colors duration-150",
                    "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
                    errors.password ? "border-destructive" : "border-border",
                  ].join(" ")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-secondary hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p
                  id="login-password-error"
                  className="mt-1 font-sans text-xs text-destructive"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              className="mt-2"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--color-muted)]" />
            <span className="text-xs uppercase tracking-wide text-[var(--color-secondary)]">
              or
            </span>
            <div className="h-px flex-1 bg-[var(--color-muted)]" />
          </div>

          <div className="mt-6">
            <GoogleSignInButton />
          </div>
        </div>

        {/* Footer Link */}
        <p className="mt-6 text-center font-sans text-xs text-secondary">
          Not a member yet?{" "}
          <Link
            to="/register"
            className="font-semibold text-primary underline underline-offset-4 hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            Create an account
            <ArrowRight size={12} aria-hidden="true" />
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
