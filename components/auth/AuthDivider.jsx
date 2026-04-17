"use client";

import React from "react";

export default function AuthDivider({ text = "or" }) {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-300" />
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{text}</span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-300" />
    </div>
  );
}
