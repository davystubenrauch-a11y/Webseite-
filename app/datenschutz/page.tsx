import type { Metadata } from "next";
import LegalPage from "@/components/ui/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Datenschutz | FOAV", robots: { index: false } };

// Template text. Have it reviewed and adjust it to your actual hosting and tools before going live.
export default function Datenschutz() {
  return (
    <LegalPage title="Datenschutzerklärung">
      <h2>1. Verantwortlicher</h2>
      <p>
        {site.address.map((l) => (
          <span key={l} className="block">{l}</span>
        ))}
        <span className="block">E-Mail: {site.email}</span>
      </p>
      <h2>2. Hosting und Server-Logfiles</h2>
      <p>
        Beim Aufruf dieser Website werden durch den Hosting-Anbieter automatisch Informationen (IP-Adresse, Datum und Uhrzeit, aufgerufene
        Seite, Browser) in Server-Logfiles gespeichert. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am sicheren
        Betrieb). Die Daten werden nach spätestens 14 Tagen gelöscht.
      </p>
      <h2>3. Anfrageformular</h2>
      <p>
        Wenn Sie uns über das Anfrageformular kontaktieren, verarbeiten wir Ihre Angaben (Name, Unternehmen, E-Mail, Telefon, Projektdetails)
        ausschließlich zur Bearbeitung Ihrer Anfrage und für Anschlussfragen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche
        Maßnahmen) sowie Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO. Die Daten werden gelöscht, sobald sie für den Zweck nicht mehr
        erforderlich sind und keine gesetzlichen Aufbewahrungspflichten bestehen.
      </p>
      <h2>4. Fragebogen und Foto-Upload</h2>
      <p>
        Im Website-Fragebogen und im Roomtour-Formular können Sie Angaben zu Ihrem Projekt machen und Fotos oder Ihr Logo hochladen. Die Dateien
        werden bei Vercel Blob (Vercel Inc., USA) gespeichert und sind nur über eine zufällig erzeugte, nicht öffentlich verlinkte Adresse
        erreichbar. Wir nutzen sie ausschließlich, um Ihren Auftrag zu erstellen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. Vercel ist unter
        dem EU-US Data Privacy Framework zertifiziert. Wir löschen die Dateien spätestens drei Monate nach Abschluss des Auftrags, auf Wunsch
        sofort. Bitte laden Sie keine Fotos hoch, auf denen Personen zu erkennen sind.
      </p>
      <h2>5. Schriftarten</h2>
      <p>Die verwendeten Schriftarten werden lokal von unserem Server ausgeliefert. Es findet keine Verbindung zu Servern von Google statt.</p>
      <h2>6. Cookies und Tracking</h2>
      <p>Diese Website setzt keine Tracking-Cookies und keine Analyse-Tools ein.</p>
      <h2>7. Ihre Rechte</h2>
      <p>
        Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie Widerspruch
        (Art. 15–21 DSGVO) und können eine erteilte Einwilligung jederzeit widerrufen. Zudem besteht ein Beschwerderecht bei einer
        Datenschutz-Aufsichtsbehörde, z. B. dem Bayerischen Landesamt für Datenschutzaufsicht.
      </p>
    </LegalPage>
  );
}
