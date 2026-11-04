import type { Metadata } from "next";
import Shop from "@/components/shop/Shop";

export const metadata: Metadata = {
  title: "Shop: NFC-Platten und KI-Roomtour | FOAV",
  description: "NFC-Platten für Google-Bewertungen (14,90 €, ab 5 Stück 13,90 € und ab 10 Stück 12,90 € pro Stück) direkt bestellen und gebuchte Website- oder Roomtour-Pakete bezahlen.",
  alternates: { canonical: "https://foav.de/shop" },
};

export const dynamic = "force-dynamic";

export default function Page() {
  return <Shop online={Boolean(process.env.STRIPE_SECRET_KEY)} />;
}
