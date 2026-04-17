"use client";

import React from "react";

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className="fixed inset-0 -z-20 bg-[linear-gradient(135deg,#051923_0%,#0f3b4a_45%,#0f766e_100%)]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.14),transparent_22%),radial-gradient(circle_at_80%_70%,rgba(16,185,129,0.12),transparent_24%)]" />

      <main className="min-h-screen px-4 py-10 sm:py-14 flex items-center justify-center">
        <section className="w-full max-w-md rounded-[1.75rem] border border-white/20 bg-white/92 px-6 py-7 sm:px-8 sm:py-8 shadow-[0_24px_80px_rgba(2,6,23,0.35)] backdrop-blur-xl">
          <header className="mb-7 text-center">
            <h1 className="text-[2rem] font-extrabold tracking-tight text-slate-900">{title}</h1>
            <p className="mt-1.5 text-sm text-slate-600">{subtitle}</p>
          </header>
          {children}
        </section>
      </main>
    </div>
  );
}
