import { useCallback, useState } from "react";

/**
 * Header — Logo, data-source toggle, API badge, scenario buttons
 */
export default function Header({
  dataSource,
  totalGains,
  onScenario,
  activeScenario,
  onToggleDataSource,
  isLiveRequested,
  isSwitching,
  failedLive,
  fallbackReason,
  liveStats,
}) {
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

  /* Tooltip for fallback warning */
  const [showTooltip, setShowTooltip] = useState(false);

  const fallbackMessage = (() => {
    if (fallbackReason === "api_quota_exceeded") {
      return "Live data exceeded Alpha Vantage free-tier quota. Showing mock dataset.";
    }
    if (fallbackReason === "api_rate_limited") {
      return "Alpha Vantage rate limit reached. Showing mock dataset.";
    }
    if (fallbackReason === "missing_api_key") {
      return "Missing or invalid API key. Showing mock dataset.";
    }
    if (fallbackReason === "network_error") {
      return "Network/API request failed. Showing mock dataset.";
    }
    return "Live data fetch failed. Showing mock dataset.";
  })();

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
      {/* Left — logo + toggle + badge */}
      <div className="flex items-center gap-4 flex-wrap">
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

        {/* ── Data source toggle ── */}
        <div className="relative flex items-center gap-2.5">
          <div
            className="glass-panel px-3 py-2 rounded-xl flex items-center gap-3 cursor-pointer select-none"
            onClick={() => !isSwitching && onToggleDataSource?.()}
            id="data-source-toggle"
          >
            {/* Labels */}
            {/* <span className={`text-[10px] font-semibold uppercase tracking-wider transition-colors duration-200 ${
              !isLiveRequested ? "text-amber-400" : "text-gray-600"
            }`}>
              Mock
            </span> */}

            {/* Toggle track */}
            <div className={`relative w-10 h-[22px] rounded-full transition-all duration-300 ${isSwitching
                ? "bg-gray-700"
                : isLiveRequested
                  ? "bg-gradient-to-r from-emerald-600 to-teal-500 shadow-[0_0_12px_rgba(52,211,153,0.3)]"
                  : "bg-gradient-to-r from-amber-600 to-orange-500 shadow-[0_0_12px_rgba(251,191,36,0.2)]"
              }`}>
              {/* Thumb */}
              <div className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${isSwitching
                  ? "left-[12px] animate-pulse"
                  : isLiveRequested
                    ? "left-[22px]"
                    : "left-[3px]"
                }`} />
            </div>

            <div className="flex flex-col">
              <span className={`text-[10px] font-semibold uppercase tracking-wider transition-colors duration-200 ${isLiveRequested ? "text-emerald-400" : "text-amber-400"
                }`}>
                {isLiveRequested ? "Live" : "Mock"}
              </span>
              {isLiveRequested && !isSwitching && dataSource === "live" && liveStats && (
                <span className="text-[8px] text-gray-500 font-medium -mt-0.5">
                  ({liveStats.coveredCount}/{liveStats.total})
                </span>
              )}
              {isLiveRequested && !isSwitching && dataSource === "mock" && failedLive && (
                <span className="text-[8px] text-amber-400 font-semibold -mt-0.5 uppercase tracking-wider">
                  fallback
                </span>
              )}
            </div>
          </div>

          {/* Fallback warning tooltip */}
          {failedLive && dataSource === "mock" && isLiveRequested && !isSwitching && (
            <div
              className="relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 cursor-help text-xs font-bold">
                !
              </span>
              {showTooltip && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-56 p-3 glass-panel rounded-xl text-xs text-gray-300 leading-relaxed z-50 shadow-2xl"
                  style={{ animation: "fadeSlideUp 0.2s ease-out" }}
                >
                  <p className="font-semibold text-amber-400 mb-1">API Fallback</p>
                  <p>{fallbackMessage}</p>
                </div>
              )}
            </div>
          )}
        </div>
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
