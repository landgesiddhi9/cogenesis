export interface ShopifyApiMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyApiImage {
  id?: string | null;
  url?: string | null;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface ShopifyApiProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyApiMoney;
  compareAtPrice?: ShopifyApiMoney | null;
  image?: ShopifyApiImage | null;
}

export interface ShopifyApiProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string | null;
  productType: string;
  tags: string[];
  vendor: string;
  availableForSale: boolean;
  featuredImage?: ShopifyApiImage | null;
  images?: {
    edges: Array<{
      node: ShopifyApiImage;
    }>;
  } | null;
  variants?: {
    edges: Array<{
      node: ShopifyApiProductVariant;
    }>;
  } | null;
  priceRange: {
    minVariantPrice: ShopifyApiMoney;
    maxVariantPrice: ShopifyApiMoney;
  };
}

export interface ShopifyApiCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image?: ShopifyApiImage | null;
  products?: {
    edges: Array<{
      node: ShopifyApiProduct;
    }>;
    pageInfo?: {
      hasNextPage: boolean;
      endCursor?: string | null;
    };
  } | null;
}
