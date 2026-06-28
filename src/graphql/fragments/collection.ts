export const COLLECTION_FIELDS_FRAGMENT = `
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
