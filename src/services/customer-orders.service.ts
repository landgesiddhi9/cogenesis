import { getShopifyAccessToken } from "../utils/auth";
import { discoverCustomerAccountApi } from "../utils/shopifyAuth";

export interface CustomerOrder {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string;
  fulfillments: {
    nodes: Array<{ status: string | null }>;
  };
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    nodes: Array<{
      id: string;
      name: string;
      title: string;
      quantity: number;
      image: { url: string } | null;
      totalPrice: {
        amount: string;
        currencyCode: string;
      } | null;
    }>;
  };
}

interface CustomerOrdersResponse {
  data?: {
    customer?: {
      orders?: {
        nodes?: CustomerOrder[];
      };
    } | null;
  };
  errors?: Array<{ message: string }>;
}

const CUSTOMER_ORDERS_QUERY = `
  query CustomerOrders {
    customer {
      orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
          name
          processedAt
          financialStatus
          fulfillmentStatus
          fulfillments(first: 1) {
            nodes {
              status
            }
          }
          totalPrice {
            amount
            currencyCode
          }
          lineItems(first: 5) {
            nodes {
              id
              name
              title
              quantity
              image {
                url
              }
              totalPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

export async function fetchCustomerOrders(
  signal?: AbortSignal,
): Promise<CustomerOrder[]> {
  const accessToken = getShopifyAccessToken();
  if (!accessToken) {
    throw new Error("Sign in with your Shopify account to view your orders.");
  }

  const { graphql_api: endpoint } = await discoverCustomerAccountApi();
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: CUSTOMER_ORDERS_QUERY }),
    signal,
  });
  const text = await response.text();

  if (!response.ok || !text.trim()) {
    throw new Error(
      `Unable to load your Shopify orders (HTTP ${response.status}).`,
    );
  }

  let payload: CustomerOrdersResponse;
  try {
    payload = JSON.parse(text) as CustomerOrdersResponse;
  } catch {
    throw new Error("Shopify returned an invalid order history response.");
  }
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
  }
  if (!payload.data?.customer?.orders?.nodes) {
    throw new Error("Shopify did not return customer order history.");
  }

  return payload.data.customer.orders.nodes;
}
