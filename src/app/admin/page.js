"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiUpload, FiDatabase, FiTrendingUp, FiMessageCircle, FiGlobe, FiPlus, FiRefreshCw } from "react-icons/fi";
import {
  fetchAdminOptions,
  fetchAdminSummary,
  submitAdminCsv,
  submitAdminRecord,
} from "@/src/utils/api";

const RESOURCE_CONFIG = [
  {
    key: "country",
    label: "Country",
    description: "Create or update destination records.",
    csvHint: "name,code,description",
    fields: [
      { name: "name", label: "Country name", type: "text", placeholder: "France" },
      { name: "code", label: "Country code", type: "text", placeholder: "FR" },
      { name: "description", label: "Description", type: "textarea", placeholder: "Short travel summary" },
    ],
  },
  {
    key: "app_category",
    label: "App Category",
    description: "Group travel apps into categories.",
    csvHint: "name,description",
    fields: [
      { name: "name", label: "Category name", type: "text", placeholder: "Navigation" },
      { name: "description", label: "Description", type: "textarea", placeholder: "What this category covers" },
    ],
  },
  {
    key: "travel_app",
    label: "Travel App",
    description: "Add app entries for a country and category.",
    csvHint: "name,country_code,category_name,description,android_link,ios_link,website_link",
    fields: [
      { name: "name", label: "App name", type: "text", placeholder: "Moovit" },
      { name: "country_code", label: "Country", type: "select", source: "countries" },
      { name: "category_name", label: "Category", type: "select", source: "categories" },
      { name: "description", label: "Description", type: "textarea", placeholder: "Short app description" },
      { name: "icon_url", label: "Icon URL", type: "text", placeholder: "https://..." },
      { name: "android_link", label: "Android link", type: "text", placeholder: "https://play.google.com/..." },
      { name: "ios_link", label: "iOS link", type: "text", placeholder: "https://apps.apple.com/..." },
      { name: "website_link", label: "Website link", type: "text", placeholder: "https://..." },
      { name: "affiliate_url", label: "Affiliate URL", type: "text", placeholder: "https://..." },
      { name: "is_sponsored", label: "Sponsored", type: "toggle" },
      { name: "supports_foreign_cards", label: "Supports foreign cards", type: "toggle" },
      { name: "works_offline", label: "Works offline", type: "toggle" },
    ],
  },
  {
    key: "service_provider",
    label: "Service Provider",
    description: "Manage services shown on the compare page.",
    csvHint: "country_code,section,name,price_from,coverage,support,refund,site,is_featured,notes",
    fields: [
      { name: "country_code", label: "Country", type: "select", source: "countries" },
      { name: "section", label: "Section", type: "select", source: "service_sections" },
      { name: "name", label: "Provider name", type: "text", placeholder: "Airalo" },
      { name: "price_from", label: "Price from", type: "text", placeholder: "$4.50" },
      { name: "coverage", label: "Coverage", type: "text", placeholder: "200+ countries" },
      { name: "support", label: "Support", type: "text", placeholder: "24/7 chat" },
      { name: "refund", label: "Refund", type: "text", placeholder: "Partial" },
      { name: "site", label: "Website", type: "text", placeholder: "https://..." },
      { name: "notes", label: "Notes", type: "textarea", placeholder: "Optional notes" },
      { name: "is_featured", label: "Featured", type: "toggle" },
    ],
  },
  {
    key: "emergency_contact",
    label: "Emergency Contact",
    description: "Add emergency support contacts.",
    csvHint: "country_code,name,phone,email,description",
    fields: [
      { name: "country_code", label: "Country", type: "select", source: "countries" },
      { name: "name", label: "Name", type: "text", placeholder: "US Embassy Paris" },
      { name: "phone", label: "Phone", type: "text", placeholder: "+33 ..." },
      { name: "email", label: "Email", type: "text", placeholder: "office@example.com" },
      { name: "description", label: "Description", type: "textarea", placeholder: "Optional note" },
    ],
  },
  {
    key: "local_phrase",
    label: "Local Phrase",
    description: "Add translations for quick travel phrases.",
    csvHint: "country_code,original,translation,context_note",
    fields: [
      { name: "country_code", label: "Country", type: "select", source: "countries" },
      { name: "original", label: "Original phrase", type: "text", placeholder: "Where is the station?" },
      { name: "translation", label: "Translation", type: "text", placeholder: "Où est la gare ?" },
      { name: "context_note", label: "Context note", type: "textarea", placeholder: "Use when asking directions" },
    ],
  },
  {
    key: "useful_tip",
    label: "Useful Tip",
    description: "Add practical destination tips.",
    csvHint: "country_code,tip",
    fields: [
      { name: "country_code", label: "Country", type: "select", source: "countries" },
      { name: "tip", label: "Tip", type: "textarea", placeholder: "Carry a contactless card..." },
    ],
  },
  {
    key: "origin_assistance",
    label: "Origin Assistance",
    description: "Maintain personalized consular support details.",
    csvHint: "country_code,label,emergency_phone,emergency_phone_intl,consular_address,website,mission_finder,source",
    fields: [
      { name: "country_code", label: "Country", type: "select", source: "countries" },
      { name: "label", label: "Label", type: "text", placeholder: "Foreign Affairs" },
      { name: "emergency_phone", label: "Emergency phone", type: "text", placeholder: "+1 ..." },
      { name: "emergency_phone_intl", label: "International emergency phone", type: "text", placeholder: "+1 ..." },
      { name: "consular_address", label: "Consular address", type: "text", placeholder: "Embassy address" },
      { name: "website", label: "Website", type: "text", placeholder: "https://..." },
      { name: "mission_finder", label: "Mission finder", type: "text", placeholder: "https://..." },
      { name: "source", label: "Source", type: "text", placeholder: "manual / wikidata" },
    ],
  },
];

const DEFAULT_RESOURCE = RESOURCE_CONFIG[0].key;

function buildInitialForm(resource) {
  const config = RESOURCE_CONFIG.find((item) => item.key === resource) || RESOURCE_CONFIG[0];
  return config.fields.reduce((acc, field) => {
    acc[field.name] = field.type === "toggle" ? false : "";
    return acc;
  }, {});
}

function sanitizePayload(values) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => {
      if (typeof value === "boolean") return true;
      return String(value || "").trim().length > 0;
    })
  );
}

export default function AdminPage() {
  const [summary, setSummary] = useState(null);
  const [options, setOptions] = useState({ countries: [], categories: [], service_sections: [] });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedResource, setSelectedResource] = useState(DEFAULT_RESOURCE);
  const [formData, setFormData] = useState(() => buildInitialForm(DEFAULT_RESOURCE));
  const [csvFile, setCsvFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [csvSubmitting, setCsvSubmitting] = useState(false);

  const resourceConfig = useMemo(
    () => RESOURCE_CONFIG.find((item) => item.key === selectedResource) || RESOURCE_CONFIG[0],
    [selectedResource]
  );

  const loadPanelData = async () => {
    setLoading(true);
    const [summaryData, optionsData] = await Promise.all([fetchAdminSummary(), fetchAdminOptions()]);
    setSummary(summaryData);
    if (optionsData) {
      setOptions({
        countries: optionsData.countries || [],
        categories: optionsData.categories || [],
        service_sections: optionsData.service_sections || [],
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    loadPanelData().finally(() => {
      if (active) {
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setFormData(buildInitialForm(selectedResource));
    setCsvFile(null);
    setMessage("");
  }, [selectedResource]);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    const payload = sanitizePayload(formData);
    const result = await submitAdminRecord(selectedResource, payload);
    if (result) {
      setMessage(`Saved ${resourceConfig.label.toLowerCase()} successfully.`);
      const summaryData = await fetchAdminSummary();
      if (summaryData) setSummary(summaryData);
      setFormData(buildInitialForm(selectedResource));
    } else {
      setMessage("Unable to save record. Check your admin credentials and required fields.");
    }
    setSubmitting(false);
  };

  const handleCsvSubmit = async (event) => {
    event.preventDefault();
    if (!csvFile) return;
    setCsvSubmitting(true);
    setMessage("");
    const result = await submitAdminCsv(selectedResource, csvFile);
    if (result) {
      setMessage(`Imported CSV for ${resourceConfig.label.toLowerCase()}. Created ${result.created || 0}, updated ${result.updated || 0}.`);
      const summaryData = await fetchAdminSummary();
      if (summaryData) setSummary(summaryData);
      setCsvFile(null);
    } else {
      setMessage("CSV import failed. Please verify the file format.");
    }
    setCsvSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_24%),linear-gradient(180deg,#f8fcff_0%,#eefbff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,118,110,0.12)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal-700">Admin console</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">Manage travel data in one place</h1>
              <p className="mt-3 text-sm text-slate-600 sm:text-base">
                Create records individually, import CSV files in bulk, and monitor analytics for popular countries, bookmarks, feedback, and suggestions.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={loadPanelData}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <FiRefreshCw /> Refresh
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-teal-200 hover:bg-teal-50"
              >
                <FiGlobe /> Site home
              </Link>
            </div>
          </div>
        </section>

        {message ? (
          <div className="rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-900">
            {message}
          </div>
        ) : null}

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-3xl border border-slate-200 bg-white/90" />
            ))}
          </div>
        ) : !summary ? (
          <section className="rounded-[2rem] border border-rose-200 bg-white/90 p-8 text-center shadow-md">
            <p className="text-lg font-semibold text-slate-950">Admin access required</p>
            <p className="mt-2 text-sm text-slate-600">Sign in with an admin account to access bulk import and analytics.</p>
          </section>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                ["Countries", summary.stats.countries],
                ["Travel apps", summary.stats.travel_apps],
                ["Service providers", summary.stats.service_providers],
                ["Bookmarks", summary.stats.bookmarks],
                ["Feedback", summary.stats.feedback],
                ["Suggestions", summary.stats.suggestions],
                ["Emergency contacts", summary.stats.emergency_contacts],
                ["Users", summary.stats.users],
              ].map(([label, value]) => (
                <div key={label} className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-sm">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
                  <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
                </div>
              ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
              <div className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-md sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Data entry</p>
                    <h2 className="mt-1 text-2xl font-black text-slate-950">Add records individually</h2>
                  </div>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">{resourceConfig.label}</span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {RESOURCE_CONFIG.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setSelectedResource(item.key)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedResource === item.key ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  {resourceConfig.fields.map((field) => (
                    <label key={field.name} className="block">
                      <span className="mb-2 block text-sm font-semibold text-slate-700">{field.label}</span>
                      {field.type === "textarea" ? (
                        <textarea
                          value={formData[field.name] || ""}
                          onChange={(event) => handleFieldChange(field.name, event.target.value)}
                          placeholder={field.placeholder || ""}
                          className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                        />
                      ) : field.type === "select" ? (
                        <select
                          value={formData[field.name] || ""}
                          onChange={(event) => handleFieldChange(field.name, event.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                        >
                          <option value="">Select one</option>
                          {(options[field.source] || []).map((option) => (
                            <option key={`${field.source}-${option.id || option.value || option.code || option.name}`} value={option.code || option.value || option.name}>
                              {option.name || option.label}
                            </option>
                          ))}
                        </select>
                      ) : field.type === "toggle" ? (
                        <button
                          type="button"
                          onClick={() => handleFieldChange(field.name, !formData[field.name])}
                          className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition ${formData[field.name] ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700"}`}
                        >
                          {formData[field.name] ? "Yes" : "No"}
                        </button>
                      ) : (
                        <input
                          type="text"
                          value={formData[field.name] || ""}
                          onChange={(event) => handleFieldChange(field.name, event.target.value)}
                          placeholder={field.placeholder || ""}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                        />
                      )}
                    </label>
                  ))}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FiPlus /> {submitting ? "Saving..." : "Save record"}
                  </button>
                </form>
              </div>

              <div className="space-y-6">
                <div className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-md sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">
                      <FiUpload />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">Bulk upload</p>
                      <h2 className="text-xl font-black text-slate-950">Import CSV rows</h2>
                    </div>
                  </div>

                  <form className="mt-5 space-y-4" onSubmit={handleCsvSubmit}>
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={(event) => setCsvFile(event.target.files?.[0] || null)}
                      className="block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-white"
                    />
                    <p className="text-xs text-slate-500">Expected columns: {resourceConfig.csvHint}</p>
                    <button
                      type="submit"
                      disabled={csvSubmitting || !csvFile}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiDatabase /> {csvSubmitting ? "Importing..." : "Import CSV"}
                    </button>
                  </form>
                </div>

                <div className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-md sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                      <FiTrendingUp />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Analytics</p>
                      <h2 className="text-xl font-black text-slate-950">Popular countries and engagement</h2>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700">Popular countries</h3>
                      <div className="mt-2 space-y-2">
                        {summary.popular_countries?.slice(0, 5).map((item) => (
                          <div key={item.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                            <span className="font-semibold text-slate-800">{item.code} {item.name}</span>
                            <span className="text-slate-500">{item.visit_count} visits</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-700">Recent feedback</h3>
                      <div className="mt-2 space-y-2">
                        {summary.latest_feedback?.slice(0, 3).map((item) => (
                          <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-600">
                            <p className="font-semibold text-slate-900">{item.name || item.user_email || "Feedback"}</p>
                            <p className="mt-1 line-clamp-2">{item.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-700">Country suggestions</h3>
                      <div className="mt-2 space-y-2">
                        {summary.latest_suggestions?.slice(0, 3).map((item) => (
                          <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-600">
                            <p className="font-semibold text-slate-900">{item.country}</p>
                            <p className="mt-1 line-clamp-2">{item.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-md sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-violet-50 p-3 text-violet-700">
                      <FiMessageCircle />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">Import guide</p>
                      <h2 className="text-xl font-black text-slate-950">CSV format tips</h2>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">
                    Keep your CSV headers aligned with the selected resource. Rows are upserted when a matching record already exists.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}