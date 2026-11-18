import { useInView } from "../hooks/useInView";

const sectionImages = [
  { src: "/images/section3image1.jpg", alt: "Editorial look 1 – COGENESIS collection" },
  { src: "/images/section3image2.jpg", alt: "Editorial look 2 – COGENESIS collection" },
  { src: "/images/section3image3.jpg", alt: "Editorial look 3 – COGENESIS collection" },
];

const ProductStrip = () => {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      id="product-collection"
      className="w-full bg-ivory py-16 border-t border-[#431C1C]/10"
      style={{ paddingLeft: 0, paddingRight: 0 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-0">
        {sectionImages.map((img, i) => (
          <div
            key={img.src}
            className={`aspect-[1150/1724] overflow-hidden transition-all duration-1000 ease-out ${
              isInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: `${i * 150}ms` }}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="block w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductStrip;
