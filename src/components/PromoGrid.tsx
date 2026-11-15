import { useInView } from '../hooks/useInView';

const promoImages = [
  { src: '/images/S1Image1.jpg', alt: 'Promotional look 1 – COGENESIS collection', position: 'center 20%' },
  { src: '/images/S2image2.jpg', alt: 'Promotional look 2 – COGENESIS collection', position: 'center' },
  { src: '/images/S3image3.jpg', alt: 'Promotional look 3 – COGENESIS collection', position: 'center' },
];

const PromoGrid = () => {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="w-full max-w-none px-0 mx-0 py-12 md:py-16"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {promoImages.map((img, i) => (
          <div
            key={img.src}
            className={`overflow-hidden transition-all duration-1000 ease-out ${
              isInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: `${i * 150}ms` }}
          >
            <div className="relative w-full aspect-[3/4] overflow-hidden">
              <img
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 w-full h-full object-cover block border-0 rounded-none transition-transform duration-700 ease-out hover:scale-105"
                style={{ objectPosition: img.position }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PromoGrid;
