import { X, User as UserIcon } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectCurrentUser,
} from "@/store/slices/authSlice";
import { useAuthLogout } from "@/hooks/useAuthLogout";
import type { RootState } from "@/store";

// ============================================================
// MobileMenu — Full-screen drawer navigation
// ============================================================

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Shop All", href: "/shop" },
  { label: "Women's", href: "/category/Womens" },
  { label: "Men's", href: "/category/Mens" },
  { label: "Outerwear", href: "/category/Outerwear" },
  { label: "Denim", href: "/category/Denim" },
  { label: "Accessories", href: "/category/Accessories" },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const isAuthenticated = useSelector((state: RootState) =>
    selectIsAuthenticated(state),
  );

  const currentUser = useSelector((state: RootState) =>
    selectCurrentUser(state),
  );

  const performLogout = useAuthLogout();

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  async function handleSignOut() {
    onClose();
    await performLogout();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={[
          "fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm",
          "transition-opacity duration-300",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      {/* Drawer */}
      <nav
        id="mobile-menu"
        aria-label="Mobile navigation"
        role="dialog"
        aria-modal="true"
        className={[
          "fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw]",
          "flex flex-col bg-surface",
          "transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <Link
            to="/"
            onClick={onClose}
            className="font-serif text-lg font-medium tracking-tight text-foreground"
            aria-label="Vintage Thrift Room — Home"
          >
            Vintage Thrift Room
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="rounded p-1 text-secondary transition-colors duration-150 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* User status bar */}
        {isAuthenticated && currentUser && (
          <div className="flex items-center justify-between border-b border-border bg-background px-6 py-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <UserIcon
                size={14}
                className="shrink-0 text-primary"
              />

              <span className="truncate font-sans text-xs font-medium text-foreground">
                {currentUser.name}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="shrink-0 font-sans text-[11px] font-semibold text-secondary transition-colors hover:text-destructive"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* Main nav */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <ul role="list" className="space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  onClick={onClose}
                  className="block border-b border-border/50 py-2.5 font-sans text-sm font-medium text-foreground transition-colors duration-150 hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-border pt-5">
            <ul role="list" className="space-y-1">
              {isAuthenticated ? (
                <>
                  <li>
                    <Link
                      to="/account"
                      onClick={onClose}
                      className="block py-2 font-sans text-sm font-medium text-foreground transition-colors duration-150 hover:text-primary"
                    >
                      My Account
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/orders"
                      onClick={onClose}
                      className="block py-2 font-sans text-sm text-secondary transition-colors duration-150 hover:text-primary"
                    >
                      Order History
                    </Link>
                  </li>

                  {currentUser?.role === "admin" && (
                    <li>
                      <Link
                        to="/admin"
                        onClick={onClose}
                        className="block py-2 font-sans text-sm font-semibold text-primary transition-colors duration-150 hover:text-foreground"
                      >
                        Admin Dashboard
                      </Link>
                    </li>
                  )}
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      onClick={onClose}
                      className="block py-2 font-sans text-sm font-medium text-primary transition-colors duration-150 hover:text-foreground"
                    >
                      Sign In
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/register"
                      onClick={onClose}
                      className="block py-2 font-sans text-sm text-secondary transition-colors duration-150 hover:text-primary"
                    >
                      Create an Account
                    </Link>
                  </li>
                </>
              )}

              <li>
                <Link
                  to="/wishlist"
                  onClick={onClose}
                  className="block py-2 font-sans text-sm text-secondary transition-colors duration-150 hover:text-primary"
                >
                  Saved Pieces (Wishlist)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4">
          <p className="font-sans text-xs text-secondary">
            &copy; {new Date().getFullYear()} Vintage Thrift Room
          </p>
        </div>
      </nav>
    </>
  );
}
