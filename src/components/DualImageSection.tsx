import { useInView } from '../hooks/useInView';
import HomepageProductLink from './HomepageProductLink';

const dualImages = [
  { src: '/images/section2image1.jpg', alt: 'Editorial look 1 – COGENESIS collection' },
  { src: '/images/section2image2.jpg', alt: 'Editorial look 2 – COGENESIS collection' },
];

const DualImageSection = () => {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="w-full bg-ivory py-16 border-t border-[#431C1C]/10"
      style={{ paddingLeft: '40px', paddingRight: '40px' }}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 w-full"
        style={{ maxWidth: '900px', margin: '0 auto', gap: '36px' }}
      >
        {dualImages.map((img, i) => (
          <HomepageProductLink
            key={img.src}
            productKey="section2"
          >
            <div
              className={`aspect-[1150/1724] overflow-hidden transition-all duration-1000 ease-out ${
                isInView
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="block w-full h-full object-cover"
              />
            </div>
          </HomepageProductLink>
        ))}
      </div>
    </section>
  );
};

export default DualImageSection;
