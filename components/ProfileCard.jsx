// src/components/ProfileCard.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { FiUser, FiLogOut, FiTrash2, FiMapPin, FiChevronRight } from "react-icons/fi";
import { fetchUserOriginCountryPreference } from "@/src/utils/api";

export default function ProfileCard({ open, onClose }) {
  const ref = useRef();
  const [user, setUser] = useState(null);
  const [originCountry, setOriginCountry] = useState(null);
  const rawToken =
    typeof window !== "undefined" && localStorage.getItem("authToken");

  // click‐outside to close
  useEffect(() => {
    const onClick = (e) => {
      if (open && ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, onClose]);

  // fetch user
  useEffect(() => {
    if (!open || !rawToken) return;
    const isJwt = rawToken.split(".").length === 3;
    const headerValue = isJwt ? `Bearer ${rawToken}` : `Token ${rawToken}`;

    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/`, {
        headers: { Authorization: headerValue },
      })
      .then((r) => setUser(r.data))
      .catch(() => setUser(null));
  }, [open, rawToken]);

  useEffect(() => {
    if (!open || !rawToken) {
      setOriginCountry(null);
      return;
    }

    let mounted = true;
    fetchUserOriginCountryPreference().then((data) => {
      if (!mounted) return;
      setOriginCountry(data?.origin_country || null);
    });

    return () => {
      mounted = false;
    };
  }, [open, rawToken]);

  if (!open) return null;

  // shared clear function
  const clearAuth = () => {
    localStorage.removeItem("authToken");
  };

  const handleLogout = () => {
    clearAuth();
    window.location.reload();
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "This will permanently delete your account. Are you sure you want to proceed?"
      )
    ) {
      return;
    }

    // pick correct header
    const isJwt = rawToken.split(".").length === 3;
    const headerValue = isJwt ? `Bearer ${rawToken}` : `Token ${rawToken}`;

    try {
      // server‐side delete
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/delete/`,
        { headers: { Authorization: headerValue } }
      );
    } catch (err) {
      console.error("Failed to delete account on server:", err);
      alert("Could not delete your account. Please try again.");
      return;
    }

    // now purge local data
    clearAuth();
    localStorage.removeItem("profileData");
    window.location.reload();
  };

  return (
    <div
      ref={ref}
      className="
        fixed top-16 right-4 w-[22rem] max-w-[calc(100vw-2rem)]
        overflow-hidden z-50 animate-fade-in-down
      "
    >
      <div className="rounded-3xl border border-white/70 bg-white/90 shadow-[0_20px_60px_rgba(15,118,110,0.18)] backdrop-blur-xl">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-teal-900 px-6 py-5 text-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 text-white">
                <FiUser size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/80">
                  Travel profile
                </p>
                <p className="mt-1 text-lg font-semibold leading-tight">
                  {user?.username || "Traveler"}
                </p>
              </div>
            </div>
            <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-100">
              Active
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-700">
                <FiUser size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Account
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {user?.email || "Sign in to load your profile"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Username
                </p>
                <p className="mt-1 font-semibold text-slate-900 break-words">
                  {user?.username || "—"}
                </p>
              </div>
              <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Origin
                </p>
                <p className="mt-1 font-semibold text-slate-900 break-words">
                  {originCountry ? originCountry.name : "Not set"}
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/not-profile"
            onClick={onClose}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-cyan-200 hover:bg-cyan-50/80"
          >
            <span className="flex items-center gap-2">
              <FiMapPin className="text-teal-600" />
              View full profile
            </span>
            <FiChevronRight className="text-slate-400" />
          </Link>
          </div>

        <div className="border-t border-slate-200/80 bg-white px-6 py-4">
          <div className="flex gap-2">
          <button
            onClick={handleLogout}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 hover:text-rose-800"
          >
            <FiLogOut size={16} /> Logout
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
          >
            <FiTrash2 size={16} /> Delete
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
