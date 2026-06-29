import { PRODUCT_IMAGE_FIELDS_FRAGMENT } from "../fragments/productImage";
import { CART_FIELDS_FRAGMENT } from "../fragments/cart";

export const CART_CREATE_MUTATION = `
  ${PRODUCT_IMAGE_FIELDS_FRAGMENT}
  ${CART_FIELDS_FRAGMENT}

  mutation cartCreate {
    cartCreate {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export interface CartCreateResponse {
  cartCreate: {
    cart: ShopifyApiCart | null;
    userErrors: Array<{
      field: string[];
      message: string;
    }>;
  };
}

export interface ShopifyApiCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    edges: Array<{
      node: ShopifyApiCartLine;
    }>;
  };
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
}

export interface ShopifyApiCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: { amount: string; currencyCode: string };
    image: { url: string; altText?: string; width?: number; height?: number } | null;
    product: {
      title: string;
      featuredImage: { url: string; altText?: string; width?: number; height?: number } | null;
    };
  };
}
