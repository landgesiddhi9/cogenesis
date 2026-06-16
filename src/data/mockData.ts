import type {
  NavLink,
  EditorialImage,
  EditorialVideo,
  ShopifyProduct,
  CampaignData,
} from '../types';

// Navigation
export const navLinks: NavLink[] = [
  { label: 'Men', href: '/men' },
  { label: 'Women', href: '/women' },
  { label: 'Fabric', href: '/fabric' },
];

// Hero
export const heroImage: EditorialImage = {
  src: '/images/hero.png',
  alt: 'Model wearing white linen shirt and cream trousers - Spring/Summer Collection',
};

// Editorial Grid
export const editorialImages: EditorialImage[] = [
  {
    src: '/images/collar-detail.png',
    alt: 'White shirt collar detail showing premium craftsmanship',
  },
  {
    src: '/images/packaging.png',
    alt: 'Luxury brand packaging in cream and gold',
    caption: 'TIMELESS',
    subcaption: 'Distinction in detail',
  },
];

// Product strip - uses Unsplash for remaining images since we have 3 generated + need more
export const productStripItems: ShopifyProduct[] = [
  {
    id: 'gid://shopify/Product/1',
    title: 'The Riviera Shirt',
    handle: 'riviera-shirt',
    description: 'Woven stripe cotton shirt in blue and white',
    productType: 'Shirts',
    tags: ['shirts', 'cotton', 'stripe'],
    vendor: 'COGNISINS',
    featuredImage: {
      id: 'img-1',
      url: '/images/product-1.png',
      altText: 'Blue and white striped shirt',
    },
    images: [],
    variants: [
      {
        id: 'var-1',
        title: 'M',
        price: { amount: '285.00', currencyCode: 'EUR' },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: '285.00', currencyCode: 'EUR' },
      maxVariantPrice: { amount: '285.00', currencyCode: 'EUR' },
    },
  },
  {
    id: 'gid://shopify/Product/2',
    title: 'The Polo Classico',
    handle: 'polo-classico',
    description: 'Navy blue polo in mercerized cotton',
    productType: 'Polos',
    tags: ['polos', 'cotton', 'navy'],
    vendor: 'COGNISINS',
    featuredImage: {
      id: 'img-2',
      url: '/images/product-2.png',
      altText: 'Navy blue polo shirt',
    },
    images: [],
    variants: [
      {
        id: 'var-2',
        title: 'M',
        price: { amount: '195.00', currencyCode: 'EUR' },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: '195.00', currencyCode: 'EUR' },
      maxVariantPrice: { amount: '195.00', currencyCode: 'EUR' },
    },
  },
  {
    id: 'gid://shopify/Product/3',
    title: 'The Royal Oxford',
    handle: 'royal-oxford',
    description: 'Royal blue button-down oxford shirt',
    productType: 'Shirts',
    tags: ['shirts', 'oxford', 'blue'],
    vendor: 'COGNISINS',
    featuredImage: {
      id: 'img-3',
      url: '/images/product-3.png',
      altText: 'Royal blue oxford shirt',
    },
    images: [],
    variants: [
      {
        id: 'var-3',
        title: 'M',
        price: { amount: '265.00', currencyCode: 'EUR' },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: '265.00', currencyCode: 'EUR' },
      maxVariantPrice: { amount: '265.00', currencyCode: 'EUR' },
    },
  },
  {
    id: 'gid://shopify/Product/4',
    title: 'The Safari Linen',
    handle: 'safari-linen',
    description: 'Olive green linen camp collar shirt',
    productType: 'Shirts',
    tags: ['shirts', 'linen', 'olive'],
    vendor: 'COGNISINS',
    featuredImage: {
      id: 'img-4',
      url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=750&fit=crop&crop=top',
      altText: 'Olive green linen shirt',
    },
    images: [],
    variants: [
      {
        id: 'var-4',
        title: 'M',
        price: { amount: '310.00', currencyCode: 'EUR' },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: '310.00', currencyCode: 'EUR' },
      maxVariantPrice: { amount: '310.00', currencyCode: 'EUR' },
    },
  },
  {
    id: 'gid://shopify/Product/5',
    title: 'The Amalfi Knit',
    handle: 'amalfi-knit',
    description: 'Cream knitted cotton polo',
    productType: 'Polos',
    tags: ['polos', 'knit', 'cream'],
    vendor: 'COGNISINS',
    featuredImage: {
      id: 'img-5',
      url: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=600&h=750&fit=crop&crop=top',
      altText: 'Cream knitted polo',
    },
    images: [],
    variants: [
      {
        id: 'var-5',
        title: 'M',
        price: { amount: '225.00', currencyCode: 'EUR' },
        availableForSale: true,
      },
    ],
    priceRange: {
      minVariantPrice: { amount: '225.00', currencyCode: 'EUR' },
      maxVariantPrice: { amount: '225.00', currencyCode: 'EUR' },
    },
  },
];

// Campaign
export const campaignData: CampaignData = {
  video: '/videos/cinemagraph-eu.webm',
  title: 'Summer of Light',
  subtitle: 'The new collection',
};

// Full-screen triple video panels — flush below full-screen campaign film
export const aboutTripleVideo = {
  src: '/videos/aboutcg1.mp4',
  offsets: [0, 2, 4],
};

// Full-screen brand story split — flush below triple video section
export const brandStoryPanel = {
  headlineLines: [
    'A WARDROBE',
    'DISTILLED TO ITS',
    'MOST ESSENTIAL',
    'FORMS.',
  ],
  paragraphs: [
    'Cogenesis began with a quiet observation — that the modern wardrobe had grown noisier than the lives it served. We set out to make fewer pieces, more carefully.',
    'Each shirt and trouser is developed across months of fabric study, draping and small-batch production, finished by hand in our atelier.',
  ],
  image: {
    src: '/images/letterimg.png',
    alt: 'White-gloved hand holding a sealed Cogenesis letter on burgundy',
  },
};

// Gallery section images
export const galleryImages: EditorialImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop',
    alt: 'Editorial portrait - close up fashion shot',
  },
  {
    src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=600&fit=crop',
    alt: 'Male model in white shirt, editorial fashion',
  },
  {
    src: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=1000&fit=crop',
    alt: 'Man in dark suit, luxury fashion editorial',
  },
  {
    src: 'https://images.unsplash.com/photo-1492288991661-058aa541e4bc?w=800&h=600&fit=crop',
    alt: 'Fashion accessories detail shot',
  },
  {
    src: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=800&h=1200&fit=crop',
    alt: 'Couple walking in archway, editorial fashion',
  },
  {
    src: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&h=600&fit=crop',
    alt: 'Man looking away, fashion editorial',
  },
];

// Full-screen luxury campaign film — flush below gallery, video only
// Place your file at: public/videos/campaign.mp4
export const editorialVideo: EditorialVideo = {
  src: '/videos/campaign.mp4',
  fallbackSrc: 'https://assets.mixkit.co/videos/4832/4832-720.mp4',
  alt: 'Luxury fashion campaign film',
};

// Full-width architectural campaign
export const architecturalCampaign: CampaignData = {
  image: {
    src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1800&h=800&fit=crop',
    alt: 'Architectural interior with models - luxury campaign',
  },
};

// Brand story
export const brandStory = {
  headline: 'A WARDROBE DISTILLED TO ITS MOST ESSENTIAL FORMS.',
  body: `For generations, our family has believed that true luxury lies not in excess, but in reduction. Each piece in the COGNISINS collection represents the culmination of countless hours of refinement — eliminating everything superfluous until only the essential remains. Crafted in our atelier in Florence, every garment is a dialogue between tradition and the contemporary, between the hand and the machine, between restraint and expression.`,
  signature: 'The House of COGNISINS, Est. 1904',
  yearsOfCraft: '120',
  yearsLabel: 'YEARS OF CRAFT',
};

// Footer data
export const footerLinks = {
  collection: [
    { label: 'New Arrivals', href: '/new' },
    { label: 'Shirts', href: '/shirts' },
    { label: 'Trousers', href: '/trousers' },
    { label: 'Knitwear', href: '/knitwear' },
    { label: 'Accessories', href: '/accessories' },
  ],
  company: [
    { label: 'Our Story', href: '/story' },
    { label: 'Ateliers', href: '/ateliers' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Careers', href: '/careers' },
  ],
  support: [
    { label: 'Shipping', href: '/shipping' },
    { label: 'Returns', href: '/returns' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'Contact', href: '/contact' },
  ],
};
