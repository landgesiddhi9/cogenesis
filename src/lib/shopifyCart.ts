import { shopifyFetch } from "./shopify";

const CART_ID_KEY = "cogenesis_shopify_cart_id";
const CHECKOUT_URL_KEY = "cogenesis_shopify_checkout_url";

let pendingGetOrCreateCart: Promise<string> | null = null;

interface CartCreateResponse {
  cartCreate: {
    cart: { id: string; checkoutUrl: string } | null;
    userErrors: { field: string[]; message: string }[];
  };
}

interface CartLinesAddResponse {
  cartLinesAdd: {
    cart: { id: string; checkoutUrl: string } | null;
    userErrors: { field: string[]; message: string }[];
  };
}

const CART_CREATE_MUTATION = `
  mutation CartCreate {
    cartCreate {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`;

export async function createCart(): Promise<{ id: string; checkoutUrl: string }> {
  const data = await shopifyFetch<CartCreateResponse>(CART_CREATE_MUTATION);
  if (!data?.cartCreate) throw new Error("Shopify cartCreate returned no data.");
  const { cart, userErrors } = data.cartCreate;
  if (userErrors?.length) throw new Error(userErrors.map((e) => e.message).join("; "));
  if (!cart) throw new Error("Shopify cartCreate returned null cart.");
  return { id: cart.id, checkoutUrl: cart.checkoutUrl };
}

export async function getOrCreateCart(): Promise<string> {
  const storedId = localStorage.getItem(CART_ID_KEY);
  if (storedId) return storedId;

  if (!pendingGetOrCreateCart) {
    pendingGetOrCreateCart = (async () => {
      try {
        const storedIdAfterWait = localStorage.getItem(CART_ID_KEY);
        if (storedIdAfterWait) return storedIdAfterWait;

        const cart = await createCart();
        localStorage.setItem(CART_ID_KEY, cart.id);
        localStorage.setItem(CHECKOUT_URL_KEY, cart.checkoutUrl);
        return cart.id;
      } finally {
        pendingGetOrCreateCart = null;
      }
    })();
  }

  return pendingGetOrCreateCart;
}

export async function addCartLine(
  cartId: string,
  merchandiseId: string,
  quantity: number,
): Promise<string> {
  console.log("ENTER addCartLine");
  console.log("CALLING CartLinesAdd");
  const data = await shopifyFetch<CartLinesAddResponse>(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [{ merchandiseId, quantity }],
  });
  console.log("CartLinesAdd response", data);
  if (!data?.cartLinesAdd) throw new Error("Shopify cartLinesAdd returned no data.");
  const { cart, userErrors } = data.cartLinesAdd;
  if (userErrors?.length) throw new Error(userErrors.map((e) => e.message).join("; "));
  if (!cart) throw new Error("Shopify cartLinesAdd returned null cart.");

  localStorage.setItem(CART_ID_KEY, cart.id);
  localStorage.setItem(CHECKOUT_URL_KEY, cart.checkoutUrl);
  return cart.checkoutUrl;
}
