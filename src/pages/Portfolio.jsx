import {
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CircleCheck,
  CircleDollarSign,
  Clock3,
  LineChart,
  Radio,
  RefreshCw,
  Layers3,
  Sparkles,
  Activity,
  PieChart,
  ShieldCheck,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { useCallback, useEffect, useMemo, useState } from "react";

import AppLayout from "../components/AppLayout";

const API_URL = (
  import.meta.env.VITE_BACKEND_URL ||
  "http://127.0.0.1:8000"
).replace(/\/$/, "");


/* ============================================================
   HELPERS
============================================================ */

function formatCurrency(value, currency = "USD") {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}


function formatCompactCurrency(value, currency = "USD") {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "—";
  }

  const symbol = currency === "USD" ? "$" : `${currency} `;

  const absolute = Math.abs(amount);

  if (absolute >= 1_000_000) {
    return `${amount < 0 ? "-" : ""}${symbol}${(
      absolute / 1_000_000
    ).toFixed(2)}M`;
  }

  if (absolute >= 1_000) {
    return `${amount < 0 ? "-" : ""}${symbol}${(
      absolute / 1_000
    ).toFixed(1)}K`;
  }

  return formatCurrency(amount, currency);
}


function formatPercent(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "—";
  }

  return `${amount >= 0 ? "+" : ""}${amount.toFixed(2)}%`;
}


function formatNumber(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 4,
  }).format(amount);
}


function getPositionName(symbol) {
  return symbol || "Unknown asset";
}


function getPositionPositive(position) {
  return Number(position.unrealized_pl || 0) >= 0;
}


function getRiskStatus(portfolioReturn, positionCount) {
  const returnValue = Number(portfolioReturn || 0);

  if (positionCount === 0) {
    return {
      label: "No exposure",
      description: "No active positions",
    };
  }

  if (returnValue < -10) {
    return {
      label: "Elevated",
      description: "Portfolio under pressure",
    };
  }

  if (returnValue < -5) {
    return {
      label: "Moderate",
      description: "Monitor portfolio exposure",
    };
  }

  return {
    label: "Controlled",
    description: "Portfolio exposure active",
  };
}


/* ============================================================
   PORTFOLIO
============================================================ */

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchPortfolio = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("access_token");

        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(
          `${API_URL}/api/dashboard/overview`,
          {
            method: "GET",
            headers,
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.detail ||
              data?.message ||
              "Unable to load portfolio."
          );
        }

        setPortfolio(data);
      } catch (err) {
        console.error("Portfolio fetch error:", err);

        setError(
          err?.message ||
            "Unable to connect to the portfolio service."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );


  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);


  /* ==========================================================
     DERIVED DATA
  ========================================================== */

  const positions = portfolio?.position_data || [];

  const equity = Number(portfolio?.equity || 0);
  const cash = Number(portfolio?.cash || 0);
  const buyingPower = Number(
    portfolio?.buying_power || 0
  );

  const marketValue = Number(
    portfolio?.market_value || 0
  );

  const costBasis = Number(
    portfolio?.cost_basis || 0
  );

  const unrealizedPL = Number(
    portfolio?.unrealized_pl || 0
  );

  const portfolioReturn = Number(
    portfolio?.portfolio_return || 0
  );

  const currency = portfolio?.currency || "USD";

  const positionCount = positions.length;

  const investedPercentage =
    equity > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (marketValue / equity) * 100
          )
        )
      : 0;

  const cashPercentage =
    equity > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (cash / equity) * 100
          )
        )
      : 0;


  const bestPerformer = useMemo(() => {
    if (!positions.length) {
      return null;
    }

    return positions.reduce(
      (best, current) => {
        if (!best) return current;

        return Number(
          current.unrealized_plpc || 0
        ) >
          Number(best.unrealized_plpc || 0)
          ? current
          : best;
      },
      null
    );
  }, [positions]);


  const weakestPosition = useMemo(() => {
    if (!positions.length) {
      return null;
    }

    return positions.reduce(
      (weakest, current) => {
        if (!weakest) return current;

        return Number(
          current.unrealized_plpc || 0
        ) <
          Number(weakest.unrealized_plpc || 0)
          ? current
          : weakest;
      },
      null
    );
  }, [positions]);


  const riskStatus = useMemo(
    () =>
      getRiskStatus(
        portfolioReturn,
        positionCount
      ),
    [portfolioReturn, positionCount]
  );


  /* ==========================================================
     REFRESH
  ========================================================== */

  function refreshPortfolio() {
    fetchPortfolio(true);
  }


  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-[#f7f6f2]">
          <div className="mx-auto w-full max-w-[1700px] px-5 py-7 sm:px-8 lg:px-10">

            <div className="animate-pulse">

              <div className="h-4 w-40 rounded bg-[#e8e3dc]" />

              <div className="mt-5 h-12 w-80 rounded-xl bg-[#e8e3dc]" />

              <div className="mt-3 h-4 w-[520px] max-w-full rounded bg-[#e8e3dc]" />

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-36 rounded-[22px] bg-white"
                  />
                ))}

              </div>

              <div className="mt-6 h-[430px] rounded-[28px] bg-white" />

              <div className="mt-6 grid gap-6 xl:grid-cols-2">

                <div className="h-[420px] rounded-[26px] bg-white" />

                <div className="h-[420px] rounded-[26px] bg-white" />

              </div>

            </div>

          </div>
        </div>
      </AppLayout>
    );
  }


  /* ==========================================================
     ERROR
  ========================================================== */

  if (error) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-[#f7f6f2] px-5 py-10 sm:px-8 lg:px-10">

          <div className="mx-auto flex min-h-[60vh] max-w-[700px] items-center justify-center">

            <div className="w-full rounded-[28px] border border-[#eadfdc] bg-white p-8 text-center shadow-[0_20px_60px_rgba(45,35,70,0.06)]">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1eb] text-[#d76a56]">

                <Activity size={20} />

              </div>

              <h1 className="mt-5 text-lg font-semibold text-[#211e28]">
                Portfolio unavailable
              </h1>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#827b87]">
                {error}
              </p>

              <button
                onClick={() => fetchPortfolio()}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#17151f] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5"
              >
                <RefreshCw size={13} />
                Try again
              </button>

            </div>

          </div>

        </div>
      </AppLayout>
    );
  }


  return (
    <AppLayout>

      <div className="relative min-h-screen overflow-hidden bg-[#f7f6f2] text-[#17151f]">

        {/* ======================================================
            AMBIENT BACKGROUND
        ======================================================= */}

        <div className="pointer-events-none fixed inset-0 overflow-hidden">

          <div className="absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-[#c7b7ff]/20 blur-[120px]" />

          <div className="absolute right-[-100px] top-[280px] h-[420px] w-[420px] rounded-full bg-[#a8f3d0]/20 blur-[130px]" />

          <div className="absolute bottom-[-200px] left-[40%] h-[400px] w-[500px] rounded-full bg-[#ffd8c8]/20 blur-[140px]" />

        </div>


        <main className="relative mx-auto w-full max-w-[1700px] px-5 py-7 sm:px-8 lg:px-10">

          {/* ==================================================
              HEADER
          =================================================== */}

          <section className="mb-8">

            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

              <div>

                <div className="mb-4 flex items-center gap-2">

                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#17151f] text-white shadow-sm">

                    <BriefcaseBusiness size={13} />

                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7b7487]">
                    Portfolio intelligence
                  </span>

                </div>


                <h1 className="text-4xl font-semibold tracking-[-0.055em] text-[#17151f] sm:text-5xl">

                  Portfolio

                  <span className="text-[#7f5cff]">
                    {" "}command.
                  </span>

                </h1>


                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#77717f]">
                  Monitor your live paper-trading account,
                  active positions, capital allocation and
                  portfolio performance.
                </p>

              </div>


              <div className="flex flex-wrap items-center gap-3">

                <button
                  onClick={refreshPortfolio}
                  disabled={refreshing}
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

                  {refreshing
                    ? "Refreshing"
                    : "Refresh"}

                </button>


                <div className="flex items-center gap-2 rounded-xl border border-[#dcefe6] bg-[#f1fff8] px-4 py-2.5">

                  <span className="relative flex h-2 w-2">

                    <span className="absolute inset-0 animate-ping rounded-full bg-[#35c98b] opacity-50" />

                    <span className="relative h-2 w-2 rounded-full bg-[#35c98b]" />

                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#26966b]">
                    Live account
                  </span>

                </div>


                <div className="flex items-center gap-2 rounded-xl border border-[#e7e3dc] bg-white px-4 py-2.5 shadow-[0_8px_25px_rgba(40,30,60,0.04)]">

                  <Radio
                    size={13}
                    className="text-[#8a8391]"
                  />

                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#77717f]">
                    {portfolio?.paper_trading
                      ? "Paper mode"
                      : "Live mode"}
                  </span>

                </div>

              </div>

            </div>

          </section>


          {/* ==================================================
              OVERVIEW
          =================================================== */}

          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <OverviewCard
              icon={Wallet}
              label="Portfolio equity"
              value={formatCurrency(
                equity,
                currency
              )}
              trend={`${formatCurrency(
                buyingPower,
                currency
              )} buying power`}
              accent="violet"
            />


            <OverviewCard
              icon={TrendingUp}
              label="Unrealized P/L"
              value={formatCurrency(
                unrealizedPL,
                currency
              )}
              trend={formatPercent(
                portfolioReturn
              )}
              accent={
                unrealizedPL >= 0
                  ? "mint"
                  : "peach"
              }
            />


            <OverviewCard
              icon={Target}
              label="Invested capital"
              value={formatCurrency(
                marketValue,
                currency
              )}
              trend={`${investedPercentage.toFixed(
                1
              )}% of equity`}
              accent="peach"
            />


            <OverviewCard
              icon={ShieldCheck}
              label="Portfolio status"
              value={riskStatus.label}
              trend={`${positionCount} active position${
                positionCount === 1
                  ? ""
                  : "s"
              }`}
              accent="purple"
            />

          </section>


          {/* ==================================================
              PERFORMANCE HERO
          =================================================== */}

          <section className="relative mb-6 overflow-hidden rounded-[28px] border border-[#e7e2db] bg-white shadow-[0_25px_80px_rgba(45,35,70,0.07)]">

            <div className="pointer-events-none absolute right-[-100px] top-[-150px] h-[450px] w-[450px] rounded-full bg-[#bcaaff]/15 blur-[100px]" />

            <div className="pointer-events-none absolute bottom-[-160px] left-[25%] h-[300px] w-[400px] rounded-full bg-[#a7efd1]/10 blur-[100px]" />


            <div className="relative flex flex-col justify-between gap-5 border-b border-[#eeeae5] px-6 py-5 sm:flex-row sm:items-center sm:px-8">

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f1edff]">

                  <LineChart
                    size={19}
                    className="text-[#7f5cff]"
                  />

                </div>

                <div>

                  <div className="flex items-center gap-2">

                    <h2 className="text-sm font-semibold text-[#211e28]">
                      Portfolio performance
                    </h2>

                    <span className="rounded-full bg-[#f3f1f6] px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-[#817a89]">
                      Live
                    </span>

                  </div>

                  <p className="mt-1 text-[10px] text-[#97909b]">
                    Current account performance
                  </p>

                </div>

              </div>

            </div>


            <div className="relative grid lg:grid-cols-[0.72fr_1.28fr]">

              <div className="border-b border-[#eeeae5] p-7 sm:p-9 lg:border-b-0 lg:border-r">

                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#918a96]">
                  Current portfolio value
                </p>

                <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-[#17151f] sm:text-5xl">
                  {formatCurrency(
                    equity,
                    currency
                  )}
                </h2>


                <div className="mt-5 flex items-center gap-3">

                  <div
                    className={[
                      "flex items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-bold",
                      unrealizedPL >= 0
                        ? "bg-[#edfff7] text-[#26966b]"
                        : "bg-[#fff1eb] text-[#d35d4e]",
                    ].join(" ")}
                  >

                    {unrealizedPL >= 0 ? (
                      <ArrowUpRight size={13} />
                    ) : (
                      <ArrowDownRight size={13} />
                    )}

                    {formatCurrency(
                      unrealizedPL,
                      currency
                    )}

                  </div>

                  <span className="text-[9px] font-semibold uppercase tracking-wider text-[#9a939f]">
                    Unrealized P/L
                  </span>

                </div>


                <div className="mt-9 grid grid-cols-2 gap-3">

                  <SmallStat
                    label="Invested"
                    value={formatCompactCurrency(
                      marketValue,
                      currency
                    )}
                  />

                  <SmallStat
                    label="Cash"
                    value={formatCompactCurrency(
                      cash,
                      currency
                    )}
                  />

                </div>


                <div className="mt-3 grid grid-cols-2 gap-3">

                  <SmallStat
                    label="Return"
                    value={formatPercent(
                      portfolioReturn
                    )}
                  />

                  <SmallStat
                    label="Positions"
                    value={String(
                      positionCount
                    )}
                  />

                </div>

              </div>


              <div className="relative min-h-[340px] p-6 sm:p-8">

                <div className="absolute inset-x-8 bottom-12 top-10">

                  <div className="absolute left-0 right-0 top-0 border-t border-dashed border-[#ebe7e2]" />

                  <div className="absolute left-0 right-0 top-1/3 border-t border-dashed border-[#ebe7e2]" />

                  <div className="absolute left-0 right-0 top-2/3 border-t border-dashed border-[#ebe7e2]" />

                  <div className="absolute bottom-0 left-0 right-0 border-t border-dashed border-[#ebe7e2]" />

                </div>


                <div className="relative flex h-full min-h-[270px] items-center justify-center">

                  {positionCount === 0 ? (

                    <div className="text-center">

                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4f1f8]">

                        <LineChart
                          size={19}
                          className="text-[#9a929f]"
                        />

                      </div>

                      <p className="mt-4 text-xs font-semibold text-[#4c4553]">
                        No active portfolio exposure
                      </p>

                      <p className="mt-1 text-[9px] text-[#aaa3ad]">
                        Portfolio performance will appear
                        here when positions are active.
                      </p>

                    </div>

                  ) : (

                    <div className="w-full">

                      <div className="mb-8 flex items-center justify-between">

                        <div>

                          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#aaa3ad]">
                            Unrealized return
                          </p>

                          <p
                            className={[
                              "mt-2 text-4xl font-semibold tracking-[-0.05em]",
                              portfolioReturn >= 0
                                ? "text-[#26966b]"
                                : "text-[#d35d4e]",
                            ].join(" ")}
                          >
                            {formatPercent(
                              portfolioReturn
                            )}
                          </p>

                        </div>


                        <div className="rounded-2xl border border-[#eeeae5] bg-[#faf9f7] p-4">

                          {portfolioReturn >= 0 ? (
                            <TrendingUp
                              size={24}
                              className="text-[#26966b]"
                            />
                          ) : (
                            <TrendingDown
                              size={24}
                              className="text-[#d35d4e]"
                            />
                          )}

                        </div>

                      </div>


                      <div className="relative h-24">

                        <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-[#e7e2db]" />

                        <div
                          className={[
                            "absolute left-0 right-0 top-1/2 h-1 rounded-full",
                            portfolioReturn >= 0
                              ? "bg-[#65d5a6]"
                              : "bg-[#ef876e]",
                          ].join(" ")}
                        />

                        <div
                          className={[
                            "absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-4 border-white shadow-lg",
                            portfolioReturn >= 0
                              ? "bg-[#35c98b]"
                              : "bg-[#d35d4e]",
                          ].join(" ")}
                          style={{
                            left: `${Math.min(
                              100,
                              Math.max(
                                0,
                                portfolioReturn >= 0
                                  ? Math.min(
                                      100,
                                      portfolioReturn *
                                        4 +
                                        50
                                    )
                                  : Math.max(
                                      0,
                                      50 +
                                        portfolioReturn *
                                          4
                                    )
                              )
                            )}%`,
                          }}
                        />

                      </div>


                      <div className="flex justify-between text-[8px] font-semibold uppercase tracking-wider text-[#aaa3ad]">

                        <span>
                          Cost basis{" "}
                          {formatCompactCurrency(
                            costBasis,
                            currency
                          )}
                        </span>

                        <span>
                          Market value{" "}
                          {formatCompactCurrency(
                            marketValue,
                            currency
                          )}
                        </span>

                      </div>

                    </div>

                  )}

                </div>

              </div>

            </div>

          </section>


          {/* ==================================================
              ALLOCATION + INTELLIGENCE
          =================================================== */}

          <section className="mb-6 grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">

            <div className="overflow-hidden rounded-[26px] border border-[#e7e2db] bg-white shadow-[0_20px_60px_rgba(45,35,70,0.05)]">

              <div className="flex items-center justify-between border-b border-[#eeeae5] px-6 py-5">

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#918a96]">
                    Capital distribution
                  </p>

                  <h2 className="mt-1 text-sm font-semibold text-[#211e28]">
                    Portfolio allocation
                  </h2>

                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f3f8]">

                  <PieChart
                    size={15}
                    className="text-[#7d7486]"
                  />

                </div>

              </div>


              <div className="p-6">

                <div className="mb-7 flex items-center gap-7">

                  <div
                    className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(
                        #8062ff 0 ${investedPercentage}%,
                        #e7e3dc ${investedPercentage}% 100%
                      )`,
                    }}
                  >

                    <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">

                      <span className="text-2xl font-semibold tracking-[-0.05em] text-[#24202b]">
                        {investedPercentage.toFixed(
                          0
                        )}
                        %
                      </span>

                      <span className="mt-0.5 text-[8px] font-bold uppercase tracking-wider text-[#aaa3ad]">
                        invested
                      </span>

                    </div>

                  </div>


                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#aaa3ad]">
                      Invested capital
                    </p>

                    <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#24202b]">
                      {formatCompactCurrency(
                        marketValue,
                        currency
                      )}
                    </p>

                    <p className="mt-2 text-[9px] leading-5 text-[#958e9a]">
                      {investedPercentage.toFixed(
                        1
                      )}
                      % of account equity is
                      currently deployed.
                    </p>

                  </div>

                </div>


                <div className="space-y-4">

                  <AllocationRow
                    name="Invested positions"
                    value={formatCompactCurrency(
                      marketValue,
                      currency
                    )}
                    percentage={investedPercentage}
                    type="violet"
                  />

                  <AllocationRow
                    name="Cash"
                    value={formatCompactCurrency(
                      cash,
                      currency
                    )}
                    percentage={cashPercentage}
                    type="mint"
                  />

                </div>

              </div>

            </div>


            <div className="overflow-hidden rounded-[26px] border border-[#e7e2db] bg-white shadow-[0_20px_60px_rgba(45,35,70,0.05)]">

              <div className="flex items-center justify-between border-b border-[#eeeae5] px-6 py-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1edff]">

                    <Sparkles
                      size={16}
                      className="text-[#7859f4]"
                    />

                  </div>

                  <div>

                    <h2 className="text-sm font-semibold text-[#211e28]">
                      Portfolio intelligence
                    </h2>

                    <p className="mt-1 text-[9px] uppercase tracking-wider text-[#97909b]">
                      Derived from live positions
                    </p>

                  </div>

                </div>


                <span className="flex items-center gap-1.5 rounded-full bg-[#edfff7] px-3 py-1.5 text-[8px] font-bold uppercase tracking-wider text-[#26966b]">

                  <span className="h-1.5 w-1.5 rounded-full bg-[#35c98b]" />

                  Active

                </span>

              </div>


              <div className="grid gap-4 p-6 sm:grid-cols-2">

                <PortfolioInsight
                  icon={TrendingUp}
                  label="Best performer"
                  value={
                    bestPerformer?.symbol ||
                    "—"
                  }
                  description={
                    bestPerformer
                      ? formatPercent(
                          bestPerformer.unrealized_plpc
                        )
                      : "No positions"
                  }
                  type="mint"
                />


                <PortfolioInsight
                  icon={TrendingDown}
                  label="Weakest position"
                  value={
                    weakestPosition?.symbol ||
                    "—"
                  }
                  description={
                    weakestPosition
                      ? formatPercent(
                          weakestPosition.unrealized_plpc
                        )
                      : "No positions"
                  }
                  type="peach"
                />


                <PortfolioInsight
                  icon={ShieldCheck}
                  label="Risk status"
                  value={riskStatus.label}
                  description={
                    riskStatus.description
                  }
                  type="violet"
                />


                <PortfolioInsight
                  icon={CircleDollarSign}
                  label="Cash reserve"
                  value={formatCompactCurrency(
                    cash,
                    currency
                  )}
                  description={`${cashPercentage.toFixed(
                    1
                  )}% available`}
                  type="purple"
                />

              </div>


              <div className="mx-6 mb-6 rounded-2xl border border-[#eee8f6] bg-[#faf8ff] p-5">

                <div className="flex items-start gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white">

                    <Activity
                      size={15}
                      className="text-[#7859f4]"
                    />

                  </div>

                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#918a96]">
                      Account status
                    </p>

                    <p className="mt-1 text-xs font-semibold text-[#332d3c]">

                      {portfolio?.account_status ||
                        "Account connected"}

                    </p>

                    <p className="mt-1 text-[9px] leading-5 text-[#918a96]">

                      {positionCount === 0
                        ? "Your Alpaca account currently has no active positions."
                        : `Your account currently has ${positionCount} active position${
                            positionCount === 1
                              ? ""
                              : "s"
                          } with ${formatCompactCurrency(
                            marketValue,
                            currency
                          )} in market exposure.`}

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </section>


          {/* ==================================================
              POSITIONS
          =================================================== */}

          <section className="mb-6 overflow-hidden rounded-[26px] border border-[#e7e2db] bg-white shadow-[0_20px_60px_rgba(45,35,70,0.05)]">

            <div className="flex flex-col justify-between gap-4 border-b border-[#eeeae5] px-6 py-5 sm:flex-row sm:items-center">

              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1edff]">

                  <Layers3
                    size={16}
                    className="text-[#7859f4]"
                  />

                </div>

                <div>

                  <h2 className="text-sm font-semibold text-[#211e28]">
                    Active positions
                  </h2>

                  <p className="mt-1 text-[9px] uppercase tracking-wider text-[#97909b]">
                    Live Alpaca holdings
                  </p>

                </div>

              </div>


              <div className="flex items-center gap-2 rounded-xl border border-[#e8e4de] bg-[#faf9f7] px-3 py-2">

                <Clock3
                  size={12}
                  className="text-[#8d8791]"
                />

                <span className="text-[8px] font-bold uppercase tracking-wider text-[#817b85]">
                  {positionCount} position
                  {positionCount === 1
                    ? ""
                    : "s"}
                </span>

              </div>

            </div>


            {positions.length === 0 ? (

              <div className="px-6 py-20 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4f1f8]">

                  <Layers3
                    size={20}
                    className="text-[#958d9f]"
                  />

                </div>

                <h3 className="mt-5 text-sm font-semibold text-[#332d3c]">
                  No active positions
                </h3>

                <p className="mx-auto mt-2 max-w-md text-[10px] leading-5 text-[#99919e]">
                  Your Alpaca account currently has
                  no open positions.
                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

                  <thead>

                    <tr className="border-b border-[#eeeae5] text-left">

                      <th className="px-6 py-4 text-[8px] font-bold uppercase tracking-[0.15em] text-[#9b949f]">
                        Asset
                      </th>

                      <th className="px-6 py-4 text-[8px] font-bold uppercase tracking-[0.15em] text-[#9b949f]">
                        Quantity
                      </th>

                      <th className="px-6 py-4 text-[8px] font-bold uppercase tracking-[0.15em] text-[#9b949f]">
                        Price
                      </th>

                      <th className="px-6 py-4 text-[8px] font-bold uppercase tracking-[0.15em] text-[#9b949f]">
                        Avg. entry
                      </th>

                      <th className="px-6 py-4 text-[8px] font-bold uppercase tracking-[0.15em] text-[#9b949f]">
                        Market value
                      </th>

                      <th className="px-6 py-4 text-[8px] font-bold uppercase tracking-[0.15em] text-[#9b949f]">
                        P/L
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {positions.map((position) => (

                      <PositionRow
                        key={`${position.symbol}-${position.side}`}
                        position={position}
                        currency={currency}
                      />

                    ))}

                  </tbody>

                </table>

              </div>

            )}


            <div className="flex flex-col gap-3 border-t border-[#eeeae5] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-2">

                <CircleCheck
                  size={12}
                  className="text-[#35b984]"
                />

                <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#aaa3ad]">

                  Live Alpaca account data

                </span>

              </div>


              {portfolio?.timestamp && (

                <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#aaa3ad]">

                  Updated{" "}
                  {new Date(
                    portfolio.timestamp
                  ).toLocaleTimeString()}

                </span>

              )}

            </div>

          </section>


          {/* ==================================================
              BOTTOM METRICS
          =================================================== */}

          <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <BottomStat
              icon={TrendingUp}
              label="Best performer"
              value={
                bestPerformer?.symbol ||
                "—"
              }
              description={
                bestPerformer
                  ? formatPercent(
                      bestPerformer.unrealized_plpc
                    )
                  : "No positions"
              }
              accent="mint"
            />


            <BottomStat
              icon={TrendingDown}
              label="Weakest position"
              value={
                weakestPosition?.symbol ||
                "—"
              }
              description={
                weakestPosition
                  ? formatPercent(
                      weakestPosition.unrealized_plpc
                    )
                  : "No positions"
              }
              accent="peach"
            />


            <BottomStat
              icon={ShieldCheck}
              label="Account status"
              value={
                portfolio?.account_status ||
                "Unknown"
              }
              description={
                portfolio?.paper_trading
                  ? "Paper trading"
                  : "Live trading"
              }
              accent="violet"
            />


            <BottomStat
              icon={CircleDollarSign}
              label="Buying power"
              value={formatCompactCurrency(
                buyingPower,
                currency
              )}
              description="Available"
              accent="purple"
            />

          </section>


          {/* ==================================================
              FOOTER
          =================================================== */}

          <div className="flex flex-col gap-3 border-t border-[#e7e2db] pt-5 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#aaa3ad] sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <span className="flex items-center gap-2 text-[#756d80]">

                <span className="h-1.5 w-1.5 rounded-full bg-[#35c98b]" />

                Trade Pilot AI

              </span>

              <span>
                Portfolio intelligence
              </span>

            </div>


            <span>
              {portfolio?.paper_trading
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
    styles[accent] || styles.violet;

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

        <CircleCheck
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

      <p className="mt-1 text-xs font-semibold text-[#423c48]">
        {value}
      </p>

    </div>

  );
}


/* ============================================================
   ALLOCATION ROW
============================================================ */

function AllocationRow({
  name,
  value,
  percentage,
  type,
}) {

  const styles = {

    violet: {
      dot: "bg-[#8569f7]",
      bar: "bg-[#8062ff]",
    },

    mint: {
      dot: "bg-[#35c98b]",
      bar: "bg-[#65d5a6]",
    },

  };

  const style =
    styles[type] || styles.violet;

  return (

    <div className="group">

      <div className="mb-2 flex items-center justify-between">

        <div className="flex items-center gap-2">

          <span
            className={`h-2 w-2 rounded-full ${style.dot}`}
          />

          <span className="text-[9px] font-semibold text-[#625b68]">
            {name}
          </span>

        </div>

        <div className="flex items-center gap-3">

          <span className="font-mono text-[9px] text-[#97909b]">
            {value}
          </span>

          <span className="font-mono text-[9px] font-bold text-[#4b4453]">
            {Number(percentage).toFixed(1)}%
          </span>

        </div>

      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-[#f0ede9]">

        <div
          className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
          style={{
            width: `${Math.min(
              100,
              Math.max(
                0,
                Number(percentage) || 0
              )
            )}%`,
          }}
        />

      </div>

    </div>

  );
}


/* ============================================================
   PORTFOLIO INSIGHT
============================================================ */

function PortfolioInsight({
  icon: Icon,
  label,
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

    purple: {
      bg: "bg-[#f5efff]",
      icon: "bg-white text-[#9a63df]",
      value: "text-[#8b55d5]",
    },

  };

  const style =
    styles[type] || styles.violet;

  return (

    <div
      className={`rounded-2xl border border-white/70 p-4 ${style.bg}`}
    >

      <div className="flex items-center justify-between">

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${style.icon}`}
        >

          <Icon size={15} />

        </div>

        <span className="text-[8px] font-bold uppercase tracking-wider text-[#aaa3ad]">
          Signal
        </span>

      </div>

      <p className="mt-4 text-[8px] font-bold uppercase tracking-[0.16em] text-[#958d99]">
        {label}
      </p>

      <div className="mt-1 flex items-baseline gap-2">

        <span
          className={`truncate text-lg font-semibold tracking-[-0.03em] ${style.value}`}
        >
          {value}
        </span>

        <span className="truncate text-[8px] font-semibold uppercase tracking-wider text-[#aaa3ad]">
          {description}
        </span>

      </div>

    </div>

  );
}


/* ============================================================
   POSITION ROW
============================================================ */

function PositionRow({
  position,
  currency,
}) {

  const positive =
    getPositionPositive(position);

  return (

    <tr className="group border-b border-[#f0ece8] transition hover:bg-[#faf8ff]">

      <td className="px-6 py-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3efff] text-[9px] font-bold text-[#7859f4] transition group-hover:scale-105">

            {position.symbol?.slice(
              0,
              2
            )}

          </div>

          <div>

            <p className="text-xs font-semibold text-[#2a2630]">
              {getPositionName(
                position.symbol
              )}
            </p>

            <p className="mt-1 text-[8px] uppercase text-[#aaa3ad]">
              {position.side || "position"}
            </p>

          </div>

        </div>

      </td>


      <td className="px-6 py-5 font-mono text-xs text-[#6e6874]">
        {formatNumber(
          position.quantity
        )}
      </td>


      <td className="px-6 py-5 font-mono text-xs font-semibold text-[#37313f]">
        {formatCurrency(
          position.current_price,
          currency
        )}
      </td>


      <td className="px-6 py-5 font-mono text-xs text-[#6e6874]">
        {formatCurrency(
          position.avg_entry_price,
          currency
        )}
      </td>


      <td className="px-6 py-5 font-mono text-xs font-semibold text-[#37313f]">
        {formatCurrency(
          position.market_value,
          currency
        )}
      </td>


      <td className="px-6 py-5">

        <div
          className={[
            "flex items-center gap-1.5 text-xs font-semibold",
            positive
              ? "text-[#26966b]"
              : "text-[#d35d4e]",
          ].join(" ")}
        >

          {positive ? (
            <ArrowUpRight size={13} />
          ) : (
            <ArrowDownRight size={13} />
          )}

          {formatCurrency(
            position.unrealized_pl,
            currency
          )}

        </div>


        <p
          className={[
            "mt-1 font-mono text-[8px]",
            positive
              ? "text-[#26966b]/70"
              : "text-[#d35d4e]/70",
          ].join(" ")}
        >
          {formatPercent(
            position.unrealized_plpc
          )}
        </p>

      </td>

    </tr>

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
      "bg-[#f1edff] text-[#7859f4]",

    mint:
      "bg-[#edfff7] text-[#26966b]",

    peach:
      "bg-[#fff1eb] text-[#d76a56]",

    purple:
      "bg-[#f4edff] text-[#9a63df]",

  };

  return (

    <div className="group rounded-[20px] border border-[#e7e2db] bg-white p-5 shadow-[0_12px_35px_rgba(45,35,70,0.035)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(45,35,70,0.06)]">

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