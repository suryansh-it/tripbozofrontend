// src/app/country/[country]/essentials/page.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const [data, setData] = useState({ emergencies: [], phrases: [], tips: [] });
  const [loading, setLoading] = useState(true);
  const [speakingKey, setSpeakingKey] = useState(null);
  const [voices, setVoices] = useState([]);
  const audioRef = useRef(null);
  const translateCacheRef = useRef(new Map());

  // Only get the pretty name once
  useEffect(() => {
    fetchCountryInfo(country.toUpperCase())
      .then((info) => setCountryName(info.name || country.toUpperCase()))
      .catch(() => setCountryName(country.toUpperCase()));
  }, [country]);

  // Fetch the essentials, but DO NOT touch the loader here
  useEffect(() => {
    fetchEssentials(country.toUpperCase())
      .then((json) => {
        setData({
          emergencies: json.emergencies.length ? json.emergencies : [],
          phrases: json.phrases.length ? json.phrases : [],
          tips: json.tips.length ? json.tips : [],
        });
      })
      .catch(() => {
        // on error, set your fallback
      })
      .finally(() => setLoading(false));
  }, [country]);

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

  const { emergencies, phrases, tips } = data;

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
      const lines = tips.length ? tips.map((t) => `- ${t.tip}`) : ["No useful tips available."];
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
