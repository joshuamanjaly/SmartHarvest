import { useCallback } from "react";

/**
 * Header — Clean typographic logo, API badge, scenario buttons with active state
 */
export default function Header({ dataSource, totalGains, onScenario, activeScenario }) {
  const scenarios = [
    { label: "Conservative", pct: 0.25, color: "from-blue-500 to-cyan-500", activeRing: "ring-blue-500/30" },
    { label: "Balanced", pct: 0.5, color: "from-violet-500 to-purple-500", activeRing: "ring-violet-500/30" },
    { label: "Aggressive", pct: 1.0, color: "from-rose-500 to-orange-500", activeRing: "ring-rose-500/30" },
  ];

  const handleScenario = useCallback(
    (pct) => {
      onScenario(Math.round(totalGains * pct));
    },
    [totalGains, onScenario]
  );

  const currentPct = totalGains > 0 ? activeScenario / totalGains : 0;

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
      {/* Left — logo + badge */}
      <div className="flex items-center gap-4">
        <div className="relative">
          {/* Subtle glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-50 animate-[pulseGlow_4s_ease-in-out_infinite]" />
          <div className="relative">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Smart<span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Harvest</span>
            </h1>
            <div className="h-0.5 mt-1 bg-gradient-to-r from-emerald-500/60 via-teal-500/40 to-transparent rounded-full" />
          </div>
        </div>

        <span
          className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm ${
            dataSource === "live"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          }`}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle animate-pulse"
            style={{ backgroundColor: dataSource === "live" ? "#34d399" : "#fbbf24" }}
          />
          {dataSource === "live" ? "Live" : "Mock"}
        </span>
      </div>

      {/* Right — scenario buttons */}
      <div className="glass-panel px-2 py-2 flex items-center gap-1.5">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium px-2 hidden sm:block">Scenario</span>
        {scenarios.map((s) => {
          const isActive = Math.abs(currentPct - s.pct) < 0.01;
          return (
            <button
              key={s.label}
              onClick={() => handleScenario(s.pct)}
              className={`
                relative px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider
                transition-all duration-300 cursor-pointer
                group overflow-hidden
                ${isActive
                  ? `bg-gradient-to-r ${s.color} text-white shadow-lg ring-2 ${s.activeRing}`
                  : "bg-white/[0.03] text-gray-400 border border-white/[0.04] hover:bg-white/[0.06] hover:text-gray-200"
                }
              `}
            >
              {!isActive && (
                <span className={`absolute inset-0 bg-gradient-to-r ${s.color} opacity-0 group-hover:opacity-10 transition-opacity duration-200`} />
              )}
              <span className="relative">{s.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
