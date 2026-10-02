import { ClerkProvider } from "@clerk/tanstack-react-start";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/400-italic.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { useCartSync } from "@/hooks/use-cart-sync";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <span className="eyebrow">Error 404</span>
        <h1 className="mt-4 font-serif text-6xl">Page not found</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The page you're looking for has drifted from the atelier.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-primary px-8 py-4 text-[11px] font-medium uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-accent"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <span className="eyebrow">Something amiss</span>
        <h1 className="mt-4 font-serif text-3xl">This page didn't load</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Please try again in a moment or return to the homepage.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center bg-primary px-6 py-3 text-[11px] font-medium uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-accent"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center border border-input px-6 py-3 text-[11px] font-medium uppercase tracking-[0.25em] text-foreground transition-colors hover:bg-secondary"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Nova Nancy Premium Apparel | Bespoke Couture & Custom Tailoring Atelier" },
      {
        name: "description",
        content:
          "Nova Nancy Premium Apparel is a luxury couture atelier for bespoke tailoring, bridal, and ceremonial wear, handcrafted in Kasoa, Ghana by designer Mau.",
      },
      { name: "author", content: "Nova Nancy Premium Apparel" },
      { name: "theme-color", content: "#0a0a0a" },
      { name: "msapplication-navbutton-color", content: "#0a0a0a" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },

      // Open Graph Tags (WhatsApp, LinkedIn, Facebook)
      { property: "og:site_name", content: "Nova Nancy Premium Apparel" },
      { property: "og:title", content: "Nova Nancy Premium Apparel | Bespoke Couture & Custom Tailoring Atelier" },
      {
        property: "og:description",
        content:
          "Bespoke tailoring that marries ancestral craftsmanship with modern silhouettes. Handcrafted couture, bridal, and ceremonial wear in Kasoa, Ghana.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://nova-stitch-studio.vercel.app" },
      { property: "og:image", content: "https://nova-stitch-studio.vercel.app/og-banner.png" },
      { property: "og:image:secure_url", content: "https://nova-stitch-studio.vercel.app/og-banner.png" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1024" },
      { property: "og:image:height", content: "575" },
      { property: "og:image:alt", content: "Nova Nancy Premium Apparel — Luxury Bespoke Couture Atelier" },

      // Twitter / X Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Nova Nancy Premium Apparel | Bespoke Couture Atelier" },
      {
        name: "twitter:description",
        content:
          "Bespoke tailoring that marries ancestral craftsmanship with modern silhouettes. Handcrafted couture in Kasoa, Ghana.",
      },
      { name: "twitter:image", content: "https://nova-stitch-studio.vercel.app/og-banner.png" },
      { name: "twitter:image:alt", content: "Nova Nancy Premium Apparel Social Banner" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/sticker.webp", type: "image/webp" },
      { rel: "shortcut icon", href: "/sticker.webp" },
      { rel: "apple-touch-icon", href: "/sticker.webp" },
      { rel: "canonical", href: "https://nova-stitch-studio.vercel.app" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const clerkPublishableKey =
  (typeof process !== "undefined" && (process.env?.VITE_CLERK_PUBLISHABLE_KEY || process.env?.CLERK_PUBLISHABLE_KEY)) ||
  (import.meta as any).env?.VITE_CLERK_PUBLISHABLE_KEY ||
  "pk_test_YWNlLXNoZWVwLTM2NS5jbGVyay5hY2NvdW50cy5kZXYk";

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ClerkProvider publishableKey={clerkPublishableKey} afterSignOutUrl="/">
          {children}
          <Scripts />
        </ClerkProvider>
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useCartSync();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
