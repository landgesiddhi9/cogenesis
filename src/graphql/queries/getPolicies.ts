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
    privacyPolicyPage: page(handle: "privacy-policy") {
      title
      body
      handle
    }
    refundPolicyPage: page(handle: "refund-policy") {
      title
      body
      handle
    }
    returnPolicyPage: page(handle: "return-policy") {
      title
      body
      handle
    }
    shippingPolicyPage: page(handle: "shipping-policy") {
      title
      body
      handle
    }
    termsAndConditionsPage: page(handle: "terms-and-conditions") {
      title
      body
      handle
    }
    termsOfServicePage: page(handle: "terms-of-service") {
      title
      body
      handle
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
  privacyPolicyPage: ShopifyPolicyPage | null;
  refundPolicyPage: ShopifyPolicyPage | null;
  returnPolicyPage: ShopifyPolicyPage | null;
  shippingPolicyPage: ShopifyPolicyPage | null;
  termsAndConditionsPage: ShopifyPolicyPage | null;
  termsOfServicePage: ShopifyPolicyPage | null;
}

export interface ShopifyPolicyPage {
  title: string;
  body: string;
  handle: string;
}
