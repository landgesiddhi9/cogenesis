import { PRODUCT_IMAGE_FIELDS_FRAGMENT } from "../fragments/productImage";
import { CART_FIELDS_FRAGMENT } from "../fragments/cart";
import type { ShopifyApiCart } from "./cartCreate";

export const CART_LINES_ADD_MUTATION = `
  ${PRODUCT_IMAGE_FIELDS_FRAGMENT}
  ${CART_FIELDS_FRAGMENT}

  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
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

export interface CartLinesAddResponse {
  cartLinesAdd: {
    cart: ShopifyApiCart | null;
    userErrors: Array<{
      field: string[];
      message: string;
    }>;
  };
}

export interface CartLinesAddVariables {
  cartId: string;
  lines: Array<{
    merchandiseId: string;
    quantity: number;
  }>;
}
