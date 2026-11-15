import { useInView } from '../hooks/useInView';

const dualImages = [
  { src: '/images/S4image1.jpg', alt: 'Editorial look 1 – COGENESIS collection' },
  { src: '/images/S4image2.jpg', alt: 'Editorial look 2 – COGENESIS collection' },
];

const DualImageSection = () => {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="w-full bg-ivory"
      style={{ padding: '48px 40px' }}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 w-full"
        style={{ maxWidth: '900px', margin: '0 auto', gap: '36px' }}
      >
        {dualImages.map((img, i) => (
          <div
            key={img.src}
            className={`transition-all duration-1000 ease-out ${
              isInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: `${i * 200}ms` }}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full transition-transform duration-700 ease-out hover:scale-[1.03]"
              style={{ height: 'auto', display: 'block' }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default DualImageSection;
