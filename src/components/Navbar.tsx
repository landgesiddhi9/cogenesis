import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { navLinks } from "../data/mockData";

const Navbar = () => {
  // Images: Monogram.png and Logo.png are in public/images/
  // Branding: Monogram (h-15) + Logo (h-32) with 8-10px visible gap + color #5C3432 + trim margins for PNG padding
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const headingRefsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (!menuOpen) return;

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
  }, [menuOpen]);

  // Update underline width when expanded section changes
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

  const handleHeadingClick = (index: number) => {
    // Toggle the section: if it's already expanded, collapse it
    // Otherwise, expand it and collapse any other expanded section
    if (expandedSection === index) {
      setExpandedSection(null);
    } else {
      setExpandedSection(index);
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setExpandedSection(null);
  };

  const handleNavigation = (href: string) => {
    closeMenu();
    if (!href.startsWith("http") && href !== "#") {
      window.history.pushState({}, "", href);
      window.dispatchEvent(new PopStateEvent("popstate"));
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
            {/* Hamburger menu */}
            <button
              className="flex flex-col gap-1.25 p-2 relative z-60"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              id="navbar-hamburger"
            >
              <span
                className={`block w-5 h-px bg-charcoal transition-all duration-300 origin-center ${
                  menuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
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

            {/* Right side icons */}
            <div
              className={`flex items-center gap-4 md:gap-5 text-charcoal transition-opacity duration-300 ${
                menuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <button
                className="p-1 hover:opacity-70 transition-opacity duration-300"
                aria-label="Search"
                id="navbar-search"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>

              <button
                className="p-1 hover:opacity-70 transition-opacity duration-300"
                aria-label="Account"
                id="navbar-account"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>

              <button
                className="p-1 hover:opacity-70 transition-opacity duration-300"
                aria-label="Wishlist"
                id="navbar-wishlist"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </button>

              <button
                className="p-1 hover:opacity-70 transition-opacity duration-300"
                aria-label="Shopping bag"
                id="navbar-cart"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
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

      {/* ACCORDION DROPDOWN MENU */}
      {createPortal(
        <div
          className={`fixed inset-y-0 left-0 transition-all duration-300 z-100 ${
            menuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          style={{
            width: menuOpen ? "22vw" : "0vw",
            backgroundColor: menuOpen
              ? "rgba(250, 249, 247, 0.99)"
              : "transparent",
            backdropFilter: menuOpen ? "blur(24px)" : "none",
          }}
          id="navbar-dropdown"
        >
          {/* Navigation content */}
          {menuOpen && (
            <div className="h-full flex flex-col items-center justify-center px-8 py-16">
              <div className="w-full space-y-8 flex flex-col items-center">
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
                    {/* Section heading (always visible) */}
                    <div
                      ref={(el) => {
                        headingRefsRef.current[sectionIndex] = el;
                      }}
                      className="relative cursor-pointer mb-4 group transition-opacity duration-280"
                    >
                      <button
                        onClick={() => handleHeadingClick(sectionIndex)}
                        className={`inline-flex flex-col transition-all duration-280 text-center ${
                          expandedSection === sectionIndex
                            ? "font-semibold"
                            : "font-medium group-hover:opacity-90"
                        }`}
                        style={{
                          fontSize: "31px",
                          fontWeight:
                            expandedSection === sectionIndex ? 600 : 500,
                          letterSpacing: "0.08em",
                          lineHeight: "1.2",
                          color: "#A98A63",
                          transitionProperty: "all",
                          transitionDuration: "280ms",
                          transitionTimingFunction:
                            "cubic-bezier(0.4, 0, 0.2, 1)",
                          background: "none",
                          border: "none",
                          padding: "0",
                          cursor: "pointer",
                        }}
                      >
                        <span className="heading-text">{section.label}</span>
                        {/* Underline for active heading */}
                        {expandedSection === sectionIndex && (
                          <div
                            style={{
                              height: "1.5px",
                              width:
                                underlineWidth > 0
                                  ? `${underlineWidth}px`
                                  : "0px",
                              marginTop: "4px",
                              animation:
                                "expandWidth 280ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
                              background: "#A98A63",
                            }}
                          />
                        )}
                      </button>
                    </div>

                    {/* Subcategories (hidden by default, shown when expanded) */}
                    {section.submenu && (
                      <div
                        className="overflow-hidden transition-all duration-300"
                        style={{
                          maxHeight:
                            expandedSection === sectionIndex
                              ? `${section.submenu.length * 40 + 24}px`
                              : "0px",
                          opacity: expandedSection === sectionIndex ? 1 : 0,
                        }}
                      >
                        <div className="space-y-4 pt-4 flex flex-col items-center w-full">
                          {section.submenu.map((subitem) => (
                            <a
                              key={subitem.label}
                              href={subitem.href}
                              className="inline-flex transition-all duration-280 font-light hover:opacity-100 opacity-80"
                              onClick={(e) => {
                                e.preventDefault();
                                handleNavigation(subitem.href);
                              }}
                              style={{
                                fontSize: "19px",
                                fontWeight: 400,
                                letterSpacing: "0.06em",
                                lineHeight: "1.5",
                                color: "#A98A63",
                              }}
                            >
                              {subitem.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>,
        document.body,
      )}

      {/* Animations */}
      <style>{`
        @keyframes expandWidth {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: inherit;
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
