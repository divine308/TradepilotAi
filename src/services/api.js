import axios from "axios";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000"
).replace(/\/$/, "");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

/* ============================================================
   JWT
============================================================ */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ============================================================
   RESPONSE / AUTH ERROR
============================================================ */

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("access_token");

      const path = window.location.pathname;

      if (
        path !== "/login" &&
        path !== "/register"
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

/* ============================================================
   ERROR HELPER
============================================================ */

export function getApiErrorMessage(
  error,
  fallback = "Something went wrong."
) {
  return (
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

/* ============================================================
   AUTH
============================================================ */

export async function login(email, password) {
  const response = await api.post(
    "/api/auth/login",
    {
      email,
      password,
    }
  );

  return response.data;
}

export async function register(
  name,
  email,
  password
) {
  const response = await api.post(
    "/api/auth/register",
    {
      name,
      email,
      password,
    }
  );

  return response.data;
}

/* ============================================================
   DASHBOARD
============================================================ */

export async function getDashboardOverview() {
  const response = await api.get(
    "/api/dashboard/overview"
  );

  return response.data;
}

/* ============================================================
   TRADING ACCOUNT
============================================================ */

export async function getAccount() {
  const response = await api.get(
    "/api/trading/account"
  );

  return response.data;
}

/* ============================================================
   POSITIONS
============================================================ */

export async function getPositions() {
  const response = await api.get(
    "/api/trading/positions"
  );

  const data = response.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.positions)) {
    return data.positions;
  }

  return [];
}


/* ============================================================
   AI AGENT ANALYSIS
============================================================ */

export async function analyzeSymbol(symbol) {
  const response = await api.post(
    "/api/trading/analyze",
    {
      symbol: String(symbol)
        .trim()
        .toUpperCase(),
    }
  );

  return response.data;
}


/* ============================================================
   MULTI-SYMBOL AGENT ANALYSIS
============================================================ */

export async function analyzeAgentSymbols(symbols) {
  const results = await Promise.allSettled(
    symbols.map((symbol) =>
      analyzeSymbol(symbol)
    )
  );

  return results.map((result, index) => ({
    symbol: symbols[index],

    success:
      result.status === "fulfilled",

    data:
      result.status === "fulfilled"
        ? result.value
        : null,

    error:
      result.status === "rejected"
        ? getApiErrorMessage(
            result.reason,
            "Unable to analyze symbol."
          )
        : null,
  }));
}

/* ============================================================
   AUTONOMOUS AI AGENT
============================================================ */

export async function getAgentStatus() {
  const response = await api.get(
    "/api/trading/agent/status"
  );

  return response.data;
}

export async function startAgent() {
  const response = await api.post(
    "/api/trading/agent/start"
  );

  return response.data;
}

export async function stopAgent() {
  const response = await api.post(
    "/api/trading/agent/stop"
  );

  return response.data;
}

export async function scanAgent() {
  const response = await api.post(
    "/api/trading/agent/scan"
  );

  return response.data;
}

export async function getAgentActivity(
  limit = 50
) {
  const response = await api.get(
    "/api/trading/agent/activity",
    {
      params: {
        limit,
      },
    }
  );

  return response.data;
}

/* ============================================================
   EXECUTE TRADE
============================================================ */

export async function executeTrade(
  symbol,
  side,
  quantity
) {
  const response = await api.post(
    "/api/trading/execute",
    {
      symbol: String(symbol).trim().toUpperCase(),
      side,
      quantity,
    }
  );

  return response.data;
}

/* ============================================================
   LIVE DASHBOARD SNAPSHOT
============================================================ */

export async function getLiveDashboard() {
  const [
    overviewResult,
    accountResult,
    positionsResult,
  ] = await Promise.allSettled([
    getDashboardOverview(),
    getAccount(),
    getPositions(),
  ]);

  const overview =
    overviewResult.status === "fulfilled"
      ? overviewResult.value
      : null;

  const account =
    accountResult.status === "fulfilled"
      ? accountResult.value
      : null;

  const positions =
    positionsResult.status === "fulfilled"
      ? positionsResult.value
      : [];

  const errors = [];

  if (overviewResult.status === "rejected") {
    errors.push({
      source: "overview",
      error:
        overviewResult.reason?.response?.data?.detail ||
        overviewResult.reason?.message ||
        "Unable to load dashboard overview.",
    });
  }

  if (accountResult.status === "rejected") {
    errors.push({
      source: "account",
      error:
        accountResult.reason?.response?.data?.detail ||
        accountResult.reason?.message ||
        "Unable to load account.",
    });
  }

  if (positionsResult.status === "rejected") {
    errors.push({
      source: "positions",
      error:
        positionsResult.reason?.response?.data?.detail ||
        positionsResult.reason?.message ||
        "Unable to load positions.",
    });
  }

  return {
    overview,
    account,
    positions: Array.isArray(positions)
      ? positions
      : [],
    syncedAt: new Date().toISOString(),
    errors,
    healthy: errors.length === 0,
  };
}


/* ============================================================
   MARKET DATA
============================================================ */

export async function getMarketBars(
  symbol,
  timeframe = "1Min",
  limit = 200
) {
  const response = await api.get(
    "/api/market/bars",
    {
      params: {
        symbol: String(symbol)
          .trim()
          .toUpperCase(),

        timeframe,

        limit,
      },
    }
  );

  return response.data;
}
/* ============================================================
   API KEYS
============================================================ */

export async function getApiKeys() {
  const response = await api.get(
    "/api/keys"
  );

  return response.data;
}

export async function createApiKey(name) {
  const response = await api.post(
    "/api/keys",
    {
      name,
    }
  );

  return response.data;
}

/* ============================================================
   CLOSE ALL POSITIONS
============================================================ */

export async function closeAllPositions() {
  const response = await api.post(
    "/api/trading/positions/close-all"
  );

  return response.data;
} 

/* ============================================================
   LOGOUT
============================================================ */

export function logout() {
  localStorage.removeItem("access_token");
  window.location.href = "/login";
}

/* ============================================================
   AUTH STATE
============================================================ */

export function isAuthenticated() {
  return Boolean(
    localStorage.getItem("access_token")
  );
}

export default api;

