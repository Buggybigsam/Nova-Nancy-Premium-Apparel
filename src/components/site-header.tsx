import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth, useUserRoles, signOutAndRedirect } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRound, MessageCircle } from "lucide-react";
import { CartDrawer } from "@/components/shop/cart-drawer";
import { WHATSAPP_URL } from "@/components/whatsapp-button";
import { SocialLinks } from "@/components/social-links";

export function SiteHeader() {
  const { user, loading } = useAuth();
  const { primary } = useUserRoles(user?.id);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-border/60 bg-background/80 px-6 py-5 backdrop-blur-md md:px-10">
      <Link to="/" className="font-serif text-xl font-bold tracking-tight md:text-2xl">
        NOVA <span className="italic font-normal">NANCY</span>
      </Link>
      <div className="hidden gap-10 text-[11px] font-medium uppercase tracking-[0.25em] md:flex">
        <Link to="/" className="transition-colors hover:text-accent">Home</Link>
        <Link to="/designers" className="transition-colors hover:text-accent">The Designer</Link>
        <Link to="/portfolio" className="transition-colors hover:text-accent">Portfolio</Link>
        <Link to="/services" className="transition-colors hover:text-accent">Services</Link>

        <Link to="/shop" className="transition-colors hover:text-accent">Shop</Link>
        <Link to="/custom-order" className="transition-colors hover:text-accent">Design Your Outfit</Link>
        <Link to="/track" className="transition-colors hover:text-accent">Track Order</Link>
        <Link to="/" hash="contact" className="transition-colors hover:text-accent">Contact</Link>

      </div>
      <div className="flex items-center gap-3 md:gap-5">
        <SocialLinks variant="row" className="hidden sm:flex gap-1" />
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="flex h-9 w-9 items-center justify-center text-foreground transition-colors hover:text-[#25D366]"
        >
          <MessageCircle className="h-5 w-5" />
        </a>
        <CartDrawer />
        {loading ? (
          <div className="h-9 w-24 animate-pulse bg-muted" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] hover:text-accent">
              <UserRound className="h-4 w-4" />
              <span className="hidden sm:inline">{user.email?.split("@")[0]}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="text-xs text-muted-foreground">Signed in as</div>
                <div className="truncate text-sm">{user.email}</div>
                <div className="mt-1 text-[10px] uppercase tracking-widest text-accent">{primary}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: "/dashboard" })}>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOutAndRedirect()}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            to="/auth"
            className="hidden text-[11px] font-medium uppercase tracking-[0.25em] transition-colors hover:text-accent sm:inline"
          >
            Sign in
          </Link>
        )}
        <Link
          to={user ? "/dashboard" : "/auth"}
          className="bg-primary px-5 py-3 text-[10px] font-medium uppercase tracking-[0.25em] text-primary-foreground transition-colors duration-300 hover:bg-accent md:px-6 md:py-3.5"
        >
          {user ? "Dashboard" : "Book Fitting"}
        </Link>
      </div>
    </nav>
  );
}
