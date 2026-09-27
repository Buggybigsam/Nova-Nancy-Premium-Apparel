import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

/**
 * Editorial reveal container.
 * Guaranteed to be visible immediately without opacity: 0 suppression.
 */
export function Reveal({ children, className = "" }: RevealProps) {
  return <div className={`transition-opacity duration-500 ${className}`}>{children}</div>;
}

/**
 * Editorial float container for hero imagery and accents.
 */
export function Float({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
