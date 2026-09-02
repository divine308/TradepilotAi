import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Activity,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Cpu,
} from "lucide-react";

import {
  login,
  getApiErrorMessage,
} from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

   const handleSubmit = async (event) => {
event.preventDefault();

setError("");
setLoading(true);

try {
await login(email, password);


navigate("/dashboard", {
  replace: true,
});


} catch (error) {
console.error("Login error:", error);


setError(
  getApiErrorMessage(
    error,
    "Unable to sign in. Please check your credentials."
  )
);

} finally {
setLoading(false);
}
};

  return (
    <div className="min-h-screen overflow-hidden bg-[#F7F4EE] text-[#29213D]">
      {/* ============================================================
          GLOBAL ANIMATIONS
      ============================================================ */}

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-8px);
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

        @keyframes pulseGlow {
          0%, 100% {
            opacity: .35;
            transform: scale(1);
          }

          50% {
            opacity: .7;
            transform: scale(1.08);
          }
        }

        .login-reveal {
          animation: reveal .7s cubic-bezier(.2,.8,.2,1) both;
        }

        .login-delay-1 {
          animation-delay: .1s;
        }

        .login-delay-2 {
          animation-delay: .2s;
        }

        .login-delay-3 {
          animation-delay: .3s;
        }
      `}</style>

      {/* ============================================================
          BACKGROUND
      ============================================================ */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Violet glow */}

        <div
          className="
            absolute
            -left-[180px]
            top-[100px]
            h-[520px]
            w-[520px]
            rounded-full
            bg-violet-300/20
            blur-[120px]
          "
        />

        {/* Orange glow */}

        <div
          className="
            absolute
            -right-[180px]
            top-[320px]
            h-[560px]
            w-[560px]
            rounded-full
            bg-orange-200/25
            blur-[140px]
          "
        />

        {/* Fuchsia glow */}

        <div
          className="
            absolute
            left-[35%]
            bottom-[-220px]
            h-[500px]
            w-[500px]
            rounded-full
            bg-fuchsia-200/20
            blur-[120px]
          "
        />

        {/* Subtle grid */}

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(41,33,61,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(41,33,61,.6) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      {/* ============================================================
          HEADER
      ============================================================ */}

      <header className="relative z-50 border-b border-[#29213D]/[0.07] bg-[#F7F4EE]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[78px] max-w-[1380px] items-center justify-between px-5 sm:px-8">
          {/* LOGO */}

          <Link
            to="/"
            className="group flex items-center gap-3"
          >
            <div
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[#29213D]
                shadow-lg
                shadow-[#29213D]/10
                transition
                duration-300
                group-hover:-rotate-3
                group-hover:scale-105
              "
            >
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
            className="
              group
              flex
              items-center
              gap-2
              rounded-lg
              px-3
              py-2
              text-[10px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-[#29213D]/45
              transition
              hover:bg-white/60
              hover:text-violet-600
            "
          >
            <ArrowLeft
              size={13}
              className="transition group-hover:-translate-x-1"
            />

            <span className="hidden sm:inline">
              Back to Trade Pilot
            </span>

            <span className="sm:hidden">
              Back
            </span>
          </Link>
        </div>
      </header>

      {/* ============================================================
          MAIN
      ============================================================ */}

      <main className="relative z-10 flex min-h-[calc(100vh-78px)] items-center justify-center px-5 py-14 sm:px-8 sm:py-20">
        <div className="w-full max-w-[470px]">
          {/* ========================================================
              TOP LABEL
          ======================================================== */}

          <div className="login-reveal mb-7 flex items-center justify-center gap-3">
            <span className="h-[2px] w-8 rounded-full bg-violet-500" />

            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-600">
              Secure AI trading access
            </span>

            <span className="h-[2px] w-8 rounded-full bg-violet-500" />
          </div>

          {/* ========================================================
              LOGIN CARD
          ======================================================== */}

          <div
            className="
              login-reveal
              login-delay-1
              overflow-hidden
              rounded-[30px]
              border
              border-white/80
              bg-white/85
              shadow-[0_35px_100px_rgba(48,35,78,.14)]
              backdrop-blur-xl
            "
          >
            {/* TOP GRADIENT */}

            <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-400" />

            {/* ======================================================
                CARD HEADER
            ====================================================== */}

            <div className="border-b border-[#29213D]/[0.07] px-6 py-6 sm:px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-2xl
                      bg-[#F1EEFF]
                    "
                  >
                    <Activity
                      size={17}
                      className="text-violet-600"
                    />
                  </div>

                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.17em] text-[#29213D]/35">
                      Trading system
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#29213D]">
                      Authentication
                    </p>
                  </div>
                </div>

                {/* ONLINE */}

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    bg-emerald-50
                    px-3
                    py-1.5
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-emerald-600
                  "
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

                  Online
                </div>
              </div>
            </div>

            {/* ======================================================
                FORM
            ====================================================== */}

            <div className="p-6 sm:p-8">
              {/* INTRO */}

              <div className="login-reveal login-delay-2 mb-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50">
                  <Sparkles
                    size={19}
                    className="text-violet-600"
                  />
                </div>

                <h1 className="text-4xl font-black leading-[0.95] tracking-[-0.06em] text-[#29213D]">
                  Welcome
                  <span className="block bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
                    back.
                  </span>
                </h1>

                <p className="mt-4 max-w-sm text-sm leading-7 text-[#29213D]/50">
                  Sign in to access your market intelligence,
                  autonomous agents and trading workspace.
                </p>
              </div>

              {/* ====================================================
                  ERROR
              ==================================================== */}

              {error && (
                <div
                  className="
                    mb-6
                    rounded-2xl
                    border
                    border-rose-200
                    bg-rose-50
                    px-4
                    py-3.5
                  "
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />

                    <p className="text-[11px] leading-5 text-rose-600">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* ====================================================
                  FORM
              ==================================================== */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="email"
                    className="
                      mb-2
                      flex
                      items-center
                      gap-2
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.16em]
                      text-[#29213D]/40
                    "
                  >
                    <Mail size={11} />

                    Email address
                  </label>

                  <div className="group relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      className="
                        w-full
                        rounded-2xl
                        border
                        border-[#29213D]/10
                        bg-[#F8F7FA]
                        px-4
                        py-4
                        text-xs
                        font-medium
                        text-[#29213D]
                        outline-none
                        transition
                        duration-300
                        placeholder:text-[#29213D]/25
                        hover:border-violet-200
                        hover:bg-white
                        focus:border-violet-300
                        focus:bg-white
                        focus:ring-4
                        focus:ring-violet-500/10
                      "
                    />

                    <div
                      className="
                        pointer-events-none
                        absolute
                        bottom-0
                        left-5
                        right-5
                        h-[2px]
                        scale-x-0
                        rounded-full
                        bg-gradient-to-r
                        from-violet-500
                        to-fuchsia-500
                        transition
                        duration-300
                        group-focus-within:scale-x-100
                      "
                    />
                  </div>
                </div>

                {/* PASSWORD */}

                <div>
                  <label
                    htmlFor="password"
                    className="
                      mb-2
                      flex
                      items-center
                      gap-2
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.16em]
                      text-[#29213D]/40
                    "
                  >
                    <LockKeyhole size={11} />

                    Password
                  </label>

                  <div className="group relative">
                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="
                        w-full
                        rounded-2xl
                        border
                        border-[#29213D]/10
                        bg-[#F8F7FA]
                        px-4
                        py-4
                        pr-14
                        text-xs
                        font-medium
                        text-[#29213D]
                        outline-none
                        transition
                        duration-300
                        placeholder:text-[#29213D]/25
                        hover:border-violet-200
                        hover:bg-white
                        focus:border-violet-300
                        focus:bg-white
                        focus:ring-4
                        focus:ring-violet-500/10
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      className="
                        absolute
                        right-3
                        top-1/2
                        flex
                        h-9
                        w-9
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-xl
                        text-[#29213D]/25
                        transition
                        hover:bg-violet-50
                        hover:text-violet-600
                      "
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>

                    <div
                      className="
                        pointer-events-none
                        absolute
                        bottom-0
                        left-5
                        right-5
                        h-[2px]
                        scale-x-0
                        rounded-full
                        bg-gradient-to-r
                        from-violet-500
                        to-fuchsia-500
                        transition
                        duration-300
                        group-focus-within:scale-x-100
                      "
                    />
                  </div>
                </div>

                {/* ==================================================
                    SECURITY INDICATOR
                ================================================== */}

                <div className="flex items-center gap-2 pt-1">
                  <ShieldCheck
                    size={12}
                    className="text-emerald-500"
                  />

                  <span className="text-[9px] font-semibold text-[#29213D]/35">
                    Your connection is protected
                  </span>
                </div>

                {/* ==================================================
                    SUBMIT
                ================================================== */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-3
                    rounded-2xl
                    bg-violet-600
                    px-5
                    py-4
                    text-xs
                    font-bold
                    text-white
                    shadow-xl
                    shadow-violet-500/20
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:bg-violet-700
                    hover:shadow-violet-500/30
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    disabled:hover:translate-y-0
                  "
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Authenticating...
                    </>
                  ) : (
                    <>
                      Enter AI smart trading

                      <ArrowRight
                        size={15}
                        className="transition group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* ====================================================
                  REGISTER
              ==================================================== */}

              <div className="mt-8 border-t border-[#29213D]/[0.07] pt-7">
                <p className="text-center text-[11px] text-[#29213D]/40">
                  Don't have a Trade Pilot account?{" "}
                  <Link
                    to="/register"
                    className="
                      font-bold
                      text-violet-600
                      transition
                      hover:text-violet-700
                    "
                  >
                    Create AI trading account
                  </Link>
                </p>
              </div>
            </div>

            {/* ======================================================
                SECURITY FOOTER
            ====================================================== */}

            <div className="border-t border-[#29213D]/[0.07] bg-[#FAF9FB] px-6 py-4 sm:px-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    size={12}
                    className="text-violet-500"
                  />

                  <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#29213D]/35">
                    Secure authentication
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Cpu
                    size={11}
                    className="text-[#29213D]/20"
                  />

                  <span className="font-mono text-[8px] font-bold uppercase tracking-wider text-[#29213D]/25">
                    TP_AUTH
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              FLOATING STATUS
          ======================================================== */}

          <div className="login-reveal login-delay-3 mt-7 flex flex-wrap items-center justify-center gap-3">
            <div
              className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-white/80
                bg-white/70
                px-3
                py-2
                shadow-sm
                backdrop-blur
              "
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

              <span className="text-[8px] font-bold uppercase tracking-[0.13em] text-[#29213D]/40">
                Paper environment
              </span>
            </div>

            <div
              className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-white/80
                bg-white/70
                px-3
                py-2
                shadow-sm
                backdrop-blur
              "
            >
              <Activity
                size={10}
                className="text-violet-500"
              />

              <span className="text-[8px] font-bold uppercase tracking-[0.13em] text-[#29213D]/40">
                AI trading infrastructure
              </span>
            </div>
          </div>

          {/* ========================================================
              DISCLAIMER
          ======================================================== */}

          <p className="mt-5 text-center text-[8px] leading-5 text-[#29213D]/25">
            Trade Pilot AI uses paper trading for testing and
            development. No real funds are involved.
          </p>
        </div>
      </main>
    </div>
  );
}


