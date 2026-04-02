// src/components/ui/HeroSection.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchAppsByCountry, searchCountries,fetchCountryInfo } from "@/src/utils/api";
import { useLoader } from "@/components/LoaderContext";
import Image from "next/image";

// Custom hook for scroll‐based animation
function useScrollReveal(ref, options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, ...options }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);
  return isVisible;
}





// Hero images with descriptive alt text for better SEO
const heroImages = [
  { src: "/IMG1.jpg", alt: "Beautiful beach destination for travelers" },
  { src: "/IMG2.avif", alt: "Scenic mountain landscape for adventure travelers" },
  { src: "/IMG3.jpg", alt: "Historic European city architecture" },
  { src: "/IMG4.jpg", alt: "Tropical island paradise destination" },
  { src: "/IMG5.jpg", alt: "Urban cityscape with iconic landmarks" },
  { src: "/IMG6.jpg", alt: "Cultural heritage site for tourists" },
  { src: "/IMG7.avif", alt: "Serene natural landscape for nature lovers" },
  { src: "/IMG8.webp", alt: "Remote wilderness destination for explorers" },
  { src: "/IMG9.jpg", alt: "Local cuisine and dining experience" },
  { src: "/IMG10.jpg", alt: "Family-friendly travel destination" },
  { src: "/IMG11.jpg", alt: "Ancient historical monument for history enthusiasts" },
  { src: "/IMG12.jpg", alt: "Breathtaking waterfall in exotic location" },
];

const HeroSection = () => {
  const router = useRouter();
  const { setShow } = useLoader();


 // ─── Autocomplete state ───
    const [suggestions, setSuggestions] = useState([]);
    const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);

     // → NEW: highlight index for keyboard nav
     const [highlightedIndex, setHighlightedIndex] = useState(-1);


    // Simple in‐memory cache so we don’t refetch on selection
    const prefetchCache = useRef(new Map());


     // → NEW: refs for click‑outside  input
     const inputRef = useRef(null);
     const dropdownRef = useRef(null);


  // ――― Search Bar State & Handlers ―――
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setErrorMsg("");
    // kickoff suggestion lookup
      triggerSuggestions(e.target.value);
  };


   // Debounce helper
       const debounceRef = useRef(null);
       const triggerSuggestions = (text) => {
        clearTimeout(debounceRef.current);
        if (!text.trim()) {
          setSuggestions([]);
          return;
        }
      
        debounceRef.current = setTimeout(async () => {
          const results = await searchCountries(text.trim());
          setSuggestions(results);
          setIsSuggestionsVisible(true);
      
         // Prefetch top 5 with concurrency limit
          const MAX_CONCURRENT = 3;
          let inFlight = 0;
          const queue = [];
      
          results.slice(0, 5).forEach((c) => {
            const code = c.code.toLowerCase();
            if (prefetchCache.current.has(code)) return;
      
            const task = async () => {
              try {
                const info = await fetchCountryInfo(code);
                const apps = await fetchAppsByCountry(code);
                prefetchCache.current.set(code, { info, apps });
              } catch (err) {
                console.warn(`Prefetch failed for ${code}:`, err.message);
              } finally {
                inFlight--;
                if (queue.length) queue.shift()();
              }
            };
      
            queue.push(task);
          });
      
          while (inFlight < MAX_CONCURRENT && queue.length) {
            inFlight++;
            queue.shift()();
          }
        }, 300);
      };



  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setErrorMsg("Please enter a country name or code.");
      return;
    }
// If user clicked “Search” instead of selecting one
// start both spinners
setLoading(true);
setShow(true);
setErrorMsg("");


// If it's exactly two letters, try it as an ISO code first
    if (/^[A-Za-z]{2}$/.test(trimmed)) {
        // See if we actually have metadata for that code
        const info = await fetchCountryInfo(trimmed.toUpperCase());
        if (info?.name) {
          setLoading(false);
          // setShow(false);
          router.push(`/country/${trimmed.toLowerCase()}`);
          return;
        }else {
                  // No such code → 404
                  setLoading(false);
                  router.push("/notfound");
                  return;}}
    
        // Otherwise search by full name
        const results = await searchCountries(trimmed);
        setLoading(false);
        // setShow(false);
        if (results.length === 0) {
                // No matches → 404
                router.push("/not-found");
                return;
               }
      
    
        const countryCode = results[0].code.toLowerCase();
        router.push(`/country/${countryCode}`);


  };

  // → NEW: full keyboard navigation
const handleKeyDown = (e) => {
  if (!isSuggestionsVisible) {
    if (e.key === "Enter") return handleSearch();
    return;
  }
  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      setHighlightedIndex(i => Math.min(i + 1, suggestions.length - 1));
      break;
    case "ArrowUp":
      e.preventDefault();
      setHighlightedIndex(i => Math.max(i - 1, 0));
      break;
    case "Enter":
      e.preventDefault();
      if (highlightedIndex >= 0) {
        handleSelect(suggestions[highlightedIndex]);
      } else {
        handleSearch();
      }
      break;
    case "Escape":
      setIsSuggestionsVisible(false);
      break;
  }
};

  // ――― End Search Bar Logic ―――


  const handleSelect = (country) => {
          const code = country.code.toLowerCase();
          setLoading(true);
          setShow(true);
          // we already prefetched
          if (!prefetchCache.current.has(code)) {
            // fallback if something went wrong
            prefetchCache.current.set(code, {
              info: fetchCountryInfo(code),
              apps: fetchAppsByCountry(code),
            });
          }
          router.push(`/country/${code}`);
        };


        useEffect(() => {
          const onClickOutside = (e) => {
            if (
              dropdownRef.current &&
              !dropdownRef.current.contains(e.target) &&
              inputRef.current &&
              !inputRef.current.contains(e.target)
            ) {
              setIsSuggestionsVisible(false);
            }
          };
          document.addEventListener("mousedown", onClickOutside);
          return () => document.removeEventListener("mousedown", onClickOutside);
        }, []);
        



  const [bgIndex, setBgIndex] = useState(0);
  const howItWorksRef = useRef(null);
  const popularDestRef = useRef(null);
  const ctaRef = useRef(null);

  const howItWorksVisible = useScrollReveal(howItWorksRef);
  const popularDestVisible = useScrollReveal(popularDestRef);
  const ctaVisible = useScrollReveal(ctaRef);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pb-16 scroll-smooth homepage-scroll" id="hero-section">
      {/* Background slideshow with parallax effect */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((img, idx) => (
          <div 
            key={img.src}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              bgIndex === idx ? "opacity-100" : "opacity-0"
            }`}
          >
                       <Image
             src={img.src}
             alt={img.alt}
             fill
             sizes="100vw"
             priority                     /* always load as high priority */
             unoptimized                  /* skip the built-in optimizer */
             quality={100}                /* render at max quality */
             style={{
               objectFit: "cover",
               transform: bgIndex === idx ? "scale(1.05)" : "scale(1)",
               transition: "transform 1s",
               filter: bgIndex === idx
                 ? "contrast(1.12) saturate(1.12) brightness(0.97)"
                 : "none",
             }}
             draggable={false}
           />
          </div>
        ))}
        {/* Subtle dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
        {/* Fade‐out gradient at bottom */}
        <div
          className="absolute bottom-0 left-0 w-full h-32 md:h-48 pointer-events-none z-20"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0) 60%, #fff 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-900/50 to-white/30 z-20"></div>
      </div>

      <div className="container mx-auto relative z-30 flex flex-col items-center justify-center h-[70vh] px-4">
        <div className="w-full max-w-5xl mx-auto text-center flex flex-col items-center justify-center">
          {/* Content */}
          <div className="relative z-10 text-white w-full">
          <h1 className="
              text-4xl      /* mobile */
              sm:text-5xl   /* ≥640px */
              md:text-6xl   /* ≥768px */
              lg:text-7xl   /* ≥1024px */
              font-extrabold mb-8 animate-fade-in-up transition-all duration-700 leading-tight drop-shadow-xl
            ">
              Discover the Perfect Apps for Your Journey
            </h1>
            <p className="
              text-lg       /* mobile */
              sm:text-xl    /* ≥640px */
              md:text-2xl   /* ≥768px */
              mb-12 animate-fade-in-up delay-200 transition-all duration-700 font-semibold drop-shadow-lg
            ">
              Find essential travel apps curated for your destination
            </p>

            {/* ――― Search Bar Start ――― */}
            <div className="
   w-11/12      /* mobile: 91% of viewport, so it’s inset a bit */
   sm:w-2/3     /* ≥640px: go back to your original 66% width */
   md:w-2/3     /* keep at 66% on medium too */
   lg:w-2/3     /* desktop: same 66% you used before */
   max-w-5xl    /* cap it to your original max width */
   mx-auto
   relative
   rounded-full sm:rounded-xl
   shadow-xl transition-all duration-300 hover:shadow-2xl
 ">
<div className="flex items-center w-full bg-white border border-gray-300 rounded-full sm:rounded-xl overflow-hidden p-2 sm:p-3">
                <div className="flex-grow flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                    className="ml-4 text-gray-500 h-5 w-5 sm:h-6 sm:w-6"
                    aria-hidden="true"
                >
                    <circle cx="14" cy="14" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
                <input
                ref={inputRef}
                  type="text"
                  aria-label="Search country"
                    placeholder="Eg. France or FR"
                  value={query}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                    className="h-10 sm:h-12 w-full pl-3 pr-4 text-gray-800 text-base sm:text-lg font-medium placeholder-gray-400 focus:outline-none bg-transparent"
                />
              </div>


  {/* ――― Autocomplete Suggestions ――― */}
  {isSuggestionsVisible && suggestions.length > 0 && (
  <ul
    ref={dropdownRef}
    className="
      absolute top-full left-0 w-full mt-2
      bg-white/50            /* 50% transparent */
      backdrop-blur-md       /* glassy frosted effect */
      border border-white/30 /* very light border */
      rounded-xl
      shadow-2xl
      z-50
      max-h-64 overflow-auto
      font-serif             /* classy serif font */
      text-gray-800
    "
  >
    {suggestions.map((c, idx) => (
      <li
        key={c.code}
        onClick={() => handleSelect(c)}
        onMouseEnter={() => setHighlightedIndex(idx)}
        className={`
          flex items-center px-4 py-3 mb-1
          rounded-lg
          cursor-pointer
          transition-all duration-150 ease-out
          ${
            idx === highlightedIndex
              ? "bg-white/70 text-teal-800 shadow-inner scale-100"
              : "hover:bg-white/30 hover:scale-[1.02]"
          }
        `}
      >
        {/* subtle fade-in for each item */}
        <span className="animate-fade-in">{c.name}</span>
        <span className="ml-auto text-sm tracking-wide">({c.code})</span>
      </li>
    ))}
  </ul>
)}



              <button
                onClick={handleSearch}
                disabled={loading}
                  className="bg-teal-500 hover:bg-teal-600 disabled:opacity-75 disabled:cursor-not-allowed text-white px-1 sm:px-3 py-6 font-semibold text-sm sm:text-base h-10 sm:h-12 flex items-center justify-center transition-colors duration-300 rounded-full sm:rounded-xl w-[12%] min-w-[60px] mx-1 active:scale-95 active:shadow-inner transform transition-transform"
                  aria-label="Search for travel apps by country"
              >
                  {loading ? (
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                ) : (
                  "Search"
                )}
              </button>
              </div>
            </div>
{/* End Autocomplete Suggestions */}
            {errorMsg && (
              <p className="mt-4 text-red-500 font-bold text-lg drop-shadow-lg">{errorMsg}</p>
            )}
            {/* ――― Search Bar End ――― */}
          </div>
        </div>
      </div>

      {/* Animated sections below Hero */}
      <div
        ref={howItWorksRef}
        className={`transition-all duration-1000 ease-out ${
          howItWorksVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        {/* <HowItWorks /> or content here */}
      </div>
      <div
        ref={popularDestRef}
        className={`transition-all duration-1000 ease-out delay-200 ${
          popularDestVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-12"
        }`}
      >
        {/* <PopularDestinations /> or content here */}
      </div>
      <div
        ref={ctaRef}
        className={`transition-all duration-1000 ease-out delay-300 ${
          ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        {/* <CallToAction /> or content here */}
      </div>
    </section>
  );
};

export default HeroSection;
