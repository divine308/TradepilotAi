import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
  Zap,
} from "lucide-react";

import { register } from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const data = await register(
        name.trim(),
        email.trim(),
        password
      );

      if (!data?.access_token) {
        throw new Error("No authentication token received.");
      }

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Registration error:", error);

      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Unable to create your account.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#F7F4EE] text-[#29213D]">

      {/* ============================================================
          ANIMATIONS
      ============================================================ */}

      <style>{`
        @keyframes registerReveal {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            opacity: .35;
            transform: scale(1);
          }

          50% {
            opacity: .65;
            transform: scale(1.08);
          }
        }

        .register-reveal {
          animation: registerReveal .7s cubic-bezier(.2,.8,.2,1) both;
        }

        .register-delay-1 {
          animation-delay: .12s;
        }

        .register-delay-2 {
          animation-delay: .22s;
        }

        .register-delay-3 {
          animation-delay: .32s;
        }
      `}</style>

      {/* ============================================================
          BACKGROUND
      ============================================================ */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        {/* Violet glow */}

        <div className="absolute -left-40 top-10 h-[520px] w-[520px] rounded-full bg-violet-300/20 blur-[130px]" />

        {/* Orange glow */}

        <div className="absolute -right-40 top-[30%] h-[550px] w-[550px] rounded-full bg-orange-200/25 blur-[140px]" />

        {/* Fuchsia glow */}

        <div className="absolute bottom-[-200px] left-[35%] h-[500px] w-[500px] rounded-full bg-fuchsia-200/20 blur-[130px]" />

        {/* Grid */}

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(41,33,61,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(41,33,61,.7) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* ============================================================
          NAVIGATION
      ============================================================ */}

      <header className="relative z-50 border-b border-[#29213D]/[0.07] bg-[#F7F4EE]/80 backdrop-blur-xl">

        <div className="mx-auto flex h-[78px] max-w-[1380px] items-center justify-between px-5 sm:px-8">

          {/* LOGO */}

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

          {/* BACK */}

          <Link
            to="/"
            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[#29213D]/40 transition hover:text-violet-600"
          >

            <ArrowLeft
              size={13}
              className="transition group-hover:-translate-x-1"
            />

            Back to platform

          </Link>

        </div>

      </header>

      {/* ============================================================
          MAIN
      ============================================================ */}

      <main className="relative z-10">

        <section className="mx-auto flex min-h-[calc(100vh-78px)] max-w-[1380px] items-center px-5 py-16 sm:px-8 lg:py-20">

          <div className="grid w-full items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">

            {/* ======================================================
                LEFT SIDE
            ======================================================= */}

            <div className="register-reveal hidden lg:block">

              {/* Label */}

              <div className="mb-7 flex items-center gap-3">

                <span className="h-[2px] w-8 rounded-full bg-violet-500" />

                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-600">
                  New AI trading account
                </span>

              </div>

              {/* Heading */}

              <h1 className="max-w-xl text-[58px] font-black leading-[0.92] tracking-[-0.065em] text-[#29213D] xl:text-[70px]">

                Build your

                <span className="block bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
                  trading system.
                </span>

              </h1>

              {/* Description */}

              <p className="mt-7 max-w-lg text-[15px] leading-7 text-[#29213D]/55">

                Create your Trade Pilot trading system and bring
                market intelligence, AI agents and portfolio
                monitoring into one intelligent environment.

              </p>

              {/* Features */}

              <div className="mt-10 space-y-3">

                {[
                  {
                    icon: BrainCircuit,
                    title: "AI market intelligence",
                    description:
                      "Research markets with an intelligent analysis layer.",
                  },
                  {
                    icon: Zap,
                    title: "Autonomous agents",
                    description:
                      "Let specialized agents reason through opportunities.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Controlled environment",
                    description:
                      "Start safely inside a paper trading environment.",
                  },
                ].map((item, index) => {

                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="group flex max-w-md items-center gap-4 rounded-2xl border border-[#29213D]/[0.06] bg-white/60 p-4 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:bg-white"
                    >

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1EEFF] transition group-hover:bg-violet-100">

                        <Icon
                          size={16}
                          className="text-violet-600"
                        />

                      </div>

                      <div>

                        <p className="text-[11px] font-bold text-[#29213D]">
                          {item.title}
                        </p>

                        <p className="mt-1 text-[9px] leading-5 text-[#29213D]/40">
                          {item.description}
                        </p>

                      </div>

                      <span className="ml-auto self-start font-mono text-[8px] font-bold text-[#29213D]/20">
                        0{index + 1}
                      </span>

                    </div>
                  );
                })}

              </div>

              {/* Paper trading status */}

              <div className="mt-8 flex items-center gap-3">

                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50">

                  <ShieldCheck
                    size={14}
                    className="text-emerald-600"
                  />

                </div>

                <div>

                  <p className="text-[8px] font-bold uppercase tracking-[0.17em] text-[#29213D]/30">
                    Environment
                  </p>

                  <div className="mt-1 flex items-center gap-2">

                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                      Paper trading enabled
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* ======================================================
                REGISTER AREA
            ======================================================= */}

            <div className="register-reveal register-delay-1 w-full">

              {/* Mobile brand */}

              <div className="mb-8 lg:hidden">

                <Link
                  to="/"
                  className="group inline-flex items-center gap-3"
                >

                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#29213D] shadow-lg">

                    <div className="h-3 w-3 rotate-45 rounded-[3px] bg-violet-400" />

                    <span className="absolute right-[7px] top-[7px] h-1.5 w-1.5 rounded-full bg-orange-300" />

                  </div>

                  <div>

                    <div className="text-[13px] font-black text-[#29213D]">
                      TRADE PILOT
                    </div>

                    <div className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#29213D]/40">
                      Intelligence infrastructure
                    </div>

                  </div>

                </Link>

              </div>

              {/* ====================================================
                  REGISTER CARD
              ===================================================== */}

              <div className="mx-auto w-full max-w-[570px] rounded-[30px] border border-white/80 bg-white/85 p-2 shadow-[0_35px_100px_rgba(48,35,78,.14)] backdrop-blur-xl">

                <div className="overflow-hidden rounded-[24px] border border-[#29213D]/[0.06] bg-white">

                  {/* Top bar */}

                  <div className="flex h-12 items-center justify-between border-b border-[#29213D]/[0.07] px-5">

                    <div className="flex items-center gap-3">

                      <div className="flex gap-1.5">

                        <span className="h-1.5 w-1.5 rounded-full bg-[#29213D]/15" />

                        <span className="h-1.5 w-1.5 rounded-full bg-[#29213D]/15" />

                        <span className="h-1.5 w-1.5 rounded-full bg-[#29213D]/15" />

                      </div>

                      <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#29213D]/30">
                        registration
                      </span>

                    </div>

                    <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-wider text-emerald-600">

                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

                      Secure

                    </div>

                  </div>

                  {/* Form content */}

                  <div className="p-6 sm:p-9">

                    {/* Header */}

                    <div className="register-reveal register-delay-1 mb-8">

                      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1EEFF]">

                        <BrainCircuit
                          size={18}
                          className="text-violet-600"
                        />

                      </div>

                      <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-violet-600">
                        Create AI trading account
                      </p>

                      <h2 className="text-3xl font-black tracking-[-0.055em] text-[#29213D] sm:text-4xl">
                        Start building.
                      </h2>

                      <p className="mt-3 max-w-md text-xs leading-6 text-[#29213D]/45">
                        Create your account and enter the Trade Pilot
                        intelligence environment.
                      </p>

                    </div>

                    {/* Error */}

                    {error && (

                      <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">

                        <div className="flex items-start gap-3">

                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />

                          <p className="text-[10px] leading-5 text-rose-600">
                            {error}
                          </p>

                        </div>

                      </div>

                    )}

                    {/* ==================================================
                        FORM
                    =================================================== */}

                    <form
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >

                      {/* Name */}

                      <div>

                        <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.16em] text-[#29213D]/35">
                          Full name
                        </label>

                        <div className="relative">

                          <UserRound
                            size={14}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#29213D]/25"
                          />

                          <input
                            type="text"
                            value={name}
                            onChange={(event) =>
                              setName(event.target.value)
                            }
                            placeholder="Divine Ton"
                            autoComplete="name"
                            required
                            className="w-full rounded-xl border border-[#29213D]/[0.09] bg-[#F8F7FA] py-3.5 pl-11 pr-4 text-xs font-medium text-[#29213D] outline-none transition placeholder:text-[#29213D]/20 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-500/[0.06]"
                          />

                        </div>

                      </div>

                      {/* Email */}

                      <div>

                        <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.16em] text-[#29213D]/35">
                          Email address
                        </label>

                        <div className="relative">

                          <Mail
                            size={14}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#29213D]/25"
                          />

                          <input
                            type="email"
                            value={email}
                            onChange={(event) =>
                              setEmail(event.target.value)
                            }
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                            className="w-full rounded-xl border border-[#29213D]/[0.09] bg-[#F8F7FA] py-3.5 pl-11 pr-4 text-xs font-medium text-[#29213D] outline-none transition placeholder:text-[#29213D]/20 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-500/[0.06]"
                          />

                        </div>

                      </div>

                      {/* Password */}

                      <div>

                        <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.16em] text-[#29213D]/35">
                          Password
                        </label>

                        <div className="relative">

                          <LockKeyhole
                            size={14}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#29213D]/25"
                          />

                          <input
                            type={
                              showPassword
                                ? "text"
                                : "password"
                            }
                            value={password}
                            onChange={(event) =>
                              setPassword(event.target.value)
                            }
                            placeholder="Create a strong password"
                            autoComplete="new-password"
                            minLength={8}
                            required
                            className="w-full rounded-xl border border-[#29213D]/[0.09] bg-[#F8F7FA] py-3.5 pl-11 pr-12 text-xs font-medium text-[#29213D] outline-none transition placeholder:text-[#29213D]/20 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-500/[0.06]"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword(
                                (current) => !current
                              )
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#29213D]/25 transition hover:bg-violet-50 hover:text-violet-600"
                            aria-label={
                              showPassword
                                ? "Hide password"
                                : "Show password"
                            }
                          >

                            {showPassword ? (
                              <EyeOff size={14} />
                            ) : (
                              <Eye size={14} />
                            )}

                          </button>

                        </div>

                        {/* Requirement */}

                        <div className="mt-3 flex items-center gap-2">

                          <div
                            className={[
                              "flex h-4 w-4 items-center justify-center rounded-full transition",
                              password.length >= 8
                                ? "bg-emerald-50"
                                : "bg-[#F4F2F6]",
                            ].join(" ")}
                          >

                            <Check
                              size={10}
                              className={
                                password.length >= 8
                                  ? "text-emerald-600"
                                  : "text-[#29213D]/15"
                              }
                            />

                          </div>

                          <span
                            className={[
                              "text-[9px] font-medium transition",
                              password.length >= 8
                                ? "text-emerald-600"
                                : "text-[#29213D]/30",
                            ].join(" ")}
                          >
                            Minimum 8 characters
                          </span>

                        </div>

                      </div>

                      {/* Submit */}

                      <button
                        type="submit"
                        disabled={loading}
                        className="group flex w-full items-center justify-center gap-3 rounded-xl bg-violet-600 py-3.5 text-xs font-bold text-white shadow-xl shadow-violet-500/20 transition duration-300 hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                      >

                        {loading ? (

                          <>

                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                            Initializing AI trade system...

                          </>

                        ) : (

                          <>

                            Create AI trading account

                            <ArrowRight
                              size={14}
                              className="transition group-hover:translate-x-1"
                            />

                          </>

                        )}

                      </button>

                    </form>

                    {/* ==================================================
                        LOGIN
                    =================================================== */}

                    <div className="mt-7 border-t border-[#29213D]/[0.07] pt-6">

                      <p className="text-center text-[10px] text-[#29213D]/35">

                        Already have an account?{" "}

                        <Link
                          to="/login"
                          className="font-bold text-violet-600 transition hover:text-violet-700"
                        >
                          Sign in
                        </Link>

                      </p>

                    </div>

                  </div>

                  {/* ==================================================
                      CARD FOOTER
                  =================================================== */}

                  <div className="flex items-center justify-between border-t border-[#29213D]/[0.07] bg-[#FAF9FC] px-5 py-3">

                    <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#29213D]/20">
                      PAPER ENVIRONMENT
                    </span>

                    <span className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-wider text-emerald-600">

                      <span className="h-1 w-1 rounded-full bg-emerald-500" />

                      READY

                    </span>

                  </div>

                </div>

              </div>

              {/* Disclaimer */}

              <p className="mx-auto mt-5 max-w-[500px] text-center text-[8px] font-medium leading-5 text-[#29213D]/25">

                Trade Pilot AI currently operates in a paper trading
                environment for testing and development.

              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

