import { useState, useEffect, useRef, useCallback } from "react";

/**
 * TaxSummaryCards — 3 glass-panel cards with icon indicators and animated counter
 */
export default function TaxSummaryCards({ taxBefore, taxAfter, taxSaved, savingsPct }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Tax Before */}
      <div className="glass-panel relative overflow-hidden p-6 group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/[0.04] rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-red-500/[0.03] rounded-full translate-y-10 -translate-x-10" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/15 flex items-center justify-center">
              <span className="text-red-400 text-xs">▼</span>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-red-400/60">
              Tax Before Harvesting
            </p>
          </div>
          <p className="text-3xl font-bold text-red-400 font-mono-data">
            ${taxBefore.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-gray-600 mt-2">Total tax liability on gains</p>
        </div>
      </div>

      {/* Tax After */}
      <div className="glass-panel relative overflow-hidden p-6 group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.04] rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-emerald-500/[0.03] rounded-full translate-y-10 -translate-x-10" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center">
              <span className="text-emerald-400 text-xs">▲</span>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400/60">
              Tax After Harvesting
            </p>
          </div>
          <p className="text-3xl font-bold text-emerald-400 font-mono-data">
            ${taxAfter.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-gray-600 mt-2">Reduced liability after harvest</p>
        </div>
      </div>

      {/* Tax Saved — animated counter */}
      <div className="glass-panel relative overflow-hidden p-6 group shadow-lg shadow-amber-500/[0.03]">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/[0.04] rounded-full -translate-y-14 translate-x-14 group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/[0.03] rounded-full translate-y-12 -translate-x-12" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/15 flex items-center justify-center">
              <span className="text-amber-400 text-xs">★</span>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400/60">
              Tax Saved
            </p>
          </div>
          <p className="text-4xl font-extrabold text-amber-400 font-mono-data">
            $<AnimatedCounter value={taxSaved} duration={800} />
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/15">
              {savingsPct.toFixed(1)}% saved
            </span>
            <span className="text-[11px] text-gray-600">of total tax bill</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * AnimatedCounter — ticks from previous value to new value over `duration` ms
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
