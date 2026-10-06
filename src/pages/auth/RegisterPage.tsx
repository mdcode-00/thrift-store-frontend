import { useState, type FormEvent } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  Check,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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

export function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) =>
    selectIsAuthenticated(state),
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
    general?: string;
  }>({});

  if (isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mx-auto max-w-md rounded-sm border border-border bg-surface p-8 shadow-card">
          <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Account Active
          </span>
          <h1 className="font-serif text-2xl font-medium text-foreground">
            You are currently signed in
          </h1>
          <p className="mt-3 font-sans text-sm text-secondary">
            You already have an active session. Visit your account or continue
            browsing our vintage collection.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button as={Link} to="/account" variant="primary" size="md">
              Go to Account
            </Button>
            <Button as={Link} to="/shop" variant="outline" size="md">
              Explore Collection
            </Button>
          </div>
        </div>
      </div>
    );
  }

  function validate() {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      agreeTerms?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!agreeTerms) {
      newErrors.agreeTerms =
        "You must agree to the Terms of Service and Privacy Policy.";
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
      const res = await axiosInstance.post("/auth/register", {
        name: name.trim(),
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
        toast.success(`Welcome to the Room, ${user.name || "Member"}!`);
        navigate("/account", { replace: true });
      } else {
        throw new Error("Malformed register response");
      }
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { data?: { message?: string; error?: string } };
      };
      const message =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        "Registration failed. Please check your information and try again.";
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
            Join the Room
          </span>
          <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Create an Account
          </h1>
          <p className="mt-2 font-sans text-sm text-secondary">
            Save unique pieces, track your orders, and receive vintage drops
            first.
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 rounded-sm border border-border bg-surface p-6 sm:p-8 shadow-card">
          {errors.general && (
            <div
              role="alert"
              className="mb-5 rounded-sm border border-destructive/20 bg-destructive/10 p-3 font-sans text-xs text-destructive"
            >
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full Name */}
            <div>
              <label
                htmlFor="register-name"
                className="block font-sans text-xs font-semibold uppercase tracking-wider text-foreground"
              >
                Full Name
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-secondary">
                  <UserIcon size={16} aria-hidden="true" />
                </div>
                <input
                  id="register-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name)
                      setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder="Eleanor Vance"
                  aria-invalid={!!errors.name}
                  aria-describedby={
                    errors.name ? "register-name-error" : undefined
                  }
                  className={[
                    "w-full rounded-sm border bg-background py-2.5 pl-10 pr-3.5",
                    "font-sans text-sm text-foreground placeholder:text-secondary/50",
                    "transition-colors duration-150",
                    "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
                    errors.name ? "border-destructive" : "border-border",
                  ].join(" ")}
                />
              </div>
              {errors.name && (
                <p
                  id="register-name-error"
                  className="mt-1 font-sans text-xs text-destructive"
                >
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="register-email"
                className="block font-sans text-xs font-semibold uppercase tracking-wider text-foreground"
              >
                Email Address
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-secondary">
                  <Mail size={16} aria-hidden="true" />
                </div>
                <input
                  id="register-email"
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
                    errors.email ? "register-email-error" : undefined
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
                  id="register-email-error"
                  className="mt-1 font-sans text-xs text-destructive"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="register-password"
                className="block font-sans text-xs font-semibold uppercase tracking-wider text-foreground"
              >
                Password
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-secondary">
                  <Lock size={16} aria-hidden="true" />
                </div>
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="At least 6 characters"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "register-password-error" : undefined
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
                  id="register-password-error"
                  className="mt-1 font-sans text-xs text-destructive"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="register-confirm-password"
                className="block font-sans text-xs font-semibold uppercase tracking-wider text-foreground"
              >
                Confirm Password
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-secondary">
                  <Lock size={16} aria-hidden="true" />
                </div>
                <input
                  id="register-confirm-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword)
                      setErrors((prev) => ({
                        ...prev,
                        confirmPassword: undefined,
                      }));
                  }}
                  placeholder="Re-enter password"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={
                    errors.confirmPassword
                      ? "register-confirm-error"
                      : undefined
                  }
                  className={[
                    "w-full rounded-sm border bg-background py-2.5 pl-10 pr-3.5",
                    "font-sans text-sm text-foreground placeholder:text-secondary/50",
                    "transition-colors duration-150",
                    "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
                    errors.confirmPassword
                      ? "border-destructive"
                      : "border-border",
                  ].join(" ")}
                />
              </div>
              {errors.confirmPassword && (
                <p
                  id="register-confirm-error"
                  className="mt-1 font-sans text-xs text-destructive"
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="pt-1">
              <div className="flex items-start">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    if (errors.agreeTerms)
                      setErrors((prev) => ({ ...prev, agreeTerms: undefined }));
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
                />
                <label
                  htmlFor="agree-terms"
                  className="ml-2 font-sans text-xs text-secondary leading-snug"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-foreground underline underline-offset-2 hover:text-primary"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-foreground underline underline-offset-2 hover:text-primary"
                  >
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="mt-1 font-sans text-xs text-destructive">
                  {errors.agreeTerms}
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
              className="mt-3"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-muted" />
            <span className="text-xs text-secondary uppercase tracking-wide">
              or
            </span>
            <div className="h-px flex-1 bg-muted" />
          </div>
          <div className="mt-6">
            <GoogleSignInButton />
          </div>
        </div>

        {/* Member Privileges info box */}
        <div className="mt-6 rounded-sm border border-border/70 bg-surface/50 p-4">
          <p className="font-sans text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
            Member Privileges
          </p>
          <ul className="space-y-1.5 text-xs text-secondary">
            <li className="flex items-center gap-2">
              <Check size={13} className="text-primary shrink-0" />
              <span>Priority access to Friday vintage drops</span>
            </li>
            <li className="flex items-center gap-2">
              <Check size={13} className="text-primary shrink-0" />
              <span>Save custom sizes and wardrobe preferences</span>
            </li>
            <li className="flex items-center gap-2">
              <Check size={13} className="text-primary shrink-0" />
              <span>Track past and current vintage shipments</span>
            </li>
          </ul>
        </div>

        {/* Footer Link */}
        <p className="mt-6 text-center font-sans text-xs text-secondary">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary underline underline-offset-4 hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            Sign in
            <ArrowRight size={12} aria-hidden="true" />
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
