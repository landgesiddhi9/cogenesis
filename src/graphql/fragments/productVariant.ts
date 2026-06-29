export const PRODUCT_VARIANT_FIELDS_FRAGMENT = `
  fragment ProductVariantFields on ProductVariant {
    id
    title
    availableForSale
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    image {
      ...ProductImageFields
    }
  }
`;
