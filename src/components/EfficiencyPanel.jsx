import { useMemo, useRef, useEffect, useState } from "react";

/**
 * EfficiencyPanel — All LOSS positions sorted by efficiencyScore
 * Horizontal bar per asset (width = score relative to max)
 * Selected assets highlighted, non-selected dimmed
 * Rows flash GREEN when entering selection, RED when exiting
 * All transitions via CSS for 60fps performance
 */
export default function EfficiencyPanel({ rankedLosses, selected }) {
  const selectedTickers = useMemo(
    () => new Set(selected.map((s) => s.ticker)),
    [selected]
  );

  // Track previous selection to detect enter/exit transitions
  const prevSelectedRef = useRef(new Set());
  const [flashStates, setFlashStates] = useState({});

  useEffect(() => {
    const prev = prevSelectedRef.current;
    const curr = selectedTickers;
    const newFlash = {};

    // Entered selection (not in prev, in curr)
    for (const ticker of curr) {
      if (!prev.has(ticker)) {
        newFlash[ticker] = "enter";
      }
    }

    // Exited selection (in prev, not in curr)
    for (const ticker of prev) {
      if (!curr.has(ticker)) {
        newFlash[ticker] = "exit";
      }
    }

    if (Object.keys(newFlash).length > 0) {
      setFlashStates(newFlash);

      // Clear flash states after animation completes (400ms)
      const timer = setTimeout(() => setFlashStates({}), 450);
      return () => clearTimeout(timer);
    }

    prevSelectedRef.current = new Set(curr);
  }, [selectedTickers]);

  // Update prev ref after flash states are applied
  useEffect(() => {
    prevSelectedRef.current = new Set(selectedTickers);
  }, [selectedTickers]);

  const maxScore = useMemo(
    () =>
      rankedLosses.length > 0
        ? Math.max(...rankedLosses.map((r) => r.efficiencyScore))
        : 1,
    [rankedLosses]
  );

  const fmt = (v) =>
    v.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800/60 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800/60 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-200">
          Efficiency Ranking
        </h2>
        <span className="text-xs text-gray-500">
          {selected.length} of {rankedLosses.length} selected
        </span>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {rankedLosses.map((pos, idx) => {
          const isSelected = selectedTickers.has(pos.ticker);
          const barWidth = (pos.efficiencyScore / maxScore) * 100;
          const flash = flashStates[pos.ticker];

          return (
            <div
              key={pos.ticker}
              className={`
                flex items-center gap-3 px-5 py-3 border-b border-gray-800/30
                transition-all duration-300
                ${
                  isSelected
                    ? "bg-emerald-500/[0.06] border-l-2 border-l-emerald-400"
                    : "opacity-40 hover:opacity-60 border-l-2 border-l-transparent"
                }
              `}
              style={{
                animation: flash === "enter"
                  ? "flashGreen 0.4s ease-out"
                  : flash === "exit"
                  ? "flashRed 0.4s ease-out"
                  : undefined,
              }}
            >
              {/* Rank */}
              <span className="text-xs font-bold text-gray-600 w-6 text-right shrink-0">
                #{idx + 1}
              </span>

              {/* Ticker + Company */}
              <div className="w-32 shrink-0">
                <span className="font-semibold text-white text-sm">
                  {pos.ticker}
                </span>
                <p className="text-[10px] text-gray-500 truncate">
                  {pos.companyName}
                </p>
              </div>

              {/* Efficiency bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isSelected
                          ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                          : "bg-gray-700"
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs font-mono shrink-0 ${
                      isSelected ? "text-emerald-400" : "text-gray-600"
                    }`}
                  >
                    {pos.efficiencyScore.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Tax impact */}
              <div className="text-right shrink-0 w-24">
                <span className="text-xs text-red-400 font-medium">
                  ${fmt(Math.abs(pos.taxImpact))}
                </span>
                <p className="text-[10px] text-gray-600">tax impact</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CSS keyframe animations — GPU-accelerated, 60fps */}
      <style>{`
        @keyframes flashGreen {
          0% { background-color: rgba(16, 185, 129, 0.25); }
          100% { background-color: rgba(16, 185, 129, 0.04); }
        }
        @keyframes flashRed {
          0% { background-color: rgba(239, 68, 68, 0.25); }
          100% { background-color: transparent; }
        }
      `}</style>
    </div>
  );
}
