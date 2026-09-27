import collectionRoyalCorset from "@/assets/collection-royal-corset.jpg";
import collectionCrimsonKente from "@/assets/collection-crimson-kente.jpg";
import collectionEmeraldLeaf from "@/assets/collection-emerald-leaf.jpg";
import collectionAnkaraMini from "@/assets/collection-ankara-mini.jpg";
import collectionGreenFlair from "@/assets/collection-green-flair.jpg";
import heroCouture from "@/assets/hero-couture.jpg";
import fabricSamples from "@/assets/fabric-samples.jpg";
import designSketch from "@/assets/design-sketch.jpg";
import collectionKenteMermaid from "@/assets/collection-kente-mermaid.jpg";
import collectionEmeraldStripe from "@/assets/collection-emerald-stripe.jpg";
import collectionSunsetCoral from "@/assets/collection-sunset-coral.jpg";
import collectionFanHighLow from "@/assets/collection-fan-highlow.jpg";

export interface PortfolioPiece {
  slug: string;
  title: string;
  category: string;
  image: string;
  summary: string;
  description: string;
  details: { label: string; value: string }[];
}

export const portfolioPieces: PortfolioPiece[] = [
  {
    slug: "royal-blue-corset-gown",
    title: "Royal Blue Beaded Corset Gown",
    category: "Evening Couture",
    image: collectionRoyalCorset,
    summary: "Sweetheart corset gown with sheer beaded sleeves & geometric kente mermaid drape.",
    description:
      "A regal couture silhouette balancing modern corsetry with ancestral geometric print. The structured cobalt bodice features delicate beadwork across the sweetheart bustline and illusion sheer sleeves, flowing into a hand-draped peplum waist and sculpted mermaid floor-length skirt.",
    details: [
      { label: "Collection", value: "Haute Couture 2026" },
      { label: "Fabric", value: "Cobalt crepe & geometric woven print" },
      { label: "Fitting", value: "3 fittings, 3 weeks" },
      { label: "Best for", value: "Galas, state dinners, award ceremonies" },
    ],
  },
  {
    slug: "crimson-kente-empress-gown",
    title: "Crimson Kente Empress Gown",
    category: "Bespoke Bridal",
    image: collectionCrimsonKente,
    summary: "Hand-beaded crimson corset with traditional woven Kente sheath & beaded epaulettes.",
    description:
      "A masterpiece of ceremonial luxury handcrafted for the modern African bride and dignitary. Features a boned crimson corset bodice draped with an asymmetric waist sash, cascading down to a hand-embellished traditional Ghanaian Kente skirt with matching shoulder bead chains.",
    details: [
      { label: "Collection", value: "Ivoire & Kente Bridal" },
      { label: "Fabric", value: "Authentic woven Kente & beaded silk" },
      { label: "Fitting", value: "3 fittings, 4-6 weeks" },
      { label: "Best for", value: "Traditional weddings, royal engagements" },
    ],
  },
  {
    slug: "emerald-starburst-corset-dress",
    title: "Emerald Starburst Corset Dress",
    category: "Statement Pieces",
    image: collectionEmeraldLeaf,
    summary: "Botanical starburst print with internal boned corset and bell flare sleeves.",
    description:
      "An architectural showstopper cut from vivid botanical emerald wax print. Features an internal boned corset that cinches the waist, an inverted sweetheart bust, and dramatic flare trumpet sleeves tailored to hold crisp structural volume.",
    details: [
      { label: "Collection", value: "Héritage Botanical" },
      { label: "Fabric", value: "Premium botanical emerald cotton wax" },
      { label: "Fitting", value: "2 fittings, 2-3 weeks" },
      { label: "Best for", value: "High fashion events, milestone portraits" },
    ],
  },
  {
    slug: "royal-ankara-bow-mini",
    title: "Royal Ankara Bow Cocktail Dress",
    category: "Contemporary Luxury",
    image: collectionAnkaraMini,
    summary: "Indigo and gold circular motif mini dress with contrast bow detailing.",
    description:
      "Tailored for modern cosmopolitan luxury. Cut from an intricate indigo and gold Ankara circular print, this sleek cocktail mini features delicate contrast bow front accents, subtle flap pocket details, and precision waist shaping.",
    details: [
      { label: "Collection", value: "Lumière Cocktail" },
      { label: "Fabric", value: "Indigo & gold Ankara wax print" },
      { label: "Fitting", value: "2 fittings, 2 weeks" },
      { label: "Best for", value: "Cocktail parties, art exhibitions, soirées" },
    ],
  },
  {
    slug: "verdant-flounce-cape-dress",
    title: "Verdant Cape Flounce Dress",
    category: "Ceremonial Wear",
    image: collectionGreenFlair,
    summary: "Tiered flutter cape dress in crisp leaf print with fluted ruffle hemline.",
    description:
      "Volume meets grace in this vibrant leaf-print creation. Featuring multi-layered flutter cape sleeves that ripple as you walk, a slit neckline, and a structured pleated flounce hem drafted on Mau's bespoke anatomical block.",
    details: [
      { label: "Collection", value: "Atelier Signature" },
      { label: "Fabric", value: "Crisp cotton print with structured lining" },
      { label: "Fitting", value: "2 fittings, 2 weeks" },
      { label: "Best for", value: "Garden galas, celebrations, church services" },
    ],
  },
  {
    slug: "heritage-ankara-corset-dress",
    title: "Heritage Ankara Corset Dress",
    category: "Statement Pieces",
    image: fabricSamples,
    summary: "Architectural one-shoulder petal ruffle corset dress in vibrant floral Ankara wax print.",
    description:
      "A triumph of modern corsetry and African luxury. Cut from crisp orange and teal botanical Ghanaian wax print, this piece features an internal boned bodice that sculpts the waist, a sweetheart neckline, and a three-dimensional ruffled shoulder flower that holds its dramatic form.",
    details: [
      { label: "Collection", value: "Héritage Ankara" },
      { label: "Fabric", value: "Premium teal & orange Ankara wax print" },
      { label: "Fitting", value: "2 fittings, 3 weeks" },
      { label: "Best for", value: "Cocktails, weddings, milestone galas" },
    ],
  },
  {
    slug: "imperial-boubou-ceremonial-robe",
    title: "Imperial Boubou Ceremonial Robe",
    category: "Ceremonial Wear",
    image: designSketch,
    summary: "Regal floor-sweeping boubou gown with gilded embroidered neckline & matching gele.",
    description:
      "Tailored for state ceremonies, coronation events, and cultural milestone celebrations. Cut generously in flowing botanical wax print with golden thread embroidery framing the neckline and sleeve cuffs, complete with a coordinating architectural headwrap.",
    details: [
      { label: "Collection", value: "Imperial Regalia" },
      { label: "Fabric", value: "Golden & navy botanical wax print" },
      { label: "Fitting", value: "1 fitting, 2 weeks" },
      { label: "Best for", value: "Cultural celebrations, galas, royal ceremonies" },
    ],
  },
  {
    slug: "midnight-gilt-gala-gown",
    title: "Midnight Gilt Gala Gown",
    category: "Evening Couture",
    image: heroCouture,
    summary: "Architectural gold brocade and black crepe gala masterpiece.",
    description:
      "Sculpted for gala evenings and red carpets. Combines hand-draped gold brocade with structured black crepe, finished with a dramatic fishtail train and interior corset.",
    details: [
      { label: "Collection", value: "Haute Couture Nº 08" },
      { label: "Fabric", value: "Gold silk brocade & black crepe" },
      { label: "Fitting", value: "3 fittings, 4 weeks" },
      { label: "Best for", value: "Red carpet, gala balls, awards" },
    ],
  },
  {
    slug: "golden-kente-leaf-peplum-gown",
    title: "Golden Kente Leaf Peplum Gown",
    category: "Bespoke Bridal",
    image: collectionKenteMermaid,
    summary: "Sculpted emerald leaf peplum corset with handwoven Kente mermaid skirt & ruffled hem.",
    description:
      "A regal Ghanaian couture silhouette fusing ancestral woven Kente textile with an architectural corset. Features an intricate green relief-sculpted leaf peplum bustier, emerald bead contour piping, and a dramatic cascading mermaid ruffled train crafted for unforgettable bridal and gala entrances.",
    details: [
      { label: "Collection", value: "Royal Ashanti Couture 2026" },
      { label: "Fabric", value: "Authentic handwoven Kente & emerald faille" },
      { label: "Fitting", value: "3 fittings, 3-4 weeks" },
      { label: "Best for", value: "Traditional weddings, royal galas, state receptions" },
    ],
  },
  {
    slug: "emerald-gilt-striped-peplum-sheath",
    title: "Emerald & Gilt Striped Peplum Sheath",
    category: "Statement Pieces",
    image: collectionEmeraldStripe,
    summary: "Forest green & bronze-gold striped peplum pencil gown with beaded boat neckline.",
    description:
      "An impeccably sculpted bespoke pencil sheath tailored from metallic gold and forest green vertically striped silk-blend fabric. Cut with a structured waist peplum to accentuate curves, delicate crystalline beadwork along the boat neckline, and tailored 3/4 sleeves.",
    details: [
      { label: "Collection", value: "Métier Tailoring" },
      { label: "Fabric", value: "Lurex-striped structured faille & crystal trim" },
      { label: "Fitting", value: "2 fittings, 2-3 weeks" },
      { label: "Best for", value: "Executive galas, celebratory dinners, cocktail receptions" },
    ],
  },
  {
    slug: "sunset-coral-beaded-corset-gown",
    title: "Sunset Coral Beaded Corset Gown",
    category: "Evening Couture",
    image: collectionSunsetCoral,
    summary: "Off-the-shoulder corset gown encrusted in thousands of magenta, sunset coral, and violet crystals.",
    description:
      "A show-stopping masterwork of African haute couture. Hand-beaded over 120 hours with iridescent crystal beads graduating from vibrant magenta pink down to fiery orange and imperial purple. Features an off-the-shoulder sculpted corset bodice, contour waist embroidery, and a flared cathedral mermaid train.",
    details: [
      { label: "Collection", value: "Luminescence Gala 2026" },
      { label: "Fabric", value: "Hand-beaded French tulle & structured silk" },
      { label: "Fitting", value: "3-4 fittings, 4-6 weeks" },
      { label: "Best for", value: "Red carpet galas, pageants, luxury bridal receptions" },
    ],
  },
  {
    slug: "onyx-gold-fan-flounce-gown",
    title: "Onyx & Gold Fan Flounce Gown",
    category: "Contemporary Luxury",
    image: collectionFanHighLow,
    summary: "Asymmetric one-shoulder Ankara gown with architectural cascading high-low flounce hem.",
    description:
      "Dynamic African high-fashion tailored in striking black and gold fan-motif Ankara print. Showcases an asymmetrical folded one-shoulder neckline, tailored corset-cut bodice, and an architectural tiered high-low mermaid hem lined in silk satin.",
    details: [
      { label: "Collection", value: "Héritage Sculptural" },
      { label: "Fabric", value: "Premium wax print Ankara & structured horsehair hem" },
      { label: "Fitting", value: "2 fittings, 2-3 weeks" },
      { label: "Best for", value: "Art galas, evening ceremonies, cocktail affairs" },
    ],
  },
];

export function getPortfolioPiece(slug: string) {
  return portfolioPieces.find((p) => p.slug === slug);
}
