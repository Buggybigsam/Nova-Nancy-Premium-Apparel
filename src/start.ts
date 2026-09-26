import { clerkMiddleware } from "@clerk/tanstack-react-start/server";
import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    if (error != null && typeof error === "object" && ("statusCode" in error || "status" in error)) {
      const status = (error as any).status ?? (error as any).statusCode;
      if (typeof status === "number" && status < 500) {
        throw error;
      }
    }
    console.error("[SSR_MIDDLEWARE_ERROR]", error);
    return new Response(renderErrorPage(error), {
      status: 500,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-ssr-error": String(error).replace(/[\r\n]+/g, " ").slice(0, 500),
      },
    });
  }
});

const clerkSecretKey =
  (typeof process !== "undefined" && process.env?.CLERK_SECRET_KEY) ||
  "sk_test_RHUrxDyvbUSfrO75RBwYgUEri9VIDXbOeXxJRaIhYH";

const clerkPublishableKey =
  (typeof process !== "undefined" && (process.env?.VITE_CLERK_PUBLISHABLE_KEY || process.env?.CLERK_PUBLISHABLE_KEY)) ||
  import.meta.env?.VITE_CLERK_PUBLISHABLE_KEY ||
  "pk_test_YWNlLXNoZWVwLTM2NS5jbGVyay5hY2NvdW50cy5kZXYk";

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [
    errorMiddleware,
    clerkMiddleware({
      secretKey: clerkSecretKey,
      publishableKey: clerkPublishableKey,
    }),
  ],
}));
