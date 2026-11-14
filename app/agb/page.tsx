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
        Diese Bedingungen gelten für alle Aufträge an {site.address[0]} („{site.name}“, „wir“) über die Erstellung von Websites, KI-Shots (KI-Produktfotos und
        Werbeclips) und den Verkauf von NFC-Platten. Abweichende Bedingungen des Kunden gelten nur, wenn wir ihnen schriftlich zustimmen.
      </p>

      <h2>2. Vertragsschluss</h2>
      <p>
        Die Pakete und Preise auf unserer Website sind verbindlich. Sie wählen ein Paket, senden bei Websites, KI-Shots und NFC-Platten mit Logo den Fragebogen
        und bestellen anschließend über den Knopf „Zahlungspflichtig bestellen“. Damit geben Sie ein verbindliches Angebot ab, das wir mit der
        Bestellbestätigung per E-Mail annehmen. Für Leistungen außerhalb der Pakete (z. B. „Individuell“) erhalten Sie vorher ein schriftliches
        Angebot; der Vertrag kommt dann mit Ihrer Bestätigung oder Zahlung zustande.
      </p>

      <h2>3. Leistungen</h2>
      <p>
        <b>Websites:</b> Gestaltung und Umsetzung im gewählten Paket (Basis, Business oder Premium) mit dem auf der Website beschriebenen Umfang.
        Das Hosting der Website ist inklusive (siehe Abschnitt 3a). Nicht enthalten sind die Domain, die Sie selbst auf Ihren Namen buchen, kostenpflichtige
        Dienste Dritter sowie Datenschutzerklärung und AGB. Diese erstellen Sie selbst oder lassen sie erstellen; wir binden sie ein. Das Impressum erstellen wir aus Ihren Angaben, für deren Richtigkeit Sie verantwortlich sind. Eine Rechtsberatung erbringen wir nicht.
      </p>
      <p>
        <b>3a. Hosting:</b> Wir stellen die Website ohne laufende Kosten für Sie auf unserer Infrastruktur bereit (derzeit Cloudflare), mit verschlüsselter
        Verbindung (https), und verbinden sie mit Ihrer Domain. Ein Anspruch auf eine bestimmte Verfügbarkeit besteht nicht; Ausfälle beheben wir so schnell
        wie möglich. Sollten wir das Hosting einmal einstellen, kündigen wir es mindestens drei Monate vorher an und übergeben Ihnen alle Dateien der Website
        kostenlos, damit Sie sie bei einem Anbieter Ihrer Wahl weiter betreiben können. Inhalte, die gegen Gesetze oder Rechte Dritter verstoßen, dürfen wir
        offline nehmen. Die Rechte an Ihren Inhalten und Ihrer Domain bleiben bei Ihnen.
      </p>
      <p>
        <b>KI-Shots:</b> Fotos und kurze Werbeclips, die mit Hilfe künstlicher Intelligenz aus Ihren Fotos entstehen, in Anzahl und Formaten
        des gewählten Pakets (Starter, Pro oder Brand-Paket). Licht, Hintergrund und Umgebung werden neu gestaltet; Ihr Produkt soll dabei
        unverändert bleiben. Einzelne Details können trotzdem abweichen, deshalb prüfen Sie die Ergebnisse vor der Veröffentlichung. Für eine
        zutreffende Darstellung Ihres Produkts in Werbung und Shop und für eine nötige Kennzeichnung als KI-Inhalt sind Sie verantwortlich; wir
        blenden auf Wunsch einen Hinweis ein.
      </p>
      <p>
        <b>NFC-Platten:</b> Runde Platten (Ø 10 cm) mit NFC-Chip, den wir mit dem von Ihnen genannten Google-Profil verknüpfen, als Classic
        Edition (Google-Design, Weiß oder Schwarz) oder als Custom Brand Edition mit Ihrem Logo. Bei der Custom Brand Edition erhalten Sie vor
        der Produktion eine Design-Vorschau; produziert wird erst nach Ihrer Freigabe. Weil diese Platten nach Ihren Vorgaben angefertigt werden,
        besteht für sie nach § 312g Abs. 2 Nr. 1 BGB kein Widerrufsrecht. Wir schulden die Platte und die Verknüpfung, keine bestimmte Zahl oder Art von Bewertungen. Bitte beachten Sie die Richtlinien
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
        KI-Shots liefern wir je nach Paket innerhalb von 48 Stunden (Starter) oder 72 Stunden (Pro, Brand-Paket), eine Website je nach Paket innerhalb von bis zu 7 Tagen. Die Frist beginnt,
        sobald die Zahlung eingegangen ist und uns alle nötigen Unterlagen vorliegen (Fotos, Texte, Logo, Zugangsdaten). NFC-Platten versenden wir
        nach Zahlungseingang innerhalb Deutschlands; die Lieferung der Classic Edition dauert 3 bis 7 Werktage. Die Custom Brand Edition
        versenden wir innerhalb von 10 Werktagen nach Ihrer Freigabe der Design-Vorschau. Verzögerungen, die wir nicht zu vertreten haben, verlängern die Fristen
        entsprechend.
      </p>

      <h2>6. Ihre Mitwirkung</h2>
      <p>
        Sie stellen uns die benötigten Inhalte rechtzeitig zur Verfügung und versichern, dass Sie die Rechte daran haben, insbesondere an Fotos,
        Texten und Logos. Auf Fotos für KI-Shots sollen keine Personen zu erkennen sein, und Sie dürfen nur Produkte und Marken einreichen, die Sie bewerben dürfen. Werden Rechte Dritter verletzt, stellen Sie uns von
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
        Mit vollständiger Zahlung erhalten Sie das zeitlich und räumlich unbeschränkte Recht, die erstellte Website sowie die KI-Shots für Ihren
        Betrieb zu nutzen, auch in sozialen Medien, Werbeanzeigen, Onlineshops und auf Google. Wir dürfen die Arbeit als Referenz zeigen, sofern Sie nicht
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
