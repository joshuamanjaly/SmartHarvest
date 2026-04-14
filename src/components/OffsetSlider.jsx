import { useMemo } from "react";

/**
 * OffsetSlider — Range: $0 to total gains, step $100
 * Live label showing selected dollar amount.
 * Every input event reruns runHarvest() via parent state update.
 */
export default function OffsetSlider({ value, max, onChange }) {
  const pct = useMemo(() => (max > 0 ? (value / max) * 100 : 0), [value, max]);

  // Gradient color stops based on percentage
  const gradientColor = useMemo(() => {
    if (pct < 33) return "from-blue-500 to-cyan-500";
    if (pct < 66) return "from-violet-500 to-purple-500";
    return "from-rose-500 to-orange-500";
  }, [pct]);

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800/60 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-200">Target Offset</h2>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold bg-gradient-to-r ${gradientColor} bg-clip-text text-transparent`}>
            ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-gray-500">
            / ${max.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Slider track */}
      <div className="relative mt-2 mb-3">
        <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
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
          className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
          aria-label="Target offset amount"
        />
        {/* Thumb indicator */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg shadow-black/30 border-2 border-gray-600 pointer-events-none transition-[left] duration-75`}
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-gray-600">
        <span>$0</span>
        <span className="text-gray-500">{pct.toFixed(0)}% of gains</span>
        <span>${max.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
    </div>
  );
}
