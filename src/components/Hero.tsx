import { useInView } from '../hooks/useInView';
import { heroImage } from '../data/mockData';

const Hero = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="section-hero">
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


    </section>
  );
};

export default Hero;
