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
        className={`grid grid-cols-1 md:grid-cols-2 w-full transition-all duration-1000 ease-out ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ gap: 0, minHeight: 'clamp(520px, 70svh, 760px)' }}
      >
        <div className="flex items-center justify-center bg-[#FAF8F4] px-8 md:px-12 lg:px-16">
          <div className="w-full max-w-[520px] text-center">
            <h1
              className="mb-8 text-[28px] leading-[1.15] tracking-[0.16em] text-[#A98A63] md:text-[38px] lg:text-[48px]"
              style={{ fontFamily: 'var(--font-body)', fontWeight: 700 }}
            >
              {brandStoryPanel.headlineLines.map((line, index) => (
                <span key={line}>
                  {line}
                  {index < brandStoryPanel.headlineLines.length - 1 && <br />}
                </span>
              ))}
            </h1>
            <div className="mx-auto max-w-[440px] text-[14px] leading-[1.7] text-[#A98A63] md:text-[16px]">
              {brandStoryPanel.paragraphs.map((paragraph, index) => (
                <p key={index} className={index > 0 ? 'mt-5' : ''}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full overflow-hidden bg-[#5A0F12]">
          <img
            src={brandStoryPanel.image.src}
            alt={brandStoryPanel.image.alt}
            className="block h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default BrandStorySplitSection;
