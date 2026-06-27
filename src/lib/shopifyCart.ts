import { shopifyFetch } from "./shopify";

// ── localStorage keys ─────────────────────────────────────────────────────────
const CART_ID_KEY = "cogenesis_shopify_cart_id";
const CHECKOUT_URL_KEY = "cogenesis_shopify_checkout_url";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
}

export interface ShopifyCartLineItem {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      title: string;
      featuredImage: {
        url: string;
        altText: string | null;
      } | null;
    };
    price: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface ShopifyCartDetails {
  id: string;
  checkoutUrl: string;
  lines: ShopifyCartLineItem[];
}

interface CartUserError {
  field: string[];
  message: string;
}

interface CartCreateResponse {
  cartCreate: {
    cart: {
      id: string;
      checkoutUrl: string;
    } | null;
    userErrors: CartUserError[];
  };
}

interface CartLinesAddResponse {
  cartLinesAdd: {
    cart: {
      id: string;
      checkoutUrl: string;
      lines: {
        edges: Array<{
          node: CartLineNode;
        }>;
      };
    } | null;
    userErrors: CartUserError[];
  };
}

interface CartLinesRemoveResponse {
  cartLinesRemove: {
    cart: {
      id: string;
      checkoutUrl: string;
      lines: {
        edges: Array<{
          node: CartLineNode;
        }>;
      };
    } | null;
    userErrors: CartUserError[];
  };
}

interface CartLinesUpdateResponse {
  cartLinesUpdate: {
    cart: {
      id: string;
      checkoutUrl: string;
      lines: {
        edges: Array<{
          node: CartLineNode;
        }>;
      };
    } | null;
    userErrors: CartUserError[];
  };
}

interface CartQueryResponse {
  cart: {
    id: string;
    checkoutUrl: string;
    lines: {
      edges: Array<{
        node: CartLineNode;
      }>;
    };
  } | null;
}

interface CartLineNode {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      title: string;
      featuredImage: {
        url: string;
        altText: string | null;
      } | null;
    };
    price: {
      amount: string;
      currencyCode: string;
    };
  };
}

// ── Shared cart line fragment ─────────────────────────────────────────────────

const CART_LINE_FIELDS = `
  id
  quantity
  merchandise {
    ... on ProductVariant {
      id
      title
      product {
        title
        featuredImage {
          url
          altText
        }
      }
      price {
        amount
        currencyCode
      }
    }
  }
`;

// ── GraphQL mutations & queries ───────────────────────────────────────────────

const CART_CREATE_MUTATION = `
  mutation CartCreate {
    cartCreate {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              ${CART_LINE_FIELDS}
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              ${CART_LINE_FIELDS}
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              ${CART_LINE_FIELDS}
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_QUERY = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      lines(first: 100) {
        edges {
          node {
            ${CART_LINE_FIELDS}
          }
        }
      }
    }
  }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────

function transformCartLines(
  edges: Array<{ node: CartLineNode }>,
): ShopifyCartLineItem[] {
  return edges.map(({ node }) => ({
    id: node.id,
    quantity: node.quantity,
    merchandise: {
      id: node.merchandise.id,
      title: node.merchandise.title,
      product: {
        title: node.merchandise.product.title,
        featuredImage: node.merchandise.product.featuredImage,
      },
      price: {
        amount: node.merchandise.price.amount,
        currencyCode: node.merchandise.price.currencyCode,
      },
    },
  }));
}

// ── Cart service functions ────────────────────────────────────────────────────

/**
 * Creates a brand-new Shopify cart via the Storefront Cart API.
 * Returns the cart `id` and `checkoutUrl`.
 */
export async function createCart(): Promise<ShopifyCart> {
  try {
    const data = await shopifyFetch<CartCreateResponse>(CART_CREATE_MUTATION);

    if (!data?.cartCreate) {
      throw new Error("Shopify cartCreate returned no data.");
    }

    const { cart, userErrors } = data.cartCreate;

    if (userErrors && userErrors.length > 0) {
      const messages = userErrors.map((e) => e.message).join("; ");
      throw new Error(`Shopify cartCreate user errors: ${messages}`);
    }

    if (!cart) {
      throw new Error("Shopify cartCreate returned null cart.");
    }

    return {
      id: cart.id,
      checkoutUrl: cart.checkoutUrl,
    };
  } catch (error) {
    console.error("Failed to create Shopify cart:", error);
    throw error;
  }
}

/**
 * Returns the stored cartId from localStorage. If none exists, creates a new
 * Shopify cart, persists the `cartId` and `checkoutUrl`, then returns the id.
 */
export async function getOrCreateCart(): Promise<string> {
  const storedId = localStorage.getItem(CART_ID_KEY);

  if (storedId) {
    return storedId;
  }

  const cart = await createCart();

  localStorage.setItem(CART_ID_KEY, cart.id);
  localStorage.setItem(CHECKOUT_URL_KEY, cart.checkoutUrl);

  return cart.id;
}

/**
 * Returns the stored Shopify checkout URL, or `null` if no cart has been
 * created yet.
 */
export function getCheckoutUrl(): string | null {
  return localStorage.getItem(CHECKOUT_URL_KEY);
}

/**
 * Removes the persisted cartId and checkoutUrl from localStorage.
 * Call this after a successful checkout or when the cart should be reset.
 */
export function clearStoredCart(): void {
  localStorage.removeItem(CART_ID_KEY);
  localStorage.removeItem(CHECKOUT_URL_KEY);
}

/**
 * Adds a line item to an existing Shopify cart.
 * Returns the full updated cart with all line items.
 */
export async function addCartLine(
  cartId: string,
  merchandiseId: string,
  quantity: number,
): Promise<ShopifyCartDetails> {
  try {
    const data = await shopifyFetch<CartLinesAddResponse>(
      CART_LINES_ADD_MUTATION,
      {
        cartId,
        lines: [{ merchandiseId, quantity }],
      },
    );

    if (!data?.cartLinesAdd) {
      throw new Error("Shopify cartLinesAdd returned no data.");
    }

    const { cart, userErrors } = data.cartLinesAdd;

    if (userErrors && userErrors.length > 0) {
      const messages = userErrors.map((e) => e.message).join("; ");
      throw new Error(`Shopify cartLinesAdd user errors: ${messages}`);
    }

    if (!cart) {
      throw new Error("Shopify cartLinesAdd returned null cart.");
    }

    return {
      id: cart.id,
      checkoutUrl: cart.checkoutUrl,
      lines: transformCartLines(cart.lines.edges),
    };
  } catch (error) {
    console.error("Failed to add cart line:", error);
    throw error;
  }
}

/**
 * Fetches the full cart by ID from the Shopify Storefront API.
 * Returns cart details including all line items with product info.
 */
export async function getCart(cartId: string): Promise<ShopifyCartDetails | null> {
  try {
    const data = await shopifyFetch<CartQueryResponse>(CART_QUERY, { cartId });

    if (!data?.cart) {
      return null;
    }

    return {
      id: data.cart.id,
      checkoutUrl: data.cart.checkoutUrl,
      lines: transformCartLines(data.cart.lines.edges),
    };
  } catch (error) {
    console.error("Failed to fetch Shopify cart:", error);
    throw error;
  }
}

/**
 * Removes a line item from an existing Shopify cart by line ID.
 * Returns the full updated cart with remaining line items.
 */
export async function removeCartLine(
  cartId: string,
  lineId: string,
): Promise<ShopifyCartDetails> {
  try {
    const data = await shopifyFetch<CartLinesRemoveResponse>(
      CART_LINES_REMOVE_MUTATION,
      {
        cartId,
        lineIds: [lineId],
      },
    );

    if (!data?.cartLinesRemove) {
      throw new Error("Shopify cartLinesRemove returned no data.");
    }

    const { cart, userErrors } = data.cartLinesRemove;

    if (userErrors && userErrors.length > 0) {
      const messages = userErrors.map((e) => e.message).join("; ");
      throw new Error(`Shopify cartLinesRemove user errors: ${messages}`);
    }

    if (!cart) {
      throw new Error("Shopify cartLinesRemove returned null cart.");
    }

    return {
      id: cart.id,
      checkoutUrl: cart.checkoutUrl,
      lines: transformCartLines(cart.lines.edges),
    };
  } catch (error) {
    console.error("Failed to remove cart line:", error);
    throw error;
  }
}

/**
 * Updates the quantity of an existing line item in a Shopify cart.
 * Returns the full updated cart with all line items.
 */
export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<ShopifyCartDetails> {
  try {
    const data = await shopifyFetch<CartLinesUpdateResponse>(
      CART_LINES_UPDATE_MUTATION,
      {
        cartId,
        lines: [{ id: lineId, quantity }],
      },
    );

    if (!data?.cartLinesUpdate) {
      throw new Error("Shopify cartLinesUpdate returned no data.");
    }

    const { cart, userErrors } = data.cartLinesUpdate;

    if (userErrors && userErrors.length > 0) {
      const messages = userErrors.map((e) => e.message).join("; ");
      throw new Error(`Shopify cartLinesUpdate user errors: ${messages}`);
    }

    if (!cart) {
      throw new Error("Shopify cartLinesUpdate returned null cart.");
    }

    return {
      id: cart.id,
      checkoutUrl: cart.checkoutUrl,
      lines: transformCartLines(cart.lines.edges),
    };
  } catch (error) {
    console.error("Failed to update cart line:", error);
    throw error;
  }
}

