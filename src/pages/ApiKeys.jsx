import {
  Activity,
  AlertTriangle,
  Check,
  ChevronRight,
  CircleCheck,
  Clock3,
  Code2,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trash2,
  Zap,
} from "lucide-react";

import { useState } from "react";

import AppLayout from "../components/AppLayout";

/* ============================================================
   MOCK API KEYS
============================================================ */

const initialKeys = [
  {
    id: 1,
    name: "Development",
    key: "tp_test_7f3a••••••••••••91c2",
    created: "Aug 24, 2026",
    lastUsed: "2 minutes ago",
    status: "ACTIVE",
    environment: "TEST",
  },
  {
    id: 2,
    name: "Production",
    key: "tp_live_29ad••••••••••••8f42",
    created: "Aug 18, 2026",
    lastUsed: "1 hour ago",
    status: "ACTIVE",
    environment: "LIVE",
  },
];

/* ============================================================
   PAGE
============================================================ */

export default function ApiKeys() {
  const [keys, setKeys] = useState(initialKeys);
  const [showKey, setShowKey] = useState(null);
  const [copied, setCopied] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  /* ==========================================================
     COPY
  ========================================================== */

  const copyKey = async (key) => {
    try {
      await navigator.clipboard.writeText(key.key);
    } catch (error) {
      console.error("Copy failed:", error);
    }

    setCopied(key.id);

    setTimeout(() => {
      setCopied(null);
    }, 1800);
  };

  /* ==========================================================
     REVOKE
  ========================================================== */

  const revokeKey = (id) => {
    setKeys((current) =>
      current.map((key) =>
        key.id === id
          ? {
              ...key,
              status: "REVOKED",
            }
          : key
      )
    );
  };

  /* ==========================================================
     REFRESH
  ========================================================== */

  const refreshKeys = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 700);
  };

  return (
    <AppLayout>
      <div className="relative min-h-screen overflow-hidden bg-[#f7f6f2] text-[#17151f]">
        {/* ======================================================
            AMBIENT BACKGROUND
        ======================================================= */}

        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-40 top-20 h-[460px] w-[460px] rounded-full bg-[#c7b7ff]/20 blur-[130px]" />

          <div className="absolute right-[-120px] top-[260px] h-[450px] w-[450px] rounded-full bg-[#a8f3d0]/20 blur-[140px]" />

          <div className="absolute bottom-[-220px] left-[40%] h-[450px] w-[520px] rounded-full bg-[#ffd8c8]/20 blur-[150px]" />
        </div>

        {/* ======================================================
            PAGE CONTENT
        ======================================================= */}

        <main className="relative mx-auto w-full max-w-[1700px] px-4 py-6 sm:px-6 sm:py-7 lg:px-10">
          {/* ====================================================
              HEADER
          ==================================================== */}

          <section className="mb-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              {/* TITLE */}

              <div>
                <div className="mb-4 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#17151f] text-white shadow-sm">
                    <Code2 size={13} />
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7b7487]">
                    Developer infrastructure
                  </span>
                </div>

                <h1 className="text-4xl font-semibold tracking-[-0.055em] text-[#17151f] sm:text-5xl">
                  API{" "}
                  <span className="text-[#7f5cff]">
                    Access.
                  </span>
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#77717f]">
                  Secure credentials for connecting your applications,
                  trading systems and AI agents to Trade Pilot.
                </p>
              </div>

              {/* ACTIONS */}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={refreshKeys}
                  className="group flex items-center gap-2 rounded-xl border border-[#e7e3dc] bg-white px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#696270] shadow-[0_8px_25px_rgba(40,30,60,0.04)] transition hover:-translate-y-0.5 hover:border-[#d7d0e8] hover:text-[#17151f]"
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

                <button
                  type="button"
                  className="group flex items-center gap-2 rounded-xl bg-[#17151f] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_12px_25px_rgba(23,21,31,0.12)] transition hover:-translate-y-0.5 hover:bg-[#262231]"
                >
                  <Plus
                    size={13}
                    className="text-[#b9a6ff]"
                  />

                  Create API key

                  <ChevronRight
                    size={12}
                    className="transition group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </div>
          </section>

          {/* ====================================================
              SECURITY STATUS
          ==================================================== */}

          <section className="mb-6 rounded-[24px] border border-[#dfeee7] bg-[#effcf6] p-5 shadow-[0_12px_35px_rgba(45,35,70,0.025)]">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <ShieldCheck
                    size={18}
                    className="text-[#26966b]"
                  />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-semibold text-[#302b37]">
                      API security
                    </h2>

                    <span className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[7px] font-bold uppercase tracking-wider text-[#26966b]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#35c98b]" />
                      Protected
                    </span>
                  </div>

                  <p className="mt-1 max-w-2xl text-[9px] leading-5 text-[#8b958f]">
                    Keep secret credentials private. Never expose API keys
                    in client-side applications, repositories or public
                    environments.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-[#dcefe6] bg-white px-4 py-2.5">
                <CircleCheck
                  size={13}
                  className="text-[#35b984]"
                />

                <span className="text-[9px] font-bold uppercase tracking-wider text-[#4b806b]">
                  Workspace secure
                </span>
              </div>
            </div>
          </section>

          {/* ====================================================
              OVERVIEW
          ==================================================== */}

          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ApiOverviewCard
              icon={KeyRound}
              label="API credentials"
              value={keys.length}
              description="Configured"
              accent="violet"
            />

            <ApiOverviewCard
              icon={Activity}
              label="API requests"
              value="18.4K"
              description="This month"
              accent="mint"
            />

            <ApiOverviewCard
              icon={Zap}
              label="Success rate"
              value="99.8%"
              description="Requests"
              accent="peach"
            />

            <ApiOverviewCard
              icon={Clock3}
              label="Avg. latency"
              value="142ms"
              description="Response time"
              accent="purple"
            />
          </section>

          {/* ====================================================
              API CREDENTIALS
          ==================================================== */}

          <section className="mb-6 overflow-hidden rounded-[26px] border border-[#e7e2db] bg-white shadow-[0_20px_60px_rgba(45,35,70,0.05)]">
            {/* HEADER */}

            <div className="flex flex-col justify-between gap-4 border-b border-[#eeeae5] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1edff]">
                  <KeyRound
                    size={16}
                    className="text-[#7859f4]"
                  />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-[#211e28]">
                    API credentials
                  </h2>

                  <p className="mt-1 text-[9px] uppercase tracking-wider text-[#97909b]">
                    Manage authentication keys for your workspace
                  </p>
                </div>
              </div>

              <div className="flex w-fit items-center gap-2 rounded-xl border border-[#e8e4de] bg-[#faf9f7] px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#35c98b]" />

                <span className="text-[8px] font-bold uppercase tracking-wider text-[#817b85]">
                  {keys.filter((key) => key.status === "ACTIVE").length} active
                </span>
              </div>
            </div>

            {/* DESKTOP TABLE HEADER */}

            <div className="hidden grid-cols-[1.2fr_1.5fr_0.75fr_0.8fr_0.45fr] border-b border-[#eeeae5] px-6 py-4 md:grid">
              <TableHeading>Credential</TableHeading>

              <TableHeading>API key</TableHeading>

              <TableHeading>Environment</TableHeading>

              <TableHeading>Last used</TableHeading>

              <span />
            </div>

            {/* KEYS */}

            {keys.map((key) => {
              const revoked = key.status === "REVOKED";

              return (
                <div
                  key={key.id}
                  className={[
                    "group grid gap-5 border-b border-[#f0ece8] px-5 py-6 transition last:border-0 sm:px-6",
                    "hover:bg-[#fcfaff]",
                    "md:grid-cols-[1.2fr_1.5fr_0.75fr_0.8fr_0.45fr] md:items-center",
                    revoked ? "opacity-60" : "",
                  ].join(" ")}
                >
                  {/* CREDENTIAL */}

                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f5f1ff] transition group-hover:scale-105">
                      <KeyRound
                        size={16}
                        className="text-[#7859f4]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-[#2a2630]">
                          {key.name}
                        </p>

                        {key.environment === "LIVE" && (
                          <span className="rounded-full bg-[#fff1eb] px-2 py-1 text-[6px] font-bold uppercase tracking-wider text-[#d76a56]">
                            Live
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-[8px] text-[#aaa3ad]">
                        Created {key.created}
                      </p>
                    </div>
                  </div>

                  {/* API KEY */}

                  <div className="flex min-w-0 items-center gap-2">
                    <div className="min-w-0 flex-1 rounded-xl border border-[#eeeae5] bg-[#faf9f7] px-3 py-2.5">
                      <code className="block truncate font-mono text-[9px] text-[#68616e]">
                        {showKey === key.id
                          ? key.key.replace(
                              "••••••••••••",
                              "91c2f7a81d42"
                            )
                          : key.key}
                      </code>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setShowKey(
                          showKey === key.id ? null : key.id
                        )
                      }
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#aaa3ad] transition hover:bg-[#f1edff] hover:text-[#7859f4]"
                      title={
                        showKey === key.id
                          ? "Hide key"
                          : "Show key"
                      }
                    >
                      {showKey === key.id ? (
                        <EyeOff size={13} />
                      ) : (
                        <Eye size={13} />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => copyKey(key)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#aaa3ad] transition hover:bg-[#edfff7] hover:text-[#26966b]"
                      title="Copy key"
                    >
                      {copied === key.id ? (
                        <Check
                          size={13}
                          className="text-[#26966b]"
                        />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </div>

                  {/* ENVIRONMENT */}

                  <div>
                    <EnvironmentBadge
                      environment={key.environment}
                    />
                  </div>

                  {/* LAST USED */}

                  <div className="flex items-center gap-2">
                    <Clock3
                      size={12}
                      className="text-[#aaa3ad]"
                    />

                    <span className="text-[9px] text-[#817b85]">
                      {key.lastUsed}
                    </span>
                  </div>

                  {/* ACTION */}

                  <div className="flex justify-start md:justify-end">
                    {!revoked ? (
                      <button
                        type="button"
                        onClick={() => revokeKey(key.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#aaa3ad] transition hover:bg-[#fff0ed] hover:text-[#d35d4e]"
                        title="Revoke key"
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : (
                      <span className="rounded-full bg-[#fff0ed] px-2.5 py-1.5 text-[7px] font-bold uppercase tracking-wider text-[#d35d4e]">
                        Revoked
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </section>

          {/* ====================================================
              API INTELLIGENCE + QUICK START
          ==================================================== */}

          <section className="mb-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            {/* ACTIVITY */}

            <div className="overflow-hidden rounded-[26px] border border-[#e7e2db] bg-white shadow-[0_20px_60px_rgba(45,35,70,0.05)]">
              <div className="border-b border-[#eeeae5] px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edfff7]">
                    <Activity
                      size={16}
                      className="text-[#26966b]"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#211e28]">
                      API activity
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-wider text-[#97909b]">
                      Workspace request health
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="mb-6 flex items-end justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#97909b]">
                      Requests
                    </p>

                    <p className="mt-1 font-mono text-3xl font-semibold tracking-[-0.05em] text-[#292430]">
                      18,421
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-lg bg-[#edfff7] px-3 py-2 text-[9px] font-bold text-[#26966b]">
                    <ArrowTrend />
                    99.8%
                  </div>
                </div>

                {/* ACTIVITY GRAPH */}

                <div className="relative h-[150px] overflow-hidden rounded-2xl border border-[#eeeae5] bg-[#faf9f7] p-4">
                  <div className="absolute inset-x-4 top-8 border-t border-dashed border-[#e8e3dd]" />

                  <div className="absolute inset-x-4 top-1/2 border-t border-dashed border-[#e8e3dd]" />

                  <div className="absolute inset-x-4 bottom-8 border-t border-dashed border-[#e8e3dd]" />

                  <svg
                    viewBox="0 0 700 150"
                    className="relative h-full w-full"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="apiActivity"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#8a6cff"
                          stopOpacity="0.20"
                        />

                        <stop
                          offset="100%"
                          stopColor="#8a6cff"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    <path
                      d="
                        M0 112
                        C45 105 70 92 110 99
                        C150 106 175 75 215 84
                        C255 93 285 60 325 69
                        C365 78 390 55 430 62
                        C470 69 500 42 540 50
                        C580 58 615 30 650 39
                        C670 44 685 30 700 25
                        L700 150
                        L0 150
                        Z
                      "
                      fill="url(#apiActivity)"
                    />

                    <path
                      d="
                        M0 112
                        C45 105 70 92 110 99
                        C150 106 175 75 215 84
                        C255 93 285 60 325 69
                        C365 78 390 55 430 62
                        C470 69 500 42 540 50
                        C580 58 615 30 650 39
                        C670 44 685 30 700 25
                      "
                      fill="none"
                      stroke="#8062ff"
                      strokeWidth="3"
                    />
                  </svg>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <ActivityMetric
                    label="Success"
                    value="99.8%"
                    positive
                  />

                  <ActivityMetric
                    label="Errors"
                    value="0.2%"
                  />

                  <ActivityMetric
                    label="Latency"
                    value="142ms"
                  />
                </div>
              </div>
            </div>

            {/* QUICK START */}

            <div className="relative overflow-hidden rounded-[26px] border border-[#e6e0f2] bg-[#f7f4ff]">
              <div className="pointer-events-none absolute right-[-100px] top-[-120px] h-[340px] w-[340px] rounded-full bg-[#b9a5ff]/20 blur-[90px]" />

              <div className="relative border-b border-[#e7e0f0] px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                    <Terminal
                      size={16}
                      className="text-[#7859f4]"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#25202f]">
                      Quick start
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-wider text-[#958da2]">
                      Connect your application
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="rounded-md bg-white px-2 py-1 font-mono text-[7px] font-bold text-[#7859f4] shadow-sm">
                    POST
                  </span>

                  <span className="font-mono text-[9px] text-[#625a6d]">
                    /api/trading/analyze
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[#e3ddef] bg-white p-5 font-mono text-[9px] leading-7 shadow-sm">
                  <div>
                    <span className="text-[#7859f4]">
                      POST
                    </span>

                    <span className="text-[#77717f]">
                      {" "}
                      /api/trading/analyze
                    </span>
                  </div>

                  <div className="mt-2 text-[#8d8694]">
                    Authorization:

                    <span className="text-[#37313f]">
                      {" "}
                      Bearer tp_test_••••••
                    </span>
                  </div>

                  <div className="mt-3 rounded-lg bg-[#faf9f7] px-3 py-2 text-[#625a6d]">
                    {"{"} "symbol": "NVDA" {"}"}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <CodeFeature
                    icon={ShieldCheck}
                    label="Secure"
                  />

                  <CodeFeature
                    icon={Zap}
                    label="Fast"
                  />

                  <CodeFeature
                    icon={Code2}
                    label="REST API"
                  />
                </div>

                <button className="group mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#17151f] py-3.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_25px_rgba(23,21,31,0.14)] transition hover:-translate-y-0.5 hover:bg-[#262231]">
                  View API documentation

                  <ChevronRight
                    size={12}
                    className="transition group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>
          </section>

          {/* ====================================================
              SECURITY / ENVIRONMENTS
          ==================================================== */}

          <section className="mb-8 grid gap-4 md:grid-cols-3">
            <InsightPanel
              icon={ShieldCheck}
              eyebrow="Security"
              title="Credentials protected"
              description="Secret keys are masked by default."
              type="violet"
            />

            <InsightPanel
              icon={Code2}
              eyebrow="Development"
              title="Test environment"
              description="Use test keys before production."
              type="mint"
            />

            <InsightPanel
              icon={AlertTriangle}
              eyebrow="Production"
              title="Review before launch"
              description="Verify execution configuration."
              type="peach"
            />
          </section>

          {/* ====================================================
              FOOTER STATUS
          ==================================================== */}

          <div className="flex flex-col gap-3 border-t border-[#e7e2db] pt-5 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#aaa3ad] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-[#756d80]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#35c98b]" />
                Trade Pilot API
              </span>

              <span>Developer infrastructure</span>
            </div>

            <span>Secure API environment</span>
          </div>
        </main>
      </div>
    </AppLayout>
  );
}

/* ============================================================
   API OVERVIEW CARD
============================================================ */

function ApiOverviewCard({
  icon: Icon,
  label,
  value,
  description,
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

  const style = styles[accent] || styles.violet;

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

      <p className="mt-1 text-xl font-semibold tracking-[-0.04em] text-[#24202b]">
        {value}
      </p>

      <div className="mt-2 flex items-center gap-1.5 text-[9px] font-medium text-[#928b96]">
        <CircleCheck
          size={11}
          className="text-[#35b984]"
        />

        {description}
      </div>
    </div>
  );
}

/* ============================================================
   TABLE HEADING
============================================================ */

function TableHeading({ children }) {
  return (
    <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#9b949f]">
      {children}
    </span>
  );
}

/* ============================================================
   ENVIRONMENT BADGE
============================================================ */

function EnvironmentBadge({ environment }) {
  const live = environment === "LIVE";

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[7px] font-bold uppercase tracking-[0.12em]",
        live
          ? "bg-[#fff1eb] text-[#d76a56]"
          : "bg-[#f3efff] text-[#7859f4]",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          live ? "bg-[#ef876e]" : "bg-[#8569f7]",
        ].join(" ")}
      />

      {environment}
    </span>
  );
}

/* ============================================================
   ACTIVITY METRIC
============================================================ */

function ActivityMetric({
  label,
  value,
  positive = false,
}) {
  return (
    <div className="rounded-xl border border-[#eeeae5] bg-[#faf9f7] p-3">
      <p className="text-[8px] font-bold uppercase tracking-wider text-[#aaa3ad]">
        {label}
      </p>

      <p
        className={[
          "mt-1 font-mono text-xs font-semibold",
          positive
            ? "text-[#26966b]"
            : "text-[#423c48]",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   CODE FEATURE
============================================================ */

function CodeFeature({
  icon: Icon,
  label,
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[#e7e0f0] bg-white/70 p-3">
      <Icon
        size={12}
        className="text-[#7859f4]"
      />

      <span className="text-[8px] font-bold uppercase tracking-wider text-[#746c80]">
        {label}
      </span>
    </div>
  );
}

/* ============================================================
   INSIGHT PANEL
============================================================ */

function InsightPanel({
  icon: Icon,
  eyebrow,
  title,
  description,
  type = "violet",
}) {
  const styles = {
    violet: {
      bg: "bg-[#f5f1ff]",
      icon: "bg-white text-[#7859f4]",
    },

    mint: {
      bg: "bg-[#effcf6]",
      icon: "bg-white text-[#26966b]",
    },

    peach: {
      bg: "bg-[#fff3ee]",
      icon: "bg-white text-[#d76a56]",
    },
  };

  const style = styles[type] || styles.violet;

  return (
    <div
      className={[
        "rounded-[22px] border border-white/60 p-5",
        style.bg,
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <div
          className={[
            "flex h-9 w-9 items-center justify-center rounded-xl",
            style.icon,
          ].join(" ")}
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

      <p className="mt-2 text-[9px] leading-5 text-[#918a95]">
        {description}
      </p>
    </div>
  );
}

/* ============================================================
   TREND ICON
============================================================ */

function ArrowTrend() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
    >
      <path
        d="M2 8L8.5 2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M5.5 2.5H8.5V5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}