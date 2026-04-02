"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiHome } from "react-icons/fi";

export const dynamic = "force-dynamic";

export default function BundleRedirectPage({ params }) {
  const { sessionId } = params;
  const [items, setItems] = useState([]);       // [{ name, android_link, ios_link }]
  const [loading, setLoading] = useState(true);
  const [nextIdx, setNextIdx] = useState(0);
  const [popupMsg, setPopupMsg] = useState(
    "🔒 Please enable pop-ups for this site so Quick Launch can open all apps at once."
  );

  // on mount, detect platform:
  const [platform, setPlatform] = useState("web"); // "ios" | "android" | "web"
  useEffect(() => {
    const ua = navigator.userAgent || "";
    if (/iPhone|iPad|iPod/.test(ua)) {
      setPlatform("ios");
    } else if (/Android/.test(ua)) {
      setPlatform("android");
    }
  }, []);

  // fetch raw items
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/personalized-list/bundle-urls/${sessionId}/`
        );
        if (!res.ok) throw new Error();
        const json = await res.json();
        // map each item to pick the right URL for this device
        const mapped = (json.items || []).map((it) => {
          let url;
          if (platform === "ios") {
            // prefer the App Store link
            url = it.ios_link || it.android_link;
          } else if (platform === "android") {
            // prefer the Play Store link
            url = it.android_link || it.ios_link;
          } else {
            // web or unknown: you can choose to default to one or present both
            url = it.android_link || it.ios_link;
          }
          return { name: it.name, url };
        });
        setItems(mapped);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [sessionId, platform]);

  const openAll = () => items.forEach((it) => window.open(it.url, "_blank"));
  const openNext = () => {
    if (nextIdx < ictems.length) {
      window.open(items[nextIdx].url, "_blank");
      setNextIdx(nextIdx + 1);
    }
  };
  const testPopups = () => {
    const w = window.open("", "_blank", "width=100,height=100");
    if (!w) {
      setPopupMsg(
        "🔒 Pop-ups are blocked. Please enable pop-ups for this site in your browser settings."
      );
    } else {
      w.close();
      setPopupMsg("✅ Pop-ups allowed! You can now use Quick Launch.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading your bundle…</p>
      </div>
    );
  }
  if (!items.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">No apps found in your bundle.</p>
      </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* — Mini Header — */}
      <header className="w-full py-2 px-2 bg-white shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/icons/icon.png" alt="tripbozo" width={80} height={80} />
          {/* <span className="text-2xl font-bold text-teal-600">tripbozo</span> */}
        </div>
        <Link href="/">
          <a className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
            <FiHome /> Home
          </a>
        </Link>
      </header>

      {/* — Content */}
      <main className="flex-grow flex flex-col items-center p-8 space-y-12">
        <h1 className="text-3xl font-bold text-gray-900">Your Travel App Bundle</h1>

        {/* Quick Launch */}
        <section className="w-full max-w-md text-center space-y-3">
          <h2 className="text-2xl font-semibold text-gray-800">Quick Launch</h2>
          <button
            onClick={openAll}
            className="w-full py-3 bg-teal-500 text-white rounded-lg text-lg hover:bg-teal-600 transition"
          >
            Open All {items.length} Apps
          </button>
          <button
            onClick={testPopups}
            className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Test “Allow Pop‑ups”
          </button>
          {popupMsg && <p className="text-sm text-gray-500">{popupMsg}</p>}
        </section>

        {/* One‑by‑One */}
        <section className="w-full max-w-md text-center space-y-3">
          <h2 className="text-2xl font-semibold text-gray-800">One‑by‑One</h2>
          <button
            onClick={openNext}
            disabled={nextIdx >= items.length}
            className={`w-full py-3 rounded-lg text-white text-lg transition ${
              nextIdx < items.length
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {nextIdx < items.length
              ? `Open Next: ${items[nextIdx].name}`
              : "All Apps Opened"}
          </button>
          <p className="text-sm text-gray-500">
            Click “Open Next” to walk through each app.
          </p>
        </section>

        {/* Manual Links */}
        <section className="w-full max-w-md text-center space-y-3">
          <h2 className="text-2xl font-semibold text-gray-800">Manual Links</h2>
          <ul className="grid gap-2">
            {items.map((it) => (
              <li key={it.url}>
                <a
                  href={it.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2 px-4 border-2 border-teal-500 rounded-lg text-teal-600 font-medium hover:bg-teal-50 transition"
                >
                  {it.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* — Mini Footer — */}
      <footer className="w-full py-4 px-6 bg-white border-t text-center text-sm text-gray-500">
        © {new Date().getFullYear()} TripBozo
      </footer>
    </div>
  );
}
