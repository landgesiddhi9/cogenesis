import { useState } from "react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SizeGuideModal = ({ isOpen, onClose }: SizeGuideModalProps) => {
  const [unit, setUnit] = useState<"cm" | "in">("cm");

  if (!isOpen) return null;

  const sizeData = [
    {
      size: "S",
      chest: "92-96",
      shoulders: "43-45",
      length: "68-70",
      sleeve: "81-83",
    },
    {
      size: "M",
      chest: "96-100",
      shoulders: "45-47",
      length: "70-72",
      sleeve: "83-85",
    },
    {
      size: "L",
      chest: "100-104",
      shoulders: "47-49",
      length: "72-74",
      sleeve: "85-87",
    },
    {
      size: "XL",
      chest: "104-108",
      shoulders: "49-51",
      length: "74-76",
      sleeve: "87-89",
    },
  ];

  const convertToInches = (cm: string) => {
    const cmNum = parseInt(cm.split("-")[0]);
    const cmNum2 = parseInt(cm.split("-")[1]);
    return `${Math.round(cmNum / 2.54)}-${Math.round(cmNum2 / 2.54)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center">
      <div
        className="bg-[#f7f5f1] w-full md:w-96 md:rounded-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#f7f5f1] border-b border-stone/15 px-6 md:px-8 py-6 flex items-center justify-between">
          <h2
            className="text-charcoal"
            style={{
              fontFamily: "'Cormorant Garamond', 'Canela', serif",
              fontSize: "28px",
              fontWeight: 400,
            }}
          >
            Size Guide
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 hover:bg-charcoal/5 transition-colors rounded-full"
            aria-label="Close"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 md:px-8 py-8">
          {/* Unit Toggle */}
          <div className="mb-12 flex gap-4">
            <button
              onClick={() => setUnit("cm")}
              className={`px-6 py-2 border transition-all ${
                unit === "cm"
                  ? "bg-charcoal text-white border-charcoal"
                  : "border-stone/20 text-charcoal hover:border-charcoal/40"
              }`}
              style={{
                fontFamily: "'Cormorant Garamond', 'Canela', serif",
                fontSize: "14px",
                fontWeight: 400,
              }}
            >
              Centimeters (CM)
            </button>
            <button
              onClick={() => setUnit("in")}
              className={`px-6 py-2 border transition-all ${
                unit === "in"
                  ? "bg-charcoal text-white border-charcoal"
                  : "border-stone/20 text-charcoal hover:border-charcoal/40"
              }`}
              style={{
                fontFamily: "'Cormorant Garamond', 'Canela', serif",
                fontSize: "14px",
                fontWeight: 400,
              }}
            >
              Inches (IN)
            </button>
          </div>

          {/* Size Chart Table */}
          <div className="mb-12">
            <h3
              className="text-charcoal mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', 'Canela', serif",
                fontSize: "20px",
                fontWeight: 400,
              }}
            >
              Size Chart
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-stone/20">
                    <th
                      className="text-left py-4 px-4 text-charcoal/60"
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Canela', serif",
                        fontSize: "14px",
                        fontWeight: 400,
                      }}
                    >
                      Size
                    </th>
                    <th
                      className="text-left py-4 px-4 text-charcoal/60"
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Canela', serif",
                        fontSize: "14px",
                        fontWeight: 400,
                      }}
                    >
                      Chest
                    </th>
                    <th
                      className="text-left py-4 px-4 text-charcoal/60"
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Canela', serif",
                        fontSize: "14px",
                        fontWeight: 400,
                      }}
                    >
                      Shoulders
                    </th>
                    <th
                      className="text-left py-4 px-4 text-charcoal/60"
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Canela', serif",
                        fontSize: "14px",
                        fontWeight: 400,
                      }}
                    >
                      Length
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sizeData.map((row) => (
                    <tr key={row.size} className="border-b border-stone/10">
                      <td
                        className="py-4 px-4 text-charcoal font-medium"
                        style={{
                          fontFamily: "'Cormorant Garamond', 'Canela', serif",
                          fontSize: "15px",
                          fontWeight: 400,
                        }}
                      >
                        {row.size}
                      </td>
                      <td
                        className="py-4 px-4 text-charcoal/80"
                        style={{
                          fontFamily: "'Cormorant Garamond', 'Canela', serif",
                          fontSize: "15px",
                          fontWeight: 400,
                        }}
                      >
                        {unit === "cm" ? row.chest : convertToInches(row.chest)}{" "}
                        {unit}
                      </td>
                      <td
                        className="py-4 px-4 text-charcoal/80"
                        style={{
                          fontFamily: "'Cormorant Garamond', 'Canela', serif",
                          fontSize: "15px",
                          fontWeight: 400,
                        }}
                      >
                        {unit === "cm"
                          ? row.shoulders
                          : convertToInches(row.shoulders)}{" "}
                        {unit}
                      </td>
                      <td
                        className="py-4 px-4 text-charcoal/80"
                        style={{
                          fontFamily: "'Cormorant Garamond', 'Canela', serif",
                          fontSize: "15px",
                          fontWeight: 400,
                        }}
                      >
                        {unit === "cm"
                          ? row.length
                          : convertToInches(row.length)}{" "}
                        {unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* How to Measure Section */}
          <div>
            <h3
              className="text-charcoal mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', 'Canela', serif",
                fontSize: "20px",
                fontWeight: 400,
              }}
            >
              How to Measure
            </h3>
            <div className="space-y-6">
              <div>
                <p
                  className="text-charcoal font-medium mb-2"
                  style={{
                    fontFamily: "'Cormorant Garamond', 'Canela', serif",
                    fontSize: "15px",
                    fontWeight: 400,
                  }}
                >
                  Chest
                </p>
                <p
                  className="text-charcoal/70"
                  style={{
                    fontFamily: "'Cormorant Garamond', 'Canela', serif",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: 1.6,
                  }}
                >
                  Measure across the fullest part of your chest with arms
                  relaxed at your sides. Keep the measuring tape flat and
                  parallel to the ground.
                </p>
              </div>
              <div>
                <p
                  className="text-charcoal font-medium mb-2"
                  style={{
                    fontFamily: "'Cormorant Garamond', 'Canela', serif",
                    fontSize: "15px",
                    fontWeight: 400,
                  }}
                >
                  Shoulders
                </p>
                <p
                  className="text-charcoal/70"
                  style={{
                    fontFamily: "'Cormorant Garamond', 'Canela', serif",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: 1.6,
                  }}
                >
                  Measure from shoulder point to shoulder point across the back.
                  Keep the tape straight and level.
                </p>
              </div>
              <div>
                <p
                  className="text-charcoal font-medium mb-2"
                  style={{
                    fontFamily: "'Cormorant Garamond', 'Canela', serif",
                    fontSize: "15px",
                    fontWeight: 400,
                  }}
                >
                  Length
                </p>
                <p
                  className="text-charcoal/70"
                  style={{
                    fontFamily: "'Cormorant Garamond', 'Canela', serif",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: 1.6,
                  }}
                >
                  Measure from the base of your neck down the center of your
                  back to your desired hem length.
                </p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full mt-12 bg-charcoal text-white py-4 border border-charcoal hover:bg-charcoal/90 transition-colors"
            style={{
              fontFamily: "'Cormorant Garamond', 'Canela', serif",
              fontSize: "16px",
              fontWeight: 400,
              letterSpacing: "0.08em",
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
