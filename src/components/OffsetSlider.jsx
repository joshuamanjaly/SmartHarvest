import { useMemo } from "react";

/**
 * OffsetSlider — Glass-panel slider with tick marks at 25/50/75%
 */
export default function OffsetSlider({ value, max, onChange }) {
  const pct = useMemo(() => (max > 0 ? (value / max) * 100 : 0), [value, max]);

  const gradientColor = useMemo(() => {
    if (pct < 33) return "from-blue-500 to-cyan-500";
    if (pct < 66) return "from-violet-500 to-purple-500";
    return "from-rose-500 to-orange-500";
  }, [pct]);

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400">
              <path d="M2 8h12M8 2v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="text-[15px] font-semibold text-gray-200">Target Offset</h2>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold font-mono-data bg-gradient-to-r ${gradientColor} bg-clip-text text-transparent`}>
            ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-gray-600 font-mono-data">
            / ${max.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Slider track */}
      <div className="relative mt-2 mb-4">
        <div className="relative h-2.5 bg-gray-800/80 rounded-full overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${gradientColor} rounded-full transition-[width] duration-75`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={max}
          step={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-2.5 opacity-0 cursor-pointer"
          aria-label="Target offset amount"
        />
        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white shadow-lg shadow-black/40 border-2 border-gray-500 pointer-events-none transition-[left] duration-75"
          style={{ left: `calc(${pct}% - 10px)` }}
        />
        {/* Tick marks */}
        {[25, 50, 75].map((tick) => (
          <div
            key={tick}
            className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-gray-700/60 pointer-events-none"
            style={{ left: `${tick}%` }}
          />
        ))}
      </div>

      {/* Labels */}
      <div className="relative text-[11px] text-gray-600 h-5">
        {/* $0 label — left edge */}
        <span className="absolute left-0 font-mono-data">$0</span>
        {/* 25 / 50 / 75 % tick labels — centred exactly on their marks */}
        {[25, 50, 75].map((tick) => (
          <span
            key={tick}
            className="absolute -translate-x-1/2 text-gray-600/50 font-mono-data"
            style={{ left: `${tick}%` }}
          >
            {tick}%
          </span>
        ))}
        {/* current pct — right edge */}
        <div className="absolute right-0 flex items-center gap-2">
          <span className={`font-semibold bg-gradient-to-r ${gradientColor} bg-clip-text text-transparent`}>
            {pct.toFixed(0)}%
          </span>
          <span className="text-gray-700">of gains</span>
        </div>
      </div>
    </div>
  );
}
