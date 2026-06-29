import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import womensImage from "../assets/womens-launching-soon.jpg";

const WomenLaunchingSoonPage = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="bg-[#F8F5EF] min-h-[100svh]">
      <div className="h-14 md:h-16" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pb-16 md:pb-24">
        <div
          className={`grid grid-cols-1 md:grid-cols-[40%_60%] lg:grid-cols-[50%_50%] gap-8 md:gap-12 lg:gap-16 transition-all duration-700 ease-out ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Left — Text content */}
          <div className="flex flex-col justify-center pt-12 md:pt-16 lg:pt-0 lg:min-h-[calc(100vh-12rem)]">
            <div className="max-w-lg lg:ml-auto lg:pr-4">
              <p className="font-sans text-[11px] md:text-[12px] uppercase tracking-[0.25em] text-[#4A3128]/50 mb-5">
                Women's Collection
              </p>

              <h1
                className="text-[40px] md:text-[52px] lg:text-[64px] font-light tracking-wide text-[#4A3128] leading-[1.1] mb-8"
                style={{
                  fontFamily: "'Cormorant Garamond', 'Canela', serif",
                  fontWeight: 400,
                }}
              >
                Launching Soon
              </h1>

              <div className="flex items-center gap-4 mb-10">
                <div className="shrink-0 w-8 h-px bg-[#4A3128]/20" />
                <div className="shrink-0 w-2 h-2 rounded-full bg-[#4A3128]/20" />
                <div className="shrink-0 w-8 h-px bg-[#4A3128]/20" />
              </div>

              <p className="font-sans text-[15px] md:text-[16px] text-[#4A3128]/70 leading-[1.8] mb-6 max-w-md">
                A thoughtfully curated collection is on its way.
              </p>

              <p className="font-sans text-[15px] md:text-[16px] text-[#4A3128]/60 leading-[1.8] mb-12 max-w-md">
                Timeless silhouettes, refined craftsmanship, and effortless
                elegance. We're putting the finishing touches on a collection
                designed for the modern woman.
              </p>

              <button
                onClick={() => navigate("/men/view-all")}
                className="inline-flex items-center justify-center px-10 py-3.5 text-sm tracking-[0.12em] uppercase font-sans text-[#4A3128] border border-[#4A3128]/40 bg-[#F8F5EF] hover:bg-[#4A3128] hover:text-[#F8F5EF] hover:border-[#4A3128] transition-all duration-300 w-full md:w-auto"
              >
                Explore Men's Collection
              </button>
            </div>
          </div>

          {/* Right — Editorial image */}
          <div className="md:min-h-[calc(100vh-12rem)] flex items-stretch">
            <div className="relative w-full overflow-hidden rounded-[10px] bg-[#f0ece4] min-h-[50vh] md:min-h-0">
              {!imgError ? (
                <img
                  src={womensImage}
                  alt="Women's collection preview"
                  className="w-full h-full object-cover absolute inset-0"
                  style={{ objectPosition: "center" }}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div
                  className="w-full h-full absolute inset-0"
                  style={{
                    background: "linear-gradient(135deg, #f0ece4 0%, #e8e0d4 100%)",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WomenLaunchingSoonPage;
