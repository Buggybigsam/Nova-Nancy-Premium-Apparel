// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    preset: process.env.NITRO_PRESET || (process.env.VERCEL ? "vercel" : undefined),
  },
  vite: {
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
        process.env.VITE_SUPABASE_URL ||
          process.env.SUPABASE_URL ||
          "https://igqrzlxjfyfoxbzejapf.supabase.co"
      ),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(
        process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
          process.env.SUPABASE_PUBLISHABLE_KEY ||
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlncXJ6bHhqZnlmb3hiemVqYXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0NjA5NzksImV4cCI6MjA5OTAzNjk3OX0.eheex0XqLaP0xc143xQM8jawRS9La4CgMsNV1hmzG9k"
      ),
      "import.meta.env.VITE_CLERK_PUBLISHABLE_KEY": JSON.stringify(
        process.env.VITE_CLERK_PUBLISHABLE_KEY ||
          process.env.CLERK_PUBLISHABLE_KEY ||
          "pk_test_YWNlLXNoZWVwLTM2NS5jbGVyay5hY2NvdW50cy5kZXYk"
      ),
    },
  },
});
