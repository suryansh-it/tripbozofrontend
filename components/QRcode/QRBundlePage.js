// src/app/qr-bundle/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { FiCopy, FiDownload, FiShare2, FiLink } from "react-icons/fi";
import { saveAs } from "file-saver";

import {
  initSession,
  saveSelectedApps,
  fetchQRCode,
  downloadAppList,
  downloadQRCode,
} from "@/src/utils/api";

export default function QRBundlePage() {

  const params = useSearchParams();
  const country = params.get("country") || "";             // e.g. "FR"
  const storageKey = `selectedAppIds_${country}`;  


  const [apps, setApps] = useState([]);
  const [qrBase64, setQrBase64] = useState(null);
  const [shareUrl, setShareUrl] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // 1) Pull selected IDs
      const raw = localStorage.getItem(storageKey);
      const appIds = raw ? JSON.parse(raw) : [];
      if (!appIds.length) {
        setLoading(false);
        return;
      }

      // 2) Ensure session exists
      let sid = localStorage.getItem("sessionId") || (await initSession());
      if (!sid) {
        setLoading(false);
        return;
      }
      localStorage.setItem("sessionId", sid);
      setSessionId(sid);

      // 3) Save selection server‐side
      const saveResp = await saveSelectedApps(appIds);
      sid = saveResp.session_id || sid;
      localStorage.setItem("sessionId", sid);
      setSessionId(sid);

      // 4) Fetch QR payload + selected apps
      const qrResp = await fetchQRCode(sid);
      setQrBase64(qrResp.qr_code);
      setShareUrl(qrResp.shareable_url);
      setApps(qrResp.selected_apps || []);
      setLoading(false);
    })();
  }, [storageKey]);

  // Embed‐code copy
  const handleEmbedCopy = () => {
    const code = `<iframe src="${shareUrl}" width="360" height="480" frameborder="0" style="border:none;"></iframe>`;
    navigator.clipboard.writeText(code);
    alert("Embed code copied!");
  };

  // Download handlers
  const handleDownloadList = async () => {


    try {

// fire qr_download_list
if (typeof window.gtag === "function") {
  window.gtag("event", "qr_download_list", {
    list_id: sessionId,
  });} 


      const blob = await downloadAppList(sessionId);
      saveAs(blob, `${sessionId}-app-list.html`);
    } catch {
      alert("Failed to download app list.");
    }
  };
  const handleDownloadQR = async () => {
    try {

 // fire qr_download_qr
 if (typeof window.gtag === "function") {
  window.gtag("event", "qr_download_qr", {
    list_id: sessionId,
  });
}

      const blob = await downloadQRCode(sessionId);
      saveAs(blob, `${sessionId}-qr.png`);
    } catch {
      alert("Failed to download QR code.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading your bundle…</p>
      </div>
    );
  }
  if (!apps.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-500">No apps selected—please go back.</p>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <button
          onClick={() => history.back()}
          className="text-teal-600 hover:underline mb-6 flex items-center gap-2"
        >
          ← Back to Apps
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Your Travel Apps Bundle
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Scan the QR or copy/share your bundle below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* QR + Actions */}
          <div className="bg-white p-8 rounded-xl shadow flex flex-col items-center">
            {qrBase64 ? (
              <Image
                src={`data:image/png;base64,${qrBase64}`}
                alt="Bundle QR"
                width={280}
                height={280}
                className="rounded-lg border mb-6"
              />
            ) : (
              <div className="w-72 h-72 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
                <span className="text-gray-400">QR failed</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 w-full">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  alert("Link copied!");
                }}
                className="flex items-center justify-center gap-2 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-black"
              >
                <FiCopy /> Copy Link
              </button>

              <button
                onClick={() =>
                  navigator.share?.({ url: shareUrl }).catch(() => {})
                }
                className="flex items-center justify-center gap-2 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-black"
              >
                <FiShare2 /> Share
              </button>

              <button
                onClick={handleDownloadList}
                className="flex items-center justify-center gap-2 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-black"
              >
                <FiDownload /> Download List
              </button>

              <button
                onClick={handleDownloadQR}
                className="flex items-center justify-center gap-2 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-black"
              >
                <FiDownload /> Download QR
              </button>
            </div>
          </div>

          {/* Embed + Selected Apps */}
          <div className="space-y-6">
            {/* Embed Code */}
            <div className="bg-white p-4 rounded-xl shadow">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-gray-700 font-medium">
                  <FiLink /> Embed Code
                </label>
                <button
                  onClick={handleEmbedCopy}
                  className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
                >
                  <FiCopy /> Copy
                </button>
              </div>
              <textarea
                readOnly
                rows={3}
                value={`<iframe src="${shareUrl}" width="360" height="480" frameborder="0" style="border:none;"></iframe>`}
                className="w-full rounded-lg border border-gray-300 p-2 font-mono text-sm text-gray-800 bg-gray-50"
              />
            </div>

            {/* App List */}
            <div className="bg-white p-4 rounded-xl shadow">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Selected Apps
              </h2>
              <ul className="space-y-3 max-h-72 overflow-y-auto">
                {apps.map((app) => (
                  <li
                    key={app.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition"
                  >
                    {/* Icon */}
                    <div className="w-10 h-10 relative">
                      <Image
                        src={app.icon_url || "/file.svg"}
                        alt={app.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    {/* Name & Category */}
                    <div>
                      <p className="font-medium text-gray-800">{app.name}</p>
                      <p className="text-gray-500 text-sm">{app.category}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}