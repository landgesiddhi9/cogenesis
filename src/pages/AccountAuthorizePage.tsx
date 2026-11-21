import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setSession, setShopifySessionTokens } from "../utils/auth";
import { handleShopifyOAuthCallback } from "../utils/shopifyAuth";

const AccountAuthorizePage = () => {
  const navigate = useNavigate();
  const handled = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    handleShopifyOAuthCallback(window.location.search)
      .then(({ profile, tokens }) => {
        const name =
          [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim() ||
          profile.displayName?.trim() ||
          profile.emailAddress?.emailAddress?.trim() ||
          profile.email?.trim() ||
          "Customer";
        const email =
          profile.emailAddress?.emailAddress?.trim() ||
          profile.email?.trim() ||
          "";

        setShopifySessionTokens(tokens.access_token, tokens.id_token);
        setSession({
          name,
          email,
          provider: "shopify",
        });
        navigate("/account", { replace: true });
      })
      .catch((callbackError: unknown) => {
        setError(
          callbackError instanceof Error
            ? callbackError.message
            : "Shopify login could not be completed.",
        );
      });
  }, [navigate]);

  return (
    <main className="bg-ivory min-h-[100svh] font-sans flex items-center justify-center px-6">
      {error ? (
        <div className="text-center max-w-md">
          <p className="text-[13px] text-red-600 mb-6">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/login", { replace: true })}
            className="text-[12px] uppercase tracking-[0.12em] underline"
          >
            Return to login
          </button>
        </div>
      ) : (
        <p className="text-[13px] text-[#666]">Completing secure sign-in...</p>
      )}
    </main>
  );
};

export default AccountAuthorizePage;
