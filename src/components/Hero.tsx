import { Link, useNavigate } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import { heroImage } from '../data/mockData';
import {
  HOMEPAGE_PRODUCT_TARGETS,
  useHomepageProductHandle,
} from '../hooks/useHomepageProductHandle';

type HeroProps = {
  overlay?: React.ReactNode;
  linkToMappedProduct?: boolean;
};

const Hero: React.FC<HeroProps> = ({ overlay, linkToMappedProduct = false }) => {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const navigate = useNavigate();
  const productHandle = useHomepageProductHandle(
    linkToMappedProduct ? "hero" : null,
  );
  const ctaClassName = `
    text-white/90 text-[13px] md:text-[14px] font-medium tracking-[0.28em] uppercase
    transition-all duration-500 ease-out
    hover:text-white hover:scale-[1.03]
    ${isInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-4'}
  `;

  const mediaContent = (
    <>
      <img
        src={heroImage.src}
        alt={heroImage.alt}
        className={`transition-transform duration-[2000ms] ease-out ${
          isInView ? 'scale-100' : 'scale-110'
        }`}
      />
      {/* Subtle gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep-brown/30 via-transparent to-deep-brown/20" />
    </>
  );

  return (
    <section ref={ref} className="section-hero relative overflow-hidden">
      {productHandle ? (
        <Link
          to={`/products/${productHandle}`}
          className="media-fill"
          aria-label={`View ${HOMEPAGE_PRODUCT_TARGETS.hero.label}`}
        >
          {mediaContent}
        </Link>
      ) : (
        <div className="media-fill">{mediaContent}</div>
      )}
      {overlay && (
        <div className="absolute inset-0 flex items-center justify-start">
          <div className="w-full max-w-[420px] px-6 lg:px-0 lg:ml-[8vw]">
            <div className="relative z-20 bg-white/8 p-0">
              {overlay}
            </div>
          </div>
        </div>
      )}

      {/* CTA button — centered near bottom of hero */}
      <div className="absolute bottom-20 md:bottom-24 left-[calc(10%-1cm)] z-30">
        <button
          type="button"
          onClick={() => navigate('/men/view-all')}
          className={ctaClassName}
        >
          SHOP THE COLLECTION&nbsp;&nbsp;→
        </button>
      </div>
    </section>
  );
};

export default Hero;
