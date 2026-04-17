"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { FiEdit3, FiLogOut, FiMapPin, FiShield, FiUser, FiArrowRight } from "react-icons/fi";
import { fetchUserOriginCountryPreference } from "@/src/utils/api";

const emptyProfile = {
  name: "",
  username: "",
  email: "",
  dp: null,
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(emptyProfile);
  const [originCountry, setOriginCountry] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [dpPreview, setDpPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const authHeader = useMemo(() => {
    if (!authToken) return null;
    const isJwt = authToken.split(".").length === 3;
    return isJwt ? `Bearer ${authToken}` : `Token ${authToken}`;
  }, [authToken]);

  useEffect(() => {
    let mounted = true;

    const hydrateProfile = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        if (!authHeader) {
          if (!mounted) return;
          setErrorMessage("Please sign in to view your profile.");
          setLoading(false);
          return;
        }

        const [userRes, originRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/`, {
            headers: { Authorization: authHeader },
          }),
          fetchUserOriginCountryPreference(),
        ]);

        const storedProfile = (() => {
          try {
            return JSON.parse(localStorage.getItem("profileData") || "null");
          } catch {
            return null;
          }
        })();

        const user = userRes?.data || {};
        const mergedProfile = {
          name: storedProfile?.name || user.first_name || user.username || "Traveler",
          username: storedProfile?.username || user.username || "—",
          email: storedProfile?.email || user.email || "—",
          dp: storedProfile?.dp || null,
        };

        if (!mounted) return;
        setProfile(mergedProfile);
        setDpPreview(mergedProfile.dp);
        setOriginCountry(originRes?.origin_country || null);
      } catch (err) {
        if (!mounted) return;
        setErrorMessage("We could not load your profile right now. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    hydrateProfile();
    return () => {
      mounted = false;
    };
  }, [authHeader]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleDpChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 160;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.78);

        setDpPreview(dataUrl);
        setProfile((prev) => ({ ...prev, dp: dataUrl }));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setSaving(true);
    localStorage.setItem(
      "profileData",
      JSON.stringify({
        name: profile.name,
        username: profile.username,
        email: profile.email,
        dp: dpPreview || profile.dp || null,
      })
    );
    setTimeout(() => {
      setEditMode(false);
      setSaving(false);
    }, 300);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("profileData");
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_24%),linear-gradient(180deg,_#f7fbff_0%,_#eef6fb_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-[-8rem] top-16 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-7rem] bottom-12 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8 lg:flex-row">
        <section className="w-full lg:w-[34rem] rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_24px_70px_rgba(15,118,110,0.12)] backdrop-blur-xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-teal-900 px-6 py-6 text-white sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-200/80">Profile studio</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">Your travel profile</h1>
                <p className="mt-2 max-w-xl text-sm text-slate-200/90">
                  A cleaner view of your identity, your saved origin country, and the settings powering Essentials.
                </p>
              </div>
              <div className="hidden rounded-2xl border border-white/10 bg-white/10 p-3 text-teal-100 sm:block">
                <FiShield size={24} />
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-24 rounded-3xl bg-slate-100" />
                <div className="h-44 rounded-3xl bg-slate-100" />
              </div>
            ) : errorMessage ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
                {errorMessage}
                <div className="mt-4">
                  <Link href="/login" className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                    Sign in
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="relative h-24 w-24 overflow-hidden rounded-[1.5rem] border border-cyan-100 bg-gradient-to-br from-cyan-100 to-emerald-100 shadow-md">
                      {dpPreview ? (
                        <Image src={dpPreview} alt="Profile" fill sizes="96px" className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-4xl text-cyan-700">
                          <FiUser />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-2xl font-semibold tracking-tight text-slate-950">
                          {profile.name || profile.username || "Traveler"}
                        </p>
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                          Verified account
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{profile.email}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">
                          <FiUser /> @{profile.username}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-800 ring-1 ring-cyan-100">
                          <FiMapPin /> {originCountry ? `${originCountry.name}` : "Origin not set"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Origin country</p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {originCountry ? originCountry.name : "Not set yet"}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {originCountry
                        ? `Personalized embassy and Essentials guidance will use ${originCountry.code}.`
                        : "Set this in onboarding for a more tailored travel experience."}
                    </p>
                    <Link
                      href="/Onboarding"
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Update origin <FiArrowRight />
                    </Link>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-4 shadow-sm">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Travel stack</p>
                    <ul className="mt-2 space-y-2 text-sm text-slate-700">
                      <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-teal-500" /> Live travel updates</li>
                      <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-cyan-500" /> Essentials + emergency guidance</li>
                      <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Origin-aware assistance</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-950">Profile details</h2>
                      <p className="text-sm text-slate-600">A cleaner, sharper view of your account data.</p>
                    </div>
                    {!editMode ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-cyan-200 hover:bg-cyan-50"
                        onClick={() => setEditMode(true)}
                      >
                        <FiEdit3 /> Edit profile
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-5 grid gap-4">
                    <label className="space-y-2">
                      <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Full name</span>
                      <input
                        name="name"
                        type="text"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 disabled:bg-slate-50 disabled:text-slate-700"
                        value={profile.name}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Username</span>
                      <input
                        name="username"
                        type="text"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 disabled:bg-slate-50 disabled:text-slate-700"
                        value={profile.username}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Email</span>
                      <input
                        name="email"
                        type="email"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 disabled:bg-slate-50 disabled:text-slate-700"
                        value={profile.email}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </label>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    {editMode ? (
                      <button
                        type="button"
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-600 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-70"
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Save changes"}
                      </button>
                    ) : null}

                    {!editMode ? (
                      <button
                        type="button"
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 ring-1 ring-rose-200 transition hover:bg-rose-100"
                        onClick={handleLogout}
                      >
                        <FiLogOut /> Logout
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                        onClick={() => {
                          setEditMode(false);
                          setProfile((prev) => ({ ...prev }));
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        <aside className="w-full lg:flex-1 rounded-[2rem] border border-white/70 bg-white/85 p-6 sm:p-8 shadow-[0_24px_70px_rgba(15,118,110,0.08)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Quick actions</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Travel tools at a glance</h2>
            </div>
            <div className="rounded-2xl bg-cyan-50 px-3 py-2 text-cyan-700 ring-1 ring-cyan-100">
              <FiShield size={20} />
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Origin-aware Essentials",
                text: "Your saved origin country powers embassy, consular, and local assistance details.",
              },
              {
                title: "Live travel updates",
                text: "Track advisories, weather, and travel changes without hunting across the web.",
              },
              {
                title: "Bundle ready",
                text: "Use curated app bundles to install the right travel stack faster.",
              },
              {
                title: "Keep it private",
                text: "Your profile data stays tied to your account and saved preferences.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/Onboarding"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Open onboarding <FiArrowRight />
            </Link>
            <Link
              href="/"
              className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-cyan-200 hover:bg-cyan-50"
            >
              Back to home
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
