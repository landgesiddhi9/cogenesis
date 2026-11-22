import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  HOMEPAGE_PRODUCT_TARGETS,
  useHomepageProductHandle,
  type HomepageProductKey,
} from "../hooks/useHomepageProductHandle";

interface HomepageProductLinkProps {
  productKey: HomepageProductKey;
  children: ReactNode;
}

const HomepageProductLink = ({
  productKey,
  children,
}: HomepageProductLinkProps) => {
  const handle = useHomepageProductHandle(productKey);

  if (!handle) return children;

  return (
    <Link
      to={`/products/${handle}`}
      className="block"
      aria-label={`View ${HOMEPAGE_PRODUCT_TARGETS[productKey].label}`}
    >
      {children}
    </Link>
  );
};

export default HomepageProductLink;
