import { useNavigate } from "react-router-dom";

interface MobileMenuProps {
  isOpen: boolean;
  onNavigate?: () => void;
}

const sections = [
  {
    heading: "Shop",
    links: [
      { label: "Men", to: "/men/view-all" },
      { label: "Women", to: "/women" },
      { label: "Fabric", to: "/fabric" },
    ],
  },
  {
    heading: "Customer Care",
    links: [
      { label: "Contact Us", to: "/contact" },
      { label: "FAQs", to: "/faqs" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "About Us", to: "/about" },
    ],
  },
];

const MobileMenu = ({ isOpen, onNavigate }: MobileMenuProps) => {
  const navigate = useNavigate();

  const handleClick = (to: string) => {
    navigate(to);
    onNavigate?.();
  };

  return (
    <div
      className={`md:hidden fixed inset-0 z-100 top-[68px] bg-[#FFF6ED] overflow-y-auto transition-all duration-400 ease-out ${
        isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
      style={{
        willChange: "transform, opacity",
        pointerEvents: isOpen ? "auto" : "none",
      }}
    >
      <div className="px-6 pt-8 pb-12">
        {sections.map((section) => (
          <div key={section.heading} className="mb-8">
            <h3 className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#65220e] font-semibold pb-1.5 border-b border-[#65220e]/40 inline-block">
              {section.heading}
            </h3>
            <ul className="mt-4 space-y-3">
              {section.links.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleClick(link.to)}
                    className="font-sans text-[15px] text-[#3d3929] hover:text-[#65220e] transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;
