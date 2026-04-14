import { useCallback } from "react";

/**
 * Header — App name, API status badge, scenario buttons
 * Scenario presets: Conservative (25%), Balanced (50%), Aggressive (100%)
 */
export default function Header({ dataSource, totalGains, onScenario }) {
  const scenarios = [
    { label: "Conservative", pct: 0.25, color: "from-blue-500 to-cyan-500" },
    { label: "Balanced", pct: 0.5, color: "from-violet-500 to-purple-500" },
    { label: "Aggressive", pct: 1.0, color: "from-rose-500 to-orange-500" },
  ];

  const handleScenario = useCallback(
    (pct) => {
      onScenario(Math.round(totalGains * pct));
    },
    [totalGains, onScenario]
  );

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
      {/* Left — title + badge */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg blur-sm opacity-40"></div>
          <h1 className="relative text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            🌾 Tax-Loss Harvesting Simulator
          </h1>
        </div>

        <span
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm ${
            dataSource === "live"
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-emerald-500/10 shadow-lg"
              : "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-amber-500/10 shadow-lg"
          }`}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle animate-pulse"
            style={{ backgroundColor: dataSource === "live" ? "#34d399" : "#fbbf24" }}
          />
          {dataSource === "live" ? "Live Data" : "Mock Data"}
        </span>
      </div>

      {/* Right — scenario buttons */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 uppercase tracking-wide mr-1">Scenario:</span>
        {scenarios.map((s) => (
          <button
            key={s.label}
            onClick={() => handleScenario(s.pct)}
            className={`
              relative px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider
              bg-gray-800/80 text-gray-300 border border-gray-700/50
              hover:border-gray-600 hover:text-white
              transition-all duration-200 cursor-pointer
              group overflow-hidden
            `}
          >
            <span className={`absolute inset-0 bg-gradient-to-r ${s.color} opacity-0 group-hover:opacity-15 transition-opacity duration-200`}></span>
            <span className="relative">{s.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
}
