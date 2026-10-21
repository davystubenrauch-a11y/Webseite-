"use client";

import dynamic from "next/dynamic";

const LazyCanCanvas = dynamic(() => import("./CanCanvas"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center">
      <div className="h-[62%] w-[22%] min-w-24 animate-pulse rounded-[2.5rem] bg-petrol-100" />
    </div>
  ),
});

export default LazyCanCanvas;
