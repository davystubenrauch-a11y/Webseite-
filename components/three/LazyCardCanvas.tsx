"use client";

import dynamic from "next/dynamic";

const LazyCardCanvas = dynamic(() => import("./CardCanvas"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center">
      <div className="h-48 w-48 animate-pulse rounded-full border border-gold/30 bg-navy-800/60 shadow-rim" />
    </div>
  ),
});

export default LazyCardCanvas;
