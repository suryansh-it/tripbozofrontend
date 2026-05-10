"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FaBalanceScale,
  FaBolt,
  FaShieldAlt,
  FaHotel,
  FaGlobe,
  FaArrowLeft,
  FaCheckCircle,
  FaExternalLinkAlt,
} from "react-icons/fa";
import ScrollNavButtons from "@/components/ScrollNavButtons";
import { fetchCountryInfo, fetchCountryServices } from "@/src/utils/api";
import { SkeletonSection, SkeletonCompareTable } from "@/components/Skeletons";

const SERVICE_DATA = {
  esim: {
    title: "eSIM & Connectivity",
    icon: FaBolt,
    accent: "from-cyan-500 to-blue-500",
    border: "border-cyan-200",
    badge: "bg-cyan-100 text-cyan-700",
    providers: [
      { name: "Airalo", priceFrom: "$4.50", coverage: "200+ countries", support: "24/7 chat", refund: "Partial", site: "https://www.airalo.com" },
      { name: "Nomad", priceFrom: "$6.00", coverage: "170+ countries", support: "24/7 chat", refund: "Yes", site: "https://www.getnomad.app" },
      { name: "GigSky", priceFrom: "$5.99", coverage: "190+ countries", support: "Email/chat", refund: "Limited", site: "https://www.gigsky.com" },
      { name: "Roamless", priceFrom: "$4.00", coverage: "150+ countries", support: "Chat", refund: "Yes", site: "https://roamless.com" },
    ],
  },
  insurance: {
    title: "Travel Insurance",
    icon: FaShieldAlt,
    accent: "from-rose-500 to-orange-500",
    border: "border-rose-200",
    badge: "bg-rose-100 text-rose-700",
    providers: [
      { name: "World Nomads", priceFrom: "$35/trip", coverage: "Adventure + medical", support: "24/7 help", refund: "Plan-based", site: "https://www.worldnomads.com" },
      { name: "Allianz Travel", priceFrom: "$28/trip", coverage: "Trip cancellation + medical", support: "24/7 hotline", refund: "Yes", site: "https://www.allianztravelinsurance.com" },
      { name: "VisitorsCoverage", priceFrom: "$20/trip", coverage: "Visitors + medical", support: "24/7 call", refund: "Policy-based", site: "https://www.visitorscoverage.com" },
      { name: "InsureMyTrip", priceFrom: "$24/trip", coverage: "Marketplace compare", support: "Helpdesk", refund: "Varies", site: "https://www.insuremytrip.com" },
    ],
  },
  booking: {
    title: "Booking Platforms",
    icon: FaHotel,
    accent: "from-emerald-500 to-teal-500",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    providers: [
      { name: "Booking.com", priceFrom: "Wide range", coverage: "Hotels + homes", support: "24/7", refund: "Property-based", site: "https://www.booking.com" },
      { name: "Agoda", priceFrom: "Strong in Asia", coverage: "Hotels + deals", support: "24/7", refund: "Property-based", site: "https://www.agoda.com" },
      { name: "Expedia", priceFrom: "Bundle offers", coverage: "Flights + hotels", support: "24/7", refund: "Booking-based", site: "https://www.expedia.com" },
      { name: "Trip.com", priceFrom: "Competitive", coverage: "Flights + hotels + trains", support: "24/7", refund: "Booking-based", site: "https://www.trip.com" },
    ],
  },
  utilities: {
    title: "Other Useful Services",
    icon: FaGlobe,
    accent: "from-violet-500 to-fuchsia-500",
    border: "border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    providers: [
      { name: "Wise", priceFrom: "Low FX fees", coverage: "Multi-currency", support: "In-app", refund: "Transfer-based", site: "https://wise.com" },
      { name: "XE", priceFrom: "Rate alerts", coverage: "Currency converter", support: "Web/app", refund: "N/A", site: "https://www.xe.com" },
      { name: "Rome2Rio", priceFrom: "Route compare", coverage: "Transport planning", support: "Web/app", refund: "N/A", site: "https://www.rome2rio.com" },
      { name: "GetYourGuide", priceFrom: "Activity deals", coverage: "Tours + experiences", support: "24/7", refund: "Tour-based", site: "https://www.getyourguide.com" },
    ],
  },
};

const SECTION_ORDER = ["esim", "insurance", "booking", "utilities"];

export default function CountryServicesPage() {
  const { country } = useParams();
  const countryCode = String(country || "").toUpperCase();
  const [countryInfo, setCountryInfo] = useState(null);
  const [serviceSections, setServiceSections] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState("esim");
  const [selectedProviders, setSelectedProviders] = useState([]);

  const section = useMemo(() => {
    const fallbackSection = SERVICE_DATA[selectedSection];
    const remoteSection = serviceSections?.[selectedSection];
    const providers = remoteSection?.providers?.length ? remoteSection.providers : fallbackSection.providers;
    return {
      ...fallbackSection,
      ...(remoteSection || {}),
      providers,
    };
  }, [selectedSection, serviceSections]);

  useEffect(() => {
    let mounted = true;

    const loadCountry = async () => {
      setLoading(true);
      try {
        const [info, services] = await Promise.all([
          fetchCountryInfo(countryCode),
          fetchCountryServices(countryCode),
        ]);
        if (!mounted) return;
        setCountryInfo(info || null);
        const sections = Array.isArray(services?.sections)
          ? services.sections.reduce((acc, item) => {
              if (item?.key) acc[item.key] = item;
              return acc;
            }, {})
          : null;
        setServiceSections(sections);
      } catch {
        if (!mounted) return;
        setCountryInfo(null);
        setServiceSections(null);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    loadCountry();
    return () => {
      mounted = false;
    };
  }, [countryCode]);

  const comparisonRows = useMemo(() => {
    const all = section.providers.filter((provider) => selectedProviders.includes(provider.name));
    return all;
  }, [section, selectedProviders]);

  const toggleProvider = (name) => {
    setSelectedProviders((prev) => {
      if (prev.includes(name)) {
        return prev.filter((item) => item !== name);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), name];
      }
      return [...prev, name];
    });
  };

  const switchSection = (nextSection) => {
    setSelectedSection(nextSection);
    setSelectedProviders([]);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_25%),linear-gradient(180deg,#f7fbff_0%,#ecf7ff_100%)] px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {/* Header Skeleton */}
          <div className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-md sm:p-8 animate-pulse">
            <div className="space-y-4">
              <div className="h-4 w-40 rounded-lg bg-slate-100" />
              <div className="h-8 w-64 rounded-lg bg-slate-100" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded-lg bg-slate-100" />
                <div className="h-4 w-4/5 rounded-lg bg-slate-100" />
              </div>
            </div>
          </div>

          {/* Section Tabs Skeleton */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/90 border border-slate-200 p-4 h-32 animate-pulse" />
            ))}
          </div>

          {/* Content Skeleton */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr,1fr]">
            <SkeletonSection />
            <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-md animate-pulse">
              <div className="h-6 bg-slate-100 rounded-lg w-40 mb-4" />
              <SkeletonCompareTable />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_25%),linear-gradient(180deg,#f7fbff_0%,#ecf7ff_100%)] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-[0_20px_60px_rgba(15,118,110,0.12)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Travel services hub</p>
              <div className="mt-2 flex items-center gap-2 sm:gap-3">
                <h1 className="text-2xl font-bold text-slate-950 sm:text-4xl">
                  {countryInfo?.name || countryCode}
                </h1>
                <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 sm:inline-flex">
                  {countryInfo?.code || countryCode}
                </span>
              </div>
              <p className="mt-2 max-w-3xl text-sm text-slate-600 sm:text-base">
                Use this page like a quick comparison marketplace: pick a section, shortlist providers, and compare side by side before choosing.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/country/${countryCode}/Essentials`}
                className="inline-flex h-10 items-center justify-center rounded-full border border-cyan-200 bg-white px-3.5 text-sm font-semibold text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-50"
              >
                Essentials
              </Link>
              <Link
                href={`/country/${countryCode}`}
                className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-800 transition hover:border-cyan-300 hover:bg-cyan-50"
              >
                <FaArrowLeft />
                <span className="ml-2 hidden sm:inline">Apps</span>
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SECTION_ORDER.map((key) => {
            const item = SERVICE_DATA[key];
            const Icon = item.icon;
            const active = selectedSection === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => switchSection(key)}
                className={`group rounded-2xl border p-4 text-left transition ${
                  active
                    ? `bg-gradient-to-r ${item.accent} text-white shadow-lg`
                    : `bg-white ${item.border} text-slate-800 hover:-translate-y-0.5 hover:shadow-md`
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`text-xl ${active ? "text-white" : "text-slate-700"}`} />
                  {active ? <FaCheckCircle className="text-white" /> : null}
                </div>
                <p className={`mt-3 text-sm font-bold ${active ? "text-white" : "text-slate-900"}`}>{item.title}</p>
                <p className={`mt-1 text-xs ${active ? "text-white/90" : "text-slate-600"}`}>
                  {item.providers.length} providers
                </p>
              </button>
            );
          })}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.35fr,1fr]">
          <div className={`rounded-3xl border bg-white/90 p-6 shadow-md ${section.border}`}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${section.badge}`}>
                Select up to 3 to compare
              </span>
            </div>

            <div className="grid gap-3">
              {section.providers.map((provider) => {
                const checked = selectedProviders.includes(provider.name);
                return (
                  <div
                    key={provider.name}
                    className={`rounded-2xl border p-4 transition ${
                      checked ? "border-cyan-300 bg-cyan-50/70" : "border-slate-200 bg-white hover:border-cyan-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{provider.name}</h3>
                        <p className="mt-1 text-sm text-slate-600">Starts: {provider.priceFrom}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleProvider(provider.name)}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                            checked
                              ? "bg-cyan-600 text-white hover:bg-cyan-700"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {checked ? "Selected" : "Compare"}
                        </button>
                        <a
                          href={provider.site}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Visit <FaExternalLinkAlt className="text-[10px]" />
                        </a>
                      </div>
                    </div>

                    <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-3">
                      <p><span className="font-semibold text-slate-800">Coverage:</span> {provider.coverage}</p>
                      <p><span className="font-semibold text-slate-800">Support:</span> {provider.support}</p>
                      <p><span className="font-semibold text-slate-800">Refund:</span> {provider.refund}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                <span className="inline-flex items-center gap-2"><FaBalanceScale /> Compare view</span>
              </h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {comparisonRows.length}/3 selected
              </span>
            </div>

            {comparisonRows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
                Select providers from the left to compare features side by side.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.14em] text-slate-500">
                      <th className="px-2 py-2">Provider</th>
                      <th className="px-2 py-2">Price</th>
                      <th className="px-2 py-2">Coverage</th>
                      <th className="px-2 py-2">Support</th>
                      <th className="px-2 py-2">Refund</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row) => (
                      <tr key={row.name} className="border-b border-slate-100 text-slate-700">
                        <td className="px-2 py-2 font-semibold text-slate-900">{row.name}</td>
                        <td className="px-2 py-2">{row.priceFrom}</td>
                        <td className="px-2 py-2">{row.coverage}</td>
                        <td className="px-2 py-2">{row.support}</td>
                        <td className="px-2 py-2">{row.refund}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="mt-4 text-xs text-slate-500">
              Tip: Compare refund rules and support channels first; those usually matter most during real travel disruptions.
            </p>
          </div>
        </section>
      </div>
      <ScrollNavButtons />
    </main>
  );
}
