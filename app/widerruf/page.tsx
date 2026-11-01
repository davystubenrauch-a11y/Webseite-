import type { Metadata } from "next";
import LegalPage from "@/components/ui/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Widerrufsbelehrung | foav.de", robots: { index: false } };

// Based on the statutory model (Anlage 1 zu Art. 246a § 1 Abs. 2 EGBGB). Have it checked before going live.
export default function Widerruf() {
  return (
    <LegalPage title="Widerrufsbelehrung">
      <p>Verbraucher haben ein Widerrufsrecht nach folgender Maßgabe.</p>
      <h2>Widerrufsrecht</h2>
      <p>
        Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn
        Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben
        bzw. hat; bei Dienstleistungen ab dem Tag des Vertragsabschlusses.
      </p>
      <p>
        Um Ihr Widerrufsrecht auszuüben, müssen Sie uns ({site.address.join(", ")}, E-Mail: {site.email}, Telefon: {site.founders[0].phone})
        mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag
        zu widerrufen, informieren. Sie können dafür das unten stehende Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben
        ist. Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der
        Widerrufsfrist absenden.
      </p>
      <h2>Folgen des Widerrufs</h2>
      <p>
        Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der
        Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns
        angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag
        zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden
        wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich
        etwas anderes vereinbart. Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder bis Sie den
        Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben. Sie haben die Waren unverzüglich und in jedem Fall spätestens
        binnen vierzehn Tagen ab dem Tag, an dem Sie uns über den Widerruf unterrichten, an uns zurückzusenden. Sie tragen die
        unmittelbaren Kosten der Rücksendung der Waren.
      </p>
      <p>
        Haben Sie verlangt, dass die Dienstleistung während der Widerrufsfrist beginnen soll, so haben Sie uns einen angemessenen Betrag zu
        zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts unterrichten, bereits
        erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der vorgesehenen Dienstleistungen entspricht.
      </p>
      <h2>Vorzeitiges Erlöschen</h2>
      <p>
        Das Widerrufsrecht erlischt bei einem Vertrag über Dienstleistungen, wenn wir die Dienstleistung vollständig erbracht haben und mit
        der Ausführung erst begonnen haben, nachdem Sie dazu Ihre ausdrückliche Zustimmung gegeben und gleichzeitig Ihre Kenntnis davon
        bestätigt haben, dass Sie Ihr Widerrufsrecht bei vollständiger Vertragserfüllung durch uns verlieren.
      </p>
      <h2>Muster-Widerrufsformular</h2>
      <p>
        (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)
        <span className="block">An: {site.address.join(", ")}, {site.email}</span>
        <span className="block">Hiermit widerrufe(n) ich/wir den von mir/uns abgeschlossenen Vertrag über den Kauf der folgenden Waren / die Erbringung der folgenden Dienstleistung:</span>
        <span className="block">Bestellt am / erhalten am:</span>
        <span className="block">Name des/der Verbraucher(s):</span>
        <span className="block">Anschrift des/der Verbraucher(s):</span>
        <span className="block">Unterschrift (nur bei Mitteilung auf Papier), Datum</span>
      </p>
    </LegalPage>
  );
}
