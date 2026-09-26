import { SignIn, SignUp, Show, UserButton } from "@clerk/tanstack-react-start";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in | Nova Nancy Atelier" },
      {
        name: "description",
        content:
          "Sign in or create your Nova Nancy account to book fittings and track custom orders.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-beige">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left Atelier Showcase */}
        <div className="relative hidden overflow-hidden bg-ink lg:block">
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-accent/40" />
          <div className="relative flex h-full flex-col justify-between p-12 text-cream">
            <Link to="/" className="font-serif text-2xl">
              NOVA <span className="italic font-normal">NANCY</span>
            </Link>
            <div>
              <span className="eyebrow">Atelier Access</span>
              <h1 className="mt-6 font-serif text-5xl leading-tight">
                Every stitch,
                <br />
                <span className="italic">yours to follow.</span>
              </h1>
              <p className="mt-6 max-w-md text-sm text-cream/70">
                Book fittings, upload references, message your designer, and watch each piece take
                shape, all in one place.
              </p>
            </div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-cream/50">
              Established 2015 · Kasoa · Milan
            </div>
          </div>
        </div>

        {/* Right Clerk Auth Card */}
        <div className="flex flex-col items-center justify-center px-6 py-16 lg:px-16">
          <div className="w-full max-w-md flex flex-col items-center">
            <Show when="signed-in">
              <div className="text-center p-8 bg-background border border-border/80 rounded-lg shadow-sm w-full space-y-4">
                <span className="eyebrow">Authenticated</span>
                <h2 className="font-serif text-3xl">You are signed in</h2>
                <div className="py-4 flex justify-center">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-16 h-16 ring-2 ring-accent",
                      },
                    }}
                  />
                </div>
                <div className="pt-2">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center bg-primary px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-accent"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            </Show>

            <Show when="signed-out">
              <div className="w-full flex justify-center">
                {isSignUp ? (
                  <div className="w-full">
                    <div className="mb-4 text-center">
                      <span className="eyebrow">Join the Atelier</span>
                      <h2 className="mt-2 font-serif text-3xl">Create your account</h2>
                    </div>
                    <SignUp routing="hash" signInUrl="/auth" fallbackRedirectUrl="/dashboard" />
                    <p className="mt-6 text-center text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <button
                        onClick={() => setIsSignUp(false)}
                        className="text-accent underline-offset-4 hover:underline"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="mb-4 text-center">
                      <span className="eyebrow">Welcome Back</span>
                      <h2 className="mt-2 font-serif text-3xl">Sign in to Nova Nancy</h2>
                    </div>
                    <SignIn routing="hash" signUpUrl="/auth" fallbackRedirectUrl="/dashboard" />
                    <p className="mt-6 text-center text-sm text-muted-foreground">
                      New to Nova Nancy?{" "}
                      <button
                        onClick={() => setIsSignUp(true)}
                        className="text-accent underline-offset-4 hover:underline"
                      >
                        Create an account
                      </button>
                    </p>
                  </div>
                )}
              </div>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}
