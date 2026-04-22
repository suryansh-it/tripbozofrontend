"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchAppsByCountry, searchCountries, fetchCountryInfo } from "@/src/utils/api";
import { useLoader } from "@/components/LoaderContext";
import Image from "next/image";

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

const heroImages = [
  { src: "/IMG1.jpg", alt: "Beautiful beach destination for travelers" },
  { src: "/IMG2.jpg", alt: "Scenic mountain landscape for adventure travelers" },
  { src: "/IMG3.jpg", alt: "Historic European city architecture" },
  { src: "/IMG4.jpg", alt: "Tropical island paradise destination" },
  { src: "/IMG5.jpg", alt: "Urban cityscape with iconic landmarks" },
  { src: "/IMG6.jpg", alt: "Cultural heritage site for tourists" },
  { src: "/IMG7.jpg", alt: "Serene natural landscape for nature lovers" },
  { src: "/IMG8.jpg", alt: "Remote wilderness destination for explorers" },
  { src: "/IMG9.jpg", alt: "Local cuisine and dining experience" },
  { src: "/IMG10.jpg", alt: "Family-friendly travel destination" },
  { src: "/IMG11.jpg", alt: "Ancient historical monument for history enthusiasts" },
  { src: "/IMG12.jpg", alt: "Breathtaking waterfall in exotic location" },
];

const HeroSection = () => {
  const router = useRouter();
  const { setShow } = useLoader();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const prefetchCache = useRef(new Map());
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  const [bgIndex, setBgIndex] = useState(0);
  const howItWorksRef = useRef(null);
  const popularDestRef = useRef(null);
  const ctaRef = useRef(null);

  const howItWorksVisible = useScrollReveal(howItWorksRef);
  const popularDestVisible = useScrollReveal(popularDestRef);
  const ctaVisible = useScrollReveal(ctaRef);

  const triggerSuggestions = (text) => {
    clearTimeout(debounceRef.current);

    if (!text.trim()) {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
      setHighlightedIndex(-1);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const results = await searchCountries(text.trim());
      setSuggestions(results);
      setIsSuggestionsVisible(true);
      setHighlightedIndex(-1);

      const maxConcurrent = 3;
      let inFlight = 0;
      const queue = [];

      results.slice(0, 5).forEach((country) => {
        const code = country.code.toLowerCase();
        if (prefetchCache.current.has(code)) return;

        const task = async () => {
          try {
            const info = await fetchCountryInfo(code);
            const apps = await fetchAppsByCountry(code);
            prefetchCache.current.set(code, { info, apps });
          } catch (err) {
            console.warn(`Prefetch failed for ${code}:`, err?.message || err);
          } finally {
            inFlight -= 1;
            if (queue.length) {
              const nextTask = queue.shift();
              nextTask();
            }
          }
        };

        queue.push(async () => {
          inFlight += 1;
          await task();
        });
      });

      while (inFlight < maxConcurrent && queue.length) {
        const nextTask = queue.shift();
        nextTask();
      }
    }, 300);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    triggerSuggestions(value);
  };

  const handleSelect = (country) => {
    const code = country.code.toLowerCase();
    setShow(true);

    if (!prefetchCache.current.has(code)) {
      prefetchCache.current.set(code, {
        info: fetchCountryInfo(code),
        apps: fetchAppsByCountry(code),
      });
    }

    setIsSuggestionsVisible(false);
    router.push(`/country/${code}`);
  };

  const handleKeyDown = (e) => {
    if (!isSuggestionsVisible) return;

    const notFoundOptionIndex = suggestions.length;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, notFoundOptionIndex));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelect(suggestions[highlightedIndex]);
        } else if (highlightedIndex === notFoundOptionIndex) {
          router.push("/not-found");
        }
        break;
      case "Escape":
        setIsSuggestionsVisible(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
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
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="min-h-screen flex items-center justify-center relative overflow-hidden pb-16 scroll-smooth homepage-scroll"
      id="hero-section"
    >
      <div className="absolute inset-0 z-0">
        {heroImages.map((img, idx) => (
          <div
            key={img.src}
            className={`absolute inset-0 transition-opacity duration-1000 ${bgIndex === idx ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="100vw"
              priority
              unoptimized
              quality={100}
              style={{
                objectFit: "cover",
                transform: bgIndex === idx ? "scale(1.05)" : "scale(1)",
                transition: "transform 1s",
                filter: bgIndex === idx ? "contrast(1.12) saturate(1.12) brightness(0.97)" : "none",
              }}
              draggable={false}
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
        <div
          className="absolute bottom-0 left-0 w-full h-16 md:h-24 pointer-events-none z-20"
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 65%, rgba(255,255,255,0.92) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-900/45 to-white/15 z-20" />
      </div>

      <div className="container mx-auto relative z-30 flex flex-col items-center justify-start h-[72vh] pt-10 sm:pt-12 md:pt-10 -translate-y-4 sm:-translate-y-6 px-4">
        <div className="w-full max-w-5xl mx-auto text-center flex flex-col items-center justify-center">
          <div className="relative z-10 text-white w-full">
            <h1
              className="
                text-4xl
                sm:text-5xl
                md:text-6xl
                lg:text-7xl
                font-extrabold mb-8 animate-fade-in-up transition-all duration-700 leading-tight drop-shadow-xl
              "
            >
              Discover the Perfect Apps for Your Journey
            </h1>
            <p
              className="
                text-lg
                sm:text-xl
                md:text-2xl
                mb-12 animate-fade-in-up delay-200 transition-all duration-700 font-semibold drop-shadow-lg
              "
            >
              Find essential travel apps curated for your destination
            </p>

            <div
              className="
                w-11/12
                sm:w-2/3
                md:w-2/3
                lg:w-2/3
                max-w-5xl
                mx-auto
                relative
                rounded-full sm:rounded-xl
                bg-white/20 backdrop-blur-md border border-white/35
                shadow-xl transition-all duration-300 hover:shadow-2xl
              "
            >
              <div className="flex items-center w-full rounded-full sm:rounded-xl overflow-hidden px-4 sm:px-5 py-2 sm:py-3">
                <div className="flex-grow flex items-center gap-4 sm:gap-5">
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
                    className="text-white/90 h-5 w-5 sm:h-6 sm:w-6 shrink-0"
                    aria-hidden="true"
                  >
                    <circle cx="14" cy="14" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    aria-label="Search country"
                    placeholder="Eg. France or FR"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="h-10 sm:h-12 w-full pl-1 pr-2 text-white text-base sm:text-lg font-medium placeholder-white/75 focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {isSuggestionsVisible && (
                <ul
                  ref={dropdownRef}
                  className="absolute top-full left-0 w-full mt-2 bg-white/50 backdrop-blur-md border border-white/30 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto font-serif text-gray-800"
                >
                  {suggestions.length > 0 ? (
                    <>
                      {suggestions.map((country, idx) => (
                        <li
                          key={country.code}
                          onClick={() => handleSelect(country)}
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          className={`
                            flex items-center px-4 py-3 mb-1 rounded-lg cursor-pointer transition-all duration-150 ease-out
                            ${
                              idx === highlightedIndex
                                ? "bg-white/70 text-teal-800 shadow-inner scale-100"
                                : "hover:bg-white/30 hover:scale-[1.02]"
                            }
                          `}
                        >
                          <span className="animate-fade-in">{country.name}</span>
                          <span className="ml-auto text-sm tracking-wide">({country.code})</span>
                        </li>
                      ))}
                    </>
                  ) : (
                    <li className="px-4 py-3 text-gray-600">No exact matches found.</li>
                  )}

                  <li
                    onClick={() => router.push("/not-found")}
                    onMouseEnter={() => setHighlightedIndex(suggestions.length)}
                    className={`
                      flex items-center px-4 py-3 mb-1 rounded-lg cursor-pointer transition-all duration-150 ease-out border-t border-white/20 mt-2
                      ${
                        highlightedIndex === suggestions.length
                          ? "bg-blue-500/70 text-white shadow-inner"
                          : "hover:bg-white/30 hover:scale-[1.02] text-gray-700"
                      }
                    `}
                  >
                    Country not available? Suggest it here
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        ref={howItWorksRef}
        className={`transition-all duration-1000 ease-out ${howItWorksVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      >
        {/* <HowItWorks /> or content here */}
      </div>
      <div
        ref={popularDestRef}
        className={`transition-all duration-1000 ease-out delay-200 ${popularDestVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      >
        {/* <PopularDestinations /> or content here */}
      </div>
      <div
        ref={ctaRef}
        className={`transition-all duration-1000 ease-out delay-300 ${ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      >
        {/* <CallToAction /> or content here */}
      </div>
    </section>
  );
};

export default HeroSection;
