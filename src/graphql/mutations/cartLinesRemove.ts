import { PRODUCT_IMAGE_FIELDS_FRAGMENT } from "../fragments/productImage";
import { CART_FIELDS_FRAGMENT } from "../fragments/cart";
import type { ShopifyApiCart } from "./cartCreate";

export const CART_LINES_REMOVE_MUTATION = `
  ${PRODUCT_IMAGE_FIELDS_FRAGMENT}
  ${CART_FIELDS_FRAGMENT}

  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
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

export interface CartLinesRemoveResponse {
  cartLinesRemove: {
    cart: ShopifyApiCart | null;
    userErrors: Array<{
      field: string[];
      message: string;
    }>;
  };
}

export interface CartLinesRemoveVariables {
  cartId: string;
  lineIds: string[];
}
