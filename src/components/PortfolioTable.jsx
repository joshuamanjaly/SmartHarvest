import { useState, useMemo, useCallback } from "react";

const WASH_SALE_DAYS = 30;

/**
 * PortfolioTable — Sortable columns, colored rows, inline editing, wash-sale badge
 * Receives computed positionsWithPnL — never runs calculations itself.
 */
export default function PortfolioTable({ positionsWithPnL, onUpdatePosition }) {
  const [sortKey, setSortKey] = useState("ticker");
  const [sortDir, setSortDir] = useState("asc");
  const [editCell, setEditCell] = useState(null); // { index, field }
  const [editValue, setEditValue] = useState("");

  // Column definitions
  const columns = [
    { key: "ticker", label: "Ticker", align: "left" },
    { key: "companyName", label: "Company", align: "left" },
    { key: "sector", label: "Sector", align: "left" },
    { key: "buyPrice", label: "Buy Price", align: "right", fmt: "$" },
    { key: "currentPrice", label: "Current Price", align: "right", fmt: "$", editable: true },
    { key: "quantity", label: "Qty", align: "right", editable: true },
    { key: "unrealizedPnL", label: "Unrealized P&L ($)", align: "right", fmt: "$" },
    { key: "pnlPct", label: "P&L (%)", align: "right", fmt: "%" },
    { key: "taxImpact", label: "Tax Impact", align: "right", fmt: "$" },
    { key: "holdingDays", label: "Hold Period", align: "right", fmt: "days" },
    { key: "type", label: "Type", align: "center" },
  ];

  // Sorted data
  const sortedPositions = useMemo(() => {
    const arr = [...positionsWithPnL];
    arr.sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];
      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });
    return arr;
  }, [positionsWithPnL, sortKey, sortDir]);

  // Toggle sort
  const handleSort = useCallback(
    (key) => {
      if (sortKey === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
    },
    [sortKey]
  );

  // Inline edit handlers
  const startEdit = useCallback((ticker, field, currentValue) => {
    setEditCell({ ticker, field });
    setEditValue(String(currentValue));
  }, []);

  const commitEdit = useCallback(() => {
    if (!editCell) return;
    const numVal = parseFloat(editValue);
    if (!isNaN(numVal) && numVal > 0) {
      onUpdatePosition(editCell.ticker, editCell.field, numVal);
    }
    setEditCell(null);
    setEditValue("");
  }, [editCell, editValue, onUpdatePosition]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") commitEdit();
      if (e.key === "Escape") {
        setEditCell(null);
        setEditValue("");
      }
    },
    [commitEdit]
  );

  // Wash-sale check: purchaseDate within last 30 days
  const isWashSaleRisk = (holdingDays) => holdingDays <= WASH_SALE_DAYS;

  // Format cell value
  const formatValue = (value, fmt) => {
    if (fmt === "$") return `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (fmt === "%") return `${Number(value).toFixed(2)}%`;
    if (fmt === "days") return `${value}d`;
    return value;
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800/60 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800/60 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-200">Portfolio Positions</h2>
        <span className="text-xs text-gray-500">{positionsWithPnL.length} positions</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800/60">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`px-3 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none
                    hover:text-emerald-400 transition-colors duration-150
                    ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}
                    ${sortKey === col.key ? "text-emerald-400" : "text-gray-500"}
                  `}
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedPositions.map((pos, idx) => {
              const isGain = pos.type === "GAIN";
              const isLoss = pos.type === "LOSS";
              const washRisk = isWashSaleRisk(pos.holdingDays);

              return (
                <tr
                  key={`${pos.ticker}-${idx}`}
                  className={`
                    border-b border-gray-800/30 transition-colors duration-150
                    ${isGain ? "bg-emerald-500/[0.04] hover:bg-emerald-500/[0.08]" : ""}
                    ${isLoss ? "bg-red-500/[0.04] hover:bg-red-500/[0.08]" : ""}
                    ${!isGain && !isLoss ? "hover:bg-gray-800/40" : ""}
                  `}
                >
                  {columns.map((col) => {
                    const isEditing = editCell?.ticker === pos.ticker && editCell?.field === col.key;
                    const canEdit = col.editable;

                    return (
                      <td
                        key={col.key}
                        className={`px-3 py-2.5 whitespace-nowrap
                          ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}
                        `}
                      >
                        {isEditing ? (
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={commitEdit}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="w-20 bg-gray-800 border border-emerald-500/50 rounded px-2 py-1 text-sm text-white text-right outline-none focus:border-emerald-400"
                          />
                        ) : (
                          <div className="flex items-center gap-1.5">
                            {col.key === "ticker" && (
                              <span className="font-semibold text-white">{pos.ticker}</span>
                            )}
                            {col.key === "ticker" && washRisk && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                Wash-Sale Risk
                              </span>
                            )}
                            {col.key !== "ticker" && col.key === "type" && (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                                  ${isGain ? "bg-emerald-500/15 text-emerald-400" : ""}
                                  ${isLoss ? "bg-red-500/15 text-red-400" : ""}
                                  ${!isGain && !isLoss ? "bg-gray-700/50 text-gray-400" : ""}
                                `}
                              >
                                {pos.type}
                              </span>
                            )}
                            {col.key !== "ticker" && col.key !== "type" && (
                              <span
                                onClick={canEdit ? () => startEdit(pos.ticker, col.key, pos[col.key]) : undefined}
                                className={`
                                  ${canEdit ? "cursor-pointer hover:text-emerald-400 hover:underline decoration-dashed underline-offset-2" : ""}
                                  ${col.key === "unrealizedPnL" || col.key === "taxImpact"
                                    ? isGain ? "text-emerald-400" : isLoss ? "text-red-400" : "text-gray-400"
                                    : "text-gray-300"
                                  }
                                  ${col.key === "pnlPct"
                                    ? isGain ? "text-emerald-400" : isLoss ? "text-red-400" : "text-gray-400"
                                    : ""
                                  }
                                  ${col.key === "sector" ? "capitalize" : ""}
                                `}
                              >
                                {col.fmt ? formatValue(pos[col.key], col.fmt) : pos[col.key]}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
