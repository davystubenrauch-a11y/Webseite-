"use client";

import dynamic from "next/dynamic";

const LazyCanStage = dynamic(() => import("./CanStage"), {
  ssr: false,
  // Until three.js is ready, show the 4K render so the hero is never empty.
  loading: () => <img src="/renders/hero-can.webp" alt="" className="mx-auto h-full w-auto object-contain" />,
});

export default LazyCanStage;
