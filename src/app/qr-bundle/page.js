'use client';
import { Suspense } from "react";
import QRBundlePage from "@/components/QRcode/QRBundlePage";

export default function Page() {
  return(<Suspense fallback={<p>Loading…</p>}><QRBundlePage /></Suspense> );
}
