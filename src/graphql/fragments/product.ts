export const PRODUCT_FIELDS_FRAGMENT = `
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
