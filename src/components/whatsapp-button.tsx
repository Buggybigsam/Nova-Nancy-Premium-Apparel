import { MessageCircle } from "lucide-react";

// Nova Nancy private line, international format without spaces, leading +, or the (0) trunk prefix.
export const WHATSAPP_NUMBER = "233550501177";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello Nova Nancy, I would like to speak with a designer about a custom garment.",
);

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

interface WhatsAppButtonProps {
  variant?: "fab" | "inline" | "outline";
  label?: string;
  className?: string;
}

export function WhatsAppButton({ variant = "inline", label, className = "" }: WhatsAppButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-none transition-all duration-300";

  const variantClasses = {
    fab: "fixed bottom-6 right-6 z-50 h-14 w-14 bg-[#25D366] text-white shadow-2xl hover:scale-110 hover:shadow-xl",
    inline:
      "bg-[#25D366] px-5 py-3 text-[10px] font-medium uppercase tracking-[0.25em] text-white hover:bg-[#128C7E]",
    outline:
      "border border-[#25D366] px-5 py-3 text-[10px] font-medium uppercase tracking-[0.25em] text-[#25D366] hover:bg-[#25D366] hover:text-white",
  };

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Nova Nancy on WhatsApp"
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <MessageCircle className="h-5 w-5 fill-current" />
      {variant !== "fab" && label}
    </a>
  );
}
