import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Command,
  Cpu,
  Eye,
  Gauge,
  Layers3,
  LineChart,
  Orbit,
  Radio,
  RefreshCw,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  TriangleAlert,
  Wallet,
  XCircle,
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
  getLiveDashboard,
  getMarketBars,
  analyzeSymbol,
  getApiErrorMessage,
} from "../services/api";

/* ============================================================
   DASHBOARD
============================================================ */

export default function Dashboard() {
  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [dashboardError, setDashboardError] =
    useState("");

  const [analysis, setAnalysis] =
    useState(null);

  const [analysisLoading, setAnalysisLoading] =
    useState(false);

  const [analysisError, setAnalysisError] =
    useState("");

  const [selectedSymbol, setSelectedSymbol] =
    useState("");

  const [range, setRange] =
    useState("1M");

  const [lastUpdated, setLastUpdated] =
    useState(null);

  const [marketBars, setMarketBars] = useState([]);
  const [marketLoading, setMarketLoading] = useState(false);
  const [marketError, setMarketError] = useState("");
  const [marketTimeframe, setMarketTimeframe] = useState("1Min");

  /* ==========================================================
     DERIVED DATA
  ========================================================== */

  const account =
    dashboard?.account || null;

  const positions =
    Array.isArray(dashboard?.positions)
      ? dashboard.positions
      : [];

  const overview =
    dashboard?.overview || null;

  /* ==========================================================
     LOAD LIVE DATA
  ========================================================== */

  const loadDashboard = useCallback(
    async ({ silent = false } = {}) => {
      try {
        if (silent) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setDashboardError("");

        const result =
          await getLiveDashboard();

        setDashboard(result);

        setLastUpdated(
          result?.syncedAt || new Date().toISOString()
        );

        if (
          result?.errors?.length
        ) {
          const firstError =
            result.errors[0]?.error;

          setDashboardError(
            getApiErrorMessage(
              firstError,
              "Some dashboard data could not be synchronized."
            )
          );
        }
      } catch (error) {
        console.error(
          "Dashboard error:",
          error
        );

        setDashboardError(
          getApiErrorMessage(
            error,
            "Unable to connect to the trading backend."
          )
        );
      } finally {
        setLoading(false);

        if (silent) {
          window.setTimeout(() => {
            setRefreshing(false);
          }, 400);
        } else {
          setRefreshing(false);
        }
      }
    },
    []
  );

  /* ==========================================================
     INITIAL LOAD
  ========================================================== */

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  /* ==========================================================
     AUTO REFRESH
     
     Every 15 seconds while dashboard is open.
  ========================================================== */

  useEffect(() => {
    const interval =
      window.setInterval(() => {
        if (
          document.visibilityState ===
          "visible"
        ) {
          loadDashboard({
            silent: true,
          });
        }
      }, 15000);

    return () => {
      window.clearInterval(interval);
    };
  }, [loadDashboard]);

  /* ==========================================================
     SYMBOLS FROM BACKEND / REAL POSITIONS
  ========================================================== */

  const marketWatch =
    useMemo(() => {
      const backendWatchlist =
        overview?.watchlist ||
        overview?.markets ||
        overview?.market_watch ||
        [];

      if (
        Array.isArray(
          backendWatchlist
        ) &&
        backendWatchlist.length
      ) {
        return backendWatchlist
          .map((item) => {
            if (
              typeof item ===
              "string"
            ) {
              return {
                symbol:
                  item.toUpperCase(),
                name:
                  item.toUpperCase(),
              };
            }

            return {
              symbol:
                item?.symbol ||
                item?.ticker ||
                "",
              name:
                item?.name ||
                item?.description ||
                item?.symbol ||
                "",
              price:
                item?.price ??
                item?.last_price ??
                null,
              change:
                item?.change ??
                item?.change_percent ??
                null,
            };
          })
          .filter(
            (item) =>
              item.symbol
          );
      }

      const positionSymbols =
        positions
          .map(
            (position) =>
              position?.symbol
          )
          .filter(Boolean);

      return [
        ...new Set(
          positionSymbols.map(
            (symbol) =>
              String(
                symbol
              ).toUpperCase()
          )
        ),
      ].map((symbol) => ({
        symbol,
        name: symbol,
      }));
    }, [
      overview,
      positions,
    ]);

  /* ==========================================================
     DEFAULT SYMBOL
  ========================================================== */

  useEffect(() => {
    if (
      !selectedSymbol &&
      marketWatch.length
    ) {
      setSelectedSymbol(
        marketWatch[0].symbol
      );
    }
  }, [
    marketWatch,
    selectedSymbol,
  ]);


  /* ==========================================================
   LOAD MARKET CHART
========================================================== */

useEffect(() => {
  let cancelled = false;

  const loadMarketBars = async () => {
    try {
      setMarketLoading(true);
      setMarketError("");

      const result = await getMarketBars(
        selectedSymbol,
        marketTimeframe,
        200
      );

      if (cancelled) return;

      const bars =
        Array.isArray(result)
          ? result
          : result?.bars || [];

      setMarketBars(bars);
    } catch (error) {
      if (cancelled) return;

      setMarketBars([]);
      setMarketError(
        getApiErrorMessage(
          error,
          "Unable to load market data."
        )
      );
    } finally {
      if (!cancelled) {
        setMarketLoading(false);
      }
    }
  };

  loadMarketBars();

  /*
   * Refresh live market data.
   * This keeps the dashboard chart moving
   * without requiring the user to refresh.
   */
  const interval = setInterval(
    loadMarketBars,
    5000
  );

  return () => {
    cancelled = true;
    clearInterval(interval);
  };
}, [
  selectedSymbol,
  marketTimeframe,
]);

  /* ==========================================================
     ACCOUNT MODE
  ========================================================== */

  const paperTrading =
    account?.paper_trading ??
    account?.paperTrading ??
    overview?.paper_trading ??
    overview?.paperTrading ??
    true;

  /* ==========================================================
     NUMERIC HELPERS
  ========================================================== */

  const numberValue = useCallback(
    (value) => {
      const parsed =
        Number(value);

      return Number.isFinite(parsed)
        ? parsed
        : 0;
    },
    []
  );

  /* ==========================================================
     MONEY FORMAT
  ========================================================== */

  const formatMoney = useCallback(
    (value) => {
      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        return "—";
      }

      const numeric =
        Number(value);

      if (
        !Number.isFinite(numeric)
      ) {
        return "—";
      }

      return `$${numeric.toLocaleString(
        undefined,
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )}`;
    },
    []
  );

  /* ==========================================================
     NUMBER FORMAT
  ========================================================== */

  const formatNumber = useCallback(
    (value) => {
      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        return "—";
      }

      const numeric =
        Number(value);

      if (
        !Number.isFinite(numeric)
      ) {
        return "—";
      }

      return numeric.toLocaleString(
        undefined,
        {
          maximumFractionDigits: 4,
        }
      );
    },
    []
  );

  /* ==========================================================
     PORTFOLIO CALCULATIONS
  ========================================================== */

  const portfolioStats =
    useMemo(() => {
      const unrealizedPL =
        positions.reduce(
          (total, position) =>
            total +
            numberValue(
              position?.unrealized_pl ??
                position?.unrealizedPL ??
                position?.unrealized_profit_loss
            ),
          0
        );

      const marketValue =
        positions.reduce(
          (total, position) =>
            total +
            numberValue(
              position?.market_value ??
                position?.marketValue
            ),
          0
        );

      const costBasis =
        positions.reduce(
          (total, position) =>
            total +
            numberValue(
              position?.cost_basis ??
                position?.costBasis
            ),
          0
        );

      const returnPercent =
        costBasis > 0
          ? (unrealizedPL /
              costBasis) *
            100
          : 0;

      return {
        unrealizedPL,
        marketValue,
        costBasis,
        returnPercent,
      };
    }, [
      positions,
      numberValue,
    ]);

  const {
    unrealizedPL,
    marketValue,
    costBasis,
    returnPercent,
  } = portfolioStats;

  const isProfit =
    unrealizedPL >= 0;

  /* ==========================================================
     LIVE DASHBOARD METRICS
     
     Backend values are preferred.
  ========================================================== */

  const aiDecisions =
    overview?.ai_decisions ??
    overview?.aiDecisions ??
    overview?.decisions ??
    overview?.total_ai_decisions ??
    null;

  const tradesExecuted =
    overview?.trades_executed ??
    overview?.tradesExecuted ??
    overview?.trades_today ??
    overview?.today_trades ??
    null;

  const riskChecks =
    overview?.risk_checks ??
    overview?.riskChecks ??
    overview?.total_risk_checks ??
    null;

  /* ==========================================================
     AI ANALYSIS
  ========================================================== */

  const analysisSignal =
    analysis?.signal ||
    analysis?.recommendation ||
    analysis?.action ||
    analysis?.decision ||
    null;

  const analysisConfidence =
    analysis?.confidence ??
    analysis?.score ??
    null;

  const analysisSummary =
    analysis?.summary ||
    analysis?.reason ||
    analysis?.analysis ||
    analysis?.message ||
    null;

  /* ==========================================================
     RUN AI ANALYSIS
  ========================================================== */

  async function runAnalysis(
    symbol = selectedSymbol
  ) {
    const normalizedSymbol =
      String(symbol || "")
        .trim()
        .toUpperCase();

    if (
      !normalizedSymbol ||
      analysisLoading
    ) {
      return;
    }

    try {
      setAnalysisLoading(true);
      setAnalysisError("");

      setSelectedSymbol(
        normalizedSymbol
      );

      const result =
        await analyzeSymbol(
          normalizedSymbol
        );

      setAnalysis(result);
    } catch (error) {
      console.error(
        "Analysis error:",
        error
      );

      setAnalysis(null);

      setAnalysisError(
        getApiErrorMessage(
          error,
          "Unable to analyze this symbol."
        )
      );
    } finally {
      setAnalysisLoading(false);
    }
  }

  /* ==========================================================
     LIVE STATUS
  ========================================================== */

  const systemOnline =
    Boolean(dashboard) &&
    !dashboardError;

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <AppLayout>
      <div className="relative min-h-screen overflow-hidden bg-[#f7f6f2] text-[#17151f]">

        {/* ====================================================
            AMBIENT BACKGROUND
        ==================================================== */}

        <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
          <div className="absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-[#c7b7ff]/20 blur-[120px]" />

          <div className="absolute right-[-100px] top-[280px] h-[420px] w-[420px] rounded-full bg-[#a8f3d0]/20 blur-[130px]" />

          <div className="absolute bottom-[-200px] left-[40%] h-[400px] w-[500px] rounded-full bg-[#ffd8c8]/20 blur-[140px]" />
        </div>

        <main className="relative z-10 mx-auto w-full max-w-[1700px] px-4 py-6 sm:px-6 sm:py-7 lg:px-8 xl:px-10">

          {/* ==================================================
              HEADER
          ================================================== */}

          <section className="mb-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

              <div className="min-w-0">

                <div className="mb-4 flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#17151f] text-white shadow-sm">
                    <Command size={13} />
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7b7487]">
                    Command center
                  </span>
                </div>

                <h1 className="text-3xl font-semibold tracking-[-0.055em] text-[#17151f] sm:text-4xl lg:text-5xl">
                  Good trading,
                  <span className="text-[#7f5cff]">
                    {" "}think bigger.
                  </span>
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#77717f]">
                  Your portfolio, market intelligence
                  and AI trading agents are working
                  from one workspace.
                </p>

              </div>

              <div className="flex flex-wrap items-center gap-3">

                <button
                  type="button"
                  onClick={() =>
                    loadDashboard({
                      silent: true,
                    })
                  }
                  disabled={
                    refreshing ||
                    loading
                  }
                  className="group flex items-center gap-2 rounded-xl border border-[#e7e3dc] bg-white px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#696270] shadow-[0_8px_25px_rgba(40,30,60,0.04)] transition hover:-translate-y-0.5 hover:border-[#d7d0e8] hover:text-[#17151f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw
                    size={13}
                    className={
                      refreshing
                        ? "animate-spin"
                        : "transition group-hover:rotate-90"
                    }
                  />

                  Refresh
                </button>

                <div
                  className={[
                    "flex items-center gap-2 rounded-xl border px-4 py-2.5",
                    systemOnline
                      ? "border-[#dcefe6] bg-[#f1fff8]"
                      : "border-[#f1d7d2] bg-[#fff6f4]",
                  ].join(" ")}
                >
                  <span className="relative flex h-2 w-2">

                    {systemOnline && (
                      <span className="absolute inset-0 animate-ping rounded-full bg-[#35c98b] opacity-50" />
                    )}

                    <span
                      className={[
                        "relative h-2 w-2 rounded-full",
                        systemOnline
                          ? "bg-[#35c98b]"
                          : "bg-[#d35d4e]",
                      ].join(" ")}
                    />
                  </span>

                  <span
                    className={[
                      "text-[10px] font-bold uppercase tracking-[0.12em]",
                      systemOnline
                        ? "text-[#26966b]"
                        : "text-[#b04e42]",
                    ].join(" ")}
                  >
                    {systemOnline
                      ? "System online"
                      : "System offline"}
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-[#e7e3dc] bg-white px-4 py-2.5 shadow-[0_8px_25px_rgba(40,30,60,0.04)]">

                  <Radio
                    size={13}
                    className="text-[#8a8391]"
                  />

                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#77717f]">
                    {paperTrading
                      ? "Paper mode"
                      : "Live mode"}
                  </span>

                </div>

              </div>
            </div>
          </section>

          {/* ==================================================
              CONNECTION ERROR
          ================================================== */}

          {dashboardError && (
            <section className="mb-6 rounded-2xl border border-[#f1d7d2] bg-[#fff6f4] px-5 py-4">

              <div className="flex items-start gap-3">

                <XCircle
                  size={16}
                  className="mt-0.5 shrink-0 text-[#d35d4e]"
                />

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#9f4035]">
                    Dashboard connection issue
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-[#b06d64]">
                    {dashboardError}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    loadDashboard()
                  }
                  className="ml-auto shrink-0 rounded-lg bg-white px-3 py-2 text-[8px] font-bold uppercase tracking-wider text-[#9f4035] shadow-sm"
                >
                  Retry
                </button>

              </div>
            </section>
          )}

          {/* ==================================================
              OVERVIEW
          ================================================== */}

          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <OverviewCard
              icon={Wallet}
              label="Total equity"
              value={
                loading
                  ? "Loading..."
                  : formatMoney(
                      account?.equity
                    )
              }
              accent="violet"
              trend={
                account?.status ||
                "Account equity"
              }
            />

            <OverviewCard
              icon={CircleDollarSign}
              label="Available cash"
              value={
                loading
                  ? "Loading..."
                  : formatMoney(
                      account?.cash
                    )
              }
              accent="mint"
              trend="Capital available"
            />

            <OverviewCard
              icon={TrendingUp}
              label="Buying power"
              value={
                loading
                  ? "Loading..."
                  : formatMoney(
                      account?.buying_power ??
                      account?.buyingPower
                    )
              }
              accent="peach"
              trend="Available to trade"
            />

            <OverviewCard
              icon={Layers3}
              label="Open positions"
              value={
                loading
                  ? "..."
                  : positions.length
              }
              accent="purple"
              trend={
                positions.length
                  ? "Currently active"
                  : "Portfolio clear"
              }
            />

          </section>

          {/* ==================================================
              PORTFOLIO
          ================================================== */}

          <section className="relative mb-6 overflow-hidden rounded-[28px] border border-[#e7e2db] bg-white shadow-[0_25px_80px_rgba(45,35,70,0.07)]">

            <div className="pointer-events-none absolute right-[-100px] top-[-150px] h-[450px] w-[450px] rounded-full bg-[#bcaaff]/15 blur-[100px]" />

            <div className="relative flex flex-col justify-between gap-5 border-b border-[#eeeae5] px-5 py-5 sm:flex-row sm:items-center sm:px-8">

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f1edff]">
                  <LineChart
                    size={19}
                    className="text-[#7f5cff]"
                  />
                </div>

                <div>

                  <div className="flex flex-wrap items-center gap-2">

                    <h2 className="text-sm font-semibold text-[#211e28]">
                      Market intelligence
                    </h2>

                    <span className="rounded-full bg-[#f3f1f6] px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-[#817a89]">
                      {paperTrading
                        ? "Paper"
                        : "Live"}
                    </span>

                  </div>

                 <p className="mt-1 text-[10px] text-[#97909b]">
                    Live market price action
                  </p>

                </div>
              </div>

              {/* <div className="flex items-center gap-1 self-start rounded-xl bg-[#faf9f7] p-1 sm:self-auto">

                {[
                  "1D",
                  "1W",
                  "1M",
                  "1Y",
                ].map((item) => (
                  <TimeButton
                    key={item}
                    active={
                      range === item
                    }
                    onClick={() =>
                      setRange(item)
                    }
                  >
                    {item}
                  </TimeButton>
                ))}

              </div> */}

            </div>

            <div className="relative grid lg:grid-cols-[0.7fr_1.3fr]">

              <div className="border-b border-[#eeeae5] p-6 sm:p-9 lg:border-b-0 lg:border-r">

                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#918a96]">
                  Current equity
                </p>

                <h2 className="mt-3 truncate text-4xl font-semibold tracking-[-0.06em] text-[#17151f] sm:text-5xl">
                  {loading
                    ? "Loading..."
                    : formatMoney(
                        account?.equity
                      )}
                </h2>

                <div className="mt-5 flex flex-wrap items-center gap-3">

                  <div
                    className={[
                      "flex items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-bold",
                      isProfit
                        ? "bg-[#edfff7] text-[#26966b]"
                        : "bg-[#fff0ed] text-[#d35d4e]",
                    ].join(" ")}
                  >

                    {isProfit ? (
                      <ArrowUpRight
                        size={13}
                      />
                    ) : (
                      <ArrowDownRight
                        size={13}
                      />
                    )}

                    {formatMoney(
                      Math.abs(
                        unrealizedPL
                      )
                    )}
                  </div>

                  <span className="text-[9px] font-semibold uppercase tracking-wider text-[#9a939f]">
                    Unrealized P/L
                  </span>

                </div>

                <div className="mt-9 grid grid-cols-2 gap-3">

                  <SmallStat
                    label="Market value"
                    value={formatMoney(
                      marketValue
                    )}
                  />

                  <SmallStat
                    label="Return"
                    value={
                      costBasis > 0
                        ? `${
                            returnPercent >=
                            0
                              ? "+"
                              : ""
                          }${returnPercent.toFixed(
                            2
                          )}%`
                        : "—"
                    }
                  />

                </div>

              </div>

              {/* ==================================================
                  REAL DATA NOTICE
                  
                  We intentionally don't fabricate a portfolio
                  history chart when the backend doesn't provide
                  historical equity data.
              ================================================== */}

              <div className="relative min-h-[300px] p-6 sm:min-h-[330px] sm:p-8">

                <MarketChart
                  data={marketBars}
                  loading={marketLoading}
                  error={marketError}
                  symbol={selectedSymbol}
                  timeframe={marketTimeframe}
                  onTimeframeChange={
                    setMarketTimeframe
                  }
                />

              </div>
            </div>
          </section>

          {/* ==================================================
              AI + MARKET
          ================================================== */}

          <section className="mb-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">

            {/* AI */}

            <div className="relative overflow-hidden rounded-[26px] border border-[#e6e0f2] bg-[#f7f4ff]">

              <div className="pointer-events-none absolute right-[-80px] top-[-100px] h-[300px] w-[300px] rounded-full bg-[#b9a5ff]/20 blur-[80px]" />

              <div className="relative flex items-center justify-between border-b border-[#e7e0f0] px-5 py-5 sm:px-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">

                    <BrainCircuit
                      size={17}
                      className="text-[#7859f4]"
                    />

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-[#25202f]">
                      Trade Pilot Intelligence
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-wider text-[#958da2]">
                      AI analysis pipeline
                    </p>

                  </div>

                </div>

                <div className="hidden items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm sm:flex">

                  <span
                    className={[
                      "h-1.5 w-1.5 rounded-full",
                      analysisLoading
                        ? "animate-pulse bg-[#8062ff]"
                        : "bg-[#35c98b]",
                    ].join(" ")}
                  />

                  <span className="text-[8px] font-bold uppercase tracking-wider text-[#3b9d75]">
                    {analysisLoading
                      ? "Processing"
                      : "Ready"}
                  </span>

                </div>
              </div>

              <div className="relative p-5 sm:p-6">

                <AgentStep
                  number="01"
                  icon={ScanLine}
                  title="Market Agent"
                  description={
                    overview?.agents?.market?.description ||
                    "Scanning current market conditions."
                  }
                  active={
                    analysisLoading
                  }
                  status={
                    overview?.agents?.market?.status
                  }
                />

                <div className="ml-6 h-7 border-l border-dashed border-[#cfc5e8]" />

                <AgentStep
                  number="02"
                  icon={BrainCircuit}
                  title="Strategy Agent"
                  description={
                    overview?.agents?.strategy?.description ||
                    "Evaluating available trading strategies."
                  }
                  active={
                    analysisLoading
                  }
                  status={
                    overview?.agents?.strategy?.status
                  }
                />

                <div className="ml-6 h-7 border-l border-dashed border-[#cfc5e8]" />

                <AgentStep
                  number="03"
                  icon={ShieldCheck}
                  title="Risk Agent"
                  description={
                    overview?.agents?.risk?.description ||
                    "Validating portfolio exposure and risk."
                  }
                  ready={
                    !analysisLoading
                  }
                  status={
                    overview?.agents?.risk?.status
                  }
                />

                <div className="mt-6 grid gap-3 sm:grid-cols-3">

                  <MiniMetric
                    icon={Gauge}
                    label="Signal"
                    value={
                      analysisLoading
                        ? "Analyzing"
                        : analysisSignal ||
                          "Ready"
                    }
                  />

                  <MiniMetric
                    icon={Cpu}
                    label="Inference"
                    value={
                      analysisLoading
                        ? "Running"
                        : analysis
                          ? "Complete"
                          : "Ready"
                    }
                  />

                  <MiniMetric
                    icon={ShieldCheck}
                    label="Risk"
                    value={
                      analysis?.risk ||
                      analysis?.risk_level ||
                      overview?.risk_status ||
                      "Monitoring"
                    }
                    positive
                  />

                </div>

                {/* SYMBOL */}

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                  <div className="flex min-w-0 flex-1 items-center rounded-xl border border-[#e3dcef] bg-white px-3">

                    <span className="mr-2 text-[8px] font-bold uppercase tracking-wider text-[#9b92a8]">
                      Symbol
                    </span>

                    <input
                      value={
                        selectedSymbol
                      }
                      onChange={(event) =>
                        setSelectedSymbol(
                          event.target.value
                            .toUpperCase()
                        )
                      }
                      placeholder="Enter symbol"
                      className="min-w-0 flex-1 bg-transparent py-3 text-xs font-semibold text-[#302a3b] outline-none"
                    />

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      runAnalysis()
                    }
                    disabled={
                      analysisLoading ||
                      !selectedSymbol
                    }
                    className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#17151f] py-3.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_25px_rgba(23,21,31,0.14)] transition hover:-translate-y-0.5 hover:bg-[#262231] disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {analysisLoading ? (
                      <RefreshCw
                        size={13}
                        className="animate-spin"
                      />
                    ) : (
                      <Zap
                        size={13}
                        className="text-[#b9a6ff]"
                      />
                    )}

                    {analysisLoading
                      ? "Analyzing..."
                      : "Run market analysis"}

                    {!analysisLoading && (
                      <ChevronRight
                        size={13}
                        className="transition group-hover:translate-x-1"
                      />
                    )}

                  </button>

                </div>

                {analysisError && (
                  <div className="mt-4 rounded-xl border border-[#efd8d4] bg-[#fff7f5] p-3">

                    <div className="flex items-start gap-2">

                      <TriangleAlert
                        size={13}
                        className="mt-0.5 shrink-0 text-[#d35d4e]"
                      />

                      <p className="text-[9px] leading-5 text-[#a04d42]">
                        {analysisError}
                      </p>

                    </div>

                  </div>
                )}

                {analysis && (
                  <AnalysisResult
                    symbol={
                      selectedSymbol
                    }
                    signal={
                      analysisSignal
                    }
                    confidence={
                      analysisConfidence
                    }
                    summary={
                      analysisSummary
                    }
                    raw={analysis}
                  />
                )}

              </div>
            </div>

            {/* MARKET WATCH */}

            <div className="overflow-hidden rounded-[26px] border border-[#e7e2db] bg-white shadow-[0_20px_60px_rgba(45,35,70,0.05)]">

              <div className="flex items-center justify-between border-b border-[#eeeae5] px-5 py-5 sm:px-6">

                <div>

                  <div className="flex items-center gap-2">

                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#918a96]">
                      Market watch
                    </p>

                    <span className="flex items-center gap-1 rounded-full bg-[#f3f1f6] px-2 py-1 text-[7px] font-bold uppercase text-[#7f7788]">
                      Live
                    </span>

                  </div>

                  <h2 className="mt-1 text-sm font-semibold text-[#211e28]">
                    Your markets
                  </h2>

                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f3f8]">

                  <Activity
                    size={15}
                    className="text-[#7d7486]"
                  />

                </div>
              </div>

              <div>

                {marketWatch.length ? (
                  marketWatch.map(
                    (item) => (
                      <BrightMarketRow
                        key={
                          item.symbol
                        }
                        symbol={
                          item.symbol
                        }
                        name={
                          item.name
                        }
                        price={
                          item.price
                        }
                        change={
                          item.change
                        }
                        selected={
                          selectedSymbol ===
                          item.symbol
                        }
                        onClick={() =>
                          setSelectedSymbol(
                            item.symbol
                          )
                        }
                      />
                    )
                  )
                ) : (
                  <div className="px-6 py-12 text-center">

                    <BarChart3
                      size={22}
                      className="mx-auto text-[#aaa3ad]"
                    />

                    <p className="mt-3 text-xs font-semibold text-[#423c48]">
                      No markets available
                    </p>

                    <p className="mt-1 text-[9px] text-[#99919d]">
                      Your backend watchlist will
                      appear here.
                    </p>

                  </div>
                )}

              </div>

              {selectedSymbol && (
                <button
                  type="button"
                  onClick={() =>
                    runAnalysis(
                      selectedSymbol
                    )
                  }
                  disabled={
                    analysisLoading
                  }
                  className="group flex w-full items-center justify-center gap-1 border-t border-[#eeeae5] py-4 text-[9px] font-bold uppercase tracking-[0.14em] text-[#85808a] transition hover:text-[#7859f4] disabled:opacity-50"
                >
                  Analyze{" "}
                  {selectedSymbol}

                  <ArrowRight
                    size={11}
                    className="transition group-hover:translate-x-1"
                  />
                </button>
              )}

            </div>

          </section>

          {/* ==================================================
              INTELLIGENCE
          ================================================== */}

          <section className="mb-6 grid gap-4 md:grid-cols-3">

            <InsightCard
              icon={Target}
              eyebrow="Opportunity"
              title="Latest signal"
              value={
                analysisSignal ||
                "Waiting"
              }
              description={
                analysis
                  ? `AI analysis for ${selectedSymbol}`
                  : "Run an AI market analysis to generate a signal"
              }
              type="violet"
            />

            <InsightCard
              icon={Eye}
              eyebrow="Portfolio"
              title="Market value"
              value={formatMoney(
                marketValue
              )}
              description={
                positions.length
                  ? `${positions.length} open position${
                      positions.length ===
                      1
                        ? ""
                        : "s"
                    }`
                  : "No open positions"
              }
              type="mint"
            />

            <InsightCard
              icon={TriangleAlert}
              eyebrow="Risk monitor"
              title="Exposure"
              value={
                positions.length
                  ? `${positions.length} position${
                      positions.length ===
                      1
                        ? ""
                        : "s"
                    }`
                  : "Clear"
              }
              description={
                overview?.risk_status ||
                overview?.riskStatus ||
                (positions.length
                  ? "Portfolio exposure currently active"
                  : "No current portfolio exposure")
              }
              type="peach"
            />

          </section>

          {/* ==================================================
              POSITIONS
          ================================================== */}

          <section className="mb-6 overflow-hidden rounded-[26px] border border-[#e7e2db] bg-white shadow-[0_20px_60px_rgba(45,35,70,0.05)]">

            <div className="flex flex-col justify-between gap-4 border-b border-[#eeeae5] px-5 py-5 sm:flex-row sm:items-center sm:px-6">

              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f1edff]">

                  <Layers3
                    size={16}
                    className="text-[#7859f4]"
                  />

                </div>

                <div>

                  <h2 className="text-sm font-semibold text-[#211e28]">
                    Open positions
                  </h2>

                  <p className="mt-1 text-[9px] uppercase tracking-wider text-[#97909b]">
                    Live trading account positions
                  </p>

                </div>

              </div>

              <div className="flex w-fit items-center gap-2 rounded-xl border border-[#e8e4de] bg-[#faf9f7] px-3 py-2">

                <Clock3
                  size={12}
                  className="text-[#8d8791]"
                />

                <span className="text-[8px] font-bold uppercase tracking-wider text-[#817b85]">

                  {loading
                    ? "Syncing"
                    : lastUpdated
                      ? `Synced ${formatRelativeTime(
                          lastUpdated
                        )}`
                      : "Portfolio synced"}

                </span>

              </div>
            </div>

            {loading ? (
              <LoadingPositions />
            ) : positions.length === 0 ? (
              <EmptyPositions />
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full min-w-[820px]">

                  <thead>

                    <tr className="border-b border-[#eeeae5] text-left">

                      <TableHeader>
                        Asset
                      </TableHeader>

                      <TableHeader>
                        Quantity
                      </TableHeader>

                      <TableHeader>
                        Cost basis
                      </TableHeader>

                      <TableHeader>
                        Market value
                      </TableHeader>

                      <TableHeader>
                        Unrealized P/L
                      </TableHeader>

                      <TableHeader>
                        Status
                      </TableHeader>

                    </tr>

                  </thead>

                  <tbody>

                    {positions.map(
                      (
                        position,
                        index
                      ) => {

                        const pl =
                          numberValue(
                            position?.unrealized_pl ??
                              position?.unrealizedPL
                          );

                        const profitable =
                          pl >= 0;

                        const key =
                          position?.symbol ||
                          position?.id ||
                          position?.asset_id ||
                          index;

                        return (
                          <tr
                            key={key}
                            className="group border-b border-[#f0ece8] transition hover:bg-[#faf8ff]"
                          >

                            <td className="px-6 py-5">

                              <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3efff] text-[9px] font-bold text-[#7859f4]">

                                  {position?.symbol?.slice(
                                    0,
                                    2
                                  ) || "—"}

                                </div>

                                <div>

                                  <p className="text-xs font-semibold text-[#2a2630]">

                                    {position?.symbol ||
                                      "Unknown"}

                                  </p>

                                  <p className="mt-1 text-[8px] uppercase tracking-wider text-[#aaa3ad]">

                                    {position?.asset_class ||
                                      position?.assetClass ||
                                      "Asset"}

                                  </p>

                                </div>

                              </div>

                            </td>

                            <td className="px-6 py-5 font-mono text-xs text-[#6e6874]">
                              {formatNumber(
                                position?.qty
                              )}
                            </td>

                            <td className="px-6 py-5 font-mono text-xs text-[#6e6874]">
                              {formatMoney(
                                position?.cost_basis ??
                                  position?.costBasis
                              )}
                            </td>

                            <td className="px-6 py-5 font-mono text-xs font-semibold text-[#37313f]">
                              {formatMoney(
                                position?.market_value ??
                                  position?.marketValue
                              )}
                            </td>

                            <td className="px-6 py-5">

                              <div
                                className={[
                                  "flex items-center gap-1.5 text-xs font-semibold",
                                  profitable
                                    ? "text-[#26966b]"
                                    : "text-[#d35d4e]",
                                ].join(" ")}
                              >

                                {profitable ? (
                                  <ArrowUpRight
                                    size={13}
                                  />
                                ) : (
                                  <ArrowDownRight
                                    size={13}
                                  />
                                )}

                                {formatMoney(
                                  Math.abs(
                                    pl
                                  )
                                )}

                              </div>

                            </td>

                            <td className="px-6 py-5">

                              <span className="inline-flex items-center gap-2 rounded-full bg-[#edfff7] px-3 py-1.5 text-[8px] font-bold tracking-[0.12em] text-[#26966b]">

                                <span className="h-1.5 w-1.5 rounded-full bg-[#35c98b]" />

                                {String(
                                  position?.status ||
                                    "OPEN"
                                ).toUpperCase()}

                              </span>

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </section>

          {/* ==================================================
              SYSTEM PERFORMANCE
          ================================================== */}

          <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <BottomStat
              icon={BrainCircuit}
              label="AI decisions"
              value={
                aiDecisions === null
                  ? "—"
                  : formatNumber(
                      aiDecisions
                    )
              }
              description={
                aiDecisions === null
                  ? "Backend metric"
                  : "Recorded"
              }
              accent="violet"
            />

            <BottomStat
              icon={Zap}
              label="Trades executed"
              value={
                tradesExecuted === null
                  ? "—"
                  : formatNumber(
                      tradesExecuted
                    )
              }
              description={
                tradesExecuted === null
                  ? "Backend metric"
                  : "Recorded"
              }
              accent="mint"
            />

            <BottomStat
              icon={ShieldCheck}
              label="Risk checks"
              value={
                riskChecks === null
                  ? "—"
                  : formatNumber(
                      riskChecks
                    )
              }
              description={
                riskChecks === null
                  ? "Backend metric"
                  : "Recorded"
              }
              accent="peach"
            />

            <BottomStat
              icon={BarChart3}
              label="Unrealized P/L"
              value={formatMoney(
                unrealizedPL
              )}
              description="Current"
              accent="purple"
            />

          </section>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <div className="flex flex-col gap-3 border-t border-[#e7e2db] pt-5 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#aaa3ad] sm:flex-row sm:items-center sm:justify-between">

            <div className="flex flex-wrap items-center gap-4">

              <span className="flex items-center gap-2 text-[#756d80]">

                <span
                  className={[
                    "h-1.5 w-1.5 rounded-full",
                    systemOnline
                      ? "bg-[#35c98b]"
                      : "bg-[#d35d4e]",
                  ].join(" ")}
                />

                Trade Pilot AI

              </span>

              <span>
                Intelligence infrastructure
              </span>

            </div>

            <span>
              {paperTrading
                ? "Paper trading environment"
                : "Live trading environment"}
            </span>

          </div>

        </main>
      </div>
    </AppLayout>
  );
}

/* ============================================================
   LIVE EQUITY CHART
============================================================ */

function LiveEquityChart({
  data,
  range,
}) {
  const points = useMemo(() => {
    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .map((item) => {
        if (
          typeof item ===
          "number"
        ) {
          return {
            value: item,
          };
        }

        return {
          value:
            Number(
              item?.equity ??
                item?.value ??
                item?.portfolio_value ??
                0
            ),
          timestamp:
            item?.timestamp ??
            item?.time ??
            item?.date ??
            null,
        };
      })
      .filter((item) =>
        Number.isFinite(
          item.value
        )
      );
  }, [data]);

  if (points.length < 2) {
    return (
      <div className="flex w-full items-center justify-center text-center">
        <div>
          <LineChart
            size={22}
            className="mx-auto text-[#8062ff]"
          />

          <p className="mt-3 text-xs font-semibold text-[#423c48]">
            Not enough historical data
          </p>

          <p className="mt-1 text-[9px] text-[#99919d]">
            More portfolio snapshots are needed
            to render this period.
          </p>
        </div>
      </div>
    );
  }

  const width = 900;
  const height = 300;

  const values =
    points.map(
      (point) => point.value
    );

  const min =
    Math.min(...values);

  const max =
    Math.max(...values);

  const spread =
    max - min || 1;

  const coordinates =
    points.map(
      (point, index) => {
        const x =
          (index /
            Math.max(
              points.length - 1,
              1
            )) *
          width;

        const y =
          height -
          ((point.value - min) /
            spread) *
            (height - 30) -
          15;

        return {
          x,
          y,
        };
      }
    );

  const path =
    coordinates
      .map(
        (point, index) =>
          `${index === 0 ? "M" : "L"}${point.x} ${point.y}`
      )
      .join(" ");

  const areaPath = `${path} L ${width} ${height} L 0 ${height} Z`;

  const last =
    coordinates[
      coordinates.length - 1
    ];

  return (
    <div className="relative h-full min-h-[260px] w-full">

      <div className="absolute inset-x-0 top-4 bottom-8">

        {[0, 1, 2, 3].map(
          (line) => (
            <div
              key={line}
              className="absolute left-0 right-0 border-t border-dashed border-[#ebe7e2]"
              style={{
                top: `${line * 33.33}%`,
              }}
            />
          )
        )}

      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="relative h-full min-h-[240px] w-full"
        preserveAspectRatio="none"
      >

        <defs>

          <linearGradient
            id="liveEquityGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >

            <stop
              offset="0%"
              stopColor="#8a6cff"
              stopOpacity="0.22"
            />

            <stop
              offset="100%"
              stopColor="#ffffff"
              stopOpacity="0"
            />

          </linearGradient>

        </defs>

        <path
          d={areaPath}
          fill="url(#liveEquityGradient)"
        />

        <path
          d={path}
          fill="none"
          stroke="#8062ff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle
          cx={last.x}
          cy={last.y}
          r="6"
          fill="#8062ff"
        />

        <circle
          cx={last.x}
          cy={last.y}
          r="12"
          fill="#8062ff"
          opacity="0.12"
        />

      </svg>

      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[8px] font-semibold uppercase tracking-wider text-[#aaa3ad]">

        <span>
          {range}
        </span>

        <span>
          Live
        </span>

      </div>

    </div>
  );
}


/* ============================================================
   MARKET CHART — LIVE OHLC CANDLESTICK CHART
============================================================ */

function MarketChart({
  data,
  loading,
  error,
  symbol,
  timeframe,
  onTimeframeChange,
}) {
  /* ==========================================================
     NORMALIZE BACKEND / ALPACA BARS
  ========================================================== */

  const points = useMemo(() => {
    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .map((item) => {
        const timestamp =
          item?.timestamp ??
          item?.time ??
          item?.t ??
          item?.date ??
          null;

        const open = Number(
          item?.open ??
            item?.o ??
            0
        );

        const high = Number(
          item?.high ??
            item?.h ??
            0
        );

        const low = Number(
          item?.low ??
            item?.l ??
            0
        );

        const close = Number(
          item?.close ??
            item?.c ??
            item?.price ??
            0
        );

        const volume = Number(
          item?.volume ??
            item?.v ??
            0
        );

        return {
          timestamp,
          open,
          high,
          low,
          close,
          volume,
        };
      })
      .filter((item) => {
        return (
          item.timestamp &&
          Number.isFinite(item.open) &&
          Number.isFinite(item.high) &&
          Number.isFinite(item.low) &&
          Number.isFinite(item.close) &&
          item.high >= item.low &&
          item.high >= Math.max(
            item.open,
            item.close
          ) &&
          item.low <= Math.min(
            item.open,
            item.close
          )
        );
      })
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() -
          new Date(b.timestamp).getTime()
      );
  }, [data]);

  /* ==========================================================
     CHART CALCULATIONS
  ========================================================== */

  const chartData = useMemo(() => {
    if (!points.length) {
      return null;
    }

    const width = 1200;
    const height = 430;

    const paddingTop = 20;
    const paddingBottom = 35;
    const paddingLeft = 10;
    const paddingRight = 75;

    const highs = points.map(
      (point) => point.high
    );

    const lows = points.map(
      (point) => point.low
    );

    const min = Math.min(...lows);
    const max = Math.max(...highs);

    const rawSpread =
      max - min || Math.max(max * 0.01, 1);

    const chartMin =
      min - rawSpread * 0.08;

    const chartMax =
      max + rawSpread * 0.08;

    const spread =
      chartMax - chartMin || 1;

    const chartHeight =
      height -
      paddingTop -
      paddingBottom;

    const chartWidth =
      width -
      paddingLeft -
      paddingRight;

    const step =
      chartWidth /
      Math.max(points.length, 1);

    const candleWidth = Math.min(
      Math.max(step * 0.62, 4),
      18
    );

    const priceToY = (price) =>
      paddingTop +
      ((chartMax - price) /
        spread) *
        chartHeight;

    const coordinates = points.map(
      (point, index) => {
        const x =
          paddingLeft +
          step * index +
          step / 2;

        return {
          ...point,
          x,
          openY: priceToY(point.open),
          highY: priceToY(point.high),
          lowY: priceToY(point.low),
          closeY: priceToY(point.close),
        };
      }
    );

    const last =
      coordinates[
        coordinates.length - 1
      ];

    return {
      coordinates,
      min: chartMin,
      max: chartMax,
      last,
      width,
      height,
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      candleWidth,
    };
  }, [points]);

  /* ==========================================================
     LATEST PRICE
  ========================================================== */

  const latest =
    points[
      points.length - 1
    ];

  const previous =
    points.length > 1
      ? points[
          points.length - 2
        ]
      : null;

  const price =
    latest?.close ?? null;

  const change =
    latest && previous
      ? latest.close -
        previous.close
      : 0;

  const changePercent =
    latest &&
    previous &&
    previous.close
      ? (change /
          previous.close) *
        100
      : 0;

  const positive =
    change >= 0;

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="relative h-full w-full">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div className="min-w-0">

          <div className="flex flex-wrap items-center gap-3">

            <h3 className="font-mono text-lg font-semibold tracking-[-0.04em] text-[#211e28]">
              {symbol || "Market"}
            </h3>

            {price !== null && (
              <span className="font-mono text-sm font-semibold text-[#5f5866]">
                $
                {price.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </span>
            )}

            {points.length > 0 && (
              <span
                className={[
                  "rounded-full px-2 py-1 text-[7px] font-bold uppercase tracking-wider",
                  positive
                    ? "bg-[#edfff7] text-[#26966b]"
                    : "bg-[#fff0ed] text-[#d35d4e]",
                ].join(" ")}
              >
                {positive
                  ? "Bullish"
                  : "Bearish"}
              </span>
            )}

            {loading && (
              <span className="flex items-center gap-1.5 rounded-full bg-[#f3efff] px-2 py-1 text-[7px] font-bold uppercase tracking-wider text-[#7859f4]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#8062ff]" />
                Updating
              </span>
            )}

          </div>

          {latest && (
            <div className="mt-1 flex items-center gap-2">

              <span
                className={[
                  "text-[9px] font-bold",
                  positive
                    ? "text-[#26966b]"
                    : "text-[#d35d4e]",
                ].join(" ")}
              >
                {change >= 0 ? "+" : ""}
                {change.toFixed(2)}
              </span>

              <span
                className={[
                  "text-[9px] font-bold",
                  changePercent >= 0
                    ? "text-[#26966b]"
                    : "text-[#d35d4e]",
                ].join(" ")}
              >
                (
                {changePercent >= 0
                  ? "+"
                  : ""}
                {changePercent.toFixed(2)}
                %)
              </span>

              <span className="text-[8px] uppercase tracking-wider text-[#aaa3ad]">
                {timeframe}
              </span>

              <span className="text-[8px] text-[#c0bac2]">
                •
              </span>

              <span className="text-[8px] uppercase tracking-wider text-[#aaa3ad]">
                {points.length} bars
              </span>

            </div>
          )}

        </div>

        {/* ====================================================
            TIMEFRAME
        ==================================================== */}

        <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-[#faf9f7] p-1">

          {[
            "1Min",
            "5Min",
            "15Min",
            "1Hour",
            "1Day",
          ].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                onTimeframeChange(item)
              }
              className={[
                "shrink-0 rounded-lg px-2.5 py-1.5 text-[7px] font-bold transition sm:px-3",
                timeframe === item
                  ? "bg-[#17151f] text-white shadow-sm"
                  : "text-[#99919d] hover:bg-[#f0ede9] hover:text-[#332e39]",
              ].join(" ")}
            >
              {item}
            </button>
          ))}

        </div>

      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="flex min-h-[300px] items-center justify-center">

          <div className="px-6 text-center">

            <TriangleAlert
              size={22}
              className="mx-auto text-[#d35d4e]"
            />

            <p className="mt-3 text-xs font-semibold text-[#423c48]">
              Market data unavailable
            </p>

            <p className="mx-auto mt-1 max-w-sm text-[9px] leading-5 text-[#99919d]">
              {error}
            </p>

          </div>

        </div>
      )}

      {/* ======================================================
          INITIAL LOADING
      ====================================================== */}

      {!error &&
        loading &&
        !points.length && (
          <div className="flex min-h-[300px] items-center justify-center">

            <div className="text-center">

              <RefreshCw
                size={20}
                className="mx-auto animate-spin text-[#8062ff]"
              />

              <p className="mt-3 text-[9px] font-bold uppercase tracking-wider text-[#938b99]">
                Loading live market data
              </p>

              <p className="mt-1 text-[8px] text-[#aaa3ad]">
                {symbol || "Market"} • {timeframe}
              </p>

            </div>

          </div>
        )}

      {/* ======================================================
          EMPTY
      ====================================================== */}

      {!error &&
        !loading &&
        !chartData && (
          <div className="flex min-h-[300px] items-center justify-center">

            <div className="text-center">

              <BarChart3
                size={22}
                className="mx-auto text-[#aaa3ad]"
              />

              <p className="mt-3 text-xs font-semibold text-[#423c48]">
                No market data
              </p>

              <p className="mt-1 text-[9px] text-[#99919d]">
                No bars were returned for{" "}
                {symbol}.
              </p>

            </div>

          </div>
        )}

      {/* ======================================================
          LIVE CANDLESTICK CHART
      ====================================================== */}

      {!error &&
        chartData && (
          <div className="relative min-h-[300px] w-full">

            {/* GRID */}

            <div className="pointer-events-none absolute inset-0">

              {[0, 1, 2, 3, 4].map(
                (line) => (
                  <div
                    key={line}
                    className="absolute left-0 right-[60px] border-t border-dashed border-[#ebe7e2]"
                    style={{
                      top: `${line * 25}%`,
                    }}
                  />
                )
              )}

            </div>

            {/* PRICE AXIS */}

            <div className="pointer-events-none absolute bottom-[35px] right-0 top-0 flex w-[58px] flex-col justify-between py-1">

              {[0, 1, 2, 3, 4].map(
                (level) => {
                  const value =
                    chartData.max -
                    ((chartData.max -
                      chartData.min) *
                      level) /
                      4;

                  return (
                    <span
                      key={level}
                      className="text-right font-mono text-[7px] text-[#aaa3ad]"
                    >
                      $
                      {value.toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </span>
                  );
                }
              )}

            </div>

            {/* SVG */}

            <svg
              viewBox={`0 0 ${chartData.width} ${chartData.height}`}
              className="relative h-[300px] w-full"
              preserveAspectRatio="none"
            >

              {/* CANDLES */}

              {chartData.coordinates.map(
                (candle, index) => {
                  const bullish =
                    candle.close >=
                    candle.open;

                  const bodyTop =
                    Math.min(
                      candle.openY,
                      candle.closeY
                    );

                  const bodyHeight =
                    Math.max(
                      Math.abs(
                        candle.closeY -
                          candle.openY
                      ),
                      2
                    );

                  const candleColor =
                    bullish
                      ? "#26966b"
                      : "#d35d4e";

                  const bodyColor =
                    bullish
                      ? "#35b984"
                      : "#d35d4e";

                  return (
                    <g
                      key={`${candle.timestamp}-${index}`}
                    >

                      {/* WICK */}

                      <line
                        x1={candle.x}
                        y1={candle.highY}
                        x2={candle.x}
                        y2={candle.lowY}
                        stroke={candleColor}
                        strokeWidth="1.5"
                        vectorEffect="non-scaling-stroke"
                      />

                      {/* BODY */}

                      <rect
                        x={
                          candle.x -
                          chartData.candleWidth /
                            2
                        }
                        y={bodyTop}
                        width={
                          chartData.candleWidth
                        }
                        height={bodyHeight}
                        rx="1"
                        fill={bodyColor}
                        opacity="0.95"
                      />

                      {/* OPEN EDGE */}

                      <line
                        x1={
                          candle.x -
                          chartData.candleWidth /
                            2
                        }
                        y1={candle.openY}
                        x2={
                          candle.x +
                          chartData.candleWidth /
                            2
                        }
                        y2={candle.openY}
                        stroke={candleColor}
                        strokeWidth="1"
                        opacity="0.75"
                        vectorEffect="non-scaling-stroke"
                      />

                    </g>
                  );
                }
              )}

              {/* CURRENT PRICE LINE */}

              {chartData.last && (
                <line
                  x1="10"
                  y1={
                    chartData.last.closeY
                  }
                  x2={
                    chartData.width -
                    chartData.paddingRight
                  }
                  y2={
                    chartData.last.closeY
                  }
                  stroke="#8062ff"
                  strokeWidth="1"
                  strokeDasharray="5 5"
                  opacity="0.5"
                  vectorEffect="non-scaling-stroke"
                />
              )}

              {/* CURRENT PRICE DOT */}

              {chartData.last && (
                <circle
                  cx={chartData.last.x}
                  cy={
                    chartData.last.closeY
                  }
                  r="4"
                  fill="#8062ff"
                />
              )}

            </svg>

            {/* CURRENT PRICE LABEL */}

            {chartData.last && (
              <div
                className="pointer-events-none absolute right-0 rounded-md bg-[#17151f] px-2 py-1 font-mono text-[7px] font-bold text-white shadow-sm"
                style={{
                  top: `${Math.max(
                    3,
                    Math.min(
                      94,
                      (chartData.last.closeY /
                        chartData.height) *
                        100
                    )
                  )}%`,
                  transform:
                    "translateY(-50%)",
                }}
              >
                $
                {chartData.last.close.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </div>
            )}

            {/* TIME AXIS */}

            <div className="mt-2 flex justify-between pr-[60px] text-[7px] font-semibold uppercase tracking-wider text-[#aaa3ad]">

              <span>
                {formatMarketTime(
                  points[0]?.timestamp
                )}
              </span>

              {points.length > 2 && (
                <span>
                  {formatMarketTime(
                    points[
                      Math.floor(
                        points.length / 2
                      )
                    ]?.timestamp
                  )}
                </span>
              )}

              <span>
                {formatMarketTime(
                  latest?.timestamp
                )}
              </span>

            </div>

          </div>
        )}

    </div>
  );
}


/* ============================================================
   MARKET TIME FORMATTER
============================================================ */

function formatMarketTime(timestamp) {
  if (!timestamp) {
    return "—";
  }

  const date =
    new Date(timestamp);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return date.toLocaleTimeString(
    undefined,
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}



/* ============================================================
   ANALYSIS RESULT
============================================================ */

function AnalysisResult({
  symbol,
  signal,
  confidence,
  summary,
  raw,
}) {
  const normalizedSignal =
    String(
      signal ||
        "ANALYSIS READY"
    ).toUpperCase();

  const positive =
    normalizedSignal.includes(
      "BUY"
    ) ||
    normalizedSignal.includes(
      "LONG"
    );

  const negative =
    normalizedSignal.includes(
      "SELL"
    ) ||
    normalizedSignal.includes(
      "SHORT"
    );

  const signalClass =
    positive
      ? "bg-[#edfff7] text-[#26966b]"
      : negative
        ? "bg-[#fff0ed] text-[#d35d4e]"
        : "bg-[#f1edff] text-[#7859f4]";

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-[#e4dff0] bg-white shadow-sm">

      <div className="flex items-center justify-between border-b border-[#eee9f4] px-4 py-3">

        <div className="flex items-center gap-2">

          <Sparkles
            size={13}
            className="text-[#7859f4]"
          />

          <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#81788f]">
            AI result
          </span>

        </div>

        <span className="font-mono text-[9px] font-bold text-[#51495c]">
          {symbol}
        </span>

      </div>

      <div className="p-4">

        <div className="flex flex-wrap items-center gap-2">

          <span
            className={[
              "rounded-lg px-3 py-2 text-[9px] font-bold uppercase tracking-wider",
              signalClass,
            ].join(" ")}
          >
            {normalizedSignal}
          </span>

          {confidence !==
            null &&
            confidence !==
              undefined && (
              <span className="rounded-lg bg-[#f7f5f9] px-3 py-2 text-[9px] font-semibold text-[#716979]">
                Confidence:{" "}
                {String(
                  confidence
                )}
              </span>
            )}

        </div>

        {summary && (
          <p className="mt-3 text-[10px] leading-6 text-[#766e7c]">
            {String(
              summary
            )}
          </p>
        )}

        <details className="mt-3">

          <summary className="cursor-pointer text-[8px] font-bold uppercase tracking-wider text-[#938b99]">
            View raw analysis
          </summary>

          <pre className="mt-3 max-h-52 overflow-auto rounded-xl bg-[#faf9f7] p-3 text-[8px] leading-5 text-[#665f6c]">
            {JSON.stringify(
              raw,
              null,
              2
            )}
          </pre>

        </details>

      </div>
    </div>
  );
}

/* ============================================================
   EMPTY POSITIONS
============================================================ */

function EmptyPositions() {
  return (
    <div className="relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden px-6 text-center">

      <div className="pointer-events-none absolute h-[180px] w-[180px] rounded-full bg-[#e8e0ff]/40 blur-[70px]" />

      <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#f3efff]">

        <Orbit
          size={25}
          className="text-[#8569f7]"
        />

      </div>

      <p className="relative text-sm font-semibold text-[#37313f]">
        Your portfolio is clear
      </p>

      <p className="relative mt-2 max-w-sm text-[10px] leading-6 text-[#958e9a]">
        When your trading account has an
        open position, its live exposure,
        market value and P/L will appear here.
      </p>

    </div>
  );
}

/* ============================================================
   LOADING
============================================================ */

function LoadingPositions() {
  return (
    <div className="flex min-h-[280px] items-center justify-center">

      <div className="flex items-center gap-3 text-[#8c8591]">

        <RefreshCw
          size={16}
          className="animate-spin"
        />

        <span className="text-[10px] font-bold uppercase tracking-wider">
          Synchronizing trading account
        </span>

      </div>

    </div>
  );
}

/* ============================================================
   TABLE HEADER
============================================================ */

function TableHeader({
  children,
}) {
  return (
    <th className="px-6 py-4 text-[8px] font-bold uppercase tracking-[0.15em] text-[#9b949f]">
      {children}
    </th>
  );
}

/* ============================================================
   OVERVIEW CARD
============================================================ */

function OverviewCard({
  icon: Icon,
  label,
  value,
  trend,
  accent = "violet",
}) {
  const styles = {
    violet: {
      icon: "bg-[#f1edff] text-[#7859f4]",
      dot: "bg-[#8569f7]",
    },
    mint: {
      icon: "bg-[#edfff7] text-[#26966b]",
      dot: "bg-[#35c98b]",
    },
    peach: {
      icon: "bg-[#fff1eb] text-[#d76a56]",
      dot: "bg-[#ef876e]",
    },
    purple: {
      icon: "bg-[#f4edff] text-[#9a63df]",
      dot: "bg-[#a56ce8]",
    },
  };

  const style =
    styles[accent] ||
    styles.violet;

  return (
    <div className="group rounded-[22px] border border-[#e7e2db] bg-white p-5 shadow-[0_12px_40px_rgba(45,35,70,0.045)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(45,35,70,0.08)]">

      <div className="flex items-start justify-between">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${style.icon}`}
        >
          <Icon size={17} />
        </div>

        <span
          className={`h-2 w-2 rounded-full ${style.dot} opacity-70`}
        />

      </div>

      <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#97909b]">
        {label}
      </p>

      <p className="mt-1 truncate text-xl font-semibold tracking-[-0.04em] text-[#24202b]">
        {value}
      </p>

      <div className="mt-2 flex items-center gap-1.5 text-[9px] font-medium text-[#928b96]">

        <CheckCircle2
          size={11}
          className="text-[#35b984]"
        />

        {trend}

      </div>

    </div>
  );
}

/* ============================================================
   SMALL STAT
============================================================ */

function SmallStat({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-[#eeeae5] bg-[#faf9f7] p-3">

      <p className="text-[8px] font-bold uppercase tracking-wider text-[#aaa3ad]">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-semibold text-[#423c48]">
        {value}
      </p>

    </div>
  );
}

/* ============================================================
   TIME BUTTON
============================================================ */

function TimeButton({
  children,
  active = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-lg px-3 py-1.5 text-[8px] font-bold transition",
        active
          ? "bg-[#17151f] text-white shadow-sm"
          : "text-[#99919d] hover:bg-[#f5f2ee] hover:text-[#332e39]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/* ============================================================
   AGENT STEP
============================================================ */

function AgentStep({
  number,
  icon: Icon,
  title,
  description,
  ready = false,
  active = false,
  status,
}) {
  const normalizedStatus =
    String(
      status || ""
    ).toLowerCase();

  const isReady =
    ready ||
    normalizedStatus ===
      "ready" ||
    normalizedStatus ===
      "complete" ||
    normalizedStatus ===
      "completed";

  const isRunning =
    active ||
    normalizedStatus ===
      "running" ||
    normalizedStatus ===
      "active" ||
    normalizedStatus ===
      "processing";

  return (
    <div
      className={[
        "group rounded-2xl border p-4 transition",
        isReady
          ? "border-[#d8eee4] bg-white"
          : "border-[#e6e0f0] bg-white/70",
      ].join(" ")}
    >

      <div className="flex items-center gap-4">

        <div
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-105",
            isReady
              ? "bg-[#edfff7] text-[#26966b]"
              : "bg-[#f1edff] text-[#7859f4]",
          ].join(" ")}
        >
          <Icon size={15} />
        </div>

        <div className="min-w-0">

          <div className="flex items-center gap-2">

            <span className="rounded-md bg-[#f3efff] px-1.5 py-0.5 font-mono text-[7px] font-bold text-[#7859f4]">
              {number}
            </span>

            <p className="truncate text-xs font-semibold text-[#312b38]">
              {title}
            </p>

          </div>

          <p className="mt-1 text-[9px] leading-5 text-[#958e9a]">
            {description}
          </p>

        </div>

        <div className="ml-auto shrink-0">

          {isReady ? (
            <span className="flex items-center gap-1.5 rounded-full bg-[#edfff7] px-2 py-1 text-[7px] font-bold uppercase tracking-wider text-[#26966b]">

              <span className="h-1.5 w-1.5 rounded-full bg-[#35c98b]" />

              Ready

            </span>
          ) : isRunning ? (
            <span className="relative flex h-2 w-2">

              <span className="absolute inset-0 animate-ping rounded-full bg-[#8a6cff] opacity-30" />

              <span className="relative h-2 w-2 rounded-full bg-[#8a6cff]" />

            </span>
          ) : (
            <span className="h-2 w-2 rounded-full bg-[#aaa3ad]" />
          )}

        </div>

      </div>

    </div>
  );
}

/* ============================================================
   MINI METRIC
============================================================ */

function MiniMetric({
  icon: Icon,
  label,
  value,
  positive = false,
}) {
  return (
    <div className="rounded-xl border border-[#e7e0f0] bg-white/70 p-4">

      <div className="flex items-center gap-2">

        <Icon
          size={12}
          className={
            positive
              ? "text-[#26966b]"
              : "text-[#8b7da7]"
          }
        />

        <span className="text-[8px] font-bold uppercase tracking-wider text-[#958d9e]">
          {label}
        </span>

      </div>

      <p
        className={[
          "mt-2 truncate text-xs font-semibold",
          positive
            ? "text-[#26966b]"
            : "text-[#4b4256]",
        ].join(" ")}
      >
        {value}
      </p>

    </div>
  );
}

/* ============================================================
   MARKET ROW
============================================================ */

function BrightMarketRow({
  symbol,
  name,
  price,
  change,
  selected = false,
  onClick,
}) {
  const numericChange =
    Number(change);

  const hasChange =
    Number.isFinite(
      numericChange
    );

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group flex w-full items-center justify-between border-b border-[#f0ece8] px-5 py-4 text-left transition sm:px-6",
        selected
          ? "bg-[#faf8ff]"
          : "hover:bg-[#faf8ff]",
      ].join(" ")}
    >

      <div className="flex min-w-0 items-center gap-3">

        <div
          className={[
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition",
            selected
              ? "bg-[#eee9ff]"
              : "bg-[#f5f3f8] group-hover:bg-[#eee9ff]",
          ].join(" ")}
        >
          <BarChart3
            size={12}
            className={
              selected
                ? "text-[#7859f4]"
                : "text-[#817987]"
            }
          />
        </div>

        <div className="min-w-0">

          <p className="text-[10px] font-bold text-[#39333f]">
            {symbol}
          </p>

          <p className="mt-0.5 truncate text-[8px] text-[#a29aa5]">
            {name}
          </p>

        </div>

      </div>

      <div className="flex items-center gap-3">

        {price !==
          null &&
          price !==
            undefined && (
            <span className="font-mono text-[9px] font-semibold text-[#4a4351]">
              $
              {Number(
                price
              ).toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 2,
                }
              )}
            </span>
          )}

        {hasChange && (
          <span
            className={[
              "text-[8px] font-bold",
              numericChange >=
                0
                ? "text-[#26966b]"
                : "text-[#d35d4e]",
            ].join(" ")}
          >
            {numericChange >=
            0
              ? "+"
              : ""}
            {numericChange.toFixed(
              2
            )}
            %
          </span>
        )}

        {selected && (
          <span className="rounded-full bg-[#f1edff] px-2 py-1 text-[7px] font-bold uppercase tracking-wider text-[#7859f4]">
            Selected
          </span>
        )}

      </div>

    </button>
  );
}

/* ============================================================
   INSIGHT CARD
============================================================ */

function InsightCard({
  icon: Icon,
  eyebrow,
  title,
  value,
  description,
  type = "violet",
}) {
  const styles = {
    violet: {
      bg: "bg-[#f5f1ff]",
      icon: "bg-white text-[#7859f4]",
      value: "text-[#6d50e8]",
    },
    mint: {
      bg: "bg-[#effcf6]",
      icon: "bg-white text-[#26966b]",
      value: "text-[#26966b]",
    },
    peach: {
      bg: "bg-[#fff3ee]",
      icon: "bg-white text-[#d76a56]",
      value: "text-[#d76a56]",
    },
  };

  const style =
    styles[type] ||
    styles.violet;

  return (
    <div
      className={[
        "rounded-[22px] border border-white/60 p-5",
        style.bg,
      ].join(" ")}
    >

      <div className="flex items-center justify-between">

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${style.icon}`}
        >
          <Icon size={15} />
        </div>

        <Sparkles
          size={13}
          className="text-[#a39aa9]"
        />

      </div>

      <p className="mt-5 text-[8px] font-bold uppercase tracking-[0.16em] text-[#958d99]">
        {eyebrow}
      </p>

      <h3 className="mt-1 text-sm font-semibold text-[#322d38]">
        {title}
      </h3>

      <p
        className={[
          "mt-3 truncate text-xl font-semibold tracking-[-0.04em]",
          style.value,
        ].join(" ")}
      >
        {value}
      </p>

      <p className="mt-1 text-[9px] leading-5 text-[#918a95]">
        {description}
      </p>

    </div>
  );
}

/* ============================================================
   BOTTOM STAT
============================================================ */

function BottomStat({
  icon: Icon,
  label,
  value,
  description,
  accent = "violet",
}) {
  const styles = {
    violet:
      "bg-[#f5f1ff] text-[#7859f4]",
    mint:
      "bg-[#edfff7] text-[#26966b]",
    peach:
      "bg-[#fff1eb] text-[#d76a56]",
    purple:
      "bg-[#f4edff] text-[#9a63df]",
  };

  return (
    <div className="group rounded-[20px] border border-[#e7e2db] bg-white p-5 shadow-[0_12px_35px_rgba(45,35,70,0.035)] transition hover:-translate-y-0.5">

      <div className="flex items-center gap-4">

        <div
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            styles[accent] ||
              styles.violet,
          ].join(" ")}
        >
          <Icon size={15} />
        </div>

        <div className="min-w-0">

          <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#97909b]">
            {label}
          </p>

          <div className="mt-1 flex items-baseline gap-2">

            <span className="truncate font-mono text-lg font-semibold tracking-[-0.03em] text-[#342e3b]">
              {value}
            </span>

            <span className="truncate text-[8px] uppercase tracking-wider text-[#aaa3ad]">
              {description}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

/* ============================================================
   RELATIVE TIME
============================================================ */

function formatRelativeTime(
  timestamp
) {
  if (!timestamp) {
    return "recently";
  }

  const date =
    new Date(timestamp);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "recently";
  }

  const seconds =
    Math.max(
      0,
      Math.floor(
        (Date.now() -
          date.getTime()) /
          1000
      )
    );

  if (seconds < 10) {
    return "just now";
  }

  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  const minutes =
    Math.floor(
      seconds / 60
    );

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours =
    Math.floor(
      minutes / 60
    );

  return `${hours}h ago`;
}

