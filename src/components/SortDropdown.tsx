import { useState, useRef, useEffect, useCallback } from "react";

interface SortOption {
  id: string;
  label: string;
}

interface SortDropdownProps {
  options: SortOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const SortDropdown = ({ options, selectedId, onSelect }: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.id === selectedId);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const startClose = useCallback(() => {
    if (!isOpen || closing) return;
    setClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setClosing(false);
    }, 550);
  }, [isOpen, closing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        startClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [startClose]);

  return (
    <div ref={dropdownRef} className="relative inline-block">
      {/* Dropdown trigger */}
      <button
        onClick={() => {
          if (isOpen) startClose();
          else setIsOpen(true);
        }}
        className="flex items-center gap-2 text-sm text-charcoal/70 hover:text-charcoal transition-colors tracking-wide"
      >
        <span className="hidden md:inline">{selectedOption?.label}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <polyline points="5 6 8 9 11 6" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {(isOpen || closing) && (
        <div
          className={`absolute top-full right-0 mt-2 w-56 bg-ivory border border-stone/15 rounded-lg shadow-lg overflow-hidden z-40 transition-all ${
            closing
              ? "opacity-0 translate-y-[-3px] scale-[0.98] pointer-events-none"
              : "opacity-100 translate-y-0 scale-100"
          }`}
          style={{
            transitionDuration: closing ? "550ms" : "200ms",
            transitionTimingFunction: closing
              ? "cubic-bezier(0.19, 1, 0.22, 1)"
              : "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="py-2">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onSelect(option.id);
                  startClose();
                }}
                className={`w-full text-left px-4 py-3 text-sm transition-all duration-150 flex items-center justify-between ${
                  option.id === selectedId
                    ? "bg-warm-brown/5 text-warm-brown font-medium"
                    : "text-charcoal/70 hover:text-charcoal hover:bg-stone/5"
                }`}
              >
                <span className="tracking-wide">{option.label}</span>
                {option.id === selectedId && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="13 4 6 11 3 8" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}


    </div>
  );
};

export default SortDropdown;
