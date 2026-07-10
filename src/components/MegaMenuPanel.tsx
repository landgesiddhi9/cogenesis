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
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (cleanupRef.current) clearTimeout(cleanupRef.current);
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
    };
  }, []);

  return { displayedImage, prevImage, fading, switchImage };
}

// ---- Unified animation timing ----
// Same duration + easing + delay whether opening or closing.
// Only the delay differs BETWEEN sections (heading -> image -> submenu),
// never between open/close of the SAME section. This is what makes
// closing feel like a mirror of opening instead of a different animation.
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const DURATION = 600;

const headingAnimationStyle = (isOpen: boolean) => ({
  opacity: isOpen ? 1 : 0,
  transform: isOpen ? "translateY(0)" : "translateY(6px)",
  transition: `opacity ${DURATION}ms ${EASE}, transform ${DURATION}ms ${EASE}`,
  transitionDelay: "100ms",
  willChange: "transform, opacity",
});

const imageAnimationStyle = (isOpen: boolean) => ({
  opacity: isOpen ? 1 : 0,
  transform: isOpen ? "scale(1)" : "scale(0.98)",
  transition: `opacity ${DURATION}ms ${EASE}, transform ${DURATION}ms ${EASE}`,
  transitionDelay: "200ms",
  willChange: "transform, opacity",
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
    return activeColumn === column ? "opacity-100" : "opacity-[0.65]";
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
              transition: `opacity ${DURATION}ms ${EASE}, transform ${DURATION}ms ${EASE}`,
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
            transition: `opacity ${DURATION}ms ${EASE}, transform ${DURATION}ms ${EASE}`,
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
      className={`absolute left-0 right-0 ${isActive ? "pointer-events-auto" : "pointer-events-none"
        }`}
      style={{
        top: "calc(72% - 17px)",
        opacity: isActive && isOpen ? 1 : 0,
        transform:
          isActive && isOpen
            ? "translateY(0) scale(1)"
            : "translateY(8px) scale(0.98)",
        transition: `opacity ${DURATION}ms ${EASE}, transform ${DURATION}ms ${EASE}`,
        willChange: "opacity, transform",
      }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFF6ED] via-[#FFF6ED]/60 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center py-4 gap-[5px]">
          {items.map((item) => (
            <button
              key={item.label}
              className="mega-sub-link font-display text-[18.5px] font-normal leading-[1.7] text-[#4A2E2A]"
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
      <style>{`
        .mega-heading-line {
          position: relative;
          display: inline-block;
        }
        .mega-heading-line::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 100%;
          height: 1.5px;
          background-color: #4A2E2A;
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform ${DURATION}ms ${EASE} 100ms;
        }
        .mega-heading-line.is-open::after {
          transform: scaleX(1);
        }
        .mega-sub-link {
          position: relative;
          transition: color 300ms ${EASE}, transform 300ms ${EASE};
        }
        .mega-sub-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: #4A2E2A;
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 300ms ${EASE};
        }
        .mega-sub-link:hover::after {
          transform: scaleX(1);
        }
        .mega-sub-link:hover {
          transform: translateX(3px);
        }
      `}</style>
      <div className="max-w-[1400px] mx-auto pt-[40px] px-[64px] pb-[24px]">
        <div className="grid grid-cols-3 gap-16 items-start">
          {/* MEN */}
          <div
            className={`flex flex-col items-center ${getOpacity("men")}`}
            onMouseEnter={() => setActiveColumn("men")}
            onMouseLeave={() => setActiveColumn(null)}
            style={{ transition: `opacity 300ms ${EASE}` }}
          >
            <h2 className="mb-[28px]" style={headingAnimationStyle(isOpen)}>
              <span
                className={`mega-heading-line${isOpen ? " is-open" : ""
                  } font-display text-[24px] font-normal tracking-[0.18em] text-[#4A2E2A] uppercase leading-none`}
              >
                MEN
              </span>
            </h2>
            <div className="w-full aspect-[4/5] relative" style={imageAnimationStyle(isOpen)}>
              {renderImage(men, activeColumn === "men")}
              {renderSubmenu("men", submenus.men, activeColumn === "men")}
            </div>
          </div>

          {/* WOMEN */}
          <div
            className={`flex flex-col items-center ${getOpacity("women")}`}
            onMouseEnter={() => setActiveColumn("women")}
            onMouseLeave={() => setActiveColumn(null)}
            style={{ transition: `opacity 300ms ${EASE}` }}
          >
            <h2 className="mb-[28px]" style={headingAnimationStyle(isOpen)}>
              <span
                className={`mega-heading-line${isOpen ? " is-open" : ""
                  } font-display text-[24px] font-normal tracking-[0.18em] text-[#4A2E2A] uppercase leading-none`}
              >
                WOMEN
              </span>
            </h2>
            <div className="w-full aspect-[4/5] relative" style={imageAnimationStyle(isOpen)}>
              {renderImage(women, activeColumn === "women")}
              {renderSubmenu("women", submenus.women, activeColumn === "women")}
            </div>
          </div>

          {/* FABRIC */}
          <div
            className={`flex flex-col items-center ${getOpacity("fabric")}`}
            onMouseEnter={() => setActiveColumn("fabric")}
            onMouseLeave={() => setActiveColumn(null)}
            style={{ transition: `opacity 300ms ${EASE}` }}
          >
            <h2 className="mb-[28px]" style={headingAnimationStyle(isOpen)}>
              <span
                className={`mega-heading-line${isOpen ? " is-open" : ""
                  } font-display text-[24px] font-normal tracking-[0.18em] text-[#4A2E2A] uppercase leading-none`}
              >
                FABRIC
              </span>
            </h2>
            <div className="w-full aspect-[4/5] relative" style={imageAnimationStyle(isOpen)}>
              {renderImage(fabric, activeColumn === "fabric")}
              {renderSubmenu("fabric", submenus.fabric, activeColumn === "fabric")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenuPanel;
