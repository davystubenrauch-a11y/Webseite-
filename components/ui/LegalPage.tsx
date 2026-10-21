import { LogoInline } from "@/components/brand/Logo";
import Footer from "@/components/sections/Footer";

/** Shared shell for Impressum and Datenschutz. */
export default function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-line">
        <div className="container-site flex h-20 items-center justify-between">
          <LogoInline href="/" />
          <a href="/" className="link-arrow">
            Zur Startseite
          </a>
        </div>
      </header>
      <main id="top" className="container-site py-24 sm:py-32">
        <div className="max-w-3xl">
          <h1 className="section-title">{title}</h1>
          <div className="legal mt-12">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
