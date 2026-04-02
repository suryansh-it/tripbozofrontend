// app/api/country/[country]/images/route.js
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// 1. Redis Init
let redis;
try {
  redis = Redis.fromEnv();
} catch (e) {
  console.error("🔥 Redis init failed:", e);
}

// 2. Constants
const CACHE_TTL    = 12 * 60 * 60;  // 12h
const DAILY_CAP    = 100;
const DAILY_PREFIX = "country_api_daily";

export async function GET(req, { params }) {
  const country  = (params.country || "").toLowerCase();
  const cacheKey = `country_images_${country}`;

  try {
    // 1) Serve from cache if possible
    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return NextResponse.json(JSON.parse(cached));
      }
    }

    // 2) Per‑day cap (only if redis is available)
    if (redis) {
      const today   = new Date().toISOString().slice(0,10);
      const rateKey = `${DAILY_PREFIX}_${today}`;
      const used    = parseInt(await redis.get(rateKey) || "0", 10);
      if (used >= DAILY_CAP) {
        return NextResponse.json(
          { detail: "Daily image cap reached" },
          { status: 429 }
        );
      }
    }

    // 3) Wikimedia Commons search
    const q       = encodeURIComponent(`${country} landscape`);
    const wikiRes = await fetch(
      `https://commons.wikimedia.org/w/api.php` +
      `?action=query&format=json&origin=*&prop=imageinfo` +
      `&generator=search&gsrsearch=${q}&gsrlimit=5&iiprop=url`
    );
    const data    = await wikiRes.json();
    const pages   = data.query?.pages || {};
    const urls    = Object.values(pages)
                        .map(p => p.imageinfo?.[0]?.url)
                        .filter(Boolean);

    if (!urls.length) {
      return NextResponse.json(
        { detail: "No images found for this country" },
        { status: 404 }
      );
    }

    // 4) Cache result & bump counter (if redis ready)
    if (redis) {
      const today   = new Date().toISOString().slice(0,10);
      const rateKey = `${DAILY_PREFIX}_${today}`;

      await Promise.all([
        redis.set(cacheKey, JSON.stringify(urls), { ex: CACHE_TTL }),
        redis.incr(rateKey),
        redis.expire(rateKey, 24 * 60 * 60),
      ]);
    }

    return NextResponse.json(urls);
  } catch (err) {
    console.error("🔥 Wikimedia API error:", err);
    // Always return something so the page doesn’t 502
    return NextResponse.json(
      { detail: "Image fetching failed" },
      { status: 500 }
    );
  }
}
