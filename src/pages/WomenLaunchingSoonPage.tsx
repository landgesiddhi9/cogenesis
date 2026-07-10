import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import womensImage from "../assets/w1.jpg";

const WomenLaunchingSoonPage = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="bg-ivory">
      <div className="h-14 md:h-16" />
      <div
        className={`grid grid-cols-1 md:grid-cols-[45%_55%] w-full transition-all duration-700 ease-out ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ minHeight: "calc(100vh - 4rem)" }}
      >
        {/* Left — Text content */}
        <div className="flex items-center justify-center px-8 md:px-12 lg:px-16 xl:px-20 py-16 md:py-0">
          <div className="w-full max-w-[440px]">
            <p className="font-sans text-[11px] md:text-[12px] uppercase tracking-[0.25em] text-[#4A3128]/50 mb-4 md:mb-5">
              Women's Collection
            </p>

            <h1
              className="text-[42px] md:text-[64px] lg:text-[72px] tracking-wide text-[#4A3128] leading-[1.05] mb-5 md:mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', 'Canela', serif",
                fontWeight: 500,
              }}
            >
              Launching
              <br />
              Soon
            </h1>

            <div className="flex items-center gap-3 mb-6 md:mb-7">
              <div className="h-px w-10 bg-[#C4A882]/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#C4A882]/60" />
              <div className="h-px w-10 bg-[#C4A882]/60" />
            </div>

            <p className="font-sans text-[15px] md:text-[16px] text-[#4A3128]/80 leading-[1.8] mb-3 max-w-[440px]">
              A thoughtfully curated collection of timeless silhouettes and
              refined craftsmanship.
            </p>

            <p className="font-sans text-[15px] md:text-[16px] text-[#4A3128]/65 leading-[1.8] mb-8 md:mb-10 max-w-[440px]">
              We're putting the finishing touches on a collection designed for
              the modern woman.
            </p>

            <button
              onClick={() => navigate("/men/view-all")}
              className="inline-flex items-center justify-center px-12 py-4 text-sm tracking-[0.15em] uppercase font-sans text-[#4A3128] border border-[#4A3128]/30 bg-transparent hover:bg-[#4A3128] hover:text-[#F8F5EF] hover:border-[#4A3128] transition-all duration-500 ease-out w-full md:w-auto"
            >
              Explore Men's Collection
            </button>
          </div>
        </div>

        {/* Right — Editorial image */}
        <div className="relative w-full h-full min-h-[50vh] md:min-h-0">
          <div className="absolute inset-0 overflow-hidden bg-[#f0ece4]">
            {!imgError ? (
              <img
                src={womensImage}
                alt="Women's collection preview"
                className="w-full h-full object-cover"
                style={{ objectPosition: "center" }}
                onError={() => setImgError(true)}
              />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background:
                    "linear-gradient(135deg, #f0ece4 0%, #e8e0d4 100%)",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default WomenLaunchingSoonPage;
