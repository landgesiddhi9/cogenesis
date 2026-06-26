import { shopifyFetch } from "./shopify";
import type { ShopifyProduct, ShopifyCollection } from "../types";

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

const COLLECTION_QUERY = `
  query GetCollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        id
        url
        altText
      }
      products(first: 50) {
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
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
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
`;

interface ProductsGraphQLResponse {
  products: {
    edges: Array<{
      node: any;
    }>;
  };
}

export function transformShopifyProduct(node: any): ShopifyProduct {
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
        // Project fallback placeholder image
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop&crop=top",
        altText: node.title,
      };

  const images = node.images?.edges?.map(({ node: img }: any) => ({
    id: img.id,
    url: img.url,
    altText: img.altText || "",
    width: img.width,
    height: img.height,
  })) || [];

  const variants = node.variants?.edges?.map(({ node: variant }: any) => ({
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
}

export async function getShopifyProducts(first: number): Promise<ShopifyProduct[]> {
  try {
    const data = await shopifyFetch<ProductsGraphQLResponse>(PRODUCTS_QUERY, { first });
    
    if (!data?.products?.edges) {
      return [];
    }

    return data.products.edges.map(({ node }) => transformShopifyProduct(node));
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
    throw error;
  }
}

export async function getShopifyCollectionByHandle(handle: string): Promise<ShopifyCollection | null> {
  try {
    const data = await shopifyFetch<any>(COLLECTION_QUERY, { handle });
    
    if (!data?.collection) {
      return null;
    }

    const collectionNode = data.collection;
    const products = collectionNode.products?.edges?.map(({ node }: any) => transformShopifyProduct(node)) || [];

    return {
      id: collectionNode.id,
      title: collectionNode.title,
      handle: collectionNode.handle,
      description: collectionNode.description || "",
      image: collectionNode.image
        ? {
            id: collectionNode.image.id,
            url: collectionNode.image.url,
            altText: collectionNode.image.altText || collectionNode.title,
          }
        : undefined,
      products,
    };
  } catch (error) {
    console.error(`Failed to fetch Shopify collection with handle ${handle}:`, error);
    throw error;
  }
}

export async function getShopifyProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  try {
    const data = await shopifyFetch<any>(PRODUCT_BY_HANDLE_QUERY, { handle });
    
    if (!data?.product) {
      return null;
    }

    return transformShopifyProduct(data.product);
  } catch (error) {
    console.error(`Failed to fetch Shopify product with handle ${handle}:`, error);
    throw error;
  }
}
