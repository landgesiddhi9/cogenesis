import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

type Category = "men" | "women" | "fabric";

interface MenuLink {
  label: string;
  to: string;
  image: string;
}

interface MegaMenuPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: Category;
}

const CATEGORIES: { key: Category; label: string }[] = [
  { key: "men", label: "MEN" },
  { key: "women", label: "WOMEN" },
  { key: "fabric", label: "FABRIC" },
];

const LINKS: Record<Category, MenuLink[]> = {
  men: [
    { label: "Shirts", to: "/collections/shirts", image: "/images/shirts dropdown.jpg" },
    { label: "Trousers", to: "/collections/trousers", image: "/images/trouser dropdown.jpg" },
    { label: "Best Sellers", to: "/men/best-sellers", image: "/images/male model 2 .jpg" },
    { label: "View All", to: "/men/view-all", image: "/images/male model .jpg" },
  ],
  women: [
    { label: "Launching Soon", to: "/women", image: "/images/female model.jpg" },
  ],
  fabric: [
    { label: "Linen", to: "/collections/linen", image: "/images/fabric drop down.jpg" },
    { label: "Linen Blend", to: "/collections/linen-blend", image: "/images/fabric2 dropdown.jpg" },
    { label: "Care Guide", to: "/fabric/care-guide", image: "/images/fabric drop down.jpg" },
    { label: "Fabric Guide", to: "/fabric/guide", image: "/images/fabric2 dropdown.jpg" },
  ],
};

const DEFAULT_IMAGES: Record<Category, string> = {
  men: "/images/male model .jpg",
  women: "/images/female model.jpg",
  fabric: "/images/fabric drop down.jpg",
};

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_LUXURY = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

const DURATION = 400;
const IMAGE_FADE_DURATION = 280;

const MegaMenuPanel = ({ isOpen, onClose, activeCategory }: MegaMenuPanelProps) => {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState(DEFAULT_IMAGES[activeCategory]);
  const [prevPreviewImage, setPrevPreviewImage] = useState<string | null>(null);
  const [imageFading, setImageFading] = useState(false);
  const imageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const displayCategory = hoveredCategory ?? activeCategory;

  useEffect(() => {
    const allImages = Object.values(LINKS).flat().map((l) => l.image);
    const defaults = Object.values(DEFAULT_IMAGES);
    [...allImages, ...defaults].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const switchImage = (src: string) => {
    if (src === previewImage) return;
    if (imageTimerRef.current) clearTimeout(imageTimerRef.current);
    setPrevPreviewImage(previewImage);
    setPreviewImage(src);
    imageTimerRef.current = setTimeout(() => {
      setPrevPreviewImage(null);
      setImageFading(false);
    }, IMAGE_FADE_DURATION);
    requestAnimationFrame(() => setImageFading(true));
  };

  const handleLinkHover = (link: MenuLink) => {
    setHoveredLink(link.label);
    switchImage(link.image);
  };

  const handleCategoryEnter = (cat: Category) => {
    setHoveredCategory(cat);
    setHoveredLink(null);
    if (imageTimerRef.current) clearTimeout(imageTimerRef.current);
    setPrevPreviewImage(previewImage);
    setPreviewImage(DEFAULT_IMAGES[cat]);
    requestAnimationFrame(() => setImageFading(true));
    imageTimerRef.current = setTimeout(() => {
      setPrevPreviewImage(null);
      setImageFading(false);
    }, IMAGE_FADE_DURATION);
  };

  const handleLeave = () => {
    setHoveredCategory(null);
    setHoveredLink(null);
  };

  return (
    <div className="flex justify-center w-full">
      <div
        className="w-full mb-6 bg-[#FAF8F4] rounded-b-2xl shadow-2xl overflow-hidden"
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen
            ? "translateY(0) scale(1)"
            : "translateY(-12px) scale(0.98)",
          transition: `opacity ${DURATION}ms ${EASE_LUXURY}, transform ${DURATION}ms ${EASE_LUXURY}`,
          willChange: "transform, opacity",
        }}
      >
        <div className="relative px-6 md:px-12 lg:px-14 py-6 md:py-8 lg:py-10">
          {/* Content grid */}
          <div className="grid grid-cols-[1fr_1fr_1fr_1.6fr] gap-12 md:gap-16 lg:gap-20">
            {/* Text columns */}
            {CATEGORIES.map((cat) => {
              const isActiveCategory = displayCategory === cat.key;
              return (
                <div
                  key={cat.key}
                  className="flex flex-col"
                  onMouseEnter={() => handleCategoryEnter(cat.key)}
                  onMouseLeave={handleLeave}
                >
                  <h3
                    className={`font-serif text-[15px] md:text-[20px] font-medium tracking-[0.22em] uppercase mb-6 pb-4 border-b transition-colors duration-200 ${
                      isActiveCategory
                        ? "text-[#4A2E2A] border-[#4A2E2A]/30"
                        : "text-[#4A2E2A]/50 border-[#4A2E2A]/10"
                    }`}
                    style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
                  >
                    {cat.label}
                  </h3>
                  <div className="flex flex-col">
                    {LINKS[cat.key].map((link) => {
                      const isHovered = hoveredLink === link.label && hoveredCategory === cat.key;
                      return (
                        <button
                          key={link.label}
                          onClick={() => {
                            navigate(link.to);
                            onClose();
                          }}
                          onMouseEnter={() => handleLinkHover(link)}
                          className={`group text-left w-full transition-all duration-250 ${
                            isHovered
                              ? "bg-[#EDE4D6]/40 translate-x-0.5"
                              : "hover:bg-[#EDE4D6]/40 hover:translate-x-0.5"
                          }`}
                          style={{ padding: "4px 8px", margin: "0 -8px", borderRadius: "4px" }}
                        >
                          <span
                            className={`font-serif text-[15px] md:text-[18px] leading-[2] md:leading-[2.5] transition-all duration-250 ${
                              isHovered
                                ? "text-[#4A2E2A]"
                                : "text-[#6B5C53]/80 group-hover:text-[#4A2E2A]"
                            }`}
                            style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
                          >
                            {link.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Featured image */}
            <div className="relative aspect-[3/4] md:aspect-[4/5] rounded-lg overflow-hidden bg-[#EDE4D6]">
              {prevPreviewImage && imageFading && (
                <img
                  src={prevPreviewImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    opacity: imageFading ? 0 : 1,
                    transition: `opacity ${IMAGE_FADE_DURATION}ms ${EASE}`,
                  }}
                />
              )}
              {previewImage && (
                <img
                  src={previewImage}
                  alt={displayCategory}
                  className="w-full h-full object-cover"
                  style={{
                    opacity: prevPreviewImage && imageFading ? 1 : 1,
                    transition: `opacity ${IMAGE_FADE_DURATION}ms ${EASE}, transform ${IMAGE_FADE_DURATION}ms ${EASE}`,
                    transform: imageFading ? "scale(1)" : "scale(1.03)",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenuPanel;
