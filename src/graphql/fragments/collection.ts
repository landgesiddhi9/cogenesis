import { PRODUCT_IMAGE_FIELDS_FRAGMENT } from "./productImage";

export const COLLECTION_FIELDS_FRAGMENT = `
  ${PRODUCT_IMAGE_FIELDS_FRAGMENT}

  fragment CollectionFields on Collection {
    id
    title
    handle
    description
    image {
      ...ProductImageFields
    }
  }
`;
