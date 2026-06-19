import { useState } from "react";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

const FilterAccordion = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-stone/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-stone/5 transition-colors"
      >
        <span className="text-sm font-medium text-charcoal tracking-wide">
          {title}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          <polyline points="5 6 8 9 11 6" />
        </svg>
      </button>

      {isOpen && <div className="px-6 py-4 bg-stone/2">{children}</div>}
    </div>
  );
};

const FilterPanel = ({ isOpen, onClose, onApply }: FilterPanelProps) => {
  const [filters, setFilters] = useState({
    size: [] as string[],
    material: [] as string[],
    color: [] as string[],
    price: [1500, 5000] as [number, number],
    fit: [] as string[],
  });

  const colors = [
    { name: "White", hex: "#FFFFFF" },
    { name: "Beige", hex: "#F5E6D3" },
    { name: "Stone", hex: "#D4C5B0" },
    { name: "Navy", hex: "#0F2847" },
    { name: "Olive", hex: "#6B7043" },
    { name: "Black", hex: "#1A1512" },
  ];

  const handleCheckboxChange = (
    category: "size" | "material" | "fit",
    value: string,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));
  };

  const handlePriceChange = (index: 0 | 1, value: number) => {
    const newPrice = [...filters.price] as [number, number];
    newPrice[index] = value;
    setFilters((prev) => ({ ...prev, price: newPrice }));
  };

  const handleClearAll = () => {
    setFilters({
      size: [],
      material: [],
      color: [],
      price: [255, 320],
      fit: [],
    });
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Filter Panel */}
      <div
        className={`fixed top-0 right-0 h-full bg-ivory border-l border-stone/10 shadow-xl transition-all duration-300 z-50 flex flex-col ${
          isOpen ? "w-full md:w-[400px]" : "w-0"
        } overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone/10">
          <h2 className="text-lg font-medium text-charcoal">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone/5 rounded-full transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className="flex-1 overflow-y-auto">
          {/* Size */}
          <FilterAccordion title="Size">
            <div className="space-y-3">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <label
                  key={size}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.size.includes(size)}
                    onChange={() => handleCheckboxChange("size", size)}
                    className="w-4 h-4 rounded border-stone/20 accent-warm-brown"
                  />
                  <span className="text-sm text-charcoal">{size}</span>
                </label>
              ))}
            </div>
          </FilterAccordion>

          {/* Material */}
          <FilterAccordion title="Material">
            <div className="space-y-3">
              {["Linen", "Cotton", "Cotton Linen Blend", "Premium Blend"].map(
                (mat) => (
                  <label
                    key={mat}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.material.includes(mat)}
                      onChange={() => handleCheckboxChange("material", mat)}
                      className="w-4 h-4 rounded border-stone/20 accent-warm-brown"
                    />
                    <span className="text-sm text-charcoal">{mat}</span>
                  </label>
                ),
              )}
            </div>
          </FilterAccordion>

          {/* Color */}
          <FilterAccordion title="Color">
            <div className="flex flex-wrap gap-4">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      color: prev.color.includes(color.name)
                        ? prev.color.filter((c) => c !== color.name)
                        : [...prev.color, color.name],
                    }))
                  }
                  className="flex flex-col items-center gap-2 group"
                >
                  <div
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      filters.color.includes(color.name)
                        ? "border-warm-brown ring-2 ring-warm-brown/30"
                        : "border-stone/20 group-hover:border-stone/40"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-xs text-charcoal/70">{color.name}</span>
                </button>
              ))}
            </div>
          </FilterAccordion>

          {/* Price Range */}
          <FilterAccordion title="Price Range">
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  value={filters.price[0]}
                  onChange={(e) =>
                    handlePriceChange(
                      0,
                      Math.min(parseInt(e.target.value), filters.price[1]),
                    )
                  }
                  className="flex-1 h-1 bg-stone/10 rounded accent-warm-brown"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  value={filters.price[1]}
                  onChange={(e) =>
                    handlePriceChange(
                      1,
                      Math.max(parseInt(e.target.value), filters.price[0]),
                    )
                  }
                  className="flex-1 h-1 bg-stone/10 rounded accent-warm-brown"
                />
              </div>
              <div className="text-sm text-charcoal/70 space-y-1">
                <div>Min: ₹{filters.price[0]}</div>
                <div>Max: ₹{filters.price[1]}</div>
              </div>
            </div>
          </FilterAccordion>

          {/* Fit */}
          <FilterAccordion title="Fit">
            <div className="space-y-3">
              {["Regular", "Relaxed", "Tailored"].map((fit) => (
                <label
                  key={fit}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.fit.includes(fit)}
                    onChange={() => handleCheckboxChange("fit", fit)}
                    className="w-4 h-4 rounded border-stone/20 accent-warm-brown"
                  />
                  <span className="text-sm text-charcoal">{fit}</span>
                </label>
              ))}
            </div>
          </FilterAccordion>
        </div>

        {/* Footer Buttons */}
        <div className="border-t border-stone/10 p-6 space-y-3 bg-stone/2">
          <button
            onClick={handleClearAll}
            className="w-full py-3 text-sm font-medium text-charcoal border border-stone/20 rounded-lg hover:bg-stone/5 transition-colors tracking-wide"
          >
            Clear All
          </button>
          <button
            onClick={() => {
              onApply(filters);
              onClose();
            }}
            className="w-full py-3 text-sm font-medium text-white bg-warm-brown rounded-lg hover:bg-warm-brown/90 transition-colors tracking-wide"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;
