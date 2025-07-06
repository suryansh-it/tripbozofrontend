// src/utils/api.js

import axios from "axios";
import { sampleApps } from "@/src/app/data/sampleApps";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://tripbozo.onrender.com/api";
const useApi = true;

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
  try {
    const res = await apiClient.get(`/homepage/search/`, {
      params: { query },
    });
    return res.data.results || [];
  } catch (err) {
    console.warn("[TripBozo API] Failed to search countries:", err.message);
    return [];
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
  try {
    const res = await apiClient.get(`/country/${countryCode}/`);
    return res.data;
  } catch (err) {
    console.warn(`Failed to fetch country info for ${countryCode}:`, err);
    return { code: countryCode, name: countryCode, description: "",};
  }
}

/** Fetch the apps for a given country code */
export async function fetchAppsByCountry(countryCode) {
  // if (!useApi) {
  //   return sampleApps;
  // }
  try {
    const res = await apiClient.get(`/country/${countryCode}/apps/`);
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.warn(`Failed to fetch apps for country ${countryCode}:`, err);
    return [];
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
  export async function fetchEssentials(countryCode) {
    if (!useApi) {
      console.info("[TripBozo API] fetchEssentials disabled → returning dummy data");
      return {
        emergencies: [],
        phrases: [],
        tips: [],
      };
    }
  
    try {
    // Create a promise that rejects after 5 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 10000);
    });

    // Race the actual request against the timeout
    const res = await Promise.race([
      apiClient.get(`/country/${countryCode}/essentials/`),
      timeoutPromise
    ]);

    return res.data || {
      emergencies: [],
      phrases: [],
      tips: [],
    };
    } catch (err) {
      console.warn(`[TripBozo API] Failed to fetch essentials for ${countryCode}:`, err.message);
    // Return an empty object instead of throwing, so the component can handle it
      return {
        emergencies: [],
        phrases: [],
        tips: [],
      };
    }
  }