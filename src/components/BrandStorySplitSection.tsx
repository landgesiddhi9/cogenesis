import { brandStoryPanel } from '../data/mockData';

const BrandStorySplitSection = () => {
  return (
    <section className="brand-story-split">
      <div className="brand-story-split__text">
        <div className="brand-story-split__content">
          <h1>
            {brandStoryPanel.headlineLines.map((line, index) => (
              <span key={line}>
                {line}
                {index < brandStoryPanel.headlineLines.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <h4>
            {brandStoryPanel.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </h4>
        </div>
      </div>

      <div className="brand-story-split__image">
        <img
          src={brandStoryPanel.image.src}
          alt={brandStoryPanel.image.alt}
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default BrandStorySplitSection;
