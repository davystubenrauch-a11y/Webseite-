"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/lib/site";

export default function CopyPzn({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={`btn-glass ${className}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(site.pzn);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          // Clipboard blocked (e.g. insecure context): the number stays visible to copy by hand.
        }
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={String(copied)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
          {copied ? "Kopiert ✓" : `PZN ${site.pzn} kopieren`}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
