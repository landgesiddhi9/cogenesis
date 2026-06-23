import { useInView } from "../hooks/useInView";
import { productStripItems } from "../data/mockData";
import type { ShopifyProduct } from "../types";

const ProductCard = ({
  product,
  index,
}: {
  product: ShopifyProduct;
  index: number;
}) => {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  const handleProductClick = () => {
    window.history.pushState(
      { path: `/products/${product.handle}` },
      "",
      `/products/${product.handle}`,
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden cursor-pointer scroll-strip__panel w-[280px] md:w-[320px] lg:w-[360px] transition-all duration-700 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
      id={`product-card-${product.handle}`}
      onClick={handleProductClick}
    >
      {/* Image */}
      <div className="aspect-[5/8] overflow-hidden media-cover">
        <img
          src={product.featuredImage.url}
          alt={product.featuredImage.altText}
          className="product-img object-top"
          loading="lazy"
        />
      </div>

      {/* Hover overlay — subtle dark gradient from bottom */}
      <div className="product-overlay absolute inset-0 bg-gradient-to-t from-black/45 via-black/8 to-transparent opacity-0 group-hover:opacity-100" />

      {/* Product info — lower-left, revealed on hover */}
      <div className="product-info absolute bottom-0 left-0 right-0 p-6 md:p-8 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
        <span className="block font-sans text-[10px] tracking-[0.25em] uppercase text-white/70 mb-1.5">
          {product.productType}
        </span>
        <h3 className="font-sans text-[15px] md:text-base font-light tracking-wide text-white mb-1.5">
          {product.title}
        </h3>
        <p className="font-sans text-[12px] tracking-wider text-white/60">
          €{product.priceRange.minVariantPrice.amount}
        </p>
      </div>
    </div>
  );
};

const ProductStrip = () => {
  return (
    <section id="product-collection" className="section-content">
      {/* Horizontal scrolling editorial strip */}
      <div className="scroll-strip">
        <div className="scroll-strip__track">
          {productStripItems.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductStrip;
