import { useEffect, useState } from "react";
import type { ShopifyProduct } from "../../types";

interface SizeGuideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product?: ShopifyProduct;
}

const SizeGuideDrawer = ({
  isOpen,
  onClose,
  product,
}: SizeGuideDrawerProps) => {
  const [unitSystem, setUnitSystem] = useState<"cm" | "in">("cm");

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Determine product type for illustration
  const productType = product?.productType?.toLowerCase() || "shirts";
  const isTrouser = productType.includes("trouser");
  const isFabric = productType.includes("fabric");
  // isPolo and isShirt can be inferred from isTrouser if needed for future use

  // Convert inches to cm (1 inch = 2.54 cm)
  const convertToMetric = (inches: number): number => {
    return Math.round(inches * 2.54 * 10) / 10;
  };

  // Size data in inches for shirts and polos
  interface ShirtSize {
    size: string;
    chest: number;
    shoulder: number;
    sleeve: number;
    garment: number;
  }

  interface TrouserSize {
    size: string;
    waist: number;
    length: number;
    inseam: number;
    outseam: number;
  }

  const shirtSizeData: ShirtSize[] = [
    { size: "S", chest: 38, shoulder: 44, sleeve: 31, garment: 68 },
    { size: "M", chest: 40, shoulder: 46, sleeve: 32, garment: 70 },
    { size: "L", chest: 42, shoulder: 48, sleeve: 33, garment: 72 },
    { size: "XL", chest: 44, shoulder: 50, sleeve: 34, garment: 74 },
  ];

  const trouserSizeData: TrouserSize[] = [
    { size: "S", waist: 30, length: 40, inseam: 29, outseam: 40 },
    { size: "M", waist: 32, length: 41, inseam: 30, outseam: 41 },
    { size: "L", waist: 34, length: 42, inseam: 31, outseam: 42 },
    { size: "XL", waist: 36, length: 43, inseam: 32, outseam: 43 },
  ];

  const sizeData: (ShirtSize | TrouserSize)[] = isTrouser
    ? trouserSizeData
    : shirtSizeData;

  const formatMeasurement = (inches: number): string => {
    if (unitSystem === "cm") {
      return convertToMetric(inches).toString();
    }
    return inches.toString();
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

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-full lg:w-[35%] bg-ivory z-50 overflow-y-auto transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-ivory border-b border-stone/15 px-6 md:px-8 py-6 flex items-center justify-between">
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
          {/* Size Chart Section */}
          <div className="mb-12">
            {/* Header with Title and Toggle */}
            <div className="flex items-center justify-between mb-8">
              <h3
                className="text-charcoal"
                style={{
                  fontFamily: "'Cormorant Garamond', 'Canela', serif",
                  fontSize: "24px",
                  fontWeight: 400,
                }}
              >
                Size Guide
              </h3>

              {/* CM/IN Toggle */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setUnitSystem("cm")}
                  className={`transition-colors duration-200 ${
                    unitSystem === "cm"
                      ? "text-charcoal"
                      : "text-charcoal/50 hover:text-charcoal/70"
                  }`}
                  style={{
                    fontFamily: "'Cormorant Garamond', 'Canela', serif",
                    fontSize: "15px",
                    fontWeight: unitSystem === "cm" ? 500 : 400,
                  }}
                >
                  CM
                </button>
                <div className="w-px h-6 bg-stone/20" />
                <button
                  onClick={() => setUnitSystem("in")}
                  className={`transition-colors duration-200 ${
                    unitSystem === "in"
                      ? "text-charcoal"
                      : "text-charcoal/50 hover:text-charcoal/70"
                  }`}
                  style={{
                    fontFamily: "'Cormorant Garamond', 'Canela', serif",
                    fontSize: "15px",
                    fontWeight: unitSystem === "in" ? 500 : 400,
                  }}
                >
                  IN
                </button>
              </div>
            </div>

            {/* Size Chart Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-stone/20">
                    <th
                      className="text-left py-4 px-3 text-charcoal/60"
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Canela', serif",
                        fontSize: "16px",
                        fontWeight: 400,
                      }}
                    >
                      Size
                    </th>
                    {isTrouser ? (
                      <>
                        <th
                          className="text-left py-4 px-3 text-charcoal/60"
                          style={{
                            fontFamily: "'Cormorant Garamond', 'Canela', serif",
                            fontSize: "16px",
                            fontWeight: 400,
                          }}
                        >
                          Waist
                        </th>
                        <th
                          className="text-left py-4 px-3 text-charcoal/60"
                          style={{
                            fontFamily: "'Cormorant Garamond', 'Canela', serif",
                            fontSize: "16px",
                            fontWeight: 400,
                          }}
                        >
                          Inseam
                        </th>
                        <th
                          className="text-left py-4 px-3 text-charcoal/60"
                          style={{
                            fontFamily: "'Cormorant Garamond', 'Canela', serif",
                            fontSize: "16px",
                            fontWeight: 400,
                          }}
                        >
                          Outseam
                        </th>
                      </>
                    ) : (
                      <>
                        <th
                          className="text-left py-4 px-3 text-charcoal/60"
                          style={{
                            fontFamily: "'Cormorant Garamond', 'Canela', serif",
                            fontSize: "16px",
                            fontWeight: 400,
                          }}
                        >
                          Chest
                        </th>
                        <th
                          className="text-left py-4 px-3 text-charcoal/60"
                          style={{
                            fontFamily: "'Cormorant Garamond', 'Canela', serif",
                            fontSize: "16px",
                            fontWeight: 400,
                          }}
                        >
                          Shoulder
                        </th>
                        <th
                          className="text-left py-4 px-3 text-charcoal/60"
                          style={{
                            fontFamily: "'Cormorant Garamond', 'Canela', serif",
                            fontSize: "16px",
                            fontWeight: 400,
                          }}
                        >
                          Sleeve
                        </th>
                        <th
                          className="text-left py-4 px-3 text-charcoal/60"
                          style={{
                            fontFamily: "'Cormorant Garamond', 'Canela', serif",
                            fontSize: "16px",
                            fontWeight: 400,
                          }}
                        >
                          Length
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sizeData.map((row) => (
                    <tr
                      key={row.size}
                      className="border-b border-stone/10 hover:bg-charcoal/2 transition-colors"
                    >
                      <td
                        className="py-4 px-3 text-charcoal font-medium"
                        style={{
                          fontFamily: "'Cormorant Garamond', 'Canela', serif",
                          fontSize: "16px",
                          fontWeight: 500,
                        }}
                      >
                        {row.size}
                      </td>
                      {isTrouser ? (
                        <>
                          <td
                            className="py-4 px-3 text-charcoal/80"
                            style={{
                              fontFamily:
                                "'Cormorant Garamond', 'Canela', serif",
                              fontSize: "16px",
                              fontWeight: 400,
                            }}
                          >
                            {formatMeasurement((row as TrouserSize).waist)}
                            {unitSystem === "in" ? '"' : ""}
                          </td>
                          <td
                            className="py-4 px-3 text-charcoal/80"
                            style={{
                              fontFamily:
                                "'Cormorant Garamond', 'Canela', serif",
                              fontSize: "16px",
                              fontWeight: 400,
                            }}
                          >
                            {formatMeasurement((row as TrouserSize).inseam)}
                            {unitSystem === "in" ? '"' : ""}
                          </td>
                          <td
                            className="py-4 px-3 text-charcoal/80"
                            style={{
                              fontFamily:
                                "'Cormorant Garamond', 'Canela', serif",
                              fontSize: "16px",
                              fontWeight: 400,
                            }}
                          >
                            {formatMeasurement((row as TrouserSize).outseam)}
                            {unitSystem === "in" ? '"' : ""}
                          </td>
                        </>
                      ) : (
                        <>
                          <td
                            className="py-4 px-3 text-charcoal/80"
                            style={{
                              fontFamily:
                                "'Cormorant Garamond', 'Canela', serif",
                              fontSize: "16px",
                              fontWeight: 400,
                            }}
                          >
                            {formatMeasurement((row as ShirtSize).chest)}
                            {unitSystem === "in" ? '"' : ""}
                          </td>
                          <td
                            className="py-4 px-3 text-charcoal/80"
                            style={{
                              fontFamily:
                                "'Cormorant Garamond', 'Canela', serif",
                              fontSize: "16px",
                              fontWeight: 400,
                            }}
                          >
                            {formatMeasurement((row as ShirtSize).shoulder)}
                            {unitSystem === "in" ? '"' : ""}
                          </td>
                          <td
                            className="py-4 px-3 text-charcoal/80"
                            style={{
                              fontFamily:
                                "'Cormorant Garamond', 'Canela', serif",
                              fontSize: "16px",
                              fontWeight: 400,
                            }}
                          >
                            {formatMeasurement((row as ShirtSize).sleeve)}
                            {unitSystem === "in" ? '"' : ""}
                          </td>
                          <td
                            className="py-4 px-3 text-charcoal/80"
                            style={{
                              fontFamily:
                                "'Cormorant Garamond', 'Canela', serif",
                              fontSize: "16px",
                              fontWeight: 400,
                            }}
                          >
                            {formatMeasurement((row as ShirtSize).garment)}
                            {unitSystem === "in" ? '"' : ""}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Measurement Illustrations - Only show for shirts and trousers */}
          {!isFabric && (
            <div className="mb-12">
              <h3
                className="text-charcoal mb-8"
                style={{
                  fontFamily: "'Cormorant Garamond', 'Canela', serif",
                  fontSize: "20px",
                  fontWeight: 400,
                }}
              >
                How to Measure
              </h3>

              {/* Product-Specific Garment Illustrations */}
              <div className="grid grid-cols-2 gap-8 mb-12">
                {isTrouser ? (
                  <>
                    {/* TROUSER FRONT VIEW */}
                    <div className="flex flex-col items-center">
                      <svg
                        viewBox="0 0 140 320"
                        className="w-full h-auto mb-2"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Background */}
                        <rect width="140" height="320" fill="#F7F5F1" />

                        {/* Trouser body - front */}
                        <path
                          d="M 45 50 L 40 150 Q 38 180 40 220 L 35 300 Q 35 315 45 315 L 50 220 Q 50 200 50 150 L 50 50 Z"
                          fill="#FAFAF8"
                          stroke="#E7E1D8"
                          strokeWidth="0.5"
                        />
                        <path
                          d="M 95 50 L 100 150 Q 102 180 100 220 L 105 300 Q 105 315 95 315 L 90 220 Q 90 200 90 150 L 90 50 Z"
                          fill="#FAFAF8"
                          stroke="#E7E1D8"
                          strokeWidth="0.5"
                        />

                        {/* Waistband */}
                        <path
                          d="M 45 50 Q 70 48 95 50"
                          fill="none"
                          stroke="#E7E1D8"
                          strokeWidth="1"
                        />

                        {/* Front seam */}
                        <line
                          x1="70"
                          y1="50"
                          x2="70"
                          y2="300"
                          stroke="#E7E1D8"
                          strokeWidth="0.5"
                          opacity="0.6"
                        />

                        {/* Zipper detail */}
                        <line
                          x1="70"
                          y1="52"
                          x2="70"
                          y2="75"
                          stroke="#B8AA96"
                          strokeWidth="0.8"
                          opacity="0.4"
                        />

                        {/* Measurement Guides */}
                        {/* A - Waist measurement */}
                        <line
                          x1="35"
                          y1="55"
                          x2="105"
                          y2="55"
                          stroke="#D97A72"
                          strokeWidth="1.2"
                          strokeDasharray="4,3"
                        />
                        <circle
                          cx="35"
                          cy="55"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        <circle
                          cx="105"
                          cy="55"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        <circle cx="12" cy="43" r="5" fill="#482C1B" />
                        <text
                          x="12"
                          y="47"
                          textAnchor="middle"
                          fontSize="8"
                          fill="white"
                          fontWeight="600"
                          fontFamily="'Cormorant Garamond', serif"
                        >
                          A
                        </text>

                        {/* B - Inseam measurement */}
                        <line
                          x1="50"
                          y1="150"
                          x2="50"
                          y2="300"
                          stroke="#D97A72"
                          strokeWidth="1.2"
                          strokeDasharray="4,3"
                        />
                        <circle
                          cx="50"
                          cy="150"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        <circle
                          cx="50"
                          cy="300"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        <circle cx="30" cy="225" r="5" fill="#482C1B" />
                        <text
                          x="30"
                          y="229"
                          textAnchor="middle"
                          fontSize="8"
                          fill="white"
                          fontWeight="600"
                          fontFamily="'Cormorant Garamond', serif"
                        >
                          B
                        </text>

                        {/* C - Outseam measurement */}
                        <line
                          x1="35"
                          y1="50"
                          x2="35"
                          y2="300"
                          stroke="#D97A72"
                          strokeWidth="1.2"
                          strokeDasharray="4,3"
                        />
                        <circle
                          cx="35"
                          cy="50"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        <circle
                          cx="35"
                          cy="300"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        <circle cx="10" cy="175" r="5" fill="#482C1B" />
                        <text
                          x="10"
                          y="179"
                          textAnchor="middle"
                          fontSize="8"
                          fill="white"
                          fontWeight="600"
                          fontFamily="'Cormorant Garamond', serif"
                        >
                          C
                        </text>

                        {/* Label */}
                        <text
                          x="70"
                          y="315"
                          textAnchor="middle"
                          fontSize="13"
                          fill="#2A2420"
                          fontWeight="400"
                          fontFamily="'Cormorant Garamond', serif"
                        >
                          Front
                        </text>
                      </svg>
                    </div>

                    {/* TROUSER BACK VIEW */}
                    <div className="flex flex-col items-center">
                      <svg
                        viewBox="0 0 140 320"
                        className="w-full h-auto mb-2"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Background */}
                        <rect width="140" height="320" fill="#F7F5F1" />

                        {/* Trouser body - back */}
                        <path
                          d="M 45 50 L 40 150 Q 38 180 40 220 L 35 300 Q 35 315 45 315 L 50 220 Q 50 200 50 150 L 50 50 Z"
                          fill="#F5F3F0"
                          stroke="#E7E1D8"
                          strokeWidth="0.5"
                        />
                        <path
                          d="M 95 50 L 100 150 Q 102 180 100 220 L 105 300 Q 105 315 95 315 L 90 220 Q 90 200 90 150 L 90 50 Z"
                          fill="#F5F3F0"
                          stroke="#E7E1D8"
                          strokeWidth="0.5"
                        />

                        {/* Waistband */}
                        <path
                          d="M 45 50 Q 70 48 95 50"
                          fill="none"
                          stroke="#E7E1D8"
                          strokeWidth="1"
                        />

                        {/* Back seam */}
                        <line
                          x1="70"
                          y1="50"
                          x2="70"
                          y2="300"
                          stroke="#E7E1D8"
                          strokeWidth="0.5"
                          opacity="0.6"
                        />

                        {/* Measurement Guides */}
                        {/* A - Waist measurement (back) */}
                        <line
                          x1="35"
                          y1="55"
                          x2="105"
                          y2="55"
                          stroke="#D97A72"
                          strokeWidth="1.2"
                          strokeDasharray="4,3"
                        />
                        <circle
                          cx="35"
                          cy="55"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        <circle
                          cx="105"
                          cy="55"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        <circle cx="12" cy="43" r="5" fill="#482C1B" />
                        <text
                          x="12"
                          y="47"
                          textAnchor="middle"
                          fontSize="8"
                          fill="white"
                          fontWeight="600"
                          fontFamily="'Cormorant Garamond', serif"
                        >
                          A
                        </text>

                        {/* B - Inseam measurement (back) */}
                        <line
                          x1="50"
                          y1="150"
                          x2="50"
                          y2="300"
                          stroke="#D97A72"
                          strokeWidth="1.2"
                          strokeDasharray="4,3"
                        />
                        <circle
                          cx="50"
                          cy="150"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        <circle
                          cx="50"
                          cy="300"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        <circle cx="30" cy="225" r="5" fill="#482C1B" />
                        <text
                          x="30"
                          y="229"
                          textAnchor="middle"
                          fontSize="8"
                          fill="white"
                          fontWeight="600"
                          fontFamily="'Cormorant Garamond', serif"
                        >
                          B
                        </text>

                        {/* C - Outseam measurement (back) */}
                        <line
                          x1="35"
                          y1="50"
                          x2="35"
                          y2="300"
                          stroke="#D97A72"
                          strokeWidth="1.2"
                          strokeDasharray="4,3"
                        />
                        <circle
                          cx="35"
                          cy="50"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        <circle
                          cx="35"
                          cy="300"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        <circle cx="10" cy="175" r="5" fill="#482C1B" />
                        <text
                          x="10"
                          y="179"
                          textAnchor="middle"
                          fontSize="8"
                          fill="white"
                          fontWeight="600"
                          fontFamily="'Cormorant Garamond', serif"
                        >
                          C
                        </text>

                        {/* Label */}
                        <text
                          x="70"
                          y="315"
                          textAnchor="middle"
                          fontSize="13"
                          fill="#2A2420"
                          fontWeight="400"
                          fontFamily="'Cormorant Garamond', serif"
                        >
                          Back
                        </text>
                      </svg>
                    </div>
                  </>
                ) : (
                  <>
                    {/* SHIRT FRONT VIEW */}
                    <div className="flex flex-col items-center">
                      <svg
                        viewBox="0 0 140 280"
                        className="w-full h-auto mb-2"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Background */}
                        <rect width="140" height="280" fill="#F7F5F1" />

                        {/* Realistic garment silhouette - premium shirt front */}
                        <defs>
                          <linearGradient
                            id="shirtGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#FFFFFF" />
                            <stop offset="50%" stopColor="#FAFAF8" />
                            <stop offset="100%" stopColor="#F5F3F0" />
                          </linearGradient>
                        </defs>

                        {/* Shirt body - front */}
                        <path
                          d="M 35 45 Q 30 50 25 70 L 20 200 Q 20 240 35 260 L 105 260 Q 120 240 120 200 L 115 70 Q 110 50 105 45 Z"
                          fill="url(#shirtGradient)"
                          stroke="#E7E1D8"
                          strokeWidth="0.5"
                        />

                        {/* Shirt collar */}
                        <path
                          d="M 55 45 Q 60 35 70 45 L 65 60 Q 60 55 55 60 Z"
                          fill="#FAFAF8"
                          stroke="#E7E1D8"
                          strokeWidth="0.5"
                        />

                        {/* Shirt buttons */}
                        <circle
                          cx="70"
                          cy="80"
                          r="1.5"
                          fill="#B8AA96"
                          opacity="0.6"
                        />
                        <circle
                          cx="70"
                          cy="110"
                          r="1.5"
                          fill="#B8AA96"
                          opacity="0.6"
                        />
                        <circle
                          cx="70"
                          cy="140"
                          r="1.5"
                          fill="#B8AA96"
                          opacity="0.6"
                        />
                        <circle
                          cx="70"
                          cy="170"
                          r="1.5"
                          fill="#B8AA96"
                          opacity="0.6"
                        />

                        {/* Sleeves */}
                        <path
                          d="M 35 55 Q 15 60 10 120 L 25 130 Q 30 80 35 60 Z"
                          fill="url(#shirtGradient)"
                          stroke="#E7E1D8"
                          strokeWidth="0.5"
                        />
                        <path
                          d="M 105 55 Q 125 60 130 120 L 115 130 Q 110 80 105 60 Z"
                          fill="url(#shirtGradient)"
                          stroke="#E7E1D8"
                          strokeWidth="0.5"
                        />

                        {/* Measurement Guides - Thin elegant lines */}
                        {/* A - Chest measurement */}
                        <line
                          x1="15"
                          y1="100"
                          x2="125"
                          y2="100"
                          stroke="#D97A72"
                          strokeWidth="1.2"
                          strokeDasharray="4,3"
                        />
                        <circle
                          cx="15"
                          cy="100"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        <circle
                          cx="125"
                          cy="100"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        {/* Label A */}
                        <circle cx="12" cy="88" r="5" fill="#482C1B" />
                        <text
                          x="12"
                          y="92"
                          textAnchor="middle"
                          fontSize="8"
                          fill="white"
                          fontWeight="600"
                          fontFamily="'Cormorant Garamond', serif"
                        >
                          A
                        </text>

                        {/* B - Shoulder measurement */}
                        <line
                          x1="35"
                          y1="58"
                          x2="105"
                          y2="58"
                          stroke="#D97A72"
                          strokeWidth="1.2"
                          strokeDasharray="4,3"
                        />
                        <circle
                          cx="35"
                          cy="58"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        <circle
                          cx="105"
                          cy="58"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        {/* Label B */}
                        <circle cx="128" cy="50" r="5" fill="#482C1B" />
                        <text
                          x="128"
                          y="54"
                          textAnchor="middle"
                          fontSize="8"
                          fill="white"
                          fontWeight="600"
                          fontFamily="'Cormorant Garamond', serif"
                        >
                          B
                        </text>

                        {/* C - Collar measurement */}
                        <path
                          d="M 58 48 Q 70 40 82 48"
                          stroke="#D97A72"
                          strokeWidth="1.2"
                          fill="none"
                          strokeDasharray="4,3"
                        />
                        {/* Label C */}
                        <circle cx="70" cy="32" r="5" fill="#482C1B" />
                        <text
                          x="70"
                          y="36"
                          textAnchor="middle"
                          fontSize="8"
                          fill="white"
                          fontWeight="600"
                          fontFamily="'Cormorant Garamond', serif"
                        >
                          C
                        </text>

                        {/* D - Sleeve length measurement */}
                        <line
                          x1="25"
                          y1="58"
                          x2="25"
                          y2="130"
                          stroke="#D97A72"
                          strokeWidth="1.2"
                          strokeDasharray="4,3"
                        />
                        <circle
                          cx="25"
                          cy="58"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        <circle
                          cx="25"
                          cy="130"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        {/* Label D */}
                        <circle cx="5" cy="94" r="5" fill="#482C1B" />
                        <text
                          x="5"
                          y="98"
                          textAnchor="middle"
                          fontSize="8"
                          fill="white"
                          fontWeight="600"
                          fontFamily="'Cormorant Garamond', serif"
                        >
                          D
                        </text>

                        {/* E - Sleeve opening measurement */}
                        <line
                          x1="20"
                          y1="132"
                          x2="30"
                          y2="132"
                          stroke="#D97A72"
                          strokeWidth="1.2"
                          strokeDasharray="4,3"
                        />
                        <circle
                          cx="20"
                          cy="132"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        <circle
                          cx="30"
                          cy="132"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        {/* Label E */}
                        <circle cx="8" cy="145" r="5" fill="#482C1B" />
                        <text
                          x="8"
                          y="149"
                          textAnchor="middle"
                          fontSize="8"
                          fill="white"
                          fontWeight="600"
                          fontFamily="'Cormorant Garamond', serif"
                        >
                          E
                        </text>

                        {/* F - Garment length measurement */}
                        <line
                          x1="8"
                          y1="48"
                          x2="8"
                          y2="260"
                          stroke="#D97A72"
                          strokeWidth="1.2"
                          strokeDasharray="4,3"
                        />
                        <circle
                          cx="8"
                          cy="48"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        <circle
                          cx="8"
                          cy="260"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        {/* Label F */}
                        <circle cx="20" cy="154" r="5" fill="#482C1B" />
                        <text
                          x="20"
                          y="158"
                          textAnchor="middle"
                          fontSize="8"
                          fill="white"
                          fontWeight="600"
                          fontFamily="'Cormorant Garamond', serif"
                        >
                          F
                        </text>

                        {/* Label */}
                        <text
                          x="70"
                          y="275"
                          textAnchor="middle"
                          fontSize="13"
                          fill="#2A2420"
                          fontWeight="400"
                          fontFamily="'Cormorant Garamond', serif"
                        >
                          Front
                        </text>
                      </svg>
                    </div>

                    {/* Back View */}
                    <div className="flex flex-col items-center">
                      <svg
                        viewBox="0 0 140 280"
                        className="w-full h-auto mb-2"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Background */}
                        <rect width="140" height="280" fill="#F7F5F1" />

                        {/* Shirt body - back */}
                        <path
                          d="M 35 45 Q 30 50 25 70 L 20 200 Q 20 240 35 260 L 105 260 Q 120 240 120 200 L 115 70 Q 110 50 105 45 Z"
                          fill="url(#shirtGradient)"
                          stroke="#E7E1D8"
                          strokeWidth="0.5"
                        />

                        {/* Back neckline */}
                        <path
                          d="M 55 45 Q 60 38 70 45"
                          stroke="#E7E1D8"
                          strokeWidth="1"
                          fill="none"
                        />

                        {/* Shirt center back seam */}
                        <line
                          x1="70"
                          y1="45"
                          x2="70"
                          y2="220"
                          stroke="#E7E1D8"
                          strokeWidth="0.5"
                          opacity="0.6"
                        />

                        {/* Sleeves - back view */}
                        <path
                          d="M 35 55 Q 15 60 10 120 L 25 130 Q 30 80 35 60 Z"
                          fill="url(#shirtGradient)"
                          stroke="#E7E1D8"
                          strokeWidth="0.5"
                        />
                        <path
                          d="M 105 55 Q 125 60 130 120 L 115 130 Q 110 80 105 60 Z"
                          fill="url(#shirtGradient)"
                          stroke="#E7E1D8"
                          strokeWidth="0.5"
                        />

                        {/* Measurement Guides - Back view */}
                        {/* B - Shoulder measurement (back) */}
                        <line
                          x1="35"
                          y1="58"
                          x2="105"
                          y2="58"
                          stroke="#D97A72"
                          strokeWidth="1.2"
                          strokeDasharray="4,3"
                        />
                        <circle
                          cx="35"
                          cy="58"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        <circle
                          cx="105"
                          cy="58"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        {/* Label B */}
                        <circle cx="128" cy="50" r="5" fill="#482C1B" />
                        <text
                          x="128"
                          y="54"
                          textAnchor="middle"
                          fontSize="8"
                          fill="white"
                          fontWeight="600"
                          fontFamily="'Cormorant Garamond', serif"
                        >
                          B
                        </text>

                        {/* D - Sleeve length measurement (back) */}
                        <line
                          x1="25"
                          y1="58"
                          x2="25"
                          y2="130"
                          stroke="#D97A72"
                          strokeWidth="1.2"
                          strokeDasharray="4,3"
                        />
                        <circle
                          cx="25"
                          cy="58"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        <circle
                          cx="25"
                          cy="130"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        {/* Label D */}
                        <circle cx="5" cy="94" r="5" fill="#482C1B" />
                        <text
                          x="5"
                          y="98"
                          textAnchor="middle"
                          fontSize="8"
                          fill="white"
                          fontWeight="600"
                          fontFamily="'Cormorant Garamond', serif"
                        >
                          D
                        </text>

                        {/* F - Garment length measurement (back) */}
                        <line
                          x1="8"
                          y1="48"
                          x2="8"
                          y2="260"
                          stroke="#D97A72"
                          strokeWidth="1.2"
                          strokeDasharray="4,3"
                        />
                        <circle
                          cx="8"
                          cy="48"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        <circle
                          cx="8"
                          cy="260"
                          r="2.5"
                          fill="none"
                          stroke="#D97A72"
                          strokeWidth="1"
                        />
                        {/* Label F */}
                        <circle cx="20" cy="154" r="5" fill="#482C1B" />
                        <text
                          x="20"
                          y="158"
                          textAnchor="middle"
                          fontSize="8"
                          fill="white"
                          fontWeight="600"
                          fontFamily="'Cormorant Garamond', serif"
                        >
                          F
                        </text>

                        {/* Label */}
                        <text
                          x="70"
                          y="275"
                          textAnchor="middle"
                          fontSize="13"
                          fill="#2A2420"
                          fontWeight="400"
                          fontFamily="'Cormorant Garamond', serif"
                        >
                          Back
                        </text>
                      </svg>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Measurement Explanations */}
          {!isFabric && (
            <div className="space-y-8 mb-12">
              {isTrouser ? (
                <>
                  <div>
                    <p
                      className="text-charcoal font-medium mb-2"
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Canela', serif",
                        fontSize: "16px",
                        fontWeight: 400,
                      }}
                    >
                      A — Waist
                    </p>
                    <p
                      className="text-charcoal/70"
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Canela', serif",
                        fontSize: "15px",
                        fontWeight: 400,
                        lineHeight: 1.8,
                      }}
                    >
                      Measure horizontally at the waistband circumference.
                    </p>
                  </div>

                  <div>
                    <p
                      className="text-charcoal font-medium mb-2"
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Canela', serif",
                        fontSize: "16px",
                        fontWeight: 400,
                      }}
                    >
                      B — Inseam
                    </p>
                    <p
                      className="text-charcoal/70"
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Canela', serif",
                        fontSize: "15px",
                        fontWeight: 400,
                        lineHeight: 1.8,
                      }}
                    >
                      Measure from the inside leg from crotch to ankle.
                    </p>
                  </div>

                  <div>
                    <p
                      className="text-charcoal font-medium mb-2"
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Canela', serif",
                        fontSize: "16px",
                        fontWeight: 400,
                      }}
                    >
                      C — Outseam
                    </p>
                    <p
                      className="text-charcoal/70"
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Canela', serif",
                        fontSize: "15px",
                        fontWeight: 400,
                        lineHeight: 1.8,
                      }}
                    >
                      Measure from the waistband along the outside of the leg to
                      ankle.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p
                      className="text-charcoal font-medium mb-2"
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Canela', serif",
                        fontSize: "16px",
                        fontWeight: 400,
                      }}
                    >
                      A — Chest
                    </p>
                    <p
                      className="text-charcoal/70"
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Canela', serif",
                        fontSize: "15px",
                        fontWeight: 400,
                        lineHeight: 1.8,
                      }}
                    >
                      Measure straight across the garment from underarm to
                      underarm.
                    </p>
                  </div>

                  <div>
                    <p
                      className="text-charcoal font-medium mb-2"
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Canela', serif",
                        fontSize: "16px",
                        fontWeight: 400,
                      }}
                    >
                      B — Shoulder
                    </p>
                    <p
                      className="text-charcoal/70"
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Canela', serif",
                        fontSize: "15px",
                        fontWeight: 400,
                        lineHeight: 1.8,
                      }}
                    >
                      Measure from shoulder seam to shoulder seam.
                    </p>
                  </div>

                  <div>
                    <p
                      className="text-charcoal font-medium mb-2"
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Canela', serif",
                        fontSize: "16px",
                        fontWeight: 400,
                      }}
                    >
                      C — Collar
                    </p>
                    <p
                      className="text-charcoal/70"
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Canela', serif",
                        fontSize: "15px",
                        fontWeight: 400,
                        lineHeight: 1.8,
                      }}
                    >
                      Measure the inside circumference of the collar.
                    </p>
                  </div>

                  <div>
                    <p
                      className="text-charcoal font-medium mb-2"
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Canela', serif",
                        fontSize: "16px",
                        fontWeight: 400,
                      }}
                    >
                      D — Sleeve Length
                    </p>
                    <p
                      className="text-charcoal/70"
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Canela', serif",
                        fontSize: "15px",
                        fontWeight: 400,
                        lineHeight: 1.8,
                      }}
                    >
                      Measure from shoulder seam to sleeve opening.
                    </p>
                  </div>

                  <div>
                    <p
                      className="text-charcoal font-medium mb-2"
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Canela', serif",
                        fontSize: "16px",
                        fontWeight: 400,
                      }}
                    >
                      E — Sleeve Opening
                    </p>
                    <p
                      className="text-charcoal/70"
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Canela', serif",
                        fontSize: "15px",
                        fontWeight: 400,
                        lineHeight: 1.8,
                      }}
                    >
                      Measure across the sleeve opening.
                    </p>
                  </div>

                  <div>
                    <p
                      className="text-charcoal font-medium mb-2"
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Canela', serif",
                        fontSize: "16px",
                        fontWeight: 400,
                      }}
                    >
                      F — Garment Length
                    </p>
                    <p
                      className="text-charcoal/70"
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Canela', serif",
                        fontSize: "15px",
                        fontWeight: 400,
                        lineHeight: 1.8,
                      }}
                    >
                      Measure from the highest shoulder point to the bottom hem.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SizeGuideDrawer;
