import { useState, useEffect, useMemo, useCallback } from "react";
import { loadPortfolioData, loadMockData } from "./utils/dataService";
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
import LandingPage from "./components/LandingPage";

function App() {
  const [page, setPage] = useState("landing");
  const [positions, setPositions] = useState([]);
  const [dataSource, setDataSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [targetOffset, setTargetOffset] = useState(0);

  /* ── Data-source toggle state ── */
  const [isLiveRequested, setIsLiveRequested] = useState(true); // user preference
  const [isSwitching, setIsSwitching] = useState(false);
  const [failedLive, setFailedLive] = useState(false);
  const [fallbackReason, setFallbackReason] = useState(null);
  const [liveStats, setLiveStats] = useState({ fetchCount: 0, cacheCount: 0, coveredCount: 0, total: 0 });

  useEffect(() => {
    if (import.meta.env.DEV) {
      runTestAssertions();
    }
  }, []);

  /* ── Core data loader — runs on mount and when isLiveRequested changes ── */
  useEffect(() => {
    // Don't load data while on landing page
    if (page === "landing") return;

    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setIsSwitching(true);
      setFailedLive(false);
      setFallbackReason(null);

      try {
        const forceMock = !isLiveRequested;
        const result = await loadPortfolioData(forceMock);

        if (!cancelled) {
          setPositions(result.positions);
          setDataSource(result.dataSource);
          setFailedLive(result.failedLive ?? false);
          setFallbackReason(result.fallbackReason ?? null);
          setLiveStats({
            fetchCount: result.liveTickerCount || 0,
            cacheCount: result.cachedTickerCount || 0,
            coveredCount: result.coveredTickerCount || 0,
            total: result.totalTickers || 0
          });
        }
      } catch (err) {
        console.error("Failed to load portfolio data:", err);
        // Emergency fallback
        if (!cancelled) {
          const fallback = loadMockData();
          setPositions(fallback.positions);
          setDataSource(fallback.dataSource);
          setFailedLive(true);
          setFallbackReason("network_error");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setIsSwitching(false);
        }
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [page, isLiveRequested]);

  const harvestResult = useMemo(() => {
    if (positions.length === 0) return null;
    return runHarvest(positions, targetOffset);
  }, [positions, targetOffset]);

  useEffect(() => {
    if (harvestResult && targetOffset === 0) {
      setTargetOffset(Math.round(harvestResult.totalGains * 0.5));
    }
  }, [harvestResult, targetOffset]);

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

  const handleScenario = useCallback((offset) => {
    setTargetOffset(offset);
  }, []);

  /* ── Toggle data source ── */
  const handleToggleDataSource = useCallback(() => {
    setTargetOffset(0); // reset offset so it recalculates
    setIsLiveRequested((prev) => !prev);
  }, []);

  /* ── Landing page ── */
  if (page === "landing") {
    return <LandingPage onEnter={() => setPage("dashboard")} />;
  }

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-14 w-14 border-2 border-gray-800 border-t-emerald-400 mx-auto mb-4" />
            <div className="animate-ping absolute inset-0 rounded-full h-14 w-14 border border-emerald-400/20 mx-auto" />
          </div>
          <p className="text-gray-400 text-lg mt-2">
            {isLiveRequested ? "Fetching live market data…" : "Loading mock portfolio…"}
          </p>
          <p className="text-gray-600 text-xs mt-1">
            {isLiveRequested ? "Connecting to Alpha Vantage API…" : "Preparing 200 positions…"}
          </p>
        </div>
      </div>
    );
  }

  /* ── Dashboard ── */
  return (
    <div className="min-h-screen text-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ── Header ── */}
        <Header
          dataSource={dataSource}
          totalGains={harvestResult?.totalGains ?? 0}
          onScenario={handleScenario}
          activeScenario={targetOffset}
          onToggleDataSource={handleToggleDataSource}
          isLiveRequested={isLiveRequested}
          isSwitching={isSwitching}
          failedLive={failedLive}
          fallbackReason={fallbackReason}
          liveStats={liveStats}
        />

        {harvestResult && (
          <div
            className="space-y-6"
            style={{ animation: "fadeSlideUp 0.6s ease-out" }}
          >
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

            {/* ── Portfolio Table (collapsible) ── */}
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
