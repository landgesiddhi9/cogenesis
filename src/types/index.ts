// Shared pagination info for cursor-based product queries
export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string;
}

// Shopify Storefront API compatible interfaces
// These interfaces mirror Shopify's data structures for seamless future integration

export interface ShopifyImage {
  id: string;
  url: string;
  altText: string;
  width?: number;
  height?: number;
}

export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: ShopifyPrice;
  compareAtPrice?: ShopifyPrice;
  availableForSale: boolean;
  image?: ShopifyImage;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  productType: string;
  tags: string[];
  vendor: string;
  featuredImage: ShopifyImage;
  images: ShopifyImage[];
  variants: ShopifyProductVariant[];
  priceRange: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  };
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image?: ShopifyImage;
  products: ShopifyProduct[];
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: ShopifyCartLine[];
  cost: {
    subtotalAmount: ShopifyPrice;
    totalAmount: ShopifyPrice;
  };
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: ShopifyPrice;
    image?: ShopifyImage | null;
    product: {
      title: string;
      featuredImage?: ShopifyImage | null;
    };
  };
}

// UI-specific types
export interface NavLink {
  label: string;
  href: string;
  submenu?: NavLink[];
}

export interface EditorialImage {
  src: string;
  alt: string;
  caption?: string;
  subcaption?: string;
}

export interface EditorialVideo {
  src: string;
  alt: string;
  poster?: string;
  /** Used when the primary src fails to load (e.g. file not added yet) */
  fallbackSrc?: string;
}

export interface CampaignData {
  image?: EditorialImage;
  video?: string;
  title?: string;
  subtitle?: string;
  cta?: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  imageAlt: string;
  size: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderDate: string;
  items: OrderItem[];
  total: number;
  status: "delivered" | "shipped" | "processing" | "cancelled";
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderDate: string;
  items: OrderItem[];
  total: number;
  reason: string;
  status: "pending" | "approved" | "picked_up" | "refunded" | "rejected";
  pickupDate?: string;
  refundDate?: string;
}
