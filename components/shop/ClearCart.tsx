"use client";
import { useEffect } from "react";

/** Empties the stored cart once the visitor is back from a successful payment. */
export default function ClearCart() {
  useEffect(() => { try { localStorage.removeItem("foav-cart"); } catch {} }, []);
  return null;
}
