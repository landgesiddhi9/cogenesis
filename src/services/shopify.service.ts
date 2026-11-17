import {
  shopifyRequest,
  ShopifyNetworkError,
  ShopifyGraphqlError,
  ShopifyUserError,
  type ShopifyRequestOptions,
  type ShopifyGraphqlErrorDetail,
} from "../api/client";
import { getShopifyConfig, getStorefrontApiUrl, ShopifyConfigError } from "../lib/shopify";
import {
  getAllProducts,
  getFeaturedProducts,
  getProductByHandle,
  type GetAllProductsParams,
  type FeaturedProductsResult,
  type ProductServiceResult,
} from "./product.service";
import {
  getAllCollections,
  getCollectionByHandle,
  getProductsByCollection,
  type GetProductsByCollectionParams,
  type CollectionServiceResult,
  type CollectionProductsResult,
} from "./collection.service";
import {
  createCart,
  getCart,
  cartLinesAdd,
  cartLinesUpdate,
  cartLinesRemove,
  type CartCreateInput,
} from "./cart.service";
import { searchProducts, type SearchProductsResult } from "./search.service";
import { getWishlistProductsByIds } from "./wishlist.service";
import { getPageByHandle, type PageServiceResult } from "./page.service";

// Re-export all error types and utilities
export {
  shopifyRequest,
  ShopifyNetworkError,
  ShopifyGraphqlError,
  ShopifyUserError,
  ShopifyConfigError,
  getShopifyConfig,
  getStorefrontApiUrl,
  getPageByHandle,
};

export type {
  ShopifyRequestOptions,
  ShopifyGraphqlErrorDetail,
  GetAllProductsParams,
  FeaturedProductsResult,
  ProductServiceResult,
  GetProductsByCollectionParams,
  CollectionServiceResult,
  CollectionProductsResult,
  CartCreateInput,
  SearchProductsResult,
  PageServiceResult,
};

// Re-export individual service methods
export {
  getAllProducts,
  getFeaturedProducts,
  getProductByHandle,
  getAllCollections,
  getCollectionByHandle,
  getProductsByCollection,
  createCart,
  getCart,
  cartLinesAdd,
  cartLinesUpdate,
  cartLinesRemove,
  searchProducts,
  getWishlistProductsByIds,
};

// Unified Shopify GraphQL API Service
export const shopifyService = {
  client: shopifyRequest,
  getConfig: getShopifyConfig,
  getEndpointUrl: getStorefrontApiUrl,

  products: {
    getAll: getAllProducts,
    getFeatured: getFeaturedProducts,
    getByHandle: getProductByHandle,
    search: searchProducts,
  },

  collections: {
    getAll: getAllCollections,
    getByHandle: getCollectionByHandle,
    getProducts: getProductsByCollection,
  },

  cart: {
    create: createCart,
    get: getCart,
    linesAdd: cartLinesAdd,
    linesUpdate: cartLinesUpdate,
    linesRemove: cartLinesRemove,
  },

  wishlist: {
    getProductsByIds: getWishlistProductsByIds,
  },
};

export default shopifyService;
