import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { navLinks } from "../data/mockData";
import SearchOverlay from "./SearchOverlay";

const Navbar = () => {
  // Images: Monogram.png and Logo.png are in public/images/
  // Branding: Monogram (h-15) + Logo (h-32) with 8-10px visible gap + color #5C3432 + trim margins for PNG padding
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // HEAD: accordion dropdown state
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const headingRefsRef = useRef<(HTMLDivElement | null)[]>([]);
  // Cherry-pick: search overlay + router state
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;

  // Helper: icon button class with active state (cherry-pick)
  const iconButtonClass = (isActive: boolean) =>
    `p-1 transition-all duration-200 ease-out transform ${
      isActive
        ? "text-[#111] scale-110"
        : "text-charcoal hover:text-[#111] hover:scale-[1.08]"
    }`;

  // Helper: stroke weight for active icon (cherry-pick)
  const activeStroke = (isActive: boolean) =>
    isActive ? "stroke-[1.4]" : "stroke-[1.2]";

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Update underline width when expanded accordion section changes (HEAD)
  useEffect(() => {
    if (expandedSection !== null && headingRefsRef.current[expandedSection]) {
      const container = headingRefsRef.current[expandedSection];
      if (container) {
        const textSpan = container.querySelector("span.heading-text");
        if (textSpan) {
          setUnderlineWidth(textSpan.getBoundingClientRect().width);
        }
      }
    }
  }, [expandedSection]);

  // Toggle or collapse accordion section (HEAD)
  const handleHeadingClick = (index: number) => {
    setExpandedSection((prev) => (prev === index ? null : index));
  };

  // Close the entire menu (HEAD)
  const closeMenu = () => {
    setMenuOpen(false);
    setExpandedSection(null);
  };

  // Navigate via React Router and close menu (merged: uses navigate() for React Router compat)
  const handleNavigation = (href: string) => {
    closeMenu();
    if (!href.startsWith("http") && href !== "#") {
      navigate(href);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 transition-all duration-500 ${
          menuOpen ? "z-110" : "z-50"
        } ${
          menuOpen || !scrolled
            ? "bg-transparent"
            : "bg-ivory/90 backdrop-blur-md shadow-sm border-b border-stone/10"
        }`}
      >
        <div className="w-full px-4 md:px-8">
          <div className="relative flex items-center justify-between h-14 md:h-16">
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
                className={`block w-5 h-px bg-charcoal transition-all duration-300 origin-center ${
                  menuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
                style={{
                  backgroundColor: menuOpen ? "#482C1B" : "currentColor",
                }}
              />
              <span
                className={`block w-5 h-px bg-charcoal transition-all duration-300 ${
                  menuOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block w-5 h-px bg-charcoal transition-all duration-300 origin-center ${
                  menuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
                style={{
                  backgroundColor: menuOpen ? "#482C1B" : "currentColor",
                }}
              />
            </button>

            {/* Center logo - monogram + logo */}
            <a
              href="/"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-60 flex items-center gap-tight"
              id="navbar-logo"
            >
              {/* Monogram - reduced 15-20%, framed within header */}
              <img
                src="/images/Monogram.png"
                alt="Cogenesis Monogram"
                className="h-15 w-auto object-contain shrink-0 branding-dark monogram-trim"
                style={{ opacity: 1 }}
              />
              {/* Logo - dominant wordmark, 30% larger */}
              <img
                src="/images/Logo.png"
                alt="Cogenesis"
                className="h-32 w-auto object-contain shrink-0 branding-dark logo-trim"
                style={{ opacity: 1 }}
              />
            </a>

            {/* Right-side icons — cherry-pick active-state version */}
            <div
              className={`flex items-center gap-4 md:gap-5 text-charcoal transition-opacity duration-300 ${
                menuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              {/* Search */}
              <button
                className={iconButtonClass(activePath === "/search")}
                aria-label="Search"
                id="navbar-search"
                onClick={() => setSearchOpen(true)}
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

              {/* Account */}
              <button
                className={iconButtonClass(activePath === "/login")}
                aria-label="Account"
                id="navbar-account"
                onClick={() => navigate("/login")}
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

              {/* Cart */}
              <button
                className={iconButtonClass(activePath === "/cart")}
                aria-label="Shopping bag"
                id="navbar-cart"
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
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ACCORDION DROPDOWN MENU — HEAD version, unchanged */}
      {createPortal(
        <div
          className={`fixed inset-y-0 left-0 transition-all duration-300 z-100 ${
            menuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          style={{
            width: menuOpen ? "clamp(280px, 28vw, 400px)" : "0vw",
            backgroundColor: menuOpen
              ? "rgba(247, 245, 241, 0.98)"
              : "transparent",
            backdropFilter: menuOpen ? "blur(10px)" : "none",
          }}
          id="navbar-dropdown"
        >
          {menuOpen && (
            <div className="h-full flex flex-col items-center justify-center px-9 py-20">
              <div className="w-full space-y-14 flex flex-col items-center">
                {navLinks.map((section, sectionIndex) => (
                  <div
                    key={section.label}
                    className="transition-opacity duration-280 text-center"
                    style={{
                      opacity:
                        expandedSection === null ||
                        expandedSection === sectionIndex
                          ? 1
                          : 0.55,
                    }}
                  >
                    {/* Section heading */}
                    <div
                      ref={(el) => {
                        headingRefsRef.current[sectionIndex] = el;
                      }}
                      className="relative cursor-pointer mb-8 group transition-opacity duration-300"
                    >
                      <button
                        onClick={() => handleHeadingClick(sectionIndex)}
                        className={`inline-flex flex-col transition-all duration-300 text-center`}
                        style={{
                          fontSize: "36px",
                          fontWeight: 500,
                          letterSpacing: "-0.02em",
                          lineHeight: "1.2",
                          color:
                            expandedSection === sectionIndex
                              ? "#482C1B"
                              : "#B8AA96",
                          opacity: expandedSection === sectionIndex ? 1 : 0.6,
                          transitionProperty: "color, opacity",
                          transitionDuration: "300ms",
                          transitionTimingFunction: "ease",
                          background: "none",
                          border: "none",
                          padding: "0",
                          cursor: "pointer",
                        }}
                      >
                        <span className="heading-text">{section.label}</span>
                        {/* Subtle underline for active heading */}
                        {expandedSection === sectionIndex && (
                          <div
                            style={{
                              height: "1px",
                              width: "48px",
                              marginTop: "10px",
                              animation:
                                "expandWidth 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
                              background: "#482C1B",
                            }}
                          />
                        )}
                      </button>
                    </div>

                    {/* Subcategories */}
                    {section.submenu && (
                      <div
                        className="overflow-hidden transition-all duration-250"
                        style={{
                          maxHeight:
                            expandedSection === sectionIndex
                              ? `${section.submenu.length * 48 + 32}px`
                              : "0px",
                          opacity: expandedSection === sectionIndex ? 1 : 0,
                          transform:
                            expandedSection === sectionIndex
                              ? "translateY(0)"
                              : "translateY(-10px)",
                          transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      >
                        <div className="space-y-6 pt-8 flex flex-col items-center w-full">
                          {section.submenu.map((subitem) => (
                            <a
                              key={subitem.label}
                              href={subitem.href}
                              className="inline-flex transition-all duration-220 hover:opacity-100"
                              onClick={(e) => {
                                e.preventDefault();
                                handleNavigation(subitem.href);
                              }}
                              style={{
                                fontSize: "22px",
                                fontWeight: 400,
                                letterSpacing: "0.01em",
                                lineHeight: "1.7",
                                color: "#A6855E",
                                transform: "translateX(0)",
                                transition: "all 220ms ease",
                                cursor: "pointer",
                              }}
                              onMouseEnter={(e) => {
                                (e.target as HTMLElement).style.color =
                                  "#482C1B";
                                (e.target as HTMLElement).style.transform =
                                  "translateX(8px)";
                                (e.target as HTMLElement).style.letterSpacing =
                                  "0.03em";
                              }}
                              onMouseLeave={(e) => {
                                (e.target as HTMLElement).style.color =
                                  "#A6855E";
                                (e.target as HTMLElement).style.transform =
                                  "translateX(0)";
                                (e.target as HTMLElement).style.letterSpacing =
                                  "0.01em";
                              }}
                            >
                              {subitem.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Divider between sections */}
                    {sectionIndex < navLinks.length - 1 && (
                      <div
                        style={{
                          height: "1px",
                          backgroundColor: "#E7E1D8",
                          width: "32px",
                          marginTop: "28px",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>,
        document.body,
      )}

      {/* Accordion underline animation — HEAD */}
      <style>{`
        @keyframes expandWidth {
          from { width: 0; opacity: 0; }
          to   { width: inherit; opacity: 1; }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Search overlay — cherry-pick */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
