import { useEffect, useState } from "react";
import { getFeaturedProducts } from "../../services/product.service";
import type { ShopifyProduct } from "../../types";
import ProductCard from "../ProductCard";

interface RelatedProductsProps {
  currentProduct: ShopifyProduct;
}

const RelatedProducts = ({ currentProduct }: RelatedProductsProps) => {
  const [relatedProducts, setRelatedProducts] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    let active = true;

    getFeaturedProducts(24)
      .then(({ products }) => {
        if (!active) return;

        const candidates = products.filter(
          (product) => product.id !== currentProduct.id,
        );
        const selected: ShopifyProduct[] = [];
        const addProducts = (matches: ShopifyProduct[]) => {
          matches.forEach((product) => {
            if (
              selected.length < 4 &&
              !selected.some((selectedProduct) => selectedProduct.id === product.id)
            ) {
              selected.push(product);
            }
          });
        };

        addProducts(
          candidates.filter(
            (product) => product.productType === currentProduct.productType,
          ),
        );

        addProducts(
          candidates.filter((product) =>
            product.tags.some((tag) => currentProduct.tags.includes(tag)),
          ),
        );

        addProducts(candidates);
        setRelatedProducts(selected);
      })
      .catch(() => {
        if (active) {
          setRelatedProducts([]);
        }
      });

    return () => {
      active = false;
    };
  }, [currentProduct]);

  return (
    <div>
      <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-12 font-light">
        You May Also Like
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {relatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            aspectRatio="aspect-[4/5]"
            hoverScale="group-hover:scale-105"
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
