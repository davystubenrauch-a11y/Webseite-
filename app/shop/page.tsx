import type { Metadata } from "next";
import Shop from "@/components/shop/Shop";

export const metadata: Metadata = {
  title: "Shop: NFC-Platten und KI-Roomtour | foav.de",
  description: "NFC-Platten für Google-Bewertungen (15 €, ab 5 Stück 10 % und ab 10 Stück 15 % Rabatt) direkt bestellen und gebuchte Website- oder Roomtour-Pakete bezahlen.",
  alternates: { canonical: "https://foav.de/shop" },
};

export const dynamic = "force-dynamic";

export default function Page() {
  return <Shop online={Boolean(process.env.STRIPE_SECRET_KEY)} />;
}
