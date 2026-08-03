import { useEffect, useRef, useState, type ComponentType } from "react";
import { useInView, useReducedMotion } from "motion/react";

import heroOrbit from "@/assets/lottie/hero-orbit.json";
import stitchDivider from "@/assets/lottie/stitch-divider.json";
import scrollCue from "@/assets/lottie/scroll-cue.json";

type PlayerProps = {
  animationData: object;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
};

interface LottieProps {
  animationData: unknown;
  loop?: boolean;
  className?: string;
  /** Only play once the element scrolls into view. */
  playOnView?: boolean;
}

/**
 * Client only Lottie wrapper. Renders nothing during SSR and respects
 * the user's reduced motion preference.
 */
export function Lottie({ animationData, loop = true, className, playOnView }: LottieProps) {
  const [Player, setPlayer] = useState<ComponentType<PlayerProps> | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();

  useEffect(() => {
    let active = true;
    import("lottie-react").then((mod) => {
      const resolved = ((mod as { default?: unknown }).default ??
        mod) as ComponentType<PlayerProps>;
      if (active) setPlayer(() => resolved);
    });
    return () => {
      active = false;
    };
  }, []);

  const shouldPlay = !reduce && (!playOnView || inView);

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {Player && (
        <Player
          animationData={animationData as object}
          loop={loop}
          autoplay={shouldPlay}
          className="h-full w-full"
        />
      )}
    </div>
  );
}

/** Slow rotating gold rings behind the hero imagery. */
export function HeroOrbit({ className }: { className?: string }) {
  return <Lottie animationData={heroOrbit} className={className} />;
}

/** Animated gold stitch that draws itself as a section divider. */
export function StitchDivider({ className }: { className?: string }) {
  return (
    <div className={`pointer-events-none w-full overflow-hidden ${className ?? ""}`}>
      <Lottie animationData={stitchDivider} loop={false} playOnView className="h-10 w-full" />
    </div>
  );
}

/** Small vertical scroll hint used at the bottom of the hero. */
export function ScrollCue({ className }: { className?: string }) {
  return <Lottie animationData={scrollCue} className={className} />;
}
