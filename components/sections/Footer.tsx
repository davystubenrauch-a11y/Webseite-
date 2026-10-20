import Logo from "@/components/ui/Logo";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm text-white/50">
            Smart review cards, high-converting websites and immersive Airbnb walkthroughs for businesses that refuse
            to look ordinary.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-white/60 md:items-end">
          <a href={`mailto:${site.contactEmail}`} className="font-serif text-2xl text-white transition hover:text-gold">
            {site.contactEmail}
          </a>
          <p>© {new Date().getFullYear()} f&amp;d solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
