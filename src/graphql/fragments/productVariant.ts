import { PRODUCT_IMAGE_FIELDS_FRAGMENT } from "./productImage";

export const PRODUCT_VARIANT_FIELDS_FRAGMENT = `
  ${PRODUCT_IMAGE_FIELDS_FRAGMENT}

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
