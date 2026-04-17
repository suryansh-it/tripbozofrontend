// src/utils/api.js

import axios from "axios";
import { sampleApps } from "@/src/app/data/sampleApps";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://tripbozo.onrender.com/api";
const useApi = true;
const isBrowser = typeof window !== "undefined";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // timeout: 30000 
});

// Blob client only for downloading files
const apiBlob = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10_000,
    responseType: "blob",
  });

export function normalizeAuthError(err, fallbackMessage = "Something went wrong. Please try again.") {
  const responseData = err?.response?.data;
  const status = err?.response?.status;

  const statusMessage = (() => {
    switch (status) {
      case 400:
        return "Please check the details you entered.";
      case 401:
        return "Wrong email, username, or password.";
      case 403:
        return "You are not allowed to sign in with that account.";
      case 404:
        return "We could not find an account for those details. Create one first.";
      case 408:
        return "The request timed out. Please try again.";
      case 409:
        return "An account with those details already exists.";
      case 422:
        return "Please review the highlighted fields and try again.";
      case 429:
        return "Too many attempts. Please wait a moment and try again.";
      case 500:
      case 502:
      case 503:
      case 504:
        return "The server is having trouble right now. Please try again shortly.";
      default:
        return fallbackMessage;
    }
  })();

  const rawMessage =
    typeof responseData === "string"
      ? responseData
      : responseData?.detail ||
        responseData?.non_field_errors?.[0] ||
        responseData?.error ||
        responseData?.message ||
        statusMessage;

  const normalizedMessage =
    typeof rawMessage === "string"
      ? rawMessage
          .replace(/^Request failed with status code\s+\d+\.?\s*/i, "")
          .trim()
      : statusMessage;

  if (!responseData) {
    return {
      message: normalizedMessage || err?.message || fallbackMessage,
      fields: {},
    };
  }

  const fields = {};
  Object.entries(responseData).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      fields[key] = value;
    } else if (typeof value === "string") {
      fields[key] = [value];
    }
  });

  const detail =
    normalizedMessage ||
    responseData.detail ||
    responseData.non_field_errors?.[0] ||
    responseData.error ||
    responseData.message ||
    fallbackMessage;

  return {
    message: detail,
    fields,
  };
}

export function getFriendlyAuthMessage(err, fallbackMessage, context = "generic") {
  const normalized = normalizeAuthError(err, fallbackMessage);
  const status = err?.response?.status;
  const message = normalized.message || fallbackMessage;
  const lowerMessage = String(message).toLowerCase();

  if (context === "google") {
    if (status === 404 || /no account|not found|does not exist|unknown user|no active account/.test(lowerMessage)) {
      return "No account is linked to this Google sign-in. Create an account first or use a registered Google account.";
    }

    if (status === 401 || /unauthorized|invalid token|token/.test(lowerMessage)) {
      return "Google sign-in was not accepted. Please try again or use another sign-in method.";
    }
  }

  if (context === "login") {
    if (status === 404 || /no account|not found|does not exist|unknown user|no active account/.test(lowerMessage)) {
      return "We could not find an account with that email or username. Create one first.";
    }

    if (status === 401 || /incorrect|invalid|wrong password|authentication failed/.test(lowerMessage)) {
      return "Wrong email, username, or password.";
    }
  }

  if (context === "register") {
    if (status === 409 || /already exists|already taken|unique/.test(lowerMessage)) {
      return "An account with those details already exists. Try logging in instead.";
    }
  }

  return message;
}

function getAuthHeaders() {
  if (!isBrowser) return {};
  const token = localStorage.getItem("authToken");
  if (!token) return {};
  const isJwt = token.split(".").length === 3;
  return {
    Authorization: isJwt ? `Bearer ${token}` : `Token ${token}`,
  };
}

/** ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * 1) Initialize a new session (stores empty list in Redis, returns session_id)
 */
export async function initSession() {
  if (!useApi) {
    console.info("[TripBozo API] initSession disabled → returning dummy ID");
    return "dummy-session";
  }

  try {
    const res = await apiClient.post(`/personalized-list/init-session/`);
    return res.data.session_id;
  } catch (err) {
    console.warn("[TripBozo API] initSession failed:", err.message);
    return null;
  }
}

/** ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * 2) Save selected apps under a new session ID.
 *    POST /personalized-list/  { selected_apps: [1,2,3] }
 */
export async function saveSelectedApps(appIds = []) {
  if (!useApi) {
    console.info("[TripBozo API] saveSelectedApps disabled → skipping call");
    return { session_id: "dummy-session", selected_apps: [] };
  }
  try {
    const res = await apiClient.post(`/personalized-list/`, {
      selected_apps: appIds,
    });
    return res.data;
  } catch (err) {
    console.warn("[TripBozo API] saveSelectedApps failed:", err.message);
    return { session_id: null, selected_apps: [] };
  }
}

/** ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * 3) Fetch the Base64 QR code payload + serialized app data for a given session.
 *    GET /personalized-list/qr/{sessionId}/
 */
export async function fetchQRCode(sessionId) {
  if (!useApi) {
    console.info("[TripBozo API] fetchQRCode disabled → returning dummy QR");
    return { qr_code: "/dummy-qr.png", selected_apps: sampleApps };
  }
  try {
    const res = await apiClient.get(`/personalized-list/qr/${sessionId}/`);
    return {
      qr_code: res.data.qr_code,
      selected_apps: res.data.selected_apps,
      shareable_url: res.data.shareable_url,
    };
  } catch (err) {
    console.warn("[TripBozo API] fetchQRCode failed:", err.message);
    return { qr_code: null, selected_apps: [] };
  }
}

/** ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * 4) Fetch details for a list of app IDs.
 *    (fallback to sampleApps if no real bulk endpoint exists)
 */
export async function fetchAppsByIds(appIds = []) {
  if (!useApi) {
    return sampleApps.filter((app) => appIds.includes(app.id));
  }

  // If you have a real `/apps/bulk/` endpoint you would do:
  // const res = await apiClient.post(`/apps/bulk/`, { ids: appIds });
  // return res.data;

  console.warn(
    "[TripBozo API] No /apps/bulk endpoint—returning sampleApps for selected IDs"
  );
  return sampleApps.filter((app) => appIds.includes(app.id));
}

/** ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * 5) Fetch a list of countries matching the search query:
 *    GET /homepage/search/?query=...
 */
export async function searchCountries(query) {
  if (!useApi) {
    console.info("[TripBozo API] searchCountries disabled → returning empty");
    return [];
  }
  if (isBrowser) {
    try {
      const proxyRes = await fetch(
        `/api/proxy/homepage/search?query=${encodeURIComponent(query || "")}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        }
      );
      if (proxyRes.ok) {
        const proxyJson = await proxyRes.json();
        return proxyJson?.results || [];
      }
    } catch {
      // Fall through to direct API attempt.
    }
  }

  try {
    const res = await apiClient.get(`/homepage/search/`, {
      params: { query },
    });
    return res.data.results || [];
  } catch (err) {
    console.warn("[TripBozo API] Failed to search countries:", err.message);
    try {
      const proxyRes = await fetch(
        `/api/proxy/homepage/search?query=${encodeURIComponent(query || "")}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        }
      );
      if (!proxyRes.ok) return [];
      const proxyJson = await proxyRes.json();
      return proxyJson?.results || [];
    } catch {
      return [];
    }
  }
}

/** ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * 6) NEW: Fetch apps for a given country code (e.g. "FR", "CN").
 *    GET /country/<countryCode>/apps/
 *    If no real data, fallback to sampleApps.
 */

/** Fetch country metadata (code, name, description, flag, categories, etc.) */
export async function fetchCountryInfo(countryCode) {
  // if (!useApi) {
  //   return { code: countryCode, name: countryCode, description: "", flag: null };
  // }
  if (isBrowser) {
    try {
      const proxyRes = await fetch(`/api/proxy/country/${countryCode}/`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (proxyRes.ok) {
        const proxyJson = await proxyRes.json();
        return proxyJson;
      }
    } catch {
      // Fall through to direct API attempt.
    }
  }
  try {
    const res = await apiClient.get(`/country/${countryCode}/`);
    return res.data;
  } catch (err) {
    console.warn(`Failed to fetch country info for ${countryCode}:`, err);
    try {
      const proxyRes = await fetch(`/api/proxy/country/${countryCode}/`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (proxyRes.ok) {
        const proxyJson = await proxyRes.json();
        return proxyJson;
      }
    } catch {
      // no-op
    }
    return { code: countryCode, name: countryCode, description: "",};
  }
}

/** Fetch the apps for a given country code */
export async function fetchAppsByCountry(countryCode) {
  // if (!useApi) {
  //   return sampleApps;
  // }
  if (isBrowser) {
    try {
      const proxyRes = await fetch(`/api/proxy/country/${countryCode}/apps/`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (proxyRes.ok) {
        const proxyJson = await proxyRes.json();
        return Array.isArray(proxyJson) ? proxyJson : [];
      }
    } catch {
      // Fall through to direct API attempt.
    }
  }
  try {
    const res = await apiClient.get(`/country/${countryCode}/apps/`);
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.warn(`Failed to fetch apps for country ${countryCode}:`, err);
    try {
      const proxyRes = await fetch(`/api/proxy/country/${countryCode}/apps/`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!proxyRes.ok) return [];
      const proxyJson = await proxyRes.json();
      return Array.isArray(proxyJson) ? proxyJson : [];
    } catch {
      return [];
    }
  }
}

export async function fetchCountryTravelUpdates(countryCode) {
  if (isBrowser) {
    try {
      const proxyRes = await fetch(`/api/proxy/country/${countryCode}/travel-updates/`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (proxyRes.ok) {
        const proxyJson = await proxyRes.json();
        return {
          updates: Array.isArray(proxyJson?.updates) ? proxyJson.updates : [],
          signal: proxyJson?.signal || {},
          weather: proxyJson?.weather || {},
        };
      }
    } catch {
      // Fall through to direct API attempt.
    }
  }

  try {
    const res = await apiClient.get(`/country/${countryCode}/travel-updates/`);
    return {
      updates: Array.isArray(res?.data?.updates) ? res.data.updates : [],
      signal: res?.data?.signal || {},
      weather: res?.data?.weather || {},
    };
  } catch {
    return { updates: [], signal: {}, weather: {} };
  }
}

export async function fetchTravelerInsight(countryCode, appId) {
  if (!countryCode || !appId) return null;

  if (isBrowser) {
    try {
      const proxyRes = await fetch(`/api/proxy/country/${countryCode}/apps/${appId}/insights/`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (proxyRes.ok) {
        return await proxyRes.json();
      }
    } catch {
      // Fall through to direct API attempt.
    }
  }

  try {
    const res = await apiClient.get(`/country/${countryCode}/apps/${appId}/insights/`);
    return res?.data || null;
  } catch {
    return null;
  }
}

export async function downloadAppList(sessionId) {
    // GET /personalized-list/download-text/:sessionId/
    const res = await apiBlob.get(
      `/personalized-list/download-text/${sessionId}/`
    );
    return res.data; // this is a Blob
  }
  
  export async function downloadQRCode(sessionId) {
    // GET /personalized-list/download-qr/:sessionId/
    const res = await apiBlob.get(
      `/personalized-list/download-qr/${sessionId}/`
    );
    return res.data; // Blob
  }

/** ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * 7) Fetch essentials data for a given country code with improved error handling
 *    GET /country/<countryCode>/essentials/
 */
  export async function fetchEssentials(countryCode, originCountryCode = "") {
    if (!useApi) {
      console.info("[TripBozo API] fetchEssentials disabled → returning dummy data");
      return {
        emergencies: [],
        phrases: [],
        tips: [],
        embassy_contacts: [],
      };
    }
  
    try {
    // Create a promise that rejects after 5 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 10000);
    });

    // Race the actual request against the timeout
    const res = await Promise.race([
      apiClient.get(`/country/${countryCode}/essentials/`, {
        params: originCountryCode ? { origin_country: originCountryCode } : {},
      }),
      timeoutPromise
    ]);

    return res.data || {
      emergencies: [],
      phrases: [],
      tips: [],
      embassy_contacts: [],
    };
    } catch (err) {
      console.warn(`[TripBozo API] Failed to fetch essentials for ${countryCode}:`, err.message);

      // Fallback for local development when browser CORS blocks direct API calls.
      try {
        const query = originCountryCode ? `?origin_country=${encodeURIComponent(originCountryCode)}` : "";
        const proxyRes = await fetch(`/api/essentials/${countryCode}/${query}`, {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        if (proxyRes.ok) {
          const proxyJson = await proxyRes.json();
          return proxyJson || { emergencies: [], phrases: [], tips: [], embassy_contacts: [] };
        }
      } catch (proxyErr) {
        console.warn(`[TripBozo API] Proxy fallback also failed for ${countryCode}:`, proxyErr.message);
      }

      // Return an empty object instead of throwing, so the component can handle it
      return {
        emergencies: [],
        phrases: [],
        tips: [],
        embassy_contacts: [],
      };
    }
  }

export async function fetchUserOriginCountryPreference() {
  const headers = getAuthHeaders();
  if (!headers.Authorization) return null;

  try {
    const res = await apiClient.get(`/auth/user/origin-country/`, { headers });
    return res?.data || null;
  } catch {
    return null;
  }
}

export async function updateUserOriginCountryPreference(originCountryCode = "") {
  const headers = getAuthHeaders();
  if (!headers.Authorization) return null;

  try {
    const res = await apiClient.put(
      `/auth/user/origin-country/`,
      { origin_country_code: originCountryCode || "" },
      { headers }
    );
    return res?.data || null;
  } catch {
    return null;
  }
}