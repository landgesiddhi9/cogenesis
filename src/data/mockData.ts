import type {
  EditorialImage,
  EditorialVideo,
  CampaignData,
  Order,
  ReturnRequest,
} from "../types";

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

// Brand story
export const brandStory = {
  headline: "A WARDROBE DISTILLED TO ITS MOST ESSENTIAL FORMS.",
  body: `For generations, our family has believed that true luxury lies not in excess, but in reduction. Each piece in the COGNISINS collection represents the culmination of countless hours of refinement — eliminating everything superfluous until only the essential remains. Crafted in our atelier in Florence, every garment is a dialogue between tradition and the contemporary, between the hand and the machine, between restraint and expression.`,
  signature: "The House of COGNISINS, Est. 1904",
  yearsOfCraft: "120",
  yearsLabel: "YEARS OF CRAFT",
};

export const mockOrders: Order[] = [
  {
    id: "COG-1024",
    orderDate: "2026-06-15",
    total: 9297,
    status: "delivered",
    items: [
      {
        productId: "gid://shopify/Product/1",
        title: "White Linen Shirt",
        price: 2999,
        image: "https://images.unsplash.com/photo-1596215578519-47ac5beb46b7?w=200&h=250&fit=crop&crop=top",
        imageAlt: "White Linen Shirt",
        size: "M",
        quantity: 1,
      },
      {
        productId: "gid://shopify/Product/102",
        title: "Milano Tailored Trouser",
        price: 3499,
        image: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=200&h=250&fit=crop&crop=top",
        imageAlt: "Milano Tailored Trouser",
        size: "L",
        quantity: 1,
      },
      {
        productId: "gid://shopify/Product/201",
        title: "Riviera Polo",
        price: 2799,
        image: "https://images.unsplash.com/photo-1578504494785-2ff8d48a4f38?w=200&h=250&fit=crop&crop=top",
        imageAlt: "Riviera Polo",
        size: "M",
        quantity: 1,
      },
    ],
  },
  {
    id: "COG-1023",
    orderDate: "2026-05-28",
    total: 6398,
    status: "shipped",
    items: [
      {
        productId: "gid://shopify/Product/4",
        title: "White Oxford Shirt",
        price: 3199,
        image: "https://images.unsplash.com/photo-1596215578519-47ac5beb46b7?w=200&h=250&fit=crop&crop=top",
        imageAlt: "White Oxford Shirt",
        size: "S",
        quantity: 2,
      },
    ],
  },
  {
    id: "COG-1022",
    orderDate: "2026-04-10",
    total: 2899,
    status: "processing",
    items: [
      {
        productId: "gid://shopify/Product/14",
        title: "The Amalfi Knit",
        price: 2899,
        image: "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=200&h=250&fit=crop&crop=top",
        imageAlt: "The Amalfi Knit",
        size: "XL",
        quantity: 1,
      },
    ],
  },
  {
    id: "COG-1021",
    orderDate: "2026-02-20",
    total: 5498,
    status: "cancelled",
    items: [
      {
        productId: "gid://shopify/Product/6",
        title: "Sage Green Linen Shirt",
        price: 3499,
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=250&fit=crop&crop=top",
        imageAlt: "Sage Green Linen Shirt",
        size: "L",
        quantity: 1,
      },
      {
        productId: "gid://shopify/Product/103",
        title: "Capri Cotton Trouser",
        price: 1999,
        image: "https://images.unsplash.com/photo-1624378439385-7520369cfb0d?w=200&h=250&fit=crop&crop=top",
        imageAlt: "Capri Cotton Trouser",
        size: "M",
        quantity: 1,
      },
    ],
  },
];

export const mockReturns: ReturnRequest[] = [
  {
    id: "RET-001",
    orderId: "COG-1024",
    orderDate: "2026-06-15",
    total: 2999,
    reason: "Size不合适 — item too large",
    status: "approved",
    pickupDate: "2026-06-22",
    items: [
      {
        productId: "gid://shopify/Product/1",
        title: "White Linen Shirt",
        price: 2999,
        image: "https://images.unsplash.com/photo-1596215578519-47ac5beb46b7?w=200&h=250&fit=crop&crop=top",
        imageAlt: "White Linen Shirt",
        size: "M",
        quantity: 1,
      },
    ],
  },
  {
    id: "RET-002",
    orderId: "COG-1022",
    orderDate: "2026-04-10",
    total: 2899,
    reason: "Changed mind — no longer needed",
    status: "refunded",
    refundDate: "2026-04-22",
    items: [
      {
        productId: "gid://shopify/Product/14",
        title: "The Amalfi Knit",
        price: 2899,
        image: "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=200&h=250&fit=crop&crop=top",
        imageAlt: "The Amalfi Knit",
        size: "XL",
        quantity: 1,
      },
    ],
  },
  {
    id: "RET-003",
    orderId: "COG-1021",
    orderDate: "2026-02-20",
    total: 1999,
    reason: "Defective — stitching came loose",
    status: "pending",
    items: [
      {
        productId: "gid://shopify/Product/103",
        title: "Capri Cotton Trouser",
        price: 1999,
        image: "https://images.unsplash.com/photo-1624378439385-7520369cfb0d?w=200&h=250&fit=crop&crop=top",
        imageAlt: "Capri Cotton Trouser",
        size: "M",
        quantity: 1,
      },
    ],
  },
];
