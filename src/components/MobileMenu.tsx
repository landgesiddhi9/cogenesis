import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  cartCount: number;
}

interface AccordionSection {
  key: string;
  label: string;
  links: { label: string; to: string }[];
}

const SECTIONS: AccordionSection[] = [
  {
    key: "men",
    label: "MEN",
    links: [
      { label: "Shirts", to: "/collections/shirts" },
      { label: "Trousers", to: "/collections/trousers" },
      { label: "Best Sellers", to: "/men/best-sellers" },
      { label: "View All", to: "/men/view-all" },
    ],
  },
  {
    key: "women",
    label: "WOMEN",
    links: [
      { label: "Launching Soon", to: "/women" },
    ],
  },
  {
    key: "fabric",
    label: "FABRIC",
    links: [
      { label: "Linen", to: "/collections/linen" },
      { label: "Linen Blend", to: "/collections/linen-blend" },
      { label: "Care Guide", to: "/fabric/care-guide" },
      { label: "Fabric Guide", to: "/fabric/guide" },
    ],
  },
];

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const MobileMenu = ({ isOpen, onClose, cartCount }: MobileMenuProps) => {
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [visuallyOpen, setVisuallyOpen] = useState(isOpen);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setVisuallyOpen(true);
    } else {
      closeTimerRef.current = setTimeout(() => {
        setVisuallyOpen(false);
        setExpandedSection(null);
      }, 600);
    }
    return () => { clearTimeout(closeTimerRef.current); };
  }, [isOpen]);

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

  const toggleSection = (key: string) => {
    setExpandedSection(expandedSection === key ? null : key);
  };

  return (
    <div
      ref={drawerRef}
      role="dialog"
      aria-modal={visuallyOpen}
      aria-label="Site navigation"
      className="block md:hidden fixed inset-0 z-110 w-screen h-dvh bg-[#FAF8F4] flex flex-col overflow-hidden"
      aria-hidden={!visuallyOpen}
      inert={!visuallyOpen}
      style={{
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateY(0)" : "translateY(-15px)",
        transition: isOpen
          ? `opacity 700ms ${EASE}, transform 700ms ${EASE}`
          : `opacity 600ms ${EASE}, transform 600ms ${EASE}`,
        pointerEvents: isOpen ? "auto" : "none",
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 shrink-0 border-b border-[#E7E2DA]">
        <button onClick={onClose} className="p-1 -ml-1 text-[#4A2E2A]" aria-label="Close menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <span className="text-base font-light tracking-[0.15em] text-[#4A2E2A]" style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}>
          COGENESIS
        </span>
        <button onClick={() => { navigate("/cart"); onClose(); }} className="p-1 -mr-1 relative text-[#4A2E2A]" aria-label={`Shopping bag${cartCount > 0 ? `, ${cartCount} items` : ""}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-[#4A2E2A] text-white text-[8px] font-sans font-semibold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Accordion sections */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-8">
        {SECTIONS.map((section) => {
          const isExpanded = expandedSection === section.key;
          return (
            <div key={section.key} className="border-b border-[#E7E2DA]">
              <button
                onClick={() => toggleSection(section.key)}
                className="flex items-center justify-between w-full py-5 text-left"
              >
                <span className="font-serif text-[17px] font-medium tracking-[0.18em] text-[#4A2E2A] uppercase" style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}>
                  {section.label}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-[#4A2E2A]/50 transition-transform duration-300"
                  style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{
                  maxHeight: isExpanded ? `${section.links.length * 56}px` : "0px",
                  opacity: isExpanded ? 1 : 0,
                }}
              >
                <div className="pb-5 pl-1 flex flex-col gap-y-4">
                  {section.links.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => { navigate(link.to); onClose(); }}
                      className="text-left"
                    >
                      <span className="font-serif text-[15px] text-[#6B5C53]/80 leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}>
                        {link.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileMenu;
