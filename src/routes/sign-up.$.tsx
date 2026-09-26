import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-up/$")({
  component: Page,
});

function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-3xl font-bold">Welcome to Nova Nancy</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          No sign up or account is required. Browse the collection, customize your couture garments, and order directly.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex bg-primary px-8 py-4 text-[11px] font-medium uppercase tracking-[0.25em] text-primary-foreground hover:bg-accent"
          >
            Explore the Atelier
          </Link>
        </div>
      </div>
    </div>
  );
}
