"use client";

import React from "react";

export default function AuthTextField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  errors = [],
  required = false,
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-full border border-slate-200 bg-slate-50 px-5 py-3.5 text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-cyan-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]"
      />
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
