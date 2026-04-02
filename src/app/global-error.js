"use client";
import ErrorPage from "@/components/ErrorPage";

export default function GlobalError({ error, reset }) {
  // Check if user is offline
  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

  if (isOffline) {
    return <ErrorPage errorType="offline" />;
  }

  return <ErrorPage statusCode={500} />;
} 