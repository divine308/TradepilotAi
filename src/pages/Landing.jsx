import {
  Activity,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleDollarSign,
  Code2,
  Cpu,
  LineChart,
  Play,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

/* ============================================================
   DATA
============================================================ */

const features = [
  {
    icon: BrainCircuit,
    number: "01",
    title: "Market intelligence",
    description:
      "Understand price action, momentum, volume and market conditions through one intelligent research layer.",
  },
  {
    icon: Bot,
    number: "02",
    title: "Autonomous agents",
    description:
      "Deploy specialized agents that research opportunities, reason through strategies and evaluate risk.",
  },
  {
    icon: LineChart,
    number: "03",
    title: "Portfolio command",
    description:
      "Monitor equity, positions, buying power and exposure from one beautifully organized dashboard.",
  },
  {
    icon: Code2,
    number: "04",
    title: "Developer infrastructure",
    description:
      "Build applications on top of Trade Pilot through secure, programmable trading infrastructure.",
  },
];

const signals = [
  {
    symbol: "NVDA",
    name: "NVIDIA",
    price: "$181.44",
    change: "+3.82%",
    signal: "BUY",
    positive: true,
  },
  {
    symbol: "AAPL",
    name: "Apple",
    price: "$232.18",
    change: "+2.41%",
    signal: "BUY",
    positive: true,
  },
  {
    symbol: "TSLA",
    name: "Tesla",
    price: "$344.91",
    change: "-0.84%",
    signal: "WATCH",
    positive: false,
  },
];

/* ============================================================
   SECTION LABEL
============================================================ */

function SectionLabel({ children }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="h-[2px] w-8 rounded-full bg-violet-500" />

      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-600">
        {children}
      </span>
    </div>
  );
}

/* ============================================================
   BOT ICON
============================================================ */

function Bot(props) {
  return <BrainCircuit {...props} />;
}

/* ============================================================
   ANIMATED MARKET GRAPH
============================================================ */

function MarketGraph() {
  return (
    <div className="relative h-[240px] overflow-hidden rounded-[28px] bg-[#27203B]">
      {/* Glow */}
      <div className="absolute left-[25%] top-[10%] h-40 w-40 rounded-full bg-violet-500/30 blur-[70px]" />
      <div className="absolute right-[10%] bottom-[5%] h-36 w-36 rounded-full bg-fuchsia-500/20 blur-[70px]" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      <div className="absolute left-6 right-6 top-5 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
            Market momentum
          </p>

          <p className="mt-1 text-2xl font-semibold tracking-[-0.05em] text-white">
            +18.42%
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />

          <span className="text-[8px] font-bold uppercase tracking-wider text-white/70">
            Live analysis
          </span>
        </div>
      </div>

      {/* SVG CHART */}
      <svg
        className="absolute bottom-0 left-0 h-[150px] w-full"
        viewBox="0 0 800 220"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B7CFF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#8B7CFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M0 185 C70 175 80 155 130 164 C180 174 190 126 235 138 C280 150 310 115 345 124 C390 136 405 92 450 108 C495 124 525 84 560 93 C605 105 625 58 665 70 C710 82 740 38 800 45 L800 220 L0 220 Z"
          fill="url(#chartFill)"
        />

        <path
          d="M0 185 C70 175 80 155 130 164 C180 174 190 126 235 138 C280 150 310 115 345 124 C390 136 405 92 450 108 C495 124 525 84 560 93 C605 105 625 58 665 70 C710 82 740 38 800 45"
          fill="none"
          stroke="#A99EFF"
          strokeWidth="4"
          strokeLinecap="round"
        />

        <circle cx="665" cy="70" r="6" fill="#FF8E85" />
        <circle cx="665" cy="70" r="12" fill="#FF8E85" opacity=".15" />
      </svg>
    </div>
  );
}

/* ============================================================
   FLOATING STAT
============================================================ */

function FloatingStat({ className, icon: Icon, label, value, change }) {
  return (
    <div
      className={[
        "absolute z-20 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-[0_20px_60px_rgba(40,30,70,.12)] backdrop-blur-xl",
        "animate-[float_5s_ease-in-out_infinite]",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50">
          <Icon size={16} className="text-violet-600" />
        </div>

        <div>
          <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
            {label}
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight text-[#29213D]">
              {value}
            </span>

            {change && (
              <span className="text-[8px] font-bold text-emerald-600">
                {change}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SIGNAL ROW
============================================================ */

function SignalRow({
  symbol,
  name,
  price,
  change,
  signal,
  positive,
}) {
  return (
    <div className="group flex items-center justify-between border-b border-[#29213D]/[0.07] py-4 last:border-0">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1EEFF] transition duration-300 group-hover:scale-105 group-hover:bg-violet-100">
          <BarChart3 size={14} className="text-violet-600" />
        </div>

        <div>
          <p className="text-xs font-bold text-[#29213D]">
            {symbol}
          </p>

          <p className="mt-0.5 text-[9px] text-slate-400">
            {name}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-xs font-bold text-[#29213D]">
          {price}
        </p>

        <p
          className={[
            "mt-0.5 text-[9px] font-semibold",
            positive ? "text-emerald-600" : "text-rose-500",
          ].join(" ")}
        >
          {change}
        </p>
      </div>

      <span
        className={[
          "rounded-full px-2.5 py-1 text-[8px] font-bold tracking-wider",
          signal === "BUY"
            ? "bg-emerald-50 text-emerald-600"
            : "bg-orange-50 text-orange-600",
        ].join(" ")}
      >
        {signal}
      </span>
    </div>
  );
}

/* ============================================================
   LIVE TICKER
============================================================ */

function Ticker() {
  return (
    <div className="overflow-hidden border-y border-[#29213D]/[0.07] bg-white">
      <div className="flex min-w-max animate-[ticker_28s_linear_infinite]">
        {[...Array(2)].map((_, copy) => (
          <div
            key={copy}
            className="flex items-center gap-10 px-5 py-4"
          >
            {[
              ["S&P 500", "+1.24%"],
              ["NASDAQ", "+1.82%"],
              ["NVDA", "+3.82%"],
              ["AAPL", "+2.41%"],
              ["TSLA", "-0.84%"],
              ["BTC", "+4.12%"],
              ["MSFT", "+1.36%"],
            ].map(([name, value]) => (
              <div
                key={`${copy}-${name}`}
                className="flex items-center gap-2"
              >
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#29213D]/50">
                  {name}
                </span>

                <span
                  className={[
                    "text-[9px] font-bold",
                    value.startsWith("+")
                      ? "text-emerald-600"
                      : "text-rose-500",
                  ].join(" ")}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   MAIN
============================================================ */

export default function Landing() {
  const [activeSignal, setActiveSignal] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSignal((current) => (current + 1) % signals.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-[#F7F4EE] text-[#29213D]">

      {/* ======================================================
          GLOBAL ANIMATION STYLES
      ======================================================= */}

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes ticker {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            opacity: .45;
            transform: scale(1);
          }
          50% {
            opacity: .75;
            transform: scale(1.08);
          }
        }

        @keyframes reveal {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-reveal {
          animation: reveal .8s cubic-bezier(.2,.8,.2,1) both;
        }

        .hero-delay-1 {
          animation-delay: .12s;
        }

        .hero-delay-2 {
          animation-delay: .24s;
        }

        .hero-delay-3 {
          animation-delay: .36s;
        }
      `}</style>

      {/* ======================================================
          BACKGROUND
      ======================================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-violet-300/20 blur-[120px]" />

        <div className="absolute right-[-150px] top-[350px] h-[550px] w-[550px] rounded-full bg-orange-200/25 blur-[140px]" />

        <div className="absolute left-[35%] top-[700px] h-[400px] w-[400px] rounded-full bg-fuchsia-200/15 blur-[120px]" />
      </div>

      {/* ======================================================
          NAVIGATION
      ======================================================= */}

      <header className="relative z-50 border-b border-[#29213D]/[0.07] bg-[#F7F4EE]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[78px] max-w-[1380px] items-center justify-between px-5 sm:px-8">

          <Link
            to="/"
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#29213D] shadow-lg shadow-[#29213D]/10 transition duration-300 group-hover:-rotate-3 group-hover:scale-105">
              <div className="h-3 w-3 rotate-45 rounded-[3px] bg-violet-400" />

              <span className="absolute right-[7px] top-[7px] h-1.5 w-1.5 rounded-full bg-orange-300" />
            </div>

            <div>
              <div className="text-[13px] font-black tracking-[-0.03em] text-[#29213D]">
                TRADE PILOT
              </div>

              <div className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#29213D]/40">
                Intelligence infrastructure
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            {[
              ["Platform", "#platform"],
              ["Agents", "#agents"],
              ["Developers", "#api"],
              ["Security", "#security"],
            ].map(([name, href]) => (
              <a
                key={name}
                href={href}
                className="text-[11px] font-semibold text-[#29213D]/50 transition hover:text-violet-600"
              >
                {name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden px-4 py-2.5 text-[11px] font-bold text-[#29213D]/55 transition hover:text-[#29213D] sm:block"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="group flex items-center gap-2 rounded-xl bg-[#29213D] px-4 py-2.5 text-[10px] font-bold text-white shadow-lg shadow-[#29213D]/15 transition duration-300 hover:-translate-y-0.5 hover:bg-violet-600 hover:shadow-violet-300/30"
            >
              Start Trading

              <ArrowRight
                size={13}
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">

        {/* ====================================================
            HERO
        ===================================================== */}

        <section className="mx-auto max-w-[1380px] px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:pb-32">

          <div className="grid items-center gap-16 lg:grid-cols-[0.95fr_1.05fr]">

            {/* COPY */}

            <div className="hero-reveal">

              <SectionLabel>
                AI trading intelligence
              </SectionLabel>

              <h1 className="max-w-3xl text-[52px] font-black leading-[0.92] tracking-[-0.065em] text-[#29213D] sm:text-[68px] lg:text-[82px]">

                See the market

                <span className="block bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
                  differently.
                </span>
              </h1>

              <p className="hero-reveal hero-delay-1 mt-8 max-w-xl text-[15px] leading-7 text-[#29213D]/55 sm:text-base">
                Trade Pilot combines market intelligence,
                autonomous AI agents and portfolio analytics
                into one intelligent trading environment.
              </p>

              <div className="hero-reveal hero-delay-2 mt-9 flex flex-wrap items-center gap-3">

                <Link
                  to="/register"
                  className="group flex items-center gap-3 rounded-xl bg-violet-600 px-5 py-3.5 text-xs font-bold text-white shadow-xl shadow-violet-500/20 transition duration-300 hover:-translate-y-1 hover:bg-violet-700"
                >
                  Start building

                  <ArrowRight
                    size={15}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>

                <a
                  href="#platform"
                  className="group flex items-center gap-2 rounded-xl border border-[#29213D]/10 bg-white/70 px-5 py-3.5 text-xs font-bold text-[#29213D]/65 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-violet-200 hover:text-violet-600"
                >
                  <Play
                    size={12}
                    className="transition group-hover:scale-110"
                  />

                  Explore platform
                </a>
              </div>

              <div className="hero-reveal hero-delay-3 mt-9 flex flex-wrap gap-x-6 gap-y-3 text-[9px] font-bold uppercase tracking-[0.12em] text-[#29213D]/35">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={12} />
                  Paper trading
                </span>

                <span className="flex items-center gap-2">
                  <Cpu size={12} />
                  AI analysis
                </span>

                <span className="flex items-center gap-2">
                  <Code2 size={12} />
                  Developer API
                </span>
              </div>
            </div>

            {/* HERO VISUAL */}

            <div className="relative min-h-[510px]">

              <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-300/20 blur-[100px]" />

              {/* Main card */}

              <div className="absolute left-[5%] top-[8%] w-[90%] rounded-[30px] border border-white/80 bg-white/85 p-4 shadow-[0_35px_100px_rgba(48,35,78,.14)] backdrop-blur-xl sm:p-5">

                <div className="mb-4 flex items-center justify-between">

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#29213D]/35">
                      Intelligence dashboard
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm font-bold text-[#29213D]">
                        Market overview
                      </span>

                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-[7px] font-bold text-emerald-600">
                        LIVE
                      </span>
                    </div>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F2EFFF]">
                    <Activity
                      size={15}
                      className="text-violet-600"
                    />
                  </div>
                </div>

                <MarketGraph />

                <div className="mt-4 grid grid-cols-3 gap-3">

                  {[
                    ["Portfolio", "$128.4K", "+4.82%"],
                    ["Buying power", "$64.2K", null],
                    ["Risk", "Low", "Controlled"],
                  ].map(([label, value, change]) => (
                    <div
                      key={label}
                      className="rounded-2xl bg-[#F8F7FA] p-3"
                    >
                      <p className="text-[7px] font-bold uppercase tracking-wider text-[#29213D]/35">
                        {label}
                      </p>

                      <p className="mt-1 text-sm font-bold tracking-tight text-[#29213D]">
                        {value}
                      </p>

                      {change && (
                        <p className="mt-0.5 text-[7px] font-bold text-emerald-600">
                          {change}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* AI card */}

                <div className="mt-4 rounded-2xl bg-gradient-to-r from-[#29213D] to-[#453265] p-4 text-white">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                        <BrainCircuit size={15} className="text-violet-300" />
                      </div>

                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-violet-300">
                          Agent decision
                        </p>

                        <p className="mt-1 text-xs font-bold">
                          Multi-factor opportunity detected
                        </p>
                      </div>
                    </div>

                    <span className="text-xl font-black text-violet-300">
                      87%
                    </span>
                  </div>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[87%] rounded-full bg-gradient-to-r from-violet-400 to-orange-300" />
                  </div>
                </div>
              </div>

              {/* Floating cards */}

              <FloatingStat
                icon={TrendingUp}
                label="Momentum"
                value="+18.42%"
                change="Strong"
                className="left-[-2%] top-[34%]"
              />

              <FloatingStat
                icon={CircleDollarSign}
                label="AI confidence"
                value="87%"
                change="High"
                className="right-[-2%] top-[52%] [animation-delay:1s]"
              />

              <FloatingStat
                icon={Zap}
                label="Signals"
                value="24"
                change="Active"
                className="bottom-[3%] left-[12%] [animation-delay:2s]"
              />
            </div>
          </div>
        </section>

        {/* ====================================================
            TICKER
        ===================================================== */}

        <Ticker />

        {/* ====================================================
            PLATFORM
        ===================================================== */}

        <section
          id="platform"
          className="mx-auto max-w-[1380px] px-5 py-28 sm:px-8"
        >
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">

            <div>
              <SectionLabel>
                Platform
              </SectionLabel>

              <h2 className="max-w-md text-4xl font-black leading-[0.98] tracking-[-0.055em] text-[#29213D] sm:text-5xl">
                One intelligent
                <span className="block text-[#29213D]/30">
                  trading system.
                </span>
              </h2>

              <p className="mt-6 max-w-md text-sm leading-7 text-[#29213D]/50">
                Everything you need to research markets,
                reason through opportunities, manage risk and
                understand your portfolio.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["#7657FF", "#FF776D", "#19A879", "#F5B94C"].map(
                    (color, index) => (
                      <div
                        key={index}
                        className="h-8 w-8 rounded-full border-2 border-[#F7F4EE]"
                        style={{ backgroundColor: color }}
                      />
                    )
                  )}
                </div>

                <span className="text-[9px] font-bold uppercase tracking-wider text-[#29213D]/40">
                  Built for modern traders
                </span>
              </div>
            </div>

            <div className="grid overflow-hidden rounded-[28px] border border-[#29213D]/[0.07] bg-white shadow-[0_20px_70px_rgba(40,30,70,.06)] sm:grid-cols-2">

              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="group border-b border-[#29213D]/[0.07] p-7 transition duration-500 hover:-translate-y-1 hover:bg-[#FBFAFF] sm:border-l"
                  >
                    <div className="flex items-center justify-between">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1EEFF] transition duration-300 group-hover:bg-violet-100 group-hover:scale-105">
                        <Icon
                          size={17}
                          className="text-violet-600"
                        />
                      </div>

                      <span className="text-[9px] font-black text-[#29213D]/20">
                        {feature.number}
                      </span>
                    </div>

                    <h3 className="mt-8 text-sm font-bold text-[#29213D]">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-xs leading-6 text-[#29213D]/45">
                      {feature.description}
                    </p>

                    <div className="mt-7 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[#29213D]/30 transition group-hover:text-violet-600">
                      Explore
                      <ChevronRight size={11} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ====================================================
            AGENTS
        ===================================================== */}

        <section
          id="agents"
          className="relative overflow-hidden border-y border-[#29213D]/[0.07] bg-[#EFEAFF]"
        >
          <div className="absolute right-[-150px] top-[-150px] h-[500px] w-[500px] rounded-full bg-violet-300/30 blur-[100px]" />

          <div className="relative mx-auto grid max-w-[1380px] items-center gap-16 px-5 py-28 sm:px-8 lg:grid-cols-[1fr_0.9fr]">

            <div>
              <SectionLabel>
                Autonomous intelligence
              </SectionLabel>

              <h2 className="max-w-xl text-4xl font-black leading-[0.95] tracking-[-0.06em] text-[#29213D] sm:text-6xl">
                Don't automate
                <span className="block text-violet-600">
                  the clicks.
                </span>
                Automate the thinking.
              </h2>

              <p className="mt-7 max-w-lg text-sm leading-7 text-[#29213D]/55">
                Specialized AI agents can research opportunities,
                evaluate strategies and surface risk before you
                make a decision.
              </p>

              <div className="mt-9 grid max-w-lg gap-3">
                {[
                  "Market research",
                  "Technical analysis",
                  "Strategy reasoning",
                  "Risk evaluation",
                  "Trade execution",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 border-b border-[#29213D]/10 pb-3"
                  >
                    <span className="font-mono text-[9px] font-bold text-violet-600">
                      0{index + 1}
                    </span>

                    <span className="text-xs font-bold text-[#29213D]/65">
                      {item}
                    </span>

                    <Check
                      size={12}
                      className="ml-auto text-emerald-600"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* AGENT CARD */}

            <div className="rounded-[30px] border border-white/80 bg-white/85 p-4 shadow-[0_30px_90px_rgba(45,30,80,.12)] backdrop-blur-xl sm:p-5">

              <div className="rounded-[22px] bg-[#29213D] p-5 text-white">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">
                      <Bot
                        size={17}
                        className="text-violet-300"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-bold">
                        Trade Pilot Agent
                      </p>

                      <p className="mt-1 text-[8px] uppercase tracking-wider text-white/35">
                        Autonomous analyst
                      </p>
                    </div>
                  </div>

                  <span className="flex items-center gap-2 rounded-full bg-emerald-400/10 px-2.5 py-1.5 text-[7px] font-bold uppercase tracking-wider text-emerald-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
                    Active
                  </span>
                </div>

                <div className="mt-6 space-y-3">

                  <div className="rounded-2xl bg-white/[0.06] p-5">
                    <div className="flex items-center gap-2">
                      <CircleDollarSign
                        size={13}
                        className="text-white/35"
                      />

                      <span className="text-[8px] font-bold uppercase tracking-wider text-white/35">
                        Market scan
                      </span>
                    </div>

                    <p className="mt-3 text-xs leading-6 text-white/60">
                      Momentum conditions strengthening across
                      selected technology equities.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 p-5">

                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-bold uppercase tracking-wider text-white/70">
                        Agent decision
                      </span>

                      <span className="text-[8px] font-bold text-white">
                        87% CONFIDENCE
                      </span>
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <span className="text-2xl font-black tracking-[-0.05em]">
                        BUY NVDA
                      </span>

                      <TrendingUp size={20} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">

                    {[
                      ["Technical", "Strong"],
                      ["Momentum", "Positive"],
                      ["Risk", "Controlled"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-2xl bg-[#F8F7FA] p-4 text-[#29213D]"
                      >
                        <p className="text-[7px] font-bold uppercase tracking-wider text-[#29213D]/35">
                          {label}
                        </p>

                        <p className="mt-2 text-[10px] font-bold">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            SIGNALS
        ===================================================== */}

        <section className="mx-auto max-w-[1380px] px-5 py-28 sm:px-8">

          <div className="grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr]">

            <div>
              <SectionLabel>
                Intelligence feed
              </SectionLabel>

              <h2 className="text-4xl font-black leading-[0.98] tracking-[-0.055em] text-[#29213D] sm:text-5xl">
                Signals without
                <span className="block text-[#29213D]/30">
                  the noise.
                </span>
              </h2>

              <p className="mt-6 max-w-md text-sm leading-7 text-[#29213D]/50">
                Surface the opportunities that matter and
                understand why an asset is moving before
                making your next decision.
              </p>

              <Link
                to="/markets"
                className="group mt-8 inline-flex items-center gap-2 text-xs font-bold text-violet-600"
              >
                Explore markets

                <ArrowRight
                  size={14}
                  className="transition group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="rounded-[30px] border border-[#29213D]/[0.07] bg-white p-5 shadow-[0_25px_80px_rgba(40,30,70,.07)]">

              <div className="mb-3 flex items-center justify-between">

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#29213D]/30">
                    Active opportunities
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#29213D]">
                    Market signals
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
                  <Activity
                    size={15}
                    className="text-emerald-600"
                  />
                </div>
              </div>

              {signals.map((stock, index) => (
                <div
                  key={stock.symbol}
                  className={[
                    "transition duration-500",
                    activeSignal === index
                      ? "translate-x-1"
                      : "",
                  ].join(" ")}
                >
                  <SignalRow {...stock} />
                </div>
              ))}

              <div className="mt-4 rounded-2xl bg-[#F8F7FA] p-4">

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100">
                    <Sparkles
                      size={13}
                      className="text-violet-600"
                    />
                  </div>

                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-wider text-violet-600">
                      AI observation
                    </p>

                    <p className="mt-1 text-[10px] font-semibold text-[#29213D]/60">
                      Technology momentum remains elevated.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            API
        ===================================================== */}

        <section
          id="api"
          className="border-y border-[#29213D]/[0.07] bg-white"
        >
          <div className="mx-auto grid max-w-[1380px] gap-14 px-5 py-28 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">

            <div>
              <SectionLabel>
                Developer infrastructure
              </SectionLabel>

              <h2 className="text-4xl font-black leading-[0.98] tracking-[-0.055em] text-[#29213D] sm:text-5xl">
                Build on top of
                <span className="block text-violet-600">
                  market intelligence.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-sm leading-7 text-[#29213D]/50">
                Connect your own applications directly to
                Trade Pilot through secure programmable
                trading infrastructure.
              </p>

              <Link
                to="/register"
                className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-[#29213D] px-5 py-3.5 text-xs font-bold text-white shadow-lg shadow-[#29213D]/10 transition hover:-translate-y-1 hover:bg-violet-600"
              >
                Create API access

                <ArrowRight
                  size={14}
                  className="transition group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* CODE WINDOW */}

            <div className="overflow-hidden rounded-[26px] border border-[#29213D]/[0.08] bg-[#29213D] shadow-[0_30px_80px_rgba(40,30,70,.15)]">

              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">

                <div className="flex items-center gap-3">

                  <Code2
                    size={14}
                    className="text-violet-300"
                  />

                  <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/40">
                    API REQUEST
                  </span>
                </div>

                <span className="rounded-full bg-white/10 px-2 py-1 text-[7px] font-bold text-white/40">
                  REST
                </span>
              </div>

              <div className="overflow-x-auto p-6 font-mono text-[10px] leading-7">

                <div className="text-white/35">
                  <span className="text-violet-300">
                    POST
                  </span>{" "}
                  /api/trading/analyze
                </div>

                <div className="mt-5 text-white/35">
                  <span className="text-white/60">
                    Authorization:
                  </span>{" "}
                  Bearer tp_live_••••••••
                </div>

                <div className="mt-5 text-white/35">
                  {"{"}
                </div>

                <div className="pl-5 text-white/35">
                  <span className="text-orange-300">
                    "symbol"
                  </span>
                  :{" "}
                  <span className="text-violet-300">
                    "NVDA"
                  </span>
                </div>

                <div className="text-white/35">
                  {"}"}
                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-5 text-emerald-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/10">
                    <Check size={10} />
                  </span>

                  analysis_complete
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            SECURITY
        ===================================================== */}

        <section
          id="security"
          className="mx-auto max-w-[1380px] px-5 py-20 sm:px-8"
        >
          <div className="rounded-[28px] bg-[#29213D] p-7 shadow-[0_25px_80px_rgba(40,30,70,.12)] sm:p-9">

            <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <ShieldCheck
                    size={19}
                    className="text-violet-300"
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    Built with controlled execution in mind.
                  </p>

                  <p className="mt-1 text-xs text-white/40">
                    Start in paper trading before connecting real infrastructure.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">

                {[
                  "Secure authentication",
                  "API controls",
                  "Paper environment",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[8px] font-bold uppercase tracking-wider text-white/50"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            CTA
        ===================================================== */}

        <section className="relative overflow-hidden px-5 py-32 sm:px-8">

          <div className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-300/20 blur-[120px]" />

          <div className="relative mx-auto max-w-4xl text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100">
              <Sparkles
                size={20}
                className="text-violet-600"
              />
            </div>

            <h2 className="mt-7 text-5xl font-black leading-[0.95] tracking-[-0.06em] text-[#29213D] sm:text-7xl">
              Think in systems.
              <span className="block bg-gradient-to-r from-violet-600 to-orange-400 bg-clip-text text-transparent">
                Trade with intelligence.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-lg text-sm leading-7 text-[#29213D]/50">
              Start trading with AI-powered
              analysis, autonomous agents and intelligent
              portfolio infrastructure.
            </p>

            <Link
              to="/register"
              className="group mt-9 inline-flex items-center gap-3 rounded-xl bg-violet-600 px-6 py-4 text-xs font-bold text-white shadow-xl shadow-violet-500/20 transition duration-300 hover:-translate-y-1 hover:bg-violet-700"
            >
              Open Trade Pilot

              <ArrowRight
                size={15}
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </div>
        </section>
      </main>

      {/* ======================================================
          FOOTER
      ======================================================= */}

      <footer className="border-t border-[#29213D]/[0.07] bg-white">

        <div className="mx-auto flex max-w-[1380px] flex-col gap-6 px-5 py-9 sm:px-8 md:flex-row md:items-center md:justify-between">

          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.15em] text-[#29213D]">
              Trade Pilot AI
            </div>

            <div className="mt-1 text-[8px] font-semibold uppercase tracking-wider text-[#29213D]/30">
              Trading intelligence infrastructure
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-[9px] font-bold uppercase tracking-wider text-[#29213D]/35">

            <a href="#platform" className="transition hover:text-violet-600">
              Platform
            </a>

            <a href="#agents" className="transition hover:text-violet-600">
              Agents
            </a>

            <a href="#api" className="transition hover:text-violet-600">
              API
            </a>

            <a href="#security" className="transition hover:text-violet-600">
              Security
            </a>
          </div>

          <div className="text-[8px] font-semibold uppercase tracking-wider text-[#29213D]/25">
            © 2026 Trade Pilot AI
          </div>
        </div>
      </footer>
    </div>
  );
}
