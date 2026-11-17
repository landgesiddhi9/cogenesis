// Shopify Storefront API — Shop policies query
// Fetches all four standard policies in a single request.
// Each policy field returns null when the policy has no content in Shopify Admin.

export const GET_POLICIES_QUERY = `
  query GetPolicies {
    shop {
      privacyPolicy {
        title
        body
        url
      }
      refundPolicy {
        title
        body
        url
      }
      shippingPolicy {
        title
        body
        url
      }
      termsOfService {
        title
        body
        url
      }
    }
  }
`;

export interface ShopifyPolicy {
  title: string;
  body: string;
  url: string;
}

export interface GetPoliciesResponse {
  shop: {
    privacyPolicy: ShopifyPolicy | null;
    refundPolicy: ShopifyPolicy | null;
    shippingPolicy: ShopifyPolicy | null;
    termsOfService: ShopifyPolicy | null;
  };
}
