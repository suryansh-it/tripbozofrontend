
"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLoader } from "@/components/LoaderContext";

import NextImage from "next/image";
import {
  FaPlus,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaQrcode,
  FaGlobe,
  FaCaretDown,
  FaShare,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";
import { initSession, saveSelectedApps } from "@/src/utils/api";
import ScrollNavButtons from "@/components/ScrollNavButtons";



export default function CountryAppsPage({ countryCode, apps, countryInfo, }) {
  const router = useRouter();
  const { setShow } = useLoader();
  const storageKey = `selectedAppIds_${countryCode}`;
  const ratingStorageKey = `appRatings_${countryCode}`;
  const [selectedApps, setSelectedApps] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(selectedApps));
  }, [selectedApps, storageKey]);

  const [userRatings, setUserRatings] = useState(() => {
    try {
      const raw = localStorage.getItem(ratingStorageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(ratingStorageKey, JSON.stringify(userRatings));
  }, [ratingStorageKey, userRatings]);

  const clearAll = () => {
    setSelectedApps([]);
    localStorage.removeItem(storageKey);
  };


  


  // Search + category + filter
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State for filter dropdown
  const [currentPage, setCurrentPage] = useState(1);
  const APPS_PER_PAGE = 8;

   // 1) Dynamically derive the list of categories from your apps:
   const categories = useMemo(() => {
     const cats = new Set(apps.map((a) => a.category || "Uncategorized"));
     return ["ALL", ...Array.from(cats)];
   }, [apps]);

  const filterOptions = [
    { value: "ALL", label: "All Filters" },
    { value: "FREE", label: "Free Apps" },
    { value: "PAID", label: "Paid Apps" },
    { value: "TOP_RATED", label: "Top Rated" },
  ];

  const toggleSelect = (appId) => {
    setSelectedApps((prev) =>
      prev.includes(appId)
        ? prev.filter((id) => id !== appId)
        : [...prev, appId]
    );
  };

  const handleGenerateQR = async () => {
    if (!selectedApps.length) {
      alert("Please select at least one app.");
      return;
    }
    
    setShow(true); // Show loader before navigation
    
    let sid = localStorage.getItem("sessionId") || (await initSession());
    if (!sid) {
      setShow(false);
      return alert("Could not initialize session.");
    }
    
    const { session_id } = await saveSelectedApps(selectedApps);
    sid = session_id || sid;
    localStorage.setItem("sessionId", sid);
    
    router.push(`/qr-bundle?country=${countryCode}`);
    // Loader will be hidden by LoaderRouteListener
  };

  const handleEssentialsClick = () => {
    setShow(true); // Show loader before navigation
    router.push(`/country/${countryCode}/Essentials`);
    // Loader will be hidden by LoaderRouteListener
  };

  const filteredApps = apps
    .filter(
      (app) =>
        (activeCategory === "ALL" || (app.category || "Uncategorized") === activeCategory) &&
        (app.name.toLowerCase().includes(search.toLowerCase()) ||
          (app.description || "")
            .toLowerCase()
            .includes(search.toLowerCase()))
    )
    .filter((app) => {
      if (filterType === "FREE") return !app.price || app.price === 0;
      if (filterType === "PAID") return app.price && app.price > 0;
      return true;
    })
    .sort((a, b) => {
      if (filterType === "TOP_RATED") {
        return (b.rating || 0) - (a.rating || 0);
      }
      return 0;
    });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeCategory, filterType]);

  const totalPages = Math.max(1, Math.ceil(filteredApps.length / APPS_PER_PAGE));
  const pageStart = (currentPage - 1) * APPS_PER_PAGE;
  const paginatedApps = filteredApps.slice(pageStart, pageStart + APPS_PER_PAGE);


 
   const upperCountryCode = countryCode.toUpperCase();
  const heroSrc = `/img/${upperCountryCode}.jpg`;

  

  // console.log("Hero image URLs:", heroImages);

    // track which app card is expanded
  const [expandedId, setExpandedId] = useState(null);
  const [ratingPickerFor, setRatingPickerFor] = useState(null);
  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
    setRatingPickerFor(null);
  };


  const trackAppStoreClick =
  (store, appId) =>
  (e) => {
    // fire analytics, then let the link navigate
    if (typeof window.gtag === "function") {
      window.gtag("event", "app_store_click", {
        store,      // "play_store" or "app_store"
        app_id: appId,
      });
    }
  };


  const handleShareApp = (app) => {
    const playStoreUrl = app.android_link || "";
    const appStoreUrl = app.ios_link || "";
    const shareText = `Check out ${app.name} - ${app.description || "A great travel app!"}`;
    const shareUrl = playStoreUrl || appStoreUrl || "";

    if (navigator.share) {
      navigator.share({
        title: app.name,
        text: shareText,
        url: shareUrl,
      }).catch(() => {});
    } else {
      const copyText = `${shareText}\n\n${shareUrl}`;
      navigator.clipboard.writeText(copyText).then(() => {
        alert("App details copied to clipboard!");
      });
    }
  };

  const getAppDetails = (app) => {
    const bestFor = app.best_for || `Travelers in ${countryInfo.name} needing ${String(app.category || "essential").toLowerCase()} support.`;
    const why = app.why_recommended || app.description || "Popular among travelers for reliability and ease of use.";
    const caution = app.caution_note || "Check pricing, region availability, and account requirements before your trip.";
    return { bestFor, why, caution };
  };

  const getCategoryAlternatives = (app) => {
    const targetCategory = app.category || "Uncategorized";
    return apps
      .filter((candidate) => candidate.id !== app.id && (candidate.category || "Uncategorized") === targetCategory)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3);
  };

  const handleSetRating = (appId, value) => {
    setUserRatings((prev) => ({ ...prev, [appId]: value }));
  };

  const handleClearRating = (appId) => {
    setUserRatings((prev) => {
      const next = { ...prev };
      delete next[appId];
      return next;
    });
  };



  return (
    // clicking outside any card collapses all
    <main
      onClick={() => setExpandedId(null)}
      className="bg-[#f7fafc] animate-fade-in"
    >
     {/* Hero Section */}
     <div className="relative w-full h-[340px] overflow-hidden rounded-b-3xl shadow-lg">
        <NextImage
          src={heroSrc}
          
          alt={`${countryInfo.name} banner`}
          fill
          style={{ objectFit: "cover" }}
          priority
        />

        {/* subtle gradient overlay for text contrast */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(20,20,20,0.55) 0%, rgba(20,20,20,0.25) 40%, rgba(20,20,20,0.05) 70%, rgba(20,20,20,0) 100%)",
          }}
        />
    

    
        <div className="relative w-[92vw] max-w-[1920px] mx-auto px-14 flex flex-col justify-center h-full z-10"> 
                 {/* ✅ Dynamically show code, name and description from `countryInfo` */}
         <div className="flex items-center gap-6 mb-2 mt-8">
           <span className="text-4xl font-bold text-white/80">
             {countryInfo.code}
           </span>
           <span className="text-6xl font-black text-white ml-3 drop-shadow-lg">
             {countryInfo.name}
           </span>
         </div>
         <p className="text-2xl max-w-4xl text-white/90 font-normal mb-4 mt-1 drop-shadow">
           {countryInfo.description}
         </p>
          <div
            className="h-1 w-28 bg-[#2ad2c9] rounded"
            style={{ width: "7rem" }}
          ></div>
        </div>
      </div>
      {/* Search & Filter (overlapping hero) */}
      <div className="relative z-20 -mt-8 w-full max-w-[1920px] mx-auto px-2 sm:px-6 md:px-14">
        <div className="flex flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="flex-1 flex items-center h-12 sm:h-16 px-3 sm:px-6 bg-white rounded-xl sm:rounded-2xl shadow-md border border-[#e0e0e0] focus-within:ring-2 focus-within:ring-[#2ad2c9] transition min-w-[180px] sm:min-w-[300px]">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 mr-2 sm:mr-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search apps..."
              className="flex-1 text-gray-800 text-base sm:text-lg bg-transparent focus:outline-none placeholder-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative h-12 sm:h-16 w-32 sm:w-36">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="h-full w-full rounded-xl sm:rounded-2xl border border-gray-300 bg-white px-3 sm:px-4 flex items-center justify-between text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-[#2ad2c9] transition"
            >
              {filterOptions.find((opt) => opt.value === filterType)?.label}
              <FaCaretDown className={`ml-2 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-300 py-2 z-30">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilterType(option.value);
                      setIsFilterOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 text-gray-700  hover:bg-gray-100 ${
                      filterType === option.value ? 'font-bold bg-gray-50' : ''
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 sm:gap-3 px-0 mt-5 mb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 sm:px-7 py-2 sm:py-3 rounded-full font-semibold text-base sm:text-lg transition-all ${
                activeCategory === cat
                  ? "bg-[#e0ecec] text-[#222] shadow border border-[#d0e6e6]"
                  : "bg-[#f3f6f7] text-gray-500 border border-transparent hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <br />

      {/* Selection Methodology */}
      <div className="w-full max-w-[1920px] mx-auto px-2 sm:px-6 md:px-14 mb-8">
        <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-5 sm:p-6 shadow-sm">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md flex-shrink-0">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-indigo-950">How these apps are selected</h3>
              <p className="mt-1 text-sm sm:text-base text-indigo-800 leading-relaxed">
                We highlight apps that are useful in {countryInfo.name}, rated well by travelers, actively maintained, privacy-conscious, and relevant to the travel problems people actually face.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs sm:text-sm font-semibold">
                <span className="rounded-full bg-white px-3 py-1.5 text-indigo-700 border border-indigo-100">4.0+ rating</span>
                <span className="rounded-full bg-white px-3 py-1.5 text-indigo-700 border border-indigo-100">Recent updates</span>
                <span className="rounded-full bg-white px-3 py-1.5 text-indigo-700 border border-indigo-100">Local relevance</span>
                <span className="rounded-full bg-white px-3 py-1.5 text-indigo-700 border border-indigo-100">Privacy aware</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content with apps grid and sidebar */}
      <div className="w-full max-w-[1920px] mx-auto flex flex-col lg:flex-row gap-8 px-2 sm:px-6 md:px-14 pb-16">
        {/* Left: Apps Grid */}
        <div className="flex-1">
        <div className="grid grid-cols-1 gap-5 sm:gap-6 items-start">
        {paginatedApps.map((app) => (
            <div
              key={app.id}
              onClick={(e) => { e.stopPropagation(); toggleExpand(app.id); }}
              className="
             relative
             w-full
             h-auto
             bg-white
             border border-gray-200
             rounded-3xl
             p-5 sm:p-6
             shadow-md
             hover:shadow-xl
             hover:border-cyan-200
             transition-all duration-300
             cursor-pointer
             flex flex-col
             overflow-hidden
           "
         >
              {/* Gradient top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2ad2c9] via-cyan-400 to-transparent"></div>

              {/* Content */}
              <div className="flex-1 flex flex-col gap-4">
                {/* Header: icon, title, and quick actions */}
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 flex-shrink-0 overflow-hidden shadow-sm">
                      <NextImage
                        src={app.icon_url || "/file.svg"}
                        alt={app.name || "App icon"}
                        fill
                        sizes="(max-width: 640px) 64px, 80px"
                        className="object-cover p-2"
                      />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-start gap-2 flex-wrap">
                        <h2 className="text-lg sm:text-xl font-bold text-[#0a0a0a] leading-tight min-w-0 flex-1">
                          {app.name}
                        </h2>
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-gray-500 leading-snug">
                        {getAppDetails(app).bestFor}
                      </p>
                      {app.is_sponsored && (
                        <span className="inline-flex mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-xs font-bold whitespace-nowrap shadow-sm">
                          Sponsored pick
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleShareApp(app); }}
                      className="w-10 h-10 rounded-full border border-blue-200 bg-blue-50 text-blue-600 shadow-sm hover:bg-blue-100 hover:shadow transition flex items-center justify-center"
                      title="Share app"
                      aria-label="Share app"
                    >
                      <FaShare className="text-sm" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSelect(app.id); }}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-200 shadow-sm flex items-center justify-center ${
                        selectedApps.includes(app.id)
                          ? "bg-gradient-to-br from-[#2ad2c9] to-cyan-400 border-[#2ad2c9] text-white"
                          : app.is_sponsored
                          ? "bg-gradient-to-br from-amber-100 to-orange-100 border-amber-400 text-amber-700"
                          : "bg-white border-cyan-200 text-[#2ad2c9] hover:bg-cyan-50"
                      }`}
                      title={selectedApps.includes(app.id) ? "Remove from bundle" : "Add to bundle"}
                      aria-label={selectedApps.includes(app.id) ? "Remove from bundle" : "Add to bundle"}
                    >
                      {selectedApps.includes(app.id) ? <FaCheck className="text-base" /> : <FaPlus className="text-base" />}
                    </button>
                  </div>
                </div>

                {/* Summary box */}
                <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 sm:p-5">
                  <p
                    className="text-gray-700 text-sm sm:text-base leading-relaxed"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: expandedId === app.id ? 4 : 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {app.description || "A practical travel app picked to make this destination easier, safer, and less stressful to navigate."}
                  </p>
                </div>

                {/* Meta row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 rounded-2xl bg-yellow-50 border border-yellow-100 px-3 py-2.5">
                    <span className="text-yellow-600 text-lg">★</span>
                    <div>
                      <p className="text-[11px] text-yellow-700 font-semibold uppercase tracking-wide">Rating</p>
                      <p className="text-sm font-bold text-yellow-900">{app.rating || "4.5"}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 rounded-2xl px-3 py-2.5 border ${
                    app.price
                      ? "bg-gray-50 border-gray-200"
                      : "bg-green-50 border-green-100"
                  }`}>
                    <span className="text-lg">{app.price ? "💳" : "✨"}</span>
                    <div>
                      <p className={`text-[11px] font-semibold uppercase tracking-wide ${app.price ? "text-gray-600" : "text-green-700"}`}>Price</p>
                      <p className={`text-sm font-bold ${app.price ? "text-gray-800" : "text-green-700"}`}>{app.price ? "Paid" : "Free"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl bg-blue-50 border border-blue-100 px-3 py-2.5">
                    <span className="text-lg">📂</span>
                    <div className="min-w-0">
                      <p className="text-[11px] text-blue-700 font-semibold uppercase tracking-wide">Category</p>
                      <p className="text-sm font-bold text-blue-900 truncate">{app.category || "Travel"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl bg-purple-50 border border-purple-100 px-3 py-2.5">
                    <span className="text-lg">📱</span>
                    <div>
                      <p className="text-[11px] text-purple-700 font-semibold uppercase tracking-wide">Platforms</p>
                      <p className="text-sm font-bold text-purple-900">
                        {(app.android_link ? "Android" : "")}{app.android_link && app.ios_link ? " • " : ""}{app.ios_link ? "iOS" : app.android_link ? "" : "Web"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expand toggle row */}
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleExpand(app.id); }}
                  className="flex items-center justify-between gap-2 rounded-2xl border border-cyan-100 bg-white px-4 py-3 text-sm font-bold text-[#2ad2c9] hover:bg-cyan-50 transition-colors"
                >
                  <span>{expandedId === app.id ? "Hide Details" : "Discover More"}</span>
                  {expandedId === app.id ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {/* Expandable details - Enhanced */}
                {expandedId === app.id && (
                  <div className="border-t-2 border-gradient to-transparent pt-4 space-y-4">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 sm:p-5 border border-purple-100">
                      <h3 className="text-base font-bold text-purple-900 mb-3 flex items-center gap-2">
                        <span className="text-xl">💡</span> Why This App?
                      </h3>
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <span className="text-lg mt-0.5">🎯</span>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm mb-1">Best use case:</p>
                            <p className="text-gray-700 text-sm leading-relaxed">{getAppDetails(app).bestFor}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <span className="text-lg mt-0.5">⭐</span>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm mb-1">Why travelers like it:</p>
                            <p className="text-gray-700 text-sm leading-relaxed">{getAppDetails(app).why}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <span className="text-lg mt-0.5">⚡</span>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm mb-1">When not to use it:</p>
                            <p className="text-gray-700 text-sm leading-relaxed">{getAppDetails(app).caution}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 sm:p-5 border border-amber-100">
                      <h3 className="text-base font-bold text-amber-900 mb-3 flex items-center gap-2">
                        <span className="text-xl">🧭</span> Alternatives to compare
                      </h3>
                      {getCategoryAlternatives(app).length > 0 ? (
                        <ul className="space-y-2">
                          {getCategoryAlternatives(app).map((alt) => (
                            <li key={alt.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/70 border border-amber-200 px-3 py-2">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-amber-900 truncate">{alt.name}</p>
                                <p className="text-xs text-amber-700">{alt.price ? "Paid" : "Free"}</p>
                              </div>
                              <span className="text-xs font-bold text-amber-800 whitespace-nowrap">★ {alt.rating || "4.5"}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-amber-800 leading-relaxed">
                          No close alternatives in this category yet. Explore nearby categories from the filter for backups.
                        </p>
                      )}
                    </div>

                    {/* Enhanced action buttons */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="border-t-2 border-cyan-100 pt-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
                    >
                      {/* Store links on left */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {app.android_link && (
                          <a
                            href={app.android_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-green-300 text-white shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200"
                            aria-label="Open Play Store"
                            title="Get on Google Play"
                            onClick={trackAppStoreClick("play_store", app.packageName || app.id)}
                          >
                            <FaGooglePlay className="text-lg" />
                          </a>
                        )}
                        {app.ios_link && (
                          <a
                            href={app.ios_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-600 text-white shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200"
                            aria-label="Open App Store"
                            title="Get on App Store"
                            onClick={trackAppStoreClick("app_store", app.packageName || app.id)}
                          >
                            <FaApple className="text-lg" />
                          </a>
                        )}
                      </div>

                      {/* Compact rating on bottom-right */}
                      <div className="relative w-full sm:w-auto" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setRatingPickerFor((prev) => (prev === app.id ? null : app.id))}
                          className="h-11 inline-flex items-center gap-2 rounded-full border border-violet-300 bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all"
                          aria-label="Rate this app recommendation"
                          title="Rate this app recommendation"
                        >
                          <span className="text-sm leading-none">★</span>
                          <span>{userRatings[app.id] ? `${userRatings[app.id]}/5` : "Rate"}</span>
                        </button>

                        {ratingPickerFor === app.id && (
                          <div className="absolute right-0 bottom-14 z-20 w-[220px] rounded-2xl border border-violet-200 bg-white/95 backdrop-blur p-3 shadow-xl">
                            <p className="text-xs font-semibold text-slate-700 mb-2">Tap to rate</p>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => {
                                const active = (userRatings[app.id] || 0) >= star;
                                return (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleSetRating(app.id, star)}
                                    className={`h-8 w-8 rounded-lg border text-base leading-none transition ${
                                      active
                                        ? "border-amber-300 bg-amber-50 text-amber-500"
                                        : "border-slate-200 bg-white text-slate-300 hover:border-violet-300 hover:text-violet-500"
                                    }`}
                                    aria-label={`Rate ${star} out of 5`}
                                    title={`${star} out of 5`}
                                  >
                                    ★
                                  </button>
                                );
                              })}
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => handleClearRating(app.id)}
                                className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                              >
                                Clear
                              </button>
                              <button
                                type="button"
                                onClick={() => setRatingPickerFor(null)}
                                className="text-xs font-semibold text-violet-600 hover:text-violet-800"
                              >
                                Done
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="w-full mt-6 flex flex-col items-center gap-3">
          <p className="text-xs sm:text-sm text-gray-600">
            Showing {filteredApps.length ? pageStart + 1 : 0}-{Math.min(pageStart + APPS_PER_PAGE, filteredApps.length)} of {filteredApps.length} apps
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="px-3 py-1.5 rounded-lg bg-gray-100 text-sm font-semibold text-gray-700">
              Page {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
        </div>

        {/* Right: Selected Apps Sidebar */}
        <div className="lg:w-[350px] bg-white rounded-2xl shadow-md border border-gray-200 p-6 h-fit sticky top-24">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Selected Apps ({selectedApps.length})</h2>
          
        {selectedApps.length === 0 ? (
         <div className="text-center py-8">
           <p className="text-gray-800 mb-2 font-medium">No apps selected yet</p>
           <p className="text-gray-600 text-sm">
             Pick some apps on the left to build your bundle.
           </p>
         </div>
       ) : (
         <div className="space-y-4 mb-6">
           {selectedApps.map(appId => {
             const app = apps.find(a => a.id === appId);
             return app ? (
               <div
                 key={app.id}
                 className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl"
               >
                 <div className="w-10 h-10 relative flex-shrink-0">
                   <NextImage
                     src={app.icon_url || "/file.svg"}
                     alt={app.name}
                     fill
                     className="object-cover rounded-lg"
                   />
                 </div>
                 <span className="flex-1 text-gray-900 font-medium">
                   {app.name}
                 </span>
                 <button
                   onClick={() => toggleSelect(app.id)}
                   className="text-red-500 hover:text-red-700"
                   aria-label={`Remove ${app.name}`}
                 >
                   <FaTimes />
                 </button>
               </div>
             ) : null;
           })}
         </div>
       )}

          {/* Buttons group at bottom */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={handleGenerateQR}
            disabled={!selectedApps.length}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition ${
              selectedApps.length
                ? "bg-teal-400 hover:bg-teal-500 shadow-lg"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            <FaQrcode className="text-lg" />
            Generate QR Code
          </button>

          <button
            onClick={handleEssentialsClick}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-300 hover:bg-blue-400 text-blue-900 font-semibold shadow-lg transition"
          >
            <FaGlobe className="text-lg" />
            Essentials
          </button>

          <button
            onClick={clearAll}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-300 hover:bg-red-400 text-red-900 font-semibold shadow-lg transition"
          >
            Clear All
          </button>

          {selectedApps.length > 0 && (
            <p className="text-xs text-center text-gray-500 mt-1">
              Select at least 2 apps to generate a QR code
            </p>
          )}
        </div>
        </div>
      </div>
      <ScrollNavButtons />
    </main>
  );
}