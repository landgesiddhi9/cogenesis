<<<<<<< HEAD
import { shopifyFetch } from "./shopify";

const CART_ID_KEY = "cogenesis_shopify_cart_id";

interface CartCreateResponse {
  cartCreate: {
    cart: { id: string; checkoutUrl: string } | null;
    userErrors: { field: string[]; message: string }[];
  };
}

interface CartLinesAddResponse {
  cartLinesAdd: {
    cart: {
      id: string;
      checkoutUrl: string;
      totalQuantity: number;
      lines: {
        edges: Array<{
          node: {
            id: string;
            quantity: number;
            merchandise: {
              id: string;
              title: string;
            };
          };
        }>;
      };
    } | null;
    userErrors: { field: string[]; message: string }[];
  };
}

const CART_CREATE_MUTATION = `mutation CartCreate {
  cartCreate {
    cart { id checkoutUrl }
    userErrors { field message }
  }
}`;

interface CartQueryResponse {
  cart: {
    id: string;
    checkoutUrl: string;
    totalQuantity: number;
    cost: {
      subtotalAmount: { amount: string; currencyCode: string };
      totalAmount: { amount: string; currencyCode: string };
      totalTaxAmount: { amount: string; currencyCode: string };
    };
    lines: {
      edges: Array<{
        node: {
          id: string;
          quantity: number;
          merchandise: {
            id: string;
            title: string;
            selectedOptions: Array<{ name: string; value: string }>;
            price: { amount: string; currencyCode: string };
            product: {
              title: string;
              featuredImage: { url: string; altText: string | null } | null;
            };
          };
        };
      }>;
    };
  } | null;
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    selectedOptions: Array<{ name: string; value: string }>;
    price: { amount: string; currencyCode: string };
    product: {
      title: string;
      featuredImage: { url: string; altText: string | null } | null;
    };
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
    totalTaxAmount: { amount: string; currencyCode: string };
  };
  lines: CartLine[];
}

const CART_QUERY = `query CartQuery($cartId: ID!) {
  cart(id: $cartId) {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
      totalTaxAmount { amount currencyCode }
    }
    lines(first: 250) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions { name value }
              price { amount currencyCode }
              product {
                title
                featuredImage { url altText }
              }
            }
          }
        }
      }
    }
  }
}`;

const CART_LINES_ADD_MUTATION = `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      id
      checkoutUrl
      totalQuantity
      lines(first: 20) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
              }
            }
          }
        }
      }
    }
    userErrors { field message }
  }
}`;

export async function createCart(): Promise<{ id: string; checkoutUrl: string }> {
  const data = await shopifyFetch<CartCreateResponse>(CART_CREATE_MUTATION);
  console.log("🔍 CART_CREATE_RESPONSE", JSON.stringify(data, null, 2));
  if (!data?.cartCreate) throw new Error("Shopify cartCreate returned no data.");
  const { cart, userErrors } = data.cartCreate;
  console.log("🔍 cartCreate.userErrors", userErrors);
  console.log("🔍 cartCreate.cart", cart);
  if (userErrors?.length) throw new Error(userErrors.map((e) => e.message).join("; "));
  if (!cart) throw new Error("Shopify cartCreate returned null cart.");
  console.log("🔍 CART CREATED — id:", cart.id, "checkoutUrl:", cart.checkoutUrl);
  return { id: cart.id, checkoutUrl: cart.checkoutUrl };
}

export async function getOrCreateCart(): Promise<string> {
  const stored = localStorage.getItem(CART_ID_KEY);
  if (stored) return stored;

  const cart = await createCart();
  localStorage.setItem(CART_ID_KEY, cart.id);
  return cart.id;
}

export async function addCartLine(
  cartId: string,
  merchandiseId: string,
  quantity: number = 1,
): Promise<{ id: string; checkoutUrl: string }> {
  const data = await shopifyFetch<CartLinesAddResponse>(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [{ merchandiseId, quantity }],
  });
  console.log("🔍 CART AFTER ADD", JSON.stringify(data.cartLinesAdd?.cart, null, 2));
  if (!data?.cartLinesAdd) throw new Error("Shopify cartLinesAdd returned no data.");
  const { cart, userErrors } = data.cartLinesAdd;
  if (userErrors?.length) throw new Error(userErrors.map((e) => e.message).join("; "));
  if (!cart) throw new Error("Shopify cartLinesAdd returned null cart.");
  return { id: cart.id, checkoutUrl: cart.checkoutUrl };
}

export async function getCart(cartId: string): Promise<Cart> {
  console.log("🔍 GETCART CALLED — cartId:", cartId);
  const data = await shopifyFetch<CartQueryResponse>(CART_QUERY, { cartId });
  console.log("🔍 CART_QUERY_RESPONSE", JSON.stringify(data, null, 2));
  if (!data?.cart) throw new Error("Shopify cart query returned no cart.");
  const cart = data.cart;
  console.log("🔍 CART_QUERY — id:", cart.id, "totalQuantity:", cart.totalQuantity, "checkoutUrl:", cart.checkoutUrl);
  console.log("🔍 CART_QUERY — lines edge count:", cart.lines?.edges?.length);
=======
type CartCreateResponse = {
  data?: {
    cartCreate?: {
      cart?: {
        id: string;
        checkoutUrl: string;
      } | null;
      userErrors?: Array<{
        message: string;
      }>;
    } | null;
  };
  errors?: Array<{
    message: string;
  }>;
};

export async function createCart() {
  const response = await fetch(
    `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: `
          mutation cartCreate {
            cartCreate {
              cart {
                id
                checkoutUrl
              }
              userErrors {
                message
              }
            }
          }
        `,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Unable to create Shopify cart.");
  }

  const result = (await response.json()) as CartCreateResponse;
  const cart = result.data?.cartCreate?.cart;

  if (!cart || result.errors?.length || result.data?.cartCreate?.userErrors?.length) {
    throw new Error("Unable to create Shopify cart.");
  }
>>>>>>> 3686bba (WIP: local cart changes)

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
<<<<<<< HEAD
    totalQuantity: cart.totalQuantity,
    cost: {
      subtotalAmount: cart.cost.subtotalAmount,
      totalAmount: cart.cost.totalAmount,
      totalTaxAmount: cart.cost.totalTaxAmount,
    },
    lines: cart.lines.edges.map((edge) => ({
      id: edge.node.id,
      quantity: edge.node.quantity,
      merchandise: {
        id: edge.node.merchandise.id,
        title: edge.node.merchandise.title,
        selectedOptions: edge.node.merchandise.selectedOptions,
        price: edge.node.merchandise.price,
        product: {
          title: edge.node.merchandise.product.title,
          featuredImage: edge.node.merchandise.product.featuredImage,
        },
      },
    })),
=======
>>>>>>> 3686bba (WIP: local cart changes)
  };
}
