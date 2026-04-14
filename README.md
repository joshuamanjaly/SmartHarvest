markdown
# SmartHarvest — Tax-Loss Harvesting Simulator
SmartHarvest is a high-performance, offline-capable Tax-Loss Harvesting Simulator built with React, Vite, and Tailwind CSS v4. It features a stunning glassmorphism UI and a robust algorithm that automatically identifies the most tax-efficient losing positions in a stock portfolio to offset capital gains.
## Features
- **Advanced Harvesting Algorithm:** Computes P&L and ranks losing positions by "Tax Efficiency" (accounting for short-term vs. long-term capital gains rates).
- **Interactive UI:** Dynamic Offset Slider, Collapsible Portfolio Table (with inline editing for quantity and price), and Tax Summary metrics.
- **Scenario Testing:** One-click presets for Conservative (25%), Balanced (50%), and Aggressive (100%) harvesting strategies.
- **Visual Analytics:** Fully integrated Recharts visualizations including Donut (composition), Horizontal Bar (top 10 losses by sector), and Stacked Bar (sector gain/loss comparison).
- **Premium Design:** Glassmorphism aesthetic, Google Fonts (Inter & JetBrains Mono), animated mesh backgrounds, and 60fps polished CSS transitions.
- **Offline / Mock Data Support:** Runs out-of-the-box using a realistic 200-position mock portfolio, with support for live data via the Alpha Vantage API.
## Setup Instructions
### 1. Install Dependencies
Make sure you have Node.js installed, then run:
```bash
npm install
2. Configure API Key (Optional)
By default, the app runs on a realistic 200-position mock dataset. If you want to fetch live market prices, you can use the Alpha Vantage API.

Get a free API key from Alpha Vantage.
Create a file named exactly .env in the root of the project (next to 

package.json
).
Add your key to the file like this:
env
VITE_ALPHA_VANTAGE_KEY=your_actual_key_here
If no .env file is present, the app will automatically fall back to mock data.

3. Run the Development Server
Start the Vite dev server:

bash
npm run dev
Open your browser to http://localhost:5173.

How It Works
Calculates Gains & Losses: The app calculates the unrealized P&L for all 200 positions.
Sets a Target: You define how much capital gains you want to offset (via the slider or scenario buttons).
Optimizes Harvest: The algorithmic engine (harvester.js) sorts all losing positions by an Efficiency Score. It prioritizes maximizing the dollar-for-dollar tax impact, taking into account long-term (lower tax) vs. short-term (higher tax) holding periods.
Visualizes Savings: You instantly see exactly which stocks to sell, why they were chosen, and exactly how much money you save on your tax bill.
