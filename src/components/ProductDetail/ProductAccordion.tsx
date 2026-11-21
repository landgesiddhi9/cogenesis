import { useState } from "react";

interface ProductAccordionProps {
  title: string;
  content: string;
}

const LaundryCareSymbols = () => (
  <div className="flex items-center gap-4 mt-4 text-[#7A6E6D]" aria-label="Laundry care symbols">
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-label="Machine wash cool">
      <path d="M5 10h26l-2.5 20H7.5L5 10Z" />
      <path d="M8 25c4-3 6 3 10 0s6 3 10 0" />
      <circle cx="18" cy="16" r="1.5" fill="currentColor" stroke="none" />
    </svg>
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-label="Line dry">
      <rect x="7" y="5" width="22" height="26" rx="1" />
      <path d="M18 5v26" />
    </svg>
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-label="Do not wring">
      <path d="M9 13c4 0 6 2 9 2s5-2 9-2" />
      <path d="M8 23c5 0 7-2 10-2s5 2 10 2" />
      <path d="M13 17c2-2 8-2 10 0" />
      <path d="M12 6l12 24M24 6L12 30" />
    </svg>
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-label="Tumble dry low heat">
      <rect x="6" y="5" width="24" height="26" rx="2" />
      <circle cx="18" cy="19" r="7" />
      <circle cx="18" cy="19" r="1.5" fill="currentColor" stroke="none" />
    </svg>
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-label="Do not iron">
      <path d="M7 25h22c2 0 3-1 3-3v-3H17l-3-7H9l-2 13Z" />
      <path d="M10 19h19" />
      <path d="M12 7l12 12M24 7l-12 12" />
    </svg>
  </div>
);

const ProductAccordion = ({ title, content }: ProductAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-stone/15 py-6 first:pt-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between hover:text-charcoal/70 transition-colors text-left group py-2"
      >
        <h3
          className="text-charcoal tracking-tight"
          style={{
            fontFamily: "'Cormorant Garamond', 'Canela', serif",
            fontSize: "20px",
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h3>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={`flex-shrink-0 transition-transform duration-400 text-charcoal/60 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="pt-4 pb-2">
          <p
            className="text-charcoal/70 leading-relaxed whitespace-pre-wrap"
            style={{
              fontFamily: "'Cormorant Garamond', 'Canela', serif",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: 1.7,
              letterSpacing: "0.01em",
            }}
          >
            {content}
          </p>
          {title === "Care Instructions" && <LaundryCareSymbols />}
        </div>
      )}
    </div>
  );
};

export default ProductAccordion;
