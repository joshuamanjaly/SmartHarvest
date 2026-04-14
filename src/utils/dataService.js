/**
 * dataService.js — API fetch wrapper with fallback to mock data
 * 
 * Principles:
 * 1. NEVER mix live and mock prices — it's all-live or all-mock.
 * 2. Alpha Vantage free tier: 25 requests/day, 1 request/second.
 * 3. Free tier cannot always cover a full portfolio in one load.
 *    If we cannot populate all tickers live, we fall back to full mock.
 * 4. On forceMock=true (user toggle), skip API completely.
 * 5. Always show a clear dataSource: "live" or "mock".
 */

import mockPortfolio from "../data/mockPortfolio.json";

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
const BASE_URL = "https://www.alphavantage.co/query";
const TIMEOUT_MS = 5000;
const MOCK_DELAY_MS = 600;

/* ── Alpha Vantage free-tier constraints ── */
const DAILY_CALL_LIMIT = 25;
const DELAY_BETWEEN_CALLS = 1200; // 1.2s between calls (free tier = 1/sec)

/* ── Simple session cache to save quota ── */
const priceCache = new Map();

/**
 * Fetch live price for a single ticker from Alpha Vantage
 * Returns { price, reason }
 */
async function fetchLivePrice(ticker, signal) {
  // Return cached price if fresh (within 5 minutes)
  if (priceCache.has(ticker)) {
    const cached = priceCache.get(ticker);
    if (Date.now() - cached.timestamp < 300000) {
      return { price: cached.price, reason: null };
    }
  }

  try {
    const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(ticker)}&apikey=${API_KEY}`;
    const response = await fetch(url, { signal });

    if (!response.ok) return { price: null, reason: "network_error" };

    const data = await response.json();

    // Check for rate limit or error responses
    if (data["Note"] || data["Information"]) {
      console.warn(`Alpha Vantage rate-limited for ${ticker}:`, data["Note"] || data["Information"]);
      return { price: null, reason: "api_rate_limited" };
    }

    if (data["Error Message"]) {
      console.warn(`Alpha Vantage error for ${ticker}:`, data["Error Message"]);
      return { price: null, reason: "api_error" };
    }

    const quote = data["Global Quote"];
    if (!quote || !quote["05. price"]) return { price: null, reason: "api_error" };

    const price = parseFloat(quote["05. price"]);
    if (isNaN(price) || price <= 0) return { price: null, reason: "api_error" };

    const finalPrice = parseFloat(price.toFixed(2));
    
    // Update cache
    priceCache.set(ticker, { price: finalPrice, timestamp: Date.now() });
    
    return { price: finalPrice, reason: null };
  } catch {
    return { price: null, reason: "network_error" };
  }
}

/**
 * Instantly return mock data (no network, no delay).
 * Useful when user explicitly toggles to mock mode.
 */
export function loadMockData() {
  return {
    positions: [...mockPortfolio],
    dataSource: "mock",
    failedLive: false,
    fallbackReason: null,
  };
}

/**
 * Loads portfolio data.
 * @param {boolean} forceMock — if true, skip API and return mock data immediately.
 *
 * Strategy for live mode:
 *   1. Extract unique tickers from the portfolio
 *   2. Reuse fresh cached prices first
 *   3. Fetch remaining prices only if within free-tier daily request budget
 *   4. If every ticker resolves live → dataSource="live"
 *   5. Otherwise → full mock fallback with failedLive=true and fallbackReason
 *   6. NEVER return a mix of live and mock prices
 */
export async function loadPortfolioData(forceMock = false) {
  const startTime = Date.now();

  // ── Force mock ──
  if (forceMock) {
    await artificialDelay(startTime);
    return {
      positions: [...mockPortfolio],
      dataSource: "mock",
      failedLive: false,
      fallbackReason: null,
      liveTickerCount: 0,
      cachedTickerCount: 0,
      coveredTickerCount: 0,
      totalTickers: [...new Set(mockPortfolio.map((p) => p.ticker))].length,
    };
  }

  // ── No API key → mock ──
  if (!API_KEY || API_KEY === "your_alpha_vantage_api_key_here") {
    await artificialDelay(startTime);
    return {
      positions: [...mockPortfolio],
      dataSource: "mock",
      failedLive: true,
      fallbackReason: "missing_api_key",
      liveTickerCount: 0,
      cachedTickerCount: 0,
      coveredTickerCount: 0,
      totalTickers: [...new Set(mockPortfolio.map((p) => p.ticker))].length,
    };
  }

  // ── Attempt live data ──
  try {
    const controller = new AbortController();
    const uniqueTickers = [...new Set(mockPortfolio.map((p) => p.ticker))];

    // Build a working map starting from fresh cache values.
    const priceMap = new Map();
    for (const ticker of uniqueTickers) {
      if (!priceCache.has(ticker)) continue;
      const cached = priceCache.get(ticker);
      if (Date.now() - cached.timestamp < 300000) {
        priceMap.set(ticker, cached.price);
      }
    }

    const tickersToFetch = uniqueTickers.filter((ticker) => !priceMap.has(ticker));

    // Free tier cannot fetch very large portfolios in one run.
    if (tickersToFetch.length > DAILY_CALL_LIMIT) {
      await artificialDelay(startTime);
      return {
        positions: [...mockPortfolio],
        dataSource: "mock",
        failedLive: true,
        fallbackReason: "api_quota_exceeded",
        liveTickerCount: 0,
        cachedTickerCount: priceMap.size,
        coveredTickerCount: 0,
        totalTickers: uniqueTickers.length,
      };
    }

    const timeoutId = setTimeout(
      () => controller.abort(),
      Math.max(TIMEOUT_MS, TIMEOUT_MS * tickersToFetch.length)
    );

    // Fetch prices one-by-one with delay.
    // To prevent mixed datasets, any fetch failure causes full fallback.
    for (let i = 0; i < tickersToFetch.length; i++) {
      const ticker = tickersToFetch[i];
      const result = await fetchLivePrice(ticker, controller.signal);

      if (result.price === null) {
        clearTimeout(timeoutId);
        await artificialDelay(startTime);
        return {
          positions: [...mockPortfolio],
          dataSource: "mock",
          failedLive: true,
          fallbackReason: result.reason || "api_error",
          liveTickerCount: 0,
          cachedTickerCount: priceMap.size,
          coveredTickerCount: 0,
          totalTickers: uniqueTickers.length,
        };
      }

      priceMap.set(ticker, result.price);

      // Rate limit delay
      if (i < tickersToFetch.length - 1) {
        await new Promise((r) => setTimeout(r, DELAY_BETWEEN_CALLS));
      }
    }

    clearTimeout(timeoutId);

    // If we couldn't complete every ticker, fall back to mock to avoid mixed data.
    if (priceMap.size !== uniqueTickers.length) {
      await artificialDelay(startTime);
      return {
        positions: [...mockPortfolio],
        dataSource: "mock",
        failedLive: true,
        fallbackReason: "incomplete_live_data",
        liveTickerCount: 0,
        cachedTickerCount: priceMap.size,
        coveredTickerCount: 0,
        totalTickers: uniqueTickers.length,
      };
    }

    // ── Build updated portfolio ──
    // Every ticker now has a live price.
    const updatedPositions = mockPortfolio.map((pos) => {
      const livePrice = priceMap.get(pos.ticker);

      if (Number.isFinite(livePrice)) {
        return {
          ...pos,
          currentPrice: livePrice,
        };
      }
      return { ...pos };
    });

    await artificialDelay(startTime);
    return {
      positions: updatedPositions,
      dataSource: "live",
      failedLive: false,
      fallbackReason: null,
      liveTickerCount: tickersToFetch.length,
      cachedTickerCount: uniqueTickers.length - tickersToFetch.length,
      coveredTickerCount: uniqueTickers.length,
      totalTickers: uniqueTickers.length,
    };
  } catch (err) {
    console.error("loadPortfolioData critical error:", err);
    // Any error → full mock fallback
    await artificialDelay(startTime);
    return {
      positions: [...mockPortfolio],
      dataSource: "mock",
      failedLive: true,
      fallbackReason: "network_error",
      liveTickerCount: 0,
      cachedTickerCount: 0,
      coveredTickerCount: 0,
      totalTickers: [...new Set(mockPortfolio.map((p) => p.ticker))].length,
    };
  }
}

/**
 * Ensure minimum delay of MOCK_DELAY_MS for loading state visibility
 */
async function artificialDelay(startTime) {
  const elapsed = Date.now() - startTime;
  const remaining = Math.max(0, MOCK_DELAY_MS - elapsed);
  if (remaining > 0) {
    await new Promise((r) => setTimeout(r, remaining));
  }
}
