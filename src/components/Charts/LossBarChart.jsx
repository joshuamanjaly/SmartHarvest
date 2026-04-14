import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Rectangle,
} from "recharts";

const SECTOR_COLORS = {
  tech: "#8b5cf6",
  healthcare: "#06b6d4",
  energy: "#f59e0b",
  finance: "#3b82f6",
  consumer: "#ec4899",
  crypto: "#f97316",
};

/**
 * LossBarChart — Top 10 loss contributors
 * Color-coded by sector, harvest candidates have a distinct border
 */
export default function LossBarChart({ rankedLosses, selected }) {
  const selectedTickers = useMemo(
    () => new Set(selected.map((s) => s.ticker)),
    [selected]
  );

  const top10 = useMemo(() => {
    return rankedLosses
      .slice(0, 10)
      .map((pos) => ({
        ticker: pos.ticker,
        company: pos.companyName,
        sector: pos.sector,
        loss: Math.abs(pos.unrealizedPnL),
        taxImpact: Math.abs(pos.taxImpact),
        efficiency: pos.efficiencyScore,
        isSelected: selectedTickers.has(pos.ticker),
        fill: SECTOR_COLORS[pos.sector] || "#6b7280",
      }));
  }, [rankedLosses, selectedTickers]);

  const fmt = (v) =>
    v.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800/60 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-200">
          Top 10 Loss Contributors
        </h2>
        <div className="flex items-center gap-1 text-[10px] text-gray-500">
          <span className="w-3 h-1.5 rounded bg-amber-400 inline-block" />
          = Harvest Candidate
        </div>
      </div>

      <div style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={top10}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1f2937"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 10, fill: "#6b7280" }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              axisLine={{ stroke: "#374151" }}
            />
            <YAxis
              type="category"
              dataKey="ticker"
              width={50}
              tick={{ fontSize: 11, fill: "#d1d5db", fontWeight: 600 }}
              axisLine={{ stroke: "#374151" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#e5e7eb",
              }}
              formatter={(value) => [`$${fmt(value)}`, "Loss"]}
              labelFormatter={(label) => {
                const item = top10.find((d) => d.ticker === label);
                return item ? `${label} — ${item.company}` : label;
              }}
            />
            <Bar
              dataKey="loss"
              barSize={22}
              radius={[0, 3, 3, 0]}
              activeBar={<Rectangle stroke="#fbbf24" strokeWidth={2} />}
            >
              {top10.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={entry.fill}
                  opacity={entry.isSelected ? 1 : 0.45}
                  stroke={entry.isSelected ? "#fbbf24" : "none"}
                  strokeWidth={entry.isSelected ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sector legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-3">
        {Object.entries(SECTOR_COLORS).map(([sector, color]) => (
          <div key={sector} className="flex items-center gap-1.5 text-[10px] text-gray-500 capitalize">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            {sector}
          </div>
        ))}
      </div>
    </div>
  );
}
