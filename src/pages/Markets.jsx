import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  CandlestickChart,
  ChevronDown,
  ChevronRight,
  Clock3,
  Eye,
  Gauge,
  Layers3,
  Maximize2,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import AppLayout from "../components/AppLayout";

/* ============================================================
   API
============================================================ */

const API_URL = (
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000"
).replace(/\/$/, "");

/* ============================================================
   MARKET UNIVERSE
============================================================ */

const markets = [
  {
    symbol: "SPY",
    name: "SPDR S&P 500 ETF",
    sector: "Index",
    signal: "Bullish",
    strength: 82,
  },
  {
    symbol: "QQQ",
    name: "Invesco Nasdaq 100 ETF",
    sector: "Index",
    signal: "Strong Buy",
    strength: 91,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    sector: "Technology",
    signal: "Strong Buy",
    strength: 96,
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    signal: "Bullish",
    strength: 76,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    sector: "Technology",
    signal: "Bullish",
    strength: 71,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    sector: "Automotive",
    signal: "Neutral",
    strength: 48,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    sector: "Consumer",
    signal: "Bullish",
    strength: 84,
  },
  {
    symbol: "META",
    name: "Meta Platforms",
    sector: "Technology",
    signal: "Strong Buy",
    strength: 93,
  },
];

/* ============================================================
   INDEX DATA
   These can remain static until you connect a separate
   indices endpoint.
============================================================ */

const indices = [
  {
    symbol: "S&P 500",
    price: "6,823.11",
    change: "+0.84%",
    positive: true,
  },
  {
    symbol: "NASDAQ",
    price: "22,871.45",
    change: "+1.21%",
    positive: true,
  },
  {
    symbol: "DOW",
    price: "45,118.92",
    change: "+0.31%",
    positive: true,
  },
  {
    symbol: "VIX",
    price: "14.82",
    change: "-3.18%",
    positive: false,
  },
];

/* ============================================================
   SECTORS
============================================================ */

const sectors = [
  {
    name: "Technology",
    change: "+1.84%",
    strength: 92,
    positive: true,
  },
  {
    name: "Consumer",
    change: "+1.12%",
    strength: 78,
    positive: true,
  },
  {
    name: "Healthcare",
    change: "+0.63%",
    strength: 64,
    positive: true,
  },
  {
    name: "Financials",
    change: "+0.42%",
    strength: 57,
    positive: true,
  },
  {
    name: "Energy",
    change: "-0.38%",
    strength: 41,
    positive: false,
  },
];

/* ============================================================
   TIMEFRAME CONFIG
============================================================ */

const timeframeConfig = {
  "1D": {
    apiTimeframe: "1Min",
    limit: 200,
  },

  "1W": {
    apiTimeframe: "5Min",
    limit: 200,
  },

  "1M": {
    apiTimeframe: "15Min",
    limit: 200,
  },

  "3M": {
    apiTimeframe: "1Hour",
    limit: 200,
  },

  "1Y": {
    apiTimeframe: "1Day",
    limit: 250,
  },
};

const timeframes = ["1D", "1W", "1M", "3M", "1Y"];

/* ============================================================
   HELPERS
============================================================ */

function formatPrice(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }

  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }

  return value.toLocaleString("en-US");
}

function formatVolume(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }

  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return value.toString();
}

function formatTime(value, timeframe) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  if (timeframe === "1Y") {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/* ============================================================
   MAIN PAGE
============================================================ */

export default function Markets() {
  const [selectedMarket, setSelectedMarket] = useState(markets[3]);

  const [timeframe, setTimeframe] = useState("1D");

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [bars, setBars] = useState([]);

  const [loadingBars, setLoadingBars] = useState(false);

  const [barsError, setBarsError] = useState("");

  const [lastUpdated, setLastUpdated] = useState(null);

  /* ==========================================================
     FILTERED MARKET LIST
  ========================================================== */

  const filteredMarkets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return markets.filter((market) => {
      const matchesSearch =
        !query ||
        market.symbol.toLowerCase().includes(query) ||
        market.name.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" ||
        market.sector === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  /* ==========================================================
     FETCH REAL ALPACA MARKET DATA
  ========================================================== */

  useEffect(() => {
    let cancelled = false;

    async function fetchMarketBars() {
      if (!selectedMarket?.symbol) {
        return;
      }

      setLoadingBars(true);
      setBarsError("");
      setBars([]);

      const config =
        timeframeConfig[timeframe] ||
        timeframeConfig["1D"];

      const params = new URLSearchParams({
        symbol: selectedMarket.symbol.toUpperCase(),
        timeframe: config.apiTimeframe,
        limit: String(config.limit),
      });

      const endpoint =
        `${API_URL}/api/market/bars?${params.toString()}`;

      try {
        // console.log(
        //   "[Markets] Fetching market bars:",
        //   endpoint
        // );

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        const rawText = await response.text();

        let result = null;

        try {
          result = rawText ? JSON.parse(rawText) : null;
        } catch {
          throw new Error(
            `Backend returned invalid JSON (${response.status}).`
          );
        }

        if (!response.ok) {
          const message =
            result?.detail ||
            result?.message ||
            result?.error ||
            `Market request failed with status ${response.status}.`;

          throw new Error(message);
        }

        /*
         * IMPORTANT:
         *
         * Your backend returns:
         *
         * {
         *   symbol: "AAPL",
         *   timeframe: "1Min",
         *   bars: [...]
         * }
         *
         * Therefore we explicitly read result.bars.
         */

        const returnedBars = Array.isArray(result?.bars)
          ? result.bars
          : [];

        if (!returnedBars.length) {
          throw new Error(
            `No market data was returned for ${selectedMarket.symbol}.`
          );
        }

        const normalizedBars = returnedBars
          .map((bar) => ({
            time: bar.time,
            open: Number(bar.open),
            high: Number(bar.high),
            low: Number(bar.low),
            close: Number(bar.close),
            volume: Number(bar.volume || 0),
            vwap:
              bar.vwap !== undefined
                ? Number(bar.vwap)
                : null,
            trade_count:
              bar.trade_count !== undefined
                ? Number(bar.trade_count)
                : null,
          }))
          .filter(
            (bar) =>
              bar.time &&
              Number.isFinite(bar.open) &&
              Number.isFinite(bar.high) &&
              Number.isFinite(bar.low) &&
              Number.isFinite(bar.close)
          );

        if (!normalizedBars.length) {
          throw new Error(
            `The backend returned bars for ${selectedMarket.symbol}, but none contained valid OHLC values.`
          );
        }

        if (cancelled) {
          return;
        }

        setBars(normalizedBars);
        setLastUpdated(new Date());
        setBarsError("");

        // console.log(
        //   `[Markets] ${selectedMarket.symbol}: ${normalizedBars.length} bars loaded`,
        //   result
        // );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "[Markets] Market data error:",
          error
        );

        setBars([]);
        setBarsError(
          error?.message ||
            "Unable to load market data."
        );
      } finally {
        if (!cancelled) {
          setLoadingBars(false);
        }
      }
    }

    fetchMarketBars();

    return () => {
      cancelled = true;
    };
  }, [selectedMarket.symbol, timeframe]);

  /* ==========================================================
     DERIVED MARKET STATS
  ========================================================== */

  const marketStats = useMemo(() => {
    if (!bars.length) {
      return {
        price: null,
        previousPrice: null,
        changePercent: null,
        changeValue: null,
        volume: null,
        high: null,
        low: null,
      };
    }

    const first = bars[0];
    const last = bars[bars.length - 1];

    const firstClose = Number(first.open);
    const lastClose = Number(last.close);

    const high = Math.max(
      ...bars.map((bar) => Number(bar.high))
    );

    const low = Math.min(
      ...bars.map((bar) => Number(bar.low))
    );

    const volume = bars.reduce(
      (total, bar) =>
        total + (Number(bar.volume) || 0),
      0
    );

    const changeValue =
      lastClose - firstClose;

    const changePercent =
      firstClose !== 0
        ? (changeValue / firstClose) * 100
        : 0;

    return {
      price: lastClose,
      previousPrice: firstClose,
      changePercent,
      changeValue,
      volume,
      high,
      low,
    };
  }, [bars]);

  const pricePositive =
    Number(marketStats.changePercent) >= 0;

  /* ==========================================================
     CHART
  ========================================================== */

  const chart = useMemo(() => {
    if (!bars.length) {
      return null;
    }

    return buildCandlestickChart(
      bars,
      timeframe
    );
  }, [bars, timeframe]);

  /* ==========================================================
     SELECT MARKET
  ========================================================== */

  function handleMarketSelect(market) {
    setSelectedMarket(market);
  }

  return (
    <AppLayout>
      <div className="min-h-screen overflow-hidden bg-[#f7f6f2] text-[#17151f]">
        {/* ==================================================
            AMBIENT BACKGROUND
        ================================================== */}

        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-[#c7b7ff]/20 blur-[120px]" />

          <div className="absolute right-[-100px] top-[280px] h-[420px] w-[420px] rounded-full bg-[#a8f3d0]/20 blur-[130px]" />

          <div className="absolute bottom-[-200px] left-[40%] h-[400px] w-[500px] rounded-full bg-[#ffd8c8]/20 blur-[140px]" />
        </div>

        <main className="relative mx-auto max-w-[1700px] px-5 py-7 sm:px-8 lg:px-10">
          {/* ==================================================
              HEADER
          ================================================== */}

          <header className="mb-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#17151f] text-white shadow-sm">
                    <BarChart3 size={13} />
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7b7487]">
                    Global markets
                  </span>
                </div>

                <h1 className="text-4xl font-semibold tracking-[-0.055em] text-[#17151f] sm:text-5xl">
                  Market
                  <span className="text-[#7f5cff]">
                    {" "}
                    intelligence.
                  </span>
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#77717f]">
                  Real-time market visibility, AI-generated
                  signals, price action and institutional-grade
                  intelligence across your trading universe.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge
                  icon={Radio}
                  label="Market feed"
                  value={loadingBars ? "SYNCING" : "LIVE"}
                  positive={!barsError}
                />

                <StatusBadge
                  icon={Clock3}
                  label="Session"
                  value="OPEN"
                />
              </div>
            </div>
          </header>

          {/* ==================================================
              GLOBAL INDICES
          ================================================== */}

          <section className="mb-6 overflow-hidden rounded-[24px] border border-[#e7e2db] bg-white shadow-[0_16px_50px_rgba(45,35,70,0.045)]">
            <div className="flex h-12 items-center justify-between border-b border-[#eeeae5] px-5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f1edff]">
                  <Activity
                    size={13}
                    className="text-[#7859f4]"
                  />
                </div>

                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#918a96]">
                  Global indices
                </span>
              </div>

              <span className="flex items-center gap-1.5 rounded-full bg-[#edfff7] px-2.5 py-1.5 text-[7px] font-bold uppercase tracking-wider text-[#26966b]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#35c98b]" />
                Live
              </span>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-4">
              {indices.map((item, index) => (
                <IndexCard
                  key={item.symbol}
                  {...item}
                  first={index === 0}
                />
              ))}
            </div>
          </section>

          {/* ==================================================
              MAIN GRID
          ================================================== */}

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            {/* ==================================================
                LEFT
            ================================================== */}

            <div className="min-w-0">
              {/* ==================================================
                  REAL MARKET CHART
              ================================================== */}

              <section className="overflow-hidden rounded-[26px] border border-[#e7e2db] bg-white shadow-[0_20px_60px_rgba(45,35,70,0.05)]">
                {/* HEADER */}

                <div className="flex flex-col gap-4 border-b border-[#eeeae5] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f1edff]">
                      <CandlestickChart
                        size={19}
                        className="text-[#7859f4]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold text-[#211e28]">
                          {selectedMarket.symbol}
                        </h2>

                        <span className="rounded-full bg-[#f1edff] px-2 py-1 text-[7px] font-bold uppercase tracking-wider text-[#7859f4]">
                          {selectedMarket.signal}
                        </span>
                      </div>

                      <p className="mt-1 text-[9px] uppercase tracking-wider text-[#97909b]">
                        {selectedMarket.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex rounded-xl bg-[#f5f3f8] p-1">
                      {timeframes.map((frame) => (
                        <button
                          key={frame}
                          type="button"
                          onClick={() =>
                            setTimeframe(frame)
                          }
                          className={[
                            "rounded-lg px-3 py-1.5 text-[8px] font-bold transition",
                            timeframe === frame
                              ? "bg-[#17151f] text-white shadow-sm"
                              : "text-[#99919d] hover:text-[#332e39]",
                          ].join(" ")}
                        >
                          {frame}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e7e2db] bg-white text-[#8d8791] transition hover:bg-[#faf8ff] hover:text-[#7859f4]"
                      aria-label="Expand chart"
                    >
                      <Maximize2 size={13} />
                    </button>
                  </div>
                </div>

                {/* PRICE */}

                <div className="flex flex-col gap-5 px-6 pt-7 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#918a96]">
                      Last price
                    </p>

                    <div className="mt-2 flex items-end gap-3">
                      <span className="font-mono text-4xl font-semibold tracking-[-0.06em] text-[#17151f]">
                        {loadingBars
                          ? "Loading..."
                          : formatPrice(
                              marketStats.price
                            )}
                      </span>

                      {!loadingBars &&
                        marketStats.changePercent !==
                          null && (
                          <span
                            className={[
                              "mb-1 flex items-center gap-1 text-xs font-bold",
                              pricePositive
                                ? "text-[#26966b]"
                                : "text-[#d35d4e]",
                            ].join(" ")}
                          >
                            {pricePositive ? (
                              <ArrowUpRight size={13} />
                            ) : (
                              <ArrowDownRight
                                size={13}
                              />
                            )}

                            {pricePositive ? "+" : ""}
                            {marketStats.changePercent.toFixed(
                              2
                            )}
                            %
                          </span>
                        )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 sm:gap-5">
                    <ChartStat
                      label="Volume"
                      value={formatVolume(
                        marketStats.volume
                      )}
                    />

                    <ChartStat
                      label="High"
                      value={formatPrice(
                        marketStats.high
                      )}
                    />

                    <ChartStat
                      label="Low"
                      value={formatPrice(
                        marketStats.low
                      )}
                    />
                  </div>
                </div>

                {/* ==================================================
                    CHART AREA
                ================================================== */}

                <div className="relative mt-6 h-[320px] px-5 sm:h-[390px] sm:px-7">
                  {loadingBars && (
                    <ChartLoading />
                  )}

                  {!loadingBars &&
                    barsError && (
                      <ChartError
                        symbol={selectedMarket.symbol}
                        message={barsError}
                        onRetry={() => {
                          /*
                           * Changing the selected market to itself
                           * does not trigger useEffect, so we force
                           * a lightweight retry by toggling timeframe
                           * internally.
                           */
                          setBarsError("");
                          setTimeframe((current) =>
                            current === "1D"
                              ? "1W"
                              : "1D"
                          );
                        }}
                      />
                    )}

                  {!loadingBars &&
                    !barsError &&
                    bars.length > 0 &&
                    chart && (
                      <CandlestickChartView
                        chart={chart}
                        bars={bars}
                        timeframe={timeframe}
                      />
                    )}

                  {!loadingBars &&
                    !barsError &&
                    bars.length === 0 && (
                      <EmptyChart
                        symbol={selectedMarket.symbol}
                      />
                    )}
                </div>

                {/* FOOTER */}

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#eeeae5] px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={[
                        "h-1.5 w-1.5 rounded-full",
                        loadingBars
                          ? "animate-pulse bg-[#8062ff]"
                          : barsError
                            ? "bg-[#ef876e]"
                            : "bg-[#35c98b]",
                      ].join(" ")}
                    />

                    <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#817b85]">
                      {loadingBars
                        ? "Loading market data"
                        : barsError
                          ? "Market feed error"
                          : "Live market data"}
                    </span>
                  </div>

                  <span className="text-[8px] uppercase tracking-wider text-[#aaa3ad]">
                    {bars.length > 0
                      ? `${bars.length} bars • ${timeframeConfig[timeframe]?.apiTimeframe || "1Min"}`
                      : lastUpdated
                        ? `Updated ${lastUpdated.toLocaleTimeString()}`
                        : "Waiting for data"}
                  </span>
                </div>
              </section>

              {/* ==================================================
                  MARKET UNIVERSE
              ================================================== */}

              <section className="mt-6 overflow-hidden rounded-[26px] border border-[#e7e2db] bg-white shadow-[0_20px_60px_rgba(45,35,70,0.05)]">
                <div className="flex flex-col gap-4 border-b border-[#eeeae5] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1edff]">
                      <Layers3
                        size={16}
                        className="text-[#7859f4]"
                      />
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold text-[#211e28]">
                        Market universe
                      </h2>

                      <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#97909b]">
                        AI monitored assets
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center rounded-xl border border-[#e8e4de] bg-[#faf9f7] px-3">
                      <Search
                        size={12}
                        className="text-[#aaa3ad]"
                      />

                      <input
                        value={search}
                        onChange={(e) =>
                          setSearch(e.target.value)
                        }
                        placeholder="Search asset..."
                        className="w-32 bg-transparent px-2 py-2.5 text-[9px] text-[#37313f] outline-none placeholder:text-[#aaa3ad]"
                      />
                    </div>

                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) =>
                          setCategory(e.target.value)
                        }
                        className="h-full appearance-none rounded-xl border border-[#e8e4de] bg-[#faf9f7] px-3 pr-8 text-[9px] font-semibold uppercase tracking-wider text-[#817b85] outline-none"
                      >
                        <option value="All">
                          All sectors
                        </option>

                        <option value="Technology">
                          Technology
                        </option>

                        <option value="Consumer">
                          Consumer
                        </option>

                        <option value="Automotive">
                          Automotive
                        </option>

                        <option value="Index">
                          Index
                        </option>
                      </select>

                      <ChevronDown
                        size={11}
                        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#aaa3ad]"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px]">
                    <thead>
                      <tr className="border-b border-[#eeeae5] text-left">
                        <TableHead>
                          Asset
                        </TableHead>

                        <TableHead>
                          Price
                        </TableHead>

                        <TableHead>
                          Change
                        </TableHead>

                        <TableHead>
                          Volume
                        </TableHead>

                        <TableHead>
                          AI signal
                        </TableHead>

                        <TableHead>
                          Strength
                        </TableHead>

                        <TableHead />
                      </tr>
                    </thead>

                    <tbody>
                      {filteredMarkets.map(
                        (market) => (
                          <MarketTableRow
                            key={market.symbol}
                            market={market}
                            selected={
                              selectedMarket.symbol ===
                              market.symbol
                            }
                            onSelect={() =>
                              handleMarketSelect(
                                market
                              )
                            }
                          />
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {filteredMarkets.length === 0 && (
                  <div className="flex min-h-[180px] items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5f1ff]">
                        <Search
                          size={18}
                          className="text-[#8569f7]"
                        />
                      </div>

                      <p className="mt-3 text-xs font-semibold text-[#37313f]">
                        No assets found
                      </p>

                      <p className="mt-1 text-[9px] text-[#aaa3ad]">
                        Try another symbol or sector.
                      </p>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* ==================================================
                RIGHT INTELLIGENCE
            ================================================== */}

            <aside className="space-y-6">
              {/* AI ANALYST */}

              <section className="relative overflow-hidden rounded-[26px] border border-[#e6e0f2] bg-[#f7f4ff]">
                <div className="pointer-events-none absolute right-[-80px] top-[-100px] h-[300px] w-[300px] rounded-full bg-[#b9a5ff]/20 blur-[80px]" />

                <div className="relative">
                  <div className="flex items-center justify-between border-b border-[#e7e0f0] px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                        <BrainCircuit
                          size={17}
                          className="text-[#7859f4]"
                        />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#25202f]">
                          AI Analyst
                        </p>

                        <p className="mt-1 text-[9px] uppercase tracking-wider text-[#958da2]">
                          Market intelligence
                        </p>
                      </div>
                    </div>

                    <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[7px] font-bold uppercase tracking-wider text-[#3b9d75] shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#35c98b]" />
                      Active
                    </span>
                  </div>

                  <div className="relative p-6">
                    <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#958d99]">
                      Current bias
                    </p>

                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                        <TrendingUp
                          size={18}
                          className="text-[#26966b]"
                        />
                      </div>

                      <span className="text-lg font-semibold tracking-[-0.03em] text-[#322d38]">
                        Moderately Bullish
                      </span>
                    </div>

                    <div className="mt-5 rounded-2xl border border-[#e7e0f0] bg-white/70 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-bold uppercase tracking-wider text-[#958d99]">
                          Confidence
                        </span>

                        <span className="font-mono text-xs font-semibold text-[#7859f4]">
                          87%
                        </span>
                      </div>

                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#eeeaf5]">
                        <div className="h-full w-[87%] rounded-full bg-[#8062ff]" />
                      </div>
                    </div>

                    <p className="mt-5 text-[10px] leading-6 text-[#8f8797]">
                      Momentum remains positive across major
                      technology and index assets. AI models are
                      detecting elevated institutional buying
                      pressure with controlled volatility.
                    </p>

                    <button
                      type="button"
                      className="group mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#17151f] py-3.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_25px_rgba(23,21,31,0.14)] transition hover:-translate-y-0.5 hover:bg-[#262231]"
                    >
                      <Sparkles
                        size={13}
                        className="text-[#b9a6ff]"
                      />

                      Run deep analysis

                      <ChevronRight
                        size={12}
                        className="transition group-hover:translate-x-1"
                      />
                    </button>
                  </div>
                </div>
              </section>

              {/* SECTOR MOMENTUM */}

              <section className="overflow-hidden rounded-[26px] border border-[#e7e2db] bg-white shadow-[0_20px_60px_rgba(45,35,70,0.05)]">
                <div className="flex items-center justify-between border-b border-[#eeeae5] px-6 py-5">
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#918a96]">
                      Relative strength
                    </p>

                    <h2 className="mt-1 text-sm font-semibold text-[#211e28]">
                      Sector momentum
                    </h2>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f3f8]">
                    <Gauge
                      size={15}
                      className="text-[#7d7486]"
                    />
                  </div>
                </div>

                <div>
                  {sectors.map((sector) => (
                    <SectorRow
                      key={sector.name}
                      {...sector}
                    />
                  ))}
                </div>
              </section>

              {/* MARKET CONDITIONS */}

              <section className="overflow-hidden rounded-[26px] border border-[#e7e2db] bg-white shadow-[0_20px_60px_rgba(45,35,70,0.05)]">
                <div className="border-b border-[#eeeae5] px-6 py-5">
                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#918a96]">
                    Environment
                  </p>

                  <h2 className="mt-1 text-sm font-semibold text-[#211e28]">
                    Market conditions
                  </h2>
                </div>

                <div>
                  <ConditionRow
                    icon={Activity}
                    label="Momentum"
                    value="Positive"
                    positive
                  />

                  <ConditionRow
                    icon={Gauge}
                    label="Volatility"
                    value="Low"
                    positive
                  />

                  <ConditionRow
                    icon={Target}
                    label="Liquidity"
                    value="Excellent"
                    positive
                  />

                  <ConditionRow
                    icon={ShieldCheck}
                    label="Risk regime"
                    value="Controlled"
                    positive
                  />
                </div>
              </section>

              {/* WATCHLIST */}

              <div className="rounded-[22px] border border-[#e7e2db] bg-white p-5 shadow-[0_12px_40px_rgba(45,35,70,0.035)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f1ff]">
                    <Eye
                      size={15}
                      className="text-[#7859f4]"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-[#37313f]">
                      Watchlist intelligence
                    </p>

                    <p className="mt-1 text-[8px] text-[#aaa3ad]">
                      {markets.length} assets monitored
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#35c98b]" />

                  <span className="text-[8px] font-bold uppercase tracking-wider text-[#817b85]">
                    AI scanning continuously
                  </span>
                </div>
              </div>
            </aside>
          </div>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <footer className="mt-8 flex flex-col gap-3 border-t border-[#e7e2db] pt-5 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#aaa3ad] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-[#756d80]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#35c98b]" />
                Trade Pilot AI
              </span>

              <span>
                Market intelligence infrastructure
              </span>
            </div>

            <span>
              Real-time paper trading environment
            </span>
          </footer>
        </main>
      </div>
    </AppLayout>
  );
}

/* ============================================================
   CANDLESTICK CHART BUILDER
============================================================ */

function buildCandlestickChart(bars, timeframe) {
  const width = 1000;
  const height = 420;

  const padding = {
    top: 20,
    right: 55,
    bottom: 45,
    left: 10,
  };

  const plotWidth =
    width -
    padding.left -
    padding.right;

  const plotHeight =
    height -
    padding.top -
    padding.bottom;

  const highs = bars.map((bar) =>
    Number(bar.high)
  );

  const lows = bars.map((bar) =>
    Number(bar.low)
  );

  const maxPrice = Math.max(...highs);
  const minPrice = Math.min(...lows);

  const priceRange =
    maxPrice - minPrice || 1;

  const yForPrice = (price) => {
    return (
      padding.top +
      ((maxPrice - price) / priceRange) *
        plotHeight
    );
  };

  const candleSlot =
    plotWidth / Math.max(bars.length, 1);

  const candleWidth = Math.max(
    3,
    Math.min(
      16,
      candleSlot * 0.62
    )
  );

  const candles = bars.map(
    (bar, index) => {
      const x =
        padding.left +
        index * candleSlot +
        candleSlot / 2;

      const openY = yForPrice(bar.open);
      const closeY = yForPrice(bar.close);
      const highY = yForPrice(bar.high);
      const lowY = yForPrice(bar.low);

      const positive =
        bar.close >= bar.open;

      return {
        ...bar,
        index,
        x,
        openY,
        closeY,
        highY,
        lowY,
        bodyTop: Math.min(
          openY,
          closeY
        ),
        bodyBottom: Math.max(
          openY,
          closeY
        ),
        bodyHeight: Math.max(
          2,
          Math.abs(openY - closeY)
        ),
        candleWidth,
        positive,
      };
    }
  );

  const gridPrices = [
    maxPrice,
    maxPrice - priceRange * 0.25,
    maxPrice - priceRange * 0.5,
    maxPrice - priceRange * 0.75,
    minPrice,
  ];

  const labels = gridPrices.map(
    (price) => ({
      price,
      y: yForPrice(price),
    })
  );

  const visibleIndexes = [
    0,
    Math.floor(bars.length * 0.25),
    Math.floor(bars.length * 0.5),
    Math.floor(bars.length * 0.75),
    bars.length - 1,
  ].filter(
    (value, index, array) =>
      array.indexOf(value) === index
  );

  const xLabels = visibleIndexes.map(
    (index) => ({
      index,
      x: candles[index]?.x || 0,
      label: formatTime(
        bars[index]?.time,
        timeframe
      ),
    })
  );

  return {
    width,
    height,
    padding,
    candles,
    labels,
    xLabels,
    maxPrice,
    minPrice,
  };
}

/* ============================================================
   CANDLESTICK VIEW
============================================================ */

function CandlestickChartView({
  chart,
  bars,
}) {
  return (
    <div className="relative h-full w-full">
      {/* PRICE LABELS */}

      <div className="pointer-events-none absolute right-0 top-4 z-10 flex h-[78%] flex-col justify-between">
        {chart.labels.map((item) => (
          <span
            key={`${item.price}-${item.y}`}
            className="rounded bg-white/90 px-1 font-mono text-[7px] text-[#aaa3ad]"
          >
            {formatPrice(item.price)}
          </span>
        ))}
      </div>

      {/* SVG */}

      <svg
        viewBox={`0 0 ${chart.width} ${chart.height}`}
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="candleGlow">
            <feGaussianBlur
              stdDeviation="2"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* HORIZONTAL GRID */}

        {chart.labels.map((item) => (
          <line
            key={`grid-${item.y}`}
            x1={chart.padding.left}
            x2={
              chart.width -
              chart.padding.right
            }
            y1={item.y}
            y2={item.y}
            stroke="#ebe7e2"
            strokeDasharray="4 5"
            strokeWidth="1"
          />
        ))}

        {/* VERTICAL GRID */}

        {chart.xLabels.map((item) => (
          <line
            key={`vgrid-${item.index}`}
            x1={item.x}
            x2={item.x}
            y1={chart.padding.top}
            y2={
              chart.height -
              chart.padding.bottom
            }
            stroke="#f0ece8"
            strokeDasharray="4 5"
            strokeWidth="1"
          />
        ))}

        {/* CANDLES */}

        {chart.candles.map((candle) => (
          <g key={`${candle.time}-${candle.index}`}>
            {/* WICK */}

            <line
              x1={candle.x}
              x2={candle.x}
              y1={candle.highY}
              y2={candle.lowY}
              stroke={
                candle.positive
                  ? "#26966b"
                  : "#d35d4e"
              }
              strokeWidth="1.5"
              opacity="0.9"
            />

            {/* BODY */}

            <rect
              x={
                candle.x -
                candle.candleWidth / 2
              }
              y={candle.bodyTop}
              width={candle.candleWidth}
              height={candle.bodyHeight}
              rx="1.5"
              fill={
                candle.positive
                  ? "#35c98b"
                  : "#ef876e"
              }
              opacity="0.95"
              filter={
                candle.index ===
                chart.candles.length - 1
                  ? "url(#candleGlow)"
                  : undefined
              }
            />
          </g>
        ))}

        {/* CURRENT PRICE LINE */}

        {chart.candles.length > 0 && (
          <>
            <line
              x1={chart.padding.left}
              x2={
                chart.width -
                chart.padding.right
              }
              y1={
                chart.candles[
                  chart.candles.length - 1
                ].closeY
              }
              y2={
                chart.candles[
                  chart.candles.length - 1
                ].closeY
              }
              stroke="#8062ff"
              strokeWidth="1"
              strokeDasharray="3 4"
              opacity="0.8"
            />

            <circle
              cx={
                chart.candles[
                  chart.candles.length - 1
                ].x
              }
              cy={
                chart.candles[
                  chart.candles.length - 1
                ].closeY
              }
              r="4"
              fill="#8062ff"
            />

            <circle
              cx={
                chart.candles[
                  chart.candles.length - 1
                ].x
              }
              cy={
                chart.candles[
                  chart.candles.length - 1
                ].closeY
              }
              r="10"
              fill="#8062ff"
              opacity="0.1"
            />
          </>
        )}

        {/* X AXIS */}

        <line
          x1={chart.padding.left}
          x2={
            chart.width -
            chart.padding.right
          }
          y1={
            chart.height -
            chart.padding.bottom
          }
          y2={
            chart.height -
            chart.padding.bottom
          }
          stroke="#eeeae5"
        />
      </svg>

      {/* X LABELS */}

      <div className="pointer-events-none absolute bottom-0 left-3 right-12 flex items-center justify-between">
        {chart.xLabels.map((item) => (
          <span
            key={`xlabel-${item.index}`}
            className="font-mono text-[7px] font-semibold text-[#aaa3ad]"
          >
            {item.label}
          </span>
        ))}
      </div>

      {/* BAR COUNT */}

      <div className="absolute bottom-0 left-3 rounded-md bg-white/80 px-1.5 py-1 text-[7px] font-semibold uppercase tracking-wider text-[#aaa3ad]">
        {bars.length} bars
      </div>
    </div>
  );
}

/* ============================================================
   CHART LOADING
============================================================ */

function ChartLoading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="mx-auto flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-[#f1edff]">
          <CandlestickChart
            size={19}
            className="text-[#8062ff]"
          />
        </div>

        <p className="mt-4 text-center text-xs font-semibold text-[#37313f]">
          Loading market data
        </p>

        <p className="mt-1 text-center text-[9px] text-[#aaa3ad]">
          Syncing {` `}
          <span className="font-semibold">
            market bars
          </span>
          ...
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   CHART ERROR
============================================================ */

function ChartError({
  symbol,
  message,
  onRetry,
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="max-w-md px-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1ed]">
          <Activity
            size={18}
            className="text-[#d35d4e]"
          />
        </div>

        <p className="mt-4 text-xs font-semibold text-[#37313f]">
          Unable to load {symbol}
        </p>

        <p className="mt-2 text-[9px] leading-5 text-[#aaa3ad]">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-xl bg-[#17151f] px-4 py-2.5 text-[8px] font-bold uppercase tracking-wider text-white transition hover:bg-[#282430]"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   EMPTY CHART
============================================================ */

function EmptyChart({ symbol }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5f1ff]">
          <CandlestickChart
            size={18}
            className="text-[#8569f7]"
          />
        </div>

        <p className="mt-3 text-xs font-semibold text-[#37313f]">
          No market data
        </p>

        <p className="mt-1 text-[9px] text-[#aaa3ad]">
          No bars were returned for {symbol}.
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   STATUS BADGE
============================================================ */

function StatusBadge({
  icon: Icon,
  label,
  value,
  positive = false,
}) {
  return (
    <div
      className={[
        "flex items-center gap-2 rounded-xl border px-4 py-2.5",
        positive
          ? "border-[#dcefe6] bg-[#f1fff8]"
          : "border-[#e7e3dc] bg-white shadow-[0_8px_25px_rgba(40,30,60,0.04)]",
      ].join(" ")}
    >
      <Icon
        size={12}
        className={
          positive
            ? "text-[#26966b]"
            : "text-[#8a8391]"
        }
      />

      <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#817b85]">
        {label}
      </span>

      <span
        className={[
          "text-[8px] font-bold uppercase tracking-[0.12em]",
          positive
            ? "text-[#26966b]"
            : "text-[#77717f]",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

/* ============================================================
   INDEX CARD
============================================================ */

function IndexCard({
  symbol,
  price,
  change,
  positive,
  first,
}) {
  return (
    <div
      className={[
        "flex items-center justify-between px-6 py-5",
        !first
          ? "border-t border-[#eeeae5] sm:border-l sm:border-t-0"
          : "",
      ].join(" ")}
    >
      <div>
        <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#97909b]">
          {symbol}
        </p>

        <p className="mt-1 font-mono text-xs font-semibold text-[#37313f]">
          {price}
        </p>
      </div>

      <div
        className={[
          "flex items-center gap-1 text-[9px] font-bold",
          positive
            ? "text-[#26966b]"
            : "text-[#d35d4e]",
        ].join(" ")}
      >
        {positive ? (
          <ArrowUpRight size={11} />
        ) : (
          <ArrowDownRight size={11} />
        )}

        {change}
      </div>
    </div>
  );
}

/* ============================================================
   CHART STAT
============================================================ */

function ChartStat({ label, value }) {
  return (
    <div className="rounded-xl border border-[#eeeae5] bg-[#faf9f7] px-3 py-2.5">
      <p className="text-[7px] font-bold uppercase tracking-wider text-[#aaa3ad]">
        {label}
      </p>

      <p className="mt-1 font-mono text-[10px] font-semibold text-[#4b4451]">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   TABLE HEAD
============================================================ */

function TableHead({ children }) {
  return (
    <th className="px-6 py-4 text-[8px] font-bold uppercase tracking-[0.15em] text-[#9b949f]">
      {children}
    </th>
  );
}

/* ============================================================
   MARKET TABLE ROW
============================================================ */

function MarketTableRow({
  market,
  selected,
  onSelect,
}) {
  return (
    <tr
      onClick={onSelect}
      className={[
        "group cursor-pointer border-b border-[#f0ece8] transition",
        selected
          ? "bg-[#faf8ff]"
          : "hover:bg-[#faf8ff]",
      ].join(" ")}
    >
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div
            className={[
              "flex h-10 w-10 items-center justify-center rounded-xl text-[9px] font-bold transition group-hover:scale-105",
              selected
                ? "bg-[#f1edff] text-[#7859f4]"
                : "bg-[#f5f3f8] text-[#817987]",
            ].join(" ")}
          >
            {market.symbol.slice(0, 2)}
          </div>

          <div>
            <p className="text-xs font-semibold text-[#39333f]">
              {market.symbol}
            </p>

            <p className="mt-1 max-w-[170px] truncate text-[8px] text-[#aaa3ad]">
              {market.name}
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-5">
        <span className="font-mono text-[10px] font-semibold text-[#37313f]">
          {market.symbol === "AAPL"
            ? "Live"
            : "—"}
        </span>
      </td>

      <td className="px-6 py-5">
        <span className="text-[9px] text-[#aaa3ad]">
          Live
        </span>
      </td>

      <td className="px-6 py-5">
        <span className="font-mono text-[9px] text-[#817b85]">
          —
        </span>
      </td>

      <td className="px-6 py-5">
        <span
          className={[
            "inline-flex rounded-full px-2.5 py-1.5 text-[7px] font-bold uppercase tracking-wider",
            market.signal === "Strong Buy"
              ? "bg-[#f1edff] text-[#7859f4]"
              : market.signal === "Bullish"
                ? "bg-[#edfff7] text-[#26966b]"
                : "bg-[#f5f3f8] text-[#817b85]",
          ].join(" ")}
        >
          {market.signal}
        </span>
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#eeeaf5]">
            <div
              className="h-full rounded-full bg-[#8062ff]"
              style={{
                width: `${market.strength}%`,
              }}
            />
          </div>

          <span className="font-mono text-[8px] font-semibold text-[#817b85]">
            {market.strength}
          </span>
        </div>
      </td>

      <td className="px-6 py-5">
        <ChevronRight
          size={13}
          className={[
            "transition",
            selected
              ? "text-[#7859f4]"
              : "text-[#c0bac3]",
          ].join(" ")}
        />
      </td>
    </tr>
  );
}

/* ============================================================
   SECTOR ROW
============================================================ */

function SectorRow({
  name,
  change,
  strength,
  positive,
}) {
  return (
    <div className="border-b border-[#f0ece8] px-6 py-4">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-medium text-[#696270]">
          {name}
        </span>

        <span
          className={[
            "font-mono text-[9px] font-semibold",
            positive
              ? "text-[#26966b]"
              : "text-[#d35d4e]",
          ].join(" ")}
        >
          {change}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#eeeaf5]">
          <div
            className={[
              "h-full rounded-full",
              positive
                ? "bg-[#8062ff]"
                : "bg-[#ef876e]",
            ].join(" ")}
            style={{
              width: `${strength}%`,
            }}
          />
        </div>

        <span className="w-6 text-right font-mono text-[7px] text-[#aaa3ad]">
          {strength}
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   CONDITION ROW
============================================================ */

function ConditionRow({
  icon: Icon,
  label,
  value,
  positive,
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#f0ece8] px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5f3f8]">
          <Icon
            size={13}
            className={
              positive
                ? "text-[#7859f4]"
                : "text-[#aaa3ad]"
            }
          />
        </div>

        <span className="text-[9px] font-medium text-[#696270]">
          {label}
        </span>
      </div>

      <span className="rounded-full bg-[#edfff7] px-2.5 py-1.5 text-[7px] font-bold uppercase tracking-wider text-[#26966b]">
        {value}
      </span>
    </div>
  );
}