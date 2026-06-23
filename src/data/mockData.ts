import type {
  NavLink,
  EditorialImage,
  EditorialVideo,
  ShopifyProduct,
  CampaignData,
  ShopifyCollection,
} from "../types";

// Navigation
export const navLinks: NavLink[] = [
  {
    label: "Men",
    href: "/men",
    submenu: [
      { label: "Shirts", href: "/collections/shirts" },
      { label: "Trousers", href: "/collections/trousers" },
      { label: "Polo Shirts", href: "/collections/polo-shirts" },
      { label: "View All", href: "/men" },
    ],
  },
  {
    label: "Women",
    href: "/women",
    submenu: [{ label: "Launching Soon", href: "/launching-soon" }],
  },
  {
    label: "Fabric",
    href: "/fabric",
    submenu: [
      { label: "Cotton", href: "/collections/cotton" },
      { label: "Linen", href: "/collections/linen" },
      { label: "LINEN BLEND", href: "/collections/linen-blend" },
    ],
  },
];

// Hero
export const heroImage: EditorialImage = {
  src: "/images/hero.png",
  alt: "Model wearing white linen shirt and cream trousers - Spring/Summer Collection",
};

// Editorial Grid
export const editorialImages: EditorialImage[] = [
  {
    src: "/images/collar-detail.png",
    alt: "White shirt collar detail showing premium craftsmanship",
  },
  {
    src: "/images/packaging.png",
    alt: "Luxury brand packaging in cream and gold",
    caption: "TIMELESS",
    subcaption: "Distinction in detail",
  },
];

// Product strip - premium shirt collection
const shirtProducts: ShopifyProduct[] = [
  {
    id: "gid://shopify/Product/1",
    title: "White Linen Shirt",
    handle: "white-linen-shirt",
    description: "Premium white linen shirt",
    productType: "Shirts",
    tags: ["shirts", "linen", "white"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-1",
      url: "https://images.unsplash.com/photo-1596215578519-47ac5beb46b7?w=600&h=750&fit=crop&crop=top",
      altText: "White linen shirt",
    },
    images: [],
    variants: [
      {
        id: "var-1",
        title: "M",
        price: { amount: "2999", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "2999", currencyCode: "INR" },
      maxVariantPrice: { amount: "2999", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/2",
    title: "Beige Linen Shirt",
    handle: "beige-linen-shirt",
    description: "Soft beige linen shirt",
    productType: "Shirts",
    tags: ["shirts", "linen", "beige"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-2",
      url: "https://images.unsplash.com/photo-1588359348347-9bc26aa11429?w=600&h=750&fit=crop&crop=top",
      altText: "Beige linen shirt",
    },
    images: [],
    variants: [
      {
        id: "var-2",
        title: "M",
        price: { amount: "3299", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "3299", currencyCode: "INR" },
      maxVariantPrice: { amount: "3299", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/3",
    title: "Blue Oxford Shirt",
    handle: "blue-oxford-shirt",
    description: "Classic blue oxford shirt",
    productType: "Shirts",
    tags: ["shirts", "cotton", "blue"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-3",
      url: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=600&h=750&fit=crop&crop=top",
      altText: "Blue oxford shirt",
    },
    images: [],
    variants: [
      {
        id: "var-3",
        title: "M",
        price: { amount: "2799", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "2799", currencyCode: "INR" },
      maxVariantPrice: { amount: "2799", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/4",
    title: "White Oxford Shirt",
    handle: "white-oxford-shirt",
    description: "Premium white oxford cloth shirt",
    productType: "Shirts",
    tags: ["shirts", "cotton", "white"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-4",
      url: "https://images.unsplash.com/photo-1596215578519-47ac5beb46b7?w=600&h=750&fit=crop&crop=top",
      altText: "White oxford shirt",
    },
    images: [],
    variants: [
      {
        id: "var-4",
        title: "M",
        price: { amount: "3199", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "3199", currencyCode: "INR" },
      maxVariantPrice: { amount: "3199", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/5",
    title: "Navy Cotton Shirt",
    handle: "navy-cotton-shirt",
    description: "Deep navy cotton shirt",
    productType: "Shirts",
    tags: ["shirts", "cotton", "navy"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-5",
      url: "https://images.unsplash.com/photo-1625681403280-becc4cb97e00?w=600&h=750&fit=crop&crop=top",
      altText: "Navy cotton shirt",
    },
    images: [],
    variants: [
      {
        id: "var-5",
        title: "M",
        price: { amount: "2699", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "2699", currencyCode: "INR" },
      maxVariantPrice: { amount: "2699", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/6",
    title: "Sage Green Linen Shirt",
    handle: "sage-green-linen-shirt",
    description: "Soft sage green linen shirt",
    productType: "Shirts",
    tags: ["shirts", "linen", "green"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-6",
      url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=750&fit=crop&crop=top",
      altText: "Sage green linen shirt",
    },
    images: [],
    variants: [
      {
        id: "var-6",
        title: "M",
        price: { amount: "3499", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "3499", currencyCode: "INR" },
      maxVariantPrice: { amount: "3499", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/7",
    title: "Stone Cotton Shirt",
    handle: "stone-cotton-shirt",
    description: "Neutral stone cotton shirt",
    productType: "Shirts",
    tags: ["shirts", "cotton", "stone"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-7",
      url: "https://images.unsplash.com/photo-1594938329595-ae4c7cc54d3e?w=600&h=750&fit=crop&crop=top",
      altText: "Stone cotton shirt",
    },
    images: [],
    variants: [
      {
        id: "var-7",
        title: "M",
        price: { amount: "3099", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "3099", currencyCode: "INR" },
      maxVariantPrice: { amount: "3099", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/8",
    title: "Black Premium Shirt",
    handle: "black-premium-shirt",
    description: "Premium black dress shirt",
    productType: "Shirts",
    tags: ["shirts", "cotton", "black"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-8",
      url: "https://images.unsplash.com/photo-1611832996057-84d5975dc69f?w=600&h=750&fit=crop&crop=top",
      altText: "Black premium shirt",
    },
    images: [],
    variants: [
      {
        id: "var-8",
        title: "M",
        price: { amount: "3799", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "3799", currencyCode: "INR" },
      maxVariantPrice: { amount: "3799", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/9",
    title: "Light Blue Striped Shirt",
    handle: "light-blue-striped-shirt",
    description: "Light blue striped premium shirt",
    productType: "Shirts",
    tags: ["shirts", "cotton", "blue"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-9",
      url: "https://images.unsplash.com/photo-1618354691551-418cb50494b8?w=600&h=750&fit=crop&crop=top",
      altText: "Light blue striped shirt",
    },
    images: [],
    variants: [
      {
        id: "var-9",
        title: "M",
        price: { amount: "3199", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "3199", currencyCode: "INR" },
      maxVariantPrice: { amount: "3199", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/10",
    title: "Cream Mandarin Collar Shirt",
    handle: "cream-mandarin-collar-shirt",
    description: "Cream mandarin collar premium shirt",
    productType: "Shirts",
    tags: ["shirts", "cotton", "cream"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-10",
      url: "https://images.unsplash.com/photo-1596215578519-47ac5beb46b7?w=600&h=750&fit=crop&crop=top",
      altText: "Cream mandarin collar shirt",
    },
    images: [],
    variants: [
      {
        id: "var-10",
        title: "M",
        price: { amount: "2999", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "2999", currencyCode: "INR" },
      maxVariantPrice: { amount: "2999", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/11",
    title: "Olive Linen Shirt",
    handle: "olive-linen-shirt",
    description: "Olive green linen shirt",
    productType: "Shirts",
    tags: ["shirts", "linen", "olive"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-11",
      url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=750&fit=crop&crop=top",
      altText: "Olive linen shirt",
    },
    images: [],
    variants: [
      {
        id: "var-11",
        title: "M",
        price: { amount: "3599", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "3599", currencyCode: "INR" },
      maxVariantPrice: { amount: "3599", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/12",
    title: "Sky Blue Formal Shirt",
    handle: "sky-blue-formal-shirt",
    description: "Sky blue formal premium shirt",
    productType: "Shirts",
    tags: ["shirts", "cotton", "blue"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-12",
      url: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=600&h=750&fit=crop&crop=top",
      altText: "Sky blue formal shirt",
    },
    images: [],
    variants: [
      {
        id: "var-12",
        title: "M",
        price: { amount: "3399", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "3399", currencyCode: "INR" },
      maxVariantPrice: { amount: "3399", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/13",
    title: "The Polo Classico",
    handle: "polo-classico",
    description: "Navy blue polo in mercerized cotton",
    productType: "Polos",
    tags: ["polos", "cotton", "navy"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-13",
      url: "/images/product-2.png",
      altText: "Navy blue polo shirt",
    },
    images: [],
    variants: [
      {
        id: "var-13",
        title: "M",
        price: { amount: "2499", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "2499", currencyCode: "INR" },
      maxVariantPrice: { amount: "2499", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/14",
    title: "The Amalfi Knit",
    handle: "amalfi-knit",
    description: "Cream knitted cotton polo",
    productType: "Polos",
    tags: ["polos", "knit", "cream"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-14",
      url: "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=600&h=750&fit=crop&crop=top",
      altText: "Cream knitted polo",
    },
    images: [],
    variants: [
      {
        id: "var-14",
        title: "M",
        price: { amount: "2899", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "2899", currencyCode: "INR" },
      maxVariantPrice: { amount: "2899", currencyCode: "INR" },
    },
  },
];

const trousersProducts: ShopifyProduct[] = [
  {
    id: "gid://shopify/Product/101",
    title: "Riviera Linen Trouser",
    handle: "riviera-linen-trouser",
    description:
      "Premium linen trousers with a relaxed fit, perfect for warm weather elegance",
    productType: "Trousers",
    tags: ["trousers", "linen", "white"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-101",
      url: "https://images.unsplash.com/photo-1541614936913-300e0a02f0e4?w=600&h=750&fit=crop&crop=top",
      altText: "Riviera Linen Trouser",
    },
    images: [],
    variants: [
      {
        id: "var-101",
        title: "M",
        price: { amount: "2999", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "2999", currencyCode: "INR" },
      maxVariantPrice: { amount: "2999", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/102",
    title: "Milano Tailored Trouser",
    handle: "milano-tailored-trouser",
    description:
      "Sophisticated tailored trousers with a sharp crease and fitted silhouette",
    productType: "Trousers",
    tags: ["trousers", "cotton", "navy"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-102",
      url: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=600&h=750&fit=crop&crop=top",
      altText: "Milano Tailored Trouser",
    },
    images: [],
    variants: [
      {
        id: "var-102",
        title: "M",
        price: { amount: "3499", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "3499", currencyCode: "INR" },
      maxVariantPrice: { amount: "3499", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/103",
    title: "Capri Cotton Trouser",
    handle: "capri-cotton-trouser",
    description: "Breathable cotton trousers with a comfortable mid-length fit",
    productType: "Trousers",
    tags: ["trousers", "cotton", "beige"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-103",
      url: "https://images.unsplash.com/photo-1624378439385-7520369cfb0d?w=600&h=750&fit=crop&crop=top",
      altText: "Capri Cotton Trouser",
    },
    images: [],
    variants: [
      {
        id: "var-103",
        title: "M",
        price: { amount: "2799", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "2799", currencyCode: "INR" },
      maxVariantPrice: { amount: "2799", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/104",
    title: "Florence Pleated Trouser",
    handle: "florence-pleated-trouser",
    description: "Elegant pleated trousers with a refined classical aesthetic",
    productType: "Trousers",
    tags: ["trousers", "linen", "cream"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-104",
      url: "https://images.unsplash.com/photo-1608064599577-d7e79c1f9f74?w=600&h=750&fit=crop&crop=top",
      altText: "Florence Pleated Trouser",
    },
    images: [],
    variants: [
      {
        id: "var-104",
        title: "M",
        price: { amount: "3299", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "3299", currencyCode: "INR" },
      maxVariantPrice: { amount: "3299", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/105",
    title: "Verona Relaxed Trouser",
    handle: "verona-relaxed-trouser",
    description:
      "Comfortable relaxed fit trousers with a modern casual aesthetic",
    productType: "Trousers",
    tags: ["trousers", "cotton", "stone"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-105",
      url: "https://images.unsplash.com/photo-1565958011504-98d342dd7d16?w=600&h=750&fit=crop&crop=top",
      altText: "Verona Relaxed Trouser",
    },
    images: [],
    variants: [
      {
        id: "var-105",
        title: "M",
        price: { amount: "2599", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "2599", currencyCode: "INR" },
      maxVariantPrice: { amount: "2599", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/106",
    title: "Siena Chino",
    handle: "siena-chino",
    description:
      "Versatile chino trousers in earth tones, perfect for any occasion",
    productType: "Trousers",
    tags: ["trousers", "cotton", "olive"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-106",
      url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=750&fit=crop&crop=top",
      altText: "Siena Chino",
    },
    images: [],
    variants: [
      {
        id: "var-106",
        title: "M",
        price: { amount: "2499", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "2499", currencyCode: "INR" },
      maxVariantPrice: { amount: "2499", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/107",
    title: "Monaco Formal Trouser",
    handle: "monaco-formal-trouser",
    description: "Premium formal trousers with impeccable tailoring and drape",
    productType: "Trousers",
    tags: ["trousers", "cotton", "black"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-107",
      url: "https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=600&h=750&fit=crop&crop=top",
      altText: "Monaco Formal Trouser",
    },
    images: [],
    variants: [
      {
        id: "var-107",
        title: "M",
        price: { amount: "3799", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "3799", currencyCode: "INR" },
      maxVariantPrice: { amount: "3799", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/108",
    title: "Portofino Linen Trouser",
    handle: "portofino-linen-trouser",
    description:
      "Luxurious linen trousers with exceptional breathability and softness",
    productType: "Trousers",
    tags: ["trousers", "linen", "stone"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-108",
      url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=750&fit=crop&crop=top",
      altText: "Portofino Linen Trouser",
    },
    images: [],
    variants: [
      {
        id: "var-108",
        title: "M",
        price: { amount: "3199", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "3199", currencyCode: "INR" },
      maxVariantPrice: { amount: "3199", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/109",
    title: "Tuscany Classic Trouser",
    handle: "tuscany-classic-trouser",
    description:
      "Classic cotton trousers with timeless design and superior comfort",
    productType: "Trousers",
    tags: ["trousers", "cotton", "charcoal"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-109",
      url: "https://images.unsplash.com/photo-1528996612457-b5d0a9d5a6d2?w=600&h=750&fit=crop&crop=top",
      altText: "Tuscany Classic Trouser",
    },
    images: [],
    variants: [
      {
        id: "var-109",
        title: "M",
        price: { amount: "2899", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "2899", currencyCode: "INR" },
      maxVariantPrice: { amount: "2899", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/110",
    title: "Como Premium Trouser",
    handle: "como-premium-trouser",
    description: "Premium quality linen trousers with sophisticated elegance",
    productType: "Trousers",
    tags: ["trousers", "linen", "white"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-110",
      url: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=600&h=750&fit=crop&crop=top",
      altText: "Como Premium Trouser",
    },
    images: [],
    variants: [
      {
        id: "var-110",
        title: "M",
        price: { amount: "3599", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "3599", currencyCode: "INR" },
      maxVariantPrice: { amount: "3599", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/111",
    title: "Amalfi Straight Trouser",
    handle: "amalfi-straight-trouser",
    description: "Straight cut cotton trousers with a clean, contemporary look",
    productType: "Trousers",
    tags: ["trousers", "cotton", "blue"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-111",
      url: "https://images.unsplash.com/photo-1548883866-2835d01ff6a9?w=600&h=750&fit=crop&crop=top",
      altText: "Amalfi Straight Trouser",
    },
    images: [],
    variants: [
      {
        id: "var-111",
        title: "M",
        price: { amount: "2799", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "2799", currencyCode: "INR" },
      maxVariantPrice: { amount: "2799", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/112",
    title: "Veneto Tailored Trouser",
    handle: "veneto-tailored-trouser",
    description: "Meticulously tailored cotton trousers with premium finishing",
    productType: "Trousers",
    tags: ["trousers", "cotton", "navy"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-112",
      url: "https://images.unsplash.com/photo-1539533057440-7bf4488c4572?w=600&h=750&fit=crop&crop=top",
      altText: "Veneto Tailored Trouser",
    },
    images: [],
    variants: [
      {
        id: "var-112",
        title: "M",
        price: { amount: "3399", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "3399", currencyCode: "INR" },
      maxVariantPrice: { amount: "3399", currencyCode: "INR" },
    },
  },
];

const poloShirtProducts: ShopifyProduct[] = [
  {
    id: "gid://shopify/Product/201",
    title: "Riviera Polo",
    handle: "riviera-polo",
    description: "Classic cotton polo shirt with timeless elegance and comfort",
    productType: "Polos",
    tags: ["polos", "cotton", "white"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-201",
      url: "https://images.unsplash.com/photo-1578504494785-2ff8d48a4f38?w=600&h=750&fit=crop&crop=top",
      altText: "Riviera Polo",
    },
    images: [],
    variants: [
      {
        id: "var-201",
        title: "M",
        price: { amount: "2499", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "2499", currencyCode: "INR" },
      maxVariantPrice: { amount: "2499", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/202",
    title: "Monaco Knit Polo",
    handle: "monaco-knit-polo",
    description:
      "Fine knit cotton polo with excellent structure and durability",
    productType: "Polos",
    tags: ["polos", "cotton", "navy"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-202",
      url: "https://images.unsplash.com/photo-1618569222396-28f7e70b5ef5?w=600&h=750&fit=crop&crop=top",
      altText: "Monaco Knit Polo",
    },
    images: [],
    variants: [
      {
        id: "var-202",
        title: "M",
        price: { amount: "2899", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "2899", currencyCode: "INR" },
      maxVariantPrice: { amount: "2899", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/203",
    title: "Amalfi Linen Polo",
    handle: "amalfi-linen-polo",
    description: "Breathable linen polo with a relaxed, sophisticated fit",
    productType: "Polos",
    tags: ["polos", "linen", "beige"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-203",
      url: "https://images.unsplash.com/photo-1611006226300-142b3fc3d1df?w=600&h=750&fit=crop&crop=top",
      altText: "Amalfi Linen Polo",
    },
    images: [],
    variants: [
      {
        id: "var-203",
        title: "M",
        price: { amount: "2799", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "2799", currencyCode: "INR" },
      maxVariantPrice: { amount: "2799", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/204",
    title: "Siena Cotton Polo",
    handle: "siena-cotton-polo",
    description: "Premium cotton polo with exceptional comfort and style",
    productType: "Polos",
    tags: ["polos", "cotton", "stone"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-204",
      url: "https://images.unsplash.com/photo-1523170335684-f042070fe1c7?w=600&h=750&fit=crop&crop=top",
      altText: "Siena Cotton Polo",
    },
    images: [],
    variants: [
      {
        id: "var-204",
        title: "M",
        price: { amount: "2399", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "2399", currencyCode: "INR" },
      maxVariantPrice: { amount: "2399", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/205",
    title: "Verona Rib Polo",
    handle: "verona-rib-polo",
    description: "Ribbed cotton polo with a refined, contoured silhouette",
    productType: "Polos",
    tags: ["polos", "cotton", "white"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-205",
      url: "https://images.unsplash.com/photo-1578504494785-2ff8d48a4f38?w=600&h=750&fit=crop&crop=top",
      altText: "Verona Rib Polo",
    },
    images: [],
    variants: [
      {
        id: "var-205",
        title: "M",
        price: { amount: "2599", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "2599", currencyCode: "INR" },
      maxVariantPrice: { amount: "2599", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/206",
    title: "Capri Textured Polo",
    handle: "capri-textured-polo",
    description: "Textured cotton polo with contemporary aesthetic appeal",
    productType: "Polos",
    tags: ["polos", "cotton", "olive"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-206",
      url: "https://images.unsplash.com/photo-1603252109303-2368ff10e5ce?w=600&h=750&fit=crop&crop=top",
      altText: "Capri Textured Polo",
    },
    images: [],
    variants: [
      {
        id: "var-206",
        title: "M",
        price: { amount: "2699", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "2699", currencyCode: "INR" },
      maxVariantPrice: { amount: "2699", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/207",
    title: "Florence Premium Polo",
    handle: "florence-premium-polo",
    description: "Premium quality cotton polo with superior comfort and fit",
    productType: "Polos",
    tags: ["polos", "cotton", "blue"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-207",
      url: "https://images.unsplash.com/photo-1618569222396-28f7e70b5ef5?w=600&h=750&fit=crop&crop=top",
      altText: "Florence Premium Polo",
    },
    images: [],
    variants: [
      {
        id: "var-207",
        title: "M",
        price: { amount: "3199", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "3199", currencyCode: "INR" },
      maxVariantPrice: { amount: "3199", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/208",
    title: "Milano Polo",
    handle: "milano-polo",
    description: "Sophisticated cotton polo with elegant tailoring",
    productType: "Polos",
    tags: ["polos", "cotton", "black"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-208",
      url: "https://images.unsplash.com/photo-1523170335684-f042070fe1c7?w=600&h=750&fit=crop&crop=top",
      altText: "Milano Polo",
    },
    images: [],
    variants: [
      {
        id: "var-208",
        title: "M",
        price: { amount: "2899", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "2899", currencyCode: "INR" },
      maxVariantPrice: { amount: "2899", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/209",
    title: "Como Knit Polo",
    handle: "como-knit-polo",
    description:
      "Fine knit cotton polo with exceptional quality and durability",
    productType: "Polos",
    tags: ["polos", "cotton", "cream"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-209",
      url: "https://images.unsplash.com/photo-1578504494785-2ff8d48a4f38?w=600&h=750&fit=crop&crop=top",
      altText: "Como Knit Polo",
    },
    images: [],
    variants: [
      {
        id: "var-209",
        title: "M",
        price: { amount: "3299", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "3299", currencyCode: "INR" },
      maxVariantPrice: { amount: "3299", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/210",
    title: "Tuscany Linen Polo",
    handle: "tuscany-linen-polo",
    description: "Luxurious linen polo with exceptional breathability",
    productType: "Polos",
    tags: ["polos", "linen", "white"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-210",
      url: "https://images.unsplash.com/photo-1611006226300-142b3fc3d1df?w=600&h=750&fit=crop&crop=top",
      altText: "Tuscany Linen Polo",
    },
    images: [],
    variants: [
      {
        id: "var-210",
        title: "M",
        price: { amount: "2999", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "2999", currencyCode: "INR" },
      maxVariantPrice: { amount: "2999", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/211",
    title: "Veneto Polo",
    handle: "veneto-polo",
    description: "Classic cotton polo with timeless style and comfort",
    productType: "Polos",
    tags: ["polos", "cotton", "navy"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-211",
      url: "https://images.unsplash.com/photo-1618569222396-28f7e70b5ef5?w=600&h=750&fit=crop&crop=top",
      altText: "Veneto Polo",
    },
    images: [],
    variants: [
      {
        id: "var-211",
        title: "M",
        price: { amount: "2799", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "2799", currencyCode: "INR" },
      maxVariantPrice: { amount: "2799", currencyCode: "INR" },
    },
  },
  {
    id: "gid://shopify/Product/212",
    title: "Portofino Polo",
    handle: "portofino-polo",
    description: "Premium linen polo with sophisticated elegance",
    productType: "Polos",
    tags: ["polos", "linen", "stone"],
    vendor: "COGNISINS",
    featuredImage: {
      id: "img-212",
      url: "https://images.unsplash.com/photo-1611006226300-142b3fc3d1df?w=600&h=750&fit=crop&crop=top",
      altText: "Portofino Polo",
    },
    images: [],
    variants: [
      {
        id: "var-212",
        title: "M",
        price: { amount: "3099", currencyCode: "INR" },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: "3099", currencyCode: "INR" },
      maxVariantPrice: { amount: "3099", currencyCode: "INR" },
    },
  },
];

export const productStripItems: ShopifyProduct[] = shirtProducts;

// Campaign
export const campaignData: CampaignData = {
  video: "/videos/cinemagraph-eu.webm",
  title: "Summer of Light",
  subtitle: "The new collection",
};

// Full-screen triple video panels — flush below full-screen campaign film
export const aboutTripleVideo = {
  src: "/videos/aboutcg1.mp4",
  offsets: [0, 2, 4],
};

// Full-screen brand story split — flush below triple video section
export const brandStoryPanel = {
  headlineLines: ["A WARDROBE", "DISTILLED TO ITS", "MOST ESSENTIAL", "FORMS."],
  paragraphs: [
    "Cogenesis began with a quiet observation — that the modern wardrobe had grown noisier than the lives it served. We set out to make fewer pieces, more carefully.",
    "Each shirt and trouser is developed across months of fabric study, draping and small-batch production, finished by hand in our atelier.",
  ],
  image: {
    src: "/images/letterimg.png",
    alt: "White-gloved hand holding a sealed Cogenesis letter on burgundy",
  },
};

// Gallery section images
export const galleryImages: EditorialImage[] = [
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop",
    alt: "Editorial portrait - close up fashion shot",
  },
  {
    src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=600&fit=crop",
    alt: "Male model in white shirt, editorial fashion",
  },
  {
    src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=1000&fit=crop",
    alt: "Man in dark suit, luxury fashion editorial",
  },
  {
    src: "https://images.unsplash.com/photo-1492288991661-058aa541e4bc?w=800&h=600&fit=crop",
    alt: "Fashion accessories detail shot",
  },
  {
    src: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=800&h=1200&fit=crop",
    alt: "Couple walking in archway, editorial fashion",
  },
  {
    src: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&h=600&fit=crop",
    alt: "Man looking away, fashion editorial",
  },
];

// Full-screen luxury campaign film — flush below gallery, video only
// Place your file at: public/videos/campaign.mp4
export const editorialVideo: EditorialVideo = {
  src: "/videos/campaign.mp4",
  fallbackSrc: "https://assets.mixkit.co/videos/4832/4832-720.mp4",
  alt: "Luxury fashion campaign film",
};

// Full-width architectural campaign
export const architecturalCampaign: CampaignData = {
  image: {
    src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1800&h=800&fit=crop",
    alt: "Architectural interior with models - luxury campaign",
  },
};

// Brand story
export const brandStory = {
  headline: "A WARDROBE DISTILLED TO ITS MOST ESSENTIAL FORMS.",
  body: `For generations, our family has believed that true luxury lies not in excess, but in reduction. Each piece in the COGNISINS collection represents the culmination of countless hours of refinement — eliminating everything superfluous until only the essential remains. Crafted in our atelier in Florence, every garment is a dialogue between tradition and the contemporary, between the hand and the machine, between restraint and expression.`,
  signature: "The House of COGNISINS, Est. 1904",
  yearsOfCraft: "120",
  yearsLabel: "YEARS OF CRAFT",
};

// Collections
const allProducts = [
  ...shirtProducts,
  ...trousersProducts,
  ...poloShirtProducts,
];

export const products = allProducts;

export const collections: ShopifyCollection[] = [
  {
    id: "gid://shopify/Collection/1",
    title: "Shirts",
    handle: "shirts",
    description: "Premium Shirts Collection",
    products: allProducts.filter(
      (p) => p.productType === "Shirts" || p.tags.includes("shirts"),
    ),
  },
  {
    id: "gid://shopify/Collection/2",
    title: "Trousers",
    handle: "trousers",
    description: "Premium Trousers Collection",
    products: allProducts.filter((p) => p.tags.includes("trousers")),
  },
  {
    id: "gid://shopify/Collection/3",
    title: "Polo Shirts",
    handle: "polo-shirts",
    description: "Premium Polo Shirts Collection",
    products: allProducts.filter(
      (p) => p.productType === "Polos" || p.tags.includes("polos"),
    ),
  },
  {
    id: "gid://shopify/Collection/4",
    title: "Cotton",
    handle: "cotton",
    description: "Premium Cotton Collection",
    products: allProducts.filter((p) => p.tags.includes("cotton")),
  },
  {
    id: "gid://shopify/Collection/5",
    title: "Linen",
    handle: "linen",
    description: "Premium Linen Collection",
    products: allProducts.filter((p) => p.tags.includes("linen")),
  },
  {
    id: "gid://shopify/Collection/6",
    title: "Linen Blend",
    handle: "linen-blend",
    description: "Premium Linen Blend Collection",
    products: allProducts.filter((p) => p.tags.includes("linen-blend")),
  },
];

export const getCollectionByHandle = (handle: string): ShopifyCollection => {
  const collection = collections.find((c) => c.handle === handle);
  return (
    collection || {
      id: "",
      title: "Not Found",
      handle: "",
      description: "",
      products: [],
    }
  );
};

export const getProductByHandle = (
  handle: string,
): (typeof allProducts)[0] | undefined => {
  return allProducts.find((p) => p.handle === handle);
};

// Footer data
export const footerLinks = {
  collection: [
    { label: "New Arrivals", href: "/new" },
    { label: "Shirts", href: "/collections/shirts" },
    { label: "Trousers", href: "/collections/trousers" },
    { label: "Knitwear", href: "/knitwear" },
    { label: "Accessories", href: "/accessories" },
  ],
  company: [
    { label: "Our Story", href: "/story" },
    { label: "Ateliers", href: "/ateliers" },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Careers", href: "/careers" },
  ],
  support: [
    { label: "Shipping", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "Contact", href: "/contact" },
  ],
};
