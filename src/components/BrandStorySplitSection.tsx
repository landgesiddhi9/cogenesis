import { useInView } from '../hooks/useInView';
import { brandStoryPanel } from '../data/mockData';

const BrandStorySplitSection = () => {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="w-full bg-ivory border-t border-[#431C1C]/10"
    >
      <div
        className={`grid grid-cols-1 md:h-[calc(100svh-4rem)] md:grid-cols-2 md:grid-rows-[minmax(0,1fr)] w-full transition-all duration-1000 ease-out ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ gap: 0 }}
      >
        <div className="flex items-center justify-center bg-[#FAFAFA] px-6 py-10 md:px-8 md:py-3 lg:px-12">
          <div className="w-full max-w-[520px] text-center">
            <h1
              className="mb-6 text-[28px] leading-[1.15] tracking-[0.16em] text-[#431C1C] md:mb-8 md:text-[38px] lg:text-[clamp(38px,3.35vw,48px)]"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
            >
              {brandStoryPanel.headlineLines.map((line, index) => (
                <span key={line}>
                  {line}
                  {index < brandStoryPanel.headlineLines.length - 1 && <br />}
                </span>
              ))}
            </h1>
            <div className="mx-auto max-w-[440px] font-sans font-light text-[15px] leading-[1.75] tracking-[0.02em] text-[#5C5347] md:text-[clamp(15px,1.18vw,17px)]">
              {brandStoryPanel.paragraphs.map((paragraph, index) => (
                <p key={index} className={index > 0 ? 'mt-4 md:mt-5' : ''}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-[#5A0F12] p-6 md:aspect-auto md:h-full md:p-10">
          <img
            src={brandStoryPanel.image.src}
            alt={brandStoryPanel.image.alt}
            className="block h-auto max-h-full max-w-full w-auto object-contain"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default BrandStorySplitSection;
