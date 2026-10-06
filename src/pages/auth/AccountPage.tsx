import { useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  User,
  Package,
  Heart,
  LogOut,
  ShieldCheck,
  Mail,
  ShoppingBag,
  MapPin,
  Edit3,
} from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "@/api/axiosInstance";
import { Button } from "@/components/ui/Button";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  updateUser,
} from "@/store/slices/authSlice";
import { selectCartCount } from "@/store/slices/cartSlice";
import { selectWishlistCount } from "@/store/slices/wishlistSlice";
import { useAuthLogout } from "@/hooks/useAuthLogout";
import type { RootState, AppDispatch } from "@/store";
import type { Address, User as UserType } from "@/types";

function isAddressSaved(address?: Address | null): address is Address {
  if (!address) return false;
  return Boolean(
    address.line1?.trim() &&
    address.city?.trim() &&
    address.postalCode?.trim() &&
    address.phone?.trim(),
  );
}

interface ShippingAddressCardProps {
  user: UserType;
}

function ShippingAddressCard({ user }: ShippingAddressCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const hasSavedAddress = isAddressSaved(user.address);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Address>({
    line1: user.address?.line1 || "",
    line2: user.address?.line2 || "",
    city: user.address?.city || 'Lucknow',
    state: user.address?.state || 'Uttar Pradesh',
    postalCode: user.address?.postalCode || "",
    country: user.address?.country || 'India',
    phone: user.address?.phone || user.phone || "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>(
    {},
  );

  function handleStartEdit() {
    setFormData({
      line1: user.address?.line1 || "",
      line2: user.address?.line2 || "",
      city: user.address?.city || "",
      state: user.address?.state || "",
      postalCode: user.address?.postalCode || "",
      country: user.address?.country || "",
      phone: user.address?.phone || user.phone || "",
    });
    setErrors({});
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setFormData({
      line1: user.address?.line1 || "",
      line2: user.address?.line2 || "",
      city: user.address?.city || "",
      state: user.address?.state || "",
      postalCode: user.address?.postalCode || "",
      country: user.address?.country || "",
      phone: user.address?.phone || user.phone || "",
    });
    setErrors({});
    setIsEditing(false);
  }

  function validate() {
    const newErrors: Partial<Record<keyof Address, string>> = {};
    if (!formData.line1.trim()) newErrors.line1 = "Address Line 1 is required.";
    if (!formData.city.trim()) newErrors.city = "City is required.";
    if (!formData.state.trim())
      newErrors.state = "State / Province is required.";
    if (!formData.postalCode.trim())
      newErrors.postalCode = "Postal code is required.";
    if (!formData.country.trim()) newErrors.country = "Country is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const addressPayload = {
        line1: formData.line1.trim(),
        line2: formData.line2?.trim() || undefined,
        city: formData.city.trim(),
        state: formData.state.trim(),
        postalCode: formData.postalCode.trim(),
        country: formData.country.trim(),
        phone: formData.phone.trim(),
      };

      const res = await axiosInstance.patch("/users/me", {
        address: addressPayload,
      });

      const data = res.data;
      console.log("Updated user data:", data);
      const updatedUser: UserType = data.user ||
        data.data?.user || {
        ...user,
        address: addressPayload,
      };

      dispatch(updateUser(updatedUser));
      toast.success("Shipping address updated successfully");
      setIsEditing(false);
    } catch (err: unknown) {
      const errorObj = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        errorObj?.response?.data?.message ||
        errorObj.message ||
        "Could not update address. Please try again.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-sm border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapPin size={18} aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-medium text-foreground">
              Shipping Address
            </h2>
            <p className="font-sans text-xs text-secondary">
              Used for delivery and checkout calculations
            </p>
          </div>
        </div>
        {hasSavedAddress && !isEditing && (
          <Button
            onClick={handleStartEdit}
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <Edit3 size={13} aria-hidden="true" />
            Edit Address
          </Button>
        )}
      </div>

      {hasSavedAddress && !isEditing ? (
        <div className="font-sans text-sm text-secondary space-y-1 bg-background p-4 rounded-sm border border-border/70">
          <p className="font-medium text-foreground text-base mb-1">
            {user.name}
          </p>
          <p>{user.address?.line1}</p>
          {user.address?.line2 && <p>{user.address?.line2}</p>}
          <p>
            {user.address?.city}, {user.address?.state}{" "}
            {user.address?.postalCode}
          </p>
          <p>{user.address?.country}</p>
          <p className="pt-2 text-xs text-secondary/80 font-mono">
            Phone: {user.address?.phone}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Address Line 1 */}
          <div>
            <label
              htmlFor="addr-line1"
              className="block font-sans text-xs font-semibold uppercase tracking-wider text-foreground mb-1"
            >
              Address Line 1 <span className="text-destructive">*</span>
            </label>
            <input
              id="addr-line1"
              type="text"
              value={formData.line1}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, line1: e.target.value }));
                if (errors.line1)
                  setErrors((prev) => ({ ...prev, line1: undefined }));
              }}
              placeholder="Street address or P.O. Box"
              aria-invalid={!!errors.line1}
              className={[
                "w-full rounded-sm border bg-background py-2 px-3",
                "font-sans text-sm text-foreground placeholder:text-secondary/50",
                "transition-colors duration-150",
                "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
                errors.line1 ? "border-destructive" : "border-border",
              ].join(" ")}
            />
            {errors.line1 && (
              <p className="mt-1 font-sans text-xs text-destructive">
                {errors.line1}
              </p>
            )}
          </div>

          {/* Address Line 2 */}
          <div>
            <label
              htmlFor="addr-line2"
              className="block font-sans text-xs font-semibold uppercase tracking-wider text-foreground mb-1"
            >
              Address Line 2{" "}
              <span className="text-secondary font-normal lowercase tracking-normal">
                (optional)
              </span>
            </label>
            <input
              id="addr-line2"
              type="text"
              value={formData.line2 || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, line2: e.target.value }))
              }
              placeholder="Apartment, suite, unit, building, floor, etc."
              className="w-full rounded-sm border border-border bg-background py-2 px-3 font-sans text-sm text-foreground placeholder:text-secondary/50 transition-colors duration-150 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Service area notice */}
          <div className="rounded-sm border border-border bg-muted/40 px-3 py-2.5 mb-1">
            <p className="font-sans text-xs text-secondary leading-relaxed">
              We currently deliver only within Lucknow, Uttar Pradesh. We're working on expanding to more cities soon.
            </p>
          </div>

          {/* City & State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="addr-city"
                className="block font-sans text-xs font-semibold uppercase tracking-wider text-foreground mb-1"
              >
                City <span className="text-destructive">*</span>
              </label>
              <input
                id="addr-city"
                type="text"
                value="Lucknow"
                disabled
                className="w-full rounded-sm border border-border bg-muted py-2 px-3 font-sans text-sm text-foreground cursor-not-allowed opacity-75"
              />
              {errors.city && (
                <p className="mt-1 font-sans text-xs text-destructive">
                  {errors.city}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="addr-state"
                className="block font-sans text-xs font-semibold uppercase tracking-wider text-foreground mb-1"
              >
                State / Province <span className="text-destructive">*</span>
              </label>
              <input
                id="addr-state"
                type="text"
                value="Uttar Pradesh"
                disabled
                className="w-full rounded-sm border border-border bg-muted py-2 px-3 font-sans text-sm text-foreground cursor-not-allowed opacity-75"
              />
              {errors.state && (
                <p className="mt-1 font-sans text-xs text-destructive">
                  {errors.state}
                </p>
              )}
            </div>
          </div>

          {/* Postal Code & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="addr-postalCode"
                className="block font-sans text-xs font-semibold uppercase tracking-wider text-foreground mb-1"
              >
                Postal Code <span className="text-destructive">*</span>
              </label>
              <input
                id="addr-postalCode"
                type="text"
                value={formData.postalCode}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    postalCode: e.target.value,
                  }));
                  if (errors.postalCode)
                    setErrors((prev) => ({ ...prev, postalCode: undefined }));
                }}
                placeholder="Postal / ZIP code"
                aria-invalid={!!errors.postalCode}
                className={[
                  "w-full rounded-sm border bg-background py-2 px-3",
                  "font-sans text-sm text-foreground placeholder:text-secondary/50",
                  "transition-colors duration-150",
                  "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
                  errors.postalCode ? "border-destructive" : "border-border",
                ].join(" ")}
              />
              {errors.postalCode && (
                <p className="mt-1 font-sans text-xs text-destructive">
                  {errors.postalCode}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="addr-country"
                className="block font-sans text-xs font-semibold uppercase tracking-wider text-foreground mb-1"
              >
                Country <span className="text-destructive">*</span>
              </label>
              <input
                id="addr-country"
                type="text"
                value="India"
                disabled
                className="w-full rounded-sm border border-border bg-muted py-2 px-3 font-sans text-sm text-foreground cursor-not-allowed opacity-75"
              />
              {errors.country && (
                <p className="mt-1 font-sans text-xs text-destructive">
                  {errors.country}
                </p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="addr-phone"
              className="block font-sans text-xs font-semibold uppercase tracking-wider text-foreground mb-1"
            >
              Contact Phone <span className="text-destructive">*</span>
            </label>
            <input
              id="addr-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, phone: e.target.value }));
                if (errors.phone)
                  setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              placeholder="+1 (555) 000-0000"
              aria-invalid={!!errors.phone}
              className={[
                "w-full rounded-sm border bg-background py-2 px-3",
                "font-sans text-sm text-foreground placeholder:text-secondary/50",
                "transition-colors duration-150",
                "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
                errors.phone ? "border-destructive" : "border-border",
              ].join(" ")}
            />
            {errors.phone && (
              <p className="mt-1 font-sans text-xs text-destructive">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="primary" size="md" loading={saving}>
              {hasSavedAddress ? "Update Address" : "Save Address"}
            </Button>
            {hasSavedAddress && isEditing && (
              <Button
                type="button"
                variant="ghost"
                size="md"
                disabled={saving}
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

export function AccountPage() {
  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const isAuthenticated = useSelector((state: RootState) =>
    selectIsAuthenticated(state),
  );
  const cartCount = useSelector((state: RootState) => selectCartCount(state));
  const wishlistCount = useSelector((state: RootState) =>
    selectWishlistCount(state),
  );
  const handleLogout = useAuthLogout();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mx-auto max-w-md rounded-sm border border-border bg-surface p-8 shadow-card">
          <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Authentication Required
          </span>
          <h1 className="font-serif text-2xl font-medium text-foreground">
            Please sign in to view your account
          </h1>
          <p className="mt-3 font-sans text-sm text-secondary">
            Sign in to review your saved pieces, past vintage orders, and
            personal details.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button as={Link} to="/login" variant="primary" size="md">
              Sign In
            </Button>
            <Button as={Link} to="/register" variant="outline" size="md">
              Create Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
      {/* Top Breadcrumb & Title */}
      <div className="border-b border-border pb-6">
        <span className="block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-1">
          Member Dashboard
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">
              Hello, {user.name}
            </h1>
            <p className="mt-1 font-sans text-sm text-secondary">
              Vintage Thrift Room Member since 2026{" "}
              {user.role === "admin" ? "• Admin" : ""}
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="self-start sm:self-auto gap-2"
          >
            <LogOut size={14} aria-hidden="true" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Profile overview */}
        <div className="space-y-6">
          <div className="rounded-sm border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User size={22} aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-medium text-foreground">
                  {user.name}
                </h2>
                <span className="inline-flex items-center gap-1 font-sans text-xs text-accent font-medium">
                  <ShieldCheck size={13} />{" "}
                  {user.role === "admin"
                    ? "Administrator"
                    : "Authenticated Member"}
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-3 font-sans text-sm">
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-secondary">
                  Email
                </span>
                <div className="flex items-center gap-2 text-foreground mt-0.5">
                  <Mail size={14} className="text-secondary" />
                  <span>{user.email}</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="block text-xs font-semibold uppercase tracking-wider text-secondary">
                  Preferences
                </span>
                <p className="text-xs text-secondary mt-0.5">
                  Subscribed to Friday Vintage Drops
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Shipping Address + Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address Section */}
          <ShippingAddressCard user={user} />

          {/* Quick Activity and Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Wishlist Box */}
            <Link
              to="/wishlist"
              className="group flex flex-col justify-between rounded-sm border border-border bg-surface p-6 transition-all hover:border-primary hover:shadow-card"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-sans text-xs font-semibold uppercase tracking-wider text-secondary">
                    Saved Pieces
                  </span>
                  <h3 className="mt-1 font-serif text-2xl font-medium text-foreground">
                    {wishlistCount} {wishlistCount === 1 ? "item" : "items"}
                  </h3>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/40 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Heart size={18} />
                </div>
              </div>
              <p className="mt-4 font-sans text-xs text-secondary group-hover:text-primary transition-colors">
                View your curated wishlist &rarr;
              </p>
            </Link>

            {/* Bag Box */}
            <Link
              to="/cart"
              className="group flex flex-col justify-between rounded-sm border border-border bg-surface p-6 transition-all hover:border-primary hover:shadow-card"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-sans text-xs font-semibold uppercase tracking-wider text-secondary">
                    Shopping Bag
                  </span>
                  <h3 className="mt-1 font-serif text-2xl font-medium text-foreground">
                    {cartCount} {cartCount === 1 ? "item" : "items"}
                  </h3>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/40 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <ShoppingBag size={18} />
                </div>
              </div>
              <p className="mt-4 font-sans text-xs text-secondary group-hover:text-primary transition-colors">
                Go to checkout &rarr;
              </p>
            </Link>

            {/* Orders Box */}
            <Link
              to="/orders"
              className="group flex flex-col justify-between rounded-sm border border-border bg-surface p-6 transition-all hover:border-primary hover:shadow-card sm:col-span-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-sans text-xs font-semibold uppercase tracking-wider text-secondary">
                    Order History
                  </span>
                  <h3 className="mt-1 font-serif text-xl font-medium text-foreground">
                    Track Shipments & Receipts
                  </h3>
                  <p className="mt-1 font-sans text-xs text-secondary">
                    Check status of your vintage outerwear, denim, and accessory
                    purchases.
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/40 text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                  <Package size={18} />
                </div>
              </div>
              <p className="mt-4 font-sans text-xs text-secondary group-hover:text-primary transition-colors">
                View all past orders &rarr;
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
