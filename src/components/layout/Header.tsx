import { Menu, Search, ShoppingBag, User, Heart, X, Star, LayoutDashboard } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MobileMenu } from "./MobileMenu";
import { selectCartCount } from "@/store/slices/cartSlice";
import { selectWishlistCount } from "@/store/slices/wishlistSlice";
import {
  selectIsAuthenticated,
  selectCurrentUser,
} from "@/store/slices/authSlice";
import type { RootState } from "@/store";

// ============================================================
// Header — MASTER.md §6
// Desktop: Logo left | Nav center | Search, Account, Wishlist, Cart right
// Mobile: Logo | Search, Cart, Menu
// Sticky on scroll, thin border, no oversized nav
// ============================================================

const NAV_LINKS = [
  { label: "Shop All", href: "/shop" },
  { label: "Women's", href: "/category/Womens" },
  { label: "Men's", href: "/category/Mens" },
  { label: "Outerwear", href: "/category/Outerwear" },
  { label: "Denim", href: "/category/Denim" },
  { label: "Accessories", href: "/category/Accessories" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartCount = useSelector((state: RootState) => selectCartCount(state));
  const wishlistCount = useSelector((state: RootState) =>
    selectWishlistCount(state),
  );
  const isAuthenticated = useSelector((state: RootState) =>
    selectIsAuthenticated(state),
  );
  const currentUser = useSelector((state: RootState) =>
    selectCurrentUser(state),
  );
  console.log("Current User:", currentUser); // Debugging line

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/search");
    }
    setSearchOpen(false);
  }

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={[
          "sticky top-0 z-30 w-full bg-background",
          "border-b border-border",
          "transition-shadow duration-200",
          scrolled ? "shadow-sm" : "",
        ].join(" ")}
      >
        <div className="mx-auto flex h-14 max-w-350 items-center px-4 sm:px-6 lg:px-10">
          {/* Mobile: Hamburger */}
          <button
            className="mr-3 flex h-9 w-9 items-center justify-center text-foreground hover:text-primary transition-colors lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <Menu size={20} aria-hidden="true" />
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="mr-8 shrink-0 font-serif text-base font-medium tracking-tight text-foreground hover:text-primary transition-colors duration-150"
            aria-label="Vintage Thrift Room — Home"
          >
            <span className="hidden sm:inline">Vintage Thrift Room</span>
            <span className="sm:hidden">VTR</span>
          </Link>

          {/* Desktop Nav */}
          <nav
            aria-label="Main navigation"
            className="hidden lg:flex flex-1 items-center gap-0.5"
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  [
                    "px-3 py-1.5 font-sans text-sm font-medium rounded-sm",
                    "transition-colors duration-150",
                    isActive
                      ? "text-primary"
                      : "text-secondary hover:text-foreground",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-0.5 lg:gap-1">
            {/* Search */}
            {searchOpen ? (
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex items-center"
              >
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pieces..."
                  className="w-36 sm:w-56 h-8 pl-8 pr-7 text-xs font-sans bg-surface border border-border rounded-sm text-foreground placeholder:text-secondary focus:outline-none focus:border-primary transition-all duration-150"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setSearchOpen(false);
                  }}
                />
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="absolute left-2 text-secondary hover:text-primary transition-colors duration-150 cursor-pointer"
                >
                  <Search size={14} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="absolute right-2 text-secondary hover:text-primary transition-colors duration-150 cursor-pointer"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="flex h-9 w-9 items-center justify-center text-secondary hover:text-primary transition-colors duration-150 rounded-sm cursor-pointer"
              >
                <Search size={18} aria-hidden="true" />
              </button>
            )}

            {/* Account — desktop */}
            <Link
              to={isAuthenticated ? "/account" : "/login"}
              aria-label={
                isAuthenticated
                  ? `Account (${currentUser?.name})`
                  : "Sign in to account"
              }
              className={[
                "hidden sm:flex h-9 w-9 items-center justify-center transition-colors duration-150 rounded-sm relative",
                isAuthenticated
                  ? "text-primary"
                  : "text-secondary hover:text-primary",
              ].join(" ")}
              title={
                isAuthenticated
                  ? `Logged in as ${currentUser?.name}`
                  : "Sign In"
              }
            >
              <User size={18} aria-hidden="true" />
              {isAuthenticated && (
                <span
                  aria-hidden="true"
                  className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-primary"
                />
              )}
            </Link>

            {/* Admin Dashboard */}
            {isAuthenticated && currentUser?.role === "admin" && (
              <Link
                to="/admin"
                aria-label="Admin Dashboard"
                className="hidden sm:flex h-9 w-9 items-center justify-center text-secondary hover:text-primary transition-colors duration-150 rounded-sm"
              >
                <LayoutDashboard size={18} aria-hidden="true" />
              </Link>
            )}

            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label={
                wishlistCount > 0
                  ? `Wishlist (${wishlistCount} items)`
                  : "Wishlist"
              }
              className="relative hidden sm:flex h-9 w-9 items-center justify-center text-secondary hover:text-primary transition-colors duration-150 rounded-sm"
            >
              <Heart size={18} aria-hidden="true" />
              {wishlistCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-white"
                >
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label={
                cartCount > 0
                  ? `Shopping bag (${cartCount} items)`
                  : "Shopping bag"
              }
              className="relative flex h-9 w-9 items-center justify-center text-secondary hover:text-primary transition-colors duration-150 rounded-sm"
            >
              <ShoppingBag size={18} aria-hidden="true" />
              {cartCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-white"
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* reviews */}
            <Link
              to="/reviews"
              aria-label="Customer reviews"
              className="hidden sm:flex h-9 w-9 items-center justify-center text-secondary hover:text-primary transition-colors duration-150 rounded-sm"
            >
              <Star size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
