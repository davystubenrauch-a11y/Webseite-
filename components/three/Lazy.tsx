"use client";

import dynamic from "next/dynamic";

/** Placeholder shown while three.js loads, so the layout never jumps. */
function Loader() {
  return (
    <div className="grid h-full w-full place-items-center" aria-hidden>
      <div className="h-40 w-40 animate-pulse rounded-full border border-line bg-sand" />
    </div>
  );
}

export const LazyNfcStage = dynamic(() => import("./NfcStage"), { ssr: false, loading: Loader });
