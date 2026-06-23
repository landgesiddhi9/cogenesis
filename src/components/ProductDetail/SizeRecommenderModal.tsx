interface SizeRecommenderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SizeRecommenderModal = ({
  isOpen,
  onClose,
}: SizeRecommenderModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center">
      <div
        className="bg-[#f7f5f1] w-full md:w-96 md:rounded-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#f7f5f1] border-b border-stone/15 px-6 md:px-8 py-6 flex items-center justify-between">
          <h2
            className="text-charcoal"
            style={{
              fontFamily: "'Cormorant Garamond', 'Canela', serif",
              fontSize: "28px",
              fontWeight: 400,
            }}
          >
            Size Recommender
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 hover:bg-charcoal/5 transition-colors rounded-full"
            aria-label="Close"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 md:px-8 py-12 text-center">
          <p
            className="text-charcoal/80 mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', 'Canela', serif",
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: 1.7,
            }}
          >
            This feature will be integrated in a future release.
          </p>

          <p
            className="text-charcoal/70 mb-12"
            style={{
              fontFamily: "'Cormorant Garamond', 'Canela', serif",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: 1.7,
            }}
          >
            You'll soon be able to receive personalized size recommendations
            based on your height, weight, and preferred fit.
          </p>

          <div
            className="inline-block bg-charcoal/5 border border-stone/20 px-8 py-6 rounded"
            style={{
              fontFamily: "'Cormorant Garamond', 'Canela', serif",
            }}
          >
            <p
              className="text-charcoal font-medium tracking-widest uppercase"
              style={{
                fontSize: "14px",
                fontWeight: 400,
                letterSpacing: "0.12em",
              }}
            >
              Coming Soon
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full mt-12 bg-charcoal text-white py-4 border border-charcoal hover:bg-charcoal/90 transition-colors"
            style={{
              fontFamily: "'Cormorant Garamond', 'Canela', serif",
              fontSize: "16px",
              fontWeight: 400,
              letterSpacing: "0.08em",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeRecommenderModal;
