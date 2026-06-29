import { PRODUCT_IMAGE_FIELDS_FRAGMENT } from "../fragments/productImage";
import { CART_FIELDS_FRAGMENT } from "../fragments/cart";
import type { ShopifyApiCart } from "./cartCreate";

export const CART_LINES_UPDATE_MUTATION = `
  ${PRODUCT_IMAGE_FIELDS_FRAGMENT}
  ${CART_FIELDS_FRAGMENT}

  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
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

export interface CartLinesUpdateResponse {
  cartLinesUpdate: {
    cart: ShopifyApiCart | null;
    userErrors: Array<{
      field: string[];
      message: string;
    }>;
  };
}

export interface CartLinesUpdateVariables {
  cartId: string;
  lines: Array<{
    id: string;
    quantity: number;
  }>;
}
