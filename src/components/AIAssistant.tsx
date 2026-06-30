import { useState } from "react";

const AIAssistant = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-[calc(var(--bottom-nav-height,56px)+env(safe-area-inset-bottom,0px)+24px)] md:bottom-6 right-6 z-50 w-8 h-8 md:w-10 md:h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.12)] flex items-center justify-center transition-all duration-300 ease-out hover:scale-105 active:scale-95"
        aria-label="Open AI Shopping Assistant"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2a2420"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[400px] max-w-[90vw] bg-[#faf8f5] shadow-[-4px_0_32px_rgba(0,0,0,0.08)] transform transition-transform duration-400 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#e8e0d8]">
          <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-[#2a2420]">
            AI Assistant
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-full bg-[#e8e0d8] flex items-center justify-center hover:bg-[#d8d0c8] transition-colors"
            aria-label="Close"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2a2420"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-8 flex flex-col items-center justify-center text-center h-[calc(100%-80px)]">
          <div className="w-16 h-16 rounded-full bg-[#e8e0d8] flex items-center justify-center mb-6">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2a2420"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h3 className="font-sans text-[13px] font-semibold uppercase tracking-[0.2em] text-[#2a2420] mb-3">
            How can I help you?
          </h3>
          <p className="font-sans text-[12px] text-[#7a7168] leading-relaxed max-w-[260px]">
            Ask me about products, sizes, styling advice, or anything else about your shopping experience.
          </p>

          {/* Input */}
          <div className="w-full mt-auto pt-8">
            <div className="flex items-center gap-2 bg-white border border-[#e8e0d8] rounded-sm px-4 py-3">
              <input
                type="text"
                placeholder="Type your question..."
                className="flex-1 bg-transparent font-sans text-[12px] text-[#2a2420] placeholder:text-[#a39890] outline-none"
              />
              <button type="button" className="flex-shrink-0">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2a2420"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;
