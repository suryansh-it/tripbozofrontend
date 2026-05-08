// components/profile/ProfileRightPanel.jsx
"use client";

import { useEffect, useState } from "react";
import { FiMapPin, FiBookmark, FiStar, FiTrendingUp, FiGlobe, FiClock } from "react-icons/fi";
import Image from "next/image";
import { fetchProfileStats, fetchUserBookmarks } from "@/src/utils/api";

export default function ProfileRightPanel() {
  const [stats, setStats] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [statsData, bookmarksData] = await Promise.all([
          fetchProfileStats(),
          fetchUserBookmarks("country"),
        ]);

        setStats(statsData);
        setBookmarks(Array.isArray(bookmarksData) ? bookmarksData : []);
      } catch (err) {
        setError("Failed to load profile data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  if (loading) {
    return (
      <aside className="w-full lg:flex-1 rounded-[2rem] border border-white/70 bg-white/85 p-6 sm:p-8 shadow-[0_24px_70px_rgba(15,118,110,0.08)] backdrop-blur-xl">
        <div className="space-y-4 animate-pulse">
          <div className="h-10 rounded-3xl bg-slate-100 w-40" />
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-slate-100" />
            ))}
          </div>
        </div>
      </aside>
    );
  }

  const visitedCountries = stats?.visited_countries || [];
  const bookmarkStats = stats?.bookmark_stats || { total: 0, countries: 0, apps: 0 };
  const recentBookmarks = stats?.recent_bookmarks || [];

  return (
    <aside className="w-full lg:flex-1 rounded-[2rem] border border-white/70 bg-white/85 p-6 sm:p-8 shadow-[0_24px_70px_rgba(15,118,110,0.08)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Your journey</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Travel history & bookmarks</h2>
        </div>
        <div className="rounded-2xl bg-cyan-50 px-3 py-2 text-cyan-700 ring-1 ring-cyan-100">
          <FiGlobe size={20} />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Countries visited</p>
              <p className="mt-2 text-3xl font-bold text-slate-950">{visitedCountries.length}</p>
            </div>
            <div className="rounded-xl bg-cyan-200/40 p-3 text-cyan-700">
              <FiMapPin size={24} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-600">Explore more countries to expand your reach</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Total bookmarks</p>
              <p className="mt-2 text-3xl font-bold text-slate-950">{bookmarkStats.total}</p>
            </div>
            <div className="rounded-xl bg-emerald-200/40 p-3 text-emerald-700">
              <FiBookmark size={24} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-600">{bookmarkStats.countries} countries, {bookmarkStats.apps} apps</p>
        </div>
      </div>

      {/* Recently Visited Countries */}
      {visitedCountries.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <FiClock size={18} className="text-slate-600" />
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-600">Recently visited</h3>
          </div>
          <div className="grid gap-2">
            {visitedCountries.slice(0, 5).map((country) => (
              <div
                key={country.id}
                className="rounded-xl border border-slate-200 bg-white p-3 hover:bg-slate-50 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {country.flag && (
                    <Image
                      src={country.flag}
                      alt={country.name}
                      width={32}
                      height={32}
                      className="rounded-lg object-cover w-8 h-8"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">{country.name}</p>
                    <p className="text-xs text-slate-500">{country.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">{country.visits} visits</span>
                  <FiTrendingUp size={14} className="text-cyan-600 opacity-0 group-hover:opacity-100 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookmarked Countries */}
      {recentBookmarks.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <FiStar size={18} className="text-slate-600" />
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-600">Your bookmarks</h3>
          </div>
          <div className="grid gap-2">
            {recentBookmarks.slice(0, 5).map((country) => (
              <div
                key={country.id}
                className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 hover:bg-amber-50 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {country.flag && (
                    <Image
                      src={country.flag}
                      alt={country.name}
                      width={32}
                      height={32}
                      className="rounded-lg object-cover w-8 h-8"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">{country.name}</p>
                    <p className="text-xs text-slate-500">{country.code}</p>
                  </div>
                </div>
                <FiBookmark size={16} className="text-amber-600 ml-2 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {visitedCountries.length === 0 && recentBookmarks.length === 0 && !loading && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-6 text-center">
          <FiMapPin size={32} className="mx-auto text-slate-400 mb-3" />
          <p className="text-sm font-semibold text-slate-700">No travel history yet</p>
          <p className="text-xs text-slate-600 mt-1">
            Explore countries to see your journey grow here
          </p>
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}
    </aside>
  );
}
