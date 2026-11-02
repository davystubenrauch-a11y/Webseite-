import type { Metadata } from "next";
import LegalPage from "@/components/ui/LegalPage";
import { stripe } from "@/lib/stripe";

export const metadata: Metadata = { title: "Danke für Ihre Bestellung | foav.de", robots: { index: false } };
export const dynamic = "force-dynamic";

// Shows the real payment state of the session. Fulfilment itself happens in the Stripe webhook.
async function status(id?: string): Promise<"paid" | "pending" | "unknown"> {
  const s = stripe();
  if (!s || !id?.startsWith("cs_")) return "unknown";
  try {
    const session = await s.checkout.sessions.retrieve(id);
    if (session.payment_status === "paid" || session.payment_status === "no_payment_required") return "paid";
    return session.status === "complete" ? "pending" : "unknown";
  } catch {
    return "unknown";
  }
}

export default async function Danke({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const st = await status((await searchParams).session_id);
  return (
    <LegalPage title="Danke für Ihre Bestellung.">
      {st === "pending" ? (
        <p>Ihre Bestellung ist eingegangen. Die Zahlung wird noch bestätigt (bei Lastschrift dauert das ein paar Tage). Sobald sie da ist, bekommen Sie die Rechnung per E-Mail.</p>
      ) : (
        <p>Ihre Bestellung ist eingegangen. Die Bestätigung und Ihre Rechnung bekommen Sie per E-Mail.</p>
      )}
      <h2>So geht es weiter</h2>
      <p>
        <b>NFC-Platten:</b> Wir verknüpfen jede Platte mit Ihrem Google-Profil und schicken sie Ihnen per Post.
      </p>
      <p>
        <b>KI-Roomtour:</b> Falls noch nicht geschehen, laden Sie jetzt die Fotos Ihrer Räume hoch. 48 Stunden danach bekommen Sie Ihr Video.{" "}
        <a href="/anfrage/roomtour">Fotos hochladen</a>
      </p>
      <p>
        <b>Website:</b> Wir melden uns innerhalb eines Werktags mit den nächsten Schritten.
      </p>
      <p>Fragen? Rufen Sie uns an oder antworten Sie einfach auf die Bestätigungs-E-Mail.</p>
    </LegalPage>
  );
}
