import collection1 from "@/assets/collection-1.jpg";
import collection2 from "@/assets/collection-2.jpg";
import collection3 from "@/assets/collection-3.jpg";
import collection4 from "@/assets/collection-4.jpg";
import heroCouture from "@/assets/hero-couture.jpg";
import fabricSamples from "@/assets/fabric-samples.jpg";
import type { ShopifyProduct } from "@/lib/shopify";

export const ATELIER_PRODUCTS: ShopifyProduct[] = [
  {
    node: {
      id: "gid://shopify/Product/nn-001",
      title: "Akoma Peplum Gown",
      description:
        "A celebration silhouette cut from premium Ghanaian wax print. Features a structured one-shoulder ruffle hand-shaped over a boned internal bodice, paired with a sculpted fishtail hem lined in soft mesh for effortless fluidity.",
      handle: "akoma-peplum-gown",
      priceRange: {
        minVariantPrice: { amount: "380.00", currencyCode: "USD" },
      },
      images: {
        edges: [
          { node: { url: collection1, altText: "Akoma Peplum Gown in Ghanaian wax print" } },
          { node: { url: heroCouture, altText: "Akoma Peplum Gown detail and drape" } },
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
              price: { amount: "380.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 8" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-001-uk10",
              title: "UK 10",
              price: { amount: "380.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 10" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-001-uk12",
              title: "UK 12",
              price: { amount: "380.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 12" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-001-uk14",
              title: "UK 14",
              price: { amount: "380.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 14" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-001-custom",
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
      id: "gid://shopify/Product/nn-002",
      title: "Obaa Bridal Mermaid Gown",
      description:
        "Ancestral luxury tailored for the ceremony. Golden wax print panels are seamlessly married to ivory corded lace along hand-finished French seams, leading down to a dramatic fully-lined chapel train that can bustle for the reception.",
      handle: "obaa-bridal-mermaid",
      priceRange: {
        minVariantPrice: { amount: "850.00", currencyCode: "USD" },
      },
      images: {
        edges: [
          { node: { url: collection2, altText: "Obaa Bridal Mermaid Gown with corded lace" } },
        ],
      },
      options: [{ name: "Size", values: ["UK 8", "UK 10", "UK 12", "UK 14", "Bespoke Fitting"] }],
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-002-uk8",
              title: "UK 8",
              price: { amount: "850.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 8" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-002-uk10",
              title: "UK 10",
              price: { amount: "850.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 10" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-002-uk12",
              title: "UK 12",
              price: { amount: "850.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 12" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-002-bespoke",
              title: "Bespoke Fitting",
              price: { amount: "850.00", currencyCode: "USD" },
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
      title: "Kasoa Peak-Lapel Power Suit",
      description:
        "High-impact boardroom tailoring honoring Ghanaian heritage. Each section of wax print patchwork is cut and aligned by hand so patterns flow across jacket and trousers. Canvassed chest with half-lining for optimal breathability.",
      handle: "kasoa-power-suit",
      priceRange: {
        minVariantPrice: { amount: "420.00", currencyCode: "USD" },
      },
      images: {
        edges: [
          { node: { url: collection3, altText: "Kasoa Peak-Lapel Power Suit in mixed wax print" } },
        ],
      },
      options: [{ name: "Size", values: ["UK 8", "UK 10", "UK 12", "UK 14", "UK 16"] }],
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-003-uk8",
              title: "UK 8",
              price: { amount: "420.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 8" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-003-uk10",
              title: "UK 10",
              price: { amount: "420.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 10" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-003-uk12",
              title: "UK 12",
              price: { amount: "420.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 12" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-003-uk14",
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
      id: "gid://shopify/Product/nn-004",
      title: "Walantu Silk-Organza Evening Dress",
      description:
        "Layered organza silhouette accented with gold wax piping and hand-pleated tiered sleeves. A light, diaphanous showstopper designed for galas, evening receptions, and festive celebrations.",
      handle: "walantu-silk-organza",
      priceRange: {
        minVariantPrice: { amount: "320.00", currencyCode: "USD" },
      },
      images: {
        edges: [{ node: { url: collection4, altText: "Walantu Silk-Organza Evening Dress" } }],
      },
      options: [{ name: "Size", values: ["UK 8", "UK 10", "UK 12", "UK 14"] }],
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-004-uk8",
              title: "UK 8",
              price: { amount: "320.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 8" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-004-uk10",
              title: "UK 10",
              price: { amount: "320.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 10" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-004-uk12",
              title: "UK 12",
              price: { amount: "320.00", currencyCode: "USD" },
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
      id: "gid://shopify/Product/nn-005",
      title: "Heritage Ankara Corset Dress",
      description:
        "Modern corset silhouette with flexible internal boning and an architectural sweetheart neckline. Tailored to flatter and sculpt while allowing full freedom of movement.",
      handle: "heritage-ankara-corset",
      priceRange: {
        minVariantPrice: { amount: "260.00", currencyCode: "USD" },
      },
      images: {
        edges: [{ node: { url: heroCouture, altText: "Heritage Ankara Corset Dress" } }],
      },
      options: [{ name: "Size", values: ["UK 8", "UK 10", "UK 12", "UK 14", "UK 16"] }],
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-005-uk8",
              title: "UK 8",
              price: { amount: "260.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 8" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-005-uk10",
              title: "UK 10",
              price: { amount: "260.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "UK 10" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-005-uk12",
              title: "UK 12",
              price: { amount: "260.00", currencyCode: "USD" },
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
      id: "gid://shopify/Product/nn-006",
      title: "Atelier Swatch Box & Design Consultation",
      description:
        "Curated swatch book of 12 authentic Ghanaian wax prints, bridal corded lace samples, and hand-woven Kente swatches. Includes a 45-minute virtual or in-person design consultation with designer Mau.",
      handle: "atelier-swatch-box",
      priceRange: {
        minVariantPrice: { amount: "45.00", currencyCode: "USD" },
      },
      images: {
        edges: [{ node: { url: fabricSamples, altText: "Atelier Swatch Box and fabric samples" } }],
      },
      options: [
        {
          name: "Consultation Type",
          values: ["Virtual (WhatsApp/Zoom)", "In-Person (Kasoa Atelier)"],
        },
      ],
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-006-virtual",
              title: "Virtual (WhatsApp/Zoom)",
              price: { amount: "45.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Consultation Type", value: "Virtual (WhatsApp/Zoom)" }],
            },
          },
          {
            node: {
              id: "gid://shopify/ProductVariant/nn-006-inperson",
              title: "In-Person (Kasoa Atelier)",
              price: { amount: "45.00", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [{ name: "Consultation Type", value: "In-Person (Kasoa Atelier)" }],
            },
          },
        ],
      },
    },
  },
];
