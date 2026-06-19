import { useState, useRef, useEffect } from "react";

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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.id === selectedId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block">
      {/* Dropdown trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-charcoal/70 hover:text-charcoal transition-colors tracking-wide"
      >
        {selectedOption?.label}
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
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-56 bg-ivory border border-stone/15 rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-40"
          style={{
            animation: "fadeIn 150ms ease-out",
          }}
        >
          <div className="py-2">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onSelect(option.id);
                  setIsOpen(false);
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

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SortDropdown;
