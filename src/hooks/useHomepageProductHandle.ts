import { useEffect, useState } from "react";
import { getAllProducts } from "../services/product.service";
import type { ShopifyProduct } from "../types";

export const HOMEPAGE_PRODUCT_TARGETS = {
  hero: {
    family: "Pure Linen Double Pocket",
    color: "Rust Red",
    label: "Pure Linen Double Pocket Shirt in Rust Red",
  },
  section2: {
    family: "Linen Blend Single Pocket",
    color: "Deep Black",
    label: "Linen Blend Single Pocket Shirt in Black",
  },
  section3: {
    family: "Pure Linen Double Pocket",
    color: "Navy Blue",
    label: "Pure Linen Double Pocket Shirt in Navy Blue",
  },
  section4: {
    family: "Cuban Collar Shirt",
    color: "Clay",
    label: "Cuban Collar Shirt in Clay",
  },
  section5: {
    family: "Pure Linen Double Pocket",
    color: "Peach",
    label: "Pure Linen Double Pocket Shirt in Peach",
  },
} as const;

export type HomepageProductKey = keyof typeof HOMEPAGE_PRODUCT_TARGETS;

let productCatalogPromise: Promise<ShopifyProduct[]> | null = null;

const getProductCatalog = () => {
  if (!productCatalogPromise) {
    productCatalogPromise = (async () => {
      const products: ShopifyProduct[] = [];
      let after: string | null = null;

      do {
        const page = await getAllProducts({ first: 250, after });
        products.push(...page.products);
        after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
      } while (after);

      return products;
    })().catch((error: unknown) => {
      productCatalogPromise = null;
      console.error("Unable to resolve homepage product links from Shopify.", error);
      throw error;
    });
  }

  return productCatalogPromise;
};

const normalize = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export const useHomepageProductHandle = (
  productKey: HomepageProductKey | null,
) => {
  const [handle, setHandle] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!productKey) {
      return () => {
        active = false;
      };
    }

    const target = HOMEPAGE_PRODUCT_TARGETS[productKey];
    const normalizedFamily = normalize(target.family);
    const normalizedColor = normalize(target.color);

    getProductCatalog()
      .then((products) => {
        if (!active) return;

        const matchingProduct = products.find((product) => {
          const title = normalize(product.title);
          return (
            title.includes(normalizedFamily) &&
            title.endsWith(normalizedColor)
          );
        });

        setHandle(matchingProduct?.handle ?? null);
      })
      .catch(() => {
        if (active) setHandle(null);
      });

    return () => {
      active = false;
    };
  }, [productKey]);

  return handle;
};
