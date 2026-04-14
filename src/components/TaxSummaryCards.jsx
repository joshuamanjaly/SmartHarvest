import { useState, useEffect, useRef, useCallback } from "react";

/**
 * TaxSummaryCards — 3 side-by-side cards:
 *   Tax Before (red tint)
 *   Tax After (green tint)
 *   Tax Saved (amber, animated counter 0→final over 800ms)
 */
export default function TaxSummaryCards({ taxBefore, taxAfter, taxSaved, savingsPct }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Tax Before */}
      <div className="relative overflow-hidden bg-gray-900/80 backdrop-blur-sm rounded-xl border border-red-500/20 p-5 group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />
        <p className="text-xs font-semibold uppercase tracking-wider text-red-400/70 mb-1">
          Tax Before Harvesting
        </p>
        <p className="text-3xl font-bold text-red-400">
          ${taxBefore.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-gray-600 mt-2">Total tax liability on gains</p>
      </div>

      {/* Tax After */}
      <div className="relative overflow-hidden bg-gray-900/80 backdrop-blur-sm rounded-xl border border-emerald-500/20 p-5 group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400/70 mb-1">
          Tax After Harvesting
        </p>
        <p className="text-3xl font-bold text-emerald-400">
          ${taxAfter.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-gray-600 mt-2">Reduced liability after harvest</p>
      </div>

      {/* Tax Saved — animated counter */}
      <div className="relative overflow-hidden bg-gray-900/80 backdrop-blur-sm rounded-xl border border-amber-500/30 p-5 group shadow-lg shadow-amber-500/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500" />
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-400/70 mb-1">
          Tax Saved
        </p>
        <p className="text-4xl font-extrabold text-amber-400">
          $<AnimatedCounter value={taxSaved} duration={800} />
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold">
            {savingsPct.toFixed(1)}% saved
          </span>
          <span className="text-xs text-gray-600">of total tax bill</span>
        </div>
      </div>
    </div>
  );
}

/**
 * AnimatedCounter — ticks from previous value to new value over `duration` ms
 * Uses requestAnimationFrame for smooth 60fps animation.
 */
function AnimatedCounter({ value, duration = 800 }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);
  const rafRef = useRef(null);

  const animate = useCallback((from, to, dur) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / dur, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * eased;
      setDisplay(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    }

    rafRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    animate(prevRef.current, value, duration);
    prevRef.current = value;

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration, animate]);

  return display.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
