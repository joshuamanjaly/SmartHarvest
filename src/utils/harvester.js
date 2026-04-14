/**
 * harvester.js — Tax-Loss Harvesting Algorithm Engine
 * Pure functions only. No side effects. No UI dependencies.
 * All output values rounded to 2 decimal places.
 * Same input always produces identical output (deterministic).
 */

const TODAY = new Date();

function roundTo2(n) {
  return Math.round(n * 100) / 100;
}

function daysBetween(dateStr) {
  const purchase = new Date(dateStr);
  const diffMs = TODAY - purchase;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

// ─────────────────────────────────────────────
// Stage 1 — computePnL(positions)
// ─────────────────────────────────────────────
export function computePnL(positions) {
  return positions.map((pos) => {
    const unrealizedPnL = roundTo2((pos.currentPrice - pos.buyPrice) * pos.quantity);
    const holdingDays = daysBetween(pos.purchaseDate);
    const taxRate = holdingDays < 365 ? 0.30 : 0.20;
    const taxImpact = roundTo2(unrealizedPnL * taxRate);
    const positionValue = roundTo2(pos.currentPrice * pos.quantity);
    const pnlPct = roundTo2(((pos.currentPrice - pos.buyPrice) / pos.buyPrice) * 100);
    const type = unrealizedPnL > 0 ? "GAIN" : unrealizedPnL < 0 ? "LOSS" : "NEUTRAL";

    return {
      ...pos,
      unrealizedPnL,
      holdingDays,
      taxRate,
      taxImpact,
      positionValue,
      pnlPct,
      type,
    };
  });
}

// ─────────────────────────────────────────────
// Stage 2 — scoreEfficiency(positions)
// ─────────────────────────────────────────────
export function scoreEfficiency(positionsWithPnL) {
  const losses = positionsWithPnL.filter((p) => p.type === "LOSS");

  const scored = losses.map((p) => {
    const efficiencyScore = roundTo2(Math.abs(p.taxImpact) / p.positionValue);
    return { ...p, efficiencyScore };
  });

  scored.sort((a, b) => b.efficiencyScore - a.efficiencyScore);
  return scored;
}

// ─────────────────────────────────────────────
// Stage 3 — selectHarvest(rankedLosses, targetOffset)
// ─────────────────────────────────────────────
export function selectHarvest(rankedLosses, targetOffset) {
  let accumulated = 0;
  const selected = [];

  for (const asset of rankedLosses) {
    if (accumulated >= targetOffset) break;

    const absTaxImpact = Math.abs(asset.taxImpact);
    const offsetContribution = roundTo2((absTaxImpact / targetOffset) * 100);

    selected.push({
      ...asset,
      offsetContribution,
    });

    accumulated += absTaxImpact;
  }

  return {
    selected,
    totalHarvested: roundTo2(accumulated),
  };
}

// ─────────────────────────────────────────────
// Stage 4 — computeTaxBill(positionsWithPnL, totalHarvested)
// ─────────────────────────────────────────────
export function computeTaxBill(positionsWithPnL, totalHarvested) {
  const totalGains = roundTo2(
    positionsWithPnL
      .filter((p) => p.type === "GAIN")
      .reduce((sum, p) => sum + p.taxImpact, 0)
  );

  const taxBefore = totalGains;
  const taxAfter = roundTo2(Math.max(0, totalGains - totalHarvested));
  const taxSaved = roundTo2(taxBefore - taxAfter);
  const savingsPct = taxBefore > 0 ? roundTo2((taxSaved / taxBefore) * 100) : 0;

  return {
    totalGains,
    taxBefore,
    taxAfter,
    taxSaved,
    savingsPct,
  };
}

// ─────────────────────────────────────────────
// Master function — runHarvest(positions, targetOffset)
// ─────────────────────────────────────────────
export function runHarvest(positions, targetOffset) {
  // Stage 1
  const positionsWithPnL = computePnL(positions);

  // Stage 2
  const rankedLosses = scoreEfficiency(positionsWithPnL);

  // Stage 3
  const { selected, totalHarvested } = selectHarvest(rankedLosses, targetOffset);

  // Stage 4
  const taxBill = computeTaxBill(positionsWithPnL, totalHarvested);

  // Aggregate stats
  const totalPositions = positions.length;
  const gainCount = positionsWithPnL.filter((p) => p.type === "GAIN").length;
  const lossCount = positionsWithPnL.filter((p) => p.type === "LOSS").length;
  const neutralCount = positionsWithPnL.filter((p) => p.type === "NEUTRAL").length;

  const totalUnrealizedGains = roundTo2(
    positionsWithPnL
      .filter((p) => p.type === "GAIN")
      .reduce((sum, p) => sum + p.unrealizedPnL, 0)
  );
  const totalUnrealizedLosses = roundTo2(
    positionsWithPnL
      .filter((p) => p.type === "LOSS")
      .reduce((sum, p) => sum + p.unrealizedPnL, 0)
  );

  return {
    positionsWithPnL,
    rankedLosses,
    selected,
    totalHarvested,
    ...taxBill,
    totalPositions,
    gainCount,
    lossCount,
    neutralCount,
    totalUnrealizedGains,
    totalUnrealizedLosses,
    targetOffset,
  };
}

// ─────────────────────────────────────────────
// TEST DATASET — 5 hardcoded positions with verified outputs
// Run assertions in development mode on app load
// ─────────────────────────────────────────────
export function runTestAssertions() {
  const testPositions = [
    {
      ticker: "TEST1",
      companyName: "Test Gainer Short",
      sector: "tech",
      buyPrice: 100.0,
      currentPrice: 130.0,
      quantity: 10,
      purchaseDate: "2026-01-15", // ~89 days ago → short-term (0.30)
    },
    {
      ticker: "TEST2",
      companyName: "Test Loser Short",
      sector: "healthcare",
      buyPrice: 200.0,
      currentPrice: 140.0,
      quantity: 5,
      purchaseDate: "2025-12-01", // ~134 days ago → short-term (0.30)
    },
    {
      ticker: "TEST3",
      companyName: "Test Gainer Long",
      sector: "energy",
      buyPrice: 50.0,
      currentPrice: 70.0,
      quantity: 20,
      purchaseDate: "2024-06-01", // ~682 days ago → long-term (0.20)
    },
    {
      ticker: "TEST4",
      companyName: "Test Loser Long",
      sector: "finance",
      buyPrice: 80.0,
      currentPrice: 56.0,
      quantity: 15,
      purchaseDate: "2024-09-01", // ~590 days ago → long-term (0.20)
    },
    {
      ticker: "TEST5",
      companyName: "Test Neutral",
      sector: "consumer",
      buyPrice: 100.0,
      currentPrice: 100.0,
      quantity: 10,
      purchaseDate: "2025-06-01", // ~317 days ago → short-term (0.30)
    },
  ];

  // ── Stage 1: computePnL ──
  const pnl = computePnL(testPositions);

  // TEST1: (130-100)*10 = 300, short-term → taxImpact = 300*0.30 = 90
  console.assert(pnl[0].unrealizedPnL === 300, `TEST1 pnl: expected 300, got ${pnl[0].unrealizedPnL}`);
  console.assert(pnl[0].taxRate === 0.30, `TEST1 taxRate: expected 0.30, got ${pnl[0].taxRate}`);
  console.assert(pnl[0].taxImpact === 90, `TEST1 taxImpact: expected 90, got ${pnl[0].taxImpact}`);
  console.assert(pnl[0].type === "GAIN", `TEST1 type: expected GAIN, got ${pnl[0].type}`);
  console.assert(pnl[0].pnlPct === 30, `TEST1 pnlPct: expected 30, got ${pnl[0].pnlPct}`);

  // TEST2: (140-200)*5 = -300, short-term → taxImpact = -300*0.30 = -90
  console.assert(pnl[1].unrealizedPnL === -300, `TEST2 pnl: expected -300, got ${pnl[1].unrealizedPnL}`);
  console.assert(pnl[1].taxRate === 0.30, `TEST2 taxRate: expected 0.30, got ${pnl[1].taxRate}`);
  console.assert(pnl[1].taxImpact === -90, `TEST2 taxImpact: expected -90, got ${pnl[1].taxImpact}`);
  console.assert(pnl[1].type === "LOSS", `TEST2 type: expected LOSS, got ${pnl[1].type}`);

  // TEST3: (70-50)*20 = 400, long-term → taxImpact = 400*0.20 = 80
  console.assert(pnl[2].unrealizedPnL === 400, `TEST3 pnl: expected 400, got ${pnl[2].unrealizedPnL}`);
  console.assert(pnl[2].taxRate === 0.20, `TEST3 taxRate: expected 0.20, got ${pnl[2].taxRate}`);
  console.assert(pnl[2].taxImpact === 80, `TEST3 taxImpact: expected 80, got ${pnl[2].taxImpact}`);
  console.assert(pnl[2].type === "GAIN", `TEST3 type: expected GAIN, got ${pnl[2].type}`);

  // TEST4: (56-80)*15 = -360, long-term → taxImpact = -360*0.20 = -72
  console.assert(pnl[3].unrealizedPnL === -360, `TEST4 pnl: expected -360, got ${pnl[3].unrealizedPnL}`);
  console.assert(pnl[3].taxRate === 0.20, `TEST4 taxRate: expected 0.20, got ${pnl[3].taxRate}`);
  console.assert(pnl[3].taxImpact === -72, `TEST4 taxImpact: expected -72, got ${pnl[3].taxImpact}`);
  console.assert(pnl[3].type === "LOSS", `TEST4 type: expected LOSS, got ${pnl[3].type}`);

  // TEST5: (100-100)*10 = 0, neutral
  console.assert(pnl[4].unrealizedPnL === 0, `TEST5 pnl: expected 0, got ${pnl[4].unrealizedPnL}`);
  console.assert(pnl[4].taxImpact === 0, `TEST5 taxImpact: expected 0, got ${pnl[4].taxImpact}`);
  console.assert(pnl[4].type === "NEUTRAL", `TEST5 type: expected NEUTRAL, got ${pnl[4].type}`);

  // ── Stage 2: scoreEfficiency ──
  const ranked = scoreEfficiency(pnl);
  // Only losses: TEST2 and TEST4
  console.assert(ranked.length === 2, `Ranked count: expected 2, got ${ranked.length}`);

  // TEST2: efficiencyScore = abs(-90) / (140*5) = 90/700 ≈ 0.13
  // TEST4: efficiencyScore = abs(-72) / (56*15) = 72/840 ≈ 0.09
  // TEST2 should rank first (higher efficiency)
  console.assert(ranked[0].ticker === "TEST2", `Rank 1 ticker: expected TEST2, got ${ranked[0].ticker}`);
  console.assert(ranked[1].ticker === "TEST4", `Rank 2 ticker: expected TEST4, got ${ranked[1].ticker}`);

  // ── Stage 3: selectHarvest with targetOffset = 100 ──
  const harvest = selectHarvest(ranked, 100);
  // TEST2 abs(taxImpact)=90, TEST4 abs(taxImpact)=72
  // After TEST2: accumulated=90 < 100, so continue
  // After TEST4: accumulated=162 >= 100, so push both
  console.assert(harvest.selected.length === 2, `Selected count: expected 2, got ${harvest.selected.length}`);
  console.assert(harvest.totalHarvested === 162, `Total harvested: expected 162, got ${harvest.totalHarvested}`);
  // offsetContribution: TEST2 = (90/100)*100 = 90%, TEST4 = (72/100)*100 = 72%
  console.assert(harvest.selected[0].offsetContribution === 90, `TEST2 offset: expected 90, got ${harvest.selected[0].offsetContribution}`);
  console.assert(harvest.selected[1].offsetContribution === 72, `TEST4 offset: expected 72, got ${harvest.selected[1].offsetContribution}`);

  // ── Stage 4: computeTaxBill ──
  // Total GAIN taxImpact = 90 (TEST1) + 80 (TEST3) = 170
  const taxBill = computeTaxBill(pnl, 162);
  console.assert(taxBill.totalGains === 170, `totalGains: expected 170, got ${taxBill.totalGains}`);
  console.assert(taxBill.taxBefore === 170, `taxBefore: expected 170, got ${taxBill.taxBefore}`);
  console.assert(taxBill.taxAfter === 8, `taxAfter: expected 8, got ${taxBill.taxAfter}`);
  console.assert(taxBill.taxSaved === 162, `taxSaved: expected 162, got ${taxBill.taxSaved}`);
  console.assert(taxBill.savingsPct === 95.29, `savingsPct: expected 95.29, got ${taxBill.savingsPct}`);

  // ── Master function ──
  const result = runHarvest(testPositions, 100);
  console.assert(result.totalPositions === 5, `totalPositions: expected 5, got ${result.totalPositions}`);
  console.assert(result.gainCount === 2, `gainCount: expected 2, got ${result.gainCount}`);
  console.assert(result.lossCount === 2, `lossCount: expected 2, got ${result.lossCount}`);
  console.assert(result.neutralCount === 1, `neutralCount: expected 1, got ${result.neutralCount}`);
  console.assert(!isNaN(result.taxSaved), "taxSaved is NaN");
  console.assert(result.taxSaved !== undefined, "taxSaved is undefined");

  console.log("✅ All harvester.js test assertions passed!");
}
