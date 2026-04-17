// src/app/country/[country]/essentials/page.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { fetchEssentials, fetchCountryInfo } from "@/src/utils/api";
import { useLoader } from "@/components/LoaderContext";
import ScrollNavButtons from "@/components/ScrollNavButtons";
import { FaDownload, FaStop, FaVolumeUp } from "react-icons/fa";

export default function EssentialsPage() {
  const { country } = useParams();
  const router = useRouter();
  const { setShow } = useLoader();

  const [countryName, setCountryName] = useState("");
  const [data, setData] = useState({
    emergencies: [],
    phrases: [],
    tips: [],
    embassyContacts: [],
    originAssistance: null,
  });
  const [loading, setLoading] = useState(true);
  const [speakingKey, setSpeakingKey] = useState(null);
  const [originCountry, setOriginCountry] = useState(null);
  const [voices, setVoices] = useState([]);
  const audioRef = useRef(null);
  const translateCacheRef = useRef(new Map());

  const COUNTRY_NAME_BY_CODE = {
    AE: "United Arab Emirates",
    AT: "Austria",
    AU: "Australia",
    BR: "Brazil",
    CA: "Canada",
    CH: "Switzerland",
    CN: "China",
    DE: "Germany",
    EG: "Egypt",
    ES: "Spain",
    FR: "France",
    GB: "United Kingdom",
    GR: "Greece",
    HR: "Croatia",
    ID: "Indonesia",
    IN: "India",
    IT: "Italy",
    JP: "Japan",
    KR: "South Korea",
    MA: "Morocco",
    MX: "Mexico",
    MY: "Malaysia",
    NL: "Netherlands",
    PT: "Portugal",
    SA: "Saudi Arabia",
    TH: "Thailand",
    TR: "Turkey",
    US: "United States",
    VN: "Vietnam",
  };

  const COUNTRY_UTILITY = {
    FR: {
      transit: "Use RATP for Paris metro and buses; SNCF for intercity trains. Ride-share is useful late at night.",
      payments: "Cards and contactless are common, but carry some cash for small shops and kiosks.",
      connectivity: "Strong coverage in cities; eSIM and prepaid SIM are easy to buy.",
      safety: "Watch pickpockets in crowded tourist zones and on metro lines.",
      scams: "Avoid petition scams and unofficial taxi drivers near landmarks.",
      emergency: "Police 17, Ambulance 15, EU emergency 112.",
    },
    US: {
      transit: "Ride-share is common in cities; public transit quality varies by city.",
      payments: "Card-first economy. Keep a backup card and expect tipping in service contexts.",
      connectivity: "Strong carrier coverage in cities, patchy in remote routes.",
      safety: "Use official ride apps and avoid isolated areas at night.",
      scams: "Watch for fake charity pitches and transport overcharging.",
      emergency: "Call 911 for police, fire, or medical emergencies.",
    },
    IN: {
      transit: "Use metro where available; for short trips use app-based cabs or negotiated auto-rickshaws.",
      payments: "UPI is widely used; carry cash for local markets and small vendors.",
      connectivity: "Affordable mobile data and easy prepaid SIM options.",
      safety: "Stay alert in crowded places and prefer verified transport at night.",
      scams: "Confirm fares before travel and avoid unsolicited guide offers.",
      emergency: "Police 100, Ambulance 102, national emergency 112.",
    },
    GB: {
      transit: "Contactless works across much of London transport; rail is reliable for intercity.",
      payments: "Card and contactless are standard; cash use is limited in many areas.",
      connectivity: "Good urban coverage and easy tourist SIM/eSIM options.",
      safety: "Generally safe, but protect valuables on crowded trains and streets.",
      scams: "Use licensed taxis and avoid street gambling setups.",
      emergency: "Emergency numbers: 999 or 112.",
    },
    AU: {
      transit: "Cities have strong public transport; for long routes domestic flights are practical.",
      payments: "Contactless card payments are near-universal.",
      connectivity: "Great in cities; weaker in remote areas.",
      safety: "Follow beach safety flags and local weather warnings.",
      scams: "Book tours through verified operators only.",
      emergency: "Emergency number 000 (or 112 from mobile).",
    },
  };

  // Only get the pretty name once
  useEffect(() => {
    fetchCountryInfo(country.toUpperCase())
      .then((info) => setCountryName(info.name || country.toUpperCase()))
      .catch(() => setCountryName(country.toUpperCase()));
  }, [country]);

  // Fetch the essentials, but DO NOT touch the loader here
  useEffect(() => {
    const originCode = originCountry?.code || "";
    fetchEssentials(country.toUpperCase(), originCode)
      .then((json) => {
        setData({
          emergencies: Array.isArray(json?.emergencies) ? json.emergencies : [],
          phrases: Array.isArray(json?.phrases) ? json.phrases : [],
          tips: Array.isArray(json?.tips) ? json.tips : [],
          embassyContacts: Array.isArray(json?.embassy_contacts) ? json.embassy_contacts : [],
          originAssistance: json?.origin_assistance || null,
        });
      })
      .catch(() => {
        // on error, set your fallback
      })
      .finally(() => setLoading(false));
  }, [country, originCountry?.code]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tripbozo_origin_country");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.code) {
        const code = String(parsed.code).toUpperCase();
        const name = parsed.name || COUNTRY_NAME_BY_CODE[code] || code;
        setOriginCountry({ code, name });
      }
    } catch {
      const rawCode = localStorage.getItem("tripbozo_origin_country");
      if (rawCode && /^[A-Za-z]{2}$/.test(rawCode)) {
        const code = rawCode.toUpperCase();
        setOriginCountry({ code, name: COUNTRY_NAME_BY_CODE[code] || code });
      } else {
        setOriginCountry(null);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      // Revoke cached blob URLs when leaving the page.
      for (const url of translateCacheRef.current.values()) {
        if (typeof url === "string" && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      }
      translateCacheRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const syncVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(Array.isArray(available) ? available : []);
    };

    syncVoices();
    window.speechSynthesis.addEventListener("voiceschanged", syncVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", syncVoices);
    };
  }, []);

  const { emergencies, phrases, tips, embassyContacts } = data;
  const destinationCode = country?.toUpperCase();
  const utility = COUNTRY_UTILITY[destinationCode] || {
    transit: "Check official local transit apps for routes and ticketing.",
    payments: "Cards are widely accepted; keep some local cash as backup.",
    connectivity: "Get a local SIM/eSIM at airport or main telecom stores.",
    safety: "Follow local advisories and keep emergency contacts ready.",
    scams: "Use official transport and avoid unsolicited offers.",
    emergency: "Know local emergency numbers before you travel.",
  };
  const destinationEmbassyContact = React.useMemo(() => {
    if (!originCountry?.code || !Array.isArray(embassyContacts) || embassyContacts.length === 0) {
      return null;
    }

    const originCode = originCountry.code.toUpperCase();
    const originName = String(originCountry.name || COUNTRY_NAME_BY_CODE[originCode] || "").toLowerCase();
    const originKey = originName.replace(/[^a-z]/g, "");

    const matched = embassyContacts.find((entry) => {
      const source = `${entry?.origin_country || ""} ${entry?.name || ""}`.toLowerCase();
      const sourceKey = source.replace(/[^a-z]/g, "");
      if (!originKey) return false;
      return source.includes(originName) || sourceKey.includes(originKey);
    });

    if (matched) return matched;

    return embassyContacts.find((entry) =>
      /(embassy|consulate|foreign|diplomatic)/i.test(entry?.name || "")
    ) || null;
  }, [embassyContacts, originCountry, COUNTRY_NAME_BY_CODE]);
  const emergencyGuidelines = [
    "Call local emergency services first if there is immediate danger.",
    "Contact your embassy/consulate and request consular support.",
    "Keep passport copy, visa, and insurance details ready.",
    "Share your location and emergency contact with a trusted person.",
  ];

  const originAssistance = data.originAssistance;

// Sample fallbacks
const sampleInsurance = [
  { name: "World Nomads", link: "https://www.worldnomads.com" },
  { name: "Allianz Travel", link: "https://www.allianztravelinsurance.com" },
  { name: "InsureMyTrip", link: "https://www.insuremytrip.com" },
  { name: "VisitorsCoverage", link: "https://www.visitorscoverage.com" },
];
const sampleEsim = [
  { name: "Airalo", link: "https://www.airalo.com" },
  { name: "GigSky", link: "https://www.gigsky.com" },
  { name: "Nomad", link: "https://www.getnomad.app" },
  { name: "eSIMDB", link: "https://esimdb.com" },
  { name: "Roamless", link: "https://roamless.com" },
];

  const getSpeechLang = (countryCode) => {
    const map = {
      // All 30 countries with proper language codes for TTS
      AT: "de-AT",      // Austria - German
      AU: "en-AU",      // Australia - English
      AE: "ar-AE",      // UAE - Arabic (non-roman)
      BR: "pt-BR",      // Brazil - Portuguese
      CA: "en-CA",      // Canada - English
      CH: "de-CH",      // Switzerland - German
      CN: "zh-CN",      // China - Mandarin (non-roman)
      DE: "de-DE",      // Germany - German
      EG: "ar-EG",      // Egypt - Arabic (non-roman)
      ES: "es-ES",      // Spain - Spanish
      FR: "fr-FR",      // France - French
      GB: "en-GB",      // UK - English
      GR: "el-GR",      // Greece - Greek (non-roman)
      HR: "hr-HR",      // Croatia - Croatian
      ID: "id-ID",      // Indonesia - Indonesian
      IN: "hi-IN",      // India - Hindi (non-roman)
      IT: "it-IT",      // Italy - Italian
      JP: "ja-JP",      // Japan - Japanese (non-roman)
      KR: "ko-KR",      // South Korea - Korean (non-roman)
      MA: "ar-MA",      // Morocco - Arabic (non-roman)
      MX: "es-MX",      // Mexico - Spanish
      MY: "ms-MY",      // Malaysia - Malay
      NL: "nl-NL",      // Netherlands - Dutch
      PT: "pt-PT",      // Portugal - Portuguese
      SA: "ar-SA",      // Saudi Arabia - Arabic (non-roman)
      TH: "th-TH",      // Thailand - Thai (non-roman)
      TR: "tr-TR",      // Turkey - Turkish (non-roman)
      US: "en-US",      // USA - English
      VN: "vi-VN",      // Vietnam - Vietnamese (non-roman)
    };
    return map[countryCode?.toUpperCase()] || "en-US";
  };

  const chooseVoiceForLang = (lang) => {
    if (!voices.length) return null;
    const exact = voices.find((v) => v.lang?.toLowerCase() === lang.toLowerCase());
    if (exact) return exact;
    const base = lang.split("-")[0].toLowerCase();
    const family = voices.find((v) => v.lang?.toLowerCase().startsWith(`${base}-`));
    return family || null;
  };

  const baseLang = (lang) => (lang || "en-US").split("-")[0].toLowerCase();

  const looksEnglish = (text) => /^[A-Za-z0-9\s.,!?"'’\-/:;()]+$/.test(text || "");

  const looksMojibake = (text) => /[ÃÂâåðœ¤¦]/.test(text || "");

  const extractSpeakableText = (phrase, targetLang) => {
    const original = (phrase?.original || "").trim();
    const translation = (phrase?.translation || "").trim();
    const ttsText = (phrase?.tts_text || "").trim();
    const source = ttsText || translation || original;
    const targetBase = baseLang(targetLang);
    const targetIsEnglish = targetBase === "en";

    if (!source) return "";

    const paren = source.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    if (paren) {
      const outside = (paren[1] || "").trim();
      const inside = (paren[2] || "").trim();

      // Resolve "native (english gloss)" or "english (native)" consistently.
      if (!targetIsEnglish) {
        if (outside && !looksMojibake(outside) && !looksEnglish(outside)) return outside;
        if (inside && !looksMojibake(inside) && !looksEnglish(inside)) return inside;
        if (outside && !looksMojibake(outside)) return outside;
        if (inside && !looksMojibake(inside)) return inside;
      } else {
        if (outside && !looksMojibake(outside) && looksEnglish(outside)) return outside;
        if (inside && !looksMojibake(inside) && looksEnglish(inside)) return inside;
        if (outside && !looksMojibake(outside)) return outside;
        if (inside && !looksMojibake(inside)) return inside;
      }
    }

    return source.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
  };

  const synthesizeViaProxy = async ({ text, targetLang, autoTranslate }) => {
    const clean = (text || "").trim();
    if (!clean) throw new Error("Missing TTS text");

    const cacheKey = `${baseLang(targetLang)}::${autoTranslate ? "auto" : "raw"}::${clean}`;
    if (translateCacheRef.current.has(cacheKey)) {
      return translateCacheRef.current.get(cacheKey);
    }

    const res = await fetch("/api/tts/speak", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "audio/mpeg,*/*",
      },
      body: JSON.stringify({
        text: clean,
        targetLang,
        autoTranslate,
      }),
    });

    if (!res.ok) {
      throw new Error(`Proxy TTS failed: ${res.status}`);
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    translateCacheRef.current.set(cacheKey, url);
    return url;
  };

  const downloadTextFile = (filename, content) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const downloadSection = (sectionName) => {
    const cc = country?.toUpperCase() || "COUNTRY";
    const base = `${cc}-essentials`;

    if (sectionName === "assistance") {
      if (!originCountry?.code || !originAssistance) {
        return downloadTextFile(
          `${base}-country-assistance.txt`,
          "No personalized country assistance available yet. Set your origin country in onboarding."
        );
      }

      const lines = [
        `Origin Country: ${originCountry.name} (${originCountry.code})`,
        `Destination: ${countryName || cc}`,
        `Agency: ${originAssistance.label}`,
        `24/7 Emergency: ${originAssistance.emergency_phone || "Not available"}`,
        ...(originAssistance.emergency_phone_intl ? [`International Emergency: ${originAssistance.emergency_phone_intl}`] : []),
        `Consular Address: ${originAssistance.consular_address || "Not listed"}`,
        ...(originAssistance.website ? [`Emergency Help: ${originAssistance.website}`] : []),
        ...(originAssistance.mission_finder ? [`Embassy/Consulate Finder: ${originAssistance.mission_finder}`] : []),
        ...(destinationEmbassyContact
          ? [
              `Destination Embassy/Consular Desk (${destinationEmbassyContact.name}): ${destinationEmbassyContact.phone || "Phone not listed"}`,
              ...(destinationEmbassyContact.address ? [`Destination Embassy Address: ${destinationEmbassyContact.address}`] : []),
            ]
          : ["Destination Embassy/Consular Desk: Not listed"]),
        "",
        "Emergency Guidelines:",
        ...emergencyGuidelines.map((g, i) => `${i + 1}. ${g}`),
      ];

      return downloadTextFile(`${base}-country-assistance.txt`, lines.join("\n"));
    }

    if (sectionName === "emergencies") {
      const lines = emergencies.length
        ? emergencies.map((e) => `${e.name}: ${e.phone}${e.email ? ` | ${e.email}` : ""}`)
        : ["No emergency contacts available."];
      return downloadTextFile(`${base}-emergency-contacts.txt`, lines.join("\n"));
    }

    if (sectionName === "phrases") {
      const lines = phrases.length
        ? phrases.map((p) => `${p.original}${p.translation ? ` -> ${p.translation}` : ""}`)
        : ["No local phrases available."];
      return downloadTextFile(`${base}-local-phrases.txt`, lines.join("\n"));
    }

    if (sectionName === "tips") {
      const lines = [
        "Country Utility Snapshot:",
        `- Transit basics: ${utility.transit}`,
        `- Payment tips: ${utility.payments}`,
        `- Connectivity reality: ${utility.connectivity}`,
        `- Safety notes: ${utility.safety}`,
        `- Common scams to avoid: ${utility.scams}`,
        `- Emergency workflow: ${utility.emergency}`,
        "",
        "Additional Tips:",
        ...(tips.length ? tips.map((t) => `- ${t.tip}`) : ["- No useful tips available."]),
      ];
      return downloadTextFile(`${base}-useful-tips.txt`, lines.join("\n"));
    }

    if (sectionName === "insurance") {
      const lines = sampleInsurance.map((s) => `${s.name}: ${s.link}`);
      return downloadTextFile(`${base}-insurance-assistance.txt`, lines.join("\n"));
    }

    if (sectionName === "esim") {
      const lines = sampleEsim.map((s) => `${s.name}: ${s.link}`);
      return downloadTextFile(`${base}-esim-connectivity.txt`, lines.join("\n"));
    }
  };

  const stopAnySpeech = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
    }
  };

  const speakWithBrowserTTS = (textToSpeak, lang, key) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const voice = chooseVoiceForLang(lang);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang;
    if (voice) utterance.voice = voice;
    utterance.rate = 0.88;
    utterance.pitch = 1;
    utterance.onend = () => setSpeakingKey(null);
    utterance.onerror = () => setSpeakingKey(null);
    setSpeakingKey(key);
    window.speechSynthesis.speak(utterance);
  };

  const speakPhrase = async (phrase, key) => {
    if (typeof window === "undefined" || !phrase) return;

    if (speakingKey === key) {
      stopAnySpeech();
      setSpeakingKey(null);
    }

    stopAnySpeech();
    const lang = phrase?.tts_lang || getSpeechLang(country);
    let textToSpeak = extractSpeakableText(phrase, lang);
    if (!textToSpeak) return;

    const originalText = (phrase?.original || "").trim();
    const likelyEnglishInput = looksEnglish(originalText);
    const targetBase = baseLang(lang);
    const targetIsNonEnglish = targetBase !== "en";
    const textLooksEnglish = looksEnglish(textToSpeak);

    // Always auto-translate to target language when target is non-English and source text is English.
    const sourceForProxy = targetIsNonEnglish && likelyEnglishInput ? originalText : textToSpeak;
    const autoTranslate = targetIsNonEnglish && (likelyEnglishInput || textLooksEnglish);

    try {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      const audio = audioRef.current;
      const proxyUrl = await synthesizeViaProxy({
        text: sourceForProxy,
        targetLang: lang,
        autoTranslate,
      });
      // Allow repeat playback with cached blob URLs.
      if (audio.src !== proxyUrl) {
        audio.src = proxyUrl;
      } else {
        audio.currentTime = 0;
      }
      audio.onended = () => setSpeakingKey(null);
      audio.onerror = () => {
        setSpeakingKey(null);
        speakWithBrowserTTS(textToSpeak, lang, key);
      };
      setSpeakingKey(key);
      audio.pause();
      audio.currentTime = 0;
      await audio.play();
    } catch {
      speakWithBrowserTTS(textToSpeak, lang, key);
    }
  };


  if (loading) {
    return <p className="p-8 text-center">Loading…</p>;
  }


  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#e0f7fa] via-[#f5fafd] to-[#e3f2fd] animate-fade-in">
      {/* Hero Header */}
      <div className="w-full bg-gradient-to-r from-[#38bdf8] via-[#2ad2c9] to-[#5eead4] text-white py-12 flex flex-col items-center shadow-xl animate-fade-in-up">
        <div className="flex flex-col items-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center w-24 h-24 rounded-2xl bg-white/20 border-4 border-white/30 shadow-lg mb-4">
            <span className="text-6xl">🌏</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow text-center">
            Travel Essentials
          </h1>
          <p className="text-white/90 max-w-2xl text-lg font-medium drop-shadow-sm text-center">
            Offline emergency info, key phrases & safety tips for{" "}
            <span className="capitalize font-bold underline underline-offset-4">
            {countryName}
            </span>
            .
          </p>
        </div>
      </div>

     
      {/* ── New Services Section ── */}
      <div className="max-w-4xl mx-auto px-4 mt-8 grid gap-6 animate-fade-in-up
                      grid-cols-1 md:grid-cols-2">
        {/* Insurance Services */}
        <div className="bg-white p-6 rounded-3xl shadow-md border-l-8 border-red-400">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="text-xl font-semibold text-red-600">
              Insurance & Assistance
            </h3>
            <button
              onClick={() => downloadSection("insurance")}
              title="Download insurance list"
              aria-label="Download insurance list"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-700 transition hover:bg-red-200"
            >
              <FaDownload className="text-sm" />
            </button>
          </div>
          <p className="text-gray-700 text-sm mb-4">
            Trusted travel insurance providers and 24/7 assistance services.
          </p>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
           {sampleInsurance.map((svc) => (
             <button
               key={svc.name}
               href={svc.link}
               target="_blank"
               rel="noopener noreferrer"
               className="
                 inline-flex items-center justify-center
                 px-3 py-1.5
                 bg-red-300
                 border border-red-300
                 rounded-lg
                 text-gray-700 text-sm font-bold
                 hover:bg-red-400
                 transition
               "
             >
               {svc.name}
             </button>
           ))}
          </div>
        </div>

        {/* eSIM Services */}
        <div className="bg-white p-6 rounded-3xl shadow-md border-l-8 border-green-400">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="text-xl font-semibold text-green-600">
              eSIM & Connectivity
            </h3>
            <button
              onClick={() => downloadSection("esim")}
              title="Download eSIM list"
              aria-label="Download eSIM list"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-700 transition hover:bg-green-200"
            >
              <FaDownload className="text-sm" />
            </button>
          </div>
          <p className="text-gray-700 text-sm mb-4">
            Browse eSIM plans and local data options to stay connected abroad.
          </p>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            {sampleEsim.map((svc) => (
              <button
                key={svc.name}
                href={svc.link}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center justify-center
                  px-3 py-1.5
                  bg-green-300
                  border border-green-300
                  rounded-lg
                  text-gray-600 text-sm font-bold
                  hover:bg-green-400
                  transition
                "
              >
                {svc.name}
              </button>
            ))}
          </div>
        </div>
      </div>



      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

        <section className="bg-indigo-50 p-6 sm:p-8 rounded-3xl shadow-md border-l-8 border-indigo-400 animate-fade-in-up">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-900">Your Country Assistance</h2>
            <div className="flex items-center gap-2">
              {originCountry?.code && (
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                  Origin: {originCountry.code}
                </span>
              )}
              <button
                onClick={() => downloadSection("assistance")}
                title="Download country assistance"
                aria-label="Download country assistance"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 transition hover:bg-indigo-200"
              >
                <FaDownload className="text-sm" />
              </button>
            </div>
          </div>

          {originCountry ? (
            <div className="space-y-3 text-sm sm:text-base text-indigo-950">
              <p>
                Traveling from <strong>{originCountry.name}</strong> to <strong>{countryName}</strong>. Contact your consular support team:
              </p>
              {originAssistance ? (
                <>
                  <p>
                    <span className="font-semibold">Agency:</span> {originAssistance.label}
                  </p>
                  <p>
                    <span className="font-semibold">24/7 Emergency:</span>{" "}
                    {String(originAssistance.emergency_phone || "").startsWith("+") ? (
                      <a href={`tel:${originAssistance.emergency_phone}`} className="underline font-semibold hover:text-indigo-700">
                        {originAssistance.emergency_phone}
                      </a>
                    ) : (
                      <span>{originAssistance.emergency_phone || "Not available"}</span>
                    )}
                  </p>
                  {originAssistance.emergency_phone_intl && (
                    <p>
                      <span className="font-semibold">International Emergency:</span>{" "}
                      <a href={`tel:${originAssistance.emergency_phone_intl}`} className="underline font-semibold hover:text-indigo-700">
                        {originAssistance.emergency_phone_intl}
                      </a>
                    </p>
                  )}
                  {originAssistance.consular_address && (
                    <p>
                      <span className="font-semibold">Consular Office Address:</span> {originAssistance.consular_address}
                    </p>
                  )}
                </>
              ) : (
                <div className="rounded-lg border border-indigo-200 bg-white/70 px-3 py-2 text-indigo-900">
                  Verified consular profile is not cached yet for {originCountry.code}. Open this page again in a moment to retry auto-fetch.
                </div>
              )}
              <p>
                <span className="font-semibold">Destination Embassy/Consular Desk:</span>{" "}
                {destinationEmbassyContact ? (
                  <span>
                    <span className="font-semibold">{destinationEmbassyContact.name}</span>
                    {destinationEmbassyContact.phone ? (
                      <>
                        {": "}
                        <a href={`tel:${destinationEmbassyContact.phone}`} className="underline font-semibold hover:text-indigo-700">
                          {destinationEmbassyContact.phone}
                        </a>
                      </>
                    ) : (
                      <span>{": Phone not listed"}</span>
                    )}
                  </span>
                ) : (
                  <span>Not listed</span>
                )}
              </p>
              {destinationEmbassyContact?.address && (
                <p>
                  <span className="font-semibold">Destination Embassy Address:</span> {destinationEmbassyContact.address}
                </p>
              )}
              <div className="flex flex-wrap gap-3 pt-1">
                {originAssistance?.website && (
                  <a
                    href={originAssistance.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-700 transition"
                  >
                    Emergency Help Guide
                  </a>
                )}
                {originAssistance?.mission_finder && (
                  <a
                    href={originAssistance.mission_finder}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-white border border-indigo-200 px-4 py-2 text-indigo-800 font-semibold hover:bg-indigo-100 transition"
                  >
                    Official Mission Directory
                  </a>
                )}
              </div>

              <div className="rounded-xl bg-white/70 border border-indigo-200 p-4 mt-2">
                <h3 className="text-sm sm:text-base font-bold text-indigo-900 mb-2">Emergency Guidelines</h3>
                <ul className="space-y-1 text-sm text-indigo-950">
                  {emergencyGuidelines.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-indigo-700">{idx + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-sm sm:text-base text-indigo-950">
              <p>Add your origin country to get personalized embassy and consular support details.</p>
              <Link href="/Onboarding" className="inline-block rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-700 transition">
                Set Origin Country
              </Link>
            </div>
          )}
        </section>

 {/* Brown Divider - Added before Emergency Contacts */}
 <div className="h-px bg-gradient-to-r from-amber-800 via-amber-600 to-amber-700 opacity-40" />


        {/* Emergency Contacts */}
        <section className="bg-white p-8 rounded-3xl shadow-md border-l-8 border-teal-400 animate-fade-in-up">
          <div className="flex items-center justify-between gap-3 mb-6">
            <h2 className="text-2xl font-bold text-teal-700 flex items-center gap-2">
              {/* phone icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-teal-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.07 4.18 2 2 0 015.18 2h3a2 2 0 011.72 2.18 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              Emergency Contacts
            </h2>
            <button
              onClick={() => downloadSection("emergencies")}
              title="Download emergency contacts"
              aria-label="Download emergency contacts"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-700 transition hover:bg-teal-200"
            >
              <FaDownload className="text-sm" />
            </button>
          </div>
          <ul className="grid md:grid-cols-2 gap-4">
            {emergencies.map((e, i) => (
              <li
                key={i}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-xl shadow-sm hover:bg-teal-50 transition"
              >
                <span className="font-semibold text-gray-800">{e.name}</span>
                <a
                  href={`tel:${e.phone}`}
                  className="text-teal-600 font-bold hover:underline"
                >
                  {e.phone}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-[#2ad2c9] via-[#38bdf8] to-[#5eead4] opacity-40" />

        {/* Local Phrases */}
        <section className="bg-white p-8 rounded-3xl shadow-md border-l-8 border-blue-400 animate-fade-in-up">
          <div className="flex items-center justify-between gap-3 mb-6">
            <h2 className="text-2xl font-bold text-blue-700">
              Local Phrases
            </h2>
            <button
              onClick={() => downloadSection("phrases")}
              title="Download local phrases"
              aria-label="Download local phrases"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 transition hover:bg-blue-200"
            >
              <FaDownload className="text-sm" />
            </button>
          </div>
          <ul className="space-y-4">
            {phrases.map((p, i) => (
              <li
                key={i}
                className="bg-gray-50 p-4 rounded-xl shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-gray-800">{p.original}</div>
                    {p.translation && (
                      <div className="text-gray-500 italic ml-2">
                        - {p.translation}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => speakPhrase(p, `${country}-${i}`)}
                    title={speakingKey === `${country}-${i}` ? "Stop pronunciation" : "Hear pronunciation"}
                    aria-label={speakingKey === `${country}-${i}` ? "Stop pronunciation" : "Hear pronunciation"}
                    className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 transition hover:bg-blue-200"
                  >
                    {speakingKey === `${country}-${i}` ? <FaStop className="text-sm" /> : <FaVolumeUp className="text-sm" />}
                  </button>
                </div>
                {p.context_note && (
                  <div className="text-xs text-gray-500 mt-2">
                    Context: {p.context_note}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-[#facc15] via-[#fde68a] to-[#fef9c3] opacity-40" />

        {/* Useful Tips */}
        <section className="bg-yellow-50 p-8 rounded-3xl shadow-md border-l-8 border-yellow-400 animate-fade-in-up">
          <div className="flex items-center justify-between gap-3 mb-6">
            <h2 className="text-2xl font-bold text-yellow-800">
              Useful Tips
            </h2>
            <button
              onClick={() => downloadSection("tips")}
              title="Download useful tips"
              aria-label="Download useful tips"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-200 text-yellow-800 transition hover:bg-yellow-300"
            >
              <FaDownload className="text-sm" />
            </button>
          </div>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-white border border-yellow-200 p-3">
              <p className="font-semibold text-yellow-800">Transit basics</p>
              <p className="text-gray-700 mt-1">{utility.transit}</p>
            </div>
            <div className="rounded-xl bg-white border border-yellow-200 p-3">
              <p className="font-semibold text-yellow-800">Payment tips</p>
              <p className="text-gray-700 mt-1">{utility.payments}</p>
            </div>
            <div className="rounded-xl bg-white border border-yellow-200 p-3">
              <p className="font-semibold text-yellow-800">Connectivity reality</p>
              <p className="text-gray-700 mt-1">{utility.connectivity}</p>
            </div>
            <div className="rounded-xl bg-white border border-yellow-200 p-3">
              <p className="font-semibold text-yellow-800">Safety notes</p>
              <p className="text-gray-700 mt-1">{utility.safety}</p>
            </div>
            <div className="rounded-xl bg-white border border-yellow-200 p-3">
              <p className="font-semibold text-yellow-800">Common scams to avoid</p>
              <p className="text-gray-700 mt-1">{utility.scams}</p>
            </div>
            <div className="rounded-xl bg-white border border-yellow-200 p-3">
              <p className="font-semibold text-yellow-800">Emergency workflow</p>
              <p className="text-gray-700 mt-1">{utility.emergency}</p>
            </div>
          </div>
          <ul className="list-disc list-inside space-y-2 text-gray-800">
            {tips.map((t, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 text-yellow-600">•</span>
                {t.tip}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <ScrollNavButtons />
    </div>
  );
}
