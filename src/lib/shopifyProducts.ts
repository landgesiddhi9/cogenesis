import { shopifyFetch } from "./shopify";
import type { ShopifyProduct } from "../types";

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          productType
          tags
          vendor
          featuredImage {
            id
            url
            altText
            width
            height
          }
          images(first: 10) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                image {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

interface ProductsGraphQLResponse {
  products: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        handle: string;
        description: string;
        descriptionHtml?: string;
        productType: string;
        tags: string[];
        vendor: string;
        featuredImage?: {
          id: string;
          url: string;
          altText?: string | null;
          width?: number;
          height?: number;
        } | null;
        images?: {
          edges: Array<{
            node: {
              id: string;
              url: string;
              altText?: string | null;
              width?: number;
              height?: number;
            };
          }>;
        } | null;
        variants?: {
          edges: Array<{
            node: {
              id: string;
              title: string;
              price: {
                amount: string;
                currencyCode: string;
              };
              compareAtPrice?: {
                amount: string;
                currencyCode: string;
              } | null;
              availableForSale: boolean;
              image?: {
                id: string;
                url: string;
                altText?: string | null;
                width?: number;
                height?: number;
              } | null;
            };
          }>;
        } | null;
        priceRange: {
          minVariantPrice: {
            amount: string;
            currencyCode: string;
          };
          maxVariantPrice: {
            amount: string;
            currencyCode: string;
          };
        };
      };
    }>;
  };
}

export async function getShopifyProducts(first: number): Promise<ShopifyProduct[]> {
  try {
    const data = await shopifyFetch<ProductsGraphQLResponse>(PRODUCTS_QUERY, { first });
    
    if (!data?.products?.edges) {
      return [];
    }

    return data.products.edges.map(({ node }) => {
      const featuredImage = node.featuredImage
        ? {
            id: node.featuredImage.id,
            url: node.featuredImage.url,
            altText: node.featuredImage.altText || node.title,
            width: node.featuredImage.width,
            height: node.featuredImage.height,
          }
        : {
            id: "default-image",
            url: "",
            altText: node.title,
          };

      const images = node.images?.edges?.map(({ node: img }) => ({
        id: img.id,
        url: img.url,
        altText: img.altText || "",
        width: img.width,
        height: img.height,
      })) || [];

      const variants = node.variants?.edges?.map(({ node: variant }) => ({
        id: variant.id,
        title: variant.title,
        price: {
          amount: variant.price.amount,
          currencyCode: variant.price.currencyCode,
        },
        compareAtPrice: variant.compareAtPrice
          ? {
              amount: variant.compareAtPrice.amount,
              currencyCode: variant.compareAtPrice.currencyCode,
            }
          : undefined,
        availableForSale: variant.availableForSale,
        image: variant.image
          ? {
              id: variant.image.id,
              url: variant.image.url,
              altText: variant.image.altText || "",
              width: variant.image.width,
              height: variant.image.height,
            }
          : undefined,
      })) || [];

      return {
        id: node.id,
        title: node.title,
        handle: node.handle,
        description: node.description || "",
        descriptionHtml: node.descriptionHtml,
        productType: node.productType || "",
        tags: node.tags || [],
        vendor: node.vendor || "",
        featuredImage,
        images,
        variants,
        priceRange: {
          minVariantPrice: {
            amount: node.priceRange.minVariantPrice.amount,
            currencyCode: node.priceRange.minVariantPrice.currencyCode,
          },
          maxVariantPrice: {
            amount: node.priceRange.maxVariantPrice.amount,
            currencyCode: node.priceRange.maxVariantPrice.currencyCode,
          },
        },
      };
    });
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
    throw error;
  }
}
