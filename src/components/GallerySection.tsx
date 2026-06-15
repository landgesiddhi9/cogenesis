import { galleryImages } from '../data/mockData';

const GallerySection = () => {
  const [left, center, right] = galleryImages;

  return (
    <section className="gallery" aria-label="Editorial portrait gallery">
      <div className="left">
        <img src={left.src} alt={left.alt} loading="lazy" />
      </div>
      <div className="center">
        <img src={center.src} alt={center.alt} loading="lazy" />
      </div>
      <div className="right">
        <img src={right.src} alt={right.alt} loading="lazy" />
      </div>
    </section>
  );
};

export default GallerySection;
