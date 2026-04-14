import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = {
  gains: "#34d399",
  harvested: "#fbbf24",
  remaining: "#ef4444",
  neutral: "#6b7280",
};

/**
 * DonutChart — Portfolio composition:
 * Total Gains / Harvested Losses / Remaining Losses / Neutral
 * Center label: "Tax Saved: $X"
 */
export default function DonutChart({
  totalUnrealizedGains,
  totalHarvested,
  totalUnrealizedLosses,
  neutralCount,
  taxSaved,
  positionsWithPnL,
}) {
  const data = useMemo(() => {
    const totalLossAbs = Math.abs(totalUnrealizedLosses);
    const harvestedAbs = totalHarvested;
    const remainingLoss = Math.max(0, totalLossAbs - harvestedAbs);
    const neutralValue =
      positionsWithPnL
        .filter((p) => p.type === "NEUTRAL")
        .reduce((s, p) => s + p.positionValue, 0) || 1;

    return [
      { name: "Total Gains", value: Math.max(0, totalUnrealizedGains), color: COLORS.gains },
      { name: "Harvested Losses", value: harvestedAbs, color: COLORS.harvested },
      { name: "Remaining Losses", value: remainingLoss, color: COLORS.remaining },
      { name: "Neutral", value: neutralValue, color: COLORS.neutral },
    ].filter((d) => d.value > 0);
  }, [totalUnrealizedGains, totalHarvested, totalUnrealizedLosses, neutralCount, positionsWithPnL]);

  const fmt = (v) =>
    v.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800/60 p-5">
      <h2 className="text-lg font-semibold text-gray-200 mb-4">
        Portfolio Composition
      </h2>

      <div className="relative" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#e5e7eb",
              }}
              formatter={(value) => [`$${fmt(value)}`, null]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] uppercase tracking-wider text-gray-500">
            Tax Saved
          </span>
          <span className="text-lg font-bold text-amber-400">
            ${fmt(taxSaved)}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-3">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-400">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            {d.name}
          </div>
        ))}
      </div>
    </div>
  );
}
