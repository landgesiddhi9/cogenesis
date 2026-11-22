import type {
  EditorialImage,
  EditorialVideo,
  CampaignData,
} from "../types";

// Hero
export const heroImage: EditorialImage = {
  src: "/images/Hero Banner Cogenesis.jpg",
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
    src: "/images/letter image.png",
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
