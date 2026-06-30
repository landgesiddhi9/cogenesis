import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

type TabKey = "men" | "women" | "fabric";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  cartCount: number;
}

interface NavLink {
  label: string;
  href: string;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "men", label: "MEN" },
  { key: "women", label: "WOMEN" },
  { key: "fabric", label: "FABRIC" },
];

const MEN_LINKS: NavLink[] = [
  { label: "Shirts", href: "/collections/shirts" },
  { label: "Trousers", href: "/collections/trousers" },
  { label: "Best Sellers", href: "/men/best-sellers" },
  { label: "View All", href: "/men/view-all" },
];

const FABRIC_LINKS: NavLink[] = [
  { label: "Linen", href: "/collections/linen" },
  { label: "Cotton Linen", href: "/collections/linen-blend" },
  { label: "Care Guide", href: "/fabric/care-guide" },
];

const TAB_IMAGES: Record<TabKey, string> = {
  men: "/images/male model .jpg",
  women: "/images/female model.jpg",
  fabric: "/images/fabric drop down.jpg",
};

const NavRow = ({ label, href, onClose }: { label: string; href: string; onClose: () => void }) => {
  const navigate = useNavigate();
  return (
    <button
      className="flex items-center justify-between w-full min-h-[48px] py-3 border-b border-stone/10"
      onClick={() => { navigate(href); onClose(); }}
    >
      <span className="font-sans text-[13px] tracking-[0.22em] uppercase text-charcoal">{label}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-charcoal/30">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  );
};

const MobileMenu = ({ isOpen, onClose, cartCount }: MobileMenuProps) => {
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const crossfadeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [activeTab, setActiveTab] = useState<TabKey>("men");
  const [isCrossfading, setIsCrossfading] = useState(false);
  const [crossfadeFrom, setCrossfadeFrom] = useState<TabKey | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const id = setTimeout(() => {
      setActiveTab("men");
      setCrossfadeFrom(null);
      setIsCrossfading(false);
    }, 0);
    return () => clearTimeout(id);
  }, [isOpen]);

  const handleTabChange = useCallback((tab: TabKey) => {
    if (tab === activeTab) return;
    setCrossfadeFrom(activeTab);
    setIsCrossfading(true);
    setActiveTab(tab);
    clearTimeout(crossfadeTimerRef.current);
    crossfadeTimerRef.current = setTimeout(() => {
      setIsCrossfading(false);
      setCrossfadeFrom(null);
    }, 200);
  }, [activeTab]);

  useEffect(() => {
    if (!isOpen) return;
    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusableSelector = 'a, button, input, [tabindex]:not([tabindex="-1"])';
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const firstFocusable = drawer.querySelector(focusableSelector) as HTMLElement | null;
    firstFocusable?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusables = drawer.querySelectorAll(focusableSelector);
      const first = focusables[0] as HTMLElement | null;
      const last = focusables[focusables.length - 1] as HTMLElement | null;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    };

    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };

    drawer.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      drawer.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleEscape);
      previouslyFocused?.focus();
      document.getElementById("navbar-hamburger")?.focus();
    };
  }, [isOpen, onClose]);

  const visibleTabs = new Set([activeTab]);
  if (isCrossfading && crossfadeFrom) visibleTabs.add(crossfadeFrom);

  return (
    <div
      ref={drawerRef}
      role="dialog"
      aria-modal={isOpen}
      aria-label="Site navigation"
      className="block md:hidden fixed inset-0 z-110 w-screen h-dvh bg-ivory flex flex-col overflow-hidden"
      aria-hidden={!isOpen}
      inert={!isOpen}
      style={{
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 250ms cubic-bezier(0.22, 1, 0.36, 1)",
        pointerEvents: isOpen ? "auto" : "none",
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <button onClick={onClose} className="p-2 -ml-2 text-charcoal hover:text-charcoal/70 transition-colors" aria-label="Close menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <span className="text-lg font-light tracking-[0.12em] text-charcoal" style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}>
          COGENESIS
        </span>
        <button onClick={() => { navigate("/cart"); onClose(); }} className="p-2 -mr-2 relative text-charcoal hover:text-charcoal/70 transition-colors" aria-label={`Shopping bag${cartCount > 0 ? `, ${cartCount} items` : ""}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-charcoal text-white text-[8px] font-sans font-semibold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab row — MEN left, WOMEN center, FABRIC right */}
      <div className="flex justify-between px-6 py-3 shrink-0 border-b border-stone/10">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`relative pb-2 text-[11px] tracking-[0.22em] uppercase font-sans transition-colors duration-200 ${
              activeTab === tab.key ? "text-charcoal" : "text-charcoal/40 hover:text-charcoal/70"
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-charcoal" />
            )}
          </button>
        ))}
      </div>

      {/* Hero image — exactly 50vh, full width, no overlays */}
      <div className="relative w-full h-[52.5vh] shrink-0 overflow-hidden bg-stone/5">
        {TABS.map((tab) => {
          if (!visibleTabs.has(tab.key)) return null;
          const isActive = tab.key === activeTab;
          return (
            <div
              key={tab.key}
              className="absolute inset-0"
              style={{
                opacity: isActive ? 1 : 0,
                transition: "opacity 200ms ease",
              }}
            >
              <img
                src={TAB_IMAGES[tab.key]}
                alt={tab.label}
                className="w-full h-full object-cover"
                loading={isActive ? "eager" : "lazy"}
              />
            </div>
          );
        })}
      </div>

      {/* Category links section */}
      <div className="flex-1 overflow-y-auto px-6 pt-6">
        {activeTab === "men" && (
          <div>
            {MEN_LINKS.map((link) => (
              <NavRow key={link.href} label={link.label} href={link.href} onClose={onClose} />
            ))}
          </div>
        )}

        {activeTab === "women" && (
          <div className="pt-8 pb-8 min-h-full flex flex-col">
            <p className="text-3xl font-light tracking-[0.12em] text-charcoal text-center mb-6" style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}>
              Launching Soon!!!
            </p>
            <div className="flex-1" />
            <div className="flex justify-center mb-32">
              <button
                onClick={() => handleTabChange("men")}
                className="px-8 py-3 text-[11px] tracking-[0.22em] uppercase font-sans text-white bg-charcoal hover:bg-charcoal/90 transition-colors"
              >
                Explore men's section
              </button>
            </div>
          </div>
        )}

        {activeTab === "fabric" && (
          <div>
            {FABRIC_LINKS.map((link) => (
              <NavRow key={link.href} label={link.label} href={link.href} onClose={onClose} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
