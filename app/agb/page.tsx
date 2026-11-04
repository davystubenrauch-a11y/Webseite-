import type { Metadata } from "next";
import LegalPage from "@/components/ui/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "AGB | FOAV", robots: { index: false } };

// Draft terms written for FOAV's actual process (fixed price, payment up front, delivery times, changes together).
// Have them checked by a lawyer or a legal-text service before going live; placeholders are in square brackets.
export default function Agb() {
  return (
    <LegalPage title="Allgemeine Geschäftsbedingungen">
      <p>Stand: November 2026</p>

      <h2>1. Geltungsbereich</h2>
      <p>
        Diese Bedingungen gelten für alle Aufträge an {site.address[0]} („{site.name}“, „wir“) über die Erstellung von Websites, KI-Roomtour-Videos
        und den Verkauf von NFC-Platten. Abweichende Bedingungen des Kunden gelten nur, wenn wir ihnen schriftlich zustimmen.
      </p>

      <h2>2. Vertragsschluss</h2>
      <p>
        Die Pakete und Preise auf unserer Website sind verbindlich. Sie wählen ein Paket, senden bei Websites und Roomtours den Fragebogen
        und bestellen anschließend über den Knopf „Zahlungspflichtig bestellen“. Damit geben Sie ein verbindliches Angebot ab, das wir mit der
        Bestellbestätigung per E-Mail annehmen. Für Leistungen außerhalb der Pakete (z. B. „Individuell“) erhalten Sie vorher ein schriftliches
        Angebot; der Vertrag kommt dann mit Ihrer Bestätigung oder Zahlung zustande.
      </p>

      <h2>3. Leistungen</h2>
      <p>
        <b>Websites:</b> Gestaltung und Umsetzung im gewählten Paket (Basis, Business oder Premium) mit dem auf der Website beschriebenen Umfang.
        Nicht enthalten sind Domain, Hosting und kostenpflichtige Dienste Dritter, die Sie selbst auf Ihren Namen buchen, sowie Datenschutzerklärung und AGB.
        Diese erstellen Sie selbst oder lassen sie erstellen; wir binden sie ein. Das Impressum erstellen wir aus Ihren Angaben, für deren Richtigkeit Sie verantwortlich sind. Eine Rechtsberatung erbringen wir nicht.
      </p>
      <p>
        <b>KI-Roomtours:</b> Ein Video-Rundgang, der mit Hilfe künstlicher Intelligenz aus Ihren Fotos entsteht, im vereinbarten Format (16:9
        und/oder 9:16). Das Video zeigt Ihre Räume nach Ihren Fotos; einzelne Details können vom Original abweichen. Sie prüfen das Video vor der
        Veröffentlichung und sorgen dafür, dass Ihre Unterkunft auf Buchungsportalen zutreffend dargestellt wird.
      </p>
      <p>
        <b>NFC-Platten:</b> Runde Platten (Ø 10 cm, Weiß oder Schwarz) mit NFC-Chip, den wir mit dem von Ihnen genannten Google-Profil
        verknüpfen. Wir schulden die Platte und die Verknüpfung, keine bestimmte Zahl oder Art von Bewertungen. Bitte beachten Sie die Richtlinien
        von Google: Bewertungen dürfen nicht gekauft oder an Gegenleistungen geknüpft werden.
      </p>

      <h2>4. Preise und Zahlung</h2>
      <p>
        Es gilt der Preis des gewählten Pakets bzw. aus unserem Angebot. Alle Preise sind Endpreise. Als Kleinunternehmer im Sinne von
        § 19 UStG berechnen wir keine Umsatzsteuer und weisen sie auf unseren Rechnungen nicht aus. Der Betrag ist im Voraus fällig. Sie bezahlen bei der Bestellung über unseren Zahlungsdienstleister Stripe
        und erhalten eine Rechnung per E-Mail. Mit der Arbeit beginnen wir nach Zahlungseingang.
      </p>

      <h2>5. Lieferzeiten</h2>
      <p>
        Eine Roomtour liefern wir je nach Paket innerhalb von 48 Stunden (Basis), 72 Stunden (Premium) oder 5 Werktagen (Exklusiv), eine Website je nach Paket innerhalb von bis zu 7 Tagen. Die Frist beginnt,
        sobald die Zahlung eingegangen ist und uns alle nötigen Unterlagen vorliegen (Fotos, Texte, Logo, Zugangsdaten). NFC-Platten versenden wir
        nach Zahlungseingang innerhalb Deutschlands; die Lieferung dauert 3 bis 7 Werktage. Verzögerungen, die wir nicht zu vertreten haben, verlängern die Fristen
        entsprechend.
      </p>

      <h2>6. Ihre Mitwirkung</h2>
      <p>
        Sie stellen uns die benötigten Inhalte rechtzeitig zur Verfügung und versichern, dass Sie die Rechte daran haben, insbesondere an Fotos,
        Texten und Logos. Auf Fotos für Roomtours sollen keine Personen zu erkennen sein. Werden Rechte Dritter verletzt, stellen Sie uns von
        daraus folgenden Ansprüchen frei.
      </p>

      <h2>7. Freigabe und Änderungen</h2>
      <p>
        Sie sehen das Ergebnis vor der Veröffentlichung. Änderungswünsche innerhalb des vereinbarten Umfangs setzen wir gemeinsam mit Ihnen um und
        sind im Festpreis enthalten. Wünsche, die über den vereinbarten Umfang hinausgehen, sprechen wir vorher mit Ihnen ab und berechnen sie nur
        mit Ihrer Zustimmung. Melden Sie sich innerhalb von 14 Tagen nach der Übergabe nicht, gilt das Ergebnis als abgenommen.
      </p>

      <h2>8. Nutzungsrechte</h2>
      <p>
        Mit vollständiger Zahlung erhalten Sie das zeitlich und räumlich unbeschränkte Recht, die erstellte Website und das Roomtour-Video für Ihren
        Betrieb zu nutzen, auch auf Airbnb, Booking.com und in sozialen Medien. Wir dürfen die Arbeit als Referenz zeigen, sofern Sie nicht
        widersprechen.
      </p>

      <h2>9. Gewährleistung und Haftung</h2>
      <p>
        Es gelten die gesetzlichen Gewährleistungsrechte. Wir haften unbeschränkt bei Vorsatz, grober Fahrlässigkeit und bei Verletzung von Leben,
        Körper oder Gesundheit. Bei leichter Fahrlässigkeit haften wir nur für die Verletzung wesentlicher Vertragspflichten und begrenzt auf den
        vorhersehbaren, typischen Schaden. Für Ausfälle oder Regeländerungen von Diensten Dritter (zum Beispiel Google, Buchungsportale, Hosting)
        haften wir nicht.
      </p>

      <h2>10. Verbraucher</h2>
      <p>
        Sind Sie Verbraucher, steht Ihnen ein gesetzliches Widerrufsrecht zu. Einzelheiten und das Muster-Widerrufsformular finden Sie in unserer
        <a href="/widerruf">Widerrufsbelehrung</a>.
      </p>

      <h2>11. Schlussbestimmungen</h2>
      <p>
        Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Ist der Kunde Kaufmann, ist Gerichtsstand München. Sollte eine Bestimmung
        unwirksam sein, bleibt der Vertrag im Übrigen wirksam.
      </p>

    </LegalPage>
  );
}
