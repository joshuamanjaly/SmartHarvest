# SmartHarvest - Tax-Loss Harvesting Simulator

SmartHarvest is a React + Vite simulator that helps investors identify which losing assets to sell in order to reduce capital gains tax.

It supports live market prices through Alpha Vantage and automatically falls back to a 200-position mock portfolio when live data is unavailable.

## What This Project Solves

Tax-loss harvesting sounds simple in theory, but deciding what to sell is difficult when you have many positions.

This simulator:
1. Detects underperforming positions.
2. Ranks them by tax efficiency.
3. Selects assets to match a target offset.
4. Compares tax bill before and after harvesting.
5. Explains why each selected asset was chosen.

## Key Features

1. API Integration with Fallback
- Tries to fetch live prices per ticker from Alpha Vantage.
- Uses a robust fallback to mock data if API key is missing, rate-limited, timed out, or returns an error.
- Displays whether the current source is Live or Mock.

2. Tax-Efficiency Ranking
- Computes unrealized P&L for each position.
- Applies tax rates based on holding period:
	- Less than 365 days: 30%
	- 365+ days: 20%
- Ranks losing positions by efficiency score to maximize tax impact per dollar of position value.

3. Constraint-Based Harvest Selection
- Accepts a user-defined target offset amount.
- Greedily selects top-ranked loss positions until the target is met/exceeded.
- Shows each selected asset's offset contribution percentage.

4. Before vs After Dashboard
- Tax Before Harvesting
- Tax After Harvesting
- Tax Saved
- Savings percentage and harvested positions
- Scenario presets (Conservative/Balanced/Aggressive)

5. Output Explanation
- Reasoning cards explain selection rationale (efficiency, holding period, loss size, offset contribution).
- Visual panels highlight selected vs non-selected candidates.

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 4
- Recharts (data visualization)

## Project Structure

```text
src/
	components/
		Charts/
		EfficiencyPanel.jsx
		Header.jsx
		OffsetSlider.jsx
		PortfolioTable.jsx
		ReasoningCards.jsx
		ReportGenerator.jsx
		ScenarioComparison.jsx
		TaxSummaryCards.jsx
	data/
		mockPortfolio.json
	utils/
		dataService.js
		harvester.js
	App.jsx
```

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ recommended
- npm

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment (Optional for Live Data)

Create a file named .env in the project root:

```env
VITE_ALPHA_VANTAGE_KEY=your_actual_key_here
```

If this key is missing or invalid, the app automatically uses mock data.

### 4. Run in Development

```bash
npm run dev
```

Open the URL shown in terminal (usually http://localhost:5173).

### 5. Build for Production

```bash
npm run build
```

### 6. Preview Production Build

```bash
npm run preview
```

## How the Algorithm Works

The core engine lives in src/utils/harvester.js and follows four stages:

1. computePnL
- Calculates unrealizedPnL, holdingDays, taxRate, taxImpact, positionValue, pnlPct, and type (GAIN/LOSS/NEUTRAL).

2. scoreEfficiency
- Filters only LOSS positions.
- Computes efficiencyScore = abs(taxImpact) / positionValue.
- Sorts descending by efficiency.

3. selectHarvest
- Iterates ranked losses.
- Selects positions until accumulated harvest >= target offset.
- Tracks each asset's offsetContribution percentage.

4. computeTaxBill
- Computes total gains tax, tax before, tax after, and savings metrics.

## Using the App

1. Load portfolio (live or mock).
2. Choose target offset with slider or scenario buttons.
3. Review selected assets and reasoning cards.
4. Compare before vs after tax outcomes.
5. Export/print the report if needed.

## Constraints and Assumptions

- Portfolio size supported: up to 200 positions (mock dataset contains 200).
- Price precision: handled to 2 decimal places.
- Tax model:
	- Short-term (< 365 days): 30%
	- Long-term (>= 365 days): 20%
- Wash-sale rule is not enforced in optimization logic (UI warning badge only).
- Simulator is for educational/demo use, not tax advice.

## Notes on API Limits

Alpha Vantage free tier is rate-limited. During throttling, the app may partially or fully fall back to mock prices so evaluation can continue without breaking UX.

## Available Scripts

- npm run dev - Start development server
- npm run build - Build production bundle
- npm run preview - Preview production build
- npm run lint - Run ESLint

## Disclaimer

This project is a simulation for educational purposes only and does not constitute financial or tax advice. Consult a qualified tax professional before making real investment decisions.
