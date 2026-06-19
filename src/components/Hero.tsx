import { useInView } from '../hooks/useInView';
import { heroImage } from '../data/mockData';

type HeroProps = {
  overlay?: React.ReactNode;
};

const Hero: React.FC<HeroProps> = ({ overlay }) => {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="section-hero relative overflow-hidden">
      {/* Hero image */}
      <div className="media-fill">
        <img
          src={heroImage.src}
          alt={heroImage.alt}
          className={`transition-transform duration-[2000ms] ease-out ${
            isInView ? 'scale-100' : 'scale-110'
          }`}
        />
        {/* Subtle gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-deep-brown/30 via-transparent to-deep-brown/20" />
      </div>

      {overlay && (
        <div className="absolute inset-0 flex items-center justify-start">
          <div className="w-full max-w-[420px] px-6 lg:px-0 lg:ml-[8vw]">
            <div className="relative z-20 bg-white/8 p-0">
              {overlay}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
