import { Instagram } from "lucide-react";
import type { SVGProps } from "react";
import { WHATSAPP_URL } from "@/components/whatsapp-button";

export const INSTAGRAM_HANDLE = "mau_real91";
export const SNAPCHAT_HANDLE = "mau.real";
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`;
export const SNAPCHAT_URL = `https://snapchat.com/add/${SNAPCHAT_HANDLE}`;

export function SnapchatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12.02 2c2.9 0 4.63 2.02 4.7 4.72.02.7-.03 1.35-.07 1.87.24.1.55.13.9.02.2-.06.42-.09.6-.03.36.11.6.4.6.75 0 .43-.34.75-1.02 1.02-.1.04-.24.08-.4.13-.5.15-1.24.38-1.44.85-.1.24-.06.55.13.92l.01.02c.06.13 1.53 3.1 4.4 3.58.25.04.43.26.42.51-.01.1-.03.2-.07.3-.25.6-1.32 1.02-3.28 1.32-.06.1-.13.44-.18.66-.04.2-.09.4-.16.63a.53.53 0 0 1-.55.4h-.03a3.4 3.4 0 0 1-.62-.08 5.2 5.2 0 0 0-1.06-.11c-.25 0-.5.02-.77.06-.52.09-.97.4-1.5.77-.75.53-1.6 1.12-2.9 1.12h-.15c-1.28 0-2.12-.6-2.87-1.12-.52-.37-.98-.68-1.5-.77a5.1 5.1 0 0 0-.77-.06c-.44 0-.8.07-1.06.12-.25.05-.46.09-.63.09a.54.54 0 0 1-.57-.42c-.06-.22-.11-.43-.15-.62-.05-.23-.12-.57-.19-.67-1.95-.3-3.02-.72-3.27-1.32a1.1 1.1 0 0 1-.08-.3.51.51 0 0 1 .43-.51c2.86-.47 4.33-3.45 4.4-3.58v-.02c.19-.37.24-.68.13-.92-.2-.47-.94-.7-1.43-.85-.17-.05-.31-.09-.42-.13-.9-.36-1.02-.77-.97-1.05.07-.38.5-.64.9-.64.11 0 .21.02.3.06.4.19.75.28 1.05.28.2 0 .34-.05.42-.09l-.07-1.15c-.16-2.7 1.29-5.13 4.53-5.55A6.5 6.5 0 0 1 12.02 2Z" />
    </svg>
  );
}

type Variant = "circle" | "row" | "dark";

interface SocialLinksProps {
  variant?: Variant;
  className?: string;
  includeWhatsApp?: boolean;
}

const shells: Record<Variant, string> = {
  circle:
    "flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:text-accent",
  row: "flex h-9 w-9 items-center justify-center text-foreground transition-colors hover:text-accent",
  dark: "flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground transition-colors hover:border-accent hover:text-accent",
};

export function SocialLinks({ variant = "circle", className = "", includeWhatsApp = false }: SocialLinksProps) {
  const shell = shells[variant];
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label={`Instagram @${INSTAGRAM_HANDLE}`} className={shell}>
        <Instagram className="h-4 w-4" />
      </a>
      <a href={SNAPCHAT_URL} target="_blank" rel="noopener noreferrer" aria-label={`Snapchat ${SNAPCHAT_HANDLE}`} className={shell}>
        <SnapchatIcon className="h-4 w-4" />
      </a>
      {includeWhatsApp && (
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp the designer" className={shell}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path d="M12.04 2A9.9 9.9 0 0 0 2.1 11.9c0 1.75.46 3.45 1.34 4.95L2 22l5.3-1.39a9.9 9.9 0 0 0 4.74 1.2h.01A9.9 9.9 0 0 0 22 11.92 9.9 9.9 0 0 0 12.04 2Zm5.8 14.05c-.24.68-1.4 1.3-1.94 1.35-.5.05-1.13.07-1.82-.11a16.6 16.6 0 0 1-1.65-.61c-2.9-1.25-4.79-4.17-4.94-4.37-.14-.2-1.18-1.57-1.18-3s.75-2.13 1.02-2.42c.27-.29.58-.36.78-.36l.56.01c.18.01.42-.07.66.5.24.58.83 2 .9 2.15.07.14.12.31.02.5-.1.2-.15.31-.29.48l-.44.51c-.14.14-.29.3-.13.59.17.29.74 1.22 1.59 1.98 1.09.97 2 1.27 2.29 1.41.29.15.46.12.63-.07.17-.2.72-.84.91-1.13.19-.29.39-.24.65-.14.27.1 1.68.79 1.97.94.29.14.48.21.55.33.07.12.07.7-.17 1.38Z" />
          </svg>
        </a>
      )}
    </div>
  );
}
