"use client";

import React from "react";

export default function AuthPasswordField({
  id,
  label,
  value,
  onChange,
  show,
  onToggle,
  placeholder = "........",
  errors = [],
  required = false,
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">
        {label}
      </label>
      <div className="relative flex w-full items-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 shadow-sm transition hover:border-slate-300 hover:bg-white focus-within:border-cyan-500 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="flex-1 bg-transparent px-5 py-3.5 pr-20 text-slate-900 outline-none placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-2 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-700 shadow-sm transition hover:bg-cyan-50"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
      {Array.isArray(errors) && errors.length > 0 && (
        <ul className="mt-1.5 rounded-xl border border-rose-200/80 bg-rose-50/90 px-3 py-2 text-xs text-rose-700 shadow-sm">
          {errors.map((msg, index) => (
            <li key={`${id}_err_${index}`} className="list-disc ml-4">
              {msg}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
