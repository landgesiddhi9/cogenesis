export interface ColorSwatch {
  name: string;
  hex: string;
}

export const COLOR_PALETTE: Record<string, string> = {
  // Monochromes & Neutrals
  white: "#F5F3EE",
  "pure white": "#FFFFFF",
  "milk white": "#F4F1EA",
  "off white": "#FAF9F6",
  "off-white": "#FAF9F6",
  ivory: "#FDFBF7",
  cream: "#FFFDD0",
  snow: "#F5FEFD",
  bone: "#E3DAC9",
  alabaster: "#EDEAE0",
  black: "#1A1512",
  "deep black": "#111111",
  charcoal: "#2A2420",
  anthracite: "#383E42",
  onyx: "#0F0F0F",
  noir: "#121212",
  jet: "#343434",
  grey: "#808080",
  gray: "#808080",
  "light grey": "#D3D3D3",
  "light gray": "#D3D3D3",
  "dark grey": "#505050",
  "dark gray": "#505050",
  silver: "#C0C0C0",
  ash: "#B2BEB5",
  smoke: "#738276",
  graphite: "#4B4E53",

  // Earth tones & Browns
  beige: "#F5E6D3",
  sand: "#D8C6A8",
  "beach sand": "#D5C4A1",
  sandstone: "#C9B496",
  clay: "#A86D58",
  butter: "#E8DCB8",
  cocoa: "#5C4033",
  driftwood: "#847A75",
  khaki: "#C3B091",
  tan: "#D2B48C",
  camel: "#C19A6B",
  stone: "#D4C5B0",
  taupe: "#B38B6D",
  nude: "#E8D8CD",
  biscuit: "#EAD6BD",
  wheat: "#F5DEB3",
  champagne: "#F7E7CE",
  oatmeal: "#E4D5B7",
  brown: "#6E473B",
  chocolate: "#3D2314",
  coffee: "#4B3621",
  mocha: "#4E3629",
  espresso: "#362B28",
  walnut: "#432E1E",
  chestnut: "#986960",
  sepia: "#704214",

  // Blues
  navy: "#1B2A4A",
  "navy blue": "#1B2A4A",
  "midnight blue": "#191970",
  midnight: "#12192C",
  blue: "#2B547E",
  "dark blue": "#00008B",
  "royal blue": "#4169E1",
  "sky blue": "#87CEEB",
  "light blue": "#ADD8E6",
  "baby blue": "#89CFF0",
  indigo: "#4B0082",
  cobalt: "#0047AB",
  slate: "#708090",
  denim: "#2243B6",
  teal: "#008080",
  cyan: "#00FFFF",
  turquoise: "#40E0D0",
  aqua: "#00FFFF",
  petrol: "#005F73",
  ocean: "#1F4E5B",

  // Greens
  olive: "#6B7043",
  "olive mist": "#7A8471",
  "olive green": "#556B2F",
  sage: "#9CAF88",
  forest: "#228B22",
  "forest green": "#1B4D3E",
  moss: "#8A9A5B",
  pine: "#01796F",
  emerald: "#50C878",
  green: "#4A6B4E",
  "army green": "#4B5320",
  "khaki green": "#40523C",
  mint: "#98FF98",
  eucalyptus: "#5F8575",
  pistachio: "#93C572",
  jade: "#00A86B",

  // Reds, Pinks & Purples
  burgundy: "#800020",
  maroon: "#800000",
  "rust red": "#B42D3F",
  mandarin: "#D97443",
  wine: "#722F37",
  bordeaux: "#5C061C",
  merlot: "#730039",
  crimson: "#DC143C",
  red: "#B22222",
  brick: "#9C413D",
  rust: "#B7410E",
  terracotta: "#E2725B",
  coral: "#F88379",
  salmon: "#FA8072",
  peach: "#FFE5B4",
  pink: "#FFC0CB",
  rose: "#C08081",
  "dusty rose": "#DCAE96",
  blush: "#DE5D83",
  mauve: "#E0B0FF",
  lavender: "#E6E6FA",
  lilac: "#C8A2C8",
  purple: "#800080",
  plum: "#8E4585",
  violet: "#7F00FF",
  berry: "#8A1C5A",

  // Yellows & Metallics
  yellow: "#FFFF00",
  mustard: "#FFDB58",
  gold: "#D4AF37",
  amber: "#FFBF00",
  ochre: "#CC7722",
  orange: "#FFA500",
  tangerine: "#F28500",
  copper: "#B87333",
  bronze: "#CD7F32",
};

/**
 * Returns a CSS hex color code corresponding to a Shopify color name.
 * Handles exact matches, partial word matches, direct hex string values, and fallback.
 */
export function getColorHex(colorName?: string | null): string {
  if (!colorName) return "#E5E5E5";
  const clean = colorName.trim().toLowerCase();

  // 1. Direct dictionary match
  if (COLOR_PALETTE[clean]) {
    return COLOR_PALETTE[clean];
  }

  // 2. Direct hex format (e.g. #FFF or #FFFFFF)
  if (/^#([0-9A-F]{3}){1,2}$/i.test(colorName.trim())) {
    return colorName.trim();
  }

  // 3. Word-level substring match (e.g. "Vintage Olive" matches "olive", "Dark Charcoal" matches "charcoal")
  for (const [key, hex] of Object.entries(COLOR_PALETTE)) {
    if (clean.includes(key)) {
      return hex;
    }
  }

  // 4. Fallback luxury neutral
  return "#D4C5B0";
}
