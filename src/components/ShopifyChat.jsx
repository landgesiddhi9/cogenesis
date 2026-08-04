import { useEffect } from "react";

// Shopify Inbox live chat widget (headless storefront).
// NOTE: this widget will NOT render on localhost — it only works once
// deployed (e.g. to Vercel) — so don't worry if nothing appears during
// local dev testing.
const ShopifyChat = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.id = "shopify-chat-bundle-selector";
    script.src =
      "https://cdn.shopify.com/extensions/019fc728-af1a-789c-bfa9-7e948565de7a/shopify-inbox-1301/assets/shopify-chat-bundle-selector.js";
    script.defer = true;
    script.setAttribute(
      "data-chat-src",
      "https://cdn.shopify.com/storefront/web-components/agent.js",
    );
    script.setAttribute(
      "data-agent-src",
      "https://cdn.shopify.com/storefront/web-components/agent.js",
    );
    script.setAttribute(
      "data-legacy-src",
      "https://cdn.shopify.com/extensions/019fc728-af1a-789c-bfa9-7e948565de7a/shopify-inbox-1301/assets/inbox-chat-loader.js",
    );
    script.setAttribute("data-horizontal-position", "bottom_right");
    script.setAttribute("data-vertical-position", "lowest");
    script.setAttribute("data-icon", "chat_bubble");
    script.setAttribute("data-text", "chat_with_us");
    script.setAttribute("data-color", "#000000");
    script.setAttribute("data-secondary-color", "#FFFFFF");
    script.setAttribute("data-ternary-color", "#6A6A6A");
    script.setAttribute("data-domain", "cogenesis-2.myshopify.com");
    script.setAttribute("data-shop-domain", "cogenesis-2.myshopify.com");
    script.setAttribute(
      "data-external-identifier",
      "hFJ4VifLZHiGFrPTQow7U2d-nyaRIJNRSXirPkrfgBY",
    );

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default ShopifyChat;
