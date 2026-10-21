"use client";

import dynamic from "next/dynamic";

/** Placeholder shown while three.js loads, so the layout never jumps. */
function Loader() {
  return (
    <div className="grid h-full w-full place-items-center" aria-hidden>
      <div className="relative h-40 w-40">
        <div className="absolute inset-0 animate-ping2 rounded-full border border-brand/30" />
        <div className="absolute inset-6 animate-pulse rounded-full border border-brand/20 bg-slate-100 shadow-ring" />
      </div>
    </div>
  );
}

export const LazyNfcStage = dynamic(() => import("./NfcStage"), { ssr: false, loading: Loader });
export const LazyRoomScan = dynamic(() => import("./RoomScan"), { ssr: false, loading: Loader });
