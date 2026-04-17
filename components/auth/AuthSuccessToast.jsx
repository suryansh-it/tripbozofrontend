"use client";

import React from "react";

export default function AuthSuccessToast({ message }) {
  return (
    <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full border border-emerald-300 bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-xl">
      {message}
    </div>
  );
}
