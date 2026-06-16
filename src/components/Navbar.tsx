import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { navLinks } from '../data/mockData';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open (preserve scroll position)
  useEffect(() => {
    if (!menuOpen) return;

    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, [menuOpen]);

  return (
    <>
    <nav
      className={`fixed top-0 left-0 right-0 transition-all duration-500 ${
        menuOpen ? 'z-[110]' : 'z-50'
      } ${
        menuOpen || !scrolled
          ? 'bg-transparent'
          : 'bg-ivory/90 backdrop-blur-md shadow-sm border-b border-stone/10'
      }`}
    >
      <div className="w-full px-4 md:px-8">
        <div className="relative flex items-center justify-between h-14 md:h-16">
          {/* Hamburger menu — always visible on left */}
          <button
            className="flex flex-col gap-[5px] p-2 relative z-[60]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            id="navbar-hamburger"
          >
            <span
              className={`block w-5 h-[1px] bg-charcoal transition-all duration-300 origin-center ${
                menuOpen ? 'rotate-45 translate-y-[6px]' : ''
              }`}
            />
            <span
              className={`block w-5 h-[1px] bg-charcoal transition-all duration-300 ${
                menuOpen ? 'opacity-0 scale-x-0' : ''
              }`}
            />
            <span
              className={`block w-5 h-[1px] bg-charcoal transition-all duration-300 origin-center ${
                menuOpen ? '-rotate-45 -translate-y-[6px]' : ''
              }`}
            />
          </button>

          {/* Center logo — absolutely centered */}
          <a
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[60]"
            id="navbar-logo"
          >
            <img
              src="/images/logo.png"
              alt="Cogenesis"
              className="h-9 md:h-11 w-auto brightness-0"
            />
          </a>

          {/* Right side — search, account, wishlist, cart */}
          <div
            className={`flex items-center gap-4 md:gap-5 text-charcoal transition-opacity duration-300 ${
              menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            {/* Search */}
            <button
              className="p-1 hover:opacity-70 transition-opacity duration-300"
              aria-label="Search"
              id="navbar-search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            {/* Account */}
            <button
              className="p-1 hover:opacity-70 transition-opacity duration-300"
              aria-label="Account"
              id="navbar-account"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>

            {/* Wishlist */}
            <button
              className="p-1 hover:opacity-70 transition-opacity duration-300"
              aria-label="Wishlist"
              id="navbar-wishlist"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>

            {/* Cart */}
            <button
              className="p-1 hover:opacity-70 transition-opacity duration-300"
              aria-label="Shopping bag"
              id="navbar-cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </button>
          </div>
        </div>
      </div>

    </nav>

      {/* Portal to body — avoids fixed-position trap from nav backdrop-blur when scrolled */}
      {createPortal(
        <div
          className={`fixed inset-0 bg-ivory/98 backdrop-blur-lg transition-all duration-500 z-[100] ${
            menuOpen
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
          id="navbar-menu-overlay"
          aria-hidden={!menuOpen}
        >
          <div className="flex flex-col items-center justify-center h-full gap-10">
            {navLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                className="font-accent text-sm md:text-base tracking-wide-editorial uppercase text-charcoal hover:text-stone transition-all duration-300"
                onClick={() => setMenuOpen(false)}
                style={{
                  transitionDelay: menuOpen ? `${index * 80}ms` : '0ms',
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'translateY(0)' : 'translateY(16px)',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Navbar;
