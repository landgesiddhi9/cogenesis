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
      className="w-full h-screen max-h-screen overflow-hidden bg-ivory flex items-center justify-center px-6 py-8 md:px-10 md:py-10 lg:px-16 lg:py-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-8 w-full max-w-7xl h-full max-h-[calc(100vh-6rem)]">
        {dualImages.map((img, i) => (
          <div
            key={img.src}
            className={`overflow-hidden transition-all duration-1000 ease-out ${
              isInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: `${i * 200}ms` }}
          >
            <div className="relative w-full h-full max-h-[75vh] overflow-hidden">
              <img
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DualImageSection;
