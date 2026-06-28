import { PRODUCT_IMAGE_FIELDS_FRAGMENT } from "./productImage";
import { PRODUCT_VARIANT_FIELDS_FRAGMENT } from "./productVariant";

export const PRODUCT_FIELDS_FRAGMENT = `
  ${PRODUCT_IMAGE_FIELDS_FRAGMENT}
  ${PRODUCT_VARIANT_FIELDS_FRAGMENT}

  fragment ProductFields on Product {
    id
    title
    handle
    description
    descriptionHtml
    productType
    tags
    vendor
    availableForSale
    featuredImage {
      ...ProductImageFields
    }
    images(first: 20) {
      edges {
        node {
          ...ProductImageFields
        }
      }
    }
    variants(first: 100) {
      edges {
        node {
          ...ProductVariantFields
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
  }
`;
