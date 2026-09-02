import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowDownRight,
  ArrowUp,
  ArrowUpRight,
  BarChart3,
  Bell,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Cpu,
  Gauge,
  Layers3,
  LineChart,
  LockKeyhole,
  Maximize2,
  Network,
  Orbit,
  Pause,
  Play,
  Radio,
  Radar,
  ScanLine,
  Server,
  ShieldCheck,
  Sparkles,
  Target,
  Terminal,
  TrendingDown,
  TrendingUp,
  Wallet,
  Wifi,
  X,
  Zap,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

/* ============================================================
   TRADEPILOT AI — CINEMATIC PRODUCT DEMO
   ============================================================

   Designed as a premium autonomous trading product film.

   STORY

   00  OPENING
   01  LIVE MARKET
   02  MARKET SCANNER
   03  AI REASONING
   04  MULTI-AGENT INTELLIGENCE
   05  RISK ENGINE
   06  EXECUTION
   07  PORTFOLIO
   08  CLOSING

   Visual language:
   Background  #faf9f7
   Ink         #17151f
   Violet      #8062ff
   Mint        #35b984
   Peach       #d76a56
   Border      #e7e2db
   Muted       #97909b
============================================================ */

const SCENES = {
  OPENING: 0,
  MARKET: 1,
  SCANNER: 2,
  AI: 3,
  AGENTS: 4,
  RISK: 5,
  EXECUTION: 6,
  PORTFOLIO: 7,
  CLOSING: 8,
};

const SCENE_COUNT = Object.keys(SCENES).length;
const SCENE_DURATION = 6200;

/* ============================================================
   MAIN
============================================================ */

export default function Demo() {
  const [scene, setScene] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const sceneRef = useRef(null);
  const scrollTimer = useRef(null);

  /*
   * Automatically move through scenes.
   */
  useEffect(() => {
    if (paused) return;

    const timer = setTimeout(() => {
      setScene((current) =>
        current >= SCENE_COUNT - 1 ? 0 : current + 1
      );
    }, SCENE_DURATION);

    return () => clearTimeout(timer);
  }, [scene, paused]);

  /*
   * Scroll to scene whenever scene changes.
   */
  useEffect(() => {
    if (!sceneRef.current) return;

    clearTimeout(scrollTimer.current);

    scrollTimer.current = setTimeout(() => {
      sceneRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 80);

    return () => clearTimeout(scrollTimer.current);
  }, [scene]);

  /*
   * Keyboard navigation.
   */
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        nextScene();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        previousScene();
      }

      if (event.key === "Escape") {
        setPaused((value) => !value);
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const nextScene = () => {
    setScene((current) =>
      current >= SCENE_COUNT - 1 ? 0 : current + 1
    );
  };

  const previousScene = () => {
    setScene((current) =>
      current <= 0 ? SCENE_COUNT - 1 : current - 1
    );
  };

  const progress =
    ((scene + 1) / SCENE_COUNT) * 100;

  return (
    <div
      ref={sceneRef}
      className="relative min-h-screen overflow-x-hidden bg-[#faf9f7] text-[#211e28]"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={() => setShowControls(true)}
    >
      <CinematicBackground scene={scene} />

      <AmbientParticles />

      <TopBar
        scene={scene}
        paused={paused}
        onPause={() => setPaused((value) => !value)}
      />

      {/* LIVE MARKET TICKER */}

      <MarketTicker scene={scene} />

      {/* MAIN STORY */}

      <main className="relative z-10 min-h-screen">
        <AnimatePresence mode="wait">
          {scene === SCENES.OPENING && (
            <OpeningScene
              key="opening"
              onStart={() => {
                setScene(1);
                setPaused(false);
              }}
            />
          )}

          {scene === SCENES.MARKET && (
            <MarketScene key="market" />
          )}

          {scene === SCENES.SCANNER && (
            <ScannerScene key="scanner" />
          )}

          {scene === SCENES.AI && (
            <AIScene key="ai" />
          )}

          {scene === SCENES.AGENTS && (
            <AgentsScene key="agents" />
          )}

          {scene === SCENES.RISK && (
            <RiskScene key="risk" />
          )}

          {scene === SCENES.EXECUTION && (
            <ExecutionScene key="execution" />
          )}

          {scene === SCENES.PORTFOLIO && (
            <PortfolioScene key="portfolio" />
          )}

          {scene === SCENES.CLOSING && (
            <ClosingScene
              key="closing"
              onRestart={() => {
                setScene(0);
                setPaused(false);
              }}
            />
          )}
        </AnimatePresence>
      </main>

      {/* CINEMATIC CONTROLS */}

      <CinematicControls
        scene={scene}
        progress={progress}
        paused={paused}
        visible={showControls}
        onNext={nextScene}
        onPrevious={previousScene}
        onPause={() => setPaused((value) => !value)}
        onSelect={setScene}
      />
    </div>
  );
}

/* ============================================================
   BACKGROUND
============================================================ */

function CinematicBackground({ scene }) {
  const lighting = [
    ["#e8e0ff", "#edfff7"],
    ["#e7e0ff", "#eafaf4"],
    ["#ede7ff", "#fff2ec"],
    ["#ddd4ff", "#e5fff4"],
    ["#e5dcff", "#dffff0"],
    ["#e4fff1", "#effff8"],
    ["#e9e1ff", "#f0e9ff"],
    ["#e5ddff", "#eafff5"],
    ["#ded5ff", "#edfff7"],
  ];

  const [left, right] = lighting[scene];

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        key={`left-${scene}`}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 0.65,
          x: scene % 2 === 0 ? -30 : 40,
          y: scene % 3 === 0 ? -20 : 30,
        }}
        transition={{ duration: 1.8 }}
        className="absolute -left-48 -top-48 h-[520px] w-[520px] rounded-full blur-[130px]"
        style={{ background: left }}
      />

      <motion.div
        key={`right-${scene}`}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 0.55,
          x: scene % 2 === 0 ? 40 : -30,
          y: scene % 3 === 0 ? 30 : -20,
        }}
        transition={{ duration: 2 }}
        className="absolute -bottom-56 -right-48 h-[600px] w-[600px] rounded-full blur-[150px]"
        style={{ background: right }}
      />

      {/* GRID */}

      <div
        className="absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage:
            "linear-gradient(#e4dfd9 1px, transparent 1px), linear-gradient(90deg, #e4dfd9 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(circle at center, black, transparent 76%)",
        }}
      />

      {/* VIGNETTE */}

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 25%, rgba(250,249,247,0.35) 65%, rgba(250,249,247,0.9) 100%)",
        }}
      />

      {/* SCAN LINE */}

      <motion.div
        animate={{ y: ["-10vh", "110vh"] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-0 right-0 h-px bg-[#8062ff]/[0.08]"
      />
    </div>
  );
}

/* ============================================================
   AMBIENT PARTICLES
============================================================ */

function AmbientParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 34 }, (_, index) => ({
        id: index,
        x: (index * 37) % 100,
        y: (index * 61) % 100,
        size: index % 5 === 0 ? 3 : 2,
        duration: 5 + (index % 5),
        delay: (index % 7) * 0.4,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: [0, 0.35, 0],
            y: [-10, -80],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeOut",
          }}
          className="absolute rounded-full bg-[#8062ff]"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   TOP BAR
============================================================ */

function TopBar({ scene, paused, onPause }) {
  return (
    <header className="relative z-40 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.7 }}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#17151f] shadow-[0_15px_45px_rgba(23,21,31,0.15)]"
        >
          <Orbit size={17} className="text-white" />
        </motion.div>

        <div>
          <p className="text-[11px] font-bold tracking-[-0.02em] text-[#29242f]">
            TradePilot
          </p>

          <p className="text-[7px] font-bold uppercase tracking-[0.16em] text-[#aaa3ad]">
            Autonomous Intelligence
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-[#e5e0da] bg-white/75 px-3 py-1.5 backdrop-blur-md sm:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#35b984]/50" />
            <span className="relative h-2 w-2 rounded-full bg-[#35b984]" />
          </span>

          <span className="text-[7px] font-bold uppercase tracking-[0.14em] text-[#756d7b]">
            System online
          </span>
        </div>

        <button
          onClick={onPause}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e5e0da] bg-white/80 text-[#756d7b] backdrop-blur transition hover:bg-white"
        >
          {paused ? (
            <Play size={11} />
          ) : (
            <Pause size={11} />
          )}
        </button>
      </div>
    </header>
  );
}

/* ============================================================
   MARKET TICKER
============================================================ */

function MarketTicker({ scene }) {
  const markets = [
    ["NVDA", "$184.72", "+3.84%", true],
    ["AAPL", "$237.41", "+1.92%", true],
    ["TSLA", "$341.22", "-0.72%", false],
    ["MSFT", "$511.28", "+2.14%", true],
    ["AMD", "$164.31", "+4.21%", true],
    ["SPY", "$647.80", "+0.86%", true],
  ];

  return (
    <div className="relative z-30 hidden overflow-hidden border-y border-[#e8e3dd] bg-white/45 backdrop-blur-md lg:block">
      <motion.div
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex min-w-max"
      >
        {[...markets, ...markets].map(
          ([symbol, price, change, positive], index) => (
            <div
              key={`${symbol}-${index}`}
              className="flex items-center gap-3 border-r border-[#ebe6e0] px-6 py-2"
            >
              <span className="font-mono text-[7px] font-bold text-[#403946]">
                {symbol}
              </span>

              <span className="font-mono text-[7px] text-[#817987]">
                {price}
              </span>

              <span
                className={`flex items-center gap-0.5 text-[7px] font-bold ${
                  positive
                    ? "text-[#26966b]"
                    : "text-[#d35d4e]"
                }`}
              >
                {positive ? (
                  <ArrowUpRight size={8} />
                ) : (
                  <ArrowDownRight size={8} />
                )}
                {change}
              </span>

              <span className="h-1 w-1 rounded-full bg-[#35b984]" />
            </div>
          )
        )}
      </motion.div>
    </div>
  );
}

/* ============================================================
   SCENE WRAPPER
============================================================ */

function Scene({ children, className = "" }) {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 30,
        scale: 0.985,
        filter: "blur(6px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      exit={{
        opacity: 0,
        y: -25,
        scale: 0.985,
        filter: "blur(5px)",
      }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`mx-auto flex min-h-[calc(100vh-150px)] w-full max-w-[1500px] items-center px-5 py-16 pb-28 sm:px-8 lg:px-12 ${className}`}
    >
      {children}
    </motion.section>
  );
}

/* ============================================================
   OPENING
============================================================ */

function OpeningScene({ onStart }) {
  return (
    <Scene className="justify-center text-center">
      <div className="relative mx-auto max-w-5xl">
        {/* RADAR */}

        <motion.div
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative mx-auto mb-10 h-28 w-28"
        >
          {[1, 0.75, 0.5].map((scale, index) => (
            <motion.div
              key={scale}
              animate={{
                scale: [scale, scale + 0.12, scale],
                opacity: [0.25, 0.6, 0.25],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: index * 0.35,
              }}
              className="absolute inset-0 rounded-full border border-[#8062ff]/30"
              style={{
                transform: `scale(${scale})`,
              }}
            />
          ))}

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#17151f] shadow-[0_30px_90px_rgba(23,21,31,0.2)]">
              <Orbit size={30} className="text-white" />
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-[8px] font-bold uppercase tracking-[0.38em] text-[#8062ff] sm:text-[9px]"
        >
          Autonomous Trading Intelligence
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.4,
            duration: 0.8,
          }}
          className="mt-4 text-5xl font-semibold tracking-[-0.075em] text-[#211e28] sm:text-7xl lg:text-[92px]"
        >
          TradePilot
          <span className="text-[#8062ff]"> AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mx-auto mt-6 max-w-2xl text-xs leading-7 text-[#817987] sm:text-sm"
        >
          A trading intelligence system that watches the market,
          reasons through opportunity, validates risk, and executes
          with precision.
        </motion.p>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {[
            ["LIVE DATA", Radio],
            ["AI REASONING", BrainCircuit],
            ["RISK ENGINE", ShieldCheck],
            ["AUTONOMOUS", Zap],
          ].map(([label, Icon], index) => (
            <motion.div
              key={label}
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.95 + index * 0.1,
              }}
              className="flex items-center gap-2 rounded-full border border-[#e5e0da] bg-white/75 px-3 py-2 backdrop-blur"
            >
              <Icon
                size={10}
                className="text-[#7859f4]"
              />

              <span className="text-[7px] font-bold uppercase tracking-wider text-[#756d7b]">
                {label}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{ delay: 1.35 }}
          whileHover={{
            y: -3,
            scale: 1.02,
          }}
          whileTap={{
            scale: 0.98,
          }}
          onClick={onStart}
          className="group mt-10 inline-flex items-center gap-3 rounded-xl bg-[#17151f] px-6 py-3.5 text-[8px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_20px_60px_rgba(23,21,31,0.18)]"
        >
          Enter intelligence layer

          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 transition group-hover:translate-x-1">
            <ChevronRight size={10} />
          </span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7 }}
          className="mt-10 flex items-center justify-center gap-2 text-[7px] uppercase tracking-[0.18em] text-[#aaa3ad]"
        >
          <Wifi size={9} />
          Connected to intelligence layer
        </motion.div>
      </div>
    </Scene>
  );
}

/* ============================================================
   MARKET SCENE
============================================================ */

function MarketScene() {
  const values = useMemo(
    () => [
      43, 47, 45, 53, 50, 58, 56, 63, 61, 69, 66, 73,
      70, 78, 75, 83, 80, 88, 85, 92, 89, 97,
    ],
    []
  );

  return (
    <Scene>
      <div className="grid w-full items-center gap-10 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <SceneLabel
            icon={Radio}
            text="01 / Live Market Intelligence"
          />

          <motion.h2
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-[#211e28] sm:text-6xl"
          >
            See the market
            <span className="text-[#8062ff]">
              {" "}live.
            </span>
          </motion.h2>

          <p className="mt-5 max-w-md text-xs leading-6 text-[#817987] sm:text-sm">
            TradePilot continuously monitors price action,
            momentum, volume and market structure so opportunity
            never arrives unseen.
          </p>

          <div className="mt-8 grid max-w-md grid-cols-2 gap-2">
            <Metric label="SYMBOL" value="NVDA" />
            <Metric label="PRICE" value="$184.72" />
            <Metric
              label="CHANGE"
              value="+3.84%"
              positive
            />
            <Metric
              label="SIGNAL"
              value="BULLISH"
              positive
            />
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[
                BrainCircuit,
                Activity,
                Radar,
              ].map((Icon, index) => (
                <div
                  key={index}
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#faf9f7] bg-white"
                >
                  <Icon
                    size={10}
                    className="text-[#8062ff]"
                  />
                </div>
              ))}
            </div>

            <span className="text-[7px] uppercase tracking-wider text-[#97909b]">
              3 intelligence streams active
            </span>
          </div>
        </div>

        <TradingTerminal values={values} />
      </div>
    </Scene>
  );
}

/* ============================================================
   TRADING TERMINAL
============================================================ */

function TradingTerminal({ values }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.9,
        rotateX: 8,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        rotateX: 0,
      }}
      transition={{
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="overflow-hidden rounded-[26px] border border-[#e3ded8] bg-white shadow-[0_40px_120px_rgba(45,35,70,0.1)]"
    >
      <div className="flex items-center justify-between border-b border-[#eee9e4] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1edff]">
            <LineChart
              size={14}
              className="text-[#7859f4]"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#211e28]">
                NVDA
              </span>

              <span className="rounded-full bg-[#edfff7] px-2 py-1 text-[7px] font-bold uppercase text-[#26966b]">
                Bullish
              </span>
            </div>

            <p className="mt-1 text-[7px] uppercase tracking-wider text-[#aaa3ad]">
              NVIDIA Corporation · NASDAQ
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="font-mono text-lg font-bold text-[#302a36]">
            $184.72
          </p>

          <p className="text-[7px] font-bold text-[#26966b]">
            +3.84% today
          </p>
        </div>
      </div>

      <div className="relative p-5 sm:p-7">
        <div className="absolute inset-x-5 top-7 bottom-12">
          {[0, 1, 2, 3, 4].map((line) => (
            <div
              key={line}
              className="absolute left-0 right-0 border-t border-dashed border-[#ece8e3]"
              style={{
                top: `${line * 25}%`,
              }}
            />
          ))}
        </div>

        <svg
          viewBox="0 0 720 330"
          className="relative h-[300px] w-full sm:h-[370px]"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="demoAreaPremium"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#8062ff"
                stopOpacity="0.2"
              />

              <stop
                offset="100%"
                stopColor="#8062ff"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          <motion.path
            d={buildAreaPath(values)}
            fill="url(#demoAreaPremium)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          />

          <motion.path
            d={buildLinePath(values)}
            fill="none"
            stroke="#8062ff"
            strokeWidth="3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{
              pathLength: 0,
            }}
            animate={{
              pathLength: 1,
            }}
            transition={{
              duration: 2.2,
              delay: 0.3,
              ease: "easeInOut",
            }}
          />

          {values.map((value, index) => {
            const x =
              20 +
              (index / (values.length - 1)) *
                680;

            const y = 285 - value * 2.25;

            return (
              <motion.circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="#8062ff"
                initial={{
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  scale:
                    index === values.length - 1
                      ? [1, 1.8, 1]
                      : 1,
                  opacity:
                    index > 8 ? 0.65 : 0,
                }}
                transition={{
                  delay: 0.4 + index * 0.035,
                  ...(index === values.length - 1
                    ? {
                        repeat: Infinity,
                        duration: 1.4,
                      }
                    : {}),
                }}
              />
            );
          })}
        </svg>

        <motion.div
          initial={{
            opacity: 0,
            x: 20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{ delay: 1.8 }}
          className="absolute right-5 top-[42%] flex items-center gap-1 rounded-md bg-[#17151f] px-2 py-1.5 font-mono text-[7px] font-bold text-white shadow-lg"
        >
          <span className="h-1 w-1 rounded-full bg-[#35b984]" />
          $184.72
        </motion.div>

        <div className="mt-2 flex justify-between text-[7px] font-bold uppercase tracking-wider text-[#aaa3ad]">
          <span>09:30</span>
          <span>11:00</span>
          <span>13:00</span>
          <span>16:00</span>
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-[#eee9e4]">
        <TerminalFooter
          icon={Activity}
          label="Momentum"
          value="Strong"
        />

        <TerminalFooter
          icon={BarChart3}
          label="Volume"
          value="+18.4%"
        />

        <TerminalFooter
          icon={Radar}
          label="Signal"
          value="Bullish"
        />
      </div>
    </motion.div>
  );
}

/* ============================================================
   SCANNER
============================================================ */

function ScannerScene() {
  const assets = [
    ["NVDA", "Bullish", "+3.84%", 94],
    ["AMD", "Bullish", "+4.21%", 91],
    ["AAPL", "Bullish", "+1.92%", 84],
    ["TSLA", "Neutral", "-0.72%", 61],
    ["MSFT", "Bullish", "+2.14%", 82],
  ];

  return (
    <Scene>
      <div className="w-full">
        <div className="text-center">
          <SceneLabel
            icon={Radar}
            text="02 / Opportunity Scanner"
            centered
          />

          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-[#211e28] sm:text-6xl">
            The market is
            <span className="text-[#8062ff]">
              {" "}constantly scanned.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-xs leading-6 text-[#817987] sm:text-sm">
            Instead of waiting for a signal, TradePilot continuously
            searches for changing market conditions and ranks
            opportunities by intelligence confidence.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-[26px] border border-[#e5e0da] bg-white shadow-[0_35px_100px_rgba(45,35,70,0.08)]">
          <div className="flex items-center justify-between border-b border-[#eee9e4] px-5 py-4">
            <div className="flex items-center gap-2">
              <ScanLine
                size={14}
                className="text-[#7859f4]"
              />

              <span className="text-[8px] font-bold uppercase tracking-[0.17em] text-[#81788f]">
                Market opportunity matrix
              </span>
            </div>

            <div className="flex items-center gap-2 text-[7px] uppercase tracking-wider text-[#aaa3ad]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#35b984]" />
              Scanning
            </div>
          </div>

          <div className="divide-y divide-[#f0ece8]">
            {assets.map(
              ([symbol, signal, change, confidence], index) => (
                <motion.div
                  key={symbol}
                  initial={{
                    opacity: 0,
                    x: -30,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: 0.25 + index * 0.14,
                  }}
                  className="grid grid-cols-[1fr_auto] items-center gap-5 px-5 py-5 sm:grid-cols-[1fr_1fr_1fr_auto]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f2f8]">
                      <BarChart3
                        size={12}
                        className="text-[#817987]"
                      />
                    </div>

                    <div>
                      <p className="font-mono text-[10px] font-bold text-[#342e3b]">
                        {symbol}
                      </p>

                      <p className="mt-1 text-[7px] uppercase tracking-wider text-[#aaa3ad]">
                        Market candidate
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:block">
                    <p className="text-[7px] uppercase tracking-wider text-[#aaa3ad]">
                      Signal
                    </p>

                    <p
                      className={`mt-1 text-[9px] font-bold ${
                        signal === "Bullish"
                          ? "text-[#26966b]"
                          : "text-[#8b8291]"
                      }`}
                    >
                      {signal}
                    </p>
                  </div>

                  <div className="hidden sm:block">
                    <p className="text-[7px] uppercase tracking-wider text-[#aaa3ad]">
                      Momentum
                    </p>

                    <p
                      className={`mt-1 font-mono text-[9px] font-bold ${
                        change.startsWith("+")
                          ? "text-[#26966b]"
                          : "text-[#d35d4e]"
                      }`}
                    >
                      {change}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[7px] uppercase tracking-wider text-[#aaa3ad]">
                      AI confidence
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#efebe7]">
                        <motion.div
                          initial={{
                            width: 0,
                          }}
                          animate={{
                            width: `${confidence}%`,
                          }}
                          transition={{
                            delay:
                              0.5 + index * 0.15,
                            duration: 0.8,
                          }}
                          className="h-full rounded-full bg-[#8062ff]"
                        />
                      </div>

                      <span className="font-mono text-[8px] font-bold text-[#4a4351]">
                        {confidence}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </div>
        </div>
      </div>
    </Scene>
  );
}

/* ============================================================
   AI SCENE
============================================================ */

function AIScene() {
  return (
    <Scene>
      <div className="w-full">
        <div className="text-center">
          <SceneLabel
            icon={BrainCircuit}
            text="03 / AI Market Reasoning"
            centered
          />

          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-[#211e28] sm:text-6xl">
            Intelligence turns
            <span className="text-[#8062ff]">
              {" "}data into decisions.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-xs leading-6 text-[#817987] sm:text-sm">
            Before capital moves, TradePilot's reasoning layer
            evaluates market structure, momentum, volume and
            probability.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-3 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <AnalysisCard
              icon={TrendingUp}
              eyebrow="Market structure"
              title="Momentum"
              value="Strong"
              description="Price remains above key structure levels."
              delay={0.2}
            />

            <AnalysisCard
              icon={Activity}
              eyebrow="Market signal"
              title="Direction"
              value="Bullish"
              description="Volume confirms directional pressure."
              delay={0.35}
              mint
            />

            <AnalysisCard
              icon={Gauge}
              eyebrow="AI confidence"
              title="Probability"
              value="87%"
              description="High-quality setup detected."
              delay={0.5}
            />
          </div>

          <AIReasoningTerminal />
        </div>
      </div>
    </Scene>
  );
}

/* ============================================================
   AI REASONING TERMINAL
============================================================ */

function AIReasoningTerminal() {
  const messages = [
    ["Market structure", "Bullish continuation detected"],
    ["Volume", "Above average participation"],
    ["Momentum", "Positive acceleration"],
    ["Risk", "Position within threshold"],
    ["Decision", "Controlled long opportunity"],
  ];

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0.3,
        duration: 0.7,
      }}
      className="overflow-hidden rounded-[26px] border border-[#e4dff0] bg-[#17151f] shadow-[0_40px_110px_rgba(45,35,70,0.16)]"
    >
      <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
        <div className="flex items-center gap-2">
          <Terminal
            size={13}
            className="text-[#a794ff]"
          />

          <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/60">
            AI reasoning stream
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#35b984]" />

          <span className="text-[7px] uppercase tracking-wider text-white/40">
            Processing
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <div className="space-y-3">
          {messages.map(
            ([label, message], index) => (
              <motion.div
                key={label}
                initial={{
                  opacity: 0,
                  x: 20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.5 + index * 0.22,
                }}
                className="flex gap-3"
              >
                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/[0.06]">
                  <CheckCircle2
                    size={10}
                    className="text-[#35b984]"
                  />
                </div>

                <div>
                  <p className="text-[7px] font-bold uppercase tracking-wider text-[#a794ff]">
                    {label}
                  </p>

                  <p className="mt-1 text-[9px] leading-5 text-white/60">
                    {message}
                  </p>
                </div>
              </motion.div>
            )
          )}
        </div>

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            delay: 1.55,
          }}
          className="mt-7 rounded-2xl border border-[#8062ff]/25 bg-[#8062ff]/10 p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-[7px] font-bold uppercase tracking-wider text-white/45">
              AI conclusion
            </span>

            <span className="rounded-full bg-[#edfff7] px-2 py-1 text-[7px] font-bold uppercase text-[#26966b]">
              BUY
            </span>
          </div>

          <p className="mt-3 text-[10px] leading-6 text-white/75">
            Strong bullish momentum detected. Price structure,
            volume and market conditions support a controlled long
            opportunity.
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-[7px] uppercase tracking-wider text-white/35">
              Confidence
            </span>

            <span className="font-mono text-xs font-bold text-white">
              87%
            </span>
          </div>

          <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.08]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "87%" }}
              transition={{
                delay: 1.7,
                duration: 1,
              }}
              className="h-full rounded-full bg-[#8062ff]"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   AGENTS
============================================================ */

function AgentsScene() {
  const agents = [
    {
      number: "01",
      title: "Market Agent",
      description: "Reads live market conditions",
      icon: LineChart,
    },
    {
      number: "02",
      title: "Strategy Agent",
      description: "Builds the trading thesis",
      icon: BrainCircuit,
    },
    {
      number: "03",
      title: "Risk Agent",
      description: "Validates exposure",
      icon: ShieldCheck,
      mint: true,
    },
    {
      number: "04",
      title: "Supervisor",
      description: "Coordinates the decision",
      icon: Cpu,
    },
  ];

  return (
    <Scene>
      <div className="w-full">
        <div className="text-center">
          <SceneLabel
            icon={Network}
            text="04 / Multi-Agent Intelligence"
            centered
          />

          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-[#211e28] sm:text-6xl">
            Multiple agents.
            <span className="text-[#8062ff]">
              {" "}One decision.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-xs leading-6 text-[#817987] sm:text-sm">
            Specialized reasoning layers collaborate before a
            decision reaches execution.
          </p>
        </div>

        <div className="relative mx-auto mt-14 max-w-6xl">
          {/* CONNECTION LINE */}

          <div className="absolute left-[10%] right-[10%] top-1/2 hidden h-px bg-[#d9d1e7] lg:block" />

          <motion.div
            initial={{
              scaleX: 0,
            }}
            animate={{
              scaleX: 1,
            }}
            transition={{
              delay: 0.7,
              duration: 1.5,
            }}
            className="absolute left-[10%] right-[10%] top-1/2 hidden h-px origin-left bg-[#8062ff] lg:block"
          />

          <div className="grid gap-3 lg:grid-cols-4">
            {agents.map((agent, index) => (
              <AgentNode
                key={agent.title}
                {...agent}
                delay={0.2 + index * 0.2}
                active
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            delay: 1.4,
          }}
          className="mx-auto mt-10 flex max-w-lg items-center justify-center gap-3 rounded-2xl border border-[#d7eee3] bg-[#edfff7] px-5 py-4"
        >
          <CheckCircle2
            size={17}
            className="text-[#26966b]"
          />

          <div className="text-left">
            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#26966b]">
              Decision synchronized
            </p>

            <p className="mt-1 text-[8px] text-[#6f8278]">
              Market, strategy and risk layers agree.
            </p>
          </div>
        </motion.div>
      </div>
    </Scene>
  );
}

/* ============================================================
   RISK
============================================================ */

function RiskScene() {
  return (
    <Scene>
      <div className="grid w-full items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SceneLabel
            icon={ShieldCheck}
            text="05 / Risk Intelligence"
          />

          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-[#211e28] sm:text-6xl">
            Every opportunity
            <span className="text-[#26966b]">
              {" "}meets a risk check.
            </span>
          </h2>

          <p className="mt-5 max-w-md text-xs leading-6 text-[#817987] sm:text-sm">
            TradePilot doesn't only ask whether an opportunity
            looks attractive. It asks whether the portfolio can
            safely take it.
          </p>

          <div className="mt-8 space-y-3">
            {[
              "Exposure within threshold",
              "Position size validated",
              "Market conditions acceptable",
              "Execution parameters ready",
            ].map((item, index) => (
              <motion.div
                key={item}
                initial={{
                  opacity: 0,
                  x: -15,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.3 + index * 0.13,
                }}
                className="flex items-center gap-3"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#edfff7]">
                  <Check
                    size={10}
                    className="text-[#26966b]"
                  />
                </div>

                <span className="text-[9px] font-medium text-[#665e6d]">
                  {item}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <RiskEngine />
      </div>
    </Scene>
  );
}

/* ============================================================
   RISK ENGINE
============================================================ */

function RiskEngine() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.92,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 0.9,
      }}
      className="relative overflow-hidden rounded-[30px] border border-[#dfe9e4] bg-white p-6 shadow-[0_40px_110px_rgba(45,35,70,0.08)] sm:p-8"
    >
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#edfff7] blur-[60px]" />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-[8px] font-bold uppercase tracking-[0.17em] text-[#97909b]">
            Risk engine
          </p>

          <p className="mt-1 text-xl font-semibold tracking-[-0.04em] text-[#302a36]">
            NVDA
          </p>
        </div>

        <motion.div
          initial={{
            scale: 0.7,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            delay: 1,
          }}
          className="flex items-center gap-1.5 rounded-full bg-[#edfff7] px-3 py-1.5"
        >
          <CheckCircle2
            size={10}
            className="text-[#26966b]"
          />

          <span className="text-[7px] font-bold uppercase tracking-wider text-[#26966b]">
            Approved
          </span>
        </motion.div>
      </div>

      <div className="relative mt-8 grid items-center gap-8 sm:grid-cols-[0.8fr_1.2fr]">
        <RiskGauge />

        <div className="space-y-2">
          <RiskRow
            label="Exposure"
            value="4.8%"
            status="PASSED"
          />

          <RiskRow
            label="Max allowed"
            value="5.0%"
            status="LIMIT"
          />

          <RiskRow
            label="Portfolio impact"
            value="Low"
            status="PASSED"
          />

          <RiskRow
            label="Execution"
            value="Ready"
            status="READY"
          />
        </div>
      </div>

      <div className="relative mt-8 rounded-2xl bg-[#faf9f7] p-4">
        <div className="flex items-center justify-between">
          <span className="text-[7px] font-bold uppercase tracking-wider text-[#aaa3ad]">
            Risk utilization
          </span>

          <span className="font-mono text-[8px] font-bold text-[#26966b]">
            96%
          </span>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#ebe8e4]">
          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: "96%",
            }}
            transition={{
              delay: 0.5,
              duration: 1.4,
            }}
            className="h-full rounded-full bg-[#35b984]"
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   EXECUTION
============================================================ */

function ExecutionScene() {
  return (
    <Scene>
      <div className="w-full text-center">
        <SceneLabel
          icon={Zap}
          text="06 / Autonomous Execution"
          centered
        />

        <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-[#211e28] sm:text-6xl">
          From reasoning
          <span className="text-[#8062ff]">
            {" "}to execution.
          </span>
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-xs leading-6 text-[#817987] sm:text-sm">
          When intelligence and risk align, TradePilot can move
          from decision to execution without breaking the chain.
        </p>

        <ExecutionPipeline />
      </div>
    </Scene>
  );
}

/* ============================================================
   EXECUTION PIPELINE
============================================================ */

function ExecutionPipeline() {
  const steps = [
    ["AI decision", BrainCircuit],
    ["Risk approved", ShieldCheck],
    ["Order submitted", Server],
    ["Market filled", CheckCircle2],
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((value) =>
        value >= steps.length - 1 ? 0 : value + 1
      );
    }, 850);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
        scale: 0.96,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        delay: 0.25,
      }}
      className="mx-auto mt-12 max-w-5xl rounded-[30px] border border-[#e3ded8] bg-white p-5 text-left shadow-[0_40px_120px_rgba(45,35,70,0.1)] sm:p-8"
    >
      <div className="flex items-center justify-between border-b border-[#eee9e4] pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1edff]">
            <Zap
              size={14}
              className="text-[#7859f4]"
            />
          </div>

          <div>
            <p className="text-[9px] font-bold text-[#302a36]">
              Autonomous order
            </p>

            <p className="mt-1 text-[7px] text-[#aaa3ad]">
              NVDA · Market Buy
            </p>
          </div>
        </div>

        <span className="rounded-full bg-[#edfff7] px-3 py-1.5 text-[7px] font-bold uppercase tracking-wider text-[#26966b]">
          Live
        </span>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {steps.map(([label, Icon], index) => {
          const completed = index <= active;

          return (
            <div
              key={label}
              className="relative"
            >
              <motion.div
                animate={{
                  scale:
                    active === index
                      ? [1, 1.04, 1]
                      : 1,
                }}
                transition={{
                  duration: 0.8,
                  repeat:
                    active === index
                      ? Infinity
                      : 0,
                }}
                className={`rounded-2xl border p-4 ${
                  completed
                    ? "border-[#d9eee5] bg-[#f5fff9]"
                    : "border-[#eee9e4] bg-[#faf9f7]"
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    completed
                      ? "bg-[#edfff7] text-[#26966b]"
                      : "bg-white text-[#aaa3ad]"
                  }`}
                >
                  <Icon size={14} />
                </div>

                <p
                  className={`mt-4 text-[8px] font-bold ${
                    completed
                      ? "text-[#26966b]"
                      : "text-[#817987]"
                  }`}
                >
                  {label}
                </p>

                <p className="mt-1 text-[7px] uppercase tracking-wider text-[#aaa3ad]">
                  {completed
                    ? "Complete"
                    : "Waiting"}
                </p>
              </motion.div>

              {index < steps.length - 1 && (
                <div className="absolute -right-3 top-1/2 hidden w-6 md:block">
                  <ChevronRight
                    size={11}
                    className={
                      index < active
                        ? "text-[#35b984]"
                        : "text-[#d3cdc7]"
                    }
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <OrderStat
          label="Action"
          value="BUY"
          green
        />

        <OrderStat
          label="Symbol"
          value="NVDA"
        />

        <OrderStat
          label="Size"
          value="$4,820"
        />

        <OrderStat
          label="Confidence"
          value="87%"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-[#eee9e4] bg-[#faf9f7]">
        <motion.div
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="h-1 w-1/2 bg-[#8062ff]"
        />
      </div>
    </motion.div>
  );
}

/* ============================================================
   PORTFOLIO
============================================================ */

function PortfolioScene() {
  const target = useMotionValue(0);

  const spring = useSpring(target, {
    stiffness: 70,
    damping: 18,
  });

  const formatted = useTransform(
    spring,
    (value) =>
      `$${value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
  );

  useEffect(() => {
    target.set(125840.36);
  }, [target]);

  return (
    <Scene>
      <div className="w-full">
        <div className="text-center">
          <SceneLabel
            icon={Wallet}
            text="07 / Portfolio Intelligence"
            centered
          />

          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-[#211e28] sm:text-6xl">
            Your portfolio.
            <span className="text-[#8062ff]">
              {" "}Always in view.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-xs leading-6 text-[#817987]">
            Decisions become measurable outcomes. Portfolio state,
            positions and performance stay visible in one place.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <PortfolioMetric
            icon={CircleDollarSign}
            label="Portfolio value"
            value={formatted}
          />

          <PortfolioMetric
            icon={TrendingUp}
            label="Today's P/L"
            value="+$2,840.52"
            positive
            mint
          />

          <PortfolioMetric
            icon={Wallet}
            label="Buying power"
            value="$48,230.10"
          />

          <PortfolioMetric
            icon={Target}
            label="Open positions"
            value="04"
            peach
          />
        </div>

        <div className="mx-auto mt-3 grid max-w-6xl gap-3 lg:grid-cols-[1.2fr_0.8fr]">
          <PortfolioChart />

          <PositionList />
        </div>
      </div>
    </Scene>
  );
}

/* ============================================================
   PORTFOLIO CHART
============================================================ */

function PortfolioChart() {
  const values = [
    35, 40, 38, 45, 43, 51, 48, 59, 55, 65,
    62, 72, 69, 78, 76, 88,
  ];

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0.35,
      }}
      className="overflow-hidden rounded-[24px] border border-[#e5e0da] bg-white p-5 shadow-[0_20px_70px_rgba(45,35,70,0.06)]"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#97909b]">
            Portfolio performance
          </p>

          <p className="mt-1 text-lg font-semibold text-[#302a36]">
            +12.84%
          </p>
        </div>

        <span className="flex items-center gap-1 rounded-full bg-[#edfff7] px-2 py-1 text-[7px] font-bold text-[#26966b]">
          <TrendingUp size={8} />
          Positive
        </span>
      </div>

      <svg
        viewBox="0 0 700 260"
        className="mt-6 h-[220px] w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="portfolioArea"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#35b984"
              stopOpacity="0.18"
            />

            <stop
              offset="100%"
              stopColor="#35b984"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3].map((line) => (
          <line
            key={line}
            x1="0"
            x2="700"
            y1={line * 65}
            y2={line * 65}
            stroke="#eeeae5"
            strokeDasharray="4 6"
          />
        ))}

        <motion.path
          d={buildPortfolioArea(values)}
          fill="url(#portfolioArea)"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
        />

        <motion.path
          d={buildPortfolioPath(values)}
          fill="none"
          stroke="#35b984"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{
            pathLength: 0,
          }}
          animate={{
            pathLength: 1,
          }}
          transition={{
            duration: 2,
            delay: 0.4,
          }}
        />
      </svg>
    </motion.div>
  );
}

/* ============================================================
   POSITIONS
============================================================ */

function PositionList() {
  const positions = [
    ["NVDA", "$184.72", "+3.84%", true],
    ["AAPL", "$237.41", "+1.92%", true],
    ["MSFT", "$511.28", "+2.14%", true],
    ["TSLA", "$341.22", "-0.72%", false],
  ];

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 25,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        delay: 0.5,
      }}
      className="overflow-hidden rounded-[24px] border border-[#e5e0da] bg-white shadow-[0_20px_70px_rgba(45,35,70,0.06)]"
    >
      <div className="flex items-center justify-between border-b border-[#eee9e4] px-5 py-4">
        <div className="flex items-center gap-2">
          <BarChart3
            size={13}
            className="text-[#7859f4]"
          />

          <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#81788f]">
            Active positions
          </span>
        </div>

        <span className="text-[7px] uppercase tracking-wider text-[#aaa3ad]">
          Live
        </span>
      </div>

      <div>
        {positions.map(
          ([symbol, price, change, positive], index) => (
            <motion.div
              key={symbol}
              initial={{
                opacity: 0,
                x: -15,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.65 + index * 0.12,
              }}
              className="flex items-center justify-between border-b border-[#f0ece8] px-5 py-4 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5f3f8]">
                  <BarChart3
                    size={10}
                    className="text-[#817987]"
                  />
                </div>

                <div>
                  <p className="font-mono text-[9px] font-bold text-[#39333f]">
                    {symbol}
                  </p>

                  <p className="mt-0.5 text-[7px] text-[#aaa3ad]">
                    Open position
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-mono text-[9px] font-semibold text-[#4a4351]">
                  {price}
                </p>

                <p
                  className={`mt-1 text-[7px] font-bold ${
                    positive
                      ? "text-[#26966b]"
                      : "text-[#d35d4e]"
                  }`}
                >
                  {change}
                </p>
              </div>
            </motion.div>
          )
        )}
      </div>
    </motion.div>
  );
}

/* ============================================================
   CLOSING
============================================================ */

function ClosingScene({ onRestart }) {
  return (
    <Scene className="justify-center text-center">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{
            scale: 0.5,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mx-auto h-20 w-20"
        >
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.2, 0.45, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="absolute inset-0 rounded-[26px] bg-[#8062ff] blur-2xl"
          />

          <div className="relative flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#17151f] shadow-[0_30px_100px_rgba(23,21,31,0.2)]">
            <Orbit
              size={32}
              className="text-white"
            />
          </div>
        </motion.div>

        <motion.p
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
          }}
          className="mt-10 text-[8px] font-bold uppercase tracking-[0.38em] text-[#8062ff]"
        >
          Intelligent · Autonomous · Risk-Aware
        </motion.p>

        <motion.h2
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.45,
          }}
          className="mt-4 text-5xl font-semibold tracking-[-0.075em] text-[#211e28] sm:text-7xl"
        >
          Trade with
          <br />
          <span className="text-[#8062ff]">
            intelligence.
          </span>
        </motion.h2>

        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.8,
          }}
          className="mx-auto mt-6 max-w-xl text-xs leading-7 text-[#817987] sm:text-sm"
        >
          TradePilot AI brings market intelligence, autonomous
          reasoning, risk management and execution together in
          one intelligent trading system.
        </motion.p>

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.05,
          }}
          className="mt-9 flex flex-wrap justify-center gap-2"
        >
          {[
            "LIVE INTELLIGENCE",
            "MULTI-AGENT AI",
            "RISK AWARE",
            "AUTONOMOUS EXECUTION",
          ].map((item) => (
            <span
              key={item}
              className="rounded-full border border-[#e4dfd8] bg-white/75 px-3 py-2 text-[7px] font-bold uppercase tracking-wider text-[#817987]"
            >
              {item}
            </span>
          ))}
        </motion.div>

        <motion.button
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1.35,
          }}
          whileHover={{
            y: -3,
          }}
          onClick={onRestart}
          className="mt-10 inline-flex items-center gap-2 rounded-xl bg-[#17151f] px-6 py-3.5 text-[8px] font-bold uppercase tracking-[0.15em] text-white shadow-[0_20px_60px_rgba(23,21,31,0.15)]"
        >
          <Play size={10} />
          Replay intelligence
        </motion.button>
      </div>
    </Scene>
  );
}

/* ============================================================
   SCENE LABEL
============================================================ */

function SceneLabel({
  icon: Icon,
  text,
  centered = false,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className={`flex items-center gap-2 ${
        centered ? "justify-center" : ""
      }`}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f1edff]">
        <Icon
          size={12}
          className="text-[#7859f4]"
        />
      </span>

      <span className="text-[8px] font-bold uppercase tracking-[0.22em] text-[#8b8291]">
        {text}
      </span>
    </motion.div>
  );
}

/* ============================================================
   METRIC
============================================================ */

function Metric({
  label,
  value,
  positive = false,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0.35,
      }}
      className="rounded-xl border border-[#e7e2db] bg-white/80 p-3 text-left backdrop-blur"
    >
      <p className="text-[7px] font-bold uppercase tracking-wider text-[#aaa3ad]">
        {label}
      </p>

      <p
        className={`mt-1 font-mono text-xs font-semibold ${
          positive
            ? "text-[#26966b]"
            : "text-[#423c48]"
        }`}
      >
        {value}
      </p>
    </motion.div>
  );
}

/* ============================================================
   TERMINAL FOOTER
============================================================ */

function TerminalFooter({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="border-r border-[#eee9e4] px-4 py-3 last:border-r-0">
      <div className="flex items-center gap-1.5">
        <Icon
          size={9}
          className="text-[#8062ff]"
        />

        <span className="text-[7px] uppercase tracking-wider text-[#aaa3ad]">
          {label}
        </span>
      </div>

      <p className="mt-1 text-[8px] font-bold text-[#403946]">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   ANALYSIS CARD
============================================================ */

function AnalysisCard({
  icon: Icon,
  eyebrow,
  title,
  value,
  description,
  delay = 0,
  mint = false,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay,
        duration: 0.65,
      }}
      className={`rounded-[22px] border p-5 ${
        mint
          ? "border-[#d8eee4] bg-[#effcf6]"
          : "border-[#e7e0f1] bg-[#f5f1ff]"
      }`}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
          mint
            ? "bg-white text-[#26966b]"
            : "bg-white text-[#7859f4]"
        }`}
      >
        <Icon size={14} />
      </div>

      <p className="mt-5 text-[8px] font-bold uppercase tracking-[0.16em] text-[#958d99]">
        {eyebrow}
      </p>

      <p className="mt-1 text-xs font-semibold text-[#322d38]">
        {title}
      </p>

      <p
        className={`mt-2 text-xl font-semibold tracking-[-0.04em] ${
          mint
            ? "text-[#26966b]"
            : "text-[#6d50e8]"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-[8px] leading-5 text-[#918a95]">
        {description}
      </p>
    </motion.div>
  );
}

/* ============================================================
   AGENT NODE
============================================================ */

function AgentNode({
  number,
  title,
  description,
  icon: Icon,
  mint = false,
  delay,
  active,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 35,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        delay,
        duration: 0.65,
      }}
      className={`relative z-10 rounded-2xl border bg-white p-5 ${
        mint
          ? "border-[#d8eee4]"
          : "border-[#e6e0f0]"
      } shadow-[0_15px_50px_rgba(45,35,70,0.045)]`}
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={
            active
              ? {
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 0 rgba(128,98,255,0)",
                    "0 0 25px rgba(128,98,255,0.15)",
                    "0 0 0 rgba(128,98,255,0)",
                  ],
                }
              : {}
          }
          transition={{
            duration: 2.2,
            repeat: Infinity,
          }}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            mint
              ? "bg-[#edfff7] text-[#26966b]"
              : "bg-[#f1edff] text-[#7859f4]"
          }`}
        >
          <Icon size={15} />
        </motion.div>

        <div>
          <span className="rounded-md bg-[#f3efff] px-1.5 py-0.5 font-mono text-[7px] font-bold text-[#7859f4]">
            {number}
          </span>

          <p className="mt-1 text-[10px] font-semibold text-[#312b38]">
            {title}
          </p>
        </div>
      </div>

      <p className="mt-4 text-[8px] leading-5 text-[#958e9a]">
        {description}
      </p>

      <div className="mt-4 flex items-center gap-2">
        <motion.span
          animate={{
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
          className={`h-1.5 w-1.5 rounded-full ${
            mint
              ? "bg-[#35b984]"
              : "bg-[#8062ff]"
          }`}
        />

        <span className="text-[7px] font-bold uppercase tracking-wider text-[#aaa3ad]">
          {mint ? "Validated" : "Processing"}
        </span>
      </div>
    </motion.div>
  );
}

/* ============================================================
   RISK GAUGE
============================================================ */

function RiskGauge() {
  return (
    <div className="relative flex items-center justify-center">
      <svg
        viewBox="0 0 220 220"
        className="h-48 w-48"
      >
        <circle
          cx="110"
          cy="110"
          r="82"
          fill="none"
          stroke="#eeeae5"
          strokeWidth="13"
          strokeLinecap="round"
        />

        <motion.circle
          cx="110"
          cy="110"
          r="82"
          fill="none"
          stroke="#35b984"
          strokeWidth="13"
          strokeLinecap="round"
          strokeDasharray="515"
          initial={{
            strokeDashoffset: 515,
          }}
          animate={{
            strokeDashoffset: 20,
          }}
          transition={{
            delay: 0.3,
            duration: 1.5,
            ease: "easeOut",
          }}
          transform="rotate(-90 110 110)"
        />

        <text
          x="110"
          y="105"
          textAnchor="middle"
          className="fill-[#302a36]"
          fontSize="29"
          fontWeight="700"
        >
          4.8%
        </text>

        <text
          x="110"
          y="127"
          textAnchor="middle"
          className="fill-[#aaa3ad]"
          fontSize="9"
          fontWeight="600"
        >
          EXPOSURE
        </text>
      </svg>

      <div className="absolute bottom-2 rounded-full bg-[#edfff7] px-3 py-1.5 text-[7px] font-bold uppercase tracking-wider text-[#26966b]">
        Within limit
      </div>
    </div>
  );
}

/* ============================================================
   RISK ROW
============================================================ */

function RiskRow({ label, value, status }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#eeeae5] bg-[#faf9f7] px-3 py-3">
      <div>
        <p className="text-[7px] uppercase tracking-wider text-[#aaa3ad]">
          {label}
        </p>

        <p className="mt-1 text-[9px] font-semibold text-[#423c48]">
          {value}
        </p>
      </div>

      <span
        className={`text-[7px] font-bold uppercase tracking-wider ${
          status === "LIMIT"
            ? "text-[#8f8792]"
            : "text-[#26966b]"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

/* ============================================================
   ORDER STAT
============================================================ */

function OrderStat({
  label,
  value,
  green = false,
}) {
  return (
    <div className="rounded-xl border border-[#eeeae5] bg-[#faf9f7] p-3">
      <p className="text-[7px] font-bold uppercase tracking-wider text-[#aaa3ad]">
        {label}
      </p>

      <p
        className={`mt-1 truncate font-mono text-[9px] font-semibold ${
          green
            ? "text-[#26966b]"
            : "text-[#423c48]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   PORTFOLIO METRIC
============================================================ */

function PortfolioMetric({
  icon: Icon,
  label,
  value,
  positive = false,
  mint = false,
  peach = false,
}) {
  const iconClass = peach
    ? "bg-[#fff1eb] text-[#d76a56]"
    : mint
    ? "bg-[#edfff7] text-[#26966b]"
    : "bg-[#f1edff] text-[#7859f4]";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.55,
      }}
      className="rounded-[22px] border border-[#e7e2db] bg-white p-5 shadow-[0_15px_50px_rgba(45,35,70,0.045)]"
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
      >
        <Icon size={16} />
      </div>

      <p className="mt-5 text-[8px] font-bold uppercase tracking-[0.16em] text-[#97909b]">
        {label}
      </p>

      <motion.p
        className={`mt-1 truncate text-xl font-semibold tracking-[-0.04em] ${
          positive
            ? "text-[#26966b]"
            : "text-[#24202b]"
        }`}
      >
        {value}
      </motion.p>

      <div className="mt-2 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#35b984]" />

        <span className="text-[8px] text-[#928b96]">
          Live account data
        </span>
      </div>
    </motion.div>
  );
}

/* ============================================================
   CINEMATIC CONTROLS
============================================================ */

function CinematicControls({
  scene,
  progress,
  paused,
  visible,
  onNext,
  onPrevious,
  onPause,
  onSelect,
}) {
  return (
    <motion.div
      animate={{
        opacity: visible ? 1 : 0.45,
      }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      {/* PROGRESS */}

      <div className="h-[2px] bg-[#ebe7e2]">
        <motion.div
          className="h-full bg-[#8062ff]"
          animate={{
            width: `${progress}%`,
          }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
        />
      </div>

      <div className="border-t border-[#e7e2dc] bg-[#faf9f7]/85 px-4 py-3 backdrop-blur-xl sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[8px] font-bold text-[#817987]">
              {String(scene + 1).padStart(2, "0")}
              {" / "}
              {String(SCENE_COUNT).padStart(2, "0")}
            </span>

            <div className="hidden items-center gap-1.5 sm:flex">
              {Array.from({
                length: SCENE_COUNT,
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => onSelect(index)}
                  className={`h-1 rounded-full transition-all ${
                    index === scene
                      ? "w-7 bg-[#8062ff]"
                      : index < scene
                      ? "w-3 bg-[#b8ace5]"
                      : "w-3 bg-[#ddd8d2]"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onPrevious}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#e3ded8] bg-white text-[#756d7b] transition hover:bg-[#f7f5f2]"
            >
              <ChevronLeft size={11} />
            </button>

            <button
              onClick={onPause}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#e3ded8] bg-white text-[#756d7b] transition hover:bg-[#f7f5f2]"
            >
              {paused ? (
                <Play size={10} />
              ) : (
                <Pause size={10} />
              )}
            </button>

            <button
              onClick={onNext}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#e3ded8] bg-white text-[#756d7b] transition hover:bg-[#f7f5f2]"
            >
              <ChevronRight size={11} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   CHART HELPERS
============================================================ */

function buildLinePath(values) {
  if (!values?.length) return "";

  return values
    .map((value, index) => {
      const x =
        20 +
        (index / (values.length - 1)) *
          680;

      const y = 285 - value * 2.25;

      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function buildAreaPath(values) {
  if (!values?.length) return "";

  const line = buildLinePath(values);

  return `${line} L 700 310 L 20 310 Z`;
}

function buildPortfolioPath(values) {
  return values
    .map((value, index) => {
      const x =
        (index / (values.length - 1)) * 700;

      const y = 220 - value * 2.2;

      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function buildPortfolioArea(values) {
  const line = buildPortfolioPath(values);

  return `${line} L 700 240 L 0 240 Z`;
}

