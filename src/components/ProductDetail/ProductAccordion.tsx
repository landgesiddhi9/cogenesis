import { useState } from "react";

interface ProductAccordionProps {
  title: string;
  content: string;
}

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
        </div>
      )}
    </div>
  );
};

export default ProductAccordion;
