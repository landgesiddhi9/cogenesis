import { useInView } from '../hooks/useInView';
import { heroImage } from '../data/mockData';

const Hero = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Hero image */}
      <div className="absolute inset-0">
        <img
          src={heroImage.src}
          alt={heroImage.alt}
          className={`w-full h-full object-cover object-top transition-transform duration-[2000ms] ease-out ${
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
