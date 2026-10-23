"use client";

import dynamic from "next/dynamic";

const LazyCanStage = dynamic(() => import("./CanStage"), { ssr: false });

export default LazyCanStage;
