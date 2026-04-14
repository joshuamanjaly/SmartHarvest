import { useRef, useCallback } from "react";

/**
 * ReportGenerator — "Generate Report" button produces a print-ready styled summary card
 * Contents: date, portfolio overview, selected positions, tax saved, disclaimer text
 */
export default function ReportGenerator({ harvestResult, dataSource }) {
  const reportRef = useRef(null);

  const fmt = (v) =>
    Math.abs(v).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePrint = useCallback(() => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const content = reportRef.current.innerHTML;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tax-Loss Harvest Report — ${today}</title>
        <style>
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fff; color: #111; padding: 40px; }
          .report { max-width: 800px; margin: 0 auto; }
          .header { border-bottom: 3px solid #111; padding-bottom: 16px; margin-bottom: 24px; }
          .header h1 { font-size: 24px; font-weight: 800; }
          .header p { font-size: 12px; color: #666; margin-top: 4px; }
          .section { margin-bottom: 24px; }
          .section h2 { font-size: 16px; font-weight: 700; margin-bottom: 12px; border-bottom: 1px solid #ddd; padding-bottom: 6px; }
          .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
          .metric { padding: 16px; border: 1px solid #ddd; border-radius: 8px; }
          .metric .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #666; }
          .metric .value { font-size: 22px; font-weight: 700; margin-top: 4px; }
          .metric .value.red { color: #dc2626; }
          .metric .value.green { color: #059669; }
          .metric .value.amber { color: #d97706; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th { text-align: left; padding: 8px 6px; border-bottom: 2px solid #ddd; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #666; }
          td { padding: 6px; border-bottom: 1px solid #eee; }
          .disclaimer { font-size: 10px; color: #999; margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd; line-height: 1.5; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
  }, [today]);

  if (!harvestResult) return null;

  const top10 = harvestResult.selected.slice(0, 10);

  return (
    <div className="glass-panel overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800/60 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-200">Report</h2>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold uppercase tracking-wider rounded-lg
            hover:from-emerald-400 hover:to-teal-400 transition-all duration-200 shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          Generate Report
        </button>
      </div>

      {/* Hidden print-ready content */}
      <div className="hidden">
        <div ref={reportRef}>
          <div className="report">
            <div className="header">
              <h1>🌾 Tax-Loss Harvest Report</h1>
              <p>Generated on {today} • Data Source: {dataSource === "live" ? "Live Market Data" : "Simulated Data"}</p>
            </div>

            <div className="section">
              <h2>Portfolio Overview</h2>
              <div className="metrics">
                <div className="metric">
                  <div className="label">Total Positions</div>
                  <div className="value">{harvestResult.totalPositions}</div>
                </div>
                <div className="metric">
                  <div className="label">Gain Positions</div>
                  <div className="value green">{harvestResult.gainCount}</div>
                </div>
                <div className="metric">
                  <div className="label">Loss Positions</div>
                  <div className="value red">{harvestResult.lossCount}</div>
                </div>
              </div>
            </div>

            <div className="section">
              <h2>Tax Impact Summary</h2>
              <div className="metrics">
                <div className="metric">
                  <div className="label">Tax Before Harvesting</div>
                  <div className="value red">${fmt(harvestResult.taxBefore)}</div>
                </div>
                <div className="metric">
                  <div className="label">Tax After Harvesting</div>
                  <div className="value green">${fmt(harvestResult.taxAfter)}</div>
                </div>
                <div className="metric">
                  <div className="label">Total Tax Saved</div>
                  <div className="value amber">${fmt(harvestResult.taxSaved)}</div>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: '#444' }}>
                Savings Rate: <strong>{harvestResult.savingsPct.toFixed(1)}%</strong> •
                Target Offset: <strong>${fmt(harvestResult.targetOffset)}</strong> •
                Total Harvested: <strong>${fmt(harvestResult.totalHarvested)}</strong>
              </p>
            </div>

            <div className="section">
              <h2>Selected Harvest Positions ({harvestResult.selected.length} total — showing top 10)</h2>
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Ticker</th>
                    <th>Company</th>
                    <th>Sector</th>
                    <th>Efficiency</th>
                    <th>Unrealized P&L</th>
                    <th>Tax Impact</th>
                    <th>Offset %</th>
                  </tr>
                </thead>
                <tbody>
                  {top10.map((pos, i) => (
                    <tr key={pos.ticker}>
                      <td>{i + 1}</td>
                      <td><strong>{pos.ticker}</strong></td>
                      <td>{pos.companyName}</td>
                      <td style={{ textTransform: 'capitalize' }}>{pos.sector}</td>
                      <td>{pos.efficiencyScore.toFixed(3)}</td>
                      <td style={{ color: '#dc2626' }}>${fmt(pos.unrealizedPnL)}</td>
                      <td style={{ color: '#dc2626' }}>${fmt(pos.taxImpact)}</td>
                      <td>{pos.offsetContribution.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="disclaimer">
              <strong>Disclaimer:</strong> This report is generated for educational and simulation purposes only.
              It does not constitute financial, tax, or investment advice. The calculations are based on simplified
              models and may not reflect actual tax obligations. Consult a qualified tax professional before making
              any investment decisions. Tax-loss harvesting involves risks including wash-sale rule violations.
              Past performance does not guarantee future results. All data shown may be simulated and should not
              be relied upon for actual trading decisions.
            </div>
          </div>
        </div>
      </div>

      {/* Preview card */}
      <div className="p-5">
        <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">Report Preview</span>
            <span className="text-xs text-gray-600">{today}</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-[10px] text-gray-600 uppercase">Positions</p>
              <p className="text-lg font-bold text-white">{harvestResult.totalPositions}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-600 uppercase">Harvested</p>
              <p className="text-lg font-bold text-emerald-400">{harvestResult.selected.length}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-600 uppercase">Tax Saved</p>
              <p className="text-lg font-bold text-amber-400">${fmt(harvestResult.taxSaved)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
