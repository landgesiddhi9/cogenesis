import { fetchShopifyPolicies } from "../server/shopifyPolicies.js";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed." });
  }

  try {
    const policies = await fetchShopifyPolicies();
    response.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600",
    );
    return response.status(200).json({ policies });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load Shopify policies.";
    return response.status(502).json({ error: message });
  }
}
