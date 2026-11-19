import { useInView } from '../hooks/useInView';
import { brandStory } from '../data/mockData';

const BrandStory = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="py-20 md:py-32 lg:py-40 px-6 md:px-12 lg:px-20 bg-ivory"
    >
      <div className="max-w-[900px] mx-auto text-center">
        {/* Headline */}
        <h2
          className={`font-display text-2xl md:text-4xl lg:text-5xl xl:text-[3.5rem] text-charcoal leading-[1.15] tracking-wide mb-8 md:mb-12 transition-all duration-1000 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {brandStory.headline}
        </h2>

        {/* Separator */}
        <div
          className={`separator mx-auto mb-8 md:mb-12 transition-all duration-800 delay-200 ${
            isInView ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Body text */}
        <p
          className={`font-body font-light text-base md:text-lg text-earth leading-[1.85] tracking-[0.01em] max-w-[680px] mx-auto mb-10 md:mb-14 transition-all duration-1000 delay-300 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {brandStory.body}
        </p>

        {/* Signature */}
        <div
          className={`transition-all duration-1000 delay-500 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="font-display text-base md:text-lg text-earth italic">
            {brandStory.signature}
          </p>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
