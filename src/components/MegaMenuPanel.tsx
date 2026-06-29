import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type ActiveColumn = "men" | "women" | "fabric" | null;

interface MegaMenuPanelProps {
  onNavigate?: () => void;
  isOpen?: boolean;
}

const submenus = {
  men: [
    { label: "Shirts", image: "/images/shirts dropdown.jpg", to: "/collections/shirts" },
    { label: "Trousers", image: "/images/trouser dropdown.jpg", to: "/collections/trousers" },
    { label: "Best Sellers", image: "/images/male model 2 .jpg", to: "/men/best-sellers" },
    { label: "View All", image: "/images/male model 2 .jpg", to: "/men/view-all" },
  ],
  women: [
    { label: "Launching Soon", image: "/images/female model.jpg", to: "/women" },
  ],
  fabric: [
    { label: "Linen", image: "/images/fabric drop down.jpg", to: "/collections/linen" },
    { label: "Linen Blend", image: "/images/fabric2 dropdown.jpg", to: "/collections/linen-blend" },
    { label: "Care Guide", image: "/images/fabric drop down.jpg", to: "/fabric/care-guide" },
    { label: "Fabric Guide", image: "/images/fabric2 dropdown.jpg", to: "/fabric/guide" },
  ],
};

const defaultImages = {
  men: "/images/male model .jpg",
  women: "/images/female model.jpg",
  fabric: "/images/fabric drop down.jpg",
};

function useImageCrossfade(defaultSrc: string) {
  const [displayedImage, setDisplayedImage] = useState(defaultSrc);
  const [prevImage, setPrevImage] = useState<string | null>(null);
  const [fading, setFading] = useState(false);
  const cleanupRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeRef = useRef<number | null>(null);

  const switchImage = (newSrc: string) => {
    if (newSrc === displayedImage) return;
    if (cleanupRef.current) clearTimeout(cleanupRef.current);
    if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
    setPrevImage(displayedImage);
    setDisplayedImage(newSrc);
    fadeRef.current = requestAnimationFrame(() => {
      setFading(true);
    });
    cleanupRef.current = setTimeout(() => {
      setPrevImage(null);
      setFading(false);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (cleanupRef.current) clearTimeout(cleanupRef.current);
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
    };
  }, []);

  return { displayedImage, prevImage, fading, switchImage };
}

const headingAnimationStyle = (isOpen: boolean) => ({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0)' : 'translateY(15px)',
    transition: 'opacity 500ms cubic-bezier(0.22, 1, 0.36, 1), transform 500ms cubic-bezier(0.22, 1, 0.36, 1)',
    transitionDelay: isOpen ? '80ms' : '0ms',
    willChange: 'transform, opacity',
  });

  const imageAnimationStyle = (isOpen: boolean) => ({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0)' : 'translateY(15px)',
    transition: 'opacity 500ms cubic-bezier(0.22, 1, 0.36, 1), transform 500ms cubic-bezier(0.22, 1, 0.36, 1)',
    transitionDelay: isOpen ? '200ms' : '0ms',
    willChange: 'transform, opacity',
  });

  const submenuAnimationStyle = (isOpen: boolean) => ({
    opacity: isOpen ? 1 : 0,
    transition: 'opacity 400ms cubic-bezier(0.22, 1, 0.36, 1)',
    transitionDelay: isOpen ? '280ms' : '0ms',
    willChange: 'opacity',
  });

  const MegaMenuPanel = ({ onNavigate, isOpen = false }: MegaMenuPanelProps) => {
  const navigate = useNavigate();
  const [activeColumn, setActiveColumn] = useState<ActiveColumn>(null);

  useEffect(() => {
    const urls = Object.values(submenus).flat().map((item) => item.image);
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  const men = useImageCrossfade(defaultImages.men);
  const women = useImageCrossfade(defaultImages.women);
  const fabric = useImageCrossfade(defaultImages.fabric);

  const getOpacity = (column: ActiveColumn) => {
    if (activeColumn === null) return "opacity-100";
    return activeColumn === column ? "opacity-100" : "opacity-[0.55]";
  };

  const handleSubcategoryHover = (column: ActiveColumn, image: string) => {
    if (!column) return;
    const img = column === "men" ? men : column === "women" ? women : fabric;
    img.switchImage(image);
  };

  const renderImage = (
    img: ReturnType<typeof useImageCrossfade>,
    isActive: boolean,
  ) => (
    <div className="absolute inset-0 overflow-hidden rounded-[2px]">
      <div className="relative w-full h-full">
        {img.prevImage && (
          <img
            src={img.prevImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            style={{
              opacity: img.fading ? 0 : 1,
              transform: img.fading ? "scale(1) translateY(-20px)" : "scale(1.02) translateY(-20px)",
              transition: "opacity 300ms ease-in-out, transform 300ms ease-in-out",
              willChange: "opacity, transform",
            }}
          />
        )}
        <img
          src={img.displayedImage}
          alt=""
          className="w-full h-full object-cover object-center"
          style={{
            opacity: img.prevImage ? (img.fading ? 1 : 0) : 1,
            transform: isActive
              ? "scale(0.72) translateY(-12px)"
              : "scale(1) translateY(-20px)",
            transformOrigin: "top center",
            willChange: "transform, opacity",
            transition: "opacity 300ms ease-in-out, transform 400ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </div>
    </div>
  );

  const renderSubmenu = (
    column: ActiveColumn,
    items: { label: string; image: string; to: string }[],
    isActive: boolean,
  ) => (
    <div
      className={`absolute left-0 right-0 ${
        isActive ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{
        top: "calc(72% - 17px)",
        opacity: isActive ? 1 : 0,
        transition: "opacity 250ms cubic-bezier(0.22, 1, 0.36, 1)",
        ...submenuAnimationStyle(isOpen),
      }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFF6ED] via-[#FFF6ED]/60 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center py-4 gap-[5px]">
          {items.map((item) => (
            <button
              key={item.label}
              className="font-display text-[18.5px] font-normal leading-[1.7] text-[#4A2E2A] hover:underline transition-all duration-200"
              onMouseEnter={() => handleSubcategoryHover(column, item.image)}
              onClick={() => {
                navigate(item.to);
                onNavigate?.();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-[#FFF6ED] h-[605px] overflow-hidden">
      <div className="max-w-[1400px] mx-auto pt-[40px] px-[64px] pb-[24px]">
        <div className="grid grid-cols-3 gap-16 items-start">
          {/* MEN */}
          <div
            className={`flex flex-col items-center transition-opacity duration-250 ease-out ${getOpacity("men")}`}
            onMouseEnter={() => setActiveColumn("men")}
            onMouseLeave={() => setActiveColumn(null)}
          >
            <h2 className="mb-[44px]" style={headingAnimationStyle(isOpen)}>
              <span className="inline-block border-b border-[#4A2E2A] pb-[1px] font-display text-[24px] font-normal tracking-[0.18em] text-[#4A2E2A] uppercase leading-none ">
                MEN
              </span>
            </h2>
            <div className="w-full aspect-[4/5] relative" style={imageAnimationStyle(isOpen)}>
              {renderImage(men, activeColumn === "men")}
              {activeColumn === "men" && renderSubmenu("men", submenus.men, true)}
            </div>
          </div>

          {/* WOMEN */}
          <div
            className={`flex flex-col items-center transition-opacity duration-250 ease-out ${getOpacity("women")}`}
            onMouseEnter={() => setActiveColumn("women")}
            onMouseLeave={() => setActiveColumn(null)}
          >
            <h2 className="mb-[44px]" style={headingAnimationStyle(isOpen)}>
              <span className="inline-block border-b border-[#4A2E2A] pb-[1px] font-display text-[24px] font-normal tracking-[0.18em] text-[#4A2E2A] uppercase leading-none ">
                WOMEN
              </span>
            </h2>
            <div className="w-full aspect-[4/5] relative" style={imageAnimationStyle(isOpen)}>
              {renderImage(women, activeColumn === "women")}
              {activeColumn === "women" && renderSubmenu("women", submenus.women, true)}
            </div>
          </div>

          {/* FABRIC */}
          <div
            className={`flex flex-col items-center transition-opacity duration-250 ease-out ${getOpacity("fabric")}`}
            onMouseEnter={() => setActiveColumn("fabric")}
            onMouseLeave={() => setActiveColumn(null)}
          >
            <h2 className="mb-[44px]" style={headingAnimationStyle(isOpen)}>
              <span className="inline-block border-b border-[#4A2E2A] pb-[1px] font-display text-[24px] font-normal tracking-[0.18em] text-[#4A2E2A] uppercase leading-none ">
                FABRIC
              </span>
            </h2>
            <div className="w-full aspect-[4/5] relative" style={imageAnimationStyle(isOpen)}>
              {renderImage(fabric, activeColumn === "fabric")}
              {activeColumn === "fabric" && renderSubmenu("fabric", submenus.fabric, true)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenuPanel;
