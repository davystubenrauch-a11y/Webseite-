"use client";

import { useState } from "react";
import { site } from "@/lib/site";

export default function CopyPzn({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={`btn-secondary ${className}`}
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
      {copied ? "PZN kopiert ✓" : `PZN ${site.pzn} kopieren`}
    </button>
  );
}
