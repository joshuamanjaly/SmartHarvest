import { useState, useEffect, useMemo, useCallback } from "react";
import { loadPortfolioData } from "./utils/dataService";
import { runHarvest, runTestAssertions } from "./utils/harvester";
import Header from "./components/Header";
import PortfolioTable from "./components/PortfolioTable";
import OffsetSlider from "./components/OffsetSlider";
import TaxSummaryCards from "./components/TaxSummaryCards";
import EfficiencyPanel from "./components/EfficiencyPanel";
import ReasoningCards from "./components/ReasoningCards";
import ScenarioComparison from "./components/ScenarioComparison";
import ReportGenerator from "./components/ReportGenerator";
import DonutChart from "./components/Charts/DonutChart";
import LossBarChart from "./components/Charts/LossBarChart";
import SectorChart from "./components/Charts/SectorChart";

function App() {
  const [positions, setPositions] = useState([]);
  const [dataSource, setDataSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [targetOffset, setTargetOffset] = useState(0);

  // Run test assertions in development mode
  useEffect(() => {
    if (import.meta.env.DEV) {
      runTestAssertions();
    }
  }, []);

  // Load portfolio data on mount
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      try {
        const { positions: loadedPositions, dataSource: source } =
          await loadPortfolioData();
        if (!cancelled) {
          setPositions(loadedPositions);
          setDataSource(source);
        }
      } catch (err) {
        console.error("Failed to load portfolio data:", err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  // Memoized harvest result — only recalculates when positions or targetOffset change
  const harvestResult = useMemo(() => {
    if (positions.length === 0) return null;
    return runHarvest(positions, targetOffset);
  }, [positions, targetOffset]);

  // Set initial targetOffset to 50% of total gains when data loads
  useEffect(() => {
    if (harvestResult && targetOffset === 0) {
      setTargetOffset(Math.round(harvestResult.totalGains * 0.5));
    }
  }, [harvestResult, targetOffset]);

  // Inline edit handler — updates a single position's field
  const handleUpdatePosition = useCallback((ticker, field, value) => {
    setPositions((prev) =>
      prev.map((p) =>
        p.ticker === ticker
          ? {
              ...p,
              [field]: field === "quantity" ? Math.round(value) : parseFloat(value.toFixed(2)),
            }
          : p
      )
    );
  }, []);

  // Scenario preset handler
  const handleScenario = useCallback((offset) => {
    setTargetOffset(offset);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-14 w-14 border-2 border-gray-800 border-t-emerald-400 mx-auto mb-4"></div>
            <div className="animate-ping absolute inset-0 rounded-full h-14 w-14 border border-emerald-400/20 mx-auto"></div>
          </div>
          <p className="text-gray-400 text-lg mt-2">Loading portfolio data...</p>
          <p className="text-gray-600 text-xs mt-1">Checking Alpha Vantage API...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ── Header ── */}
        <Header
          dataSource={dataSource}
          totalGains={harvestResult?.totalGains ?? 0}
          onScenario={handleScenario}
        />

        {harvestResult && (
          <div className="space-y-6">
            {/* ── Tax Summary Cards ── */}
            <TaxSummaryCards
              taxBefore={harvestResult.taxBefore}
              taxAfter={harvestResult.taxAfter}
              taxSaved={harvestResult.taxSaved}
              savingsPct={harvestResult.savingsPct}
            />

            {/* ── Offset Slider ── */}
            <OffsetSlider
              value={targetOffset}
              max={Math.round(harvestResult.totalGains)}
              onChange={setTargetOffset}
            />

            {/* ── Charts ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <DonutChart
                totalUnrealizedGains={harvestResult.totalUnrealizedGains}
                totalHarvested={harvestResult.totalHarvested}
                totalUnrealizedLosses={harvestResult.totalUnrealizedLosses}
                neutralCount={harvestResult.neutralCount}
                taxSaved={harvestResult.taxSaved}
                positionsWithPnL={harvestResult.positionsWithPnL}
              />
              <LossBarChart
                rankedLosses={harvestResult.rankedLosses}
                selected={harvestResult.selected}
              />
              <SectorChart
                positionsWithPnL={harvestResult.positionsWithPnL}
              />
            </div>

            {/* ── Portfolio Table ── */}
            <PortfolioTable
              positionsWithPnL={harvestResult.positionsWithPnL}
              onUpdatePosition={handleUpdatePosition}
            />

            {/* ── Efficiency + Reasoning side by side ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EfficiencyPanel
                rankedLosses={harvestResult.rankedLosses}
                selected={harvestResult.selected}
              />
              <ReasoningCards
                selected={harvestResult.selected}
                targetOffset={targetOffset}
              />
            </div>

            {/* ── Scenario Comparison ── */}
            <ScenarioComparison
              positions={positions}
              totalGains={harvestResult.totalGains}
            />

            {/* ── Report Generator ── */}
            <ReportGenerator
              harvestResult={harvestResult}
              dataSource={dataSource}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
