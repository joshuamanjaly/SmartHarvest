import { useMemo } from "react";
import { runHarvest } from "../utils/harvester";

/**
 * ScenarioComparison — Side-by-side display of Conservative / Balanced / Aggressive outcomes
 * Updates when portfolio data changes.
 */
export default function ScenarioComparison({ positions, totalGains }) {
  const scenarios = useMemo(() => {
    if (!positions.length || totalGains <= 0) return [];

    return [
      { label: "Conservative", pct: 0.25, color: "blue", gradient: "from-blue-500 to-cyan-500" },
      { label: "Balanced", pct: 0.5, color: "violet", gradient: "from-violet-500 to-purple-500" },
      { label: "Aggressive", pct: 1.0, color: "rose", gradient: "from-rose-500 to-orange-500" },
    ].map((s) => {
      const offset = Math.round(totalGains * s.pct);
      const result = runHarvest(positions, offset);
      return { ...s, offset, result };
    });
  }, [positions, totalGains]);

  const fmt = (v) =>
    v.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  if (scenarios.length === 0) return null;

  return (
    <div className="glass-panel overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800/60">
        <h2 className="text-lg font-semibold text-gray-200">
          Harvest Scenarios
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Side-by-side comparison of tax outcomes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-800/40">
        {scenarios.map((s) => {
          const r = s.result;
          const selectedCount = r.selected.length;

          return (
            <div key={s.label} className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full bg-gradient-to-r ${s.gradient}`}
                />
                <h3 className="font-semibold text-gray-200">{s.label}</h3>
                <span className="text-xs text-gray-600 ml-auto">
                  {(s.pct * 100).toFixed(0)}% offset
                </span>
              </div>

              {/* Metrics */}
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-600 mb-0.5">
                    Target Offset
                  </p>
                  <p className={`text-lg font-bold bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}>
                    ${fmt(s.offset)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-800/50 rounded-lg p-2.5">
                    <p className="text-[10px] text-gray-600">Tax Before</p>
                    <p className="text-sm font-semibold text-red-400">
                      ${fmt(r.taxBefore)}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-2.5">
                    <p className="text-[10px] text-gray-600">Tax After</p>
                    <p className="text-sm font-semibold text-emerald-400">
                      ${fmt(r.taxAfter)}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-3 border border-amber-500/10">
                  <p className="text-[10px] text-gray-600">Tax Saved</p>
                  <p className="text-xl font-bold text-amber-400">
                    ${fmt(r.taxSaved)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {r.savingsPct.toFixed(1)}% savings
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{selectedCount} positions harvested</span>
                  <span>${fmt(r.totalHarvested)} harvested</span>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${s.gradient} rounded-full transition-all duration-500`}
                    style={{ width: `${r.savingsPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
