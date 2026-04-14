/**
 * dataService.js — API fetch wrapper with fallback to mock data
 * 
 * On app load:
 * 1. Attempt GLOBAL_QUOTE fetch for each ticker via Alpha Vantage
 * 2. Use AbortController with 3-second timeout
 * 3. On missing key / rate limit / HTTP error / timeout → silently fall back to mockPortfolio.json
 * 4. Expose dataSource: "live" or "mock"
 * 5. Simulate 600ms artificial delay even on mock so loading state is visible
 */

import mockPortfolio from "../data/mockPortfolio.json";

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
const BASE_URL = "https://www.alphavantage.co/query";
const TIMEOUT_MS = 3000;
const MOCK_DELAY_MS = 600;

/**
 * Fetch live price for a single ticker from Alpha Vantage
 * Returns the current price or null on failure
 */
async function fetchLivePrice(ticker, signal) {
  try {
    const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEY}`;
    const response = await fetch(url, { signal });

    if (!response.ok) return null;

    const data = await response.json();

    // Check for rate limit or error responses
    if (data["Note"] || data["Error Message"] || data["Information"]) {
      return null;
    }

    const quote = data["Global Quote"];
    if (!quote || !quote["05. price"]) return null;

    return parseFloat(parseFloat(quote["05. price"]).toFixed(2));
  } catch {
    return null;
  }
}

/**
 * Loads portfolio data.
 * Attempts live API fetch if API key is present.
 * Falls back to mock data on any failure.
 * Always includes a minimum 600ms delay for loading state visibility.
 */
export async function loadPortfolioData() {
  const startTime = Date.now();

  // If no API key, go straight to mock
  if (!API_KEY || API_KEY === "your_alpha_vantage_api_key_here") {
    await artificialDelay(startTime);
    return {
      positions: [...mockPortfolio],
      dataSource: "mock",
    };
  }

  // Attempt live data fetch
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    // Fetch first ticker as a connectivity test
    const testPrice = await fetchLivePrice(mockPortfolio[0].ticker, controller.signal);
    clearTimeout(timeoutId);

    if (testPrice === null) {
      // API not working, fall back to mock
      await artificialDelay(startTime);
      return {
        positions: [...mockPortfolio],
        dataSource: "mock",
      };
    }

    // API works — fetch all prices (batch in groups to avoid rate limits)
    const updatedPositions = await fetchAllLivePrices(mockPortfolio, controller.signal);

    await artificialDelay(startTime);
    return {
      positions: updatedPositions,
      dataSource: "live",
    };
  } catch {
    // Any error → fall back to mock
    await artificialDelay(startTime);
    return {
      positions: [...mockPortfolio],
      dataSource: "mock",
    };
  }
}

/**
 * Fetch live prices for all positions
 * Falls back individual positions to mock price on failure
 */
async function fetchAllLivePrices(positions, signal) {
  const results = [];

  // Alpha Vantage free tier: 5 calls/minute, 500/day
  // Batch requests with delays
  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];

    try {
      const livePrice = await fetchLivePrice(pos.ticker, signal);

      if (livePrice !== null) {
        results.push({
          ...pos,
          currentPrice: livePrice,
        });
      } else {
        results.push({ ...pos });
      }
    } catch {
      results.push({ ...pos });
    }

    // Rate limit: wait between requests (200ms between calls)
    if (i < positions.length - 1) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  return results;
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
