import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, Menu, X, User } from "lucide-react";
import { CartDrawer } from "@/components/shop/cart-drawer";
import { WHATSAPP_URL } from "@/components/whatsapp-button";
import { useAuth, useUserRoles, signOutAndRedirect } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { primary } = useUserRoles(user?.id);
  const navigate = useNavigate();

  const navLinks = [
    { label: "Home", to: "/" as const },
    { label: "Boutique", to: "/shop" as const },
    { label: "Bespoke", to: "/custom-order" as const },
    { label: "The Designer", to: "/designers" as const },
    { label: "Portfolio", to: "/portfolio" as const },
    { label: "Contact", to: "/contact" as const },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 px-6 py-4 backdrop-blur-md md:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={() => {
            if (typeof window !== "undefined") {
              if (window.location.hash) {
                window.history.replaceState(null, "", "/");
              }
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="font-serif text-xl font-bold tracking-tight md:text-2xl"
        >
          NOVA <span className="italic font-normal">NANCY</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 text-[11px] font-medium uppercase tracking-[0.25em] md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => {
                if (link.to === "/" && typeof window !== "undefined") {
                  if (window.location.hash) {
                    window.history.replaceState(null, "", "/");
                  }
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="transition-colors hover:text-accent"
              activeProps={{ className: "text-accent font-semibold" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-5">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex h-9 w-9 items-center justify-center text-foreground transition-colors hover:text-[#25D366]"
            title="Chat with Mau on WhatsApp"
          >
            <MessageCircle className="h-4.5 w-4.5" />
          </a>

          <CartDrawer />

          {/* Book Fitting CTA Button */}
          <Link
            to="/custom-order"
            className="hidden sm:inline-flex bg-primary px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.25em] text-primary-foreground transition-colors duration-300 hover:bg-accent"
          >
            Book Fitting
          </Link>

          {/* Admin / Logged In User Dropdown if authenticated */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground">
                <User className="h-4 w-4" />
                <span className="hidden lg:inline">{user.email?.split("@")[0]}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>
                  <div className="text-xs text-muted-foreground">Signed in as</div>
                  <div className="truncate text-xs font-semibold">{user.email}</div>
                  {primary && (
                    <div className="mt-1 text-[9px] uppercase tracking-widest text-accent">
                      {primary}
                    </div>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/admin/requests" })}>
                  Admin Orders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/dashboard" })}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOutAndRedirect()}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mt-4 border-t border-border pt-4 pb-6 md:hidden animate-fade-in">
          <nav className="flex flex-col space-y-4 text-xs uppercase tracking-[0.25em]">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (link.to === "/" && typeof window !== "undefined") {
                    if (window.location.hash) {
                      window.history.replaceState(null, "", "/");
                    }
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="py-1 transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border/50 flex flex-col gap-3">
              <Link
                to="/custom-order"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-primary py-3 text-[10px] font-medium uppercase tracking-[0.25em] text-primary-foreground hover:bg-accent"
              >
                Book a Fitting / Design Outfit
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center border border-[#25D366] text-[#25D366] py-3 text-[10px] font-medium uppercase tracking-[0.25em] flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" /> Message Mau on WhatsApp
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
