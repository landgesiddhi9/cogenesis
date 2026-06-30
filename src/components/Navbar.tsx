import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import SearchOverlay from "./SearchOverlay";
import MegaMenuPanel from "./MegaMenuPanel";
import { getSession, SESSION_EVENT } from "../utils/auth";
import { useCart } from "../hooks/useCart";

const Navbar = () => {
  // Images: Monogram.png and Logo.png are in public/images/
  // Branding: Monogram (h-15) + Logo (h-32) with 8-10px visible gap + color #5C3432 + trim margins for PNG padding
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Cherry-pick: search overlay + router state
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;

  // Cart badge
  const { cart } = useCart();

  // Session badge — account icon navigates to /account when logged in
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getSession());
  useEffect(() => {
    const sync = () => setIsLoggedIn(!!getSession());
    window.addEventListener(SESSION_EVENT, sync);
    return () => window.removeEventListener(SESSION_EVENT, sync);
  }, []);


  // Helper: icon button class with active state (cherry-pick)
  const iconButtonClass = (isActive: boolean) =>
    `p-1 transition-all duration-200 ease-out transform ${isActive
      ? "text-[#111] scale-110"
      : "text-charcoal hover:text-[#111] hover:scale-[1.08]"
    }`;

  // Helper: stroke weight for active icon (cherry-pick)
  const activeStroke = (isActive: boolean) =>
    isActive ? "stroke-[1.4]" : "stroke-[1.2]";

  // Auto-hide bottom nav when footer is in view
  const [showBottomNav, setShowBottomNav] = useState(true);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver: hide bottom nav when footer enters viewport
  useEffect(() => {
    const footer = document.getElementById('site-footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (document.documentElement.scrollHeight <= window.innerHeight + 100) {
          setShowBottomNav(true);
          return;
        }
        setShowBottomNav(!entry.isIntersecting);
      },
      { rootMargin: '0px 0px -90px 0px', threshold: 0 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  // Sync CSS variable for chatbot position
  useEffect(() => {
    document.documentElement.style.setProperty('--bottom-nav-height', showBottomNav ? '56px' : '0px');
  }, [showBottomNav]);

  // Lock body scroll when menu OR search overlay is open (preserve scroll position)
  useEffect(() => {
    const shouldLock = menuOpen || searchOpen;
    if (!shouldLock) return;

    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [menuOpen, searchOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 ${menuOpen ? "z-110" : "z-50"
          } ${scrolled ? "backdrop-blur-md shadow-sm" : ""}`}
        style={{
          backgroundColor: menuOpen
            ? '#FFF6ED'
            : scrolled
              ? 'rgba(250, 248, 245, 0.9)'
              : 'transparent',
          borderBottom: menuOpen
            ? '1px solid #D9D2C7'
            : scrolled
              ? '1px solid rgba(122, 113, 104, 0.1)'
              : '1px solid transparent',
          transition: menuOpen
            ? 'background-color 200ms cubic-bezier(0.22, 1, 0.36, 1), border-color 200ms cubic-bezier(0.22, 1, 0.36, 1)'
            : 'background-color 200ms cubic-bezier(0.22, 1, 0.36, 1) 300ms, border-color 200ms cubic-bezier(0.22, 1, 0.36, 1) 300ms',
        }}
      >
        <div className="w-full px-5 md:px-8">
          <div className="relative flex items-center justify-between h-[68px] md:h-16">
            {/* Hamburger menu / Close button */}
            <button
              className="flex flex-col gap-1.25 p-2 relative z-60 transition-all duration-300"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Toggle menu"}
              id="navbar-hamburger"
              style={{
                opacity: menuOpen ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = menuOpen
                  ? "0.7"
                  : "1";
              }}
            >
              <span
                className={`block w-5 h-px bg-charcoal transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                style={{
                  backgroundColor: menuOpen ? "#482C1B" : "currentColor",
                }}
              />
              <span
                className={`block w-5 h-px bg-charcoal transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""
                  }`}
              />
              <span
                className={`block w-5 h-px bg-charcoal transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                style={{
                  backgroundColor: menuOpen ? "#482C1B" : "currentColor",
                }}
              />
            </button>

            {/* Center logo - monogram + wordmark */}
            <a
              href="/"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-60 flex items-center gap-1"
              id="navbar-logo"
            >
              <img
                src="/images/Monogram.png"
                alt="Cogenesis Monogram"
                className="h-[50px] md:h-[58px] w-auto object-contain shrink-0 logo-monogram"
              />
              <div className="logo-wordmark w-[155px] md:w-[180px] h-[26px] md:h-[30px] overflow-hidden flex-shrink-0 -ml-5">
                <img
                  src="/images/logo.png"
                  alt="COGENESIS"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </a>

            {/* Right-side icons — cherry-pick active-state version */}
            <div
              className="hidden md:flex items-center gap-4 md:gap-5 text-charcoal transition-opacity duration-300 opacity-100"
            >
              {/* Search */}
              <button
                className={iconButtonClass(activePath === "/search")}
                aria-label="Search"
                id="navbar-search"
                onClick={() => navigate("/search")}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className={activeStroke(activePath === "/search")}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>

              {/* Account — goes to dashboard if logged in, login drawer otherwise */}
              <button
                className={iconButtonClass(
                  activePath === "/login" || activePath === "/account",
                )}
                aria-label="Account"
                id="navbar-account"
                onClick={() => navigate(isLoggedIn ? "/account" : "/login")}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className={activeStroke(activePath === "/login")}
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>

              {/* Wishlist */}
              <button
                className={iconButtonClass(activePath === "/wishlist")}
                aria-label="Wishlist"
                id="navbar-wishlist"
                onClick={() => navigate("/wishlist")}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2h12v16l-6-4l-6 4V2z" />
                </svg>
              </button>

              {/* Cart — with live count badge */}
              <button
                className={`${iconButtonClass(activePath === "/cart")} relative`}
                aria-label="Shopping bag"
                id="navbar-cart"
                onClick={() => navigate("/cart")}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className={activeStroke(activePath === "/cart")}
                >
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {cart && cart.totalQuantity > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 bg-[#111] text-white text-[9px] font-sans font-semibold w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ lineHeight: 0 }}
                  >
                    {cart.totalQuantity}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile bottom navigation — auto-hides when footer is visible */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-2xl bg-[rgba(250,248,245,0.85)] border-t border-[rgba(122,113,104,0.1)] transition duration-[250ms] ease-out ${
          showBottomNav ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex items-center justify-around h-14 px-4">
          {/* Search */}
          <button
            className="flex items-center justify-center w-11 h-11 text-charcoal hover:text-[#111] transition-colors"
            aria-label="Search"
            onClick={() => navigate("/search")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>

          {/* Account */}
          <button
            className="flex items-center justify-center w-11 h-11 text-charcoal hover:text-[#111] transition-colors"
            aria-label="Account"
            onClick={() => navigate(isLoggedIn ? "/account" : "/login")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          {/* Wishlist */}
          <button
            className="flex items-center justify-center w-11 h-11 text-charcoal hover:text-[#111] transition-colors"
            aria-label="Wishlist"
            onClick={() => navigate("/wishlist")}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2h12v16l-6-4l-6 4V2z" />
            </svg>
          </button>

          {/* Cart */}
          <button
            className="flex items-center justify-center w-11 h-11 text-charcoal hover:text-[#111] transition-colors relative"
            aria-label="Shopping bag"
            onClick={() => navigate("/cart")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cart && cart.totalQuantity > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 bg-[#111] text-white text-[9px] font-sans font-semibold w-4 h-4 rounded-full flex items-center justify-center"
                style={{ lineHeight: 0 }}
              >
                {cart.totalQuantity}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MEGA MENU — floating panel */}
      {createPortal(
        <div
          className="fixed inset-0 z-100 top-[68px] md:top-16"
          id="navbar-dropdown"
          style={{
            pointerEvents: menuOpen ? "auto" : "none",
          }}
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20"
            style={{
              opacity: menuOpen ? 1 : 0,
              transition: menuOpen
                ? 'opacity 650ms cubic-bezier(0.22, 1, 0.36, 1) 80ms'
                : 'opacity 650ms cubic-bezier(0.22, 1, 0.36, 1)',
              willChange: 'opacity',
              pointerEvents: menuOpen ? 'auto' : 'none',
            }}
            onClick={() => setMenuOpen(false)}
          />
          {/* Dropdown panel */}
          <div
            className="flex justify-center"
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: `translateY(${menuOpen ? '0px' : '-28px'})`,
              transition: menuOpen
                ? 'opacity 650ms cubic-bezier(0.22, 1, 0.36, 1) 80ms, transform 650ms cubic-bezier(0.22, 1, 0.36, 1) 80ms'
                : 'opacity 650ms cubic-bezier(0.22, 1, 0.36, 1), transform 650ms cubic-bezier(0.22, 1, 0.36, 1)',
              willChange: 'transform, opacity',
              pointerEvents: menuOpen ? 'auto' : 'none',
            }}
          >
            <MegaMenuPanel onNavigate={() => setMenuOpen(false)} isOpen={menuOpen} />
          </div>
        </div>,
        document.body,
      )}

      {/* Search overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
