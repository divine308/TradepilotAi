
import {
  Activity,
  AlertTriangle,
  Bot,
  BrainCircuit,
  Check,
  CircleDollarSign,
  Clock3,
  Cpu,
  Gauge,
  LineChart,
  Pause,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import AppLayout from "../components/AppLayout";

import {
  analyzeAgentSymbols,
  getApiErrorMessage,
  getAgentStatus,
  startAgent,
  stopAgent,
  scanAgent,
  getAgentActivity,
} from "../services/api";


/* ============================================================
   CONFIGURATION
============================================================ */

const WATCHLIST = [
  "AAPL",
  "NVDA",
  "MSFT",
  "AMZN",
  "META",
  "GOOGL",
  "TSLA",
];

/*
 * Change this ONE value if your FastAPI autonomous routes
 * are mounted somewhere else.
 *
 * Expected:
 *
 * POST /api/trading/agent/start
 * POST /api/trading/agent/stop
 * GET  /api/trading/agent/status
 * GET  /api/trading/agent/activity
 */

/* ============================================================
   STATIC AGENT DEFINITIONS
============================================================ */

const agentDefinitions = [
  {
    id: "market",
    name: "Market Agent",
    role: "Market intelligence",
    description:
      "Reads live market data supplied by Alpaca and evaluates price action, volume, momentum, volatility and trend.",
    icon: TrendingUp,
    accent: "violet",
  },

  {
    id: "research",
    name: "Research Agent",
    role: "Signal research",
    description:
      "Feeds available market intelligence into the AI reasoning pipeline for structured opportunity analysis.",
    icon: BrainCircuit,
    accent: "mint",
  },

  {
    id: "strategy",
    name: "Strategy Agent",
    role: "Trade reasoning",
    description:
      "Uses the AI service to produce BUY, SELL or HOLD decisions together with confidence and reasoning.",
    icon: Target,
    accent: "purple",
  },

  {
    id: "risk",
    name: "Risk Agent",
    role: "Risk management",
    description:
      "Validates trade exposure, AI confidence and risk score before a trade can be executed.",
    icon: ShieldCheck,
    accent: "peach",
  },
];


/* ============================================================
   HELPERS
============================================================ */

function formatPercent(value) {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(Number(value))
  ) {
    return "—";
  }

  return `${Number(value).toFixed(1)}%`;
}


function formatPrice(value) {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(Number(value))
  ) {
    return "—";
  }

  return `$${Number(value).toFixed(2)}`;
}


function formatNumber(value) {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(Number(value))
  ) {
    return "—";
  }

  return Number(value).toLocaleString();
}


function formatTime(date = new Date()) {
  return new Intl.DateTimeFormat(
    undefined,
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }
  ).format(date);
}

/* ============================================================
   SECTION LABEL
============================================================ */

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-7 bg-[#8062ff]" />

      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#7859f4]">
        {children}
      </span>
    </div>
  );
}


/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  label,
  value,
  change,
  icon: Icon,
  accent = "violet",
}) {
  const styles = {
    violet: {
      icon: "bg-[#f1edff] text-[#7859f4]",
      dot: "bg-[#8569f7]",
      change: "text-[#7859f4]",
    },

    mint: {
      icon: "bg-[#edfff7] text-[#26966b]",
      dot: "bg-[#35c98b]",
      change: "text-[#26966b]",
    },

    peach: {
      icon: "bg-[#fff1eb] text-[#d76a56]",
      dot: "bg-[#ef876e]",
      change: "text-[#d76a56]",
    },

    purple: {
      icon: "bg-[#f4edff] text-[#9a63df]",
      dot: "bg-[#a56ce8]",
      change: "text-[#9a63df]",
    },
  };

  const style =
    styles[accent] || styles.violet;

  return (
    <div className="group rounded-[22px] border border-[#e7e2db] bg-white p-5 shadow-[0_12px_40px_rgba(45,35,70,0.045)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(45,35,70,0.08)]">

      <div className="flex items-start justify-between">

        <div
          className={[
            "flex h-10 w-10 items-center justify-center rounded-xl",
            style.icon,
          ].join(" ")}
        >
          <Icon size={17} />
        </div>

        <span
          className={[
            "h-2 w-2 rounded-full opacity-70",
            style.dot,
          ].join(" ")}
        />

      </div>

      <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#97909b]">
        {label}
      </p>

      <div className="mt-1 flex items-end gap-2">

        <span className="text-xl font-semibold tracking-[-0.04em] text-[#24202b]">
          {value}
        </span>

        {change && (
          <span
            className={[
              "mb-0.5 text-[9px] font-semibold",
              style.change,
            ].join(" ")}
          >
            {change}
          </span>
        )}

      </div>

      <div className="mt-2 flex items-center gap-1.5 text-[9px] font-medium text-[#928b96]">

        <span
          className={[
            "h-1.5 w-1.5 rounded-full",
            style.dot,
          ].join(" ")}
        />

        Backend intelligence

      </div>

    </div>
  );
}


/* ============================================================
   AUTONOMOUS CONTROL PANEL
============================================================ */

function AutonomousControl({
  autonomous,
  loading,
  onStart,
  onStop,
  onViewExecuted,
}) {
  const running =
    Boolean(autonomous?.running);

  const stage =
    autonomous?.stage || "IDLE";

  const limitReached =
    stage === "LIMIT_REACHED";

  return (
    <section className="mb-7 overflow-hidden rounded-[28px] border border-[#e5def8] bg-white shadow-[0_20px_60px_rgba(45,35,70,0.055)]">

      <div className="relative overflow-hidden bg-[#f7f4ff] px-6 py-6">

        <div className="pointer-events-none absolute -right-20 -top-24 h-60 w-60 rounded-full bg-[#c6b4ff]/25 blur-[90px]" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">

              <Zap
                size={19}
                className="text-[#7859f4]"
              />

            </div>

            <div>

              <div className="flex flex-wrap items-center gap-3">

                <p className="text-sm font-semibold text-[#25202f]">
                  Autonomous Trading Engine
                </p>

                <span
                  className={[
                    "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[7px] font-bold uppercase tracking-wider",

                    running
                      ? "bg-[#edfff7] text-[#26966b]"
                      : limitReached
                      ? "bg-[#fff1eb] text-[#d76a56]"
                      : "bg-white text-[#817987]",
                  ].join(" ")}
                >

                  <span
                    className={[
                      "h-1.5 w-1.5 rounded-full",

                      running
                        ? "animate-pulse bg-[#35c98b]"
                        : limitReached
                        ? "bg-[#ef876e]"
                        : "bg-[#aaa3ad]",
                    ].join(" ")}
                  />

                  {running
                    ? "Running"
                    : limitReached
                    ? "Limit reached"
                    : "Stopped"}

                </span>

              </div>

              <p className="mt-2 max-w-2xl text-[10px] leading-6 text-[#918a95]">

                The autonomous engine continuously scans the watchlist,
                evaluates AI signals, passes trades through risk controls,
                and executes only approved paper trades.

              </p>

            </div>

          </div>


          <div className="flex flex-wrap items-center gap-3">

            {running ? (

              <button
                type="button"
                onClick={onStop}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl border border-[#f1dfd7] bg-white px-5 py-3 text-[9px] font-bold uppercase tracking-[0.12em] text-[#d76a56] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#fff7f3] disabled:cursor-not-allowed disabled:opacity-50"
              >

                {loading ? (
                  <RefreshCw
                    size={13}
                    className="animate-spin"
                  />
                ) : (
                  <Pause size={13} />
                )}

                Stop AI Trading

              </button>

            ) : (

              <button
                type="button"
                onClick={onStart}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-[#7859f4] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_10px_25px_rgba(120,89,244,0.22)] transition hover:-translate-y-0.5 hover:bg-[#6d50e5] disabled:cursor-not-allowed disabled:opacity-50"
              >

                {loading ? (
                  <RefreshCw
                    size={13}
                    className="animate-spin"
                  />
                ) : (
                  <Play size={13} />
                )}

                Start AI Trading

              </button>

            )}

          </div>

        </div>

      </div>


      <div className="grid grid-cols-2 divide-x divide-y divide-[#eeeae5] sm:grid-cols-4 lg:grid-cols-6 lg:divide-y-0">

        <MiniMetric
          label="Stage"
          value={stage}
        />

        <MiniMetric
          label="Current symbol"
          value={
            autonomous?.current_symbol ||
            "—"
          }
        />

        <MiniMetric
          label="Scans"
          value={
            formatNumber(
              autonomous?.scan_count
            )
          }
        />

        <MiniMetric
          label="Signals"
          value={
            formatNumber(
              autonomous?.signals_count
            )
          }
        />

      <MiniMetric
        label="Executed"
        value={formatNumber(autonomous?.trades_executed)}
        clickable={Number(autonomous?.trades_executed || 0) > 0}
        onClick={onViewExecuted}
      />

        <MiniMetric
          label="Rejected"
          value={
            formatNumber(
              autonomous?.trades_rejected
            )
          }
        />

      </div>

    </section>
  );
}

/* ============================================================
   MINI METRIC
============================================================ */

function MiniMetric({
  label,
  value,
  clickable = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!clickable}
      className={[
        "w-full px-5 py-4 text-left transition",
        clickable
          ? "cursor-pointer hover:bg-[#faf8ff]"
          : "cursor-default",
      ].join(" ")}
    >
      <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-[#aaa3ad]">
        {label}
      </p>

      <div className="mt-1.5 flex items-center gap-2">
        <p className="truncate text-xs font-semibold text-[#39333f]">
          {value}
        </p>

        {clickable && Number(value) > 0 && (
          <span className="rounded-full bg-[#edfff7] px-1.5 py-0.5 text-[6px] font-bold uppercase tracking-wider text-[#26966b]">
            View
          </span>
        )}
      </div>
    </button>
  );
}

/* ============================================================
   AGENT CARD
============================================================ */

function AgentCard({
  agent,
  analysis,
  loading,
}) {
  const Icon = agent.icon;

  const styles = {
    violet: {
      icon: "bg-[#f1edff] text-[#7859f4]",
      border: "border-[#e6e0f2]",
      glow: "bg-[#b9a5ff]/15",
      metric: "text-[#7859f4]",
    },

    mint: {
      icon: "bg-[#edfff7] text-[#26966b]",
      border: "border-[#dcefe6]",
      glow: "bg-[#a8efd1]/15",
      metric: "text-[#26966b]",
    },

    purple: {
      icon: "bg-[#f4edff] text-[#9a63df]",
      border: "border-[#e6ddf2]",
      glow: "bg-[#c9adff]/15",
      metric: "text-[#9a63df]",
    },

    peach: {
      icon: "bg-[#fff1eb] text-[#d76a56]",
      border: "border-[#f1dfd7]",
      glow: "bg-[#ffd0c0]/15",
      metric: "text-[#d76a56]",
    },
  };

  const style =
    styles[agent.accent] || styles.violet;

  const strategy =
    analysis?.strategy || null;

  const market =
    analysis?.market || null;

  let status = "READY";

  if (loading) {
    status = "ANALYZING";
  } else if (analysis) {
    status = "ACTIVE";
  }

  let metric = "—";
  let metricLabel = "Waiting for data";

  if (agent.id === "market") {
    metric = market
      ? market.trend || "NEUTRAL"
      : "—";

    metricLabel = "Current trend";
  }

  if (agent.id === "research") {
    metric = market
      ? `${market.data_points || 0}`
      : "—";

    metricLabel = "Market data points";
  }

  if (agent.id === "strategy") {
    metric = strategy
      ? formatPercent(
          Number(strategy.confidence) * 100
        )
      : "—";

    metricLabel = "AI confidence";
  }

  if (agent.id === "risk") {
    metric = strategy
      ? formatPercent(
          Number(strategy.risk_score) * 100
        )
      : "—";

    metricLabel = "AI risk score";
  }

  return (
    <div
      className={[
        "group relative overflow-hidden rounded-[24px] border bg-white p-6 shadow-[0_14px_45px_rgba(45,35,70,0.045)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(45,35,70,0.08)]",
        style.border,
      ].join(" ")}
    >

      <div
        className={[
          "pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full blur-[70px]",
          style.glow,
        ].join(" ")}
      />

      <div className="relative">

        <div className="flex items-start justify-between">

          <div className="flex items-center gap-4">

            <div
              className={[
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition duration-300 group-hover:scale-105",
                style.icon,
              ].join(" ")}
            >
              <Icon size={18} />
            </div>

            <div>

              <p className="text-sm font-semibold text-[#29242f]">
                {agent.name}
              </p>

              <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.14em] text-[#aaa3ad]">
                {agent.role}
              </p>

            </div>

          </div>

          <span
            className={[
              "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[7px] font-bold uppercase tracking-[0.12em]",

              status === "ACTIVE" ||
              status === "ANALYZING"
                ? "bg-[#edfff7] text-[#26966b]"
                : "bg-[#f5f3f0] text-[#8d8791]",
            ].join(" ")}
          >

            <span
              className={[
                "h-1.5 w-1.5 rounded-full",

                status === "ACTIVE"
                  ? "bg-[#35c98b]"
                  : status === "ANALYZING"
                  ? "animate-pulse bg-[#8062ff]"
                  : "bg-[#aaa3ad]",
              ].join(" ")}
            />

            {status}

          </span>

        </div>

        <p className="mt-6 max-w-xl text-[10px] leading-6 text-[#918a95]">
          {agent.description}
        </p>

        <div className="mt-6 flex items-end justify-between border-t border-[#eeeae5] pt-5">

          <div>

            <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#aaa3ad]">
              {metricLabel}
            </p>

            <p
              className={[
                "mt-1.5 text-lg font-semibold tracking-[-0.03em]",
                style.metric,
              ].join(" ")}
            >
              {loading
                ? "..."
                : metric}
            </p>

          </div>

          {analysis && (
            <span className="flex items-center gap-1.5 rounded-lg bg-[#f5f3f8] px-2 py-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-[#817987]">

              <Check size={10} />

              Synced

            </span>
          )}

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   ACTIVITY ROW
============================================================ */

function ActivityRow({
  item,
}) {
  const isError =
    item.status === "error" ||
    item.type === "error";

  const time = item.time
    ? new Date(item.time).toLocaleTimeString(
        undefined,
        {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }
      )
    : "—";

  return (
    <div className="group flex items-center gap-4 px-6 py-4 transition hover:bg-[#faf8ff]">

      <span className="w-16 shrink-0 font-mono text-[8px] text-[#aaa3ad]">
        {time}
      </span>

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f5f3f8] transition group-hover:bg-[#eee9ff]">

        <Cpu
          size={12}
          className="text-[#817987]"
        />

      </div>

      <div className="min-w-0 flex-1">

        <div className="flex items-center gap-2">

          <span className="text-[10px] font-semibold text-[#39333f]">
            {item.agent || "Supervisor"}
          </span>

          {item.symbol && (
            <span className="rounded-md bg-[#f4f0ff] px-1.5 py-0.5 text-[7px] font-bold text-[#7859f4]">
              {item.symbol}
            </span>
          )}

        </div>

        <p className="mt-1 truncate text-[9px] text-[#9b949f]">
          {item.action || "Autonomous trading activity"}
        </p>

      </div>

      <div
        className={[
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",

          isError
            ? "bg-[#fff1eb]"
            : "bg-[#edfff7]",
        ].join(" ")}
      >

        {isError ? (
          <AlertTriangle
            size={12}
            className="text-[#d76a56]"
          />
        ) : (
          <Check
            size={12}
            className="text-[#26966b]"
          />
        )}

      </div>

    </div>
  );
}


/* ============================================================
   SIGNAL ROW
============================================================ */

function SignalRow({
  signal,
}) {
  const decision =
    signal?.strategy?.decision || "HOLD";

  const confidence =
    Number(
      signal?.strategy?.confidence || 0
    ) * 100;

  const price =
    signal?.market?.price?.current;

  const trend =
    signal?.market?.trend || "NEUTRAL";

  const positive =
    decision === "BUY";

  const negative =
    decision === "SELL";

  return (
    <div className="border-b border-[#eeeae5] py-5 last:border-0">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f3f8]">

            {positive ? (
              <TrendingUp
                size={13}
                className="text-[#26966b]"
              />
            ) : negative ? (
              <TrendingDown
                size={13}
                className="text-[#d76a56]"
              />
            ) : (
              <CircleDollarSign
                size={13}
                className="text-[#817987]"
              />
            )}

          </div>

          <div>

            <p className="text-xs font-semibold text-[#39333f]">
              {signal.symbol}
            </p>

            <p className="mt-0.5 text-[8px] text-[#a29aa5]">
              {trend}
            </p>

          </div>

        </div>

        <div className="text-right">

          <p className="text-[10px] font-semibold text-[#37313f]">
            {formatPrice(price)}
          </p>

          <p
            className={[
              "mt-0.5 text-[8px] font-semibold",

              positive
                ? "text-[#26966b]"
                : negative
                ? "text-[#d35d4e]"
                : "text-[#817987]",
            ].join(" ")}
          >
            {decision}
          </p>

        </div>

      </div>

      <div className="mt-4 flex items-center gap-3">

        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#eeeae8]">

          <div
            className={[
              "h-full rounded-full transition-all",

              positive
                ? "bg-[#8062ff]"
                : negative
                ? "bg-[#ef876e]"
                : "bg-[#aaa3ad]",
            ].join(" ")}
            style={{
              width: `${Math.min(
                Math.max(confidence, 0),
                100
              )}%`,
            }}
          />

        </div>

        <span className="w-10 text-right text-[8px] font-bold text-[#7859f4]">
          {formatPercent(confidence)}
        </span>

        <span
          className={[
            "rounded-full px-2 py-1 text-[7px] font-bold uppercase tracking-wider",

            positive
              ? "bg-[#edfff7] text-[#26966b]"
              : negative
              ? "bg-[#fff3ee] text-[#d76a56]"
              : "bg-[#f5f3f0] text-[#817987]",
          ].join(" ")}
        >
          {decision}
        </span>

      </div>

    </div>
  );
}


/* ============================================================
   PIPELINE STEP
============================================================ */

function PipelineStep({
  number,
  icon: Icon,
  title,
  description,
  active = false,
  ready = false,
}) {
  return (
    <div
      className={[
        "group rounded-2xl border bg-white p-4 transition hover:-translate-y-0.5",

        ready
          ? "border-[#d8eee4]"
          : "border-[#e6e0f0]",
      ].join(" ")}
    >

      <div className="flex items-center gap-4">

        <div
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-105",

            ready
              ? "bg-[#edfff7] text-[#26966b]"
              : active
              ? "bg-[#f1edff] text-[#7859f4]"
              : "bg-[#f5f3f8] text-[#aaa3ad]",
          ].join(" ")}
        >
          <Icon size={15} />
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex items-center gap-2">

            <span className="rounded-md bg-[#f3efff] px-1.5 py-0.5 font-mono text-[7px] font-bold text-[#7859f4]">
              {number}
            </span>

            <p className="text-xs font-semibold text-[#312b38]">
              {title}
            </p>

          </div>

          <p className="mt-1 text-[9px] leading-5 text-[#958e9a]">
            {description}
          </p>

        </div>

        {ready ? (

          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#edfff7] px-2 py-1 text-[7px] font-bold uppercase tracking-wider text-[#26966b]">

            <span className="h-1.5 w-1.5 rounded-full bg-[#35c98b]" />

            Ready

          </span>

        ) : active ? (

          <span className="relative flex h-2 w-2 shrink-0">

            <span className="absolute inset-0 animate-ping rounded-full bg-[#8a6cff] opacity-30" />

            <span className="relative h-2 w-2 rounded-full bg-[#8a6cff]" />

          </span>

        ) : (

          <span className="h-2 w-2 shrink-0 rounded-full bg-[#aaa3ad]" />

        )}

      </div>

    </div>
  );
}


/* ============================================================
   MAIN PAGE
============================================================ */

export default function Agent() {

  /* ==========================================================
     ANALYSIS STATE
  ========================================================== */

  const [analysis, setAnalysis] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [lastUpdated, setLastUpdated] =
    useState(null);


  /* ==========================================================
     AUTONOMOUS STATE
  ========================================================== */

  const [autonomous, setAutonomous] =
    useState({
      running: false,
      stage: "IDLE",
      current_symbol: null,
      started_at: null,
      last_scan_at: null,
      last_trade_at: null,
      scan_count: 0,
      signals_count: 0,
      trades_executed: 0,
      trades_rejected: 0,
      watchlist: [],
      scan_interval_seconds: 300,
      max_trade_percent: 0.05,
      last_error: null,
      paper_trading: true,
    });

  const [autonomousLoading, setAutonomousLoading] =
    useState(false);

  const [autonomousError, setAutonomousError] =
    useState("");

  const [autonomousActivity, setAutonomousActivity] =
    useState([]);
  
    const [showExecutedTrades, setShowExecutedTrades] =
  useState(false);

  /* ============================================================
   EXECUTED TRADES
============================================================ */

/* ============================================================
   EXECUTED TRADES
============================================================ */

const executedTrades = useMemo(() => {
  return autonomousActivity.filter((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }

    const type = String(
      item.type ||
      item.event_type ||
      item.event ||
      ""
    ).toLowerCase();

    const status = String(
      item.status ||
      item.order_status ||
      item.execution_status ||
      ""
    ).toLowerCase();

    const action = String(
      item.action ||
      item.message ||
      item.description ||
      item.event ||
      ""
    ).toLowerCase();

    const combined = `${type} ${status} ${action}`;

    return (
      type.includes("execution") ||
      type.includes("executed") ||
      type.includes("trade") ||
      type.includes("order") ||

      status.includes("executed") ||
      status.includes("filled") ||
      status.includes("submitted") ||

      combined.includes("order submitted") ||
      combined.includes("order executed") ||
      combined.includes("trade executed") ||
      combined.includes("trade submitted") ||
      combined.includes("order filled") ||
      combined.includes("filled order") ||
      combined.includes("executed trade") ||
      combined.includes("submitted order") ||
      combined.includes("buy order") ||
      combined.includes("sell order")
    );
  });
}, [autonomousActivity]);

/* ============================================================
   GET AUTONOMOUS ACTIVITY
============================================================ */

const refreshAutonomousActivity = useCallback(
  async () => {
    try {
      const response = await getAgentActivity(100);

      const activity =
        response?.activity ||
        response ||
        [];

      if (Array.isArray(activity)) {
        setAutonomousActivity(activity);
      }
    } catch (err) {
      console.warn(
        "Autonomous activity unavailable:",
        err
      );
    }
  },
  []
);

const handleViewExecutedTrades = useCallback(
  async () => {
    await refreshAutonomousActivity();
    setShowExecutedTrades(true);
  },
  [refreshAutonomousActivity]
);

  /* ==========================================================
     RUN ANALYSIS
  ========================================================== */

  const runAnalysis = useCallback(
    async () => {

      setLoading(true);
      setError("");

      try {

        const results =
          await analyzeAgentSymbols(
            WATCHLIST
          );

        setAnalysis(results);

        setLastUpdated(
          new Date()
        );

        const failed =
          results.filter(
            (item) => !item.success
          );

        if (failed.length > 0) {

          setError(
            `${failed.length} symbol${
              failed.length === 1
                ? ""
                : "s"
            } could not be analyzed.`
          );

        }

      } catch (err) {

        setError(
          getApiErrorMessage(
            err,
            "Unable to connect to the trading backend."
          )
        );

      } finally {

        setLoading(false);

      }

    },
    []
  );


/* ============================================================
   GET AUTONOMOUS STATUS
============================================================ */

const refreshAutonomousStatus = useCallback(
  async () => {
    try {
      const response = await getAgentStatus();

      const status = response?.status || response;

      if (status && typeof status === "object") {
        setAutonomous((previous) => ({
          ...previous,
          ...status,
        }));

        setAutonomousError("");
      }

      return status;
    } catch (err) {
      setAutonomousError(
        getApiErrorMessage(
          err,
          "Unable to read autonomous trading status."
        )
      );

      return null;
    }
  },
  []
);


/* ============================================================
   START AUTONOMOUS TRADING
============================================================ */

const startAutonomous = useCallback(
  async () => {
    setAutonomousLoading(true);
    setAutonomousError("");

    try {
      const response = await startAgent();

      const status =
        response?.status || response;

      if (status && typeof status === "object") {
        setAutonomous((previous) => ({
          ...previous,
          ...status,
        }));
      }

      // Refresh status immediately
      await refreshAutonomousStatus();

      // Activity is supplemental — don't block Start
      refreshAutonomousActivity().catch((err) => {
        console.warn(
          "Autonomous activity unavailable:",
          err
        );
      });

    } catch (err) {
      setAutonomousError(
        getApiErrorMessage(
          err,
          "Unable to start autonomous trading."
        )
      );
    } finally {
      setAutonomousLoading(false);
    }
  },
  [
    refreshAutonomousStatus,
    refreshAutonomousActivity,
  ]
);

/* ============================================================
   STOP AUTONOMOUS TRADING
============================================================ */

const stopAutonomous = useCallback(
  async () => {
    setAutonomousLoading(true);
    setAutonomousError("");

    try {
      const response = await stopAgent();

      const status =
        response?.status || response;

      if (status && typeof status === "object") {
        setAutonomous((previous) => ({
          ...previous,
          ...status,
        }));
      }

      await refreshAutonomousStatus();

      refreshAutonomousActivity().catch((err) => {
        console.warn(
          "Autonomous activity unavailable:",
          err
        );
      });

    } catch (err) {
      setAutonomousError(
        getApiErrorMessage(
          err,
          "Unable to stop autonomous trading."
        )
      );
    } finally {
      setAutonomousLoading(false);
    }
  },
  [
    refreshAutonomousStatus,
    refreshAutonomousActivity,
  ]
);
/* ============================================================
   INITIAL LOAD
============================================================ */

useEffect(() => {
  runAnalysis();
  refreshAutonomousStatus();
  refreshAutonomousActivity();
}, [
  runAnalysis,
  refreshAutonomousStatus,
  refreshAutonomousActivity,
]);


/* ============================================================
   AUTONOMOUS POLLING
============================================================ */

useEffect(() => {
  const interval = setInterval(async () => {
    const status =
      await refreshAutonomousStatus();

    if (status?.running) {
      await refreshAutonomousActivity();
    }
  }, 5000);

  return () => {
    clearInterval(interval);
  };
}, [
  refreshAutonomousStatus,
  refreshAutonomousActivity,
]);




  /* ==========================================================
     SUCCESSFUL ANALYSES
  ========================================================== */

  const successfulAnalysis =
    useMemo(
      () =>
        analysis
          .filter(
            (item) => item.success
          )
          .map(
            (item) => item.data
          ),
      [analysis]
    );


  /* ==========================================================
     STRATEGIES
  ========================================================== */

  const strategies =
    useMemo(
      () =>
        successfulAnalysis
          .map(
            (item) =>
              item?.strategy
          )
          .filter(Boolean),
      [successfulAnalysis]
    );


  /* ==========================================================
     AGENT STATS
  ========================================================== */

  const activeAgents =
    successfulAnalysis.length > 0
      ? 4
      : 0;

  const averageConfidence =
    strategies.length > 0
      ? strategies.reduce(
          (total, strategy) =>
            total +
            Number(
              strategy.confidence || 0
            ),
          0
        ) /
        strategies.length
      : 0;

  const averageRisk =
    strategies.length > 0
      ? strategies.reduce(
          (total, strategy) =>
            total +
            Number(
              strategy.risk_score || 0
            ),
          0
        ) /
        strategies.length
      : 0;


  /* ==========================================================
     DECISION COUNTS
  ========================================================== */

  const buyCount =
    strategies.filter(
      (item) =>
        item.decision === "BUY"
    ).length;

  const sellCount =
    strategies.filter(
      (item) =>
        item.decision === "SELL"
    ).length;

  const holdCount =
    strategies.filter(
      (item) =>
        item.decision === "HOLD"
    ).length;


  /* ==========================================================
     ANALYSIS ACTIVITY
  ========================================================== */

  const analysisActivity =
    useMemo(() => {

      const events = [];

      successfulAnalysis.forEach(
        (item) => {

          const symbol =
            item?.symbol || "—";

          const market =
            item?.market;

          const strategy =
            item?.strategy;

          if (market) {

            events.push({
              time: new Date().toISOString(),
              agent: "Market Agent",
              action:
                `Analyzed ${
                  market.data_points || 0
                } market data points • ${
                  market.trend || "NEUTRAL"
                } trend`,
              symbol,
              type: "market",
              status: "success",
            });

          }

          if (strategy) {

            events.push({
              time: new Date().toISOString(),
              agent: "Strategy Agent",
              action:
                `Generated ${
                  strategy.decision
                } decision with ${
                  formatPercent(
                    Number(
                      strategy.confidence || 0
                    ) * 100
                  )
                } confidence`,
              symbol,
              type: "strategy",
              status: "success",
            });

          }

          if (strategy) {

            events.push({
              time: new Date().toISOString(),
              agent: "Risk Agent",
              action:
                `Calculated AI risk score of ${
                  formatPercent(
                    Number(
                      strategy.risk_score || 0
                    ) * 100
                  )
                }`,
              symbol,
              type: "risk",
              status: "success",
            });

          }

        }
      );

      return events.slice(0, 8);

    }, [successfulAnalysis]);


  /* ==========================================================
     COMBINED ACTIVITY
  ========================================================== */

  const activity =
    useMemo(() => {

      if (
        autonomousActivity.length > 0
      ) {
        return autonomousActivity.slice(
          0,
          10
        );
      }

      return analysisActivity;

    }, [
      autonomousActivity,
      analysisActivity,
    ]);


  /* ==========================================================
     SIGNALS
  ========================================================== */

  const signals =
    successfulAnalysis;


  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <AppLayout>

      <div className="min-h-screen overflow-hidden bg-[#f7f6f2] text-[#17151f]">

        {/* =====================================================
            AMBIENT BACKGROUND
        ====================================================== */}

        <div className="pointer-events-none fixed inset-0 overflow-hidden">

          <div className="absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-[#c7b7ff]/20 blur-[120px]" />

          <div className="absolute right-[-100px] top-[280px] h-[420px] w-[420px] rounded-full bg-[#a8f3d0]/20 blur-[130px]" />

          <div className="absolute bottom-[-200px] left-[40%] h-[400px] w-[500px] rounded-full bg-[#ffd8c8]/20 blur-[140px]" />

        </div>


        <main className="relative mx-auto max-w-[1700px] px-5 py-7 sm:px-8 lg:px-10">

          {/* ===================================================
              HEADER
          ==================================================== */}

          <section className="mb-8">

            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

              <div>

                <div className="mb-4 flex items-center gap-2">

                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f1edff] text-[#7859f4]">

                    <Bot size={13} />

                  </span>

                  <SectionLabel>
                    Autonomous intelligence
                  </SectionLabel>

                </div>


                <h1 className="text-4xl font-semibold tracking-[-0.055em] text-[#17151f] sm:text-5xl">

                  AI Trading

                  <span className="text-[#7f5cff]">
                    {" "}Agents.
                  </span>

                </h1>


                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#77717f]">

                  Monitor and control the real trading intelligence
                  pipeline powered by Alpaca market data, AI strategy
                  reasoning and automated risk controls.

                </p>

              </div>


              {/* CONTROLS */}

              <div className="flex flex-wrap items-center gap-3">

                <div
                  className={[
                    "flex items-center gap-2 rounded-xl px-4 py-2.5",

                    autonomous?.running
                      ? "border border-[#dcefe6] bg-[#f1fff8]"
                      : "border border-[#e7e3dc] bg-white",
                  ].join(" ")}
                >

                  <span className="relative flex h-2 w-2">

                    {autonomous?.running && (
                      <span className="absolute inset-0 animate-ping rounded-full bg-[#35c98b] opacity-40" />
                    )}

                    <span
                      className={[
                        "relative h-2 w-2 rounded-full",

                        autonomous?.running
                          ? "bg-[#35c98b]"
                          : "bg-[#aaa3ad]",
                      ].join(" ")}
                    />

                  </span>

                  <span
                    className={[
                      "text-[10px] font-bold uppercase tracking-[0.12em]",

                      autonomous?.running
                        ? "text-[#26966b]"
                        : "text-[#817987]",
                    ].join(" ")}
                  >

                    {autonomous?.running
                      ? "Autonomous live"
                      : "Autonomous stopped"}

                  </span>

                </div>


                <button
                  type="button"
                  onClick={runAnalysis}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl border border-[#e7e3dc] bg-white px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#696270] shadow-[0_8px_25px_rgba(40,30,60,0.04)] transition hover:-translate-y-0.5 hover:border-[#d7d0e8] hover:text-[#17151f] disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <RefreshCw
                    size={13}
                    className={
                      loading
                        ? "animate-spin"
                        : ""
                    }
                  />

                  {loading
                    ? "Analyzing..."
                    : "Run analysis"}

                </button>

              </div>

            </div>


            {/* GENERAL ERROR */}

            {error && (

              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#f1dfd7] bg-[#fff7f3] px-4 py-3 text-[10px] font-medium text-[#b85f4e]">

                <AlertTriangle size={14} />

                {error}

              </div>

            )}

            {/* AUTONOMOUS ERROR */}

            {autonomousError && (

              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-[#f1dfd7] bg-[#fff7f3] px-4 py-3 text-[10px] font-medium text-[#b85f4e]">

                <AlertTriangle size={14} />

                {autonomousError}

              </div>

            )}

          </section>


          {/* ===================================================
              AUTONOMOUS ENGINE
          ==================================================== */}

          <AutonomousControl
            autonomous={autonomous}
            loading={autonomousLoading}
            onStart={startAutonomous}
            onStop={stopAutonomous}
            onViewExecuted={handleViewExecutedTrades}
          />

          

{showExecutedTrades && (
  <div className="mb-7 rounded-[26px] border border-[#dcefe6] bg-white shadow-[0_20px_60px_rgba(45,35,70,0.07)]">

    <div className="flex items-center justify-between border-b border-[#eeeae5] bg-[#f7fffb] px-6 py-5">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edfff7]">
          <Check
            size={16}
            className="text-[#26966b]"
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-[#211e28]">
            Executed trades
          </p>

          <p className="mt-1 text-[9px] uppercase tracking-wider text-[#97909b]">
            Orders submitted by the autonomous engine
          </p>
        </div>

      </div>

      <button
        type="button"
        onClick={() => setShowExecutedTrades(false)}
        className="rounded-xl border border-[#e7e3dc] bg-white px-3 py-2 text-[8px] font-bold uppercase tracking-wider text-[#817987] hover:bg-[#f8f6f3]"
      >
        Close
      </button>

    </div>

    <div className="divide-y divide-[#eeeae5]">

     {executedTrades.length > 0 ? (
  executedTrades.map((trade, index) => (
    <ActivityRow
      key={`${trade.time}-${index}`}
      item={trade}
    />
  ))
) : (
  <div className="px-6 py-12 text-center">

    <Check
      size={20}
      className="mx-auto text-[#b0aab3]"
    />

    <p className="mt-3 text-[10px] font-semibold text-[#756d80]">
      Execution details are not available in the activity stream
    </p>

    <p className="mt-1 text-[9px] text-[#aaa3ad]">
      The autonomous engine reports{" "}
      {autonomous?.trades_executed || 0} executed trade
      {Number(autonomous?.trades_executed || 0) === 1
        ? ""
        : "s"}
      , but the execution records were not returned by the
      activity endpoint.
    </p>

  </div>
)}
    </div>

  </div>
)}

          {/* ===================================================
              OVERVIEW
          ==================================================== */}

          <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              label="Agents online"
              value={`${activeAgents} / 4`}
              change={
                activeAgents
                  ? "Connected"
                  : "Offline"
              }
              icon={Bot}
              accent="violet"
            />

            <StatCard
              label="Symbols analyzed"
              value={
                successfulAnalysis.length
              }
              change={
                `${WATCHLIST.length} requested`
              }
              icon={Activity}
              accent="mint"
            />

            <StatCard
              label="Avg. confidence"
              value={
                strategies.length
                  ? formatPercent(
                      averageConfidence *
                        100
                    )
                  : "—"
              }
              change={
                strategies.length
                  ? `${buyCount} BUY · ${sellCount} SELL`
                  : "No analysis"
              }
              icon={Gauge}
              accent="purple"
            />

            <StatCard
              label="Autonomous trades"
              value={
                formatNumber(
                  autonomous?.trades_executed
                )
              }
              change={
                autonomous?.running
                  ? "Engine running"
                  : "Engine stopped"
              }
              icon={Zap}
              accent="peach"
            />

          </section>


          {/* ===================================================
              AGENT NETWORK
          ==================================================== */}

          <section className="mb-7">

            <div className="mb-5 flex items-end justify-between">

              <div>

                <p className="text-sm font-semibold text-[#211e28]">
                  Agent network
                </p>

                <p className="mt-1 text-[9px] uppercase tracking-wider text-[#97909b]">
                  Backend intelligence layers
                </p>

              </div>


              <div className="flex items-center gap-2 rounded-full bg-[#edfff7] px-3 py-1.5">

                <span className="h-1.5 w-1.5 rounded-full bg-[#35c98b]" />

                <span className="text-[8px] font-bold uppercase tracking-wider text-[#26966b]">
                  Backend connected
                </span>

              </div>

            </div>


            <div className="grid gap-5 xl:grid-cols-2">

              {agentDefinitions.map(
                (agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    analysis={
                      successfulAnalysis[0]
                    }
                    loading={loading}
                  />
                )
              )}

            </div>

          </section>


          {/* ===================================================
              INTELLIGENCE PIPELINE
          ==================================================== */}

          <section className="mb-7 overflow-hidden rounded-[26px] border border-[#e6e0f2] bg-[#f7f4ff]">

            <div className="relative flex flex-col justify-between gap-4 border-b border-[#e7e0f0] px-6 py-5 sm:flex-row sm:items-center">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">

                  <Sparkles
                    size={17}
                    className="text-[#7859f4]"
                  />

                </div>

                <div>

                  <p className="text-sm font-semibold text-[#25202f]">
                    Trade Pilot Intelligence
                  </p>

                  <p className="mt-1 text-[9px] uppercase tracking-wider text-[#958da2]">
                    Market → Strategy → Risk → Execution
                  </p>

                </div>

              </div>


              <span className="flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[8px] font-bold uppercase tracking-wider text-[#26966b] shadow-sm">

                <span
                  className={[
                    "h-1.5 w-1.5 rounded-full",
                    autonomous?.running
                      ? "animate-pulse bg-[#35c98b]"
                      : "bg-[#aaa3ad]",
                  ].join(" ")}
                />

                {autonomous?.running
                  ? "Autonomous processing"
                  : "System ready"}

              </span>

            </div>


            <div className="relative grid gap-4 p-6 md:grid-cols-4">

              <PipelineStep
                number="01"
                icon={TrendingUp}
                title="Market Agent"
                description="Pulls market data and calculates trend, RSI, MACD, volume and performance."
                active={
                  successfulAnalysis.length >
                  0
                }
              />

              <PipelineStep
                number="02"
                icon={BrainCircuit}
                title="Strategy Agent"
                description="Sends market intelligence to the AI service for BUY, SELL or HOLD reasoning."
                active={
                  strategies.length >
                  0
                }
              />

              <PipelineStep
                number="03"
                icon={ShieldCheck}
                title="Risk Agent"
                description="Evaluates confidence, risk score and portfolio exposure before execution."
                ready={
                  strategies.length >
                  0
                }
              />

              <PipelineStep
                number="04"
                icon={Zap}
                title="Alpaca Execution"
                description="Submits only approved autonomous orders to the configured paper trading account."
                ready={
                  autonomous?.running
                    ? true
                    : autonomous?.paper_trading
                }
              />

            </div>

          </section>


          {/* ===================================================
              LOWER GRID
          ==================================================== */}

          <section className="mb-7 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">

            {/* ACTIVITY */}

            <div className="overflow-hidden rounded-[26px] border border-[#e7e2db] bg-white shadow-[0_20px_60px_rgba(45,35,70,0.05)]">

              <div className="flex items-center justify-between border-b border-[#eeeae5] px-6 py-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1edff]">

                    <Activity
                      size={15}
                      className="text-[#7859f4]"
                    />

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-[#211e28]">
                      Agent activity
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-wider text-[#97909b]">
                      Live autonomous activity stream
                    </p>

                  </div>

                </div>


                <span className="flex items-center gap-1.5 rounded-full bg-[#edfff7] px-2.5 py-1.5 text-[7px] font-bold uppercase tracking-wider text-[#26966b]">

                  <span className="h-1 w-1 animate-pulse rounded-full bg-[#35c98b]" />

                  Live

                </span>

              </div>


              <div className="divide-y divide-[#eeeae5]">

                {activity.length > 0 ? (

                  activity.map(
                    (item, index) => (
                      <ActivityRow
                        key={`${item.time}-${item.agent}-${index}`}
                        item={item}
                      />
                    )
                  )

                ) : (

                  <div className="px-6 py-12 text-center">

                    <Cpu
                      size={20}
                      className="mx-auto text-[#b0aab3]"
                    />

                    <p className="mt-3 text-[10px] font-semibold text-[#756d80]">
                      No activity yet
                    </p>

                    <p className="mt-1 text-[9px] text-[#aaa3ad]">
                      Start autonomous trading or run an analysis.
                    </p>

                  </div>

                )}

              </div>

            </div>


            {/* SIGNALS */}

            <div className="overflow-hidden rounded-[26px] border border-[#e7e2db] bg-white shadow-[0_20px_60px_rgba(45,35,70,0.05)]">

              <div className="flex items-center justify-between border-b border-[#eeeae5] px-6 py-5">

                <div>

                  <p className="text-sm font-semibold text-[#211e28]">
                    Active signals
                  </p>

                  <p className="mt-1 text-[9px] uppercase tracking-wider text-[#97909b]">
                    AI decisions from current analysis
                  </p>

                </div>


                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f3f8]">

                  <LineChart
                    size={15}
                    className="text-[#7d7486]"
                  />

                </div>

              </div>


              <div className="px-6">

                {signals.length > 0 ? (

                  signals.map(
                    (signal) => (
                      <SignalRow
                        key={signal.symbol}
                        signal={signal}
                      />
                    )
                  )

                ) : (

                  <div className="py-12 text-center">

                    <LineChart
                      size={20}
                      className="mx-auto text-[#b0aab3]"
                    />

                    <p className="mt-3 text-[10px] font-semibold text-[#756d80]">
                      No signals available
                    </p>

                    <p className="mt-1 text-[9px] text-[#aaa3ad]">
                      Backend analysis has not returned a result yet.
                    </p>

                  </div>

                )}

              </div>

            </div>

          </section>


          {/* ===================================================
              AUTONOMOUS SESSION
          ==================================================== */}

          <section className="mb-7 rounded-[26px] border border-[#e7e2db] bg-white p-6 shadow-[0_20px_60px_rgba(45,35,70,0.05)]">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edfff7]">

                    <ShieldCheck
                      size={16}
                      className="text-[#26966b]"
                    />

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-[#211e28]">
                      Autonomous session controls
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-wider text-[#97909b]">
                      Paper execution safety limits
                    </p>

                  </div>

                </div>

              </div>


              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                <SessionStat
                  label="Max / trade"
                  value={
                    formatPercent(
                      Number(
                        autonomous?.max_trade_percent ||
                        0
                      ) * 100
                    )
                  }
                />

                <SessionStat
                  label="Scan interval"
                  value={
                    autonomous?.scan_interval_seconds
                      ? `${Math.round(
                          autonomous.scan_interval_seconds /
                          60
                        )}m`
                      : "—"
                  }
                />

                <SessionStat
                  label="Session trades"
                  value={
                    `${autonomous?.trades_executed || 0} / 10`
                  }
                />

                <SessionStat
                  label="Environment"
                  value="PAPER"
                />

              </div>

            </div>


            {autonomous?.last_error && (

              <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#f1dfd7] bg-[#fff7f3] px-4 py-3 text-[9px] text-[#b85f4e]">

                <AlertTriangle size={13} />

                <span>
                  {autonomous.last_error}
                </span>

              </div>

            )}

          </section>


          {/* ===================================================
              BACKEND DATA
          ==================================================== */}

          <section className="mb-7 rounded-[26px] border border-[#e7e2db] bg-white p-6 shadow-[0_20px_60px_rgba(45,35,70,0.05)]">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <p className="text-sm font-semibold text-[#211e28]">
                  Current analysis universe
                </p>

                <p className="mt-1 text-[9px] uppercase tracking-wider text-[#97909b]">
                  Symbols monitored by Trade Pilot
                </p>

              </div>


              <div className="flex flex-wrap gap-2">

                {WATCHLIST.map(
                  (symbol) => {

                    const result =
                      analysis.find(
                        (item) =>
                          item.symbol ===
                          symbol
                      );

                    const autonomousSymbol =
                      autonomous?.current_symbol ===
                      symbol;

                    return (
                      <span
                        key={symbol}
                        className={[
                          "rounded-full px-3 py-1.5 text-[8px] font-bold uppercase tracking-wider",

                          autonomousSymbol
                            ? "bg-[#f1edff] text-[#7859f4]"
                            : result?.success
                            ? "bg-[#edfff7] text-[#26966b]"
                            : result
                            ? "bg-[#fff1eb] text-[#d76a56]"
                            : "bg-[#f5f3f8] text-[#817987]",
                        ].join(" ")}
                      >

                        {symbol}

                        {autonomousSymbol
                          ? " · scanning"
                          : result?.success
                          ? " · synced"
                          : result
                          ? " · failed"
                          : " · waiting"}

                      </span>
                    );

                  }
                )}

              </div>

            </div>

          </section>


          {/* ===================================================
              FOOTER STATUS
          ==================================================== */}

          <div className="flex flex-col gap-3 border-t border-[#e7e2db] pt-5 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#aaa3ad] sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <span className="flex items-center gap-2 text-[#756d80]">

                <span
                  className={[
                    "h-1.5 w-1.5 rounded-full",

                    autonomous?.running
                      ? "animate-pulse bg-[#35c98b]"
                      : "bg-[#aaa3ad]",
                  ].join(" ")}
                />

                Trade Pilot AI

              </span>

              <span>
                FastAPI · Alpaca · OpenAI
              </span>

            </div>


            <div className="flex flex-wrap items-center gap-2">

              <ShieldCheck size={11} />

              <span>
                Paper execution environment
              </span>

              <span className="mx-1 text-[#d4cfd5]">
                ·
              </span>

              <Clock3 size={11} />

              <span>
                {autonomous?.last_scan_at
                  ? `Last scan ${new Date(
                      autonomous.last_scan_at
                    ).toLocaleTimeString(
                      undefined,
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                      }
                    )}`
                  : lastUpdated
                  ? `Last analysis ${formatTime(
                      lastUpdated
                    )}`
                  : "Waiting"}
              </span>

            </div>

          </div>

        </main>

      </div>

    </AppLayout>
  );
}


/* ============================================================
   SESSION STAT
============================================================ */

function SessionStat({
  label,
  value,
}) {
  return (
    <div className="min-w-[100px] rounded-xl bg-[#f8f6f3] px-4 py-3">

      <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#aaa3ad]">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-semibold text-[#39333f]">
        {value}
      </p>

    </div>
  );
}


function TradeDetail({
  label,
  value,
  success = false,
}) {
  return (
    <div className="min-w-[100px] rounded-xl bg-[#f8f6f3] px-4 py-3">

      <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#aaa3ad]">
        {label}
      </p>

      <p
        className={[
          "mt-1.5 max-w-[140px] truncate text-xs font-semibold",
          success
            ? "text-[#26966b]"
            : "text-[#39333f]",
        ].join(" ")}
        title={String(value)}
      >
        {value}
      </p>

    </div>
  );
}

