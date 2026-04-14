import { useMemo, useState, useEffect } from "react";

/**
 * ReasoningCards — One card per selected harvest asset
 * Stagger-animated in: opacity 0→1 + translateY(8px→0), 120ms delay between each.
 * Re-triggers every time the selection changes.
 */
export default function ReasoningCards({ selected, targetOffset }) {
  // Generate a key from selected tickers to force re-mount on selection change
  const selectionKey = useMemo(
    () => selected.map((s) => s.ticker).join(","),
    [selected]
  );

  const fmt = (v) =>
    Math.abs(v).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const generateReasoning = (pos, rank) => {
    if (rank === 1) return `Highest efficiency — saves $${pos.efficiencyScore.toFixed(2)} per dollar at risk`;
    if (pos.efficiencyScore > 0.15) return `Strong efficiency — high tax impact relative to position size`;
    if (pos.holdingDays >= 365) return `Long-term holding — lower tax rate amplifies net savings`;
    if (Math.abs(pos.unrealizedPnL) > 10000) return `Large loss position — significant absolute tax offset`;
    return `Selected to meet target — contributes ${pos.offsetContribution.toFixed(1)}% of offset goal`;
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800/60 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800/60 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-200">
          Harvest Reasoning
        </h2>
        <span className="text-xs text-gray-500">
          {selected.length} positions selected
        </span>
      </div>

      {/* Key forces full re-mount → re-triggers all stagger animations */}
      <div key={selectionKey} className="max-h-[500px] overflow-y-auto p-4 space-y-3">
        {selected.map((pos, idx) => (
          <div
            key={pos.ticker}
            className="bg-gray-800/50 border border-gray-700/40 rounded-lg p-4 hover:border-emerald-500/30 transition-all duration-200"
            style={{
              opacity: 0,
              animation: `staggerIn 0.4s ease-out ${idx * 120}ms forwards`,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              {/* Left — rank + info */}
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-emerald-400">
                    #{idx + 1}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white">
                      {pos.ticker}
                    </span>
                    <span className="text-xs text-gray-500 truncate">
                      {pos.companyName}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium uppercase bg-gray-700/50 text-gray-400 capitalize">
                      {pos.sector}
                    </span>
                  </div>

                  {/* Metrics row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    <span className="text-gray-400">
                      Efficiency:{" "}
                      <span className="text-emerald-400 font-semibold">
                        {pos.efficiencyScore.toFixed(3)}
                      </span>
                    </span>
                    <span className="text-gray-400">
                      Loss:{" "}
                      <span className="text-red-400 font-semibold">
                        ${fmt(pos.unrealizedPnL)}
                      </span>
                    </span>
                    <span className="text-gray-400">
                      Tax Saved:{" "}
                      <span className="text-amber-400 font-semibold">
                        ${fmt(pos.taxImpact)}
                      </span>
                    </span>
                    <span className="text-gray-400">
                      Offset:{" "}
                      <span className="text-violet-400 font-semibold">
                        {pos.offsetContribution.toFixed(1)}%
                      </span>
                    </span>
                  </div>

                  {/* Reasoning line */}
                  <p className="text-[11px] text-gray-500 mt-2 italic">
                    &ldquo;{generateReasoning(pos, idx + 1)}&rdquo;
                  </p>
                </div>
              </div>

              {/* Right — hold period badge */}
              <div className="shrink-0 text-right">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    pos.holdingDays >= 365
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                  }`}
                >
                  {pos.holdingDays >= 365 ? "Long-Term" : "Short-Term"}
                </span>
                <p className="text-[10px] text-gray-600 mt-1">
                  {pos.holdingDays}d held
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stagger animation — CSS-only, 60fps */}
      <style>{`
        @keyframes staggerIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
