import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/**
 * SectorChart — Stacked bar chart showing gains vs losses per sector
 * by total dollar value
 */
export default function SectorChart({ positionsWithPnL }) {
  const data = useMemo(() => {
    const sectorMap = {};

    positionsWithPnL.forEach((pos) => {
      if (!sectorMap[pos.sector]) {
        sectorMap[pos.sector] = { sector: pos.sector, gains: 0, losses: 0 };
      }
      if (pos.type === "GAIN") {
        sectorMap[pos.sector].gains += pos.unrealizedPnL;
      } else if (pos.type === "LOSS") {
        sectorMap[pos.sector].losses += Math.abs(pos.unrealizedPnL);
      }
    });

    return Object.values(sectorMap)
      .map((s) => ({
        ...s,
        sector: s.sector.charAt(0).toUpperCase() + s.sector.slice(1),
        gains: Math.round(s.gains * 100) / 100,
        losses: Math.round(s.losses * 100) / 100,
      }))
      .sort((a, b) => (b.gains + b.losses) - (a.gains + a.losses));
  }, [positionsWithPnL]);

  const fmt = (v) =>
    v.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="glass-panel p-5">
      <h2 className="text-lg font-semibold text-gray-200 mb-4">
        Sector P&L Breakdown
      </h2>

      <div style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1f2937"
              vertical={false}
            />
            <XAxis
              dataKey="sector"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={{ stroke: "#374151" }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#6b7280" }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
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
              formatter={(value, name) => [
                `$${fmt(value)}`,
                name === "gains" ? "Gains" : "Losses",
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", color: "#9ca3af" }}
              formatter={(value) =>
                value === "gains" ? "Gains" : "Losses"
              }
            />
            <Bar
              dataKey="gains"
              stackId="pnl"
              fill="#34d399"
              radius={[0, 0, 0, 0]}
              name="gains"
            />
            <Bar
              dataKey="losses"
              stackId="pnl"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              name="losses"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
