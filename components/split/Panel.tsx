import Reveal from "@/components/ui/Reveal";
import { sections } from "./sections";

/** One content block of the right column, headed by its index number and title. */
export default function Panel({
  id,
  title,
  lead,
  children,
  className = "",
}: {
  id: (typeof sections)[number]["id"];
  title: React.ReactNode;
  lead?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const index = sections.findIndex((s) => s.id === id) + 1;
  const label = sections[index - 1].label;
  return (
    <section id={id} className={`border-t border-line px-5 py-20 sm:px-8 lg:px-12 lg:py-28 xl:px-16 ${className}`}>
      <Reveal className="max-w-2xl">
        <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-ink-faint">
          <span className="text-sage">{String(index).padStart(2, "0")}</span>
          <span className="h-px w-6 bg-line" />
          {label}
        </p>
        <h2 className="section-title mt-5">{title}</h2>
        {lead && <p className="mt-5 text-base leading-relaxed text-ink-muted sm:text-lg">{lead}</p>}
      </Reveal>
      <div className="mt-12 lg:mt-16">{children}</div>
    </section>
  );
}
