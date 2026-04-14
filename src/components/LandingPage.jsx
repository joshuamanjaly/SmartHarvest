import { useState, useEffect } from "react";

/* ── Animated counter hook ── */
function useCountUp(target, duration = 2000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

/* ── Particle background ── */
function ParticleField() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 8,
    duration: Math.random() * 10 + 10,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `rgba(52, 211, 153, ${0.15 + Math.random() * 0.2})`,
            animation: `floatParticle ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Icon components ── */
function IconChart() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconZap() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconTarget() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function IconBrain() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 0 0-4 4c0 1.1.45 2.1 1.17 2.83L12 12l2.83-3.17A4 4 0 0 0 16 6a4 4 0 0 0-4-4z" />
      <path d="M12 12v10" />
      <path d="M8 22h8" />
      <path d="M7 8.5C4.79 9.5 3 11.46 3 14c0 2.76 2.24 5 5 5" />
      <path d="M17 8.5c2.21 1 4 2.96 4 5.5 0 2.76-2.24 5-5 5" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function IconUpload() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function IconCog() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function IconPieChart() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}


/* ── Feature Card ── */
function FeatureCard({ icon, title, description, gradient, delay }) {
  return (
    <div
      className="group relative"
      style={{ animation: `fadeSlideUp 0.6s ease-out ${delay}s both` }}
    >
      {/* hover glow */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
      <div className="relative glass-panel p-6 rounded-2xl h-full flex flex-col gap-3 transition-all duration-300 group-hover:border-white/10 group-hover:translate-y-[-2px]">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

/* ── Step Card ── */
function StepCard({ number, icon, title, description, delay }) {
  return (
    <div
      className="relative flex flex-col items-center text-center"
      style={{ animation: `fadeSlideUp 0.6s ease-out ${delay}s both` }}
    >
      {/* Step number */}
      <div className="absolute -top-3 -left-1 w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-emerald-500/25 z-10">
        {number}
      </div>
      <div className="glass-panel p-6 rounded-2xl w-full flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-emerald-400">
          {icon}
        </div>
        <h4 className="text-base font-semibold text-white">{title}</h4>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════ */
/*            LANDING PAGE                    */
/* ═══════════════════════════════════════════ */
export default function LandingPage({ onEnter }) {
  const positionsCount = useCountUp(200, 1800);
  const taxSaved = useCountUp(47, 2200);
  const scenariosCount = useCountUp(3, 1000);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen text-gray-100 relative">
      <ParticleField />

      {/* ── Floating Nav ── */}
      <nav
        id="landing-nav"
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-gray-950/80 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl shadow-black/30"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              Smart<span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Harvest</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">How It Works</a>
            <a href="#learn" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Learn</a>
            <button
              id="nav-launch-btn"
              onClick={onEnter}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              Launch App
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section id="hero" className="relative pt-32 pb-20 sm:pt-44 sm:pb-32 overflow-hidden">
        {/* Hero glow orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-[pulseGlow_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-teal-500/8 rounded-full blur-[100px] animate-[pulseGlow_8s_ease-in-out_2s_infinite]" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-8"
            style={{ animation: "fadeSlideUp 0.6s ease-out" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Tax-Loss Harvesting Simulator
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
            style={{ animation: "fadeSlideUp 0.6s ease-out 0.1s both" }}
          >
            Maximize your
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              tax savings
            </span>
            ,{" "}
            <span className="text-gray-400">intelligently</span>
          </h1>

          {/* Subheading */}
          <p
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ animation: "fadeSlideUp 0.6s ease-out 0.2s both" }}
          >
            SmartHarvest analyzes your portfolio, identifies underperforming
            positions, and recommends the most tax-efficient assets to sell —
            saving you thousands in capital gains tax.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            style={{ animation: "fadeSlideUp 0.6s ease-out 0.3s both" }}
          >
            <button
              id="hero-launch-btn"
              onClick={onEnter}
              className="group relative px-8 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300 cursor-pointer flex items-center gap-3"
            >
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative">Open Simulator</span>
              <span className="relative transition-transform duration-300 group-hover:translate-x-1">
                <IconArrowRight />
              </span>
            </button>
            <a
              href="#features"
              className="px-8 py-4 rounded-2xl text-base font-semibold text-gray-300 border border-white/[0.08] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300 flex items-center gap-2"
            >
              Learn More
              <IconChevronDown />
            </a>
          </div>

          {/* Stats bar */}
          <div
            className="glass-panel max-w-xl mx-auto p-1 rounded-2xl"
            style={{ animation: "fadeSlideUp 0.6s ease-out 0.4s both" }}
          >
            <div className="grid grid-cols-3 divide-x divide-white/[0.06]">
              <div className="py-4 px-3 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent font-mono-data">
                  {positionsCount}+
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mt-1 font-medium">
                  Positions Analyzed
                </p>
              </div>
              <div className="py-4 px-3 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent font-mono-data">
                  {taxSaved}%
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mt-1 font-medium">
                  Avg. Tax Saved
                </p>
              </div>
              <div className="py-4 px-3 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent font-mono-data">
                  {scenariosCount}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mt-1 font-medium">
                  Scenario Modes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-gray-600">
          <IconChevronDown />
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="py-20 sm:py-28 relative">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section heading */}
          <div className="text-center mb-14">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">
              Powerful Features
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              Everything you need to harvest smarter
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              A comprehensive suite of tools designed to optimize your tax-loss
              harvesting strategy with precision and clarity.
            </p>
          </div>

          {/* Feature cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <FeatureCard
              icon={<IconChart />}
              title="Real-Time Analysis"
              description="Live portfolio tracking with Alpha Vantage API integration. Automatic fallback to mock data ensures uninterrupted analysis."
              gradient="from-emerald-500 to-teal-500"
              delay={0.1}
            />
            <FeatureCard
              icon={<IconShield />}
              title="Tax Efficiency Ranking"
              description="Sophisticated scoring algorithm ranks losing positions by tax efficiency — maximizing impact per dollar of position value."
              gradient="from-violet-500 to-purple-500"
              delay={0.2}
            />
            <FeatureCard
              icon={<IconZap />}
              title="Smart Selection"
              description="Constraint-based harvesting greedily selects optimal loss positions until your target offset is met or exceeded."
              gradient="from-amber-500 to-orange-500"
              delay={0.3}
            />
            <FeatureCard
              icon={<IconTarget />}
              title="Before vs After"
              description="Crystal-clear comparison dashboard showing tax savings, harvested positions, and savings percentage at a glance."
              gradient="from-rose-500 to-pink-500"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section id="how-it-works" className="py-20 sm:py-28 relative">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          {/* Section heading */}
          <div className="text-center mb-14">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">
              Simple Process
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              Harvest in four easy steps
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              From portfolio data to actionable tax insights — in seconds.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StepCard
              number={1}
              icon={<IconUpload />}
              title="Load Portfolio"
              description="Import your positions via API or use the built-in 200-position mock portfolio."
              delay={0.1}
            />
            <StepCard
              number={2}
              icon={<IconCog />}
              title="Set Target Offset"
              description="Choose your desired tax offset using the slider or preset scenario buttons."
              delay={0.2}
            />
            <StepCard
              number={3}
              icon={<IconPieChart />}
              title="Review Analysis"
              description="Examine ranked positions, efficiency scores, and AI-generated reasoning cards."
              delay={0.3}
            />
            <StepCard
              number={4}
              icon={<IconDownload />}
              title="Export Report"
              description="Download or print a comprehensive report with all harvest recommendations."
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* ── Explanation Section ── */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <div className="glass-panel p-8 sm:p-12 rounded-3xl relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Left — text */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400">
                    <IconBrain />
                  </div>
                  <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest">
                    How The Algorithm Works
                  </p>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
                  Intelligent tax optimization under the hood
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Our engine computes unrealized P&L, applies time-based tax
                  rates (30% short-term, 20% long-term), ranks every losing
                  position by a tax-efficiency score, and greedily selects the
                  best combination to offset your gains.
                </p>
                <ul className="space-y-3">
                  {[
                    "Compute unrealized P&L and holding period for each position",
                    "Score efficiency = |tax impact| / position value",
                    "Greedy selection until target offset is met",
                    "Before vs After comparison with full audit trail",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                      <span className="mt-0.5 w-5 h-5 rounded-md bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right — visual */}
              <div className="flex justify-center">
                <div className="relative w-full max-w-xs">
                  {/* Mock chart card */}
                  <div className="glass-panel-inner p-6 rounded-2xl">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-4">
                      Sample Harvest Output
                    </p>
                    {/* Mini bars */}
                    {[
                      { label: "AAPL", loss: 85, selected: true },
                      { label: "TSLA", loss: 72, selected: true },
                      { label: "NVDA", loss: 55, selected: true },
                      { label: "AMZN", loss: 40, selected: false },
                      { label: "MSFT", loss: 28, selected: false },
                    ].map((item, i) => (
                      <div key={item.label} className="mb-3 last:mb-0" style={{ animation: `fadeSlideUp 0.4s ease-out ${0.3 + i * 0.1}s both` }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-gray-300 font-mono-data">{item.label}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${item.selected ? "text-emerald-400" : "text-gray-600"}`}>
                            {item.selected ? "Selected" : "Skipped"}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${item.selected ? "bg-gradient-to-r from-emerald-500 to-teal-400" : "bg-gray-700"}`}
                            style={{ width: `${item.loss}%`, animation: `expandBar 1s ease-out ${0.5 + i * 0.1}s both` }}
                          />
                        </div>
                      </div>
                    ))}
                    {/* Summary */}
                    <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-xs text-gray-500">Tax Saved</span>
                      <span className="text-lg font-extrabold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent font-mono-data">
                        $12,450
                      </span>
                    </div>
                  </div>
                  {/* Floating decorations */}
                  <div className="absolute -top-3 -right-3 w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 blur-xl" />
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/15 to-purple-500/15 blur-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Learn & Explore Section ── */}
      <section id="learn" className="py-20 sm:py-28 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Heading */}
          <div className="text-center mb-14">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">
              Learn More
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              Not sure where to start?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Explore curated videos and expert blogs that explain tax-loss harvesting
              from beginner fundamentals to advanced strategies.
            </p>
          </div>

          {/* ── VIDEO GRID ── */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500/20 to-orange-500/20 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Video Guides</h3>
              <span className="ml-2 text-xs text-gray-600 bg-white/[0.04] border border-white/[0.06] rounded-full px-3 py-0.5">4 videos</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { id: "WvZGJG8YSwg", title: "What Is Tax-Loss Harvesting?" },
                { id: "9kIPeaqOYA4", title: "Tax-Loss Harvesting Explained" },
                { id: "wUzc8NpBT58", title: "How to Use Tax-Loss Harvesting" },
                { id: "tBZNIEZvJJo", title: "Tax-Loss Harvesting Deep Dive" },
              ].map((video, i) => (
                <div
                  key={video.id}
                  className="group relative"
                  style={{ animation: `fadeSlideUp 0.6s ease-out ${0.1 + i * 0.1}s both` }}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500/20 to-orange-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                  <div className="relative glass-panel rounded-2xl overflow-hidden">
                    <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${video.id}`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        className="absolute inset-0 w-full h-full"
                        style={{ border: "none" }}
                      />
                    </div>
                    <div className="p-4 border-t border-white/[0.04]">
                      <p className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors duration-200">{video.title}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        YouTube · Tax-Loss Harvesting
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── BLOG GRID ── */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Expert Blogs</h3>
              <span className="ml-2 text-xs text-gray-600 bg-white/[0.04] border border-white/[0.06] rounded-full px-3 py-0.5">4 reads</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  url: "https://www.heygotrade.com/en/blog/tax-loss-harvesting-how-it-works/",
                  source: "HeyGoTrade",
                  title: "Tax-Loss Harvesting: How It Works",
                  description: "An excellent starting point covering the basic 'sell-at-a-loss-to-offset-gains' math with clear examples of how it impacts your tax bill.",
                  tag: "Beginner",
                  tagColor: "from-emerald-500 to-teal-500",
                  badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                },
                {
                  url: "https://www.whitecoatinvestor.com/tax-loss-harvesting/",
                  source: "White Coat Investor",
                  title: "How to Tax-Loss Harvest",
                  description: "Famous for 'boots on the ground' technical advice, including specific walkthroughs for platforms like Vanguard. Written for high-income professionals.",
                  tag: "Advanced",
                  tagColor: "from-violet-500 to-purple-500",
                  badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
                },
                {
                  url: "https://www.wealthfront.com/tax-loss-harvesting",
                  source: "Wealthfront",
                  title: "Automated Tax-Loss Harvesting",
                  description: "Explains how modern robo-advisors automate this process daily using software — a great look at the high-tech side of the strategy.",
                  tag: "Automation",
                  tagColor: "from-amber-500 to-orange-500",
                  badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                },
                {
                  url: "https://groww.in/blog/tax-loss-harvesting",
                  source: "Groww",
                  title: "Tax-Loss Harvesting (India 2026)",
                  description: "A recent 2026 guide breaking down specifics for the Indian market, including the 8-year carry-forward rule and STCG vs LTCG differences.",
                  tag: "India",
                  tagColor: "from-rose-500 to-pink-500",
                  badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
                },
              ].map((blog, i) => (
                <a
                  key={blog.url}
                  href={blog.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block"
                  style={{ animation: `fadeSlideUp 0.6s ease-out ${0.1 + i * 0.1}s both` }}
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${blog.tagColor} rounded-2xl opacity-0 group-hover:opacity-15 blur-xl transition-opacity duration-500`} />
                  <div className="relative glass-panel p-5 rounded-2xl h-full flex flex-col gap-3 transition-all duration-300 group-hover:border-white/10 group-hover:translate-y-[-2px]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${blog.badge} mb-2`}>
                          {blog.tag}
                        </span>
                        <h4 className="text-sm font-bold text-white leading-snug group-hover:text-emerald-300 transition-colors duration-200">
                          {blog.title}
                        </h4>
                      </div>
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-500 group-hover:text-white group-hover:border-white/10 transition-all duration-200 mt-0.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed flex-1">{blog.description}</p>
                    <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${blog.tagColor}`} />
                      <span className="text-[11px] text-gray-500 font-medium">{blog.source}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA Section ── */}
      <section className="py-20 sm:py-28 relative">
        <div className="max-w-3xl mx-auto px-6 text-center">
          {/* Glow */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[150px] pointer-events-none" />

          <h2
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-5 relative z-10"
            style={{ animation: "fadeSlideUp 0.6s ease-out" }}
          >
            Ready to harvest smarter?
          </h2>
          <p
            className="text-lg text-gray-400 mb-10 relative z-10"
            style={{ animation: "fadeSlideUp 0.6s ease-out 0.1s both" }}
          >
            Dive into your portfolio analysis and discover how much you could
            save with tax-loss harvesting.
          </p>
          <button
            id="cta-launch-btn"
            onClick={onEnter}
            className="group relative px-10 py-5 rounded-2xl text-lg font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 cursor-pointer inline-flex items-center gap-3 z-10"
            style={{ animation: "fadeSlideUp 0.6s ease-out 0.2s both" }}
          >
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative">Launch Simulator</span>
            <span className="relative transition-transform duration-300 group-hover:translate-x-1">
              <IconArrowRight />
            </span>
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.04] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-bold text-white">Smart<span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Harvest</span></span>
            <span className="text-gray-700">•</span>
            Tax-Loss Harvesting Simulator
          </div>
          <p className="text-xs text-gray-600">
            For educational purposes only. Not financial or tax advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
