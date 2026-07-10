# Shopify Checkout Integration

## How It Works

The "Proceed to Checkout" button on `/cart` redirects the customer to Shopify's
hosted checkout page using `window.location.href = cart.checkoutUrl`.

The `checkoutUrl` is fetched from the Storefront API via the `CartFields` fragment
(`src/graphql/fragments/cart.ts`) and is available on every cart mutation response.

## Checkout Flow

1. Customer clicks **Checkout** on the cart page.
2. `checkoutLoading` is set to `true`, disabling the button (text: "Redirecting...").
3. `window.location.href = cart.checkoutUrl` navigates to Shopify's hosted checkout.
4. Shopify handles the entire checkout, payment, and post-purchase flow.

## Custom Thank You / Order Success Page

### Current Capability (Shopify Basic/Standard)

Shopify Basic and Standard **do not support redirecting customers to a custom
Thank You page after checkout**. After payment, Shopify shows its own hosted
order status page.

### Order Status URL

The Storefront API provides an `orderUrl` on the `Order` object that can be
returned after a successful checkout. This URL points to Shopify's hosted order
status page. It is **not** available on the `Cart` object — it appears only on
the `Order` object returned by the `checkoutCreate` mutation or via webhooks.

### Path to a Custom Order Success Page

From the Storefront API perspective:

- `cart.checkoutUrl` — leads to Shopify's hosted checkout.
- After payment, Shopify returns the customer to the order status page.
- The order confirmation page URL can be obtained via:
  - The `order` field returned by the `checkoutCreate` mutation (Storefront API).
  - The Order webhook (REST Admin API) — sends order data after creation.
  - Shopify's Checkout Extensibility (Shopify Plus only).

### Recommended Approach (Future)

To build a custom Thank You page in the future **without Shopify Plus**:

1. After checkout, Shopify redirects to the order status page.
2. From the order status page, the SDK can obtain order details.
3. Use the Storefront API's `order` query with the order confirmation token to
   fetch order data and render a custom page.

With **Shopify Plus**, use **Checkout Extensibility** — a branded checkout with
post-purchase custom pages.

### Important

- Do **not** attempt to intercept or override Shopify's post-checkout redirect.
- Do **not** build a fake Thank You page in the React app — this breaks trust
  and payment confirmation.
- When implementing a custom order success page later, use the Storefront API
  `order` query or Shopify webhooks to fetch the confirmed order.
