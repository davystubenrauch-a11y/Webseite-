import { LogoInline } from "@/components/brand/Logo";
import Footer from "@/components/sections/Footer";

/** Shared shell for Impressum and Datenschutz. */
export default function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-slate-200 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-4xl items-center justify-between px-4 sm:px-6">
          <LogoInline href="/" />
          <a href="/" className="text-sm text-slate-600 transition hover:text-brand">← Zur Startseite</a>
        </div>
      </header>
      <main id="top" className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <h1 className="section-title">{title}</h1>
        <div className="legal mt-12">{children}</div>
      </main>
      <Footer />
    </>
  );
}
