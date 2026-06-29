import { shopifyRequest, type ShopifyRequestOptions } from "../api/client";
import { CART_CREATE_MUTATION, type CartCreateResponse } from "../graphql/mutations/cartCreate";
import { CART_LINES_ADD_MUTATION, type CartLinesAddResponse, type CartLinesAddVariables } from "../graphql/mutations/cartLinesAdd";
import { CART_LINES_UPDATE_MUTATION, type CartLinesUpdateResponse, type CartLinesUpdateVariables } from "../graphql/mutations/cartLinesUpdate";
import { CART_LINES_REMOVE_MUTATION, type CartLinesRemoveResponse, type CartLinesRemoveVariables } from "../graphql/mutations/cartLinesRemove";
import { GET_CART_QUERY, type GetCartResponse, type GetCartVariables } from "../graphql/queries/getCart";
import type { ShopifyCart, ShopifyCartLine } from "../types";

function mapCartLine(node: {
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
}): ShopifyCartLine {
  return {
    id: node.id,
    quantity: node.quantity,
    merchandise: {
      id: node.merchandise.id,
      title: node.merchandise.title,
      price: {
        amount: node.merchandise.price.amount,
        currencyCode: node.merchandise.price.currencyCode,
      },
      image: node.merchandise.image
        ? {
            id: node.merchandise.image.url ?? "",
            url: node.merchandise.image.url ?? "",
            altText: node.merchandise.image.altText ?? "",
            width: node.merchandise.image.width,
            height: node.merchandise.image.height,
          }
        : null,
      product: {
        title: node.merchandise.product.title,
        featuredImage: node.merchandise.product.featuredImage
          ? {
              id: node.merchandise.product.featuredImage.url ?? "",
              url: node.merchandise.product.featuredImage.url ?? "",
              altText: node.merchandise.product.featuredImage.altText ?? "",
              width: node.merchandise.product.featuredImage.width,
              height: node.merchandise.product.featuredImage.height,
            }
          : null,
      },
    },
  };
}

function mapCart(apiCart: {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: { edges: Array<{ node: {
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
  } }> };
  cost: { subtotalAmount: { amount: string; currencyCode: string }; totalAmount: { amount: string; currencyCode: string } };
}): ShopifyCart {
  return {
    id: apiCart.id,
    checkoutUrl: apiCart.checkoutUrl,
    totalQuantity: apiCart.totalQuantity,
    lines: apiCart.lines.edges.map(({ node }) => mapCartLine(node)),
    cost: {
      subtotalAmount: {
        amount: apiCart.cost.subtotalAmount.amount,
        currencyCode: apiCart.cost.subtotalAmount.currencyCode,
      },
      totalAmount: {
        amount: apiCart.cost.totalAmount.amount,
        currencyCode: apiCart.cost.totalAmount.currencyCode,
      },
    },
  };
}

export async function createCart(
  options: ShopifyRequestOptions = {},
): Promise<ShopifyCart> {
  const data = await shopifyRequest<CartCreateResponse>(CART_CREATE_MUTATION, undefined, options);

  if (!data.cartCreate.cart) {
    throw new Error("Failed to create cart.");
  }

  return mapCart(data.cartCreate.cart);
}

export async function getCart(
  cartId: string,
  options: ShopifyRequestOptions = {},
): Promise<ShopifyCart | null> {
  const data = await shopifyRequest<GetCartResponse, GetCartVariables>(
    GET_CART_QUERY,
    { cartId },
    options,
  );

  return data.cart ? mapCart(data.cart) : null;
}

export async function cartLinesAdd(
  cartId: string,
  lines: CartLinesAddVariables["lines"],
  options: ShopifyRequestOptions = {},
): Promise<ShopifyCart | null> {
  const data = await shopifyRequest<CartLinesAddResponse, CartLinesAddVariables>(
    CART_LINES_ADD_MUTATION,
    { cartId, lines },
    options,
  );

  return data.cartLinesAdd.cart ? mapCart(data.cartLinesAdd.cart) : null;
}

export async function cartLinesUpdate(
  cartId: string,
  lines: CartLinesUpdateVariables["lines"],
  options: ShopifyRequestOptions = {},
): Promise<ShopifyCart | null> {
  const data = await shopifyRequest<CartLinesUpdateResponse, CartLinesUpdateVariables>(
    CART_LINES_UPDATE_MUTATION,
    { cartId, lines },
    options,
  );

  return data.cartLinesUpdate.cart ? mapCart(data.cartLinesUpdate.cart) : null;
}

export async function cartLinesRemove(
  cartId: string,
  lineIds: CartLinesRemoveVariables["lineIds"],
  options: ShopifyRequestOptions = {},
): Promise<ShopifyCart | null> {
  const data = await shopifyRequest<CartLinesRemoveResponse, CartLinesRemoveVariables>(
    CART_LINES_REMOVE_MUTATION,
    { cartId, lineIds },
    options,
  );

  return data.cartLinesRemove.cart ? mapCart(data.cartLinesRemove.cart) : null;
}
