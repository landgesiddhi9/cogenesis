const LaunchingSoonPage = () => {
  return (
    <main className="bg-ivory min-h-screen flex flex-col">
      {/* Spacer for fixed header */}
      <div className="h-20" />

      {/* Main content - centered */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-8 py-20">
        <div className="text-center max-w-2xl">
          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="shrink-0 w-8 h-px bg-stone/20"></div>
            <div className="shrink-0 w-2 h-2 rounded-full bg-stone/20"></div>
            <div className="shrink-0 w-8 h-px bg-stone/20"></div>
          </div>

          {/* Heading */}
          <h1
            className="text-5xl md:text-6xl font-light tracking-wide text-charcoal mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', 'Canela', serif",
              letterSpacing: "0.05em",
              fontWeight: 400,
            }}
          >
            Launching Soon
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-charcoal/70 mb-12 font-light tracking-wide font-sans">
            We're carefully curating an exceptional collection for you.
          </p>

          {/* Secondary divider */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="shrink-0 w-8 h-px bg-stone/20"></div>
            <div className="shrink-0 w-2 h-2 rounded-full bg-stone/20"></div>
            <div className="shrink-0 w-8 h-px bg-stone/20"></div>
          </div>

          {/* Call-to-action message */}
          <p className="text-base md:text-lg text-charcoal/60 font-light tracking-wide font-sans mb-8">
            Please check back soon for the women's collection.
          </p>

          {/* Back button */}
          <button
            onClick={() => {
              window.history.pushState({}, "", "/");
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
            className="inline-flex items-center gap-2 px-8 py-3 text-sm tracking-wide font-sans text-charcoal border border-stone/20 hover:border-charcoal/40 hover:bg-stone/5 transition-all duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </main>
  );
};

export default LaunchingSoonPage;
