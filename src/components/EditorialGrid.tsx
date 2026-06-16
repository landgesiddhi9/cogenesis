import { useInView } from '../hooks/useInView';
import { editorialImages } from '../data/mockData';

const EditorialGrid = () => {
  const { ref: leftRef, isInView: leftInView } = useInView({ threshold: 0.15 });
  const { ref: rightRef, isInView: rightInView } = useInView({ threshold: 0.15 });

  return (
    <section className="editorial-section section-media" id="editorial-section">
      <div className="editorial-section__grid grid grid-cols-1 md:grid-cols-2 h-full">

        {/* Left column — collar detail image + text below */}
        <div
          ref={leftRef}
          className={`bg-[#F5F0EB] flex flex-col h-full min-h-0 transition-all duration-1000 ${
            leftInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Image fills remaining space; offset down 1cm without shifting text */}
          <div className="flex-1 min-h-0 px-16 pb-6 md:px-20 md:pb-8 lg:px-28 lg:pb-10">
            <div className="img-zoom h-full mt-[1cm] overflow-hidden media-cover">
              <img
                src="/images/collar-detail.png"
                alt="White shirt collar detail showing premium craftsmanship"
                className="object-center"
              />
            </div>
          </div>

          {/* Text block below left image */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center pt-4 pb-10 md:pt-6 md:pb-14 px-8">
            <h1 className="font-sans text-2xl md:text-3xl lg:text-[32px] font-bold uppercase tracking-[0.25em] text-[#2A2420] mb-3">
              TIMELESS
            </h1>
            <h4 className="font-sans text-[11px] md:text-xs lg:text-[13px] font-light tracking-[0.3em] uppercase text-[#7A7168]">
              character in every stitch
            </h4>
          </div>
        </div>

        {/* Right column — packaging image, full bleed on white */}
        <div
          ref={rightRef}
          className={`bg-white flex h-full min-h-0 overflow-hidden transition-all duration-1000 delay-200 ${
            rightInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="img-zoom w-full h-full media-cover">
            <img
              src={editorialImages[1].src}
              alt={editorialImages[1].alt}
              className="object-center"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default EditorialGrid;
