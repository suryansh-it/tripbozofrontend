"use client";

import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

export default function ScrollNavButtons() {
  const [canGoTop, setCanGoTop] = useState(false);
  const [canGoBottom, setCanGoBottom] = useState(true);

  useEffect(() => {
    const updateScrollState = () => {
      const scrollTop = window.scrollY || window.pageYOffset || 0;
      const viewportHeight = window.innerHeight || 0;
      const pageHeight = document.documentElement.scrollHeight || 0;
      const nearBottom = scrollTop + viewportHeight >= pageHeight - 48;

      setCanGoTop(scrollTop > 120);
      setCanGoBottom(!nearBottom);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 sm:bottom-6 sm:right-6">
      <button
        type="button"
        onClick={goToTop}
        title="Scroll to top"
        aria-label="Scroll to top"
        disabled={!canGoTop}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-sky-300 bg-white/95 text-base text-sky-700 shadow-lg backdrop-blur transition hover:bg-sky-50 sm:h-12 sm:w-12 sm:text-lg disabled:cursor-not-allowed disabled:opacity-45"
      >
        <FaArrowUp />
      </button>

      <button
        type="button"
        onClick={goToBottom}
        title="Scroll to bottom"
        aria-label="Scroll to bottom"
        disabled={!canGoBottom}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-teal-300 bg-white/95 text-base text-teal-700 shadow-lg backdrop-blur transition hover:bg-teal-50 sm:h-12 sm:w-12 sm:text-lg disabled:cursor-not-allowed disabled:opacity-45"
      >
        <FaArrowDown />
      </button>
    </div>
  );
}
