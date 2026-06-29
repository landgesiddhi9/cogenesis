import { shopifyRequest, type ShopifyRequestOptions } from "../api/client";
import { getProductsByCollection } from "./collection.service";
import { getFeaturedProducts } from "./product.service";
import { mapShopifyCollection } from "../lib/mapShopifyProduct";
import { PRODUCT_IMAGE_FIELDS_FRAGMENT } from "../graphql/fragments/productImage";
import { PRODUCT_VARIANT_FIELDS_FRAGMENT } from "../graphql/fragments/productVariant";
import { PRODUCT_FIELDS_FRAGMENT } from "../graphql/fragments/product";
import { COLLECTION_FIELDS_FRAGMENT } from "../graphql/fragments/collection";
import type { ShopifyApiCollection } from "../types/shopify-api";
import type { ShopifyCollection, ShopifyProduct } from "../types";

const MEN_COLLECTION_HANDLES = ["shirts", "trousers"];

export function getMenCollectionHandles(): string[] {
  return MEN_COLLECTION_HANDLES;
}

const GET_ALL_COLLECTIONS_QUERY = `
  ${PRODUCT_IMAGE_FIELDS_FRAGMENT}
  ${PRODUCT_VARIANT_FIELDS_FRAGMENT}
  ${COLLECTION_FIELDS_FRAGMENT}
  ${PRODUCT_FIELDS_FRAGMENT}

  query GetAllCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          ...CollectionFields
          products(first: 10) {
            edges {
              node {
                ...ProductFields
              }
            }
          }
        }
      }
    }
  }
`;

interface GetAllCollectionsResponse {
  collections: {
    edges: Array<{
      node: ShopifyApiCollection;
    }>;
  };
}

interface GetAllCollectionsVariables {
  first: number;
}

export async function getMenCollections(
  options: ShopifyRequestOptions = {},
): Promise<ShopifyCollection[]> {
  const data = await shopifyRequest<
    GetAllCollectionsResponse,
    GetAllCollectionsVariables
  >(GET_ALL_COLLECTIONS_QUERY, { first: 50 }, options);

  return data.collections.edges
    .map(({ node }) => mapShopifyCollection(node))
    .filter((c): c is ShopifyCollection => c !== null)
    .filter((c) => MEN_COLLECTION_HANDLES.includes(c.handle));
}

export async function getProductsFromMenCollections(
  options: ShopifyRequestOptions = {},
): Promise<ShopifyProduct[]> {
  const results = await Promise.all(
    MEN_COLLECTION_HANDLES.map((handle) =>
      getProductsByCollection({ handle, options }),
    ),
  );

  const seen = new Set<string>();
  return results.flatMap(({ products }) =>
    products.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    }),
  );
}

export async function getBestSellerProducts(
  options: ShopifyRequestOptions = {},
): Promise<ShopifyProduct[]> {
  const { products } = await getFeaturedProducts(12, options);
  return products;
}
