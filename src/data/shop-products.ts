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
import type { ShopifyProduct } from "@/lib/shopify";

export const ATELIER_PRODUCTS: ShopifyProduct[] = [
  {
    node: {
      id: "gid://shopify/Product/nn-001",
      title: "Royal Blue Beaded Corset Gown",
      description:
        "A regal couture silhouette balancing modern corsetry with ancestral geometric print. Features a structured cobalt bodice with sweetheart bustline, sheer illusion beaded sleeves, draped peplum waist, and a sculpted floor-length mermaid skirt.",
      handle: "royal-blue-corset-gown",
      priceRange: {
        minVariantPrice: { amount: "580.00", currencyCode: "USD" },
      },
      images: {
        edges: [
          { node: { url: collectionRoyalCorset, altText: "Royal Blue Beaded Corset Gown" } },
        ],
      },
      options: [
        { name: "Size", values: ["UK 8", "UK 10", "UK 12", "UK 14", "UK 16", "Custom Fit"] },
      ],
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-001-uk8",
              title: "UK 8",
              price: { amount: "580.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 8" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-001-uk10",
              title: "UK 10",
              price: { amount: "580.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 10" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-001-uk12",
              title: "UK 12",
              price: { amount: "580.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 12" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-001-uk14",
              title: "UK 14",
              price: { amount: "580.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 14" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-001-custom",
              title: "Custom Fit",
              price: { amount: "580.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "Custom Fit" }],
            },
          },
        ],
      },
    },
  },
  {
    node: {
      id: "gid://shopify/Product/nn-002",
      title: "Crimson Kente Empress Gown",
      description:
        "Ceremonial luxury handcrafted for the modern African bride and dignitary. Features a boned crimson corset bodice draped with an asymmetric hip sash, cascading to a hand-embellished traditional Ghanaian Kente skirt with matching beaded shoulder epaulettes.",
      handle: "crimson-kente-empress-gown",
      priceRange: {
        minVariantPrice: { amount: "890.00", currencyCode: "USD" },
      },
      images: {
        edges: [
          { node: { url: collectionCrimsonKente, altText: "Crimson Kente Empress Gown with beadwork" } },
        ],
      },
      options: [{ name: "Size", values: ["UK 8", "UK 10", "UK 12", "UK 14", "Bespoke Fitting"] }],
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-002-uk8",
              title: "UK 8",
              price: { amount: "890.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 8" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-002-uk10",
              title: "UK 10",
              price: { amount: "890.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 10" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-002-uk12",
              title: "UK 12",
              price: { amount: "890.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 12" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-002-bespoke",
              title: "Bespoke Fitting",
              price: { amount: "890.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "Bespoke Fitting" }],
            },
          },
        ],
      },
    },
  },
  {
    node: {
      id: "gid://shopify/Product/nn-003",
      title: "Heritage Ankara Corset Dress",
      description:
        "Modern corset silhouette in vibrant orange and teal botanical Ankara print. Crafted with internal boning that sculpts the waist, a classic sweetheart bustline, and a breathtaking architectural one-shoulder petal ruffle.",
      handle: "heritage-ankara-corset-dress",
      priceRange: {
        minVariantPrice: { amount: "380.00", currencyCode: "USD" },
      },
      images: {
        edges: [
          {
            node: {
              url: fabricSamples,
              altText: "Heritage Ankara Corset Dress with architectural shoulder ruffle",
            },
          },
        ],
      },
      options: [{ name: "Size", values: ["UK 8", "UK 10", "UK 12", "UK 14", "UK 16", "Custom Fit"] }],
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-003-uk8",
              title: "UK 8",
              price: { amount: "380.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 8" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-003-uk10",
              title: "UK 10",
              price: { amount: "380.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 10" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-003-uk12",
              title: "UK 12",
              price: { amount: "380.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 12" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-003-uk14",
              title: "UK 14",
              price: { amount: "380.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 14" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-003-custom",
              title: "Custom Fit",
              price: { amount: "380.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "Custom Fit" }],
            },
          },
        ],
      },
    },
  },
  {
    node: {
      id: "gid://shopify/Product/nn-004",
      title: "Imperial Boubou Ceremonial Robe",
      description:
        "Statuesque Ghanaian ceremonial boubou kaftan gown handcrafted in rich golden and navy botanical wax print. Features a gilded hand-embroidered neckline, flowing draped sleeves, and matching sculptural headwrap.",
      handle: "imperial-boubou-ceremonial-robe",
      priceRange: {
        minVariantPrice: { amount: "460.00", currencyCode: "USD" },
      },
      images: {
        edges: [
          {
            node: {
              url: designSketch,
              altText: "Imperial Boubou Ceremonial Robe with matching headwrap",
            },
          },
        ],
      },
      options: [{ name: "Size", values: ["Free Size (UK 8-18)", "Custom Length"] }],
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-004-freesize",
              title: "Free Size (UK 8-18)",
              price: { amount: "460.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "Free Size (UK 8-18)" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-004-custom",
              title: "Custom Length",
              price: { amount: "460.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "Custom Length" }],
            },
          },
        ],
      },
    },
  },
  {
    node: {
      id: "gid://shopify/Product/nn-005",
      title: "Emerald Starburst Corset Dress",
      description:
        "An architectural showstopper cut from vivid botanical emerald wax print. Features an internal boned corset that cinches the waist, an inverted sweetheart bustline, and dramatic bell flare sleeves tailored to hold crisp structural volume.",
      handle: "emerald-starburst-corset-dress",
      priceRange: {
        minVariantPrice: { amount: "420.00", currencyCode: "USD" },
      },
      images: {
        edges: [
          { node: { url: collectionEmeraldLeaf, altText: "Emerald Starburst Corset Dress with flared sleeves" } },
        ],
      },
      options: [{ name: "Size", values: ["UK 8", "UK 10", "UK 12", "UK 14", "UK 16"] }],
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-005-uk8",
              title: "UK 8",
              price: { amount: "420.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 8" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-005-uk10",
              title: "UK 10",
              price: { amount: "420.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 10" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-005-uk12",
              title: "UK 12",
              price: { amount: "420.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 12" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-005-uk14",
              title: "UK 14",
              price: { amount: "420.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 14" }],
            },
          },
        ],
      },
    },
  },
  {
    node: {
      id: "gid://shopify/Product/nn-006",
      title: "Royal Ankara Bow Cocktail Dress",
      description:
        "Modern cosmopolitan luxury. Cut from intricate indigo and gold Ankara circular print, this sleek cocktail mini features delicate contrast front bows, flap pocket details, and precision waist shaping.",
      handle: "royal-ankara-bow-mini",
      priceRange: {
        minVariantPrice: { amount: "310.00", currencyCode: "USD" },
      },
      images: {
        edges: [{ node: { url: collectionAnkaraMini, altText: "Royal Ankara Bow Cocktail Dress" } }],
      },
      options: [{ name: "Size", values: ["UK 8", "UK 10", "UK 12", "UK 14"] }],
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-006-uk8",
              title: "UK 8",
              price: { amount: "310.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 8" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-006-uk10",
              title: "UK 10",
              price: { amount: "310.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 10" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-006-uk12",
              title: "UK 12",
              price: { amount: "310.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 12" }],
            },
          },
        ],
      },
    },
  },
  {
    node: {
      id: "gid://shopify/Product/nn-007",
      title: "Verdant Cape Flounce Dress",
      description:
        "Volume meets grace in this vibrant leaf-print dress. Features multi-layered flutter cape sleeves, a slit neckline, and a structured pleated flounce hem drafted on Mau's bespoke anatomical block.",
      handle: "verdant-cape-flounce-dress",
      priceRange: {
        minVariantPrice: { amount: "290.00", currencyCode: "USD" },
      },
      images: {
        edges: [
          { node: { url: collectionGreenFlair, altText: "Verdant Cape Flounce Dress on mannequin" } },
        ],
      },
      options: [{ name: "Size", values: ["UK 8", "UK 10", "UK 12", "UK 14", "Custom Fit"] }],
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-007-uk8",
              title: "UK 8",
              price: { amount: "290.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 8" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-007-uk10",
              title: "UK 10",
              price: { amount: "290.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 10" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-007-uk12",
              title: "UK 12",
              price: { amount: "290.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 12" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-007-custom",
              title: "Custom Fit",
              price: { amount: "290.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "Custom Fit" }],
            },
          },
        ],
      },
    },
  },
  {
    node: {
      id: "gid://shopify/Product/nn-008",
      title: "Midnight Gilt Gala Gown",
      description:
        "Sculpted for gala evenings and red carpets. Combines hand-draped gold brocade with structured black crepe, finished with a dramatic fishtail train and interior corset.",
      handle: "midnight-gilt-gala-gown",
      priceRange: {
        minVariantPrice: { amount: "950.00", currencyCode: "USD" },
      },
      images: {
        edges: [
          {
            node: {
              url: heroCouture,
              altText: "Midnight Gilt Gala Gown in gold brocade and black crepe",
            },
          },
        ],
      },
      options: [
        { name: "Size", values: ["UK 8", "UK 10", "UK 12", "UK 14", "Bespoke Measurement"] },
      ],
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-008-uk8",
              title: "UK 8",
              price: { amount: "950.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 8" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-008-uk10",
              title: "UK 10",
              price: { amount: "950.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 10" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-008-uk12",
              title: "UK 12",
              price: { amount: "950.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 12" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-008-bespoke",
              title: "Bespoke Measurement",
              price: { amount: "950.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "Bespoke Measurement" }],
            },
          },
        ],
      },
    },
  },
  {
    node: {
      id: "gid://shopify/Product/nn-009",
      title: "Golden Kente Leaf Peplum Gown",
      description:
        "An awe-inspiring ceremonial masterpiece combining ancestral handwoven Kente with an architectural sculpted leaf peplum corset. Crafted with emerald beaded contours, structured boning, and a dramatic cascading mermaid ruffled train.",
      handle: "golden-kente-leaf-peplum-gown",
      tags: ["Traditional Luxury", "Bridal Couture", "Ceremonial Wear", "Kente", "Gala & Evening"],
      priceRange: {
        minVariantPrice: { amount: "640.00", currencyCode: "USD" },
      },
      images: {
        edges: [
          {
            node: {
              url: collectionKenteMermaid,
              altText: "Golden Kente Leaf Peplum Gown with sculpted corset and ruffled mermaid train",
            },
          },
        ],
      },
      options: [
        { name: "Size", values: ["UK 8", "UK 10", "UK 12", "UK 14", "UK 16", "Custom Fit"] },
      ],
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-009-uk8",
              title: "UK 8",
              price: { amount: "640.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 8" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-009-uk10",
              title: "UK 10",
              price: { amount: "640.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 10" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-009-uk12",
              title: "UK 12",
              price: { amount: "640.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 12" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-009-uk14",
              title: "UK 14",
              price: { amount: "640.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 14" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-009-custom",
              title: "Custom Fit",
              price: { amount: "640.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "Custom Fit" }],
            },
          },
        ],
      },
    },
  },
  {
    node: {
      id: "gid://shopify/Product/nn-010",
      title: "Emerald & Gilt Striped Peplum Sheath",
      description:
        "An impeccably sculpted bespoke pencil sheath tailored from metallic gold and forest green vertically striped silk-blend fabric. Cut with a structured waist peplum to accentuate curves, delicate crystalline beadwork along the boat neckline, and tailored 3/4 sleeves.",
      handle: "emerald-gilt-striped-peplum-sheath",
      tags: ["Tailored Suits", "Traditional Luxury", "Statement Pieces", "Gala & Evening"],
      priceRange: {
        minVariantPrice: { amount: "440.00", currencyCode: "USD" },
      },
      images: {
        edges: [
          {
            node: {
              url: collectionEmeraldStripe,
              altText: "Emerald & Gilt Striped Peplum Sheath Gown with beaded neckline",
            },
          },
        ],
      },
      options: [
        { name: "Size", values: ["UK 8", "UK 10", "UK 12", "UK 14", "UK 16", "Custom Fit"] },
      ],
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-010-uk8",
              title: "UK 8",
              price: { amount: "440.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 8" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-010-uk10",
              title: "UK 10",
              price: { amount: "440.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 10" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-010-uk12",
              title: "UK 12",
              price: { amount: "440.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 12" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-010-uk14",
              title: "UK 14",
              price: { amount: "440.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 14" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-010-custom",
              title: "Custom Fit",
              price: { amount: "440.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "Custom Fit" }],
            },
          },
        ],
      },
    },
  },
  {
    node: {
      id: "gid://shopify/Product/nn-011",
      title: "Sunset Coral Beaded Corset Gown",
      description:
        "A show-stopping masterwork of African haute couture. Hand-beaded over 120 hours with iridescent crystal beads graduating from vibrant magenta pink down to fiery orange and imperial purple. Features an off-the-shoulder sculpted corset bodice, contour waist embroidery, and a flared cathedral mermaid train.",
      handle: "sunset-coral-beaded-corset-gown",
      tags: ["Gala & Evening", "Bridal Couture", "Traditional Luxury", "Beaded"],
      priceRange: {
        minVariantPrice: { amount: "690.00", currencyCode: "USD" },
      },
      images: {
        edges: [
          {
            node: {
              url: collectionSunsetCoral,
              altText: "Sunset Coral Beaded Corset Gown in magenta and fiery orange beads",
            },
          },
        ],
      },
      options: [
        { name: "Size", values: ["UK 8", "UK 10", "UK 12", "UK 14", "Bespoke Measurement"] },
      ],
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-011-uk8",
              title: "UK 8",
              price: { amount: "690.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 8" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-011-uk10",
              title: "UK 10",
              price: { amount: "690.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 10" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-011-uk12",
              title: "UK 12",
              price: { amount: "690.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 12" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-011-bespoke",
              title: "Bespoke Measurement",
              price: { amount: "690.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "Bespoke Measurement" }],
            },
          },
        ],
      },
    },
  },
  {
    node: {
      id: "gid://shopify/Product/nn-012",
      title: "Onyx & Gold Fan Flounce Gown",
      description:
        "Dynamic African high-fashion tailored in striking black and gold fan-motif Ankara print. Showcases an asymmetrical folded one-shoulder neckline, tailored corset-cut bodice, and an architectural tiered high-low mermaid hem lined in silk satin.",
      handle: "onyx-gold-fan-flounce-gown",
      tags: ["Gala & Evening", "Traditional Luxury", "Tailored Suits", "Ankara"],
      priceRange: {
        minVariantPrice: { amount: "460.00", currencyCode: "USD" },
      },
      images: {
        edges: [
          {
            node: {
              url: collectionFanHighLow,
              altText: "Onyx & Gold Fan Flounce Gown in black and yellow Ankara print",
            },
          },
        ],
      },
      options: [
        { name: "Size", values: ["UK 8", "UK 10", "UK 12", "UK 14", "UK 16", "Custom Fit"] },
      ],
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-012-uk8",
              title: "UK 8",
              price: { amount: "460.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 8" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-012-uk10",
              title: "UK 10",
              price: { amount: "460.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 10" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-012-uk12",
              title: "UK 12",
              price: { amount: "460.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 12" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-012-custom",
              title: "Custom Fit",
              price: { amount: "460.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "Custom Fit" }],
            },
          },
        ],
      },
    },
  },
];
