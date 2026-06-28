import { useState } from "react";

import { createCart } from "../lib/shopifyCart";

type Cart = Awaited<ReturnType<typeof createCart>>;

function TestCartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateCart = async () => {
    try {
      setErrorMessage("");
      const cart = await createCart();

      console.log(cart);
      setCart(cart);
    } catch (error) {
      console.error(error);
      setCart(null);
      setErrorMessage(error instanceof Error ? error.message : "Unable to create Shopify cart.");
    }
  };

  return (
    <div>
      <button type="button" onClick={handleCreateCart}>
        Create Shopify Cart
      </button>

      {cart && (
        <div>
          <p>Cart ID:</p>
          <p>{cart.id}</p>
          <p>Checkout URL:</p>
          <p>{cart.checkoutUrl}</p>
        </div>
      )}

      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default TestCartPage;
