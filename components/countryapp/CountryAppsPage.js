
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
    const shareText = `Check out ${app.name} - ${cleanDescription(app.description, 100)}`;
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

  const normalizeRawText = (text) => {
    if (!text || typeof text !== "string") return "";

    return text
      .replace(/<br\s*\/?\s*>/gi, "\n")
      .replace(/<li[^>]*>/gi, "\n- ")
      .replace(/<\/li>/gi, "")
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/\r/g, "\n")
      .replace(/\t+/g, " ")
      .replace(/[ ]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  };

  const normalizeKey = (text) =>
    String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9 ]+/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const splitToLines = (text) => {
    const normalized = normalizeRawText(text);
    if (!normalized) return [];

    const seeded = normalized
      .replace(/[•●▪◦·]/g, "\n")
      .replace(/\s[-*]\s+/g, "\n")
      .replace(/\s+[;|]\s+/g, ". ")
      .replace(/\s+/g, " ")
      .trim();

    const rawChunks = seeded
      .split(/\n+/)
      .flatMap((chunk) => chunk.split(/(?<=[.!?])\s+/))
      .map((part) => part.trim())
      .filter(Boolean);

    const unique = [];
    const seen = new Set();

    rawChunks.forEach((line) => {
      const cleaned = line
        .replace(/^[-*]\s*/, "")
        .replace(/^\d+[.)]\s*/, "")
        .replace(/\s+/g, " ")
        .trim();

      if (cleaned.length < 8) return;

      const key = normalizeKey(cleaned);
      if (!key || seen.has(key)) return;
      seen.add(key);
      unique.push(cleaned);
    });

    return unique;
  };

  const ensureSentence = (line) => {
    const text = String(line || "").trim();
    if (!text) return "";
    return /[.!?]$/.test(text) ? text : `${text}.`;
  };

  const splitLongLine = (line) => {
    const text = String(line || "").trim();
    if (!text) return [];
    if (text.length < 120) return [text];

    const mid = Math.floor(text.length / 2);
    const breakCandidates = [". ", "; ", ": ", ", ", " - "];

    let splitIndex = -1;
    breakCandidates.forEach((token) => {
      if (splitIndex !== -1) return;
      const right = text.indexOf(token, mid - 30);
      if (right !== -1 && right <= mid + 40) {
        splitIndex = right + token.length - 1;
      }
    });

    if (splitIndex === -1) {
      const spaceIndex = text.lastIndexOf(" ", mid);
      if (spaceIndex > 30) splitIndex = spaceIndex;
    }

    if (splitIndex === -1) return [text];

    const first = text.slice(0, splitIndex).trim();
    const second = text.slice(splitIndex).trim();
    return [first, second].filter(Boolean);
  };

  const dedupeLines = (lines) => {
    const seen = new Set();
    const unique = [];

    lines.forEach((line) => {
      const key = normalizeKey(line);
      if (!key || seen.has(key)) return;
      seen.add(key);
      unique.push(line);
    });

    return unique;
  };

  const getAppDetails = (app) => {
    const baseDescription = dedupeLines(splitToLines(app.description).flatMap(splitLongLine));
    const baseWhy = dedupeLines(splitToLines(app.why_recommended).flatMap(splitLongLine));
    const baseBestFor = dedupeLines(splitToLines(app.best_for).flatMap(splitLongLine));
    const baseCaution = dedupeLines(splitToLines(app.caution_note).flatMap(splitLongLine));

    const mergedDescriptionPoints = dedupeLines([
      ...baseDescription,
      ...baseWhy,
      ...baseCaution,
    ]);

    if (mergedDescriptionPoints.length === 1) {
      mergedDescriptionPoints.push(`Useful for travelers in ${countryInfo.name}, especially for ${String(app.category || "travel").toLowerCase()} needs.`);
    }
    if (mergedDescriptionPoints.length === 0) {
      mergedDescriptionPoints.push(
        "A practical travel app picked to make this destination easier, safer, and less stressful to navigate.",
        `Useful for travelers in ${countryInfo.name}, especially for ${String(app.category || "travel").toLowerCase()} needs.`
      );
    }

    const topBlurbSource = baseDescription[0] || baseWhy[0] || baseBestFor[0] || "";
    const topBlurb = topBlurbSource
      ? cleanDescription(topBlurbSource, 120)
      : cleanDescription(`${app.name} helps travelers with ${String(app.category || "travel").toLowerCase()} during trips in ${countryInfo.name}.`, 120);

    return {
      topBlurb: ensureSentence(topBlurb),
      descriptionPoints: mergedDescriptionPoints.slice(0, 10).map(ensureSentence),
      bestFor: ensureSentence(
        baseBestFor[0] || `Best for travelers in ${countryInfo.name} who need ${String(app.category || "travel").toLowerCase()} support.`
      ),
    };
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

  /**
   * cleanDescription - Formats raw database descriptions into proper, readable text
   * 1. Removes extra whitespace, newlines, and weird characters
   * 2. Ensures proper capitalization and punctuation
   * 3. Truncates to a sensible length
   * 4. Returns meaningful, travel-focused copy
   */
  const cleanDescription = (text, maxLength = 150) => {
    if (!text || typeof text !== "string") {
      return "A practical travel app picked to make this destination easier, safer, and less stressful to navigate.";
    }

    // Remove extra whitespace, tabs, multiple spaces, and newlines
    let cleaned = text
      .replace(/\n+/g, " ")          // Replace newlines with space
      .replace(/\t+/g, " ")          // Replace tabs with space
      .replace(/\s+/g, " ")          // Replace multiple spaces with single space
      .trim();

    // Remove common redundant phrases from database imports
    const redundantPhrases = [
      /^[a-z]+ app\s*/i,            // "maps app" → ""
      /^stay connected with [a-z]+/i, // "stay connected with..." → ""
      /^this app for/i,             // "this app for" → ""
      /^an app for/i,               // "an app for" → ""
      /^a comprehensive [a-z]+ app/i, // "a comprehensive..." → ""
    ];

    redundantPhrases.forEach((regex) => {
      cleaned = cleaned.replace(regex, "").trim();
    });

    // Ensure it starts with capital letter
    if (cleaned.length > 0) {
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }

    // Ensure proper ending punctuation
    if (!/[.!?]$/.test(cleaned)) {
      cleaned += ".";
    }

    // Truncate to maxLength, but try to cut at a word boundary
    if (cleaned.length > maxLength) {
      let truncated = cleaned.substring(0, maxLength);
      // Find the last space before maxLength
      const lastSpace = truncated.lastIndexOf(" ");
      if (lastSpace > maxLength * 0.7) {
        truncated = cleaned.substring(0, lastSpace);
      }
      // Add ellipsis if truncated
      if (!truncated.endsWith(".")) {
        truncated = truncated.replace(/[.!?]*$/, "") + "...";
      }
      return truncated;
    }

    return cleaned;
  };

  const formatContentModular = (content) => {
    const values = Array.isArray(content)
      ? content
      : splitToLines(content);

    const lines = values.length
      ? values.map(ensureSentence).filter(Boolean)
      : ["Essential travel resource."];

    return (
      <ul className="space-y-2">
        {lines.map((line, idx) => (
          <li key={`${normalizeKey(line)}_${idx}`} className="text-gray-700 text-sm leading-relaxed flex items-start gap-2">
            <span className="mt-1 text-cyan-500">•</span>
            <span className="flex-1">{line}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    // clicking outside any card collapses all
    <main
      onClick={() => setExpandedId(null)}
      className="bg-[#f7fafc] animate-fade-in"
    >
     {/* Hero Section */}
    <div className="relative w-full h-[260px] sm:h-[300px] md:h-[340px] overflow-hidden rounded-b-2xl sm:rounded-b-3xl shadow-lg">
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
    

    
        <div className="relative w-[94vw] max-w-[1920px] mx-auto px-3 sm:px-6 md:px-10 lg:px-14 flex flex-col justify-center h-full z-10"> 
                 {/* ✅ Dynamically show code, name and description from `countryInfo` */}
         <div className="flex items-center gap-2 sm:gap-4 md:gap-6 mb-1 sm:mb-2 mt-3 sm:mt-6 md:mt-8">
           <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white/80">
             {countryInfo.code}
           </span>
           <span className="text-3xl sm:text-5xl md:text-6xl font-black text-white ml-1 sm:ml-3 drop-shadow-lg leading-tight">
             {countryInfo.name}
           </span>
         </div>
         <p className="text-sm sm:text-lg md:text-2xl max-w-4xl text-white/90 font-normal mb-3 sm:mb-4 mt-1 drop-shadow line-clamp-3 sm:line-clamp-none">
           {countryInfo.description}
         </p>
          <div
            className="h-1 w-28 bg-[#2ad2c9] rounded"
            style={{ width: "7rem" }}
          ></div>
        </div>
      </div>
      {/* Search & Filter (overlapping hero) */}
      <div className="relative z-20 -mt-6 sm:-mt-8 w-full max-w-[1920px] mx-auto px-2 sm:px-6 md:px-14">
        <div className="flex flex-row gap-2 sm:gap-3 items-center justify-between">
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
          <div className="relative h-12 sm:h-16 w-[92px] sm:w-36 shrink-0">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`h-full w-full rounded-full sm:rounded-2xl border px-2.5 sm:px-4 flex items-center justify-center gap-1 sm:justify-between text-[11px] sm:text-base font-semibold transition shadow-sm focus:ring-2 focus:ring-[#2ad2c9] ${
                isFilterOpen
                  ? "border-cyan-300 bg-cyan-50 text-cyan-800"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="sm:hidden">Filter</span>
              <span className="hidden sm:inline">{filterOptions.find((opt) => opt.value === filterType)?.label}</span>
              <FaCaretDown className={`ml-0.5 sm:ml-2 text-[10px] sm:text-base transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
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
      <div className="w-full max-w-[1920px] mx-auto flex flex-col lg:flex-row gap-5 sm:gap-8 px-2 sm:px-6 md:px-14 pb-16">
        {/* Left: Apps Grid */}
        <div className="flex-1">
        <div className="grid grid-cols-1 gap-5 sm:gap-6 items-start">
        {paginatedApps.map((app) => {
          const details = getAppDetails(app);
          return (
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
                        {details.bestFor}
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
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "2.9em",
                    }}
                  >
                    {details.topBlurb}
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
                            <p className="font-semibold text-gray-800 text-sm mb-2">Best use case:</p>
                            <div className="text-gray-700 text-sm">{formatContentModular([details.bestFor])}</div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <span className="text-lg mt-0.5">📝</span>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm mb-2">Description:</p>
                            <div className="text-gray-700 text-sm">{formatContentModular(details.descriptionPoints)}</div>
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
                      className="relative border-t-2 border-cyan-100 pt-4 flex flex-row items-end justify-between gap-4"
                    >
                      {/* Store links on left */}
                      <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
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
                      <div className="relative ml-auto shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setRatingPickerFor((prev) => (prev === app.id ? null : app.id))}
                          className="h-10 sm:h-11 inline-flex items-center gap-2 rounded-full border border-violet-300 bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 sm:px-4 text-white text-[11px] sm:text-xs font-semibold shadow-md hover:shadow-lg transition-all"
                          aria-label="Rate this app recommendation"
                          title="Rate this app recommendation"
                        >
                          <span className="text-xs sm:text-sm leading-none">★</span>
                          <span>{userRatings[app.id] ? `${userRatings[app.id]}/5` : "Rate"}</span>
                        </button>

                        {ratingPickerFor === app.id && (
                          <div className="absolute right-0 bottom-12 z-20 w-[220px] rounded-2xl border border-violet-200 bg-white/95 backdrop-blur p-3 shadow-xl sm:bottom-14">
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
          );
        })}
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
        <div className="order-first lg:order-none lg:w-[350px] bg-white rounded-2xl shadow-md border border-gray-200 p-6 h-fit sticky top-24 max-[639px]:p-4 max-[639px]:max-h-[78vh] max-[639px]:overflow-hidden sm:max-h-none sm:overflow-visible">
        <h2 className="text-xl font-bold mb-6 text-gray-800 max-[639px]:text-lg max-[639px]:mb-4">Selected Apps ({selectedApps.length})</h2>
          
        {selectedApps.length === 0 ? (
         <div className="text-center py-8">
           <p className="text-gray-800 mb-2 font-medium">No apps selected yet</p>
           <p className="text-gray-600 text-sm">
             Pick some apps on the left to build your bundle.
           </p>
         </div>
       ) : (
         <div className="space-y-4 mb-6 lg:max-h-[340px] lg:overflow-y-auto lg:pr-1 max-[639px]:grid max-[639px]:grid-flow-col max-[639px]:auto-cols-max max-[639px]:gap-2 max-[639px]:mb-4 max-[639px]:overflow-x-auto max-[639px]:overflow-y-hidden max-[639px]:pb-1">
           {selectedApps.map(appId => {
             const app = apps.find(a => a.id === appId);
             return app ? (
               <div
                 key={app.id}
                 className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl min-w-0 max-[639px]:w-[98px] max-[639px]:h-[56px] max-[639px]:justify-between max-[639px]:gap-1.5 max-[639px]:px-2 max-[639px]:py-1.5"
               >
                 <div className="w-10 h-10 relative flex-shrink-0 max-[639px]:w-9 max-[639px]:h-9">
                   <NextImage
                     src={app.icon_url || "/file.svg"}
                     alt={app.name}
                     fill
                      className="object-cover rounded-md"
                   />
                 </div>
                 <span className="hidden sm:block flex-1 text-gray-900 font-medium truncate">
                   {app.name}
                 </span>
                 <button
                   onClick={() => toggleSelect(app.id)}
                   className="inline-flex h-auto w-auto shrink-0 items-center justify-center rounded-none bg-transparent p-0 text-red-500 hover:text-red-700 max-[639px]:h-7 max-[639px]:w-7 max-[639px]:rounded-md max-[639px]:bg-red-100 max-[639px]:hover:bg-red-200 max-[639px]:shadow-none"
                   aria-label={`Remove ${app.name}`}
                   title={`Remove ${app.name}`}
                 >
                   <FaTimes className="text-base leading-none max-[639px]:text-sm" />
                 </button>
               </div>
             ) : null;
           })}
         </div>
       )}

          {/* Buttons group at bottom */}
        <div className="flex flex-col gap-3 mt-6 max-[639px]:grid max-[639px]:grid-cols-3 max-[639px]:gap-2 max-[639px]:mt-4">
          <button
            onClick={handleGenerateQR}
            disabled={!selectedApps.length}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold transition max-[639px]:flex-col max-[639px]:gap-1 max-[639px]:px-2 max-[639px]:py-2 max-[639px]:text-[11px] ${
              selectedApps.length
                ? "bg-teal-400 hover:bg-teal-500 shadow-lg"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            <FaQrcode className="text-lg max-[639px]:text-base" />
            <span className="max-[639px]:block">QR</span>
            <span className="max-[639px]:hidden">Generate QR Code</span>
          </button>

          <button
            onClick={handleEssentialsClick}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-300 hover:bg-blue-400 text-blue-900 text-sm font-semibold shadow-lg transition max-[639px]:flex-col max-[639px]:gap-1 max-[639px]:px-2 max-[639px]:py-2 max-[639px]:text-[11px]"
          >
            <FaGlobe className="text-lg max-[639px]:text-base" />
            <span>Essentials</span>
          </button>

          <button
            onClick={clearAll}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-300 hover:bg-red-400 text-red-900 text-sm font-semibold shadow-lg transition max-[639px]:flex-col max-[639px]:gap-1 max-[639px]:px-2 max-[639px]:py-2 max-[639px]:text-[11px]"
          >
            <FaTimes className="text-lg max-[639px]:text-base" />
            <span>Clear All</span>
          </button>

          {selectedApps.length > 0 && (
            <p className="text-xs text-center text-gray-500 mt-1 max-[639px]:col-span-3 max-[639px]:text-[10px] max-[639px]:mt-0.5 max-[639px]:whitespace-nowrap">
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