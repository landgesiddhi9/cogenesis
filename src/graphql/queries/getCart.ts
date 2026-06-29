import { PRODUCT_IMAGE_FIELDS_FRAGMENT } from "../fragments/productImage";
import { CART_FIELDS_FRAGMENT } from "../fragments/cart";
import type { ShopifyApiCart } from "../mutations/cartCreate";

export const GET_CART_QUERY = `
  ${PRODUCT_IMAGE_FIELDS_FRAGMENT}
  ${CART_FIELDS_FRAGMENT}

  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
`;

export interface GetCartResponse {
  cart: ShopifyApiCart | null;
}

export interface GetCartVariables {
  cartId: string;
}
