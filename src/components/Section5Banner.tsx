import { useInView } from '../hooks/useInView';

const Section5Banner = () => {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="w-full bg-ivory py-16 border-t border-[#431C1C]/10"
      style={{ paddingLeft: '40px', paddingRight: '40px' }}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ maxWidth: '1440px', height: 'clamp(420px, 58vw, 760px)', margin: '0 auto' }}
      >
        <img
          src="/images/section5image.jpg"
          alt="COGENESIS editorial showcase"
          className="absolute inset-0 block h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default Section5Banner;
