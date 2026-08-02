import collection1 from "@/assets/collection-1.jpg";
import collection2 from "@/assets/collection-2.jpg";
import collection3 from "@/assets/collection-3.jpg";
import collection4 from "@/assets/collection-4.jpg";
import designSketch from "@/assets/design-sketch.jpg";
import fabricSamples from "@/assets/fabric-samples.jpg";

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
    slug: "akoma-peplum-gown",
    title: "Akoma Peplum Gown",
    category: "Evening Couture",
    image: collection1,
    summary: "One-shoulder Ankara peplum with a sculpted fishtail hem.",
    description:
      "A celebration silhouette cut from a swirling Ghanaian wax print. The single shoulder ruffle is hand-shaped over a boned bodice, while the peplum is drafted on the bias so the print circles the waist without breaking. The fishtail hem is lined in soft mesh for movement on the dance floor.",
    details: [
      { label: "Fabric", value: "Premium Ghanaian wax print" },
      { label: "Fitting", value: "2 fittings, 3 weeks" },
      { label: "Best for", value: "Weddings, engagements, galas" },
    ],
  },
  {
    slug: "obaa-bridal-mermaid",
    title: "Obaa Bridal Mermaid",
    category: "Bespoke Bridal",
    image: collection2,
    summary: "Ankara and corded lace bridal gown with a sweeping train.",
    description:
      "Designed for the bride who wants heritage and ceremony in one gown. Golden wax print panels are married to ivory corded lace along hand-finished seams, and the illusion sleeve is appliquéd motif by motif. The chapel train is fully lined and bustles for the reception.",
    details: [
      { label: "Fabric", value: "Wax print with corded lace" },
      { label: "Fitting", value: "3 fittings, 6 weeks" },
      { label: "Best for", value: "Traditional and white weddings" },
    ],
  },
  {
    slug: "kasoa-power-suit",
    title: "Kasoa Power Suit",
    category: "Corporate Tailoring",
    image: collection3,
    summary: "Patchwork Ankara two-piece with a sharp peak lapel.",
    description:
      "Boardroom tailoring in a Ghanaian language. Each block of print is cut and matched by hand so the patchwork reads as one continuous story across the jacket and trouser. Canvassed at the chest for structure, half-lined for the Accra heat.",
    details: [
      { label: "Fabric", value: "Mixed wax print patchwork" },
      { label: "Fitting", value: "2 fittings, 3 weeks" },
      { label: "Best for", value: "Work, conferences, portraits" },
    ],
  },
  {
    slug: "adom-kimono-gown",
    title: "Adom Kimono Gown",
    category: "Statement Pieces",
    image: collection4,
    summary: "Floor-length wrap gown with dramatic kimono sleeves.",
    description:
      "A quiet, regal piece built around volume. Wide kimono sleeves fall from a deep V wrap and are edged with woven strip-cloth bands, echoing the vertical panels of the skirt. Weighted hems keep the drape composed as you move.",
    details: [
      { label: "Fabric", value: "Wax print with strip-cloth trim" },
      { label: "Fitting", value: "2 fittings, 4 weeks" },
      { label: "Best for", value: "Ceremonies, milestone birthdays" },
    ],
  },
  {
    slug: "nhyira-kaftan",
    title: "Nhyira Kaftan",
    category: "Traditional Wear",
    image: designSketch,
    summary: "Free-flowing kaftan with a matching headwrap and beaded neckline.",
    description:
      "Comfort without compromise. The kaftan is cut generously through the body and finished with a hand-beaded gold neckline placket. It comes with a matching headwrap tied from the same bolt so print and colour never fall out of step.",
    details: [
      { label: "Fabric", value: "Soft-hand wax print" },
      { label: "Fitting", value: "1 fitting, 2 weeks" },
      { label: "Best for", value: "Outdoorings, church, festivals" },
    ],
  },
  {
    slug: "efie-midi-dress",
    title: "Efie Midi Dress",
    category: "Everyday Luxe",
    image: fabricSamples,
    summary: "Body-skimming midi with an oversized one-shoulder ruffle.",
    description:
      "The everyday piece that still turns heads. A clean, darted midi in a teal and amber print, lifted by a single oversized ruffle interfaced to hold its shape wash after wash. Hidden back vent and invisible zip keep the line uninterrupted.",
    details: [
      { label: "Fabric", value: "Cotton wax print" },
      { label: "Fitting", value: "1 fitting, 2 weeks" },
      { label: "Best for", value: "Dinners, birthdays, day events" },
    ],
  },
];

export function getPortfolioPiece(slug: string) {
  return portfolioPieces.find((p) => p.slug === slug);
}
