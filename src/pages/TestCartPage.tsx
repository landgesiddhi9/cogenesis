import { useState } from "react";

type Cart = { id: string; checkoutUrl: string };

function TestCartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateCart = async () => {
    try {
      setErrorMessage("");
      // Mock cart creation
      const mockCart = {
        id: "mock-cart-id-" + Math.random().toString(36).substring(7),
        checkoutUrl: "https://mock-checkout-url.com"
      };

      console.log(mockCart);
      setCart(mockCart);
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
