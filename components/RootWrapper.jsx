// src/components/RootWrapper.jsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Client‑only import of the cookie banner
const CookieConsent = dynamic(
  () => import("react-cookie-consent"),
  { ssr: false }
);

export default function RootWrapper({ children }) {
  const pathname = usePathname();
  const isBundle = pathname.startsWith("/bundle-redirect");

 // Track client mount to avoid SSR/client mismatch
 const [mounted, setMounted] = useState(false);
 useEffect(() => {
   setMounted(true);
 }, []);

  return (
    <>
      {/* only show Navbar + footer on non‑bundle pages */}
      {!isBundle && <Navbar />}
      {!isBundle && <div className="h-16 w-full" />} {/* navbar spacer */}
      <main
        className={
          isBundle
            ? "min-h-screen"
            : "min-h-[calc(100vh-64px-200px)] pb-0"
        }
      >
        {children}
      </main>
      {!isBundle && <Footer />}

      {/* Global Cookie‑Consent Banner */}
     {mounted && (<CookieConsent
       location="bottom"
       buttonText="Accept"
       declineButtonText="Decline"
       cookieName="tripbozo-cookie-consent"
       enableDeclineButton
       style={{ background: "#0D0D0F", color: "#E0F7FF", textAlign: "center" }}
       buttonStyle={{
         background: "#00E5FF",
         color: "#0D0D0F",
         fontWeight: "bold",
         borderRadius: "4px",
         padding: "8px 16px",
       }}
       declineButtonStyle={{
         background: "#38383A",
         color: "#FFFFFF",
         borderRadius: "4px",
         padding: "8px 16px",
       }}
     >
       We use cookies for essential features, analytics, and personalized ads. Read our{" "}
       <a href="/privacy" className="underline text-white">
         Privacy Policy
       </a>
       .
     </CookieConsent>)}
    </>
  );
}
